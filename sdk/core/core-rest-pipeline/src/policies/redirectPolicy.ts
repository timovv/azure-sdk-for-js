// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { __redirectPolicy, __redirectPolicyName } from "@typespec/ts-http-runtime/_internal";
import type { PipelinePolicy } from "../pipeline.js";

/**
 * The programmatic identifier of the redirectPolicy.
 */
export const redirectPolicyName = __redirectPolicyName;

/**
 * Options for how redirect responses are handled.
 */
export interface RedirectPolicyOptions {
  /**
   * The maximum number of times the redirect URL will be tried before
   * failing.  Defaults to 20.
   */
  maxRetries?: number;
}

/**
 * A policy to follow Location headers from the server in order
 * to support server-side redirection.
 * In the browser, this policy is not used.
 * @param options - Options to control policy behavior.
 */
export function redirectPolicy(options: RedirectPolicyOptions = {}): PipelinePolicy {
  return __redirectPolicy(options);
}
