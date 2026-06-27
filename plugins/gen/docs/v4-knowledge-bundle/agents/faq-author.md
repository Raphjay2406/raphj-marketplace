---
id: "genorah/faq-author"
name: "faq-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors FAQ content with structured data markup. Targets featured snippet eligibility and GEO citation patterns"
source: "agents/workers/faq-author.md"
tags: [agent, genorah, worker]
---

# faq-author

> Authors FAQ content with structured data markup. Targets featured snippet eligibility and GEO citation patterns.

## Preview

# FAQ Author  ## Role  Authors FAQ content with structured data markup. Targets featured snippet eligibility and GEO citation patterns.  ## Input Contract  FAQSpec: task envelope received from creativ

## Frontmatter

```yaml
name: faq-author
id: genorah/faq-author
version: 4.0.0
channel: stable
tier: worker
description: Authors FAQ content with structured data markup. Targets featured snippet eligibility and GEO citation patterns.
capabilities:
  - id: author-faq
    input: FAQSpec
    output: FAQContent
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: creative-director
domain: content
```
