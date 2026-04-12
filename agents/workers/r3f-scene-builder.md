---
name: r3f-scene-builder
id: genorah/r3f-scene-builder
version: 4.0.0
channel: stable
tier: worker
description: Builds React Three Fiber scene components with Rapier physics, DNA-bound materials, and postprocessing pipeline.
capabilities:
  - id: build-r3f-scene
    input: SceneSpec
    output: R3FComponent
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: scene-director
domain: 3d
---

# R3F Scene Builder

## Role

Builds React Three Fiber scene components with Rapier physics, DNA-bound materials, and postprocessing pipeline.

## Input Contract

SceneSpec: task envelope received from scene-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: R3F scene component with physics config, material bindings, and postprocessing
- `verdicts`: validation results from r3f-physics-rapier, performance-animation
- `followups`: []

## Protocol

1. Receive task envelope from scene-director
2. Execute domain-specific implementation
3. Run validators: r3f-physics-rapier, performance-animation
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
