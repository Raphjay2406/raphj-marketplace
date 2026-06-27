---
id: "genorah/typography-critic"
name: "typography-critic"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Evaluates typography against quality gate axis: scale discipline, hierarchy clarity, archetype font personality, and rea"
source: "agents/workers/typography-critic.md"
tags: [agent, genorah, worker]
---

# typography-critic

> Evaluates typography against quality gate axis: scale discipline, hierarchy clarity, archetype font personality, and readability.

## Preview

# Typography Critic  ## Role  Evaluates typography against quality gate axis: scale discipline, hierarchy clarity, archetype font personality, and readability.  ## Input Contract  SectionArtifact: tas

## Frontmatter

```yaml
name: typography-critic
id: genorah/typography-critic
version: 4.0.0
channel: stable
tier: worker
description: "Evaluates typography against quality gate axis: scale discipline, hierarchy clarity, archetype font personality, and readability."
capabilities:
  - id: critique-typography
    input: SectionArtifact
    output: TypographyCritique
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
