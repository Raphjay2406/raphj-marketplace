---
id: "genorah/inpainter"
name: "inpainter"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Runs inpainting workflows to fix, extend, or composite image assets. Preserves DNA color accuracy in edited regions"
source: "agents/workers/inpainter.md"
tags: [agent, genorah, worker]
---

# inpainter

> Runs inpainting workflows to fix, extend, or composite image assets. Preserves DNA color accuracy in edited regions.

## Preview

# Inpainter  ## Role  Runs inpainting workflows to fix, extend, or composite image assets. Preserves DNA color accuracy in edited regions.  ## Input Contract  InpaintSpec: task envelope received from

## Frontmatter

```yaml
name: inpainter
id: genorah/inpainter
version: 4.0.0
channel: stable
tier: worker
description: Runs inpainting workflows to fix, extend, or composite image assets. Preserves DNA color accuracy in edited regions.
capabilities:
  - id: inpaint-image
    input: InpaintSpec
    output: InpaintedAsset
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
