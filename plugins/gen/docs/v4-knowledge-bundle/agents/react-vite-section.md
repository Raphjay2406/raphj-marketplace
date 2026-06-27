---
id: "genorah/react-vite-section"
name: "react-vite-section"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds a single page section as a React component with Vite, DNA tokens, Framer Motion, and 4-breakpoint responsive layo"
source: "agents/workers/react-vite-section.md"
tags: [agent, genorah, worker]
---

# react-vite-section

> Builds a single page section as a React component with Vite, DNA tokens, Framer Motion, and 4-breakpoint responsive layout.

## Preview

# React/Vite Section Builder  ## Role  Builds a single page section as a React component with Vite, DNA tokens, Framer Motion, and 4-breakpoint responsive layout.  ## Input Contract  SectionSpec: task

## Frontmatter

```yaml
name: react-vite-section
id: genorah/react-vite-section
version: 4.0.0
channel: stable
tier: worker
description: Builds a single page section as a React component with Vite, DNA tokens, Framer Motion, and 4-breakpoint responsive layout.
capabilities:
  - id: build-react-vite-section
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
