// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { HealthDataAIServicesClient } from "@azure/arm-healthdataaiservices";
import { DefaultAzureCredential } from "@azure/identity";

/**
 * This sample demonstrates how to create a Private endpoint connection
 *
 * @summary create a Private endpoint connection
 * x-ms-original-file: 2024-09-20/PrivateEndpointConnections_Create_MaximumSet_Gen.json
 */
async function privateEndpointConnectionsCreateGeneratedByMaximumSetRuleStable(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const subscriptionId = "F21BB31B-C214-42C0-ACF0-DACCA05D3011";
  const client = new HealthDataAIServicesClient(credential, subscriptionId);
  const result = await client.privateEndpointConnections.create(
    "rgopenapi",
    "deidTest",
    "kgwgrrpabvrsrrvpcgcnfmyfgyrl",
    {
      properties: {
        privateEndpoint: {},
        privateLinkServiceConnectionState: {
          status: "Pending",
          actionsRequired: "ulb",
          description: "xr",
        },
      },
    },
  );
  console.log(result);
}

async function main(): Promise<void> {
  await privateEndpointConnectionsCreateGeneratedByMaximumSetRuleStable();
}

main().catch(console.error);
