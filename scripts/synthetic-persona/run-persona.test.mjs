import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { probeSection, runAllPersonas } from "./run-persona.mjs";

describe("probeSection", () => {
  it("returns confused for first-timer when valuePropClarity < 60", () => {
    const persona = { id: "first-timer", valuePropThreshold: 8, touchTarget: false, a11yDependent: false };
    const result = probeSection(persona, "hero", { valuePropClarity: 45 });
    assert.equal(result.status, "confused");
    assert.ok(result.detail.includes("45"));
    assert.equal(result.converted, false);
  });

  it("returns converted for first-timer when valuePropClarity >= 60", () => {
    const persona = { id: "first-timer", valuePropThreshold: 8, touchTarget: false, a11yDependent: false };
    const result = probeSection(persona, "hero", { valuePropClarity: 80 });
    assert.equal(result.status, "converted");
    assert.equal(result.converted, true);
  });

  it("returns abandoned for skeptic when pricingAboveFold is false", () => {
    const persona = { id: "skeptic", valuePropThreshold: 10, touchTarget: false, a11yDependent: false };
    const result = probeSection(persona, "pricing", { pricingAboveFold: false });
    assert.equal(result.status, "abandoned");
    assert.equal(result.converted, false);
  });

  it("luxury archetype overrides skeptic abandoned status", () => {
    const persona = { id: "skeptic", valuePropThreshold: 10, touchTarget: false, a11yDependent: false };
    const result = probeSection(persona, "pricing", { pricingAboveFold: false, archetype: "luxury" });
    assert.equal(result.status, "converted");
    assert.equal(result.converted, true);
  });

  it("flags touch target too small for mobile-thumb persona", () => {
    const persona = { id: "mobile-thumb", valuePropThreshold: 10, touchTarget: true, a11yDependent: false };
    const result = probeSection(persona, "hero", { minTouchTargetPx: 32 });
    assert.equal(result.status, "confused");
    assert.ok(result.croFlags.includes("touch-target-too-small"));
  });

  it("flags missing landmarks for screen-reader persona", () => {
    const persona = { id: "screen-reader", valuePropThreshold: 10, touchTarget: false, a11yDependent: true };
    const result = probeSection(persona, "nav", { hasLandmarks: false });
    assert.equal(result.status, "confused");
    assert.ok(result.croFlags.includes("missing-landmarks"));
  });

  it("flags generic CTA label", () => {
    const persona = { id: "returning-pro", valuePropThreshold: 5, touchTarget: false, a11yDependent: false };
    const result = probeSection(persona, "cta", { ctaLabel: "Click Here" });
    assert.ok(result.croFlags.includes("generic-cta"));
  });
});

describe("runAllPersonas", () => {
  it("emits findings_ready and returns completion rate for clean sections", async () => {
    const lines = [];
    const origWrite = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk) => { lines.push(chunk); return true; };

    const report = await runAllPersonas(
      ["hero", "features"],
      { valuePropClarity: 90, pricingAboveFold: true, hasLandmarks: true, minTouchTargetPx: 48 },
      "wave-test"
    );

    process.stdout.write = origWrite;

    assert.ok(report.completionRate >= 0 && report.completionRate <= 1);
    assert.ok(Array.isArray(report.croFlags));
    const finalEvent = lines
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean)
      .find(e => e.status === "findings_ready");
    assert.ok(finalEvent, "findings_ready event should be emitted");
    assert.equal(finalEvent.wave_id, "wave-test");
  });
});
