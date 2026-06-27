---
id: "genorah/expo-author"
name: "expo-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds Expo managed workflow apps with EAS Build config, Expo Router, OTA updates, and config plugin setup"
source: "agents/workers/expo-author.md"
tags: [agent, genorah, worker]
---

# expo-author

> Builds Expo managed workflow apps with EAS Build config, Expo Router, OTA updates, and config plugin setup.

## Preview

# Expo Author  ## Role  Builds Expo managed workflow apps with EAS Build config, Expo Router, OTA updates, and config plugin setup.  ## Input Contract  MobileSpec: task envelope received from mobile-d

## Frontmatter

```yaml
name: expo-author
id: genorah/expo-author
version: 4.0.0
channel: stable
tier: worker
description: Builds Expo managed workflow apps with EAS Build config, Expo Router, OTA updates, and config plugin setup.
capabilities:
  - id: author-expo
    input: MobileSpec
    output: ExpoArtifact
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
