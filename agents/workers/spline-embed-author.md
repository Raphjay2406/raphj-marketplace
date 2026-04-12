---
name: spline-embed-author
id: genorah/spline-embed-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Spline scene embed components with lazy loading, DNA color injection via Spline events API, and reduced-motion fallback.
capabilities:
  - id: author-spline-embed
    input: SplineSpec
    output: SplineEmbedComponent
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

# Spline Embed Author

## Role

Authors Spline scene embed components with lazy loading, DNA color injection via Spline events API, and reduced-motion fallback.

## Input Contract

SplineSpec: task envelope received from scene-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Spline embed component with DNA event bindings and fallback image
- `verdicts`: validation results from performance-animation, reduced-motion-variant-author
- `followups`: []

## Protocol

1. Read SCENE-CHOREOGRAPHY.json + DESIGN-DNA.md (archetype preset).
2. Scaffold Spline embed component with `@splinetool/react-spline` — lazy-load via `next/dynamic` to avoid SSR mismatch.
3. Inject DNA `primary`, `accent`, `glow` tokens via Spline events API `emitEvent('colorSync', { primary, accent, glow })` on mount.
4. Wire reduced-motion fallback: if `prefers-reduced-motion: reduce`, render static `<FallbackHero>` image instead of Spline runtime.
5. Self-check via `cinematic-motion` and `persistent-canvas-pattern` validators (score threshold 0.8).
6. Return Result envelope with SplineEmbedComponent artifact.

## Skills Invoked

- `cinematic-motion` — scroll trigger integration and Spline animation timing
- `persistent-canvas-pattern` — validates Spline embed does not spawn a second Canvas context

## Followups

If self-check score < 0.8, emit followup `{ suggested_worker: "r3f-scene-builder", reason: "tighten output — replace Spline with native R3F for deeper DNA control" }`.
