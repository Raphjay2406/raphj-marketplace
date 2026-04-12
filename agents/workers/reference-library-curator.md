---
name: reference-library-curator
id: genorah/reference-library-curator
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: curate-references
    input: ResearchReport
    output: ReferenceLibrary
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

# Reference Library Curator

## Role

Curates and indexes reference sites and assets into the project reference library. Manages semantic search index.

## Input Contract

ResearchReport: task envelope received from research-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Reference library entries with semantic tags, beat type assignments, and quality scores
- `verdicts`: validation results from reference-library-rag
- `followups`: []

## Protocol

1. Receive task envelope from research-director
2. Execute domain-specific implementation
3. Run validators: reference-library-rag
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
