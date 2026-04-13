---
id: "genorah/conversion-critic"
name: "conversion-critic"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Evaluates conversion readiness: CTA clarity, social proof placement, friction reduction, and conversion gate compliance"
source: "agents/workers/conversion-critic.md"
tags: [agent, genorah, worker]
---

# conversion-critic

> Evaluates conversion readiness: CTA clarity, social proof placement, friction reduction, and conversion gate compliance.

## Preview

# Conversion Critic  ## Role  Evaluates conversion readiness: CTA clarity, social proof placement, friction reduction, and conversion gate compliance.  ## Input Contract  SectionArtifact: task envelop

## Frontmatter

```yaml
name: conversion-critic
id: genorah/conversion-critic
version: 4.0.0
channel: stable
tier: worker
description: "Evaluates conversion readiness: CTA clarity, social proof placement, friction reduction, and conversion gate compliance."
capabilities:
  - id: critique-conversion
    input: SectionArtifact
    output: ConversionCritique
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: quality-director
domain: critics
```
