---
id: "genorah/scene-director"
name: "scene-director"
tier: "director"
version: "4.0.0"
channel: "stable"
capabilities: "Persistent 3D canvas management, cross-section camera choreography, and WebGPU/WebGL routing"
source: "agents/directors/scene-director.md"
tags: [agent, genorah, director]
---

# scene-director

> Persistent 3D canvas management, cross-section camera choreography, and WebGPU/WebGL routing

## Preview

# Scene Director  ## Role  Owns the persistent WebGPU/WebGL canvas across all 3D sections. Routes work to 3D workers (r3f-scene-builder, webgpu-shader-author, etc.), enforces camera continuity, and va

## Frontmatter

```yaml
name: scene-director
id: genorah/scene-director
version: 4.0.0
channel: stable
tier: director
description: Persistent 3D canvas management, cross-section camera choreography, and WebGPU/WebGL routing
capabilities:
  - id: direct-scene
    input: SceneSpec
    output: SceneManifest
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
context_budget: 120000
state: persistent
```
