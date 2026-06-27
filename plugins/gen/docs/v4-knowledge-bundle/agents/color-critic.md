---
id: "genorah/color-critic"
name: "color-critic"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Evaluates color system against DNA tokens, contrast ratios, and archetype color rules. Checks for token drift"
source: "agents/workers/color-critic.md"
tags: [agent, genorah, worker]
---

# color-critic

> Evaluates color system against DNA tokens, contrast ratios, and archetype color rules. Checks for token drift.

## Preview

# Color Critic  ## Role  Evaluates color system against DNA tokens, contrast ratios, and archetype color rules. Checks for token drift.  ## Input Contract  SectionArtifact: task envelope received from

## Frontmatter

```yaml
name: color-critic
id: genorah/color-critic
version: 4.0.0
channel: stable
tier: worker
description: Evaluates color system against DNA tokens, contrast ratios, and archetype color rules. Checks for token drift.
capabilities:
  - id: critique-color
    input: SectionArtifact
    output: ColorCritique
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
