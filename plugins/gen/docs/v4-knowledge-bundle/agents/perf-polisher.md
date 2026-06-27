---
id: "genorah/perf-polisher"
name: "perf-polisher"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Applies performance polish: image optimization, lazy loading, bundle splitting, and CWV budget validation"
source: "agents/workers/perf-polisher.md"
tags: [agent, genorah, worker]
---

# perf-polisher

> Applies performance polish: image optimization, lazy loading, bundle splitting, and CWV budget validation.

## Preview

# Performance Polisher  ## Role  Applies performance polish: image optimization, lazy loading, bundle splitting, and CWV budget validation.  ## Input Contract  SectionArtifact: task envelope received

## Frontmatter

```yaml
name: perf-polisher
id: genorah/perf-polisher
version: 4.0.0
channel: stable
tier: worker
description: "Applies performance polish: image optimization, lazy loading, bundle splitting, and CWV budget validation."
capabilities:
  - id: polish-performance
    input: SectionArtifact
    output: PerfPolishedArtifact
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: wave-director
domain: polish
```
