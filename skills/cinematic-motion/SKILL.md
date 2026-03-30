---
name: cinematic-motion
description: "Unified motion design system. CSS scroll-driven default, archetype-driven intensity, beat-dependent scroll behavior, DNA-generated presets, diversity enforcement. Subsumes css-animations, framer-motion, gsap-animations."
tier: core
triggers: "animation, motion, scroll effect, hover, transition, choreography, cinematic, parallax, GSAP, framer motion, scroll-driven, entrance animation, CSS animation, keyframes, scroll trigger, motion presets"
version: "2.0.0"
---

## Layer 1: Decision Guidance

This skill is the single authority on motion design in Genorah 2.0. It covers CSS animations, the Motion library (ex-Framer Motion), and GSAP in one unified system. Motion is not decoration -- it communicates hierarchy, draws attention, creates emotion, and guides the eye. Every animation must answer: "What story does this motion tell?"

### CSS-First Motion Decision Tree

Default to CSS. Escalate to JS only when CSS literally cannot achieve the effect.

```
Is this a scroll-linked animation?
  YES -> Can it be expressed as scroll() or view() timeline?
    YES -> CSS scroll-driven animation (DEFAULT)
    NO  -> Does it need velocity/physics response?
      YES -> Motion useScroll + useVelocity
      NO  -> Use GSAP ScrollTrigger (complex timelines, pinning)
  NO -> Is this a component entrance/exit?
    YES -> Does it need exit animation or layout animation?
      YES -> Motion variants + AnimatePresence
      NO  -> CSS animation-timeline: view() with @supports
    NO -> Is this complex choreography (5+ elements, sequenced)?
      YES -> GSAP timeline with gsap.context()
      NO -> Is this hover/interaction?
        YES -> Simple state change? -> CSS transitions (Tailwind classes)
               Complex multi-layer? -> Motion whileHover + variants
        NO -> Is this ambient/continuous (floating, shimmer, gradient)?
          YES -> CSS @keyframes (compositor-thread, zero JS)
          NO  -> CSS transitions (simplest tool that works)
```

**Rule of thumb:** If you are unsure, use CSS. Escalate to JS only when CSS cannot do it.

### Motion Intensity by Archetype

Each archetype defines its own motion personality. There is no single global default.

| Intensity | Archetypes | Character |
|-----------|-----------|-----------|
| HIGH | Kinetic, Neon Noir, Vaporwave, Playful/Startup | Energetic, varied, many animated elements |
| MEDIUM | Editorial, Neo-Corporate, Retro-Future, Luxury/Fashion, Glassmorphism, AI-Native | Polished, deliberate, selective animation |
| LOW | Swiss/International, Japanese Minimal, Warm Artisan | Restrained, subtle, animation is rare and meaningful |
| BOLD | Brutalist, Neubrutalism, Dark Academia | Intentionally jarring or abrupt -- motion serves personality |
| VARIABLE | Organic, Ethereal, Data-Dense | Context-dependent -- ambient motion is high, functional is low |

### Beat-Dependent Scroll Behavior

Scroll animation treatment depends on the emotional beat type of the section.

| Beat | Scroll Treatment | Rationale |
|------|-----------------|-----------|
| HOOK | Continuous scroll-linked (parallax, progress-based transforms) | First impression demands cinematic immersion |
| PEAK | Continuous scroll-linked (scroll-jacking, progress reveals) | Wow moment needs persistent engagement |
| BUILD | Entrance-only reveals (staggered children) | Content focus -- motion supports, not distracts |
| TEASE | Entrance-only reveals (subtle, quick) | Intrigue without commitment |
| REVEAL | Entrance with emphasis (scale + opacity, longer duration) | Product showcase needs dramatic reveal |
| PROOF | Entrance-only (counters animate, testimonials cascade) | Credibility through smooth presentation |
| BREATHE | Minimal or none (ambient only if any) | Rest requires visual stillness |
| TENSION | Continuous (tied to creative tension technique) | Tension technique drives motion behavior |
| PIVOT | Entrance with direction change (lateral, unexpected angle) | Surprise communicates shift |
| CLOSE | Entrance-only (gentle, settled) | Resolve and calm before action |

### Motion Diversity Enforcement Rules

Motion monotony is the hallmark of AI-generated design. Enforce variety.

- **No 3 consecutive same-direction animations** -- if sections 1-2 both RISE, section 3 must use a different direction (EXPAND, ENTER-STAGE, UNFOLD, etc.)
- **No 3 consecutive same-timing animations** -- if sections 1-2 both use 0.5s ease-out, section 3 must differ in duration or easing
- **Adjacent sections must differ** in at least ONE of: direction, timing, stagger pattern
- **Pre-assignment:** The section-planner agent pre-assigns motion directions in MASTER-PLAN.md before builders start. Diversity is validated before build, not after
- **Per-page minimum:** At least 3 different animation directions per page

---

## Layer 2: Award-Winning Examples

### Hybrid Motion Preset Model

The archetype is the genre, DNA is the artist. Same musical style, different performance.

**Structure:** Each archetype defines a base motion profile (easing curve, duration range, stagger, direction preferences, scroll behavior). DNA tokens tweak the parameters within the archetype's range to create per-project uniqueness.

```css
/* Archetype base preset: defines the motion family */
/* DNA tweaks: adjust within the family's bounds */
:root {
  /* DNA-generated per-project tweaks */
  --motion-speed-multiplier: 1;         /* 0.7 (slower) to 1.3 (faster) */
  --motion-easing-adjust: 0;            /* Shifts easing curve snappiness */
  --motion-stagger-adjust: 0ms;         /* Shifts stagger gap */
}
```

**Kinetic archetype example** (HIGH intensity):
```css
:root {
  /* Kinetic base */
  --motion-base-easing: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-base-duration: 450ms;    /* Range: 300-600ms */
  --motion-base-stagger: 60ms;     /* Range: 40-80ms */

  /* DNA tweaks for this project */
  --motion-speed-multiplier: 1.1;   /* Slightly faster than base */
  --motion-easing-adjust: 0.05;     /* Slightly snappier */
  --motion-stagger-adjust: -10ms;   /* Tighter stagger: 50ms */
}
```

**Japanese Minimal archetype example** (LOW intensity):
```css
:root {
  /* Japanese Minimal base */
  --motion-base-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --motion-base-duration: 1000ms;   /* Range: 800-1500ms */
  --motion-base-stagger: 200ms;    /* Range: 150-250ms */

  /* DNA tweaks for this project */
  --motion-speed-multiplier: 0.9;   /* Even more contemplative */
  --motion-easing-adjust: 0;        /* Keep the gentleness */
  --motion-stagger-adjust: 20ms;    /* Wider gaps between elements */
}
```

### CSS Scroll-Driven Animation Patterns

CSS scroll-driven animations run on the compositor thread: zero main-thread impact, guaranteed smooth 60fps. These are the DEFAULT motion path.

**Browser support:** Chrome 115+, Edge 115+, Safari 26+. Firefox behind flag. ALWAYS wrap in `@supports (animation-timeline: view())` for progressive enhancement.

#### Entrance Reveal (view() timeline)
```css
/* Fallback: elements visible with no animation */
.reveal-on-scroll {
  opacity: 1;
  transform: none;
}

/* Enhancement: scroll-driven entrance */
@supports (animation-timeline: view()) {
  .reveal-on-scroll {
    animation: scroll-reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }
}

@keyframes scroll-reveal {
  from { opacity: 0; transform: translateY(2rem); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Parallax Shift (scroll() timeline)
```css
.parallax-bg {
  transform: translateY(0);
}

@supports (animation-timeline: scroll()) {
  .parallax-bg {
    animation: parallax-shift linear;
    animation-timeline: scroll();
  }
}

@keyframes parallax-shift {
  from { transform: translateY(0); }
  to { transform: translateY(-20%); }
}
```

#### Scroll Progress Indicator
```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--color-primary);
  transform-origin: left;
  transform: scaleX(0);
}

@supports (animation-timeline: scroll()) {
  .scroll-progress {
    animation: grow-progress linear;
    animation-timeline: scroll();
  }
}

@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

#### Sticky Header Transform
```css
.site-header {
  transition: background-color 0.3s, backdrop-filter 0.3s;
}

@supports (animation-timeline: scroll()) {
  .site-header {
    animation: header-shrink linear both;
    animation-timeline: scroll();
    animation-range: 0px 200px;
  }
}

@keyframes header-shrink {
  from {
    padding-block: 1.5rem;
    background-color: transparent;
  }
  to {
    padding-block: 0.75rem;
    background-color: var(--color-surface);
    backdrop-filter: blur(12px);
  }
}
```

#### CSS animation-range Reference
```
animation-range: entry 0% entry 100%;    /* During element entering viewport */
animation-range: exit 0% exit 100%;      /* During element exiting viewport */
animation-range: cover 0% cover 100%;    /* Full element passage through viewport */
animation-range: contain 0% contain 100%; /* While element fully contained in viewport */
```

### Motion Library Patterns

ALL imports from `motion/react` (NOT `framer-motion`). The `framer-motion` package is deprecated.

#### Standard Imports (2026)
```tsx
'use client'

// Standard React client component
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'

// React Server Components (Next.js App Router)
import { motion } from 'motion/react-client'

// Bundle optimization (tree-shaking)
import { LazyMotion, m, domAnimation } from 'motion/react'

// Reduced motion detection
import { useReducedMotion } from 'motion/react'
```

#### Variant-Based Entrance with whileInView
```tsx
'use client'
import { motion } from 'motion/react'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

function StaggerReveal({ children }: { children: React.ReactNode[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  )
}
```

#### useScroll + useTransform for Velocity-Responsive Parallax
```tsx
'use client'
import { useScroll, useVelocity, useTransform, motion } from 'motion/react'

function VelocitySkew() {
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const skewY = useTransform(velocity, [-3000, 0, 3000], [-3, 0, 3])
  const scaleX = useTransform(velocity, [-3000, 0, 3000], [0.98, 1, 0.98])

  return (
    <motion.div style={{ skewY, scaleX }}>
      <img src="/hero.jpg" alt="Hero" className="w-full" />
    </motion.div>
  )
}
```

#### AnimatePresence for Exit Animations
```tsx
'use client'
import { AnimatePresence, motion } from 'motion/react'

<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="element"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

### GSAP Patterns

ALL GSAP plugins are FREE for all use (personal and commercial). Webflow acquired GSAP in 2024. Installation: `npm install gsap` includes everything.

#### SplitText Character Reveal with ScrollTrigger
```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

function TextReveal({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(ref.current!, { type: 'words,chars' })
      gsap.from(split.chars, {
        y: '100%',
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.02,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return <h2 ref={ref} className="text-5xl font-display font-bold">{text}</h2>
}
```

#### GSAP Timeline for Complex Choreography (5+ Elements)
```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function HeroChoreography() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 0.6, ease: 'power3.out' },
      })

      tl.from('.hero-bg', { opacity: 0, duration: 0.3 })
        .from('.hero-overline', { opacity: 0, y: 20 }, '-=0.1')
        .from('.hero-headline', { opacity: 0, y: 30 }, '-=0.3')
        .from('.hero-subtitle', { opacity: 0, y: 20 }, '-=0.2')
        .from('.hero-cta', { opacity: 0, y: 20, stagger: 0.08 }, '-=0.1')
        .from('.hero-image', { opacity: 0, scale: 0.95 }, '-=0.4')
        .from('.hero-decoration', { opacity: 0 }, '-=0.2')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return <div ref={containerRef}>{/* hero content */}</div>
}
```

#### gsap.context() for React Cleanup
```tsx
// ALWAYS wrap GSAP animations in gsap.context() for React
useEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP animations scoped here
    gsap.from('.element', { opacity: 0, y: 40 })
  }, containerRef) // Scope to container ref for selector safety

  return () => ctx.revert() // Kills all animations + ScrollTriggers
}, [])
```

#### Available GSAP Plugins (All Free)
| Plugin | Purpose | Use When |
|--------|---------|----------|
| ScrollTrigger | Scroll-linked triggers, pinning, scrub | Complex scroll sequences CSS cannot handle |
| SplitText | Text word/char splitting for animation | Headline character reveals, word-by-word |
| MorphSVG | SVG shape morphing | Shape transitions between states |
| DrawSVG | SVG path drawing animation | Line-draw illustrations, signatures |
| CustomEase | Custom easing curve builder | Archetype-specific custom curves |
| Flip | FLIP animation technique | Layout transitions, reordering |
| Observer | Scroll/touch/pointer detection | Custom scroll-based interactions |

### 19 Archetype Motion Profiles

| Archetype | Base Easing | Duration Range | Stagger | Directions | Scroll Mode | Intensity |
|-----------|------------|----------------|---------|------------|-------------|-----------|
| Brutalist | `steps(1)` or `cubic-bezier(0.9, 0, 0.1, 1)` | 100-300ms | 0ms | Instant / REVEAL | Entrance-only | BOLD |
| Ethereal | `cubic-bezier(0.4, 0, 0.2, 1)` | 600-1200ms | 150ms | RISE, REVEAL | Continuous (slow) | VARIABLE |
| Kinetic | `cubic-bezier(0.16, 1, 0.3, 1)` | 300-600ms | 60ms | All 10 directions | Continuous | HIGH |
| Editorial | `cubic-bezier(0.4, 0, 0.2, 1)` | 400-600ms | 100ms | RISE, UNFOLD | Entrance-only | MEDIUM |
| Neo-Corporate | `cubic-bezier(0.16, 1, 0.3, 1)` | 300-500ms | 80ms | RISE, CASCADE | Entrance-only | MEDIUM |
| Organic | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 500-800ms | 100ms | RISE, EXPAND | Entrance (spring) | VARIABLE |
| Retro-Future | `steps(3)` or `linear` | 100-400ms | 40ms | UNFOLD, REVEAL | Entrance (glitchy) | MEDIUM |
| Luxury/Fashion | `cubic-bezier(0.4, 0, 0.2, 1)` | 600-1000ms | 200ms | REVEAL, RISE | Continuous (slow) | MEDIUM |
| Playful/Startup | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 300-600ms | 80ms | RISE, EXPAND | Entrance (bouncy) | HIGH |
| Data-Dense | `cubic-bezier(0.16, 1, 0.3, 1)` | 200-400ms | 40ms | REVEAL, CASCADE | Entrance-only | VARIABLE |
| Japanese Minimal | `cubic-bezier(0.4, 0, 0.2, 1)` | 800-1500ms | 200ms | REVEAL only | Entrance (rare) | LOW |
| Glassmorphism | `cubic-bezier(0.16, 1, 0.3, 1)` | 400-700ms | 80ms | EXPAND, REVEAL | Entrance (layered) | MEDIUM |
| Neon Noir | `cubic-bezier(0.7, 0, 0.3, 1)` | 300-600ms | 60ms | REVEAL, RISE | Continuous (electric) | HIGH |
| Warm Artisan | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 400-700ms | 100ms | RISE, REVEAL | Entrance (gentle) | LOW |
| Swiss/International | `linear` or `ease` | 200-400ms | 0ms | REVEAL only | Entrance (minimal) | LOW |
| Vaporwave | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | 300-800ms | 60ms | All directions | Continuous (retro) | HIGH |
| Neubrutalism | `steps(1)` or `cubic-bezier(0.9, 0, 0.1, 1)` | 100-400ms | 0-40ms | EXPAND, DROP | Entrance (abrupt) | BOLD |
| Dark Academia | `cubic-bezier(0.4, 0, 0.2, 1)` | 500-900ms | 120ms | UNFOLD, REVEAL | Entrance (measured) | BOLD |
| AI-Native | `cubic-bezier(0.16, 1, 0.3, 1)` | 300-600ms | 50ms | REVEAL, CASCADE | Continuous (data-driven) | MEDIUM |

### Tailwind v4 Motion Integration

Motion presets become Tailwind utilities via `@theme` variables. Scaffold generates these from DNA.

```css
@import "tailwindcss";

@theme {
  /* DNA-generated easing curves */
  --ease-default: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-gentle: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snappy: cubic-bezier(0.3, 1.2, 0.2, 1);

  /* DNA-generated motion presets */
  --animate-reveal: reveal 0.6s var(--ease-gentle) both;
  --animate-rise: rise 0.5s var(--ease-default) both;
  --animate-expand: expand 0.5s var(--ease-default) both;
  --animate-slide-left: slide-left 0.5s var(--ease-default) both;
  --animate-slide-right: slide-right 0.5s var(--ease-default) both;
  --animate-drop: drop 0.4s var(--ease-default) both;
  --animate-unfold: unfold 0.7s var(--ease-default) both;
  --animate-drift: drift 20s ease-in-out infinite;
  --animate-shimmer: shimmer 1.5s infinite;

  @keyframes reveal {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(var(--rise-distance, 2rem)); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes expand {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slide-left {
    from { opacity: 0; transform: translateX(-3rem); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slide-right {
    from { opacity: 0; transform: translateX(3rem); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes drop {
    from { opacity: 0; transform: translateY(-1.5rem); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes unfold {
    from { clip-path: inset(0 0 100% 0); }
    to { clip-path: inset(0 0 0% 0); }
  }
  @keyframes drift {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, -20px); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
}
```

Usage: `className="animate-reveal"`, `className="animate-rise"`, etc. These are the standard motion utilities all builders use.

### Reduced Motion Handling

Every motion pattern must account for users who prefer reduced motion. This is not optional.

**CSS approach:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Motion library approach:**
```tsx
import { useReducedMotion } from 'motion/react'

function AnimatedComponent() {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReduced ? 0.01 : 0.5 }}
    />
  )
}
```

**GSAP approach:**
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      // Only run animations when user has no reduced-motion preference
      gsap.from('.element', { opacity: 0, y: 40, duration: 0.6 })
    })
  })
  return () => ctx.revert()
}, [])
```

### Multi-Layer Hover Choreography

Award-winning hover states use multiple layers animating at different speeds.

```tsx
<div className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300">
  {/* Layer 1: Background glow (slowest, 500ms) */}
  <div className="absolute inset-0 rounded-2xl bg-[var(--color-glow)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

  {/* Layer 2: Border brightens (medium, 300ms) */}
  <div className="absolute inset-0 rounded-2xl border border-[var(--color-accent)]/0 group-hover:border-[var(--color-accent)]/20 transition-colors duration-300 pointer-events-none" />

  {/* Layer 3: Content lifts (fastest, 200ms) */}
  <div className="transition-transform duration-200 group-hover:-translate-y-1">
    <h3 className="text-lg font-semibold">Card Title</h3>
    <p className="mt-2 text-sm text-[var(--color-muted)]">Description</p>
  </div>

  {/* Layer 3b: Arrow appears (200ms, delayed 100ms) */}
  <div className="absolute bottom-6 right-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 delay-100">
    <ArrowRight className="h-4 w-4 text-[var(--color-accent)]" />
  </div>
</div>
```

### Frame-by-Frame Choreography Sequences

For GSAP timelines or sequenced CSS animations, use frame-by-frame planning.

**HOOK beat choreography:**
```
Frame 0 (0ms):     All hidden
Frame 1 (0-200ms): Background treatment REVEAL
Frame 2 (200ms):   Overline label RISE
Frame 3 (350ms):   Headline RISE (stagger per word if split)
Frame 4 (550ms):   Subtext RISE
Frame 5 (700ms):   CTA buttons RISE (stagger 80ms between)
Frame 6 (900ms):   Product image ENTER-STAGE or EXPAND
Frame 7 (1100ms):  Decorative elements REVEAL (ambient glow, particles)
```

**PEAK beat choreography:**
```
Frame 0 (0ms):     Background shift (color/gradient REVEAL)
Frame 1 (200ms):   Heading RISE with emphasis (larger, bolder)
Frame 2 (400ms):   WOW moment element EXPAND or custom animation
Frame 3 (700ms):   Supporting elements CASCADE
Frame 4 (1000ms):  Interactive state activated
```

**BUILD beat choreography:**
```
Frame 0 (0ms):     Section heading RISE
Frame 1 (150ms):   Section description RISE
Frame 2 (300ms):   Grid/cards CASCADE (60ms stagger)
Frame 3 (ongoing): Individual card hover states active
```

---

## Layer 3: Integration Context

### DNA Connection

| DNA Element | Usage in Motion System |
|-------------|----------------------|
| Motion tokens (`--motion-*-duration`, `--motion-*-easing`) | Per-project tweaks to archetype base presets. CSS custom properties consumed by both CSS animations and JS libraries |
| `--motion-speed-multiplier` | Scales all durations: `calc(var(--base-duration) * var(--motion-speed-multiplier))` |
| `--motion-easing-adjust` | Shifts easing curve snappiness within archetype bounds |
| `--motion-stagger-adjust` | Shifts stagger gap between sequenced elements |
| Signature element | If the signature element involves motion (e.g., `parallax-layers`), the motion profile must support it |
| Color tokens (glow, tension, highlight) | Expressive colors used in motion-integrated effects (glow trails, tension flashes, highlight pulses) |

### Related Skills

- **emotional-arc** -- Beat type determines scroll behavior (continuous vs entrance-only). Motion skill consumes the beat table from Layer 1.
- **design-system-scaffold** -- Scaffold generates Tailwind `@theme` motion presets from DNA. Builders use `animate-*` utilities produced by the scaffold.
- **wow-moments** -- Wow moments use motion presets as their foundation. Complex wow moments escalate from CSS to GSAP per the decision tree.
- **page-transitions** -- Page-level motion uses the same easing/duration from the archetype profile. Cross-skill consistency is required.
- **creative-tension** -- Tension moments may override normal motion patterns. A TENSION beat gets continuous scroll even if the beat table says entrance-only.
- **performance-aware-animation** -- Performance budgets and code-splitting decisions reference the motion decision tree. CSS-first priority is shared.

### Pipeline Stage

- **Input from:** Design DNA (motion tokens, archetype), Emotional Arc (beat assignments), MASTER-PLAN.md (section sequence)
- **Output to:** Builder spawn prompts (motion profile), Section PLANs (per-section animation spec), Design System Scaffold (Tailwind motion utilities)
- **Referenced by:** build-orchestrator (motion diversity validation), section-planner (motion pre-assignment), quality-reviewer (motion quality scoring)

---

## Layer 4: Anti-Patterns

### Anti-Pattern: All-JS Motion

**What goes wrong:** Using `motion` library for simple scroll reveals when CSS `animation-timeline: view()` does it with zero JS on the compositor thread. Adds unnecessary bundle weight (~15-25 KB) and main-thread work for an effect CSS handles natively.
**Instead:** Follow the CSS-first decision tree. CSS scroll-driven animation is the default. Escalate to Motion or GSAP only when CSS cannot express the effect (velocity response, complex choreography, exit animations).

### Anti-Pattern: Generic Fade-In Everywhere

**What goes wrong:** Every element uses the same `opacity: 0 -> 1, translateY: 20px -> 0` animation. The result looks monotonous and machine-generated. Motion has no personality or variety.
**Instead:** Vary direction (RISE, EXPAND, ENTER-STAGE, UNFOLD), timing (different durations), and stagger pattern per the diversity rules. Pre-assign motion directions in MASTER-PLAN.md. Use at least 3 different animation directions per page.

### Anti-Pattern: will-change Abuse

**What goes wrong:** Applying `will-change: transform` to 20+ elements permanently. Each will-change element promotes to its own compositor layer, consuming GPU memory. On mobile devices this causes jank or crashes.
**Instead:** Apply `will-change` dynamically via JS just before animation starts, remove it after animation completes. Never set it permanently in stylesheets. For CSS animations, the browser already optimizes `transform` and `opacity` properties.

### Anti-Pattern: framer-motion Imports

**What goes wrong:** Using `import { motion } from 'framer-motion'` instead of `import { motion } from 'motion/react'`. The `framer-motion` package is deprecated. New projects should use the `motion` package.
**Instead:** Always import from `motion/react`. For RSC/Next.js App Router: `motion/react-client`. For bundle optimization: `LazyMotion` + `m` + `domAnimation` from `motion/react`.

### Anti-Pattern: GSAP Premium Mentions

**What goes wrong:** Referring to SplitText, MorphSVG, or DrawSVG as "paid plugins" or mentioning "Club GreenSock membership." This is outdated since the 2024 Webflow acquisition.
**Instead:** All GSAP plugins are free for all use. Installation: `npm install gsap` includes everything. Import directly: `import { SplitText } from 'gsap/SplitText'`.

### Anti-Pattern: Safari 18 Scroll-Driven Assumption

**What goes wrong:** Assuming CSS scroll-driven animations (`animation-timeline: view()`) work in Safari 18. They require Safari 26+. Without `@supports` checks, Safari 18 users see broken layouts or invisible content.
**Instead:** Always wrap scroll-driven animations in `@supports (animation-timeline: view())`. Set the static fallback (visible, no animation) as the default state. Safari 26+ and Chrome 115+ get the enhancement.

### Anti-Pattern: Same Motion Every Section

**What goes wrong:** Breaking the diversity rule by using the same animation direction and timing in 3+ consecutive sections. The result looks like a template, not a designed experience.
**Instead:** Pre-assign motion directions in MASTER-PLAN.md before build starts. Enforce: no 3 consecutive same-direction, no 3 consecutive same-timing. Adjacent sections must differ in at least one of direction, timing, or stagger pattern.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| motion-speed-multiplier | 0.7 | 1.3 | ratio | HARD -- reject if outside range |
| motion-stagger-adjust | -40 | 40 | ms | SOFT -- warn if outside range |
| consecutive-same-direction | 0 | 2 | count | HARD -- reject 3+ consecutive same direction |
| consecutive-same-timing | 0 | 2 | count | HARD -- reject 3+ consecutive same timing |
| different-directions-per-page | 3 | - | count | HARD -- minimum 3 different directions per page |
| hook-beat-scroll-mode | continuous | continuous | - | HARD -- HOOK beats must use continuous scroll-linked |
| peak-beat-scroll-mode | continuous | continuous | - | HARD -- PEAK beats must use continuous scroll-linked |
| breathe-beat-scroll-mode | none | ambient | - | HARD -- BREATHE beats allow none or ambient only |
| css-scroll-supports-wrap | required | required | - | HARD -- all CSS scroll-driven animations require @supports |
| reduced-motion-handling | required | required | - | HARD -- every pattern must handle prefers-reduced-motion |
