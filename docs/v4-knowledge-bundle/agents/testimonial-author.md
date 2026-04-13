---
id: "genorah/testimonial-author"
name: "testimonial-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors realistic testimonial copy with persona diversity and conversion-optimized framing. Flags synthetic content for "
source: "agents/workers/testimonial-author.md"
tags: [agent, genorah, worker]
---

# testimonial-author

> Authors realistic testimonial copy with persona diversity and conversion-optimized framing. Flags synthetic content for disclosure.

## Preview

# Testimonial Author  ## Role  Authors realistic testimonial copy with persona diversity and conversion-optimized framing. Flags synthetic content for disclosure.  ## Input Contract  TestimonialSpec:

## Frontmatter

```yaml
name: testimonial-author
id: genorah/testimonial-author
version: 4.0.0
channel: stable
tier: worker
description: Authors realistic testimonial copy with persona diversity and conversion-optimized framing. Flags synthetic content for disclosure.
capabilities:
  - id: author-testimonials
    input: TestimonialSpec
    output: TestimonialSet
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
