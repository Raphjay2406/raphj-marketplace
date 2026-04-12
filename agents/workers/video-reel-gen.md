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

1. Receive task envelope from asset-director
2. Execute domain-specific implementation
3. Run validators: remotion-video, performance-patterns
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
