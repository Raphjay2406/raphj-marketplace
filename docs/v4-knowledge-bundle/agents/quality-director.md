---
id: "genorah/quality-director"
name: "quality-director"
tier: "director"
version: "4.0.0"
channel: "stable"
capabilities: "394-point quality gate verdicts, hard gate enforcement, and Playwright visual QA coordination"
source: "agents/directors/quality-director.md"
tags: [agent, genorah, director]
---

# quality-director

> 394-point quality gate verdicts, hard gate enforcement, and Playwright visual QA coordination

## Preview

# Quality Director  ## Role  Runs the full 394-point quality gate (Design Craft 234 + UX Integrity 120 + Ingestion Fidelity 40). Enforces 5 hard gates, coordinates Playwright visual QA, and emits scor

## Frontmatter

```yaml
name: quality-director
id: genorah/quality-director
version: 4.0.0
channel: stable
tier: director
description: 394-point quality gate verdicts, hard gate enforcement, and Playwright visual QA coordination
capabilities:
  - id: run-quality-gate
    input: SectionArtifact
    output: QualityVerdict
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
context_budget: 120000
state: persistent
```
