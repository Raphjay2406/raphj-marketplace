---
name: og-image-author
id: genorah/og-image-author
version: 4.0.0
channel: stable
tier: worker
description: Authors dynamic OG image generation routes with next/og, DNA typography, and brand color templates.
capabilities:
  - id: author-og-images
    input: OGSpec
    output: OGImageRoutes
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: misc
---

# OG Image Author

## Role

Authors dynamic OG image generation routes with next/og, DNA typography, and brand color templates.

## Input Contract

OGSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: OG image route files with next/og templates and DNA token bindings
- `verdicts`: validation results from og-images, seo-meta
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: og-images, seo-meta
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
