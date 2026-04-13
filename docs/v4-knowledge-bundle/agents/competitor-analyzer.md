---
id: "genorah/competitor-analyzer"
name: "competitor-analyzer"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Analyzes competitor sites for design quality, UX patterns, conversion strategies, and differentiation opportunities"
source: "agents/workers/competitor-analyzer.md"
tags: [agent, genorah, worker]
---

# competitor-analyzer

> Analyzes competitor sites for design quality, UX patterns, conversion strategies, and differentiation opportunities.

## Preview

# Competitor Analyzer  ## Role  Analyzes competitor sites for design quality, UX patterns, conversion strategies, and differentiation opportunities.  ## Input Contract  CompetitorList: task envelope r

## Frontmatter

```yaml
name: competitor-analyzer
id: genorah/competitor-analyzer
version: 4.0.0
channel: stable
tier: worker
description: Analyzes competitor sites for design quality, UX patterns, conversion strategies, and differentiation opportunities.
capabilities:
  - id: analyze-competitors
    input: CompetitorList
    output: CompetitorReport
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
