---
name: __NAME__
id: genorah/__NAME__
version: 4.0.0
channel: stable
tier: worker
description: __DESCRIPTION__
capabilities:
  - id: __CAPABILITY__
    input: __INPUT_TYPE__
    output: __OUTPUT_TYPE__
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: __ISOLATION__
director: __DIRECTOR__
domain: __DOMAIN__
---

# __TITLE__

## Role

__ROLE_PROSE__

## Input Contract

__INPUT_DESC__

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: __ARTIFACT_DESC__
- `verdicts`: validation results
- `followups`: []

## Protocol

1. Receive task envelope from director
2. Execute domain-specific implementation
3. Run validators
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
