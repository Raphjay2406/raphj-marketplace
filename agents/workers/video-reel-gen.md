---
name: video-reel-gen
id: genorah/video-reel-gen
version: 4.0.0
channel: stable
tier: worker
description: Generates DNA-parameterized video reel assets via Remotion or video gen APIs. Outputs AVIF/MP4/WebM.
capabilities:
  - id: generate-video-reel
    input: VideoSpec
    output: VideoReelAsset
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

# Video Reel Generator

## Role

Generates DNA-parameterized video reel assets via Remotion or video gen APIs. Outputs AVIF/MP4/WebM.

## Input Contract

VideoSpec: task envelope received from asset-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Video reel files with DNA color params, codec variants, and performance budget check
- `verdicts`: validation results from remotion-video, performance-patterns
- `followups`: []

## Protocol

1. Accept AssetInput payload (prompt + references + seed + params).
2. Invoke `KlingProvider.generate(input)` via `@genorah/asset-forge`.
3. Self-check validators: dna-compliance, license, provenance.
4. Return `Result<AssetResult>` with cost + duration + provider.

## Skills Invoked

- `image-cascade` (for fallback chain)
- `texture-provenance`
- `cost-governance`

## Followups

- `cost_ratio > 0.8` → followup `{ suggested_worker: "upscaler", reason: "finalize before further spend" }`
- `dna-compliance.pass: false` → followup `{ suggested_worker: "inpainter", reason: "lift DNA coverage" }`
