---
id: "genorah/character-poser"
name: "character-poser"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Applies poses and expressions to character models. Validates against brand character consistency guidelines"
source: "agents/workers/character-poser.md"
tags: [agent, genorah, worker]
---

# character-poser

> Applies poses and expressions to character models. Validates against brand character consistency guidelines.

## Preview

# Character Poser  ## Role  Applies poses and expressions to character models. Validates against brand character consistency guidelines.  ## Input Contract  PoseSpec: task envelope received from asset

## Frontmatter

```yaml
name: character-poser
id: genorah/character-poser
version: 4.0.0
channel: stable
tier: worker
description: Applies poses and expressions to character models. Validates against brand character consistency guidelines.
capabilities:
  - id: pose-character
    input: PoseSpec
    output: PosedCharacter
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
