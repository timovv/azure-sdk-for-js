// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { __createDefaultHttpClient } from "@typespec/ts-http-runtime/_internal";
import type { HttpClient } from "./interfaces.js";

/**
 * Create the correct HttpClient for the current environment.
 */
export function createDefaultHttpClient(): HttpClient {
  return __createDefaultHttpClient();
}
