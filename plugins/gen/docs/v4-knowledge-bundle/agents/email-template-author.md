---
id: "genorah/email-template-author"
name: "email-template-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors React Email or MJML transactional email templates with DNA-aligned styling and dark mode support"
source: "agents/workers/email-template-author.md"
tags: [agent, genorah, worker]
---

# email-template-author

> Authors React Email or MJML transactional email templates with DNA-aligned styling and dark mode support.

## Preview

# Email Template Author  ## Role  Authors React Email or MJML transactional email templates with DNA-aligned styling and dark mode support.  ## Input Contract  EmailSpec: task envelope received from w

## Frontmatter

```yaml
name: email-template-author
id: genorah/email-template-author
version: 4.0.0
channel: stable
tier: worker
description: Authors React Email or MJML transactional email templates with DNA-aligned styling and dark mode support.
capabilities:
  - id: author-email-templates
    input: EmailSpec
    output: EmailTemplates
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
