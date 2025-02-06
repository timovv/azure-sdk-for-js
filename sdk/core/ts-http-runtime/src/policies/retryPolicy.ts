// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { PipelineRequest, PipelineResponse, SendRequest } from "../interfaces.js";
import type { PipelinePolicy } from "../pipeline.js";
import { delay } from "../util/helpers.js";
import type { RetryInformation, RetryModifiers, RetryStrategy } from "../retryStrategies/retryStrategy.js";
import type { RestError } from "../restError.js";
import { AbortError } from "../abort-controller/AbortError.js";
import type { TypeSpecRuntimeLogger } from "../logger/index.js";
import { createClientLogger } from "../logger/logger.js";
import { DEFAULT_RETRY_POLICY_COUNT } from "../constants.js";

const retryPolicyLogger = createClientLogger("core-rest-pipeline retryPolicy");

/**
 * The programmatic identifier of the retryPolicy.
 */
const retryPolicyName = "retryPolicy";

/**
 * Options to the {@link retryPolicy}
 */
export interface RetryPolicyOptions {
  /**
   * Maximum number of retries. If not specified, it will limit to 3 retries.
   */
  maxRetries?: number;
  /**
   * Logger. If it's not provided, a default logger is used.
   */
  logger?: TypeSpecRuntimeLogger;
}

export interface __RetryPolicyDependencies {
  retryPolicyLogger: TypeSpecRuntimeLogger
}

/**
 * retryPolicy is a generic policy to enable retrying requests when certain conditions are met
 */
export function retryPolicy(
  strategies: RetryStrategy[],
  options: RetryPolicyOptions = { maxRetries: DEFAULT_RETRY_POLICY_COUNT },
): PipelinePolicy {
  return __retryPolicy(strategies, options, { retryPolicyLogger });
}

// Redeclare these interfaces for internal use to broaden the allowed types of error

/**
 * Information provided to the retry strategy about the current progress of the retry policy.
 */
export interface __RetryInformationLike extends Omit<RetryInformation, "responseError"> {
  /**
   * A {@link RestError}, if the last retry attempt failed.
   */
  responseError?: Error;
}

/**
 * Properties that can modify the behavior of the retry policy.
 */
export interface __RetryModifiersLike extends Omit<RetryModifiers, "errorToThrow"> {
  /**
   * Indicates to throw this error instead of retrying.
   */
  errorToThrow?: Error;
}

export interface __RetryStrategyLike extends Omit<RetryStrategy, "retry"> {
  /**
   * Function that determines how to proceed with the subsequent requests.
   * @param state - Retry state
   */
  retry(state: __RetryInformationLike): __RetryModifiersLike;
}

export function __retryPolicy(
  strategies: __RetryStrategyLike[],
  options: RetryPolicyOptions,
  __dependencies: __RetryPolicyDependencies,
): PipelinePolicy {
  const logger = options.logger || __dependencies.retryPolicyLogger;
  return {
    name: retryPolicyName,
    async sendRequest(request: PipelineRequest, next: SendRequest): Promise<PipelineResponse> {
      let response: PipelineResponse | undefined;
      let responseError: RestError | undefined;
      let retryCount = -1;

      retryRequest: while (true) {
        retryCount += 1;
        response = undefined;
        responseError = undefined;

        try {
          logger.info(`Retry ${retryCount}: Attempting to send request`, request.requestId);
          response = await next(request);
          logger.info(`Retry ${retryCount}: Received a response from request`, request.requestId);
        } catch (e: any) {
          logger.error(`Retry ${retryCount}: Received an error from request`, request.requestId);

          // RestErrors are valid targets for the retry strategies.
          // If none of the retry strategies can work with them, they will be thrown later in this policy.
          // If the received error is not a RestError, it is immediately thrown.
          responseError = e as RestError;
          if (!e || responseError.name !== "RestError") {
            throw e;
          }

          response = responseError.response;
        }

        if (request.abortSignal?.aborted) {
          logger.error(`Retry ${retryCount}: Request aborted.`);
          const abortError = new AbortError();
          throw abortError;
        }

        if (retryCount >= (options.maxRetries ?? DEFAULT_RETRY_POLICY_COUNT)) {
          logger.info(
            `Retry ${retryCount}: Maximum retries reached. Returning the last received response, or throwing the last received error.`,
          );
          if (responseError) {
            throw responseError;
          } else if (response) {
            return response;
          } else {
            throw new Error("Maximum retries reached with no response or error to throw");
          }
        }

        logger.info(`Retry ${retryCount}: Processing ${strategies.length} retry strategies.`);

        strategiesLoop: for (const strategy of strategies) {
          const strategyLogger = strategy.logger || retryPolicyLogger;
          strategyLogger.info(`Retry ${retryCount}: Processing retry strategy ${strategy.name}.`);

          const modifiers = strategy.retry({
            retryCount,
            response,
            responseError,
          });

          if (modifiers.skipStrategy) {
            strategyLogger.info(`Retry ${retryCount}: Skipped.`);
            continue strategiesLoop;
          }

          const { errorToThrow, retryAfterInMs, redirectTo } = modifiers;

          if (errorToThrow) {
            strategyLogger.error(
              `Retry ${retryCount}: Retry strategy ${strategy.name} throws error:`,
              errorToThrow,
            );
            throw errorToThrow;
          }

          if (retryAfterInMs || retryAfterInMs === 0) {
            strategyLogger.info(
              `Retry ${retryCount}: Retry strategy ${strategy.name} retries after ${retryAfterInMs}`,
            );
            await delay(retryAfterInMs, undefined, { abortSignal: request.abortSignal });
            continue retryRequest;
          }

          if (redirectTo) {
            strategyLogger.info(
              `Retry ${retryCount}: Retry strategy ${strategy.name} redirects to ${redirectTo}`,
            );
            request.url = redirectTo;
            continue retryRequest;
          }
        }

        if (responseError) {
          logger.info(
            `None of the retry strategies could work with the received error. Throwing it.`,
          );
          throw responseError;
        }
        if (response) {
          logger.info(
            `None of the retry strategies could work with the received response. Returning it.`,
          );
          return response;
        }

        // If all the retries skip and there's no response,
        // we're still in the retry loop, so a new request will be sent
        // until `maxRetries` is reached.
      }
    },
  };
}
