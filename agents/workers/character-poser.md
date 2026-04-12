---
name: character-poser
id: genorah/character-poser
version: 4.0.0
channel: stable
tier: worker
description: undefined
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

1. Receive task envelope from asset-director
2. Execute domain-specific implementation
3. Run validators: character-consistency, asset-provenance
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
