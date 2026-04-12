---
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
---

# Hero Camera Choreographer

## Role

Authors camera keyframe sequences for hero and cinematic sections. Produces Theatre.js or GSAP ScrollTrigger camera paths tied to DNA motion tokens.

## Input Contract

SceneSpec: task envelope received from scene-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: CameraTimeline JSON with keyframes, easing curves, and scroll trigger points
- `verdicts`: validation results from motion-health, performance-animation
- `followups`: []

## Protocol

1. Receive task envelope from scene-director
2. Execute domain-specific implementation
3. Run validators: motion-health, performance-animation
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
