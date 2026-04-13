---
name: recraft-vector-author
id: genorah/recraft-vector-author
version: 4.0.0
channel: stable
tier: worker
description: Generates SVG vector assets via Recraft API. Binds vector colors to DNA tokens for runtime theming.
capabilities:
  - id: author-recraft-vector
    input: VectorSpec
    output: SVGAsset
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

# Recraft Vector Author

## Role

Generates SVG vector assets via Recraft API. Binds vector colors to DNA tokens for runtime theming.

## Input Contract

VectorSpec: task envelope received from asset-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: SVG file with DNA token variable bindings and viewBox optimizations
- `verdicts`: validation results from recraft-vector-ai, asset-provenance
- `followups`: []

## Protocol

1. Accept AssetInput payload (prompt + references + seed + params).
2. Invoke `RecraftProvider.generate(input)` via `@genorah/asset-forge`.
3. Self-check validators: dna-compliance, license, provenance.
4. Return `Result<AssetResult>` with cost + duration + provider.

## Skills Invoked

- `image-cascade` (for fallback chain)
- `texture-provenance`
- `cost-governance`

## Followups

- `cost_ratio > 0.8` → followup `{ suggested_worker: "upscaler", reason: "finalize before further spend" }`
- `dna-compliance.pass: false` → followup `{ suggested_worker: "inpainter", reason: "lift DNA coverage" }`
