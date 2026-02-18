// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export type {
  TableServiceProperties as ServiceProperties,
  GeoReplicationStatusType,
  GeoReplication,
  TableServiceStats,
  CorsRule,
  Metrics,
  RetentionPolicy,
  Logging,
} from "./generated/models/index.js";

export type { ServiceSetPropertiesOptionalParams as SetPropertiesOptions } from "./generated/api/service/options.js";

// In the new generated code, response types no longer include header intersections.
// These types are kept as simple aliases for backward compatibility.
export type GetStatisticsResponse = import("./generated/models/index.js").TableServiceStats;
export type GetPropertiesResponse = import("./generated/models/index.js").TableServiceProperties;
export type SetPropertiesResponse = void;

/** Response from delete entity operation. */
export interface DeleteTableEntityResponse {
  clientRequestId?: string;
  requestId?: string;
  version?: string;
  date?: Date;
  etag?: string;
}
/** Response from update entity operation. */
export interface UpdateEntityResponse {
  clientRequestId?: string;
  requestId?: string;
  version?: string;
  date?: Date;
  etag?: string;
}
/** Response from upsert entity operation. */
export interface UpsertEntityResponse {
  clientRequestId?: string;
  requestId?: string;
  version?: string;
  date?: Date;
  etag?: string;
}
export type SetAccessPolicyResponse = void;

// Header types no longer exist in the new generated code.
// Define empty interfaces for backward compatibility.
/** @deprecated Header types are no longer used in the new generated code. */
export interface TableInsertEntityHeaders {
  etag?: string;
  preferenceApplied?: string;
  contentType?: string;
}
/** @deprecated Header types are no longer used in the new generated code. */
export interface TableCreateHeaders {}
/** @deprecated Header types are no longer used in the new generated code. */
export interface TableDeleteEntityHeaders {}
/** @deprecated Header types are no longer used in the new generated code. */
export interface TableDeleteHeaders {}
/** @deprecated Header types are no longer used in the new generated code. */
export interface TableGetAccessPolicyHeaders {}
/** @deprecated Header types are no longer used in the new generated code. */
export interface ServiceGetPropertiesHeaders {}
/** @deprecated Header types are no longer used in the new generated code. */
export interface ServiceGetStatisticsHeaders {}
/** @deprecated Header types are no longer used in the new generated code. */
export interface TableMergeEntityHeaders {}
/** @deprecated Header types are no longer used in the new generated code. */
export interface TableSetAccessPolicyHeaders {}
/** @deprecated Header types are no longer used in the new generated code. */
export interface ServiceSetPropertiesHeaders {}
/** @deprecated Header types are no longer used in the new generated code. */
export interface TableUpdateEntityHeaders {}

// The old KnownGeoReplicationStatusType was an enum; the new code uses a string union type.
// Re-export as a const object for backward compat.
/** @deprecated Use string literals instead. */
export const KnownGeoReplicationStatusType = {
  Live: "live" as const,
  Bootstrap: "bootstrap" as const,
  Unavailable: "unavailable" as const,
};
