---
id: "genorah/vitest-author"
name: "vitest-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Vitest unit and integration tests for utilities, hooks, and component logic with coverage targets"
source: "agents/workers/vitest-author.md"
tags: [agent, genorah, worker]
---

# vitest-author

> Authors Vitest unit and integration tests for utilities, hooks, and component logic with coverage targets.

## Preview

# Vitest Author  ## Role  Authors Vitest unit and integration tests for utilities, hooks, and component logic with coverage targets.  ## Input Contract  TestSpec: task envelope received from wave-dire

## Frontmatter

```yaml
name: vitest-author
id: genorah/vitest-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Vitest unit and integration tests for utilities, hooks, and component logic with coverage targets.
capabilities:
  - id: author-vitest
    input: TestSpec
    output: VitestTests
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: testing
```
