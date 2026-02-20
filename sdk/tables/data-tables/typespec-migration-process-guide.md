# TypeSpec Migration Process Guide — Azure SDK for JS

A step-by-step guide for migrating an Azure SDK for JS package from AutoRest/Swagger to
TypeSpec-generated code, based on the `@azure/data-tables` migration experience.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites & Setup](#2-prerequisites--setup)
3. [Phase 1: Analyze the Existing Package](#3-phase-1-analyze-the-existing-package)
4. [Phase 2: Write TypeSpec](#4-phase-2-write-typespec)
5. [Phase 3: Generate JS Client Code](#5-phase-3-generate-js-client-code)
6. [Phase 4: Adapt Hand-Written Code](#6-phase-4-adapt-hand-written-code)
7. [Phase 5: Fix Build Errors](#7-phase-5-fix-build-errors)
8. [Phase 6: Fix Test Failures](#8-phase-6-fix-test-failures)
9. [Phase 7: Lint, Format, Clean Up](#9-phase-7-lint-format-clean-up)
10. [Known Emitter Issues & Workarounds](#10-known-emitter-issues--workarounds)
11. [Architecture Differences Reference](#11-architecture-differences-reference)
12. [Troubleshooting Playbook](#12-troubleshooting-playbook)

---

## 1. Overview

### What This Migration Involves

An Azure SDK for JS package typically has two layers:
- **Generated layer** (`src/generated/`): Auto-generated from a REST API spec
- **Hand-written layer** (`src/TableClient.ts`, etc.): Public API surface that wraps the generated code

The migration replaces the generated layer. The hand-written layer must be adapted to use
the new generated code's API surface, which changes significantly between AutoRest and TypeSpec.

### High-Level Steps

```
Swagger (OpenAPI 2.0)          TypeSpec (.tsp files)
         │                              │
    [AutoRest]                  [typespec-ts emitter]
         │                              │
    src/generated/              src/generated/
  (class-based client)        (functional client)
         │                              │
    Hand-written                Hand-written
    wrapper layer               wrapper layer
    (unchanged API)             (adapted internals)
```

### Key Decision: Keep Hand-Written Wrappers

For mature packages with stable public APIs, **keep the hand-written wrapper layer** and only
regenerate the `src/generated/` directory. This approach:
- Preserves the public API surface (no breaking changes for consumers)
- Limits changes to internal wiring
- Makes the migration testable against existing test suites

---

## 2. Prerequisites & Setup

### Tools Required

| Tool | Version Used | Purpose |
|------|-------------|---------|
| `@typespec/compiler` | 1.8.0 | Compiles TypeSpec files |
| `@azure-tools/typespec-ts` | 0.49.0 | Emits TypeScript client code |
| `@azure-tools/typespec-azure-core` | 0.64.0 | Azure-specific TypeSpec decorators |
| `@azure-tools/typespec-client-generator-core` | 0.64.4 | Client customization decorators |
| `@typespec/http`, `@typespec/rest` | 1.8.0 / 0.78.0 | HTTP/REST protocol bindings |
| `@typespec/xml` | 0.78.0 | XML serialization decorators (if needed) |
| `@typespec/versioning` | 0.78.0 | API versioning support |
| pnpm | 10.x | Package manager |

### Repository Layout

```
azure-rest-api-specs/
  specification/<service>/data-plane/Microsoft.<Service>/
    main.tsp
    models.tsp
    routes.tsp
    client.tsp
    tspconfig.yaml
    suppressions.yaml

azure-sdk-for-js/
  sdk/<service-dir>/<package-name>/
    tsp-location.yaml          ← Points to TypeSpec in azure-rest-api-specs
    src/generated/             ← Replaced by TypeSpec emitter output
    src/TableClient.ts         ← Hand-written wrapper (adapted)
    src/TableServiceClient.ts  ← Hand-written wrapper (adapted)
```

### Compilation Environment

The `tsp compile` command resolves emitters from the TypeSpec project directory. You need
a `node_modules` directory accessible from the spec directory containing the emitter package.

**Approach that worked:**

```bash
# Create a temp compilation environment
mkdir /tmp/tsp-gen && cd /tmp/tsp-gen
npm init -y
npm install @azure-tools/typespec-ts@0.49.0 \
  @azure-tools/typespec-azure-core@0.64.0 \
  @azure-tools/typespec-client-generator-core@0.64.4 \
  @typespec/compiler@1.8.0 @typespec/http@1.8.0 \
  @typespec/rest@0.78.0 @typespec/versioning@0.78.0 \
  @typespec/xml@0.78.0

# Symlink node_modules into the spec directory
ln -s /tmp/tsp-gen/node_modules \
  /path/to/azure-rest-api-specs/specification/.../Microsoft.Service/node_modules

# Compile
npx tsp compile /path/to/spec/main.tsp \
  --config /path/to/config.yaml
```

**Note**: `tsp-client` had issues resolving local spec repos (tried to git-clone relative
paths). Direct `tsp compile` was more reliable for local development.

---

## 3. Phase 1: Analyze the Existing Package

Before writing any TypeSpec, understand the existing package thoroughly.

### 3.1 Identify the Swagger Source

```bash
# Check autorest config or swagger reference
cat sdk/<package>/swagger/README.md
# Or find the input-file reference
grep -r "input-file" sdk/<package>/swagger/
```

### 3.2 Catalog All Operations

List every API operation from the Swagger. For `@azure/data-tables`, there were 14:

| Operation | HTTP | Content-Type | Notes |
|-----------|------|-------------|-------|
| getProperties | GET | XML | Service properties |
| setProperties | PUT | XML | Service properties |
| getStatistics | GET | XML | Service stats |
| query (tables) | GET | JSON | List tables |
| create (table) | POST | JSON | Create table |
| deleteTable | DELETE | JSON | Delete table |
| queryEntities | GET | JSON | List entities |
| queryEntitiesWithPartitionAndRowKey | GET | JSON | Get single entity |
| insertEntity | POST | JSON | Create entity |
| deleteEntity | DELETE | JSON | Delete entity |
| updateEntity | PUT | JSON | Replace entity |
| mergeEntity | PATCH | JSON | Merge entity |
| getAccessPolicy | GET | XML | ACL read |
| setAccessPolicy | PUT | XML | ACL write |

### 3.3 Identify Special Patterns

Look for these patterns that need special handling:
- **Mixed content types** (JSON + XML operations in the same API)
- **OData query parameters** (`$filter`, `$select`, `$top`)
- **SAS token authentication** (query string in endpoint URL)
- **Additional properties / open models** (entities with dynamic properties)
- **Continuation tokens** (in response headers, not body)
- **Custom serialization** (e.g., EDM types for Table entities)

### 3.4 Understand the Wrapper Layer

Map how the hand-written code calls the generated code:

```typescript
// OLD pattern (AutoRest):
this.client = new GeneratedClient(url, options);
await this.client.table.query({ queryOptions: { filter: "..." } });
await this.client.service.getProperties();

// NEW pattern (TypeSpec):
this.context = createTables(url, options);
await tableOpsQuery(this.context, { $filter: "..." });
await serviceGetProperties(this.context);
```

### 3.5 Back Up the Old Generated Code

```bash
cp -r src/generated src/generated.bak
```

This backup is invaluable for comparing old vs new type shapes during adaptation.

---

## 4. Phase 2: Write TypeSpec

### 4.1 File Structure

Create these files in `azure-rest-api-specs/specification/<service>/data-plane/Microsoft.<Service>/`:

#### `main.tsp` — Service definition and versioning

```typespec
import "@typespec/rest";
import "@typespec/versioning";
import "@azure-tools/typespec-azure-core";
import "./routes.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.Versioning;
using Azure.Core;

@service(#{ title: "Azure Table" })
@server("{url}", "Service endpoint", { url: url })
@versioned(Versions)
namespace Azure.Tables;

enum Versions { @useDependency(Azure.Core.Versions.v1_0_Preview_2) v2019_02_02: "2019-02-02" }
```

#### `models.tsp` — All request/response types

Key patterns:
- Use `@Xml.name("PascalCaseName")` for XML element mapping
- Use `@Xml.attribute` for XML attributes
- Use `Record<unknown>` for open/dynamic models (entity properties)

#### `routes.tsp` — All operations

Key patterns:
- Use **namespace grouping** to create operation groups:
  ```typespec
  namespace Service { ... }     // → generates service/ operations
  namespace TableOps { ... }    // → generates tableOps/ operations
  ```
- Use operation templates for common patterns (headers, query params)
- Specify `@header contentType: "application/xml"` for XML operations

#### `client.tsp` — Client customizations

Use `@@clientName` to rename generated artifacts to match existing code conventions:

```typespec
import "@azure-tools/typespec-client-generator-core";
using Azure.ClientGenerator.Core;

@@clientName(Azure.Tables, "GeneratedClient");
@@clientName(Azure.Tables.TableOps, "Table");
@@clientName(Azure.Tables.TableOps.deleteTable, "delete");
```

#### `tspconfig.yaml` — Emitter configuration

```yaml
parameters:
  "service-dir":
    default: "sdk/tables"
emit:
  - "@azure-tools/typespec-autorest"
options:
  "@azure-tools/typespec-ts":
    emitter-output-dir: "{output-dir}/{service-dir}/data-tables/src/generated"
    generate-metadata: false    # Don't generate package.json etc.
    generate-test: false        # Don't generate test scaffolding
    add-credentials: false      # Hand-written layer handles auth
    flavor: azure
```

### 4.2 Validate Compilation

```bash
npx tsp compile main.tsp
```

Address errors; warnings are acceptable. Common issues:
- Union response types (e.g., `201 | 204`) can't always be template arguments
- `void` can't be intersected with model types
- Naming convention warnings for non-PascalCase names

### 4.3 TypeSpec Patterns Learned

| Pattern | Solution |
|---------|----------|
| Multiple response codes | Use `union` or explicit `@statusCode` |
| XML + JSON mixed API | Use `@header contentType` per operation |
| OData query params | Name with `$` prefix: `@query("$filter")` |
| Open/dynamic models | Use `Record<unknown>` with `@Xml.name` |
| Void body in template | Don't intersect `void` with models; use separate op definitions |
| Suppressing linting | Add `suppressions.yaml` with rule/reason pairs |

---

## 5. Phase 3: Generate JS Client Code

### 5.1 Create tsp-location.yaml

In `sdk/<service-dir>/<package>/`:

```yaml
directory: specification/<service>/data-plane/Microsoft.<Service>
commit: <git-sha>
repo: Azure/azure-rest-api-specs
```

### 5.2 Run Code Generation

```bash
cd /tmp/tsp-gen
npx tsp compile /path/to/spec/main.tsp \
  --emit "@azure-tools/typespec-ts" \
  --option "@azure-tools/typespec-ts.emitter-output-dir=/path/to/sdk/src/generated" \
  --option "@azure-tools/typespec-ts.generate-metadata=false" \
  --option "@azure-tools/typespec-ts.generate-test=false" \
  --option "@azure-tools/typespec-ts.add-credentials=false" \
  --option "@azure-tools/typespec-ts.flavor=azure"
```

### 5.3 Expected Output Structure

```
src/generated/
  api/
    tablesContext.ts          ← createTables() factory + TablesContext type
    service/
      operations.ts           ← Service operation functions
      options.ts              ← Service operation options types
    tableOps/
      operations.ts           ← Table operation functions
      options.ts              ← Table operation options types
  classic/
    service/index.ts          ← ServiceOperations interface
    tableOps/index.ts         ← TableOpsOperations interface
  models/
    models.ts                 ← All TypeScript interfaces + serializers
  static-helpers/
    serialization/
      xml-helpers.ts          ← XML serialization utilities
      serialize-record.ts     ← Record serialization
    urlTemplate.ts            ← URL template expansion
  tablesClient.ts             ← TablesClient class (wrapper)
  index.ts                    ← Barrel exports
  logger.ts                   ← Logger instance
```

### 5.4 Review Generated Code Immediately

Before adapting anything, scan for obvious emitter issues:
1. Check URL templates for pre-encoded characters (`%24` instead of `$`)
2. Check XML operations — are they using XML or JSON serializers?
3. Check deserializer null safety
4. Check logger/user-agent naming (often derived from namespace, not package name)

---

## 6. Phase 4: Adapt Hand-Written Code

This is the most labor-intensive phase. The hand-written wrapper must be updated to use
the new generated code's API surface.

### 6.1 Update Dependencies

In `package.json`, add:
```json
{
  "dependencies": {
    "@azure-rest/core-client": "^2.3.1",
    "fast-xml-parser": "^5.2.0"
  }
}
```

Remove `@azure/core-client` only if no hand-written code still imports from it.

### 6.2 Client Construction

```typescript
// OLD:
import { GeneratedClient } from "./generated/generatedClient";
this.client = new GeneratedClient(url, pipeline);
this.table = this.client.table;

// NEW:
import { createTables, TablesContext } from "./generated/api/tablesContext";
import { query, create, ... } from "./generated/api/tableOps/operations";
this.context = createTables(url, { pipeline, ...options });
```

### 6.3 Operation Calls

```typescript
// OLD:
const result = await this.table.query({ queryOptions: { filter, top, select } });

// NEW:
const result = await query(this.context, { $filter: filter, $top: top, $select: select });
```

Key differences:
- Operations are standalone functions, not methods on a client object
- The context/client is the first argument
- Query options are flattened (not nested in `queryOptions`)
- OData params use `$` prefix
- Response headers are accessed differently

### 6.4 Response Header Extraction

```typescript
// OLD (headers were properties on the response):
const continuationToken = response.xMsContinuationNextTableName;

// NEW (headers come from the raw response):
const rawResponse = result as any;
const continuationToken = rawResponse.headers?.get("x-ms-continuation-NextTableName");
```

### 6.5 Model Type Mapping

Create backward-compatible type aliases in `generatedModels.ts`:

```typescript
// Re-export new types under old names
export { TableServiceProperties as ServiceProperties } from "./generated/models/models";

// For removed header types, create empty deprecated interfaces
/** @deprecated */
export interface TableQueryHeaders {}
```

### 6.6 Entity Properties Wrapping

If the API uses `Record<unknown>` / `additionalProperties`:

```typescript
// Sending entities — wrap in additionalProperties:
const body = { tableEntityProperties: { additionalProperties: serialize(entity) } };

// Receiving entities — unwrap from additionalProperties:
const entities = (response.value ?? []).map((e) => e.additionalProperties ?? e);
```

### 6.7 Transaction Handling

If the package uses batch/transaction requests with a custom `HttpClient`:
- Ensure `clientOptions.httpClient` is propagated to internal clients
- The dummy response status may need updating (e.g., 200 → 204) if the generated
  deserializer checks for specific status codes

### 6.8 Error Handling

```typescript
// OLD (RestError from @azure/core-client):
const parsedBody = error.response?.parsedBody;

// NEW (RestError from @azure-rest/core-client):
const details = (error as any).details;
// Or parse from error.message
```

---

## 7. Phase 5: Fix Build Errors

```bash
pnpm turbo build --filter=@azure/<package>... --token 1
```

Common build errors and fixes:
- **Missing imports**: Update import paths from old generated structure
- **Type mismatches**: Generated types use different names/shapes
- **OperationOptions incompatibility**: Old uses `@azure/core-client` OperationOptions,
  new uses `@azure-rest/core-client` OperationOptions — may need type assertions

---

## 8. Phase 6: Fix Test Failures

Run tests iteratively:

```bash
cd sdk/<service-dir>/<package>
TEST_MODE=playback pnpm test:node
```

### 8.1 Debugging Approach

1. Run the full test suite to get a failure count baseline
2. Group failures by symptom (URL errors, serialization errors, etc.)
3. Fix one category at a time, rebuild, re-test
4. Use the test proxy recordings to compare expected vs actual requests

### 8.2 Common Failure Categories (in order encountered)

#### A. URL Construction Failures

**Symptom**: 404 errors, malformed URLs in recordings  
**Causes**:
- SAS token query strings in endpoint URLs get misplaced
- OData `$` params double-encoded as `%2524`
- Single quotes in OData keys encoded as `%27`

**Fixes**:
- Core fix to `buildRequestUrl` for SAS token URLs (see below)
- Replace `%24` with `$` in URL templates
- Pass `requestOptions: { skipUrlEncoding: true }` for entity operations with OData keys

#### B. XML Serialization Failures

**Symptom**: Server rejects XML body, wrong content in recordings  
**Causes**:
- Emitter uses JSON serializers for XML operations
- XML element names need PascalCase, serializer outputs camelCase
- XML pretty-printing adds unwanted whitespace

**Fixes**:
- Write custom XML serializers (see generated-code-changes-report.md)
- Set `format: false` in xml-helpers.ts builder options
- Use PascalCase in custom serializer output objects

#### C. XML Deserialization Failures

**Symptom**: Parsed values are `undefined` or empty  
**Causes**:
- Emitter uses JSON deserializers (camelCase keys) for XML responses (PascalCase keys)
- fast-xml-parser wraps elements in arrays: `{ Root: [{ Child: [...] }] }`

**Fixes**:
- Write `*FromXmlDeserializer` functions using PascalCase keys
- Navigate array wrapping: `let root = parsed.Root; if (Array.isArray(root)) root = root[0];`

#### D. Null Body Crashes

**Symptom**: `Cannot read properties of null` in deserializers  
**Causes**:
- Error responses may have no body
- `prefer: return-no-content` header causes empty response body

**Fixes**:
- Add `if (!item) return defaultValue;` guards to deserializers

#### E. Request/Response Shape Mismatches

**Symptom**: Missing data, wrong field names  
**Causes**:
- additionalProperties wrapping/unwrapping needed for open models
- Nested query options (old: `{ queryOptions: { filter } }` → new: `{ $filter }`)
- Response headers accessed differently

**Fixes**:
- Wrap entities: `{ additionalProperties: data }`
- Flatten query options in hand-written code
- Use raw response header access

#### F. Infrastructure Mismatches

**Symptom**: Various failures in auth, headers, error handling  
**Causes**:
- Different header injection mechanism (old: `customHeaders`, new: `headers`)
- Different error shape (old: `response.parsedBody`, new: `details`)
- Custom httpClient not propagated

**Fixes**:
- Set both `customHeaders` and `headers` via type assertion
- Update error extraction logic
- Pass `clientOptions` through to internal clients

---

## 9. Phase 7: Lint, Format, Clean Up

```bash
cd sdk/<service-dir>/<package>
npx prettier --write "src/**/*.ts"
# pnpm lint  (if configured)
```

Clean up:
- Remove `src/generated.bak/` after confirming all tests pass
- Remove `node_modules` symlink from the spec directory
- Clean up temp compilation environment

---

## 10. Known Emitter Issues & Workarounds

As of `@azure-tools/typespec-ts@0.49.0`:

| Issue | Impact | Workaround |
|-------|--------|------------|
| `$` pre-encoded as `%24` in URL templates | OData params double-encoded | Find/replace in operations.ts |
| XML ops use JSON serializers for request bodies | Server rejects body | Write custom XML serializer functions |
| XML ops use JSON deserializers for responses | Response parsing fails | Write `*FromXml` deserializer functions with PascalCase keys |
| XML nested deserializers use camelCase keys | Fields are `undefined` | Create parallel `*FromXmlDeserializer` functions |
| fast-xml-parser wraps elements in arrays | Array navigation fails | Check `Array.isArray()` and unwrap at each level |
| Deserializers crash on null input | Runtime errors on empty responses | Add null guards |
| XML builder defaults to `format: true` | Whitespace mismatches | Set `format: false` in xml-helpers.ts |
| Logger/user-agent from namespace not package | Wrong telemetry names | Manual rename in logger.ts and tablesContext.ts |

---

## 11. Architecture Differences Reference

| Aspect | AutoRest (Old) | TypeSpec (New) |
|--------|---------------|----------------|
| Core package | `@azure/core-client` | `@azure-rest/core-client` |
| Client pattern | `class GeneratedClient extends ServiceClient` | `createTables()` → `TablesContext` |
| Operation pattern | `client.operationGroup.method()` | `standalone_function(context, ...)` |
| Operation groups | Class properties (`.table`, `.service`) | Namespace-based (`tableOps/`, `service/`) |
| XML handling | `parseXML`/`stringifyXML` passed as options | Built-in serializers using `fast-xml-parser` |
| Response headers | Flattened properties on response | Raw `headers.get("name")` |
| Query options | Nested: `{ queryOptions: { filter } }` | Flat: `{ $filter: "..." }` |
| URL templates | Pre-built by AutoRest | `expandUrlTemplate()` with RFC 6570 |
| Error type | `RestError` with `response.parsedBody` | `RestError` with `details` |
| OperationOptions | From `@azure/core-client` | From `@azure-rest/core-client` |

---

## 12. Troubleshooting Playbook

### "404 Not Found" in recordings

1. Compare the generated URL against the recording file
2. Check for `%24` (should be `$`), `%27` (should be `'`), or misplaced query strings
3. Check if `skipUrlEncoding` is needed for the operation

### "Request body doesn't match recording"

1. Check if the operation sends XML — is it using a JSON serializer?
2. Compare XML element names (PascalCase vs camelCase)
3. Check XML declaration header (`<?xml ...?>`)
4. Check for whitespace/formatting differences

### "Response parsing returns undefined/empty"

1. Log the raw response body: `console.log(JSON.stringify(result.body))`
2. For XML: parse and log the structure to see array wrapping
3. Check if the deserializer uses camelCase keys for XML data (should be PascalCase)
4. Check null guards in deserializers

### "TypeError: Cannot read properties of null"

1. Check if the response body is null/undefined
2. Add null guard: `if (!item) return defaultValue;`
3. Check if `prefer: return-no-content` is set

### "SAS token appears after path in URL"

1. This is a core issue in `ts-http-runtime/urlHelpers.ts`
2. The `buildRequestUrl` function needs to strip endpoint query params, build the path
   URL, then re-prepend them
3. See the core change documented in `generated-code-changes-report.md`

### Build error: "Type X is not assignable to type Y"

1. Check if the hand-written code imports from `@azure/core-client` but generated code
   uses `@azure-rest/core-client` — types may have the same name but different shapes
2. Use type assertions `as any` sparingly for bridging incompatibilities
3. Check if `OperationOptions` needs to come from a different package

---

## Appendix: Files Modified in data-tables Migration

### TypeSpec Files Created (in azure-rest-api-specs)

| File | Lines | Purpose |
|------|-------|---------|
| `main.tsp` | 29 | Service definition, versioning, imports |
| `models.tsp` | 373 | All request/response model types |
| `routes.tsp` | 528 | 14 API operations in 2 namespace groups |
| `client.tsp` | 11 | @@clientName customizations |
| `tspconfig.yaml` | 25 | Emitter configuration |
| `suppressions.yaml` | 5 | Linting suppressions |

### Hand-Written Files Modified (in azure-sdk-for-js)

| File | Change Summary |
|------|---------------|
| `TableClient.ts` | Replaced GeneratedClient with TablesContext; updated all operation calls |
| `TableServiceClient.ts` | Same pattern as TableClient; flattened queryOptions |
| `TableTransaction.ts` | Updated sendRequest interface |
| `generatedModels.ts` | Backward-compatible type aliases |
| `serialization.ts` | Local QueryOptions interface |
| `models.ts` | Updated imports |
| `TablePolicies.ts` | Dummy response status 200→204 |
| `secondaryEndpointPolicy.ts` | Dual header format support |
| `errorHelpers.ts` | New RestError shape handling |
| `package.json` | Added @azure-rest/core-client, fast-xml-parser |

### Generated Files Manually Fixed

| File | Fixes Applied |
|------|--------------|
| `api/tableOps/operations.ts` | `%24`→`$`; XML serializer/deserializer swap |
| `api/service/operations.ts` | Formatting only |
| `api/tablesContext.ts` | User-agent string |
| `models/models.ts` | 6 XML deserializers, 2 null guards, XML serializer, XML array ser/deser |
| `static-helpers/serialization/xml-helpers.ts` | `format: false` |
| `logger.ts` | Logger name |

### Core Change

| File | Change |
|------|--------|
| `ts-http-runtime/src/client/urlHelpers.ts` | SAS token URL construction fix |
| `ts-http-runtime/test/client/urlHelpers.spec.ts` | 3 new test cases |

### Stats

- Total lines changed in azure-sdk-for-js: +370 / -3,773
- Generated code manual fixes: ~100 substantive lines added
- Hand-written code adapted: ~200 lines changed across 10 files
- Core change: 27 lines + 37 lines of tests
- All 135 tests pass, 0 failures
