/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper.js";
import { Departments } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { BillingManagementClient } from "../billingManagementClient.js";
import {
  Department,
  DepartmentsListByBillingAccountNextOptionalParams,
  DepartmentsListByBillingAccountOptionalParams,
  DepartmentsListByBillingAccountResponse,
  DepartmentsGetOptionalParams,
  DepartmentsGetResponse,
  DepartmentsListByBillingAccountNextResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing Departments operations. */
export class DepartmentsImpl implements Departments {
  private readonly client: BillingManagementClient;

  /**
   * Initialize a new instance of the class Departments class.
   * @param client Reference to the service client
   */
  constructor(client: BillingManagementClient) {
    this.client = client;
  }

  /**
   * Lists the departments that a user has access to. The operation is supported only for billing
   * accounts with agreement type Enterprise Agreement.
   * @param billingAccountName The ID that uniquely identifies a billing account.
   * @param options The options parameters.
   */
  public listByBillingAccount(
    billingAccountName: string,
    options?: DepartmentsListByBillingAccountOptionalParams,
  ): PagedAsyncIterableIterator<Department> {
    const iter = this.listByBillingAccountPagingAll(
      billingAccountName,
      options,
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
        return this.listByBillingAccountPagingPage(
          billingAccountName,
          options,
          settings,
        );
      },
    };
  }

  private async *listByBillingAccountPagingPage(
    billingAccountName: string,
    options?: DepartmentsListByBillingAccountOptionalParams,
    settings?: PageSettings,
  ): AsyncIterableIterator<Department[]> {
    let result: DepartmentsListByBillingAccountResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listByBillingAccount(billingAccountName, options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listByBillingAccountNext(
        billingAccountName,
        continuationToken,
        options,
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listByBillingAccountPagingAll(
    billingAccountName: string,
    options?: DepartmentsListByBillingAccountOptionalParams,
  ): AsyncIterableIterator<Department> {
    for await (const page of this.listByBillingAccountPagingPage(
      billingAccountName,
      options,
    )) {
      yield* page;
    }
  }

  /**
   * Gets a department by ID. The operation is supported only for billing accounts with agreement type
   * Enterprise Agreement.
   * @param billingAccountName The ID that uniquely identifies a billing account.
   * @param departmentName The name of the department.
   * @param options The options parameters.
   */
  get(
    billingAccountName: string,
    departmentName: string,
    options?: DepartmentsGetOptionalParams,
  ): Promise<DepartmentsGetResponse> {
    return this.client.sendOperationRequest(
      { billingAccountName, departmentName, options },
      getOperationSpec,
    );
  }

  /**
   * Lists the departments that a user has access to. The operation is supported only for billing
   * accounts with agreement type Enterprise Agreement.
   * @param billingAccountName The ID that uniquely identifies a billing account.
   * @param options The options parameters.
   */
  private _listByBillingAccount(
    billingAccountName: string,
    options?: DepartmentsListByBillingAccountOptionalParams,
  ): Promise<DepartmentsListByBillingAccountResponse> {
    return this.client.sendOperationRequest(
      { billingAccountName, options },
      listByBillingAccountOperationSpec,
    );
  }

  /**
   * ListByBillingAccountNext
   * @param billingAccountName The ID that uniquely identifies a billing account.
   * @param nextLink The nextLink from the previous successful call to the ListByBillingAccount method.
   * @param options The options parameters.
   */
  private _listByBillingAccountNext(
    billingAccountName: string,
    nextLink: string,
    options?: DepartmentsListByBillingAccountNextOptionalParams,
  ): Promise<DepartmentsListByBillingAccountNextResponse> {
    return this.client.sendOperationRequest(
      { billingAccountName, nextLink, options },
      listByBillingAccountNextOperationSpec,
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/departments/{departmentName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.Department,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.billingAccountName,
    Parameters.departmentName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const listByBillingAccountOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/departments",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.DepartmentListResult,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  queryParameters: [
    Parameters.apiVersion,
    Parameters.filter,
    Parameters.orderBy,
    Parameters.top,
    Parameters.skip,
    Parameters.search,
  ],
  urlParameters: [Parameters.$host, Parameters.billingAccountName],
  headerParameters: [Parameters.accept],
  serializer,
};
const listByBillingAccountNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.DepartmentListResult,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  urlParameters: [
    Parameters.$host,
    Parameters.billingAccountName,
    Parameters.nextLink,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
