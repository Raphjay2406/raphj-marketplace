---
name: webgl2-fallback-author
id: genorah/webgl2-fallback-author
version: 4.0.0
channel: stable
tier: worker
description: undefined
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
---

# WebGL2 Fallback Author

## Role

Transpiles or authors equivalent GLSL 3.0 fallback shaders for WebGPU scenes. Ensures tier-1 browser compatibility.

## Input Contract

WebGPUShader: task envelope received from scene-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: GLSL 3.0 shader files compatible with WebGL2 context
- `verdicts`: validation results from cross-browser-rendering
- `followups`: []

## Protocol

1. Receive task envelope from scene-director
2. Execute domain-specific implementation
3. Run validators: cross-browser-rendering
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
