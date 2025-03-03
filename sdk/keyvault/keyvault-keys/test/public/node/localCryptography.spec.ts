// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { KeyClient, KeyVaultKey, SignatureAlgorithm } from "../../../src/index.js";
import { CryptographyClient } from "../../../src/index.js";
import { createHash } from "node:crypto";
import { authenticate, envSetupForPlayback } from "../utils/testAuthentication.js";
import type TestClient from "../utils/testClient.js";
import { Recorder, env, isLiveMode } from "@azure-tools/test-recorder";
import type { ClientSecretCredential } from "@azure/identity";
import { RsaCryptographyProvider } from "../../../src/cryptography/rsaCryptographyProvider.js";
import { describe, it, assert, expect, beforeEach, afterEach } from "vitest";

describe("Local cryptography public tests", () => {
  const keyPrefix = `localCrypto${env.KEY_NAME || "KeyName"}`;
  let client: KeyClient;
  let testClient: TestClient;
  let recorder: Recorder;
  let credential: ClientSecretCredential;
  let keySuffix: string;

  beforeEach(async function (ctx) {
    recorder = new Recorder(ctx);
    await recorder.start(envSetupForPlayback);

    const authentication = await authenticate(recorder);
    client = authentication.client;
    testClient = authentication.testClient;
    credential = authentication.credential;
    keySuffix = authentication.keySuffix;
  });

  afterEach(async function () {
    await recorder.stop();
  });

  describe("When using a local JsonWebToken", function () {
    let customKeyName;
    let customKeyVaultKey: KeyVaultKey;
    let cryptoClientFromKey: CryptographyClient;

    beforeEach(async function () {
      customKeyName = testClient.formatName(`${keyPrefix}-beforeeachhook-${keySuffix}`);
      customKeyVaultKey = await client.createKey(customKeyName, "RSA");
      cryptoClientFromKey = new CryptographyClient(customKeyVaultKey.key!);
    });

    it("the CryptographyClient can be created from a local JsonWebKey object", async () => {
      assert.isEmpty(cryptoClientFromKey.vaultUrl);
      assert.equal(cryptoClientFromKey.keyID, customKeyVaultKey.id);
    });

    describe("when using an unsupported algorithm", function () {
      it("throws on encrypt", async () => {
        await expect(cryptoClientFromKey.encrypt("foo", Buffer.from("bar"))).rejects.toThrow(
          /using a local JsonWebKey/,
        );
      });

      it("throws on wrapKey", async () => {
        await expect(cryptoClientFromKey.wrapKey("A128KW", Buffer.from("bar"))).rejects.toThrow(
          /using a local JsonWebKey/,
        );
      });

      it("throws on sign", async () => {
        await expect(cryptoClientFromKey.sign("RSA1_5", Buffer.from("bar"))).rejects.toThrow(
          /using a local JsonWebKey/,
        );
      });

      it("throws on signData", async () => {
        await expect(cryptoClientFromKey.signData("PS360", Buffer.from("bar"))).rejects.toThrow(
          /using a local JsonWebKey/,
        );
      });

      it("throws on verify", async () => {
        await expect(
          cryptoClientFromKey.verify("PS360", Buffer.from("bar"), Buffer.from("baz")),
        ).rejects.toThrow(/using a local JsonWebKey/);
      });

      it("throws on verifyData", async () => {
        await expect(
          cryptoClientFromKey.verifyData("PS360", Buffer.from("bar"), Buffer.from("baz")),
        ).rejects.toThrow(/using a local JsonWebKey/);
      });
    });

    describe("when using an unsupported operation", function () {
      it("throws on decrypt", async () => {
        await expect(cryptoClientFromKey.decrypt("RSA1_5", Buffer.from("bar"))).rejects.toThrow(
          /using a local JsonWebKey/,
        );
      });

      it("throws on unwrapKey", async () => {
        await expect(cryptoClientFromKey.unwrapKey("RSA1_5", Buffer.from("bar"))).rejects.toThrow(
          /using a local JsonWebKey/,
        );
      });
    });
  });

  it("encrypt & decrypt RSA1_5", async function (ctx) {
    if (!isLiveMode()) {
      console.log("Skipping test, Local encryption can't be tested on playback");
      ctx.skip();
    }
    const keyName = testClient.formatName(`${keyPrefix}-${ctx.task.name}-${keySuffix}`);
    const keyVaultKey = await client.createKey(keyName, "RSA");
    const cryptoClient = new CryptographyClient(keyVaultKey.id!, credential, {
      disableChallengeResourceVerification: !isLiveMode(),
    });

    const localCryptoClient = new CryptographyClient(keyVaultKey.key!);
    const text = Buffer.from(ctx.task.name);
    const encrypted = await localCryptoClient.encrypt("RSA1_5", text);
    const unwrapped = await cryptoClient.decrypt("RSA1_5", encrypted.result);
    assert.deepEqual(unwrapped.result, text);
    await testClient.flushKey(keyName);
  });

  it("encrypt & decrypt RSA-OAEP", async function (ctx) {
    if (!isLiveMode()) {
      console.log("Skipping test, Local encryption can't be tested on playback");
      ctx.skip();
    }
    const keyName = testClient.formatName(`${keyPrefix}-${ctx.task.name}-${keySuffix}`);
    const keyVaultKey = await client.createKey(keyName, "RSA");
    const cryptoClient = new CryptographyClient(keyVaultKey.id!, credential, {
      disableChallengeResourceVerification: !isLiveMode(),
    });

    const localCryptoClient = new CryptographyClient(keyVaultKey.key!);
    const text = Buffer.from(ctx.task.name);
    const encrypted = await localCryptoClient.encrypt("RSA-OAEP", text);
    const unwrapped = await cryptoClient.decrypt("RSA-OAEP", encrypted.result);
    assert.deepEqual(unwrapped.result, text);
    await testClient.flushKey(keyName);
  });

  it("wrapKey & unwrapKey RSA1_5", async function (ctx) {
    if (!isLiveMode()) {
      console.log("Skipping test, Local encryption can't be tested on playback");
      ctx.skip();
    }
    const keyName = testClient.formatName(`${keyPrefix}-${ctx.task.name}-${keySuffix}`);
    const keyVaultKey = await client.createKey(keyName, "RSA");
    const cryptoClient = new CryptographyClient(keyVaultKey.id!, credential, {
      disableChallengeResourceVerification: !isLiveMode(),
    });

    const localCryptoClient = new CryptographyClient(keyVaultKey.key!);
    const data = Buffer.from("arepa");
    const wrapped = await localCryptoClient.wrapKey("RSA1_5", data);

    // Local Cryptography Client part
    // unwrapKey is not implemented locally yet
    const unwrapped = await cryptoClient.unwrapKey("RSA1_5", wrapped.result);
    assert.deepEqual(unwrapped.result, data);
    await testClient.flushKey(keyName);
  });

  it("wrapKey & unwrapKey RSA-OAEP", async function (ctx) {
    if (!isLiveMode()) {
      console.log("Skipping test, Local encryption can't be tested on playback");
      ctx.skip();
    }
    const keyName = testClient.formatName(`${keyPrefix}-${ctx.task.name}-${keySuffix}`);
    const keyVaultKey = await client.createKey(keyName, "RSA");
    const cryptoClient = new CryptographyClient(keyVaultKey.id!, credential, {
      disableChallengeResourceVerification: !isLiveMode(),
    });

    const localCryptoClient = new CryptographyClient(keyVaultKey.key!);
    const data = Buffer.from("arepa");
    const wrapped = await localCryptoClient.wrapKey("RSA-OAEP", data);

    // Local Cryptography Client part
    // unwrapKey is not implemented locally yet
    const unwrapped = await cryptoClient.unwrapKey("RSA-OAEP", wrapped.result);
    assert.deepEqual(unwrapped.result, data);
    await testClient.flushKey(keyName);
  });

  describe("verify", () => {
    const rsaProvider = new RsaCryptographyProvider({});
    const localSupportedAlgorithmNames = Object.keys(rsaProvider.signatureAlgorithmToHashAlgorithm);

    for (const localAlgorithmName of localSupportedAlgorithmNames) {
      it(localAlgorithmName, async function (ctx): Promise<void> {
        const keyName = testClient.formatName(`${keyPrefix}-${ctx.task.name}-${keySuffix}`);
        const keyVaultKey = await client.createKey(keyName, "RSA");
        const cryptoClient = new CryptographyClient(
          keyVaultKey.id!,
          credential,
          recorder.configureClientOptions({ disableChallengeResourceVerification: !isLiveMode() }),
        );

        // Sign is not implemented yet.
        // This boils down to the JWK to PEM conversion, which doesn't support private keys at the moment.
        const signatureValue = ctx.task.name;
        const hash = createHash(rsaProvider.signatureAlgorithmToHashAlgorithm[localAlgorithmName]);
        hash.update(signatureValue);
        const digest = hash.digest();
        const signature = await cryptoClient.sign(localAlgorithmName as SignatureAlgorithm, digest);

        // Local Cryptography Client part
        const localCryptoClient = new CryptographyClient(keyVaultKey.key!);
        const verifyResult = await localCryptoClient.verifyData(
          localAlgorithmName,
          digest,
          signature.result,
        );
        assert.ok(verifyResult);

        await testClient.flushKey(keyName);
      });
    }
  });
});
