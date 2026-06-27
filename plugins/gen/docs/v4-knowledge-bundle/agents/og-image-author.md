---
id: "genorah/og-image-author"
name: "og-image-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors dynamic OG image generation routes with next/og, DNA typography, and brand color templates"
source: "agents/workers/og-image-author.md"
tags: [agent, genorah, worker]
---

# og-image-author

> Authors dynamic OG image generation routes with next/og, DNA typography, and brand color templates.

## Preview

# OG Image Author  ## Role  Authors dynamic OG image generation routes with next/og, DNA typography, and brand color templates.  ## Input Contract  OGSpec: task envelope received from wave-director  #

## Frontmatter

```yaml
name: og-image-author
id: genorah/og-image-author
version: 4.0.0
channel: stable
tier: worker
description: Authors dynamic OG image generation routes with next/og, DNA typography, and brand color templates.
capabilities:
  - id: author-og-images
    input: OGSpec
    output: OGImageRoutes
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: misc
```
