---
id: "genorah/reference-embedding-miner"
name: "reference-embedding-miner"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Mine reference imagery for palette + embeddings + motifs"
source: "agents/workers/asset/reference-embedding-miner.md"
tags: [agent, genorah, worker]
---

# reference-embedding-miner

> Mine reference imagery for palette + embeddings + motifs

## Preview

# Reference Embedding Miner  ## Role  Process reference URLs/images into a MineReport: extract dominant palette via pixel k-means, compute embeddings via Flux Kontext, identify recurring motifs.  ## P

## Frontmatter

```yaml
name: reference-embedding-miner
id: genorah/reference-embedding-miner
version: 4.0.0
channel: stable
tier: worker
description: Mine reference imagery for palette + embeddings + motifs
capabilities:
  - id: mine-references
    input: MineInput
    output: MineReport
tools: [Read, Write, Edit, Bash, Grep, Glob]
```
