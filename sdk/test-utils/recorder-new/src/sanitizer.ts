import { HttpClient } from "@azure/core-rest-pipeline";
import { createPipelineRequest, HttpMethods } from "@azure/core-rest-pipeline";
import { getRealAndFakePairs } from "./utils/connectionStringHelpers";
import { paths } from "./utils/paths";
import {
  getTestMode,
  isRecordMode,
  ProxyToolSanitizers,
  RecorderError,
  RegexSanitizer,
  sanitizerKeywordMapping,
  SanitizerOptions
} from "./utils/utils";

interface SanitizerRequest {
  sanitizer: ProxyToolSanitizers;
  body: string | undefined;
}

/**
 * Sanitizer class to handle communication with the proxy-tool relating to the sanitizers adding/resetting, etc.
 */
export class Sanitizer {
  constructor(private url: string, private httpClient: HttpClient) {}
  private recordingId: string | undefined;

  setRecordingId(recordingId: string): void {
    this.recordingId = recordingId;
  }

  /**
   * Returns the html document of all the available transforms in the proxy-tool
   */
  async transformsInfo(): Promise<string | null | undefined> {
    if (this.recordingId) {
      const infoUri = `${this.url}${paths.info}${paths.available}`;
      const req = this._createRecordingRequest(infoUri, false, "GET");
      if (!this.httpClient) {
        throw new RecorderError(
          `Something went wrong, Sanitizer.httpClient should not have been undefined in ${getTestMode()} mode.`
        );
      }
      const rsp = await this.httpClient.sendRequest({
        ...req,
        allowInsecureConnection: true
      });
      if (rsp.status !== 200) {
        throw new RecorderError("Info request failed.");
      }
      return rsp.bodyAsText;
    } else {
      throw new RecorderError(
        "Bad state, recordingId is not defined when called transformsInfo()."
      );
    }
  }

  /**
   * addSanitizers adds sanitizers to the current recording. Sanitizers will be applied before recordings are saved.
   *
   * Takes SanitizerOptions as the input, passes on to the proxy-tool.
   */
  async addSanitizers(options: SanitizerOptions): Promise<void> {
    const sanitizers = this.createSanitizerRequests(options);
    await Promise.all(
      sanitizers.map((sanitizer) => this.performAddSanitizerRequest(sanitizer, false))
    );
  }

  async addSessionLevelSanitizers(options: SanitizerOptions): Promise<void> {
    const sanitizers = this.createSanitizerRequests(options);
    await Promise.all(
      sanitizers.map((sanitizer) => this.performAddSanitizerRequest(sanitizer, true))
    );
  }

  private createSanitizerRequests(options: SanitizerOptions): SanitizerRequest[] {
    const sanitizersToAdd: SanitizerRequest[] = [];

    if (options.connectionStringSanitizers) {
      for (const { actualConnString, fakeConnString } of options.connectionStringSanitizers) {
        sanitizersToAdd.push(
          ...this.createConnectionStringSanitizerRequests(actualConnString, fakeConnString)
        );
      }
    }

    ([
      // The following sanitizers have similar request bodies and this abstraction avoids duplication
      "generalRegexSanitizers",
      "bodyKeySanitizers",
      "bodyRegexSanitizers",
      "headerRegexSanitizers",
      "uriRegexSanitizers"
    ] as const).map((prop) => {
      const replacers = options[prop];
      if (replacers) {
        replacers.map((replacer: RegexSanitizer) => {
          if (
            // sanitizers where the "regex" is a required attribute
            [
              "bodyKeySanitizers",
              "bodyRegexSanitizers",
              "generalRegexSanitizers",
              "uriRegexSanitizers"
            ].includes(prop) &&
            !replacer.regex
          ) {
            if (!isRecordMode()) return;
            throw new RecorderError(
              `Attempted to add an invalid sanitizer - ${JSON.stringify(replacer)}`
            );
          }

          sanitizersToAdd.push({
            sanitizer: sanitizerKeywordMapping[prop],
            body: JSON.stringify(replacer)
          });
        });
      }
    });

    ([
      // The following sanitizers have similar request bodies and this abstraction avoids duplication
      "resetSanitizer",
      "oAuthResponseSanitizer"
    ] as const).map((prop) => {
      // TODO: Test
      if (options[prop]) {
        sanitizersToAdd.push({
          sanitizer: sanitizerKeywordMapping[prop],
          body: undefined
        });
      }
    });

    if (options.removeHeaderSanitizer) {
      sanitizersToAdd.push({
        sanitizer: "RemoveHeaderSanitizer",
        body: JSON.stringify({
          headersForRemoval: options.removeHeaderSanitizer.headersForRemoval.toString()
        })
      });
    }

    if (options.continuationSanitizers) {
      // TODO: Test
      options.continuationSanitizers.map((replacer) =>
        sanitizersToAdd.push({
          sanitizer: "ContinuationSanitizer",
          body: JSON.stringify({
            ...replacer,
            resetAfterFirst: replacer.resetAfterFirst.toString()
          })
        })
      );
    }

    if (options.uriSubscriptionIdSanitizer) {
      sanitizersToAdd.push({
        sanitizer: "UriSubscriptionIdSanitizer",
        body: JSON.stringify(options.uriSubscriptionIdSanitizer)
      });
    }

    return sanitizersToAdd;
  }

  /**
   *  Internally,
   * - connection strings are parsed and
   * - each part of the connection string is mapped with its corresponding fake value
   * - generalRegexSanitizer is applied for each of the parts with the real and fake values that are parsed
   */
  createConnectionStringSanitizerRequests(
    actualConnString: string | undefined,
    fakeConnString: string
  ): SanitizerRequest[] {
    if (!actualConnString) {
      if (!isRecordMode()) return [];
      throw new RecorderError(
        `Attempted to add an invalid sanitizer - ${JSON.stringify({
          actualConnString: actualConnString,
          fakeConnString: fakeConnString
        })}`
      );
    }
    // extract connection string parts and match call
    const pairsMatched = getRealAndFakePairs(actualConnString, fakeConnString);
    return this.createSanitizerRequests({
      generalRegexSanitizers: Object.entries(pairsMatched).map(([key, value]) => {
        return { value, regex: key };
      })
    });
  }

  /**
   * Atomic method to add a simple sanitizer.
   */
  private async performAddSanitizerRequest(
    options: {
      sanitizer: ProxyToolSanitizers;
      body: string | undefined;
    },
    isSessionLevel: boolean
  ): Promise<void> {
    if (isSessionLevel || this.recordingId !== undefined) {
      const uri = `${this.url}${paths.admin}${
        options.sanitizer !== "Reset" ? paths.addSanitizer : paths.reset
      }`;
      const req = this._createRecordingRequest(uri, isSessionLevel);
      if (options.sanitizer !== "Reset") {
        req.headers.set("x-abstraction-identifier", options.sanitizer);
      }
      req.body = options.body;
      if (!this.httpClient) {
        throw new RecorderError(
          `Something went wrong, Recorder.httpClient should not have been undefined in ${getTestMode()} mode.`
        );
      }
      const rsp = await this.httpClient.sendRequest({
        ...req,
        allowInsecureConnection: true
      });
      if (rsp.status !== 200) {
        throw new RecorderError("addSanitizer request failed.");
      }
    } else {
      throw new RecorderError("Bad state, recordingId is not defined when called addSanitizer().");
    }
  }

  /**
   * Adds the recording id headers to the requests that are sent to the proxy tool.
   * These are required to appropriately save the recordings in the record mode and picking them up in playback.
   */
  private _createRecordingRequest(
    url: string,
    isSessionLevel: boolean,
    method: HttpMethods = "POST"
  ) {
    const req = createPipelineRequest({ url: url, method });
    if (!isSessionLevel && this.recordingId !== undefined) {
      req.headers.set("x-recording-id", this.recordingId);
    }
    return req;
  }
}
