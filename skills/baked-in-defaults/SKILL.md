---
name: "baked-in-defaults"
description: "Templates for mandatory motion, responsive, and compatibility blocks in every section PLAN.md. Beat-to-motion mapping, breakpoint layouts, and fallback patterns."
tier: "core"
triggers: "planning, plan generation, section planning, PLAN.md"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Every section PLAN.md** -- Motion, responsive, and compat blocks are mandatory in every section plan
- **Plan generation** -- During `/gen:plan`, bake these blocks into each section's PLAN.md
- **Builder kickoff** -- Builders check these blocks before writing any code to know motion tier, breakpoint requirements, and compat constraints
- **Quality gate preparation** -- These blocks prevent hard gate failures in quality-gate-v2

### When NOT to Use

- **Design direction** -- This skill is about implementation defaults, not creative direction (use design-archetypes)
- **Component-level planning** -- Use component-consistency for component specs
- **Post-build fixing** -- These blocks should exist BEFORE building; adding them after is a workflow failure

### Decision Tree

- If generating a section PLAN.md -> include all 3 blocks (motion, responsive, compat)
- If beat type is known -> look up motion tier from beat-to-motion table
- If archetype is known -> look up motion personality from archetype table
- If compat tier is not set -> default to "broad" (covers 95%+ browsers)
- If section type matches a known layout pattern -> use the per-section-type defaults

### Pipeline Connection

- **Referenced by:** planner agent during `/gen:plan`
- **Referenced by:** builder agent during `/gen:execute` (reads blocks from PLAN.md)
- **Consumed at:** `/gen:plan` workflow step 4 (section plan generation)
- **Feeds into:** quality-gate-v2 hard gates (motion exists, 4-breakpoint responsive, compat tier respected)

---

## Motion Block Template

Every section PLAN.md must include a `motion:` block in this format:

```yaml
motion:
  # Beat tier determines overall motion budget
  beat: "hook"           # One of: hook, tease, reveal, build, peak, breathe, tension, proof, pivot, close
  tier: "heavy"          # Derived from beat (see mapping table below)

  entrance:
    type: "slide-up"     # fade, slide-up, slide-left, slide-right, scale, reveal, clip, blur
    duration: 800        # ms -- governed by archetype personality
    easing: "cubic-bezier(0.16, 1, 0.3, 1)"
    stagger: 120         # ms between child elements
    delay: 0             # ms initial delay

  scroll_trigger:
    type: "parallax"     # parallax, fade-on-scroll, pin, progress, sequence
    intensity: 0.3       # 0-1 scale, archetype-dependent
    trigger_offset: 0.2  # viewport fraction before trigger fires

  interactions:
    hover: "lift"        # lift, glow, scale, tilt, reveal, none
    click: "ripple"      # ripple, press, flash, none
    focus: "ring-expand" # ring-expand, glow, outline, none

  archetype_profile:
    style: "kinetic"     # Matches project archetype
    personality: "bouncy" # From archetype motion personality table
    spring_config:       # Only for spring-based archetypes
      stiffness: 300
      damping: 20
      mass: 1

  reduced_motion:
    strategy: "alternative" # alternative (redesign) or "minimal" (fade only)
    entrance: "fade"
    duration: 400
    scroll_trigger: "none"
```

---

## Beat-to-Motion Tier Mapping

| Beat | Tier | What's Included |
|------|------|----------------|
| **Hook** | Heavy | Cinematic entrance, parallax, particle animation, text reveal, hero-specific choreography |
| **Tease** | Medium | Scroll fade+slide, subtle parallax, icon animation, progressive reveal |
| **Reveal** | Heavy | Dramatic unveil, counters/stat animation, image sequence, split-screen transition |
| **Build** | Medium | Card stagger, progressive disclosure, scroll progress indicator, list animation |
| **Peak** | Maximum | 3D transforms, GSAP timeline, creative tension moment, full choreography budget |
| **Breathe** | Minimal | Gentle fade only, ambient floating motion, no scroll triggers, reduced stagger |
| **Tension** | Heavy | Scale violence, glitch effects, direction break, disorienting transitions |
| **Proof** | Light | Testimonial carousel/fade, logo ticker, stat count-up, subtle card hover |
| **Pivot** | Medium | Transition animation, section morph, color shift, layout reconfiguration |
| **Close** | Medium | CTA pulse/glow, form focus animation, footer reveal, farewell sequence |

### Tier Motion Budgets

| Tier | Max Animations | Max Duration | Scroll Effects | 3D/GSAP |
|------|---------------|-------------|----------------|---------|
| Minimal | 2 | 500ms | None | No |
| Light | 3 | 600ms | 1 subtle | No |
| Medium | 5 | 800ms | 2 | Optional |
| Heavy | 8 | 1200ms | 3+ | Yes |
| Maximum | Unlimited | 2000ms | Unlimited | Required |

---

## Per-Archetype Motion Personality

Each archetype has a distinct motion personality that governs easing, speed, and style:

| Archetype | Personality | Easing Profile | Speed | Signature Motion |
|-----------|------------|----------------|-------|-----------------|
| **Brutalist** | Instant/Snappy | `steps()` or `cubic-bezier(0, 0, 1, 1)` | Fast (200-400ms) | Hard cuts, no transitions, instant state changes |
| **Ethereal** | Slow/Floating | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Slow (800-1500ms) | Drift, float, blur transitions, gentle parallax |
| **Kinetic** | Bouncy/Spring | `spring(300, 20, 1)` | Medium (400-800ms) | Overshoot, rubber-band, physics-based motion |
| **Editorial** | Precise/Measured | `cubic-bezier(0.33, 0, 0.67, 1)` | Medium (500-700ms) | Slide reveals, text unveil, page-turn feel |
| **Neo-Corporate** | Clean/Professional | `cubic-bezier(0.4, 0, 0.2, 1)` | Medium (400-600ms) | Slide-up, fade, scale -- nothing distracting |
| **Organic** | Flowing/Natural | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Medium-Slow (600-1000ms) | Wave, morph, blob animation, growth |
| **Retro-Future** | Mechanical/Digital | `cubic-bezier(0.7, 0, 0.3, 1)` | Fast (300-500ms) | Scan lines, type flicker, pixel assembly |
| **Luxury/Fashion** | Elegant/Languid | `cubic-bezier(0.19, 1, 0.22, 1)` | Slow (700-1200ms) | Parallax image reveals, slow zoom, curtain |
| **Playful/Startup** | Energetic/Fun | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Fast (300-600ms) | Bounce, wiggle, pop, confetti |
| **Data-Dense** | Functional/Quick | `cubic-bezier(0.4, 0, 0.2, 1)` | Fast (200-400ms) | Chart draw, number tick, table sort |
| **Japanese Minimal** | Zen/Deliberate | `cubic-bezier(0.45, 0, 0.55, 1)` | Slow (800-1200ms) | Ink stroke, wipe, fade with stillness |
| **Glassmorphism** | Smooth/Glassy | `cubic-bezier(0.25, 0.8, 0.25, 1)` | Medium (500-800ms) | Blur shift, glass reflection, depth layer |
| **Neon Noir** | Electric/Sharp | `cubic-bezier(0.7, 0, 0.3, 1)` | Fast (200-500ms) | Glow pulse, flicker, neon sign turn-on |
| **Warm Artisan** | Gentle/Handmade | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Medium-Slow (600-900ms) | Hand-drawn reveal, stamp, unfold |
| **Swiss/International** | Precise/Grid | `cubic-bezier(0.33, 0, 0.67, 1)` | Medium (400-700ms) | Grid slide, column reflow, type march |
| **Vaporwave** | Dreamy/Glitchy | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Variable | Glitch, scan, VHS track, chrome reflect |
| **Neubrutalism** | Blunt/Chunky | `steps(4)` or `cubic-bezier(0, 0, 1, 1)` | Fast (200-400ms) | Stamp, drop, offset shadow snap |
| **Dark Academia** | Stately/Measured | `cubic-bezier(0.45, 0, 0.55, 1)` | Medium-Slow (600-1000ms) | Page turn, ink fade, candlelight flicker |
| **AI-Native** | Adaptive/Fluid | `cubic-bezier(0.16, 1, 0.3, 1)` | Medium (400-700ms) | Morph, stream, particle flow, data pulse |

---

## Responsive Block Template

Every section PLAN.md must include a `responsive:` block:

```yaml
responsive:
  mobile_375:
    layout: "stack"          # stack, 1-col, 2-col, hidden
    font_scale: 0.85         # Multiplier applied to type scale
    hidden: ["decorative-bg", "secondary-cta"]  # Elements hidden at this breakpoint
    reorder: ["heading", "image", "body", "cta"]  # Visual order if different from DOM

  tablet_768:
    layout: "2-col"
    font_scale: 0.92
    hidden: ["decorative-bg"]
    reorder: []              # Same as DOM order

  desktop_1024:
    layout: "grid-3"
    font_scale: 1.0
    hidden: []
    reorder: []

  ultrawide_1440:
    layout: "grid-3-wide"
    font_scale: 1.05
    hidden: []
    reorder: []
    max_width: "1400px"      # Content max-width to prevent stretching
```

### Responsive Craft Rules (v2.0 — Anti-Generic)

These rules prevent "desktop but stacked" responsive implementations:

1. **Mobile MUST NOT be "desktop but stacked"** -- Every section MUST have at least ONE mobile-specific design decision (reordered content, different visual hierarchy, touch-specific interaction, or simplified layout that feels designed-for-mobile rather than collapsed-from-desktop).
2. **Tablet is NOT "mobile but wider"** -- Must have unique column decisions. If mobile is single-col and desktop is 3-col, tablet should NOT be 2-col by default -- consider whether a different approach (overlay, sidebar, card grid) better serves the content.
3. **Each breakpoint must have a `design_decision` annotation** in the responsive block explaining WHY this layout was chosen for this width, not just WHAT the layout is. Example: `design_decision: "Stack heading over image because hero image impact is diminished at narrow widths — heading is the hook."
4. **Mobile content priority reordering is mandatory** for all sections with 3+ content elements. The visual order on mobile should prioritize the most impactful content first, not mirror the desktop DOM order.

---

## Per-Section-Type Default Layouts

### Hero Section

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| mobile_375 | Stack: heading -> media -> body -> CTA | Full-bleed media, large heading |
| tablet_768 | Stack or 2-col split | Media can sit beside text |
| desktop_1024 | 2-col or asymmetric split | 60/40 or 50/50 with overlap |
| ultrawide_1440 | Same as desktop, max-width 1400px | Add breathing room on sides |

### Features / Services Grid

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| mobile_375 | 1-col stack, cards full-width | Max 3-4 visible, rest in accordion |
| tablet_768 | 2-col grid | Equal-height cards, consistent gap |
| desktop_1024 | 3-col grid | Icon + title + body + CTA per card |
| ultrawide_1440 | 3-col or 4-col grid | Wider cards, not more columns |

### Testimonials / Social Proof

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| mobile_375 | Carousel (1 visible) or stack | Swipe-enabled on touch |
| tablet_768 | 2-col grid or carousel (2 visible) | Quote cards with avatar |
| desktop_1024 | 3-col grid or carousel (3 visible) | Consider masonry for varied lengths |
| ultrawide_1440 | 3-col grid, wider cards | Avoid 4+ columns for readability |

### Pricing Section

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| mobile_375 | 1-col stack, featured plan first | Tab switcher for monthly/annual |
| tablet_768 | 2-col (if 2 plans) or scroll | Sticky comparison if 3+ plans |
| desktop_1024 | 3-col side-by-side | Featured plan elevated/highlighted |
| ultrawide_1440 | 3-col with generous padding | Max-width prevents stretch |

### Contact / Form Section

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| mobile_375 | 1-col, full-width inputs | Large touch targets (48px min) |
| tablet_768 | 2-col: form + info/map | Side-by-side layout begins |
| desktop_1024 | 2-col with decorative element | Map/image can be larger |
| ultrawide_1440 | Same as desktop, centered | Max-width on form for usability |

### Team / About Grid

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| mobile_375 | 2-col grid (small avatars) | Name + role only, details on tap |
| tablet_768 | 3-col grid | Avatar + name + role + 1-line bio |
| desktop_1024 | 4-col grid or featured layout | Lead member can be larger |
| ultrawide_1440 | 4-col, generous spacing | Hover reveals full bio |

### Stats / Metrics Section

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| mobile_375 | 2-col grid (2x2) | Large numbers, small labels |
| tablet_768 | 4-col row | All stats visible at once |
| desktop_1024 | 4-col with decorative separators | Count-up animation on scroll |
| ultrawide_1440 | Same as desktop | Max-width prevents number stretch |

### CTA / Conversion Section

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| mobile_375 | Stack: heading -> body -> CTA (full width) | CTA is thumb-reachable |
| tablet_768 | Centered stack with max-width | Background treatment visible |
| desktop_1024 | Centered or 2-col (text + CTA) | Decorative elements appear |
| ultrawide_1440 | Same as desktop, wider background | CTA never stretches |

### Footer

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| mobile_375 | Stack: logo -> accordion nav -> social -> legal | Accordion for link groups |
| tablet_768 | 3-col grid: nav groups side by side | Accordion opens to columns |
| desktop_1024 | 4-col: logo+desc, nav1, nav2, newsletter | Full footer layout |
| ultrawide_1440 | Same as desktop, max-width | Centered with edge padding |

---

## Compatibility Block Template

Every section PLAN.md must include a `compatibility:` block:

```yaml
compatibility:
  tier: "broad"           # modern, broad, legacy, maximum
  required_fallbacks:
    - feature: "container-queries"
      fallback: "media-queries with fixed breakpoints"
    - feature: ":has() selector"
      fallback: "JavaScript classList toggle"
    - feature: "oklch() colors"
      fallback: "hsl() equivalents via PostCSS"
    - feature: "subgrid"
      fallback: "explicit grid-template-rows on children"
  polyfills: []           # Only for legacy/maximum tiers
  progressive_enhancement:
    - "WebGL effects: show static image if no WebGL"
    - "View Transitions: standard navigation if unsupported"
```

---

## Per-Tier Feature Availability Matrix

| Feature | Modern | Broad | Legacy | Maximum |
|---------|--------|-------|--------|---------|
| Container queries | Yes | Fallback | No | No |
| `:has()` selector | Yes | Fallback | No | No |
| `oklch()` / `color-mix()` | Yes | Fallback | No | No |
| Subgrid | Yes | Fallback | No | No |
| `@layer` cascade layers | Yes | Yes | No | No |
| CSS nesting | Yes | Yes | No | No |
| `clamp()` / `min()` / `max()` | Yes | Yes | Fallback | No |
| CSS Grid (basic) | Yes | Yes | Yes | Fallback |
| Flexbox (basic) | Yes | Yes | Yes | Yes |
| `position: sticky` | Yes | Yes | Yes | Fallback |
| CSS custom properties | Yes | Yes | Yes | No |
| Intersection Observer | Yes | Yes | Polyfill | Polyfill |
| `scroll-snap` | Yes | Yes | Fallback | No |
| View Transitions API | Yes | No | No | No |
| `@starting-style` | Yes | No | No | No |
| WebGL / Three.js | Yes | Yes | Fallback | No |
| `will-change` | Yes | Yes | Ignored | Ignored |
| `backdrop-filter` | Yes | Fallback | No | No |
| `aspect-ratio` | Yes | Yes | Fallback | No |
| `scroll-timeline` | Yes | No | No | No |

### Tier Definitions

- **Modern**: Latest 2 versions of Chrome, Firefox, Safari, Edge. ~90% global coverage.
- **Broad**: Last 4 versions + Samsung Internet + UC Browser. ~95% coverage. This is the default.
- **Legacy**: IE11 excluded but supports 3+ year old browsers. ~98% coverage.
- **Maximum**: IE11 included. Rarely needed. ~99% coverage.

---

## Prefers-Reduced-Motion Templates

Do NOT simply disable all motion. Each archetype has an alternative reduced-motion design:

| Archetype | Reduced Motion Strategy |
|-----------|------------------------|
| **Brutalist** | Already minimal motion. Remove any scroll effects. Keep instant state changes. |
| **Ethereal** | Replace float/drift with static opacity layers. Keep parallax depth via stacking. |
| **Kinetic** | Replace springs with instant position changes. Keep color transitions. |
| **Editorial** | Replace slide-reveals with immediate display. Keep typographic hierarchy. |
| **Neo-Corporate** | Reduce to fade-only at 300ms. Remove parallax. Keep hover color changes. |
| **Organic** | Replace morph/blob with static shapes. Keep color gradients. |
| **Retro-Future** | Replace flicker/scan with static retro styling. Keep color palette. |
| **Luxury/Fashion** | Replace slow reveals with fade at 400ms. Keep image zoom on hover. |
| **Playful/Startup** | Replace bounce/wiggle with scale(1.02) hover. Keep color vibrancy. |
| **Data-Dense** | Remove chart draw animations. Show final state. Keep sort transitions. |
| **Japanese Minimal** | Replace ink-stroke with immediate display. Enhance stillness. |
| **Glassmorphism** | Remove blur shifts. Keep static glass layers. Reduce to opacity changes. |
| **Neon Noir** | Remove flicker/pulse. Keep static glow via box-shadow. |
| **Warm Artisan** | Replace hand-drawn reveals with fade. Keep warm color transitions. |
| **Swiss/International** | Replace grid animations with instant layout. Keep typographic structure. |
| **Vaporwave** | Remove glitch/VHS. Keep chrome gradients and color scheme. |
| **Neubrutalism** | Already near-instant. Remove any remaining transitions. |
| **Dark Academia** | Replace page-turn with fade. Keep candlelight as static warm tint. |
| **AI-Native** | Replace particle flow with static gradient. Keep data-driven color shifts. |

### Implementation Pattern

```tsx
// In every animated component:
const prefersReducedMotion = useReducedMotion(); // or matchMedia check

const variants = {
  entrance: prefersReducedMotion
    ? { opacity: [0, 1], transition: { duration: 0.3 } }       // Always fade
    : { y: [40, 0], opacity: [0, 1], transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },

  // Archetype-specific reduced alternative (not just "off")
  hover: prefersReducedMotion
    ? { scale: 1.01, transition: { duration: 0.2 } }           // Subtle acknowledgment
    : { y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", transition: { type: "spring" } },
};
```

---

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Complete Section PLAN.md Block

```yaml
# --- Section: Hero ---
beat: "hook"
archetype: "kinetic"

motion:
  beat: "hook"
  tier: "heavy"
  entrance:
    type: "slide-up"
    duration: 800
    easing: "spring(300, 20, 1)"
    stagger: 120
    delay: 0
  scroll_trigger:
    type: "parallax"
    intensity: 0.3
    trigger_offset: 0.2
  interactions:
    hover: "lift"
    click: "ripple"
    focus: "ring-expand"
  archetype_profile:
    style: "kinetic"
    personality: "bouncy"
    spring_config:
      stiffness: 300
      damping: 20
      mass: 1
  reduced_motion:
    strategy: "alternative"
    entrance: "fade"
    duration: 400
    scroll_trigger: "none"

responsive:
  mobile_375:
    layout: "stack"
    font_scale: 0.85
    hidden: ["particle-bg", "floating-shapes"]
    reorder: ["heading", "media", "body", "cta"]
  tablet_768:
    layout: "2-col-split"
    font_scale: 0.92
    hidden: ["floating-shapes"]
    reorder: []
  desktop_1024:
    layout: "asymmetric-60-40"
    font_scale: 1.0
    hidden: []
    reorder: []
  ultrawide_1440:
    layout: "asymmetric-60-40"
    font_scale: 1.05
    hidden: []
    reorder: []
    max_width: "1400px"

compatibility:
  tier: "broad"
  required_fallbacks:
    - feature: "spring() easing"
      fallback: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    - feature: "container-queries"
      fallback: "media-query breakpoints"
  progressive_enhancement:
    - "Particle background: static gradient if no canvas support"
```

#### Pattern: Reduced Motion Alternative (Ethereal Archetype)

```tsx
import { motion, useReducedMotion } from "motion/react";

export function EtherealHero({ title, subtitle, media }) {
  const reduced = useReducedMotion();

  return (
    <section className="relative min-h-screen bg-bg overflow-hidden">
      {/* Parallax layers -- static stacking in reduced motion */}
      <motion.div
        className="absolute inset-0"
        style={reduced ? {} : { y: useScrollY(0.3) }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 to-bg/40" />
        {media}
      </motion.div>

      {/* Content -- fade only in reduced motion, drift in full */}
      <motion.div
        className="relative z-10 flex items-center min-h-screen px-6"
        initial={{ opacity: 0, y: reduced ? 0 : 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced
          ? { duration: 0.3 }
          : { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }
        }
      >
        <h1 className="font-display text-display-xl text-text">{title}</h1>
        <p className="font-body text-body-lg text-muted max-w-prose">{subtitle}</p>
      </motion.div>
    </section>
  );
}
```

### Reference Sites

- **Locomotive** (locomotive.ca) -- Masterclass in scroll-driven motion with archetype-consistent personality across every section
- **Awwwards** (awwwards.com) -- Responsive craft benchmark: every breakpoint feels intentionally designed, not just reflowed
- **Resn** (resn.co.nz) -- Heavy motion tier executed flawlessly: complex 3D and particle work with graceful fallbacks
- **Stripe Press** (press.stripe.com) -- Elegant reduced-motion alternative: beautiful static design that doesn't feel like "motion off"
- **Pentagram** (pentagram.com) -- Per-section layout adaptation: different content types get different responsive strategies

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Baked-In Defaults |
|-----------|---------------------------|
| Motion tokens (8+) | Mapped to entrance.easing, scroll_trigger.intensity, interactions |
| Spacing scale (5 levels) | Governs responsive gap/padding adjustments per breakpoint |
| Type scale (8 levels) | font_scale multipliers applied to type scale at each breakpoint |
| Signature element | Must appear in motion block if section contains it |
| Color tokens | Compat fallbacks for oklch() reference DNA hsl() equivalents |

### Archetype Variants

See the full **Per-Archetype Motion Personality** table above. Every archetype defines:
- Easing profile (the mathematical curve)
- Speed range (fast/medium/slow with ms values)
- Signature motion (the archetype's visual fingerprint in movement)
- Reduced motion strategy (alternative design, not disable)

### Pipeline Stage

- **Input from:** Beat assignment (emotional-arc), archetype selection (design-archetypes), compat tier (PROJECT.md)
- **Output to:** Section PLAN.md blocks consumed by builder agent during `/gen:execute`

### Related Skills

- **emotional-arc** -- Beat type determines motion tier; this skill maps beats to motion budgets
- **design-archetypes** -- Archetype determines motion personality, easing, and reduced-motion strategy
- **quality-gate-v2** -- Hard gates require motion, responsive, and compat compliance; this skill prevents gate failures
- **component-consistency** -- Component dimensions must respect responsive block reflow rules
- **responsive-design** -- Deeper responsive patterns; this skill provides the PLAN.md template structure

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Missing Motion Block

**What goes wrong:** Section PLAN.md has no `motion:` block. Builder improvises animations during execution, resulting in inconsistent easing, timing, and archetype personality. Quality gate hard gate #1 (motion exists) may fail.
**Instead:** Always include the full motion block template. If unsure about specifics, use the beat-to-motion tier defaults and archetype personality table.

### Anti-Pattern: Responsive as Afterthought

**What goes wrong:** PLAN.md describes desktop layout only. Builder adds `@media` queries reactively during build, causing squished mobile layouts (-5 penalty) or horizontal scroll (-5 penalty).
**Instead:** Fill in all 4 breakpoints in the responsive block BEFORE building. Use the per-section-type default layouts table as a starting point.

### Anti-Pattern: Motion Disable Instead of Alternative

**What goes wrong:** `prefers-reduced-motion: reduce` simply sets all durations to 0. Users with motion sensitivity see a static, lifeless page that feels broken.
**Instead:** Design a reduced-motion alternative per archetype. Replace complex motion with subtle fades, keep color transitions, maintain visual personality. The page should still feel designed.

### Anti-Pattern: Compat Tier Mismatch

**What goes wrong:** PLAN.md says "broad" compatibility but builder uses `@starting-style`, `scroll-timeline`, or View Transitions without fallback. Quality gate hard gate #3 fails.
**Instead:** Check the feature availability matrix. If the feature shows "No" for your tier, don't use it. If it shows "Fallback", include the fallback in the compat block.

### Anti-Pattern: Generic Defaults for All Sections

**What goes wrong:** Every section gets the same motion tier (medium), same responsive layout (stack -> 3-col), same compat tier. Sections lose their emotional arc and feel monotonous.
**Instead:** Motion tier varies by beat. A "breathe" section should feel dramatically different from a "peak" section. Use beat-to-motion mapping, not one-size-fits-all.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| breakpoints_defined | 4 | 4 | count | HARD -- all 4 breakpoints required |
| motion_block_present | 1 | 1 | boolean | HARD -- every section PLAN.md must have motion block |
| compat_block_present | 1 | 1 | boolean | HARD -- every section PLAN.md must have compat block |
| responsive_block_present | 1 | 1 | boolean | HARD -- every section PLAN.md must have responsive block |
| entrance_duration (minimal tier) | 100 | 500 | ms | SOFT -- minimal beat should stay brief |
| entrance_duration (heavy tier) | 400 | 1200 | ms | SOFT -- heavy beat needs presence |
| entrance_duration (maximum tier) | 600 | 2000 | ms | SOFT -- peak beat gets full budget |
| stagger_delay | 50 | 200 | ms | SOFT -- too fast is invisible, too slow is tedious |
| font_scale_mobile | 0.75 | 0.95 | multiplier | SOFT -- mobile type must shrink but stay readable |
| font_scale_ultrawide | 1.0 | 1.15 | multiplier | SOFT -- ultrawide type grows slightly |
