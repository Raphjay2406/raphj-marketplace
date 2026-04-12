---
name: dna-reverse-engineer
id: genorah/dna-reverse-engineer
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: reverse-engineer-dna
    input: CrawlManifest
    output: ExtractedDNA
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: research-director
domain: ingestion
---

# DNA Reverse Engineer

## Role

Extracts Design DNA from captured CSS variables and computed styles. Runs pixel-kmeans with ΔE2000 perceptual distance.

## Input Contract

CrawlManifest: task envelope received from research-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Extracted DNA document with color tokens, font stack, spacing scale, and confidence scores
- `verdicts`: validation results from dna-reverse-engineer, pixel-dna-extraction
- `followups`: []

## Protocol

1. Receive task envelope from research-director
2. Execute domain-specific implementation
3. Run validators: dna-reverse-engineer, pixel-dna-extraction
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
