---
id: "genorah/axe-runner"
name: "axe-runner"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Runs axe-core accessibility audit against deployed preview. Reports WCAG 2.1 AA violations with fix guidance"
source: "agents/workers/axe-runner.md"
tags: [agent, genorah, worker]
---

# axe-runner

> Runs axe-core accessibility audit against deployed preview. Reports WCAG 2.1 AA violations with fix guidance.

## Preview

# Axe Runner  ## Role  Runs axe-core accessibility audit against deployed preview. Reports WCAG 2.1 AA violations with fix guidance.  ## Input Contract  DeployURL: task envelope received from quality-

## Frontmatter

```yaml
name: axe-runner
id: genorah/axe-runner
version: 4.0.0
channel: stable
tier: worker
description: Runs axe-core accessibility audit against deployed preview. Reports WCAG 2.1 AA violations with fix guidance.
capabilities:
  - id: run-axe
    input: DeployURL
    output: AxeReport
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: quality-director
domain: observability
```
