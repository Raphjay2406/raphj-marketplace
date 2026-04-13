---
id: "genorah/recraft-vector-author"
name: "recraft-vector-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Generates SVG vector assets via Recraft API. Binds vector colors to DNA tokens for runtime theming"
source: "agents/workers/recraft-vector-author.md"
tags: [agent, genorah, worker]
---

# recraft-vector-author

> Generates SVG vector assets via Recraft API. Binds vector colors to DNA tokens for runtime theming.

## Preview

# Recraft Vector Author  ## Role  Generates SVG vector assets via Recraft API. Binds vector colors to DNA tokens for runtime theming.  ## Input Contract  VectorSpec: task envelope received from asset-

## Frontmatter

```yaml
name: recraft-vector-author
id: genorah/recraft-vector-author
version: 4.0.0
channel: stable
tier: worker
description: Generates SVG vector assets via Recraft API. Binds vector colors to DNA tokens for runtime theming.
capabilities:
  - id: author-recraft-vector
    input: VectorSpec
    output: SVGAsset
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: asset-director
domain: asset
```
