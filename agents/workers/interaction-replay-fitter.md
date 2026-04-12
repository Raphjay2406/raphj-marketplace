---
name: interaction-replay-fitter
id: genorah/interaction-replay-fitter
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: fit-interaction-replay
    input: PlaywrightTrace
    output: MotionInventory
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

# Interaction Replay Fitter

## Role

Fits Playwright traces to 7 cubic-Bezier easing presets and generates MOTION-INVENTORY.md with exact preset matches.

## Input Contract

PlaywrightTrace: task envelope received from research-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: MOTION-INVENTORY.md with easing fits, confidence scores, and replay recommendations
- `verdicts`: validation results from interaction-replay, motion-health
- `followups`: []

## Protocol

1. Receive task envelope from research-director
2. Execute domain-specific implementation
3. Run validators: interaction-replay, motion-health
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
