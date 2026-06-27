---
id: "genorah/sotd-scout"
name: "sotd-scout"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Scouts recent Awwwards SOTD winners in the target vertical. Extracts design patterns, score benchmarks, and differentiat"
source: "agents/workers/sotd-scout.md"
tags: [agent, genorah, worker]
---

# sotd-scout

> Scouts recent Awwwards SOTD winners in the target vertical. Extracts design patterns, score benchmarks, and differentiators.

## Preview

# SOTD Scout  ## Role  Scouts recent Awwwards SOTD winners in the target vertical. Extracts design patterns, score benchmarks, and differentiators.  ## Input Contract  ResearchSpec: task envelope rece

## Frontmatter

```yaml
name: sotd-scout
id: genorah/sotd-scout
version: 4.0.0
channel: stable
tier: worker
description: Scouts recent Awwwards SOTD winners in the target vertical. Extracts design patterns, score benchmarks, and differentiators.
capabilities:
  - id: scout-sotd
    input: ResearchSpec
    output: SOTDReport
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: research-director
domain: research
```
