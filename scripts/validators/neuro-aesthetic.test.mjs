import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { scoreNeuroAesthetic } from "./neuro-aesthetic.mjs";

describe("neuro-aesthetic validator", () => {
  it("full 20pt — all passing inputs", () => {
    const result = scoreNeuroAesthetic({
      fixation_first_element_is_cta: true,
      saccade_path_matches_reading_order: true,
      attention_heatmap_peak_on_primary: true,
      hicks_choices_count: 3,
      reading_grade: 8,
      cognitive_load_pass: true,
    });
    assert.equal(result.score, 20, `expected 20, got ${result.score}`);
    assert.equal(result.findings.length, 6);
  });

  it("off-CTA penalty — fixation not on CTA drops 4pts", () => {
    const result = scoreNeuroAesthetic({
      fixation_first_element_is_cta: false,
      saccade_path_matches_reading_order: true,
      attention_heatmap_peak_on_primary: true,
      hicks_choices_count: 3,
      reading_grade: 8,
      cognitive_load_pass: true,
    });
    assert.equal(result.score, 16, `expected 16, got ${result.score}`);
    const ctaFinding = result.findings.find(f => f.key === "fixation_first_element_is_cta");
    assert.equal(ctaFinding.award, 0);
  });

  it("Hick's law penalty — 9 choices scores 0 for that rule", () => {
    const result = scoreNeuroAesthetic({
      fixation_first_element_is_cta: true,
      saccade_path_matches_reading_order: true,
      attention_heatmap_peak_on_primary: true,
      hicks_choices_count: 9,
      reading_grade: 8,
      cognitive_load_pass: true,
    });
    // hicks_choices_count: 9 → scorer returns 0 (>8), so 3 pts lost
    assert.equal(result.score, 17, `expected 17, got ${result.score}`);
    const hicksFinding = result.findings.find(f => f.key === "hicks_choices_count");
    assert.equal(hicksFinding.award, 0);
  });
});
