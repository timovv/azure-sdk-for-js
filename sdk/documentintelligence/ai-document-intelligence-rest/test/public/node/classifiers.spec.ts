// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { Recorder } from "@azure-tools/test-recorder";
import { assertEnvironmentVariable } from "@azure-tools/test-recorder";
import { createRecorder, testPollingOptions } from "../utils/recorderUtils.js";
import DocumentIntelligence from "../../../src/index.js";
import { assert, describe, beforeEach, afterEach, it } from "vitest";
import { ASSET_PATH, getRandomNumber, makeTestUrl } from "../utils/utils.js";
import type {
  AnalyzeOperationOutput,
  DocumentClassifierBuildOperationDetailsOutput,
  DocumentClassifierDetailsOutput,
  DocumentIntelligenceClient,
} from "../../../src/index.js";
import { getLongRunningPoller, isUnexpected } from "../../../src/index.js";
import path from "node:path";
import fs from "node:fs";

const containerSasUrl = (): string =>
  assertEnvironmentVariable("DOCUMENT_INTELLIGENCE_TRAINING_CONTAINER_SAS_URL");

describe.skip("classifiers", () => {
  let recorder: Recorder;
  let client: DocumentIntelligenceClient;
  beforeEach(async (context) => {
    recorder = await createRecorder(context);
    await recorder.setMatcher("BodilessMatcher");
    client = DocumentIntelligence(
      assertEnvironmentVariable("DOCUMENT_INTELLIGENCE_ENDPOINT"),
      { key: assertEnvironmentVariable("DOCUMENT_INTELLIGENCE_API_KEY") },
      recorder.configureClientOptions({}),
    );
  });

  afterEach(async () => {
    await recorder.stop();
  });

  let _classifier: DocumentClassifierDetailsOutput;
  let _classifierId: string;

  const customClassifierDescription = "Custom classifier description";

  // We only want to create the model once, but because of the recorder's
  // precedence, we have to create it in a test, so one test will end up
  // recording the entire creation and the other tests will still be able
  // to use it.
  async function requireClassifier(): Promise<DocumentClassifierDetailsOutput> {
    if (!_classifier) {
      _classifierId = recorder.variable(
        "customClassifierId",
        `customClassifier${getRandomNumber()}`,
      );

      const initialResponse = await client.path("/documentClassifiers:build").post({
        body: {
          classifierId: _classifierId,
          description: "Custom classifier description",
          docTypes: {
            foo: {
              azureBlobSource: {
                containerUrl: containerSasUrl(),
              },
            },
            bar: {
              azureBlobSource: {
                containerUrl: containerSasUrl(),
              },
            },
          },
        },
        queryParameters: { customClassifierDescription },
      });

      if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
      }
      const poller = getLongRunningPoller(client, initialResponse);
      const response = (
        (await poller.pollUntilDone()).body as DocumentClassifierBuildOperationDetailsOutput
      ).result;
      if (!response) {
        throw new Error("Expected a DocumentClassifierDetailsOutput response.");
      }
      _classifier = response;

      assert.ok(_classifier.classifierId);
    }

    return _classifier;
  }

  it("build classifier", async () => {
    const classifier = await requireClassifier();

    assert.containsAllKeys(classifier.docTypes, ["foo", "bar"]);
    assert.equal(classifier.classifierId, _classifierId);
    assert.equal(classifier.description, customClassifierDescription);
  });

  it("analyze from PNG file stream", async () => {
    const filePath = path.join(ASSET_PATH, "forms", "Invoice_1.pdf");
    const { classifierId } = await requireClassifier();
    const base64Source = fs.readFileSync(filePath, { encoding: "base64" });

    const initialResponse = await client
      .path("/documentClassifiers/{classifierId}:analyze", classifierId)
      .post({
        contentType: "application/json",
        body: {
          base64Source,
        },
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    const poller = getLongRunningPoller(client, initialResponse, { ...testPollingOptions });
    const analyzeResult = ((await poller.pollUntilDone()).body as AnalyzeOperationOutput)
      .analyzeResult;

    assert.isNotEmpty(analyzeResult?.documents);
    assert.oneOf(analyzeResult?.documents![0].docType, ["foo", "bar"]);

    // Additionally check that the pages aren't empty and that there are some common fields set
    assert.isNotEmpty(analyzeResult?.pages);
    assert.ok(analyzeResult?.pages![0].pageNumber);
    assert.isDefined(analyzeResult?.pages![0].angle);
    assert.ok(analyzeResult?.pages![0].height);
    assert.ok(analyzeResult?.pages![0].width);
    assert.ok(analyzeResult?.pages![0].unit);
  });

  it("analyze from PNG file URL", async () => {
    const url = makeTestUrl("/Invoice_1.pdf");
    const { classifierId } = await requireClassifier();

    const initialResponse = await client
      .path("/documentClassifiers/{classifierId}:analyze", classifierId)
      .post({
        contentType: "application/json",
        body: {
          urlSource: url,
        },
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    const poller = getLongRunningPoller(client, initialResponse, { ...testPollingOptions });
    const analyzeResult = ((await poller.pollUntilDone()).body as AnalyzeOperationOutput)
      .analyzeResult;

    assert.isNotEmpty(analyzeResult?.documents);
    assert.oneOf(analyzeResult?.documents![0].docType, ["foo", "bar"]);
  });

  it("get & delete classifiers from the account", async () => {
    await client.path("/documentClassifiers/{classifierId}", _classifierId).get();

    // Delete the custom classifier we created
    if (_classifierId) {
      await client.path("/documentClassifiers/{classifierId}", _classifierId).delete();
    }

    // Try to get the classifier and assert that it's gone
    try {
      await client.path("/documentClassifiers/{classifierId}", _classifierId).get();
      assert.fail("Expected error while accessing a deleted classifier");
    } catch (error: any) {
      assert.ok(error);
    }
  });
});
