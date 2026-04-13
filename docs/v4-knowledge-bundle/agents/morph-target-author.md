---
id: "genorah/morph-target-author"
name: "morph-target-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Generates morph target animations for character and product 3D models. Validates blend shape count against performance b"
source: "agents/workers/morph-target-author.md"
tags: [agent, genorah, worker]
---

# morph-target-author

> Generates morph target animations for character and product 3D models. Validates blend shape count against performance budget.

## Preview

# Morph Target Author  ## Role  Generates morph target animations for character and product 3D models. Validates blend shape count against performance budget.  ## Input Contract  MeshSpec: task envelo

## Frontmatter

```yaml
name: morph-target-author
id: genorah/morph-target-author
version: 4.0.0
channel: stable
tier: worker
description: Generates morph target animations for character and product 3D models. Validates blend shape count against performance budget.
capabilities:
  - id: author-morph-targets
    input: MeshSpec
    output: MorphTargetGLTF
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
