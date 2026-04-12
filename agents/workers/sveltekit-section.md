---
name: sveltekit-section
id: genorah/sveltekit-section
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: build-sveltekit-section
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

# SvelteKit Section Builder

## Role

Builds a single page section as a SvelteKit component with DNA tokens, Svelte transitions, and 4-breakpoint responsive layout.

## Input Contract

SectionSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: section/ directory with .svelte files and SUMMARY.md
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
