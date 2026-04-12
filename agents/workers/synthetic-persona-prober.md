---
name: synthetic-persona-prober
id: genorah/synthetic-persona-prober
version: 4.0.0
channel: stable
tier: worker
description: Runs synthetic user personas through the full page journey. Validates task completion, confusion points, and conversion path.
capabilities:
  - id: probe-synthetic-persona
    input: PersonaSpec
    output: PersonaProbeReport
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: quality-director
domain: observability
---

# Synthetic Persona Prober

## Role

Runs synthetic user personas through the full page journey. Validates task completion, confusion points, and conversion path.

## Input Contract

PersonaSpec: task envelope received from quality-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Persona probe report with journey completion rates, confusion map, and CRO flags
- `verdicts`: validation results from synthetic-user-testing, ux-heuristics-gate
- `followups`: []

## Protocol

1. Receive task envelope from quality-director
2. Execute domain-specific implementation
3. Run validators: synthetic-user-testing, ux-heuristics-gate
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
