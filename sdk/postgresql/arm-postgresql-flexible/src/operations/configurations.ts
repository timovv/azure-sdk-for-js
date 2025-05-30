/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import type { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper.js";
import type { Configurations } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import type { PostgreSQLManagementFlexibleServerClient } from "../postgreSQLManagementFlexibleServerClient.js";
import type { SimplePollerLike, OperationState } from "@azure/core-lro";
import { createHttpPoller } from "@azure/core-lro";
import { createLroSpec } from "../lroImpl.js";
import type {
  Configuration,
  ConfigurationsListByServerNextOptionalParams,
  ConfigurationsListByServerOptionalParams,
  ConfigurationsListByServerResponse,
  ConfigurationsGetOptionalParams,
  ConfigurationsGetResponse,
  ConfigurationForUpdate,
  ConfigurationsUpdateOptionalParams,
  ConfigurationsUpdateResponse,
  ConfigurationsPutOptionalParams,
  ConfigurationsPutResponse,
  ConfigurationsListByServerNextResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing Configurations operations. */
export class ConfigurationsImpl implements Configurations {
  private readonly client: PostgreSQLManagementFlexibleServerClient;

  /**
   * Initialize a new instance of the class Configurations class.
   * @param client Reference to the service client
   */
  constructor(client: PostgreSQLManagementFlexibleServerClient) {
    this.client = client;
  }

  /**
   * List all the configurations in a given server.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param options The options parameters.
   */
  public listByServer(
    resourceGroupName: string,
    serverName: string,
    options?: ConfigurationsListByServerOptionalParams,
  ): PagedAsyncIterableIterator<Configuration> {
    const iter = this.listByServerPagingAll(resourceGroupName, serverName, options);
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
        return this.listByServerPagingPage(resourceGroupName, serverName, options, settings);
      },
    };
  }

  private async *listByServerPagingPage(
    resourceGroupName: string,
    serverName: string,
    options?: ConfigurationsListByServerOptionalParams,
    settings?: PageSettings,
  ): AsyncIterableIterator<Configuration[]> {
    let result: ConfigurationsListByServerResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listByServer(resourceGroupName, serverName, options);
      const page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listByServerNext(
        resourceGroupName,
        serverName,
        continuationToken,
        options,
      );
      continuationToken = result.nextLink;
      const page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listByServerPagingAll(
    resourceGroupName: string,
    serverName: string,
    options?: ConfigurationsListByServerOptionalParams,
  ): AsyncIterableIterator<Configuration> {
    for await (const page of this.listByServerPagingPage(resourceGroupName, serverName, options)) {
      yield* page;
    }
  }

  /**
   * List all the configurations in a given server.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param options The options parameters.
   */
  private _listByServer(
    resourceGroupName: string,
    serverName: string,
    options?: ConfigurationsListByServerOptionalParams,
  ): Promise<ConfigurationsListByServerResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, serverName, options },
      listByServerOperationSpec,
    );
  }

  /**
   * Gets information about a configuration of server.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param configurationName The name of the server configuration.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    serverName: string,
    configurationName: string,
    options?: ConfigurationsGetOptionalParams,
  ): Promise<ConfigurationsGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, serverName, configurationName, options },
      getOperationSpec,
    );
  }

  /**
   * Updates a configuration of a server.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param configurationName The name of the server configuration.
   * @param parameters The required parameters for updating a server configuration.
   * @param options The options parameters.
   */
  async beginUpdate(
    resourceGroupName: string,
    serverName: string,
    configurationName: string,
    parameters: ConfigurationForUpdate,
    options?: ConfigurationsUpdateOptionalParams,
  ): Promise<
    SimplePollerLike<OperationState<ConfigurationsUpdateResponse>, ConfigurationsUpdateResponse>
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ): Promise<ConfigurationsUpdateResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ) => {
      let currentRawResponse: coreClient.FullOperationResponse | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown,
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback,
        },
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON(),
        },
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: {
        resourceGroupName,
        serverName,
        configurationName,
        parameters,
        options,
      },
      spec: updateOperationSpec,
    });
    const poller = await createHttpPoller<
      ConfigurationsUpdateResponse,
      OperationState<ConfigurationsUpdateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "azure-async-operation",
    });
    await poller.poll();
    return poller;
  }

  /**
   * Updates a configuration of a server.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param configurationName The name of the server configuration.
   * @param parameters The required parameters for updating a server configuration.
   * @param options The options parameters.
   */
  async beginUpdateAndWait(
    resourceGroupName: string,
    serverName: string,
    configurationName: string,
    parameters: ConfigurationForUpdate,
    options?: ConfigurationsUpdateOptionalParams,
  ): Promise<ConfigurationsUpdateResponse> {
    const poller = await this.beginUpdate(
      resourceGroupName,
      serverName,
      configurationName,
      parameters,
      options,
    );
    return poller.pollUntilDone();
  }

  /**
   * Updates a configuration of a server.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param configurationName The name of the server configuration.
   * @param parameters The required parameters for updating a server configuration.
   * @param options The options parameters.
   */
  async beginPut(
    resourceGroupName: string,
    serverName: string,
    configurationName: string,
    parameters: Configuration,
    options?: ConfigurationsPutOptionalParams,
  ): Promise<
    SimplePollerLike<OperationState<ConfigurationsPutResponse>, ConfigurationsPutResponse>
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ): Promise<ConfigurationsPutResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ) => {
      let currentRawResponse: coreClient.FullOperationResponse | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown,
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback,
        },
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON(),
        },
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: {
        resourceGroupName,
        serverName,
        configurationName,
        parameters,
        options,
      },
      spec: putOperationSpec,
    });
    const poller = await createHttpPoller<
      ConfigurationsPutResponse,
      OperationState<ConfigurationsPutResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location",
    });
    await poller.poll();
    return poller;
  }

  /**
   * Updates a configuration of a server.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param configurationName The name of the server configuration.
   * @param parameters The required parameters for updating a server configuration.
   * @param options The options parameters.
   */
  async beginPutAndWait(
    resourceGroupName: string,
    serverName: string,
    configurationName: string,
    parameters: Configuration,
    options?: ConfigurationsPutOptionalParams,
  ): Promise<ConfigurationsPutResponse> {
    const poller = await this.beginPut(
      resourceGroupName,
      serverName,
      configurationName,
      parameters,
      options,
    );
    return poller.pollUntilDone();
  }

  /**
   * ListByServerNext
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param nextLink The nextLink from the previous successful call to the ListByServer method.
   * @param options The options parameters.
   */
  private _listByServerNext(
    resourceGroupName: string,
    serverName: string,
    nextLink: string,
    options?: ConfigurationsListByServerNextOptionalParams,
  ): Promise<ConfigurationsListByServerNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, serverName, nextLink, options },
      listByServerNextOperationSpec,
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listByServerOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/flexibleServers/{serverName}/configurations",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ConfigurationListResult,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.serverName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const getOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/flexibleServers/{serverName}/configurations/{configurationName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.Configuration,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.serverName,
    Parameters.configurationName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const updateOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/flexibleServers/{serverName}/configurations/{configurationName}",
  httpMethod: "PATCH",
  responses: {
    200: {
      bodyMapper: Mappers.Configuration,
    },
    201: {
      bodyMapper: Mappers.Configuration,
    },
    202: {
      bodyMapper: Mappers.Configuration,
    },
    204: {
      bodyMapper: Mappers.Configuration,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  requestBody: Parameters.parameters1,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.serverName,
    Parameters.configurationName,
  ],
  headerParameters: [Parameters.contentType, Parameters.accept],
  mediaType: "json",
  serializer,
};
const putOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/flexibleServers/{serverName}/configurations/{configurationName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.Configuration,
    },
    201: {
      bodyMapper: Mappers.Configuration,
    },
    202: {
      bodyMapper: Mappers.Configuration,
    },
    204: {
      bodyMapper: Mappers.Configuration,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  requestBody: Parameters.parameters2,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.serverName,
    Parameters.configurationName,
  ],
  headerParameters: [Parameters.contentType, Parameters.accept],
  mediaType: "json",
  serializer,
};
const listByServerNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ConfigurationListResult,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.serverName,
    Parameters.nextLink,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
