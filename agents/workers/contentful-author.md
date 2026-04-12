---
name: contentful-author
id: genorah/contentful-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Contentful content model definitions and GraphQL query fragments with DNA token field mappings.
capabilities:
  - id: author-contentful
    input: CMSSpec
    output: ContentfulSchema
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: cms
---

# Contentful Author

## Role

Authors Contentful content model definitions and GraphQL query fragments with DNA token field mappings.

## Input Contract

CMSSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Contentful migration scripts, content type definitions, and GraphQL fragments
- `verdicts`: validation results from cms-reconnect, cms-content-pipeline
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: cms-reconnect, cms-content-pipeline
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
