---
id: "genorah/propstack-integration-author"
name: "propstack-integration-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Scaffolds Propstack real estate CRM integration: property listings, search, and lead capture forms"
source: "agents/workers/propstack-integration-author.md"
tags: [agent, genorah, worker]
---

# propstack-integration-author

> Scaffolds Propstack real estate CRM integration: property listings, search, and lead capture forms.

## Preview

# Propstack Integration Author  ## Role  Scaffolds Propstack real estate CRM integration: property listings, search, and lead capture forms.  ## Input Contract  IntegrationSpec: task envelope received

## Frontmatter

```yaml
name: propstack-integration-author
id: genorah/propstack-integration-author
version: 4.0.0
channel: stable
tier: worker
description: "Scaffolds Propstack real estate CRM integration: property listings, search, and lead capture forms."
capabilities:
  - id: author-propstack-integration
    input: IntegrationSpec
    output: PropstackIntegration
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
