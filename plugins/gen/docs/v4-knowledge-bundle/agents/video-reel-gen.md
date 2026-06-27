---
id: "genorah/video-reel-gen"
name: "video-reel-gen"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Generates DNA-parameterized video reel assets via Remotion or video gen APIs. Outputs AVIF/MP4/WebM"
source: "agents/workers/video-reel-gen.md"
tags: [agent, genorah, worker]
---

# video-reel-gen

> Generates DNA-parameterized video reel assets via Remotion or video gen APIs. Outputs AVIF/MP4/WebM.

## Preview

# Video Reel Generator  ## Role  Generates DNA-parameterized video reel assets via Remotion or video gen APIs. Outputs AVIF/MP4/WebM.  ## Input Contract  VideoSpec: task envelope received from asset-d

## Frontmatter

```yaml
name: video-reel-gen
id: genorah/video-reel-gen
version: 4.0.0
channel: stable
tier: worker
description: Generates DNA-parameterized video reel assets via Remotion or video gen APIs. Outputs AVIF/MP4/WebM.
capabilities:
  - id: generate-video-reel
    input: VideoSpec
    output: VideoReelAsset
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
