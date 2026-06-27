---
id: "genorah/hubspot-integration-author"
name: "hubspot-integration-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Scaffolds HubSpot CRM integration: forms, contact sync, marketing automation hooks, and CMS API"
source: "agents/workers/hubspot-integration-author.md"
tags: [agent, genorah, worker]
---

# hubspot-integration-author

> Scaffolds HubSpot CRM integration: forms, contact sync, marketing automation hooks, and CMS API.

## Preview

# HubSpot Integration Author  ## Role  Scaffolds HubSpot CRM integration: forms, contact sync, marketing automation hooks, and CMS API.  ## Input Contract  IntegrationSpec: task envelope received from

## Frontmatter

```yaml
name: hubspot-integration-author
id: genorah/hubspot-integration-author
version: 4.0.0
channel: stable
tier: worker
description: "Scaffolds HubSpot CRM integration: forms, contact sync, marketing automation hooks, and CMS API."
capabilities:
  - id: author-hubspot-integration
    input: IntegrationSpec
    output: HubSpotIntegration
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
