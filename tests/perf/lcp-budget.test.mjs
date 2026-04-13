/**
 * Perf: LCP budget validator — synthetic pass/fail assertions.
 * Real LCP measurements require a running app + Lighthouse; deferred to integration tests.
 */
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { checkPerfBudget } from "../../scripts/validators/perf-budget.mjs";

test("lcp-budget: cinematic preset passes within budget", () => {
  const metrics = {
    js_gz: 200_000,       // under 280k
    total_transfer: 4_000_000, // under 5.5MB
    lcp_ms: 2000,         // under 2400ms
    cls: 0.03,            // under 0.05
    inp_ms: 150           // under 180ms
  };

  const result = checkPerfBudget(metrics, "cinematic");
  assert.ok(result.pass, `expected pass, got: ${result.reason ?? "unknown"}`);
  assert.equal(result.skipped, undefined, "should not be skipped");
});

test("lcp-budget: cinematic preset fails on LCP overage", () => {
  const metrics = {
    js_gz: 200_000,
    total_transfer: 4_000_000,
    lcp_ms: 3500,         // over 2400ms budget
    cls: 0.03,
    inp_ms: 150
  };

  const result = checkPerfBudget(metrics, "cinematic");
  assert.equal(result.pass, false);
  assert.ok(result.reason.includes("LCP"), `reason should mention LCP: ${result.reason}`);
});

test("lcp-budget: immersive preset has relaxed LCP budget", () => {
  // immersive budget: lcp_ms 2800ms
  const metrics = {
    js_gz: 300_000,
    total_transfer: 6_000_000,
    lcp_ms: 2600,         // under 2800ms immersive budget but over 2400ms cinematic
    cls: 0.06,            // under 0.08 immersive budget
    inp_ms: 190           // under 200ms immersive budget
  };

  const result = checkPerfBudget(metrics, "immersive");
  assert.ok(result.pass, `expected pass for immersive, got: ${result.reason ?? "unknown"}`);
});

test("lcp-budget: unknown intensity skips check gracefully", () => {
  const result = checkPerfBudget({ lcp_ms: 99999, js_gz: 99999, total_transfer: 99999, cls: 1, inp_ms: 99999 }, "unknown-preset");
  assert.ok(result.pass, "unknown intensity should not fail — skip gracefully");
  assert.equal(result.skipped, true);
});
