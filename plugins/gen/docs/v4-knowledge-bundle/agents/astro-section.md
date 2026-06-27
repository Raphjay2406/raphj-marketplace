---
id: "genorah/astro-section"
name: "astro-section"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds a single page section as an Astro component with DNA tokens, island hydration strategy, and 4-breakpoint layout"
source: "agents/workers/astro-section.md"
tags: [agent, genorah, worker]
---

# astro-section

> Builds a single page section as an Astro component with DNA tokens, island hydration strategy, and 4-breakpoint layout.

## Preview

# Astro Section Builder  ## Role  Builds a single page section as an Astro component with DNA tokens, island hydration strategy, and 4-breakpoint layout.  ## Input Contract  SectionSpec: task envelope

## Frontmatter

```yaml
name: astro-section
id: genorah/astro-section
version: 4.0.0
channel: stable
tier: worker
description: Builds a single page section as an Astro component with DNA tokens, island hydration strategy, and 4-breakpoint layout.
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
```
