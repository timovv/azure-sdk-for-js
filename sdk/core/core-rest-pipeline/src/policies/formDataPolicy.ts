// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { PipelinePolicy } from "../pipeline.js";
import { __formDataPolicy, __formDataPolicyName } from "@typespec/ts-http-runtime/_internal";

/**
 * The programmatic identifier of the formDataPolicy.
 */
export const formDataPolicyName = __formDataPolicyName;

/**
 * A policy that encodes FormData on the request into the body.
 */
export function formDataPolicy(): PipelinePolicy {
  return __formDataPolicy();
}
