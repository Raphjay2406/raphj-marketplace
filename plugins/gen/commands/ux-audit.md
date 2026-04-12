---
description: "Standalone UX Integrity audit — runs all 6 quality-gate-v3 Axis 2 sub-gates (heuristics, interaction, cognitive load, conversion, visual craft, synthetic users) and reports axis-2 score. Calls can run solo or fold into /gen:audit."
argument-hint: "[section-id] [--personas lean|standard|max]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_hover, mcp__plugin_playwright_playwright__browser_click, mcp__plugin_playwright_playwright__browser_press_key, mcp__plugin_playwright_playwright__browser_snapshot
recommended-model: sonnet-4-6
---

# /gen:ux-audit

v3.5.0 standalone UX Integrity audit. Runs all 6 UX sub-gates and aggregates to Axis 2 score.

## Workflow

### 1. Scope

- No arg → audit every section in `sections/`.
- `<section-id>` → audit that section only.

### 2. Run sub-gates (parallel)

Spawn these as parallel tasks — they share the dev server but use independent Playwright contexts:

1. `ux-heuristics-gate` (20pt)
2. `interaction-fidelity-gate` (20pt)
3. `cognitive-load-gate` (20pt)
4. `conversion-gate` (20pt)
5. `visual-craft-quantified` (20pt)
6. `synthetic-user-testing` (20pt) — persona count per `--personas` flag (default `standard`)

Each writes to `.planning/genorah/audit/<gate-name>/<section-id>.json`.

### 3. Aggregate

Sum to Axis 2 (120pt total). Apply sub-gate caps where fired. Report:

```
UX INTEGRITY SCORECARD — Section: hero
==========================================
1. UX Heuristics         18/20  (H2 fail: F-K score 15.2 > 14)
2. Interaction Fidelity  16/20  (I1 fail: 2 touch targets < 44px)
3. Cognitive Load        20/20
4. Conversion Integrity  14/20  (CV5 fail: generic CTA "Get Started")
5. Visual Craft          17/20  (V1 baseline compliance 87%)
6. Synthetic Usability   15/20  (personas: 4 run, P1 task not completed)

Axis 2 Total:            100/120  →  Tier: SOTD floor
Effective (after caps):  92/120   →  Tier: Strong
Archetype UX floor:      80       →  PASS
```

### 4. Fix file

Write `.planning/genorah/ux-fix/<section-id>.md` with actionable remediation per failed check, ranked by point impact.

### 5. Ledger

```json
{
  "kind": "ux-audit-ran",
  "subject": "<section-id or 'project'>",
  "payload": { "axis2_raw": 100, "axis2_effective": 92, "fails": ["H2","I1","CV5"], "personas_run": 4 }
}
```

## Persona budget modes

| Mode | Personas run | Est. tokens | Est. time |
|---|---|---|---|
| lean | 3 (First-timer, Power user, Mobile) | ~8K | 2 min |
| standard | 4 (+ Skeptic CFO) | ~14K | 3 min |
| max | 6 (all, incl. Screen-reader + B1) | ~22K | 5 min |

## Pipeline guidance

Typically runs after `/gen:build` completes, before full `/gen:audit`. Standalone use cases:
- iterate cycle before committing changes
- pre-push sanity check
- post-content-change re-validation

Render `skills/pipeline-guidance/SKILL.md` NEXT block after completion.

## Anti-patterns

- ❌ Running without a dev server — Interaction Fidelity, Synthetic Usability, parts of Visual Craft require live DOM.
- ❌ Skipping personas claiming "static analysis is enough" — synthetic testing catches failures no static check surfaces.
- ❌ Accepting axis-2 score without archetype UX-floor check — bold archetypes (Brutalist 65, Vaporwave 70) have floor overrides.
