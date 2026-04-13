---
id: "genorah/playwright-test-author"
name: "playwright-test-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Playwright E2E tests for critical user journeys, visual regression baselines, and accessibility checks"
source: "agents/workers/playwright-test-author.md"
tags: [agent, genorah, worker]
---

# playwright-test-author

> Authors Playwright E2E tests for critical user journeys, visual regression baselines, and accessibility checks.

## Preview

# Playwright Test Author  ## Role  Authors Playwright E2E tests for critical user journeys, visual regression baselines, and accessibility checks.  ## Input Contract  TestSpec: task envelope received

## Frontmatter

```yaml
name: playwright-test-author
id: genorah/playwright-test-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Playwright E2E tests for critical user journeys, visual regression baselines, and accessibility checks.
capabilities:
  - id: author-playwright-tests
    input: TestSpec
    output: PlaywrightTests
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
