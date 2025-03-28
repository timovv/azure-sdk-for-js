/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper.js";
import { FirewallStatus } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { PaloAltoNetworksCloudngfw } from "../paloAltoNetworksCloudngfw.js";
import {
  FirewallStatusResource,
  FirewallStatusListByFirewallsNextOptionalParams,
  FirewallStatusListByFirewallsOptionalParams,
  FirewallStatusListByFirewallsResponse,
  FirewallStatusGetOptionalParams,
  FirewallStatusGetResponse,
  FirewallStatusListByFirewallsNextResponse
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing FirewallStatus operations. */
export class FirewallStatusImpl implements FirewallStatus {
  private readonly client: PaloAltoNetworksCloudngfw;

  /**
   * Initialize a new instance of the class FirewallStatus class.
   * @param client Reference to the service client
   */
  constructor(client: PaloAltoNetworksCloudngfw) {
    this.client = client;
  }

  /**
   * List FirewallStatusResource resources by Firewalls
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param firewallName Firewall resource name
   * @param options The options parameters.
   */
  public listByFirewalls(
    resourceGroupName: string,
    firewallName: string,
    options?: FirewallStatusListByFirewallsOptionalParams
  ): PagedAsyncIterableIterator<FirewallStatusResource> {
    const iter = this.listByFirewallsPagingAll(
      resourceGroupName,
      firewallName,
      options
    );
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
        return this.listByFirewallsPagingPage(
          resourceGroupName,
          firewallName,
          options,
          settings
        );
      }
    };
  }

  private async *listByFirewallsPagingPage(
    resourceGroupName: string,
    firewallName: string,
    options?: FirewallStatusListByFirewallsOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<FirewallStatusResource[]> {
    let result: FirewallStatusListByFirewallsResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listByFirewalls(
        resourceGroupName,
        firewallName,
        options
      );
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listByFirewallsNext(
        resourceGroupName,
        firewallName,
        continuationToken,
        options
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listByFirewallsPagingAll(
    resourceGroupName: string,
    firewallName: string,
    options?: FirewallStatusListByFirewallsOptionalParams
  ): AsyncIterableIterator<FirewallStatusResource> {
    for await (const page of this.listByFirewallsPagingPage(
      resourceGroupName,
      firewallName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * List FirewallStatusResource resources by Firewalls
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param firewallName Firewall resource name
   * @param options The options parameters.
   */
  private _listByFirewalls(
    resourceGroupName: string,
    firewallName: string,
    options?: FirewallStatusListByFirewallsOptionalParams
  ): Promise<FirewallStatusListByFirewallsResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, firewallName, options },
      listByFirewallsOperationSpec
    );
  }

  /**
   * Get a FirewallStatusResource
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param firewallName Firewall resource name
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    firewallName: string,
    options?: FirewallStatusGetOptionalParams
  ): Promise<FirewallStatusGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, firewallName, options },
      getOperationSpec
    );
  }

  /**
   * ListByFirewallsNext
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param firewallName Firewall resource name
   * @param nextLink The nextLink from the previous successful call to the ListByFirewalls method.
   * @param options The options parameters.
   */
  private _listByFirewallsNext(
    resourceGroupName: string,
    firewallName: string,
    nextLink: string,
    options?: FirewallStatusListByFirewallsNextOptionalParams
  ): Promise<FirewallStatusListByFirewallsNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, firewallName, nextLink, options },
      listByFirewallsNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listByFirewallsOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/PaloAltoNetworks.Cloudngfw/firewalls/{firewallName}/statuses",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.FirewallStatusResourceListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.firewallName1
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/PaloAltoNetworks.Cloudngfw/firewalls/{firewallName}/statuses/default",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.FirewallStatusResource
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.firewallName1
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listByFirewallsNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.FirewallStatusResourceListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.nextLink,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.firewallName1
  ],
  headerParameters: [Parameters.accept],
  serializer
};
