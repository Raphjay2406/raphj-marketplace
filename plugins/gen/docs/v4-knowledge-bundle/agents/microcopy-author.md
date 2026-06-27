---
id: "genorah/microcopy-author"
name: "microcopy-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors UI microcopy, CTA text, tooltips, and error messages aligned with brand voice and anti-slop gate"
source: "agents/workers/microcopy-author.md"
tags: [agent, genorah, worker]
---

# microcopy-author

> Authors UI microcopy, CTA text, tooltips, and error messages aligned with brand voice and anti-slop gate.

## Preview

# Microcopy Author  ## Role  Authors UI microcopy, CTA text, tooltips, and error messages aligned with brand voice and anti-slop gate.  ## Input Contract  CopySpec: task envelope received from creativ

## Frontmatter

```yaml
name: microcopy-author
id: genorah/microcopy-author
version: 4.0.0
channel: stable
tier: worker
description: Authors UI microcopy, CTA text, tooltips, and error messages aligned with brand voice and anti-slop gate.
capabilities:
  - id: author-microcopy
    input: CopySpec
    output: MicrocopyDraft
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: creative-director
domain: content
```
