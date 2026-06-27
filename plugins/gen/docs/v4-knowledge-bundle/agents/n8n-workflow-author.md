---
id: "genorah/n8n-workflow-author"
name: "n8n-workflow-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors n8n automation workflow JSON for lead capture, CRM sync, and notification pipelines"
source: "agents/workers/n8n-workflow-author.md"
tags: [agent, genorah, worker]
---

# n8n-workflow-author

> Authors n8n automation workflow JSON for lead capture, CRM sync, and notification pipelines.

## Preview

# n8n Workflow Author  ## Role  Authors n8n automation workflow JSON for lead capture, CRM sync, and notification pipelines.  ## Input Contract  WorkflowSpec: task envelope received from wave-director

## Frontmatter

```yaml
name: n8n-workflow-author
id: genorah/n8n-workflow-author
version: 4.0.0
channel: stable
tier: worker
description: Authors n8n automation workflow JSON for lead capture, CRM sync, and notification pipelines.
capabilities:
  - id: author-n8n-workflow
    input: WorkflowSpec
    output: N8NWorkflow
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: misc
```
