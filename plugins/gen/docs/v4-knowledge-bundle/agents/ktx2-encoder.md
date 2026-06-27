---
id: "genorah/ktx2-encoder"
name: "ktx2-encoder"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Encodes textures to KTX2/Basis format for GPU-compressed delivery. Validates format support matrix"
source: "agents/workers/ktx2-encoder.md"
tags: [agent, genorah, worker]
---

# ktx2-encoder

> Encodes textures to KTX2/Basis format for GPU-compressed delivery. Validates format support matrix.

## Preview

# KTX2 Encoder  ## Role  Encodes textures to KTX2/Basis format for GPU-compressed delivery. Validates format support matrix.  ## Input Contract  TextureAsset: task envelope received from scene-directo

## Frontmatter

```yaml
name: ktx2-encoder
id: genorah/ktx2-encoder
version: 4.0.0
channel: stable
tier: worker
description: Encodes textures to KTX2/Basis format for GPU-compressed delivery. Validates format support matrix.
capabilities:
  - id: encode-ktx2
    input: TextureAsset
    output: KTX2Texture
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: scene-director
domain: 3d
```
