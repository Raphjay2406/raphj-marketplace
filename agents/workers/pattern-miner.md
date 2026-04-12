---
name: pattern-miner
id: genorah/pattern-miner
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: mine-patterns
    input: ReferenceLibrary
    output: PatternCatalog
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: research-director
domain: research
---

# Pattern Miner

## Role

Extracts reusable design patterns from reference sites. Identifies cross-archetype techniques and innovation opportunities.

## Input Contract

ReferenceLibrary: task envelope received from research-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Pattern catalog with technique descriptions, usage contexts, and implementation hints
- `verdicts`: validation results from reference-benchmarking, cross-pollination
- `followups`: []

## Protocol

1. Receive task envelope from research-director
2. Execute domain-specific implementation
3. Run validators: reference-benchmarking, cross-pollination
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
