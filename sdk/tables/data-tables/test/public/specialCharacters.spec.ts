// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { isPlaybackMode, Recorder } from "@azure-tools/test-recorder-new";

import { TableClient, TableEntityResult, TransactionAction, odata } from "../../src";
import { createTableClient, envSetupForPlayback } from "./utils/recordedClient";
import { Context } from "mocha";
import { assert } from "chai";
import { isNode } from "@azure/test-utils";

describe("SpecialCharacters", function () {
  let client: TableClient;
  let recorder: Recorder;
  const suffix = isNode ? "Node" : "Browser";
  const tableName = `SpecialCharacterTest${suffix}`;
  const specialCharacters = [
    { char: `'`, name: "single quote" },
    { char: `"`, name: "double quote" },
    { char: `{}`, name: "curly braces" },
    { char: `[]`, name: "square braces" },
    { char: `()`, name: "parenthesis braces" },
    { char: `:`, name: "colon braces" },
    { char: `@`, name: "at" },
    { char: `&`, name: "ampersand" },
    { char: `=`, name: "equals" },
    { char: `+`, name: "plus" },
    { char: `,`, name: "comma" },
    { char: `$`, name: "dollar sing" },
    { char: `-`, name: "dash" },
    { char: `_`, name: "underscore" },
    { char: `<>`, name: "gt and lt" },
    { char: `;`, name: "semi-colon" },
    { char: `~`, name: "tilde" },
    { char: `^`, name: "hat" },
    { char: `!`, name: "bang" },
    { char: `%`, name: "percentage" },
    { char: `*`, name: "star" },
  ];

  describe("Single operations", () => {
    beforeEach(async function (this: Context) {
      recorder = new Recorder(this.currentTest);
      await recorder.start({ envSetupForPlayback });

      client = createTableClient(recorder, tableName, "TokenCredential");
    });

    afterEach(async function () {
      await recorder.stop();
    });

    after(async function () {
      if (!isPlaybackMode()) {
        await client.deleteTable();
      }
    });

    specialCharacters.forEach(({ char, name }) => {
      describe(`${name} roundtrip`, () => {
        const partitionKey = `foo${char}`;
        const rowKey = `${char}bar`;
        const value = `test${char}`;

        it("should create entity with single quote in the partitionKey and rowKey", async () => {
          await client.createTable();
          const entity = await client.createEntity({ partitionKey, rowKey, value });
          assert.isDefined(entity);
        });

        it("should upsert merge entity", async () => {
          const result = await client.upsertEntity({ partitionKey, rowKey, value }, "Merge");
          assert.isDefined(result.etag);
        });

        it("should upsert replace entity", async () => {
          const result = await client.upsertEntity({ partitionKey, rowKey, value }, "Replace");
          assert.isDefined(result.etag);
        });

        it("should update replace entity", async () => {
          const result = await client.updateEntity({ partitionKey, rowKey, value }, "Replace");
          assert.isDefined(result.etag);
        });

        it("should update merge entity", async () => {
          const result = await client.updateEntity({ partitionKey, rowKey, value }, "Merge");
          assert.isDefined(result.etag);
        });

        it("should get entity", async () => {
          const entity = await client.getEntity(partitionKey, rowKey);

          assert.equal(entity.partitionKey, partitionKey);
          assert.equal(entity.rowKey, rowKey);
          assert.equal(entity.value, value);
        });

        it("should filter entity by partition key", async () => {
          const entities = client.listEntities({
            queryOptions: { filter: odata`PartitionKey eq ${partitionKey}` },
          });

          for await (const entity of entities) {
            assert.equal(entity.partitionKey, partitionKey);
            assert.equal(entity.rowKey, rowKey);
            assert.equal(entity.value, value);
          }
        });

        it("should filter entity by row key", async () => {
          const entities = client.listEntities({
            queryOptions: { filter: odata`RowKey eq ${rowKey}` },
          });

          for await (const entity of entities) {
            assert.equal(entity.partitionKey, partitionKey);
            assert.equal(entity.rowKey, rowKey);
            assert.equal(entity.value, value);
          }
        });

        it("should delete entity", async () => {
          const result = await client.deleteEntity(partitionKey, rowKey);
          assert.ok(result);
        });
      });
    });
  });

  describe("Batch", () => {
    beforeEach(async function (this: Context) {
      recorder = new Recorder(this.currentTest);
      await recorder.start({ envSetupForPlayback });

      client = createTableClient(recorder, `${tableName}Batch`, "TokenCredential");
    });

    afterEach(async function () {
      await recorder.stop();
    });

    after(async () => {
      if (!isPlaybackMode()) {
        await client.deleteTable();
      }
    });

    const partitionKey = `foo'`;
    it("should create entity with single quote in the partitionKey and rowKey", async () => {
      await client.createTable();
      const actions: TransactionAction[] = specialCharacters.map(({ char }) => {
        const rowKey = `${char}bar`;
        const value = `test${char}`;
        const action: TransactionAction = ["create", { partitionKey, rowKey, value }];
        return action;
      });
      const result = await client.submitTransaction(actions);
      assert.equal(result.status, 202);
    });

    it("should upsert merge entity with single quote in the partitionKey and rowKey", async () => {
      const actions: TransactionAction[] = specialCharacters.map(({ char }) => {
        const rowKey = `${char}bar`;
        const value = `test${char}`;
        const action: TransactionAction = ["upsert", { partitionKey, rowKey, value }, "Merge"];
        return action;
      });
      const result = await client.submitTransaction(actions);
      assert.equal(result.status, 202);
    });

    it("should upsert replace entity with single quote in the partitionKey and rowKey", async () => {
      const actions: TransactionAction[] = specialCharacters.map(({ char }) => {
        const rowKey = `${char}bar`;
        const value = `test${char}`;
        const action: TransactionAction = ["upsert", { partitionKey, rowKey, value }, "Replace"];
        return action;
      });
      const result = await client.submitTransaction(actions);
      assert.equal(result.status, 202);
    });

    it("should update merge entity with single quote in the partitionKey and rowKey", async () => {
      const actions: TransactionAction[] = specialCharacters.map(({ char }) => {
        const rowKey = `${char}bar`;
        const value = `test${char}`;
        const action: TransactionAction = ["update", { partitionKey, rowKey, value }, "Merge"];
        return action;
      });
      const result = await client.submitTransaction(actions);
      assert.equal(result.status, 202);
    });

    it("should update replace entity with single quote in the partitionKey and rowKey", async () => {
      const actions: TransactionAction[] = specialCharacters.map(({ char }) => {
        const rowKey = `${char}bar`;
        const value = `test${char}`;
        const action: TransactionAction = ["update", { partitionKey, rowKey, value }, "Replace"];
        return action;
      });
      const result = await client.submitTransaction(actions);
      assert.equal(result.status, 202);
    });

    it(`should filter entity by partition key`, async () => {
      const entities = client.listEntities({
        queryOptions: { filter: odata`PartitionKey eq ${partitionKey}` },
      });

      const results = [];

      for await (const entity of entities) {
        results.push(entity);
      }

      assert.isTrue(results.length > 0, "Didn't get any results");
    });

    specialCharacters.forEach(({ char, name }) => {
      const rowKey = `${char}bar`;
      const value = `test${char}`;
      it(`should get entity with ${name}`, async () => {
        const entity = await client.getEntity(partitionKey, rowKey);

        assert.equal(entity.partitionKey, partitionKey);
        assert.equal(entity.rowKey, rowKey);
        assert.equal(entity.value, value);
      });

      it(`should filter entity by row key with ${name}`, async () => {
        const entities = client.listEntities({
          queryOptions: { filter: odata`RowKey eq ${rowKey}` },
        });

        const results: TableEntityResult<Record<string, unknown>>[] = [];

        for await (const entity of entities) {
          results.push(entity);
          assert.equal(entity.partitionKey, partitionKey);
          assert.equal(entity.rowKey, rowKey);
          assert.equal(entity.value, value);
        }

        const hasEntity = results.some(
          (e) => e.partitionKey === partitionKey && e.rowKey === rowKey && e.value === value
        );

        assert.isTrue(
          hasEntity,
          `Couldn't find entity with partitionKey: ${partitionKey} and rowKey: ${rowKey}`
        );
      });
    });

    it(`should delete in batch`, async () => {
      const actions: TransactionAction[] = specialCharacters.map(({ char }) => {
        const rowKey = `${char}bar`;
        const action: TransactionAction = ["delete", { partitionKey, rowKey }];
        return action;
      });
      const result = await client.submitTransaction(actions);
      assert.equal(result.status, 202);
    });
  });
});
