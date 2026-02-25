// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type {
  GetPropertiesResponse,
  GetStatisticsResponse,
  ServiceProperties,
  SetPropertiesOptions,
  SetPropertiesResponse,
} from "./generatedModels.js";
import type { OperationOptions } from "@azure-rest/core-client";
import { getClient, createRestError } from "@azure-rest/core-client";
import type {
  ListTableItemsOptions,
  TableItem,
  TableQueryOptions,
  TableServiceClientOptions,
} from "./models.js";
import type { NamedKeyCredential, SASCredential, TokenCredential } from "@azure/core-auth";
import { isNamedKeyCredential, isSASCredential, isTokenCredential } from "@azure/core-auth";
import { COSMOS_SCOPE, STORAGE_SCOPE, TablesLoggingAllowedHeaderNames } from "./utils/constants.js";
import type { ServiceOperations } from "./generated/classic/service/index.js";
import { _getServiceOperations } from "./generated/classic/service/index.js";
import type { GeneratedContext } from "./generated/api/generatedContext.js";
import { _querySend, _queryDeserialize, _queryDeserializeHeaders, _$deleteSend, _createSend } from "./generated/api/table/operations.js";
import {
  injectSecondaryEndpointHeader,
  tablesSecondaryEndpointPolicy,
} from "./secondaryEndpointPolicy.js";

import type { PagedAsyncIterableIterator } from "@azure/core-paging";
import type { Pipeline } from "@azure/core-rest-pipeline";
import type { TableItemResultPage } from "./models.js";
import { apiVersionPolicy } from "./utils/apiVersionPolicy.js";
import { getClientParamsFromConnectionString } from "./utils/connectionString.js";
import { isCredential } from "./utils/isCredential.js";
import { logger } from "./logger.js";
import { setTokenChallengeAuthenticationPolicy } from "./utils/challengeAuthenticationUtils.js";
import { tablesNamedKeyCredentialPolicy } from "./tablesNamedCredentialPolicy.js";
import { tablesSASTokenPolicy } from "./tablesSASTokenPolicy.js";
import { tracingClient } from "./utils/tracing.js";
import { isCosmosEndpoint } from "./utils/isCosmosEndpoint.js";
import { splitEndpointQuery } from "./utils/splitEndpointQuery.js";

/**
 * A TableServiceClient represents a Client to the Azure Tables service allowing you
 * to perform operations on the tables and the entities.
 */
export class TableServiceClient {
  /**
   * Table Account URL
   */
  public url: string;
  /**
   * Represents a pipeline for making a HTTP request to a URL.
   * Pipelines can have multiple policies to manage manipulating each request before and after it is made to the server.
   */
  public pipeline: Pipeline;
  private service: ServiceOperations;
  private clientContext: GeneratedContext;

  /**
   * Creates a new instance of the TableServiceClient class.
   *
   * @param url - The URL of the service account that is the target of the desired operation., such as "https://myaccount.table.core.windows.net".
   * @param credential - NamedKeyCredential | SASCredential used to authenticate requests. Only Supported for Node
   * @param options - Options to configure the HTTP pipeline.
   *
   * ### Example using an account name/key:
   *
   * ```ts snippet:ReadmeSampleCreateClient_NamedKeyCredential
   * import { AzureNamedKeyCredential, TableServiceClient } from "@azure/data-tables";
   *
   * const account = "<account>";
   * const accountKey = "<accountkey>";
   *
   * const credential = new AzureNamedKeyCredential(account, accountKey);
   * const serviceClient = new TableServiceClient(
   *   `https://${account}.table.core.windows.net`,
   *   credential,
   * );
   * ```
   */
  constructor(url: string, credential: NamedKeyCredential, options?: TableServiceClientOptions);
  /**
   * Creates a new instance of the TableServiceClient class.
   *
   * @param url - The URL of the service account that is the target of the desired operation., such as "https://myaccount.table.core.windows.net".
   * @param credential - SASCredential used to authenticate requests
   * @param options - Options to configure the HTTP pipeline.
   *
   * ### Example using a SAS Token.
   *
   * ```ts snippet:ReadmeSampleCreateClient_SASToken
   * import { TableServiceClient, AzureSASCredential } from "@azure/data-tables";
   *
   * const account = "<account name>";
   * const sas = "<service Shared Access Signature Token>";
   *
   * const serviceClientWithSAS = new TableServiceClient(
   *   `https://${account}.table.core.windows.net`,
   *   new AzureSASCredential(sas),
   * );
   * ```
   */
  constructor(url: string, credential: SASCredential, options?: TableServiceClientOptions);
  /**
   * Creates a new instance of the TableServiceClient class.
   *
   * @param url - The URL of the service account that is the target of the desired operation., such as "https://myaccount.table.core.windows.net".
   * @param credential - Azure Active Directory credential used to authenticate requests
   * @param options - Options to configure the HTTP pipeline.
   *
   * ### Example using an Azure Active Directory credential:
   *
   * ```ts snippet:ReadmeSampleCreateClient_TokenCredential
   * import { DefaultAzureCredential } from "@azure/identity";
   * import { TableServiceClient } from "@azure/data-tables";
   *
   * const credential = new DefaultAzureCredential();
   * const account = "<account name>";
   *
   * const clientWithAAD = new TableServiceClient(
   *   `https://${account}.table.core.windows.net`,
   *   credential,
   * );
   * ```
   */
  constructor(url: string, credential: TokenCredential, options?: TableServiceClientOptions);
  /**
   * Creates a new instance of the TableServiceClient class.
   *
   * @param url - The URL of the service account that is the target of the desired operation., such as
   *              "https://myaccount.table.core.windows.net". You can append a SAS,
   *              such as "https://myaccount.table.core.windows.net?sasString".
   * @param options - Options to configure the HTTP pipeline.
   * Example appending a SAS token:
   *
   * ```ts snippet:ReadmeSampleCreateClient_SASTokenURL
   * import { TableServiceClient } from "@azure/data-tables";
   *
   * const account = "<account name>";
   * const sasToken = "<SAS token>";
   * const tableName = "<tableName>";
   *
   * const serviceClientWithSASURL = new TableServiceClient(
   *   `https://${account}.table.core.windows.net?${sasToken}`,
   * );
   * ```
   */
  constructor(url: string, options?: TableServiceClientOptions);
  constructor(
    url: string,
    credentialOrOptions?:
      | NamedKeyCredential
      | SASCredential
      | TokenCredential
      | TableServiceClientOptions,
    options?: TableServiceClientOptions,
  ) {
    this.url = url;
    const isCosmos = isCosmosEndpoint(this.url);
    const credential = isCredential(credentialOrOptions) ? credentialOrOptions : undefined;
    const clientOptions =
      (!isCredential(credentialOrOptions) ? credentialOrOptions : options) || {};

    // Strip query params (SAS tokens) from the endpoint URL — @azure-rest/core-client
    // doesn't handle them correctly in the base URL (appends path after query string)
    const endpointUrl = clientOptions.endpoint || this.url;
    const { baseUrl, sasQuery } = splitEndpointQuery(endpointUrl);

    const clientContext = getClient(baseUrl, undefined, {
      ...clientOptions,
      loggingOptions: {
        logger: logger.info,
        additionalAllowedHeaderNames: [...TablesLoggingAllowedHeaderNames],
      },
    }) as GeneratedContext;
    clientContext.apiVersion = "2019-02-02";
    this.clientContext = clientContext;

    // If the URL had query params (SAS token), add policy to prepend them to each request
    // They must come before operation-specific params to match the original URL ordering
    if (sasQuery) {
      clientContext.pipeline.addPolicy({
        name: "sasQueryAppendPolicy",
        sendRequest: async (req, next) => {
          const qIndex = req.url.indexOf("?");
          if (qIndex === -1) {
            req.url = req.url + "?" + sasQuery;
          } else {
            // Insert SAS params right after '?' and before existing query params
            const base = req.url.substring(0, qIndex);
            const existing = req.url.substring(qIndex + 1);
            req.url = base + "?" + sasQuery + "&" + existing;
          }
          return next(req);
        },
      });
    }

    clientContext.pipeline.addPolicy(tablesSecondaryEndpointPolicy);

    if (isNamedKeyCredential(credential)) {
      clientContext.pipeline.addPolicy(tablesNamedKeyCredentialPolicy(credential));
    } else if (isSASCredential(credential)) {
      clientContext.pipeline.addPolicy(tablesSASTokenPolicy(credential));
    }

    if (isTokenCredential(credential)) {
      const scope = isCosmos ? COSMOS_SCOPE : STORAGE_SCOPE;
      setTokenChallengeAuthenticationPolicy(clientContext.pipeline, credential, scope);
    }

    if (options?.version) {
      clientContext.pipeline.addPolicy(apiVersionPolicy(options.version));
    }

    this.pipeline = clientContext.pipeline;
    this.service = _getServiceOperations(clientContext);
  }

  /**
   * Retrieves statistics related to replication for the Table service. It is only available on the
   * secondary location endpoint when read-access geo-redundant replication is enabled for the account.
   * @param options - The options parameters.
   */
  public async getStatistics(options: OperationOptions = {}): Promise<GetStatisticsResponse> {
    return tracingClient.withSpan("TableServiceClient.getStatistics", options, async (updatedOptions) => {
      const result = await this.service.getStatistics(injectSecondaryEndpointHeader(updatedOptions));
      return {
        geoReplication: result.geoReplication,
        clientRequestId: result.clientRequestId,
        date: result.date,
        requestId: result.requestId,
        version: result.apiVersion,
      };
    });
  }

  /**
   * Gets the properties of an account's Table service, including properties for Analytics and CORS
   * (Cross-Origin Resource Sharing) rules.
   * @param options - The options parameters.
   */
  public getProperties(options: OperationOptions = {}): Promise<GetPropertiesResponse> {
    return tracingClient.withSpan("TableServiceClient.getProperties", options, async (updatedOptions) => {
      const result = await this.service.getProperties(updatedOptions);
      return {
        logging: result.logging,
        hourMetrics: result.hourMetrics,
        minuteMetrics: result.minuteMetrics,
        cors: result.cors,
        clientRequestId: result.clientRequestId,
        requestId: result.requestId,
        version: result.apiVersion,
      };
    });
  }

  /**
   * Sets properties for an account's Table service endpoint, including properties for Analytics and CORS
   * (Cross-Origin Resource Sharing) rules.
   * @param properties - The Table Service properties.
   * @param options - The options parameters.
   */
  public setProperties(
    properties: ServiceProperties,
    options: SetPropertiesOptions = {},
  ): Promise<SetPropertiesResponse> {
    return tracingClient.withSpan("TableServiceClient.setProperties", options, async (updatedOptions) => {
      const result = await this.service.setProperties(properties, updatedOptions);
      return {
        clientRequestId: result.clientRequestId,
        requestId: result.requestId,
        version: result.apiVersion,
      };
    });
  }

  /**
   * Creates a new table under the given account.
   * @param name - The name of the table.
   * @param options - The options parameters.
   */
  public createTable(name: string, options: OperationOptions = {}): Promise<void> {
    return tracingClient.withSpan(
      "TableServiceClient.createTable",
      options,
      async (updatedOptions) => {
        try {
          // Use lower-level send to avoid generated deserializer crash on empty/unexpected body
          const result = await _createSend(
            this.clientContext,
            { tableName: name },
            updatedOptions,
          );
          if (result.status === "201" || result.status === "204") {
            return;
          }
          if (result.status === "409" && isTableAlreadyExistsBody(result.body)) {
            logger.info(`Table ${name} already Exists`);
            return;
          }
          throw createRestError(result);
        } catch (e: any) {
          if (e.statusCode === 409 && isTableAlreadyExistsError(e)) {
            logger.info(`Table ${name} already Exists`);
            return;
          }
          throw e;
        }
      },
    );
  }

  /**
   * Operation permanently deletes the specified table.
   * @param name - The name of the table.
   * @param options - The options parameters.
   */
  public deleteTable(name: string, options: OperationOptions = {}): Promise<void> {
    return tracingClient.withSpan(
      "TableServiceClient.deleteTable",
      options,
      async (updatedOptions) => {
        // Use lower-level send to avoid generated deserializer crash on empty body
        const result = await _$deleteSend(this.clientContext, name, updatedOptions);
        if (result.status === "204") {
          return;
        }
        if (result.status === "404") {
          logger.info("TableServiceClient.deleteTable: Table doesn't exist");
          return;
        }
        throw createRestError(result);
      },
    );
  }

  /**
   * Queries tables under the given account.
   * @param options - The options parameters.
   */
  public listTables(
    // eslint-disable-next-line @azure/azure-sdk/ts-naming-options
    options?: ListTableItemsOptions,
  ): PagedAsyncIterableIterator<TableItem, TableItemResultPage> {
    const iter = this.listTablesAll(options);

    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings) => {
        const pageOptions: InternalListTablesOptions = {
          ...options,
          queryOptions: { ...options?.queryOptions, top: settings?.maxPageSize },
        };

        if (settings?.continuationToken) {
          pageOptions.continuationToken = settings.continuationToken;
        }

        return this.listTablesPage(pageOptions);
      },
    };
  }

  private async *listTablesAll(
    options?: InternalListTablesOptions,
  ): AsyncIterableIterator<TableItem> {
    const firstPage = await this._listTables(options);
    const { continuationToken } = firstPage;
    yield* firstPage;
    if (continuationToken) {
      const optionsWithContinuation: InternalListTablesOptions = {
        ...options,
        continuationToken,
      };
      for await (const page of this.listTablesPage(optionsWithContinuation)) {
        yield* page;
      }
    }
  }

  private async *listTablesPage(
    options: InternalListTablesOptions = {},
  ): AsyncIterableIterator<TableItemResultPage> {
    let result = await tracingClient.withSpan(
      "TableServiceClient.listTablesPage",
      options,
      (updatedOptions) => this._listTables(updatedOptions),
    );

    yield result;

    while (result.continuationToken) {
      const optionsWithContinuation: InternalListTablesOptions = {
        ...options,
        continuationToken: result.continuationToken,
      };
      result = await tracingClient.withSpan(
        "TableServiceClient.listTablesPage",
        optionsWithContinuation,
        async (updatedOptions, span) => {
          span.setAttribute("continuationToken", updatedOptions.continuationToken);
          return this._listTables(updatedOptions);
        },
      );
      yield result;
    }
  }

  private async _listTables(options: InternalListTablesOptions = {}): Promise<TableItemResultPage> {
    const { continuationToken: nextTableName, queryOptions, ...restOptions } = options;
    const result = await _querySend(this.clientContext, {
      ...restOptions,
      nextTableName,
      filter: queryOptions?.filter,
      top: queryOptions?.top,
    });
    const deserialized = await _queryDeserialize(result);
    const headers = _queryDeserializeHeaders(result);
    const continuationToken = headers.nextTableName ?? undefined;
    const value: TableItem[] = (deserialized.value ?? []).map((tp) => ({ name: tp.tableName }));
    return Object.assign([...value], { continuationToken });
  }

  /**
   *
   * Creates an instance of TableServiceClient from connection string.
   *
   * @param connectionString - Account connection string or a SAS connection string of an Azure storage account.
   *                           [ Note - Account connection string can only be used in NODE.JS runtime. ]
   *                           Account connection string example -
   *                           `DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=accountKey;EndpointSuffix=core.windows.net`
   *                           SAS connection string example -
   *                           `BlobEndpoint=https://myaccount.table.core.windows.net/;QueueEndpoint=https://myaccount.queue.core.windows.net/;FileEndpoint=https://myaccount.file.core.windows.net/;TableEndpoint=https://myaccount.table.core.windows.net/;SharedAccessSignature=sasString`
   * @param options - Options to configure the HTTP pipeline.
   * @returns A new TableServiceClient from the given connection string.
   */
  public static fromConnectionString(
    connectionString: string,
    // eslint-disable-next-line @azure/azure-sdk/ts-naming-options
    options?: TableServiceClientOptions,
  ): TableServiceClient {
    const {
      url,
      options: clientOptions,
      credential,
    } = getClientParamsFromConnectionString(connectionString, options);

    if (credential) {
      return new TableServiceClient(url, credential, clientOptions);
    } else {
      return new TableServiceClient(url, clientOptions);
    }
  }
}

type InternalListTablesOptions = ListTableItemsOptions & {
  queryOptions?: TableQueryOptions & { top?: number };
  /**
   * A table query continuation token from a previous call.
   */
  continuationToken?: string;
};

/** Check if a response body indicates TableAlreadyExists */
function isTableAlreadyExistsBody(body: any): boolean {
  return (
    body?.["odata.error"]?.code === "TableAlreadyExists" ||
    body?.odataError?.code === "TableAlreadyExists" ||
    body?.code === "TableAlreadyExists"
  );
}

/** Check if a RestError indicates TableAlreadyExists */
function isTableAlreadyExistsError(error: any): boolean {
  const parsedBody = error?.response?.parsedBody;
  const details = error?.details;
  return (
    isTableAlreadyExistsBody(parsedBody) ||
    isTableAlreadyExistsBody(details) ||
    error?.code === "TableAlreadyExists"
  );
}
