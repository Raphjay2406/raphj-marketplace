---
id: "genorah/asset-director"
name: "asset-director"
tier: "director"
version: "4.0.0"
channel: "stable"
capabilities: "Composite asset pipeline coordination, cost governance, and provenance tracking"
source: "agents/directors/asset-director.md"
tags: [agent, genorah, director]
---

# asset-director

> Composite asset pipeline coordination, cost governance, and provenance tracking

## Preview

# Asset Director  ## Role  Owns composite asset generation pipeline — recipes, cost ledger, provenance, downgrade chain.  ## State Ownership  Holds `CostLedger` initialized from `DESIGN-DNA.md:asset_b

## Frontmatter

```yaml
name: asset-director
id: genorah/asset-director
version: 4.0.0
channel: stable
tier: director
description: Composite asset pipeline coordination, cost governance, and provenance tracking
capabilities:
  - id: direct-assets
    input: AssetRequest
    output: AssetManifest
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
