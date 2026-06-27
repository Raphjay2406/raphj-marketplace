---
id: "genorah/gltf-lod-generator"
name: "gltf-lod-generator"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Generates multiple LOD variants for GLTF models. Validates triangle counts and texture sizes against perf budgets"
source: "agents/workers/gltf-lod-generator.md"
tags: [agent, genorah, worker]
---

# gltf-lod-generator

> Generates multiple LOD variants for GLTF models. Validates triangle counts and texture sizes against perf budgets.

## Preview

# GLTF LOD Generator  ## Role  Generates multiple LOD variants for GLTF models. Validates triangle counts and texture sizes against perf budgets.  ## Input Contract  GLTFAsset: task envelope received

## Frontmatter

```yaml
name: gltf-lod-generator
id: genorah/gltf-lod-generator
version: 4.0.0
channel: stable
tier: worker
description: Generates multiple LOD variants for GLTF models. Validates triangle counts and texture sizes against perf budgets.
capabilities:
  - id: generate-gltf-lod
    input: GLTFAsset
    output: LODManifest
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
