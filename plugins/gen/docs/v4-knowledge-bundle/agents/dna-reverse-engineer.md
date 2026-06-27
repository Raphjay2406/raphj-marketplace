---
id: "genorah/dna-reverse-engineer"
name: "dna-reverse-engineer"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Extracts Design DNA from captured CSS variables and computed styles. Runs pixel-kmeans with ΔE2000 perceptual distance"
source: "agents/workers/dna-reverse-engineer.md"
tags: [agent, genorah, worker]
---

# dna-reverse-engineer

> Extracts Design DNA from captured CSS variables and computed styles. Runs pixel-kmeans with ΔE2000 perceptual distance.

## Preview

# DNA Reverse Engineer  ## Role  Extracts Design DNA from captured CSS variables and computed styles. Runs pixel-kmeans with ΔE2000 perceptual distance.  ## Input Contract  CrawlManifest: task envelop

## Frontmatter

```yaml
name: dna-reverse-engineer
id: genorah/dna-reverse-engineer
version: 4.0.0
channel: stable
tier: worker
description: Extracts Design DNA from captured CSS variables and computed styles. Runs pixel-kmeans with ΔE2000 perceptual distance.
capabilities:
  - id: reverse-engineer-dna
    input: CrawlManifest
    output: ExtractedDNA
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
