---
description: Synthesize a bespoke archetype from brand reference images / URLs
argument-hint: "<mine.json> <slug> <seeds-csv> <weights-csv>"
---

# /gen:archetype-synth

Synthesize a per-project bespoke archetype from a reference embedding mine report.

## Workflow

1. Run `node ${plugin_root}/scripts/gen-archetype-synth.mjs "$ARGUMENTS"`.
2. Writes `skills/design-archetypes/archetypes/<slug>/archetype.json`.
3. Print summary.
