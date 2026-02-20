// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TablesContext as Client } from "../index.js";
import {
  tableServiceErrorDeserializer,
  TableQueryResponse,
  tableQueryResponseDeserializer,
  TableProperties,
  tablePropertiesSerializer,
  TableResponse,
  tableResponseDeserializer,
  TableEntityQueryResponse,
  tableEntityQueryResponseDeserializer,
  TableEntityProperties,
  tableEntityPropertiesSerializer,
  tableEntityPropertiesDeserializer,
  SignedIdentifier,
  signedIdentifierArrayXmlSerializer,
  signedIdentifierArrayXmlDeserializer,
} from "../../models/models.js";
import { expandUrlTemplate } from "../../static-helpers/urlTemplate.js";
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
} from "./options.js";
import {
  StreamableMethod,
  PathUncheckedResponse,
  createRestError,
  operationOptionsToRequestParameters,
} from "@azure-rest/core-client";

export function _setAccessPolicySend(
  context: Client,
  table: string,
  options: TableOpsSetAccessPolicyOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/{table}?comp=acl{?timeout}",
    {
      table: table,
      timeout: options?.timeout,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).put({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/xml",
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...options.requestOptions?.headers,
    },
    body: !options["tableAcl"]
      ? options["tableAcl"]
      : signedIdentifierArrayXmlSerializer(options["tableAcl"]),
  });
}

export async function _setAccessPolicyDeserialize(result: PathUncheckedResponse): Promise<void> {
  const expectedStatuses = ["204"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return;
}

/** Sets stored access policies for the table that may be used with Shared Access Signatures. */
export async function setAccessPolicy(
  context: Client,
  table: string,
  options: TableOpsSetAccessPolicyOptionalParams = { requestOptions: {} },
): Promise<void> {
  const result = await _setAccessPolicySend(context, table, options);
  return _setAccessPolicyDeserialize(result);
}

export function _getAccessPolicySend(
  context: Client,
  table: string,
  options: TableOpsGetAccessPolicyOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/{table}?comp=acl{?timeout}",
    {
      table: table,
      timeout: options?.timeout,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).get({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/xml",
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      accept: "application/xml",
      ...options.requestOptions?.headers,
    },
  });
}

export async function _getAccessPolicyDeserialize(
  result: PathUncheckedResponse,
): Promise<SignedIdentifier[]> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return signedIdentifierArrayXmlDeserializer(result.body);
}

/** Retrieves details about any stored access policies specified on the table that may be used with Shared Access Signatures. */
export async function getAccessPolicy(
  context: Client,
  table: string,
  options: TableOpsGetAccessPolicyOptionalParams = { requestOptions: {} },
): Promise<SignedIdentifier[]> {
  const result = await _getAccessPolicySend(context, table, options);
  return _getAccessPolicyDeserialize(result);
}

export function _insertEntitySend(
  context: Client,
  table: string,
  options: TableOpsInsertEntityOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/{table}{?timeout,$format}",
    {
      table: table,
      timeout: options?.timeout,
      $format: options?.format,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).post({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/json",
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...(options?.dataServiceVersion !== undefined
        ? { dataserviceversion: options?.dataServiceVersion }
        : {}),
      ...(options?.prefer !== undefined ? { prefer: options?.prefer } : {}),
      accept: "*/*",
      ...options.requestOptions?.headers,
    },
    body: !options["tableEntityProperties"]
      ? options["tableEntityProperties"]
      : tableEntityPropertiesSerializer(options["tableEntityProperties"]),
  });
}

export async function _insertEntityDeserialize(
  result: PathUncheckedResponse,
): Promise<TableEntityProperties> {
  const expectedStatuses = ["201", "204"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return tableEntityPropertiesDeserializer(result.body);
}

/** Insert entity in a table. */
export async function insertEntity(
  context: Client,
  table: string,
  options: TableOpsInsertEntityOptionalParams = { requestOptions: {} },
): Promise<TableEntityProperties> {
  const result = await _insertEntitySend(context, table, options);
  return _insertEntityDeserialize(result);
}

export function _deleteEntitySend(
  context: Client,
  table: string,
  partitionKey: string,
  rowKey: string,
  ifMatch: string,
  options: TableOpsDeleteEntityOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,$format}",
    {
      table: table,
      partitionKey: partitionKey,
      rowKey: rowKey,
      timeout: options?.timeout,
      $format: options?.format,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).delete({
    ...operationOptionsToRequestParameters(options),
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...(options?.dataServiceVersion !== undefined
        ? { dataserviceversion: options?.dataServiceVersion }
        : {}),
      "if-match": ifMatch,
      ...options.requestOptions?.headers,
    },
  });
}

export async function _deleteEntityDeserialize(result: PathUncheckedResponse): Promise<void> {
  const expectedStatuses = ["204"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return;
}

/** Deletes the specified entity in a table. */
export async function deleteEntity(
  context: Client,
  table: string,
  partitionKey: string,
  rowKey: string,
  ifMatch: string,
  options: TableOpsDeleteEntityOptionalParams = { requestOptions: {} },
): Promise<void> {
  const result = await _deleteEntitySend(context, table, partitionKey, rowKey, ifMatch, options);
  return _deleteEntityDeserialize(result);
}

export function _mergeEntitySend(
  context: Client,
  table: string,
  partitionKey: string,
  rowKey: string,
  options: TableOpsMergeEntityOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,$format}",
    {
      table: table,
      partitionKey: partitionKey,
      rowKey: rowKey,
      timeout: options?.timeout,
      $format: options?.format,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).patch({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/json",
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...(options?.dataServiceVersion !== undefined
        ? { dataserviceversion: options?.dataServiceVersion }
        : {}),
      ...(options?.ifMatch !== undefined ? { "if-match": options?.ifMatch } : {}),
      ...options.requestOptions?.headers,
    },
    body: !options["tableEntityProperties"]
      ? options["tableEntityProperties"]
      : tableEntityPropertiesSerializer(options["tableEntityProperties"]),
  });
}

export async function _mergeEntityDeserialize(result: PathUncheckedResponse): Promise<void> {
  const expectedStatuses = ["204"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return;
}

/** Merge entity in a table. */
export async function mergeEntity(
  context: Client,
  table: string,
  partitionKey: string,
  rowKey: string,
  options: TableOpsMergeEntityOptionalParams = { requestOptions: {} },
): Promise<void> {
  const result = await _mergeEntitySend(context, table, partitionKey, rowKey, options);
  return _mergeEntityDeserialize(result);
}

export function _updateEntitySend(
  context: Client,
  table: string,
  partitionKey: string,
  rowKey: string,
  options: TableOpsUpdateEntityOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,$format}",
    {
      table: table,
      partitionKey: partitionKey,
      rowKey: rowKey,
      timeout: options?.timeout,
      $format: options?.format,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).put({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/json",
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...(options?.dataServiceVersion !== undefined
        ? { dataserviceversion: options?.dataServiceVersion }
        : {}),
      ...(options?.ifMatch !== undefined ? { "if-match": options?.ifMatch } : {}),
      ...options.requestOptions?.headers,
    },
    body: !options["tableEntityProperties"]
      ? options["tableEntityProperties"]
      : tableEntityPropertiesSerializer(options["tableEntityProperties"]),
  });
}

export async function _updateEntityDeserialize(result: PathUncheckedResponse): Promise<void> {
  const expectedStatuses = ["204"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return;
}

/** Update entity in a table. */
export async function updateEntity(
  context: Client,
  table: string,
  partitionKey: string,
  rowKey: string,
  options: TableOpsUpdateEntityOptionalParams = { requestOptions: {} },
): Promise<void> {
  const result = await _updateEntitySend(context, table, partitionKey, rowKey, options);
  return _updateEntityDeserialize(result);
}

export function _queryEntitiesWithPartitionAndRowKeySend(
  context: Client,
  table: string,
  partitionKey: string,
  rowKey: string,
  options: TableOpsQueryEntitiesWithPartitionAndRowKeyOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,$format,$select,$filter}",
    {
      table: table,
      partitionKey: partitionKey,
      rowKey: rowKey,
      timeout: options?.timeout,
      $format: options?.format,
      $select: options?.select,
      $filter: options?.filter,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).get({
    ...operationOptionsToRequestParameters(options),
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...(options?.dataServiceVersion !== undefined
        ? { dataserviceversion: options?.dataServiceVersion }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
  });
}

export async function _queryEntitiesWithPartitionAndRowKeyDeserialize(
  result: PathUncheckedResponse,
): Promise<TableEntityProperties> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return tableEntityPropertiesDeserializer(result.body);
}

/** Queries a single entity in a table. */
export async function queryEntitiesWithPartitionAndRowKey(
  context: Client,
  table: string,
  partitionKey: string,
  rowKey: string,
  options: TableOpsQueryEntitiesWithPartitionAndRowKeyOptionalParams = { requestOptions: {} },
): Promise<TableEntityProperties> {
  const result = await _queryEntitiesWithPartitionAndRowKeySend(
    context,
    table,
    partitionKey,
    rowKey,
    options,
  );
  return _queryEntitiesWithPartitionAndRowKeyDeserialize(result);
}

export function _queryEntitiesSend(
  context: Client,
  table: string,
  options: TableOpsQueryEntitiesOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/{table}(){?timeout,$format,$top,$select,$filter,NextPartitionKey,NextRowKey}",
    {
      table: table,
      timeout: options?.timeout,
      $format: options?.format,
      $top: options?.top,
      $select: options?.select,
      $filter: options?.filter,
      NextPartitionKey: options?.nextPartitionKey,
      NextRowKey: options?.nextRowKey,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).get({
    ...operationOptionsToRequestParameters(options),
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...(options?.dataServiceVersion !== undefined
        ? { dataserviceversion: options?.dataServiceVersion }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
  });
}

export async function _queryEntitiesDeserialize(
  result: PathUncheckedResponse,
): Promise<TableEntityQueryResponse> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return tableEntityQueryResponseDeserializer(result.body);
}

/** Queries entities in a table. */
export async function queryEntities(
  context: Client,
  table: string,
  options: TableOpsQueryEntitiesOptionalParams = { requestOptions: {} },
): Promise<TableEntityQueryResponse> {
  const result = await _queryEntitiesSend(context, table, options);
  return _queryEntitiesDeserialize(result);
}

export function _deleteTableSend(
  context: Client,
  table: string,
  options: TableOpsDeleteTableOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/Tables('{table}')",
    {
      table: table,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).delete({
    ...operationOptionsToRequestParameters(options),
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...options.requestOptions?.headers,
    },
  });
}

export async function _deleteTableDeserialize(result: PathUncheckedResponse): Promise<void> {
  const expectedStatuses = ["204"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return;
}

/** Permanently deletes the specified table. */
export async function deleteTable(
  context: Client,
  table: string,
  options: TableOpsDeleteTableOptionalParams = { requestOptions: {} },
): Promise<void> {
  const result = await _deleteTableSend(context, table, options);
  return _deleteTableDeserialize(result);
}

export function _createSend(
  context: Client,
  tableProperties: TableProperties,
  options: TableOpsCreateOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/Tables{?$format}",
    {
      $format: options?.format,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).post({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/json",
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...(options?.dataServiceVersion !== undefined
        ? { dataserviceversion: options?.dataServiceVersion }
        : {}),
      ...(options?.prefer !== undefined ? { prefer: options?.prefer } : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
    body: tablePropertiesSerializer(tableProperties),
  });
}

export async function _createDeserialize(result: PathUncheckedResponse): Promise<TableResponse> {
  const expectedStatuses = ["201", "204"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return tableResponseDeserializer(result.body);
}

/** Creates a new table under the given account. */
export async function create(
  context: Client,
  tableProperties: TableProperties,
  options: TableOpsCreateOptionalParams = { requestOptions: {} },
): Promise<TableResponse> {
  const result = await _createSend(context, tableProperties, options);
  return _createDeserialize(result);
}

export function _querySend(
  context: Client,
  options: TableOpsQueryOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/Tables{?$format,$top,$select,$filter,NextTableName}",
    {
      $format: options?.format,
      $top: options?.top,
      $select: options?.select,
      $filter: options?.filter,
      NextTableName: options?.nextTableName,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).get({
    ...operationOptionsToRequestParameters(options),
    headers: {
      "x-ms-version": context.version ?? "2019-02-02",
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...(options?.dataServiceVersion !== undefined
        ? { dataserviceversion: options?.dataServiceVersion }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
  });
}

export async function _queryDeserialize(
  result: PathUncheckedResponse,
): Promise<TableQueryResponse> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError(result);
    error.details = tableServiceErrorDeserializer(result.body);
    throw error;
  }

  return tableQueryResponseDeserializer(result.body);
}

/** Queries tables under the given account. */
export async function query(
  context: Client,
  options: TableOpsQueryOptionalParams = { requestOptions: {} },
): Promise<TableQueryResponse> {
  const result = await _querySend(context, options);
  return _queryDeserialize(result);
}
