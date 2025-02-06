// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { Debugger } from "./debug.js";
export { Debugger } from "./debug.js";

/**
 * The log levels supported by the logger.
 * The log levels in order of most verbose to least verbose are:
 * - verbose
 * - info
 * - warning
 * - error
 */
export type TypeSpecRuntimeLogLevel = "verbose" | "info" | "warning" | "error";

/**
 * A TypeSpecRuntimeClientLogger is a function that can log to an appropriate severity level.
 */
export type TypeSpecRuntimeClientLogger = Debugger;

/**
 * Defines the methods available on the SDK-facing logger.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface TypeSpecRuntimeLogger {
  /**
   * Used for failures the program is unlikely to recover from,
   * such as Out of Memory.
   */
  error: Debugger;
  /**
   * Used when a function fails to perform its intended task.
   * Usually this means the function will throw an exception.
   * Not used for self-healing events (e.g. automatic retry)
   */
  warning: Debugger;
  /**
   * Used when a function operates normally.
   */
  info: Debugger;
  /**
   * Used for detailed troubleshooting scenarios. This is
   * intended for use by developers / system administrators
   * for diagnosing specific failures.
   */
  verbose: Debugger;
}
