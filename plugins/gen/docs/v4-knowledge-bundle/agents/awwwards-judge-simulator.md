---
id: "genorah/awwwards-judge-simulator"
name: "awwwards-judge-simulator"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Simulates Awwwards SOTD judge scoring across 4 axes: Design, Usability, Creativity, Content. Targets 8.0+ average"
source: "agents/workers/awwwards-judge-simulator.md"
tags: [agent, genorah, worker]
---

# awwwards-judge-simulator

> Simulates Awwwards SOTD judge scoring across 4 axes: Design, Usability, Creativity, Content. Targets 8.0+ average.

## Preview

# Awwwards Judge Simulator  ## Role  Simulates Awwwards SOTD judge scoring across 4 axes: Design, Usability, Creativity, Content. Targets 8.0+ average.  ## Input Contract  FullPageArtifact: task envel

## Frontmatter

```yaml
name: awwwards-judge-simulator
id: genorah/awwwards-judge-simulator
version: 4.0.0
channel: stable
tier: worker
description: "Simulates Awwwards SOTD judge scoring across 4 axes: Design, Usability, Creativity, Content. Targets 8.0+ average."
capabilities:
  - id: simulate-awwwards
    input: FullPageArtifact
    output: AwwwardsScore
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
