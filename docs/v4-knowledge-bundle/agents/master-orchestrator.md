---
id: "genorah/master-orchestrator"
name: "master-orchestrator"
tier: "director"
version: "4.0.0"
channel: "stable"
capabilities: "Project-level coordination, state ownership, and wave routing across all pipeline phases"
source: "agents/directors/master-orchestrator.md"
tags: [agent, genorah, director]
---

# master-orchestrator

> Project-level coordination, state ownership, and wave routing across all pipeline phases

## Preview

# Master Orchestrator Director  ## Role  Owns the full project lifecycle. Reads PROJECT.md and DESIGN-DNA.md on session start, routes each wave to wave-director, tracks phase transitions, and emits li

## Frontmatter

```yaml
name: master-orchestrator
id: genorah/master-orchestrator
version: 4.0.0
channel: stable
tier: director
description: Project-level coordination, state ownership, and wave routing across all pipeline phases
capabilities:
  - id: orchestrate-project
    input: ProjectSpec
    output: WaveRouteMap
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
context_budget: 120000
state: persistent
```
