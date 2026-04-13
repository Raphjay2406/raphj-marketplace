---
id: "genorah/motion-critic"
name: "motion-critic"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Evaluates motion design against quality gate: intentionality, DNA motion token usage, reduced-motion compliance"
source: "agents/workers/motion-critic.md"
tags: [agent, genorah, worker]
---

# motion-critic

> Evaluates motion design against quality gate: intentionality, DNA motion token usage, reduced-motion compliance.

## Preview

# Motion Critic  ## Role  Evaluates motion design against quality gate: intentionality, DNA motion token usage, reduced-motion compliance.  ## Input Contract  SectionArtifact: task envelope received f

## Frontmatter

```yaml
name: motion-critic
id: genorah/motion-critic
version: 4.0.0
channel: stable
tier: worker
description: "Evaluates motion design against quality gate: intentionality, DNA motion token usage, reduced-motion compliance."
capabilities:
  - id: critique-motion
    input: SectionArtifact
    output: MotionCritique
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
