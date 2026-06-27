---
id: "genorah/lighthouse-runner"
name: "lighthouse-runner"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Runs Lighthouse CI against preview deployments. Enforces perf budget thresholds and flags CWV regressions"
source: "agents/workers/lighthouse-runner.md"
tags: [agent, genorah, worker]
---

# lighthouse-runner

> Runs Lighthouse CI against preview deployments. Enforces perf budget thresholds and flags CWV regressions.

## Preview

# Lighthouse Runner  ## Role  Runs Lighthouse CI against preview deployments. Enforces perf budget thresholds and flags CWV regressions.  ## Input Contract  DeployURL: task envelope received from qual

## Frontmatter

```yaml
name: lighthouse-runner
id: genorah/lighthouse-runner
version: 4.0.0
channel: stable
tier: worker
description: Runs Lighthouse CI against preview deployments. Enforces perf budget thresholds and flags CWV regressions.
capabilities:
  - id: run-lighthouse
    input: DeployURL
    output: LighthouseReport
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
