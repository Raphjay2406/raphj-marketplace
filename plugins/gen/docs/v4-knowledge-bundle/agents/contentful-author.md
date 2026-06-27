---
id: "genorah/contentful-author"
name: "contentful-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Contentful content model definitions and GraphQL query fragments with DNA token field mappings"
source: "agents/workers/contentful-author.md"
tags: [agent, genorah, worker]
---

# contentful-author

> Authors Contentful content model definitions and GraphQL query fragments with DNA token field mappings.

## Preview

# Contentful Author  ## Role  Authors Contentful content model definitions and GraphQL query fragments with DNA token field mappings.  ## Input Contract  CMSSpec: task envelope received from wave-dire

## Frontmatter

```yaml
name: contentful-author
id: genorah/contentful-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Contentful content model definitions and GraphQL query fragments with DNA token field mappings.
capabilities:
  - id: author-contentful
    input: CMSSpec
    output: ContentfulSchema
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
