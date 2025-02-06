// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { __createHttpHeaders } from "@typespec/ts-http-runtime/_internal";
import type { HttpHeaders, RawHttpHeadersInput } from "./interfaces.js";

/**
 * Creates an object that satisfies the `HttpHeaders` interface.
 * @param rawHeaders - A simple object representing initial headers
 */
export function createHttpHeaders(rawHeaders?: RawHttpHeadersInput): HttpHeaders {
  return __createHttpHeaders(rawHeaders);
}
