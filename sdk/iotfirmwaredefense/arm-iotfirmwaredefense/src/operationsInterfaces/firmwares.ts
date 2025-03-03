/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import {
  Firmware,
  FirmwaresListByWorkspaceOptionalParams,
  FirmwaresCreateOptionalParams,
  FirmwaresCreateResponse,
  FirmwareUpdateDefinition,
  FirmwaresUpdateOptionalParams,
  FirmwaresUpdateResponse,
  FirmwaresDeleteOptionalParams,
  FirmwaresGetOptionalParams,
  FirmwaresGetResponse,
  FirmwaresGenerateDownloadUrlOptionalParams,
  FirmwaresGenerateDownloadUrlResponse,
  FirmwaresGenerateFilesystemDownloadUrlOptionalParams,
  FirmwaresGenerateFilesystemDownloadUrlResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a Firmwares. */
export interface Firmwares {
  /**
   * Lists all of firmwares inside a workspace.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the firmware analysis workspace.
   * @param options The options parameters.
   */
  listByWorkspace(
    resourceGroupName: string,
    workspaceName: string,
    options?: FirmwaresListByWorkspaceOptionalParams,
  ): PagedAsyncIterableIterator<Firmware>;
  /**
   * The operation to create a firmware.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the firmware analysis workspace.
   * @param firmwareId The id of the firmware.
   * @param firmware Details of the firmware being created or updated.
   * @param options The options parameters.
   */
  create(
    resourceGroupName: string,
    workspaceName: string,
    firmwareId: string,
    firmware: Firmware,
    options?: FirmwaresCreateOptionalParams,
  ): Promise<FirmwaresCreateResponse>;
  /**
   * The operation to update firmware.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the firmware analysis workspace.
   * @param firmwareId The id of the firmware.
   * @param firmware Details of the firmware being created or updated.
   * @param options The options parameters.
   */
  update(
    resourceGroupName: string,
    workspaceName: string,
    firmwareId: string,
    firmware: FirmwareUpdateDefinition,
    options?: FirmwaresUpdateOptionalParams,
  ): Promise<FirmwaresUpdateResponse>;
  /**
   * The operation to delete a firmware.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the firmware analysis workspace.
   * @param firmwareId The id of the firmware.
   * @param options The options parameters.
   */
  delete(
    resourceGroupName: string,
    workspaceName: string,
    firmwareId: string,
    options?: FirmwaresDeleteOptionalParams,
  ): Promise<void>;
  /**
   * Get firmware.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the firmware analysis workspace.
   * @param firmwareId The id of the firmware.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    workspaceName: string,
    firmwareId: string,
    options?: FirmwaresGetOptionalParams,
  ): Promise<FirmwaresGetResponse>;
  /**
   * The operation to a url for file download.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the firmware analysis workspace.
   * @param firmwareId The id of the firmware.
   * @param options The options parameters.
   */
  generateDownloadUrl(
    resourceGroupName: string,
    workspaceName: string,
    firmwareId: string,
    options?: FirmwaresGenerateDownloadUrlOptionalParams,
  ): Promise<FirmwaresGenerateDownloadUrlResponse>;
  /**
   * The operation to a url for tar file download.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the firmware analysis workspace.
   * @param firmwareId The id of the firmware.
   * @param options The options parameters.
   */
  generateFilesystemDownloadUrl(
    resourceGroupName: string,
    workspaceName: string,
    firmwareId: string,
    options?: FirmwaresGenerateFilesystemDownloadUrlOptionalParams,
  ): Promise<FirmwaresGenerateFilesystemDownloadUrlResponse>;
}
