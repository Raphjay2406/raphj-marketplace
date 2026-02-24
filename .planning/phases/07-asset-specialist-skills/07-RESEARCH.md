# Phase 7: Asset & Specialist Skills - Research

**Researched:** 2026-02-24
**Domain:** Procedural shape generation, 3D/WebGL effects, component marketplace guidance, Remotion video, Spline 3D embedding, AI image prompt generation -- all as SKILL.md markdown knowledge bases for a Claude Code plugin
**Confidence:** HIGH (most topics verified via official docs and npm)

## Summary

Phase 7 produces 6 SKILL.md files that teach Claude how to generate procedural shapes/SVG assets, build 3D/WebGL scenes, source and restyle marketplace components, create Remotion video compositions, embed Spline 3D scenes, and generate DNA-matched AI image prompts. These are markdown knowledge bases, not application code.

The 3D/WebGL landscape has shifted significantly since the existing v6.1.0 `three-js-webgl` skill was written. WebGPU is now production-ready across all major browsers (Chrome 113+, Edge 113+, Firefox 147+, Safari 26+) with ~95% global coverage. Three.js r171+ supports WebGPU with automatic WebGL 2 fallback via `import from 'three/webgpu'`. React Three Fiber v9.5 is stable (v10 alpha adds native WebGPU support). The shader ecosystem has matured with THREE-CustomShaderMaterial for extending standard materials and react-postprocessing for effect chains. GSAP's MorphSVG and DrawSVG plugins are now free (Webflow acquisition), enabling rich SVG animation without cost barriers.

For the marketplace skill, component libraries have converged around the shadcn/ui ecosystem: Aceternity UI focuses on animated/premium components, Magic UI on landing page components, and 21st.dev serves as an open registry ("npm for design engineers") for community-contributed shadcn-based components. Framer's marketplace operates separately with its own component model. Remotion uses a tiered license (free for individuals/small companies, paid for larger companies). Spline embeds via `@splinetool/react-spline` v4.1.0 with Next.js SSR support and blurred placeholder loading.

**Primary recommendation:** Build each skill in the 4-layer format (decision guidance + examples + DNA integration + anti-patterns). The 3D skill should document both WebGL (current default) and WebGPU (forward-looking), with R3F v9 as the stable target. The shape skill should provide procedural generation patterns using `simplex-noise` for organic forms and pure SVG/CSS for geometric patterns, all constrained to DNA color tokens. The marketplace skill should use category-level recommendations (not specific component names) for durability.

## Standard Stack

This phase produces markdown skill files. The "stack" is the technologies these skills will document and recommend.

### Core Technologies (Skills Will Reference)
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| React Three Fiber | 9.5.x (`@react-three/fiber`) | React renderer for Three.js | Industry standard for React 3D. Stable, pairs with React 18/19 |
| @react-three/drei | 10.7.x | R3F helper library | Float, Environment, OrbitControls, shaderMaterial, ContactShadows, Html, useScroll, Detailed |
| @react-three/postprocessing | 3.x | Post-processing effects | EffectComposer with Bloom, Noise, Vignette, DepthOfField. Auto-merges effect passes |
| Three.js | r171+ | 3D engine | WebGPU production-ready with auto WebGL 2 fallback via `three/webgpu` import |
| THREE-CustomShaderMaterial | 6.x | Extend standard materials with custom shaders | csm_Position, csm_DiffuseColor, csm_FragColor output variables. Works with MeshPhysicalMaterial etc. |
| simplex-noise | 4.x | Procedural noise generation | 2KB gzipped, dependency-free, tree-shakeable. 2D/3D/4D noise. 70M calls/s |
| GSAP MorphSVG | 3.14.x (free) | SVG shape morphing | Intelligent point mapping, different-point-count morphing. Now free |
| GSAP DrawSVG | 3.14.x (free) | SVG path drawing animation | Progressive stroke reveal/hide. Now free |
| Remotion | 4.0.x | Programmatic video creation with React | useCurrentFrame, interpolate, spring, Composition, Sequence, Still |
| @splinetool/react-spline | 4.1.0 | Spline 3D scene embedding in React | Event handling, object manipulation, Next.js SSR with blurred placeholder |
| Aceternity UI | latest | Premium animated components | Framer Motion-powered, dark UI focus, highly animated |
| Magic UI | latest | Landing page components | Built on shadcn, 50+ animated components, startup-focused |
| 21st.dev | latest | Component registry | Open community registry, shadcn-based, installable via `npx shadcn` |

### Supporting Technologies
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| @splinetool/runtime | latest | Vanilla JS Spline runtime | Non-React or vanilla JS Spline embedding |
| @splinetool/r3f-spline | latest | Spline-to-R3F export | When you need Spline visual design + R3F shader/animation control |
| r3f-perf | latest | R3F performance monitoring | Development-time shader/texture/vertex statistics |
| @remotion/player | 4.0.x | In-browser Remotion preview | Embedding Remotion compositions as interactive players in web pages |
| SVG feTurbulence | CSS/SVG native | Browser-native noise textures | Noise/grain overlays without JS. Uses Perlin noise natively |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| R3F v9 (stable) | R3F v10 (alpha) | v10 has native WebGPU/TSL support but is alpha. v9 is production-stable |
| simplex-noise (JS) | SVG feTurbulence (CSS) | feTurbulence is zero-JS but less controllable. simplex-noise gives per-vertex control for procedural shapes |
| THREE-CustomShaderMaterial | raw ShaderMaterial | CSM preserves standard material features (lighting, shadows). Raw ShaderMaterial requires reimplementing everything |
| Remotion | FFmpeg + Canvas | Remotion is React-native, declarative. FFmpeg is lower-level, more flexible, harder to maintain |
| Spline (@splinetool) | Direct R3F scenes | Spline is visual-first (designer-friendly). R3F is code-first (developer-friendly). Different use cases |

### Installation Commands (for reference in skills)
```bash
# 3D/WebGL
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install three-custom-shader-material

# Procedural generation
npm install simplex-noise

# SVG animation (included in GSAP)
npm install gsap
# MorphSVG: import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
# DrawSVG: import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

# Remotion (brownfield install into existing project)
npm install remotion @remotion/cli @remotion/player

# Spline
npm install @splinetool/react-spline @splinetool/runtime
```

## Architecture Patterns

### Skill File Organization Strategy

Same approach as Phase 5: structured sections within single SKILL.md files, not sub-files. Claude Code loads entire SKILL.md files, so splitting creates fragmentation.

**Size targets per skill:**
| Skill | Estimated Size | Strategy |
|-------|---------------|----------|
| Shape & Asset Generation | 700-900 lines | Shape taxonomy (purpose-primary), per-archetype palettes (compact table), procedural generation patterns, SVG animation suite, beat-aware mapping |
| 3D/WebGL Effects | 800-1000 lines | Building blocks (shaders, lighting, camera, controls), three-tier responsive, scroll-driven 3D, post-processing. Most complex skill |
| Component Marketplace | 400-500 lines | Category-level recommendations, restyling protocol, archetype x beat matrix, 30% hard cap guidance |
| Remotion | 400-500 lines | Core API patterns, DNA-aware composition templates, hero/product/social asset patterns |
| Spline Integration | 300-400 lines | Embedding patterns, event handling, Next.js SSR, performance, DNA color mapping, creation guidance |
| Image Prompt Generation | 500-600 lines | DNA-to-prompt translation, category templates, negative prompts, anti-patterns, archetype modifiers |

**Confidence: MEDIUM** -- Size estimates based on Phase 5 skill analysis and content requirements from CONTEXT.md.

### Pattern 1: Purpose-Primary Shape Taxonomy

**What:** Organize shapes by WHERE/WHY they're used, with technique details nested inside each category.
**When to use:** Shape & Asset Generation skill.
**Why:** Builders think "I need a section divider" not "I need an SVG path." User decision in CONTEXT.md locks this taxonomy approach.

```markdown
### Shape Categories (Purpose-Primary)

#### Section Dividers
- Wave (SVG path, curves)
- Angle (CSS clip-path, simple)
- Organic (noise-based, procedural)
- Stepped (geometric, precise)

#### Backgrounds & Atmospherics
- Dot grids (CSS radial-gradient)
- Grid lines (CSS linear-gradient)
- Noise textures (SVG feTurbulence or simplex-noise)
- Gradient meshes (CSS blur orbs)
- Particle fields (Canvas or R3F)

#### Accents & Decorative
- Floating shapes (CSS transform + animate)
- Concentric rings (SVG circles)
- Geometric patterns (SVG pattern)
- Line art / wireframes (SVG stroke)

#### Hero Illustrations
- Isometric objects (SVG or CSS 3D transforms)
- Abstract compositions (procedural, noise-driven)
- Branded shapes (signature element from DNA)
```

**Confidence: HIGH** -- Directly from user decision in CONTEXT.md: "purpose-primary, technique-secondary."

### Pattern 2: Three-Tier Responsive 3D

**What:** Full (desktop) / reduced (tablet) / static fallback (mobile <768px) for all 3D content.
**When to use:** 3D/WebGL Effects skill.
**Why:** User decision mandates three tiers. R3F Canvas has significant bundle size (~150KB gzipped) that should not load on mobile.

```tsx
// Three-tier 3D component pattern
'use client'
import dynamic from 'next/dynamic'
import { useMediaQuery } from '@/hooks/use-media-query'

const Scene3DFull = dynamic(() => import('./scene-3d-full'), { ssr: false })
const Scene3DReduced = dynamic(() => import('./scene-3d-reduced'), { ssr: false })

function Scene3D() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isTablet = useMediaQuery('(min-width: 768px)')

  if (isDesktop) return <Scene3DFull />
  if (isTablet) return <Scene3DReduced />

  // Static fallback for mobile
  return (
    <div className="relative aspect-video bg-surface rounded-xl overflow-hidden">
      <img src="/scene-fallback.webp" alt="3D scene preview"
        className="w-full h-full object-cover" loading="lazy" />
    </div>
  )
}
```

**Confidence: HIGH** -- Standard progressive enhancement pattern. Directly from CONTEXT.md decision.

### Pattern 3: Shader Building Blocks (Not Presets)

**What:** Individual shader techniques (noise, liquid, holographic) as composable building blocks, not complete scene presets.
**When to use:** 3D/WebGL Effects skill.
**Why:** User decision: "Building blocks only, not scene presets." Builders compose techniques into custom scenes.

```markdown
### Shader Building Blocks

#### Noise/Grain
- Vertex displacement with simplex noise
- Fragment noise for organic textures
- Animated noise via uTime uniform

#### Liquid/Fluid
- Surface distortion via vertex displacement
- Refraction with normal maps
- Wobble/ripple via sin() waves + noise

#### Holographic/Iridescent
- View-angle color shift (dot product of normal and view direction)
- Fresnel effect for edge glow
- Animated stripe patterns

#### Glass Refraction
- MeshPhysicalMaterial with transmission, thickness, ior
- Environment map reflections
- Chromatic aberration via RGB channel offset

#### Particle Systems
- BufferGeometry with Float32Array positions
- useFrame for per-frame updates
- Size attenuation for depth perception
```

**Confidence: HIGH** -- Patterns verified via Codrops tutorials, Three.js Journey, and Maxime Heckel's shader studies.

### Pattern 4: Category-Level Marketplace Recommendations

**What:** Recommend component CATEGORIES per archetype + beat, not specific component names.
**When to use:** Component Marketplace skill.
**Why:** User decision: "Category recommendations (not specific components) -- more durable as marketplaces evolve."

```markdown
### Marketplace Category Matrix (Archetype x Beat)

| Beat | Kinetic | Luxury | Japanese Minimal | Brutalist |
|------|---------|--------|------------------|-----------|
| HOOK | Animated hero grid, particle background | Slow reveal gallery, elegant slider | Single object focus, zen animation | Raw text reveal, glitch effect |
| PEAK | Interactive 3D viewer, drag demo | Cinematic scroll sequence | Subtle parallax, floating elements | Scale violence grid |
| BUILD | Animated card grid, accordion | Elegant feature list | Clean list with micro-animation | Dense info grid |
| PROOF | Animated counter, testimonial carousel | Logo wall, subtle fade | Minimal counter, clean quote | Raw number display |

### Which Marketplace for Which Category
| Category | Aceternity UI | Magic UI | 21st.dev | Framer |
|----------|--------------|----------|----------|--------|
| Animated grids/cards | Strong | Strong | Community varies | Templates only |
| Hero sections | Strong | Strong | Growing | Strong |
| Scroll effects | Moderate | Limited | Community varies | Strong |
| Interactive elements | Strong | Moderate | Community varies | Limited |
| Text animations | Moderate | Strong | Community varies | Strong |
```

**Confidence: MEDIUM** -- Category-to-marketplace mapping based on current marketplace inventories which will evolve.

### Pattern 5: DNA-to-Prompt Translation System

**What:** Systematic mapping from Design DNA attributes to AI image prompt attributes.
**When to use:** Image Prompt Generation skill.
**Why:** User decision: tool-agnostic prompts with full DNA translation.

```markdown
### DNA Attribute to Prompt Attribute Mapping

| DNA Attribute | Prompt Translation |
|---------------|-------------------|
| Color palette (12 tokens) | "color palette dominated by [primary], [secondary], [accent]. Avoid [forbidden colors]" |
| Archetype personality | Style/mood modifier: "brutalist and raw" or "ethereal and dreamlike" |
| Typography style | Texture descriptor: "clean geometric" or "organic hand-drawn" |
| Signature element | Visual motif: "featuring [signature element] as recurring visual theme" |
| Motion language | Implied energy: "dynamic, energetic" or "calm, meditative" |
| Forbidden patterns | Negative prompt generation: "no [forbidden], no [forbidden]" |
| Texture preference | Surface descriptor: "matte textures" or "glossy surfaces" |
```

**Confidence: HIGH** -- This is a creative framework, not a technical API. The mapping is sound design practice.

### Anti-Patterns to Avoid

- **Hardcoded colors in shapes/3D:** Using `#8b5cf6` instead of DNA tokens like `hsl(var(--color-primary))`. The existing v6.1.0 skills are full of hardcoded hex colors. New skills must enforce DNA token usage exclusively for 2D shapes.
- **Full-scene 3D presets:** Providing complete scenes that builders copy wholesale. Produces samey output across projects. Instead, provide building blocks.
- **Specific component name references in marketplace skill:** Naming exact components (e.g., "Aceternity Bento Grid v2.3") creates brittleness. Use categories.
- **Tool-specific prompt syntax:** Midjourney's `--v 6 --ar 16:9` syntax will change. Describe desired output, let users add tool syntax.
- **Loading 3D on mobile without detection:** R3F + Three.js is ~150KB+ gzipped. Always code-split and skip on mobile.
- **Mixing three and three/webgpu imports:** Three.js docs warn against mixing import paths in the same codebase.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Procedural noise for shapes | Custom Perlin implementation | `simplex-noise` npm package (4.x) | 2KB, 70M calls/s, tree-shakeable, 2D/3D/4D |
| SVG morphing animation | Manual path point interpolation | GSAP MorphSVGPlugin (now free) | Handles different point counts, intelligent mapping |
| SVG path drawing | Custom stroke-dasharray animation | GSAP DrawSVGPlugin (now free) | Progressive reveal/hide with easing, percentage control |
| Noise/grain texture overlay | Canvas-based noise generation | SVG `feTurbulence` filter | Browser-native, zero JS, GPU composited |
| 3D post-processing effects | Raw WebGL framebuffer manipulation | `@react-three/postprocessing` | Auto-merges passes, React-native API |
| Extending standard 3D materials | Complete custom ShaderMaterial | `three-custom-shader-material` | Preserves lighting, shadows, PBR. Just add custom outputs |
| Spline scene embedding | Raw Spline runtime setup | `@splinetool/react-spline` | React component, event handling, Next.js SSR support |
| Video composition in React | Canvas + MediaRecorder | Remotion `<Composition>` | Frame-accurate, React-native, server-side rendering |
| Component discovery from marketplaces | Manual browsing and copy-paste | `npx shadcn add` (21st.dev) | Single command install, auto-resolves dependencies |

**Key insight:** The biggest shift since v6.1.0 is that GSAP SVG plugins (MorphSVG, DrawSVG) are now free, WebGPU is production-ready with automatic fallback, and THREE-CustomShaderMaterial eliminates the need to write full shader programs from scratch. The skills should leverage these freely available tools rather than providing manual implementations.

## Common Pitfalls

### Pitfall 1: Hardcoded Colors in v6.1.0 Skills
**What goes wrong:** Existing geometry-shapes and three-js-webgl skills use hardcoded hex values (`#8b5cf6`, `#3b82f6`, `bg-black`) instead of DNA tokens.
**Why it happens:** v6.1.0 skills predate the Design DNA system's strict token enforcement.
**How to avoid:** New skills must use ONLY DNA color tokens for 2D shapes: `hsl(var(--color-primary))`, `bg-primary`, etc. For 3D materials, user decision allows "creative freedom" to compute derived colors from DNA base, but primary colors still use tokens.
**Warning signs:** Any hex color literal or Tailwind default color class (e.g., `bg-blue-500`).

**Confidence: HIGH** -- Verified by reading existing v6.1.0 skills which are full of hardcoded colors.

### Pitfall 2: R3F Canvas Without SSR Disabling
**What goes wrong:** Three.js requires browser APIs (WebGL context, window, document). Rendering on server crashes.
**Why it happens:** Next.js App Router defaults to server components. R3F Canvas must be client-only.
**How to avoid:** Always use `dynamic(() => import('./scene'), { ssr: false })` in Next.js. In Astro, use `client:only="react"`. The 3D skill must document this prominently.
**Warning signs:** If any 3D code example lacks `'use client'` directive AND dynamic import with `ssr: false`.

**Confidence: HIGH** -- Verified from R3F installation docs and existing v6.1.0 three-js-webgl skill.

### Pitfall 3: WebGPU async init() Omission
**What goes wrong:** Scene renders as blank/empty when using `three/webgpu` import.
**Why it happens:** WebGPU renderer requires `await renderer.init()` before first render. WebGL was synchronous. Developers forget the async step.
**How to avoid:** When documenting WebGPU patterns, always include the async init pattern. Note that R3F v9 handles this internally for WebGL, but WebGPU requires v10 alpha or manual setup.
**Warning signs:** Using `three/webgpu` import without `await renderer.init()`.

**Confidence: HIGH** -- Verified from Three.js WebGPU migration guide.

### Pitfall 4: Remotion Licensing Misunderstanding
**What goes wrong:** Treating Remotion as fully open source or as fully paid.
**Why it happens:** Remotion's license is nuanced -- free for individuals and companies with 3 or fewer employees, paid company license required for larger organizations.
**How to avoid:** The Remotion skill must document the licensing model clearly. Free for: individuals, companies <=3 employees, non-profits, evaluation. Company license required for larger entities.
**Warning signs:** Claiming Remotion is "free" without caveat, or claiming it requires payment for all commercial use.

**Confidence: HIGH** -- Verified from Remotion's official license page.

### Pitfall 5: Oversized 3D Skill File
**What goes wrong:** Trying to include full shader code for all 9+ shader types produces a 1500+ line file.
**Why it happens:** Each shader technique (noise, liquid, holographic, glass, particles, volumetric fog, post-processing, ray marching, displacement) needs vertex + fragment shader code + R3F integration + DNA mapping.
**How to avoid:** Use tiered specificity like Phase 5's wow moments:
- **Tier 1 (full code):** Basic noise displacement, particle field, glass material (MeshPhysicalMaterial with transmission) -- these are common and short
- **Tier 2 (pattern + setup):** Liquid distortion, holographic/iridescent, post-processing chain -- need project adaptation
- **Tier 3 (guidance + reference):** Volumetric fog, ray marching, complex custom shaders -- too project-specific for copy-paste
**Warning signs:** Skill file exceeding 1000 lines.

### Pitfall 6: Spline Scene File Size
**What goes wrong:** Spline `.splinecode` files can be very large (5-50MB), causing slow page loads and poor Core Web Vitals.
**Why it happens:** Spline scenes embed geometry, textures, and materials in a single binary file.
**How to avoid:** The Spline skill must document: (1) lazy loading with React.lazy + Suspense, (2) `renderOnDemand={true}` (default) to render only when needed, (3) self-hosting .splinecode files on CDN with proper caching, (4) blurred placeholder with `@splinetool/react-spline/next` import.
**Warning signs:** Spline component loaded eagerly on page init without lazy loading.

### Pitfall 7: AI Prompt Syntax Lock-in
**What goes wrong:** Writing prompts with tool-specific syntax (Midjourney's `--v 6`, DALL-E's system prompts, Flux's LoRA references) that break when tools update.
**Why it happens:** Each tool has different parameter syntax and these change frequently.
**How to avoid:** User decision: tool-agnostic prompts. Describe desired output in natural language. Provide a separate "tool-specific appendix" section that maps generic prompt to tool syntax, clearly marked as volatile.
**Warning signs:** `--ar`, `--v`, `--s`, `--chaos` parameters in main prompt templates.

## Code Examples

Verified patterns from official sources for inclusion in skills.

### Procedural Noise-Based SVG Shape
```tsx
// Source: simplex-noise npm docs
'use client'
import { useMemo } from 'react'
import { createNoise2D } from 'simplex-noise'

function ProceduralBlob({
  color = 'var(--color-primary)',
  size = 200,
  complexity = 6,
  seed,
}: {
  color?: string
  size?: number
  complexity?: number
  seed?: number
}) {
  const path = useMemo(() => {
    const noise2D = createNoise2D(seed ? () => seed : undefined)
    const points = complexity * 8
    const coords: string[] = []

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2
      const radius = 40 + noise2D(Math.cos(angle) * 2, Math.sin(angle) * 2) * 12
      const x = 50 + Math.cos(angle) * radius
      const y = 50 + Math.sin(angle) * radius
      coords.push(`${x},${y}`)
    }

    return `M${coords.join('L')}Z`
  }, [complexity, seed])

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <path d={path} fill={`hsl(${color})`} />
    </svg>
  )
}
```

### GSAP MorphSVG (Now Free)
```tsx
// Source: GSAP docs + Codrops demos
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger)

function MorphingShape() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(pathRef.current, {
        morphSVG: '#target-shape',
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: pathRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <svg viewBox="0 0 200 200" className="w-64 h-64">
      <path ref={pathRef} d="M50,10 L90,90 L10,90 Z"
        fill="hsl(var(--color-primary))" />
      <path id="target-shape" d="M100,10 A90,90 0 1,1 99.9,10 Z"
        style={{ visibility: 'hidden' }} />
    </svg>
  )
}
```

### GSAP DrawSVG Path Animation (Now Free)
```tsx
// Source: GSAP DrawSVG docs
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger)

function DrawingPath() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(pathRef.current,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: pathRef.current,
            start: 'top 80%',
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-lg">
      <path
        ref={pathRef}
        d="M10,100 Q100,10 200,100 T390,100"
        fill="none"
        stroke="hsl(var(--color-primary))"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
```

### R3F Custom Shader with THREE-CustomShaderMaterial
```tsx
// Source: THREE-CustomShaderMaterial GitHub + R3F docs
'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import * as THREE from 'three'

// Noise displacement vertex shader
const vertexShader = `
  uniform float uTime;
  uniform float uIntensity;

  // simplex noise function (inline or imported)
  float snoise(vec3 v) { /* ... simplex noise implementation ... */ }

  void main() {
    float noise = snoise(position * 2.0 + uTime * 0.5);
    csm_Position = position + normal * noise * uIntensity;
  }
`

// DNA-aware fragment shader
const fragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;

  void main() {
    csm_DiffuseColor = vec4(uColor, 1.0);
  }
`

function DisplacedSphere() {
  const materialRef = useRef<any>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0.3 },
      uColor: { value: new THREE.Color('hsl(var(--color-primary))') },
    },
    roughness: 0.3,
    metalness: 0.6,
  })

  return (
    <mesh material={material}>
      <icosahedronGeometry args={[1.5, 64]} />
    </mesh>
  )
}
```

### R3F Post-Processing Chain
```tsx
// Source: @react-three/postprocessing docs
'use client'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.9}
        luminanceSmoothing={0.025}
        intensity={0.5}
      />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  )
}
```

### R3F Scroll-Driven 3D (Camera + Scene)
```tsx
// Source: @react-three/drei useScroll
'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Float } from '@react-three/drei'
import * as THREE from 'three'

function ScrollScene() {
  const meshRef = useRef<THREE.Mesh>(null)
  const scroll = useScroll()

  useFrame((state) => {
    if (!meshRef.current) return
    const offset = scroll.offset // 0 to 1

    // Camera movement: orbit around object
    state.camera.position.x = Math.sin(offset * Math.PI * 2) * 5
    state.camera.position.z = Math.cos(offset * Math.PI * 2) * 5
    state.camera.lookAt(0, 0, 0)

    // Scene changes: material color shift based on scroll
    const hue = offset * 0.3 // shift through 30% of color wheel
    ;(meshRef.current.material as THREE.MeshStandardMaterial).color.setHSL(hue, 0.7, 0.5)

    // Morphing: scale changes with scroll
    meshRef.current.scale.setScalar(1 + offset * 0.5)
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial roughness={0.2} metalness={0.8} />
    </mesh>
  )
}

export function ScrollDriven3D() {
  return (
    <div className="h-[300vh]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ScrollControls pages={3} damping={0.25}>
          <ScrollScene />
        </ScrollControls>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
      </Canvas>
    </div>
  )
}
```

### Spline Embed with Next.js SSR Placeholder
```tsx
// Source: @splinetool/react-spline GitHub README
'use client'
import { lazy, Suspense, useCallback } from 'react'

// Lazy load for performance
const Spline = lazy(() => import('@splinetool/react-spline'))

function SplineScene({ sceneUrl }: { sceneUrl: string }) {
  const onLoad = useCallback((spline: any) => {
    // Access objects for DNA color mapping
    const primaryObj = spline.findObjectByName('PrimaryShape')
    if (primaryObj) {
      // Map DNA colors to Spline object materials
      // primaryObj.color = { r: 0.39, g: 0.4, b: 0.95 }
    }
  }, [])

  return (
    <Suspense fallback={
      <div className="aspect-video bg-surface animate-pulse rounded-xl" />
    }>
      <Spline
        scene={sceneUrl}
        onLoad={onLoad}
        className="w-full h-full"
      />
    </Suspense>
  )
}
```

### Remotion: DNA-Aware Hero Video Composition
```tsx
// Source: Remotion docs (interpolate, spring, Sequence, Composition)
import { useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion'

// Register in Root.tsx:
// <Composition id="HeroVideo" component={HeroVideo}
//   durationInFrames={150} fps={30} width={1920} height={1080}
//   defaultProps={{ headline: "...", colors: { primary: "...", accent: "..." } }} />

function HeroVideo({ headline, colors }: {
  headline: string
  colors: { primary: string; accent: string }
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Spring-based text entrance
  const titleSpring = spring({ frame, fps, config: { damping: 100 } })
  const titleY = interpolate(titleSpring, [0, 1], [80, 0])
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1])

  return (
    <div style={{
      width: '100%', height: '100%',
      background: colors.primary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Sequence from={10}>
        <h1 style={{
          fontSize: 80, fontWeight: 700, color: 'white',
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}>
          {headline}
        </h1>
      </Sequence>

      <Sequence from={40}>
        {/* Accent element entrance */}
        <div style={{
          position: 'absolute', bottom: 100,
          width: 200, height: 4,
          background: colors.accent,
          opacity: interpolate(frame - 40, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
        }} />
      </Sequence>
    </div>
  )
}
```

### SVG Noise Texture (Zero-JS)
```tsx
// Source: SVG spec / MDN feTurbulence
// Zero-JS noise overlay using browser-native Perlin noise
function NoiseOverlay({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}>
      <filter id="noise-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="4"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise-filter)" />
    </svg>
  )
}
```

## State of the Art

### Technology Changes Since v6.1.0

| Old (v6.1.0 era) | Current (2026) | Impact on Skills |
|-------------------|----------------|-----------------|
| WebGL only | WebGPU production-ready (~95% browser support) | Forward-looking section in 3D skill, automatic fallback via `three/webgpu` |
| Raw ShaderMaterial | THREE-CustomShaderMaterial (csm_Position, csm_DiffuseColor) | Shader examples should extend standard materials, not replace them |
| Hardcoded hex colors in shapes | DNA token enforcement | ALL shape code must use `hsl(var(--color-*))` or Tailwind DNA classes |
| No R3F post-processing | @react-three/postprocessing (EffectComposer) | Post-processing as standard building block, not custom framebuffer code |
| GSAP MorphSVG = paid | GSAP MorphSVG = free | Include morph patterns freely, no licensing caveats |
| GSAP DrawSVG = paid | GSAP DrawSVG = free | Include path drawing patterns freely |
| Three.js raw | R3F 9.5 stable + drei 10.7 | R3F is the standard React integration, not raw Three.js |
| R3F v8 (React 18) | R3F v9 (React 18+19), v10 alpha (WebGPU native) | Target v9 as stable, mention v10 as forward-looking |
| No Remotion | Remotion 4.0 | New capability for programmatic video from React components |
| No Spline integration | @splinetool/react-spline 4.1 | New capability for visual 3D scene embedding |
| Generic AI image prompts | DNA-informed prompt engineering | Structured prompt system tied to Design DNA attributes |
| Marketplace = manual browsing | 21st.dev = `npx shadcn add` | Component installation from registry via CLI |
| `import from 'framer-motion'` | `import from 'motion/react'` | Marketplace components referencing Framer Motion need import updates |

### R3F Ecosystem Current Versions

| Package | Version | Status |
|---------|---------|--------|
| @react-three/fiber | 9.5.x | Stable, React 18+19 |
| @react-three/drei | 10.7.x | Stable, companion utilities |
| @react-three/postprocessing | 3.x | Stable, effect chain management |
| three | r171+ | WebGPU production-ready |
| three-custom-shader-material | 6.x | Stable, material extension |
| @react-three/fiber | 10.0.0-alpha | Alpha, native WebGPU/TSL support |
| @react-three/drei | 11.0.0-alpha | Alpha, paired with R3F v10 |

### WebGPU Browser Support (2026)

| Browser | Version | WebGPU Status |
|---------|---------|---------------|
| Chrome | 113+ | Full support (since 2023) |
| Edge | 113+ | Full support (since 2023) |
| Firefox | 147+ | Full support (Jan 2026, unflagged) |
| Safari | 26+ | Full support (iOS 26, macOS Tahoe 26) |
| **Coverage** | | **~95% global users** |

Three.js WebGPURenderer automatically falls back to WebGL 2 when WebGPU is unavailable. No separate code paths needed for the remaining ~5%.

### Remotion Core API (v4.0.x)

| API | Purpose |
|-----|---------|
| `useCurrentFrame()` | Get current frame number (0-based) |
| `useVideoConfig()` | Get width, height, fps, durationInFrames |
| `interpolate(value, inputRange, outputRange, options?)` | Map values between ranges. Extrapolation: extend/clamp/wrap/identity |
| `spring({ frame, fps, config? })` | Physics-based animation (0 to 1) |
| `<Composition>` | Define a video with component + metadata |
| `<Still>` | Define a still image (single frame) |
| `<Sequence from? durationInFrames?>` | Time-shift children. Nested sequences accumulate `from` |
| `<Series>` | Display content sequentially |
| `Easing.*` | Easing functions for interpolate |

### Component Marketplace Landscape (2026)

| Marketplace | Technology | Strength | Integration |
|-------------|-----------|----------|-------------|
| Aceternity UI | Framer Motion + Tailwind | Premium animated components, dark UI | Copy-paste, some npm packages |
| Magic UI | shadcn + Tailwind | 50+ landing page components, startup-focused | Copy-paste, shadcn-based |
| 21st.dev | shadcn + Tailwind + Community | Open registry, community-contributed, AI-assisted remix | `npx shadcn add` from registry |
| Framer Marketplace | Framer-specific | Templates, motion components, plugins | Framer-specific, not directly portable |

**Deprecated/outdated from v6.1.0:**
- Hardcoded hex colors in geometry-shapes skill -- must use DNA tokens
- Basic Three.js examples without R3F/drei -- R3F is the standard
- No progressive enhancement for 3D -- three-tier pattern mandatory
- `import from 'framer-motion'` in marketplace component examples -- use `motion/react`
- No post-processing examples -- @react-three/postprocessing is standard
- No SVG animation via GSAP MorphSVG/DrawSVG -- these are now free and should be included

## Open Questions

### 1. Isometric/CSS Pseudo-3D: Shape Skill or 3D Skill?
- **What we know:** CSS 3D transforms (`perspective`, `rotateX/Y`) create isometric effects without WebGL. These are lightweight, zero-dependency. True 3D (R3F/Three.js) is heavyweight.
- **What's unclear:** Where to document CSS-based isometric illustrations.
- **Recommendation:** Place in the Shape & Asset Generation skill. Rationale: (1) CSS transforms are a shape/styling technique, not a WebGL technique; (2) isometric shapes use SVG/CSS, not Canvas/WebGL; (3) the 3D skill should focus on R3F/Three.js/WebGL/WebGPU. Document a cross-reference note in the 3D skill: "For CSS-based isometric effects, see Shape & Asset Generation skill."
- **Confidence: MEDIUM** -- This is a classification decision, not a technical one. Either placement works.

### 2. 3D Performance Budgets: Own Limits or Defer to Phase 5?
- **What we know:** Phase 5 creates a Performance-Aware Animation skill with general animation performance budgets. 3D has specific concerns (triangle count, texture memory, draw calls, GPU memory).
- **What's unclear:** Whether the 3D skill should define its own hard limits or reference Phase 5.
- **Recommendation:** The 3D skill should define 3D-specific budgets (triangle counts, texture sizes, max draw calls per tier) that Phase 5's skill doesn't cover. Reference Phase 5 for general principles (code-splitting, lazy loading, reduced-motion). The 3D budgets are domain-specific knowledge that belongs in the 3D skill.
- **Confidence: HIGH** -- Phase 5's performance skill covers animation, not 3D rendering budgets. Different concerns.

### 3. R3F v9 vs v10 for WebGPU Documentation
- **What we know:** R3F v9.5 is stable and production-ready. R3F v10 is alpha with native WebGPU/TSL support. Three.js r171+ supports WebGPU independently of R3F version.
- **What's unclear:** When R3F v10 will reach stable release.
- **Recommendation:** Target R3F v9 as the production recommendation. Include a "Forward-Looking: WebGPU" section that mentions Three.js `three/webgpu` import (works with v9 via raw Three.js) and R3F v10 alpha for native support. This keeps the skill production-safe while acknowledging the future.
- **Confidence: HIGH** -- Standard approach: document stable, mention upcoming.

### 4. Remotion Rendering Approach for Modulo
- **What we know:** Remotion can render videos server-side (headless Chrome + FFmpeg) or generate programmatic compositions for preview. In-browser preview via `@remotion/player`.
- **What's unclear:** Whether Modulo builders should generate full videos or just Remotion compositions for preview/further rendering.
- **Recommendation:** The skill should focus on composition creation (React components + Remotion APIs). Rendering is a deployment concern outside Modulo's scope. Document `@remotion/player` for in-browser preview so users can see their video compositions immediately. Leave server-side rendering as a note, not a core pattern.
- **Confidence: MEDIUM** -- This is a scope decision that might need user input.

### 5. Framer Marketplace Component Portability
- **What we know:** Framer marketplace components are designed for the Framer platform, not for general React use. Aceternity, Magic UI, and 21st.dev components are all React/Tailwind/shadcn-based and directly portable.
- **What's unclear:** How useful Framer marketplace coverage is when components aren't directly portable to Next.js/Astro.
- **Recommendation:** Document Framer marketplace as "design reference and inspiration" rather than "component source." Focus the actionable guidance on Aceternity, Magic UI, and 21st.dev which produce directly usable React components. Note that Framer marketplace components can inspire custom implementations but require complete rewrites for non-Framer projects.
- **Confidence: MEDIUM** -- User decision says "all four marketplaces covered equally," but practical portability differs significantly.

## Skill-Specific Research Findings

### 07-01: Shape & Asset Generation Skill

**Key changes from v6.1.0 geometry-shapes:**
1. DNA token enforcement -- all colors from tokens, never hardcoded hex
2. Purpose-primary taxonomy (dividers, backgrounds, accents, illustrations)
3. Per-archetype shape palettes with guided flexibility
4. Procedural generation via `simplex-noise` (not Math.random)
5. Full SVG animation suite: path drawing (DrawSVG), morphing (MorphSVG), particle systems, procedural noise, animated patterns, scroll-linked sequences
6. Beat-aware shape intensity: HOOK = bold/large, BREATHE = minimal/subtle, PEAK = complex/animated
7. Hybrid approach: utility components for core operations, algorithmic descriptions for complex compositions
8. Isometric/CSS pseudo-3D illustrations (from Claude's discretion decision)
9. ASCII art and dot matrix patterns

**Key libraries to document:**
- `simplex-noise` (4.x) for procedural generation
- GSAP DrawSVGPlugin (free) for path drawing
- GSAP MorphSVGPlugin (free) for shape morphing
- SVG `feTurbulence` for zero-JS noise textures
- SVG `<animate>` for declarative morphing
- CSS `clip-path` for simple geometric shapes

### 07-02: 3D/WebGL Effects Skill

**Key changes from v6.1.0 three-js-webgl:**
1. R3F v9 as standard (not raw Three.js)
2. drei 10.7 utilities as building blocks
3. THREE-CustomShaderMaterial for extending standard materials
4. @react-three/postprocessing for effect chains
5. Three-tier responsive: full (desktop), reduced (tablet), static fallback (mobile)
6. Comprehensive shader building blocks: noise, liquid, holographic, glass, particles, volumetric, post-processing, ray marching, displacement
7. Scroll-driven 3D: camera movement AND scene changes via drei useScroll
8. WebGPU forward-looking section (Three.js r171+, R3F v10 alpha)
9. DNA-guided materials with creative freedom for computed/derived colors
10. Performance budgets specific to 3D (triangle count, texture memory, draw calls)

**3D Performance Budget Recommendations:**
| Tier | Triangle Count | Texture Memory | Draw Calls | Target FPS |
|------|---------------|----------------|------------|------------|
| Full (desktop) | <500K | <128MB | <100 | 60fps |
| Reduced (tablet) | <100K | <64MB | <50 | 30fps |
| Static (mobile) | 0 (image) | 0 | 0 | N/A |

### 07-03: Component Marketplace Skill

**Key patterns to document:**
1. Category-level when-to-use matrix (archetype x beat -> component categories)
2. Per-marketplace strengths/weaknesses for each category
3. Full restyling protocol: CSS variable swaps + structural mods + animation restyling + archetype customization
4. Hard cap: 30% max marketplace-sourced visual elements
5. Installation via `npx shadcn add` (21st.dev) or copy-paste (Aceternity, Magic UI)
6. Import path updates: `motion/react` not `framer-motion` when restyling Aceternity components
7. Framer marketplace as design reference (not direct component source for Next.js/Astro)
8. DNA token integration: replace all hardcoded colors with token references during restyling

### 07-04: Remotion Skill

**Key patterns to document:**
1. Core API: useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Still, Composition
2. DNA-aware composition templates: colors from DNA palette, fonts from DNA typography, motion from DNA easing
3. Category templates: hero video, product demo, social media assets (OG images via Still)
4. Licensing: free for individuals/small companies (<=3 employees), company license for larger
5. Brownfield installation pattern for existing Next.js/Astro projects
6. @remotion/player for in-browser preview
7. Performance: compositions as React components, rendering is separate concern

### 07-05: Spline Integration Skill

**Key patterns to document:**
1. Basic embedding: `<Spline scene="url" />`
2. Next.js SSR with blurred placeholder: `import from '@splinetool/react-spline/next'`
3. Object manipulation: `spline.findObjectByName()`, position/color/material updates
4. Event handling: onSplineMouseDown, onSplineMouseHover, emitEvent()
5. Performance: lazy loading, renderOnDemand (default true), self-hosting .splinecode
6. DNA color mapping: programmatic color updates via Code API
7. R3F bridge: `@splinetool/r3f-spline` for Spline design + R3F shader control
8. Creation guidance: camera angles, lighting, materials that match DNA

### 07-06: Image Prompt Generation Skill

**Key patterns to document:**
1. DNA-to-prompt translation matrix (color, archetype, texture, signature element, motion)
2. Category templates: hero backgrounds, product shots, team portraits, abstract textures, illustrations
3. DNA-derived negative prompts from forbidden patterns
4. Anti-patterns: when NOT to use AI images (certain archetypes favor real photography)
5. Tool-agnostic format with optional tool-specific appendix (volatile)
6. Prompt structure: subject + style + mood + color + composition + negative
7. Consistency guidance: reference images, style locks, seed values (tool-specific)

## Sources

### Primary (HIGH confidence)
- @react-three/fiber npm (v9.5.x): https://www.npmjs.com/package/@react-three/fiber -- Current stable version
- @react-three/drei npm (v10.7.x): https://www.npmjs.com/package/@react-three/drei -- Companion utilities
- R3F installation docs: https://r3f.docs.pmnd.rs/getting-started/installation -- React 18+19 support, framework setup
- R3F v10 alpha release: https://github.com/pmndrs/react-three-fiber/releases/tag/v10.0.0-alpha.1 -- WebGPU/TSL support
- Three.js WebGPU migration guide: https://www.utsubo.com/blog/webgpu-threejs-migration-guide -- Import paths, async init, fallback behavior
- THREE-CustomShaderMaterial GitHub: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial -- csm_Position, csm_DiffuseColor API
- @react-three/postprocessing GitHub: https://github.com/pmndrs/react-postprocessing -- EffectComposer, Bloom, Noise, Vignette
- simplex-noise npm (v4.x): https://www.npmjs.com/package/simplex-noise -- API, createNoise2D, performance
- GSAP DrawSVG docs: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/ -- Path drawing API
- GSAP MorphSVG + DrawSVG free demos: https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/ -- Confirms free availability
- Remotion fundamentals: https://www.remotion.dev/docs/the-fundamentals -- useCurrentFrame, Composition
- Remotion interpolate API: https://www.remotion.dev/docs/interpolate -- interpolate(), extrapolation options
- Remotion Sequence API: https://www.remotion.dev/docs/sequence -- Time-shifting, nesting, props
- Remotion licensing: https://www.remotion.dev/docs/license -- Free for individuals/small companies
- @splinetool/react-spline GitHub: https://github.com/splinetool/react-spline -- React integration, Next.js SSR, event API
- @splinetool/react-spline npm (v4.1.0): https://www.npmjs.com/package/@splinetool/react-spline -- Current version

### Secondary (MEDIUM confidence)
- WebGPU 2026 browser support: https://byteiota.com/webgpu-2026-70-browser-support-15x-performance-gains/ -- ~95% coverage, Firefox 147+, Safari 26+
- Three.js 2026 changes: https://www.utsubo.com/blog/threejs-2026-what-changed -- r171 WebGPU production-ready
- Shader techniques (Maxime Heckel): https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/ -- Noise displacement, holographic
- Shader techniques (Codrops): https://tympanus.net/codrops/2025/11/26/creating-wavy-infinite-carousels-in-react-three-fiber-with-glsl-shaders/ -- Wavy displacement
- Liquid shaders (Montek): https://www.montek.dev/post/real-time-fluid-shaders-in-react-three-fiber-a-deep-dive-into-chai-cup-liquid -- Fluid simulation
- Holographic material: https://threejs-holographic-material.vercel.app/ -- Ready-to-use holographic for R3F
- Remotion brownfield docs: https://www.remotion.dev/docs/brownfield -- Existing project installation
- Marketplace comparisons (DEV.to): https://dev.to/joodi/top-7-ui-component-libraries-for-2025-copy-paste-and-create-1i84 -- Aceternity vs Magic UI landscape
- 21st.dev registry: https://github.com/serafimcloud/21st -- "npm for design engineers," shadcn-based
- AI image generation comparison: https://vertu.com/lifestyle/midjourney-vs-dall-e-3-vs-stable-diffusion-2025-ai-image-generation/ -- Platform prompting differences
- Three.js performance (Codrops): https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/ -- LOD, texture atlases

### Tertiary (LOW confidence)
- R3F v10 stable release timeline: Unknown. Alpha available, no stable date announced.
- Three.js TSL (Three Shader Language) maturity: New abstraction over WGSL/GLSL. May be premature for production documentation.
- Framer marketplace component portability: Community knowledge, not officially documented. Components are Framer-specific.
- AI image tool prompt syntax stability: Highly volatile. Midjourney, DALL-E, Flux parameters change frequently.

## Metadata

**Confidence breakdown:**
- Shape & SVG generation: HIGH -- simplex-noise, GSAP SVG plugins, SVG spec all verified via official sources
- 3D/WebGL technology stack: HIGH -- R3F, drei, postprocessing, CSM all verified via npm and official docs
- WebGPU status: HIGH -- Browser support and Three.js integration verified via multiple authoritative sources
- Shader patterns: MEDIUM -- Based on Codrops tutorials and community resources, not official Three.js docs
- Component marketplace landscape: MEDIUM -- Marketplace inventories evolve; category-level guidance is more durable
- Remotion API: HIGH -- Verified from official Remotion docs
- Remotion licensing: HIGH -- Verified from official license page
- Spline integration: HIGH -- Verified from official GitHub README and npm
- AI image prompt engineering: MEDIUM -- Best practices from community, not authoritative standards
- Performance budgets for 3D: MEDIUM -- Based on industry guidelines, not benchmarked data

**Research date:** 2026-02-24
**Valid until:** 45 days (R3F ecosystem moderately active; WebGPU support now stable; marketplace inventories change frequently; AI image tool landscape highly volatile)
