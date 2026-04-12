---
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
---

# KTX2 Encoder

## Role

Encodes textures to KTX2/Basis format for GPU-compressed delivery. Validates format support matrix.

## Input Contract

TextureAsset: task envelope received from scene-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: KTX2 texture files with UASTC/ETC1S variants and transcoder hints
- `verdicts`: validation results from gltf-optimization
- `followups`: []

## Protocol

1. Receive task envelope from scene-director
2. Execute domain-specific implementation
3. Run validators: gltf-optimization
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
