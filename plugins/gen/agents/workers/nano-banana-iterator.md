---
name: nano-banana-iterator
id: genorah/nano-banana-iterator
version: 4.0.0
channel: stable
tier: worker
description: Runs iterative image editing via nano-banana MCP. Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.
capabilities:
  - id: iterate-nano-banana
    input: ImageIterSpec
    output: IteratedImageAsset
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

# Nano-Banana Iterator

## Role

Runs iterative image editing via nano-banana MCP. Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.

## Input Contract

ImageIterSpec: task envelope received from asset-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Iterated image asset with edit chain log and final DNA alignment score
- `verdicts`: validation results from pixel-dna-extraction, lpips-similarity
- `followups`: []

## Protocol

1. Accept AssetInput payload (prompt + references + seed + params).
2. Invoke `NanoBananaProvider.generate(input)` via `@genorah/asset-forge`.
3. Self-check validators: dna-compliance, license, provenance.
4. Return `Result<AssetResult>` with cost + duration + provider.

## Skills Invoked

- `image-cascade` (for fallback chain)
- `texture-provenance`
- `cost-governance`

## Followups

- `cost_ratio > 0.8` → followup `{ suggested_worker: "upscaler", reason: "finalize before further spend" }`
- `dna-compliance.pass: false` → followup `{ suggested_worker: "inpainter", reason: "lift DNA coverage" }`
