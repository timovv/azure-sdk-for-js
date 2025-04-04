/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */
import { WorkloadsClient } from "@azure/arm-workloadssapvirtualinstance";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Lists the Database resources associated with a Virtual Instance for SAP solutions resource.
 *
 * @summary Lists the Database resources associated with a Virtual Instance for SAP solutions resource.
 * x-ms-original-file: specification/workloads/resource-manager/Microsoft.Workloads/SAPVirtualInstance/preview/2023-10-01-preview/examples/sapdatabaseinstances/SAPDatabaseInstances_List.json
 */
async function sapDatabaseInstancesList(): Promise<void> {
  const subscriptionId =
    process.env["WORKLOADS_SUBSCRIPTION_ID"] || "6d875e77-e412-4d7d-9af4-8895278b4443";
  const resourceGroupName = process.env["WORKLOADS_RESOURCE_GROUP"] || "test-rg";
  const sapVirtualInstanceName = "X00";
  const credential = new DefaultAzureCredential();
  const client = new WorkloadsClient(credential, subscriptionId);
  const resArray = new Array();
  for await (const item of client.sAPDatabaseInstances.list(
    resourceGroupName,
    sapVirtualInstanceName,
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

async function main(): Promise<void> {
  await sapDatabaseInstancesList();
}

main().catch(console.error);
