import { test } from "node:test";
import { strict as assert } from "node:assert";
import { checkPerfBudget, BUDGET_TABLE } from "./perf-budget.mjs";

test("passes when all metrics are under cinematic budget", () => {
  const metrics = {
    js_gz: 250_000,
    total_transfer: 4_000_000,
    lcp_ms: 2000,
    cls: 0.03,
    inp_ms: 150,
  };
  const result = checkPerfBudget(metrics, "cinematic");
  assert.equal(result.pass, true);
  assert.equal(result.skipped, undefined);
});

test("fails when JS exceeds cinematic budget", () => {
  const metrics = {
    js_gz: 300_000, // over 280_000
    total_transfer: 4_000_000,
    lcp_ms: 2000,
    cls: 0.03,
    inp_ms: 150,
  };
  const result = checkPerfBudget(metrics, "cinematic");
  assert.equal(result.pass, false);
  assert.match(result.reason, /JS \d+ > budget \d+/);
});

test("fails when LCP exceeds immersive budget", () => {
  const metrics = {
    js_gz: 380_000,
    total_transfer: 7_000_000,
    lcp_ms: 3000, // over 2800
    cls: 0.06,
    inp_ms: 180,
  };
  const result = checkPerfBudget(metrics, "immersive");
  assert.equal(result.pass, false);
  assert.match(result.reason, /LCP \d+ms > budget \d+ms/);
});

test("is skipped for intensity=accent", () => {
  const result = checkPerfBudget({}, "accent");
  assert.equal(result.pass, true);
  assert.equal(result.skipped, true);
});
