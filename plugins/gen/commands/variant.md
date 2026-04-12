---
description: "Pareto variant generation — produces N diverse variants of a section, scores each on 4 objectives (Design/UX/Archetype/Reference), computes Pareto front, commits winner via archetype-weighted tiebreaker. Replaces /gen:tournament on HOOK/PEAK/CLOSE beats."
argument-hint: "<section-id> [--n 3] [--budget lean|standard|max]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__nano-banana__generate_image, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot
recommended-model: opus-4-6
---

# /gen:variant

v3.5.1 generation-depth. Multi-objective variant selection.

## Workflow

### 1. Preflight

- Require `<section-id>` arg.
- Read section PLAN.md → extract archetype, beat, reference targets.
- Budget mode from `.claude/genorah.local.md` or `--budget` override.

### 2. Retrieve references via RAG

Call `reference-library-rag` with `{archetype, beat}` → top-5 references. Pass into spawn prompts.

### 3. Generate N variants with diversity enforcement

Per `skills/pareto-generation/SKILL.md` §Step 1. N per budget:
- lean: 2, standard: 3, max: 5

Spawn N builders in parallel (orchestrator manages). Each receives:
- PLAN.md
- Top-5 RAG references
- Previous variant embeddings (for diversity penalty)
- Seed (monotonic from variant index)

### 4. Score all variants

For each variant:
- Run quality-gate-v3 Axis 1 (Design) → O1
- Run quality-gate-v3 Axis 2 (UX) via `/gen:ux-audit` → O2
- Run archetype testable-markers grep + judge archetype-fit → O3
- SSIM vs top RAG reference → O4

Judge invocations go through `judge-calibration` (few-shot anchored).

### 5. Pareto front + tiebreaker

Compute front. If |front| = 1 → winner. If |front| > 1 → archetype-weighted scalar tiebreaker.

### 6. Commit

- Replace section files with winner's output.
- Archive losers to `.planning/genorah/variant-archive/<section-id>/<timestamp>/`.
- Update `sections/<id>/trajectory.json` with per-variant scores.
- Ledger: `{kind: "variant-selected", payload: {...}}`

### 7. Output

```
PARETO VARIANT SELECTION — hero (PEAK)
=======================================
Budget:  standard (N=3)
Refs:    linear-hero-kinetic-001, stripe-peak-neo-002, arc-peak-kinetic-003, ...

Scores (4 objectives):
         O1 Design  O2 UX   O3 Fit   O4 Ref
v1       182        98      0.81     0.68
v2       201        105     0.79     0.72   ◀ WINNER
v3       175        110     0.88     0.61

Pareto front: v2, v3
Tiebreaker (Kinetic weights: 0.25/0.20/0.30/0.25): v2 = 0.78, v3 = 0.76 → v2 wins

Archived: v1, v3 → variant-archive/hero/2026-04-12T10-00-00/
Ledger: updated
Trajectory: sections/hero/trajectory.json
```

## Pipeline guidance

Typically runs automatically inside `/gen:build` for HOOK/PEAK/CLOSE. Standalone use: iterate cycle where you want to explore 3 alternatives for a specific section.

Render `skills/pipeline-guidance/SKILL.md` NEXT block.

## Anti-patterns

- ❌ Running `/gen:variant` on BREATHE beats — waste; BREATHE is single-variant by design.
- ❌ N > 5 — diminishing returns; research track R3 validates ceiling.
- ❌ Skipping RAG retrieval — variants lack quality anchors; baseline lift disappears.
- ❌ Not archiving losers — variant-archive is research data; always persist.
