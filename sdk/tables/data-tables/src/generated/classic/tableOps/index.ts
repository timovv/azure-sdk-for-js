// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TablesContext } from "../../api/tablesContext.js";
import {
  setAccessPolicy,
  getAccessPolicy,
  insertEntity,
  deleteEntity,
  mergeEntity,
  updateEntity,
  queryEntitiesWithPartitionAndRowKey,
  queryEntities,
  deleteTable,
  create,
  query,
} from "../../api/tableOps/operations.js";
import {
  TableOpsSetAccessPolicyOptionalParams,
  TableOpsGetAccessPolicyOptionalParams,
  TableOpsInsertEntityOptionalParams,
  TableOpsDeleteEntityOptionalParams,
  TableOpsMergeEntityOptionalParams,
  TableOpsUpdateEntityOptionalParams,
  TableOpsQueryEntitiesWithPartitionAndRowKeyOptionalParams,
  TableOpsQueryEntitiesOptionalParams,
  TableOpsDeleteTableOptionalParams,
  TableOpsCreateOptionalParams,
  TableOpsQueryOptionalParams,
} from "../../api/tableOps/options.js";
import {
  TableQueryResponse,
  TableProperties,
  TableResponse,
  TableEntityQueryResponse,
  TableEntityProperties,
  SignedIdentifier,
} from "../../models/models.js";

/** Interface representing a TableOps operations. */
export interface TableOpsOperations {
  /** Sets stored access policies for the table that may be used with Shared Access Signatures. */
  setAccessPolicy: (
    table: string,
    options?: TableOpsSetAccessPolicyOptionalParams,
  ) => Promise<void>;
  /** Retrieves details about any stored access policies specified on the table that may be used with Shared Access Signatures. */
  getAccessPolicy: (
    table: string,
    options?: TableOpsGetAccessPolicyOptionalParams,
  ) => Promise<SignedIdentifier[]>;
  /** Insert entity in a table. */
  insertEntity: (
    table: string,
    options?: TableOpsInsertEntityOptionalParams,
  ) => Promise<TableEntityProperties>;
  /** Deletes the specified entity in a table. */
  deleteEntity: (
    table: string,
    partitionKey: string,
    rowKey: string,
    ifMatch: string,
    options?: TableOpsDeleteEntityOptionalParams,
  ) => Promise<void>;
  /** Merge entity in a table. */
  mergeEntity: (
    table: string,
    partitionKey: string,
    rowKey: string,
    options?: TableOpsMergeEntityOptionalParams,
  ) => Promise<void>;
  /** Update entity in a table. */
  updateEntity: (
    table: string,
    partitionKey: string,
    rowKey: string,
    options?: TableOpsUpdateEntityOptionalParams,
  ) => Promise<void>;
  /** Queries a single entity in a table. */
  queryEntitiesWithPartitionAndRowKey: (
    table: string,
    partitionKey: string,
    rowKey: string,
    options?: TableOpsQueryEntitiesWithPartitionAndRowKeyOptionalParams,
  ) => Promise<TableEntityProperties>;
  /** Queries entities in a table. */
  queryEntities: (
    table: string,
    options?: TableOpsQueryEntitiesOptionalParams,
  ) => Promise<TableEntityQueryResponse>;
  /** Permanently deletes the specified table. */
  deleteTable: (table: string, options?: TableOpsDeleteTableOptionalParams) => Promise<void>;
  /** Creates a new table under the given account. */
  create: (
    tableProperties: TableProperties,
    options?: TableOpsCreateOptionalParams,
  ) => Promise<TableResponse>;
  /** Queries tables under the given account. */
  query: (options?: TableOpsQueryOptionalParams) => Promise<TableQueryResponse>;
}

function _getTableOps(context: TablesContext) {
  return {
    setAccessPolicy: (table: string, options?: TableOpsSetAccessPolicyOptionalParams) =>
      setAccessPolicy(context, table, options),
    getAccessPolicy: (table: string, options?: TableOpsGetAccessPolicyOptionalParams) =>
      getAccessPolicy(context, table, options),
    insertEntity: (table: string, options?: TableOpsInsertEntityOptionalParams) =>
      insertEntity(context, table, options),
    deleteEntity: (
      table: string,
      partitionKey: string,
      rowKey: string,
      ifMatch: string,
      options?: TableOpsDeleteEntityOptionalParams,
    ) => deleteEntity(context, table, partitionKey, rowKey, ifMatch, options),
    mergeEntity: (
      table: string,
      partitionKey: string,
      rowKey: string,
      options?: TableOpsMergeEntityOptionalParams,
    ) => mergeEntity(context, table, partitionKey, rowKey, options),
    updateEntity: (
      table: string,
      partitionKey: string,
      rowKey: string,
      options?: TableOpsUpdateEntityOptionalParams,
    ) => updateEntity(context, table, partitionKey, rowKey, options),
    queryEntitiesWithPartitionAndRowKey: (
      table: string,
      partitionKey: string,
      rowKey: string,
      options?: TableOpsQueryEntitiesWithPartitionAndRowKeyOptionalParams,
    ) => queryEntitiesWithPartitionAndRowKey(context, table, partitionKey, rowKey, options),
    queryEntities: (table: string, options?: TableOpsQueryEntitiesOptionalParams) =>
      queryEntities(context, table, options),
    deleteTable: (table: string, options?: TableOpsDeleteTableOptionalParams) =>
      deleteTable(context, table, options),
    create: (tableProperties: TableProperties, options?: TableOpsCreateOptionalParams) =>
      create(context, tableProperties, options),
    query: (options?: TableOpsQueryOptionalParams) => query(context, options),
  };
}

export function _getTableOpsOperations(context: TablesContext): TableOpsOperations {
  return {
    ..._getTableOps(context),
  };
}
