---
id: "genorah/api-route-author"
name: "api-route-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors framework-native API routes with Zod validation, error handling, and OpenAPI documentation"
source: "agents/workers/api-route-author.md"
tags: [agent, genorah, worker]
---

# api-route-author

> Authors framework-native API routes with Zod validation, error handling, and OpenAPI documentation.

## Preview

# API Route Author  ## Role  Authors framework-native API routes with Zod validation, error handling, and OpenAPI documentation.  ## Input Contract  APISpec: task envelope received from wave-director

## Frontmatter

```yaml
name: api-route-author
id: genorah/api-route-author
version: 4.0.0
channel: stable
tier: worker
description: Authors framework-native API routes with Zod validation, error handling, and OpenAPI documentation.
capabilities:
  - id: author-api-routes
    input: APISpec
    output: APIRoutes
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
