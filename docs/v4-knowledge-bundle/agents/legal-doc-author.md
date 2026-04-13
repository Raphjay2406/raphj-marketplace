---
id: "genorah/legal-doc-author"
name: "legal-doc-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors privacy policy, terms of service, and cookie consent documents with jurisdiction-specific clauses"
source: "agents/workers/legal-doc-author.md"
tags: [agent, genorah, worker]
---

# legal-doc-author

> Authors privacy policy, terms of service, and cookie consent documents with jurisdiction-specific clauses.

## Preview

# Legal Doc Author  ## Role  Authors privacy policy, terms of service, and cookie consent documents with jurisdiction-specific clauses.  ## Input Contract  LegalSpec: task envelope received from wave-

## Frontmatter

```yaml
name: legal-doc-author
id: genorah/legal-doc-author
version: 4.0.0
channel: stable
tier: worker
description: Authors privacy policy, terms of service, and cookie consent documents with jurisdiction-specific clauses.
capabilities:
  - id: author-legal-docs
    input: LegalSpec
    output: LegalDocs
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
