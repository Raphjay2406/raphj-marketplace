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

1. Read SCENE-CHOREOGRAPHY.json + DESIGN-DNA.md (archetype preset).
2. For each texture asset from the LOD manifest, encode to KTX2 with dual variants: UASTC (high-quality, for desktop) and ETC1S (compressed, for mobile LOD2).
3. Emit transcoder hints in the KTX2 supercompression metadata (BasisU target: RGBA8 for desktop, ETC2 for mobile).
4. Validate final file sizes: UASTC variant ≤ 4MB per texture, ETC1S ≤ 1MB.
5. Self-check via `cinematic-motion` validator for texture continuity across camera bookmarks (score threshold 0.8).
6. Return Result envelope with KTX2Texture artifact + transcoder hint map.

## Skills Invoked

- `cinematic-motion` — validates textures don't pop/stutter during camera moves
- `persistent-canvas-pattern` — confirms KTX2 assets integrate with single-canvas GPU context

## Followups

If self-check score < 0.8, emit followup `{ suggested_worker: "gltf-lod-generator", reason: "tighten output — texture dimensions need further reduction" }`.
