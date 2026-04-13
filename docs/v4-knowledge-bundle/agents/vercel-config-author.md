---
id: "genorah/vercel-config-author"
name: "vercel-config-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors vercel.json with routing rules, edge config, caching strategies, and environment variable schema"
source: "agents/workers/vercel-config-author.md"
tags: [agent, genorah, worker]
---

# vercel-config-author

> Authors vercel.json with routing rules, edge config, caching strategies, and environment variable schema.

## Preview

# Vercel Config Author  ## Role  Authors vercel.json with routing rules, edge config, caching strategies, and environment variable schema.  ## Input Contract  DeploySpec: task envelope received from w

## Frontmatter

```yaml
name: vercel-config-author
id: genorah/vercel-config-author
version: 4.0.0
channel: stable
tier: worker
description: Authors vercel.json with routing rules, edge config, caching strategies, and environment variable schema.
capabilities:
  - id: author-vercel-config
    input: DeploySpec
    output: VercelConfig
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: deployment
```
