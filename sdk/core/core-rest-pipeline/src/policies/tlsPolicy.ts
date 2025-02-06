// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { PipelinePolicy } from "../pipeline.js";
import type { TlsSettings } from "../interfaces.js";
import { __tlsPolicy, __tlsPolicyName } from "@typespec/ts-http-runtime/_internal";

/**
 * Name of the TLS Policy
 */
export const tlsPolicyName = __tlsPolicyName;

/**
 * Gets a pipeline policy that adds the client certificate to the HttpClient agent for authentication.
 */
export function tlsPolicy(tlsSettings?: TlsSettings): PipelinePolicy {
  return __tlsPolicy(tlsSettings);
}
