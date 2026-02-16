---
name: creative-tension
description: "Creative tension system that pushes designs beyond safe archetype zones. 5 tension levels with per-archetype aggressive techniques for controlled rule-breaking that creates memorable, surprising moments."
---

Use this skill when designs feel too safe, predictable, or template-like despite following the archetype correctly. Triggers on: creative tension, rule-breaking, surprise, bold, push boundaries, unexpected, beyond safe, memorable, risk, edgy, creative risk.

You are a creative provocateur who deliberately introduces controlled tension into designs. Your job is to make designs that SURPRISE — not just follow rules perfectly.

## The Problem: Perfect But Boring

Archetypes provide strong foundations, but following them perfectly produces predictable output. Creative tension is the deliberate introduction of ONE controlled rule-break per page that creates a stop-scrolling moment. The tension must feel intentional, not accidental.

## 5 Tension Levels

### Level 1: Scale Violence
> One element at an absurdly unexpected scale — either microscopic or monumental.

**Technique:** Take one element and scale it 3-5x beyond what's "appropriate." A headline at 20vw. A number at 400px tall. A label at 8px.

```tsx
{/* Hero headline that dominates the viewport */}
<h1 className="text-[15vw] md:text-[20vw] font-bold leading-[0.8] tracking-[-0.05em] text-[var(--color-text-primary)]">
  BOLD
</h1>

{/* Oversized decorative number behind content */}
<span className="absolute -top-20 -left-10 text-[400px] font-black text-[var(--color-text-primary)]/[0.03] leading-none select-none pointer-events-none">
  01
</span>

{/* Microscopic label that demands attention through contrast */}
<span className="text-[9px] tracking-[0.3em] uppercase font-medium text-[var(--color-text-secondary)]">
  Established 2024
</span>
```

**Rules:** Only ONE scale-violent element per viewport. The rest must be restrained to create contrast.

### Level 2: Material Collision
> Two texturally opposed materials collide — glass on grain, neon on paper, organic on geometric.

**Technique:** Combine two materials/textures that shouldn't coexist. The collision creates visual interest.

```tsx
{/* Glass card floating over grain texture */}
<div className="relative">
  {/* Grain background */}
  <div className="noise-overlay bg-[var(--color-bg-primary)] rounded-3xl p-12">
    {/* Glass panel on top */}
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)]">
      <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Feature</h3>
    </div>
  </div>
</div>

{/* Neon text on paper texture */}
<div className="bg-[#f4efe4] p-16 relative">
  <h2 className="text-5xl font-bold text-[#0a0a0a] mix-blend-difference">
    <span className="text-[#00ff88] [text-shadow:0_0_20px_rgba(0,255,136,0.5),0_0_40px_rgba(0,255,136,0.3)]">
      Disruption
    </span>
  </h2>
</div>
```

**Rules:** Collision must feel intentional. Always one dominant material, one accent. Never 50/50 split.

### Level 3: Temporal Disruption
> Elements that seem to exist in different time states — one frozen, one in motion, one decaying.

**Technique:** Layer elements at different speeds/states. A static headline with kinetic particles. A blurred background with sharp foreground.

```tsx
{/* Frozen headline with kinetic background */}
<div className="relative overflow-hidden">
  {/* Moving gradient — present time */}
  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-1)] via-[var(--color-accent-2)] to-[var(--color-accent-1)] bg-[length:200%_100%] animate-[gradientShift_8s_ease_infinite]" />

  {/* Static content — frozen time */}
  <div className="relative z-10 p-20">
    <h2 className="text-6xl font-bold text-white mix-blend-difference">
      While everything moves,<br />
      this stays still.
    </h2>
  </div>
</div>

{/* Motion blur on scroll — past/future collision */}
<div
  className="transition-all duration-100"
  style={{ filter: `blur(${scrollVelocity * 0.5}px)` }}
>
  <img src="/hero.jpg" alt="Product" className="w-full" />
</div>
```

**Rules:** Maximum 2 temporal layers. One must be clearly dominant (70%+ visual weight).

### Level 4: Dimensional Break
> A 2D layout suddenly gains a 3D element, or a 3D scene has a flat intrusion.

**Technique:** Introduce perspective/depth where the layout is otherwise flat, or vice versa.

```tsx
{/* Flat layout with a 3D card breaking out */}
<section className="py-24 bg-[var(--color-bg-primary)]">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold mb-12">Features</h2>

    <div className="grid md:grid-cols-3 gap-6">
      {/* Normal flat cards */}
      <div className="rounded-2xl border border-[var(--color-border)] p-6">Card 1</div>
      <div className="rounded-2xl border border-[var(--color-border)] p-6">Card 2</div>

      {/* THE BREAK: One card in 3D */}
      <div className="[perspective:1000px]">
        <div className="rounded-2xl border border-[var(--color-border)] p-6 bg-[var(--color-bg-secondary)] [transform:rotateY(-8deg)_rotateX(3deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] transition-transform duration-500 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)]">
          Card 3 — the special one
        </div>
      </div>
    </div>
  </div>
</section>
```

**Rules:** ONE dimensional break per page. It must feel like a deliberate design choice, not a bug.

### Level 5: Interaction Shock
> An interaction that defies the user's expectation — hover reveals hidden content, click triggers morphing, scroll causes unexpected behavior.

**Technique:** Make one interaction behave in a way the user doesn't predict. Not confusing — delightful.

```tsx
{/* Button that reveals hidden text on hover */}
<button className="group relative overflow-hidden rounded-xl bg-[var(--color-accent-1)] px-8 py-4">
  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
    Get Started
  </span>
  <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
    Let's Go →
  </span>
</button>

{/* Card that splits on hover */}
<div className="group relative cursor-pointer">
  <div className="transition-transform duration-500 group-hover:[transform:translateX(-10px)_rotate(-2deg)]">
    <img src="/left.jpg" alt="" className="w-1/2" />
  </div>
  <div className="absolute top-0 right-0 transition-transform duration-500 group-hover:[transform:translateX(10px)_rotate(2deg)]">
    <img src="/right.jpg" alt="" className="w-1/2" />
  </div>
</div>
```

**Rules:** Interaction shock must be DISCOVERABLE — it can't be required for navigation. It's a bonus delight.

---

## Per-Archetype Aggressive Tensions

Each archetype has 3 specific tension techniques that push it beyond its safe zone while remaining recognizable.

### Brutalist
1. **Scale Violence — Viewport-dominating type:** One word at 25vw+ that bleeds off-screen. The rawness amplified.
2. **Material Collision — Polished element intrusion:** One hyper-smooth glass element in the otherwise raw layout. The contrast screams.
3. **Interaction Shock — Destructive hover:** Elements that "break" on hover — glitch, fragment, distort — then snap back.

### Ethereal
1. **Scale Violence — Microscopic precision:** Extremely small, precise details (6-8px labels) against the soft, generous whitespace. Tension through restraint.
2. **Temporal Disruption — Frozen bloom:** One element mid-animation frozen in time — a gradient orb caught mid-expansion, a petal caught mid-fall.
3. **Dimensional Break — Depth puncture:** One element with hard perspective/3D in the otherwise flat, floaty layout.

### Kinetic
1. **Interaction Shock — Velocity feedback:** Elements that respond to scroll SPEED, not just position. Fast scroll = blur/stretch. Slow = crystal clear.
2. **Material Collision — Static island:** One completely static, non-animated element in the sea of motion. A calm eye in the storm.
3. **Scale Violence — Micro-to-macro transition:** Elements that start tiny and scale up massively as you scroll to them.

### Editorial
1. **Scale Violence — Oversized drop cap on steroids:** A drop cap that takes up the ENTIRE left column (not 4-5 lines — 40% of the viewport).
2. **Material Collision — Digital intrusion:** One neon/glowing element in the otherwise paper-like layout. Like a screen glowing in a library.
3. **Dimensional Break — Z-axis pull quote:** One pull quote that appears to float above the page with heavy shadow and slight rotation.

### Neo-Corporate
1. **Scale Violence — Hero number:** A massive metric (revenue, users, speed) at 15-20vw dominating the hero, with the product UI secondary.
2. **Material Collision — Analog texture:** One section with subtle paper/grain texture breaking the otherwise clean digital surface.
3. **Interaction Shock — Data reveal:** Hovering over a card reveals real-time data, charts, or metrics that weren't visible before.

### Organic
1. **Scale Violence — Giant botanical:** One oversized SVG botanical illustration that spans the full viewport height as a background.
2. **Dimensional Break — Geometric intrusion:** One sharp, geometric element in the otherwise curved, flowing layout. Like a crystal in soil.
3. **Temporal Disruption — Growth animation:** One element that appears to "grow" continuously — an SVG path that keeps extending.

### Retro-Future
1. **Scale Violence — Massive ASCII:** ASCII art that spans the full width at a scale that turns characters into abstract patterns.
2. **Interaction Shock — Terminal command:** An interactive terminal that accepts real commands (easter egg) like `help`, `about`, `hire me`.
3. **Material Collision — High-res photo:** One high-resolution, modern photograph amidst the low-res, pixelated aesthetic.

### Luxury / Fashion
1. **Scale Violence — Single word hero:** One word (the brand or concept) at 25vw+, ultra-thin weight (100-200), massive tracking.
2. **Temporal Disruption — Slow reveal:** Content that takes 3-5 seconds to fully appear — painfully slow, exquisitely elegant.
3. **Material Collision — Raw element:** One deliberately unpolished element (hand-drawn line, raw texture) in the refined layout.

### Playful / Startup
1. **Interaction Shock — Physics play:** Elements that respond to click/drag with real physics — bounce, collide, spin. A moment of pure play.
2. **Scale Violence — Giant emoji/illustration:** One oversized illustration (50%+ viewport) as the hero instead of text.
3. **Dimensional Break — Flat in 3D world:** One deliberately flat, sticker-like element in an otherwise dimensional layout.

### Data-Dense / Dashboard
1. **Scale Violence — Mega metric:** One number displayed at 200px+ font size — the single most important KPI, impossible to miss.
2. **Interaction Shock — Drill-down explosion:** Clicking a data point expands it into a full panel with detailed breakdown.
3. **Material Collision — Warm accent:** One warmly-colored, soft element (illustration, photo) in the otherwise cold data interface.

### Japanese Minimal
1. **Scale Violence — Enormous negative space:** A section with 80%+ whitespace — content occupies only a tiny corner. Space IS the design.
2. **Material Collision — Red burst:** One bold vermillion stroke or shape that breaks the restraint — like a calligraphy brushstroke.
3. **Temporal Disruption — Stillness:** One element that is AGGRESSIVELY static while subtle motion exists elsewhere. Not frozen — intentionally still.

### Glassmorphism
1. **Dimensional Break — Solid intrusion:** One completely opaque, solid-colored element amidst the translucent glass panels.
2. **Scale Violence — Giant glass pane:** One glass panel that spans the ENTIRE viewport — content floats within it.
3. **Interaction Shock — Refraction shift:** Hovering over glass panels shifts the refraction/blur of elements behind them.

### Neon Noir
1. **Scale Violence — Neon word wall:** One word in neon at viewport scale, with the triple glow creating a light source that illuminates surrounding elements.
2. **Interaction Shock — Blackout hover:** Hovering over an element causes everything ELSE to go dark, creating a spotlight effect.
3. **Temporal Disruption — Dying neon:** One neon element with irregular, realistic flickering — like a neon sign about to burn out.

### Warm Artisan
1. **Material Collision — Digital precision:** One sharp, pixel-perfect geometric element in the otherwise handcrafted layout.
2. **Scale Violence — Giant stamp:** An oversized stamp/badge element (40%+ of viewport) as a section background.
3. **Interaction Shock — Texture reveal:** Hovering over elements reveals the underlying paper/grain texture more prominently.

### Swiss / International
1. **Scale Violence — Grid demonstration:** Content arranged so dramatically that the underlying grid structure itself becomes visual art.
2. **Material Collision — Organic photo:** One lush, organic photograph in the otherwise mathematical precision.
3. **Dimensional Break — Type depth:** One headline with subtle 3D/shadow that lifts it off the flat grid.

### Vaporwave
1. **Scale Violence — Massive glitch:** A full-viewport glitch effect that distorts everything for 2-3 seconds on page load.
2. **Interaction Shock — Window manipulation:** OS-style windows that the user can actually drag, resize, and minimize.
3. **Temporal Disruption — Loading nostalgia:** A fake loading bar (like 90s web) that plays before content reveals.

---

## Rules for Controlled Rule-Breaking

### Which Rules to Break
- Scale expectations (one element)
- Material consistency (one collision)
- Temporal uniformity (one speed difference)
- Dimensional consistency (one depth shift)
- Interaction predictability (one surprise)

### Which Rules to KEEP (Never Break)
- **Accessibility** — Every interaction must remain accessible. Tension is visual, not functional.
- **Readability** — Body text must always be readable. Tension applies to decorative/headline elements.
- **Navigation** — Core navigation must work perfectly. No tension in wayfinding.
- **Performance** — Tension effects must not cause jank. Use `transform`/`opacity` only.
- **Color tokens** — Even tension elements use the Design DNA palette. No rogue colors.
- **Reduced motion** — All tension animations must have `prefers-reduced-motion` fallbacks.

### Tension Budget
- **1 tension per page** (for most projects)
- **2-3 tensions per page** (for portfolio/creative/agency sites)
- **Never more than 3** — beyond that, it's chaos, not tension
- Tensions should be SPACED — not adjacent sections
- The rest of the page must be calm/predictable to make the tension moment land
