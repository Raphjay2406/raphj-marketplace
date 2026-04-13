---
id: "genorah/woocommerce-integration-author"
name: "woocommerce-integration-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Scaffolds WooCommerce REST API integration: product grids, cart management, order flows, and DNA-themed checkout"
source: "agents/workers/woocommerce-integration-author.md"
tags: [agent, genorah, worker]
---

# woocommerce-integration-author

> Scaffolds WooCommerce REST API integration: product grids, cart management, order flows, and DNA-themed checkout.

## Preview

# WooCommerce Integration Author  ## Role  Scaffolds WooCommerce REST API integration: product grids, cart management, order flows, and DNA-themed checkout.  ## Input Contract  IntegrationSpec: task e

## Frontmatter

```yaml
name: woocommerce-integration-author
id: genorah/woocommerce-integration-author
version: 4.0.0
channel: stable
tier: worker
description: "Scaffolds WooCommerce REST API integration: product grids, cart management, order flows, and DNA-themed checkout."
capabilities:
  - id: author-woocommerce-integration
    input: IntegrationSpec
    output: WooCommerceIntegration
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
