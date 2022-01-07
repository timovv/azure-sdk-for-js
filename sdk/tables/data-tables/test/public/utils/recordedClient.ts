// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import "./env";
import { AzureNamedKeyCredential, AzureSASCredential } from "@azure/core-auth";
import { Recorder, env } from "@azure-tools/test-recorder-new";
import { TableClient, TableServiceClient } from "../../../src";
import { createTestCredential } from "@azure-tools/test-credential";

const mockAccountName = "fakeaccount";
const mockAccountKey = "fakeKey";
const fakeSas =
  "sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacuptfx&se=2021-01-31T05:16:52Z&st=2021-01-26T21:16:52Z&spr=https&sig=fakeSignature";
const mockSasConnectionString = `TableEndpoint=https://${mockAccountName}.table.core.windows.net/;SharedAccessSignature=${fakeSas}`;
export const envSetupForPlayback: { [k: string]: string } = {
  // Used in record and playback modes
  // 1. The key-value pairs will be used as the environment variables in playback mode
  // 2. If the env variables are present in the recordings as plain strings, they will be replaced with the provided values in record mode
  ACCOUNT_NAME: `${mockAccountName}`,
  ACCOUNT_KEY: `${mockAccountKey}`,
  ACCOUNT_SAS: `${mockAccountKey}`,
  TABLES_URL: `https://${mockAccountName}.table.core.windows.net`,
  SAS_CONNECTION_STRING: `${mockSasConnectionString}`,
  AZURE_CLIENT_ID: "azure_client_id",
  AZURE_CLIENT_SECRET: "azure_client_secret",
  AZURE_TENANT_ID: "88888888-8888-8888-8888-888888888888",
};

const generalRegexSanitizers = [
  {
    regex: "(.*)&sig=(?<secret_content>[^&]*)&(.*)",
    value: mockAccountKey,
    groupForReplace: "secret_content",
  },
];

export type CreateClientMode =
  | "SASConnectionString"
  | "SASToken"
  | "AccountKey"
  | "AccountConnectionString"
  | "TokenCredential";

export function createTableClient(
  recorder: Recorder | undefined,
  tableName: string,
  mode: CreateClientMode = "SASConnectionString"
): TableClient {
  let client: TableClient;

  switch (mode) {
    case "SASConnectionString":
      if (!env.SAS_CONNECTION_STRING) {
        throw new Error(
          "SASConnectionString is not defined, make sure that SAS_CONNECTION_STRING is defined in the environment"
        );
      }

      client = TableClient.fromConnectionString(env.SAS_CONNECTION_STRING, tableName);
      break;

    case "SASToken":
      if (!env.SAS_TOKEN || !env.TABLES_URL) {
        throw new Error(
          "SAS Token and AccountURL must be defined, make sure that SAS_TOKEN and  TABLES_URL are defined in the environment"
        );
      }

      client = new TableClient(
        env.TABLES_URL,
        tableName,
        new AzureSASCredential(env.SAS_TOKEN ?? "")
      );
      break;

    case "AccountKey":
      if (!env.ACCOUNT_NAME || !env.ACCOUNT_KEY || !env.TABLES_URL) {
        throw new Error(
          "AccountName, AccountURL and AccountKey must be defined, make sure that ACCOUNT_NAME, ACCOUNT_KEY and TABLES_URL are defined in the environment"
        );
      }

      client = new TableClient(
        env.TABLES_URL,
        tableName,
        new AzureNamedKeyCredential(env.ACCOUNT_NAME, env.ACCOUNT_KEY)
      );
      break;

    case "TokenCredential": {
      if (!env.AZURE_TENANT_ID || !env.AZURE_CLIENT_ID || !env.AZURE_CLIENT_SECRET) {
        throw new Error(
          "AZURE_TENANT_ID, AZURE_CLIENT_ID and AZURE_CLIENT_SECRET must be defined, make sure that they are in the environment"
        );
      }

      const credential = createTestCredential();

      client = new TableClient(env.TABLES_URL ?? "", tableName, credential);
      break;
    }

    case "AccountConnectionString":
      if (!env.ACCOUNT_CONNECTION_STRING) {
        throw new Error(
          "AccountConnectionString is not defined, make sure that ACCOUNT_CONNECTION_STRING is defined in the environment"
        );
      }

      client = TableClient.fromConnectionString(env.ACCOUNT_CONNECTION_STRING, tableName);
      break;

    default:
      throw new Error(`Unknown authentication mode ${mode}`);
  }

    recorder?.configureClient(client);
    recorder?.addSanitizers({
      generalRegexSanitizers,
      uriRegexSanitizers: [{regex: "(?<Protocol>\w+):\/\/(?<AccountName>[\w@][\w.:@]+).table.core.windows.net\/?[\w\.?=%&=\-@$,]*", value: mockAccountName, groupForReplace: "AccountName",
    }]
    });
  
  return client;
}

export function createTableServiceClient(
  recorder: Recorder | undefined,
  mode: CreateClientMode = "SASConnectionString"
): TableServiceClient {
  let client: TableServiceClient;
  switch (mode) {
    case "SASConnectionString":
      if (!env.SAS_CONNECTION_STRING) {
        throw new Error(
          "SASConnectionString is not defined, make sure that SAS_CONNECTION_STRING is defined in the environment"
        );
      }

      client = TableServiceClient.fromConnectionString(env.SAS_CONNECTION_STRING);
      break;

    case "SASToken":
      if (!env.SAS_TOKEN || !env.TABLES_URL) {
        throw new Error(
          "SAS Token and AccountURL must be defined, make sure that SAS_TOKEN and  TABLES_URL are defined in the environment"
        );
      }

      client = new TableServiceClient(`${env.TABLES_URL}${env.SAS_TOKEN}`);
      break;

    case "AccountKey":
      if (!env.ACCOUNT_NAME || !env.ACCOUNT_KEY || !env.TABLES_URL) {
        throw new Error(
          "AccountName, AccountURL and AccountKey must be defined, make sure that ACCOUNT_NAME, ACCOUNT_KEY and TABLES_URL are defined in the environment"
        );
      }

      client = new TableServiceClient(
        env.TABLES_URL,
        new AzureNamedKeyCredential(env.ACCOUNT_NAME, env.ACCOUNT_KEY)
      );
      break;

    case "TokenCredential": {
      if (!env.AZURE_TENANT_ID || !env.AZURE_CLIENT_ID || !env.AZURE_CLIENT_SECRET) {
        throw new Error(
          "AZURE_TENANT_ID, AZURE_CLIENT_ID and AZURE_CLIENT_SECRET must be defined, make sure that they are in the environment"
        );
      }

      const credential = createTestCredential();

      client = new TableServiceClient(env.TABLES_URL ?? "", credential);
      break;
    }

    case "AccountConnectionString":
      if (!env.ACCOUNT_CONNECTION_STRING) {
        throw new Error(
          "AccountConnectionString is not defined, make sure that ACCOUNT_CONNECTION_STRING is defined in the environment"
        );
      }

      client = TableServiceClient.fromConnectionString(env.ACCOUNT_CONNECTION_STRING);
      break;

    default:
      throw new Error(`Unknown authentication mode ${mode}`);
  }

  recorder?.configureClient(client);
  recorder?.addSanitizers({
    generalRegexSanitizers,
  });
  return client;
}
