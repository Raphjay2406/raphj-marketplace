---
id: "genorah/lottie-author"
name: "lottie-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Lottie animation JSON for micro-animations and brand motion sigils. Validates file size and frame rate targets"
source: "agents/workers/lottie-author.md"
tags: [agent, genorah, worker]
---

# lottie-author

> Authors Lottie animation JSON for micro-animations and brand motion sigils. Validates file size and frame rate targets.

## Preview

# Lottie Author  ## Role  Authors Lottie animation JSON for micro-animations and brand motion sigils. Validates file size and frame rate targets.  ## Input Contract  LottieSpec: task envelope received

## Frontmatter

```yaml
name: lottie-author
id: genorah/lottie-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Lottie animation JSON for micro-animations and brand motion sigils. Validates file size and frame rate targets.
capabilities:
  - id: author-lottie
    input: LottieSpec
    output: LottieAnimation
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: wave-director
domain: motion
```
