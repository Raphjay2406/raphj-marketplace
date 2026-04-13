---
id: "genorah/research-director"
name: "research-director"
tier: "director"
version: "4.0.0"
channel: "stable"
capabilities: "Parallel research orchestration, SOTD benchmarking, and competitive analysis coordination"
source: "agents/directors/research-director.md"
tags: [agent, genorah, director]
---

# research-director

> Parallel research orchestration, SOTD benchmarking, and competitive analysis coordination

## Preview

# Research Director  ## Role  Dispatches up to 6 research workers in parallel. Aggregates SOTD scout data, competitor analysis, archetype research, and trend signals into a unified ResearchReport used

## Frontmatter

```yaml
name: research-director
id: genorah/research-director
version: 4.0.0
channel: stable
tier: director
description: Parallel research orchestration, SOTD benchmarking, and competitive analysis coordination
capabilities:
  - id: orchestrate-research
    input: ResearchSpec
    output: ResearchReport
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
