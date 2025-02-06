// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type {
  ProxySettings,
} from "../interfaces.js";
import { logger } from "../log.js";
import type { PipelinePolicy } from "../pipeline.js";
import { __proxyPolicy, __proxyPolicyName, __getDefaultProxySettings } from "@typespec/ts-http-runtime/_internal";

/**
 * The programmatic identifier of the proxyPolicy.
 */
export const proxyPolicyName = __proxyPolicyName;

export function getDefaultProxySettings(proxyUrl?: string): ProxySettings | undefined {
  return __getDefaultProxySettings(proxyUrl);
}

/**
 * A policy that allows one to apply proxy settings to all requests.
 * If not passed static settings, they will be retrieved from the HTTPS_PROXY
 * or HTTP_PROXY environment variables.
 * @param proxySettings - ProxySettings to use on each request.
 * @param options - additional settings, for example, custom NO_PROXY patterns
 */
export function proxyPolicy(
  proxySettings?: ProxySettings,
  options?: {
    /** a list of patterns to override those loaded from NO_PROXY environment variable. */
    customNoProxyList?: string[];
  },
): PipelinePolicy {
  return __proxyPolicy(proxySettings, options, { logger });
}
