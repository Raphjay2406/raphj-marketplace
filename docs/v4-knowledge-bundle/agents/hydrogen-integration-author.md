---
id: "genorah/hydrogen-integration-author"
name: "hydrogen-integration-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Scaffolds Shopify Hydrogen storefront with Oxygen deployment config, Remix routes, and DNA-bound storefront components"
source: "agents/workers/hydrogen-integration-author.md"
tags: [agent, genorah, worker]
---

# hydrogen-integration-author

> Scaffolds Shopify Hydrogen storefront with Oxygen deployment config, Remix routes, and DNA-bound storefront components.

## Preview

# Hydrogen Integration Author  ## Role  Scaffolds Shopify Hydrogen storefront with Oxygen deployment config, Remix routes, and DNA-bound storefront components.  ## Input Contract  IntegrationSpec: tas

## Frontmatter

```yaml
name: hydrogen-integration-author
id: genorah/hydrogen-integration-author
version: 4.0.0
channel: stable
tier: worker
description: Scaffolds Shopify Hydrogen storefront with Oxygen deployment config, Remix routes, and DNA-bound storefront components.
capabilities:
  - id: author-hydrogen-integration
    input: IntegrationSpec
    output: HydrogenIntegration
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
