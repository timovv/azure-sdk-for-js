/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { SnapshotPolicies } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { NetAppManagementClient } from "../netAppManagementClient.js";
import {
  SimplePollerLike,
  OperationState,
  createHttpPoller,
} from "@azure/core-lro";
import { createLroSpec } from "../lroImpl.js";
import {
  SnapshotPolicy,
  SnapshotPoliciesListOptionalParams,
  SnapshotPoliciesListResponse,
  SnapshotPoliciesGetOptionalParams,
  SnapshotPoliciesGetResponse,
  SnapshotPoliciesCreateOptionalParams,
  SnapshotPoliciesCreateResponse,
  SnapshotPolicyPatch,
  SnapshotPoliciesUpdateOptionalParams,
  SnapshotPoliciesUpdateResponse,
  SnapshotPoliciesDeleteOptionalParams,
  SnapshotPoliciesListVolumesOptionalParams,
  SnapshotPoliciesListVolumesResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing SnapshotPolicies operations. */
export class SnapshotPoliciesImpl implements SnapshotPolicies {
  private readonly client: NetAppManagementClient;

  /**
   * Initialize a new instance of the class SnapshotPolicies class.
   * @param client Reference to the service client
   */
  constructor(client: NetAppManagementClient) {
    this.client = client;
  }

  /**
   * List snapshot policy
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param accountName The name of the NetApp account
   * @param options The options parameters.
   */
  public list(
    resourceGroupName: string,
    accountName: string,
    options?: SnapshotPoliciesListOptionalParams,
  ): PagedAsyncIterableIterator<SnapshotPolicy> {
    const iter = this.listPagingAll(resourceGroupName, accountName, options);
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
        return this.listPagingPage(
          resourceGroupName,
          accountName,
          options,
          settings,
        );
      },
    };
  }

  private async *listPagingPage(
    resourceGroupName: string,
    accountName: string,
    options?: SnapshotPoliciesListOptionalParams,
    _settings?: PageSettings,
  ): AsyncIterableIterator<SnapshotPolicy[]> {
    let result: SnapshotPoliciesListResponse;
    result = await this._list(resourceGroupName, accountName, options);
    yield result.value || [];
  }

  private async *listPagingAll(
    resourceGroupName: string,
    accountName: string,
    options?: SnapshotPoliciesListOptionalParams,
  ): AsyncIterableIterator<SnapshotPolicy> {
    for await (const page of this.listPagingPage(
      resourceGroupName,
      accountName,
      options,
    )) {
      yield* page;
    }
  }

  /**
   * List snapshot policy
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param accountName The name of the NetApp account
   * @param options The options parameters.
   */
  private _list(
    resourceGroupName: string,
    accountName: string,
    options?: SnapshotPoliciesListOptionalParams,
  ): Promise<SnapshotPoliciesListResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, accountName, options },
      listOperationSpec,
    );
  }

  /**
   * Get a snapshot Policy
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param accountName The name of the NetApp account
   * @param snapshotPolicyName The name of the snapshot policy
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    accountName: string,
    snapshotPolicyName: string,
    options?: SnapshotPoliciesGetOptionalParams,
  ): Promise<SnapshotPoliciesGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, accountName, snapshotPolicyName, options },
      getOperationSpec,
    );
  }

  /**
   * Create a snapshot policy
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param accountName The name of the NetApp account
   * @param snapshotPolicyName The name of the snapshot policy
   * @param body Snapshot policy object supplied in the body of the operation.
   * @param options The options parameters.
   */
  create(
    resourceGroupName: string,
    accountName: string,
    snapshotPolicyName: string,
    body: SnapshotPolicy,
    options?: SnapshotPoliciesCreateOptionalParams,
  ): Promise<SnapshotPoliciesCreateResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, accountName, snapshotPolicyName, body, options },
      createOperationSpec,
    );
  }

  /**
   * Patch a snapshot policy
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param accountName The name of the NetApp account
   * @param snapshotPolicyName The name of the snapshot policy
   * @param body Snapshot policy object supplied in the body of the operation.
   * @param options The options parameters.
   */
  async beginUpdate(
    resourceGroupName: string,
    accountName: string,
    snapshotPolicyName: string,
    body: SnapshotPolicyPatch,
    options?: SnapshotPoliciesUpdateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<SnapshotPoliciesUpdateResponse>,
      SnapshotPoliciesUpdateResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec,
    ): Promise<SnapshotPoliciesUpdateResponse> => {
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
      args: {
        resourceGroupName,
        accountName,
        snapshotPolicyName,
        body,
        options,
      },
      spec: updateOperationSpec,
    });
    const poller = await createHttpPoller<
      SnapshotPoliciesUpdateResponse,
      OperationState<SnapshotPoliciesUpdateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location",
    });
    await poller.poll();
    return poller;
  }

  /**
   * Patch a snapshot policy
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param accountName The name of the NetApp account
   * @param snapshotPolicyName The name of the snapshot policy
   * @param body Snapshot policy object supplied in the body of the operation.
   * @param options The options parameters.
   */
  async beginUpdateAndWait(
    resourceGroupName: string,
    accountName: string,
    snapshotPolicyName: string,
    body: SnapshotPolicyPatch,
    options?: SnapshotPoliciesUpdateOptionalParams,
  ): Promise<SnapshotPoliciesUpdateResponse> {
    const poller = await this.beginUpdate(
      resourceGroupName,
      accountName,
      snapshotPolicyName,
      body,
      options,
    );
    return poller.pollUntilDone();
  }

  /**
   * Delete snapshot policy
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param accountName The name of the NetApp account
   * @param snapshotPolicyName The name of the snapshot policy
   * @param options The options parameters.
   */
  async beginDelete(
    resourceGroupName: string,
    accountName: string,
    snapshotPolicyName: string,
    options?: SnapshotPoliciesDeleteOptionalParams,
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
      args: { resourceGroupName, accountName, snapshotPolicyName, options },
      spec: deleteOperationSpec,
    });
    const poller = await createHttpPoller<void, OperationState<void>>(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location",
    });
    await poller.poll();
    return poller;
  }

  /**
   * Delete snapshot policy
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param accountName The name of the NetApp account
   * @param snapshotPolicyName The name of the snapshot policy
   * @param options The options parameters.
   */
  async beginDeleteAndWait(
    resourceGroupName: string,
    accountName: string,
    snapshotPolicyName: string,
    options?: SnapshotPoliciesDeleteOptionalParams,
  ): Promise<void> {
    const poller = await this.beginDelete(
      resourceGroupName,
      accountName,
      snapshotPolicyName,
      options,
    );
    return poller.pollUntilDone();
  }

  /**
   * Get volumes associated with snapshot policy
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param accountName The name of the NetApp account
   * @param snapshotPolicyName The name of the snapshot policy
   * @param options The options parameters.
   */
  listVolumes(
    resourceGroupName: string,
    accountName: string,
    snapshotPolicyName: string,
    options?: SnapshotPoliciesListVolumesOptionalParams,
  ): Promise<SnapshotPoliciesListVolumesResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, accountName, snapshotPolicyName, options },
      listVolumesOperationSpec,
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/snapshotPolicies",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.SnapshotPoliciesList,
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
    Parameters.accountName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const getOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/snapshotPolicies/{snapshotPolicyName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.SnapshotPolicy,
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
    Parameters.accountName,
    Parameters.snapshotPolicyName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const createOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/snapshotPolicies/{snapshotPolicyName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.SnapshotPolicy,
    },
    201: {
      bodyMapper: Mappers.SnapshotPolicy,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  requestBody: Parameters.body25,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.accountName,
    Parameters.snapshotPolicyName,
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer,
};
const updateOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/snapshotPolicies/{snapshotPolicyName}",
  httpMethod: "PATCH",
  responses: {
    200: {
      bodyMapper: Mappers.SnapshotPolicy,
    },
    201: {
      bodyMapper: Mappers.SnapshotPolicy,
    },
    202: {
      bodyMapper: Mappers.SnapshotPolicy,
    },
    204: {
      bodyMapper: Mappers.SnapshotPolicy,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  requestBody: Parameters.body26,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.accountName,
    Parameters.snapshotPolicyName,
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer,
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/snapshotPolicies/{snapshotPolicyName}",
  httpMethod: "DELETE",
  responses: {
    200: {},
    201: {},
    202: {},
    204: {},
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.accountName,
    Parameters.snapshotPolicyName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const listVolumesOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/snapshotPolicies/{snapshotPolicyName}/volumes",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.SnapshotPolicyVolumeList,
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
    Parameters.accountName,
    Parameters.snapshotPolicyName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
