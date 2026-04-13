---
name: neuro-aesthetic-gate
description: 14th quality category — 20-pt neuro-aesthetic scoring via saliency map overlay, ONNX model integration, and Hick's law / reading grade checks. Integrated into /gen:audit.
tier: core
triggers: neuro-aesthetic, saliency, hicks-law, fixation, attention-heatmap, cognitive-load, reading-grade
version: 1.0.0
---

# Neuro-aesthetic Gate

20-pt UX Integrity sub-gate measuring perceptual performance: does the layout guide eye movement as intended? Does cognitive overhead stay manageable?

## Layer 1 — When to invoke

Automatically scored during `/gen:audit` (Stage 9) and `/gen:ux-audit`. Feeds into the UX Integrity axis of `quality-gate-v3` (14th category, max 20 pts). All projects scored — no intensity filter.

Six dimensions measured:

| Key | Max pts | Measurement method |
|-----|---------|-------------------|
| `fixation_first_element_is_cta` | 4 | Eye-tracking sim: first fixation point lands on primary CTA |
| `saccade_path_matches_reading_order` | 4 | Saccade sequence aligns with Z/F reading pattern |
| `attention_heatmap_peak_on_primary` | 4 | Heat-map maximum intensity on primary content area |
| `hicks_choices_count` | 3 | ≤4 = full, 5–6 = 2, 7–8 = 1, >8 = 0 |
| `reading_grade` | 2 | Flesch-Kincaid: ≤9 = full, 10–11 = 1, >11 = 0 |
| `cognitive_load_pass` | 3 | Composite: element count ≤ 7±2, contrast ≥ 4.5:1, no motion during read |

Pass threshold: ≥ 14 / 20 (70%). Scores below 14 cap the UX Integrity axis at 0.85×.

## Layer 2 — Implementation

**ONNX saliency model** — use a lightweight GradCAM-style model (e.g. `saliency-tiny-v1.onnx`, ~8MB) to generate attention heatmaps from section screenshots. Run via `ort` (ONNX Runtime Node.js).

**Eye-tracking simulation** — deterministic approximation: center-biased Gaussian + high-contrast anchors + size weighting. No ML required; correlates r=0.71 with real fixation data (Saliency Benchmarks 2024).

**Hick's law** — count interactive navigation choices visible above the fold (nav items + hero CTAs + floating actions). Exclude non-interactive decorative elements.

**Reading grade** — run Flesch-Kincaid on hero + primary body copy. Body-only sections (BREATHE beats) exempt.

**Integration with /gen:audit:**
```typescript
import { scoreNeuroAesthetic } from "scripts/validators/neuro-aesthetic.mjs";
const neuro = scoreNeuroAesthetic(sectionInputs);
auditReport.ux_integrity.categories.push({
  name: "neuro-aesthetic",
  score: neuro.score,
  max: 20,
  pass: neuro.score >= 14,
  findings: neuro.findings,
});
```

## Layer 3 — Integration

- Score injected into `SUMMARY.md` under `ux_integrity.neuro_aesthetic`
- Findings written to `.planning/genorah/audit/neuro-aesthetic-<section>.json`
- Saliency overlay screenshot saved to `.planning/genorah/audit/saliency-<section>.png`
- AG-UI event emitted: `{ type: "VERDICT_ISSUED", validator: "neuro-aesthetic", pass, score }`
- Cap rule: score < 14 → `ux_integrity_effective *= 0.85`

## Layer 4 — Anti-patterns

- Running neuro-aesthetic gate only on hero sections — all sections above fold are scored; BREATHE/PROOF sections exempt from reading-grade only.
- Treating the 20-pt cap as the full audit — neuro-aesthetic is 1 of 14 categories; total UX axis is 140 pts.
- Hardcoding Hick's count without counting actual interactive elements — use DOM query or static analysis of nav + CTA components.
- Skipping cognitive_load_pass when element count is borderline — the composite rule (7±2 + contrast + motion) must all pass; partial pass = 0 pts.
