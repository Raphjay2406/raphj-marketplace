---
name: "shakedown-harness"
description: "Seeded-brief full-pipeline smoke test. Runs Discovery → Post-ship Learning on curated fixtures and emits spec-vs-reality gap report. Gates stable promotion."
tier: "utility"
triggers: "shakedown, full pipeline smoke, pre-release smoke, seeded brief run"
version: "3.19.0"
---

## Layer 1: Decision Guidance

### When to Use

- Before promoting an RC to stable.
- After bulk skill edits spanning > 10 files.
- As the final step of `/gen:recalibrate --headless`.

### When NOT to Use

- For single-section bug repro — use `/gen:bugfix` instead.
- For live project audit — use `/gen:audit`.

### Pipeline Connection

Invoked by `/gen:shakedown`. Optional dependency of `/gen:recalibrate`.

## Layer 2: Example Invocation

```bash
node scripts/shakedown.mjs editorial-saas
# → .planning/genorah/shakedown/<ts>/SHAKEDOWN.md
# → Verdict PASS or GAPS
```

## Layer 3: Integration Context

- Fixtures at `scripts/shakedown.mjs > SEEDED_BRIEFS`.
- Currently: `editorial-saas`, `brutalist-agency`, `ethereal-portfolio`.
- Add new seeds as archetypes are added (v3.14 added 8; expect one seed per archetype cluster).

## Layer 4: Anti-Patterns

- Running `shakedown` on live user project → writes under `.planning/genorah/shakedown/` which is fine, but fixtures must stay deterministic; do not let live content leak into seeded briefs.
- Skipping shakedown before stable promotion → v3.18 validated manually; v3.19+ requires it.
