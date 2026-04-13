---
id: "genorah/nano-banana-iterator"
name: "nano-banana-iterator"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Runs iterative image editing via nano-banana MCP. Applies DNA color corrections, style transfers, and beat-specific atmo"
source: "agents/workers/nano-banana-iterator.md"
tags: [agent, genorah, worker]
---

# nano-banana-iterator

> Runs iterative image editing via nano-banana MCP. Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.

## Preview

# Nano-Banana Iterator  ## Role  Runs iterative image editing via nano-banana MCP. Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.  ## Input Contract  ImageIt

## Frontmatter

```yaml
name: nano-banana-iterator
id: genorah/nano-banana-iterator
version: 4.0.0
channel: stable
tier: worker
description: Runs iterative image editing via nano-banana MCP. Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.
capabilities:
  - id: iterate-nano-banana
    input: ImageIterSpec
    output: IteratedImageAsset
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: asset-director
domain: asset
```
