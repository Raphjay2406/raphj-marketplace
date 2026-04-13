---
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
---

# Rodin 3D Generator

## Role

Generates 3D model assets via Rodin API. Produces GLTF output ready for scene-director pipeline.

## Input Contract

Model3DSpec: task envelope received from asset-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: GLTF model with material setup, provenance record, and DNA color bindings
- `verdicts`: validation results from gltf-optimization, asset-provenance
- `followups`: []

## Protocol

1. Accept AssetInput payload (prompt + references + seed + params).
2. Invoke `RodinProvider.generate(input)` via `@genorah/asset-forge`.
3. Self-check validators: dna-compliance, license, provenance.
4. Return `Result<AssetResult>` with cost + duration + provider.

## Skills Invoked

- `image-cascade` (for fallback chain)
- `texture-provenance`
- `cost-governance`

## Followups

- `cost_ratio > 0.8` → followup `{ suggested_worker: "upscaler", reason: "finalize before further spend" }`
- `dna-compliance.pass: false` → followup `{ suggested_worker: "inpainter", reason: "lift DNA coverage" }`
