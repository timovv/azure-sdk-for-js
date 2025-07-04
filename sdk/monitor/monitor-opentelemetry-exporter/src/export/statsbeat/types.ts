// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Statsbeat class for network telemetry.
 * @internal
 */
export class NetworkStatsbeat {
  public time: number | undefined;

  public lastTime: number;

  public endpoint: string;

  public host: string;

  public totalRequestCount: number;

  public lastRequestCount: number;

  public totalSuccessfulRequestCount: number;

  public totalReadFailureCount: number;

  public totalWriteFailureCount: number;

  public totalFailedRequestCount: { statusCode: number; count: number }[];

  public retryCount: { statusCode: number; count: number }[];

  public exceptionCount: { exceptionType: string; count: number }[];

  public throttleCount: { statusCode: number; count: number }[];

  public intervalRequestExecutionTime: number;

  public lastIntervalRequestExecutionTime: number;

  public averageRequestExecutionTime: number;

  constructor(endpoint: string, host: string) {
    this.endpoint = endpoint;
    this.host = host;
    this.totalRequestCount = 0;
    this.totalSuccessfulRequestCount = 0;
    this.totalReadFailureCount = 0;
    this.totalWriteFailureCount = 0;
    this.totalFailedRequestCount = [];
    this.retryCount = [];
    this.exceptionCount = [];
    this.throttleCount = [];
    this.intervalRequestExecutionTime = 0;
    this.lastIntervalRequestExecutionTime = 0;
    this.lastTime = +new Date();
    this.lastRequestCount = 0;
    this.averageRequestExecutionTime = 0;
  }
}

/**
 * Statsbeat class for customer-visible telemetry.
 * @internal
 */
export class CustomerStatsbeat {
  public totalItemSuccessCount: Map<TelemetryType, number>;

  // Nested Map structure: telemetry_type -> drop.code -> drop.reason -> count
  public totalItemDropCount: Map<TelemetryType, Map<DropCode | number, Map<string, number>>>;

  // Nested Map structure: telemetry_type -> retry.code -> retry.reason -> count
  public totalItemRetryCount: Map<TelemetryType, Map<RetryCode | number, Map<string, number>>>;

  constructor() {
    this.totalItemSuccessCount = new Map<TelemetryType, number>();
    this.totalItemDropCount = new Map<TelemetryType, Map<DropCode | number, Map<string, number>>>();
    this.totalItemRetryCount = new Map<
      TelemetryType,
      Map<RetryCode | number, Map<string, number>>
    >();
  }
}

export const STATSBEAT_LANGUAGE = "node";

export const AZURE_MONITOR_AUTO_ATTACH = "AZURE_MONITOR_AUTO_ATTACH";

export const MAX_STATSBEAT_FAILURES = 3;

export const StatsbeatResourceProvider = {
  appsvc: "appsvc",
  aks: "aks",
  functions: "functions",
  vm: "vm",
  unknown: "unknown",
};

export enum AttachTypeName {
  INTEGRATED_AUTO = "IntegratedAuto",
  MANUAL = "Manual",
}

export enum StatsbeatCounter {
  SUCCESS_COUNT = "Request_Success_Count",
  FAILURE_COUNT = "Request_Failure_Count",
  RETRY_COUNT = "Retry_Count",
  THROTTLE_COUNT = "Throttle_Count",
  EXCEPTION_COUNT = "Exception_Count",
  AVERAGE_DURATION = "Request_Duration",
  READ_FAILURE_COUNT = "Read_Failure_Count",
  WRITE_FAILURE_COUNT = "Write_Failure_Count",
  ATTACH = "Attach",
  FEATURE = "Feature",
}

export enum CustomStatsbeatCounter {
  ITEM_SUCCESS_COUNT = "preview.item.success.count",
  ITEM_DROP_COUNT = "preview.item.dropped.count",
  ITEM_RETRY_COUNT = "preview.item.retry.count",
}

export const AIMS_URI = "http://169.254.169.254/metadata/instance/compute";
export const AIMS_API_VERSION = "api-version=2017-12-01";
export const AIMS_FORMAT = "format=json";
export const NON_EU_CONNECTION_STRING =
  "InstrumentationKey=c4a29126-a7cb-47e5-b348-11414998b11e;IngestionEndpoint=https://westus-0.in.applicationinsights.azure.com";
export const EU_CONNECTION_STRING =
  "InstrumentationKey=7dc56bab-3c0c-4e9f-9ebb-d1acadee8d0f;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com";
export const EU_ENDPOINTS = [
  "westeurope",
  "northeurope",
  "francecentral",
  "francesouth",
  "germanywestcentral",
  "norwayeast",
  "norwaywest",
  "swedencentral",
  "switzerlandnorth",
  "switzerlandwest",
  "uksouth",
  "ukwest",
];

export interface CommonStatsbeatProperties {
  os: string;
  rp: string;
  cikey: string;
  runtimeVersion: string;
  language: string;
  version: string;
  attach: string;
}

export interface CustomerStatsbeatProperties {
  language: string;
  version: string;
  computeType: string;
}

export enum TelemetryType {
  AVAILABILITY = "AVAILABILITY",
  CUSTOM_EVENT = "CUSTOM_EVENT",
  CUSTOM_METRIC = "CUSTOM_METRIC",
  DEPENDENCY = "DEPENDENCY",
  EXCEPTION = "EXCEPTION",
  PAGE_VIEW = "PAGE_VIEW",
  PERFORMANCE_COUNTER = "PERFORMANCE_COUNTER",
  REQUEST = "REQUEST",
  TRACE = "TRACE",
  UNKNOWN = "UNKNOWN",
}

export enum DropCode {
  CLIENT_EXCEPTION = "CLIENT_EXCEPTION",
  CLIENT_EXPIRED_DATA = "CLIENT_EXPIRED_DATA",
  CLIENT_READONLY = "CLIENT_READONLY",
  CLIENT_STALE_DATA = "CLIENT_STALE_DATA",
  CLIENT_PERSISTENCE_CAPACITY = "CLIENT_PERSISTENCE_CAPACITY",
  NON_RETRYABLE_STATUS_CODE = "NON_RETRYABLE_STATUS_CODE",
  CLIENT_STORAGE_DISABLED = "CLIENT_STORAGE_DISABLED",
  UNKNOWN = "UNKNOWN",
}

export enum RetryCode {
  CLIENT_EXCEPTION = "CLIENT_EXCEPTION",
  CLIENT_TIMEOUT = "CLIENT_TIMEOUT",
  RETRYABLE_STATUS_CODE = "RETRYABLE_STATUS_CODE",
  UNKNOWN = "UNKNOWN",
}

export interface AttachStatsbeatProperties {
  rpId: string;
}

export interface NetworkStatsbeatProperties {
  endpoint: string;
  host: string;
}

export interface StatsbeatOptions {
  instrumentationKey: string;
  endpointUrl: string;
  networkCollectionInterval?: number;
  longCollectionInterval?: number;
  disableOfflineStorage?: boolean;
}

export interface VirtualMachineInfo {
  isVM?: boolean;
  id?: string;
  subscriptionId?: string;
  osType?: string;
}

export enum StatsbeatFeatureType {
  FEATURE = 0,
  INSTRUMENTATION = 1,
}

/**
 * Status codes indicating that we should shutdown statsbeat
 * @internal
 */
export function isStatsbeatShutdownStatus(statusCode: number): boolean {
  return (
    statusCode === 401 || // Unauthorized
    statusCode === 403 || // Forbidden
    statusCode === 503 // Server Unavailable
  );
}
