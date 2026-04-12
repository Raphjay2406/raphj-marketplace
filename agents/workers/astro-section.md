---
name: astro-section
id: genorah/astro-section
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: build-astro-section
    input: SectionSpec
    output: SectionArtifact
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: section-build
---

# Astro Section Builder

## Role

Builds a single page section as an Astro component with DNA tokens, island hydration strategy, and 4-breakpoint layout.

## Input Contract

SectionSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: section/ directory with .astro component files and SUMMARY.md
- `verdicts`: validation results from quality-gate-v3, archetype-specificity
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: quality-gate-v3, archetype-specificity
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
