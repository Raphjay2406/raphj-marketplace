---
id: "genorah/webgpu-shader-author"
name: "webgpu-shader-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors WGSL compute and fragment shaders for WebGPU-capable browsers. Provides WebGL2 fallback strategy via scene-direc"
source: "agents/workers/webgpu-shader-author.md"
tags: [agent, genorah, worker]
---

# webgpu-shader-author

> Authors WGSL compute and fragment shaders for WebGPU-capable browsers. Provides WebGL2 fallback strategy via scene-director.

## Preview

# WebGPU Shader Author  ## Role  Authors WGSL compute and fragment shaders for WebGPU-capable browsers. Provides WebGL2 fallback strategy via scene-director.  ## Input Contract  ShaderSpec: task envel

## Frontmatter

```yaml
name: webgpu-shader-author
id: genorah/webgpu-shader-author
version: 4.0.0
channel: stable
tier: worker
description: Authors WGSL compute and fragment shaders for WebGPU-capable browsers. Provides WebGL2 fallback strategy via scene-director.
capabilities:
  - id: author-webgpu-shader
    input: ShaderSpec
    output: WGSLShader
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
