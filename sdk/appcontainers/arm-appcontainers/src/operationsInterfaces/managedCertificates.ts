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
  ManagedCertificate,
  ManagedCertificatesListOptionalParams,
  ManagedCertificatesGetOptionalParams,
  ManagedCertificatesGetResponse,
  ManagedCertificatesCreateOrUpdateOptionalParams,
  ManagedCertificatesCreateOrUpdateResponse,
  ManagedCertificatesDeleteOptionalParams,
  ManagedCertificatePatch,
  ManagedCertificatesUpdateOptionalParams,
  ManagedCertificatesUpdateResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a ManagedCertificates. */
export interface ManagedCertificates {
  /**
   * Get the Managed Certificates in a given managed environment.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param environmentName Name of the Managed Environment.
   * @param options The options parameters.
   */
  list(
    resourceGroupName: string,
    environmentName: string,
    options?: ManagedCertificatesListOptionalParams,
  ): PagedAsyncIterableIterator<ManagedCertificate>;
  /**
   * Get the specified Managed Certificate.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param environmentName Name of the Managed Environment.
   * @param managedCertificateName Name of the Managed Certificate.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    environmentName: string,
    managedCertificateName: string,
    options?: ManagedCertificatesGetOptionalParams,
  ): Promise<ManagedCertificatesGetResponse>;
  /**
   * Create or Update a Managed Certificate.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param environmentName Name of the Managed Environment.
   * @param managedCertificateName Name of the Managed Certificate.
   * @param options The options parameters.
   */
  beginCreateOrUpdate(
    resourceGroupName: string,
    environmentName: string,
    managedCertificateName: string,
    options?: ManagedCertificatesCreateOrUpdateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<ManagedCertificatesCreateOrUpdateResponse>,
      ManagedCertificatesCreateOrUpdateResponse
    >
  >;
  /**
   * Create or Update a Managed Certificate.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param environmentName Name of the Managed Environment.
   * @param managedCertificateName Name of the Managed Certificate.
   * @param options The options parameters.
   */
  beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    environmentName: string,
    managedCertificateName: string,
    options?: ManagedCertificatesCreateOrUpdateOptionalParams,
  ): Promise<ManagedCertificatesCreateOrUpdateResponse>;
  /**
   * Deletes the specified Managed Certificate.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param environmentName Name of the Managed Environment.
   * @param managedCertificateName Name of the Managed Certificate.
   * @param options The options parameters.
   */
  delete(
    resourceGroupName: string,
    environmentName: string,
    managedCertificateName: string,
    options?: ManagedCertificatesDeleteOptionalParams,
  ): Promise<void>;
  /**
   * Patches a managed certificate. Oly patching of tags is supported
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param environmentName Name of the Managed Environment.
   * @param managedCertificateName Name of the Managed Certificate.
   * @param managedCertificateEnvelope Properties of a managed certificate that need to be updated
   * @param options The options parameters.
   */
  update(
    resourceGroupName: string,
    environmentName: string,
    managedCertificateName: string,
    managedCertificateEnvelope: ManagedCertificatePatch,
    options?: ManagedCertificatesUpdateOptionalParams,
  ): Promise<ManagedCertificatesUpdateResponse>;
}
