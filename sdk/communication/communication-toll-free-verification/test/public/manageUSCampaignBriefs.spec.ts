// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type {
  TollFreeVerificationClient,
  TollFreeVerificationUpsertCampaignBriefOptionalParams,
} from "../../src/index.js";
import {
  assertEditableFieldsAreEqual,
  assertCampaignBriefSummaryEditableFieldsAreEqual,
  doesCampaignBriefExist,
  getTestUSCampaignBrief,
} from "./utils/testUSCampaignBrief.js";
import type { Recorder } from "@azure-tools/test-recorder";
import { createRecordedClient } from "./utils/recordedClient.js";
import { describe, it, assert, beforeEach, afterEach } from "vitest";

describe(`TollFreeVerificationClient - Campaign Brief`, () => {
  let recorder: Recorder;
  let client: TollFreeVerificationClient;

  beforeEach(async (ctx) => {
    ({ client, recorder } = await createRecordedClient(ctx));
  });

  afterEach(async () => {
    await recorder.stop();
  });

  it("can manage a Brief", { timeout: 35000 }, async () => {
    const testBrief = getTestUSCampaignBrief();
    const uscb = testBrief.campaignBrief;
    const uscbsumm = testBrief.campaignBriefSummary;
    const createRequest: TollFreeVerificationUpsertCampaignBriefOptionalParams = {
      body: uscb,
    };
    const updateRequest: TollFreeVerificationUpsertCampaignBriefOptionalParams = {
      body: {
        id: uscb.id,
        additionalInformation: "additional information updated",
      },
    };

    // before test begins, make sure campaign brief does not exist, clean up if necessary
    if (await doesCampaignBriefExist(client, uscb.id)) {
      console.warn(
        "Campaign brief should not exist, it has not yet been created. Cleaning up campaign brief.",
      );
      await client.deleteCampaignBrief(uscb.id, "US");
      if (await doesCampaignBriefExist(client, uscb.id)) {
        assert.fail("Campaign brief should not exist, and could not be deleted");
      }
    }

    // create campaign brief by calling upsert
    const submitResult = await client.upsertCampaignBrief(uscb.id, "US", createRequest);
    assert.isOk(submitResult, "Failed to create campaign brief");
    assert.equal(uscb.id, submitResult.id, "Campaign brief creation returned the wrong Id");

    // get campaign brief, verify it was created correctly
    let getRes = await client.getCampaignBrief(uscb.id, "US");
    assertEditableFieldsAreEqual(uscb, getRes, "get after initial create");

    // update campaign brief by calling upsert
    const updateResult = await client.upsertCampaignBrief(uscb.id, "US", updateRequest);
    assert.isOk(updateResult, "Update campaign brief failed");
    assert.equal(uscb.id, updateResult.id, "Update campaign brief returned the wrong Id");

    // get campaign brief, verify it was updated correctly
    getRes = await client.getCampaignBrief(uscb.id, "US");
    assertEditableFieldsAreEqual(uscb, getRes, "get after update");

    // list campaign briefs, validate test campaign brief is in the list
    let foundTestCampaignBrief = false;
    for await (const cb of client.listCampaignBriefs()) {
      if (cb.id === uscbsumm.id) {
        foundTestCampaignBrief = true;
        assertCampaignBriefSummaryEditableFieldsAreEqual(uscbsumm, cb, "list all campaign briefs");
      }
    }
    assert.isTrue(
      foundTestCampaignBrief,
      "Test campaign brief was not returned in list of all campaign briefs",
    );

    // delete campaign brief, ensure it was removed
    const delRes = await client.deleteCampaignBrief(uscb.id, "US");
    assert.isOk(delRes, "Deleting campaign brief failed");
    assert.isFalse(
      await doesCampaignBriefExist(client, uscb.id),
      "Delete campaign brief was unsuccessful, campaign brief is still returned",
    );
  });
});
