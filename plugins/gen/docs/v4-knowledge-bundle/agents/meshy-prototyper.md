---
id: "genorah/meshy-prototyper"
name: "meshy-prototyper"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Rapid 3D prototype generation via Meshy API. Produces low-fidelity models for layout and proportion validation"
source: "agents/workers/meshy-prototyper.md"
tags: [agent, genorah, worker]
---

# meshy-prototyper

> Rapid 3D prototype generation via Meshy API. Produces low-fidelity models for layout and proportion validation.

## Preview

# Meshy Prototyper  ## Role  Rapid 3D prototype generation via Meshy API. Produces low-fidelity models for layout and proportion validation.  ## Input Contract  MeshySpec: task envelope received from

## Frontmatter

```yaml
name: meshy-prototyper
id: genorah/meshy-prototyper
version: 4.0.0
channel: stable
tier: worker
description: Rapid 3D prototype generation via Meshy API. Produces low-fidelity models for layout and proportion validation.
capabilities:
  - id: prototype-meshy
    input: MeshySpec
    output: MeshyModel
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
