---
id: "genorah/vr-snapshot-taker"
name: "vr-snapshot-taker"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Captures 4-breakpoint visual regression snapshots via Playwright. Diffs against baseline and flags regressions"
source: "agents/workers/vr-snapshot-taker.md"
tags: [agent, genorah, worker]
---

# vr-snapshot-taker

> Captures 4-breakpoint visual regression snapshots via Playwright. Diffs against baseline and flags regressions.

## Preview

# Visual Regression Snapshot Taker  ## Role  Captures 4-breakpoint visual regression snapshots via Playwright. Diffs against baseline and flags regressions.  ## Input Contract  DeployURL: task envelop

## Frontmatter

```yaml
name: vr-snapshot-taker
id: genorah/vr-snapshot-taker
version: 4.0.0
channel: stable
tier: worker
description: Captures 4-breakpoint visual regression snapshots via Playwright. Diffs against baseline and flags regressions.
capabilities:
  - id: take-vr-snapshots
    input: DeployURL
    output: SnapshotSet
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
