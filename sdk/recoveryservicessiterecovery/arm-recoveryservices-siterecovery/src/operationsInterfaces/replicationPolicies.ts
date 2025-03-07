/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import { SimplePollerLike, OperationState } from "@azure/core-lro";
import {
  Policy,
  ReplicationPoliciesListOptionalParams,
  ReplicationPoliciesGetOptionalParams,
  ReplicationPoliciesGetResponse,
  CreatePolicyInput,
  ReplicationPoliciesCreateOptionalParams,
  ReplicationPoliciesCreateResponse,
  ReplicationPoliciesDeleteOptionalParams,
  UpdatePolicyInput,
  ReplicationPoliciesUpdateOptionalParams,
  ReplicationPoliciesUpdateResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a ReplicationPolicies. */
export interface ReplicationPolicies {
  /**
   * Lists the replication policies for a vault.
   * @param resourceName The name of the recovery services vault.
   * @param resourceGroupName The name of the resource group where the recovery services vault is
   *                          present.
   * @param options The options parameters.
   */
  list(
    resourceName: string,
    resourceGroupName: string,
    options?: ReplicationPoliciesListOptionalParams,
  ): PagedAsyncIterableIterator<Policy>;
  /**
   * Gets the details of a replication policy.
   * @param resourceName The name of the recovery services vault.
   * @param resourceGroupName The name of the resource group where the recovery services vault is
   *                          present.
   * @param policyName Replication policy name.
   * @param options The options parameters.
   */
  get(
    resourceName: string,
    resourceGroupName: string,
    policyName: string,
    options?: ReplicationPoliciesGetOptionalParams,
  ): Promise<ReplicationPoliciesGetResponse>;
  /**
   * The operation to create a replication policy.
   * @param resourceName The name of the recovery services vault.
   * @param resourceGroupName The name of the resource group where the recovery services vault is
   *                          present.
   * @param policyName Replication policy name.
   * @param input Create policy input.
   * @param options The options parameters.
   */
  beginCreate(
    resourceName: string,
    resourceGroupName: string,
    policyName: string,
    input: CreatePolicyInput,
    options?: ReplicationPoliciesCreateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<ReplicationPoliciesCreateResponse>,
      ReplicationPoliciesCreateResponse
    >
  >;
  /**
   * The operation to create a replication policy.
   * @param resourceName The name of the recovery services vault.
   * @param resourceGroupName The name of the resource group where the recovery services vault is
   *                          present.
   * @param policyName Replication policy name.
   * @param input Create policy input.
   * @param options The options parameters.
   */
  beginCreateAndWait(
    resourceName: string,
    resourceGroupName: string,
    policyName: string,
    input: CreatePolicyInput,
    options?: ReplicationPoliciesCreateOptionalParams,
  ): Promise<ReplicationPoliciesCreateResponse>;
  /**
   * The operation to delete a replication policy.
   * @param resourceName The name of the recovery services vault.
   * @param resourceGroupName The name of the resource group where the recovery services vault is
   *                          present.
   * @param policyName Replication policy name.
   * @param options The options parameters.
   */
  beginDelete(
    resourceName: string,
    resourceGroupName: string,
    policyName: string,
    options?: ReplicationPoliciesDeleteOptionalParams,
  ): Promise<SimplePollerLike<OperationState<void>, void>>;
  /**
   * The operation to delete a replication policy.
   * @param resourceName The name of the recovery services vault.
   * @param resourceGroupName The name of the resource group where the recovery services vault is
   *                          present.
   * @param policyName Replication policy name.
   * @param options The options parameters.
   */
  beginDeleteAndWait(
    resourceName: string,
    resourceGroupName: string,
    policyName: string,
    options?: ReplicationPoliciesDeleteOptionalParams,
  ): Promise<void>;
  /**
   * The operation to update a replication policy.
   * @param resourceName The name of the recovery services vault.
   * @param resourceGroupName The name of the resource group where the recovery services vault is
   *                          present.
   * @param policyName Policy Id.
   * @param input Update Policy Input.
   * @param options The options parameters.
   */
  beginUpdate(
    resourceName: string,
    resourceGroupName: string,
    policyName: string,
    input: UpdatePolicyInput,
    options?: ReplicationPoliciesUpdateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<ReplicationPoliciesUpdateResponse>,
      ReplicationPoliciesUpdateResponse
    >
  >;
  /**
   * The operation to update a replication policy.
   * @param resourceName The name of the recovery services vault.
   * @param resourceGroupName The name of the resource group where the recovery services vault is
   *                          present.
   * @param policyName Policy Id.
   * @param input Update Policy Input.
   * @param options The options parameters.
   */
  beginUpdateAndWait(
    resourceName: string,
    resourceGroupName: string,
    policyName: string,
    input: UpdatePolicyInput,
    options?: ReplicationPoliciesUpdateOptionalParams,
  ): Promise<ReplicationPoliciesUpdateResponse>;
}
