---
name: awwwards-judge-simulator
id: genorah/awwwards-judge-simulator
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: simulate-awwwards
    input: FullPageArtifact
    output: AwwwardsScore
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

# Awwwards Judge Simulator

## Role

Simulates Awwwards SOTD judge scoring across 4 axes: Design, Usability, Creativity, Content. Targets 8.0+ average.

## Input Contract

FullPageArtifact: task envelope received from quality-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Awwwards score report with per-axis scores, SOTD gap analysis, and win criteria
- `verdicts`: validation results from awwwards-scoring, quality-gate-v3
- `followups`: []

## Protocol

1. Receive task envelope from quality-director
2. Execute domain-specific implementation
3. Run validators: awwwards-scoring, quality-gate-v3
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
