// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { PipelinePolicy } from "../pipeline.js";
import { type AzureLogger, createClientLogger } from "@azure/logger";
import type { RetryStrategy } from "../retryStrategies/retryStrategy.js";
import { DEFAULT_RETRY_POLICY_COUNT } from "../constants.js";
import { __retryPolicy } from "@typespec/ts-http-runtime/_internal";

const retryPolicyLogger = createClientLogger("core-rest-pipeline retryPolicy");

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
  logger?: AzureLogger;
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
