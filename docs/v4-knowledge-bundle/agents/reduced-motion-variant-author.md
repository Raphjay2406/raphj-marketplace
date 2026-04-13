---
id: "genorah/reduced-motion-variant-author"
name: "reduced-motion-variant-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Generates prefers-reduced-motion CSS/JS variants for every animated section. Ensures WCAG 2.1 compliance without sacrifi"
source: "agents/workers/reduced-motion-variant-author.md"
tags: [agent, genorah, worker]
---

# reduced-motion-variant-author

> Generates prefers-reduced-motion CSS/JS variants for every animated section. Ensures WCAG 2.1 compliance without sacrificing design intent.

## Preview

# Reduced Motion Variant Author  ## Role  Generates prefers-reduced-motion CSS/JS variants for every animated section. Ensures WCAG 2.1 compliance without sacrificing design intent.  ## Input Contract

## Frontmatter

```yaml
name: reduced-motion-variant-author
id: genorah/reduced-motion-variant-author
version: 4.0.0
channel: stable
tier: worker
description: Generates prefers-reduced-motion CSS/JS variants for every animated section. Ensures WCAG 2.1 compliance without sacrificing design intent.
capabilities:
  - id: author-reduced-motion
    input: MotionArtifact
    output: ReducedMotionVariant
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: wave-director
domain: motion
```
