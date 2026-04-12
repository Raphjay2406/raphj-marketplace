---
name: theatre-sequencer
id: genorah/theatre-sequencer
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: sequence-theatre
    input: SequenceSpec
    output: TheatreProject
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: wave-director
domain: motion
---

# Theatre.js Sequencer

## Role

Authors Theatre.js project files for complex multi-object animation sequences. Binds sequence values to DNA motion tokens.

## Input Contract

SequenceSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Theatre.js project JSON with object sheets, sequences, and DNA token bindings
- `verdicts`: validation results from motion-health, interaction-fidelity-gate
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: motion-health, interaction-fidelity-gate
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
