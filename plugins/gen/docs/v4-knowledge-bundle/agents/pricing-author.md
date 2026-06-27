---
id: "genorah/pricing-author"
name: "pricing-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors pricing tier copy, feature bullets, and CTA text optimized for conversion. Applies cognitive load gate"
source: "agents/workers/pricing-author.md"
tags: [agent, genorah, worker]
---

# pricing-author

> Authors pricing tier copy, feature bullets, and CTA text optimized for conversion. Applies cognitive load gate.

## Preview

# Pricing Author  ## Role  Authors pricing tier copy, feature bullets, and CTA text optimized for conversion. Applies cognitive load gate.  ## Input Contract  PricingSpec: task envelope received from

## Frontmatter

```yaml
name: pricing-author
id: genorah/pricing-author
version: 4.0.0
channel: stable
tier: worker
description: Authors pricing tier copy, feature bullets, and CTA text optimized for conversion. Applies cognitive load gate.
capabilities:
  - id: author-pricing
    input: PricingSpec
    output: PricingContent
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
