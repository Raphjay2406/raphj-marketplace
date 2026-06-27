---
id: "genorah/ci-pipeline-author"
name: "ci-pipeline-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors GitHub Actions or CI pipeline with Lighthouse CI, Playwright preview smoke, and quality gate checks"
source: "agents/workers/ci-pipeline-author.md"
tags: [agent, genorah, worker]
---

# ci-pipeline-author

> Authors GitHub Actions or CI pipeline with Lighthouse CI, Playwright preview smoke, and quality gate checks.

## Preview

# CI Pipeline Author  ## Role  Authors GitHub Actions or CI pipeline with Lighthouse CI, Playwright preview smoke, and quality gate checks.  ## Input Contract  CISpec: task envelope received from wave

## Frontmatter

```yaml
name: ci-pipeline-author
id: genorah/ci-pipeline-author
version: 4.0.0
channel: stable
tier: worker
description: Authors GitHub Actions or CI pipeline with Lighthouse CI, Playwright preview smoke, and quality gate checks.
capabilities:
  - id: author-ci-pipeline
    input: CISpec
    output: CIPipeline
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
