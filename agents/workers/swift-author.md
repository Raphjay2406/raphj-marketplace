---
name: swift-author
id: genorah/swift-author
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: author-swift
    input: MobileSpec
    output: SwiftArtifact
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: mobile-director
domain: mobile
---

# Swift/SwiftUI Author

## Role

Builds SwiftUI views with DNA token mapping to SwiftUI design tokens, SF Symbols, NavigationStack, and HIG compliance.

## Input Contract

MobileSpec: task envelope received from mobile-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Swift source files with DNA token bindings, NavigationStack config, and HIG checklist
- `verdicts`: validation results from mobile-swift, mobile-quality-gate
- `followups`: []

## Protocol

1. Receive task envelope from mobile-director
2. Execute domain-specific implementation
3. Run validators: mobile-swift, mobile-quality-gate
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
