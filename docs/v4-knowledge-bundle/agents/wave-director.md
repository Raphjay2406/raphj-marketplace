---
id: "genorah/wave-director"
name: "wave-director"
tier: "director"
version: "4.0.0"
channel: "stable"
capabilities: "Per-wave section routing, parallel dispatch, and merge coordination"
source: "agents/directors/wave-director.md"
tags: [agent, genorah, director]
---

# wave-director

> Per-wave section routing, parallel dispatch, and merge coordination

## Preview

# Wave Director  ## Role  Receives a single wave from master-orchestrator. Dispatches section workers in parallel (max 4), collects SUMMARY.md artifacts, merges into STATE.md, and forwards to quality-

## Frontmatter

```yaml
name: wave-director
id: genorah/wave-director
version: 4.0.0
channel: stable
tier: director
description: Per-wave section routing, parallel dispatch, and merge coordination
capabilities:
  - id: route-wave
    input: WaveSpec
    output: WaveMergeReport
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
