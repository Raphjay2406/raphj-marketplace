---
description: "Quarterly recalibration ritual — re-run R1 (judge calibration) + R5 (UX floor) against updated golden set + new variant archive. Publishes diff vs current shipping thresholds; prompts approval to update defaults."
argument-hint: "[--reindex] [--dry-run] [--headless] [--cron]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: opus-4-6
---

# /gen:recalibrate

v3.5.3 research-program ritual. Prevents silent drift from eating reliability.

## Workflow

### 1. Pre-flight checks

- Golden set has ≥ 25 entries.
- Calibration store (`~/.claude/genorah/calibration.db`) present.
- Variant archive non-empty.

### 2. R1: Judge Calibration

Per `docs/v3.5-research-program.md` R1:

1. Re-run pinned judge against every golden entry (mode='recalibration').
2. Compute ΔRMSE vs stored panel consensus, per few-shot N ∈ {0, 1, 3, 5}.
3. Compute κ stability over last 30 days from `kappa_history`.
4. Output: recommended few-shot N, κ floor, recal cadence.

### 3. R5: UX Floor Calibration

Per R5:

1. Sample sections across archetypes from variant-archive.
2. Score each with current Axis 2 rubric.
3. Cross-reference with user-feedback outcomes (if any from post-ship-backlog).
4. Fit ROC per archetype; select threshold at Youden's J max.
5. Output: revised archetype → UX floor matrix.

### 4. Propose updates

Write `docs/research/v3.5/recalibration-{ts}.md`:

```markdown
# Recalibration 2026-04-12

## Proposed changes

### Judge
- Few-shot N: 3 → 3 (unchanged)
- κ floor: 0.7 → 0.65 (data shows 0.65 sufficient; 0.7 over-tight)
- Recal cadence: 90d → 90d

### UX floors
- Brutalist: 65 → 62 (data shows users accept 62)
- Editorial: 80 → 82 (data shows users demand higher)
- Vaporwave: 70 → 70 (unchanged)
- ... (all 25)

## Evidence
- Judge: 234 golden samples, RMSE analysis in r1-judge-calibration-2026-04-12.md
- UX: 180 section scores × 20 user surveys, ROC in r5-ux-floor-2026-04-12.md

## Recommendation
APPROVE with user review.
```

### 5. User approval

Prompt user to review diff. On approve:
- Write new thresholds to `.claude-plugin/config.json`
- Insert `recalibrations` row to L7 store
- Ledger: `{kind: "recalibration-applied", payload: {...}}`

On reject: keep current thresholds; log attempt.

### 6. Flags

- `--reindex` — also rebuild semantic index (L5) after recalibration
- `--dry-run` — show proposed changes without writing
- `--headless` (v3.19) — skip prompts; fail-closed on any ΔRMSE > 0.1 or κ < floor; auto-invokes `/gen:shakedown` before applying
- `--cron` (v3.19) — emits Prometheus-compatible gauges to stdout, non-zero exit on proposed changes (for scheduled jobs)

## Cadence

Default: quarterly (90 days). Override via `.claude/genorah.local.md` `recalibration.cadence_days`.

session-start banner when drift > 10% OR days-since-last-recal > cadence.

## Anti-patterns

- ❌ Running without user review — shipping default changes bypass human sanity check.
- ❌ Skipping the research artifact (recalibration-{ts}.md) — future you won't remember why threshold moved.
- ❌ Cadence < 30 days — statistical noise dominates signal.
- ❌ Running before golden set reaches 25 entries — too-small sample for reliable RMSE.
- ❌ Skipping `drift_alerts` dismissal — alerts pile up and mask real future drift.
