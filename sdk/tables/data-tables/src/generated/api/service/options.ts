// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { OperationOptions } from "@azure-rest/core-client";

/** Optional parameters. */
export interface ServiceGetStatisticsOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
}

/** Optional parameters. */
export interface ServiceGetPropertiesOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
}

/** Optional parameters. */
export interface ServiceSetPropertiesOptionalParams extends OperationOptions {
  /** Provides a client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when analytics logging is enabled. */
  clientRequestId?: string;
  /** The timeout parameter is expressed in seconds. */
  timeout?: number;
}
