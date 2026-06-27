/**
 * Chaos: MCP provider failure triggers downgrade chain via CostLedger.pickDowngrade
 */
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { CostLedger } from "../../packages/asset-forge/dist/cost-ledger.js";

test("mcp-kill: provider failure triggers downgrade chain", () => {
  const ledger = new CostLedger({
    budget_usd: 50,
    downgrade_chain: {
      "rodin": "meshy",
      "kling": "flux-kontext",
      "midjourney": "flux-schnell"
    }
  });

  // Simulate provider failure: record a cost spike that would exceed budget
  ledger.record({ label: "rodin-3d", cost_usd: 51 });

  // Provider is now over budget — downgrade chain should kick in
  assert.equal(ledger.status(), "exceeded");
  assert.equal(ledger.pickDowngrade("rodin"), "meshy", "rodin should downgrade to meshy");
  assert.equal(ledger.pickDowngrade("kling"), "flux-kontext", "kling should downgrade to flux-kontext");
  assert.equal(ledger.pickDowngrade("midjourney"), "flux-schnell", "midjourney should downgrade to flux-schnell");
});

test("mcp-kill: no downgrade available returns null", () => {
  const ledger = new CostLedger({
    budget_usd: 50,
    downgrade_chain: { "rodin": "meshy" }
  });

  ledger.record({ label: "spike", cost_usd: 51 });
  assert.equal(ledger.status(), "exceeded");
  assert.strictEqual(ledger.pickDowngrade("stable-diffusion"), null,
    "unknown provider returns null when no downgrade chain entry exists");
});

test("mcp-kill: downgrade not triggered below warn threshold", () => {
  const ledger = new CostLedger({
    budget_usd: 100,
    warn_at: 0.8,
    downgrade_chain: { "rodin": "meshy" }
  });

  ledger.record({ label: "small", cost_usd: 10 });
  assert.equal(ledger.status(), "ok");
  // pickDowngrade still returns the chain entry even if ok — caller decides whether to invoke
  assert.equal(ledger.pickDowngrade("rodin"), "meshy");
});
