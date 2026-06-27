---
id: "genorah/prisma-schema-author"
name: "prisma-schema-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Prisma schema from content and data requirements. Generates migrations and type-safe client bindings"
source: "agents/workers/prisma-schema-author.md"
tags: [agent, genorah, worker]
---

# prisma-schema-author

> Authors Prisma schema from content and data requirements. Generates migrations and type-safe client bindings.

## Preview

# Prisma Schema Author  ## Role  Authors Prisma schema from content and data requirements. Generates migrations and type-safe client bindings.  ## Input Contract  DataSpec: task envelope received from

## Frontmatter

```yaml
name: prisma-schema-author
id: genorah/prisma-schema-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Prisma schema from content and data requirements. Generates migrations and type-safe client bindings.
capabilities:
  - id: author-prisma-schema
    input: DataSpec
    output: PrismaSchema
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: db-api
```
