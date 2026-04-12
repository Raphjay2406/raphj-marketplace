---
name: "theatre-choreography"
description: "Theatre.js 0.7.x keyframe authoring, JSON export, runtime playback via @theatre/core, and scroll-to-timeline binding"
tier: "domain"
triggers: "Theatre.js, theatre choreography, keyframe sequencer, scroll timeline, theatre project, getOrCreateProject, getSheet"
version: "4.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- Complex multi-object animation sequences where GSAP timelines become unwieldy — Theatre.js provides a visual editor and exportable JSON.
- Camera choreography across 3D scenes (hero-camera-choreographer, theatre-sequencer workers).
- Sequences that need designer-editable keyframes baked into the codebase as JSON.

### When NOT to Use

- Simple one-off entrance animations — use `cinematic-motion` + GSAP instead.
- Lottie or Rive micro-animations that are self-contained — those workers own their own format.
- `3d_intensity == "none" | "accent"` — Theatre overhead is not justified.

### Decision Tree

- If sequence has > 5 animated objects with interdependent timing, use Theatre.js project + sheets.
- If sequence is scroll-driven only with no branching logic, prefer `scroll-driven-css-author`.
- If sequence needs designer hand-off, Theatre.js JSON export is the right format.

### Pipeline Connection

- **Referenced by:** hero-camera-choreographer, theatre-sequencer during Wave 2+ section builds
- **Consumed at:** `/gen:build` Wave 2+ — `theatre-sequencer` writes the project JSON; runtime imports it via `@theatre/core`

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Project + Sheet Setup

```ts
// lib/theatre.ts
import { getProject, val, types } from '@theatre/core'
import projectState from '@/theatre-project.json'

// getOrCreateProject loads saved keyframe state from JSON
export const project = getProject('Genorah Scene', { state: projectState })

// One sheet per logical section or scene
export const heroSheet = project.sheet('Hero')
export const peakSheet = project.sheet('Peak')
```

#### Pattern: Object Definition + val.onChange Binding

```ts
// components/canvas/HeroCamera.tsx
import { heroSheet } from '@/lib/theatre'
import { types } from '@theatre/core'
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'

export function HeroCamera() {
  const { camera } = useThree()
  const camObj = heroSheet.object('Camera', {
    position: types.compound({
      x: types.number(0, { range: [-20, 20] }),
      y: types.number(2, { range: [-10, 10] }),
      z: types.number(10, { range: [0, 30] }),
    }),
    fov: types.number(60, { range: [30, 90] }),
  })

  useEffect(() => {
    return val.onChange(camObj.props, ({ position, fov }) => {
      camera.position.set(position.x, position.y, position.z)
      // @ts-expect-error PerspectiveCamera
      camera.fov = fov
      camera.updateProjectionMatrix()
    })
  }, [camera, camObj])

  return null
}
```

#### Pattern: Scroll-to-Timeline Binding

```ts
// hooks/useTheatreScroll.ts
import { heroSheet } from '@/lib/theatre'
import { useEffect } from 'react'

export function useTheatreScroll(sectionRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const length = heroSheet.sequence.duration

    function onScroll() {
      const { top, height } = el.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -top / (height - window.innerHeight)))
      heroSheet.sequence.position = progress * length
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionRef])
}
```

### Reference Sites

- **Basement Studio** (basement.studio) — Theatre.js camera sequences synced to scroll; project JSON committed alongside source.
- **Awwwards SOTD 2024 finalists** — multiple use Theatre.js for hero-to-section camera transitions with exported keyframe state.
- **Theatre.js docs examples** (theatrejs.com/docs) — `getOrCreateProject` + sheet pattern is the canonical setup for production use.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `motion_easing` | Default easing preset applied to Theatre sequence interpolation |
| `motion_duration` | Sequence total duration baseline (seconds) |
| `primary`, `accent` | Injected as Theatre object props for material color animation |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Kinetic | Long sequences (8–12s), high-velocity camera moves, dense keyframe density |
| Japanese Minimal | Short sequences (2–3s), minimal keyframes, ease-out only |
| Ethereal | Slow drift sequences (6–10s), FOV breathing (±5°), opacity fades |

### Pipeline Stage

- **Input from:** SCENE-CHOREOGRAPHY.json (bookmark list, section durations), DESIGN-DNA.md (archetype, motion tokens)
- **Output to:** `theatre-project.json` committed to repo; runtime loaded via `getProject(..., { state })` import

### Related Skills

- `cinematic-motion` — archetype camera personality applied to Theatre keyframe values
- `persistent-canvas-pattern` — Theatre objects bind to R3F scene objects inside the single canvas
- `animation-orchestration` — cross-sheet sequencing and dependency ordering

## Layer 4: Anti-Patterns

### Anti-Pattern: Importing @theatre/studio in Production

**What goes wrong:** `@theatre/studio` ships the full visual editor (~800KB). Including it in the production bundle inflates LCP and TTI.
**Instead:** Import studio only in development: `if (process.env.NODE_ENV === 'development') { import('@theatre/studio').then(s => s.default.initialize()) }`. The `@theatre/core` runtime is ~40KB and safe for production.

### Anti-Pattern: Creating a New Project on Every Render

**What goes wrong:** `getProject` called inside a component creates a new project instance each render, losing all keyframe state and causing memory leaks.
**Instead:** Call `getProject` once at module level in `lib/theatre.ts` and export the singleton. Components import the shared instance.

### Anti-Pattern: Animating DOM Elements via Theatre Without val.onChange

**What goes wrong:** Directly setting `element.style` inside a render loop bypasses React's reconciler, causing stale closure bugs and missed updates.
**Instead:** Use `val.onChange(obj.props, handler)` to subscribe to prop changes. The handler runs outside React's render cycle — safe for direct DOM/Three.js mutations.

### Anti-Pattern: Ignoring Scroll Passive Flag

**What goes wrong:** Non-passive scroll listeners for Theatre position updates block the main thread on low-end devices, causing jank.
**Instead:** Always pass `{ passive: true }` to `addEventListener('scroll', ...)` when binding scroll position to `sheet.sequence.position`.
