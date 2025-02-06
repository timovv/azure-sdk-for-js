// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { __multipartPolicy, __multipartPolicyName } from "@typespec/ts-http-runtime/_internal";
import { PipelinePolicy } from "../pipeline.js";

export const multipartPolicyName = __multipartPolicyName;

/**
 * Pipeline policy for multipart requests
 */
export function multipartPolicy(): PipelinePolicy {
  return __multipartPolicy();
}
