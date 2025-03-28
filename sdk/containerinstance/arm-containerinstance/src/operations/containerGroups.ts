/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper.js";
import { ContainerGroups } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { ContainerInstanceManagementClient } from "../containerInstanceManagementClient.js";
import {
  SimplePollerLike,
  OperationState,
  createHttpPoller,
} from "@azure/core-lro";
import { createLroSpec } from "../lroImpl.js";
import {
  ContainerGroup,
  ContainerGroupsListNextOptionalParams,
  ContainerGroupsListOptionalParams,
  ContainerGroupsListResponse,
  ContainerGroupsListByResourceGroupNextOptionalParams,
  ContainerGroupsListByResourceGroupOptionalParams,
  ContainerGroupsListByResourceGroupResponse,
  ContainerGroupsGetOptionalParams,
  ContainerGroupsGetResponse,
  ContainerGroupsCreateOrUpdateOptionalParams,
  ContainerGroupsCreateOrUpdateResponse,
  Resource,
  ContainerGroupsUpdateOptionalParams,
  ContainerGroupsUpdateResponse,
  ContainerGroupsDeleteOptionalParams,
  ContainerGroupsDeleteResponse,
  ContainerGroupsRestartOptionalParams,
  ContainerGroupsStopOptionalParams,
  ContainerGroupsStartOptionalParams,
  ContainerGroupsGetOutboundNetworkDependenciesEndpointsOptionalParams,
  ContainerGroupsGetOutboundNetworkDependenciesEndpointsResponse,
  ContainerGroupsListNextResponse,
  ContainerGroupsListByResourceGroupNextResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing ContainerGroups operations. */
export class ContainerGroupsImpl implements ContainerGroups {
  private readonly client: ContainerInstanceManagementClient;

  /**
   * Initialize a new instance of the class ContainerGroups class.
   * @param client Reference to the service client
   */
  constructor(client: ContainerInstanceManagementClient) {
    this.client = client;
  }

  /**
   * Get a list of container groups in the specified subscription. This operation returns properties of
   * each container group including containers, image registry credentials, restart policy, IP address
   * type, OS type, state, and volumes.
   * @param options The options parameters.
   */
  public list(
    options?: ContainerGroupsListOptionalParams,
  ): PagedAsyncIterableIterator<ContainerGroup> {
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
      },
    };
  }

  private async *listPagingPage(
    options?: ContainerGroupsListOptionalParams,
    settings?: PageSettings,
  ): AsyncIterableIterator<ContainerGroup[]> {
    let result: ContainerGroupsListResponse;
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
    options?: ContainerGroupsListOptionalParams,
  ): AsyncIterableIterator<ContainerGroup> {
    for await (const page of this.listPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * Get a list of container groups in a specified subscription and resource group. This operation
   * returns properties of each container group including containers, image registry credentials, restart
   * policy, IP address type, OS type, state, and volumes.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  public listByResourceGroup(
    resourceGroupName: string,
    options?: ContainerGroupsListByResourceGroupOptionalParams,
  ): PagedAsyncIterableIterator<ContainerGroup> {
    const iter = this.listByResourceGroupPagingAll(resourceGroupName, options);
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
        return this.listByResourceGroupPagingPage(
          resourceGroupName,
          options,
          settings,
        );
      },
    };
  }

  private async *listByResourceGroupPagingPage(
    resourceGroupName: string,
    options?: ContainerGroupsListByResourceGroupOptionalParams,
    settings?: PageSettings,
  ): AsyncIterableIterator<ContainerGroup[]> {
    let result: ContainerGroupsListByResourceGroupResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listByResourceGroup(resourceGroupName, options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listByResourceGroupNext(
        resourceGroupName,
        continuationToken,
        options,
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listByResourceGroupPagingAll(
    resourceGroupName: string,
    options?: ContainerGroupsListByResourceGroupOptionalParams,
  ): AsyncIterableIterator<ContainerGroup> {
    for await (const page of this.listByResourceGroupPagingPage(
      resourceGroupName,
      options,
    )) {
      yield* page;
    }
  }

  /**
   * Get a list of container groups in the specified subscription. This operation returns properties of
   * each container group including containers, image registry credentials, restart policy, IP address
   * type, OS type, state, and volumes.
   * @param options The options parameters.
   */
  private _list(
    options?: ContainerGroupsListOptionalParams,
  ): Promise<ContainerGroupsListResponse> {
    return this.client.sendOperationRequest({ options }, listOperationSpec);
  }

  /**
   * Get a list of container groups in a specified subscription and resource group. This operation
   * returns properties of each container group including containers, image registry credentials, restart
   * policy, IP address type, OS type, state, and volumes.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  private _listByResourceGroup(
    resourceGroupName: string,
    options?: ContainerGroupsListByResourceGroupOptionalParams,
  ): Promise<ContainerGroupsListByResourceGroupResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, options },
      listByResourceGroupOperationSpec,
    );
  }

  /**
   * Gets the properties of the specified container group in the specified subscription and resource
   * group. The operation returns the properties of each container group including containers, image
   * registry credentials, restart policy, IP address type, OS type, state, and volumes.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    containerGroupName: string,
    options?: ContainerGroupsGetOptionalParams,
  ): Promise<ContainerGroupsGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, containerGroupName, options },
      getOperationSpec,
    );
  }

  /**
   * Create or update container groups with specified configurations.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param containerGroup The properties of the container group to be created or updated.
   * @param options The options parameters.
   */
  async beginCreateOrUpdate(
    resourceGroupName: string,
    containerGroupName: string,
    containerGroup: ContainerGroup,
    options?: ContainerGroupsCreateOrUpdateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<ContainerGroupsCreateOrUpdateResponse>,
      ContainerGroupsCreateOrUpdateResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ): Promise<ContainerGroupsCreateOrUpdateResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ) => {
      let currentRawResponse: coreClient.FullOperationResponse | undefined =
        undefined;
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
      args: { resourceGroupName, containerGroupName, containerGroup, options },
      spec: createOrUpdateOperationSpec,
    });
    const poller = await createHttpPoller<
      ContainerGroupsCreateOrUpdateResponse,
      OperationState<ContainerGroupsCreateOrUpdateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
    });
    await poller.poll();
    return poller;
  }

  /**
   * Create or update container groups with specified configurations.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param containerGroup The properties of the container group to be created or updated.
   * @param options The options parameters.
   */
  async beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    containerGroupName: string,
    containerGroup: ContainerGroup,
    options?: ContainerGroupsCreateOrUpdateOptionalParams,
  ): Promise<ContainerGroupsCreateOrUpdateResponse> {
    const poller = await this.beginCreateOrUpdate(
      resourceGroupName,
      containerGroupName,
      containerGroup,
      options,
    );
    return poller.pollUntilDone();
  }

  /**
   * Updates container group tags with specified values.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param resource The container group resource with just the tags to be updated.
   * @param options The options parameters.
   */
  update(
    resourceGroupName: string,
    containerGroupName: string,
    resource: Resource,
    options?: ContainerGroupsUpdateOptionalParams,
  ): Promise<ContainerGroupsUpdateResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, containerGroupName, resource, options },
      updateOperationSpec,
    );
  }

  /**
   * Delete the specified container group in the specified subscription and resource group. The operation
   * does not delete other resources provided by the user, such as volumes.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param options The options parameters.
   */
  async beginDelete(
    resourceGroupName: string,
    containerGroupName: string,
    options?: ContainerGroupsDeleteOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<ContainerGroupsDeleteResponse>,
      ContainerGroupsDeleteResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ): Promise<ContainerGroupsDeleteResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ) => {
      let currentRawResponse: coreClient.FullOperationResponse | undefined =
        undefined;
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
      args: { resourceGroupName, containerGroupName, options },
      spec: deleteOperationSpec,
    });
    const poller = await createHttpPoller<
      ContainerGroupsDeleteResponse,
      OperationState<ContainerGroupsDeleteResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
    });
    await poller.poll();
    return poller;
  }

  /**
   * Delete the specified container group in the specified subscription and resource group. The operation
   * does not delete other resources provided by the user, such as volumes.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param options The options parameters.
   */
  async beginDeleteAndWait(
    resourceGroupName: string,
    containerGroupName: string,
    options?: ContainerGroupsDeleteOptionalParams,
  ): Promise<ContainerGroupsDeleteResponse> {
    const poller = await this.beginDelete(
      resourceGroupName,
      containerGroupName,
      options,
    );
    return poller.pollUntilDone();
  }

  /**
   * Restarts all containers in a container group in place. If container image has updates, new image
   * will be downloaded.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param options The options parameters.
   */
  async beginRestart(
    resourceGroupName: string,
    containerGroupName: string,
    options?: ContainerGroupsRestartOptionalParams,
  ): Promise<SimplePollerLike<OperationState<void>, void>> {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ): Promise<void> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ) => {
      let currentRawResponse: coreClient.FullOperationResponse | undefined =
        undefined;
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
      args: { resourceGroupName, containerGroupName, options },
      spec: restartOperationSpec,
    });
    const poller = await createHttpPoller<void, OperationState<void>>(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
    });
    await poller.poll();
    return poller;
  }

  /**
   * Restarts all containers in a container group in place. If container image has updates, new image
   * will be downloaded.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param options The options parameters.
   */
  async beginRestartAndWait(
    resourceGroupName: string,
    containerGroupName: string,
    options?: ContainerGroupsRestartOptionalParams,
  ): Promise<void> {
    const poller = await this.beginRestart(
      resourceGroupName,
      containerGroupName,
      options,
    );
    return poller.pollUntilDone();
  }

  /**
   * Stops all containers in a container group. Compute resources will be deallocated and billing will
   * stop.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param options The options parameters.
   */
  stop(
    resourceGroupName: string,
    containerGroupName: string,
    options?: ContainerGroupsStopOptionalParams,
  ): Promise<void> {
    return this.client.sendOperationRequest(
      { resourceGroupName, containerGroupName, options },
      stopOperationSpec,
    );
  }

  /**
   * Starts all containers in a container group. Compute resources will be allocated and billing will
   * start.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param options The options parameters.
   */
  async beginStart(
    resourceGroupName: string,
    containerGroupName: string,
    options?: ContainerGroupsStartOptionalParams,
  ): Promise<SimplePollerLike<OperationState<void>, void>> {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ): Promise<void> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ) => {
      let currentRawResponse: coreClient.FullOperationResponse | undefined =
        undefined;
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
      args: { resourceGroupName, containerGroupName, options },
      spec: startOperationSpec,
    });
    const poller = await createHttpPoller<void, OperationState<void>>(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
    });
    await poller.poll();
    return poller;
  }

  /**
   * Starts all containers in a container group. Compute resources will be allocated and billing will
   * start.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param options The options parameters.
   */
  async beginStartAndWait(
    resourceGroupName: string,
    containerGroupName: string,
    options?: ContainerGroupsStartOptionalParams,
  ): Promise<void> {
    const poller = await this.beginStart(
      resourceGroupName,
      containerGroupName,
      options,
    );
    return poller.pollUntilDone();
  }

  /**
   * Gets all the network dependencies for this container group to allow complete control of network
   * setting and configuration. For container groups, this will always be an empty list.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param containerGroupName The name of the container group.
   * @param options The options parameters.
   */
  getOutboundNetworkDependenciesEndpoints(
    resourceGroupName: string,
    containerGroupName: string,
    options?: ContainerGroupsGetOutboundNetworkDependenciesEndpointsOptionalParams,
  ): Promise<ContainerGroupsGetOutboundNetworkDependenciesEndpointsResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, containerGroupName, options },
      getOutboundNetworkDependenciesEndpointsOperationSpec,
    );
  }

  /**
   * ListNext
   * @param nextLink The nextLink from the previous successful call to the List method.
   * @param options The options parameters.
   */
  private _listNext(
    nextLink: string,
    options?: ContainerGroupsListNextOptionalParams,
  ): Promise<ContainerGroupsListNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listNextOperationSpec,
    );
  }

  /**
   * ListByResourceGroupNext
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param nextLink The nextLink from the previous successful call to the ListByResourceGroup method.
   * @param options The options parameters.
   */
  private _listByResourceGroupNext(
    resourceGroupName: string,
    nextLink: string,
    options?: ContainerGroupsListByResourceGroupNextOptionalParams,
  ): Promise<ContainerGroupsListByResourceGroupNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, nextLink, options },
      listByResourceGroupNextOperationSpec,
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/providers/Microsoft.ContainerInstance/containerGroups",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ContainerGroupListResult,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.subscriptionId],
  headerParameters: [Parameters.accept],
  serializer,
};
const listByResourceGroupOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ContainerGroupListResult,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const getOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ContainerGroup,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.containerGroupName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const createOrUpdateOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.ContainerGroup,
    },
    201: {
      bodyMapper: Mappers.ContainerGroup,
    },
    202: {
      bodyMapper: Mappers.ContainerGroup,
    },
    204: {
      bodyMapper: Mappers.ContainerGroup,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  requestBody: Parameters.containerGroup,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.containerGroupName,
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer,
};
const updateOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}",
  httpMethod: "PATCH",
  responses: {
    200: {
      bodyMapper: Mappers.ContainerGroup,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  requestBody: Parameters.resource,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.containerGroupName,
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer,
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}",
  httpMethod: "DELETE",
  responses: {
    200: {
      bodyMapper: Mappers.ContainerGroup,
    },
    201: {
      bodyMapper: Mappers.ContainerGroup,
    },
    202: {
      bodyMapper: Mappers.ContainerGroup,
    },
    204: {
      bodyMapper: Mappers.ContainerGroup,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.containerGroupName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const restartOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}/restart",
  httpMethod: "POST",
  responses: {
    200: {},
    201: {},
    202: {},
    204: {},
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.containerGroupName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const stopOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}/stop",
  httpMethod: "POST",
  responses: {
    204: {},
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.containerGroupName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const startOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}/start",
  httpMethod: "POST",
  responses: {
    200: {},
    201: {},
    202: {},
    204: {},
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.containerGroupName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const getOutboundNetworkDependenciesEndpointsOperationSpec: coreClient.OperationSpec =
  {
    path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}/outboundNetworkDependenciesEndpoints",
    httpMethod: "GET",
    responses: {
      200: {
        bodyMapper: {
          type: { name: "Sequence", element: { type: { name: "String" } } },
        },
      },
      default: {
        bodyMapper: Mappers.CloudError,
      },
    },
    queryParameters: [Parameters.apiVersion],
    urlParameters: [
      Parameters.$host,
      Parameters.subscriptionId,
      Parameters.resourceGroupName,
      Parameters.containerGroupName,
    ],
    headerParameters: [Parameters.accept],
    serializer,
  };
const listNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ContainerGroupListResult,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.nextLink,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const listByResourceGroupNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ContainerGroupListResult,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.nextLink,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
