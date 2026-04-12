---
name: page-transitions
description: "Page transition system covering View Transitions API (native), Motion AnimatePresence, shared element transitions, and per-archetype transition choreography."
tier: domain
triggers: "page transition, route transition, view transition, navigate, page change, route change, shared element, AnimatePresence, crossfade, slide transition"
version: "2.0.0"
metadata:
  pathPatterns:
    - "**/*.tsx"
    - "**/*.jsx"
    - "**/*.astro"
---

## Layer 1: Decision Guidance

You are a motion director specializing in the moment between pages. Page transitions are the connective tissue of multi-page experiences -- they maintain spatial coherence, communicate navigation direction, and set the emotional tone for incoming content. A site with no page transitions feels disconnected. A site with wrong transitions feels disorienting. The right transition is invisible in the best way: users feel continuity without noticing the mechanism.

### Page Transition Decision Tree

```
Is this an Astro project?
  YES -> Use View Transitions API (stable, zero-JS, built-in)
  NO -> Is this Next.js?
    YES -> Is the project risk-tolerant (experimental features OK)?
      YES -> Use View Transitions API (experimental) with AnimatePresence fallback
      NO -> Use AnimatePresence (reliable, production-ready)
    NO -> Is this a React SPA (Vite, CRA)?
      YES -> Use AnimatePresence (works everywhere React works)
      NO -> Use View Transitions API via document.startViewTransition()

Do you need shared element morphing between routes?
  YES -> Is the project React-based?
    YES -> Use Motion layoutId (FLIP animation between routes)
    NO -> Use CSS view-transition-name (Astro, vanilla)
  NO -> Standard page enter/exit is sufficient

Is this a complex multi-element choreographed transition?
  YES -> Use GSAP Flip plugin (timeline control, multiple morphing elements)
  NO -> Standard approach from above is sufficient
```

### Framework Maturity Matrix

| Framework | View Transitions API | AnimatePresence | Shared Elements |
|-----------|---------------------|-----------------|-----------------|
| Astro | **Stable**, built-in `<ViewTransitions />`, zero-JS | Not applicable (not React by default) | Via CSS `view-transition-name` |
| Next.js App Router | **Experimental** (15.2+), may change, NOT recommended for production | **Stable**, recommended primary approach | Via Motion `layoutId` |
| React/Vite SPA | Via `document.startViewTransition()` (manual) | **Stable** | Via Motion `layoutId` |
| Tauri/Electron | Via `document.startViewTransition()` (Chromium) | **Stable** | Via Motion `layoutId` |

**IMPORTANT:** Next.js docs (v16.1.6) explicitly state View Transitions are "experimental and subject to change, not recommended for production." Always provide an AnimatePresence fallback when using View Transitions in Next.js.

### Per-Archetype Transition Choreography

Every archetype has a default page transition style. Builders use these unless the creative director overrides for a specific project.

| # | Archetype | Style | Duration | Easing | Notes |
|---|-----------|-------|----------|--------|-------|
| 1 | Brutalist | Instant cut | 0ms | none | No transition. Raw. Maybe a flash of accent color between pages |
| 2 | Ethereal | Dissolve with blur | 500-600ms | ease-in-out | `filter: blur()` fades from 8px to 0 on enter. Dreamy, slow |
| 3 | Kinetic | Directional slide | 300-400ms | cubic-bezier(0.16, 1, 0.3, 1) | Slide in navigation direction (forward=left, back=right) |
| 4 | Editorial | Vertical wipe/reveal | 400-500ms | ease-out | Content reveals from top down, like turning a page |
| 5 | Neo-Corporate | Clean crossfade | 300-400ms | ease-out | Subtle opacity + slight y-shift. Professional, unobtrusive |
| 6 | Organic | Soft fade with scale | 400-500ms | ease-in-out | Gentle scale from 0.98 to 1.0 with opacity |
| 7 | Retro-Future | CRT scan line | 300-500ms | linear | Horizontal scan line sweeps across, old content out, new in |
| 8 | Luxury/Fashion | Slow crossfade with scale | 600-800ms | cubic-bezier(0.4, 0, 0.2, 1) | Longest transition. Scale from 0.97 to 1.0. Deliberate luxury |
| 9 | Playful/Startup | Bouncy slide | 300-400ms | cubic-bezier(0.34, 1.56, 0.64, 1) | Slight overshoot on enter. Energetic personality |
| 10 | Data-Dense | Instant or minimal fade | 100-200ms | ease-out | Fast. Data users want content, not transitions |
| 11 | Japanese Minimal | Gentle fade | 400-500ms | ease-in-out | Pure opacity. No movement. Stillness is the point |
| 12 | Glassmorphism | Blur crossfade | 400-500ms | ease-out | Background blur shifts, surfaces dissolve and reform |
| 13 | Neon Noir | Glitch/static | 300-500ms | steps(8) or custom | Brief glitch (translateX/Y jitter for 100ms) before content appears |
| 14 | Warm Artisan | Warm crossfade | 400-500ms | ease-in-out | Soft opacity with warm background color visible during transition |
| 15 | Swiss/International | Clean horizontal slide | 300ms | ease-out | Crisp, precise. Grid-aligned slide direction |
| 16 | Vaporwave | Chromatic shift | 400-600ms | ease-in-out | RGB channel separation during transition, then merge on settle |
| 17 | Neubrutalism | Hard cut with flash | 50-100ms | steps(1) | Near-instant. Brief flash of primary/accent color between pages |
| 18 | Dark Academia | Page turn fade | 500-600ms | ease-in-out | Slight rotation (1-2deg) with opacity, like turning a book page |
| 19 | AI-Native | Data dissolve | 300-400ms | ease-out | Elements break into particles/pixels briefly, then reform. Digital matter |

### When NOT to Transition

- **First page load** -- No exit animation on initial load. Only play entrance animation
- **Same-page anchor links** -- Scroll to target, do not trigger page transition
- **Modal/dialog open/close** -- Use AnimatePresence locally on the modal, not page-level transition
- **Back navigation** -- Must feel different from forward. Reverse the direction or use a distinct easing
- **Rapid navigation** -- If user clicks multiple links quickly, cancel in-progress transitions. Never queue them
- **Reduced motion preference** -- `prefers-reduced-motion: reduce` disables all transitions. Content appears instantly

### Transition Duration Guidelines

| Category | Range | Archetypes |
|----------|-------|------------|
| Instant | 0-100ms | Brutalist, Neubrutalism, Data-Dense |
| Fast | 200-400ms | Kinetic, Swiss, Neo-Corporate, AI-Native, Playful |
| Medium | 400-600ms | Editorial, Ethereal, Organic, Japanese Minimal, Glassmorphism, Warm Artisan, Neon Noir, Vaporwave, Dark Academia, Retro-Future |
| Slow | 600-800ms | Luxury/Fashion only |

**Rule:** If a transition exceeds 500ms and the archetype is not Luxury/Fashion, Ethereal, or Dark Academia, it is too slow. Users perceive transitions over 400ms as deliberate delay -- only archetypes that trade on deliberateness should use them.

## Layer 2: Award-Winning Examples

### Pattern 1: View Transitions API -- Astro (Stable)

The gold standard for page transitions. Zero JavaScript. Browser-native morphing. Astro has full, stable support.

```astro
---
// src/layouts/BaseLayout.astro
// Import ViewTransitions component
import { ViewTransitions } from 'astro:transitions'
---
<html lang="en">
  <head>
    <ViewTransitions />
  </head>
  <body>
    <!-- Content inherits view transitions automatically -->
    <slot />
  </body>
</html>
```

```astro
---
// src/pages/blog/[slug].astro
// Shared element: hero image morphs from list to detail
---
<img
  src={post.image}
  alt={post.title}
  transition:name={`hero-${post.slug}`}
  transition:animate="fade"
/>
<h1 transition:name={`title-${post.slug}`}>
  {post.title}
</h1>
```

```css
/* Custom transition animation (overrides default) */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-out forwards;
}
::view-transition-new(root) {
  animation: fade-in 0.3s ease-out forwards;
}

/* Per-element transitions */
::view-transition-old(hero-image) {
  animation: scale-down 0.4s ease-out forwards;
}
::view-transition-new(hero-image) {
  animation: scale-up 0.4s ease-out forwards;
}

@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in { from { opacity: 0; } }
@keyframes scale-down { to { transform: scale(0.95); opacity: 0; } }
@keyframes scale-up { from { transform: scale(1.05); opacity: 0; } }
```

```astro
---
// Lifecycle hooks for advanced control
---
<script>
  document.addEventListener('astro:before-swap', (event) => {
    // Runs before DOM swap -- save scroll positions, pause media, etc.
  })

  document.addEventListener('astro:after-swap', (event) => {
    // Runs after DOM swap -- reinitialize JS, resume media, etc.
  })

  document.addEventListener('astro:page-load', (event) => {
    // Runs after full page load -- equivalent to DOMContentLoaded for transitioned pages
  })
</script>
```

### Pattern 2: View Transitions API -- Next.js (Experimental)

**WARNING: This API is experimental in Next.js and subject to change. Use AnimatePresence as the primary approach with View Transitions as progressive enhancement.**

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
```

```tsx
// app/components/NavigationLink.tsx
'use client'
import { ViewTransition, useTransitionRouter } from 'react'
import Link from 'next/link'

// Wrap elements that participate in view transitions
export function ProductCard({ product }: { product: Product }) {
  return (
    <ViewTransition name={`product-${product.id}`}>
      <Link href={`/products/${product.id}`}>
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
      </Link>
    </ViewTransition>
  )
}
```

```tsx
// Feature detection with AnimatePresence fallback
'use client'
import { AnimatePresence, motion } from 'motion/react'

const supportsViewTransitions =
  typeof document !== 'undefined' &&
  'startViewTransition' in document

// If View Transitions API is available, the browser handles it natively
// via next.config.ts experimental flag. AnimatePresence is the fallback
// for browsers without support.
export function PageTransitionWrapper({
  children,
  pathname,
}: {
  children: React.ReactNode
  pathname: string
}) {
  if (supportsViewTransitions) {
    // Browser + Next.js handle transitions natively
    return <>{children}</>
  }

  // Fallback: AnimatePresence handles enter/exit
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Pattern 3: Motion AnimatePresence (Production-Ready)

The reliable, battle-tested approach for page transitions in React. Works everywhere React works.

```tsx
// app/layout.tsx -- The transition wrapper
'use client'
import { AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'

export default function TransitionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      {/*
        mode="wait": exit animation completes before enter starts (most common)
        mode="popLayout": exiting element popped from layout flow (overlapping)
        mode="sync": enter and exit happen simultaneously
      */}
      <div key={pathname}>
        {children}
      </div>
    </AnimatePresence>
  )
}
```

```tsx
// app/page.tsx (or any page) -- Motion wrapper per page
'use client'
import { motion } from 'motion/react'

// Archetype-specific variants -- select based on project archetype
const variants = {
  // Luxury/Fashion: slow crossfade with scale
  luxury: {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  },
  // Kinetic: directional slide
  kinetic: {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  // Neo-Corporate: clean crossfade with y-shift
  neoCorporate: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  // Japanese Minimal: pure fade
  japaneseMinimal: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.45, ease: 'easeInOut' },
  },
  // Editorial: vertical reveal
  editorial: {
    initial: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    animate: { opacity: 1, clipPath: 'inset(0 0 0% 0)' },
    exit: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
}

export default function Page() {
  // Select variant based on project archetype (from DNA/config)
  const variant = variants.neoCorporate

  return (
    <motion.main
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={variant.transition}
    >
      {/* Page content */}
    </motion.main>
  )
}
```

```tsx
// Handling back vs forward navigation direction
'use client'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useRef, useEffect } from 'react'

function useNavigationDirection() {
  const pathname = usePathname()
  const history = useRef<string[]>([])

  useEffect(() => {
    history.current.push(pathname)
  }, [pathname])

  // If the new path was already in history, user is going back
  const isBack = history.current.slice(0, -1).includes(pathname)
  return isBack ? -1 : 1
}

export function DirectionalTransition({ children }: { children: React.ReactNode }) {
  const direction = useNavigationDirection()

  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -100 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

### Pattern 4: Shared Element Transitions (Motion layoutId)

FLIP animations that morph elements between routes. The most impressive transition technique -- an image card on a list page morphs seamlessly into the hero image on a detail page.

```tsx
// app/products/page.tsx -- List page
'use client'
import { motion } from 'motion/react'
import Link from 'next/link'

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <motion.div layoutId={`card-${product.id}`} className="rounded-2xl overflow-hidden">
            <motion.img
              layoutId={`image-${product.id}`}
              src={product.image}
              alt={product.name}
              className="w-full aspect-[4/3] object-cover"
            />
            <motion.h3
              layoutId={`title-${product.id}`}
              className="p-4 text-lg font-display"
            >
              {product.name}
            </motion.h3>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}
```

```tsx
// app/products/[id]/page.tsx -- Detail page
'use client'
import { motion } from 'motion/react'

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <article>
      <motion.div layoutId={`card-${product.id}`} className="w-full">
        <motion.img
          layoutId={`image-${product.id}`}
          src={product.image}
          alt={product.name}
          className="w-full aspect-[16/9] object-cover"
          // layout="position" for position-only animation (avoids width/height stretch)
        />
        <motion.h1
          layoutId={`title-${product.id}`}
          className="text-5xl font-display mt-8"
        >
          {product.name}
        </motion.h1>
      </motion.div>

      {/* Non-shared content fades in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <p className="text-body mt-6">{product.description}</p>
      </motion.div>
    </article>
  )
}
```

**Performance constraints for shared elements:**
- **Maximum 2-3 shared elements per transition.** More causes layout thrashing and visual chaos.
- Use `layout="position"` when you only need position animation (avoids width/height interpolation artifacts).
- Shared images should have explicit `aspect-ratio` or fixed dimensions to prevent jarring size changes.
- Wrap shared element pairs in `<AnimatePresence mode="wait">` at the layout level.

### Pattern 5: GSAP Flip Plugin (Complex Choreography)

For transitions that need timeline control beyond what AnimatePresence offers -- multiple elements morphing with staggered timing, or non-React contexts.

```tsx
// Complex grid-to-detail transition with GSAP Flip
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

export function FlipTransition({
  isDetail,
  children,
}: {
  isDetail: boolean
  children: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Capture current state of all flip-target elements
    const state = Flip.getState('.flip-target')

    // DOM changes happen (React re-render changes layout)
    // Then GSAP animates from captured state to new state
    Flip.from(state, {
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.05,       // Elements animate with stagger
      absolute: true,       // Use absolute positioning during animation
      onComplete: () => {
        // Clean up after transition
      },
    })
  }, [isDetail])

  return <div ref={containerRef}>{children}</div>
}
```

**Use GSAP Flip when:**
- 4+ elements need to morph simultaneously with staggered timing
- The transition involves non-React DOM elements (e.g., Astro islands)
- You need timeline-level control (pause, reverse, progress scrubbing)
- AnimatePresence cannot express the choreography

### Pattern 6: Per-Archetype Choreography Implementations

Complete transition variant objects ready for use with AnimatePresence.

```tsx
// Brutalist: instant cut (no animation, optional accent flash)
const brutalist = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
  transition: { duration: 0 },
}
// For the accent flash variant:
// Render a full-screen div with bg-accent for 1 frame between pages
```

```tsx
// Luxury/Fashion: slow crossfade with scale
const luxury = {
  initial: { opacity: 0, scale: 0.97, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(2px)' },
  transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
}
```

```tsx
// Neon Noir: glitch effect before fade
const neonNoir = {
  initial: { opacity: 0, x: 0, y: 0 },
  animate: {
    opacity: 1,
    x: [0, -3, 5, -2, 0],   // Glitch jitter on enter
    y: [0, 2, -4, 1, 0],
    transition: {
      opacity: { duration: 0.3 },
      x: { duration: 0.15, ease: 'linear' },
      y: { duration: 0.15, ease: 'linear' },
    },
  },
  exit: {
    opacity: 0,
    filter: 'saturate(3) hue-rotate(30deg)',
    transition: { duration: 0.2 },
  },
}
```

```tsx
// Ethereal: dissolve with blur
const ethereal = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(8px)' },
  transition: { duration: 0.55, ease: 'easeInOut' },
}
```

```tsx
// Dark Academia: page turn effect
const darkAcademia = {
  initial: { opacity: 0, rotateY: -3, transformOrigin: 'left center' },
  animate: { opacity: 1, rotateY: 0 },
  exit: { opacity: 0, rotateY: 2, transformOrigin: 'right center' },
  transition: { duration: 0.55, ease: 'easeInOut' },
}
```

```tsx
// Vaporwave: chromatic separation
const vaporwave = {
  initial: { opacity: 0, filter: 'hue-rotate(-30deg) saturate(2)' },
  animate: { opacity: 1, filter: 'hue-rotate(0deg) saturate(1)' },
  exit: { opacity: 0, filter: 'hue-rotate(30deg) saturate(2)' },
  transition: { duration: 0.5, ease: 'easeInOut' },
}
```

### Reference Sites

- **Awwwards SOTD Winners with Page Transitions** -- Study sites that use transitions as a design feature, not a technical demo. The best transitions are invisible: users feel continuity without noticing the mechanism
- **Linear.app** -- Exemplary use of shared element transitions. Clicking an issue morphs the list item into the detail view. Fast, directional, purposeful
- **Apple.com** -- Masterclass in slow, luxurious crossfades for product pages. Scale transitions on hero images. Proves that 600ms transitions work when the content justifies the wait
- **Stripe.com** -- Clean, professional page transitions that never distract from content. Subtle y-shift crossfades. The Neo-Corporate gold standard
- **Aristide Benoist portfolio** -- Creative portfolio with Kinetic-style directional slides. Navigation direction determines slide direction. Spatial model is always clear

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Page Transitions |
|-----------|--------------------------|
| `--color-bg` | Background color visible during transition (crossfade gap) |
| `--color-accent` | Flash color for Brutalist/Neubrutalism instant transitions |
| `--color-surface` | Overlay color for wipe/reveal transitions |
| `--ease-default` | Primary transition easing (archetype-specific) |
| `--motion-speed-multiplier` | Scales all transition durations (DNA tweak) |
| `--color-glow` | Glow effect during Neon Noir glitch transitions |

### Archetype Variants

Fully defined in the Per-Archetype Transition Choreography table (Layer 1). Every archetype has a distinct transition personality. Key groupings:

| Group | Archetypes | Shared Characteristic |
|-------|------------|----------------------|
| Instant | Brutalist, Neubrutalism, Data-Dense | Speed over ceremony. Content first |
| Crossfade | Neo-Corporate, Organic, Japanese Minimal, Warm Artisan | Subtle opacity transitions. Professional or serene |
| Directional | Kinetic, Swiss, Playful, Editorial | Movement communicates navigation direction |
| Atmospheric | Ethereal, Luxury, Glassmorphism, Dark Academia | Blur, scale, and filter create mood |
| Character | Neon Noir, Vaporwave, Retro-Future, AI-Native | Transition IS the personality statement |

### Pipeline Stage

- **Input from:** Design DNA (easing curves, speed multiplier, color tokens), Design Archetypes (transition style selection), Emotional Arc (what beat the target page starts with)
- **Output to:** Build orchestrator routes to correct transition implementation, section builders wrap page content in transition wrapper, quality reviewer checks transition matches archetype table

### Related Skills

- **cinematic-motion** -- Page transitions use the archetype's base easing and duration. In-page motion and page transitions should feel like they belong to the same motion language
- **emotional-arc** -- The transition INTO a page sets the tone. A transition into a HOOK beat should build anticipation (slightly longer, slight scale). A transition into a BREATHE beat should be gentle (pure fade)
- **performance-aware-animation** -- View Transitions API is browser-native (zero JS overhead). AnimatePresence adds the Motion bundle (~15-25 KB gzipped). GSAP Flip adds the GSAP bundle (~25 KB gzipped). Choose based on performance budget
- **design-system-scaffold** -- Transition variants should be defined as part of the design system scaffold (Wave 0), not inline per page. The scaffold exports the archetype's variant object

## Layer 4: Anti-Patterns

### Anti-Pattern: View Transitions in Next.js Production Without Fallback

**What goes wrong:** Shipping a Next.js site that relies on the experimental View Transitions API as its only page transition mechanism. The API may change between Next.js versions. Browsers without support (Firefox, older Safari) get no transition at all -- not graceful degradation, just no transition.
**Instead:** Use AnimatePresence as the primary transition mechanism. Add View Transitions as progressive enhancement with feature detection (`'startViewTransition' in document`). If the native API is available, let it handle transitions. If not, AnimatePresence provides the fallback.

### Anti-Pattern: Slow Transitions on Fast Archetypes

**What goes wrong:** Adding a 600ms crossfade to a Brutalist or Data-Dense project because "transitions look polished." Users of these archetypes expect speed and directness. A 600ms transition feels like lag, not luxury.
**Instead:** Consult the choreography table. Brutalist gets 0ms (instant). Data-Dense gets 100-200ms. Only Luxury/Fashion, Ethereal, and Dark Academia justify transitions above 500ms. If the archetype is not in the slow category, keep transitions under 400ms.

### Anti-Pattern: Same Direction for Forward and Back

**What goes wrong:** Page slides left on forward navigation AND slides left on back navigation. This breaks the spatial model -- users lose sense of where they are in the site hierarchy.
**Instead:** Forward navigation slides content in from the right (or down). Back navigation reverses the direction. Use the `useNavigationDirection()` pattern from Layer 2 to detect navigation direction and multiply the animation offset accordingly.

### Anti-Pattern: Too Many Shared Elements

**What goes wrong:** Morphing 5+ elements between pages simultaneously. Each shared element requires the browser to compute position, size, and style interpolation. Five or more causes visible jank, especially on mobile. The visual result is chaos -- too many things moving at once overwhelms the eye.
**Instead:** Maximum 2-3 shared elements per transition. Prioritize: the hero image is almost always shared element #1. A title/heading is #2. Everything else fades in separately after the shared element animation completes.

### Anti-Pattern: Importing from framer-motion

**What goes wrong:** Using `import { AnimatePresence } from 'framer-motion'` in new projects. The `framer-motion` package is the deprecated name. It still works but receives no new features and will eventually be unmaintained.
**Instead:** Always import from `motion/react`:
```tsx
import { AnimatePresence, motion } from 'motion/react'
```
For React Server Components in Next.js App Router:
```tsx
import { motion } from 'motion/react-client'
```

### Anti-Pattern: Transition Without Purpose

**What goes wrong:** Adding a page transition "because we can" or "because it looks cool." Some archetypes are better WITHOUT transitions. Brutalist sites gain authenticity from instant cuts. Data-Dense sites gain efficiency from zero delay. Adding transitions to these archetypes actively hurts the design.
**Instead:** Respect the choreography table. If the archetype specifies 0ms or "instant," honor that. A deliberate lack of transition IS a design choice. The creative director can override via tension (one page with a dramatic transition in an otherwise instant-cut site), but this should be documented as an intentional tension break.

### Anti-Pattern: Blocking Navigation During Transition

**What goes wrong:** Preventing user clicks during a page transition animation. If the exit animation takes 500ms and the user clicks a new link at 200ms, the navigation is queued or ignored. This makes the site feel unresponsive.
**Instead:** Always allow navigation to interrupt transitions. Cancel the current animation and begin the new transition immediately. In AnimatePresence, `mode="wait"` naturally handles this -- the exit of the old page is replaced by the exit of the newer page. For View Transitions, the browser handles interruption natively.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Transition duration (instant archetypes) | 0 | 100 | ms | HARD -- Brutalist, Neubrutalism, Data-Dense must not exceed 100ms |
| Transition duration (fast archetypes) | 150 | 400 | ms | SOFT -- warn if outside range |
| Transition duration (medium archetypes) | 300 | 600 | ms | SOFT -- warn if outside range |
| Transition duration (slow archetypes) | 500 | 800 | ms | SOFT -- warn if outside range |
| Shared elements per transition | 1 | 3 | count | HARD -- reject if more than 3 shared elements morph simultaneously |
| Back navigation direction | - | - | reversed | HARD -- back must reverse forward direction |
| Reduced motion fallback | - | - | required | HARD -- every transition must have prefers-reduced-motion handling |
| AnimatePresence fallback (Next.js) | - | - | required | HARD -- View Transitions in Next.js must have AnimatePresence fallback |
| framer-motion imports | 0 | 0 | count | HARD -- reject any import from 'framer-motion', use 'motion/react' |
