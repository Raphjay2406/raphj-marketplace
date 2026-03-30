---
name: creative-tension
description: "Controlled rule-breaking system with 5 tension levels, per-archetype copy-paste TSX implementations, safe/aggressive calibration, dual adjacency rules, and PEAK beat mandate."
tier: core
triggers: "creative tension, rule-breaking, surprise, bold, push boundaries, unexpected, beyond safe, memorable, risk, edgy, creative risk, tension moment, controlled chaos"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a creative provocateur who deliberately introduces controlled tension into designs. Archetypes provide strong foundations, but following them perfectly produces predictable output. Creative tension is the deliberate introduction of controlled rule-breaks that create stop-scrolling surprise. The tension must feel intentional, not accidental.

### When to Apply Tension

**PEAK beats: MANDATORY.** Every page has at least one PEAK beat, and it MUST contain a tension moment regardless of archetype. This is the single non-negotiable rule.

**TENSION beats:** These exist specifically for tension moments. If the emotional arc assigns a TENSION beat, it gets tension.

**Other beats:** Archetype-driven frequency determines whether additional beats receive tension.

### Archetype Frequency Table

| Group | Archetypes | Tension/Page | Which Beats |
|-------|-----------|-------------|-------------|
| HIGH | Brutalist, Neubrutalism, Kinetic, Neon Noir | 3-5 | PEAK + TENSION + HOOK + BUILD + any |
| MEDIUM | Editorial, Vaporwave, Playful/Startup, AI-Native, Dark Academia | 2-3 | PEAK + TENSION + 1 other |
| MODERATE | Ethereal, Organic, Retro-Future, Glassmorphism, Data-Dense | 1-3 | PEAK + TENSION (if assigned) + 0-1 other |
| LOW | Swiss/International, Japanese Minimal, Warm Artisan, Luxury/Fashion, Neo-Corporate | 1-2 | PEAK only (+ TENSION if assigned) |

### 5 Tension Levels -- Safe vs Aggressive Ranges

Each level has a SAFE implementation (controlled deviation) and AGGRESSIVE implementation (extreme deviation). Archetype group determines which range to default to.

| Level | Tension Type | Safe Range | Aggressive Range | Default By Group |
|-------|-------------|-----------|-----------------|-----------------|
| 1 | Scale Violence | 2-3x scale deviation | 5-10x scale deviation | HIGH -> aggressive, LOW -> safe |
| 2 | Material Collision | Contrasting textures side by side | Clashing materials (glass on concrete, neon on paper) | By archetype personality |
| 3 | Temporal Disruption | Slightly mismatched timing | Dramatically delayed/accelerated elements | By archetype motion intensity |
| 4 | Dimensional Break | Subtle depth shift (shadow, parallax) | Full 3D break, perspective explosion | By archetype tech comfort |
| 5 | Interaction Shock | Unexpected hover response | Dramatic state change on interaction | By archetype playfulness |

**Default to AGGRESSIVE, not safe.** Safe is the fallback when the design context demands restraint, not the default. If the tension does not make you slightly uncomfortable, it is not tension -- it is decoration.

### Dual Adjacency Rules

These rules ensure tension moments feel like deliberate punctuation, not visual noise.

**Rule 1 -- Type Diversity:** If two sections both have tension, they MUST use different tension levels. No two adjacent Scale Violence sections. No two adjacent Interaction Shock sections. Variety is mandatory.

**Rule 2 -- Breathing Room:** At least 1 non-tension section must separate any two tension sections. Exception: HIGH-tension archetypes (Brutalist, Neubrutalism, Kinetic, Neon Noir) allow 2 adjacent tension sections IF they use different levels.

**Validation:** The planner pre-assigns tension types and positions in MASTER-PLAN.md. The quality-reviewer validates adjacency rules post-build.

### Boldness Calibration

- The creative director reviews tension moments and pushes FURTHER, never pulls back
- Every tension moment must have clear purpose: draw attention to a CTA, create emotional impact, break monotony, or mark a narrative beat
- "If it feels too bold, that is the right amount" -- tension that blends in is failed tension
- Safe range exists for LOW-tension archetypes that structurally demand restraint (Swiss grid, Japanese ma), not as a comfort zone for other archetypes

### Rules for Controlled Rule-Breaking

**Which rules to break:**
- Scale expectations (one element at extreme scale)
- Material consistency (one texture collision)
- Temporal uniformity (one speed mismatch)
- Dimensional consistency (one depth shift)
- Interaction predictability (one surprising response)

**Which rules NEVER break:**
- Accessibility -- tension is visual, not functional. Screen readers unaffected
- Readability -- body text always legible. Tension applies to decorative/headline elements
- Navigation -- core wayfinding works perfectly. No tension in nav
- Performance -- tension effects use `transform`/`opacity` only. No layout-triggering properties
- Color tokens -- all tension elements use DNA palette (`var(--color-tension)`, `var(--color-accent)`). No rogue hex values
- Reduced motion -- all tension animations have `prefers-reduced-motion` fallbacks

## Layer 2: Award-Winning Examples

### 5 Tension Levels with Full Code

#### Level 1: Scale Violence

**Safe range** (2-3x deviation) -- for Swiss, Japanese Minimal, Luxury:
```tsx
{/* Oversized section number as subtle background element */}
<span className="absolute -top-8 right-4 text-[8rem] font-[var(--font-display)] font-black text-[var(--color-text)]/[0.04] leading-none select-none pointer-events-none">
  03
</span>
```

**Aggressive range** (5-10x deviation) -- for Brutalist, Kinetic, Neubrutalism:
```tsx
{/* Viewport-dominating headline that bleeds off edges */}
<h1 className="text-[18vw] font-[var(--font-display)] font-black leading-[0.85] tracking-[-0.04em] text-[var(--color-text)] whitespace-nowrap overflow-visible">
  BEYOND
</h1>
```

#### Level 2: Material Collision

**Safe range** -- contrasting textures side by side:
```tsx
{/* Glass card floating over subtle grain */}
<div className="relative rounded-2xl bg-[var(--color-surface)] p-12 [background-image:url('/noise.svg')] [background-size:200px]">
  <div className="bg-[var(--color-surface)]/60 backdrop-blur-xl border border-[var(--color-border)]/20 rounded-xl p-8">
    <h3 className="text-xl font-[var(--font-display)] text-[var(--color-text)]">Feature</h3>
  </div>
</div>
```

**Aggressive range** -- violently clashing materials:
```tsx
{/* Neon element burning through paper texture */}
<div className="relative bg-[var(--color-surface)] p-16 [background-image:url('/paper.svg')]">
  <h2 className="text-6xl font-[var(--font-display)] font-bold text-[var(--color-tension)] [text-shadow:0_0_30px_var(--color-glow),0_0_60px_var(--color-glow)]">
    Disruption
  </h2>
</div>
```

#### Level 3: Temporal Disruption

**Safe range** -- slightly mismatched timing:
```tsx
{/* Staggered entrance where one element lags noticeably */}
<div className="space-y-6">
  <h2 className="animate-rise text-4xl font-[var(--font-display)] text-[var(--color-text)]">Title</h2>
  <p className="animate-rise [animation-delay:400ms] text-lg text-[var(--color-text)]/70">Body text arrives late.</p>
</div>
```

**Aggressive range** -- frozen vs kinetic collision:
```tsx
{/* Frozen headline over continuously moving gradient */}
<div className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_100%] animate-[gradient-shift_8s_ease_infinite]" />
  <div className="relative z-10 p-20">
    <h2 className="text-6xl font-[var(--font-display)] font-bold text-[var(--color-text)] mix-blend-difference">
      While everything moves, this stays still.
    </h2>
  </div>
</div>
```

#### Level 4: Dimensional Break

**Safe range** -- subtle depth shift:
```tsx
{/* One card lifts slightly with shadow, others flat */}
<div className="rounded-2xl border border-[var(--color-border)] p-6 bg-[var(--color-surface)] shadow-[0_20px_40px_-12px_var(--color-glow)] translate-y-[-4px]">
  <h3 className="font-[var(--font-display)] text-[var(--color-text)]">Featured</h3>
</div>
```

**Aggressive range** -- full perspective break:
```tsx
{/* One card erupts into 3D while siblings stay flat */}
<div className="[perspective:1000px]">
  <div className="rounded-2xl border border-[var(--color-border)] p-6 bg-[var(--color-surface)] [transform:rotateY(-8deg)_rotateX(3deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] transition-transform duration-500 shadow-[0_30px_60px_-12px_var(--color-glow)]">
    <h3 className="font-[var(--font-display)] text-[var(--color-text)]">The Special One</h3>
  </div>
</div>
```

#### Level 5: Interaction Shock

**Safe range** -- unexpected hover response:
```tsx
{/* Button with text swap on hover */}
<button className="group relative overflow-hidden rounded-xl bg-[var(--color-primary)] px-8 py-4 text-[var(--color-bg)]">
  <span className="block transition-transform duration-300 group-hover:-translate-y-full">Get Started</span>
  <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">Let's Go</span>
</button>
```

**Aggressive range** -- dramatic state change:
```tsx
{/* Card that splits apart on hover revealing hidden content */}
<div className="group relative cursor-pointer overflow-hidden">
  <div className="transition-transform duration-500 group-hover:[transform:translateX(-20px)_rotate(-3deg)] origin-left">
    <div className="bg-[var(--color-surface)] p-8 rounded-l-2xl">
      <h3 className="text-2xl font-[var(--font-display)] text-[var(--color-text)]">Surface</h3>
    </div>
  </div>
  <div className="absolute inset-0 bg-[var(--color-primary)] p-8 rounded-2xl translate-x-full transition-transform duration-500 group-hover:translate-x-0">
    <p className="text-[var(--color-bg)]">The hidden truth beneath.</p>
  </div>
</div>
```

### Per-Archetype Tension Techniques

Each archetype gets 3 assigned tension techniques with full copy-paste TSX. These are pre-assigned in MASTER-PLAN.md -- builders execute the assigned tension, not choose their own.

#### Brutalist Tensions
**Default range:** aggressive | **Frequency:** 3-5 per page

**Technique 1: Viewport-Dominating Type** (Level 1: Scale Violence)
```tsx
<h1 className="text-[25vw] font-[var(--font-display)] font-black leading-[0.8] text-[var(--color-text)] overflow-hidden whitespace-nowrap">
  RAW
</h1>
```

**Technique 2: Polished Intrusion** (Level 2: Material Collision)
```tsx
<div className="bg-[var(--color-bg)] border-4 border-[var(--color-text)] p-0">
  <div className="bg-[var(--color-surface)]/60 backdrop-blur-2xl border border-[var(--color-border)]/10 rounded-2xl p-8 m-8 shadow-2xl">
    <p className="font-[var(--font-body)] text-[var(--color-text)]">One hyper-smooth element in the raw layout.</p>
  </div>
</div>
```

**Technique 3: Destructive Hover** (Level 5: Interaction Shock)
```tsx
<div className="group cursor-pointer">
  <h2 className="text-5xl font-[var(--font-display)] font-black text-[var(--color-text)] transition-all duration-150 group-hover:[transform:skewX(-5deg)_scale(1.02)] group-hover:[filter:url('#glitch')]">
    BREAK ME
  </h2>
</div>
```

#### Ethereal Tensions
**Default range:** safe | **Frequency:** 1-3 per page

**Technique 1: Microscopic Precision** (Level 1: Scale Violence)
```tsx
<span className="text-[7px] tracking-[0.4em] uppercase font-[var(--font-body)] font-medium text-[var(--color-text)]/50 block mb-16">
  Established MMXXIV
</span>
```

**Technique 2: Frozen Bloom** (Level 3: Temporal Disruption)
```tsx
<div className="relative">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[var(--color-accent)]/20 blur-3xl scale-110 [animation:none]" aria-hidden="true" />
  <p className="relative text-lg font-[var(--font-body)] text-[var(--color-text)]/80">An orb caught mid-expansion, frozen in time.</p>
</div>
```

**Technique 3: Depth Puncture** (Level 4: Dimensional Break)
```tsx
<div className="[perspective:800px]">
  <blockquote className="text-2xl font-[var(--font-display)] italic text-[var(--color-text)] [transform:rotateX(2deg)_translateZ(20px)] shadow-[0_40px_80px_-20px_var(--color-glow)]">
    "Hard perspective in an otherwise floaty layout."
  </blockquote>
</div>
```

#### Kinetic Tensions
**Default range:** aggressive | **Frequency:** 3-5 per page

**Technique 1: Velocity Feedback** (Level 5: Interaction Shock)
```tsx
{/* Element responds to scroll speed -- fast scroll = stretch/blur, slow = crisp */}
<div
  className="transition-[filter,transform] duration-100"
  style={{ filter: `blur(${Math.min(scrollVelocity * 0.3, 8)}px)`, transform: `scaleY(${1 + scrollVelocity * 0.002})` }}
>
  <img src="/hero.jpg" alt="Product" className="w-full object-cover" />
</div>
```

**Technique 2: Static Island** (Level 2: Material Collision)
```tsx
{/* One completely still element in a sea of motion */}
<div className="relative py-24">
  <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
    {/* Surrounding elements all animate */}
    <div className="animate-[drift_20s_ease-in-out_infinite] absolute top-10 left-10 w-32 h-32 rounded-full bg-[var(--color-accent)]/10" />
    <div className="animate-[drift_15s_ease-in-out_infinite_reverse] absolute bottom-10 right-10 w-24 h-24 rounded-full bg-[var(--color-primary)]/10" />
  </div>
  {/* The still island */}
  <div className="relative z-10 max-w-md mx-auto text-center [animation:none!important]">
    <p className="text-xl font-[var(--font-body)] text-[var(--color-text)]">Calm eye of the storm.</p>
  </div>
</div>
```

**Technique 3: Micro-to-Macro** (Level 1: Scale Violence)
```tsx
{/* Element starts tiny and scales massively on scroll -- use with GSAP ScrollTrigger or CSS scroll-driven */}
<div className="text-[1rem] font-[var(--font-display)] font-black text-[var(--color-text)] [animation:scale-up_linear_both] [animation-timeline:view()] [animation-range:entry_0%_cover_50%]">
  EXPAND
</div>
{/* @keyframes scale-up { from { font-size: 1rem; } to { font-size: 15vw; } } */}
```

#### Editorial Tensions
**Default range:** aggressive | **Frequency:** 2-3 per page

**Technique 1: Oversized Drop Cap** (Level 1: Scale Violence)
```tsx
<p className="text-lg font-[var(--font-body)] text-[var(--color-text)] leading-relaxed">
  <span className="float-left text-[12rem] leading-[0.7] font-[var(--font-display)] font-black text-[var(--color-primary)] mr-4 -mt-4">
    T
  </span>
  he opening paragraph flows around a drop cap that consumes 40% of the viewport width.
</p>
```

**Technique 2: Digital Intrusion** (Level 2: Material Collision)
```tsx
<div className="bg-[var(--color-surface)] p-16 font-[var(--font-body)]">
  <span className="inline-block px-4 py-2 bg-[var(--color-tension)] text-[var(--color-bg)] font-[var(--font-mono)] text-sm rounded [box-shadow:0_0_20px_var(--color-glow)]">
    BREAKING
  </span>
  <h2 className="mt-4 text-4xl font-[var(--font-display)] text-[var(--color-text)]">A neon screen in the library.</h2>
</div>
```

**Technique 3: Z-Axis Pull Quote** (Level 4: Dimensional Break)
```tsx
<blockquote className="relative text-3xl font-[var(--font-display)] italic text-[var(--color-text)] px-12 py-8 [transform:rotate(-1deg)] shadow-[0_25px_60px_-15px_var(--color-glow)] bg-[var(--color-surface)] rounded-xl border-l-4 border-[var(--color-primary)]">
  "This quote lifts off the page."
</blockquote>
```

#### Neo-Corporate Tensions
**Default range:** safe | **Frequency:** 1-2 per page

**Technique 1: Hero Number** (Level 1: Scale Violence)
```tsx
<div className="text-center">
  <span className="text-[16vw] font-[var(--font-display)] font-black text-[var(--color-text)] leading-none">
    99.9%
  </span>
  <p className="mt-4 text-lg font-[var(--font-body)] text-[var(--color-text)]/60">Uptime reliability</p>
</div>
```

**Technique 2: Analog Texture** (Level 2: Material Collision)
```tsx
<section className="relative bg-[var(--color-surface)] p-20 [background-image:url('/paper-grain.svg')] [background-size:300px]">
  <div className="relative z-10 max-w-3xl">
    <h2 className="text-4xl font-[var(--font-display)] text-[var(--color-text)]">One section breaks the clean digital surface.</h2>
  </div>
</section>
```

**Technique 3: Data Reveal** (Level 5: Interaction Shock)
```tsx
<div className="group relative rounded-2xl border border-[var(--color-border)] p-6 bg-[var(--color-surface)] cursor-pointer overflow-hidden">
  <div className="transition-opacity duration-300 group-hover:opacity-0">
    <h3 className="text-xl font-[var(--font-display)] text-[var(--color-text)]">Revenue</h3>
    <p className="text-[var(--color-text)]/60">Hover for details</p>
  </div>
  <div className="absolute inset-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[var(--color-primary)] text-[var(--color-bg)]">
    <p className="font-[var(--font-mono)] text-sm">Q4: $12.4M (+23% YoY)</p>
  </div>
</div>
```

#### Organic Tensions
**Default range:** safe-to-aggressive | **Frequency:** 1-3 per page

**Technique 1: Giant Botanical** (Level 1: Scale Violence)
```tsx
<div className="relative min-h-screen">
  <svg className="absolute inset-0 w-full h-full text-[var(--color-accent)]/[0.06]" viewBox="0 0 800 1200" aria-hidden="true">
    {/* Full-viewport botanical SVG illustration */}
    <path d="M400,1200 Q350,800 300,600 Q250,400 400,200 Q550,400 500,600 Q450,800 400,1200Z" fill="currentColor" />
  </svg>
  <div className="relative z-10 p-20">
    <h2 className="text-4xl font-[var(--font-display)] text-[var(--color-text)]">Content floats above the growth.</h2>
  </div>
</div>
```

**Technique 2: Geometric Intrusion** (Level 4: Dimensional Break)
```tsx
{/* Sharp geometric element in the otherwise curved, flowing layout */}
<div className="relative">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-[var(--color-tension)] rotate-45" aria-hidden="true" />
  <p className="relative z-10 text-center text-lg font-[var(--font-body)] text-[var(--color-text)]">A crystal in soil.</p>
</div>
```

**Technique 3: Growth Animation** (Level 3: Temporal Disruption)
```tsx
{/* SVG path that continuously extends -- use with GSAP DrawSVG or CSS */}
<svg className="w-full h-40" viewBox="0 0 800 160" aria-hidden="true">
  <path d="M0,80 Q200,20 400,80 Q600,140 800,80" stroke="var(--color-accent)" strokeWidth="2" fill="none"
    className="[stroke-dasharray:1200] [stroke-dashoffset:1200] [animation:draw-path_3s_ease-out_forwards]" />
</svg>
{/* @keyframes draw-path { to { stroke-dashoffset: 0; } } */}
```

#### Retro-Future Tensions
**Default range:** aggressive | **Frequency:** 1-3 per page

**Technique 1: Massive ASCII** (Level 1: Scale Violence)
```tsx
<pre className="text-[1vw] leading-tight font-[var(--font-mono)] text-[var(--color-primary)]/30 whitespace-pre overflow-hidden select-none" aria-hidden="true">
{`
 ██████╗ ██████╗ ██████╗ ███████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║     ██║   ██║██║  ██║█████╗
██║     ██║   ██║██║  ██║██╔══╝
╚██████╗╚██████╔╝██████╔╝███████╗
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
`}
</pre>
```

**Technique 2: Terminal Command** (Level 5: Interaction Shock)
```tsx
<div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-6 font-[var(--font-mono)] text-sm text-[var(--color-primary)]">
  <p className="text-[var(--color-text)]/50">$ type "help" for commands</p>
  <input type="text" className="bg-transparent border-none outline-none text-[var(--color-text)] w-full mt-2 caret-[var(--color-primary)]"
    placeholder=">" aria-label="Terminal input" />
</div>
```

**Technique 3: High-Res Intrusion** (Level 2: Material Collision)
```tsx
{/* One modern photograph amidst the low-res, pixelated aesthetic */}
<div className="relative bg-[var(--color-bg)] p-4 [image-rendering:pixelated]">
  <img src="/product-hero.jpg" alt="Product" className="w-full rounded-none [image-rendering:auto] shadow-[0_0_40px_var(--color-glow)]" />
</div>
```

#### Luxury/Fashion Tensions
**Default range:** safe | **Frequency:** 1-2 per page

**Technique 1: Single Word Hero** (Level 1: Scale Violence)
```tsx
<h1 className="text-[22vw] font-[var(--font-display)] font-extralight tracking-[0.15em] leading-none text-[var(--color-text)] uppercase text-center">
  Luxe
</h1>
```

**Technique 2: Slow Reveal** (Level 3: Temporal Disruption)
```tsx
{/* Content appears painfully slow -- 3-5 second full reveal */}
<div className="animate-[luxury-reveal_4s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0">
  <img src="/collection.jpg" alt="Collection" className="w-full" />
</div>
{/* @keyframes luxury-reveal { 0% { opacity: 0; transform: scale(1.03); } 100% { opacity: 1; transform: scale(1); } } */}
```

**Technique 3: Raw Element** (Level 2: Material Collision)
```tsx
{/* One deliberately unpolished stroke in the refined layout */}
<div className="relative px-20 py-16">
  <svg className="absolute top-0 left-8 w-32 h-8 text-[var(--color-accent)]" viewBox="0 0 200 30" aria-hidden="true">
    <path d="M5,15 Q50,5 100,18 Q150,28 195,12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
  <h2 className="text-4xl font-[var(--font-display)] font-light text-[var(--color-text)]">Imperfection is luxury.</h2>
</div>
```

#### Playful/Startup Tensions
**Default range:** aggressive | **Frequency:** 2-3 per page

**Technique 1: Physics Play** (Level 5: Interaction Shock)
```tsx
{/* Elements with bounce physics on click -- implement with Motion spring */}
<button
  className="rounded-2xl bg-[var(--color-primary)] px-8 py-4 text-[var(--color-bg)] font-[var(--font-display)] font-bold text-lg active:scale-90 transition-transform"
  style={{ transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
>
  Boing!
</button>
```

**Technique 2: Giant Illustration** (Level 1: Scale Violence)
```tsx
{/* Oversized illustration (50%+ viewport) as the hero instead of text */}
<div className="relative min-h-[80vh] flex items-center justify-center">
  <img src="/hero-illustration.svg" alt="" className="w-[60vw] max-w-none" aria-hidden="true" />
  <h1 className="absolute bottom-8 left-8 text-2xl font-[var(--font-display)] font-bold text-[var(--color-text)]">
    Build something fun.
  </h1>
</div>
```

**Technique 3: Flat in 3D** (Level 4: Dimensional Break)
```tsx
{/* Deliberately flat sticker element in a dimensional layout */}
<div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-full rotate-[-3deg] [filter:drop-shadow(2px_2px_0_var(--color-text))]">
  <span className="text-sm font-[var(--font-display)] font-bold uppercase">New!</span>
</div>
```

#### Data-Dense/Dashboard Tensions
**Default range:** safe | **Frequency:** 1-3 per page

**Technique 1: Mega Metric** (Level 1: Scale Violence)
```tsx
<div className="text-center py-20">
  <span className="text-[clamp(4rem,15vw,12rem)] font-[var(--font-display)] font-black text-[var(--color-primary)] leading-none tabular-nums">
    2.4M
  </span>
  <p className="mt-2 text-sm font-[var(--font-mono)] text-[var(--color-text)]/50 uppercase tracking-wider">Active users</p>
</div>
```

**Technique 2: Drill-Down Explosion** (Level 5: Interaction Shock)
```tsx
{/* Click a summary card to expand into full detail panel */}
<div className="group cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all duration-500 hover:p-8 hover:shadow-[0_20px_60px_-15px_var(--color-glow)]">
  <div className="flex items-center justify-between">
    <h3 className="font-[var(--font-display)] text-[var(--color-text)]">Conversion Rate</h3>
    <span className="font-[var(--font-mono)] text-[var(--color-primary)]">3.2%</span>
  </div>
  <div className="max-h-0 overflow-hidden transition-[max-height] duration-500 group-hover:max-h-40">
    <div className="pt-4 border-t border-[var(--color-border)] mt-4 font-[var(--font-mono)] text-sm text-[var(--color-text)]/70">
      <p>Desktop: 4.1% | Mobile: 2.3% | Tablet: 3.8%</p>
    </div>
  </div>
</div>
```

**Technique 3: Warm Accent** (Level 2: Material Collision)
```tsx
{/* One warm, soft illustration element in the otherwise cold data interface */}
<div className="relative rounded-2xl bg-[var(--color-surface)] p-8">
  <img src="/team-illustration.svg" alt="" className="absolute -top-6 -right-6 w-24 h-24 opacity-80" aria-hidden="true" />
  <h3 className="font-[var(--font-display)] text-[var(--color-text)]">Team Performance</h3>
  <p className="text-sm text-[var(--color-text)]/60">Your humans behind the data.</p>
</div>
```

#### Japanese Minimal Tensions
**Default range:** safe | **Frequency:** 1-2 per page (PEAK only)

**Technique 1: Enormous Negative Space** (Level 1: Scale Violence)
```tsx
{/* 80%+ whitespace -- content occupies only a corner. Space IS the design */}
<section className="min-h-screen flex items-end justify-end p-8 bg-[var(--color-bg)]">
  <div className="max-w-xs text-right">
    <p className="text-sm font-[var(--font-body)] text-[var(--color-text)]/60 leading-relaxed">
      A single thought, surrounded by silence.
    </p>
  </div>
</section>
```

**Technique 2: Red Burst** (Level 2: Material Collision)
```tsx
{/* One bold vermillion stroke that breaks the restraint */}
<div className="relative py-32 bg-[var(--color-bg)]">
  <svg className="absolute top-1/2 left-1/4 w-48 h-16 -translate-y-1/2" viewBox="0 0 200 60" aria-hidden="true">
    <path d="M10,30 Q60,5 100,30 Q140,55 190,30" stroke="var(--color-tension)" strokeWidth="4" fill="none" strokeLinecap="round" />
  </svg>
  <p className="relative z-10 text-center text-lg font-[var(--font-body)] text-[var(--color-text)]">Ma.</p>
</div>
```

**Technique 3: Intentional Stillness** (Level 3: Temporal Disruption)
```tsx
{/* One element aggressively static while subtle motion exists elsewhere */}
<div className="relative">
  <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
    <div className="animate-[drift_30s_ease-in-out_infinite] absolute top-20 right-20 w-2 h-2 rounded-full bg-[var(--color-text)]/10" />
  </div>
  <h2 className="relative z-10 text-3xl font-[var(--font-display)] text-[var(--color-text)] [animation:none!important] [transition:none!important]">
    Stillness.
  </h2>
</div>
```

#### Glassmorphism Tensions
**Default range:** safe-to-aggressive | **Frequency:** 1-3 per page

**Technique 1: Solid Intrusion** (Level 4: Dimensional Break)
```tsx
{/* One completely opaque, solid element amidst translucent glass */}
<div className="grid md:grid-cols-3 gap-4">
  <div className="bg-[var(--color-surface)]/40 backdrop-blur-xl border border-[var(--color-border)]/20 rounded-2xl p-6">
    <p className="text-[var(--color-text)]">Glass</p>
  </div>
  <div className="bg-[var(--color-primary)] rounded-2xl p-6 shadow-2xl">
    <p className="text-[var(--color-bg)] font-[var(--font-display)] font-bold">SOLID</p>
  </div>
  <div className="bg-[var(--color-surface)]/40 backdrop-blur-xl border border-[var(--color-border)]/20 rounded-2xl p-6">
    <p className="text-[var(--color-text)]">Glass</p>
  </div>
</div>
```

**Technique 2: Giant Glass Pane** (Level 1: Scale Violence)
```tsx
{/* Glass panel spanning the entire viewport */}
<section className="min-h-screen relative">
  <div className="absolute inset-4 bg-[var(--color-surface)]/30 backdrop-blur-2xl border border-[var(--color-border)]/10 rounded-3xl flex items-center justify-center">
    <h2 className="text-5xl font-[var(--font-display)] text-[var(--color-text)]">One giant pane.</h2>
  </div>
</section>
```

**Technique 3: Refraction Shift** (Level 5: Interaction Shock)
```tsx
{/* Hover changes backdrop blur intensity, shifting refraction */}
<div className="group bg-[var(--color-surface)]/30 backdrop-blur-md border border-[var(--color-border)]/20 rounded-2xl p-8 transition-all duration-500 hover:backdrop-blur-none hover:bg-[var(--color-surface)]/10 cursor-pointer">
  <h3 className="font-[var(--font-display)] text-[var(--color-text)]">Hover to see through.</h3>
  <p className="text-sm text-[var(--color-text)]/60 mt-2">The glass clears.</p>
</div>
```

#### Neon Noir Tensions
**Default range:** aggressive | **Frequency:** 3-4 per page

**Technique 1: Neon Word Wall** (Level 1: Scale Violence)
```tsx
<h1 className="text-[18vw] font-[var(--font-display)] font-black text-[var(--color-primary)] leading-none [text-shadow:0_0_20px_var(--color-glow),0_0_60px_var(--color-glow),0_0_120px_var(--color-glow)]">
  NOIR
</h1>
```

**Technique 2: Blackout Hover** (Level 5: Interaction Shock)
```tsx
{/* Hovering over one element darkens everything else */}
<div className="group/section grid md:grid-cols-3 gap-6">
  {['Alpha', 'Beta', 'Gamma'].map((name) => (
    <div key={name} className="group/card p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] transition-all duration-300 hover:border-[var(--color-primary)] hover:[box-shadow:0_0_30px_var(--color-glow)] group-hover/section:opacity-30 hover:!opacity-100">
      <h3 className="text-xl font-[var(--font-display)] text-[var(--color-text)]">{name}</h3>
    </div>
  ))}
</div>
```

**Technique 3: Dying Neon** (Level 3: Temporal Disruption)
```tsx
{/* Neon element with irregular, realistic flickering */}
<span className="text-4xl font-[var(--font-display)] font-bold text-[var(--color-primary)] animate-[neon-flicker_4s_ease-in-out_infinite] [text-shadow:0_0_10px_var(--color-glow)]">
  OPEN
</span>
{/* @keyframes neon-flicker {
  0%, 100% { opacity: 1; }
  4% { opacity: 0.8; }
  6% { opacity: 1; }
  7% { opacity: 0.4; }
  9% { opacity: 1; }
  52% { opacity: 1; }
  53% { opacity: 0.6; }
  55% { opacity: 1; }
} */}
```

#### Warm Artisan Tensions
**Default range:** safe | **Frequency:** 1-2 per page

**Technique 1: Digital Precision** (Level 2: Material Collision)
```tsx
{/* One sharp, pixel-perfect geometric element in the handcrafted layout */}
<div className="relative bg-[var(--color-surface)] p-12 rounded-3xl">
  <div className="absolute top-6 right-6 w-16 h-16 border border-[var(--color-text)]/20 rotate-45" aria-hidden="true" />
  <h3 className="font-[var(--font-display)] text-[var(--color-text)]">Machine precision meets handcraft.</h3>
</div>
```

**Technique 2: Giant Stamp** (Level 1: Scale Violence)
```tsx
{/* Oversized badge element as section background */}
<div className="relative overflow-hidden py-24">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full border-4 border-[var(--color-accent)]/10 flex items-center justify-center rotate-[-12deg]" aria-hidden="true">
    <span className="text-[4vw] font-[var(--font-display)] font-bold text-[var(--color-accent)]/10 uppercase tracking-widest">Handmade</span>
  </div>
  <div className="relative z-10 max-w-2xl mx-auto text-center">
    <p className="text-lg font-[var(--font-body)] text-[var(--color-text)]">Content over the stamp.</p>
  </div>
</div>
```

**Technique 3: Texture Reveal** (Level 5: Interaction Shock)
```tsx
{/* Hover reveals underlying grain texture more prominently */}
<div className="group relative rounded-2xl bg-[var(--color-surface)] p-8 overflow-hidden cursor-pointer">
  <div className="absolute inset-0 [background-image:url('/grain.svg')] [background-size:200px] opacity-5 transition-opacity duration-500 group-hover:opacity-20" aria-hidden="true" />
  <h3 className="relative font-[var(--font-display)] text-[var(--color-text)]">Feel the texture.</h3>
</div>
```

#### Swiss/International Tensions
**Default range:** safe | **Frequency:** 1-2 per page (PEAK only)

**Technique 1: Grid Demonstration** (Level 1: Scale Violence)
```tsx
{/* Content arranged so the grid structure itself becomes visible art */}
<div className="grid grid-cols-12 gap-px bg-[var(--color-border)]/20">
  <div className="col-span-8 bg-[var(--color-bg)] p-12">
    <h2 className="text-5xl font-[var(--font-display)] font-bold text-[var(--color-text)]">The grid is the design.</h2>
  </div>
  <div className="col-span-4 bg-[var(--color-primary)] p-12" />
  <div className="col-span-3 bg-[var(--color-bg)] p-8" />
  <div className="col-span-6 bg-[var(--color-surface)] p-8">
    <p className="font-[var(--font-body)] text-[var(--color-text)]">Precision as art.</p>
  </div>
  <div className="col-span-3 bg-[var(--color-bg)] p-8" />
</div>
```

**Technique 2: Organic Photo** (Level 2: Material Collision)
```tsx
{/* One lush, organic photograph in the mathematical precision */}
<div className="grid grid-cols-2 gap-8">
  <div className="p-12 flex items-center">
    <h2 className="text-4xl font-[var(--font-display)] font-bold text-[var(--color-text)]">Structured Content</h2>
  </div>
  <div className="relative overflow-hidden rounded-none">
    <img src="/organic-nature.jpg" alt="Nature" className="w-full h-full object-cover [filter:saturate(1.2)]" />
  </div>
</div>
```

**Technique 3: Type Depth** (Level 4: Dimensional Break)
```tsx
{/* One headline with subtle 3D shadow lifting it off the flat grid */}
<h2 className="text-6xl font-[var(--font-display)] font-black text-[var(--color-text)] [text-shadow:3px_3px_0_var(--color-border),6px_6px_0_var(--color-border)/50]">
  Dimension
</h2>
```

#### Vaporwave Tensions
**Default range:** aggressive | **Frequency:** 2-3 per page

**Technique 1: Massive Glitch** (Level 1: Scale Violence)
```tsx
{/* Full-viewport glitch effect on load */}
<div className="relative overflow-hidden animate-[vaporwave-glitch_0.3s_ease_3] [animation-delay:0.5s]">
  <h1 className="text-[12vw] font-[var(--font-display)] font-black text-[var(--color-primary)]">
    AESTHETIC
  </h1>
</div>
{/* @keyframes vaporwave-glitch {
  0% { transform: translate(0); filter: hue-rotate(0deg); }
  20% { transform: translate(-5px, 3px); filter: hue-rotate(90deg); }
  40% { transform: translate(3px, -2px); filter: hue-rotate(180deg); }
  60% { transform: translate(-2px, 5px); filter: hue-rotate(270deg); }
  80% { transform: translate(4px, -3px); filter: hue-rotate(360deg); }
  100% { transform: translate(0); filter: hue-rotate(0deg); }
} */}
```

**Technique 2: Window Manipulation** (Level 5: Interaction Shock)
```tsx
{/* OS-style draggable windows */}
<div className="relative w-80 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl cursor-move select-none">
  <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
    <div className="w-3 h-3 rounded-full bg-red-400" />
    <div className="w-3 h-3 rounded-full bg-yellow-400" />
    <div className="w-3 h-3 rounded-full bg-green-400" />
    <span className="ml-2 text-xs font-[var(--font-mono)] text-[var(--color-text)]/50">about.exe</span>
  </div>
  <div className="p-4 font-[var(--font-mono)] text-sm text-[var(--color-text)]">
    Welcome to the future past.
  </div>
</div>
```

**Technique 3: Loading Nostalgia** (Level 3: Temporal Disruption)
```tsx
{/* Fake retro loading bar before content reveal */}
<div className="bg-[var(--color-bg)] p-8 border border-[var(--color-border)] rounded font-[var(--font-mono)] text-sm text-[var(--color-primary)]">
  <p>Loading experience.exe...</p>
  <div className="mt-2 h-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
    <div className="h-full bg-[var(--color-primary)] animate-[retro-load_3s_steps(20)_forwards] w-0" />
  </div>
</div>
{/* @keyframes retro-load { to { width: 100%; } } */}
```

#### Neubrutalism Tensions
**Default range:** aggressive | **Frequency:** 3-5 per page

**Technique 1: Raw Border Explosion** (Level 1: Scale Violence)
```tsx
{/* Oversized border element that dominates the viewport */}
<div className="border-[8px] border-[var(--color-text)] rounded-none p-16 bg-[var(--color-accent)] shadow-[12px_12px_0_var(--color-text)]">
  <h2 className="text-[10vw] font-[var(--font-display)] font-black text-[var(--color-text)] leading-none">
    LOUD
  </h2>
</div>
```

**Technique 2: Oversized Interactive** (Level 5: Interaction Shock)
```tsx
{/* Brutally large interactive element that demands engagement */}
<button className="w-full py-12 bg-[var(--color-primary)] text-[var(--color-bg)] text-3xl font-[var(--font-display)] font-black uppercase border-4 border-[var(--color-text)] shadow-[8px_8px_0_var(--color-text)] active:shadow-none active:translate-x-2 active:translate-y-2 transition-all duration-100">
  CLICK THIS ENORMOUS BUTTON
</button>
```

**Technique 3: Layout Break** (Level 4: Dimensional Break)
```tsx
{/* One element rotated and overlapping, breaking the otherwise aligned layout */}
<div className="relative -rotate-2 -mx-4 my-8 bg-[var(--color-highlight)] border-4 border-[var(--color-text)] p-8 shadow-[6px_6px_0_var(--color-text)] z-10">
  <p className="text-xl font-[var(--font-display)] font-bold text-[var(--color-text)]">This breaks the grid on purpose.</p>
</div>
```

#### Dark Academia Tensions
**Default range:** aggressive | **Frequency:** 2-3 per page

**Technique 1: Typographic Weight Contrast** (Level 1: Scale Violence)
```tsx
{/* Dramatic serif scaling -- hairline vs ultra-black on the same page */}
<div className="space-y-2">
  <h2 className="text-[8rem] font-[var(--font-display)] font-black leading-[0.85] text-[var(--color-text)]">
    HEAVY
  </h2>
  <p className="text-lg font-[var(--font-display)] font-extralight tracking-[0.2em] text-[var(--color-text)]/60 uppercase">
    and impossibly light
  </p>
</div>
```

**Technique 2: Aged Paper Collision** (Level 2: Material Collision)
```tsx
{/* Modern crisp element intruding on an aged, warm surface */}
<div className="relative bg-[var(--color-surface)] p-16 [background-image:url('/parchment.svg')] [background-size:cover]">
  <div className="absolute top-8 right-8 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-4 py-2 shadow-xl">
    <span className="font-[var(--font-mono)] text-xs text-[var(--color-primary)]">LIVE 2024</span>
  </div>
  <h2 className="text-5xl font-[var(--font-display)] italic text-[var(--color-text)]">Old wisdom, new vessel.</h2>
</div>
```

**Technique 3: Dramatic Serif Scaling** (Level 3: Temporal Disruption)
```tsx
{/* Serif text that reveals letter by letter with aged pacing */}
<h2 className="text-6xl font-[var(--font-display)] italic text-[var(--color-text)]">
  {'Memento'.split('').map((char, i) => (
    <span key={i} className="inline-block opacity-0 animate-[fade-in_0.4s_ease_forwards]" style={{ animationDelay: `${i * 200}ms` }}>
      {char}
    </span>
  ))}
</h2>
{/* @keyframes fade-in { to { opacity: 1; } } */}
```

#### AI-Native Tensions
**Default range:** aggressive | **Frequency:** 2-3 per page

**Technique 1: Glitch Effects** (Level 3: Temporal Disruption)
```tsx
{/* Data stream glitch -- text that briefly corrupts and self-corrects */}
<h2 className="text-5xl font-[var(--font-mono)] font-bold text-[var(--color-primary)] relative">
  <span className="relative inline-block animate-[ai-glitch_5s_ease-in-out_infinite]">
    INTELLIGENCE
  </span>
</h2>
{/* @keyframes ai-glitch {
  0%, 95%, 100% { transform: none; filter: none; }
  96% { transform: translateX(-3px) skewX(-2deg); filter: hue-rotate(60deg); }
  97% { transform: translateX(3px) skewX(2deg); filter: hue-rotate(-60deg); }
  98% { transform: translateX(-1px); filter: hue-rotate(30deg); }
} */}
```

**Technique 2: Data Viz Tension** (Level 1: Scale Violence)
```tsx
{/* Data visualization at massive scale as decorative element */}
<div className="relative min-h-[60vh] flex items-center">
  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="0,80 10,75 20,60 30,65 40,30 50,35 60,15 70,20 80,10 90,25 100,5" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" />
  </svg>
  <h2 className="relative z-10 text-4xl font-[var(--font-mono)] text-[var(--color-text)]">Patterns emerge from noise.</h2>
</div>
```

**Technique 3: Synthetic-Organic Clash** (Level 2: Material Collision)
```tsx
{/* Organic shape with hard digital overlay */}
<div className="relative rounded-full w-64 h-64 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-px" aria-hidden="true">
    {Array.from({ length: 64 }).map((_, i) => (
      <div key={i} className="bg-[var(--color-text)]/[0.03] border border-[var(--color-border)]/10" />
    ))}
  </div>
  <span className="relative z-10 font-[var(--font-mono)] text-sm text-[var(--color-primary)]">NEURAL</span>
</div>
```

### Reference Sites

Award-winning sites known for creative tension:

- **Locomotive** (locomotive.ca) -- Scale Violence mastery. Viewport-filling typography with controlled whitespace. Every page has one element at extreme scale that commands attention.
- **Resn** (resn.co.nz) -- Interaction Shock pioneers. Unexpected cursor behaviors, physics-based interactions, and hover states that transform the entire viewport. Aggressive tension without chaos.
- **Aristide Benoist** (aristidebenoist.com) -- Material Collision and Dimensional Break. Mixes 3D scenes with flat editorial typography. The collision between dimensions creates memorable transitions.
- **Awwwards Conference sites** (conference.awwwards.com) -- Temporal Disruption through scroll-speed-responsive elements and intentionally slow reveals. Typography that reacts to user behavior.

## Layer 3: Integration Context

### -> Emotional Arc

PEAK beats MUST have tension. TENSION beats exist specifically for tension moments. Other beats can have tension based on archetype frequency table.

| Beat Type | Tension Mandate | Notes |
|-----------|----------------|-------|
| PEAK | MANDATORY | Always has tension, all archetypes |
| TENSION | MANDATORY | This beat exists for tension by definition |
| HOOK | Archetype-dependent | HIGH-tension archetypes include tension in HOOK |
| BUILD | Archetype-dependent | Only HIGH-tension archetypes |
| TEASE | Optional | Rare -- only if archetype frequency demands it |
| REVEAL | Optional | Product reveals may use Dimensional Break |
| BREATHE | NEVER | Breathing room must be calm |
| PROOF | NEVER | Social proof needs credibility, not shock |
| CLOSE | NEVER | CTAs need clarity, not surprise |
| PIVOT | Optional | Narrative pivots can leverage Material Collision |

### -> Design DNA

All tension TSX uses DNA tokens exclusively. Key token mappings:

| DNA Token | Tension Usage |
|-----------|--------------|
| `--color-tension` | Primary tension color -- exists specifically for tension moments |
| `--color-glow` | Neon glow effects, box-shadow glow, text-shadow |
| `--color-accent` | Secondary tension emphasis |
| `--color-highlight` | Background accent for tension sections |
| `--font-display` | Headlines in tension moments |
| `--font-mono` | Data, terminal, and AI tension elements |

**DNA override rule:** If Design DNA forbids a technique (e.g., no gradients), that technique is unavailable for tension. The prohibition stands. Choose a different tension level.

### -> Cinematic Motion

Tension moments often override normal motion patterns:
- TENSION and PEAK beats use "continuous" scroll behavior regardless of the beat's default
- Tension animations may exceed normal duration limits (e.g., Luxury slow reveal at 4s vs normal 0.6s max)
- Temporal Disruption and Interaction Shock tension types inherently involve motion and should coordinate with the cinematic motion profile

### -> Anti-Slop Gate

Creative Courage category (CC, 5 points) directly rewards tension:
- CC-1 (1pt): Signature element present -- tension enhances this
- CC-2 (2pts): Creative tension exists and lands -- THIS SKILL
- CC-3 (2pts): At least one "wow" moment -- tension often IS the wow moment
- A page with NO tension moments scores 0 on CC-2, losing 2 points automatically
- Exception: If archetype is explicitly minimal (Swiss, Japanese Minimal with 0 extra tension), CC-2 can still score 1pt for restraint-as-tension

### -> MASTER-PLAN.md

Tension types and positions are pre-assigned in the master plan. Format:

```markdown
| Section | Beat | Layout | Tension | Tension Level |
|---------|------|--------|---------|---------------|
| Hero | HOOK | centered-hero | YES | Level 1: Scale Violence |
| Features | BUILD | bento-grid | NO | - |
| Showcase | PEAK | split-overlapping | YES | Level 4: Dimensional Break |
| Testimonials | PROOF | marquee-horizontal | NO | - |
| CTA | CLOSE | centered-minimal | NO | - |
```

Builders execute the assigned tension -- they do not choose their own. The planner pre-validates adjacency rules during assignment.

## Layer 4: Anti-Patterns

### Anti-Pattern: Safe Tension

**What goes wrong:** Implementing Scale Violence at 1.5x. Using Material Collision with two similar textures. The tension is technically present but invisible to the user.
**Instead:** Minimum 2x for safe range, 5x+ for aggressive. If the tension does not create a visible contrast, it is decoration, not tension. Default to the aggressive range.

### Anti-Pattern: Tension Everywhere

**What goes wrong:** Every section has a tension moment. The page feels chaotic, and no single moment stands out.
**Instead:** Follow the archetype frequency table. Even HIGH-tension archetypes cap at 5 per page. Follow dual adjacency rules. The calm sections MAKE the tension sections work.

### Anti-Pattern: Clashing Tensions

**What goes wrong:** Two adjacent sections both use Scale Violence. The user sees two oversized elements in a row and reads it as a design error.
**Instead:** Adjacency Rule 1 requires different tension levels between tension sections. Scale Violence followed by Material Collision reads as intentional variety.

### Anti-Pattern: Arbitrary Colors in Tension

**What goes wrong:** Using hex values like `#ff0000` or `#00ff88` for tension elements. The tension element disconnects from the project's visual identity.
**Instead:** Always use DNA tokens: `var(--color-tension)`, `var(--color-glow)`, `var(--color-accent)`. The tension is controlled by the identity system, not the builder's impulse.

### Anti-Pattern: Tension Without Purpose

**What goes wrong:** Adding a Dimensional Break because "it looks cool" without connecting it to the page's narrative or a key element.
**Instead:** Every tension moment must serve the story: draw attention to a CTA, mark a narrative beat, highlight a key feature, or create an emotional climax. Tension without purpose is a gimmick.

### Anti-Pattern: Pulling Back

**What goes wrong:** Implementing the aggressive range but then softening it -- reducing the scale, lowering the contrast, shortening the delay -- because "it looks too bold."
**Instead:** If it feels too bold, that is tension working. The creative director pushes further, never pulls back. Safe range exists for LOW-tension archetypes, not as a comfort zone for archetypes that should be aggressive.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| tension_per_page_high | 3 | 5 | count | HARD -- HIGH-tension archetypes must have 3-5 tension sections |
| tension_per_page_medium | 2 | 3 | count | HARD -- MEDIUM-tension archetypes must have 2-3 |
| tension_per_page_moderate | 1 | 3 | count | SOFT -- MODERATE archetypes target 1-3 |
| tension_per_page_low | 1 | 2 | count | HARD -- LOW-tension archetypes have 1-2 (at least PEAK) |
| scale_violence_safe_min | 2 | - | multiplier | HARD -- safe range minimum 2x deviation |
| scale_violence_aggressive_min | 5 | - | multiplier | HARD -- aggressive range minimum 5x deviation |
| non_tension_gap | 1 | - | sections | HARD -- minimum 1 non-tension section between tension sections |
| non_tension_gap_high_exception | 0 | - | sections | SOFT -- HIGH archetypes may have 0 gap if different levels |
| peak_tension_mandate | 1 | - | boolean | HARD -- PEAK beat always has tension |
| adjacent_type_diversity | - | - | enum | HARD -- adjacent tension sections must use different levels |
