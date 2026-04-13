import { test } from "node:test";
import { strict as assert } from "node:assert";
import { scoreSceneCraft } from "./scene-craft.mjs";

test("full 20pts when all checks pass for cinematic intensity", () => {
  const input = {
    intensity: "cinematic",
    choreography: { cameras_coherent: true, morphs_smooth: true },
    scene_graph: { lighting_consistent: true, material_realism: 1.0 },
    perf_budget_pass: true
  };
  const result = scoreSceneCraft(input);
  assert.equal(result.skipped, undefined);
  assert.equal(result.score, 20);
  assert.equal(result.findings.length, 5);
  for (const f of result.findings) {
    assert.equal(f.award, f.max, `expected full award for ${f.key}`);
  }
});

test("skipped when intensity is not cinematic or immersive", () => {
  const result = scoreSceneCraft({ intensity: "accent" });
  assert.equal(result.skipped, true);
  assert.equal(result.score, 0);
});

test("penalizes non-coherent cameras and partial material realism", () => {
  const input = {
    intensity: "immersive",
    choreography: { cameras_coherent: false, morphs_smooth: true },
    scene_graph: { lighting_consistent: true, material_realism: 0.5 },
    perf_budget_pass: true
  };
  const result = scoreSceneCraft(input);
  assert.equal(result.skipped, undefined);
  // cameras_coherent false -> 0 (max 5), morphs_smooth true -> 4, lighting_consistent true -> 4,
  // material_realism 0.5 -> round(4 * 0.5) = 2, perf_budget_pass true -> 3 => total 13
  assert.equal(result.score, 13);
  const cam = result.findings.find(f => f.key === "choreography.cameras_coherent");
  assert.equal(cam.award, 0);
  const mat = result.findings.find(f => f.key === "scene_graph.material_realism");
  assert.equal(mat.award, 2);
});
