---
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
---

# Morph Target Author

## Role

Generates morph target animations for character and product 3D models. Validates blend shape count against performance budget.

## Input Contract

MeshSpec: task envelope received from scene-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: GLTF file with embedded morph targets and animation clips
- `verdicts`: validation results from gltf-optimization, perf-budgets
- `followups`: []

## Protocol

1. Read SCENE-CHOREOGRAPHY.json + DESIGN-DNA.md (archetype preset).
2. For each cinematic mesh in the scene manifest, derive blend shape targets from archetype emotion palette (e.g. Kinetic → high-energy deformations, Japanese Minimal → subtle drift).
3. Validate blend shape count against perf budget: max 8 active targets per mesh at runtime.
4. Emit GLTF morph target data with animation clips keyed to SCENE-CHOREOGRAPHY bookmarks.
5. Self-check via `cinematic-motion` and `persistent-canvas-pattern` validators (score threshold 0.8).
6. Return Result envelope with MorphTargetGLTF artifact.

## Skills Invoked

- `cinematic-motion` — blend shape timing and easing curves
- `persistent-canvas-pattern` — validates morph targets integrate with single-canvas model
- `theatre-choreography` — bookmark alignment for morph clip keyframes

## Followups

If self-check score < 0.8, emit followup `{ suggested_worker: "hero-camera-choreographer", reason: "re-sync bookmark timing after morph adjustment" }`.
