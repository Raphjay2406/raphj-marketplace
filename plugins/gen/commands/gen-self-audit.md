---
description: Run Genorah self-audit (plugin consistency + M1 feature checks)
argument-hint: ""
---

# /gen:self-audit

Runs static consistency checks:
- plugin.json version
- 10 directors + 95 workers (105 total)
- 105 agent cards generated and valid
- protocol package built (dist/ present)
- required hooks registered
- migration command + script present

## Workflow

Run `node ${plugin_root}/scripts/gen-self-audit.mjs` and report pass/fail.
