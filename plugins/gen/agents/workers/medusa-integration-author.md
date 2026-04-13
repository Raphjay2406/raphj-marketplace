---
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
---

# Medusa Integration Author

## Role

Scaffolds Medusa v2 headless commerce integration with product catalog, cart, and checkout flows.

## Input Contract

IntegrationSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Medusa integration files with JS SDK client, product hooks, and cart management
- `verdicts`: validation results from commerce-medusa, ecommerce-ui
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: commerce-medusa, ecommerce-ui
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
