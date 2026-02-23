# Phase 5: Motion & Design Skills - Research

**Researched:** 2026-02-24
**Domain:** Motion animation systems, creative tension, wow moments, page transitions, performance-aware animation, design system scaffold -- all as SKILL.md markdown knowledge bases for a Claude Code plugin
**Confidence:** HIGH (most topics verified via official docs)

## Summary

Phase 5 produces 6 SKILL.md files that teach Claude how to build award-winning motion design, create creative tension, implement wow moments, manage page transitions, optimize animation performance, and scaffold design systems from DNA. These are markdown knowledge bases, not application code.

The motion technology landscape has shifted significantly since the existing v6.1.0 skills were written. CSS scroll-driven animations are now supported in Chrome 115+, Edge 115+, and Safari 26+ (with Interop 2026 ensuring cross-browser parity). The Motion library (formerly Framer Motion) has rebranded with new imports (`motion/react`). GSAP is now completely free including all plugins (SplitText, MorphSVG, ScrollSmoother). View Transitions API has native support in Chrome, Edge, and Safari 18+, with Next.js providing experimental integration via `viewTransition: true` in config.

The key architectural challenge is organizing large skill files (the wow moment library alone needs 30+ patterns) without exceeding useful size limits. The research recommends tiered code specificity (full TSX for simple patterns, pattern+guidance for complex ones) and structured lookup tables for the auto-suggestion matrix.

**Primary recommendation:** Build each skill in the 4-layer format with a clear CSS-first motion default, tiered fallbacks to Motion/GSAP for complex cases, and structured archetype x beat lookup tables for all recommendation systems. The design system scaffold skill should leverage Tailwind v4's `@theme` directive with `--animate-*` theme variables for motion presets.

## Standard Stack

This phase produces markdown skill files. The "stack" is the motion technologies these skills will document and recommend.

### Core Motion Technologies (Skills Will Reference)
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| CSS Scroll-Driven Animations | Level 1 spec | Default scroll animation path | Compositor-thread, zero JS, 60fps guaranteed. Chrome 115+, Edge 115+, Safari 26+ |
| Motion (ex-Framer Motion) | 12.x (`motion/react`) | React animation library | Industry standard for React component animation. Rebranded, import from `motion/react` |
| GSAP | 3.14.x | Complex timeline/scroll animation | Now 100% free (all plugins). SplitText, MorphSVG, ScrollTrigger included |
| View Transitions API | Native browser | Page transitions | Chrome 111+, Edge 111+, Safari 18+. Next.js experimental support |
| Tailwind CSS v4 | 4.x | Design token system, animation utilities | `@theme` directive with `--animate-*` for motion presets |

### Supporting Technologies
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| React Three Fiber | 9.5.x | 3D/WebGL in React | Wow moments involving 3D scenes, shader effects |
| Rive | @rive-app/react-canvas 4.26.x | Interactive vector animation | State-machine driven animations, game-like interactions |
| dotLottie | @lottiefiles/dotlottie-react 0.18.x | Lightweight vector animation | Simple looping animations, icons, loading states |
| Intersection Observer | Native browser | Entrance trigger fallback | When CSS `view()` is insufficient or needs JS control |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS scroll-driven | GSAP ScrollTrigger | GSAP is more powerful but adds JS bundle. CSS is zero-JS, compositor-thread |
| Motion library | GSAP | GSAP has richer timeline API but no React-native declarative syntax |
| Rive | Lottie | Lottie files are 10-15x larger; Rive has state machines built in. Lottie has larger ecosystem |
| View Transitions API | Motion AnimatePresence | AnimatePresence gives more control but doesn't get native browser optimizations |

## Architecture Patterns

### Skill File Organization Strategy

The wow moment library (30+ patterns) and motion profiles (19+ archetypes) create large files. The strategy is:

**Approach: Structured sections within single SKILL.md files, not sub-files.**

Rationale: Claude Code loads entire SKILL.md files. Splitting into sub-files would require explicit references and increases fragmentation. Instead, use clear section headers and lookup tables that Claude can navigate.

**Size targets per skill:**
| Skill | Estimated Size | Strategy |
|-------|---------------|----------|
| Cinematic Motion | 500-700 lines | Motion vocabulary + 19 archetype profiles (compact table format) + diversity rules |
| Creative Tension | 500-700 lines | 5 levels with safe/aggressive ranges + 19 archetype tension tables (compact) |
| Wow Moment Library | 800-1000 lines | 30+ patterns in 4 categories. Simple = full TSX, complex = pattern + guidance. Auto-suggestion matrix as table |
| Page Transitions | 400-500 lines | 4 transition approaches + per-archetype choreography table |
| Performance-Aware Animation | 300-400 lines | Decision trees, budgets, code-splitting patterns |
| Design System Scaffold | 600-800 lines | Full template generation from DNA, beat templates, typed utilities |

**Confidence: MEDIUM** -- Size estimates based on existing v6.1.0 skill analysis. Wow moments may need to be more compact than v6.1.0's full-TSX-per-pattern approach.

### Pattern 1: CSS-First Motion Decision Tree

**What:** A decision tree that defaults to CSS scroll-driven animations and escalates to JS libraries only when needed.
**When to use:** Cinematic Motion skill and Performance-Aware Animation skill.
**Why:** CSS scroll-driven animations run on the compositor thread (zero main-thread impact). JS libraries should only be used when CSS cannot achieve the effect.

```
Is this a scroll-linked animation?
  YES -> Can it be expressed as scroll() or view() timeline?
    YES -> Use CSS scroll-driven animation (DEFAULT)
    NO -> Does it need velocity/physics response?
      YES -> Use Motion useScroll + useVelocity
      NO -> Use GSAP ScrollTrigger (complex timelines)
  NO -> Is this a component entrance/exit?
    YES -> Use Motion variants + whileInView
    NO -> Is this a complex choreography (5+ elements)?
      YES -> Use GSAP timeline
      NO -> Is this a hover/interaction?
        YES -> Use CSS transitions (Tailwind classes) for simple, Motion for complex
        NO -> Use CSS @keyframes
```

**Confidence: HIGH** -- Based on performance research confirming CSS scroll-driven runs on compositor thread.

### Pattern 2: Tiered Code Specificity for Wow Moments

**What:** Three tiers of code completeness based on pattern complexity.
**When to use:** Wow Moment Library skill.
**Why:** Full TSX for all 30+ patterns would make the skill file enormous. Complex patterns (WebGL shaders, Rive state machines) need project-specific adaptation anyway.

| Tier | Completeness | Example Patterns | Size per Pattern |
|------|-------------|------------------|-----------------|
| Tier 1: Copy-Paste | Full TSX, drop in and adjust tokens | Magnetic button, spotlight card, tilt card, sticky stack, gradient mesh | 15-30 lines |
| Tier 2: Pattern + Setup | Component structure + key code, needs adaptation | Horizontal scroll-jack, SVG line draw, text word-by-word reveal, before/after slider | 20-40 lines |
| Tier 3: Guidance + Reference | Architecture description, library setup, link to approach | WebGL shader background, Rive state machine, scroll-linked video, 3D product viewer | 10-20 lines + external ref |

**Confidence: HIGH** -- Directly from user decision in CONTEXT.md: "simple effects are copy-paste TSX/CSS, complex effects are pattern + guidance."

### Pattern 3: Auto-Suggestion Matrix as Lookup Table

**What:** A structured table that maps (archetype x beat type) to recommended wow moments, with section content type as a modifier.
**When to use:** Wow Moment Library skill.
**Why:** Claude needs to quickly look up "what wow moment fits a PEAK beat in a Kinetic archetype?" without reading through all 30+ patterns.

```markdown
### Auto-Suggestion Matrix

#### By Beat Type (Primary)
| Beat | Cursor | Scroll | Interactive | Ambient |
|------|--------|--------|-------------|---------|
| HOOK | Magnetic btn, cursor morph | Parallax layers, perspective zoom | - | Gradient mesh, aurora, particle field |
| PEAK | Text distortion, repulsion | Horizontal scroll-jack, split merge | 3D viewer, drag demo | Living grid |
| BUILD | Spotlight grid, tilt card | Sticky stack, counters | Expandable cards, calculator | - |
| PROOF | - | Counters, sticky stack | Before/after | - |
| CLOSE | Magnetic btn | - | - | Gradient mesh |
| BREATHE | - | - | - | Aurora, morphing blob |

#### Archetype Intensity Modifier
| Archetype | Max Wow/Page | Preferred Categories | Avoid |
|-----------|-------------|---------------------|-------|
| Kinetic | 5+ | All categories | None |
| Japanese Minimal | 1 | Ambient only | Cursor, interactive |
| Swiss | 0-1 | Scroll (subtle) | Cursor, 3D |
| Neon Noir | 3-4 | Cursor, ambient, scroll | - |
| Luxury | 2-3 | Scroll, ambient | Interactive (too playful) |

#### Section Content Modifier
- Hero with image -> Perspective zoom, parallax layers
- Stats grid -> Animated counters, sticky stack
- Feature cards -> Spotlight grid, tilt cards, expandable cards
- Testimonials -> Sticky stack, horizontal scroll-jack
- CTA section -> Magnetic button, gradient mesh background
```

**Confidence: HIGH** -- Three-factor matching (archetype + beat + content) is directly from user decision.

### Pattern 4: Hybrid Motion Preset Model

**What:** Archetype defines the motion family (easing curves, duration ranges, stagger values, preferred directions). DNA tweaks parameters within that family (speed multiplier, easing adjustments).
**When to use:** Cinematic Motion skill and Design System Scaffold skill.
**Why:** User decided "archetype is the genre, DNA is the artist."

```markdown
### Archetype Motion Profile: Kinetic
| Parameter | Value | DNA Adjustable |
|-----------|-------|---------------|
| Base easing | cubic-bezier(0.16, 1, 0.3, 1) | Curve endpoints +/- 0.1 |
| Duration range | 300-600ms | Speed multiplier 0.8-1.2 |
| Stagger | 60ms | +/- 20ms |
| Primary directions | All 10 | - |
| Scroll behavior | Continuous (HOOK/PEAK), entrance (others) | - |
| Intensity | High | - |

### DNA Tweak Example
```css
:root {
  /* Archetype base: Kinetic */
  --motion-speed-multiplier: 1.1;     /* DNA: slightly faster */
  --motion-easing-adjust: 0.05;       /* DNA: slightly snappier */
  --motion-stagger-adjust: -10ms;     /* DNA: tighter stagger */
}
```

**Confidence: HIGH** -- Directly from user decision in CONTEXT.md.

### Pattern 5: Tailwind v4 @theme Animation Integration

**What:** Motion presets defined as Tailwind v4 `@theme` variables using `--animate-*` namespace, with `@keyframes` inside `@theme` blocks.
**When to use:** Design System Scaffold skill.
**Why:** Tailwind v4 generates `animate-{name}` utilities from `--animate-*` theme variables. Motion presets should be available as Tailwind classes.

```css
@import "tailwindcss";

@theme {
  /* DNA-generated motion presets */
  --animate-reveal: reveal 0.6s var(--ease-default) both;
  --animate-rise: rise 0.5s var(--ease-default) both;
  --animate-expand: expand 0.5s var(--ease-default) both;
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

Generates: `animate-reveal`, `animate-rise`, `animate-expand`, `animate-drift`, `animate-shimmer` utilities.

**Confidence: HIGH** -- Verified from Tailwind CSS v4 official docs. `--animate-*` theme variables with `@keyframes` inside `@theme` blocks.

### Anti-Patterns to Avoid

- **All-JS motion:** Defaulting to Framer Motion for scroll reveals when CSS `animation-timeline: view()` does it with zero JS, on the compositor thread.
- **Generic fade-in everywhere:** v6.1.0 skills default to "fade in up" for everything. The new skill must enforce motion diversity (no 3 consecutive same-direction animations).
- **Monolithic wow moment file:** Trying to include full TSX for every pattern. Use tiered specificity instead.
- **Ignoring reduced motion:** Every pattern must document its `prefers-reduced-motion` fallback.
- **will-change abuse:** Applying `will-change` to many elements simultaneously consumes excessive GPU memory. Use sparingly, apply/remove dynamically via JS, never in stylesheets permanently.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered entrance | Custom IntersectionObserver + class toggle | CSS `animation-timeline: view()` | Zero JS, compositor thread, browser-optimized |
| Scroll progress indicator | JS scroll event listener | CSS `animation-timeline: scroll()` | Zero JS, no jank |
| Page transitions | Custom DOM manipulation | View Transitions API or Motion AnimatePresence | Browser-native morphing or React-integrated exit animations |
| Text splitting for animation | Manual span wrapping | GSAP SplitText (now free) | Handles line detection, word/char splitting, resize cleanup |
| Parallax scrolling | Custom scroll handler + transform | CSS scroll-driven parallax or Motion useScroll | Either zero-JS (CSS) or optimized library (Motion) |
| Interactive vector animation | Custom SVG JS manipulation | Rive state machines | Visual editor, binary format (10-15x smaller than Lottie), built-in interactivity |
| 3D product viewer | Raw Three.js | React Three Fiber + @react-three/drei | React-native API, built-in controls, camera helpers |

**Key insight:** The biggest shift since v6.1.0 is that CSS can now handle scroll-driven animations natively. The skills should default to CSS and only escalate to JS libraries when CSS cannot express the animation.

## Common Pitfalls

### Pitfall 1: CSS Scroll-Driven Browser Support Gaps
**What goes wrong:** Building CSS scroll-driven animations without fallback, then Firefox users see no animation.
**Why it happens:** Firefox still has scroll-driven animations behind a flag (as of Feb 2026). Safari added support in v26 (not v18).
**How to avoid:** The Cinematic Motion skill must include progressive enhancement patterns:
```css
/* Fallback: static state (visible, no animation) */
.reveal-element { opacity: 1; transform: none; }

/* Enhancement: scroll-driven animation */
@supports (animation-timeline: view()) {
  .reveal-element {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }
}
```
**Warning signs:** If patterns don't include `@supports` checks, Firefox users get broken layouts.

**Confidence: HIGH** -- Verified via Can I Use and MDN. Chrome 115+, Edge 115+, Safari 26+ (NOT 18). Firefox behind flag.

### Pitfall 2: Motion Library Import Path Change
**What goes wrong:** Using `import { motion } from 'framer-motion'` instead of `import { motion } from 'motion/react'`.
**Why it happens:** The existing v6.1.0 skills all use `framer-motion` imports. The library rebranded to "Motion" with new import paths.
**How to avoid:** All skill code examples must use:
- `import { motion, AnimatePresence } from 'motion/react'` for standard React
- `import { motion } from 'motion/react-client'` for React Server Components (Next.js App Router)
- `import { LazyMotion, m } from 'motion/react'` for bundle-size optimization
- The `framer-motion` package still works but is deprecated. New projects should use `motion`.
**Warning signs:** If any code example imports from `framer-motion` instead of `motion/react`.

**Confidence: HIGH** -- Verified from Motion official upgrade guide and npm.

### Pitfall 3: GSAP Licensing Confusion
**What goes wrong:** Documenting GSAP plugins (SplitText, MorphSVG) as paid/premium.
**Why it happens:** v6.1.0 was written when GSAP plugins required Club GreenSock membership. Webflow acquired GSAP in 2024 and made everything free.
**How to avoid:** Document that ALL GSAP plugins are free for all use (personal and commercial) as of 2024. Installation: `npm install gsap` includes everything. Import: `import { SplitText } from 'gsap/SplitText'`.
**Warning signs:** If skills mention "premium plugins" or "Club GreenSock membership."

**Confidence: HIGH** -- Verified via GSAP GitHub and npm.

### Pitfall 4: View Transitions API Maturity in Next.js
**What goes wrong:** Treating View Transitions as production-ready in Next.js.
**Why it happens:** The API works in browsers, but Next.js integration is still experimental.
**How to avoid:** The Page Transition skill should present View Transitions API as the progressive-enhancement path and Motion AnimatePresence as the reliable fallback:
- View Transitions API: `experimental.viewTransition: true` in next.config.js, `<ViewTransition>` component from React. Available in Next.js 15.2+.
- Astro: Full View Transitions support built-in (not experimental).
- AnimatePresence: Reliable, well-tested, works everywhere React works.
**Warning signs:** If the skill recommends View Transitions as the default for Next.js without noting experimental status.

**Confidence: HIGH** -- Next.js docs (fetched 2026-02-24) explicitly state "experimental and subject to change, not recommended for production."

### Pitfall 5: Wow Moment File Size Explosion
**What goes wrong:** Including full TSX for all 30+ wow moment patterns produces a 1500+ line file.
**Why it happens:** v6.1.0's wow-moments skill has full TSX for many patterns (currently ~560 lines for ~30 patterns).
**How to avoid:** Use tiered code specificity:
- Tier 1 (copy-paste, ~15 patterns): Full TSX, 15-30 lines each = ~300-450 lines
- Tier 2 (pattern+setup, ~10 patterns): Key code + structure, 20-40 lines each = ~200-400 lines
- Tier 3 (guidance, ~8 patterns): Architecture description, 10-20 lines each = ~80-160 lines
- Auto-suggestion matrix: ~100 lines
- Layer 1 (decision guidance) + Layer 4 (anti-patterns): ~150 lines
- Total: 830-1260 lines (within acceptable range if kept compact)
**Warning signs:** If the skill exceeds 1000 lines, patterns need trimming.

### Pitfall 6: Design Scaffold Using v3 Tailwind Config
**What goes wrong:** Generating `tailwind.config.ts` with JS theme extensions instead of `@theme` CSS block.
**Why it happens:** v6.1.0 scaffold skill uses Tailwind v3 pattern. The project targets Tailwind v4.
**How to avoid:** The scaffold skill must generate CSS-only configuration:
```css
@import "tailwindcss";

@theme {
  --color-bg: /* DNA */;
  --color-surface: /* DNA */;
  --animate-reveal: reveal 0.6s var(--ease-default) both;
  /* etc */
}
```
No `tailwind.config.ts` needed for basic setup. Only use `tailwind.config.ts` for plugins or complex features.
**Warning signs:** If the scaffold includes a JS config file as the primary token source.

**Confidence: HIGH** -- Verified from Phase 1 research which established Tailwind v4 `@theme` as the standard.

## Code Examples

Verified patterns from official sources for inclusion in skills.

### CSS Scroll-Driven Animation: Entrance Reveal
```css
/* Source: MDN + verified CSS spec */
@keyframes scroll-reveal {
  from { opacity: 0; transform: translateY(2rem); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal-on-scroll {
  animation: scroll-reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

### CSS Scroll-Driven Animation: Parallax
```css
/* Source: CSS spec + Chrome DevRel */
@keyframes parallax-shift {
  from { transform: translateY(0); }
  to { transform: translateY(-20%); }
}

.parallax-bg {
  animation: parallax-shift linear;
  animation-timeline: scroll();
}
```

### CSS Scroll-Driven Animation: Progress Bar
```css
/* Source: MDN */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--color-primary);
  transform-origin: left;
  animation: grow linear;
  animation-timeline: scroll();
}

@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### Motion Library: Standard Import (2026)
```tsx
// Source: motion.dev upgrade guide
'use client'
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'

// For RSC/Next.js App Router server components that render motion children:
import { motion } from 'motion/react-client'

// For bundle-size optimization:
import { LazyMotion, m, domAnimation } from 'motion/react'
```

### Motion Library: AnimatePresence for Page Transitions
```tsx
// Source: motion.dev docs
'use client'
import { AnimatePresence, motion } from 'motion/react'

// Mode: "wait" = exit completes before enter starts
// Mode: "popLayout" = exiting elements popped from layout flow
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### Next.js View Transitions (Experimental)
```tsx
// Source: Next.js docs (v16.1.6, fetched 2026-02-24)
// next.config.js
module.exports = {
  experimental: {
    viewTransition: true,
  },
}

// Component usage:
import { ViewTransition } from 'react'
// <ViewTransition> wraps elements that should participate in transitions
```

### GSAP: SplitText (Now Free)
```tsx
// Source: GSAP docs + npm
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
      const split = new SplitText(ref.current, { type: 'words,chars' })
      gsap.from(split.chars, {
        y: '100%',
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.02,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return <h2 ref={ref} className="text-5xl font-display font-bold">{text}</h2>
}
```

### Tailwind v4 @theme Animation Presets
```css
/* Source: Tailwind CSS v4 official docs */
@import "tailwindcss";

@theme {
  /* Motion presets from DNA */
  --ease-default: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-gentle: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snappy: cubic-bezier(0.3, 1.2, 0.2, 1);

  --animate-reveal: reveal 0.6s var(--ease-gentle) both;
  --animate-rise: rise 0.5s var(--ease-default) both;
  --animate-expand: expand 0.5s var(--ease-default) both;

  @keyframes reveal {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(2rem); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes expand {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }
}
```

Usage: `className="animate-reveal"`, `className="animate-rise"`, etc.

### Rive React Integration
```tsx
// Source: @rive-app/react-canvas npm + docs
'use client'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'

function RiveAnimation({ src, stateMachine }: { src: string; stateMachine: string }) {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
  })

  return <RiveComponent className="w-full h-full" />
}
```

### dotLottie React Integration
```tsx
// Source: @lottiefiles/dotlottie-react npm + docs
'use client'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

function LottieAnimation({ src }: { src: string }) {
  return (
    <DotLottieReact
      src={src}
      loop
      autoplay
      className="w-64 h-64"
    />
  )
}
```

## State of the Art

### Technology Changes Since v6.1.0

| Old (v6.1.0 era) | Current (2026) | Impact on Skills |
|-------------------|----------------|-----------------|
| `import from 'framer-motion'` | `import from 'motion/react'` | ALL code examples must use new import path |
| GSAP SplitText = paid plugin | GSAP SplitText = free | Include SplitText patterns freely in skills |
| CSS scroll-driven = Chrome only | CSS scroll-driven = Chrome + Edge + Safari 26 | Can recommend as default path |
| View Transitions = Chrome only | View Transitions = Chrome + Edge + Safari 18 | Viable for progressive enhancement |
| Tailwind v3 JS config | Tailwind v4 `@theme` CSS-first | Scaffold generates CSS, not JS config |
| Lottie JSON format | dotLottie (.lottie) binary format | Smaller files, state machines, bundled assets |
| `tailwind.config.ts` animations | `@theme { --animate-*: ... }` | Motion presets as theme variables |
| `framer-motion` bundle | `motion` with `LazyMotion` + `m` for tree-shaking | Bundle optimization patterns needed |

### CSS Scroll-Driven Animations: Browser Support Detail

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 115+ | Full support |
| Edge | 115+ | Full support |
| Safari | 26+ | Full support (NOT Safari 18) |
| Firefox | 150+ | Behind flag (`layout.css.scroll-driven-animations.enabled`) |

**Critical note:** Safari 18 does NOT support scroll-driven animations. Safari 26 (released 2025) is required. This means progressive enhancement with `@supports (animation-timeline: view())` is mandatory.

**Interop 2026** includes scroll-driven animations, meaning all major browsers are committed to interoperability.

### View Transitions API: Browser Support Detail

| Browser | Same-Document | Cross-Document | Framework Support |
|---------|--------------|----------------|-------------------|
| Chrome | 111+ | 126+ | Next.js (experimental), Astro (stable) |
| Edge | 111+ | 126+ | Next.js (experimental), Astro (stable) |
| Safari | 18+ | Not yet | Astro (stable) |
| Firefox | 144+ | Not yet | Astro (stable) |

**Framework status:**
- **Astro:** Full, stable View Transitions support with `<ViewTransitions />` component. Zero-JS option. Automatic fallback in unsupported browsers.
- **Next.js:** Experimental (`experimental.viewTransition: true` in next.config.js). Uses React's `<ViewTransition>` component. Available since Next.js 15.2. NOT recommended for production by Next.js team.

### Motion Library Evolution

| Feature | framer-motion | motion 12.x |
|---------|---------------|-------------|
| Package | `framer-motion` | `motion` |
| React import | `from 'framer-motion'` | `from 'motion/react'` |
| RSC import | N/A | `from 'motion/react-client'` |
| Bundle optimization | N/A | `LazyMotion` + `m` component + `domAnimation` features |
| Vanilla JS | No | Yes (`from 'motion'`) |
| Vue support | No | Yes (`from 'motion/vue'`) |
| AnimatePresence modes | `sync`, `wait` | `sync`, `wait`, `popLayout` |

### GSAP Plugin Availability (All Free)

| Plugin | Purpose | Skill Reference |
|--------|---------|----------------|
| ScrollTrigger | Scroll-linked animation triggers | Cinematic Motion, Wow Moments |
| SplitText | Text splitting for word/char animation | Cinematic Motion, Wow Moments |
| MorphSVG | SVG shape morphing | Wow Moments |
| DrawSVG | SVG path drawing | Wow Moments |
| CustomEase | Custom easing curves | Cinematic Motion |
| Flip | FLIP animation | Page Transitions |
| Observer | Scroll/touch/pointer detection | Cinematic Motion |

**Deprecated/outdated from v6.1.0:**
- `framer-motion` import path -- use `motion/react`
- `tailwind.config.ts` theme extension pattern -- use `@theme` CSS block
- GSAP Club membership mentions -- all plugins are free
- Safari 18 scroll-driven animation claims -- requires Safari 26

## Open Questions

### 1. Exact Safari Scroll-Driven Animations Support Version
- **What we know:** Can I Use shows Safari 26+ for `animation-timeline: scroll()`. WebKit blog published a guide referencing "Safari 26 beta." Earlier search results mentioned Safari 18 support, but this appears to be for View Transitions API, not scroll-driven animations.
- **What's unclear:** Whether Safari 18 has partial support or none at all for scroll-driven animations.
- **Recommendation:** Be conservative. Document Safari 26+ as the support floor for scroll-driven animations. Always include `@supports` progressive enhancement. The earlier claim of "Safari 18" appears to have been conflating View Transitions API support with scroll-driven animations support -- they are different APIs.

**Confidence: MEDIUM** -- Can I Use data says Safari 26, but some sources say Safari 18. Being conservative (Safari 26+) is safer.

### 2. Firefox Scroll-Driven Animation Timeline
- **What we know:** Firefox has had support behind a flag for years. Interop 2026 commits to cross-browser interop.
- **What's unclear:** When Firefox will ship unflagged support.
- **Recommendation:** Include Firefox fallback patterns. The `@supports` approach handles this gracefully -- if no support, elements remain visible with no animation (graceful degradation, not broken layout).

### 3. Motion Library Version Stability
- **What we know:** Motion 12.x is current (12.34.3 as of Feb 2026). The API is stable and backward-compatible with framer-motion.
- **What's unclear:** Whether Motion 13.x will bring breaking changes.
- **Recommendation:** Use `motion/react` imports throughout. The API surface (motion component, AnimatePresence, useScroll, useTransform, variants) is stable across versions.

### 4. Skill File Size for Wow Moments with 19 Archetypes
- **What we know:** 30+ patterns x 19 archetypes in the auto-suggestion matrix could be large.
- **What's unclear:** Whether the matrix fits cleanly in the skill or needs to be a separate reference.
- **Recommendation:** Use compact tables (archetype rows x beat columns = recommended patterns). Not every cell needs to be filled. A 19-row x 6-column table is ~25-30 lines and highly scannable.

### 5. Merging vs Keeping Separate Library Skills
- **What we know:** v6.1.0 has separate `css-animations`, `framer-motion`, and `gsap-animations` skills. Phase 5 creates `cinematic-motion` and `performance-aware-animation` which subsume much of this content.
- **What's unclear:** Whether the three library-specific skills should be kept, merged, or deleted.
- **Recommendation:** The Cinematic Motion skill becomes the single motion skill with a CSS-first decision tree, Motion patterns, and GSAP patterns. The three library-specific v6.1.0 skills get culled/merged. The Performance-Aware Animation skill handles the "when to use which library" decision. This avoids duplication.

## Skill-Specific Research Findings

### 05-01: Cinematic Motion Skill

**Key changes from v6.1.0:**
1. Add CSS scroll-driven animation as the DEFAULT path (v6.1.0 uses Motion for everything)
2. Update all code examples from `framer-motion` to `motion/react`
3. Add beat-dependent scroll behavior (HOOK/PEAK = continuous scroll-linked, others = entrance only)
4. Add motion diversity enforcement (no 3 consecutive same-direction)
5. Add hybrid preset model (archetype base + DNA tweaks)
6. Add 3 new archetype profiles (Neubrutalism, Dark Academia, AI-Native)
7. Include progressive enhancement patterns for CSS scroll-driven

**Key CSS syntax to document:**
```css
animation-timeline: scroll();     /* scroll position of container */
animation-timeline: view();       /* element visibility in viewport */
animation-range: entry 0% entry 100%;   /* during entry phase */
animation-range: cover 0% cover 100%;   /* during full cover */
animation-range: contain 0% contain 100%; /* while fully contained */
```

### 05-02: Creative Tension Skill

**Key changes from v6.1.0:**
1. Add safe range vs aggressive range per tension level (not just one implementation)
2. Add dual adjacency rules (different tension types + spacing between tension sections)
3. Full copy-paste TSX for ALL 19 archetype tension techniques (v6.1.0 has 16)
4. Add Neubrutalism, Dark Academia, AI-Native tension techniques
5. Calibrate tension mandates per archetype (archetype-driven, not global)

### 05-03: Wow Moment Library Skill

**Key changes from v6.1.0:**
1. Tiered code specificity (not full TSX for everything)
2. Auto-suggestion matrix (archetype x beat x content -> recommendations)
3. Add View Transitions API patterns
4. Add Rive state machine patterns (Tier 3)
5. Add dotLottie patterns (replacing old Lottie JSON)
6. WebGL shader patterns as Tier 3 guidance

### 05-04: Page Transition Skill

**New skill. Key patterns to document:**
1. View Transitions API (native): Browser API with CSS `view-transition-name`, `::view-transition-*` pseudo-elements
2. View Transitions in Astro (stable, zero-JS)
3. View Transitions in Next.js (experimental, `<ViewTransition>` component)
4. Motion AnimatePresence (reliable fallback): `mode="wait"` for sequential, `mode="popLayout"` for immediate layout
5. Shared element transitions: Motion `layoutId` for FLIP animations between routes
6. Per-archetype choreography: Brutalist = instant (no transition), Luxury = slow crossfade, Kinetic = directional slide

### 05-05: Performance-Aware Animation Skill

**Key patterns to document:**
1. CSS-first decision tree (compositor thread > main thread)
2. `@supports (animation-timeline: view())` progressive enhancement
3. Code-splitting heavy libraries:
   ```tsx
   // Dynamic import GSAP only when needed
   const gsapModule = await import('gsap')
   const { ScrollTrigger } = await import('gsap/ScrollTrigger')
   ```
4. `will-change` discipline: apply dynamically via JS before animation, remove after
5. Font loading strategy: `next/font` for Next.js, `font-display: swap`, variable fonts preferred
6. Performance budgets:
   - CSS animations: 0 KB JS overhead
   - Motion (tree-shaken): ~15-25 KB gzipped
   - GSAP core: ~25 KB gzipped
   - GSAP + ScrollTrigger + SplitText: ~40 KB gzipped
   - React Three Fiber + Three.js: ~150+ KB gzipped (always code-split)
7. Intersection Observer as lightweight trigger (when CSS view() insufficient):
   ```tsx
   // Lighter than importing Motion just for whileInView
   const observer = new IntersectionObserver(entries => {
     entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting))
   }, { threshold: 0.2 })
   ```
8. `prefers-reduced-motion` handling at every level

### 05-06: Design System Scaffold Skill

**Key changes from v6.1.0:**
1. Tailwind v4 `@theme` instead of `tailwind.config.ts`
2. Hard token enforcement via typed utilities
3. Full beat templates per emotional beat type
4. `--animate-*` theme variables for motion presets
5. Wave 0 generates everything from DNA automatically
6. Extension mechanism for builders who need additional tokens

**Typed utility approach:**
```tsx
// colors.ts -- Only accepts DNA tokens
type DNAColor = 'bg' | 'surface' | 'text' | 'border' | 'primary' | 'secondary' | 'accent' | 'muted' | 'glow' | 'tension' | 'highlight' | 'signature'

export function bg(color: DNAColor): string {
  return `bg-${color}`
}

// Prevents: bg-[#ff0000] (arbitrary hex)
// Enables:  bg(primary) -> "bg-primary"
```

**Beat template approach:**
```tsx
// Each beat type gets a starter template
const beatTemplates: Record<BeatType, BeatTemplate> = {
  hook: {
    minHeight: '90vh',
    maxElements: 5,
    whitespace: '60-70%',
    motionPreset: 'dramatic-entrance',
    background: 'primary or accent gradient',
  },
  breathe: {
    minHeight: '30vh',
    maxElements: 3,
    whitespace: '70-80%',
    motionPreset: 'reveal-only',
    background: 'primary (clean)',
  },
  // ... etc
}
```

## Sources

### Primary (HIGH confidence)
- MDN CSS Scroll-Driven Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations -- API syntax, browser support, scroll() and view() functions
- Can I Use animation-timeline scroll(): https://caniuse.com/mdn-css_properties_animation-timeline_scroll -- Browser version matrix (Chrome 115+, Safari 26+, Firefox flagged)
- Next.js viewTransition docs (v16.1.6): https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition -- Experimental flag, React ViewTransition component
- Motion upgrade guide: https://motion.dev/docs/react-upgrade-guide -- Import path changes, `motion/react` vs `framer-motion`
- Tailwind CSS v4 animation docs: https://tailwindcss.com/docs/animation -- `--animate-*` theme variables, `@keyframes` in `@theme` blocks
- Tailwind CSS v4 theme docs: https://tailwindcss.com/docs/theme -- `@theme` directive syntax
- GSAP npm/GitHub: https://www.npmjs.com/package/gsap -- v3.14.2, all plugins free
- WebKit scroll-driven animations guide: https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/ -- Safari support details
- Interop 2026 announcement: https://webkit.org/blog/17818/announcing-interop-2026/ -- Scroll-driven animations in Interop 2026
- @rive-app/react-canvas npm: https://www.npmjs.com/package/@rive-app/react-canvas -- v4.26.2
- @lottiefiles/dotlottie-react npm: https://www.npmjs.com/package/@lottiefiles/dotlottie-react -- v0.18.1
- @react-three/fiber npm: https://www.npmjs.com/package/@react-three/fiber -- v9.5.0

### Secondary (MEDIUM confidence)
- Chrome DevRel scroll-driven animation performance study: https://developer.chrome.com/blog/scroll-animation-performance-case-study -- Compositor thread performance data
- Smashing Magazine scroll-driven animations intro: https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/ -- Practical patterns
- Rive vs Lottie comparison: https://dev.to/uianimation/rive-vs-lottie-which-animation-tool-should-you-use-in-2025-p4m -- File size comparison (10-15x smaller)
- Codrops WebGL shader tutorials: https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects/ -- GSAP + WebGL integration patterns
- React Three Fiber docs: https://r3f.docs.pmnd.rs/ -- Current API patterns
- Astro View Transitions docs: https://docs.astro.build/en/guides/view-transitions/ -- Stable, zero-JS implementation

### Tertiary (LOW confidence)
- Safari 18 vs Safari 26 scroll-driven support discrepancy: Multiple sources give conflicting information. Being conservative with Safari 26+.
- Firefox unflagged scroll-driven timeline: Unknown when flag will be removed. Interop 2026 suggests it will happen in 2026.
- Motion v13 breaking changes: No information available. Current v12.x API appears stable.

## Metadata

**Confidence breakdown:**
- CSS scroll-driven animation API/syntax: HIGH -- verified via MDN and official specs
- Browser support matrix: HIGH -- verified via Can I Use (with Safari version caveat)
- Motion library migration: HIGH -- verified via official upgrade guide
- GSAP licensing/availability: HIGH -- verified via npm and GitHub
- View Transitions API state: HIGH -- verified via Next.js docs and browser compat
- Tailwind v4 animation integration: HIGH -- verified via official docs
- Performance recommendations: MEDIUM -- based on Chrome DevRel case studies + general web performance knowledge
- Rive/Lottie comparison: MEDIUM -- based on multiple comparison articles
- Skill file size estimates: MEDIUM -- based on v6.1.0 analysis and tiered specificity approach
- Auto-suggestion matrix design: MEDIUM -- architectural recommendation, not verified against existing implementations

**Research date:** 2026-02-24
**Valid until:** 60 days (motion libraries are moderately fast-moving; CSS spec is stable; browser support is expanding)
