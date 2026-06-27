---
id: "genorah/cms-schema-introspector"
name: "cms-schema-introspector"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Introspects CMS schemas via GROQ (Sanity), CMA (Contentful), or OpenAPI (Payload). Maps content types to DNA sections"
source: "agents/workers/cms-schema-introspector.md"
tags: [agent, genorah, worker]
---

# cms-schema-introspector

> Introspects CMS schemas via GROQ (Sanity), CMA (Contentful), or OpenAPI (Payload). Maps content types to DNA sections.

## Preview

# CMS Schema Introspector  ## Role  Introspects CMS schemas via GROQ (Sanity), CMA (Contentful), or OpenAPI (Payload). Maps content types to DNA sections.  ## Input Contract  CMSConnectionSpec: task e

## Frontmatter

```yaml
name: cms-schema-introspector
id: genorah/cms-schema-introspector
version: 4.0.0
channel: stable
tier: worker
description: Introspects CMS schemas via GROQ (Sanity), CMA (Contentful), or OpenAPI (Payload). Maps content types to DNA sections.
capabilities:
  - id: introspect-cms-schema
    input: CMSConnectionSpec
    output: CMSSchemaReport
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: research-director
domain: ingestion
```
