---
id: "genorah/bundle-analyzer"
name: "bundle-analyzer"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Analyzes production bundle composition. Flags oversized chunks, duplicate dependencies, and tree-shaking failures"
source: "agents/workers/bundle-analyzer.md"
tags: [agent, genorah, worker]
---

# bundle-analyzer

> Analyzes production bundle composition. Flags oversized chunks, duplicate dependencies, and tree-shaking failures.

## Preview

# Bundle Analyzer  ## Role  Analyzes production bundle composition. Flags oversized chunks, duplicate dependencies, and tree-shaking failures.  ## Input Contract  BuildArtifact: task envelope received

## Frontmatter

```yaml
name: bundle-analyzer
id: genorah/bundle-analyzer
version: 4.0.0
channel: stable
tier: worker
description: Analyzes production bundle composition. Flags oversized chunks, duplicate dependencies, and tree-shaking failures.
capabilities:
  - id: analyze-bundle
    input: BuildArtifact
    output: BundleReport
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
