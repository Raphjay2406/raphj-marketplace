---
id: "genorah/narrative-director"
name: "narrative-director"
tier: "director"
version: "4.0.0"
channel: "stable"
capabilities: "Cross-section story arc coherence, emotional beat sequencing, and arc validity enforcement"
source: "agents/directors/narrative-director.md"
tags: [agent, genorah, director]
---

# narrative-director

> Cross-section story arc coherence, emotional beat sequencing, and arc validity enforcement

## Preview

# Narrative Director  ## Role  Enforces the 10-beat emotional arc across the full page. Detects invalid sequences, flags flat story arcs, and coordinates with creative-director to inject breathe or te

## Frontmatter

```yaml
name: narrative-director
id: genorah/narrative-director
version: 4.0.0
channel: stable
tier: director
description: Cross-section story arc coherence, emotional beat sequencing, and arc validity enforcement
capabilities:
  - id: validate-arc
    input: SectionSequence
    output: ArcValidationReport
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
