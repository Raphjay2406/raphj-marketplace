const RUBRIC = [
  { key: "choreography.cameras_coherent", weight: 5, label: "Camera coherence across sections" },
  { key: "choreography.morphs_smooth",    weight: 4, label: "Morph-target smoothness" },
  { key: "scene_graph.lighting_consistent", weight: 4, label: "Lighting consistency with DNA" },
  { key: "scene_graph.material_realism",  weight: 4, label: "Material realism (0..1)" },
  { key: "perf_budget_pass",              weight: 3, label: "Perf budget compliance" }
];

function resolve(obj, path) { return path.split(".").reduce((a, k) => a?.[k], obj); }

export function scoreSceneCraft(input) {
  if (input.intensity !== "cinematic" && input.intensity !== "immersive") return { skipped: true, score: 0 };
  let score = 0;
  const findings = [];
  for (const rule of RUBRIC) {
    const v = resolve(input, rule.key);
    let award = 0;
    if (typeof v === "boolean") award = v ? rule.weight : 0;
    else if (typeof v === "number") award = Math.round(rule.weight * v);
    findings.push({ key: rule.key, label: rule.label, award, max: rule.weight });
    score += award;
  }
  return { score, findings };
}
