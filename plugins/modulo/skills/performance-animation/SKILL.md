---
name: performance-animation
description: "Performance-aware animation system. CWV compliance alongside heavy animation, CSS-first compositor-thread defaults, auto code-splitting, font loading strategy, performance budgets per library."
tier: core
triggers: "animation performance, CWV, core web vitals, code splitting, lazy load animation, font loading, will-change, FPS, jank, compositor thread, bundle size, animation budget"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Choosing animation approach** -- Reference the Animation Performance Hierarchy to pick the lowest-cost tier that achieves the effect
- **Adding a heavy library** (Three.js, Rive, GSAP with plugins) -- Follow code-splitting patterns to avoid LCP/INP damage
- **Font selection and loading** -- Apply font loading strategy per framework (Next.js, Astro)
- **Performance audit** -- Use the budgets table to check total animation JS per page
- **Reviewing builder output** -- Verify will-change discipline, compositor-thread preference, and dynamic imports

### When NOT to Use

- **General image/SSR/caching performance** -- Use `skills/performance-guardian/SKILL.md` instead (non-animation web performance)
- **Choosing which animation to build** -- Use `skills/cinematic-motion/SKILL.md` for motion vocabulary and archetype profiles
- **Implementing a wow moment** -- Use `skills/wow-moments/SKILL.md` for patterns, then return here for loading strategy

### Animation Performance Hierarchy

Always use the lowest tier that achieves the desired effect:

```
Tier 0: CSS-only (compositor thread, 0 KB JS)
  - CSS transitions (Tailwind classes)
  - CSS @keyframes
  - CSS scroll-driven animations (@supports)

Tier 1: Lightweight JS (~15-25 KB gzipped)
  - Motion library (tree-shaken with LazyMotion + domAnimation)
  - Intersection Observer (native, 0 KB added)

Tier 2: Medium JS (~25-40 KB gzipped)
  - GSAP core (~25 KB)
  - GSAP + ScrollTrigger + SplitText (~40 KB)

Tier 3: Heavy JS (~150+ KB gzipped) -- ALWAYS code-split
  - React Three Fiber + Three.js (~150 KB+)
  - Rive runtime (~100 KB)
  - Complex GSAP with all plugins (~60 KB)
  - dotLottie player (~50 KB)
```

**Rule:** Never import Tier 2+ on initial page load unless the animation is above the fold AND critical to the HOOK beat. Below-fold Tier 2+ content MUST be dynamically imported.

### CWV Impact Assessment

| CWV Metric | Animation Risk | Mitigation |
|------------|---------------|------------|
| **LCP** | JS-heavy animations blocking render | Code-split, defer non-critical animations, preload fonts |
| **INP** | Animation JS blocking main thread | Use compositor-thread CSS, requestAnimationFrame for JS |
| **CLS** | Elements shifting during animation setup | Reserve layout space, use `transform` (not `width`/`height`) |

### When to Code-Split (Mandatory)

These imports MUST use dynamic `import()`:

- ANY import of Three.js, React Three Fiber, @react-three/drei
- GSAP with 3+ plugins
- Rive runtime (@rive-app/react-canvas)
- dotLottie player (@lottiefiles/dotlottie-react)
- Motion library when used in only 1-2 sections (not site-wide)

**Rule:** If a library is used in only 1-2 sections, it MUST be dynamically imported when that section enters the viewport.

### Pipeline Connection

- **Referenced by:** build-orchestrator during Wave 0 scaffold generation (font loading, reduced-motion baseline)
- **Referenced by:** section-builder during implementation (code-splitting, will-change, compositor-thread)
- **Referenced by:** quality-reviewer during post-build audit (budget compliance, CWV impact)

## Layer 2: Award-Winning Examples

### CSS Compositor-Thread Patterns

CSS scroll-driven animations run on the compositor thread, separate from the main thread. They cannot cause jank even during heavy JS execution.

**Properties that run on compositor (SAFE):** `transform`, `opacity`, `filter`, `clip-path`
**Properties that DON'T (JANK RISK):** `width`, `height`, `top`, `left`, `margin`, `padding`, `background-color`

```css
/* Scroll-driven entrance reveal -- zero JS, compositor thread */
@keyframes scroll-reveal {
  from { opacity: 0; transform: translateY(2rem); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal-on-scroll {
  animation: scroll-reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

/* Progressive enhancement -- unsupported browsers see static content */
@supports not (animation-timeline: view()) {
  .reveal-on-scroll {
    opacity: 1;
    transform: none;
  }
}
```

```css
/* Scroll progress bar -- zero JS */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--color-primary);
  transform-origin: left;
  animation: grow-bar linear;
  animation-timeline: scroll();
}

@keyframes grow-bar {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

**Why CSS is the default:** These animations are scheduled by the browser's compositor, which runs on a dedicated GPU thread. Even if the main thread is busy parsing JS or running React reconciliation, compositor animations stay at 60fps. This is why the cinematic-motion decision tree defaults to CSS.

### Code-Splitting Patterns

#### Dynamic Import for GSAP (viewport-triggered)

```tsx
'use client'
import { useEffect, useRef } from 'react'

function HeavyScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          const gsap = (await import('gsap')).default
          const { ScrollTrigger } = await import('gsap/ScrollTrigger')
          gsap.registerPlugin(ScrollTrigger)

          gsap.from(ref.current!.querySelectorAll('.animate-item'), {
            y: 60,
            opacity: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 80%',
            },
          })

          observer.disconnect()
        }
      },
      { rootMargin: '200px' } // Start loading 200px before viewport
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref}>
      <div className="animate-item">...</div>
      <div className="animate-item">...</div>
    </section>
  )
}
```

#### LazyMotion for Tree-Shaken Motion Library

```tsx
import { LazyMotion, domAnimation, m } from 'motion/react'

// domAnimation: ~15 KB (basic animations -- transitions, variants, exit)
// domMax: ~25 KB (full feature set including layout animations)
function App({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}

// Use <m.div> instead of <motion.div> with LazyMotion
function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </m.div>
  )
}
```

**When to use `domAnimation` vs `domMax`:**
- `domAnimation` (~15 KB): Covers transitions, variants, whileInView, AnimatePresence exit. Sufficient for 90% of section animations.
- `domMax` (~25 KB): Adds layout animations (`layout` prop), drag, and path animations. Only needed for shared-element transitions or drag interactions.

#### Next.js Dynamic Import for React Three Fiber

```tsx
import dynamic from 'next/dynamic'

const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[400px] bg-surface animate-pulse rounded-xl"
      aria-label="Loading 3D scene"
    />
  ),
})

// Usage -- only loads Three.js bundle when this component renders
function HeroSection() {
  return (
    <section className="relative min-h-screen">
      <Scene3D />
      <div className="relative z-10">
        <h1>Hero content overlaying 3D</h1>
      </div>
    </section>
  )
}
```

#### Rive and dotLottie Dynamic Imports

```tsx
import dynamic from 'next/dynamic'

// Rive (~100 KB) -- always code-split
const RiveAnimation = dynamic(
  () => import('@/components/RiveAnimation'),
  { ssr: false, loading: () => <div className="w-64 h-64 bg-surface animate-pulse" /> }
)

// dotLottie (~50 KB) -- code-split for below-fold
const LottieIcon = dynamic(
  () => import('@/components/LottieIcon'),
  { ssr: false, loading: () => <div className="w-16 h-16" /> }
)
```

### will-change Discipline

**NEVER** apply `will-change` in CSS stylesheets permanently. Apply dynamically before animation, remove after:

```tsx
// Apply before animation, remove after completion
function animateWithWillChange(element: HTMLElement) {
  element.style.willChange = 'transform, opacity'

  // Animate (GSAP example)
  gsap.to(element, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    onComplete: () => {
      element.style.willChange = 'auto'
    },
  })
}

// CSS transition version
function prepareTransition(element: HTMLElement) {
  element.style.willChange = 'transform, opacity'

  element.addEventListener(
    'transitionend',
    () => { element.style.willChange = 'auto' },
    { once: true }
  )
}
```

**Why:** Each `will-change` declaration creates a compositor layer consuming GPU memory. 20+ elements with permanent `will-change` causes memory pressure, compositing overhead, and can actually REDUCE performance. Mobile devices are especially vulnerable.

**Exception:** Elements that are ALWAYS animating (ambient background loop, loading spinner, persistent scroll-progress bar) can retain `will-change`.

**Budget:** Maximum 10 elements with active `will-change` at any time.

### Font Loading Strategy

Fonts are a critical performance concern because display fonts directly affect LCP.

#### Next.js: Use `next/font`

Automatic subsetting, self-hosting, and `font-display: swap`:

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const display = localFont({
  src: '../public/fonts/ClashDisplay-Variable.woff2',
  variable: '--font-display',
  display: 'swap',
  preload: true, // Display font used above fold
})

const mono = localFont({
  src: '../public/fonts/JetBrainsMono-Variable.woff2',
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

#### Astro: Use `@fontsource` Packages

Self-hosted variable fonts with zero external requests:

```astro
---
// src/layouts/Base.astro
import '@fontsource-variable/inter'
import '@fontsource-variable/playfair-display'
---

<html>
  <head>
    <style>
      :root {
        --font-body: 'Inter Variable', sans-serif;
        --font-display: 'Playfair Display Variable', serif;
      }
    </style>
  </head>
  <body><slot /></body>
</html>
```

#### Font Loading Rules

| Rule | Rationale |
|------|-----------|
| Always use variable fonts when available | 1 file replaces multiple weight files |
| Always self-host (no Google Fonts CDN) | Eliminates extra DNS lookup and privacy concerns |
| Always set `font-display: swap` | Text visible immediately, font swaps in when loaded |
| Preload the display font if used above the fold | Display font in HOOK headline = LCP element |
| Maximum 3 font families per project | display + body + mono covers all needs |

#### Font Size Budget

| Font Role | Max Size (woff2) |
|-----------|-----------------|
| Display (variable) | < 80 KB |
| Body (variable) | < 60 KB |
| Mono (variable, if used) | < 50 KB |
| **Total fonts** | **< 150 KB** |

### Performance Budgets

Concrete budgets per animation approach:

| Approach | JS Budget (gzipped) | Load Strategy | Max Animated Elements |
|----------|---------------------|---------------|----------------------|
| CSS transitions | 0 KB | Inline in stylesheet | Unlimited |
| CSS scroll-driven | 0 KB | Inline in stylesheet | Unlimited |
| CSS @keyframes | 0 KB | Inline in stylesheet | Unlimited |
| Motion (LazyMotion + domAnimation) | ~15 KB | Bundled (tree-shaken) | Unlimited |
| Motion (domMax) | ~25 KB | Bundled | Unlimited |
| GSAP core | ~25 KB | Code-split if section-only | 50+ per page OK |
| GSAP + ScrollTrigger + SplitText | ~40 KB | Code-split | 50+ per page OK |
| GSAP + all plugins | ~60 KB | Code-split | Per-plugin limits apply |
| Rive | ~100 KB | ALWAYS code-split | 2-3 per page |
| dotLottie | ~50 KB | Code-split | 3-5 per page |
| R3F + Three.js | ~150+ KB | ALWAYS code-split, ssr: false | 1 scene per page |

**Total animation JS budget per page:** aim for < 80 KB gzipped initial load (excluding on-demand code-split chunks that load when sections enter viewport).

### Reduced Motion as Performance Boost

`prefers-reduced-motion` is both an accessibility requirement and a performance optimization:

```css
/* globals.css -- baseline reduced-motion override */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Include this in `globals.css` as a baseline. Individual components can override with more nuanced reduced-motion alternatives (e.g., fade-only instead of slide+fade). The baseline ensures that even if a component forgets its own reduced-motion handling, animations are effectively disabled.

**Performance benefits of reduced motion:**
- Eliminates Motion library re-renders
- Removes GPU compositing overhead
- Improves battery life on mobile
- Frees main thread from animation scheduling

### Animation FPS Monitoring

Development-time FPS monitoring for catching jank during implementation:

```tsx
// utils/dev-fps.ts -- import in root layout during development only
export function startFPSMonitor() {
  if (process.env.NODE_ENV !== 'development') return

  let lastTime = performance.now()
  let frames = 0

  function check() {
    frames++
    const now = performance.now()
    if (now - lastTime >= 1000) {
      const fps = Math.round((frames * 1000) / (now - lastTime))
      if (fps < 30) {
        console.warn(
          `[Modulo] Low FPS: ${fps}fps -- check for layout-triggering animations or excessive will-change`
        )
      }
      frames = 0
      lastTime = now
    }
    requestAnimationFrame(check)
  }

  requestAnimationFrame(check)
}
```

**Targets:**
- 60fps: Target for all animations
- 30fps: Minimum acceptable -- below this triggers investigation
- < 30fps sustained for 2s: Consider downgrading the animation (e.g., 3D scene to static image fallback)

## Layer 3: Integration Context

### Skill Connections

- **-> Cinematic Motion:** The CSS-first decision tree in Cinematic Motion IS a performance decision. This skill provides the WHY behind that default (compositor thread, zero main-thread cost).
- **-> Wow Moments:** Tier 3 wow moments (WebGL, Rive, dotLottie) require code-splitting documented here. This skill provides the exact loading patterns the wow moment implementations should use.
- **-> Design System Scaffold:** The scaffold generates `globals.css` with the reduced-motion baseline and font loading setup. This skill provides the rationale and constraints.
- **-> Quality Gates (Phase 4):** Live browser testing checks Lighthouse scores and FPS. This skill provides the budgets those gates enforce against.
- **-> Page Transitions:** View Transitions API is zero-JS overhead (browser-native). AnimatePresence adds Motion bundle. This skill informs the performance tradeoff behind that choice.
- **-> Performance Guardian:** Non-animation performance (images, SSR, caching, bundle analysis) remains in performance-guardian. No duplication -- animation performance lives here.

### DNA Token Usage

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--font-display` | Font loading: preloaded for above-fold headlines (LCP) |
| `--font-body` | Font loading: loaded with swap, self-hosted |
| `--font-mono` | Font loading: loaded only if used, optional |
| `--motion-*` tokens | Performance hierarchy determines which library implements them |
| `--ease-*` tokens | CSS easing = compositor thread; JS easing = main thread cost |

### Pipeline Stage

- **Input from:** Design DNA (font families, motion tokens), Cinematic Motion (selected animation approach per section)
- **Output to:** Section builders (loading patterns, budget constraints), Quality reviewer (enforcement thresholds)

## Layer 4: Anti-Patterns

### Anti-Pattern: Importing Everything at Top Level

**What goes wrong:** `import gsap from 'gsap'` at the top level of `layout.tsx` when only one section uses GSAP. Adds 25-40 KB to EVERY page load, even pages with no GSAP animations.
**Instead:** Dynamic import when the section enters the viewport. Use IntersectionObserver with 200px rootMargin for preloading.

### Anti-Pattern: will-change on Everything

**What goes wrong:** `will-change: transform` in global CSS for an `.animate` class applied to 30+ elements. Creates 30 compositor layers, consuming GPU memory and actually REDUCING performance through compositing overhead.
**Instead:** Apply `will-change` dynamically via JS before animation, remove it in the `onComplete` callback. Budget: max 10 active `will-change` elements at once.

### Anti-Pattern: Google Fonts CDN Link

**What goes wrong:** `<link href="fonts.googleapis.com/...">` in the document head. Adds an extra DNS lookup (~100ms), gives no subsetting control, and introduces privacy concerns (Google tracks font requests).
**Instead:** Self-host via `next/font` (Next.js) or `@fontsource` packages (Astro). Automatic subsetting, zero external requests, better caching.

### Anti-Pattern: Layout-Triggering Animations

**What goes wrong:** Animating `width`, `height`, `top`, `left`, `margin`, or `padding`. Forces the browser to recalculate layout for EVERY frame, causing jank on complex pages.
**Instead:** Use `transform` for ALL positional and size animations. `translateX`/`translateY` for movement, `scale` for size changes. These run on the compositor thread.

### Anti-Pattern: Motion Without LazyMotion

**What goes wrong:** Importing the full `motion/react` module (`motion.div`) when only using basic transitions and variants. Ships ~25 KB when ~15 KB would suffice.
**Instead:** Use `LazyMotion` with `domAnimation` features and `m` component. Only upgrade to `domMax` if layout animations or drag are required.

### Anti-Pattern: Three.js Without SSR Disable

**What goes wrong:** Importing React Three Fiber in a server component or without `ssr: false` in a dynamic import. Crashes during server-side rendering (Three.js requires `window`, `document`, WebGL context). Also adds ~150 KB to the initial server bundle unnecessarily.
**Instead:** Always use `dynamic(() => import(...), { ssr: false })` for any R3F component. Provide a loading skeleton that matches the final dimensions to prevent CLS.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| animation_js_budget_initial | 0 | 80 | KB gzipped | HARD -- code-split if exceeded |
| will_change_active_elements | 0 | 10 | count | HARD -- remove after animation |
| font_families | 1 | 3 | count | HARD -- display + body + mono max |
| font_total_size | 0 | 150 | KB woff2 | HARD -- subset if exceeded |
| fps_minimum | 30 | - | fps | HARD -- investigate if below |
| fps_target | 60 | - | fps | SOFT -- aim for 60, accept 30+ |
| r3f_scenes_per_page | 0 | 1 | count | HARD -- code-split, ssr: false |
| rive_instances_per_page | 0 | 3 | count | SOFT -- code-split each |
| lottie_instances_per_page | 0 | 5 | count | SOFT -- code-split each |
| tier2_above_fold | 0 | 1 | count | HARD -- only if HOOK-critical |
