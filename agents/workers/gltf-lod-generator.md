---
name: gltf-lod-generator
id: genorah/gltf-lod-generator
version: 4.0.0
channel: stable
tier: worker
description: undefined
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
---

# GLTF LOD Generator

## Role

Generates multiple LOD variants for GLTF models. Validates triangle counts and texture sizes against perf budgets.

## Input Contract

GLTFAsset: task envelope received from scene-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: LOD manifest with asset paths per quality tier and load thresholds
- `verdicts`: validation results from gltf-optimization, perf-budgets
- `followups`: []

## Protocol

1. Receive task envelope from scene-director
2. Execute domain-specific implementation
3. Run validators: gltf-optimization, perf-budgets
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
