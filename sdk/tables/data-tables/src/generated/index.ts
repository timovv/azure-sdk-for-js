// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  PageSettings,
  ContinuablePage,
  PagedAsyncIterableIterator,
} from "./static-helpers/pagingHelpers.js";

export { GeneratedClient } from "./generatedClient.js";
export {
  TableProperties,
  TablesError,
  TableResponse,
  TableEntityQueryResponse,
  EntityValueType,
  SignedIdentifiers,
  SignedIdentifier,
  AccessPolicy,
  TableServiceError,
  TableServiceProperties,
  Logging,
  RetentionPolicy,
  Metrics,
  CorsRule,
  TableServiceStats,
  GeoReplication,
  GeoReplicationStatusType,
  OdataMetadataFormat,
  ResponseFormat,
  KnownVersions,
} from "./models/index.js";
export { GeneratedClientOptionalParams } from "./api/index.js";
export {
  ServiceGetStatisticsOptionalParams,
  ServiceGetPropertiesOptionalParams,
  ServiceSetPropertiesOptionalParams,
} from "./api/service/index.js";
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
} from "./api/table/index.js";
export { ServiceOperations, TableOperations } from "./classic/index.js";
export { PageSettings, ContinuablePage, PagedAsyncIterableIterator };
