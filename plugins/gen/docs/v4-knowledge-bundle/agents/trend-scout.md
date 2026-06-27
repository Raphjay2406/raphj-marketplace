---
id: "genorah/trend-scout"
name: "trend-scout"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Identifies emerging design and UX trends relevant to the project vertical. Flags trends conflicting with archetype"
source: "agents/workers/trend-scout.md"
tags: [agent, genorah, worker]
---

# trend-scout

> Identifies emerging design and UX trends relevant to the project vertical. Flags trends conflicting with archetype.

## Preview

# Trend Scout  ## Role  Identifies emerging design and UX trends relevant to the project vertical. Flags trends conflicting with archetype.  ## Input Contract  TrendSpec: task envelope received from r

## Frontmatter

```yaml
name: trend-scout
id: genorah/trend-scout
version: 4.0.0
channel: stable
tier: worker
description: Identifies emerging design and UX trends relevant to the project vertical. Flags trends conflicting with archetype.
capabilities:
  - id: scout-trends
    input: TrendSpec
    output: TrendReport
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
