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

1. Receive task envelope from asset-director
2. Execute domain-specific implementation
3. Run validators: upscaling, lpips-similarity
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
