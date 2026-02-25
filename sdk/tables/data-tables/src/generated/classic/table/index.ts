// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { GeneratedContext } from "../../api/generatedContext.js";
import {
  setAccessPolicy,
  getAccessPolicy,
  insertEntity,
  deleteEntity,
  mergeEntity,
  updateEntity,
  queryEntitiesWithPartitionAndRowKey,
  queryEntities,
  $delete,
  create,
  query,
} from "../../api/table/operations.js";
import {
  TableSetAccessPolicyOptionalParams,
  TableGetAccessPolicyOptionalParams,
  TableInsertEntityOptionalParams,
  TableDeleteEntityOptionalParams,
  TableMergeEntityOptionalParams,
  TableUpdateEntityOptionalParams,
  TableQueryEntitiesWithPartitionAndRowKeyOptionalParams,
  TableQueryEntitiesOptionalParams,
  TableDeleteOptionalParams,
  TableCreateOptionalParams,
  TableQueryOptionalParams,
} from "../../api/table/options.js";
import {
  TableProperties,
  EntityValueType,
  SignedIdentifiers,
  SignedIdentifier,
} from "../../models/models.js";
import { PagedAsyncIterableIterator } from "../../static-helpers/pagingHelpers.js";

/** Interface representing a Table operations. */
export interface TableOperations {
  /**
   * Sets stored access policies for the table that may be used with Shared Access
   * Signatures.
   */
  setAccessPolicy: (
    table: string,
    tableAcl: SignedIdentifiers,
    options?: TableSetAccessPolicyOptionalParams,
  ) => Promise<{ date: Date; apiVersion: string; requestId?: string; clientRequestId?: string }>;
  /**
   * Retrieves details about any stored access policies specified on the table that
   * may be used with Shared Access Signatures.
   */
  getAccessPolicy: (
    table: string,
    options?: TableGetAccessPolicyOptionalParams,
  ) => Promise<{
    identifiers: SignedIdentifier[];
    date: Date;
    apiVersion: string;
    requestId?: string;
    clientRequestId?: string;
    contentType: "application/xml";
  }>;
  /** Insert entity in a table. */
  insertEntity: (
    table: string,
    options?: TableInsertEntityOptionalParams,
  ) => Promise<Record<string, EntityValueType>>;
  /** Deletes the specified entity in a table. */
  deleteEntity: (
    table: string,
    ifMatch: string,
    partitionKey: string,
    rowKey: string,
    options?: TableDeleteEntityOptionalParams,
  ) => Promise<{ apiVersion: string; requestId?: string; clientRequestId?: string; date: Date }>;
  /** Merge entity in a table. */
  mergeEntity: (
    table: string,
    partitionKey: string,
    rowKey: string,
    options?: TableMergeEntityOptionalParams,
  ) => Promise<{
    eTag: string;
    apiVersion: string;
    requestId?: string;
    clientRequestId?: string;
    date: Date;
  }>;
  /** Update entity in a table. */
  updateEntity: (
    table: string,
    partitionKey: string,
    rowKey: string,
    options?: TableUpdateEntityOptionalParams,
  ) => Promise<{
    eTag: string;
    apiVersion: string;
    requestId?: string;
    clientRequestId?: string;
    date: Date;
  }>;
  /** Retrieve a single entity. */
  queryEntitiesWithPartitionAndRowKey: (
    table: string,
    partitionKey: string,
    rowKey: string,
    options?: TableQueryEntitiesWithPartitionAndRowKeyOptionalParams,
  ) => Promise<Record<string, EntityValueType>>;
  /** Queries entities under the given table. */
  queryEntities: (
    table: string,
    options?: TableQueryEntitiesOptionalParams,
  ) => Promise<{
    odataMetadata?: string;
    value?: Record<string, EntityValueType>[];
    nextPartitionKey?: string;
    nextRowKey?: string;
    apiVersion: string;
    requestId?: string;
    clientRequestId?: string;
    date: Date;
    contentType: "application/json;odata=minimalmetadata";
  }>;
  /** Deletes an existing table. */
  /**
   *  @fixme delete is a reserved word that cannot be used as an operation name.
   *         Please add @clientName("clientName") or @clientName("<JS-Specific-Name>", "javascript")
   *         to the operation to override the generated name.
   */
  delete: (
    table: string,
    options?: TableDeleteOptionalParams,
  ) => Promise<{ apiVersion: string; requestId?: string; clientRequestId?: string; date: Date }>;
  /** Creates a new table under the given account. */
  create: (
    tableProperties: TableProperties,
    options?: TableCreateOptionalParams,
  ) => Promise<{
    tableName?: string;
    odataType?: string;
    odataId?: string;
    odataEditLink?: string;
    odataMetadata?: string;
    preferenceApplied?: string;
    apiVersion: string;
    requestId?: string;
    clientRequestId?: string;
    date: Date;
    contentType: "application/json;odata=minimalmetadata";
  }>;
  /** Queries tables under the given account. */
  query: (options?: TableQueryOptionalParams) => PagedAsyncIterableIterator<TableProperties>;
}

function _getTable(context: GeneratedContext) {
  return {
    setAccessPolicy: (
      table: string,
      tableAcl: SignedIdentifiers,
      options?: TableSetAccessPolicyOptionalParams,
    ) => setAccessPolicy(context, table, tableAcl, options),
    getAccessPolicy: (table: string, options?: TableGetAccessPolicyOptionalParams) =>
      getAccessPolicy(context, table, options),
    insertEntity: (table: string, options?: TableInsertEntityOptionalParams) =>
      insertEntity(context, table, options),
    deleteEntity: (
      table: string,
      ifMatch: string,
      partitionKey: string,
      rowKey: string,
      options?: TableDeleteEntityOptionalParams,
    ) => deleteEntity(context, table, ifMatch, partitionKey, rowKey, options),
    mergeEntity: (
      table: string,
      partitionKey: string,
      rowKey: string,
      options?: TableMergeEntityOptionalParams,
    ) => mergeEntity(context, table, partitionKey, rowKey, options),
    updateEntity: (
      table: string,
      partitionKey: string,
      rowKey: string,
      options?: TableUpdateEntityOptionalParams,
    ) => updateEntity(context, table, partitionKey, rowKey, options),
    queryEntitiesWithPartitionAndRowKey: (
      table: string,
      partitionKey: string,
      rowKey: string,
      options?: TableQueryEntitiesWithPartitionAndRowKeyOptionalParams,
    ) => queryEntitiesWithPartitionAndRowKey(context, table, partitionKey, rowKey, options),
    queryEntities: (table: string, options?: TableQueryEntitiesOptionalParams) =>
      queryEntities(context, table, options),
    delete: (table: string, options?: TableDeleteOptionalParams) =>
      $delete(context, table, options),
    create: (tableProperties: TableProperties, options?: TableCreateOptionalParams) =>
      create(context, tableProperties, options),
    query: (options?: TableQueryOptionalParams) => query(context, options),
  };
}

export function _getTableOperations(context: GeneratedContext): TableOperations {
  return {
    ..._getTable(context),
  };
}
