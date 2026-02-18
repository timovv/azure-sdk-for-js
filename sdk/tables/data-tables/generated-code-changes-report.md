# Generated Code Changes Report — @azure/data-tables TypeSpec Migration

This document records all manual modifications made to the TypeSpec-emitted generated code
in `sdk/tables/data-tables/src/generated/` after initial code generation. These changes were
necessary to fix emitter bugs and behavioral mismatches between the old AutoRest-generated
code and the new TypeSpec-emitted code.

A core change to `ts-http-runtime` was also required and is documented at the end.

**Emitter**: `@azure-tools/typespec-ts@0.49.0`  
**TypeSpec compiler**: `@typespec/compiler@1.8.0`  
**Date**: 2026-02-17  
**Test results**: 135 passed, 263 skipped, 0 failed

---

## Table of Contents

1. [OData Query Parameter Encoding (`$` pre-encoding)](#1-odata-query-parameter-encoding)
2. [XML Serialization — Access Policy Body (JSON instead of XML)](#2-xml-serialization--access-policy-body)
3. [XML Deserialization — PascalCase Key Mismatch](#3-xml-deserialization--pascalcase-key-mismatch)
4. [XML Deserialization — Array Wrapping by fast-xml-parser](#4-xml-deserialization--array-wrapping)
5. [XML Builder — Pretty-Print Whitespace](#5-xml-builder--pretty-print-whitespace)
6. [Null Body Crash in Deserializers](#6-null-body-crash-in-deserializers)
7. [Access Policy XML Serializer — PascalCase Element Names](#7-access-policy-xml-serializer--pascalcase-element-names)
8. [Logger and User-Agent Naming](#8-logger-and-user-agent-naming)
9. [Formatting — Method Chain Wrapping](#9-formatting--method-chain-wrapping)
10. [Core Change — SAS Token URL Construction](#10-core-change--sas-token-url-construction)
11. [Emitter Bugs Summary (for filing)](#11-emitter-bugs-summary)

---

## 1. OData Query Parameter Encoding

**File**: `src/generated/api/tableOps/operations.ts`  
**Issue**: The emitter pre-encodes `$` as `%24` in URL template variable names and template strings.
OData query parameters like `$filter`, `$select`, `$top`, and `$format` are emitted as `%24filter`, etc.
The `expandUrlTemplate` function then double-encodes them, resulting in malformed URLs.

**Root Cause**: The emitter treats `$` as a special character needing percent-encoding in URL
templates, but RFC 6570 URL templates should contain the literal `$` character.

**Fix**: Replaced all `%24` with `$` in URL template strings and variable names across all
operations that use OData query parameters (7 operations affected).

```diff
 const path = expandUrlTemplate(
-    "/{table}(){?timeout,%24format,%24top,%24select,%24filter,NextPartitionKey,NextRowKey}",
+    "/{table}(){?timeout,$format,$top,$select,$filter,NextPartitionKey,NextRowKey}",
     {
       table: table,
       timeout: options?.timeout,
-      "%24format": options?.format,
-      "%24top": options?.top,
-      "%24select": options?.select,
-      "%24filter": options?.filter,
+      $format: options?.format,
+      $top: options?.top,
+      $select: options?.select,
+      $filter: options?.filter,
```

---

## 2. XML Serialization — Access Policy Body

**File**: `src/generated/api/tableOps/operations.ts`, `src/generated/models/models.ts`  
**Issue**: The `setAccessPolicy` operation sends an XML body (`Content-Type: application/xml`),
but the emitter wires it to `signedIdentifierArraySerializer` which produces a JSON object,
not an XML string.

**Root Cause**: The emitter does not distinguish between JSON and XML serialization for
request bodies. It generates the same JSON serializer for all operations regardless of
content type.

**Fix**: Created `signedIdentifierArrayXmlSerializer` in models.ts that produces proper XML
with the correct `<?xml ...?>` header, and updated operations.ts to use it.

```diff
 // In operations.ts:
-  signedIdentifierArraySerializer,
-  signedIdentifierArrayDeserializer,
+  signedIdentifierArrayXmlSerializer,
+  signedIdentifierArrayXmlDeserializer,

 // setAccessPolicy body:
       body: !options["tableAcl"]
         ? options["tableAcl"]
-        : signedIdentifierArraySerializer(options["tableAcl"]),
+        : signedIdentifierArrayXmlSerializer(options["tableAcl"]),

 // In models.ts — new function:
+export function signedIdentifierArrayXmlSerializer(result: Array<SignedIdentifier>): string {
+  const items = result.map((item) => signedIdentifierXmlSerializer(item)).join("");
+  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><SignedIdentifiers>${items}</SignedIdentifiers>`;
+}
```

---

## 3. XML Deserialization — PascalCase Key Mismatch

**File**: `src/generated/models/models.ts`  
**Issue**: The emitter generates JSON-style deserializers that access properties using
camelCase keys (e.g., `item["version"]`, `item["enabled"]`). However, when XML is parsed
by fast-xml-parser, the resulting object uses PascalCase element names
(e.g., `item["Version"]`, `item["Enabled"]`) matching the original XML element names.

**Root Cause**: The emitter's `deserializeFromXml` metadata correctly specifies PascalCase
in `xmlOptions.name`, but nested object deserializers are the standard JSON deserializers
that use camelCase property access.

**Fix**: Created `*FromXmlDeserializer` functions for all XML model types that use
PascalCase keys, and replaced the JSON deserializer references in XML metadata:

```diff
 // Replace JSON deserializers with XML-aware ones in all XML metadata:
-      deserializer: loggingDeserializer,
+      deserializer: loggingFromXmlDeserializer,
-      deserializer: metricsDeserializer,
+      deserializer: metricsFromXmlDeserializer,
-      deserializer: corsRuleDeserializer,
+      deserializer: corsRuleFromXmlDeserializer,
-      deserializer: retentionPolicyDeserializer,
+      deserializer: retentionPolicyFromXmlDeserializer,
-      deserializer: geoReplicationDeserializer,
+      deserializer: geoReplicationFromXmlDeserializer,
-      deserializer: accessPolicyDeserializer,
+      deserializer: accessPolicyFromXmlDeserializer,

 // Example new function:
+function loggingFromXmlDeserializer(item: any): Logging {
+  return {
+    version: item["Version"],
+    delete: item["Delete"],
+    read: item["Read"],
+    write: item["Write"],
+    retentionPolicy: retentionPolicyFromXmlDeserializer(item["RetentionPolicy"]),
+  };
+}
```

New deserializer functions added:
- `loggingFromXmlDeserializer`
- `retentionPolicyFromXmlDeserializer`
- `metricsFromXmlDeserializer`
- `corsRuleFromXmlDeserializer`
- `geoReplicationFromXmlDeserializer`
- `accessPolicyFromXmlDeserializer`

---

## 4. XML Deserialization — Array Wrapping

**File**: `src/generated/models/models.ts`, `src/generated/api/tableOps/operations.ts`  
**Issue**: The `getAccessPolicy` response returns XML containing `<SignedIdentifiers>` with
child `<SignedIdentifier>` elements. The emitter generates `signedIdentifierArrayDeserializer`
which expects a JSON array, but the response is XML.

Additionally, fast-xml-parser wraps all elements in arrays (due to its `isArray` configuration),
so the parsed structure is `{ SignedIdentifiers: [{ SignedIdentifier: [...] }] }` rather than
the flat `{ SignedIdentifiers: { SignedIdentifier: [...] } }`.

**Root Cause**: The emitter does not generate XML-aware array deserializers. The XML parser's
array-wrapping behavior adds another layer of nesting that must be navigated.

**Fix**: Created `signedIdentifierArrayXmlDeserializer` that handles both raw XML strings
and pre-parsed objects, navigates the array-wrapped structure, and normalizes single items
to arrays:

```diff
 // In operations.ts:
-  return signedIdentifierArrayDeserializer(result.body);
+  return signedIdentifierArrayXmlDeserializer(result.body);

 // In models.ts — new function:
+export function signedIdentifierArrayXmlDeserializer(xmlBody: any): SignedIdentifier[] {
+  const parsed = typeof xmlBody === "string" ? parseXmlString(xmlBody) : xmlBody;
+  if (!parsed) { return []; }
+  // Navigate array-wrapped structure
+  let root = parsed?.SignedIdentifiers ?? parsed;
+  if (Array.isArray(root)) { root = root[0]; }
+  if (!root) { return []; }
+  let items = root.SignedIdentifier ?? root;
+  if (!items) { return []; }
+  if (!Array.isArray(items)) { items = [items]; }
+  return items.map((item: any) => {
+    let ap = item.AccessPolicy;
+    if (Array.isArray(ap)) { ap = ap[0]; }
+    return {
+      id: item.Id,
+      accessPolicy: ap ? accessPolicyFromXmlDeserializer(ap) : undefined,
+    };
+  });
+}
```

---

## 5. XML Builder — Pretty-Print Whitespace

**File**: `src/generated/static-helpers/serialization/xml-helpers.ts`  
**Issue**: The XML builder has `format: true` which adds whitespace/newlines between XML
elements. The old `@azure/core-xml` produced compact XML without formatting. The test
recordings expect compact XML.

**Fix**: Changed `format: true` → `format: false`:

```diff
-  format: true,
+  format: false,
```

---

## 6. Null Body Crash in Deserializers

**File**: `src/generated/models/models.ts`  
**Issue**: Two deserializers crash when called with `null` or `undefined` body:
- `tableServiceErrorDeserializer` — called when error response has no body
- `tableEntityPropertiesDeserializer` — called when `prefer: return-no-content` header is set

**Root Cause**: The emitter does not generate null guards for deserializer functions.

**Fix**: Added null checks at the top of both functions:

```diff
 export function tableServiceErrorDeserializer(item: any): TableServiceError {
+  if (!item) {
+    return {};
+  }

 export function tableEntityPropertiesDeserializer(item: any): TableEntityProperties {
+  if (!item) {
+    return { additionalProperties: {} };
+  }
```

---

## 7. Access Policy XML Serializer — PascalCase Element Names

**File**: `src/generated/models/models.ts`  
**Issue**: The `signedIdentifierXmlSerializer` uses `accessPolicySerializer` for the nested
AccessPolicy object. This JSON serializer produces `{ start, expiry, permission }` (camelCase),
but the XML elements must be `<Start>`, `<Expiry>`, `<Permission>` (PascalCase) to match
the Azure Table Storage API.

**Fix**: Replaced the JSON serializer reference with an inline PascalCase object mapper:

```diff
       type: "object",
-      serializer: accessPolicySerializer,
+      serializer: (ap: AccessPolicy) => ({
+        Start: ap.start,
+        Expiry: ap.expiry,
+        Permission: ap.permission,
+      }),
```

---

## 8. Logger and User-Agent Naming

**Files**: `src/generated/logger.ts`, `src/generated/api/tablesContext.ts`  
**Issue**: The emitter derives the logger name and user-agent string from the TypeSpec
namespace name (`AzureTable`), but the package is named `data-tables`.

**Fix**: Changed to match existing conventions:

```diff
 // logger.ts:
-export const logger = createClientLogger("AzureTable");
+export const logger = createClientLogger("data-tables");

 // tablesContext.ts:
-  const userAgentInfo = `azsdk-js-AzureTable/1.0.0-beta.1`;
+  const userAgentInfo = `azsdk-js-data-tables/1.0.0-beta.1`;
```

---

## 9. Formatting — Method Chain Wrapping

**File**: `src/generated/api/tableOps/operations.ts`, `src/generated/api/service/operations.ts`  
**Issue**: The emitter produces `context\n.path(path)\n.get({...})` with line breaks in the
method chain. Prettier reformats this to `context.path(path).get({...})` on a single line.

**Impact**: Purely cosmetic; no functional change. This accounts for the majority of the
line-count diff but has no behavioral effect.

---

## 10. Core Change — SAS Token URL Construction

**File**: `sdk/core/ts-http-runtime/src/client/urlHelpers.ts`  
**Test file**: `sdk/core/ts-http-runtime/test/client/urlHelpers.spec.ts`

**Issue**: When the endpoint URL contains query parameters (SAS token), `buildRequestUrl`
appends the route path *after* the query string, producing invalid URLs like:
`https://account.table.core.windows.net?sv=2021&sig=xxx/Tables`

**Root Cause**: `buildRequestUrl` does `${endpoint}/${routePath}` which concatenates the
route after the full endpoint including its query string.

**Fix**: Strip query params from the endpoint before concatenation, build the path URL,
then prepend the endpoint query params before the operation query params:

```diff
   endpoint = buildBaseUrl(endpoint, options);
   routePath = buildRoutePath(routePath, pathParameters, options);
+
+  // If the endpoint contains a query string (e.g. SAS token), parse it out
+  let endpointQuery = "";
+  const qIndex = endpoint.indexOf("?");
+  if (qIndex !== -1) {
+    endpointQuery = endpoint.substring(qIndex + 1);
+    endpoint = endpoint.substring(0, qIndex);
+  }
+
   const requestUrl = appendQueryParams(`${endpoint}/${routePath}`, options);
   const url = new URL(requestUrl);
+
+  // Prepend the original endpoint query params
+  if (endpointQuery) {
+    const operationParams = url.search;
+    url.search = endpointQuery;
+    if (operationParams) {
+      const opParamsStr = operationParams.startsWith("?")
+        ? operationParams.substring(1) : operationParams;
+      if (opParamsStr) { url.search += "&" + opParamsStr; }
+    }
+  }
```

**Tests added**: 3 new test cases verifying:
1. Endpoint with query string places path before query params
2. Endpoint query params merge correctly with route query params
3. Endpoint query string works with path parameters

All 33 URL helper tests pass.

---

## 11. Emitter Bugs Summary

These issues should be filed against `@azure-tools/typespec-ts`:

| # | Bug | Severity | Workaround Applied |
|---|-----|----------|--------------------|
| 1 | `$` pre-encoded to `%24` in URL template variable names | High | Manual find/replace in operations.ts |
| 2 | XML operations use JSON serializers for request bodies | High | Custom `signedIdentifierArrayXmlSerializer` |
| 3 | XML operations use JSON serializers for response bodies | High | Custom `signedIdentifierArrayXmlDeserializer` |
| 4 | Nested XML deserializers use camelCase keys instead of PascalCase | High | Six `*FromXmlDeserializer` functions |
| 5 | Deserializers don't handle null/undefined input | Medium | Null guards in 2 deserializers |
| 6 | XML AccessPolicy serializer uses camelCase element names | Medium | Inline PascalCase serializer |
| 7 | XML builder defaults to `format: true` (pretty-print) | Low | Set `format: false` |
| 8 | Logger/user-agent derived from TypeSpec namespace not package name | Low | Manual rename |

---

## Full Diff: Generated Code (Emitter Output vs. Modified)

Below is the complete diff between the raw emitter output and the final modified code,
excluding whitespace-only formatting changes from Prettier.

<details>
<summary>Click to expand full diff (595 lines)</summary>

```diff
diff -ru --ignore-all-space /tmp/tsp-tables-regen/src/api/tableOps/operations.ts sdk/tables/data-tables/src/generated/api/tableOps/operations.ts
--- /tmp/tsp-tables-regen/src/api/tableOps/operations.ts
+++ sdk/tables/data-tables/src/generated/api/tableOps/operations.ts
@@ -16,8 +16,8 @@
   tableEntityPropertiesSerializer,
   tableEntityPropertiesDeserializer,
   SignedIdentifier,
-  signedIdentifierArraySerializer,
-  signedIdentifierArrayDeserializer,
+  signedIdentifierArrayXmlSerializer,
+  signedIdentifierArrayXmlDeserializer,
 } from "../../models/models.js";

@@ -69,7 +67,7 @@
       body: !options["tableAcl"]
         ? options["tableAcl"]
-        : signedIdentifierArraySerializer(options["tableAcl"]),
+        : signedIdentifierArrayXmlSerializer(options["tableAcl"]),

@@ -135,7 +131,7 @@
-  return signedIdentifierArrayDeserializer(result.body);
+  return signedIdentifierArrayXmlDeserializer(result.body);

@@ -154,7 +150,7 @@
-    "/{table}{?timeout,%24format}",
+    "/{table}{?timeout,$format}",
-      "%24format": options?.format,
+      $format: options?.format,

@@ -219,7 +213,7 @@
-    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,%24format}",
+    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,$format}",
-      "%24format": options?.format,
+      $format: options?.format,

@@ -281,7 +273,7 @@  (mergeEntity)
-    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,%24format}",
+    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,$format}",
-      "%24format": options?.format,
+      $format: options?.format,

@@ -346,7 +336,7 @@  (updateEntity)
-    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,%24format}",
+    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,$format}",
-      "%24format": options?.format,
+      $format: options?.format,

@@ -411,10 +399,10 @@  (queryEntitiesWithPartitionAndRowKey)
-    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,%24format,%24select,%24filter}",
+    "/{table}(PartitionKey='{partitionKey}',RowKey='{rowKey}'){?timeout,$format,$select,$filter}",
-      "%24format": options?.format,
-      "%24select": options?.select,
-      "%24filter": options?.filter,
+      $format: options?.format,
+      $select: options?.select,
+      $filter: options?.filter,

@@ -480,11 +466,11 @@  (queryEntities)
-    "/{table}(){?timeout,%24format,%24top,%24select,%24filter,NextPartitionKey,NextRowKey}",
+    "/{table}(){?timeout,$format,$top,$select,$filter,NextPartitionKey,NextRowKey}",
-      "%24format": options?.format,
-      "%24top": options?.top,
-      "%24select": options?.select,
-      "%24filter": options?.filter,
+      $format: options?.format,
+      $top: options?.top,
+      $select: options?.select,
+      $filter: options?.filter,

@@ -591,5 +573,5 @@  (create table)
-    "/Tables{?%24format}",
+    "/Tables{?$format}",
-      "%24format": options?.format,
+      $format: options?.format,

@@ -646,8 +626,8 @@  (query tables)
-    "/Tables{?%24format,%24top,%24select,%24filter,NextTableName}",
+    "/Tables{?$format,$top,$select,$filter,NextTableName}",
-      "%24format": options?.format,
-      "%24top": options?.top,
-      "%24select": options?.select,
-      "%24filter": options?.filter,
+      $format: options?.format,
+      $top: options?.top,
+      $select: options?.select,
+      $filter: options?.filter,
```

```diff
diff -ru --ignore-all-space /tmp/tsp-tables-regen/src/api/tablesContext.ts sdk/tables/data-tables/src/generated/api/tablesContext.ts
-  const userAgentInfo = `azsdk-js-AzureTable/1.0.0-beta.1`;
+  const userAgentInfo = `azsdk-js-data-tables/1.0.0-beta.1`;
```

```diff
diff -ru --ignore-all-space /tmp/tsp-tables-regen/src/logger.ts sdk/tables/data-tables/src/generated/logger.ts
-export const logger = createClientLogger("AzureTable");
+export const logger = createClientLogger("data-tables");
```

```diff
diff -ru --ignore-all-space /tmp/tsp-tables-regen/src/models/models.ts sdk/tables/data-tables/src/generated/models/models.ts

+  parseXmlString,  (added import)

 // XML deserializer replacements (6 occurrences):
-      deserializer: loggingDeserializer,
+      deserializer: loggingFromXmlDeserializer,
-      deserializer: metricsDeserializer,
+      deserializer: metricsFromXmlDeserializer,
-      deserializer: corsRuleDeserializer,
+      deserializer: corsRuleFromXmlDeserializer,
-      deserializer: retentionPolicyDeserializer,
+      deserializer: retentionPolicyFromXmlDeserializer,
-      deserializer: geoReplicationDeserializer,
+      deserializer: geoReplicationFromXmlDeserializer,
-      deserializer: accessPolicyDeserializer,
+      deserializer: accessPolicyFromXmlDeserializer,

 // New *FromXml deserializer functions (6 functions, ~60 lines total)
+function loggingFromXmlDeserializer(item: any): Logging { ... }
+function retentionPolicyFromXmlDeserializer(item: any): RetentionPolicy { ... }
+function metricsFromXmlDeserializer(item: any): Metrics { ... }
+function corsRuleFromXmlDeserializer(item: any): CorsRule { ... }
+function geoReplicationFromXmlDeserializer(item: any): GeoReplication { ... }
+function accessPolicyFromXmlDeserializer(item: any): AccessPolicy { ... }

 // Null guards:
+  if (!item) { return {}; }                          // tableServiceErrorDeserializer
+  if (!item) { return { additionalProperties: {} }; } // tableEntityPropertiesDeserializer

 // AccessPolicy XML serializer fix:
-      serializer: accessPolicySerializer,
+      serializer: (ap: AccessPolicy) => ({
+        Start: ap.start, Expiry: ap.expiry, Permission: ap.permission,
+      }),

 // New XML array serializer/deserializer:
+export function signedIdentifierArrayXmlSerializer(result: Array<SignedIdentifier>): string { ... }
+export function signedIdentifierArrayXmlDeserializer(xmlBody: any): SignedIdentifier[] { ... }
```

```diff
diff -ru --ignore-all-space /tmp/tsp-tables-regen/src/static-helpers/serialization/xml-helpers.ts
-  format: true,
+  format: false,
```

</details>
