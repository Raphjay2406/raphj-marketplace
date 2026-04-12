---
name: closed-loop-iteration
category: core
description: "Bounded iteration protocol for visual-refiner agent. Mini-eval scoring (30-pt subset), targeted-diff-to-fix-instruction translation, bail conditions, refinement log format."
triggers: ["closed loop", "visual refiner", "iterate", "mini-eval", "refinement", "self-correcting build"]
used_by: ["visual-refiner", "quality-reviewer", "orchestrator"]
version: "3.0.0"
---

## Layer 1: Decision Guidance

### Why Closed-Loop

v2.x pipeline: builders generate once, quality-reviewer scores, human decides next step. Sections stuck at Strong (184) usually need 2-3 focused edits to hit SOTD-Ready (200+) — edits a refiner can compute deterministically from the score gap.

This skill defines the contract: given a current score and target tier, identify the top 3 category deficits, translate each to specific fix instructions, apply surgical edits, re-score, repeat until target or bail condition. No full rewrites, no creative reinvention — the refiner executes the last mile.

### When to Use

- Current score < target tier minimum (default SOTD-Ready = 200).
- Gap categories ⊆ { Color, Typography, Depth & Polish, Motion & Interaction, Layout }.
- Hard gates all passing (don't refine a broken foundation).

### When NOT to Use

- Gap category is Content Quality → route to content-specialist.
- Gap category is Accessibility → route to quality-reviewer's a11y track.
- Gap category is Archetype Specificity → creative-director redesign.
- Score already ≥ target.
- Token budget < 30% remaining.
- Section has no render target (Stage 2 failed).

### Decision Tree

```
quality-reviewer emits {score, tier, gap_categories, subscores}
  → gate: score < target_min AND
          gap_categories ⊆ {visual-only} AND
          hard_gates all pass
  → NO  → skip refinement, forward to polisher
  → YES → visual-refiner loop:
      ├─ iteration 1-3:
      │   screenshot (4bp) → mini-eval (30 pts subset)
      │   → top-3 subscore deficits → fix_template_map[]
      │   → surgical Edit(s) → re-screenshot → re-eval
      │   → score ≥ target? → commit, exit
      │   → score regressed? → revert, bail
      │   → iteration == 3? → log, bail
      │   → token budget < 30%? → bail
      └─ exit: write REFINEMENT-LOG.md, hand to polisher
```

## Layer 2: Technical Spec

### Mini-eval (30-pt subset of 234-pt gate)

Full 234-pt gate is too expensive to run per iteration (~60s). Mini-eval runs ~10s, scoring only top-2 criteria in each gap category:

| Category | Top-2 criteria (10 pts each, 30 max) |
|----------|---------------------------------------|
| Color System | Token coverage, Palette harmony |
| Typography | Scale rhythm, Pairing contrast |
| Layout & Composition | Whitespace ratio, Alignment precision |
| Depth & Polish | Shadow layering, Border finesse |
| Motion & Interaction | Entrance choreography, Hover states |

Weights remain (Color 1.2x, Typography 1.2x, others 1.0x).

### Fix template map

Deterministic mapping from subscore deficit to edit instruction:

| Deficit signal | Fix template |
|----------------|--------------|
| Depth:shadow_layering < 7 | `add second shadow layer: 0 12px 24px rgba(var(--shadow)/0.12)` |
| Depth:border_finesse < 7 | `replace border-2 with border + inset ring: shadow-[inset_0_0_0_1px_var(--border)]` |
| Typography:scale_rhythm < 7 | `tighten heading leading to 1.05, add tracking-tight` |
| Motion:entrance < 7 | `wrap section in motion.div with opacity+translateY entrance, stagger children 80ms` |
| Motion:hover < 7 | `add transition-transform hover:scale-[1.02] duration-300 ease-out-expo to cards` |
| Color:harmony < 7 | `reduce used palette to max 4 tokens + 1 accent; pull less-used token to secondary element` |
| Layout:whitespace < 7 | `increase section padding to py-24 md:py-32; add max-w-prose to text blocks` |
| Layout:alignment < 7 | `enforce 8pt grid: round all gap/padding values to 8/16/24/32/48` |

Each fix is surgical — one attribute or small block. No full-component rewrites.

### Bail conditions

| Condition | Action |
|-----------|--------|
| iteration_count ≥ 3 | stop, log final score |
| elapsed_seconds_per_iteration > 120 | timeout, revert last edit |
| score regressed vs previous iteration | revert, bail (don't chase noise) |
| token_budget_remaining < 30% | stop, preserve for downstream agents |
| unexpected test failure | stop, escalate to bugfix |

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| max_iterations | 1 | 3 | count | HARD |
| max_seconds_per_iteration | — | 120 | s | HARD |
| min_token_budget_remaining | 30 | 100 | % | HARD |
| score_regression_tolerance | 0 | 5 | points | HARD (>5 = bail) |
| mini_eval_subset_max_pts | 30 | 60 | pts | HARD |

### REFINEMENT-LOG.md format

```markdown
# Refinement — sections/{name}
Target: SOTD-Ready (200) | Start: 184 (Strong) | Archetype: {name}

## Iteration 1 (78s)
Mini-eval: 23/30. Gaps: Depth&Polish (-4), Motion (-3).
Fixes:
- Pricing.tsx:67 added layered shadow
- Pricing.tsx:104 added hover scale transform
Re-eval: 27/30. Score: 198.

## Iteration 2 (64s)
Mini-eval: 28/30. Gap: Typography rhythm (-2).
Fix: Pricing.tsx:34 tightened heading leading to 1.05.
Re-eval: 30/30. Score: 206 ✅ SOTD-Ready. STOP.

## Outcome
- Iterations: 2
- Delta: +22 (184 → 206)
- Token budget used: 42%
- Next: polisher
```

## Layer 3: Integration Context

- **visual-refiner agent** owns execution; this skill defines the protocol.
- **quality-reviewer** emits gap data that seeds iteration; mini-eval reuses its rubric.
- **polisher** receives refined output for final polish pass.
- **pre-tool-use.mjs** hook reads `REFINEMENT-LOG.md` iteration count to enforce the max-3 cap.

## Layer 4: Anti-Patterns

- ❌ **Running full 234-pt gate per iteration** — kills budget. Mini-eval exists for this reason.
- ❌ **Full-section rewrites** — drops context, loses creative intent, burns tokens. Surgical edits only.
- ❌ **Refining through hard-gate failures** — refiner assumes foundation is sound. Hard-gate failures are for builder/creative-director.
- ❌ **Infinite loops** — hard-cap at 3 iterations. Diminishing returns past that.
- ❌ **Chasing noise** — if score oscillates ±3 pts, bail; it's not converging.
- ❌ **Refining Content or Archetype gaps** — wrong owner. Route elsewhere.
- ❌ **Silent refinement** — every iteration must write to REFINEMENT-LOG.md for audit + debugging.
