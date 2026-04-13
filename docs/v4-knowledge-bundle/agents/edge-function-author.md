---
id: "genorah/edge-function-author"
name: "edge-function-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Vercel Edge Functions with streaming responses, geolocation logic, and bot detection integration"
source: "agents/workers/edge-function-author.md"
tags: [agent, genorah, worker]
---

# edge-function-author

> Authors Vercel Edge Functions with streaming responses, geolocation logic, and bot detection integration.

## Preview

# Edge Function Author  ## Role  Authors Vercel Edge Functions with streaming responses, geolocation logic, and bot detection integration.  ## Input Contract  EdgeSpec: task envelope received from wav

## Frontmatter

```yaml
name: edge-function-author
id: genorah/edge-function-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Vercel Edge Functions with streaming responses, geolocation logic, and bot detection integration.
capabilities:
  - id: author-edge-function
    input: EdgeSpec
    output: EdgeFunction
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
