/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import {
  DenyAssignment,
  DenyAssignmentsListForResourceOptionalParams,
  DenyAssignmentsListForResourceGroupOptionalParams,
  DenyAssignmentsListOptionalParams,
  DenyAssignmentsListForScopeOptionalParams,
  DenyAssignmentsGetOptionalParams,
  DenyAssignmentsGetResponse,
  DenyAssignmentsGetByIdOptionalParams,
  DenyAssignmentsGetByIdResponse
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a DenyAssignments. */
export interface DenyAssignments {
  /**
   * Gets deny assignments for a resource.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceProviderNamespace The namespace of the resource provider.
   * @param parentResourcePath The parent resource identity.
   * @param resourceType The resource type of the resource.
   * @param resourceName The name of the resource to get deny assignments for.
   * @param options The options parameters.
   */
  listForResource(
    resourceGroupName: string,
    resourceProviderNamespace: string,
    parentResourcePath: string,
    resourceType: string,
    resourceName: string,
    options?: DenyAssignmentsListForResourceOptionalParams
  ): PagedAsyncIterableIterator<DenyAssignment>;
  /**
   * Gets deny assignments for a resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  listForResourceGroup(
    resourceGroupName: string,
    options?: DenyAssignmentsListForResourceGroupOptionalParams
  ): PagedAsyncIterableIterator<DenyAssignment>;
  /**
   * Gets all deny assignments for the subscription.
   * @param options The options parameters.
   */
  list(
    options?: DenyAssignmentsListOptionalParams
  ): PagedAsyncIterableIterator<DenyAssignment>;
  /**
   * Gets deny assignments for a scope.
   * @param scope The scope of the deny assignments.
   * @param options The options parameters.
   */
  listForScope(
    scope: string,
    options?: DenyAssignmentsListForScopeOptionalParams
  ): PagedAsyncIterableIterator<DenyAssignment>;
  /**
   * Get the specified deny assignment.
   * @param scope The scope of the deny assignment.
   * @param denyAssignmentId The ID of the deny assignment to get.
   * @param options The options parameters.
   */
  get(
    scope: string,
    denyAssignmentId: string,
    options?: DenyAssignmentsGetOptionalParams
  ): Promise<DenyAssignmentsGetResponse>;
  /**
   * Gets a deny assignment by ID.
   * @param denyAssignmentId The fully qualified deny assignment ID. For example, use the format,
   *                         /subscriptions/{guid}/providers/Microsoft.Authorization/denyAssignments/{denyAssignmentId} for
   *                         subscription level deny assignments, or
   *                         /providers/Microsoft.Authorization/denyAssignments/{denyAssignmentId} for tenant level deny
   *                         assignments.
   * @param options The options parameters.
   */
  getById(
    denyAssignmentId: string,
    options?: DenyAssignmentsGetByIdOptionalParams
  ): Promise<DenyAssignmentsGetByIdResponse>;
}
