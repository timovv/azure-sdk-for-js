// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { OperationOptions } from "@azure-rest/core-client";

// Re-export types that still exist in generated code
export {
  CorsRule,
  Metrics,
  RetentionPolicy,
  Logging,
  TableServiceProperties as ServiceProperties,
} from "./generated/models/index.js";

/** The status of the secondary location. */
export type GeoReplicationStatusType = string;

/** Geo-Replication information for the Secondary Storage Service */
export interface GeoReplication {
  /** The status of the secondary location */
  status: GeoReplicationStatusType;
  /** A GMT date/time value, to the second. All primary writes preceding this value are guaranteed to be available for read operations at the secondary. Primary writes after this point in time may or may not be available for reads. */
  lastSyncTime: Date;
}

/** Stats for the table service. */
export interface TableServiceStats {
  /** Geo-Replication information for the Secondary Storage Service. */
  geoReplication?: GeoReplication;
}

// --- Header types (restored to match original API surface) ---

/** Defines headers for Service_getProperties operation. */
export interface ServiceGetPropertiesHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

/** Defines headers for Service_getStatistics operation. */
export interface ServiceGetStatisticsHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The date/time of the response. */
  date?: Date;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

/** Defines headers for Service_setProperties operation. */
export interface ServiceSetPropertiesHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

/** Defines headers for Table_create operation. */
export interface TableCreateHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The date/time of the response. */
  date?: Date;
  /** Whether the content was echoed. */
  preferenceApplied?: string;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

/** Defines headers for Table_deleteEntity operation. */
export interface TableDeleteEntityHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The date/time of the response. */
  date?: Date;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

/** Defines headers for Table_delete operation. */
export interface TableDeleteHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The date/time of the response. */
  date?: Date;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

/** Defines headers for Table_getAccessPolicy operation. */
export interface TableGetAccessPolicyHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The date/time of the response. */
  date?: Date;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

/** Defines headers for Table_insertEntity operation. */
export interface TableInsertEntityHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The content type. */
  contentType?: string;
  /** The date/time of the response. */
  date?: Date;
  /** The ETag of the entity. */
  etag?: string;
  /** Whether the content was echoed. */
  preferenceApplied?: string;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

/** Defines headers for Table_mergeEntity operation. */
export interface TableMergeEntityHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The date/time of the response. */
  date?: Date;
  /** The ETag of the entity. */
  etag?: string;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

/** Defines headers for Table_setAccessPolicy operation. */
export interface TableSetAccessPolicyHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The date/time of the response. */
  date?: Date;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

/** Defines headers for Table_updateEntity operation. */
export interface TableUpdateEntityHeaders {
  /** The client request ID. */
  clientRequestId?: string;
  /** The date/time of the response. */
  date?: Date;
  /** The ETag of the entity. */
  etag?: string;
  /** The request ID. */
  requestId?: string;
  /** The service version. */
  version?: string;
}

// --- Response types (restored to match original API surface) ---

/** Response type for deleteEntity operation. */
export type DeleteTableEntityResponse = TableDeleteEntityHeaders;

/** Response type for updateEntity operation. */
export type UpdateEntityResponse = TableUpdateEntityHeaders;

/** Response type for upsertEntity operation. */
export type UpsertEntityResponse = TableMergeEntityHeaders;

/** Response type for getAccessPolicy operation. */
export type GetAccessPolicyResponse = TableGetAccessPolicyHeaders &
  import("./models.js").SignedIdentifier[];

/** Response type for getProperties operation. */
export type GetPropertiesResponse = ServiceGetPropertiesHeaders &
  import("./generated/models/index.js").TableServiceProperties;

/** Response type for getStatistics operation. */
export type GetStatisticsResponse = ServiceGetStatisticsHeaders & TableServiceStats;

/** Response type for setAccessPolicy operation. */
export type SetAccessPolicyResponse = TableSetAccessPolicyHeaders;

/** Options for setProperties operation. */
export interface SetPropertiesOptions extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  requestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
}

/** Response type for setProperties operation. */
export type SetPropertiesResponse = ServiceSetPropertiesHeaders;

/** Known values of {@link GeoReplicationStatusType} that the service accepts. */
export enum KnownGeoReplicationStatusType {
  Live = "live",
  Bootstrap = "bootstrap",
  Unavailable = "unavailable",
}
