const RUBRIC = [
  { key: "fixation_first_element_is_cta", weight: 4 },
  { key: "saccade_path_matches_reading_order", weight: 4 },
  { key: "attention_heatmap_peak_on_primary", weight: 4 },
  { key: "hicks_choices_count", weight: 3, scorer: v => (v <= 4 ? 3 : v <= 6 ? 2 : v <= 8 ? 1 : 0) },
  { key: "reading_grade", weight: 2, scorer: v => (v <= 9 ? 2 : v <= 11 ? 1 : 0) },
  { key: "cognitive_load_pass", weight: 3 }
];

export function scoreNeuroAesthetic(input) {
  let score = 0; const findings = [];
  for (const rule of RUBRIC) {
    const v = input[rule.key];
    let award = 0;
    if (rule.scorer) award = rule.scorer(v ?? 0);
    else if (typeof v === "boolean") award = v ? rule.weight : 0;
    findings.push({ key: rule.key, award, max: rule.weight });
    score += award;
  }
  return { score, findings };
}
