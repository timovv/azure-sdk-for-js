// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  TableEntityProperties,
  SignedIdentifier,
  OdataMetadataFormat,
} from "../../models/models.js";
import { OperationOptions } from "@azure-rest/core-client";

/** Optional parameters. */
export interface TableOpsSetAccessPolicyOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
  /** The access policies for the table. */
  tableAcl?: SignedIdentifier[];
}

/** Optional parameters. */
export interface TableOpsGetAccessPolicyOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
}

/** Optional parameters. */
export interface TableOpsInsertEntityOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
  /** Specifies the data service version. */
  dataServiceVersion?: string;
  /** Specifies the media type for the response. */
  format?: OdataMetadataFormat;
  /** Specifies whether the response should include the inserted entity in the payload. Possible values are return-no-content and return-content. */
  prefer?: string;
  /** The entity properties. */
  tableEntityProperties?: TableEntityProperties;
}

/** Optional parameters. */
export interface TableOpsDeleteEntityOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
  /** Specifies the data service version. */
  dataServiceVersion?: string;
  /** Specifies the media type for the response. */
  format?: OdataMetadataFormat;
}

/** Optional parameters. */
export interface TableOpsMergeEntityOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
  /** Specifies the data service version. */
  dataServiceVersion?: string;
  /** Specifies the media type for the response. */
  format?: OdataMetadataFormat;
  /** Match condition for an entity to be updated. If specified and a matching entity is not found, an error will be raised. To force an unconditional update, set to the wildcard character (*). If not specified, an insert(upsert) operation is performed. */
  ifMatch?: string;
  /** The entity properties. */
  tableEntityProperties?: TableEntityProperties;
}

/** Optional parameters. */
export interface TableOpsUpdateEntityOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
  /** Specifies the data service version. */
  dataServiceVersion?: string;
  /** Specifies the media type for the response. */
  format?: OdataMetadataFormat;
  /** Match condition for an entity to be updated. If specified and a matching entity is not found, an error will be raised. To force an unconditional update, set to the wildcard character (*). If not specified, an insert(upsert) operation is performed. */
  ifMatch?: string;
  /** The entity properties. */
  tableEntityProperties?: TableEntityProperties;
}

/** Optional parameters. */
export interface TableOpsQueryEntitiesWithPartitionAndRowKeyOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
  /** Specifies the data service version. */
  dataServiceVersion?: string;
  /** Specifies the media type for the response. */
  format?: OdataMetadataFormat;
  /** Select expression using OData notation. Limits the columns on each record to just those requested. */
  select?: string;
  /** OData filter expression. */
  filter?: string;
}

/** Optional parameters. */
export interface TableOpsQueryEntitiesOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
  /** Specifies the data service version. */
  dataServiceVersion?: string;
  /** Specifies the media type for the response. */
  format?: OdataMetadataFormat;
  /** Maximum number of records to return. */
  top?: number;
  /** Select expression using OData notation. Limits the columns on each record to just those requested. */
  select?: string;
  /** OData filter expression. */
  filter?: string;
  /** An entity query continuation token from a previous call. */
  nextPartitionKey?: string;
  /** An entity query continuation token from a previous call. */
  nextRowKey?: string;
}

/** Optional parameters. */
export interface TableOpsDeleteTableOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
}

/** Optional parameters. */
export interface TableOpsCreateOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** Specifies the data service version. */
  dataServiceVersion?: string;
  /** Specifies the media type for the response. */
  format?: OdataMetadataFormat;
  /** Specifies whether the response should include the inserted entity in the payload. Possible values are return-no-content and return-content. */
  prefer?: string;
}

/** Optional parameters. */
export interface TableOpsQueryOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** Specifies the data service version. */
  dataServiceVersion?: string;
  /** Specifies the media type for the response. */
  format?: OdataMetadataFormat;
  /** Maximum number of records to return. */
  top?: number;
  /** Select expression using OData notation. Limits the columns on each record to just those requested. */
  select?: string;
  /** OData filter expression. */
  filter?: string;
  /** A table query continuation token from a previous call. */
  nextTableName?: string;
}
