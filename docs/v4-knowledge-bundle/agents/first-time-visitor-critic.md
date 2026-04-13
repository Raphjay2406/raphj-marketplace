---
id: "genorah/first-time-visitor-critic"
name: "first-time-visitor-critic"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Simulates first-time visitor experience: 5-second test, clarity of value proposition, and confusion points"
source: "agents/workers/first-time-visitor-critic.md"
tags: [agent, genorah, worker]
---

# first-time-visitor-critic

> Simulates first-time visitor experience: 5-second test, clarity of value proposition, and confusion points.

## Preview

# First-Time Visitor Critic  ## Role  Simulates first-time visitor experience: 5-second test, clarity of value proposition, and confusion points.  ## Input Contract  FullPageArtifact: task envelope re

## Frontmatter

```yaml
name: first-time-visitor-critic
id: genorah/first-time-visitor-critic
version: 4.0.0
channel: stable
tier: worker
description: "Simulates first-time visitor experience: 5-second test, clarity of value proposition, and confusion points."
capabilities:
  - id: critique-first-visit
    input: FullPageArtifact
    output: FirstVisitCritique
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
