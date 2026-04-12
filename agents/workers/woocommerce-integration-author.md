---
name: woocommerce-integration-author
id: genorah/woocommerce-integration-author
version: 4.0.0
channel: stable
tier: worker
description: undefined
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
---

# WooCommerce Integration Author

## Role

Scaffolds WooCommerce REST API integration: product grids, cart management, order flows, and DNA-themed checkout.

## Input Contract

IntegrationSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: WooCommerce integration files with REST API client, cart hooks, and checkout components
- `verdicts`: validation results from woocommerce-integration, ecommerce-ui
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: woocommerce-integration, ecommerce-ui
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
