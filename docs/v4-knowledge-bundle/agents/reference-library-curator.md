---
id: "genorah/reference-library-curator"
name: "reference-library-curator"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Curates and indexes reference sites and assets into the project reference library. Manages semantic search index"
source: "agents/workers/reference-library-curator.md"
tags: [agent, genorah, worker]
---

# reference-library-curator

> Curates and indexes reference sites and assets into the project reference library. Manages semantic search index.

## Preview

# Reference Library Curator  ## Role  Curates and indexes reference sites and assets into the project reference library. Manages semantic search index.  ## Input Contract  ResearchReport: task envelop

## Frontmatter

```yaml
name: reference-library-curator
id: genorah/reference-library-curator
version: 4.0.0
channel: stable
tier: worker
description: Curates and indexes reference sites and assets into the project reference library. Manages semantic search index.
capabilities:
  - id: curate-references
    input: ResearchReport
    output: ReferenceLibrary
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: research-director
domain: research
```
