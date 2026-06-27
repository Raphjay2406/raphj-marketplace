---
id: "genorah/r3f-scene-builder"
name: "r3f-scene-builder"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds React Three Fiber scene components with Rapier physics, DNA-bound materials, and postprocessing pipeline"
source: "agents/workers/r3f-scene-builder.md"
tags: [agent, genorah, worker]
---

# r3f-scene-builder

> Builds React Three Fiber scene components with Rapier physics, DNA-bound materials, and postprocessing pipeline.

## Preview

# R3F Scene Builder  ## Role  Builds React Three Fiber scene components with Rapier physics, DNA-bound materials, and postprocessing pipeline.  ## Input Contract  SceneSpec: task envelope received fro

## Frontmatter

```yaml
name: r3f-scene-builder
id: genorah/r3f-scene-builder
version: 4.0.0
channel: stable
tier: worker
description: Builds React Three Fiber scene components with Rapier physics, DNA-bound materials, and postprocessing pipeline.
capabilities:
  - id: build-r3f-scene
    input: SceneSpec
    output: R3FComponent
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: scene-director
domain: 3d
```
