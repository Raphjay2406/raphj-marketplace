---
id: "genorah/flux-hero-gen"
name: "flux-hero-gen"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Generates hero background images using Flux API with DNA-matched color palettes and beat-type visual language"
source: "agents/workers/flux-hero-gen.md"
tags: [agent, genorah, worker]
---

# flux-hero-gen

> Generates hero background images using Flux API with DNA-matched color palettes and beat-type visual language.

## Preview

# Flux Hero Generator  ## Role  Generates hero background images using Flux API with DNA-matched color palettes and beat-type visual language.  ## Input Contract  HeroAssetSpec: task envelope received

## Frontmatter

```yaml
name: flux-hero-gen
id: genorah/flux-hero-gen
version: 4.0.0
channel: stable
tier: worker
description: Generates hero background images using Flux API with DNA-matched color palettes and beat-type visual language.
capabilities:
  - id: generate-flux-hero
    input: HeroAssetSpec
    output: HeroImageAsset
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: asset-director
domain: asset
```
