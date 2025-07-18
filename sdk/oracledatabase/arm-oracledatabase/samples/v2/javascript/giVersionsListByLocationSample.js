// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const { OracleDatabaseManagementClient } = require("@azure/arm-oracledatabase");
const { DefaultAzureCredential } = require("@azure/identity");

/**
 * This sample demonstrates how to list GiVersion resources by SubscriptionLocationResource
 *
 * @summary list GiVersion resources by SubscriptionLocationResource
 * x-ms-original-file: 2025-03-01/GiVersions_ListByLocation_MaximumSet_Gen.json
 */
async function listGiVersionsByLocationGeneratedByMaximumSetRule() {
  const credential = new DefaultAzureCredential();
  const subscriptionId = "00000000-0000-0000-0000-000000000000";
  const client = new OracleDatabaseManagementClient(credential, subscriptionId);
  const resArray = new Array();
  for await (const item of client.giVersions.listByLocation("eastus", {
    shape:
      "osixsklyaauhoqnkxvnvsqeqenhzogntqnpubldrrfvqncwetdtwqwjjcvspwhgecbimdlulwcubikebrdzmidrucgtsuqvytkqutmbyrvvyioxpocpmuwiivyanjzucaegihztluuvpznzaoakfsselumhhsvrtrbzwpjhcihsvyouonlxdluwhqfxoqvgthkaxppbydtqjntscgzbivfdcaobbkthrbdjwpejirqmbly",
  })) {
    resArray.push(item);
  }

  console.log(resArray);
}

/**
 * This sample demonstrates how to list GiVersion resources by SubscriptionLocationResource
 *
 * @summary list GiVersion resources by SubscriptionLocationResource
 * x-ms-original-file: 2025-03-01/GiVersions_ListByLocation_MinimumSet_Gen.json
 */
async function listGiVersionsByLocationGeneratedByMinimumSetRule() {
  const credential = new DefaultAzureCredential();
  const subscriptionId = "00000000-0000-0000-0000-000000000000";
  const client = new OracleDatabaseManagementClient(credential, subscriptionId);
  const resArray = new Array();
  for await (const item of client.giVersions.listByLocation("eastus")) {
    resArray.push(item);
  }

  console.log(resArray);
}

async function main() {
  await listGiVersionsByLocationGeneratedByMaximumSetRule();
  await listGiVersionsByLocationGeneratedByMinimumSetRule();
}

main().catch(console.error);
