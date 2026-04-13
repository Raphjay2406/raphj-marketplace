---
id: "genorah/stripe-integration-author"
name: "stripe-integration-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Scaffolds Stripe payment integration: checkout session, subscription management, webhook handling, and payment element t"
source: "agents/workers/stripe-integration-author.md"
tags: [agent, genorah, worker]
---

# stripe-integration-author

> Scaffolds Stripe payment integration: checkout session, subscription management, webhook handling, and payment element theming.

## Preview

# Stripe Integration Author  ## Role  Scaffolds Stripe payment integration: checkout session, subscription management, webhook handling, and payment element theming.  ## Input Contract  IntegrationSpe

## Frontmatter

```yaml
name: stripe-integration-author
id: genorah/stripe-integration-author
version: 4.0.0
channel: stable
tier: worker
description: "Scaffolds Stripe payment integration: checkout session, subscription management, webhook handling, and payment element theming."
capabilities:
  - id: author-stripe-integration
    input: IntegrationSpec
    output: StripeIntegration
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
