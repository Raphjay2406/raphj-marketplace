---
id: "genorah/pattern-miner"
name: "pattern-miner"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Extracts reusable design patterns from reference sites. Identifies cross-archetype techniques and innovation opportuniti"
source: "agents/workers/pattern-miner.md"
tags: [agent, genorah, worker]
---

# pattern-miner

> Extracts reusable design patterns from reference sites. Identifies cross-archetype techniques and innovation opportunities.

## Preview

# Pattern Miner  ## Role  Extracts reusable design patterns from reference sites. Identifies cross-archetype techniques and innovation opportunities.  ## Input Contract  ReferenceLibrary: task envelop

## Frontmatter

```yaml
name: pattern-miner
id: genorah/pattern-miner
version: 4.0.0
channel: stable
tier: worker
description: Extracts reusable design patterns from reference sites. Identifies cross-archetype techniques and innovation opportunities.
capabilities:
  - id: mine-patterns
    input: ReferenceLibrary
    output: PatternCatalog
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: research-director
domain: research
```
