---
id: "genorah/narrative-critic"
name: "narrative-critic"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Evaluates cross-section story arc coherence, beat sequencing validity, and emotional progression"
source: "agents/workers/narrative-critic.md"
tags: [agent, genorah, worker]
---

# narrative-critic

> Evaluates cross-section story arc coherence, beat sequencing validity, and emotional progression.

## Preview

# Narrative Critic  ## Role  Evaluates cross-section story arc coherence, beat sequencing validity, and emotional progression.  ## Input Contract  SectionSequence: task envelope received from quality-

## Frontmatter

```yaml
name: narrative-critic
id: genorah/narrative-critic
version: 4.0.0
channel: stable
tier: worker
description: Evaluates cross-section story arc coherence, beat sequencing validity, and emotional progression.
capabilities:
  - id: critique-narrative
    input: SectionSequence
    output: NarrativeCritique
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: quality-director
domain: critics
```
