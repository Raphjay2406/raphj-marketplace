---
id: "genorah/shopify-integration-author"
name: "shopify-integration-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Scaffolds Shopify Storefront API integration: product listings, cart, checkout, and DNA-themed product display"
source: "agents/workers/shopify-integration-author.md"
tags: [agent, genorah, worker]
---

# shopify-integration-author

> Scaffolds Shopify Storefront API integration: product listings, cart, checkout, and DNA-themed product display.

## Preview

# Shopify Integration Author  ## Role  Scaffolds Shopify Storefront API integration: product listings, cart, checkout, and DNA-themed product display.  ## Input Contract  IntegrationSpec: task envelop

## Frontmatter

```yaml
name: shopify-integration-author
id: genorah/shopify-integration-author
version: 4.0.0
channel: stable
tier: worker
description: "Scaffolds Shopify Storefront API integration: product listings, cart, checkout, and DNA-themed product display."
capabilities:
  - id: author-shopify-integration
    input: IntegrationSpec
    output: ShopifyIntegration
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
