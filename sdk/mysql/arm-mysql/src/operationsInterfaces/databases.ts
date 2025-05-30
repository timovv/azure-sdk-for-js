/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import { PollerLike, PollOperationState } from "@azure/core-lro";
import {
  Database,
  DatabasesListByServerOptionalParams,
  DatabasesCreateOrUpdateOptionalParams,
  DatabasesCreateOrUpdateResponse,
  DatabasesDeleteOptionalParams,
  DatabasesGetOptionalParams,
  DatabasesGetResponse
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a Databases. */
export interface Databases {
  /**
   * List all the databases in a given server.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param options The options parameters.
   */
  listByServer(
    resourceGroupName: string,
    serverName: string,
    options?: DatabasesListByServerOptionalParams
  ): PagedAsyncIterableIterator<Database>;
  /**
   * Creates a new database or updates an existing database.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param databaseName The name of the database.
   * @param parameters The required parameters for creating or updating a database.
   * @param options The options parameters.
   */
  beginCreateOrUpdate(
    resourceGroupName: string,
    serverName: string,
    databaseName: string,
    parameters: Database,
    options?: DatabasesCreateOrUpdateOptionalParams
  ): Promise<
    PollerLike<
      PollOperationState<DatabasesCreateOrUpdateResponse>,
      DatabasesCreateOrUpdateResponse
    >
  >;
  /**
   * Creates a new database or updates an existing database.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param databaseName The name of the database.
   * @param parameters The required parameters for creating or updating a database.
   * @param options The options parameters.
   */
  beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    serverName: string,
    databaseName: string,
    parameters: Database,
    options?: DatabasesCreateOrUpdateOptionalParams
  ): Promise<DatabasesCreateOrUpdateResponse>;
  /**
   * Deletes a database.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param databaseName The name of the database.
   * @param options The options parameters.
   */
  beginDelete(
    resourceGroupName: string,
    serverName: string,
    databaseName: string,
    options?: DatabasesDeleteOptionalParams
  ): Promise<PollerLike<PollOperationState<void>, void>>;
  /**
   * Deletes a database.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param databaseName The name of the database.
   * @param options The options parameters.
   */
  beginDeleteAndWait(
    resourceGroupName: string,
    serverName: string,
    databaseName: string,
    options?: DatabasesDeleteOptionalParams
  ): Promise<void>;
  /**
   * Gets information about a database.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param serverName The name of the server.
   * @param databaseName The name of the database.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    serverName: string,
    databaseName: string,
    options?: DatabasesGetOptionalParams
  ): Promise<DatabasesGetResponse>;
}
