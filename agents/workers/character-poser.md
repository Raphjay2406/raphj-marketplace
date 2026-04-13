---
name: character-poser
id: genorah/character-poser
version: 4.0.0
channel: stable
tier: worker
description: Applies poses and expressions to character models. Validates against brand character consistency guidelines.
capabilities:
  - id: pose-character
    input: PoseSpec
    output: PosedCharacter
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

# Character Poser

## Role

Applies poses and expressions to character models. Validates against brand character consistency guidelines.

## Input Contract

PoseSpec: task envelope received from asset-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Posed character GLTF with blend shape values and expression metadata
- `verdicts`: validation results from character-consistency, asset-provenance
- `followups`: []

## Protocol

1. Accept AssetInput payload (prompt + references + seed + params).
2. Invoke `NanoBananaProvider.generate(input)` via `@genorah/asset-forge` (uses MCP for character iteration).
3. Self-check validators: dna-compliance, license, provenance.
4. Return `Result<AssetResult>` with cost + duration + provider.

## Skills Invoked

- `image-cascade` (for fallback chain)
- `texture-provenance`
- `cost-governance`

## Followups

- `cost_ratio > 0.8` → followup `{ suggested_worker: "upscaler", reason: "finalize before further spend" }`
- `dna-compliance.pass: false` → followup `{ suggested_worker: "inpainter", reason: "lift DNA coverage" }`
