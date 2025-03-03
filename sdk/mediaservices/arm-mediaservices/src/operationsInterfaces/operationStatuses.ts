/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  OperationStatusesGetOptionalParams,
  OperationStatusesGetResponse
} from "../models/index.js";

/** Interface representing a OperationStatuses. */
export interface OperationStatuses {
  /**
   * Get asset track operation status.
   * @param resourceGroupName The name of the resource group within the Azure subscription.
   * @param accountName The Media Services account name.
   * @param assetName The Asset name.
   * @param trackName The Asset Track name.
   * @param operationId Operation Id.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    accountName: string,
    assetName: string,
    trackName: string,
    operationId: string,
    options?: OperationStatusesGetOptionalParams
  ): Promise<OperationStatusesGetResponse>;
}
