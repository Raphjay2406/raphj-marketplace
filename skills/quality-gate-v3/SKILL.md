---
name: quality-gate-v3
description: Two-axis 394-pt quality gate — Design Craft 254 (12 inherited + Scene Craft 13th category) + UX Integrity 140 (120 inherited + Neuro-aesthetic 14th category, 20 pts). A section must clear BOTH axes for tier >= Strong. Six UX sub-gates with machine-checkable binary items replace vague aesthetic-only scoring. Scene Craft (20 pts) activates only for intensity=cinematic|immersive. Supersedes quality-gate-v2 once all v3.5.0 measurement skills ship.
tier: core
triggers: quality-gate, quality-gate-v3, ux-integrity, two-axis, 374, 394, 254, scene-craft, neuro-aesthetic, scoring, tier
version: 0.3.0
status: PROVISIONAL — numeric thresholds recalibrated after research tracks R1/R5/R8 complete (see docs/v3.5-research-program.md). Scene Craft added in v4 M3. Neuro-aesthetic (14th category) added in v4 M4.
---

# Quality Gate v3 — Two-Axis 394-pt (v4 M4)

Supersedes `quality-gate-v2` when v3.5.0 ships. Until then, runs in shadow mode: scores computed for reporting but not enforced. v2 remains authoritative through v3.4.x.

Design Craft axis expanded from **234 → 254 pts** in v4 M3 by adding Scene Craft as the 13th category (20 pts, cinematic/immersive projects only). Total gate moves from 354 → 374 pts. Tier thresholds shift proportionally.

**v4 M4 addition:** UX Integrity axis expanded from **120 → 140 pts** by adding Neuro-aesthetic as the 14th quality category (20 pts, all projects). Total gate moves from 374 → **394 pts**. Scored by `scripts/validators/neuro-aesthetic.mjs`; rubric: fixation on CTA (4), saccade path (4), attention heatmap peak (4), Hick's law choices (3), reading grade (2), cognitive load (3).

## Layer 1 — When to use

Invoked by `quality-reviewer` at pipeline Stage 9 (Audit) and by `/gen:audit`. A section must clear **both axes** at the target tier — a 230 design with 62 UX is a Baseline section regardless of aesthetic craft.

Scene Craft scoring is conditional: projects with `intensity !== cinematic && intensity !== immersive` skip the category; the denominator drops to 234 for those projects (preserving v2 parity).

## Layer 2 — The two axes

### Axis 1: Design Craft (254 pts — 12 inherited + Scene Craft)

The first 12 categories (234 pts) are identical to `quality-gate-v2` with v3.4.2 measurement rules applied (archetype testable-markers, DNA drift enforced, motion-health measured, SSIM cap). See `skills/quality-gate-v2/SKILL.md` §v3.4.2 Addendum.

**13th category — Scene Craft (20 pts)** — cinematic/immersive only.

Scored by `scripts/validators/scene-craft.mjs`:

| Criterion | Weight | Measurement |
|---|---|---|
| Camera coherence across sections | 5 | `choreography.cameras_coherent` boolean |
| Morph-target smoothness | 4 | `choreography.morphs_smooth` boolean |
| Lighting consistency with DNA | 4 | `scene_graph.lighting_consistent` boolean |
| Material realism | 4 | `scene_graph.material_realism` float 0..1 (partial credit) |
| Perf budget compliance | 3 | `perf_budget_pass` boolean |

Partial credit: numeric inputs award `round(weight × value)` — e.g. `material_realism: 0.75` → 3 pts of 4.

Scene Craft skip-when-not-cinematic: returns `{ skipped: true, score: 0 }` and the max denominator for that audit is 234, not 254. Both raw and effective denominators must be surfaced in SUMMARY.md.

### Axis 2: UX Integrity (120 pts — unchanged)

Six sub-gates, binary machine-checkable items. No subjective scoring.

| Sub-gate | Pts | Skill |
|---|---|---|
| **UX Heuristics** (Nielsen 10) | 20 | `ux-heuristics-gate` |
| **Interaction Fidelity** | 20 | `interaction-fidelity-gate` |
| **Cognitive Load** | 20 | `cognitive-load-gate` |
| **Conversion Integrity** | 20 | `conversion-gate` |
| **Visual Craft (Quantified)** | 20 | `visual-craft-quantified` |
| **Synthetic Usability** | 20 | `synthetic-user-testing` (6 personas) |

Each sub-gate has its own skill (all provisional, landing across v3.5.0–2).

### Tier scale (both axes required)

Thresholds adjusted for 254-pt Design axis (cinematic). Non-cinematic projects use the 234-pt column.

| Tier | Design (254) | Design (234) | UX |
|---|---|---|---|
| Reject | < 150 | < 140 | < 70 |
| Baseline | 150–184 | 140–169 | 70–84 |
| Strong | 185–214 | 170–199 | 85–99 |
| SOTD | 215–234 | 200–219 | 100–109 |
| Honoree | 235–254 | 220–234 | 110–119 |
| SOTM | 255+ | 235+ | 120 |

### Archetype-weighted UX floor (PROVISIONAL, calibrated via R5)

| Archetype | UX floor override |
|---|---|
| Brutalist | 65 (bold archetype allowance) |
| Vaporwave / Y2K / Retro-Future | 70 |
| Playful / Neubrutalism | 75 |
| Editorial / Neo-Corporate / Swiss / Data-Dense | 80 |
| Default | 75 |

Floor applies to BLOCK threshold only; tier scale unchanged.

## Layer 3 — Integration

- **Cascade inherited from v2**: sub-gate failures (motion-health, DNA drift, SSIM, asset-forge) cap the relevant category. Applied to Axis 1 (Design) unless specified otherwise.
- **Scene Craft cap**: `scoreSceneCraft` result injected into Design Craft total after category 12. If `skipped`, category is omitted and denominator shown as 234.
- **UX sub-gates** apply caps within their own axis only — e.g. Synthetic Usability fail caps itself × 0.5.
- **SUMMARY.md cascade block** extended to show both axes, Scene Craft category (or "skipped"), and both raw/effective scores per axis.
- **Ledger writes**: each sub-gate verdict emits `{kind: "subgate-fired", subject: <section-id>, payload: {gate, raw, cap, effective, reason}}`. Scene Craft emits `{kind: "scene-craft-scored", subject: <section-id>, payload: {score, findings, skipped}}`.

## Layer 4 — Anti-patterns

- Reporting only the combined score — tier requires **both** axes, report both.
- Using v3 while any UX sub-gate skill is unshipped — scores will be partial and misleading; stay on v2 until all v3.5.0 sub-gates land.
- Silently applying archetype UX floor override without surfacing it in SUMMARY.md — transparency is mandatory.
- Averaging Design + UX to single number — they're independently gated; averaging hides failure mode.
- Treating UX sub-gate penalties as aesthetic penalties — they cap Axis 2 only, not Axis 1.
- Applying the 254-pt denominator to non-cinematic/immersive projects — Scene Craft is conditional; wrong denominator inflates failure rate.
- Awarding full material_realism weight for float values — partial credit (`round(weight × value)`) is mandatory.
