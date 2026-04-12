---
description: "v3.19 — Run seeded brief through the full 14-stage pipeline end-to-end. Emits spec-vs-reality gap report to .planning/genorah/shakedown/<timestamp>/. Blocks releases if gaps found."
argument-hint: "[editorial-saas|brutalist-agency|ethereal-portfolio] [--headless]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: opus-4-6
---

# /gen:shakedown

Real-project shakedown harness. Runs a seeded brief through Discovery → Post-ship Learning and diffs expected pipeline behavior against observed output. Used before promoting any RC → stable.

## Workflow

1. Load seeded brief (default `editorial-saas`).
2. Execute `node scripts/shakedown.mjs <brief>`.
3. Read `SHAKEDOWN.md` from latest `.planning/genorah/shakedown/<timestamp>/`.
4. If verdict is `GAPS`, list them in conversation and ask user whether to patch skills or defer.
5. If verdict is `PASS`, log a ledger entry (`node scripts/ledger-write.mjs shakedown-pass <brief>`).

## Success criteria

- All 15 stages execute without hard errors.
- Audit stage returns Design ≥ 200 and UX ≥ 100.
- Ship-check gate returns 0 BLOCK findings.

## Integration

- Called automatically by `/gen:recalibrate --headless` before publishing new defaults.
- Should be re-run after major skill edits to surface regressions.
