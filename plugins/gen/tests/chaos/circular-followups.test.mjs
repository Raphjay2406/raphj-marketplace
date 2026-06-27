/**
 * Chaos: circular followups — recipe executor accumulates hops.
 * The current executeRecipe has no built-in hop cap (followups_enabled: true
 * with a self-referencing followup will loop). This test verifies:
 *   1. A recipe with followups_disabled terminates cleanly.
 *   2. With followups_enabled + a circular followup, we can detect the runaway
 *      by capping dispatch calls ourselves — confirming the guard is needed.
 */
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { executeRecipe } from "../../packages/asset-forge/dist/recipe.js";

const HOP_CAP = 25; // reasonable limit for test purposes

function makeOkEnvelope(artifact = {}, followups = []) {
  return {
    schema_version: "4.0.0",
    status: "ok",
    artifact,
    verdicts: [],
    followups
  };
}

test("circular-followups: recipe with followups_disabled terminates cleanly", async () => {
  let callCount = 0;
  const recipe = {
    name: "circular-test",
    version: "1.0.0",
    steps: [{ worker: "self-worker", input: {} }],
    validators_per_step: [],
    followups_enabled: false
  };

  const result = await executeRecipe({
    recipe,
    dispatch: async (worker) => {
      callCount++;
      // Even if we return a followup, it should be ignored
      return makeOkEnvelope({ worker }, [{ suggested_worker: "self-worker", reason: "loop" }]);
    }
  });

  assert.equal(callCount, 1, "exactly 1 dispatch call when followups disabled");
  assert.equal(result.status, "ok");
});

test("circular-followups: hop cap prevents unbounded dispatch with followups_enabled", async () => {
  let callCount = 0;
  const recipe = {
    name: "circular-enabled",
    version: "1.0.0",
    steps: [{ worker: "bouncer", input: {} }],
    validators_per_step: [],
    followups_enabled: true
  };

  // Wrap executeRecipe with a guarded dispatch that caps hops
  const guardedDispatch = async (worker, input) => {
    callCount++;
    if (callCount >= HOP_CAP) {
      // Return failed envelope to stop the chain (simulating external guard)
      return {
        schema_version: "4.0.0",
        status: "failed",
        artifact: null,
        verdicts: [{ validator: "hop-cap", pass: false, notes: `hop cap ${HOP_CAP} reached` }],
        followups: []
      };
    }
    // Each call emits a self-referencing followup → circular
    return makeOkEnvelope({ hop: callCount }, [{ suggested_worker: "bouncer", reason: "again" }]);
  };

  const result = await executeRecipe({ recipe, dispatch: guardedDispatch });

  assert.ok(callCount <= HOP_CAP, `dispatch called ${callCount} times — within cap of ${HOP_CAP}`);
  assert.equal(result.status, "failed", "guarded chain terminates with failed status");
  // NOTE: executeRecipe has no built-in hop cap; external caller must guard.
  // See: scripts/migrate-v3-to-v4.mjs issue CIRCULAR_FOLLOWUP error code.
});
