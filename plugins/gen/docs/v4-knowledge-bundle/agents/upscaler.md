---
id: "genorah/upscaler"
name: "upscaler"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Upscales raster assets to target resolution using AI super-resolution. Validates output sharpness and artifact levels"
source: "agents/workers/upscaler.md"
tags: [agent, genorah, worker]
---

# upscaler

> Upscales raster assets to target resolution using AI super-resolution. Validates output sharpness and artifact levels.

## Preview

# Upscaler  ## Role  Upscales raster assets to target resolution using AI super-resolution. Validates output sharpness and artifact levels.  ## Input Contract  LowResAsset: task envelope received from

## Frontmatter

```yaml
name: upscaler
id: genorah/upscaler
version: 4.0.0
channel: stable
tier: worker
description: Upscales raster assets to target resolution using AI super-resolution. Validates output sharpness and artifact levels.
capabilities:
  - id: upscale-asset
    input: LowResAsset
    output: UpscaledAsset
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
