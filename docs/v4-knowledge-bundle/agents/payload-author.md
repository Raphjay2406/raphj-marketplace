---
id: "genorah/payload-author"
name: "payload-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Payload CMS collection and global definitions with DNA-themed admin UI and access control policies"
source: "agents/workers/payload-author.md"
tags: [agent, genorah, worker]
---

# payload-author

> Authors Payload CMS collection and global definitions with DNA-themed admin UI and access control policies.

## Preview

# Payload Author  ## Role  Authors Payload CMS collection and global definitions with DNA-themed admin UI and access control policies.  ## Input Contract  CMSSpec: task envelope received from wave-dir

## Frontmatter

```yaml
name: payload-author
id: genorah/payload-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Payload CMS collection and global definitions with DNA-themed admin UI and access control policies.
capabilities:
  - id: author-payload
    input: CMSSpec
    output: PayloadSchema
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
