---
name: narrative-critic
id: genorah/narrative-critic
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: critique-narrative
    input: SectionSequence
    output: NarrativeCritique
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: quality-director
domain: critics
---

# Narrative Critic

## Role

Evaluates cross-section story arc coherence, beat sequencing validity, and emotional progression.

## Input Contract

SectionSequence: task envelope received from quality-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Narrative critique with arc score, beat transition analysis, and coherence gaps
- `verdicts`: validation results from emotional-arc, quality-gate-v3
- `followups`: []

## Protocol

1. Receive task envelope from quality-director
2. Execute domain-specific implementation
3. Run validators: emotional-arc, quality-gate-v3
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
