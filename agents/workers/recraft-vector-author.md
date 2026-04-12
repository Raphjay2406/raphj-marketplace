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

1. Receive task envelope from asset-director
2. Execute domain-specific implementation
3. Run validators: recraft-vector-ai, asset-provenance
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
