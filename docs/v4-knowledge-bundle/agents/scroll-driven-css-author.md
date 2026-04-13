---
id: "genorah/scroll-driven-css-author"
name: "scroll-driven-css-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors native CSS scroll-driven animations using @keyframes with animation-timeline. Provides JS-based fallback for uns"
source: "agents/workers/scroll-driven-css-author.md"
tags: [agent, genorah, worker]
---

# scroll-driven-css-author

> Authors native CSS scroll-driven animations using @keyframes with animation-timeline. Provides JS-based fallback for unsupported browsers.

## Preview

# Scroll-Driven CSS Author  ## Role  Authors native CSS scroll-driven animations using @keyframes with animation-timeline. Provides JS-based fallback for unsupported browsers.  ## Input Contract  Moti

## Frontmatter

```yaml
name: scroll-driven-css-author
id: genorah/scroll-driven-css-author
version: 4.0.0
channel: stable
tier: worker
description: Authors native CSS scroll-driven animations using @keyframes with animation-timeline. Provides JS-based fallback for unsupported browsers.
capabilities:
  - id: author-scroll-driven-css
    input: MotionSpec
    output: ScrollDrivenCSS
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: wave-director
domain: motion
```
