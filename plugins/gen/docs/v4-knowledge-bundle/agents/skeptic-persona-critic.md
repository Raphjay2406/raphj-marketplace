---
id: "genorah/skeptic-persona-critic"
name: "skeptic-persona-critic"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Applies skeptical buyer persona: challenges trust signals, probes objection handling, and tests social proof credibility"
source: "agents/workers/skeptic-persona-critic.md"
tags: [agent, genorah, worker]
---

# skeptic-persona-critic

> Applies skeptical buyer persona: challenges trust signals, probes objection handling, and tests social proof credibility.

## Preview

# Skeptic Persona Critic  ## Role  Applies skeptical buyer persona: challenges trust signals, probes objection handling, and tests social proof credibility.  ## Input Contract  FullPageArtifact: task

## Frontmatter

```yaml
name: skeptic-persona-critic
id: genorah/skeptic-persona-critic
version: 4.0.0
channel: stable
tier: worker
description: "Applies skeptical buyer persona: challenges trust signals, probes objection handling, and tests social proof credibility."
capabilities:
  - id: critique-skeptic
    input: FullPageArtifact
    output: SkepticCritique
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
