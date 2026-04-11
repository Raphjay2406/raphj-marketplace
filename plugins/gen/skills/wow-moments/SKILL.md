---
name: wow-moments
description: "30+ signature interaction patterns in 4 categories with tiered code specificity, three-factor auto-suggestion matrix (archetype x beat x content), and reduced-motion fallbacks."
tier: core
triggers: "wow moment, interactive, signature interaction, impressive, screenshot-worthy, memorable, cursor effect, scroll effect, ambient effect, magnetic button, parallax, tilt card, gradient mesh, particles, 3D viewer"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Add Wow Moments

Wow moments are signature interactions that make a section memorable and screenshot-worthy. They are NOT decoration -- each must serve the emotional arc.

**Beat-based rules:**
- **PEAK** beats should ALWAYS have a wow moment -- this is the designated impressive moment
- **HOOK** beats benefit from ambient or scroll-responsive wow moments to set the tone
- **CLOSE** beats benefit from a single interactive element (magnetic CTA, gradient background)
- **PROOF/BUILD** beats: subtle interactive only (expandable cards, counters, spotlight grids)
- **BREATHE** beats: ambient only (if any) -- gradient mesh, aurora, morphing blob
- **TEASE** beats: scroll-responsive (text reveal, highlight on scroll)
- Never add wow moments to fill space -- if a section's content is strong, let it breathe

### Archetype Intensity Modifier

This table controls how many wow moments per page and which categories are appropriate. Builders MUST respect these limits.

| Archetype | Max Wow/Page | Preferred Categories | Avoid |
|-----------|-------------|---------------------|-------|
| Brutalist | 2-3 | Cursor (distortion, repulsion), scroll | Ambient (too soft), interactive (too polished) |
| Ethereal | 2-3 | Ambient (aurora, mesh, blob), scroll (subtle) | Cursor (too aggressive), interactive |
| Kinetic | 5+ | All categories | None |
| Editorial | 1-2 | Scroll (text reveal, line draw), ambient (subtle) | Cursor, interactive (too playful) |
| Neo-Corporate | 3-4 | Scroll, interactive, ambient (living grid) | Cursor (too playful) |
| Organic | 2-3 | Ambient (blob, aurora), scroll (parallax) | Cursor, interactive (too digital) |
| Retro-Future | 3-4 | Cursor (trail, custom cursor), ambient (particles) | None |
| Luxury | 2-3 | Scroll (parallax, zoom), ambient (mesh, aurora) | Interactive (too playful), cursor (too casual) |
| Playful | 4-5 | Interactive, cursor, ambient (shapes) | None |
| Data-Dense | 2-3 | Interactive (calculator, counters), scroll (counters) | Ambient (distracting), cursor |
| Japanese Minimal | 1 | Ambient only (subtle mesh or blob) | Cursor, interactive, scroll (too busy) |
| Glassmorphism | 3-4 | Cursor (spotlight), ambient (mesh, aurora), scroll | Interactive (breaks glass metaphor) |
| Neon Noir | 3-4 | Cursor (trail, reveal), ambient (particles, grid) | Interactive (too corporate) |
| Warm Artisan | 1-2 | Ambient (blob, mesh), scroll (subtle) | Cursor, interactive (too digital) |
| Swiss | 0-1 | Scroll (subtle counters) | Cursor, ambient, interactive (too decorative) |
| Vaporwave | 3-4 | Cursor (trail, distortion), ambient (mesh, particles) | Interactive (too functional) |
| Neubrutalism | 2-3 | Interactive (expandable, drag), cursor (magnetic) | Ambient (too refined) |
| Dark Academia | 1-2 | Scroll (text reveal, line draw), ambient (subtle) | Cursor, interactive (too modern) |
| AI-Native | 3-4 | Ambient (particles, grid, mesh), scroll, interactive | None |

### Tiered Code Specificity

Not every pattern needs full TSX. Code completeness scales with pattern complexity:

- **Tier 1 (Copy-Paste):** Complete TSX component, 15-30 lines. Drop in and adjust DNA tokens. For simple, self-contained effects that work universally.
- **Tier 2 (Pattern + Setup):** Component structure + key implementation code, 20-40 lines. Needs project-specific adaptation (content, sizing, library config). For effects that require setup or customization.
- **Tier 3 (Guidance + Reference):** Architecture description, library setup, integration skeleton. For complex effects requiring deep project-specific customization (3D scenes, shader effects, state machines).

### Reduced Motion Requirement

Every pattern MUST document its `prefers-reduced-motion` handling:
- **Tier 1:** Include reduced-motion CSS/hook inline in the code
- **Tier 2-3:** State the fallback approach (static image, no animation, simpler animation)
- **Default rule:** If `prefers-reduced-motion: reduce` is active, show the end state (fully visible, no movement). Never hide content behind an animation that cannot play.

## Layer 2: Award-Winning Examples

### Category 1: Cursor-Responsive (8 Patterns)

All cursor-responsive patterns are Tier 1 (copy-paste TSX). These are lightweight, GPU-composited effects that work on any desktop layout.

#### 1. Magnetic Button

Button pulls toward cursor on approach. The signature interactive CTA.

**Beat:** HOOK, CLOSE, PEAK | **Archetype:** Kinetic, Playful, Neon Noir, Glassmorphism, Neubrutalism

```tsx
'use client'
import { useRef, useState } from 'react'

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = ref.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPos({ x: x * 0.3, y: y * 0.3 })
  }

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      className="rounded-xl bg-primary px-8 py-4 font-semibold text-text transition-transform duration-200 ease-out"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      {children}
    </button>
  )
}
```

**Reduced motion:** Disable magnetic pull, render as standard button. Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and skip `setPos`.

#### 2. Custom Cursor

Cursor morphs based on hover target -- reading cursor for text, pointer with label for links, magnifier for images.

**Beat:** Any (global element) | **Archetype:** Kinetic, Luxury, Brutalist, Neon Noir

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [variant, setVariant] = useState<'default' | 'link' | 'text'>('default')
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setVariant(t.closest('a, button') ? 'link' : t.closest('p, h1, h2, h3') ? 'text' : 'default')
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [])
  const sizes = { default: 'h-4 w-4', link: 'h-12 w-12', text: 'h-1 w-6' }
  return (
    <div ref={ref}
      className={`pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent transition-all duration-200 mix-blend-difference ${sizes[variant]}`} />
  )
}
```

**Reduced motion:** Hide custom cursor entirely, use system cursor.

#### 3. Spotlight Card

Card surface illuminated by cursor position -- gradient follows mouse creating a lighting effect.

**Beat:** BUILD, REVEAL | **Archetype:** Neo-Corporate, Glassmorphism, Kinetic, Neon Noir

```tsx
'use client'
import { useRef } from 'react'

export function SpotlightCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    card.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(400px_circle_at_var(--mx)_var(--my),var(--color-glow),transparent_40%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
```

**Reduced motion:** Show static card without spotlight effect.

#### 4. Tilt Card

3D perspective tilt following cursor movement. Creates depth and tactility.

**Beat:** BUILD, REVEAL, PEAK | **Archetype:** Neo-Corporate, Glassmorphism, Luxury, Playful

```tsx
'use client'
import { useRef, useState } from 'react'

export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(`perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransform('')}
      className="rounded-2xl border border-border bg-surface p-6 transition-transform duration-200 ease-out"
      style={{ transform }}
    >
      {children}
    </div>
  )
}
```

**Reduced motion:** Static card, no tilt effect.

#### 5. Text Distortion

Characters push away from cursor position. Dramatic headline interaction.

**Beat:** HOOK, PEAK | **Archetype:** Brutalist, Kinetic, Vaporwave

```tsx
'use client'

export function CursorDistortText({ text }: { text: string }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const chars = e.currentTarget.querySelectorAll<HTMLSpanElement>('[data-char]')
    chars.forEach(char => {
      const rect = char.getBoundingClientRect()
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2))
      const intensity = Math.max(0, 1 - dist / 150)
      char.style.transform = `translateY(${-intensity * 15}px) scale(${1 + intensity * 0.2})`
    })
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.querySelectorAll<HTMLSpanElement>('[data-char]').forEach(c => { c.style.transform = '' })
  }

  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <p className="font-display text-6xl font-bold tracking-tight">
        {text.split('').map((c, i) => (
          <span key={i} data-char className="inline-block transition-transform duration-150">
            {c === ' ' ? '\u00A0' : c}
          </span>
        ))}
      </p>
    </div>
  )
}
```

**Reduced motion:** Static text, no distortion. Limit to headlines under 50 characters for performance.

#### 6. Cursor Trail

Fading trail of shapes following cursor. Creates a sense of fluid motion.

**Beat:** HOOK, PEAK | **Archetype:** Neon Noir, Vaporwave, Kinetic, Retro-Future

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function CursorTrail({ count = 12 }: { count?: number }) {
  const dots = useRef<HTMLDivElement[]>([])
  const pos = useRef(Array.from({ length: count }, () => ({ x: 0, y: 0 })))
  useEffect(() => {
    let id: number
    const onMove = (e: MouseEvent) => { pos.current[0] = { x: e.clientX, y: e.clientY } }
    const tick = () => {
      for (let i = pos.current.length - 1; i > 0; i--) {
        pos.current[i].x += (pos.current[i - 1].x - pos.current[i].x) * 0.3
        pos.current[i].y += (pos.current[i - 1].y - pos.current[i].y) * 0.3
      }
      dots.current.forEach((d, i) => {
        if (!d) return
        d.style.transform = `translate(${pos.current[i].x}px, ${pos.current[i].y}px) scale(${1 - i / count})`
        d.style.opacity = `${1 - i / count}`
      })
      id = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove)
    id = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(id) }
  }, [count])
  return <>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} ref={el => { if (el) dots.current[i] = el }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
    ))}
  </>
}
```

**Reduced motion:** Hide trail entirely.

#### 7. Hover Reveal

Content revealed in a circle around cursor position -- like wiping frost from glass.

**Beat:** HOOK, PEAK, REVEAL | **Archetype:** Neon Noir, Luxury, Brutalist

```tsx
'use client'
import { useRef } from 'react'

export function HoverReveal({ hiddenSrc, visibleChildren }: { hiddenSrc: string; visibleChildren: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--rx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--ry', `${e.clientY - rect.top}px`)
  }

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className="relative overflow-hidden cursor-none">
      <div>{visibleChildren}</div>
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-200 hover:opacity-100"
        style={{
          backgroundImage: `url(${hiddenSrc})`,
          backgroundSize: 'cover',
          clipPath: 'circle(80px at var(--rx, 50%) var(--ry, 50%))',
        }}
      />
    </div>
  )
}
```

**Reduced motion:** Show both layers at 50% blend, no clip-path tracking.

#### 8. Repulsion Grid

Grid elements push away from cursor, creating a ripple-like displacement.

**Beat:** PEAK, HOOK | **Archetype:** Kinetic, Vaporwave, Playful, AI-Native

```tsx
'use client'
import { useRef } from 'react'

export function RepulsionGrid({ cols = 10, rows = 10 }: { cols?: number; rows?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseMove = (e: React.MouseEvent) => {
    const grid = ref.current
    if (!grid) return
    const rect = grid.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    grid.querySelectorAll<HTMLDivElement>('[data-dot]').forEach(dot => {
      const dx = dot.offsetLeft + dot.offsetWidth / 2 - mx
      const dy = dot.offsetTop + dot.offsetHeight / 2 - my
      const f = Math.max(0, 1 - Math.hypot(dx, dy) / 120)
      dot.style.transform = `translate(${dx * f * 0.4}px, ${dy * f * 0.4}px)`
    })
  }
  return (
    <div ref={ref} onMouseMove={handleMouseMove}
      onMouseLeave={() => ref.current?.querySelectorAll<HTMLDivElement>('[data-dot]').forEach(d => { d.style.transform = '' })}
      className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols * rows }, (_, i) => (
        <div key={i} data-dot className="h-2 w-2 rounded-full bg-accent/30 transition-transform duration-150" />
      ))}
    </div>
  )
}
```

**Reduced motion:** Static grid, no displacement.

---

### Category 2: Scroll-Responsive (10 Patterns)

Scroll-responsive patterns use CSS scroll-driven animations where possible (compositor thread, zero JS). JS libraries (Motion, GSAP) only when CSS cannot express the effect.

#### 9. Parallax Layers

Multi-depth parallax using CSS scroll-driven animations. Zero JS, compositor thread.

**Beat:** HOOK, PEAK | **Archetype:** Kinetic, Ethereal, Glassmorphism, Luxury

```css
/* CSS-only parallax -- add to globals.css or component styles */
@supports (animation-timeline: scroll()) {
  .parallax-back {
    animation: parallax-slow linear both;
    animation-timeline: scroll();
  }
  .parallax-mid {
    animation: parallax-medium linear both;
    animation-timeline: scroll();
  }
  @keyframes parallax-slow { to { transform: translateY(-10%); } }
  @keyframes parallax-medium { to { transform: translateY(-20%); } }
}
```

```tsx
export function ParallaxLayers({ back, mid, front }: { back: React.ReactNode; mid: React.ReactNode; front: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="parallax-back absolute inset-0">{back}</div>
      <div className="parallax-mid absolute inset-0">{mid}</div>
      <div className="relative z-10">{front}</div>
    </div>
  )
}
```

**Reduced motion:** No parallax, all layers static at base position.

#### 10. Perspective Zoom

Element scales from 80% to 100% with a rotateX tilt as it scrolls into view, creating a sense of emerging from depth.

**Beat:** REVEAL, BUILD | **Archetype:** Neo-Corporate, Kinetic, Glassmorphism

```tsx
'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export function PerspectiveZoom({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [10, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <div ref={ref} style={{ perspective: '1200px' }}>
      <motion.div style={{ scale, rotateX, opacity }}>{children}</motion.div>
    </div>
  )
}
```

**Reduced motion:** Show at full scale and opacity, no zoom effect.

#### 11. Sticky Stack

Cards stack on top of each other as user scrolls past. Each card pins and scales down slightly as the next card overlaps it.

**Beat:** BUILD, PROOF | **Archetype:** Neo-Corporate, Kinetic, Editorial

```tsx
export function StickyStack({ cards }: { cards: { title: string; content: React.ReactNode }[] }) {
  return (
    <div className="relative">
      {cards.map((card, i) => (
        <div key={i} className="sticky top-24 mb-8" style={{ zIndex: i + 1 }}>
          <div
            className="rounded-2xl border border-border bg-surface p-8 shadow-xl"
            style={{ transform: `scale(${1 - (cards.length - i) * 0.02})` }}
          >
            <h3 className="font-display text-xl font-bold">{card.title}</h3>
            <div className="mt-4">{card.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Reduced motion:** Cards in vertical stack without sticky behavior.

#### 12. Animated Counters

Numbers count up from 0 to target when scrolled into view. Use CSS scroll-driven for the trigger.

**Beat:** PROOF, BUILD | **Archetype:** Neo-Corporate, Data-Dense, Playful, AI-Native

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

export function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const duration = 1500
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          setValue(Math.round(target * progress))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref} className="font-display text-5xl font-bold tabular-nums">{value.toLocaleString()}{suffix}</span>
}
```

**Reduced motion:** Show final number immediately, no counting animation.

#### 13. SVG Line Draw

SVG path draws itself as the user scrolls. Uses Motion for smooth scroll-linked progress.

**Beat:** REVEAL, BUILD | **Archetype:** Organic, Swiss, Editorial, Japanese Minimal

```tsx
'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export function LineDrawOnScroll({ path, viewBox = '0 0 400 200' }: { path: string; viewBox?: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end center'] })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={ref}>
      <svg viewBox={viewBox} className="w-full">
        <motion.path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="2" style={{ pathLength }} />
      </svg>
    </div>
  )
}
```

**Reduced motion:** Show completed path immediately, no draw animation.

#### 14. Text Word-by-Word Reveal

Text appears word by word on scroll using CSS scroll-driven animations. Zero JS.

**Beat:** TEASE, REVEAL | **Archetype:** Editorial, Luxury, Dark Academia, Ethereal

```css
/* CSS scroll-driven word reveal */
@supports (animation-timeline: view()) {
  .word-reveal span {
    opacity: 0;
    animation: word-appear linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }
  .word-reveal span:nth-child(2) { animation-delay: 50ms; }
  .word-reveal span:nth-child(3) { animation-delay: 100ms; }
  /* Continue for desired word count, or use GSAP SplitText for dynamic count */
  @keyframes word-appear { to { opacity: 1; } }
}
```

```tsx
export function WordReveal({ text }: { text: string }) {
  return (
    <p className="word-reveal font-display text-4xl font-bold leading-relaxed">
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em]" style={{ animationDelay: `${i * 50}ms` }}>
          {word}
        </span>
      ))}
    </p>
  )
}
```

**Reduced motion:** All words visible immediately.

#### 15. Horizontal Scroll-Jack [Tier 2]

Section scrolls horizontally while page scrolls vertically. Pin the container and translate content.

**Beat:** BUILD, PEAK | **Archetype:** Kinetic, Luxury, Editorial
**Setup:** GSAP + ScrollTrigger (for reliable pin behavior) or CSS scroll-driven

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current
      if (!track) return
      const scrollWidth = track.scrollWidth - track.clientWidth
      gsap.to(track, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${scrollWidth}`,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div ref={trackRef} className="flex gap-8">{children}</div>
    </div>
  )
}
```

**Adaptation needed:** Adjust `gap`, card widths, and pin duration based on content count.
**Reduced motion:** Standard vertical layout, no pinning.

#### 16. Before/After Slider [Tier 2]

Drag to compare two images. Vertical divider follows pointer.

**Beat:** TENSION, REVEAL, PROOF | **Archetype:** Any
**Setup:** No external dependencies

```tsx
'use client'
import { useRef, useState } from 'react'

export function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div ref={containerRef} className="relative aspect-video cursor-ew-resize overflow-hidden rounded-2xl"
      onMouseMove={e => handleMove(e.clientX)}
      onTouchMove={e => handleMove(e.touches[0].clientX)}>
      <img src={after} alt="After" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={before} alt="Before" className="h-full w-full object-cover" style={{ width: `${containerRef.current?.offsetWidth}px` }} />
      </div>
      <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%` }} />
    </div>
  )
}
```

**Adaptation needed:** Image sources, aspect ratio, optional label overlays.
**Reduced motion:** Side-by-side comparison layout instead of overlay slider.

#### 17. Scroll-Linked Video [Tier 2]

Video frames advance with scroll position. User controls playback by scrolling.

**Beat:** PEAK, REVEAL | **Archetype:** Kinetic, Luxury, Neo-Corporate
**Setup:** Motion useScroll + video element

```tsx
'use client'
import { useRef, useEffect } from 'react'
import { useScroll } from 'motion/react'

export function ScrollVideo({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  useEffect(() => {
    return scrollYProgress.on('change', v => {
      if (videoRef.current) videoRef.current.currentTime = v * (videoRef.current.duration || 0)
    })
  }, [scrollYProgress])
  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <video ref={videoRef} src={src} muted playsInline preload="auto" className="w-full max-w-4xl rounded-2xl" />
      </div>
    </div>
  )
}
```

**Adaptation needed:** Video source, container height (controls scrub speed), sticky positioning.
**Reduced motion:** Autoplay video at normal speed, or show poster image.

#### 18. Split Screen Merge [Tier 2]

Two halves of the viewport slide together and merge as user scrolls, revealing unified content.

**Beat:** REVEAL, PEAK | **Archetype:** Luxury, Kinetic, Editorial
**Setup:** Motion useScroll + useTransform

```tsx
'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export function SplitScreenMerge({ left, right, merged }: {
  left: React.ReactNode; right: React.ReactNode; merged: React.ReactNode
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const xL = useTransform(scrollYProgress, [0, 1], ['-50%', '0%'])
  const xR = useTransform(scrollYProgress, [0, 1], ['50%', '0%'])
  const op = useTransform(scrollYProgress, [0.8, 1], [0, 1])
  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden">
      <motion.div className="absolute left-0 top-0 h-full w-1/2" style={{ x: xL }}>{left}</motion.div>
      <motion.div className="absolute right-0 top-0 h-full w-1/2" style={{ x: xR }}>{right}</motion.div>
      <motion.div className="relative z-10" style={{ opacity: op }}>{merged}</motion.div>
    </div>
  )
}
```

**Adaptation needed:** Content for each half, merge point timing, z-index layering.
**Reduced motion:** Show merged content directly, no split animation.

---

### Category 3: Interactive (7 Patterns)

Interactive patterns respond to user input beyond hover and scroll -- clicks, drags, form inputs.

#### 19. Expandable Cards

Cards expand to reveal detailed content. Layout animation creates smooth transitions.

**Beat:** BUILD, PROOF | **Archetype:** Any

```tsx
'use client'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

export function ExpandableCard({ title, preview, children }: { title: string; preview: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div layout onClick={() => setOpen(!open)}
      className="cursor-pointer rounded-2xl border border-border bg-surface p-6 overflow-hidden">
      <motion.h3 layout="position" className="text-lg font-semibold">{title}</motion.h3>
      <motion.p layout="position" className="mt-2 text-sm text-muted">{preview}</motion.p>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-4 border-t border-border pt-4">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

**Reduced motion:** Instant expand/collapse, no animation.

#### 20. Drag-to-Reveal

Drag an element to reveal content underneath. Playful interaction that rewards curiosity.

**Beat:** REVEAL, PEAK | **Archetype:** Kinetic, Playful, Neubrutalism

```tsx
'use client'
import { motion } from 'motion/react'

export function DragToReveal({ cover, revealed }: { cover: React.ReactNode; revealed: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="p-8">{revealed}</div>
      <motion.div drag dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
        className="absolute inset-0 cursor-grab rounded-2xl bg-surface p-8 active:cursor-grabbing">
        {cover}
      </motion.div>
    </div>
  )
}
```

**Reduced motion:** Show revealed content directly, hide cover.

#### 21. Interactive Calculator [Tier 2]

Form inputs that update a visual preview in real-time. For pricing, configurators, or estimation tools.

**Beat:** BUILD | **Archetype:** Neo-Corporate, Playful, Data-Dense, AI-Native
**Setup:** React state + computed values

```tsx
'use client'
import { useState } from 'react'

export function PricingCalculator({ tiers }: { tiers: { name: string; basePrice: number; perUnit: number }[] }) {
  const [units, setUnits] = useState(10)
  const [selected, setSelected] = useState(0)
  const total = tiers[selected].basePrice + tiers[selected].perUnit * units

  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <div className="flex gap-4 mb-6">
        {tiers.map((tier, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${i === selected ? 'bg-primary text-bg' : 'bg-bg text-text'}`}>
            {tier.name}
          </button>
        ))}
      </div>
      <label className="block mb-4">
        <span className="text-sm text-muted">Units: {units}</span>
        <input type="range" min={1} max={100} value={units} onChange={e => setUnits(+e.target.value)}
          className="mt-1 w-full accent-primary" />
      </label>
      <p className="font-display text-4xl font-bold">${total.toLocaleString()}<span className="text-lg text-muted">/mo</span></p>
    </div>
  )
}
```

**Adaptation needed:** Tier data, pricing formula, visual feedback style.
**Reduced motion:** No animation concerns -- this is interaction-driven, not motion-driven.

#### 22. 3D Product Viewer [Tier 3]

React Three Fiber orbit controls around a 3D model. Full 360-degree product exploration.

**Beat:** REVEAL, PEAK | **Archetype:** Luxury, Neo-Corporate, Playful
**Libraries:** `@react-three/fiber`, `@react-three/drei`, `three`

**Architecture:**
The viewer uses R3F Canvas with OrbitControls from drei. The model is loaded via useGLTF (for .glb files) or a primitive mesh. Environment lighting from drei provides realistic reflections. The component is code-split via `dynamic(() => import('./ProductViewer'), { ssr: false })` in Next.js.

```tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src)
  return <primitive object={scene} />
}

export function ProductViewer({ modelSrc }: { modelSrc: string }) {
  return (
    <div className="aspect-square w-full rounded-2xl overflow-hidden bg-surface">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <Suspense fallback={null}>
          <Model src={modelSrc} />
          <Environment preset="studio" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

**Key decisions for builder:** Model format (.glb preferred), environment preset, camera distance, auto-rotate speed, enable/disable zoom.
**Reduced motion:** Static rendered image of the product, no 3D canvas. ALWAYS code-split Three.js.

#### 23. Interactive Timeline [Tier 2]

Click-through or scrubber timeline for history, process, or milestones.

**Beat:** BUILD, PROOF | **Archetype:** Neo-Corporate, Editorial, Dark Academia
**Setup:** React state + scroll behavior

```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function Timeline({ events }: { events: { year: string; title: string; body: React.ReactNode }[] }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex gap-12">
      <div className="flex flex-col gap-2">
        {events.map((event, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${i === active ? 'bg-primary text-bg' : 'text-muted hover:text-text'}`}>
            {event.year}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="flex-1">
          <h3 className="font-display text-2xl font-bold">{events[active].title}</h3>
          <div className="mt-4 text-muted">{events[active].body}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
```

**Adaptation needed:** Event data, layout direction (horizontal/vertical), visual styling.
**Reduced motion:** Instant content switch, no slide animation.

#### 24. Morphing Shape Menu [Tier 2]

Navigation element that morphs between states using layout animation.

**Beat:** Any (navigation) | **Archetype:** Kinetic, Playful, AI-Native
**Setup:** Motion layout animations

```tsx
'use client'
import { motion } from 'motion/react'
import { useState } from 'react'

export function MorphMenu({ items }: { items: string[] }) {
  const [active, setActive] = useState(0)

  return (
    <nav className="relative flex gap-1 rounded-full bg-surface p-1">
      {items.map((item, i) => (
        <button key={i} onClick={() => setActive(i)} className="relative z-10 rounded-full px-4 py-2 text-sm font-medium">
          {item}
          {i === active && (
            <motion.div layoutId="morph-indicator" className="absolute inset-0 rounded-full bg-primary"
              style={{ zIndex: -1 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
          )}
        </button>
      ))}
    </nav>
  )
}
```

**Adaptation needed:** Menu items, shape (pill, rectangle, underline), colors.
**Reduced motion:** Instant indicator jump, no morphing animation.

#### 25. Physics Playground [Tier 3]

Elements with realistic physics -- gravity, bounce, collision. For playful, interactive demonstrations.

**Beat:** PEAK, REVEAL | **Archetype:** Kinetic, Playful, Neubrutalism
**Libraries:** `matter-js` for 2D physics, or custom spring physics

**Architecture:**
Create a Matter.js world with ground, walls, and interactive bodies. Render via CSS transforms (not canvas) for DOM integration. RAF loop syncs `body.position` to `element.style.transform`. Add mouse constraint for drag interaction.

```tsx
// Setup: Matter.Engine.create() -> add Bodies (ground, walls, circles)
// -> MouseConstraint.create() for drag -> RAF loop syncs positions to DOM
import Matter from 'matter-js'
```

**Key decisions for builder:** Body shapes/sizes, gravity strength, wall boundaries, interaction model (click to add vs drag existing).
**Reduced motion:** Static arrangement of elements, no physics simulation.

---

### Category 4: Ambient (10 Patterns)

Ambient patterns create atmosphere without requiring user interaction. They run continuously in the background.

#### 26. Gradient Mesh Background

Animated multi-point gradient using blurred div orbs. The universal atmospheric backdrop.

**Beat:** HOOK, BREATHE, any background | **Archetype:** Ethereal, Glassmorphism, Neo-Corporate, Neon Noir

```tsx
export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px] animate-drift" />
      <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px] animate-drift [animation-direction:reverse] [animation-duration:25s]" />
      <div className="absolute top-[60%] left-[50%] h-[300px] w-[300px] rounded-full bg-glow/10 blur-[80px] animate-drift [animation-delay:2s] [animation-duration:18s]" />
    </div>
  )
}
/* Requires in @theme: --animate-drift: drift 20s ease-in-out infinite;
   @keyframes drift { 0%,100% { transform: translate(0,0) } 50% { transform: translate(30px,-20px) } } */
```

**Reduced motion:** Static gradient orbs, no animation. Use `motion-safe:animate-drift` Tailwind modifier.

#### 27. Aurora Effect

Soft, flowing aurora borealis background. Ethereal and calming.

**Beat:** HOOK, CLOSE, BREATHE | **Archetype:** Ethereal, Glassmorphism, Neon Noir, AI-Native

```tsx
export function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent blur-[60px] animate-aurora" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent blur-[80px] animate-aurora [animation-direction:reverse] [animation-duration:20s]" />
    </div>
  )
}
/* Requires: @keyframes aurora { 0%,100% { transform: translateY(0) scaleY(1) } 50% { transform: translateY(-20%) scaleY(1.5) } }
   --animate-aurora: aurora 15s ease-in-out infinite; */
```

**Reduced motion:** Static gradient, no movement.

#### 28. Morphing Blob

Organic SVG shape that continuously morphs its form using animated border-radius or SVG.

**Beat:** HOOK, BREATHE | **Archetype:** Organic, Ethereal, Playful

```tsx
export function MorphingBlob({ color = 'var(--color-accent)' }: { color?: string }) {
  return (
    <div className="pointer-events-none" aria-hidden="true">
      <div
        className="h-64 w-64 animate-morph opacity-50 blur-sm"
        style={{ backgroundColor: color, borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
      />
    </div>
  )
}
/* Requires: @keyframes morph {
  0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
} --animate-morph: morph 8s ease-in-out infinite; */
```

**Reduced motion:** Static blob shape, no morphing.

#### 29. Particle Field

Subtle floating particles as background. Uses Canvas for performance with many particles.

**Beat:** HOOK, PEAK | **Archetype:** Kinetic, Neon Noir, Retro-Future, AI-Native

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function ParticleField({ count = 60 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth * devicePixelRatio
    canvas.height = canvas.offsetHeight * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    const color = getComputedStyle(canvas).getPropertyValue('--color-accent').trim() || '#6366f1'
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 2 + 0.5,
    }))
    let id: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color; ctx.globalAlpha = 0.3; ctx.fill()
      })
      id = requestAnimationFrame(draw)
    }
    id = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(id)
  }, [count])
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" />
}
```

**Reduced motion:** Static particles rendered once, no animation loop.

#### 30. Living Grid

Grid lines that subtly pulse or glow at intersections. Data-infrastructure feel.

**Beat:** HOOK, BUILD | **Archetype:** Neo-Corporate, Data-Dense, Kinetic, AI-Native

```tsx
export function LivingGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="h-full w-full"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}
      />
      {/* Pulsing intersection dots */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle 2px, var(--color-glow) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        animation: 'pulse 3s ease-in-out infinite',
      }} />
    </div>
  )
}
```

**Reduced motion:** Static grid without pulsing dots.

#### 31. Noise Texture Animation [Tier 2]

Subtle animated grain/noise overlay that adds tactile quality.

**Beat:** Any background | **Archetype:** Brutalist, Warm Artisan, Dark Academia, Editorial
**Setup:** SVG filter turbulence or CSS background-image with noise PNG

```css
/* CSS noise overlay using SVG filter */
.noise-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  filter: url(#noise);
  animation: noise-shift 0.5s steps(5) infinite;
}
/* @keyframes noise-shift { to { transform: translate(2px, -2px); } } */
```

```tsx
export function NoiseOverlay() {
  return (
    <>
      <svg className="hidden">
        <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter>
      </svg>
      <div className="noise-overlay" aria-hidden="true" />
    </>
  )
}
```

**Adaptation needed:** Opacity (0.02-0.08), animation speed, noise frequency.
**Reduced motion:** Static noise texture, no animation.

#### 32. Generative Art Background [Tier 2]

Algorithmic pattern that regenerates on each visit. Unique every time.

**Beat:** HOOK, BREATHE | **Archetype:** AI-Native, Kinetic, Organic
**Setup:** Canvas 2D + seeded random

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function GenerativeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth * devicePixelRatio
    canvas.height = canvas.offsetHeight * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    const color = getComputedStyle(canvas).getPropertyValue('--color-accent').trim() || '#6366f1'
    for (let i = 0; i < 200; i++) {
      ctx.beginPath()
      let x = Math.random() * w, y = Math.random() * h
      ctx.moveTo(x, y)
      for (let j = 0; j < 50; j++) {
        const a = Math.sin(x * 0.01) * Math.cos(y * 0.01) * Math.PI * 2
        x += Math.cos(a) * 2; y += Math.sin(a) * 2; ctx.lineTo(x, y)
      }
      ctx.strokeStyle = color; ctx.globalAlpha = 0.05; ctx.stroke()
    }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" />
}
```

**Adaptation needed:** Algorithm type (flow field, Voronoi, circles), color palette, density.
**Reduced motion:** No animation concerns -- renders once on mount.

#### 33. WebGL Shader Background [Tier 3]

Custom fragment shader for liquid, holographic, or noise-based backgrounds. Maximum visual impact.

**Beat:** HOOK, PEAK | **Archetype:** Kinetic, Neon Noir, AI-Native, Luxury
**Libraries:** `@react-three/fiber`, `three` (or raw WebGL for minimal bundle)

**Architecture:**
A full-screen quad with a custom ShaderMaterial. The fragment shader receives time, resolution, and mouse position as uniforms. Common shader types: liquid distortion (simplex noise), holographic iridescence (fresnel + noise), gradient flow (fbm noise). The R3F canvas is positioned absolutely behind content.

```tsx
// Setup skeleton -- R3F Canvas + custom ShaderMaterial
import { Canvas, useFrame } from '@react-three/fiber'
// 1. Create ShaderMaterial with uniforms: uTime, uResolution, uMouse
// 2. Full-screen plane geometry (scale=[2,2,1])
// 3. vertexShader: pass vUv to fragment
// 4. fragmentShader: use uTime + noise functions for animation
// 5. useFrame updates uTime += delta each frame
// 6. Wrap in <Canvas camera={{ position: [0,0,1] }} gl={{ alpha: true }}>
```

**Key decisions for builder:** Shader algorithm (noise type, color mapping), performance budget (resolution scaling on mobile), code-splitting strategy (ALWAYS dynamic import Three.js).
**Reduced motion:** Static gradient image, no WebGL canvas.

#### 34. Rive State Machine [Tier 3]

Interactive vector animation with state transitions. Lightweight, state-machine driven, designed in the Rive editor.

**Beat:** HOOK, PEAK, REVEAL | **Archetype:** Playful, Kinetic, AI-Native, Neo-Corporate
**Libraries:** `@rive-app/react-canvas`

**Architecture:**
Rive animations are created in the Rive editor and exported as `.riv` files (binary, ~10-15x smaller than Lottie JSON). State machines define interactive behaviors (hover, click, scroll triggers). The React integration uses `useRive` for the canvas component and `useStateMachineInput` to control inputs programmatically.

```tsx
'use client'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'

export function RiveInteraction({ src, stateMachine, inputName }: {
  src: string; stateMachine: string; inputName: string
}) {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
  })
  const input = useStateMachineInput(rive, stateMachine, inputName)

  return (
    <div
      onMouseEnter={() => input && (input.value = true)}
      onMouseLeave={() => input && (input.value = false)}
      className="aspect-square w-full"
    >
      <RiveComponent />
    </div>
  )
}
```

**Key decisions for builder:** Animation file source, state machine names, which inputs to expose to user interaction, fallback image for SSR.
**Reduced motion:** Static frame of the animation (Rive supports rendering a specific frame), or fallback image.

#### 35. dotLottie Animation [Tier 3]

Lightweight vector animation for icons, loading states, and decorative elements. Modern binary format replacing Lottie JSON.

**Beat:** BUILD, REVEAL | **Archetype:** Playful, Neo-Corporate, AI-Native
**Libraries:** `@lottiefiles/dotlottie-react`

**Architecture:**
dotLottie uses `.lottie` binary files (compressed, multi-animation support). Smaller than Lottie JSON, supports themes and state machines. Use for lightweight decorative animations where Rive is overkill.

```tsx
'use client'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export function LottieIcon({ src, loop = true, size = 'w-16 h-16' }: {
  src: string; loop?: boolean; size?: string
}) {
  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay
      className={size}
    />
  )
}
```

**Key decisions for builder:** Animation source file, loop behavior, size, trigger (autoplay vs on-hover vs on-scroll). Prefer dotLottie over Rive for simple looping animations; prefer Rive for interactive state machines.
**Reduced motion:** Show static first frame, no autoplay.

---

## Auto-Suggestion Matrix

Use these three lookup tables to find the right wow moment for any context. Start with Beat Type, filter by Archetype Intensity, then refine with Section Content.

### Table 1: Beat Type Primary Suggestions

| Beat | Cursor | Scroll | Interactive | Ambient |
|------|--------|--------|-------------|---------|
| **HOOK** | Magnetic button, custom cursor, cursor trail | Parallax layers, perspective zoom | -- | Gradient mesh, aurora, particle field |
| **PEAK** | Text distortion, repulsion grid, hover reveal | Horizontal scroll-jack, split screen merge, scroll video | 3D product viewer, drag-to-reveal, physics playground | WebGL shader, living grid |
| **BUILD** | Spotlight card, tilt card | Sticky stack, animated counters | Expandable cards, interactive calculator, timeline | -- |
| **PROOF** | -- | Animated counters, sticky stack | Before/after slider, expandable cards | -- |
| **TEASE** | -- | Text word-by-word reveal, SVG line draw | -- | -- |
| **CLOSE** | Magnetic button | -- | -- | Gradient mesh, aurora |
| **BREATHE** | -- | -- | -- | Aurora, morphing blob, gradient mesh |

### Table 2: Archetype Intensity Modifier

See the full 19-archetype table in Layer 1 above. Key reference values for quick lookup:
- **5+:** Kinetic
- **4-5:** Playful
- **3-4:** Neo-Corporate, Retro-Future, Glassmorphism, Neon Noir, Vaporwave, AI-Native
- **2-3:** Brutalist, Ethereal, Organic, Luxury, Data-Dense, Neubrutalism
- **1-2:** Editorial, Warm Artisan, Dark Academia
- **0-1:** Swiss, Japanese Minimal

### Table 3: Section Content Modifier

Refine the beat-based suggestion with what the section actually contains:

- **Hero with large image** -> Perspective zoom, parallax layers, aurora background
- **Hero with headline only** -> Text distortion, cursor trail, gradient mesh
- **Stats/metrics grid** -> Animated counters, sticky stack, living grid background
- **Feature cards** -> Spotlight card, tilt card, expandable cards
- **Testimonials** -> Sticky stack, horizontal scroll-jack
- **CTA section** -> Magnetic button, gradient mesh background
- **Portfolio/gallery** -> 3D product viewer, before/after slider, hover reveal
- **Team section** -> Tilt cards, hover reveal
- **Pricing table** -> Interactive calculator, expandable cards
- **Timeline/history** -> Interactive timeline, SVG line draw
- **Logo cloud/partners** -> Morphing shapes, living grid
- **Blog/article preview** -> Text word-by-word reveal, spotlight cards
- **Code/developer showcase** -> Noise texture, living grid, particle field
- **Video/media section** -> Scroll-linked video, split screen merge

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Wow Moments |
|-----------|---------------------|
| `--color-primary` | Gradient mesh orbs, magnetic button background, counter text |
| `--color-accent` | Particle color, spotlight glow, cursor trail, SVG stroke, blob color |
| `--color-glow` | Spotlight card radial gradient, living grid intersection dots |
| `--color-tension` | Used when a wow moment serves as a creative tension moment |
| `--color-surface` | Card backgrounds (spotlight, tilt, expandable) |
| `--color-border` | Card borders, grid lines |
| `--ease-default` | Motion transitions inherit archetype easing from DNA |
| `--motion-duration` | Wow moment animations inherit archetype duration range |

### Related Skills

- **-> Cinematic Motion**: Wow moments inherit the archetype's base motion profile (easing, duration, stagger). A Kinetic wow moment is snappy (300-600ms, sharp easing). A Luxury wow moment is languid (800-1200ms, gentle easing). Always reference the motion profile before implementing.
- **-> Creative Tension**: Some wow moments ARE tension moments. Text distortion = Scale Violence. Physics playground = Interaction Shock. Repulsion grid = Dimensional Break. When a wow moment serves as tension, it MUST follow tension adjacency rules (different types between tension sections, at least 1 non-tension section between them).
- **-> Emotional Arc**: PEAK beat wow moments should be the most impressive on the page -- use Tier 2-3 patterns for PEAK in high-intensity archetypes. HOOK wow moments set the tone. BREATHE wow moments are ambient-only. Never put a Tier 3 wow moment on a BREATHE beat.
- **-> Design DNA**: ALL wow moments use DNA color tokens. Gradient mesh uses `--color-primary`, `--color-accent`, `--color-glow`. Particle fields use `--color-accent` at low opacity. Never hardcode hex values.
- **-> Performance-Aware Animation**: Tier 3 wow moments (WebGL, Rive, dotLottie) require code-splitting. NEVER bundle Three.js/R3F on initial page load for a single wow moment. Use `next/dynamic` with `{ ssr: false }` or dynamic `import()`.
- **-> Design Archetypes**: The archetype intensity modifier in Table 2 is the primary guardrail. If the archetype says "Max 1 wow moment" (Japanese Minimal), do not add more regardless of beat suggestions.

### DNA-Parameterized Wow Moments

Wow moment effects must scale their intensity per archetype. The same "glow" effect should be dramatic for Neon Noir and subtle for Japanese Minimal.

**Glow intensity per archetype:**
| Archetype | Glow Layers | Glow Radius | Glow Opacity | Glow Color Token |
|-----------|------------|-------------|-------------|-----------------|
| Neon Noir | 3 (inner + mid + outer) | 20px, 40px, 80px | 0.8, 0.5, 0.2 | `--color-glow` |
| Ethereal | 2 (inner + outer) | 8px, 30px | 0.3, 0.1 | `--color-accent` |
| Kinetic | 1 (sharp) | 4px | 0.6 | `--color-primary` |
| Japanese Minimal | 0 (no glow) | -- | -- | -- |
| Brutalist | 0 (no glow) | -- | -- | -- |
| Neo-Corporate | 1 (subtle) | 6px | 0.2 | `--color-primary` |

**Parallax depth per archetype:**
| Archetype | Parallax Factor | Direction | Feel |
|-----------|----------------|-----------|------|
| Ethereal | 0.3 (deep) | Vertical | Floating, dreamy |
| Kinetic | 0.15 (fast) | Multi-axis | Energetic, responsive |
| Editorial | 0.1 (subtle) | Vertical only | Measured, controlled |
| Brutalist | 0 (none) | -- | Static, confrontational |
| Luxury | 0.2 (moderate) | Vertical | Elegant, layered |

**Animation easing per archetype:**
All wow moments should use the archetype's motion personality easing, NOT hardcoded values:
- Read easing from DNA `--motion-easing-*` tokens
- Read duration scale from DNA `--motion-duration-*` tokens
- Read stagger timing from DNA `--motion-stagger` token

Example: A magnetic button should use `transition: transform [DNA duration] [DNA easing]` not `transition: transform 300ms ease-out`.

### Pipeline Stage

- **Input from:** Section planner assigns beat types and content descriptions. Builder receives wow moment recommendation via spawn prompt.
- **Output to:** Builder implements wow moment. Quality reviewer checks against archetype intensity limits. Creative director evaluates wow moment quality and placement.

## Layer 4: Anti-Patterns

### Anti-Pattern: Wow Moment Overload

**What goes wrong:** 6 wow moments on a page for a Swiss archetype. Overwhelms the design, contradicts archetype personality, and causes performance issues from multiple animation loops.
**Instead:** Respect the archetype intensity modifier table. Swiss gets 0-1. Japanese Minimal gets 1. Even Kinetic (5+) should space them across the page with non-wow sections between them.

### Anti-Pattern: Wrong Category for Archetype

**What goes wrong:** Cursor-responsive wow moments (text distortion, repulsion grid) in a Japanese Minimal design. The playful, attention-seeking interaction contradicts the archetype's calm restraint.
**Instead:** Check the "Avoid" column in the archetype intensity table. Japanese Minimal avoids cursor, interactive, and scroll -- ambient only. Dark Academia avoids cursor and interactive -- scroll and subtle ambient only.

### Anti-Pattern: All Tier 1 for High-Intensity PEAK

**What goes wrong:** Using only simple copy-paste patterns (magnetic button, gradient mesh) for a PEAK beat in a Kinetic archetype. Tier 1 patterns are delightful but not impressive enough for a designated wow moment in a bold archetype.
**Instead:** PEAK beats in high-intensity archetypes (Kinetic, Neon Noir, Playful) should use Tier 2-3 patterns: horizontal scroll-jack, 3D product viewer, physics playground, WebGL shader. Save Tier 1 for BUILD/PROOF/CLOSE beats.

### Anti-Pattern: Missing Reduced Motion

**What goes wrong:** Implementing a particle field or cursor trail without `prefers-reduced-motion` handling. Users with vestibular disorders experience nausea or discomfort.
**Instead:** EVERY pattern must degrade gracefully. Tier 1: static end state (visible, no movement). Tier 2-3: fallback image or simplified version. Use `window.matchMedia('(prefers-reduced-motion: reduce)')` or Tailwind's `motion-safe:` / `motion-reduce:` modifiers.

### Anti-Pattern: Arbitrary Colors in Wow Moments

**What goes wrong:** Gradient mesh with hardcoded `#ff6b6b` and `#4ecdc4` instead of DNA tokens. Breaks the design system, creates color drift, fails anti-slop gate.
**Instead:** ALL colors reference DNA tokens via CSS custom properties: `var(--color-primary)`, `var(--color-accent)`, `var(--color-glow)`. In TSX: use Tailwind classes (`bg-primary`, `text-accent`) or CSS variables directly.

### Anti-Pattern: Unbundled Heavy Libraries

**What goes wrong:** Importing Three.js and React Three Fiber in the main bundle for a single 3D product viewer. Adds 150+ KB gzipped to every page load.
**Instead:** Always code-split Tier 3 dependencies. In Next.js: `dynamic(() => import('./ProductViewer'), { ssr: false })`. In Vite/Astro: dynamic `import()` with intersection observer trigger. Load heavy libraries only when the wow moment is about to enter the viewport.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Wow moments per page (archetype max) | 0 | archetype-defined | count | HARD -- reject if exceeded |
| Tier 1 pattern code length | 10 | 35 | lines | SOFT -- warn if exceeded |
| Tier 2 pattern code length | 15 | 50 | lines | SOFT -- warn if exceeded |
| Reduced motion handling | required | -- | boolean | HARD -- reject if missing |
| DNA token usage | required | -- | boolean | HARD -- reject if hardcoded colors |
| Three.js/R3F code splitting | required | -- | boolean | HARD -- reject if bundled in main |
| Particle count (canvas) | 20 | 100 | count | SOFT -- performance guidance |
| Cursor-responsive char limit | -- | 50 | chars | SOFT -- performance guidance |
| Animation FPS target | 30 | 60 | fps | HARD -- investigate if below 30 |
| Page-level wow moment spacing | 1 | -- | sections between | SOFT -- avoid adjacent wow moments |
