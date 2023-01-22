// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import crypto from "crypto";
import { Transform, TransformCallback } from "stream";

/**
 * Error thrown when the Docker content digest returned from the
 * server does not match the digest calculated from the content.
 */
export class DigestMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DigestMismatchError";
  }
}

export function calculateDigest(buffer: Buffer): Promise<string>;

export function calculateDigest(stream: NodeJS.ReadableStream): Promise<string>;

export function calculateDigest(bufferOrStream: NodeJS.ReadableStream | Buffer): Promise<string> {
  const hash = crypto.createHash("sha256");
  if (Buffer.isBuffer(bufferOrStream)) {
    return Promise.resolve(`sha256:${hash.update(bufferOrStream).digest("hex")}`);
  } else {
    bufferOrStream.pipe(hash);
    return new Promise((resolve, reject) => {
      bufferOrStream.on("end", () => {
        hash.end();
        resolve(`sha256:${hash.digest("hex")}`);
      });
      bufferOrStream.on("error", (err) => reject(err));
    });
  }
}

export class DigestVerifyingTransform extends Transform {
  private hash = crypto.createHash("sha256");

  constructor(private expectedDigest: string) {
    super();
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    this.hash.write(chunk, encoding);
    callback(null, chunk);
  }

  _final(callback: (error?: Error | null | undefined) => void): void {
    this.hash.end();
    const digest = this.hash.digest("hex");

    if (`sha256:${digest}` !== this.expectedDigest) {
      callback(new DigestMismatchError("Digest of downloaded blob does not match expectation"));
    } else {
      callback(null);
    }
  }
}
