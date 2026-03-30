---
name: shape-asset-generation
description: "Procedural shape generation, SVG assets, and decorative elements. Purpose-primary taxonomy, per-archetype shape palettes, beat-aware intensity, DNA-constrained colors, full SVG animation suite (DrawSVG, MorphSVG, noise, particles)."
tier: domain
triggers: "shapes, SVG, geometric, organic, blob, pattern, divider, background pattern, decorative, illustration, isometric, clip-path, procedural, noise texture, dot grid, mesh gradient, particle, animated SVG, morphing, path drawing, ASCII art"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Shape Purpose Decision Tree

What are you adding? Start here.

**Section transition?** -> Section Dividers (wave, angle, organic, stepped)
- Use when: transitioning between sections with different background colors or visual weights
- Complexity: LOW to MEDIUM. Dividers are functional, not decorative focal points

**Background atmosphere?** -> Backgrounds & Atmospherics (dot grids, noise, gradient meshes, particle fields)
- Use when: a section needs visual depth without competing with foreground content
- Complexity: LOW. Atmospheric shapes are felt, not seen. Always behind content

**Visual accent/decoration?** -> Accents & Decorative (floating shapes, rings, patterns, line art)
- Use when: a section needs visual interest around or between content blocks
- Complexity: LOW to MEDIUM. Accents support content, never upstage it

**Hero visual/illustration?** -> Hero Illustrations (procedural blobs, isometric objects, abstract compositions, branded shapes)
- Use when: shapes ARE the content -- hero visuals, branded graphics, feature illustrations
- Complexity: MEDIUM to HIGH. Hero illustrations justify investment in procedural generation

**Animated SVG effect?** -> SVG Animation Suite (path drawing, morphing, particles, noise animation)
- Use when: scroll-linked or entrance animation will elevate the section's wow factor
- Complexity: MEDIUM to HIGH. Reserve for HOOK, PEAK, and key REVEAL beats

**Rule of thumb:** If shapes are the main content (hero illustration), invest in complexity. If shapes are atmosphere, keep them subtle. If unsure, start subtle -- you can always add complexity.

### Technique Selection Matrix

| Need | CSS Only | SVG | Canvas/WebGL |
|------|----------|-----|--------------|
| Simple geometric shapes | `clip-path`, gradients | -- | -- |
| Organic/flowing forms | -- | SVG path + `simplex-noise` | -- |
| Animated path drawing | -- | GSAP DrawSVG | -- |
| Shape morphing | -- | GSAP MorphSVG | -- |
| Noise textures/grain | -- | SVG `feTurbulence` (zero JS) | -- |
| Particle systems (100+) | -- | -- | Canvas or R3F Points |
| Procedural organic shapes | -- | `simplex-noise` -> SVG path | -- |
| Grid/dot patterns | `radial-gradient` / `linear-gradient` | SVG `<pattern>` | -- |
| Isometric pseudo-3D | CSS `perspective` + `rotateX/Y` | SVG transforms | -- |
| Section dividers (wave) | -- | SVG `<path>` | -- |
| Section dividers (angle) | CSS `clip-path: polygon()` | -- | -- |
| Gradient mesh (blur orbs) | CSS `blur` + positioned divs | -- | -- |
| Animated gradients | CSS `@keyframes` | -- | -- |
| Repeating geometric patterns | CSS `background-image` | SVG `<pattern>` | -- |

**Default to CSS when possible.** CSS shapes are zero-JS, GPU-composited, and trivial to maintain. Escalate to SVG for curves, animation, and procedural generation. Escalate to Canvas/WebGL only for high-particle-count systems.

For true 3D with lighting, materials, and shaders, see the **3D/WebGL Effects** skill. This skill covers 2D shapes and CSS pseudo-3D only.

### Per-Archetype Shape Palette

All 19 archetypes with recommended and forbidden shape families. Builders may mix in related shapes if they fit DNA, but FORBIDDEN shapes are hard constraints.

| Archetype | Primary Shapes | Secondary | Forbidden | Intensity |
|-----------|---------------|-----------|-----------|-----------|
| Brutalist | Hard angles, raw geometry, broken grids | Dot matrix, ASCII art, noise | Organic curves, soft blobs | HIGH |
| Ethereal | Organic blobs, gradient meshes, soft waves | Particle fields, aurora, mist | Sharp angles, hard edges, grids | MEDIUM |
| Kinetic | Dynamic diagonals, motion lines, speed shapes | Particle trails, streaks, arrows | Static heavy patterns, symmetry | HIGH |
| Editorial | Precise geometric lines, thin rules, circles | Dot grids (sparse), single stroke art | Complex patterns, visual noise | LOW |
| Neo-Corporate | Clean geometric shapes, subtle gradients | Thin line art, precise dots, rings | Organic blobs, hand-drawn, noise | LOW-MEDIUM |
| Organic | Natural curves, flowing forms, leaf shapes | Watercolor edges, texture overlays | Hard geometry, grid patterns, straight lines | MEDIUM |
| Retro-Future | Concentric rings, radial bursts, scan lines | Wireframes, neon outlines, grids | Organic/natural forms, soft blobs | MEDIUM-HIGH |
| Luxury/Fashion | Minimal geometry, single thin strokes, gold lines | Subtle gradient meshes, marble texture | Dense patterns, bold colors, dot grids | LOW |
| Playful/Startup | Rounded shapes, bouncy blobs, confetti | Gradient meshes, floating circles, squiggles | Sharp angles, rigid grids, dark patterns | MEDIUM-HIGH |
| Data-Dense | Grid systems, precise dots, small multiples | Thin rules, subtle dividers, treemap shapes | Large organic shapes, heavy decoration | LOW |
| Japanese Minimal | Single circles, thin lines, negative space | Dot grids (very sparse), single brush stroke | Complex patterns, many shapes, dense textures | VERY LOW |
| Glassmorphism | Gradient blur orbs, glass panels, refraction | Aurora effects, noise grain overlay | Hard edges without blur, dense geometry | MEDIUM |
| Neon Noir | Glowing outlines, wireframes, grid lines | Neon rings, scan lines, data streams | Organic/natural forms, warm textures | MEDIUM-HIGH |
| Warm Artisan | Hand-drawn textures, paper grain, brush strokes | Organic imperfect shapes, stamp marks | Machine-precise geometry, neon, wireframes | MEDIUM |
| Swiss/International | Precise rectangles, circles, rules | Grid systems, mathematical proportions | Organic forms, decoration, textures | VERY LOW |
| Vaporwave | Gradient meshes, retro grids, sun bursts | Geometric wireframes, chrome shapes, marble | Minimal/clean shapes, corporate geometry | HIGH |
| Neubrutalism | Thick borders, offset shapes, bold geometry | Stickers, stamps, hand-drawn arrows | Subtle gradients, thin lines, minimal shapes | HIGH |
| Dark Academia | Ornamental frames, book motifs, serif patterns | Subtle dot textures, aged paper grain | Neon, bright gradients, modern wireframes | LOW-MEDIUM |
| AI-Native | Data visualization shapes, node networks, matrices | Particle flows, scan lines, code-pattern grids | Organic/hand-drawn, warm textures, ornamental | MEDIUM-HIGH |

### Beat-Aware Shape Intensity

Shape complexity MUST scale with the emotional arc. This creates visual rhythm that mirrors the page's emotional progression.

| Beat | Shape Intensity | Guidance |
|------|----------------|----------|
| HOOK | Bold, large, complex | Signature shapes, hero illustrations, animated SVG draws. This is where procedural blobs, isometric objects, and branded shapes live. Invest here. |
| TEASE | Moderate, hinting | Partial shape reveals, emerging patterns, subtle motion. Shapes that preview what comes in BUILD/PEAK. |
| BUILD | Moderate, supporting | Background patterns, subtle dividers, accent shapes. Shapes frame content, never compete with it. |
| REVEAL | Moderate to bold | Shapes that frame or present the revealed content. Product showcase shapes, feature illustrations. |
| PEAK | Complex, animated | Morphing shapes, scroll-linked SVG sequences, particle systems. The most shape-intensive beat. |
| BREATHE | Minimal, subtle | Negative space dominates. At most a single thin line, sparse dot grid, or nothing. BREATHE means visual rest. |
| TENSION | Intentionally dissonant | Shapes that break the established pattern. Wrong archetype shapes, unexpected scale, visual disruption. |
| PROOF | Supporting only | Subtle backgrounds, clean dividers. Shapes exist to organize testimonials/logos/data, not to impress. |
| PIVOT | Transitional | Dividers or transitional shapes that signal a shift in content direction. Wave or organic dividers work well. |
| CLOSE | Gentle, echoing | Callback to HOOK shapes at reduced intensity. Echo the hero shapes at 30-50% complexity. Create closure. |

### DNA Color Enforcement

ALL shapes MUST use Design DNA color tokens. This is a HARD constraint with zero exceptions.

**Correct patterns:**
- SVG fill/stroke: `fill="hsl(var(--color-primary))"` or `stroke="hsl(var(--color-accent))"`
- SVG with opacity: `fill="hsl(var(--color-primary) / 0.1)"`
- Tailwind classes: `bg-primary`, `text-accent`, `border-secondary`
- Tailwind with opacity: `bg-primary/10`, `text-accent/20`
- CSS custom properties: `background: hsl(var(--color-surface))`

**Forbidden patterns:**
- Hardcoded hex: `fill="#8b5cf6"`, `bg-[#3b82f6]` -- NEVER
- Tailwind defaults: `bg-blue-500`, `text-purple-400` -- NEVER
- Named CSS colors: `fill="purple"`, `stroke="coral"` -- NEVER

**Computed colors (gradients between DNA tokens):**
- Interpolate between DNA tokens: `from-primary to-accent` -- ALLOWED
- CSS gradient: `linear-gradient(hsl(var(--color-primary)), hsl(var(--color-accent)))` -- ALLOWED
- Introducing a new non-DNA color into a gradient -- FORBIDDEN

---

## Layer 2: Award-Winning Examples

All code uses DNA color tokens exclusively. Organized by purpose category.

### Category 1: Section Dividers

#### Pattern: Wave Divider

Smooth SVG curve between sections. Uses DNA token for fill to match the next section's background.

```tsx
function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`relative w-full h-16 md:h-24 ${flip ? 'rotate-180' : ''}`}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z"
          fill="hsl(var(--color-bg))"
        />
      </svg>
    </div>
  )
}
```

**Beat:** BUILD, PIVOT, PROOF | **Archetype:** Ethereal, Organic, Playful

#### Pattern: Angled Divider

CSS-only approach. Simplest divider with no JS dependency.

```tsx
function AngledDivider() {
  return (
    <div className="relative h-12 md:h-16 -mt-px">
      <div
        className="absolute inset-0 bg-bg"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
      />
    </div>
  )
}
```

**Beat:** BUILD, PROOF | **Archetype:** Brutalist, Swiss, Neo-Corporate, Editorial

#### Pattern: Organic Divider (Procedural)

Noise-based curve unique per page load. Uses `simplex-noise` for natural variation.

```tsx
'use client'
import { useMemo } from 'react'
import { createNoise2D } from 'simplex-noise'

function OrganicDivider({ seed = 42, amplitude = 20 }: { seed?: number; amplitude?: number }) {
  const path = useMemo(() => {
    const noise2D = createNoise2D(() => seed * 0.001)
    const points: string[] = []
    const steps = 48

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 1440
      const y = 60 + noise2D(i * 0.15, 0) * amplitude
      points.push(`${x},${y}`)
    }

    return `M0,120 L${points.join(' L')} L1440,120 Z`
  }, [seed, amplitude])

  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
      <path d={path} fill="hsl(var(--color-bg))" />
    </svg>
  )
}
```

**Beat:** PIVOT, HOOK transition | **Archetype:** Organic, Ethereal, Warm Artisan

#### Pattern: Stepped Divider

CSS `clip-path` polygon for geometric precision.

```tsx
function SteppedDivider({ steps = 5 }: { steps?: number }) {
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const x = (i / steps) * 100
    const y = i % 2 === 0 ? 0 : 100
    return `${x}% ${y}%`
  })
  points.push('100% 100%', '0% 100%')

  return (
    <div
      className="h-8 md:h-12 bg-bg"
      style={{ clipPath: `polygon(${points.join(', ')})` }}
    />
  )
}
```

**Beat:** BUILD | **Archetype:** Brutalist, Retro-Future, Data-Dense

---

### Category 2: Backgrounds & Atmospherics

#### Pattern: Dot Grid

CSS-only repeating dot pattern. Zero JS, configurable density.

```tsx
function DotGrid({
  size = 24,
  dotSize = 1,
  opacity = 0.05,
}: {
  size?: number
  dotSize?: number
  opacity?: number
}) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--color-text)) ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    />
  )
}
```

**Beat:** BUILD, PROOF, BREATHE (very sparse) | **Archetype:** Editorial, Japanese Minimal, Neo-Corporate, AI-Native

#### Pattern: Grid Lines

CSS linear-gradient grid. Subtle structural background.

```tsx
function GridLines({
  size = 60,
  opacity = 0.06,
}: {
  size?: number
  opacity?: number
}) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(hsl(var(--color-border)) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--color-border)) 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    />
  )
}
```

**Beat:** BUILD, PROOF | **Archetype:** Swiss, Data-Dense, Retro-Future, Neon Noir

#### Pattern: Noise Texture Overlay

SVG `feTurbulence` noise. Zero JS, browser-native Perlin noise, GPU composited.

```tsx
function NoiseOverlay({
  opacity = 0.03,
  baseFrequency = 0.9,
  id = 'noise',
}: {
  opacity?: number
  baseFrequency?: number
  id?: string
}) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      <filter id={`${id}-filter`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves="4"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id}-filter)`} />
    </svg>
  )
}
```

**Beat:** Any -- noise is universal texture | **Archetype:** Warm Artisan, Dark Academia, Luxury, Glassmorphism, Brutalist

#### Pattern: Gradient Mesh (Blur Orbs)

Positioned divs with large blur radii create ambient gradient atmospherics. DNA colors at low opacity.

```tsx
function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute -top-1/3 -left-1/4 w-[60%] h-[60%] rounded-full blur-[120px]"
        style={{ background: 'hsl(var(--color-primary) / 0.12)' }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/3 w-[50%] h-[50%] rounded-full blur-[100px]"
        style={{ background: 'hsl(var(--color-accent) / 0.08)' }}
      />
      <div
        className="absolute top-1/3 left-1/2 w-[40%] h-[40%] rounded-full blur-[80px]"
        style={{ background: 'hsl(var(--color-secondary) / 0.06)' }}
      />
    </div>
  )
}
```

**Beat:** HOOK, BUILD, CLOSE | **Archetype:** Ethereal, Glassmorphism, Playful, Vaporwave. Limit to 2-3 blur orbs per viewport (GPU cost).

#### Pattern: Particle Field

Lightweight Canvas implementation for 50-100 animated particles. DNA accent color.

```tsx
'use client'
import { useEffect, useRef, useCallback } from 'react'

function ParticleField({
  count = 60,
  color = 'var(--color-accent)',
  speed = 0.3,
}: {
  count?: number
  color?: string
  speed?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const computed = getComputedStyle(canvas)
    const hsl = computed.getPropertyValue(`--color-accent`).trim()

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * 2 + 0.5,
    }))

    let frame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${hsl} / 0.4)`
        ctx.fill()
      }
      frame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [count, speed])

  useEffect(() => {
    const cleanup = init()
    return cleanup
  }, [init])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
```

**Beat:** HOOK, PEAK | **Archetype:** AI-Native, Kinetic, Neon Noir, Retro-Future. Reserve Canvas for 50+ animated particles. For fewer, use CSS animated divs.

#### Pattern: Animated Gradient

CSS keyframes shifting background position through DNA gradient stops. Zero JS.

```tsx
function AnimatedGradient() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{
        background: `linear-gradient(
          -45deg,
          hsl(var(--color-primary)),
          hsl(var(--color-secondary)),
          hsl(var(--color-accent)),
          hsl(var(--color-primary))
        )`,
        backgroundSize: '400% 400%',
        animation: 'gradient-shift 15s ease infinite',
      }}
      aria-hidden="true"
    />
  )
}

// Add to global CSS or Tailwind config:
// @keyframes gradient-shift {
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// }
```

**Beat:** HOOK, PEAK | **Archetype:** Vaporwave, Ethereal, Glassmorphism

---

### Category 3: Accents & Decorative

#### Pattern: Floating Shapes

CSS-positioned shapes with subtle animation. Decorative elements that frame content.

```tsx
function FloatingShapes() {
  const shapes = [
    { size: 300, x: '10%', y: '15%', token: 'primary', opacity: 0.08, delay: 0 },
    { size: 200, x: '75%', y: '55%', token: 'accent', opacity: 0.06, delay: 1.5 },
    { size: 120, x: '85%', y: '10%', token: 'secondary', opacity: 0.05, delay: 3 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {shapes.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            background: `hsl(var(--color-${s.token}) / ${s.opacity})`,
            animation: `float ${6 + i * 2}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// @keyframes float {
//   0%, 100% { transform: translateY(0px) rotate(0deg); }
//   50% { transform: translateY(-20px) rotate(3deg); }
// }
```

**Beat:** BUILD, HOOK (behind hero) | **Archetype:** Ethereal, Playful, Glassmorphism

#### Pattern: Concentric Rings

SVG circles at decreasing opacity. Minimal, geometric accent.

```tsx
function ConcentricRings({
  count = 5,
  maxRadius = 120,
  strokeWidth = 1,
}: {
  count?: number
  maxRadius?: number
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox={`0 0 ${maxRadius * 2 + 10} ${maxRadius * 2 + 10}`}
      className="w-full h-full"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => {
        const r = maxRadius - (i * maxRadius) / count
        const opacity = 0.3 - i * 0.05
        return (
          <circle
            key={i}
            cx={maxRadius + 5}
            cy={maxRadius + 5}
            r={r}
            fill="none"
            stroke={`hsl(var(--color-primary) / ${Math.max(opacity, 0.05)})`}
            strokeWidth={strokeWidth}
          />
        )
      })}
    </svg>
  )
}
```

**Beat:** BUILD, PROOF | **Archetype:** Retro-Future, Neo-Corporate, Swiss

#### Pattern: Geometric Repeating Pattern

SVG `<pattern>` element for tileable geometric backgrounds.

```tsx
function GeometricPattern({ size = 40, opacity = 0.04 }: { size?: number; opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} aria-hidden="true">
      <defs>
        <pattern id="geo-pattern" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill="none" stroke="hsl(var(--color-border))" strokeWidth="0.5" />
          <circle cx={size / 2} cy={size / 2} r="1.5" fill="hsl(var(--color-text))" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo-pattern)" />
    </svg>
  )
}
```

**Beat:** BUILD, PROOF | **Archetype:** Swiss, Data-Dense, Editorial

#### Pattern: Line Art / Wireframe

SVG stroke-only shapes. Thin lines for minimal visual weight.

```tsx
function WireframeAccent() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48" aria-hidden="true">
      <rect
        x="20" y="20" width="160" height="160"
        fill="none"
        stroke="hsl(var(--color-primary) / 0.15)"
        strokeWidth="0.5"
        rx="4"
      />
      <line
        x1="20" y1="100" x2="180" y2="100"
        stroke="hsl(var(--color-primary) / 0.1)"
        strokeWidth="0.5"
      />
      <line
        x1="100" y1="20" x2="100" y2="180"
        stroke="hsl(var(--color-primary) / 0.1)"
        strokeWidth="0.5"
      />
      <circle
        cx="100" cy="100" r="40"
        fill="none"
        stroke="hsl(var(--color-accent) / 0.12)"
        strokeWidth="0.5"
      />
    </svg>
  )
}
```

**Beat:** BUILD, BREATHE (very subtle) | **Archetype:** Neon Noir, Retro-Future, AI-Native

#### Pattern: Dot Matrix Text

CSS grid of small circles forming text/shapes. Raw, mechanical aesthetic.

```tsx
function DotMatrix({ grid, dotSize = 4, gap = 2 }: {
  grid: boolean[][] // 2D array: true = filled dot
  dotSize?: number
  gap?: number
}) {
  return (
    <div
      className="inline-grid"
      style={{
        gridTemplateColumns: `repeat(${grid[0]?.length ?? 0}, ${dotSize}px)`,
        gap: `${gap}px`,
      }}
      aria-hidden="true"
    >
      {grid.flat().map((filled, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            background: filled
              ? 'hsl(var(--color-primary))'
              : 'hsl(var(--color-primary) / 0.08)',
          }}
        />
      ))}
    </div>
  )
}
```

**Beat:** HOOK, PEAK | **Archetype:** Brutalist, AI-Native, Retro-Future

---

### Category 4: Hero Illustrations

#### Pattern: Procedural Blob

`simplex-noise` organic shape. Reproducible via seed. DNA color fill.

```tsx
'use client'
import { useMemo } from 'react'
import { createNoise2D } from 'simplex-noise'

function ProceduralBlob({
  color = 'var(--color-primary)',
  size = 300,
  complexity = 6,
  seed = 42,
}: {
  color?: string
  size?: number
  complexity?: number
  seed?: number
}) {
  const path = useMemo(() => {
    const noise2D = createNoise2D(() => seed * 0.001)
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
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <path d={path} fill={`hsl(${color})`} />
    </svg>
  )
}

// Usage: <ProceduralBlob color="var(--color-accent)" size={400} seed={7} />
```

**Beat:** HOOK, REVEAL | **Archetype:** Ethereal, Organic, Playful, Glassmorphism

#### Pattern: Isometric Objects (CSS Pseudo-3D)

CSS `perspective` + `rotateX/Y` for lightweight 3D-like effect without WebGL.

```tsx
function IsometricCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="[perspective:1200px]">
      <div
        className="rounded-xl bg-surface border border-border p-8 shadow-lg
          [transform:rotateX(12deg)_rotateY(-8deg)] transition-transform duration-500
          hover:[transform:rotateX(0deg)_rotateY(0deg)]"
      >
        {children}
      </div>
    </div>
  )
}

function IsometricGrid() {
  return (
    <div className="[perspective:1500px] grid grid-cols-3 gap-6" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="aspect-square rounded-lg bg-surface border border-border shadow-md"
          style={{
            transform: `rotateX(55deg) rotateZ(-45deg) translateZ(${i * 8}px)`,
            background: `hsl(var(--color-primary) / ${0.05 + i * 0.03})`,
          }}
        />
      ))}
    </div>
  )
}
```

**Beat:** HOOK, REVEAL | **Archetype:** Neo-Corporate, Data-Dense, AI-Native

For true 3D with lighting and materials, see the **3D/WebGL Effects** skill.

#### Pattern: Abstract Composition

Layered procedural shapes combining noise blobs with geometric accents.

```tsx
'use client'
import { useMemo } from 'react'
import { createNoise2D } from 'simplex-noise'

function AbstractComposition({ seed = 99 }: { seed?: number }) {
  const paths = useMemo(() => {
    const noise2D = createNoise2D(() => seed * 0.001)
    return [0, 1, 2].map((layer) => {
      const points = 32
      const coords: string[] = []
      const scale = 30 + layer * 8
      const cx = 50 + layer * 5
      const cy = 50 - layer * 3

      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2
        const r = scale + noise2D(Math.cos(angle) * 2, Math.sin(angle) * 2 + layer) * 10
        coords.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`)
      }
      return `M${coords.join('L')}Z`
    })
  }, [seed])

  return (
    <svg viewBox="-20 -20 140 140" className="w-full max-w-md" aria-hidden="true">
      <path d={paths[0]} fill="hsl(var(--color-primary) / 0.15)" />
      <path d={paths[1]} fill="hsl(var(--color-accent) / 0.12)" />
      <path d={paths[2]} fill="hsl(var(--color-secondary) / 0.08)" />
      {/* Geometric accent: precise circle overlapping organic forms */}
      <circle cx="65" cy="40" r="15" fill="none" stroke="hsl(var(--color-primary) / 0.2)" strokeWidth="0.5" />
    </svg>
  )
}
```

**Beat:** HOOK, PEAK | **Archetype:** All archetypes with layer count and shape complexity adjusted per palette

#### Pattern: Branded Signature Shape

Uses the project's DNA signature element as the foundational shape. The signature element is defined in DESIGN-DNA.md (e.g., `diagonal-cut: angle=12deg`, `dot-matrix: density=8`, `aurora-gradient: layers=3`).

```tsx
// Example for signature element: diagonal-cut
function SignatureShape({ angle = 12 }: { angle?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute -right-1/4 top-0 w-1/2 h-full bg-primary/5"
        style={{ transform: `skewX(-${angle}deg)` }}
      />
      <div
        className="absolute -left-1/4 bottom-0 w-1/3 h-2/3 bg-accent/3"
        style={{ transform: `skewX(${angle}deg)` }}
      />
    </div>
  )
}

// Builders: read the signature element from DESIGN-DNA.md and create
// a bespoke shape component. The shape should appear in HOOK beat
// and echo in CLOSE beat at reduced intensity.
```

**Beat:** HOOK (full), CLOSE (echo at 30-50%) | **Archetype:** Any -- signature shapes are project-specific

---

### Category 5: SVG Animation Suite

#### Pattern: Path Drawing with GSAP DrawSVG

Progressive stroke reveal on scroll trigger. GSAP DrawSVG is free (Webflow acquisition).

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger)

function PathDrawing() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pathRef.current,
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

**Scroll-linked variant:** Replace the ScrollTrigger config with `scrub: true` for continuous scroll-driven drawing:
```tsx
scrollTrigger: {
  trigger: pathRef.current,
  start: 'top 80%',
  end: 'top 20%',
  scrub: 1,
}
```

**Beat:** HOOK, REVEAL, PEAK | **Archetype:** Editorial, Luxury, Japanese Minimal, Warm Artisan

#### Pattern: Shape Morphing with GSAP MorphSVG

Scroll-driven shape transformation. GSAP MorphSVG is free, handles different point counts automatically.

```tsx
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
        morphSVG: '#morph-target',
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
      {/* Source shape: triangle */}
      <path
        ref={pathRef}
        d="M100,10 L190,180 L10,180 Z"
        fill="hsl(var(--color-primary))"
      />
      {/* Target shape: circle (hidden) */}
      <path
        id="morph-target"
        d="M100,10 A90,90 0 1,1 99.9,10 Z"
        style={{ visibility: 'hidden' }}
      />
    </svg>
  )
}
```

**Beat:** PEAK, HOOK | **Archetype:** Kinetic, Ethereal, Organic, Playful

#### Pattern: SVG Declarative Morphing

Native SVG `<animate>` for simple morphing without any JS. Browser-native, zero dependencies.

```tsx
function DeclarativeMorph() {
  return (
    <svg viewBox="0 0 200 200" className="w-64 h-64" aria-hidden="true">
      <path fill="hsl(var(--color-primary) / 0.3)">
        <animate
          attributeName="d"
          dur="8s"
          repeatCount="indefinite"
          values="
            M45,-51C58,-41,68,-26,71,-9C74,8,70,26,60,39C49,52,32,60,15,63C-2,67,-20,66,-35,59C-49,52,-61,38,-66,22C-72,6,-71,-12,-64,-26C-56,-40,-40,-49,-26,-58C-11,-68,4,-78,18,-76C33,-74,32,-62,45,-51Z;
            M40,-47C53,-36,67,-24,70,-10C74,5,67,22,56,36C45,49,29,58,13,62C-3,66,-20,65,-35,57C-50,50,-62,35,-67,19C-73,2,-71,-17,-62,-30C-53,-44,-37,-52,-21,-62C-6,-73,9,-85,22,-83C35,-80,27,-58,40,-47Z;
            M45,-51C58,-41,68,-26,71,-9C74,8,70,26,60,39C49,52,32,60,15,63C-2,67,-20,66,-35,59C-49,52,-61,38,-66,22C-72,6,-71,-12,-64,-26C-56,-40,-40,-49,-26,-58C-11,-68,4,-78,18,-76C33,-74,32,-62,45,-51Z
          "
        />
      </path>
    </svg>
  )
}
```

**Beat:** HOOK, BUILD (ambient) | **Archetype:** Ethereal, Organic, Glassmorphism

#### Pattern: Procedural Animated Noise

`simplex-noise` with time parameter for continuously evolving organic animation.

```tsx
'use client'
import { useEffect, useRef, useCallback } from 'react'
import { createNoise3D } from 'simplex-noise'

function AnimatedNoiseBlob({
  seed = 42,
  size = 300,
}: {
  seed?: number
  size?: number
}) {
  const pathRef = useRef<SVGPathElement>(null)
  const noise3D = useRef(createNoise3D(() => seed * 0.001))

  const animate = useCallback((time: number) => {
    if (!pathRef.current) return
    const t = time * 0.0008
    const points = 48
    const coords: string[] = []

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2
      const r = 38 + noise3D.current(Math.cos(angle) * 2, Math.sin(angle) * 2, t) * 10
      coords.push(`${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`)
    }

    pathRef.current.setAttribute('d', `M${coords.join('L')}Z`)
    requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [animate])

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <path ref={pathRef} fill="hsl(var(--color-accent) / 0.2)" />
    </svg>
  )
}
```

**Beat:** HOOK, PEAK | **Archetype:** Ethereal, Organic. Use `prefers-reduced-motion` to disable animation.

#### Pattern: Animated SVG Pattern

SVG `<pattern>` with CSS animation for subtle repeating motion.

```tsx
function AnimatedPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" aria-hidden="true">
      <defs>
        <pattern
          id="animated-dots"
          x="0" y="0"
          width="30" height="30"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="15" cy="15" r="1.5" fill="hsl(var(--color-text))">
            <animate
              attributeName="r"
              values="1;2;1"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#animated-dots)" />
    </svg>
  )
}
```

**Beat:** BUILD, PROOF | **Archetype:** AI-Native, Data-Dense, Retro-Future

#### Pattern: Scroll-Linked SVG Sequence

Multiple SVG states triggered by scroll position using GSAP ScrollTrigger.

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger)

function ScrollSVGSequence() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svgRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1,
        },
      })

      // Phase 1: Draw outline
      tl.fromTo('#seq-outline', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1 })

      // Phase 2: Fill shape
      tl.to('#seq-fill', { opacity: 1, duration: 0.5 }, '+=0.2')

      // Phase 3: Accent elements appear
      tl.to('#seq-accent-1', { scale: 1, opacity: 1, duration: 0.3 }, '-=0.2')
      tl.to('#seq-accent-2', { scale: 1, opacity: 1, duration: 0.3 }, '-=0.1')
    }, svgRef)
    return () => ctx.revert()
  }, [])

  return (
    <svg ref={svgRef} viewBox="0 0 400 300" className="w-full max-w-2xl">
      <path id="seq-fill" d="M200,50 L350,250 L50,250 Z"
        fill="hsl(var(--color-primary) / 0.1)" opacity="0" />
      <path id="seq-outline" d="M200,50 L350,250 L50,250 Z"
        fill="none" stroke="hsl(var(--color-primary))" strokeWidth="2" />
      <circle id="seq-accent-1" cx="200" cy="150" r="20"
        fill="hsl(var(--color-accent) / 0.3)" opacity="0"
        style={{ transformOrigin: '200px 150px', transform: 'scale(0)' }} />
      <circle id="seq-accent-2" cx="150" cy="220" r="12"
        fill="hsl(var(--color-secondary) / 0.2)" opacity="0"
        style={{ transformOrigin: '150px 220px', transform: 'scale(0)' }} />
    </svg>
  )
}
```

**Beat:** PEAK, REVEAL | **Archetype:** Any -- sequence timing and shapes adapt to archetype

---

### Hybrid Generation Approach

Core utility functions provided as ready-to-use building blocks. Complex compositions described algorithmically for builders to assemble per-project.

#### Seeded Random Function

Reproducible random values. Use instead of `Math.random()` for consistent shapes across renders.

```tsx
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

// Usage:
const rand = seededRandom(42)
const x = rand() // always returns same value for seed 42
const y = rand() // next in deterministic sequence
```

#### DNA Color Helper

Convenience function for shape color application.

```tsx
function dnaColor(token: string, opacity?: number): string {
  if (opacity !== undefined) {
    return `hsl(var(--color-${token}) / ${opacity})`
  }
  return `hsl(var(--color-${token}))`
}

// Usage in SVG:
// <path fill={dnaColor('primary')} />
// <path fill={dnaColor('accent', 0.15)} />
// <path stroke={dnaColor('secondary', 0.3)} />
```

#### Noise Path Generator

Reusable `simplex-noise` wrapper for procedural shapes.

```tsx
import { createNoise2D } from 'simplex-noise'

function generateNoisePath(
  seed: number,
  points: number,
  baseRadius: number,
  noiseAmplitude: number,
  cx = 50,
  cy = 50,
): string {
  const noise2D = createNoise2D(() => seed * 0.001)
  const coords: string[] = []

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2
    const r = baseRadius + noise2D(Math.cos(angle) * 2, Math.sin(angle) * 2) * noiseAmplitude
    coords.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`)
  }

  return `M${coords.join('L')}Z`
}

// Usage:
// const blobPath = generateNoisePath(42, 48, 40, 12)
// <path d={blobPath} fill={dnaColor('primary', 0.2)} />
```

**Complex compositions (algorithmic description for builders):**
Builders assemble these utilities into project-specific compositions. Example algorithm:
1. Generate 3 noise blobs at different seeds, sizes, and DNA color tokens
2. Layer them with decreasing opacity (0.15, 0.10, 0.06)
3. Add 1-2 geometric accents (circles, lines) at the intersection points
4. Apply subtle CSS animation (`float` keyframe) to the outer two layers
5. Wrap in responsive container with `aspect-ratio: 4/3`

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Shape & Asset Generation |
|-----------|----------------------------------|
| `--color-primary` | Primary shape fills, dominant blob colors, main stroke color |
| `--color-secondary` | Secondary layer fills, supporting shapes |
| `--color-accent` | Accent shapes, particle colors, highlight strokes |
| `--color-bg` | Divider fills (matching section backgrounds) |
| `--color-surface` | Isometric card backgrounds, shape containers |
| `--color-border` | Grid line colors, wireframe strokes, pattern lines |
| `--color-text` | Dot grid dots, noise overlay base, high-contrast shapes |
| `--color-glow` | Neon outline glows (Neon Noir archetype) |
| `--color-signature` | Branded signature shapes, DNA signature element rendering |
| Signature element | Defines the branded shape motif -- read from DESIGN-DNA.md, render as bespoke component |

### Pipeline Stage

- **Input from:** Section planner (beat type, archetype) determines which shapes to use and at what intensity
- **Output to:** Builder creates shape components. Quality reviewer checks DNA compliance and beat-appropriate intensity

### Related Skills

- **cinematic-motion** -- Animated shapes use the archetype's motion presets (easing, duration from `--ease-*` and `--duration-*` tokens). Scroll-linked shapes follow beat-dependent scroll behavior rules defined in cinematic-motion
- **emotional-arc** -- Beat type determines shape intensity. The beat-aware mapping in Layer 1 derives from emotional arc's beat definitions
- **creative-tension** -- TENSION beat shapes intentionally break the established shape language. Creative tension rules apply to shape disruption
- **design-system-scaffold** -- Scaffold may generate base shape utilities from DNA tokens. Builders extend scaffold shapes, never replace them
- **3D/WebGL Effects** -- For true 3D with lighting, materials, shaders, and post-processing. This skill covers 2D shapes and CSS pseudo-3D only. Clear boundary: if it needs a `<Canvas>`, use the 3D skill
- **design-dna** -- All shape colors derive from DNA tokens. Signature element informs branded shapes
- **design-archetypes** -- Per-archetype shape palette table directly references archetype definitions

### Archetype Variants

See the Per-Archetype Shape Palette table in Layer 1 for full details. Key behavioral differences:

| Archetype Group | Shape Behavior |
|----------------|---------------|
| Minimal (Japanese Minimal, Swiss, Editorial) | VERY LOW to LOW intensity. Negative space dominates. Single shapes, thin strokes, sparse patterns. Maximum restraint. |
| Bold (Brutalist, Neubrutalism, Kinetic) | HIGH intensity. Large shapes, strong geometry, many elements. Shapes compete for attention intentionally. |
| Organic (Ethereal, Organic, Warm Artisan) | MEDIUM intensity. Flowing forms, noise-based generation, natural curves. No hard edges. |
| Technical (AI-Native, Data-Dense, Neon Noir) | MEDIUM to HIGH intensity. Grid-based, wireframe, data-vis shapes. Precision over organic beauty. |
| Atmospheric (Glassmorphism, Vaporwave) | MEDIUM intensity. Gradient meshes, blur orbs, color layers. Shapes create mood, not structure. |

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Hardcoded Hex Colors in Shapes

**What goes wrong:** Using `fill="#8b5cf6"` or `bg-violet-500` or `stroke="purple"` in shape components. Breaks the DNA token system, creates visual inconsistency when users change their color palette, and makes dark/light mode transitions fail silently.
**Instead:** Always use `hsl(var(--color-primary))` for SVG or Tailwind DNA classes (`bg-primary`, `text-accent/20`). The `dnaColor()` helper function makes this painless. See DNA Color Enforcement in Layer 1.

### Anti-Pattern: Math.random() for Procedural Shapes

**What goes wrong:** Using `Math.random()` produces different shapes on every render and between server/client in SSR. Untestable, unreproducible, causes hydration mismatches.
**Instead:** Use `simplex-noise` with a seed value for reproducible procedural generation. The seeded random function in the Hybrid Generation section provides deterministic values. Pass seeds as props for consistent results.

### Anti-Pattern: Shape Overload

**What goes wrong:** Adding decorative shapes to every section. Creates visual noise, dilutes the impact of intentionally shape-heavy beats, and overwhelms the user. The page becomes a shape portfolio instead of a coherent design.
**Instead:** Follow the beat-aware intensity mapping. BREATHE beats get minimal or NO shapes. PROOF beats get only functional shapes (dividers, subtle backgrounds). Reserve shape complexity for HOOK, PEAK, and TENSION beats.

### Anti-Pattern: CSS-Only Complex Organic Shapes

**What goes wrong:** Trying to create organic blobs using pure CSS `border-radius` hacks (e.g., `border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%`). Limited control over shape, poor animation, impossible to generate procedurally, and produces a narrow range of similar-looking blobs.
**Instead:** Use SVG paths generated with `simplex-noise`. The ProceduralBlob component in Layer 2 produces infinite organic variations controllable via seed, complexity, and size parameters. CSS border-radius is only acceptable for decorative blur orbs where exact shape does not matter.

### Anti-Pattern: Wrong Shapes for Archetype

**What goes wrong:** Organic blobs in a Brutalist design. Hard grid geometry in an Ethereal design. Neon wireframes in a Warm Artisan design. The shapes contradict the archetype's personality, creating cognitive dissonance.
**Instead:** Consult the per-archetype shape palette table in Layer 1. Primary shapes are recommended. Secondary shapes are acceptable when they support primary ones. FORBIDDEN shapes are hard constraints -- never use them regardless of beat type. The only exception is the TENSION beat, which may deliberately introduce one dissonant shape as creative tension (document the rationale).

### Anti-Pattern: Hand-Rolling SVG Path Morphing

**What goes wrong:** Manual path point interpolation (`d` attribute string manipulation) for shape morphing animation. Fails when source and target paths have different point counts, produces jerky motion, requires complex math for smooth easing.
**Instead:** Use GSAP MorphSVG, which handles different point counts automatically with intelligent point mapping and smooth easing. It is now free (Webflow acquisition). For simple two-state morphing without JS, use native SVG `<animate>` with the `values` attribute.

### Anti-Pattern: Heavy Canvas/WebGL for Simple Patterns

**What goes wrong:** Reaching for a Canvas particle system when you only need a dot grid background. Loading WebGL for a simple noise texture. The JS bundle cost, GPU overhead, and complexity are unjustified for effects achievable with CSS or SVG.
**Instead:** Use the Technique Selection Matrix in Layer 1. CSS `radial-gradient` for dot grids. SVG `feTurbulence` for noise textures (zero JS). CSS `linear-gradient` for grid lines. Reserve Canvas for 50+ animated particles and WebGL for true 3D scenes.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| blur-orbs-per-viewport | 0 | 3 | count | SOFT -- warn if more, GPU cost increases significantly |
| particle-count-canvas | 50 | 200 | count | SOFT -- below 50 use CSS, above 200 consider WebGL |
| shape-seed-value | 1 | -- | integer | HARD -- all procedural shapes MUST have a seed (no Math.random) |
| breathe-beat-shape-count | 0 | 1 | count | HARD -- BREATHE beat gets minimal or no shapes |
| hook-beat-shape-complexity | MEDIUM | HIGH | level | SOFT -- HOOK beats should invest in shape quality |
| peak-beat-animation | true | true | boolean | HARD -- PEAK beat shapes MUST include animation |
| noise-overlay-opacity | 0.01 | 0.08 | ratio | SOFT -- above 0.08 becomes visible noise, not texture |
| divider-height-mobile | 32 | 48 | px | SOFT -- dividers scale down on mobile |
| divider-height-desktop | 48 | 96 | px | SOFT -- dividers scale up on desktop |
| forbidden-shape-override | false | false | boolean | HARD -- archetype forbidden shapes are never used (except TENSION beat with documented rationale) |
