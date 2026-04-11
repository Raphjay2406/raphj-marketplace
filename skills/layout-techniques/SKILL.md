---
name: layout-techniques
description: "Advanced layout craft: asymmetric grids, whitespace composition, bento grid implementation, grid-breaking/overflow, container query patterns, viewport units (dvh/svh/lvh), CSS subgrid, scroll-snap coordination. Transforms 'template layouts' into award-winning compositions."
tier: domain
triggers: "asymmetric layout, bento grid, grid breaking, whitespace, container query, subgrid, scroll snap, viewport units, dvh, layout composition, off-grid, bleeding, overlap"
version: "2.3.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Every section build** where the layout pattern from PLAN.md needs to go beyond basic grid
- **HOOK and PEAK beats** where layout IS the creative expression
- **Asymmetric compositions** where standard 50/50 or 3-col grids feel template-like
- **Bento/mosaic layouts** that need responsive cell sizing
- **Full-bleed elements** that break out of content containers
- **Container-query-responsive components** that adapt to their container, not the viewport

### When NOT to Use

- **Data tables and forms** -- Content structure dictates layout, not creative composition
- **BREATHE beats** -- Simplicity and restraint; use centered single-column
- **Mobile-first base styles** -- Mobile is naturally single-column; asymmetry starts at tablet

### Pipeline Connection

- **Referenced by:** builder agents for every section build
- **Consumed at:** Wave 2+ section construction
- **Input from:** PLAN.md layout assignment (from compositional-diversity pattern taxonomy)

---

## Layer 2: Implementation Reference

### 1. Asymmetric Grid Techniques

**60/40 Split with Offset:**
```tsx
<section className="grid grid-cols-12 gap-6 items-center min-h-screen px-6 lg:px-12">
  {/* Content column: spans 7 of 12 columns */}
  <div className="col-span-12 lg:col-span-7 lg:col-start-1">
    <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95]">
      {heading}
    </h2>
    <p className="mt-6 max-w-[55ch] text-body-lg text-[hsl(var(--color-muted))]">
      {description}
    </p>
  </div>
  {/* Image column: spans 5, offset with negative margin to break grid */}
  <div className="col-span-12 lg:col-span-5 lg:-mr-12 relative">
    <Image src={image} alt={alt} className="w-full h-auto rounded-lg" />
  </div>
</section>
```

**70/30 with Vertical Offset (Elements not aligned to same baseline):**
```tsx
<section className="grid grid-cols-12 gap-8 px-6 lg:px-12 py-24">
  <div className="col-span-12 lg:col-span-8 lg:pt-24"> {/* Left: pushed down */}
    <h2 className="font-display text-hero">{heading}</h2>
  </div>
  <div className="col-span-12 lg:col-span-4 lg:-mt-12"> {/* Right: pulled up */}
    <p className="text-body text-[hsl(var(--color-muted))]">{subtext}</p>
  </div>
</section>
```

### 2. Grid-Breaking / Overflow Techniques

**Bleed Past Container:**
```tsx
{/* Content stays in max-width container, image bleeds to edge */}
<section className="max-w-7xl mx-auto px-6 relative">
  <div className="grid grid-cols-12 gap-8">
    <div className="col-span-12 lg:col-span-5">
      <h2>{heading}</h2>
    </div>
    {/* Image breaks out of container to viewport edge */}
    <div className="col-span-12 lg:col-span-7 lg:absolute lg:right-[calc(-50vw+50%)] lg:w-[calc(50vw-2rem)]">
      <Image src={image} alt={alt} className="w-full h-[500px] object-cover" />
    </div>
  </div>
</section>
```

**Overlapping Elements with Z-Index:**
```tsx
<section className="relative py-32">
  {/* Background text (decorative, behind content) */}
  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    font-display text-[clamp(8rem,20vw,20rem)] text-[hsl(var(--color-surface))]
    select-none pointer-events-none z-0" aria-hidden="true">
    {decorativeText}
  </span>
  {/* Content (in front) */}
  <div className="relative z-10 max-w-3xl mx-auto text-center">
    <h2 className="font-display text-h1">{heading}</h2>
  </div>
</section>
```

### 3. Bento Grid Implementation

```tsx
<section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-24 max-w-7xl mx-auto">
  {/* Hero card: spans 2x2 */}
  <div className="col-span-2 row-span-2 rounded-2xl bg-[hsl(var(--color-surface))] p-8
    flex flex-col justify-end min-h-[400px] relative overflow-hidden group">
    <Image src={hero} alt="" fill className="object-cover group-hover:scale-105
      transition-transform duration-700" />
    <div className="relative z-10">
      <h3 className="font-display text-h2 text-white">{title}</h3>
    </div>
  </div>

  {/* Small cards: 1x1 each */}
  {items.map((item, i) => (
    <div key={i} className="aspect-square rounded-2xl bg-[hsl(var(--color-surface))] p-6
      flex flex-col justify-between hover:bg-[hsl(var(--color-primary)/0.05)]
      transition-colors duration-300">
      <item.icon className="size-8 text-[hsl(var(--color-primary))]" />
      <div>
        <h4 className="font-display text-h4">{item.title}</h4>
        <p className="text-small text-[hsl(var(--color-muted))] mt-1">{item.desc}</p>
      </div>
    </div>
  ))}

  {/* Wide card: spans 2x1 */}
  <div className="col-span-2 rounded-2xl bg-[hsl(var(--color-primary))] p-8
    text-[hsl(var(--color-bg))]">
    <h3 className="font-display text-h3">{cta.title}</h3>
    <p className="mt-2 text-body opacity-80">{cta.desc}</p>
  </div>
</section>
```

**Responsive Bento (4-col → 2-col → 1-col):**
```css
.bento-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, 1fr);     /* Mobile: single column */
}
@media (min-width: 640px) {
  .bento-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: dense;                    /* Fill gaps automatically */
  }
  .bento-hero { grid-column: span 2; grid-row: span 2; }
  .bento-wide { grid-column: span 2; }
  .bento-tall { grid-row: span 2; }
}
```

### 4. Whitespace Composition

**Beat-Driven Spacing Strategy:**

| Beat | Section Padding | Content Width | Whitespace Feel |
|------|----------------|---------------|-----------------|
| HOOK | `py-0` (full viewport) | `max-w-7xl` | Dramatic — content floats in void |
| BUILD | `py-16 lg:py-24` | `max-w-6xl` | Functional — compact, information-dense |
| PEAK | `py-24 lg:py-40` | `max-w-5xl` | Generous — content breathes |
| BREATHE | `py-32 lg:py-48` | `max-w-3xl` | Maximum — almost empty, restful |
| CLOSE | `py-20 lg:py-32` | `max-w-4xl` | Purposeful — focused on CTA |

**Empty Column Technique (Whitespace as Grid Member):**
```tsx
<section className="grid grid-cols-12 gap-8 py-32">
  {/* Columns 1-2: intentionally empty (whitespace) */}
  <div className="hidden lg:block col-span-2" aria-hidden="true" />
  {/* Columns 3-8: content */}
  <div className="col-span-12 lg:col-span-6">
    <h2 className="font-display text-h1">{heading}</h2>
    <p className="mt-8 max-w-[50ch]">{body}</p>
  </div>
  {/* Columns 9-12: intentionally empty (whitespace) */}
  <div className="hidden lg:block col-span-4" aria-hidden="true" />
</section>
```

### 5. Container Queries

```tsx
{/* Container-responsive card that adapts to ITS container, not viewport */}
<div className="@container">
  <article className="flex flex-col @md:flex-row @md:items-center gap-6 p-6
    rounded-xl bg-[hsl(var(--color-surface))]">
    <Image src={thumb} alt={alt}
      className="w-full @md:w-48 @md:h-48 rounded-lg object-cover aspect-video @md:aspect-square" />
    <div className="flex-1">
      <h3 className="font-display text-h3 @lg:text-h2">{title}</h3>
      <p className="mt-2 text-body text-[hsl(var(--color-muted))] line-clamp-2 @lg:line-clamp-none">
        {description}
      </p>
      <div className="hidden @lg:flex gap-2 mt-4">
        {tags.map(t => <Badge key={t}>{t}</Badge>)}
      </div>
    </div>
  </article>
</div>
```

### 6. Viewport Units (dvh, svh, lvh)

```css
/* Hero section: always exactly one screen, accounting for mobile address bar */
.hero {
  min-height: 100dvh;   /* Dynamic viewport height — adjusts when address bar hides */
  /* Fallback for browsers without dvh support */
  min-height: 100vh;
  min-height: 100dvh;
}

/* Sticky sidebar: safe viewport height (excludes dynamic elements) */
.sidebar {
  height: 100svh;
  position: sticky;
  top: 0;
}
```

### 7. CSS Subgrid

```css
/* Outer grid defines columns; inner grid inherits them */
.page-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
}

.section-content {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;  /* Inherit parent's 12 columns */
}

.section-content .heading { grid-column: 1 / 8; }
.section-content .sidebar { grid-column: 9 / -1; }
```

### 8. Scroll-Snap Sections

```css
/* Full-page scroll snapping for storytelling layouts */
.scroll-container {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  height: 100dvh;
}
.scroll-section {
  scroll-snap-align: start;
  min-height: 100dvh;
  scroll-snap-stop: always;  /* Prevent skipping sections */
}

/* Horizontal scroll-snap for carousels */
.carousel {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  display: flex;
  gap: 1rem;
  scroll-padding-inline: 1rem;
}
.carousel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
  width: 80%;
}
```

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Layout Usage |
|-----------|-------------|
| `--space-*` | Section padding, element gaps, whitespace composition |
| `--radius-*` | Card and element border-radius in bento grids |
| `--shadow-*` | Depth layering in overlapping compositions |
| Archetype personality | Determines asymmetry level, whitespace density, grid-breaking aggressiveness |

### Per-Archetype Layout Personality

| Archetype | Asymmetry | Whitespace | Grid-Breaking | Bento |
|-----------|-----------|------------|---------------|-------|
| Brutalist | Extreme (80/20) | Minimal | Aggressive overflow | Angular, no radius |
| Ethereal | Moderate (60/40) | Maximum | Soft bleeds | Rounded, airy |
| Kinetic | Dynamic (varies) | Medium | Animated breaks | Interactive tiles |
| Japanese Minimal | Subtle (55/45) | Maximum | Never | Sparse, restrained |
| Neo-Corporate | Balanced (55/45) | Medium | Minimal | Clean, professional |
| Data-Dense | Grid-strict | Minimal | Never | Dense, information-packed |
| Luxury/Fashion | Dramatic (70/30) | Generous | Editorial bleeds | Oversized hero card |

### Related Skills

- **compositional-diversity** -- Defines the 18-pattern taxonomy; this skill teaches HOW to implement them
- **responsive-design** -- Defines breakpoint system; this skill adds container queries and viewport units
- **baked-in-defaults** -- Defines 4-breakpoint requirement; this skill ensures each breakpoint is a real design

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Centered 3-Column Grid for Everything
**What goes wrong:** Every section is `grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto`. The page looks like it was assembled from template blocks.
**Instead:** Vary column spans (12-col grid with 7/5, 8/4, 5/7 splits), offset elements vertically, break one element out of the container per section.

### Anti-Pattern: Whitespace as Afterthought
**What goes wrong:** Same `py-16` on every section. No rhythm, no breathing room variation. Page feels monotone.
**Instead:** Map spacing to beat type: HOOK = viewport height, BUILD = compact, BREATHE = generous, PEAK = dramatic.

### Anti-Pattern: Bento Without Dense Packing
**What goes wrong:** Bento grid has visible gaps where spanning cells don't align. Layout looks broken on some screen sizes.
**Instead:** Always use `grid-auto-flow: dense` on bento layouts. Define explicit `grid-template-areas` for the hero composition. Test at all 4 breakpoints.

### Anti-Pattern: Container Queries on Everything
**What goes wrong:** Every element uses `@container` when a simple responsive class would suffice. Adds complexity without benefit.
**Instead:** Use container queries ONLY for components that appear in different-width containers (sidebar vs main, modal vs page, card in 2-col vs 4-col grid).

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Distinct layout patterns per page | 3 | -- | patterns | HARD -- compositional-diversity enforces |
| Grid columns (base system) | 12 | 12 | columns | SOFT -- 12-col grid is standard |
| Asymmetric splits | 1 | -- | per page | SOFT -- at least one section should break symmetry |
| Beat-matched spacing | 1 | 1 | boolean | HARD -- section padding must match beat type |
| Container queries for shared components | 1 | -- | per component | SOFT -- use when component appears in multiple contexts |
