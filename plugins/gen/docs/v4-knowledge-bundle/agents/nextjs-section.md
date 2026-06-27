---
id: "genorah/nextjs-section"
name: "nextjs-section"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds a single page section as a Next.js RSC with Tailwind v4 DNA tokens, animation, and 4-breakpoint responsive layout"
source: "agents/workers/nextjs-section.md"
tags: [agent, genorah, worker]
---

# nextjs-section

> Builds a single page section as a Next.js RSC with Tailwind v4 DNA tokens, animation, and 4-breakpoint responsive layout.

## Preview

# Next.js Section Builder  ## Role  Builds a single page section as a Next.js RSC with Tailwind v4 DNA tokens, animation, and 4-breakpoint responsive layout.  ## Input Contract  SectionSpec: task enve

## Frontmatter

```yaml
name: nextjs-section
id: genorah/nextjs-section
version: 4.0.0
channel: stable
tier: worker
description: Builds a single page section as a Next.js RSC with Tailwind v4 DNA tokens, animation, and 4-breakpoint responsive layout.
capabilities:
  - id: build-nextjs-section
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
