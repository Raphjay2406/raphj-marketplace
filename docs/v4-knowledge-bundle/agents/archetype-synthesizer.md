---
id: "genorah/archetype-synthesizer"
name: "archetype-synthesizer"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Synthesize a custom archetype from brand mine report"
source: "agents/workers/asset/archetype-synthesizer.md"
tags: [agent, genorah, worker]
---

# archetype-synthesizer

> Synthesize a custom archetype from brand mine report

## Preview

# Archetype Synthesizer  ## Role  Generate a bespoke project archetype from a `MineReport` + seed templates + blend weights.  ## Protocol  1. Read MineReport (palette + embeddings + motifs). 2. Call `

## Frontmatter

```yaml
name: archetype-synthesizer
id: genorah/archetype-synthesizer
version: 4.0.0
channel: stable
tier: worker
description: Synthesize a custom archetype from brand mine report
capabilities:
  - id: synthesize-archetype
    input: SynthInput
    output: GeneratedArchetype
tools: [Read, Write, Edit, Grep, Glob]
```
