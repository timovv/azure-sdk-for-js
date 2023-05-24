/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper";
import { Jobs } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { ContainerAppsAPIClient } from "../containerAppsAPIClient";
import {
  SimplePollerLike,
  OperationState,
  createHttpPoller
} from "@azure/core-lro";
import { createLroSpec } from "../lroImpl";
import {
  Job,
  JobsListBySubscriptionNextOptionalParams,
  JobsListBySubscriptionOptionalParams,
  JobsListBySubscriptionResponse,
  JobsListByResourceGroupNextOptionalParams,
  JobsListByResourceGroupOptionalParams,
  JobsListByResourceGroupResponse,
  JobsGetOptionalParams,
  JobsGetResponse,
  JobsCreateOrUpdateOptionalParams,
  JobsCreateOrUpdateResponse,
  JobsDeleteOptionalParams,
  JobPatchProperties,
  JobsUpdateOptionalParams,
  JobsUpdateResponse,
  JobExecutionTemplate,
  JobsStartOptionalParams,
  JobsStartResponse,
  JobsStopExecutionOptionalParams,
  JobExecutionNamesCollection,
  JobsStopMultipleExecutionsOptionalParams,
  JobsStopMultipleExecutionsResponse,
  JobsListSecretsOptionalParams,
  JobsListSecretsResponse,
  JobsListBySubscriptionNextResponse,
  JobsListByResourceGroupNextResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class containing Jobs operations. */
export class JobsImpl implements Jobs {
  private readonly client: ContainerAppsAPIClient;

  /**
   * Initialize a new instance of the class Jobs class.
   * @param client Reference to the service client
   */
  constructor(client: ContainerAppsAPIClient) {
    this.client = client;
  }

  /**
   * Get the Container Apps Jobs in a given subscription.
   * @param options The options parameters.
   */
  public listBySubscription(
    options?: JobsListBySubscriptionOptionalParams
  ): PagedAsyncIterableIterator<Job> {
    const iter = this.listBySubscriptionPagingAll(options);
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
        return this.listBySubscriptionPagingPage(options, settings);
      }
    };
  }

  private async *listBySubscriptionPagingPage(
    options?: JobsListBySubscriptionOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<Job[]> {
    let result: JobsListBySubscriptionResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listBySubscription(options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listBySubscriptionNext(continuationToken, options);
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listBySubscriptionPagingAll(
    options?: JobsListBySubscriptionOptionalParams
  ): AsyncIterableIterator<Job> {
    for await (const page of this.listBySubscriptionPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * Get the Container Apps Jobs in a given resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  public listByResourceGroup(
    resourceGroupName: string,
    options?: JobsListByResourceGroupOptionalParams
  ): PagedAsyncIterableIterator<Job> {
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
          settings
        );
      }
    };
  }

  private async *listByResourceGroupPagingPage(
    resourceGroupName: string,
    options?: JobsListByResourceGroupOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<Job[]> {
    let result: JobsListByResourceGroupResponse;
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
        options
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listByResourceGroupPagingAll(
    resourceGroupName: string,
    options?: JobsListByResourceGroupOptionalParams
  ): AsyncIterableIterator<Job> {
    for await (const page of this.listByResourceGroupPagingPage(
      resourceGroupName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * Get the Container Apps Jobs in a given subscription.
   * @param options The options parameters.
   */
  private _listBySubscription(
    options?: JobsListBySubscriptionOptionalParams
  ): Promise<JobsListBySubscriptionResponse> {
    return this.client.sendOperationRequest(
      { options },
      listBySubscriptionOperationSpec
    );
  }

  /**
   * Get the Container Apps Jobs in a given resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  private _listByResourceGroup(
    resourceGroupName: string,
    options?: JobsListByResourceGroupOptionalParams
  ): Promise<JobsListByResourceGroupResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, options },
      listByResourceGroupOperationSpec
    );
  }

  /**
   * Get the properties of a Container Apps Job.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    jobName: string,
    options?: JobsGetOptionalParams
  ): Promise<JobsGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, jobName, options },
      getOperationSpec
    );
  }

  /**
   * Create or Update a Container Apps Job.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param jobEnvelope Properties used to create a container apps job
   * @param options The options parameters.
   */
  async beginCreateOrUpdate(
    resourceGroupName: string,
    jobName: string,
    jobEnvelope: Job,
    options?: JobsCreateOrUpdateOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<JobsCreateOrUpdateResponse>,
      JobsCreateOrUpdateResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<JobsCreateOrUpdateResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, jobName, jobEnvelope, options },
      spec: createOrUpdateOperationSpec
    });
    const poller = await createHttpPoller<
      JobsCreateOrUpdateResponse,
      OperationState<JobsCreateOrUpdateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "azure-async-operation"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Create or Update a Container Apps Job.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param jobEnvelope Properties used to create a container apps job
   * @param options The options parameters.
   */
  async beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    jobName: string,
    jobEnvelope: Job,
    options?: JobsCreateOrUpdateOptionalParams
  ): Promise<JobsCreateOrUpdateResponse> {
    const poller = await this.beginCreateOrUpdate(
      resourceGroupName,
      jobName,
      jobEnvelope,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Delete a Container Apps Job.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param options The options parameters.
   */
  async beginDelete(
    resourceGroupName: string,
    jobName: string,
    options?: JobsDeleteOptionalParams
  ): Promise<SimplePollerLike<OperationState<void>, void>> {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<void> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, jobName, options },
      spec: deleteOperationSpec
    });
    const poller = await createHttpPoller<void, OperationState<void>>(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Delete a Container Apps Job.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param options The options parameters.
   */
  async beginDeleteAndWait(
    resourceGroupName: string,
    jobName: string,
    options?: JobsDeleteOptionalParams
  ): Promise<void> {
    const poller = await this.beginDelete(resourceGroupName, jobName, options);
    return poller.pollUntilDone();
  }

  /**
   * Patches a Container Apps Job using JSON Merge Patch
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param jobEnvelope Properties used to create a container apps job
   * @param options The options parameters.
   */
  async beginUpdate(
    resourceGroupName: string,
    jobName: string,
    jobEnvelope: JobPatchProperties,
    options?: JobsUpdateOptionalParams
  ): Promise<
    SimplePollerLike<OperationState<JobsUpdateResponse>, JobsUpdateResponse>
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<JobsUpdateResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, jobName, jobEnvelope, options },
      spec: updateOperationSpec
    });
    const poller = await createHttpPoller<
      JobsUpdateResponse,
      OperationState<JobsUpdateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs
    });
    await poller.poll();
    return poller;
  }

  /**
   * Patches a Container Apps Job using JSON Merge Patch
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param jobEnvelope Properties used to create a container apps job
   * @param options The options parameters.
   */
  async beginUpdateAndWait(
    resourceGroupName: string,
    jobName: string,
    jobEnvelope: JobPatchProperties,
    options?: JobsUpdateOptionalParams
  ): Promise<JobsUpdateResponse> {
    const poller = await this.beginUpdate(
      resourceGroupName,
      jobName,
      jobEnvelope,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Start a Container Apps Job
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param template Properties used to start a job instance.
   * @param options The options parameters.
   */
  async beginStart(
    resourceGroupName: string,
    jobName: string,
    template: JobExecutionTemplate,
    options?: JobsStartOptionalParams
  ): Promise<
    SimplePollerLike<OperationState<JobsStartResponse>, JobsStartResponse>
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<JobsStartResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, jobName, template, options },
      spec: startOperationSpec
    });
    const poller = await createHttpPoller<
      JobsStartResponse,
      OperationState<JobsStartResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Start a Container Apps Job
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param template Properties used to start a job instance.
   * @param options The options parameters.
   */
  async beginStartAndWait(
    resourceGroupName: string,
    jobName: string,
    template: JobExecutionTemplate,
    options?: JobsStartOptionalParams
  ): Promise<JobsStartResponse> {
    const poller = await this.beginStart(
      resourceGroupName,
      jobName,
      template,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Terminates execution of a running container apps job
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param jobExecutionName Job execution name.
   * @param options The options parameters.
   */
  async beginStopExecution(
    resourceGroupName: string,
    jobName: string,
    jobExecutionName: string,
    options?: JobsStopExecutionOptionalParams
  ): Promise<SimplePollerLike<OperationState<void>, void>> {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<void> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, jobName, jobExecutionName, options },
      spec: stopExecutionOperationSpec
    });
    const poller = await createHttpPoller<void, OperationState<void>>(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Terminates execution of a running container apps job
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param jobExecutionName Job execution name.
   * @param options The options parameters.
   */
  async beginStopExecutionAndWait(
    resourceGroupName: string,
    jobName: string,
    jobExecutionName: string,
    options?: JobsStopExecutionOptionalParams
  ): Promise<void> {
    const poller = await this.beginStopExecution(
      resourceGroupName,
      jobName,
      jobExecutionName,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Terminates execution of a running container apps job
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param jobExecutionName List of all job executions that should be stopped.
   * @param options The options parameters.
   */
  async beginStopMultipleExecutions(
    resourceGroupName: string,
    jobName: string,
    jobExecutionName: JobExecutionNamesCollection,
    options?: JobsStopMultipleExecutionsOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<JobsStopMultipleExecutionsResponse>,
      JobsStopMultipleExecutionsResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<JobsStopMultipleExecutionsResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, jobName, jobExecutionName, options },
      spec: stopMultipleExecutionsOperationSpec
    });
    const poller = await createHttpPoller<
      JobsStopMultipleExecutionsResponse,
      OperationState<JobsStopMultipleExecutionsResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Terminates execution of a running container apps job
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param jobExecutionName List of all job executions that should be stopped.
   * @param options The options parameters.
   */
  async beginStopMultipleExecutionsAndWait(
    resourceGroupName: string,
    jobName: string,
    jobExecutionName: JobExecutionNamesCollection,
    options?: JobsStopMultipleExecutionsOptionalParams
  ): Promise<JobsStopMultipleExecutionsResponse> {
    const poller = await this.beginStopMultipleExecutions(
      resourceGroupName,
      jobName,
      jobExecutionName,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * List secrets for a container apps job
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param jobName Name of the Container Apps Job.
   * @param options The options parameters.
   */
  listSecrets(
    resourceGroupName: string,
    jobName: string,
    options?: JobsListSecretsOptionalParams
  ): Promise<JobsListSecretsResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, jobName, options },
      listSecretsOperationSpec
    );
  }

  /**
   * ListBySubscriptionNext
   * @param nextLink The nextLink from the previous successful call to the ListBySubscription method.
   * @param options The options parameters.
   */
  private _listBySubscriptionNext(
    nextLink: string,
    options?: JobsListBySubscriptionNextOptionalParams
  ): Promise<JobsListBySubscriptionNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listBySubscriptionNextOperationSpec
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
    options?: JobsListByResourceGroupNextOptionalParams
  ): Promise<JobsListByResourceGroupNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, nextLink, options },
      listByResourceGroupNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listBySubscriptionOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/providers/Microsoft.App/jobs",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.JobsCollection
    },
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.subscriptionId],
  headerParameters: [Parameters.accept],
  serializer
};
const listByResourceGroupOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/jobs",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.JobsCollection
    },
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/jobs/{jobName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.Job
    },
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.jobName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const createOrUpdateOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/jobs/{jobName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.Job
    },
    201: {
      bodyMapper: Mappers.Job
    },
    202: {
      bodyMapper: Mappers.Job
    },
    204: {
      bodyMapper: Mappers.Job
    },
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  requestBody: Parameters.jobEnvelope,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.jobName1
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/jobs/{jobName}",
  httpMethod: "DELETE",
  responses: {
    200: {},
    201: {},
    202: {},
    204: {},
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.jobName1
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const updateOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/jobs/{jobName}",
  httpMethod: "PATCH",
  responses: {
    200: {
      bodyMapper: Mappers.Job
    },
    201: {
      bodyMapper: Mappers.Job
    },
    202: {
      bodyMapper: Mappers.Job
    },
    204: {
      bodyMapper: Mappers.Job
    },
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  requestBody: Parameters.jobEnvelope1,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.jobName1
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const startOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/jobs/{jobName}/start",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: Mappers.JobExecutionBase
    },
    201: {
      bodyMapper: Mappers.JobExecutionBase
    },
    202: {
      bodyMapper: Mappers.JobExecutionBase
    },
    204: {
      bodyMapper: Mappers.JobExecutionBase
    },
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  requestBody: Parameters.template,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.jobName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const stopExecutionOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/jobs/{jobName}/executions/{jobExecutionName}/stop",
  httpMethod: "POST",
  responses: {
    200: {},
    201: {},
    202: {},
    204: {},
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.jobName,
    Parameters.jobExecutionName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const stopMultipleExecutionsOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/jobs/{jobName}/stop",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: Mappers.ContainerAppJobExecutions
    },
    201: {
      bodyMapper: Mappers.ContainerAppJobExecutions
    },
    202: {
      bodyMapper: Mappers.ContainerAppJobExecutions
    },
    204: {
      bodyMapper: Mappers.ContainerAppJobExecutions
    },
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  requestBody: Parameters.jobExecutionName1,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.jobName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const listSecretsOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/jobs/{jobName}/listSecrets",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: Mappers.JobSecretsCollection
    },
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.jobName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listBySubscriptionNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.JobsCollection
    },
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
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
const listByResourceGroupNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.JobsCollection
    },
    default: {
      bodyMapper: Mappers.DefaultErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.nextLink
  ],
  headerParameters: [Parameters.accept],
  serializer
};