/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper.js";
import { ClassicAdministrators } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { AuthorizationManagementClient } from "../authorizationManagementClient.js";
import {
  ClassicAdministrator,
  ClassicAdministratorsListNextOptionalParams,
  ClassicAdministratorsListOptionalParams,
  ClassicAdministratorsListResponse,
  ClassicAdministratorsListNextResponse
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing ClassicAdministrators operations. */
export class ClassicAdministratorsImpl implements ClassicAdministrators {
  private readonly client: AuthorizationManagementClient;

  /**
   * Initialize a new instance of the class ClassicAdministrators class.
   * @param client Reference to the service client
   */
  constructor(client: AuthorizationManagementClient) {
    this.client = client;
  }

  /**
   * Gets service administrator, account administrator, and co-administrators for the subscription.
   * @param options The options parameters.
   */
  public list(
    options?: ClassicAdministratorsListOptionalParams
  ): PagedAsyncIterableIterator<ClassicAdministrator> {
    const iter = this.listPagingAll(options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listPagingPage(options, settings);
      }
    };
  }

  private async *listPagingPage(
    options?: ClassicAdministratorsListOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<ClassicAdministrator[]> {
    let result: ClassicAdministratorsListResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._list(options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listNext(continuationToken, options);
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listPagingAll(
    options?: ClassicAdministratorsListOptionalParams
  ): AsyncIterableIterator<ClassicAdministrator> {
    for await (const page of this.listPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * Gets service administrator, account administrator, and co-administrators for the subscription.
   * @param options The options parameters.
   */
  private _list(
    options?: ClassicAdministratorsListOptionalParams
  ): Promise<ClassicAdministratorsListResponse> {
    return this.client.sendOperationRequest({ options }, listOperationSpec);
  }

  /**
   * ListNext
   * @param nextLink The nextLink from the previous successful call to the List method.
   * @param options The options parameters.
   */
  private _listNext(
    nextLink: string,
    options?: ClassicAdministratorsListNextOptionalParams
  ): Promise<ClassicAdministratorsListNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/classicAdministrators",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ClassicAdministratorListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.subscriptionId],
  headerParameters: [Parameters.accept],
  serializer
};
const listNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ClassicAdministratorListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.nextLink
  ],
  headerParameters: [Parameters.accept],
  serializer
};
