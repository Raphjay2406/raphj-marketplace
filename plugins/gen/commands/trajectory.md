---
description: "Render score-over-iteration trajectory for a section. Shows every variant, refine cycle, critic cycle with scores, deltas, and termination reasons. Reads sections/{id}/trajectory.json."
argument-hint: "<section-id> [--format text|json|markdown]"
allowed-tools: Read, Bash, Glob
recommended-model: haiku-4-5
---

# /gen:trajectory

v3.5.2. Retrospective on a section's generation journey.

## Workflow

### 1. Read

- `sections/<id>/trajectory.json`
- `sections/<id>/SUMMARY.md` (for final state)
- Cross-reference `.planning/genorah/journal.ndjson` for any external events

### 2. Render

Default `--format text`:

```
TRAJECTORY — hero (Editorial / PEAK)
=====================================
Budget:    standard
Started:   2026-04-12T10:00:00Z
Elapsed:   4m 52s
Tokens:    44,300 / 80,000 used
Result:    shipped at ix=2 (design=193, ux=92)

  ix   actor              kind          design  ux    Δtotal   notes
  0    builder            initial       168     88    —        first build
  1    visual-refiner     refine         178     89    +11      type scale, baseline compliance
  2    adversarial-critic critic-cycle   193     92    +18      senior-designer, 3 fixes applied
  —    termination        converged      —       —    —        ≤2pt change on next run expected

Sparkline (design):  168 → 178 → 193   ↗↗
Sparkline (ux):       88 →  89 →  92   ↗↗
```

`--format json` emits raw JSON; `--format markdown` emits table + ASCII chart.

### 3. Ledger cross-links

Append section showing any related ledger entries (CAP-applied, sub-gate-fired, feedback-received).

## Use cases

- Retrospective on why a section took 3 cycles vs 1
- Research track R3/R4 data collection
- Debugging "why did this section ship at 193 not 200" after the fact
- Showing clients the review iterations during client-review-workflow

## Anti-patterns

- ❌ Modifying trajectory.json manually — research integrity lost.
- ❌ Reading trajectory without SUMMARY.md context — missing final-state picture.
- ❌ Using trajectory to reward/punish specific agents — trajectory is diagnostic, not personnel.
