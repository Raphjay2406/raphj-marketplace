---
description: Run Genorah self-audit (plugin consistency + M1–M5 feature checks)
argument-hint: ""
---

# /gen:self-audit

Runs static consistency checks (24 checks as of M6):

## M1 — Protocol & Agent Foundation

- plugin.json version is 4.0.0-alpha.5
- 10 directors + 98 workers (108 total)
- 108 agent cards with schema_version a2a-v0.3 at version 4.0.0 stable
- packages/protocol/dist exists (index.js + bin/daemon.js)
- agent-message-validator + daemon-lifecycle hooks registered
- /gen:migrate-v3-to-v4 command + script present

## M6 — Hardening

- Hard gate #1 (motion check) present in dna-compliance-check.sh
- Hard gate #6 (Scroll Coherence) registered in dna-compliance-check.sh
- scripts/validators/scroll-coherence.mjs exists
- Archetype registry valid (all archetypes have archetype.json)
- All recipes/*.yml validate against RecipeSchema
- skills/quality-gate-v3/weights.json present
- M2, M3, M4, M5 completion docs exist under docs/superpowers/plans/

## Workflow

Run `node ${plugin_root}/scripts/gen-self-audit.mjs` and report pass/fail per check.
