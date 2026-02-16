---
name: cinematic-motion
description: "Cinematic motion vocabulary with 10-direction system, frame-by-frame choreography, multi-layer hover states, 9 scroll patterns with full code, and per-archetype motion personalities."
---

Use this skill when implementing animations, scroll effects, hover states, or any motion design. Triggers on: animation, motion, scroll effect, hover, transition, choreography, cinematic, parallax, GSAP, Framer Motion, scroll-driven, entrance animation.

You are a motion director who treats every animation as a scene in a film. Motion is not decoration — it communicates hierarchy, draws attention, creates emotion, and guides the eye. Every animation must answer: "What story does this motion tell?"

## 10-Direction Motion Vocabulary

Every motion must have a clear DIRECTION. No generic "fade in" — define WHERE things come from and WHERE they go.

### 1. REVEAL
> Hidden content becomes visible in place. No movement, just materialization.

```tsx
// Opacity only — element exists in place, just becomes visible
const reveal = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}
```
**Use for:** Background elements, textures, ambient details.

### 2. ENTER-STAGE
> Element slides in from off-screen like an actor entering a stage.

```tsx
// Horizontal entrance — from left or right
const enterStageLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}
const enterStageRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}
```
**Use for:** Product screenshots, feature images, side content.

### 3. RISE
> Element rises from below, as if surfacing.

```tsx
const rise = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}
```
**Use for:** Primary content, headlines, CTAs. The default for most text elements.

### 4. DROP
> Element descends from above, settling into place.

```tsx
const drop = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}
```
**Use for:** Navigation, top-attached elements, dropdown content.

### 5. EXPAND
> Element scales up from a smaller state, like a flower blooming.

```tsx
const expand = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}
```
**Use for:** Cards, images, modals, any container element.

### 6. UNFOLD
> Element reveals its content progressively, like unfolding paper.

```tsx
// Height reveal with clip-path
const unfold = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}
```
**Use for:** Text blocks, content sections, progressive disclosure.

### 7. CASCADE
> Multiple elements enter in rapid succession with staggered timing.

```tsx
const cascadeContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
}
const cascadeItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}
```
**Use for:** Lists, grids, feature cards, any repeated elements.

### 8. SWARM
> Multiple elements converge from different directions toward a center point.

```tsx
// Each element comes from a different position
const swarmPositions = [
  { x: -40, y: -20 },
  { x: 40, y: -30 },
  { x: -30, y: 40 },
  { x: 50, y: 20 },
]
const swarmItem = (index: number) => ({
  hidden: { opacity: 0, ...swarmPositions[index % swarmPositions.length] },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 } }
})
```
**Use for:** Logos, icons, scattered elements that need to feel alive.

### 9. SCATTER
> Inverse of swarm — elements move outward from a center point.

```tsx
const scatter = (index: number, total: number) => {
  const angle = (index / total) * Math.PI * 2
  const distance = 30
  return {
    hidden: { opacity: 1, x: 0, y: 0 },
    visible: {
      opacity: 0,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      transition: { duration: 0.5 }
    }
  }
}
```
**Use for:** Exit animations, dismissed elements, explosion effects.

### 10. FREEZE
> Element that is deliberately static while everything else moves.

```tsx
// No animation variants — intentionally static
<div className="relative z-10"> {/* Static content */}
  <h2 className="text-4xl font-bold">This doesn't move.</h2>
</div>
```
**Use for:** Anchors, key statements, elements that need authority. The stillness creates contrast.

---

## Frame-by-Frame Choreography Sequences

### HOOK Beat Choreography
```
Frame 0 (0ms):     All hidden
Frame 1 (0-200ms): Background treatment REVEAL
Frame 2 (200ms):   Overline label RISE
Frame 3 (350ms):   Headline RISE (stagger per word if split)
Frame 4 (550ms):   Subtext RISE
Frame 5 (700ms):   CTA buttons RISE (stagger 80ms between)
Frame 6 (900ms):   Product image ENTER-STAGE (from right) or EXPAND
Frame 7 (1100ms):  Decorative elements REVEAL (ambient glow, particles)
```

### REVEAL Beat Choreography
```
Frame 0 (0ms):     Section background REVEAL
Frame 1 (100ms):   Product/demo container EXPAND
Frame 2 (300ms):   Product content UNFOLD
Frame 3 (500ms):   Supporting text RISE
Frame 4 (700ms):   Interactive elements CASCADE
```

### BUILD Beat Choreography
```
Frame 0 (0ms):     Section heading RISE
Frame 1 (150ms):   Section description RISE
Frame 2 (300ms):   Grid/cards CASCADE (60ms stagger)
Frame 3 (ongoing): Individual card hover states active
```

### PEAK Beat Choreography
```
Frame 0 (0ms):     Background shift (color/gradient REVEAL)
Frame 1 (200ms):   Heading RISE with emphasis (larger, bolder)
Frame 2 (400ms):   WOW moment element EXPAND or custom animation
Frame 3 (700ms):   Supporting elements CASCADE
Frame 4 (1000ms):  Interactive state activated
```

### CLOSE Beat Choreography
```
Frame 0 (0ms):     Background treatment REVEAL
Frame 1 (200ms):   Heading RISE
Frame 2 (400ms):   Supporting text RISE
Frame 3 (600ms):   CTA button EXPAND (with glow REVEAL)
Frame 4 (800ms):   Trust text (friction reducer) REVEAL
```

---

## Multi-Layer Hover Choreography

### 3-Layer Card Hover
```tsx
<div className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 transition-all duration-300">
  {/* Layer 1: Background glow (slowest, 500ms) */}
  <div className="absolute inset-0 rounded-2xl bg-[var(--color-glow)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

  {/* Layer 2: Border brightens (medium, 300ms) */}
  <div className="absolute inset-0 rounded-2xl border border-[var(--color-accent-1)]/0 group-hover:border-[var(--color-accent-1)]/20 transition-colors duration-300" />

  {/* Layer 3: Content lifts (fastest, 200ms) */}
  <div className="transition-transform duration-200 group-hover:-translate-y-1">
    <h3 className="text-lg font-semibold">Card Title</h3>
    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Description</p>
  </div>

  {/* Layer 3b: Arrow/icon appears (200ms, delayed 100ms) */}
  <div className="absolute bottom-6 right-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 delay-100">
    <ArrowRight className="h-4 w-4 text-[var(--color-accent-1)]" />
  </div>
</div>
```

### Aggressive Button Hover
```tsx
<button className="group relative overflow-hidden rounded-xl bg-[var(--color-accent-1)] px-8 py-4 font-semibold text-white">
  {/* Background: expanding circle from cursor position */}
  <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full origin-center" />

  {/* Text: slides up, replaced by different text */}
  <span className="relative z-10 flex flex-col overflow-hidden h-6">
    <span className="transition-transform duration-300 group-hover:-translate-y-full">
      Get Started
    </span>
    <span className="absolute transition-transform duration-300 translate-y-full group-hover:translate-y-0">
      Let's Build →
    </span>
  </span>
</button>
```

---

## 9 Scroll Patterns with Full Code

### 1. Scroll-Triggered Morph
```tsx
'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function ScrollMorph() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '50%', '0%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8])

  return (
    <div ref={ref} className="h-[200vh] flex items-center justify-center">
      <motion.div
        style={{ borderRadius, scale }}
        className="w-64 h-64 bg-[var(--color-accent-1)]"
      />
    </div>
  )
}
```

### 2. Text Reveal Word-by-Word
```tsx
'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function ScrollTextReveal({ text }: { text: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'start 0.2'] })
  const words = text.split(' ')

  return (
    <p ref={ref} className="text-4xl font-bold tracking-tight flex flex-wrap gap-x-3 gap-y-1">
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />
      })}
    </p>
  )
}

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: any }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return <motion.span style={{ opacity }}>{word}</motion.span>
}
```

### 3. Velocity-Responsive Effects
```tsx
'use client'
import { useScroll, useVelocity, useTransform, motion } from 'framer-motion'

function VelocitySkew() {
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const skewY = useTransform(velocity, [-3000, 0, 3000], [-3, 0, 3])
  const scaleX = useTransform(velocity, [-3000, 0, 3000], [0.98, 1, 0.98])

  return (
    <motion.div style={{ skewY, scaleX }} className="will-change-transform">
      <img src="/hero.jpg" alt="Hero" className="w-full" />
    </motion.div>
  )
}
```

### 4. Counter / Progress on Scroll
```tsx
'use client'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { useRef, useState } from 'react'

function ScrollCounter({ target }: { target: number }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end center'] })
  const [count, setCount] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCount(Math.round(v * target))
  })

  return (
    <div ref={ref}>
      <span className="text-6xl font-bold tabular-nums">{count.toLocaleString()}</span>
    </div>
  )
}
```

### 5. Horizontal Scroll-Jack
```tsx
'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function HorizontalScroll({ items }: { items: React.ReactNode[] }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(items.length - 1) * 100 / items.length}%`])

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex">
          {items.map((item, i) => (
            <div key={i} className="w-screen flex-shrink-0 px-12 flex items-center justify-center">
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

### 6. Background Color Shift on Scroll
```css
/* Pure CSS scroll-driven background shift */
@keyframes bgShift {
  0% { background-color: var(--color-bg-primary); }
  33% { background-color: var(--color-bg-secondary); }
  66% { background-color: var(--color-accent-1); }
  100% { background-color: var(--color-bg-primary); }
}

.scroll-bg-shift {
  animation: bgShift linear both;
  animation-timeline: scroll();
}
```

### 7. Scroll-Snap Reveal
```tsx
<section className="h-screen snap-y snap-mandatory overflow-y-auto">
  {panels.map((panel, i) => (
    <div key={i} className="h-screen snap-start flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.5 }}
      >
        {panel.content}
      </motion.div>
    </div>
  ))}
</section>
```

### 8. Apple-Style Image Sequence
```tsx
'use client'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { useRef, useState } from 'react'

function ImageSequence({ frameCount, basePath }: { frameCount: number; basePath: string }) {
  const ref = useRef(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const [images, setImages] = useState<HTMLImageElement[]>([])

  // Preload frames
  useEffect(() => {
    const loaded: HTMLImageElement[] = []
    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.src = `${basePath}/frame-${String(i).padStart(4, '0')}.webp`
      loaded.push(img)
    }
    setImages(loaded)
  }, [frameCount, basePath])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const index = Math.min(Math.floor(v * frameCount), frameCount - 1)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && images[index]?.complete) {
      ctx.drawImage(images[index], 0, 0, canvas!.width, canvas!.height)
    }
  })

  return (
    <div ref={ref} className="h-[500vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <canvas ref={canvasRef} width={1920} height={1080} className="max-w-full max-h-full" />
      </div>
    </div>
  )
}
```

### 9. Parallax Text Stack
```tsx
'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function ParallaxTextStack({ lines }: { lines: string[] }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  return (
    <div ref={ref} className="py-32 overflow-hidden">
      {lines.map((line, i) => {
        const direction = i % 2 === 0 ? 1 : -1
        const x = useTransform(scrollYProgress, [0, 1], [direction * 200, direction * -200])
        return (
          <motion.p
            key={i}
            style={{ x }}
            className="text-[8vw] font-bold leading-none text-[var(--color-text-primary)]/10 whitespace-nowrap"
          >
            {line}
          </motion.p>
        )
      })}
    </div>
  )
}
```

---

## Per-Archetype Motion Personalities

| Archetype | Default Easing | Duration Range | Stagger | Primary Direction | Character |
|-----------|---------------|----------------|---------|-------------------|-----------|
| **Brutalist** | `steps(1)` or `cubic-bezier(0.9, 0, 0.1, 1)` | 100-300ms | 0ms (instant) | N/A (instant) | Abrupt, no transition > 150ms |
| **Ethereal** | `cubic-bezier(0.4, 0, 0.2, 1)` | 600-1200ms | 150ms | RISE, REVEAL | Slow, graceful, floating |
| **Kinetic** | `cubic-bezier(0.16, 1, 0.3, 1)` | 300-600ms | 60ms | All directions | Energetic, varied, choreographed |
| **Editorial** | `cubic-bezier(0.4, 0, 0.2, 1)` | 400-600ms | 100ms | RISE, UNFOLD | Restrained, text-focused |
| **Neo-Corporate** | `cubic-bezier(0.16, 1, 0.3, 1)` | 300-500ms | 80ms | RISE, CASCADE | Precise, polished |
| **Organic** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 500-800ms | 100ms | RISE, EXPAND | Bouncy, natural, spring-like |
| **Retro-Future** | `steps(3)` or `linear` | 100-400ms | 40ms | UNFOLD, REVEAL | Glitchy, stepped, digital |
| **Luxury** | `cubic-bezier(0.4, 0, 0.2, 1)` | 600-1000ms | 200ms | REVEAL, RISE | Slow, deliberate, elegant |
| **Playful** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 300-600ms | 80ms | RISE, EXPAND | Bouncy, springy, fun |
| **Data-Dense** | `cubic-bezier(0.16, 1, 0.3, 1)` | 200-400ms | 40ms | REVEAL, CASCADE | Quick, functional, minimal |
| **Japanese Minimal** | `cubic-bezier(0.4, 0, 0.2, 1)` | 800-1500ms | 200ms | REVEAL | Extremely slow, zen |
| **Glassmorphism** | `cubic-bezier(0.16, 1, 0.3, 1)` | 400-700ms | 80ms | EXPAND, REVEAL | Layered, depth-aware |
| **Neon Noir** | `cubic-bezier(0.7, 0, 0.3, 1)` | 300-600ms | 60ms | REVEAL, RISE | Electric, sharp |
| **Warm Artisan** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 400-700ms | 100ms | RISE, REVEAL | Warm, handcrafted feel |
| **Swiss** | `linear` or `ease` | 200-400ms | 0ms | REVEAL only | Minimal, almost no motion |
| **Vaporwave** | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | 300-800ms | 60ms | All | Glitchy, retro, overshooting |

---

## Reduced Motion Fallback

EVERY motion pattern must include a reduced-motion alternative:

```tsx
// Framer Motion — automatic reduced-motion support
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  // Framer Motion respects prefers-reduced-motion automatically
>

// CSS — manual reduced-motion handling
<div className="motion-safe:animate-[rise_0.6s_ease-out_both] motion-reduce:animate-none opacity-100 motion-safe:opacity-0">

// For complex JS animations, check the preference
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false
```
