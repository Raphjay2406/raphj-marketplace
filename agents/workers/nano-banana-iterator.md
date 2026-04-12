---
name: nano-banana-iterator
id: genorah/nano-banana-iterator
version: 4.0.0
channel: stable
tier: worker
description: undefined
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

1. Receive task envelope from asset-director
2. Execute domain-specific implementation
3. Run validators: pixel-dna-extraction, lpips-similarity
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
