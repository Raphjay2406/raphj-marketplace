---
name: emotional-arc
description: "Emotional arc system for page storytelling. 10 beat types with measurable parameters, archetype-specific templates, and transition techniques. Turns pages from feature lists into emotional journeys."
---

Use this skill when planning page flow, section order, or designing the emotional experience of a page. Triggers on: emotional arc, page flow, beat, pacing, section order, storytelling, narrative, page rhythm, emotional journey, user journey.

You are a narrative designer who treats every page as a story. Each section is a beat in an emotional arc — it has a role in the overall experience. Pages that just list features are forgettable. Pages that take users on a journey convert.

## The 10 Beat Types

Every section on a page must be assigned ONE beat type. The beat determines its visual parameters, density, and energy level.

### 1. HOOK
> The first 2 seconds. Grab attention. Make them stop scrolling.

| Parameter | Value |
|-----------|-------|
| Section height | 90-100vh (full viewport) |
| Element density | Low (3-5 elements max) |
| Animation intensity | High (dramatic entrance, 800ms+) |
| Whitespace ratio | 60-70% |
| Type scale | Hero level (text-7xl to text-[15vw]) |
| Layout complexity | Simple (centered or split) |

**Purpose:** Create an immediate emotional response. The user must feel something in the first 2 seconds — curiosity, excitement, awe, intrigue.

### 2. TEASE
> Hint at depth. Show just enough to create desire to scroll.

| Parameter | Value |
|-----------|-------|
| Section height | 50-70vh |
| Element density | Low-Medium (4-6 elements) |
| Animation intensity | Medium (subtle motion, 400-600ms) |
| Whitespace ratio | 50-60% |
| Type scale | H1-H2 level |
| Layout complexity | Simple-Medium |

**Purpose:** Create a gap between what the user sees and what they want to know. Social proof logos, a single compelling metric, or a provocative statement.

### 3. REVEAL
> Unveil the product/solution with impact.

| Parameter | Value |
|-----------|-------|
| Section height | 80-100vh |
| Element density | Medium (5-8 elements) |
| Animation intensity | High (scroll-triggered reveal, 600-1000ms) |
| Whitespace ratio | 40-50% |
| Type scale | H1-H2 level |
| Layout complexity | Medium-High (product showcase, demo) |

**Purpose:** The "aha" moment. Show the product, the solution, the key insight. This is where desire converts to understanding.

### 4. BUILD
> Stack evidence and features. Create confidence.

| Parameter | Value |
|-----------|-------|
| Section height | Auto (content-driven) |
| Element density | High (8-12 elements) |
| Animation intensity | Low-Medium (staggered reveals, 300-500ms) |
| Whitespace ratio | 30-40% |
| Type scale | H2-H3 level |
| Layout complexity | High (bento grids, feature lists, tabbed showcases) |

**Purpose:** Systematically build the case. Features, capabilities, integrations. Dense but organized.

### 5. PEAK
> The most impressive moment on the page. Maximum wow.

| Parameter | Value |
|-----------|-------|
| Section height | 80-120vh |
| Element density | Medium (5-8 elements) |
| Animation intensity | Maximum (cinematic, 800-1500ms) |
| Whitespace ratio | 40-60% |
| Type scale | H1 to Hero level |
| Layout complexity | High (interactive demo, 3D, video) |

**Purpose:** The screenshot moment. The thing they'll remember and share. Deploy creative tension and wow moments here.

### 6. BREATHE
> Decompression space. Let the user process what they've seen.

| Parameter | Value |
|-----------|-------|
| Section height | 30-50vh |
| Element density | Very Low (1-3 elements) |
| Animation intensity | Minimal (gentle fade, 400ms) |
| Whitespace ratio | 70-80% |
| Type scale | Body Large or H3 |
| Layout complexity | Minimal (centered text, single image) |

**Purpose:** Reset the user's emotional state. A simple quote, a single metric, or just generous whitespace. Prevents fatigue.

### 7. TENSION
> Introduce the problem, conflict, or what's at stake.

| Parameter | Value |
|-----------|-------|
| Section height | 60-80vh |
| Element density | Medium (5-8 elements) |
| Animation intensity | Medium (deliberate, slower, 500-700ms) |
| Whitespace ratio | 40-50% |
| Type scale | H2-H3 level |
| Layout complexity | Medium (before/after, comparison, pain points) |

**Purpose:** Make the user feel the problem. Without tension, the solution has no weight. Before/after comparisons, pain point lists, competitor differentiation.

### 8. PROOF
> Validate with social proof, testimonials, data.

| Parameter | Value |
|-----------|-------|
| Section height | Auto (content-driven) |
| Element density | Medium-High (6-10 elements) |
| Animation intensity | Low (subtle stagger, 200-400ms) |
| Whitespace ratio | 35-45% |
| Type scale | H3 to Body Large |
| Layout complexity | Medium (testimonial cards, logo bars, stats) |

**Purpose:** Remove doubt. Other people/companies trust this. Real numbers back it up. Testimonials, logos, case studies, metrics.

### 9. PIVOT
> Shift perspective. Reframe the narrative.

| Parameter | Value |
|-----------|-------|
| Section height | 50-70vh |
| Element density | Low-Medium (3-6 elements) |
| Animation intensity | Medium-High (directional shift, 500-800ms) |
| Whitespace ratio | 50-60% |
| Type scale | H1-H2 level |
| Layout complexity | Simple-Medium |

**Purpose:** Change the conversation. "But it's not just about X — it's about Y." Introduces a new dimension (community, vision, future). Often precedes the final CTA.

### 10. CLOSE
> The final beat. Clear action. No ambiguity.

| Parameter | Value |
|-----------|-------|
| Section height | 50-70vh |
| Element density | Low (3-5 elements) |
| Animation intensity | Medium (confident, 400-600ms) |
| Whitespace ratio | 55-65% |
| Type scale | H1-H2 level |
| Layout complexity | Simple (centered CTA, single action) |

**Purpose:** Convert. One clear primary CTA. Supporting text that reinforces urgency or value. The user should feel confident clicking.

---

## Transition Techniques Between Beats

How one beat flows into the next is as important as the beats themselves.

### 1. Scroll-Fade
> Previous section fades as next section enters. Gentle, continuous.

```tsx
{/* CSS scroll-driven crossfade */}
<section style={{
  animation: 'fadeOut linear both',
  animationTimeline: 'view()',
  animationRange: 'exit 0% exit 50%',
}}>
  {/* Outgoing content */}
</section>
<section style={{
  animation: 'fadeIn linear both',
  animationTimeline: 'view()',
  animationRange: 'entry 0% entry 50%',
}}>
  {/* Incoming content */}
</section>
```

**Best between:** HOOK→TEASE, BREATHE→BUILD, any gentle transition.

### 2. Acceleration
> The pace picks up. Elements enter faster, stagger tightens.

```tsx
{/* Decrease stagger delay as sections progress */}
const staggerDelay = isAccelerating ? 40 : 80 // ms between elements
const duration = isAccelerating ? 300 : 500 // ms animation duration
```

**Best between:** TEASE→REVEAL, BUILD→PEAK, any escalation.

### 3. Hard-Cut
> Instant transition. Background color change with no blending. Stark, dramatic.

```tsx
{/* Abrupt background switch */}
<section className="bg-[var(--color-bg-primary)] py-24">
  {/* Light section content */}
</section>
<section className="bg-[#0a0a0f] py-24">
  {/* Dark section content — no gradient, just cut */}
</section>
```

**Best between:** BREATHE→TENSION, PROOF→PIVOT, any dramatic shift.

### 4. Gentle-Resume
> A pause, then soft continuation. Like a new paragraph after a line break.

```tsx
{/* Extra vertical space + slow fade-in */}
<div className="h-32" /> {/* Visual pause */}
<section className="motion-safe:animate-[fadeIn_1s_ease-out_both]">
  {/* Content that gently resumes */}
</section>
```

**Best between:** PEAK→BREATHE, TENSION→PROOF, after any intense moment.

### 5. Disruption
> The layout/style breaks suddenly. Grid shifts, color inverts, typography changes.

```tsx
{/* Section that breaks the visual pattern */}
<section className="bg-[var(--color-accent-1)] -mx-4 md:-mx-12 rotate-[-1deg] py-16">
  <div className="rotate-[1deg]"> {/* Counter-rotate content */}
    <h2 className="text-4xl font-black text-[var(--color-bg-primary)]">
      Everything changes here.
    </h2>
  </div>
</section>
```

**Best between:** BUILD→PEAK, PROOF→CLOSE, any moment needing energy injection.

### 6. Convergence
> Multiple visual threads merge. Scattered elements coalesce into unity.

```tsx
{/* Elements that animate from spread positions to aligned */}
<motion.div
  initial={{ x: -100, opacity: 0 }}
  whileInView={{ x: 0, opacity: 1 }}
  className="text-center"
>
  {/* Content pieces converge to center */}
</motion.div>
```

**Best between:** BUILD→CLOSE, multiple PROOF→CLOSE, bringing threads together.

---

## Valid Beat Sequences

### Recommended Arcs (Proven Patterns)

**The Classic SaaS Arc:**
```
HOOK → TEASE → REVEAL → BUILD → BREATHE → PROOF → BUILD → CLOSE
```

**The Story Arc:**
```
HOOK → TENSION → REVEAL → BUILD → PEAK → BREATHE → PROOF → CLOSE
```

**The Confidence Arc:**
```
HOOK → PROOF → REVEAL → BUILD → BUILD → BREATHE → PEAK → CLOSE
```

**The Provocateur Arc:**
```
HOOK → TENSION → TENSION → REVEAL → BREATHE → BUILD → PROOF → CLOSE
```

**The Minimal Arc (short pages):**
```
HOOK → REVEAL → PROOF → CLOSE
```

### Sequence Rules

**REQUIRED:**
- First beat MUST be HOOK
- Last beat MUST be CLOSE
- At least one BREATHE after any PEAK or sequence of 3+ dense beats (BUILD/PROOF)
- At least one PROOF before CLOSE (builds conversion confidence)

**FORBIDDEN (auto-reject):**
- ❌ CLOSE before PROOF (no evidence before asking for action)
- ❌ PEAK → PEAK (double peak dilutes both)
- ❌ HOOK → CLOSE (no journey, just a popup)
- ❌ BUILD → BUILD → BUILD → BUILD (4+ dense beats without BREATHE = fatigue)
- ❌ BREATHE → BREATHE (double rest = empty)
- ❌ TENSION → TENSION → TENSION (too much negativity without relief)

**GUIDELINES:**
- PEAK should appear in the middle third of the page (not first or last)
- TENSION should appear before REVEAL or PROOF (creates contrast)
- TEASE works best immediately after HOOK
- PIVOT works best in the final third, before CLOSE

---

## Archetype-Specific Arc Templates

### Neo-Corporate (SaaS/Dev Tool)
```
HOOK (product statement) → TEASE (logo bar) → REVEAL (product demo) → BUILD (feature bento) → BREATHE (single metric) → PROOF (testimonials) → BUILD (integrations) → CLOSE (CTA)
```
Transition pattern: scroll-fade → acceleration → acceleration → gentle-resume → hard-cut → acceleration → convergence

### Brutalist (Creative Agency)
```
HOOK (manifesto) → TENSION (industry critique) → REVEAL (portfolio piece) → BUILD (capabilities) → PEAK (interactive showcase) → BREATHE (quote) → PROOF (client list) → CLOSE (contact)
```
Transition pattern: hard-cut → hard-cut → disruption → acceleration → gentle-resume → hard-cut → disruption

### Ethereal (Wellness/Beauty)
```
HOOK (atmospheric visual) → TEASE (philosophy statement) → REVEAL (product showcase) → BREATHE (ambient moment) → BUILD (ingredients/benefits) → PROOF (testimonials) → BREATHE (quote) → CLOSE (gentle CTA)
```
Transition pattern: scroll-fade → scroll-fade → gentle-resume → scroll-fade → scroll-fade → gentle-resume → convergence

### Kinetic (Event/Launch)
```
HOOK (motion hero) → REVEAL (demo/video) → BUILD (features cascade) → PEAK (interactive experience) → BREATHE (metric) → PROOF (early adopters) → PIVOT (vision statement) → CLOSE (signup)
```
Transition pattern: acceleration → acceleration → acceleration → gentle-resume → hard-cut → disruption → convergence

### Editorial (Publication/Blog)
```
HOOK (headline) → TEASE (excerpt) → REVEAL (featured content) → BUILD (article grid) → BREATHE (pull quote) → PROOF (readership stats) → CLOSE (subscribe)
```
Transition pattern: scroll-fade → scroll-fade → acceleration → gentle-resume → scroll-fade → convergence

### Luxury / Fashion
```
HOOK (full-bleed image) → TEASE (single word) → REVEAL (collection) → BREATHE (editorial image) → BUILD (product details) → BREATHE (quote) → CLOSE (shop CTA)
```
Transition pattern: scroll-fade → hard-cut → gentle-resume → scroll-fade → gentle-resume → convergence

### Playful / Startup
```
HOOK (animated hero) → TEASE (problem statement) → REVEAL (product tour) → BUILD (features) → PEAK (interactive demo) → PROOF (social proof) → CLOSE (fun CTA)
```
Transition pattern: acceleration → disruption → acceleration → acceleration → gentle-resume → convergence

### Data-Dense / Dashboard
```
HOOK (key metric) → REVEAL (dashboard overview) → BUILD (features) → BUILD (integrations) → PROOF (case study numbers) → CLOSE (start free)
```
Transition pattern: hard-cut → acceleration → hard-cut → hard-cut → convergence

### Japanese Minimal
```
HOOK (single element + space) → BREATHE (philosophy) → REVEAL (craft showcase) → BREATHE (image) → BUILD (details) → CLOSE (understated CTA)
```
Transition pattern: scroll-fade → scroll-fade → gentle-resume → scroll-fade → convergence

### Glassmorphism
```
HOOK (glass hero) → TEASE (feature preview) → REVEAL (product layers) → BUILD (feature cards) → PEAK (interactive glass demo) → PROOF (metrics) → CLOSE (glass CTA)
```
Transition pattern: scroll-fade → acceleration → acceleration → acceleration → gentle-resume → convergence

### Neon Noir
```
HOOK (neon title) → TENSION (problem in darkness) → REVEAL (solution spotlight) → BUILD (features) → PEAK (neon showcase) → PROOF (stats) → CLOSE (neon CTA)
```
Transition pattern: hard-cut → disruption → acceleration → acceleration → gentle-resume → convergence

### Organic
```
HOOK (nature visual) → TEASE (mission) → REVEAL (product) → BREATHE (earth image) → BUILD (benefits) → PROOF (impact numbers) → CLOSE (join CTA)
```
Transition pattern: scroll-fade → scroll-fade → gentle-resume → scroll-fade → scroll-fade → convergence

### Retro-Future
```
HOOK (terminal boot) → REVEAL (product demo) → BUILD (command showcase) → PEAK (interactive terminal) → PROOF (user stats) → CLOSE (install command)
```
Transition pattern: hard-cut → acceleration → acceleration → gentle-resume → hard-cut

### Warm Artisan
```
HOOK (craft image) → TEASE (origin story) → REVEAL (product showcase) → BUILD (process steps) → BREATHE (testimonial) → PROOF (press logos) → CLOSE (shop CTA)
```
Transition pattern: scroll-fade → scroll-fade → acceleration → gentle-resume → scroll-fade → convergence

### Swiss / International
```
HOOK (typographic statement) → REVEAL (work showcase) → BUILD (services grid) → PROOF (client list) → CLOSE (contact)
```
Transition pattern: hard-cut → hard-cut → hard-cut → convergence

### Vaporwave
```
HOOK (retro splash) → TEASE (glitch text) → REVEAL (showcase) → BUILD (features in windows) → PEAK (interactive OS) → CLOSE (CTA window)
```
Transition pattern: disruption → disruption → acceleration → acceleration → convergence

---

## Code Patterns Per Beat Type

### HOOK — TSX Pattern
```tsx
<section className="relative min-h-screen flex items-center overflow-hidden">
  {/* Background treatment (gradient, orb, image, etc.) */}
  <div className="absolute inset-0 [background-treatment]" />

  <div className="container relative z-10 mx-auto px-6">
    {/* Overline label */}
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/5 px-4 py-1.5 text-sm mb-8">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-2)] animate-pulse" />
      Status text
    </div>

    {/* Hero headline — largest type on page */}
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.85]">
      Headline text
    </h1>

    {/* Brief subtext */}
    <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-lg">
      One or two sentences max.
    </p>

    {/* CTA(s) */}
    <div className="mt-8 flex items-center gap-4">
      <button className="primary-cta">Primary Action</button>
      <button className="secondary-cta">Secondary</button>
    </div>
  </div>
</section>
```

### BREATHE — TSX Pattern
```tsx
<section className="py-32 md:py-40 lg:py-48">
  <div className="container mx-auto px-6 text-center max-w-2xl">
    {/* Single element — quote, metric, or image */}
    <p className="text-2xl md:text-3xl font-light leading-relaxed text-[var(--color-text-secondary)]">
      "A single, resonant quote or statement."
    </p>
    <p className="mt-4 text-sm text-[var(--color-text-tertiary)]">
      — Attribution
    </p>
  </div>
</section>
```

### CLOSE — TSX Pattern
```tsx
<section className="py-24 md:py-32">
  <div className="container mx-auto px-6 text-center max-w-xl">
    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
      Clear call to action
    </h2>
    <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
      Reinforcing sentence with value or urgency.
    </p>
    <div className="mt-8">
      <button className="primary-cta-large">
        Single Primary Action
      </button>
      <p className="mt-3 text-sm text-[var(--color-text-tertiary)]">
        Friction reducer — "No credit card required"
      </p>
    </div>
  </div>
</section>
```
