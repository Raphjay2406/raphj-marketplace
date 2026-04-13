---
id: "genorah/hero-camera-choreographer"
name: "hero-camera-choreographer"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors camera keyframe sequences for hero and cinematic sections. Produces Theatre.js or GSAP ScrollTrigger camera path"
source: "agents/workers/hero-camera-choreographer.md"
tags: [agent, genorah, worker]
---

# hero-camera-choreographer

> Authors camera keyframe sequences for hero and cinematic sections. Produces Theatre.js or GSAP ScrollTrigger camera paths tied to DNA motion tokens.

## Preview

# Hero Camera Choreographer  ## Role  Authors camera keyframe sequences for hero and cinematic sections. Produces Theatre.js or GSAP ScrollTrigger camera paths tied to DNA motion tokens.  ## Input Con

## Frontmatter

```yaml
name: hero-camera-choreographer
id: genorah/hero-camera-choreographer
version: 4.0.0
channel: stable
tier: worker
description: Authors camera keyframe sequences for hero and cinematic sections. Produces Theatre.js or GSAP ScrollTrigger camera paths tied to DNA motion tokens.
capabilities:
  - id: choreograph-camera
    input: SceneSpec
    output: CameraTimeline
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: scene-director
domain: 3d
```
