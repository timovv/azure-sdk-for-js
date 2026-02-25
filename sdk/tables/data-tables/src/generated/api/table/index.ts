// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export {
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
} from "./operations.js";
export {
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
} from "./options.js";
