---
name: typography-critic
id: genorah/typography-critic
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: critique-typography
    input: SectionArtifact
    output: TypographyCritique
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

# Typography Critic

## Role

Evaluates typography against quality gate axis: scale discipline, hierarchy clarity, archetype font personality, and readability.

## Input Contract

SectionArtifact: task envelope received from quality-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Typography critique with score, flagged violations, and fix suggestions
- `verdicts`: validation results from typography-rules, quality-gate-v3
- `followups`: []

## Protocol

1. Receive task envelope from quality-director
2. Execute domain-specific implementation
3. Run validators: typography-rules, quality-gate-v3
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
