---
name: polisher
id: genorah/polisher
version: 4.0.0
channel: stable
tier: worker
description: "Applies final polish pass: micro-interactions, hover states, focus rings, loading skeletons, and transition refinements."
capabilities:
  - id: polish-section
    input: SectionArtifact
    output: PolishedArtifact
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

# Polisher

## Role

Applies final polish pass: micro-interactions, hover states, focus rings, loading skeletons, and transition refinements.

## Input Contract

SectionArtifact: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Polished section files with micro-interaction layer and transition polish
- `verdicts`: validation results from polish-pass, interaction-fidelity-gate
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: polish-pass, interaction-fidelity-gate
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
