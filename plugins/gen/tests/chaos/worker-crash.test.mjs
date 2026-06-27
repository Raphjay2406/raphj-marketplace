/**
 * Chaos: GenorahError thrown in handler produces a failed envelope (not a crash)
 */
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { dispatch } from "../../packages/protocol/dist/dispatch.js";
import { GenorahError } from "../../packages/protocol/dist/errors.js";

test("worker-crash: GenorahError produces failed envelope", async () => {
  const result = await dispatch({
    worker: "chaos-worker",
    payload: { trigger: "crash" },
    handler: async () => {
      throw new GenorahError({
        code: "WORKER_TIMEOUT",
        message: "chaos-induced timeout",
        recovery_hint: "retry_with_fallback"
      });
    }
  });

  assert.equal(result.status, "failed", "crashed worker returns failed envelope");
  assert.equal(result.artifact, null, "artifact is null on failure");
  assert.ok(result.verdicts.length > 0, "verdicts contain error info");
  assert.ok(result.verdicts[0].notes.includes("chaos-induced timeout"));
  assert.equal(result.emitted_by, "chaos-worker");
  assert.ok(typeof result.correlation_id === "string" && result.correlation_id.length > 0,
    "correlation_id assigned even on failure");
});

test("worker-crash: non-GenorahError propagates as thrown exception", async () => {
  let threw = false;
  try {
    await dispatch({
      worker: "chaos-worker-2",
      payload: {},
      handler: async () => {
        throw new RangeError("unexpected native error");
      }
    });
  } catch (e) {
    threw = true;
    assert.ok(e instanceof RangeError, "native errors are not swallowed");
  }
  assert.ok(threw, "non-GenorahError must propagate");
});

test("worker-crash: successful handler returns ok envelope with correlation_id", async () => {
  const result = await dispatch({
    worker: "healthy-worker",
    payload: { value: 42 },
    handler: async (p) => ({
      schema_version: "4.0.0",
      status: "ok",
      artifact: { doubled: p.value * 2 },
      verdicts: [],
      followups: []
    })
  });

  assert.equal(result.status, "ok");
  assert.equal(result.artifact.doubled, 84);
  assert.equal(result.emitted_by, "healthy-worker");
});
