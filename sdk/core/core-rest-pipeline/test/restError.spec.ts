import { assert, describe, it } from "vitest";
import { RestError } from "../src/restError.js";

describe("RestError", function () {
  it("JSON serialization is sanitized", function () {
    const error = new RestError("Error", {
      request: { url: "http://example.com/foo?secret=SANITIZE_ME" } as any,
    });
    const jsonError = JSON.stringify(error);
    assert.isFalse(jsonError.includes("SANITIZE_ME"));
  });
});
