---
id: "genorah/vue-section"
name: "vue-section"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds a single page section as a Vue 3 SFC with DNA tokens, GSAP/VueUse motion, and 4-breakpoint responsive layout"
source: "agents/workers/vue-section.md"
tags: [agent, genorah, worker]
---

# vue-section

> Builds a single page section as a Vue 3 SFC with DNA tokens, GSAP/VueUse motion, and 4-breakpoint responsive layout.

## Preview

# Vue Section Builder  ## Role  Builds a single page section as a Vue 3 SFC with DNA tokens, GSAP/VueUse motion, and 4-breakpoint responsive layout.  ## Input Contract  SectionSpec: task envelope rece

## Frontmatter

```yaml
name: vue-section
id: genorah/vue-section
version: 4.0.0
channel: stable
tier: worker
description: Builds a single page section as a Vue 3 SFC with DNA tokens, GSAP/VueUse motion, and 4-breakpoint responsive layout.
capabilities:
  - id: build-vue-section
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
