---
name: generation-trajectory
description: Score-over-iteration tracking. Every variant / refine / critic cycle writes to sections/{id}/trajectory.json. Termination rules (convergence, saturation, regression, budget, floor) enforced from this skill. Dashboard sparkline reads trajectory live.
tier: core
triggers: trajectory, score-over-iteration, termination-rules, convergence, saturation, regression
version: 0.1.0-provisional
---

# Generation Trajectory

Makes generation loops accountable. Every iteration leaves a trail; termination rules are deterministic; dashboard shows the trail live.

## Layer 1 — When to use

Automatically written by:
- `pareto-generation` (per variant)
- `visual-refiner` (per refine attempt)
- `adversarial-critic-loop` (per cycle)

Read by:
- Termination rules (when to stop)
- `/gen:dashboard` (sparkline tab)
- `/gen:trajectory <section>` (standalone chart)

## Layer 2 — Schema

`sections/{id}/trajectory.json`:

```json
{
  "section_id": "hero",
  "archetype": "editorial",
  "beat": "PEAK",
  "budget_mode": "standard",
  "started_at": "2026-04-12T10:00:00Z",
  "iterations": [
    {
      "ix": 0,
      "ts": "2026-04-12T10:00:00Z",
      "actor": "builder",
      "kind": "initial-build",
      "scores": { "design": 168, "ux": 88 },
      "elapsed_s": 84,
      "tokens_used": 12400
    },
    {
      "ix": 1,
      "ts": "2026-04-12T10:01:24Z",
      "actor": "visual-refiner",
      "kind": "refine",
      "scores": { "design": 178, "ux": 89 },
      "elapsed_s": 62,
      "tokens_used": 9800,
      "notes": "fixed type scale; increased baseline compliance"
    },
    {
      "ix": 2,
      "ts": "2026-04-12T10:02:26Z",
      "actor": "adversarial-critic",
      "kind": "critic-cycle",
      "persona": "senior-designer",
      "scores": { "design": 193, "ux": 92 },
      "elapsed_s": 146,
      "tokens_used": 22100,
      "applied": 3
    }
  ],
  "termination": null,
  "current_best": 2,
  "budget_remaining": { "tokens": 80000, "minutes": 18 }
}
```

## Layer 3 — Termination rules

Applied after every iteration write:

1. **Converged** — `|Δ| ≤ 2pt` over last 2 iterations → terminate, ship current_best
2. **Regressed** — `Δ < -3pt` iteration-over-iteration → revert, ship previous best
3. **Budget exhausted** — `tokens ≤ 0` OR `minutes ≤ 0` → ship current_best, flag for human review
4. **Floor failure** — `ux < archetype_ux_floor` after 3 iterations → human review BLOCK
5. **Cap** — `|iterations| ≥ 5` → ship current_best, flag
6. **SSIM hard cap** — `reference_ssim < threshold - 3σ` after 3 refines → human review BLOCK

Write `termination` field when one fires.

## Layer 4 — Integration

### Ledger

Every trajectory write also emits ledger:

```json
{
  "kind": "trajectory-updated",
  "subject": "hero",
  "payload": {
    "ix": 2,
    "design": 193,
    "ux": 92,
    "delta_from_prior": 15,
    "termination": null
  }
}
```

### Dashboard

`/gen:dashboard` Sections tab renders per-section sparkline:

```
hero (PEAK):    168 → 178 → 193 ↗   [ship at 193]
features:       154 → 155 → 158 →  [saturated — ship]
pricing:        181 → 178 ↓        [regressed — revert to 181]
testimonials:   FLOOR FAIL: UX 62 < 75 (Editorial)   [human review]
```

### /gen:trajectory command

Standalone chart + termination history for a section. Useful for retrospective on why a section took 3 cycles vs 1.

## Layer 5 — Anti-patterns

- ❌ Not writing trajectory entries from every loop actor — breaks termination; rules need full data.
- ❌ Ignoring regression — let polish destroy good work.
- ❌ Treating saturation as failure — saturation is normal; ship and move on.
- ❌ Manual trajectory edits — corrupts data; ledger will catch drift at audit.
- ❌ Deleting trajectory post-ship — research program needs this for R3/R4 analysis.
