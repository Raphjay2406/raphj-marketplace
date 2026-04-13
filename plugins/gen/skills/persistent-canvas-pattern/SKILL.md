---
name: "persistent-canvas-pattern"
description: "Single-Canvas architecture for 3D sections — one GPU context per page, sections receive portals, FallbackHero for incapable devices"
tier: "domain"
triggers: "persistent canvas, single canvas, WebGPU canvas, R3F layout, canvas per section, 3D intensity cinematic, 3D intensity immersive"
version: "4.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- `3d_intensity == "cinematic" | "immersive"` in DESIGN-DNA.md — mount the persistent canvas in RootLayout and portal sections into it.
- r3f-scene-builder is building any scene — it must consume this pattern to avoid multi-context violations.
- scene-director is writing SCENE-CHOREOGRAPHY.json — confirm single-canvas contract before dispatching workers.

### When NOT to Use

- `3d_intensity == "none" | "accent"` — skip entirely; render lightweight CSS/SVG effects or a simple `<model-viewer>` tag instead.
- Isolated tool/demo pages with no section choreography — a local `<Canvas>` is acceptable there.

### Decision Tree

- If intensity is `cinematic` or `immersive`, scaffold PersistentCanvas in RootLayout (Wave 1), portal sections in Wave 2+.
- If WebGPU probe fails, keep same Canvas — route to WebGL2 renderer, emit warning.
- If FallbackHero is needed (capability probe failed), render it at the same z-index without Canvas.

### Pipeline Connection

- **Referenced by:** scene-director (init), r3f-scene-builder (Wave 1 scaffold), spline-embed-author (validates no second context)
- **Consumed at:** `/gen:build` Wave 1 (RootLayout scaffold), Wave 2+ (section portals)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: RootLayout PersistentCanvas

```tsx
// app/layout.tsx — Wave 1 scaffold
import { PersistentCanvas } from '@/components/canvas/PersistentCanvas'
import { SceneDirector } from '@/components/canvas/SceneDirector'
import { FallbackHero } from '@/components/canvas/FallbackHero'
import choreo from '@/scene-choreography.json'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PersistentCanvas intensity={choreo.intensity}>
          <SceneDirector choreography={choreo} />
        </PersistentCanvas>
        <FallbackHero
          src="/fallback-hero.jpg"
          aria-hidden
          data-canvas-fallback
        />
        {children}
      </body>
    </html>
  )
}
```

#### Pattern: Section Portal into Persistent Canvas

```tsx
// components/sections/HeroSection.tsx — Wave 2
import { useRef } from 'react'
import { createPortal } from '@react-three/fiber'
import { useSceneContext } from '@/components/canvas/SceneContext'

export function HeroSection() {
  const { scene } = useSceneContext()
  const groupRef = useRef(null)

  return (
    <>
      {/* DOM layer */}
      <section className="relative z-10 min-h-screen">
        <h1 className="text-text">Headline</h1>
      </section>
      {/* 3D layer portalled into persistent canvas */}
      {scene && createPortal(
        <group ref={groupRef}>
          {/* R3F mesh content */}
        </group>,
        scene
      )}
    </>
  )
}
```

### Reference Sites

- **Active Theory** (activetheory.net) — single WebGL context persisting across route transitions; sections portal meshes in/out without re-init.
- **Awwwards Conference** (conference.awwwards.com) — persistent Three.js canvas with scroll-driven camera; DOM content overlaid via `z-index` stacking.
- **Basement Studio** (basement.studio) — R3F RootLayout canvas, each section animates its own portal group without spawning new contexts.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `3d_intensity` | Gates whether canvas is mounted at all (`cinematic`/`immersive` = yes) |
| `primary`, `accent`, `glow` | Passed as uniforms to SceneDirector for material binding |
| `motion_easing` | Canvas resize/transition easing on route changes |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Kinetic | Full-viewport canvas, high-motion camera paths, minimal DOM overlay |
| Japanese Minimal | Canvas confined to hero section bounds; rest of page is flat |
| Ethereal | Translucent canvas blended over gradient background; `mix-blend-mode: screen` |
| Data-Dense | Canvas restricted to hero mark; no full-page 3D |

### Pipeline Stage

- **Input from:** DESIGN-DNA.md `3d_intensity`, SCENE-CHOREOGRAPHY.json bookmark list
- **Output to:** r3f-scene-builder (canvas context), spline-embed-author (no-second-context contract), all section workers (portal target)

### Related Skills

- `cinematic-motion` — camera choreography inside the persistent canvas
- `r3f-physics-rapier` — physics world lives inside the single canvas context
- `theatre-choreography` — Theatre.js sequences bind to canvas scene objects

## Layer 4: Anti-Patterns

### Anti-Pattern: Multiple Canvas Per Page

**What goes wrong:** Each `<Canvas>` creates a new WebGL context. Browsers cap simultaneous contexts at 8–16; exceeding this silently loses contexts, causing blank sections. Hard gate #6 failure.
**Instead:** One `<Canvas>` in RootLayout. Sections use `createPortal` from `@react-three/fiber` to inject their 3D content into the shared scene graph.

### Anti-Pattern: Mounting Canvas Per Section

**What goes wrong:** Sections unmount and remount their Canvas on scroll, causing GPU resource thrash, visible flicker, and lost shader compilation cache.
**Instead:** Keep the single canvas mounted for the full page lifetime. Use `visible` prop or frustum culling to hide off-screen section meshes.

### Anti-Pattern: Forgetting FallbackHero

**What goes wrong:** On devices where WebGL/WebGPU is unavailable (some iOS Safari, older Android), the page renders blank above the fold. Accessibility failure + LCP regression.
**Instead:** Always co-locate `<FallbackHero>` with `data-canvas-fallback`. The capability probe hides it via `display:none` when canvas is supported, shows it otherwise.

### Anti-Pattern: SSR Canvas Mount

**What goes wrong:** `<Canvas>` from `@react-three/fiber` accesses `window` during SSR, causing Next.js hydration errors.
**Instead:** Wrap PersistentCanvas in `dynamic(() => import(...), { ssr: false })` or gate with `typeof window !== 'undefined'` check in the layout.
