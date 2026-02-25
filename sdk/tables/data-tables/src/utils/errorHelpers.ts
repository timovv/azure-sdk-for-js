// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { OperationOptions } from "@azure-rest/core-client";
import type { PipelineResponse, RestError } from "@azure/core-rest-pipeline";
import type { AzureLogger } from "@azure/logger";

export type TableServiceErrorResponse = PipelineResponse & {
  /**
   * The parsed HTTP response headers.
   */
  parsedHeaders?: Record<string, unknown>;
  /**
   * The response body as parsed JSON or XML.
   */
  parsedBody: any;
};

export function handleTableAlreadyExists(
  error: unknown,
  options: OperationOptions & { tableName?: string; logger?: AzureLogger } = {},
): void {
  const responseError = getErrorResponse(error);
  if (
    responseError &&
    responseError.status === 409 &&
    getOdataErrorCode(responseError.parsedBody) === "TableAlreadyExists"
  ) {
    options.logger?.info(`Table ${options.tableName} already Exists`);

    if (options.onResponse) {
      options.onResponse(responseError, {});
    }
  } else {
    throw error;
  }
}

function getOdataErrorCode(body: any): string | undefined {
  // New generated TableServiceError has flat code/message.
  // But the wire format has odata.error nesting. Check both patterns.
  if (body?.["odata.error"]?.code) {
    return body["odata.error"].code;
  }
  if (body?.odataError?.code) {
    return body.odataError.code;
  }
  return body?.code;
}

function getErrorResponse(error: unknown): TableServiceErrorResponse | undefined {
  if (!isRestError(error)) {
    return undefined;
  }

  const errorResponse: TableServiceErrorResponse = error.response as TableServiceErrorResponse;

  if (!errorResponse || !errorResponse.parsedBody) {
    return undefined;
  }

  return errorResponse;
}

function isRestError(error: unknown): error is RestError {
  return (error as RestError).name === "RestError";
}
