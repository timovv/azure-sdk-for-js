/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { TestLine, MicrosoftVoiceServices } from "@azure/arm-voiceservices";
import { DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * This sample demonstrates how to Create a TestLine
 *
 * @summary Create a TestLine
 * x-ms-original-file: specification/voiceservices/resource-manager/Microsoft.VoiceServices/stable/2023-01-31/examples/TestLines_CreateOrUpdate.json
 */
async function createTestLineResource() {
  const subscriptionId =
    process.env["VOICESERVICES_SUBSCRIPTION_ID"] ||
    "00000000-0000-0000-0000-000000000000";
  const resourceGroupName =
    process.env["VOICESERVICES_RESOURCE_GROUP"] || "testrg";
  const communicationsGatewayName = "myname";
  const testLineName = "myline";
  const resource: TestLine = {
    location: "useast",
    phoneNumber: "+1-555-1234",
    purpose: "Automated"
  };
  const credential = new DefaultAzureCredential();
  const client = new MicrosoftVoiceServices(credential, subscriptionId);
  const result = await client.testLines.beginCreateOrUpdateAndWait(
    resourceGroupName,
    communicationsGatewayName,
    testLineName,
    resource
  );
  console.log(result);
}

async function main() {
  createTestLineResource();
}

main().catch(console.error);