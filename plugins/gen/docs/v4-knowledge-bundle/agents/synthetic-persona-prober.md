---
id: "genorah/synthetic-persona-prober"
name: "synthetic-persona-prober"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Runs synthetic user personas through the full page journey. Validates task completion, confusion points, and conversion "
source: "agents/workers/synthetic-persona-prober.md"
tags: [agent, genorah, worker]
---

# synthetic-persona-prober

> Runs synthetic user personas through the full page journey. Validates task completion, confusion points, and conversion path.

## Preview

# Synthetic Persona Prober  ## Role  Runs synthetic user personas through the full page journey. Validates task completion, confusion points, and conversion path.  ## Input Contract  PersonaSpec: task

## Frontmatter

```yaml
name: synthetic-persona-prober
id: genorah/synthetic-persona-prober
version: 4.0.0
channel: stable
tier: worker
description: Runs synthetic user personas through the full page journey. Validates task completion, confusion points, and conversion path.
capabilities:
  - id: probe-synthetic-persona
    input: PersonaSpec
    output: PersonaProbeReport
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: quality-director
domain: observability
```
