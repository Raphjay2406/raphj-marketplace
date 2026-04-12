---
description: "Intent Alignment — validate PROJECT.md goals are SMART, every planned section traces to at least one goal, and no goal is uncovered. Pipeline Stage 1, between start-project and plan. Surfaces misaligned scope before it burns a build wave."
argument-hint: "[--strict]"
allowed-tools: Read, Write, Edit, Glob, Grep
recommended-model: sonnet-4-6
---

# /gen:align

v3.5.3 pipeline-depth Stage 1. Catches the "beautiful site that doesn't convert" failure by validating intent before plan.

## Workflow

### 1. Read inputs

- `PROJECT.md` → extract stated goals
- `MASTER-PLAN.md` (if exists) → extract planned sections
- `DESIGN-DNA.md` → extract archetype + tone

### 2. SMART validation per goal

Each goal in `PROJECT.md` must be:
- **S**pecific — names a user, outcome, surface (not "improve conversion")
- **M**easurable — includes a number or observable signal ("↑ demo requests 20%", "newsletter signup from 200→400/mo")
- **A**chievable — within the scope of a website build (not "change company strategy")
- **R**elevant — aligned to archetype + audience stated in DESIGN-DNA
- **T**ime-bound — has a horizon ("in 90 days post-launch")

For each goal, emit:
```
Goal: "Improve demo requests"
  S: FAIL — no user named
  M: FAIL — no baseline or target number
  A: PASS
  R: ?  — unclear which archetype beat serves this
  T: FAIL — no horizon
  Verdict: REWRITE
  Suggestion: "Increase SMB demo requests from 40→80/week via hero + PEAK social proof, in 90 days."
```

### 3. Section-goal trace matrix

Build `.planning/genorah/goal-trace.md`:

```
| Section / Beat | Goal 1 | Goal 2 | Goal 3 |
|---|---|---|---|
| hero / HOOK | primary | — | — |
| features / BUILD | secondary | primary | — |
| pricing / PEAK | primary | — | supporting |
| footer / CLOSE | — | — | primary |
```

Flag:
- **Orphan sections** — no goal column filled → candidate to cut from plan
- **Uncovered goals** — no row column filled → gap to close in plan
- **Over-represented goals** — >3 primary rows → dilution risk

### 4. Surface findings

Output to stdout + `.planning/genorah/alignment-report.md`:

```
INTENT ALIGNMENT REPORT
========================
Goals:      5 stated, 3 SMART-valid, 2 need rewrite
Sections:   9 planned
Orphans:    2 (features-b, testimonials-secondary) — consider cutting
Uncovered:  1 goal has no supporting section (Goal 4: newsletter)
Verdict:    PARTIAL — rewrite 2 goals, add 1 section or accept coverage gap
```

### 5. Strict mode

`--strict` flag blocks downstream `/gen:plan` until all goals SMART-valid AND all goals covered. Default mode warns only.

### 6. Ledger

Emit:
```json
{
  "kind": "alignment-validated",
  "subject": "project",
  "payload": { "smart_pass": 3, "smart_fail": 2, "orphans": 2, "uncovered": 1, "strict": false }
}
```

## Pipeline guidance

After align passes, primary next is `/gen:plan` (or `/gen:discuss` if DNA not locked). Render "⚡ NEXT ACTION" block per `skills/pipeline-guidance/SKILL.md`.

## Anti-patterns

- ❌ Treating align as optional — pipeline-depth v3.5.3 promotes this to a hard stage; `/gen:plan` warns when skipped.
- ❌ Accepting "brand awareness" as a goal — not measurable without a defined signal; rewrite.
- ❌ Adding sections that don't trace to any goal — orphans are scope creep.
