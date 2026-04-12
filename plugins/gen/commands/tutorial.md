---
description: "Interactive tutorial for first-time users. Walks through the Genorah pipeline in a sandbox project with explanation between each step. ~30 minutes."
argument-hint: "[--sandbox <path>] [--skip-build]"
allowed-tools: Read, Write, Edit, Bash
recommended-model: sonnet-4-6
---

# /gen:tutorial

v3.5.7 interactive onboarding. Target audience: first-time Genorah users.

## Workflow

### Stage 0 — Orientation (2 min)

Display:
```
Welcome to Genorah.

Genorah builds Awwwards-SOTD-caliber websites via a 14-stage pipeline with
measurable quality enforcement. This tutorial walks you through a full project
in ~30 minutes using a sandbox directory.

Concepts you'll meet:
  - Design DNA + 25 Archetypes
  - Emotional arc + 10 beats
  - Quality gate v3 (Design 234 + UX 120)
  - 8-layer Context Fabric
  - Pareto variant selection
  - Sub-gate cascade

Default sandbox: ./genorah-tutorial/
Press Enter to continue, or pass --sandbox <path> to override.
```

### Stage 1 — start-project walk-through (5 min)

For each discovery question:
1. Display the question with explanation of *why* it matters
2. Accept scripted answer or user override
3. Explain what the system did with the answer

Sample Q sequence (pre-scripted):
```
Product: artisan coffee subscription
Audience: specialty-coffee enthusiasts
Primary goal: ↑ free-trial signups 50→100/mo in 90d
Stack: Next.js 16 + Tailwind v4
Archetype: [auto-propose 3 candidates; user picks Editorial]
```

### Stage 2 — DNA review (3 min)

Render DESIGN-DNA.md with annotations:
- "This is your primary color — every CTA uses it"
- "Fraunces is your display font — Editorial archetype demands serif"
- "Drop-cap is your signature element — one hero-specific typographic move"

### Stage 3 — align walk-through (3 min)

Run `/gen:align` with mock SMART validation:
```
Goal: "Increase free-trial signups 50→100/mo in 90d"
  S: PASS — user + outcome named
  M: PASS — baseline 50, target 100
  A: PASS — within web-build scope
  R: PASS — aligned to audience/archetype
  T: PASS — 90 day horizon
  Verdict: SMART-valid
```

Explain trace matrix concept.

### Stage 4 — plan walk-through (3 min)

Display MASTER-PLAN.md excerpt. Annotate:
- "Wave 0 is scaffold — Tailwind + routes + theme"
- "Wave 1 is shared UI — nav, footer, layout"
- "Wave 2+ is sections in parallel"
- "Each section has a beat — HOOK/BUILD/PEAK/CLOSE"

### Stage 5 — rehearse (2 min)

Explain: "Before committing a full wave, rehearsal builds ONE canary section to verify the plan produces Strong-tier output. If the canary fails, the plan is the bug, not the section."

Skip actual build in tutorial (saves tokens); show mock canary output.

### Stage 6 — build preview (3 min)

With `--skip-build`: show mock wave completion.
Without `--skip-build`: run actual `/gen:build` (will cost ~80K tokens).

### Stage 7 — audit + UX audit (4 min)

Display sample SUMMARY.md showing:
- Axis 1 design score (176, Strong tier)
- Axis 2 UX score (94, Strong tier)
- Cascade block with Motion-health × 0.5 cap example
- Explain how cascade transparency works

### Stage 8 — ship-check (2 min)

Display sample scorecard. Explain 4 tiers (build/runtime/pipeline/metadata) and decision aggregation.

### Stage 9 — postship + learnings (3 min)

Explain:
- Post-ship learning capture routes 3 lessons to Obsidian vault
- Cross-project KB means Project B benefits from Project A's wins
- `/gen:recalibrate` quarterly refreshes thresholds

### Stage 10 — next steps

```
You've seen the full pipeline. Next:
  1. Start a real project: /gen:start-project (in fresh dir)
  2. Explore commands: /gen:next (context-aware suggestion)
  3. Browse skills: ls skills/
  4. Read the glossary: docs/glossary.md
  5. When stuck: docs/troubleshooting/
```

## Flags

- `--sandbox <path>` — where to scaffold tutorial project (default `./genorah-tutorial/`)
- `--skip-build` — don't actually run /gen:build (saves ~80K tokens)

## Anti-patterns

- ❌ Running tutorial in a real project directory — always use sandbox
- ❌ Treating tutorial output as production — it's demo quality only
- ❌ Skipping tutorial and diving into /gen:start-project cold — recommended flow but not enforced
