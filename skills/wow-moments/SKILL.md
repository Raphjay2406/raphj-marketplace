---
name: wow-moments
description: "30+ signature interaction patterns across 4 categories: cursor-responsive, scroll-responsive, interactive, and ambient. Each with full TSX code, archetype compatibility, beat compatibility, and reduced-motion fallbacks."
---

Use this skill when a section needs a memorable interactive moment, when implementing the PEAK beat, or when the design needs a screenshot-worthy element. Triggers on: wow moment, interactive, signature interaction, impressive, screenshot-worthy, memorable, cursor effect, scroll effect, ambient effect, 3D, particles.

You are an interaction designer who creates moments people share. Every wow moment must be: technically sound, accessible, performant, and genuinely impressive. Not gimmicky — genuinely impressive.

## Cursor-Responsive Patterns (8)

### 1. Magnetic Buttons
Buttons that subtly pull toward the cursor as it approaches.

```tsx
'use client'
import { useRef, useState } from 'react'

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = ref.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.3, y: y * 0.3 })
  }

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 })

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-xl bg-[var(--color-accent-1)] px-8 py-4 font-semibold text-white transition-transform duration-200 ease-out"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {children}
    </button>
  )
}
```
**Archetypes:** Kinetic, Playful, Neon Noir, Glassmorphism
**Beat types:** HOOK, CLOSE, PEAK
**Performance:** Transform only — 60fps safe. No layout recalc.
**Reduced motion:** Disable magnetic effect, keep standard button.

### 2. Spotlight Grid
Cards that reveal a radial spotlight following the cursor.

```tsx
'use client'
import { useRef } from 'react'

function SpotlightCard({ children }: { children: React.ReactNode }) {
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
      className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(400px_circle_at_var(--mx)_var(--my),var(--color-glow),transparent_40%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
```
**Archetypes:** Neo-Corporate, Glassmorphism, Kinetic, Neon Noir
**Beat types:** BUILD, REVEAL
**Performance:** CSS custom properties — GPU composited.
**Reduced motion:** Show static card without spotlight.

### 3. Text Distortion on Cursor
Text that warps or distorts based on cursor proximity.

```tsx
'use client'
function CursorDistortText({ text }: { text: string }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const chars = e.currentTarget.querySelectorAll<HTMLSpanElement>('[data-char]')
    chars.forEach(char => {
      const rect = char.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
      const maxDist = 150
      const intensity = Math.max(0, 1 - dist / maxDist)
      char.style.transform = `translateY(${-intensity * 15}px) scale(${1 + intensity * 0.2})`
      char.style.opacity = `${0.4 + intensity * 0.6}`
    })
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const chars = e.currentTarget.querySelectorAll<HTMLSpanElement>('[data-char]')
    chars.forEach(char => {
      char.style.transform = ''
      char.style.opacity = ''
    })
  }

  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="cursor-default">
      <p className="text-6xl font-bold tracking-tight">
        {text.split('').map((char, i) => (
          <span key={i} data-char className="inline-block transition-all duration-150">
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </p>
    </div>
  )
}
```
**Archetypes:** Brutalist, Kinetic, Vaporwave
**Beat types:** HOOK, PEAK
**Performance:** Per-character transforms — limit to headlines (< 50 chars).
**Reduced motion:** Static text, no distortion.

### 4. Parallax Tilt Card
Cards that tilt in 3D based on cursor position.

```tsx
'use client'
import { useRef, useState } from 'react'

function TiltCard({ children }: { children: React.ReactNode }) {
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

  const handleMouseLeave = () => setTransform('perspective(800px) rotateY(0) rotateX(0) scale(1)')

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 transition-transform duration-200 ease-out"
      style={{ transform }}
    >
      {children}
    </div>
  )
}
```
**Archetypes:** Neo-Corporate, Glassmorphism, Luxury, Playful
**Beat types:** BUILD, REVEAL, PEAK
**Performance:** Transform only — GPU composited.
**Reduced motion:** Static card, no tilt.

### 5. Cursor Shape Morph
Custom cursor that changes shape based on context.

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [variant, setVariant] = useState<'default' | 'hover' | 'click'>('default')

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  const sizes = { default: 'h-4 w-4', hover: 'h-12 w-12', click: 'h-3 w-3' }

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-accent-1)] transition-all duration-200 mix-blend-difference ${sizes[variant]}`}
    />
  )
}
```
**Archetypes:** Kinetic, Luxury, Brutalist
**Beat types:** Any (global element)
**Performance:** Single DOM element, transform-based movement.
**Reduced motion:** Hide custom cursor, use system cursor.

### 6. Repulsion Effect
Elements that push away from the cursor.

**Archetypes:** Kinetic, Vaporwave, Playful
**Beat types:** PEAK, ambient background

### 7. Gravity Particles
Particles that orbit and follow the cursor with physics.

**Archetypes:** Neon Noir, Kinetic, Glassmorphism
**Beat types:** HOOK (background), PEAK

### 8. Cursor Reveal Mask
Content hidden until the cursor sweeps over it, like a flashlight.

**Archetypes:** Neon Noir, Luxury, Brutalist
**Beat types:** HOOK, PEAK, REVEAL

---

## Scroll-Responsive Patterns (8)

### 1. Perspective Zoom
Element scales and gains perspective depth as user scrolls.

```tsx
'use client'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

function PerspectiveZoom({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [10, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <div ref={ref} className="[perspective:1200px]">
      <motion.div style={{ scale, rotateX, opacity }}>
        {children}
      </motion.div>
    </div>
  )
}
```
**Archetypes:** Neo-Corporate, Kinetic, Glassmorphism
**Beat types:** REVEAL, BUILD

### 2. Text Highlight on Scroll
Text that highlights/bolds word-by-word as user scrolls past.

**Archetypes:** Editorial, Luxury, Japanese Minimal
**Beat types:** TEASE, REVEAL, BREATHE

### 3. Split-Screen Merge
Two halves of an image/layout that merge together on scroll.

**Archetypes:** Luxury, Kinetic, Editorial
**Beat types:** REVEAL, PEAK

### 4. Animated Counters
Numbers that count up from 0 to target as they enter the viewport.

**Archetypes:** Neo-Corporate, Data-Dense, Playful
**Beat types:** PROOF, TEASE

### 5. SVG Line Draw
SVG paths that draw themselves as the user scrolls.

```tsx
'use client'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

function LineDrawOnScroll() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end center'] })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={ref}>
      <svg viewBox="0 0 400 200" className="w-full">
        <motion.path
          d="M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80 S 230 10, 260 80 S 310 150, 340 80 S 370 10, 390 80"
          fill="none"
          stroke="var(--color-accent-1)"
          strokeWidth="2"
          style={{ pathLength }}
        />
      </svg>
    </div>
  )
}
```
**Archetypes:** Organic, Swiss, Editorial, Japanese Minimal
**Beat types:** REVEAL, BUILD

### 6. Depth Layers (Parallax)
Multiple layers moving at different scroll speeds for depth.

**Archetypes:** Kinetic, Ethereal, Glassmorphism
**Beat types:** HOOK, PEAK

### 7. Horizontal Scroll-Jack
Vertical scroll converted to horizontal movement for a section.

**Archetypes:** Kinetic, Luxury, Creative portfolios
**Beat types:** BUILD, PEAK

### 8. Sticky Stack
Cards that stack on top of each other as user scrolls.

```tsx
function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  return (
    <div className="relative">
      {cards.map((card, i) => (
        <div
          key={i}
          className="sticky top-24 mb-8"
          style={{ zIndex: i + 1 }}
        >
          <div
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 shadow-xl"
            style={{ transform: `scale(${1 - (cards.length - i) * 0.02})` }}
          >
            {card}
          </div>
        </div>
      ))}
    </div>
  )
}
```
**Archetypes:** Neo-Corporate, Kinetic, Editorial
**Beat types:** BUILD, PROOF

---

## Interactive Patterns (8)

### 1. Before/After Slider
Draggable comparison between two states.

**Archetypes:** Any
**Beat types:** TENSION, REVEAL, PROOF

### 2. 3D Product Viewer
Draggable 3D rotation of a product.

**Archetypes:** Luxury, Neo-Corporate, Playful
**Beat types:** REVEAL, PEAK

### 3. Code Copy Block
Styled code block with one-click copy and syntax highlighting.

**Archetypes:** Neo-Corporate, Retro-Future, Data-Dense
**Beat types:** REVEAL, BUILD

### 4. Theme Toggle Preview
Live dark/light mode toggle that shows the design in both modes.

**Archetypes:** Neo-Corporate, Glassmorphism
**Beat types:** BUILD, PEAK

### 5. Pricing Calculator
Interactive sliders/inputs that calculate custom pricing.

**Archetypes:** Neo-Corporate, Playful, Data-Dense
**Beat types:** BUILD (pricing section)

### 6. Expandable Cards
Cards that expand to reveal full content when clicked.

```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

function ExpandableCard({ title, preview, full }: { title: string; preview: string; full: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      layout
      onClick={() => setOpen(!open)}
      className="cursor-pointer rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 overflow-hidden"
    >
      <motion.h3 layout="position" className="text-lg font-semibold">{title}</motion.h3>
      <motion.p layout="position" className="mt-2 text-sm text-[var(--color-text-secondary)]">{preview}</motion.p>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-[var(--color-border)]"
          >
            {full}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```
**Archetypes:** Any
**Beat types:** BUILD, PROOF

### 7. Drag Demo
A mini draggable demonstration of the product's core interaction.

**Archetypes:** Kinetic, Playful
**Beat types:** REVEAL, PEAK

### 8. Terminal Demo
Interactive terminal that types commands and shows output.

```tsx
'use client'
import { useState, useEffect } from 'react'

function TerminalDemo({ commands }: { commands: { input: string; output: string }[] }) {
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    if (currentLine >= commands.length) return
    const cmd = commands[currentLine]

    if (currentChar < cmd.input.length) {
      const timeout = setTimeout(() => setCurrentChar(c => c + 1), 50 + Math.random() * 50)
      return () => clearTimeout(timeout)
    }

    // Show output after typing completes
    const timeout = setTimeout(() => {
      setLines(prev => [...prev, `$ ${cmd.input}`, cmd.output])
      setCurrentLine(l => l + 1)
      setCurrentChar(0)
    }, 500)
    return () => clearTimeout(timeout)
  }, [currentLine, currentChar, commands])

  return (
    <div className="rounded-xl bg-[#0a0a0a] border border-[var(--color-border)] p-6 font-mono text-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
      </div>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <p key={i} className={line.startsWith('$') ? 'text-white' : 'text-[var(--color-text-secondary)]'}>
            {line}
          </p>
        ))}
        {currentLine < commands.length && (
          <p className="text-white">
            $ {commands[currentLine].input.slice(0, currentChar)}
            <span className="animate-pulse">|</span>
          </p>
        )}
      </div>
    </div>
  )
}
```
**Archetypes:** Neo-Corporate, Retro-Future, Data-Dense
**Beat types:** REVEAL, PEAK

---

## Ambient Patterns (6)

### 1. Gradient Mesh Background
Slow-moving gradient orbs that create atmosphere.

```tsx
function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-[var(--color-accent-1)]/15 blur-[120px] animate-[drift_20s_ease-in-out_infinite]" />
      <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-[var(--color-accent-2)]/10 blur-[100px] animate-[drift_25s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-[60%] left-[50%] h-[300px] w-[300px] rounded-full bg-[var(--color-accent-3)]/10 blur-[80px] animate-[drift_18s_ease-in-out_infinite_2s]" />
    </div>
  )
}
// @keyframes drift { 0%,100% { transform: translate(0,0) } 50% { transform: translate(30px, -20px) } }
```
**Archetypes:** Ethereal, Glassmorphism, Neo-Corporate
**Beat types:** HOOK, any background

### 2. Floating Shapes
Geometric shapes that drift slowly across sections.

**Archetypes:** Playful, Organic, Vaporwave
**Beat types:** Background accent

### 3. Particle Field
Subtle particle system as background.

**Archetypes:** Kinetic, Neon Noir, Retro-Future
**Beat types:** HOOK, PEAK

### 4. Living Grid
Background grid whose intersections subtly pulse/glow.

**Archetypes:** Neo-Corporate, Data-Dense, Kinetic
**Beat types:** HOOK, BUILD

### 5. Aurora Effect
Northern-lights style gradient that shifts colors slowly.

```tsx
function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent-1)]/5 to-transparent animate-[aurora_15s_ease-in-out_infinite] [filter:blur(60px)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent-2)]/5 to-transparent animate-[aurora_20s_ease-in-out_infinite_reverse] [filter:blur(80px)]" />
    </div>
  )
}
// @keyframes aurora { 0%,100% { transform: translateY(0) scaleY(1) } 50% { transform: translateY(-20%) scaleY(1.5) } }
```
**Archetypes:** Ethereal, Glassmorphism, Neon Noir
**Beat types:** HOOK background, CLOSE background

### 6. Morphing Blob
SVG shape that continuously morphs its form.

**Archetypes:** Organic, Ethereal, Playful
**Beat types:** HOOK background, BREATHE background

---

## Selection Guide

When assigning wow moments, match by beat type:

| Beat Type | Recommended Wow Moments |
|-----------|------------------------|
| **HOOK** | Gradient mesh, magnetic buttons, text distortion, aurora |
| **REVEAL** | Perspective zoom, SVG line draw, terminal demo |
| **BUILD** | Spotlight grid, tilt cards, expandable cards, sticky stack |
| **PEAK** | Before/after slider, 3D viewer, horizontal scroll-jack, drag demo |
| **PROOF** | Animated counters, sticky stack |
| **CLOSE** | Magnetic buttons, gradient mesh background |
| **BREATHE** | Aurora, morphing blob (ambient only) |
