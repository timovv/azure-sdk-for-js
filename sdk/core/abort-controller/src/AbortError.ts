// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { __AbortError } from "@typespec/ts-http-runtime/_internal/abort-controller";

/**
 * This error is thrown when an asynchronous operation has been aborted.
 * Check for this error by testing the `name` that the name property of the
 * error matches `"AbortError"`.
 *
 * @example
 * ```ts snippet:abort_error
 * import { AbortError } from "@azure/abort-controller";
 *
 * async function doAsyncWork(options: { abortSignal: AbortSignal }): Promise<void> {
 *   if (options.abortSignal.aborted) {
 *     throw new AbortError();
 *   }
 *   // do async work
 * }
 * const controller = new AbortController();
 * controller.abort();
 * try {
 *   doAsyncWork({ abortSignal: controller.signal });
 * } catch (e) {
 *   if (e instanceof Error && e.name === "AbortError") {
 *     // handle abort error here.
 *   }
 * }
 * ```
 */
export interface AbortErrorConstructor {
  /**
   * Construct a new AbortError
   */
  new(message?: string): AbortError;
}

/**
 * This error is thrown when an asynchronous operation has been aborted.
 * Check for this error by testing the `name` that the name property of the
 * error matches `"AbortError"`.
 *
 * @example
 * ```ts snippet:abort_error
 * import { AbortError } from "@azure/abort-controller";
 *
 * async function doAsyncWork(options: { abortSignal: AbortSignal }): Promise<void> {
 *   if (options.abortSignal.aborted) {
 *     throw new AbortError();
 *   }
 *   // do async work
 * }
 * const controller = new AbortController();
 * controller.abort();
 * try {
 *   doAsyncWork({ abortSignal: controller.signal });
 * } catch (e) {
 *   if (e instanceof Error && e.name === "AbortError") {
 *     // handle abort error here.
 *   }
 * }
 * ```
 */
export interface AbortError extends Error {}

/**
 * This error is thrown when an asynchronous operation has been aborted.
 * Check for this error by testing the `name` that the name property of the
 * error matches `"AbortError"`.
 *
 * @example
 * ```ts snippet:abort_error
 * import { AbortError } from "@azure/abort-controller";
 *
 * async function doAsyncWork(options: { abortSignal: AbortSignal }): Promise<void> {
 *   if (options.abortSignal.aborted) {
 *     throw new AbortError();
 *   }
 *   // do async work
 * }
 * const controller = new AbortController();
 * controller.abort();
 * try {
 *   doAsyncWork({ abortSignal: controller.signal });
 * } catch (e) {
 *   if (e instanceof Error && e.name === "AbortError") {
 *     // handle abort error here.
 *   }
 * }
 * ```
 */
export const AbortError: AbortErrorConstructor = __AbortError;
