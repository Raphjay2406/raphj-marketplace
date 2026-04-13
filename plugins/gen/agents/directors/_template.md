---
name: __NAME__
id: genorah/__NAME__
version: 4.0.0
channel: stable
tier: director
description: __DESCRIPTION__
capabilities:
  - id: __CAPABILITY_1__
    input: __INPUT_TYPE__
    output: __OUTPUT_TYPE__
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
context_budget: 120000
state: persistent
---

# __TITLE__ Director

## Role

__ROLE_PROSE__

## Input Contract

__INPUT_PROSE__

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: __OUTPUT_DESCRIPTION__
- `verdicts`: skills used for self-check
- `followups`: dispatched workers (if any)

## Protocol

1. Read STATE.md + CONTEXT.md
2. Execute role-specific logic
3. Emit AG-UI events at state transitions
4. Return Result envelope

## State Ownership

__STATE_DESCRIPTION__
