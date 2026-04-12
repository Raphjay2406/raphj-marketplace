---
name: pareto-generation
description: Multi-objective variant selection replacing scalar tournament. Generates N variants with diversity penalty, scores each on 4 objectives (Design Craft, UX Integrity, Archetype Fit, Reference Similarity), computes Pareto front, resolves ties via archetype-weighted objective.
tier: core
triggers: pareto, variant-generation, multi-objective, tournament, diversity-penalty, archetype-weight
version: 0.1.0-provisional
---

# Pareto Generation

Replaces scalar `/gen:tournament` for HOOK / PEAK / CLOSE beats with multi-objective variant selection. Scalar tournament still valid for lower-stakes beats in lean budget mode.

## Layer 1 — When to use

Invoked by `/gen:variant` and automatically by `/gen:build` on HOOK/PEAK/CLOSE beats in `standard` or `max` budget modes.

## Layer 2 — Algorithm

### Step 1 — Generate N variants with diversity enforcement

```
N per budget mode:
  lean:     N=2
  standard: N=3
  max:      N=5

Diversity: reject any variant whose text + structure cosine embedding
similarity > 0.85 against already-generated; regenerate with increased
temperature on rejection.
```

### Step 2 — Score on 4 objectives

Each variant scored by calibrated judge (see `judge-calibration`) on:

| Objective | Range | Source |
|---|---|---|
| **O1 Design Craft** | 0–234 | quality-gate-v3 Axis 1 |
| **O2 UX Integrity** | 0–120 | quality-gate-v3 Axis 2 |
| **O3 Archetype Fit** | 0.0–1.0 | testable-markers grep + judge verdict |
| **O4 Reference Similarity** | 0.0–1.0 | SSIM vs archetype's top SOTD reference in RAG |

### Step 3 — Compute Pareto front

Variant A dominates B iff A ≥ B on all 4 objectives AND A > B on at least one.
Pareto front = set of non-dominated variants.

### Step 4 — Resolve ties with archetype-weighted objective

When ≥ 2 variants on front, compute:

```
score(v) = w_design * O1/234 + w_ux * O2/120 + w_fit * O3 + w_ref * O4
```

Weights from `skills/design-archetypes/seeds/archetype-weights.json` (PROVISIONAL, calibrated in research track R8):

| Archetype | w_design | w_ux | w_fit | w_ref |
|---|---|---|---|---|
| Brutalist | 0.30 | 0.20 | 0.35 | 0.15 |
| Ethereal | 0.35 | 0.20 | 0.25 | 0.20 |
| Editorial | 0.40 | 0.25 | 0.20 | 0.15 |
| Kinetic | 0.25 | 0.20 | 0.30 | 0.25 |
| Neo-Corporate | 0.25 | 0.35 | 0.20 | 0.20 |
| Default | 0.30 | 0.25 | 0.25 | 0.20 |

### Step 5 — Terminate

- Convergence: N variants produced, front computed, winner committed.
- Trajectory written to `sections/{id}/trajectory.json` (see `generation-trajectory` skill in v3.5.2).

## Layer 3 — Integration

### Ledger

```json
{
  "kind": "variant-selected",
  "subject": "hero",
  "payload": {
    "n_generated": 3,
    "pareto_front_size": 2,
    "winner": "variant-2",
    "scores": [{ "id": "v1", "O1": 178, "O2": 96, "O3": 0.82, "O4": 0.61 }, ...],
    "archetype_weights": { "w_design": 0.40, "w_ux": 0.25, ... }
  }
}
```

### Reference-library-RAG pairing

Before generation, Pareto consumes RAG output: top-5 SOTD references for archetype+beat become part of each variant's spawn prompt ("match or exceed these"; never copy).

### Budget discipline

Pareto-N doubles token cost vs. scalar. `budget.max` limits cap N; downgrade gracefully to scalar on `lean`.

## Layer 4 — Anti-patterns

- ❌ Collapsing 4 objectives to average — defeats the point; use Pareto front.
- ❌ Running Pareto on BREATHE beats — waste; BREATHE is single-variant by design.
- ❌ Archetype weight override without documenting rationale in DECISIONS.md — anchors lost.
- ❌ Regenerating winner to "improve further" — adds oscillation; commit and move on.
- ❌ Diversity penalty disabled — variants collapse to near-identical; no front to compute.
