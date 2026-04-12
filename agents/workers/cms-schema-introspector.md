---
name: cms-schema-introspector
id: genorah/cms-schema-introspector
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: introspect-cms-schema
    input: CMSConnectionSpec
    output: CMSSchemaReport
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

# CMS Schema Introspector

## Role

Introspects CMS schemas via GROQ (Sanity), CMA (Contentful), or OpenAPI (Payload). Maps content types to DNA sections.

## Input Contract

CMSConnectionSpec: task envelope received from research-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: CMS schema report with content type inventory, field mappings, and DNA section assignments
- `verdicts`: validation results from cms-sanity, cms-reconnect, cms-payload
- `followups`: []

## Protocol

1. Receive task envelope from research-director
2. Execute domain-specific implementation
3. Run validators: cms-sanity, cms-reconnect, cms-payload
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
