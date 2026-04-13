---
id: "genorah/rodin-3d-gen"
name: "rodin-3d-gen"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Generates 3D model assets via Rodin API. Produces GLTF output ready for scene-director pipeline"
source: "agents/workers/rodin-3d-gen.md"
tags: [agent, genorah, worker]
---

# rodin-3d-gen

> Generates 3D model assets via Rodin API. Produces GLTF output ready for scene-director pipeline.

## Preview

# Rodin 3D Generator  ## Role  Generates 3D model assets via Rodin API. Produces GLTF output ready for scene-director pipeline.  ## Input Contract  Model3DSpec: task envelope received from asset-direc

## Frontmatter

```yaml
name: rodin-3d-gen
id: genorah/rodin-3d-gen
version: 4.0.0
channel: stable
tier: worker
description: Generates 3D model assets via Rodin API. Produces GLTF output ready for scene-director pipeline.
capabilities:
  - id: generate-rodin-3d
    input: Model3DSpec
    output: Model3DAsset
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
