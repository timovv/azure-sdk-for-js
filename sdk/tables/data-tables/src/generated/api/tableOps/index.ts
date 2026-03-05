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
  deleteTable,
  create,
  query,
} from "./operations.js";
export {
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
