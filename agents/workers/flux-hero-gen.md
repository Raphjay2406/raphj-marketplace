---
name: flux-hero-gen
id: genorah/flux-hero-gen
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: generate-flux-hero
    input: HeroAssetSpec
    output: HeroImageAsset
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

# Flux Hero Generator

## Role

Generates hero background images using Flux API with DNA-matched color palettes and beat-type visual language.

## Input Contract

HeroAssetSpec: task envelope received from asset-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Hero image file with generation params and DNA color validation report
- `verdicts`: validation results from pixel-dna-extraction, asset-provenance
- `followups`: []

## Protocol

1. Receive task envelope from asset-director
2. Execute domain-specific implementation
3. Run validators: pixel-dna-extraction, asset-provenance
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
