/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import * as coreRestPipeline from "@azure/core-rest-pipeline";
import {
  PathCreateOptionalParams,
  PathCreateResponse,
  PathUpdateAction,
  PathSetAccessControlRecursiveMode,
  PathUpdateOptionalParams,
  PathUpdateResponse,
  PathLeaseAction,
  PathLeaseOptionalParams,
  PathLeaseResponse,
  PathReadOptionalParams,
  PathReadResponse,
  PathGetPropertiesOptionalParams,
  PathGetPropertiesResponse,
  PathDeleteOptionalParams,
  PathDeleteResponse,
  PathSetAccessControlOptionalParams,
  PathSetAccessControlResponse,
  PathSetAccessControlRecursiveOptionalParams,
  PathSetAccessControlRecursiveResponse,
  PathFlushDataOptionalParams,
  PathFlushDataResponse,
  PathAppendDataOptionalParams,
  PathAppendDataResponse,
  PathExpiryOptions,
  PathSetExpiryOptionalParams,
  PathSetExpiryResponse,
  PathUndeleteOptionalParams,
  PathUndeleteResponse
} from "../models/index.js";

/** Interface representing a PathOperations. */
export interface PathOperations {
  /**
   * Create or rename a file or directory.    By default, the destination is overwritten and if the
   * destination already exists and has a lease the lease is broken.  This operation supports conditional
   * HTTP requests.  For more information, see [Specifying Conditional Headers for Blob Service
   * Operations](https://docs.microsoft.com/en-us/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).
   *  To fail if the destination already exists, use a conditional request with If-None-Match: "*".
   * @param options The options parameters.
   */
  create(options?: PathCreateOptionalParams): Promise<PathCreateResponse>;
  /**
   * Uploads data to be appended to a file, flushes (writes) previously uploaded data to a file, sets
   * properties for a file or directory, or sets access control for a file or directory. Data can only be
   * appended to a file. Concurrent writes to the same file using multiple clients are not supported.
   * This operation supports conditional HTTP requests. For more information, see [Specifying Conditional
   * Headers for Blob Service
   * Operations](https://docs.microsoft.com/en-us/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).
   * @param action The action must be "append" to upload data to be appended to a file, "flush" to flush
   *               previously uploaded data to a file, "setProperties" to set the properties of a file or directory,
   *               "setAccessControl" to set the owner, group, permissions, or access control list for a file or
   *               directory, or  "setAccessControlRecursive" to set the access control list for a directory
   *               recursively. Note that Hierarchical Namespace must be enabled for the account in order to use access
   *               control.  Also note that the Access Control List (ACL) includes permissions for the owner, owning
   *               group, and others, so the x-ms-permissions and x-ms-acl request headers are mutually exclusive.
   * @param mode Mode "set" sets POSIX access control rights on files and directories, "modify" modifies
   *             one or more POSIX access control rights  that pre-exist on files and directories, "remove" removes
   *             one or more POSIX access control rights  that were present earlier on files and directories
   * @param body Initial data
   * @param options The options parameters.
   */
  update(
    action: PathUpdateAction,
    mode: PathSetAccessControlRecursiveMode,
    body: coreRestPipeline.RequestBodyType,
    options?: PathUpdateOptionalParams
  ): Promise<PathUpdateResponse>;
  /**
   * Create and manage a lease to restrict write and delete access to the path. This operation supports
   * conditional HTTP requests.  For more information, see [Specifying Conditional Headers for Blob
   * Service
   * Operations](https://docs.microsoft.com/en-us/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).
   * @param xMsLeaseAction There are five lease actions: "acquire", "break", "change", "renew", and
   *                       "release". Use "acquire" and specify the "x-ms-proposed-lease-id" and "x-ms-lease-duration" to
   *                       acquire a new lease. Use "break" to break an existing lease. When a lease is broken, the lease break
   *                       period is allowed to elapse, during which time no lease operation except break and release can be
   *                       performed on the file. When a lease is successfully broken, the response indicates the interval in
   *                       seconds until a new lease can be acquired. Use "change" and specify the current lease ID in
   *                       "x-ms-lease-id" and the new lease ID in "x-ms-proposed-lease-id" to change the lease ID of an active
   *                       lease. Use "renew" and specify the "x-ms-lease-id" to renew an existing lease. Use "release" and
   *                       specify the "x-ms-lease-id" to release a lease.
   * @param options The options parameters.
   */
  lease(
    xMsLeaseAction: PathLeaseAction,
    options?: PathLeaseOptionalParams
  ): Promise<PathLeaseResponse>;
  /**
   * Read the contents of a file.  For read operations, range requests are supported. This operation
   * supports conditional HTTP requests.  For more information, see [Specifying Conditional Headers for
   * Blob Service
   * Operations](https://docs.microsoft.com/en-us/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).
   * @param options The options parameters.
   */
  read(options?: PathReadOptionalParams): Promise<PathReadResponse>;
  /**
   * Get Properties returns all system and user defined properties for a path. Get Status returns all
   * system defined properties for a path. Get Access Control List returns the access control list for a
   * path. This operation supports conditional HTTP requests.  For more information, see [Specifying
   * Conditional Headers for Blob Service
   * Operations](https://docs.microsoft.com/en-us/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).
   * @param options The options parameters.
   */
  getProperties(
    options?: PathGetPropertiesOptionalParams
  ): Promise<PathGetPropertiesResponse>;
  /**
   * Delete the file or directory. This operation supports conditional HTTP requests.  For more
   * information, see [Specifying Conditional Headers for Blob Service
   * Operations](https://docs.microsoft.com/en-us/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).
   * @param options The options parameters.
   */
  delete(options?: PathDeleteOptionalParams): Promise<PathDeleteResponse>;
  /**
   * Set the owner, group, permissions, or access control list for a path.
   * @param options The options parameters.
   */
  setAccessControl(
    options?: PathSetAccessControlOptionalParams
  ): Promise<PathSetAccessControlResponse>;
  /**
   * Set the access control list for a path and sub-paths.
   * @param mode Mode "set" sets POSIX access control rights on files and directories, "modify" modifies
   *             one or more POSIX access control rights  that pre-exist on files and directories, "remove" removes
   *             one or more POSIX access control rights  that were present earlier on files and directories
   * @param options The options parameters.
   */
  setAccessControlRecursive(
    mode: PathSetAccessControlRecursiveMode,
    options?: PathSetAccessControlRecursiveOptionalParams
  ): Promise<PathSetAccessControlRecursiveResponse>;
  /**
   * Set the owner, group, permissions, or access control list for a path.
   * @param options The options parameters.
   */
  flushData(
    options?: PathFlushDataOptionalParams
  ): Promise<PathFlushDataResponse>;
  /**
   * Append data to the file.
   * @param body Initial data
   * @param options The options parameters.
   */
  appendData(
    body: coreRestPipeline.RequestBodyType,
    options?: PathAppendDataOptionalParams
  ): Promise<PathAppendDataResponse>;
  /**
   * Sets the time a blob will expire and be deleted.
   * @param expiryOptions Required. Indicates mode of the expiry time
   * @param options The options parameters.
   */
  setExpiry(
    expiryOptions: PathExpiryOptions,
    options?: PathSetExpiryOptionalParams
  ): Promise<PathSetExpiryResponse>;
  /**
   * Undelete a path that was previously soft deleted
   * @param options The options parameters.
   */
  undelete(options?: PathUndeleteOptionalParams): Promise<PathUndeleteResponse>;
}
