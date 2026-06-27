---
id: "genorah/spline-embed-author"
name: "spline-embed-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Spline scene embed components with lazy loading, DNA color injection via Spline events API, and reduced-motion f"
source: "agents/workers/spline-embed-author.md"
tags: [agent, genorah, worker]
---

# spline-embed-author

> Authors Spline scene embed components with lazy loading, DNA color injection via Spline events API, and reduced-motion fallback.

## Preview

# Spline Embed Author  ## Role  Authors Spline scene embed components with lazy loading, DNA color injection via Spline events API, and reduced-motion fallback.  ## Input Contract  SplineSpec: task en

## Frontmatter

```yaml
name: spline-embed-author
id: genorah/spline-embed-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Spline scene embed components with lazy loading, DNA color injection via Spline events API, and reduced-motion fallback.
capabilities:
  - id: author-spline-embed
    input: SplineSpec
    output: SplineEmbedComponent
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: scene-director
domain: 3d
```
