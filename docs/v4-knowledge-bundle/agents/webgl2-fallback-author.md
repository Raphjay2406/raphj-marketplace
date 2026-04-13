---
id: "genorah/webgl2-fallback-author"
name: "webgl2-fallback-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Transpiles or authors equivalent GLSL 3.0 fallback shaders for WebGPU scenes. Ensures tier-1 browser compatibility"
source: "agents/workers/webgl2-fallback-author.md"
tags: [agent, genorah, worker]
---

# webgl2-fallback-author

> Transpiles or authors equivalent GLSL 3.0 fallback shaders for WebGPU scenes. Ensures tier-1 browser compatibility.

## Preview

# WebGL2 Fallback Author  ## Role  Transpiles or authors equivalent GLSL 3.0 fallback shaders for WebGPU scenes. Ensures tier-1 browser compatibility.  ## Input Contract  WebGPUShader: task envelope r

## Frontmatter

```yaml
name: webgl2-fallback-author
id: genorah/webgl2-fallback-author
version: 4.0.0
channel: stable
tier: worker
description: Transpiles or authors equivalent GLSL 3.0 fallback shaders for WebGPU scenes. Ensures tier-1 browser compatibility.
capabilities:
  - id: author-webgl2-fallback
    input: WebGPUShader
    output: GLSL300Shader
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
