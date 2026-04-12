---
name: visual-refiner
id: genorah/visual-refiner
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: refine-visuals
    input: SectionArtifact
    output: RefinedArtifact
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: wave-director
domain: polish
---

# Visual Refiner

## Role

Closed-loop visual refinement: captures Playwright screenshots, compares against reference targets, applies corrections until delta converges.

## Input Contract

SectionArtifact: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Refined section with before/after screenshots and convergence log
- `verdicts`: validation results from visual-qa-protocol, closed-loop-iteration
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: visual-qa-protocol, closed-loop-iteration
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
