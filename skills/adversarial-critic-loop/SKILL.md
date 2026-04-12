---
name: adversarial-critic-loop
description: 2-cycle maximum adversarial critique loop. Spawns critic, polisher applies CRITICAL + HIGH fixes, re-critiques. Terminates on convergence, oscillation, or cycle cap. Cap=2 because more oscillates.
tier: core
triggers: adversarial-critic, critic-loop, polish-loop, critique-cycles, polisher
version: 0.1.0-provisional
status: PROVISIONAL — cycle cap calibrated in research track R4.
---

# Adversarial Critic Loop

Hardens sections via structured persona critique + polish. Bounded by 2-cycle cap, score-improvement gate, and oscillation detection.

## Layer 1 — When to use

- Inside `/gen:audit` for every section clearing the initial quality gate.
- Via `/gen:critic <section> --persona <p>` standalone.
- Inside `/gen:build` for HOOK/PEAK/CLOSE beats in `standard` and `max` modes.

## Layer 2 — Loop algorithm

```
cycle = 0
prior_score = quality_gate_v3(section)  # both axes
while cycle < 2:
    critique = adversarial_critic.spawn(persona, section)
    if len(critique.critical) == 0 and len(critique.high) == 0:
        break  # convergence
    patches = polisher.apply(critique.critical + critique.high)
    new_score = quality_gate_v3(section)
    if new_score.total < prior_score.total - 3:
        revert(patches)
        break  # regression guard
    if new_score.total <= prior_score.total + 1:
        break  # oscillation / saturation
    prior_score = new_score
    cycle += 1
```

### Termination reasons

- **converged** — critic found no CRITICAL/HIGH
- **regressed** — polish dropped score > 3; revert + exit
- **saturated** — polish improved ≤ 1; further cycles not productive
- **cap** — cycle 2 complete

Each termination writes to `trajectory.json` with reason.

## Layer 3 — Persona rotation

Default: rotate personas across cycles to avoid persona tunnel vision:
- Cycle 1: senior-designer (most common weaknesses)
- Cycle 2: conversion-specialist OR accessibility-engineer (based on where prior scores are weakest)

Budget mode overrides:
- `lean`: single cycle, senior-designer only
- `standard`: 2 cycles, rotation as above
- `max`: 2 cycles + optional 3rd product-strategist when scores indicate audience misalignment

## Layer 4 — Integration

### Patches via polisher

Polisher receives `{critique, section_files}` and applies fixes. Constraints:
- Only touch files named in `critique.fix` strings
- One commit per cycle; revertible via `git reset`
- Must not change DNA tokens without a `tension_override` in DECISIONS.md

### Ledger

```json
{ "kind": "critic-cycle-completed",
  "subject": "hero",
  "payload": {
    "cycle": 1,
    "persona": "senior-designer",
    "before": 182,
    "after": 193,
    "applied": 3,
    "reverted": 0,
    "termination": null
  }
}
```

### Trajectory integration

Feeds `sections/<id>/trajectory.json` — see `generation-trajectory` skill.

## Layer 5 — Anti-patterns

- ❌ Cycle cap > 2 — oscillation empirically confirmed (R4 pending validation).
- ❌ Applying MEDIUM + LOW weaknesses in loop — explodes scope; defer to human iterate.
- ❌ Same persona both cycles — tunnel vision; rotate.
- ❌ Ignoring regression guard — let polish destroy good work.
- ❌ Running critic-loop without running quality-gate-v3 first — no baseline to compare against.
