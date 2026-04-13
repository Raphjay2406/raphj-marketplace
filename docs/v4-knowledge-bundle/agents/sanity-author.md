---
id: "genorah/sanity-author"
name: "sanity-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Sanity schema definitions, GROQ queries, and DNA-themed Studio components for content management"
source: "agents/workers/sanity-author.md"
tags: [agent, genorah, worker]
---

# sanity-author

> Authors Sanity schema definitions, GROQ queries, and DNA-themed Studio components for content management.

## Preview

# Sanity Author  ## Role  Authors Sanity schema definitions, GROQ queries, and DNA-themed Studio components for content management.  ## Input Contract  CMSSpec: task envelope received from wave-direct

## Frontmatter

```yaml
name: sanity-author
id: genorah/sanity-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Sanity schema definitions, GROQ queries, and DNA-themed Studio components for content management.
capabilities:
  - id: author-sanity
    input: CMSSpec
    output: SanitySchema
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: cms
```
