/**
 * Perf: JS bundle budget validator — synthetic pass/fail assertions.
 * Real bundle sizes require a production build; deferred to integration tests.
 */
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { checkPerfBudget } from "../../scripts/validators/perf-budget.mjs";

test("js-budget: cinematic preset passes within JS bundle budget", () => {
  const metrics = {
    js_gz: 150_000,       // well under 280k
    total_transfer: 2_000_000,
    lcp_ms: 1500,
    cls: 0.01,
    inp_ms: 100
  };

  const result = checkPerfBudget(metrics, "cinematic");
  assert.ok(result.pass, `expected pass, got: ${result.reason ?? "unknown"}`);
});

test("js-budget: fails when JS bundle exceeds cinematic budget (280kb gzip)", () => {
  const metrics = {
    js_gz: 320_000,       // over 280k budget
    total_transfer: 2_000_000,
    lcp_ms: 1500,
    cls: 0.01,
    inp_ms: 100
  };

  const result = checkPerfBudget(metrics, "cinematic");
  assert.equal(result.pass, false);
  assert.ok(result.reason.includes("JS"), `reason should mention JS: ${result.reason}`);
  assert.ok(result.reason.includes("280000"), `reason should state budget: ${result.reason}`);
});

test("js-budget: fails when total transfer exceeds cinematic budget (5.5MB)", () => {
  const metrics = {
    js_gz: 200_000,
    total_transfer: 6_000_000, // over 5.5MB budget
    lcp_ms: 1500,
    cls: 0.01,
    inp_ms: 100
  };

  const result = checkPerfBudget(metrics, "cinematic");
  assert.equal(result.pass, false);
  assert.ok(result.reason.includes("transfer"), `reason should mention transfer: ${result.reason}`);
});

test("js-budget: immersive preset allows larger JS bundle (400kb gzip)", () => {
  const metrics = {
    js_gz: 380_000,       // over cinematic 280k but under immersive 400k
    total_transfer: 5_000_000,
    lcp_ms: 2500,
    cls: 0.05,
    inp_ms: 180
  };

  const result = checkPerfBudget(metrics, "immersive");
  assert.ok(result.pass, `immersive allows 400kb JS: ${result.reason ?? "ok"}`);
});
