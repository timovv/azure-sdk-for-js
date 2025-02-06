// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { __userAgentPolicy, __userAgentPolicyName } from "@typespec/ts-http-runtime/_internal";
import type { PipelinePolicy } from "../pipeline.js";

/**
 * The programmatic identifier of the userAgentPolicy.
 */
export const userAgentPolicyName = __userAgentPolicyName;

/**
 * Options for adding user agent details to outgoing requests.
 */
export interface UserAgentPolicyOptions {
  /**
   * String prefix to add to the user agent for outgoing requests.
   * Defaults to an empty string.
   */
  userAgentPrefix?: string;
}

/**
 * A policy that sets the User-Agent header (or equivalent) to reflect
 * the library version.
 * @param options - Options to customize the user agent value.
 */
export function userAgentPolicy(options: UserAgentPolicyOptions = {}): PipelinePolicy {
  // TODO add core-rest-pipeline user agent prefix
  return __userAgentPolicy(options);
}
