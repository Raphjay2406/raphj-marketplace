---
name: spline-integration
description: "Spline 3D scene embedding with DNA color mapping, event handling, Next.js SSR support, performance optimization, R3F bridge, and scene creation guidance."
tier: domain
triggers: "Spline, 3D scene embed, spline scene, spline integration, 3D embed, splinetool, interactive 3D, visual 3D editor, 3D design tool"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Spline vs R3F Decision

Spline is the Figma of 3D. R3F is the code-first approach. Both are valid -- the choice depends on WHO creates the scene and WHAT the scene needs.

**Use Spline when:**
- Designer creates the 3D scene visually in Spline's editor
- Team has Spline proficiency and wants rapid 3D prototyping
- Scene is primarily aesthetic/presentational (hero backgrounds, floating objects, product showcases)
- Predefined camera angles and hover/click interactions are sufficient
- Visual fidelity matters more than programmatic control

**Use R3F when:**
- Scene needs custom shaders (noise displacement, holographic, fluid)
- Complex procedural generation (particle systems, dynamic geometry)
- Deep React state integration (data-driven 3D, real-time updates from API)
- Full programmatic control over every vertex, material, and light
- See 3D/WebGL Effects skill for full R3F guidance

**Use the R3F Bridge (`@splinetool/r3f-spline`) when:**
- Designer creates the base scene visually in Spline
- Developer adds custom shaders, post-processing, or advanced animation via R3F
- Best of both: Spline for visual design, R3F for programmatic enhancement

### When Spline Is Appropriate

| Use Case | Appropriate | Notes |
|----------|-------------|-------|
| Hero 3D scene with hover/rotate | YES | Core Spline strength |
| Product showcase with camera angles | YES | Predefined angles in Spline editor |
| Animated background elements | YES | Set `renderOnDemand={true}` if not continuously animated |
| Interactive 3D responding to user input | YES | Event system handles clicks/hover |
| Data-driven 3D visualization | NO | Use R3F -- needs programmatic geometry |
| Heavy real-time simulation | NO | Use R3F -- needs custom shaders and per-frame control |
| Simple CSS 3D effects | NO | Use CSS transforms -- no library needed |
| Procedural generation | NO | Use R3F -- Spline scenes are pre-authored |

### Performance Awareness

`.splinecode` files range from 5-50MB. Performance handling is non-negotiable:

- **Always** lazy load the Spline component (`React.lazy` or `next/dynamic`)
- **Never** load Spline eagerly on page init -- it blocks rendering and destroys CWV
- **Always** provide a DNA-styled placeholder via Suspense while the scene loads
- **Self-host** `.splinecode` files on CDN with immutable cache headers (1 year max-age)
- `renderOnDemand={true}` (default) renders only when scene changes -- keep default for static/hoverable scenes
- Set `renderOnDemand={false}` only for scenes with continuous animation loops
- **Three-tier responsive:** skip Spline entirely on mobile (<768px), show static fallback image

### Pipeline Connection

- **Referenced by:** Section builders when plan specifies Spline 3D scenes
- **Consumed at:** `/modulo:execute` during section build (Wave 2+)
- **Related skill:** 3D/WebGL Effects for R3F-based scenes, Performance-Aware Animation for general animation budgets

## Layer 2: Award-Winning Examples

### Pattern: Basic Embedding with Lazy Loading

Always wrap Spline in `React.lazy` + `Suspense` with a DNA-styled placeholder. Never import eagerly.

```tsx
'use client'
import { lazy, Suspense } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

function SplineScene({ sceneUrl }: { sceneUrl: string }) {
  return (
    <Suspense fallback={
      <div className="aspect-video bg-surface animate-pulse rounded-xl" />
    }>
      <Spline scene={sceneUrl} className="w-full h-full" />
    </Suspense>
  )
}
```

Key requirements:
- `'use client'` directive mandatory (Spline requires browser APIs)
- Placeholder uses DNA token `bg-surface` (not hardcoded colors)
- `aspect-video` maintains layout stability while loading (prevents CLS)

### Pattern: Next.js SSR with Blurred Placeholder

For Next.js projects, use the dedicated `/next` import for SSR-optimized loading with automatic blurred placeholder.

```tsx
'use client'
import SplineNext from '@splinetool/react-spline/next'

function SplineHero({ sceneUrl }: { sceneUrl: string }) {
  return (
    <SplineNext
      scene={sceneUrl}
      className="w-full h-full"
      // Next.js integration provides:
      // - Blurred placeholder while scene loads
      // - SSR-compatible rendering (no hydration mismatch)
      // - Automatic code splitting
    />
  )
}
```

When to use each import:
- `@splinetool/react-spline` -- standard React (Vite, Astro, Tauri, Electron)
- `@splinetool/react-spline/next` -- Next.js App Router or Pages Router

### Pattern: DNA Color Mapping via onLoad

Map Design DNA color tokens to Spline objects programmatically. This keeps Spline scenes DNA-aware without baking colors into the scene file.

**Spline naming convention:** Prefix all mappable objects with `DNA_` in the Spline editor. This enables systematic programmatic access.

```tsx
'use client'
import { lazy, Suspense, useCallback, useMemo } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

/**
 * Convert CSS HSL string to RGB 0-255 for Spline.
 * Reads computed DNA token values from CSS custom properties.
 */
function dnaTokenToRgb(tokenVar: string): { r: number; g: number; b: number } {
  const el = document.createElement('div')
  el.style.color = `hsl(${getComputedStyle(document.documentElement).getPropertyValue(tokenVar)})`
  document.body.appendChild(el)
  const computed = getComputedStyle(el).color
  document.body.removeChild(el)

  const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!match) return { r: 128, g: 128, b: 128 }
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) }
}

function DnaSplineScene({ sceneUrl }: { sceneUrl: string }) {
  const onLoad = useCallback((spline: any) => {
    // Map DNA primary color to main shape
    const primaryShape = spline.findObjectByName('DNA_Primary')
    if (primaryShape) {
      const rgb = dnaTokenToRgb('--color-primary')
      primaryShape.color = { r: rgb.r, g: rgb.g, b: rgb.b }
    }

    // Map DNA accent color to glow/highlight elements
    const accentGlow = spline.findObjectByName('DNA_Accent')
    if (accentGlow) {
      const rgb = dnaTokenToRgb('--color-accent')
      accentGlow.color = { r: rgb.r, g: rgb.g, b: rgb.b }
    }

    // Map DNA secondary color to background elements
    const bgElement = spline.findObjectByName('DNA_Background')
    if (bgElement) {
      const rgb = dnaTokenToRgb('--color-secondary')
      bgElement.color = { r: rgb.r, g: rgb.g, b: rgb.b }
    }
  }, [])

  return (
    <Suspense fallback={
      <div className="aspect-video bg-surface animate-pulse rounded-xl" />
    }>
      <Spline scene={sceneUrl} onLoad={onLoad} className="w-full h-full" />
    </Suspense>
  )
}
```

**Color format notes:**
- Spline uses `{ r: 0-255, g: 0-255, b: 0-255 }` for color properties
- DNA tokens are CSS HSL custom properties -- conversion required
- The `dnaTokenToRgb` helper reads computed styles to handle any color format
- Map objects by DNA role: `DNA_Primary`, `DNA_Accent`, `DNA_Secondary`, `DNA_Background`

### Pattern: Event Handling

Spline provides mouse/touch events for interactive 3D elements. Events identify which object was interacted with by name.

```tsx
'use client'
import { lazy, Suspense, useCallback, useRef } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

function InteractiveSpline({ sceneUrl }: { sceneUrl: string }) {
  const splineRef = useRef<any>(null)

  const onLoad = useCallback((spline: any) => {
    splineRef.current = spline
  }, [])

  return (
    <Suspense fallback={
      <div className="aspect-video bg-surface animate-pulse rounded-xl" />
    }>
      <Spline
        scene={sceneUrl}
        onLoad={onLoad}
        onSplineMouseDown={(e) => {
          // e.target.name identifies which Spline object was clicked
          if (e.target.name === 'CTA_Button') {
            window.location.href = '/signup'
          }
          if (e.target.name === 'Feature_Card') {
            // Trigger React state update, open modal, etc.
          }
        }}
        onSplineMouseHover={(e) => {
          // Change cursor on hoverable objects
          document.body.style.cursor = e.target.name.startsWith('Hover_')
            ? 'pointer'
            : 'default'
        }}
        onSplineMouseUp={(e) => {
          // Release handler for drag interactions
        }}
      />
    </Suspense>
  )
}

// Programmatic event emission (trigger Spline animations from React)
function triggerSplineAnimation(splineRef: any, objectName: string) {
  if (splineRef.current) {
    splineRef.current.emitEvent('mouseDown', objectName)
  }
}
```

**Event naming conventions:**
- `CTA_` prefix for clickable call-to-action objects
- `Hover_` prefix for objects that should show pointer cursor
- `Drag_` prefix for draggable objects (use with onSplineMouseDown/Up)

**Available events:**
- `onSplineMouseDown` / `onSplineMouseUp` -- click/tap interactions
- `onSplineMouseHover` -- hover state (desktop)
- `onFollow` -- camera follow target tracking
- `spline.emitEvent('mouseDown', 'ObjectName')` -- trigger Spline-side animations from React

### Pattern: R3F Bridge -- Spline Design + R3F Control

When you need Spline's visual scene design combined with R3F's shader and post-processing ecosystem, use the R3F bridge.

```tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { SplineLoader } from '@splinetool/r3f-spline'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

function SplineWithEffects({ sceneUrl }: { sceneUrl: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      {/* Spline scene loaded into R3F scene graph */}
      <SplineLoader scene={sceneUrl} />

      {/* R3F environment lighting */}
      <Environment preset="studio" />

      {/* R3F post-processing (impossible with vanilla Spline embed) */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.8} intensity={0.3} />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  )
}
```

**When to use the R3F bridge:**
- Designer creates base scene in Spline editor (geometry, materials, animations)
- Developer adds post-processing effects (Bloom, Noise, Vignette, DepthOfField)
- Developer adds custom shaders to specific objects
- Need R3F's `useFrame` for per-frame programmatic animation on top of Spline scenes
- Need R3F `useScroll` for scroll-driven camera/scene manipulation

**Requirements:**
- Install: `npm install @splinetool/r3f-spline @react-three/fiber @react-three/drei @react-three/postprocessing`
- Canvas must be wrapped in `dynamic(() => ..., { ssr: false })` for Next.js
- Follows three-tier responsive pattern from 3D/WebGL Effects skill

### Performance Optimization Checklist

Every Spline integration must pass this checklist before shipping:

- [ ] **Lazy load** Spline component (`React.lazy` or `next/dynamic`)
- [ ] **Suspense wrapper** with DNA-styled placeholder (`bg-surface animate-pulse`)
- [ ] **`renderOnDemand={true}`** kept as default (only override for continuous animation)
- [ ] **Self-host** `.splinecode` files on project CDN (not Spline's default hosting)
- [ ] **Cache headers** set to immutable, 1 year max-age for versioned `.splinecode` files
- [ ] **Three-tier responsive:** static image fallback below 768px, no Spline on mobile
- [ ] **File size monitored** -- flag `.splinecode` files exceeding 10MB for optimization
- [ ] **Next.js projects** use `@splinetool/react-spline/next` for blurred placeholder SSR
- [ ] **No hardcoded colors** -- all DNA-mapped via `onLoad` + `findObjectByName`
- [ ] **Event handlers clean up** cursor changes on unmount

### Scene Creation Guidance

When creating Spline scenes for a Modulo project, follow these DNA-aligned guidelines to ensure the 3D scene feels integrated with the page design, not bolted on.

**Camera Angles (match archetype mood):**

| Archetype Family | Camera Angle | Mood |
|-----------------|-------------|------|
| Neo-Corporate, Swiss | Eye-level, neutral | Professional, trustworthy |
| Neon Noir, Dark Academia | Low dramatic, tilted | Moody, cinematic |
| Ethereal, Japanese Minimal | Slightly elevated, wide | Serene, contemplative |
| Kinetic, Playful | Dynamic orbit, close-up | Energetic, engaging |
| Luxury, Editorial | Three-quarter, controlled | Curated, premium |
| Warm Artisan, Organic | Slightly above, natural | Approachable, handmade |

**Lighting (mirror archetype profile):**
- **Bright/even:** Swiss, Neo-Corporate, Playful -- clean studio lighting
- **Moody/contrasty:** Neon Noir, Dark Academia, Brutalist -- single key light with hard shadows
- **Warm/soft:** Warm Artisan, Organic, Ethereal -- diffused warm fill lights
- **Dramatic/directional:** Luxury, Editorial, Kinetic -- rim lighting and specular highlights

**Materials and Colors:**
- Use neutral/grey materials in Spline editor as base
- Map DNA colors programmatically via `onLoad` (see DNA Color Mapping pattern above)
- Name all color-mappable objects with `DNA_` prefix: `DNA_Primary`, `DNA_Accent`, `DNA_Surface`
- Texture complexity should match archetype: clean/smooth for Minimal, rough/organic for Artisan

**Animation (match motion intensity):**
- **Slow float/drift:** Ethereal, Japanese Minimal, Luxury -- gentle orbits, subtle breathing
- **Energetic spin/bounce:** Kinetic, Playful, Vaporwave -- fast rotations, elastic springs
- **Minimal/static:** Swiss, Brutalist -- near-zero ambient motion, interaction-only
- **Measured/precise:** Neo-Corporate, Editorial -- controlled transitions, eased stops

**Geometry and Export:**
- Keep polygon count reasonable -- scene should load in <3s on broadband
- Avoid excessive subdivision on rounded objects
- Export as `.splinecode` (not `.glb`) for Spline's optimized loading pipeline
- `.splinecode` preserves Spline interactions and animations; `.glb` loses them
- Test exported file size -- optimize if exceeding 10MB

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Spline |
|-----------|----------------|
| `--color-primary` | Main 3D object material color via `findObjectByName('DNA_Primary')` |
| `--color-secondary` | Supporting element colors via `findObjectByName('DNA_Secondary')` |
| `--color-accent` | Glow, highlight, and emissive elements via `findObjectByName('DNA_Accent')` |
| `--color-surface` | Suspense placeholder background (`bg-surface`) |
| `--color-bg` | Scene background plane color mapping |
| Archetype personality | Camera angles, lighting profile, animation intensity, material choices |
| Motion tokens | Animation speed and easing in Spline keyframes (matched to DNA `--duration-*`, `--ease-*`) |

### Related Skills

- **3D/WebGL Effects** -- Spline is designer-first 3D embedding; R3F is developer-first 3D creation. Use Spline for visual scenes authored in the editor, R3F for programmatic/shader-driven scenes. The R3F Bridge (`@splinetool/r3f-spline`) combines both approaches.
- **Performance-Aware Animation** -- Spline scenes follow the same three-tier responsive pattern (full/reduced/static fallback). Lazy loading is mandatory. Spline `.splinecode` file size counts toward the total animation JS budget for initial load assessment.
- **Wow Moments** -- Spline scenes can serve as HOOK or PEAK wow moments. A full-viewport interactive 3D hero scene qualifies as a HOOK wow moment. Reference the wow moment auto-suggestion matrix for archetype-appropriate 3D wow techniques.
- **Design DNA** -- Colors are mapped programmatically, not baked into Spline scenes. The `DNA_` naming convention enables automatic mapping during `onLoad`. This means DNA changes propagate to Spline scenes without re-exporting.
- **Design Archetypes** -- Scene creation guidance maps camera angles, lighting profiles, animation intensity, and material choices to archetype personality. Each archetype family has documented 3D scene characteristics.
- **Emotional Arc** -- Beat position affects Spline scene treatment: HOOK beats get dramatic camera + bold interaction, PEAK beats get the most complex scene, BREATHE beats use minimal/static 3D if any.

### Pipeline Stage

- **Input from:** Section PLAN.md specifies Spline scene requirements (URL, interaction type, DNA objects)
- **Output to:** Built section with embedded Spline scene, DNA-mapped colors, interaction handlers
- **Builder type:** Standard section-builder or 3D specialist (when scene is the section's primary element)

## Layer 4: Anti-Patterns

### Anti-Pattern: Eager Spline Loading

**What goes wrong:** Importing `@splinetool/react-spline` at the top of the file without `React.lazy` or `next/dynamic`. The entire Spline runtime plus the `.splinecode` file (5-50MB) load at page init, blocking First Contentful Paint and destroying Core Web Vitals. Users see a blank page while 3D assets download.
**Instead:** Always lazy load: `const Spline = lazy(() => import('@splinetool/react-spline'))`. Wrap in `<Suspense>` with a DNA-styled placeholder. For Next.js, use `@splinetool/react-spline/next` which includes built-in blurred placeholder.

### Anti-Pattern: Spline Default Hosting in Production

**What goes wrong:** Using Spline's default CDN URL (`https://prod.spline.design/...`) in production. No cache control, external dependency introduces a single point of failure, potential downtime from Spline's infrastructure, and no CDN edge optimization for your user base.
**Instead:** Self-host `.splinecode` files on your project's CDN (Vercel Blob, Cloudflare R2, S3+CloudFront). Set cache headers: `Cache-Control: public, max-age=31536000, immutable` for versioned files. Update the `scene` prop URL to your hosted copy.

### Anti-Pattern: No Mobile Fallback

**What goes wrong:** Rendering the full Spline scene on all devices including mobile. Heavy GPU usage drains battery, touch interactions are imprecise compared to mouse, and `.splinecode` download on cellular connections causes long wait times.
**Instead:** Three-tier responsive: full Spline on desktop (1024px+), reduced/static on tablet (768-1023px), static image fallback below 768px. Use `useMediaQuery` to conditionally render. Provide a WebP screenshot of the 3D scene as the mobile fallback image.

### Anti-Pattern: Unnamed Objects for Programmatic Access

**What goes wrong:** Leaving Spline objects with default names (`Cube`, `Sphere 2`, `Group 1`) and trying to access them by index or position. Fragile, breaks when the scene is edited, and makes DNA color mapping impossible to maintain.
**Instead:** Use the `DNA_` prefix naming convention for all objects that need programmatic access: `DNA_Primary`, `DNA_Accent`, `DNA_Background`, `CTA_Button`, `Hover_Card`. Name in Spline editor before exporting. Document the naming convention in the section PLAN.md.

### Anti-Pattern: Continuous Render for Static Scenes

**What goes wrong:** Setting `renderOnDemand={false}` on a scene that is static or only responds to hover. The GPU renders every frame (60fps) even when nothing changes, wasting energy and competing with other page animations for GPU resources.
**Instead:** Keep the default `renderOnDemand={true}`. Spline renders only when the scene state changes (hover, click, programmatic update). Only set `renderOnDemand={false}` for scenes with continuous looping animations that must play without interaction.

### Anti-Pattern: Hardcoded Colors in Spline Scenes

**What goes wrong:** Baking final brand colors directly into Spline scene materials. When DNA changes (archetype switch, color refinement, dark/light mode), every Spline scene must be manually re-edited and re-exported. Creates a maintenance burden that scales with the number of scenes.
**Instead:** Use neutral grey materials in the Spline editor. Map DNA colors programmatically via the `onLoad` callback and `findObjectByName` with the `DNA_` prefix naming convention. DNA changes propagate automatically to all Spline scenes without re-exporting.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| splinecode-file-size | 0 | 10 | MB | SOFT -- warn if exceeded, optimize geometry/textures |
| lazy-load-required | 1 | 1 | boolean | HARD -- reject eager Spline imports |
| suspense-placeholder | 1 | 1 | boolean | HARD -- reject Spline without Suspense wrapper |
| mobile-fallback-breakpoint | 768 | 768 | px | HARD -- no Spline below this width |
| render-on-demand-default | 1 | 1 | boolean | SOFT -- warn if set to false without continuous animation |
| self-host-production | 1 | 1 | boolean | SOFT -- warn if using Spline default CDN URL in production |
| dna-naming-convention | 1 | - | objects | SOFT -- warn if DNA-mappable objects lack DNA_ prefix |
| scene-load-time | 0 | 3 | seconds | SOFT -- warn if scene takes longer than 3s on broadband |
