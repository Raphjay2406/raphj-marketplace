---
name: inpainter
id: genorah/inpainter
version: 4.0.0
channel: stable
tier: worker
description: Runs inpainting workflows to fix, extend, or composite image assets. Preserves DNA color accuracy in edited regions.
capabilities:
  - id: inpaint-image
    input: InpaintSpec
    output: InpaintedAsset
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

# Inpainter

## Role

Runs inpainting workflows to fix, extend, or composite image assets. Preserves DNA color accuracy in edited regions.

## Input Contract

InpaintSpec: task envelope received from asset-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Inpainted image with edit mask, original backup, and color validation report
- `verdicts`: validation results from pixel-dna-extraction, inpainting-workflow
- `followups`: []

## Protocol

1. Accept AssetInput payload (prompt + references + seed + params).
2. Invoke `FluxKontextProvider.generate(input)` via `@genorah/asset-forge` (in inpaint mode).
3. Self-check validators: dna-compliance, license, provenance.
4. Return `Result<AssetResult>` with cost + duration + provider.

## Skills Invoked

- `image-cascade` (for fallback chain)
- `texture-provenance`
- `cost-governance`

## Followups

- `cost_ratio > 0.8` → followup `{ suggested_worker: "upscaler", reason: "finalize before further spend" }`
- `dna-compliance.pass: false` → followup `{ suggested_worker: "inpainter", reason: "lift DNA coverage" }`
