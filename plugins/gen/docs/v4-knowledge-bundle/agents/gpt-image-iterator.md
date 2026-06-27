---
id: "genorah/gpt-image-iterator"
name: "gpt-image-iterator"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Runs iterative image editing via the gpt-image MCP (stateless re-edit loop). Applies DNA color corrections, style transf"
source: "agents/workers/gpt-image-iterator.md"
tags: [agent, genorah, worker]
---

# gpt-image-iterator

> Runs iterative image editing via the gpt-image MCP (stateless re-edit loop). Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.

## Preview

# GPT-Image Iterator  ## Role  Runs iterative image editing via the gpt-image MCP. Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.  gpt-image is **stateless**

## Frontmatter

```yaml
name: gpt-image-iterator
id: genorah/gpt-image-iterator
version: 4.0.0
channel: stable
tier: worker
description: Runs iterative image editing via the gpt-image MCP (stateless re-edit loop). Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.
capabilities:
  - id: iterate-gpt-image
    input: ImageIterSpec
    output: IteratedImageAsset
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
  - mcp__gpt-image__edit_image
isolation: in-process
director: asset-director
domain: asset
```
