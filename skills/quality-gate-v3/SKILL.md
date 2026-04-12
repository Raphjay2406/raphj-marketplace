---
name: quality-gate-v3
description: Two-axis 354-pt quality gate — Design Craft 234 (existing v2 rubric) + UX Integrity 120 (new in v3.5). A section must clear BOTH axes for tier ≥ Strong. Six UX sub-gates with machine-checkable binary items replace vague aesthetic-only scoring. Supersedes quality-gate-v2 once all v3.5.0 measurement skills ship.
tier: core
triggers: quality-gate, quality-gate-v3, ux-integrity, two-axis, 354, scoring, tier
version: 0.1.0-provisional
status: PROVISIONAL — numeric thresholds recalibrated after research tracks R1/R5/R8 complete (see docs/v3.5-research-program.md).
---

# Quality Gate v3 — Two-Axis 354-pt

Supersedes `quality-gate-v2` when v3.5.0 ships. Until then, runs in shadow mode: scores computed for reporting but not enforced. v2 remains authoritative through v3.4.x.

## Layer 1 — When to use

Invoked by `quality-reviewer` at pipeline Stage 9 (Audit) and by `/gen:audit`. A section must clear **both axes** at the target tier — a 220 design with 62 UX is a Baseline section regardless of aesthetic craft.

## Layer 2 — The two axes

### Axis 1: Design Craft (234 pts — inherit v2)

Identical rubric to `quality-gate-v2` with v3.4.2 measurement rules applied (archetype testable-markers, DNA drift enforced, motion-health measured, SSIM cap). See `skills/quality-gate-v2/SKILL.md` §v3.4.2 Addendum.

### Axis 2: UX Integrity (120 pts — new)

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

| Tier | Design | UX |
|---|---|---|
| Reject | < 140 | < 70 |
| Baseline | 140–169 | 70–84 |
| Strong | 170–199 | 85–99 |
| SOTD | 200–219 | 100–109 |
| Honoree | 220–234 | 110–119 |
| SOTM | 235+ | 120 |

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
- **UX sub-gates** apply caps within their own axis only — e.g. Synthetic Usability fail caps itself × 0.5.
- **SUMMARY.md cascade block** extended to show both axes and both raw/effective scores per axis.
- **Ledger writes**: each sub-gate verdict emits `{kind: "subgate-fired", subject: <section-id>, payload: {gate, raw, cap, effective, reason}}`.

## Layer 4 — Anti-patterns

- ❌ Reporting only the combined score — tier requires **both** axes, report both.
- ❌ Using v3 while any UX sub-gate skill is unshipped — scores will be partial and misleading; stay on v2 until all v3.5.0 sub-gates land.
- ❌ Silently applying archetype UX floor override without surfacing it in SUMMARY.md — transparency is mandatory.
- ❌ Averaging Design + UX to single number — they're independently gated; averaging hides failure mode.
- ❌ Treating UX sub-gate penalties as aesthetic penalties — they cap Axis 2 only, not Axis 1.
