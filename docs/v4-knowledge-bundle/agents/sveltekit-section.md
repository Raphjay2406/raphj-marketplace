---
id: "genorah/sveltekit-section"
name: "sveltekit-section"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds a single page section as a SvelteKit component with DNA tokens, Svelte transitions, and 4-breakpoint responsive l"
source: "agents/workers/sveltekit-section.md"
tags: [agent, genorah, worker]
---

# sveltekit-section

> Builds a single page section as a SvelteKit component with DNA tokens, Svelte transitions, and 4-breakpoint responsive layout.

## Preview

# SvelteKit Section Builder  ## Role  Builds a single page section as a SvelteKit component with DNA tokens, Svelte transitions, and 4-breakpoint responsive layout.  ## Input Contract  SectionSpec: ta

## Frontmatter

```yaml
name: sveltekit-section
id: genorah/sveltekit-section
version: 4.0.0
channel: stable
tier: worker
description: Builds a single page section as a SvelteKit component with DNA tokens, Svelte transitions, and 4-breakpoint responsive layout.
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
```
