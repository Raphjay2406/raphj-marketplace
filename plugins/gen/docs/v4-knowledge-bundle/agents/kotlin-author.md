---
id: "genorah/kotlin-author"
name: "kotlin-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds Jetpack Compose UIs with Material You DNA bridge, adaptive layouts for foldables, and ViewModel architecture"
source: "agents/workers/kotlin-author.md"
tags: [agent, genorah, worker]
---

# kotlin-author

> Builds Jetpack Compose UIs with Material You DNA bridge, adaptive layouts for foldables, and ViewModel architecture.

## Preview

# Kotlin/Compose Author  ## Role  Builds Jetpack Compose UIs with Material You DNA bridge, adaptive layouts for foldables, and ViewModel architecture.  ## Input Contract  MobileSpec: task envelope rec

## Frontmatter

```yaml
name: kotlin-author
id: genorah/kotlin-author
version: 4.0.0
channel: stable
tier: worker
description: Builds Jetpack Compose UIs with Material You DNA bridge, adaptive layouts for foldables, and ViewModel architecture.
capabilities:
  - id: author-kotlin
    input: MobileSpec
    output: KotlinArtifact
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
```
