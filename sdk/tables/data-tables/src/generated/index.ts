// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export { TablesClient } from "./tablesClient.js";
export {
  TableServiceProperties,
  Logging,
  RetentionPolicy,
  Metrics,
  CorsRule,
  TableServiceError,
  TableServiceOdataError,
  TableServiceOdataErrorMessage,
  TableServiceStats,
  GeoReplication,
  GeoReplicationStatusType,
  TableQueryResponse,
  TableResponseProperties,
  TableProperties,
  TableResponse,
  TableEntityQueryResponse,
  TableEntityProperties,
  SignedIdentifier,
  AccessPolicy,
  OdataMetadataFormat,
  KnownVersions,
} from "./models/index.js";
export { TablesClientOptionalParams } from "./api/index.js";
export {
  ServiceGetStatisticsOptionalParams,
  ServiceGetPropertiesOptionalParams,
  ServiceSetPropertiesOptionalParams,
} from "./api/service/index.js";
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
} from "./api/tableOps/index.js";
export { ServiceOperations, TableOpsOperations } from "./classic/index.js";
