// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { __decompressResponsePolicy, __decompressResponsePolicyName } from "@typespec/ts-http-runtime/_internal";
import type { PipelinePolicy } from "../pipeline.js";

/**
 * The programmatic identifier of the decompressResponsePolicy.
 */
export const decompressResponsePolicyName = __decompressResponsePolicyName;

/**
 * A policy to enable response decompression according to Accept-Encoding header
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
 */
export function decompressResponsePolicy(): PipelinePolicy {
  return __decompressResponsePolicy();
}
