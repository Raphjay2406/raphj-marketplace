---
name: creative-sections
description: "Creative, memorable UI sections that break conventions. Unique heroes, bento grids, interactive showcases, scroll-driven storytelling, variable font animations, Lottie, cursor-following, text splitting, noise/grain textures."
---

Use this skill when the user wants creative design, unique sections, memorable UI, unconventional layouts, bento grid, interactive showcase, scroll storytelling, text animation, grain texture, or asks for something that looks premium/unique/different. Triggers on: creative, unique, memorable, bento, showcase, scroll storytelling, text animation, grain, noise, cursor, Lottie, variable font.

You are a creative director who designs sections that people screenshot and share. Every section must have a "wow" moment.

## Creative Hero Patterns

### Split Hero with 3D Perspective
```tsx
<section className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
  {/* Ambient glow */}
  <div className="absolute top-[20%] left-[30%] h-[400px] w-[400px] rounded-full bg-[#6366f1]/15 blur-[120px]" />

  <div className="container mx-auto px-6 pt-32 pb-20">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          Now in public beta
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.9] text-white mb-6">
          Build at the{' '}
          <span className="bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
            speed of thought
          </span>
        </h1>
        <p className="text-lg text-white/50 leading-relaxed max-w-lg mb-8">
          The development platform for teams who refuse to compromise on quality or velocity.
        </p>
        <div className="flex items-center gap-4">
          <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors">
            Start Building
          </button>
          <button className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
            See Demo
          </button>
        </div>
      </div>

      {/* 3D tilted product screenshot */}
      <div className="relative [perspective:1200px]">
        <div className="[transform:rotateY(-8deg)_rotateX(3deg)] rounded-2xl border border-white/[0.08] bg-[#111113] p-2 shadow-[0_40px_100px_-20px_rgba(99,102,241,0.3)]">
          <div className="rounded-xl bg-[#0a0a0f] aspect-[4/3] flex items-center justify-center">
            <span className="text-white/20">Product Screenshot</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Centered Hero with Animated Grid Background
```tsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Animated grid */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
  {/* Fade edges */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_70%)]" />

  <div className="relative z-10 text-center px-6">
    <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.04em] leading-[0.85] text-white mb-6">
      Ship faster.<br />
      <span className="text-white/30">Think bigger.</span>
    </h1>
    <p className="text-lg text-white/40 max-w-md mx-auto mb-10">
      Where ambitious teams build products that matter.
    </p>
  </div>
</section>
```

## Bento Grid Layouts

### Asymmetric Bento
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[200px]">
  {/* Large feature card */}
  <div className="col-span-2 row-span-2 rounded-3xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] p-8 flex flex-col justify-end">
    <h3 className="text-2xl font-bold text-white">AI-Powered</h3>
    <p className="text-white/70 mt-2">Intelligence built into every workflow.</p>
  </div>

  {/* Metric card */}
  <div className="rounded-3xl border border-white/[0.06] bg-[#111113] p-6 flex flex-col justify-between">
    <Zap className="h-6 w-6 text-[#fbbf24]" />
    <div>
      <p className="text-3xl font-bold text-white">99.9%</p>
      <p className="text-sm text-white/40">Uptime SLA</p>
    </div>
  </div>

  {/* Image card */}
  <div className="rounded-3xl overflow-hidden bg-[#111113]">
    <img src="/placeholder.svg?height=200&width=300" alt="" className="w-full h-full object-cover" />
  </div>

  {/* Wide card */}
  <div className="col-span-2 rounded-3xl border border-white/[0.06] bg-[#111113] p-8 flex items-center gap-6">
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-white">Real-time Collaboration</h3>
      <p className="text-sm text-white/40 mt-1">Work together seamlessly across time zones.</p>
    </div>
    <Users className="h-12 w-12 text-white/10" />
  </div>
</div>
```

## Scroll-Driven Storytelling

```tsx
// CSS scroll-driven animations (native, no JS)
<section className="relative">
  {/* Section that reveals on scroll */}
  <div
    className="opacity-0 translate-y-8"
    style={{
      animation: 'reveal linear both',
      animationTimeline: 'view()',
      animationRange: 'entry 0% entry 40%',
    }}
  >
    <h2 className="text-4xl font-bold">Section Title</h2>
    <p className="text-muted-foreground mt-4">Content that reveals as you scroll.</p>
  </div>
</section>

// Add to globals.css:
// @keyframes reveal { from { opacity: 0; transform: translateY(2rem); } to { opacity: 1; transform: translateY(0); } }

// Horizontal scroll section
<section className="overflow-hidden">
  <div
    className="flex gap-6 px-6"
    style={{
      animation: 'scrollX linear both',
      animationTimeline: 'view()',
      animationRange: 'contain 0% contain 100%',
    }}
  >
    {cards.map(card => (
      <div key={card.id} className="flex-shrink-0 w-80 rounded-2xl border p-6">
        {card.content}
      </div>
    ))}
  </div>
</section>
// @keyframes scrollX { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

## Variable Font Animations

```tsx
// Weight animation on hover
<h1
  className="text-8xl tracking-[-0.04em] transition-all duration-500 cursor-default"
  style={{ fontVariationSettings: '"wght" 400' }}
  onMouseEnter={(e) => { e.currentTarget.style.fontVariationSettings = '"wght" 900' }}
  onMouseLeave={(e) => { e.currentTarget.style.fontVariationSettings = '"wght" 400' }}
>
  Hover me
</h1>

// Per-character weight animation
function AnimatedText({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-300 hover:font-black"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
```

## Cursor-Following Effects

```tsx
'use client'
import { useEffect, useRef } from 'react'

function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px] transition-all duration-200 ease-out z-0"
    />
  )
}

// Card with spotlight effect on hover
function SpotlightCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-2xl border border-white/[0.08] bg-[#111113] p-6 overflow-hidden group"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(300px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.06),transparent_40%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
```

## Text Splitting & Reveal

```tsx
'use client'
import { motion } from 'framer-motion'

function SplitRevealText({ text }: { text: string }) {
  const words = text.split(' ')

  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="text-4xl font-bold tracking-tight"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } },
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  )
}

// Line-by-line reveal
function LineReveal({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.6 }}
        >
          <p className="text-lg text-muted-foreground">{line}</p>
        </motion.div>
      ))}
    </div>
  )
}
```

## Noise / Grain Texture

```css
/* Add to globals.css */
.noise-overlay {
  position: relative;
}
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}
```

```tsx
// Usage
<section className="noise-overlay bg-[#0a0a0f] py-24">
  <div className="relative z-10 container mx-auto px-6">
    {/* Content appears above the grain texture */}
  </div>
</section>
```

## Interactive Showcase Sections

### Tabbed Feature Showcase
```tsx
const [activeTab, setActiveTab] = useState(0)

<section className="py-24">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold tracking-tight text-center mb-16">How it works</h2>

    <div className="grid lg:grid-cols-[300px_1fr] gap-12">
      {/* Tab navigation */}
      <div className="flex flex-col gap-2">
        {features.map((feature, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={cn(
              "text-left rounded-xl p-4 transition-all",
              activeTab === i
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-white/5 border border-transparent"
            )}
          >
            <p className="font-semibold text-sm">{feature.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#111113] overflow-hidden aspect-video">
        {/* Feature screenshot/demo */}
      </div>
    </div>
  </div>
</section>
```

### Marquee / Infinite Scroll Logos
```tsx
<div className="relative overflow-hidden py-12 border-y border-white/[0.06]">
  <div className="flex animate-[marquee_30s_linear_infinite] gap-16">
    {[...logos, ...logos].map((logo, i) => (
      <div key={i} className="flex-shrink-0 opacity-30 hover:opacity-70 transition-opacity grayscale hover:grayscale-0">
        <img src={logo.src} alt={logo.name} className="h-8" />
      </div>
    ))}
  </div>
</div>
// @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
```

### Stats with Visual Impact
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
  {stats.map((stat) => (
    <div key={stat.label} className="bg-[#0a0a0f] p-8 text-center">
      <p className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
        {stat.value}
      </p>
      <p className="text-sm text-white/40 mt-2">{stat.label}</p>
    </div>
  ))}
</div>
```

## Comparison / Before-After Section

```tsx
<div className="grid md:grid-cols-2 gap-6">
  {/* Before */}
  <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-8">
    <div className="inline-flex items-center gap-2 text-red-400 text-sm font-medium mb-6">
      <X className="h-4 w-4" /> Without us
    </div>
    <ul className="space-y-3 text-white/50 text-sm">
      {painPoints.map((p) => (
        <li key={p} className="flex items-start gap-2">
          <Minus className="h-4 w-4 text-red-400/50 mt-0.5 flex-shrink-0" />{p}
        </li>
      ))}
    </ul>
  </div>

  {/* After */}
  <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.03] p-8">
    <div className="inline-flex items-center gap-2 text-green-400 text-sm font-medium mb-6">
      <Check className="h-4 w-4" /> With us
    </div>
    <ul className="space-y-3 text-white/70 text-sm">
      {benefits.map((b) => (
        <li key={b} className="flex items-start gap-2">
          <Check className="h-4 w-4 text-green-400/70 mt-0.5 flex-shrink-0" />{b}
        </li>
      ))}
    </ul>
  </div>
</div>
```

## Light-Mode Variants

For light-themed archetypes (Ethereal, Editorial, Organic, Luxury, Playful, Japanese Minimal, Swiss, Warm Artisan), reference the `light-mode-patterns` skill for equivalent depth and quality on light backgrounds. Key differences:

- **Shadows replace glows** — use layered box-shadows instead of neon/glow effects
- **Background tints replace dark surfaces** — warm off-whites (#faf9f6) instead of near-black
- **Borders are lighter** — rgba(0,0,0,0.06) instead of rgba(255,255,255,0.06)
- **Cards are white on tinted backgrounds** — elevation through background contrast
- **Dark-fill buttons** work well in light mode — bg-[text-primary] text-white

All section patterns above have light-mode equivalents in the `light-mode-patterns` skill with comparable depth and code quality.

## Per-Archetype Pattern Recommendations

| Archetype | Recommended Hero | Recommended Feature | Recommended Showcase |
|-----------|-----------------|--------------------|--------------------|
| **Neo-Corporate** | Split Hero (3D tilt) | Bento Grid | Tabbed Showcase |
| **Brutalist** | Variable Font Hero | Exposed Grid | Before/After |
| **Ethereal** | Magazine Split (light) | Asymmetric Image/Text | Pull Quote |
| **Kinetic** | Centered Hero (grid bg) | Horizontal Scroll | Interactive Demo |
| **Editorial** | Editorial Dramatic (light) | Magazine Grid | Pull Quote |
| **Luxury** | Full-Bleed Image Hero | Magazine Split | Scroll Storytelling |
| **Playful** | Centered Hero (animated) | Card Collection | Interactive Demo |
| **Data-Dense** | Stats Hero (no traditional hero) | Dense Grid | Tabbed Showcase |
| **Japanese Minimal** | Single Element + Space | Asymmetric Image/Text | Scroll Storytelling |
| **Glassmorphism** | Centered Hero (glass) | Spotlight Grid | Glass Panel Layers |
| **Neon Noir** | Neon Title Hero | Bento Grid (dark) | Terminal Demo |
| **Organic** | Nature Visual Hero (light) | Card Collection (light) | Scroll Storytelling |
| **Retro-Future** | Terminal Boot Hero | Code Blocks | Terminal Demo |
| **Warm Artisan** | Craft Image Hero (light) | Magazine Grid (light) | Before/After |
| **Swiss** | Typographic Statement | Grid Layout | Case Study List |
| **Vaporwave** | Retro Splash | Window UI Grid | Interactive OS |

## Beat-Type Compatibility Tags

Each pattern works best with specific emotional beats:

| Pattern | Compatible Beats |
|---------|-----------------|
| **Split Hero (3D tilt)** | HOOK |
| **Centered Hero (grid bg)** | HOOK |
| **Magazine Split Hero** | HOOK |
| **Bento Grid** | BUILD, REVEAL |
| **Marquee Logos** | TEASE, PROOF |
| **Stats Section** | PROOF, TEASE |
| **Tabbed Showcase** | BUILD, REVEAL |
| **Before/After** | TENSION |
| **Scroll-Driven Storytelling** | REVEAL, PEAK |
| **Variable Font Animation** | HOOK, PEAK |
| **Cursor-Following Glow** | BUILD, PEAK |
| **Text Splitting Reveal** | HOOK, BREATHE |
| **Noise/Grain Texture** | Any (as overlay) |

## Best Practices

1. **Every section needs a unique visual hook** - don't repeat the same card pattern
2. **Bento grids > uniform grids** - asymmetry is more interesting
3. **Use perspective transforms** on product screenshots for depth
4. **Ambient glow orbs** behind content create mood without effort
5. **Grid backgrounds with radial fade** make content float
6. **Marquee logos** should be grayscale with hover color reveal
7. **Stats sections** work best with gradient text and `gap-px` borders
8. **Tab-based showcases** beat static feature lists every time
9. **Mix rounded corners** - `rounded-3xl` for containers, `rounded-xl` for inner elements
10. **Scroll-driven animations**: Use native CSS `animation-timeline: view()` — zero JS, great performance
11. **Variable font animations**: Weight transitions create premium feel on hover
12. **Cursor effects**: Subtle glow following cursor adds interactivity without overwhelming
13. **Grain texture**: SVG noise overlay at 5% opacity adds analog warmth to digital surfaces
14. **Text splitting**: Reveal words/lines sequentially for dramatic reading experience
15. **Respect reduced motion**: Wrap all animations in `motion-safe:` or check `prefers-reduced-motion`

## When to Use Each Pattern

| Pattern | Best For | Avoid When |
|---------|----------|------------|
| **Split Hero (3D tilt)** | SaaS products, dev tools, dashboards — shows the product | Content-heavy sites, blogs, portfolios |
| **Centered Hero (grid bg)** | Bold brand statements, launch pages, minimal products | When you have a strong product screenshot to show |
| **Bento Grid** | Feature overviews, capability showcases, "why us" sections | Simple products with < 4 features |
| **Scroll-Driven Animation** | Storytelling, case studies, product walkthroughs | Above-the-fold content (user hasn't scrolled yet) |
| **Variable Font Animation** | Headlines, hero text, interactive labels | Body text, small text, data-heavy interfaces |
| **Cursor-Following Glow** | Dark landing pages, card grids, interactive showcases | Mobile (no cursor), light themes, text-heavy pages |
| **Text Splitting Reveal** | Hero headlines, manifesto sections, key value props | Long paragraphs, secondary content, navigation |
| **Noise/Grain Texture** | Dark backgrounds, hero sections, premium card surfaces | Light themes (grain becomes distracting), images |
| **Tabbed Showcase** | Multi-feature products, "how it works", workflows | Single-feature pages, simple marketing |
| **Marquee Logos** | Social proof, integrations, partner sections | < 6 logos (use static grid instead) |
| **Stats Section** | Credibility, traction, performance metrics | Early-stage products with no impressive numbers |
| **Before/After Comparison** | Competitor differentiation, transformation stories | When you can't articulate specific pain points |

## Section Combination Recipes

Proven page flows that work well together:

### SaaS Landing Page
```
1. Split Hero (3D tilt) — show the product immediately
2. Marquee Logos — social proof
3. Bento Grid — feature overview
4. Tabbed Showcase — deep dive into top 3 features
5. Stats Section — traction/credibility
6. Before/After — differentiation
7. CTA Section with ambient glow
```

### Developer Tool
```
1. Centered Hero (grid bg) — bold statement + code snippet
2. Scroll-Driven code walkthrough — step by step
3. Bento Grid — capabilities
4. Terminal/code demo with spotlight card
5. Stats + Marquee logos
6. CTA with gradient border
```

### Creative Portfolio
```
1. Variable Font Hero — name/title with weight animation
2. Horizontal scroll project showcase
3. Cursor-following spotlight grid — project cards
4. Text splitting manifesto — design philosophy
5. Noise-textured contact section
```

### Product Launch
```
1. Centered Hero — dramatic reveal with text splitting
2. Scroll storytelling — problem → solution narrative
3. Bento Grid — features with ambient glow
4. Before/After comparison
5. Stats with gradient text
6. CTA with animated border
```

## Accessibility Considerations

```tsx
// Always wrap motion in reduced-motion checks
<div className="motion-safe:animate-[reveal_0.6s_ease-out_both]">

// For cursor effects, provide non-motion fallback
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Marquee: pause on hover AND on focus-within
className="hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"

// Scroll-driven: ensure content is readable without animation
// The content should be visible by default, animation is enhancement
className="opacity-100 motion-safe:opacity-0 motion-safe:[animation:reveal_linear_both]"

// Variable font: ensure text is readable at all weight states
// Don't rely solely on weight change to convey meaning
```
