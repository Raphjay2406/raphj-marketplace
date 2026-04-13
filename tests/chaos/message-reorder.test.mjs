/**
 * Chaos: envelopes with same correlation_id are mergeable / order-independent
 */
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { parseResultEnvelope, ok, failed } from "../../packages/protocol/dist/envelope.js";

test("message-reorder: envelopes with same correlation_id can be merged by id", () => {
  const corrId = "chaos-test-corr-001";

  const env1 = {
    ...ok({ step: "a" }),
    correlation_id: corrId,
    emitted_by: "worker-alpha"
  };
  const env2 = {
    ...ok({ step: "b" }),
    correlation_id: corrId,
    emitted_by: "worker-beta"
  };

  // Simulate receiving out-of-order envelopes
  const received = [env2, env1];

  // Parse both — both should be valid
  const parsed = received.map(e => parseResultEnvelope(e));
  assert.equal(parsed.length, 2);
  assert.ok(parsed.every(p => p.correlation_id === corrId), "all share same correlation_id");

  // Merge by correlation_id — deduplicate by emitted_by
  const merged = new Map();
  for (const p of parsed) {
    merged.set(p.emitted_by, p);
  }
  assert.equal(merged.size, 2, "two distinct workers");
  assert.equal(merged.get("worker-alpha").artifact.step, "a");
  assert.equal(merged.get("worker-beta").artifact.step, "b");
});

test("message-reorder: failed envelope with same correlation_id is distinguishable", () => {
  const corrId = "chaos-test-corr-002";

  const good = { ...ok("result"), correlation_id: corrId, emitted_by: "worker-ok" };
  const bad = {
    ...failed([{ validator: "schema", pass: false, notes: "invalid payload" }]),
    correlation_id: corrId,
    emitted_by: "worker-fail"
  };

  const envelopes = [bad, good].map(e => parseResultEnvelope(e));
  const hasFailure = envelopes.some(e => e.status === "failed");
  assert.ok(hasFailure, "reordered batch still detects failure");

  const failedEnvelope = envelopes.find(e => e.status === "failed");
  assert.equal(failedEnvelope.verdicts[0].validator, "schema");
});
