---
id: "genorah/rn-author"
name: "rn-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds React Native bare workflow components with NativeWind DNA bridge, React Navigation v7, and Reanimated 3"
source: "agents/workers/rn-author.md"
tags: [agent, genorah, worker]
---

# rn-author

> Builds React Native bare workflow components with NativeWind DNA bridge, React Navigation v7, and Reanimated 3.

## Preview

# React Native Author  ## Role  Builds React Native bare workflow components with NativeWind DNA bridge, React Navigation v7, and Reanimated 3.  ## Input Contract  MobileSpec: task envelope received f

## Frontmatter

```yaml
name: rn-author
id: genorah/rn-author
version: 4.0.0
channel: stable
tier: worker
description: Builds React Native bare workflow components with NativeWind DNA bridge, React Navigation v7, and Reanimated 3.
capabilities:
  - id: author-react-native
    input: MobileSpec
    output: RNArtifact
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: mobile-director
domain: mobile
```
