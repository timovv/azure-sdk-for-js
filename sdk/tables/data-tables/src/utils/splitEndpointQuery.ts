// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Splits a URL into a base URL (without query string) and the query string.
 * This is needed because @azure-rest/core-client appends path segments after
 * the query string when the base URL contains query params (e.g. SAS tokens),
 * producing malformed URLs like `https://host/?sas=token/Tables`.
 */
export function splitEndpointQuery(url: string): { baseUrl: string; sasQuery: string } {
  const qIndex = url.indexOf("?");
  if (qIndex === -1) {
    return { baseUrl: url, sasQuery: "" };
  }
  return {
    baseUrl: url.substring(0, qIndex),
    sasQuery: url.substring(qIndex + 1),
  };
}
