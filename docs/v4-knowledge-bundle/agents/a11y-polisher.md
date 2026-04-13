---
id: "genorah/a11y-polisher"
name: "a11y-polisher"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Applies accessibility polish: ARIA labels, focus management, color contrast corrections, and keyboard navigation"
source: "agents/workers/a11y-polisher.md"
tags: [agent, genorah, worker]
---

# a11y-polisher

> Applies accessibility polish: ARIA labels, focus management, color contrast corrections, and keyboard navigation.

## Preview

# Accessibility Polisher  ## Role  Applies accessibility polish: ARIA labels, focus management, color contrast corrections, and keyboard navigation.  ## Input Contract  SectionArtifact: task envelope

## Frontmatter

```yaml
name: a11y-polisher
id: genorah/a11y-polisher
version: 4.0.0
channel: stable
tier: worker
description: "Applies accessibility polish: ARIA labels, focus management, color contrast corrections, and keyboard navigation."
capabilities:
  - id: polish-a11y
    input: SectionArtifact
    output: A11yPolishedArtifact
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: wave-director
domain: polish
```
