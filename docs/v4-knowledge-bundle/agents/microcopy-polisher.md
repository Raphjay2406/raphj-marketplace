---
id: "genorah/microcopy-polisher"
name: "microcopy-polisher"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Final microcopy review and polish: tightens CTAs, removes filler words, enforces anti-slop gate, checks brand voice"
source: "agents/workers/microcopy-polisher.md"
tags: [agent, genorah, worker]
---

# microcopy-polisher

> Final microcopy review and polish: tightens CTAs, removes filler words, enforces anti-slop gate, checks brand voice.

## Preview

# Microcopy Polisher  ## Role  Final microcopy review and polish: tightens CTAs, removes filler words, enforces anti-slop gate, checks brand voice.  ## Input Contract  SectionArtifact: task envelope r

## Frontmatter

```yaml
name: microcopy-polisher
id: genorah/microcopy-polisher
version: 4.0.0
channel: stable
tier: worker
description: "Final microcopy review and polish: tightens CTAs, removes filler words, enforces anti-slop gate, checks brand voice."
capabilities:
  - id: polish-microcopy
    input: SectionArtifact
    output: PolishedCopy
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: creative-director
domain: polish
```
