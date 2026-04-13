---
name: upscaler
id: genorah/upscaler
version: 4.0.0
channel: stable
tier: worker
description: Upscales raster assets to target resolution using AI super-resolution. Validates output sharpness and artifact levels.
capabilities:
  - id: upscale-asset
    input: LowResAsset
    output: UpscaledAsset
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

# Upscaler

## Role

Upscales raster assets to target resolution using AI super-resolution. Validates output sharpness and artifact levels.

## Input Contract

LowResAsset: task envelope received from asset-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Upscaled image at target resolution with quality metrics
- `verdicts`: validation results from upscaling, lpips-similarity
- `followups`: []

## Protocol

1. Accept AssetInput payload (prompt + references + seed + params).
2. Invoke `DummyProvider.generate(input)` via `@genorah/asset-forge` (placeholder; M3+ adds Real-ESRGAN).
3. Self-check validators: dna-compliance, license, provenance.
4. Return `Result<AssetResult>` with cost + duration + provider.

## Skills Invoked

- `image-cascade` (for fallback chain)
- `texture-provenance`
- `cost-governance`

## Followups

- `cost_ratio > 0.8` → followup `{ suggested_worker: "upscaler", reason: "finalize before further spend" }`
- `dna-compliance.pass: false` → followup `{ suggested_worker: "inpainter", reason: "lift DNA coverage" }`
