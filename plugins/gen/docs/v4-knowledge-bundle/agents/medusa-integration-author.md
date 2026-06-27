---
id: "genorah/medusa-integration-author"
name: "medusa-integration-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Scaffolds Medusa v2 headless commerce integration with product catalog, cart, and checkout flows"
source: "agents/workers/medusa-integration-author.md"
tags: [agent, genorah, worker]
---

# medusa-integration-author

> Scaffolds Medusa v2 headless commerce integration with product catalog, cart, and checkout flows.

## Preview

# Medusa Integration Author  ## Role  Scaffolds Medusa v2 headless commerce integration with product catalog, cart, and checkout flows.  ## Input Contract  IntegrationSpec: task envelope received from

## Frontmatter

```yaml
name: medusa-integration-author
id: genorah/medusa-integration-author
version: 4.0.0
channel: stable
tier: worker
description: Scaffolds Medusa v2 headless commerce integration with product catalog, cart, and checkout flows.
capabilities:
  - id: author-medusa-integration
    input: IntegrationSpec
    output: MedusaIntegration
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: integration
```
