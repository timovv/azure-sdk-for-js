// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { serializeRecord } from "../static-helpers/serialization/serialize-record.js";
import {
  XmlPropertyMetadata,
  XmlPropertyDeserializeMetadata,
  serializeToXml,
  deserializeFromXml,
  parseXmlString,
} from "../static-helpers/serialization/xml-helpers.js";

/**
 * This file contains only generated model types and their (de)serializers.
 * Disable the following rules for internal models with '_' prefix and deserializers which require 'any' for raw JSON input.
 */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/** Table Service Properties. */
export interface TableServiceProperties {
  /** Azure Analytics Logging settings. */
  logging?: Logging;
  /** A summary of request statistics grouped by API in hourly aggregates for tables. */
  hourMetrics?: Metrics;
  /** A summary of request statistics grouped by API in minute aggregates for tables. */
  minuteMetrics?: Metrics;
  /** The set of CORS rules. */
  cors?: CorsRule[];
}

export function tableServicePropertiesSerializer(item: TableServiceProperties): any {
  return {
    logging: !item["logging"] ? item["logging"] : loggingSerializer(item["logging"]),
    hourMetrics: !item["hourMetrics"]
      ? item["hourMetrics"]
      : metricsSerializer(item["hourMetrics"]),
    minuteMetrics: !item["minuteMetrics"]
      ? item["minuteMetrics"]
      : metricsSerializer(item["minuteMetrics"]),
    cors: !item["cors"] ? item["cors"] : corsRuleArraySerializer(item["cors"]),
  };
}

export function tableServicePropertiesDeserializer(item: any): TableServiceProperties {
  return {
    logging: !item["logging"] ? item["logging"] : loggingDeserializer(item["logging"]),
    hourMetrics: !item["hourMetrics"]
      ? item["hourMetrics"]
      : metricsDeserializer(item["hourMetrics"]),
    minuteMetrics: !item["minuteMetrics"]
      ? item["minuteMetrics"]
      : metricsDeserializer(item["minuteMetrics"]),
    cors: !item["cors"] ? item["cors"] : corsRuleArrayDeserializer(item["cors"]),
  };
}

export function tableServicePropertiesXmlSerializer(item: TableServiceProperties): string {
  const properties: XmlPropertyMetadata[] = [
    {
      propertyName: "logging",
      xmlOptions: { name: "Logging" },
      type: "object",
      serializer: loggingSerializer,
    },
    {
      propertyName: "hourMetrics",
      xmlOptions: { name: "HourMetrics" },
      type: "object",
      serializer: metricsSerializer,
    },
    {
      propertyName: "minuteMetrics",
      xmlOptions: { name: "MinuteMetrics" },
      type: "object",
      serializer: metricsSerializer,
    },
    {
      propertyName: "cors",
      xmlOptions: { name: "Cors", itemsName: "CorsRule" },
      type: "array",
      serializer: corsRuleSerializer,
    },
  ];
  return serializeToXml(item, properties, "StorageServiceProperties");
}

export function tableServicePropertiesXmlDeserializer(xmlString: string): TableServiceProperties {
  const properties: XmlPropertyDeserializeMetadata[] = [
    {
      propertyName: "logging",
      xmlOptions: { name: "Logging" },
      type: "object",
      deserializer: loggingFromXmlDeserializer,
    },
    {
      propertyName: "hourMetrics",
      xmlOptions: { name: "HourMetrics" },
      type: "object",
      deserializer: metricsFromXmlDeserializer,
    },
    {
      propertyName: "minuteMetrics",
      xmlOptions: { name: "MinuteMetrics" },
      type: "object",
      deserializer: metricsFromXmlDeserializer,
    },
    {
      propertyName: "cors",
      xmlOptions: { name: "Cors", itemsName: "CorsRule" },
      type: "array",
      deserializer: corsRuleFromXmlDeserializer,
    },
  ];
  return deserializeFromXml<TableServiceProperties>(
    xmlString,
    properties,
    "StorageServiceProperties",
  );
}

/** Azure Analytics Logging settings. */
export interface Logging {
  /** The version of Analytics to configure. */
  version: string;
  /** Indicates whether all delete requests should be logged. */
  delete: boolean;
  /** Indicates whether all read requests should be logged. */
  read: boolean;
  /** Indicates whether all write requests should be logged. */
  write: boolean;
  /** The retention policy. */
  retentionPolicy: RetentionPolicy;
}

export function loggingSerializer(item: Logging): any {
  return {
    version: item["version"],
    Delete: item["delete"],
    Read: item["read"],
    Write: item["write"],
    retentionPolicy: retentionPolicySerializer(item["retentionPolicy"]),
  };
}

export function loggingDeserializer(item: any): Logging {
  return {
    version: item["version"],
    delete: item["Delete"],
    read: item["Read"],
    write: item["Write"],
    retentionPolicy: retentionPolicyDeserializer(item["retentionPolicy"]),
  };
}

function loggingFromXmlDeserializer(item: any): Logging {
  return {
    version: item["Version"],
    delete: item["Delete"],
    read: item["Read"],
    write: item["Write"],
    retentionPolicy: retentionPolicyFromXmlDeserializer(item["RetentionPolicy"]),
  };
}

export function loggingXmlSerializer(item: Logging): string {
  const properties: XmlPropertyMetadata[] = [
    { propertyName: "version", xmlOptions: { name: "Version" }, type: "primitive" },
    { propertyName: "delete", xmlOptions: { name: "Delete" }, type: "primitive" },
    { propertyName: "read", xmlOptions: { name: "Read" }, type: "primitive" },
    { propertyName: "write", xmlOptions: { name: "Write" }, type: "primitive" },
    {
      propertyName: "retentionPolicy",
      xmlOptions: { name: "RetentionPolicy" },
      type: "object",
      serializer: retentionPolicySerializer,
    },
  ];
  return serializeToXml(item, properties, "Logging");
}

export function loggingXmlDeserializer(xmlString: string): Logging {
  const properties: XmlPropertyDeserializeMetadata[] = [
    { propertyName: "version", xmlOptions: { name: "Version" }, type: "primitive" },
    { propertyName: "delete", xmlOptions: { name: "Delete" }, type: "primitive" },
    { propertyName: "read", xmlOptions: { name: "Read" }, type: "primitive" },
    { propertyName: "write", xmlOptions: { name: "Write" }, type: "primitive" },
    {
      propertyName: "retentionPolicy",
      xmlOptions: { name: "RetentionPolicy" },
      type: "object",
      deserializer: retentionPolicyFromXmlDeserializer,
    },
  ];
  return deserializeFromXml<Logging>(xmlString, properties, "Logging");
}

/** The retention policy. */
export interface RetentionPolicy {
  /** Indicates whether a retention policy is enabled for the service. */
  enabled: boolean;
  /** Indicates the number of days that metrics or logging or soft-deleted data should be retained. All data older than this value will be deleted. */
  days?: number;
}

export function retentionPolicySerializer(item: RetentionPolicy): any {
  return { enabled: item["enabled"], days: item["days"] };
}

export function retentionPolicyDeserializer(item: any): RetentionPolicy {
  return {
    enabled: item["enabled"],
    days: item["days"],
  };
}

function retentionPolicyFromXmlDeserializer(item: any): RetentionPolicy {
  return {
    enabled: item["Enabled"],
    days: item["Days"],
  };
}

export function retentionPolicyXmlSerializer(item: RetentionPolicy): string {
  const properties: XmlPropertyMetadata[] = [
    { propertyName: "enabled", xmlOptions: { name: "Enabled" }, type: "primitive" },
    { propertyName: "days", xmlOptions: { name: "Days" }, type: "primitive" },
  ];
  return serializeToXml(item, properties, "RetentionPolicy");
}

export function retentionPolicyXmlDeserializer(xmlString: string): RetentionPolicy {
  const properties: XmlPropertyDeserializeMetadata[] = [
    { propertyName: "enabled", xmlOptions: { name: "Enabled" }, type: "primitive" },
    { propertyName: "days", xmlOptions: { name: "Days" }, type: "primitive" },
  ];
  return deserializeFromXml<RetentionPolicy>(xmlString, properties, "RetentionPolicy");
}

/** Request statistics grouped by API. */
export interface Metrics {
  /** The version of Analytics to configure. */
  version?: string;
  /** Indicates whether metrics are enabled for the Table service. */
  enabled: boolean;
  /** Indicates whether metrics should generate summary statistics for called API operations. */
  includeApis?: boolean;
  /** The retention policy. */
  retentionPolicy?: RetentionPolicy;
}

export function metricsSerializer(item: Metrics): any {
  return {
    version: item["version"],
    enabled: item["enabled"],
    IncludeAPIs: item["includeApis"],
    retentionPolicy: !item["retentionPolicy"]
      ? item["retentionPolicy"]
      : retentionPolicySerializer(item["retentionPolicy"]),
  };
}

export function metricsDeserializer(item: any): Metrics {
  return {
    version: item["version"],
    enabled: item["enabled"],
    includeApis: item["IncludeAPIs"],
    retentionPolicy: !item["retentionPolicy"]
      ? item["retentionPolicy"]
      : retentionPolicyDeserializer(item["retentionPolicy"]),
  };
}

function metricsFromXmlDeserializer(item: any): Metrics {
  return {
    version: item["Version"],
    enabled: item["Enabled"],
    includeApis: item["IncludeAPIs"],
    retentionPolicy: !item["RetentionPolicy"]
      ? item["RetentionPolicy"]
      : retentionPolicyFromXmlDeserializer(item["RetentionPolicy"]),
  };
}

export function metricsXmlSerializer(item: Metrics): string {
  const properties: XmlPropertyMetadata[] = [
    { propertyName: "version", xmlOptions: { name: "Version" }, type: "primitive" },
    { propertyName: "enabled", xmlOptions: { name: "Enabled" }, type: "primitive" },
    { propertyName: "includeApis", xmlOptions: { name: "IncludeAPIs" }, type: "primitive" },
    {
      propertyName: "retentionPolicy",
      xmlOptions: { name: "RetentionPolicy" },
      type: "object",
      serializer: retentionPolicySerializer,
    },
  ];
  return serializeToXml(item, properties, "Metrics");
}

export function metricsXmlDeserializer(xmlString: string): Metrics {
  const properties: XmlPropertyDeserializeMetadata[] = [
    { propertyName: "version", xmlOptions: { name: "Version" }, type: "primitive" },
    { propertyName: "enabled", xmlOptions: { name: "Enabled" }, type: "primitive" },
    { propertyName: "includeApis", xmlOptions: { name: "IncludeAPIs" }, type: "primitive" },
    {
      propertyName: "retentionPolicy",
      xmlOptions: { name: "RetentionPolicy" },
      type: "object",
      deserializer: retentionPolicyFromXmlDeserializer,
    },
  ];
  return deserializeFromXml<Metrics>(xmlString, properties, "Metrics");
}

export function corsRuleArraySerializer(result: Array<CorsRule>): any[] {
  return result.map((item) => {
    return corsRuleSerializer(item);
  });
}

export function corsRuleArrayDeserializer(result: Array<CorsRule>): any[] {
  return result.map((item) => {
    return corsRuleDeserializer(item);
  });
}

/** CORS is an HTTP feature that enables a web application running under one domain to access resources in another domain. Web browsers implement a security restriction known as same-origin policy that prevents a web page from calling APIs in a different domain; CORS provides a secure way to allow one domain (the origin domain) to call APIs in another domain. */
export interface CorsRule {
  /** The origin domains that are permitted to make a request against the service via CORS. */
  allowedOrigins: string;
  /** The methods (HTTP request verbs) that the origin domain may use for a CORS request. (comma separated) */
  allowedMethods: string;
  /** The request headers that the origin domain may specify on the CORS request. */
  allowedHeaders: string;
  /** The response headers that may be sent in the response to the CORS request and exposed by the browser to the request issuer. */
  exposedHeaders: string;
  /** The maximum amount time that a browser should cache the preflight OPTIONS request. */
  maxAgeInSeconds: number;
}

export function corsRuleSerializer(item: CorsRule): any {
  return {
    allowedOrigins: item["allowedOrigins"],
    allowedMethods: item["allowedMethods"],
    allowedHeaders: item["allowedHeaders"],
    exposedHeaders: item["exposedHeaders"],
    maxAgeInSeconds: item["maxAgeInSeconds"],
  };
}

export function corsRuleDeserializer(item: any): CorsRule {
  return {
    allowedOrigins: item["allowedOrigins"],
    allowedMethods: item["allowedMethods"],
    allowedHeaders: item["allowedHeaders"],
    exposedHeaders: item["exposedHeaders"],
    maxAgeInSeconds: item["maxAgeInSeconds"],
  };
}

function corsRuleFromXmlDeserializer(item: any): CorsRule {
  return {
    allowedOrigins: item["AllowedOrigins"],
    allowedMethods: item["AllowedMethods"],
    allowedHeaders: item["AllowedHeaders"],
    exposedHeaders: item["ExposedHeaders"],
    maxAgeInSeconds: item["MaxAgeInSeconds"],
  };
}

export function corsRuleXmlSerializer(item: CorsRule): string {
  const properties: XmlPropertyMetadata[] = [
    { propertyName: "allowedOrigins", xmlOptions: { name: "AllowedOrigins" }, type: "primitive" },
    { propertyName: "allowedMethods", xmlOptions: { name: "AllowedMethods" }, type: "primitive" },
    { propertyName: "allowedHeaders", xmlOptions: { name: "AllowedHeaders" }, type: "primitive" },
    { propertyName: "exposedHeaders", xmlOptions: { name: "ExposedHeaders" }, type: "primitive" },
    { propertyName: "maxAgeInSeconds", xmlOptions: { name: "MaxAgeInSeconds" }, type: "primitive" },
  ];
  return serializeToXml(item, properties, "CorsRule");
}

export function corsRuleXmlDeserializer(xmlString: string): CorsRule {
  const properties: XmlPropertyDeserializeMetadata[] = [
    { propertyName: "allowedOrigins", xmlOptions: { name: "AllowedOrigins" }, type: "primitive" },
    { propertyName: "allowedMethods", xmlOptions: { name: "AllowedMethods" }, type: "primitive" },
    { propertyName: "allowedHeaders", xmlOptions: { name: "AllowedHeaders" }, type: "primitive" },
    { propertyName: "exposedHeaders", xmlOptions: { name: "ExposedHeaders" }, type: "primitive" },
    { propertyName: "maxAgeInSeconds", xmlOptions: { name: "MaxAgeInSeconds" }, type: "primitive" },
  ];
  return deserializeFromXml<CorsRule>(xmlString, properties, "CorsRule");
}

/** Table Service error. */
export interface TableServiceError {
  /** The error message. */
  odataError?: TableServiceOdataError;
}

export function tableServiceErrorDeserializer(item: any): TableServiceError {
  if (!item) {
    return {};
  }
  return {
    odataError: !item["odata.error"]
      ? item["odata.error"]
      : tableServiceOdataErrorDeserializer(item["odata.error"]),
  };
}

/** OData error wrapper. */
export interface TableServiceOdataError {
  /** The error code. */
  code?: string;
  /** The error message. */
  message?: TableServiceOdataErrorMessage;
}

export function tableServiceOdataErrorDeserializer(item: any): TableServiceOdataError {
  return {
    code: item["code"],
    message: !item["message"]
      ? item["message"]
      : tableServiceOdataErrorMessageDeserializer(item["message"]),
  };
}

/** OData error message. */
export interface TableServiceOdataErrorMessage {
  /** The language of the error message. */
  lang?: string;
  /** The error message text. */
  value?: string;
}

export function tableServiceOdataErrorMessageDeserializer(
  item: any,
): TableServiceOdataErrorMessage {
  return {
    lang: item["lang"],
    value: item["value"],
  };
}

/** Stats for the service. */
export interface TableServiceStats {
  /** Geo-Replication information for the Secondary Storage Service. */
  geoReplication?: GeoReplication;
}

export function tableServiceStatsDeserializer(item: any): TableServiceStats {
  return {
    geoReplication: !item["geoReplication"]
      ? item["geoReplication"]
      : geoReplicationDeserializer(item["geoReplication"]),
  };
}

export function tableServiceStatsXmlDeserializer(xmlString: string): TableServiceStats {
  const properties: XmlPropertyDeserializeMetadata[] = [
    {
      propertyName: "geoReplication",
      xmlOptions: { name: "GeoReplication" },
      type: "object",
      deserializer: geoReplicationFromXmlDeserializer,
    },
  ];
  return deserializeFromXml<TableServiceStats>(xmlString, properties, "StorageServiceStats");
}

/** Geo-Replication information for the Secondary Storage Service. */
export interface GeoReplication {
  /** The status of the secondary location. */
  status: GeoReplicationStatusType;
  /** A GMT date/time value, to the second. All primary writes preceding this value are guaranteed to be available for read operations at the secondary. Primary writes after this point in time may or may not be available for reads. */
  lastSyncTime: Date;
}

export function geoReplicationDeserializer(item: any): GeoReplication {
  return {
    status: item["status"],
    lastSyncTime: new Date(item["lastSyncTime"]),
  };
}

function geoReplicationFromXmlDeserializer(item: any): GeoReplication {
  return {
    status: item["Status"],
    lastSyncTime: new Date(item["LastSyncTime"]),
  };
}

export function geoReplicationXmlDeserializer(xmlString: string): GeoReplication {
  const properties: XmlPropertyDeserializeMetadata[] = [
    { propertyName: "status", xmlOptions: { name: "Status" }, type: "primitive" },
    {
      propertyName: "lastSyncTime",
      xmlOptions: { name: "LastSyncTime" },
      type: "date",
      dateEncoding: "rfc7231",
    },
  ];
  return deserializeFromXml<GeoReplication>(xmlString, properties, "GeoReplication");
}

/** The status of the secondary location. */
export type GeoReplicationStatusType = "live" | "bootstrap" | "unavailable";

/** The properties for the table query response. */
export interface TableQueryResponse {
  /** The metadata response of the table. */
  odataMetadata?: string;
  /** List of tables. */
  value?: TableResponseProperties[];
}

export function tableQueryResponseDeserializer(item: any): TableQueryResponse {
  return {
    odataMetadata: item["odata.metadata"],
    value: !item["value"] ? item["value"] : tableResponsePropertiesArrayDeserializer(item["value"]),
  };
}

export function tableResponsePropertiesArrayDeserializer(
  result: Array<TableResponseProperties>,
): any[] {
  return result.map((item) => {
    return tableResponsePropertiesDeserializer(item);
  });
}

/** The properties for the table response. */
export interface TableResponseProperties {
  /** The name of the table. */
  tableName?: string;
  /** The odata type of the table. */
  odataType?: string;
  /** The id of the table. */
  odataId?: string;
  /** The edit link of the table. */
  odataEditLink?: string;
}

export function tableResponsePropertiesDeserializer(item: any): TableResponseProperties {
  return {
    tableName: item["TableName"],
    odataType: item["odata.type"],
    odataId: item["odata.id"],
    odataEditLink: item["odata.editLink"],
  };
}

/** The properties for creating a table. */
export interface TableProperties {
  /** The name of the table to create. */
  tableName?: string;
}

export function tablePropertiesSerializer(item: TableProperties): any {
  return { TableName: item["tableName"] };
}

/** The response for a single table. */
export interface TableResponse {
  /** The metadata response of the table. */
  odataMetadata?: string;
  /** The name of the table. */
  tableName?: string;
  /** The odata type of the table. */
  odataType?: string;
  /** The id of the table. */
  odataId?: string;
  /** The edit link of the table. */
  odataEditLink?: string;
}

export function tableResponseDeserializer(item: any): TableResponse {
  return {
    odataMetadata: item["odata.metadata"],
    tableName: item["TableName"],
    odataType: item["odata.type"],
    odataId: item["odata.id"],
    odataEditLink: item["odata.editLink"],
  };
}

/** The properties for the table entity query response. */
export interface TableEntityQueryResponse {
  /** The metadata response of the table. */
  odataMetadata?: string;
  /** List of table entities. */
  value?: TableEntityProperties[];
}

export function tableEntityQueryResponseDeserializer(item: any): TableEntityQueryResponse {
  return {
    odataMetadata: item["odata.metadata"],
    value: !item["value"] ? item["value"] : tableEntityPropertiesArrayDeserializer(item["value"]),
  };
}

export function tableEntityPropertiesArraySerializer(result: Array<TableEntityProperties>): any[] {
  return result.map((item) => {
    return tableEntityPropertiesSerializer(item);
  });
}

export function tableEntityPropertiesArrayDeserializer(
  result: Array<TableEntityProperties>,
): any[] {
  return result.map((item) => {
    return tableEntityPropertiesDeserializer(item);
  });
}

/** The other properties of the table entity. */
export interface TableEntityProperties {
  /** Additional properties */
  additionalProperties?: Record<string, any>;
}

export function tableEntityPropertiesSerializer(item: TableEntityProperties): any {
  return { ...serializeRecord(item.additionalProperties ?? {}) };
}

export function tableEntityPropertiesDeserializer(item: any): TableEntityProperties {
  if (!item) {
    return { additionalProperties: {} };
  }
  return {
    additionalProperties: serializeRecord(item, []),
  };
}

/** A signed identifier. */
export interface SignedIdentifier {
  /** A unique id. */
  id: string;
  /** The access policy. */
  accessPolicy?: AccessPolicy;
}

export function signedIdentifierSerializer(item: SignedIdentifier): any {
  return {
    id: item["id"],
    accessPolicy: !item["accessPolicy"]
      ? item["accessPolicy"]
      : accessPolicySerializer(item["accessPolicy"]),
  };
}

export function signedIdentifierDeserializer(item: any): SignedIdentifier {
  return {
    id: item["id"],
    accessPolicy: !item["accessPolicy"]
      ? item["accessPolicy"]
      : accessPolicyDeserializer(item["accessPolicy"]),
  };
}

export function signedIdentifierXmlSerializer(item: SignedIdentifier): string {
  const properties: XmlPropertyMetadata[] = [
    { propertyName: "id", xmlOptions: { name: "Id" }, type: "primitive" },
    {
      propertyName: "accessPolicy",
      xmlOptions: { name: "AccessPolicy" },
      type: "object",
      serializer: (ap: AccessPolicy) => ({
        Start: ap.start,
        Expiry: ap.expiry,
        Permission: ap.permission,
      }),
    },
  ];
  return serializeToXml(item, properties, "SignedIdentifier");
}

export function signedIdentifierXmlDeserializer(xmlString: string): SignedIdentifier {
  const properties: XmlPropertyDeserializeMetadata[] = [
    { propertyName: "id", xmlOptions: { name: "Id" }, type: "primitive" },
    {
      propertyName: "accessPolicy",
      xmlOptions: { name: "AccessPolicy" },
      type: "object",
      deserializer: accessPolicyFromXmlDeserializer,
    },
  ];
  return deserializeFromXml<SignedIdentifier>(xmlString, properties, "SignedIdentifier");
}

/** An Access policy. */
export interface AccessPolicy {
  /** The start datetime from which the policy is active. */
  start?: string;
  /** The datetime that the policy expires. */
  expiry?: string;
  /** The permissions for the acl policy. */
  permission?: string;
}

export function accessPolicySerializer(item: AccessPolicy): any {
  return { start: item["start"], expiry: item["expiry"], permission: item["permission"] };
}

export function accessPolicyDeserializer(item: any): AccessPolicy {
  return {
    start: item["start"],
    expiry: item["expiry"],
    permission: item["permission"],
  };
}

function accessPolicyFromXmlDeserializer(item: any): AccessPolicy {
  return {
    start: item["Start"],
    expiry: item["Expiry"],
    permission: item["Permission"],
  };
}

export function accessPolicyXmlSerializer(item: AccessPolicy): string {
  const properties: XmlPropertyMetadata[] = [
    { propertyName: "start", xmlOptions: { name: "Start" }, type: "primitive" },
    { propertyName: "expiry", xmlOptions: { name: "Expiry" }, type: "primitive" },
    { propertyName: "permission", xmlOptions: { name: "Permission" }, type: "primitive" },
  ];
  return serializeToXml(item, properties, "AccessPolicy");
}

export function accessPolicyXmlDeserializer(xmlString: string): AccessPolicy {
  const properties: XmlPropertyDeserializeMetadata[] = [
    { propertyName: "start", xmlOptions: { name: "Start" }, type: "primitive" },
    { propertyName: "expiry", xmlOptions: { name: "Expiry" }, type: "primitive" },
    { propertyName: "permission", xmlOptions: { name: "Permission" }, type: "primitive" },
  ];
  return deserializeFromXml<AccessPolicy>(xmlString, properties, "AccessPolicy");
}

/** The OData metadata format. */
export type OdataMetadataFormat =
  | "application/json;odata=fullmetadata"
  | "application/json;odata=minimalmetadata"
  | "application/json;odata=nometadata";

/** The Azure.Tables service versions. */
export enum KnownVersions {
  /** The 2019-02-02 version of the Azure.Tables service. */
  V20190202 = "2019-02-02",
}

export function signedIdentifierArraySerializer(result: Array<SignedIdentifier>): any[] {
  return result.map((item) => {
    return signedIdentifierSerializer(item);
  });
}

export function signedIdentifierArrayXmlSerializer(result: Array<SignedIdentifier>): string {
  const items = result.map((item) => signedIdentifierXmlSerializer(item)).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><SignedIdentifiers>${items}</SignedIdentifiers>`;
}

export function signedIdentifierArrayDeserializer(result: Array<SignedIdentifier>): any[] {
  return result.map((item) => {
    return signedIdentifierDeserializer(item);
  });
}

export function signedIdentifierArrayXmlDeserializer(xmlBody: any): SignedIdentifier[] {
  // Parse the XML response body containing SignedIdentifiers
  const parsed = typeof xmlBody === "string" ? parseXmlString(xmlBody) : xmlBody;
  if (!parsed) {
    return [];
  }
  // Navigate the XML structure: SignedIdentifiers may be wrapped in an array by the parser
  let root = parsed?.SignedIdentifiers ?? parsed;
  if (Array.isArray(root)) {
    root = root[0];
  }
  if (!root) {
    return [];
  }
  let items = root.SignedIdentifier ?? root;
  if (!items) {
    return [];
  }
  // Normalize single item to array
  if (!Array.isArray(items)) {
    items = [items];
  }
  return items.map((item: any) => {
    let ap = item.AccessPolicy;
    // AccessPolicy may be wrapped in array by XML parser
    if (Array.isArray(ap)) {
      ap = ap[0];
    }
    return {
      id: item.Id,
      accessPolicy: ap ? accessPolicyFromXmlDeserializer(ap) : undefined,
    };
  });
}
