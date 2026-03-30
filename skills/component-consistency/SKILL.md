---
name: "component-consistency"
description: "Component registry enforcement rules. DESIGN-SYSTEM.md format, registered component types and variants, CSS patterns for equal-height cards, and cross-section audit process."
tier: "core"
triggers: "component design, card grid, button style, design system, consistency"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **During plan-dev** -- Establish the component registry in DESIGN-SYSTEM.md before any building begins
- **During execute** -- Builders reference registered variants when implementing any component; never ad-hoc
- **During iterate** -- Cross-section audit catches dimension mismatches introduced during building
- **Quality gate check** -- Feeds into quality-gate-v2 hard gate #4 (component registry compliance) and Integration Quality criterion 2
- **New component needed** -- Builder encounters a pattern not in the registry; follows proposal process

### When NOT to Use

- **Page layout decisions** -- Use baked-in-defaults for responsive layout; this skill is about component-level dimensions
- **Creative direction** -- Use design-archetypes for visual personality; this skill enforces consistency, not style
- **Color/typography choices** -- Use design-dna; this skill references DNA tokens but doesn't define them

### Decision Tree

- If building a card, button, input, badge, avatar, nav item, or section heading -> look up the registered variant
- If the registered variant doesn't fit -> propose a NEW variant (don't tweak the existing one)
- If the component type isn't in the registry -> follow the component proposal process
- If auditing a completed section -> run the cross-section audit process
- If dimensions mismatch between sections -> generate CONSISTENCY-FIX.md

### Pipeline Connection

- **Referenced by:** builder agent during `/modulo:execute` (component dimension lookup)
- **Referenced by:** quality-reviewer agent during quality audit (cross-section check)
- **Consumed at:** `/modulo:plan-dev` workflow step 3 (DESIGN-SYSTEM.md generation)
- **Consumed at:** `/modulo:iterate` workflow step 2 (consistency audit)

---

## DESIGN-SYSTEM.md Format

The component registry lives in `.planning/modulo/DESIGN-SYSTEM.md` and uses this structure:

```yaml
# Component Registry
# Generated during plan-dev, updated during execute via proposal process
# All dimensions use the project's spacing scale and DNA tokens

project: "Project Name"
archetype: "kinetic"
last_updated: "2026-03-30"

components:
  card:
    variants:
      default:
        min_height: "280px"
        padding: "var(--spacing-4)"        # 24px
        radius: "var(--radius-lg)"         # 16px
        shadow: "var(--shadow-md)"
        gap: "var(--spacing-3)"            # 16px
        image_aspect: "16/9"
        hover: "lift -8px + shadow-lg"
      compact:
        min_height: "180px"
        padding: "var(--spacing-3)"
        radius: "var(--radius-md)"
        shadow: "var(--shadow-sm)"
        gap: "var(--spacing-2)"
        image_aspect: "4/3"
        hover: "lift -4px + shadow-md"
      feature:
        min_height: "360px"
        padding: "var(--spacing-5)"
        radius: "var(--radius-xl)"
        shadow: "var(--shadow-lg)"
        gap: "var(--spacing-4)"
        image_aspect: "3/2"
        hover: "scale 1.02 + shadow-xl"

  button:
    variants:
      primary:
        height: "48px"
        padding_x: "var(--spacing-4)"
        radius: "var(--radius-md)"
        font_size: "var(--text-sm)"
        font_weight: "600"
        min_width: "120px"
      secondary:
        height: "48px"
        padding_x: "var(--spacing-4)"
        radius: "var(--radius-md)"
        font_size: "var(--text-sm)"
        font_weight: "500"
        min_width: "120px"
      ghost:
        height: "40px"
        padding_x: "var(--spacing-3)"
        radius: "var(--radius-sm)"
        font_size: "var(--text-sm)"
        font_weight: "500"
        min_width: "auto"

  section_heading:
    variants:
      default:
        tag_size: "var(--text-xs)"
        tag_weight: "600"
        tag_transform: "uppercase"
        tag_tracking: "0.1em"
        heading_size: "var(--text-display-md)"
        heading_weight: "700"
        desc_size: "var(--text-body-lg)"
        desc_max_width: "640px"
        gap: "var(--spacing-3)"
        margin_bottom: "var(--spacing-6)"

  badge:
    variants:
      default:
        height: "28px"
        padding_x: "var(--spacing-2)"
        radius: "var(--radius-full)"
        font_size: "var(--text-xs)"
        font_weight: "500"

  input:
    variants:
      default:
        height: "48px"
        padding_x: "var(--spacing-3)"
        radius: "var(--radius-md)"
        border: "1px solid var(--border)"
        font_size: "var(--text-sm)"
        focus_ring: "0 0 0 3px var(--primary / 0.2)"
      large:
        height: "56px"
        padding_x: "var(--spacing-4)"
        radius: "var(--radius-md)"
        border: "1px solid var(--border)"
        font_size: "var(--text-base)"
        focus_ring: "0 0 0 3px var(--primary / 0.2)"

  avatar:
    variants:
      sm:
        size: "32px"
        radius: "var(--radius-full)"
      md:
        size: "48px"
        radius: "var(--radius-full)"
      lg:
        size: "72px"
        radius: "var(--radius-full)"

  nav_item:
    variants:
      default:
        height: "40px"
        padding: "var(--spacing-2) var(--spacing-3)"
        font_size: "var(--text-sm)"
        font_weight: "500"
        active_indicator: "2px bottom border var(--primary)"
```

---

## The Golden Rule

> **Same component type = same registered variant dimensions everywhere.**
> **Different needs = different variant, never ad-hoc tweaks.**

This means:
- Every `card.default` in the project has identical min-height, padding, radius, shadow, and gap
- If a section needs a smaller card, it uses `card.compact` -- it does NOT set `padding: 12px` on a default card
- If no existing variant fits, the builder proposes a new named variant through the proposal process
- Ad-hoc dimension overrides (e.g., `className="p-3"` on a `card.default` that should be `p-6`) are treated as defects

---

## CSS Enforcement Patterns

### Equal-Height Cards

The most common consistency failure: cards in a grid have different heights because content varies.

```css
/* Grid container: equal-height columns */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-4);
}

/* Card: flex column for internal layout */
.card {
  display: flex;
  flex-direction: column;
  min-height: 280px;              /* From registry: card.default.min_height */
  padding: var(--spacing-4);      /* From registry: card.default.padding */
  border-radius: var(--radius-lg); /* From registry: card.default.radius */
  box-shadow: var(--shadow-md);   /* From registry: card.default.shadow */
}

/* Card image: fixed aspect ratio */
.card__image {
  aspect-ratio: 16/9;            /* From registry: card.default.image_aspect */
  object-fit: cover;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

/* Card body: grows to fill space */
.card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);         /* From registry: card.default.gap */
}

/* Card footer: pushed to bottom */
.card__footer {
  margin-top: auto;              /* KEY: pushes footer down regardless of body length */
}
```

```tsx
// TSX implementation
export function Card({ image, title, body, footer, variant = "default" }) {
  // variant dimensions come from registry -- never hardcoded
  return (
    <div className="card">
      {image && (
        <img src={image} alt="" className="card__image" />
      )}
      <div className="card__body">
        <h3 className="font-display text-heading-sm">{title}</h3>
        <p className="text-body-sm text-muted">{body}</p>
        {footer && (
          <div className="card__footer">{footer}</div>
        )}
      </div>
    </div>
  );
}
```

### Content Truncation

When card content varies in length, enforce visual consistency:

```css
/* Title: max 2 lines */
.card__title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;             /* 2 lines x 1.4 line-height */
}

/* Description: max 3 lines */
.card__desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 4.2em;             /* 3 lines x 1.4 line-height */
  flex: 1;                       /* Takes remaining space */
}
```

### Consistent Grid Gaps

All grids in the project should use spacing scale tokens, never arbitrary values:

```css
/* Correct: spacing scale token */
.grid { gap: var(--spacing-4); }      /* 24px from DNA */

/* WRONG: arbitrary value */
.grid { gap: 20px; }                  /* Not on spacing scale */
.grid { gap: 1.25rem; }              /* Not a token */
```

---

## Cross-Section Audit Process

Run this audit during `/modulo:iterate` or post-build quality review:

### Step 1: Extract All Instances

For each registered component type, find every instance across all sections:

```
Component: card
  Section: features   -> variant: default, padding: var(--spacing-4), radius: var(--radius-lg) ✓
  Section: pricing    -> variant: default, padding: 16px, radius: 12px                        ✗ MISMATCH
  Section: team       -> variant: compact, padding: var(--spacing-3), radius: var(--radius-md) ✓
  Section: blog       -> variant: default, padding: var(--spacing-4), radius: var(--radius-lg) ✓
```

### Step 2: Compare Against Registry

For each instance, check:
- [ ] Variant name matches a registered variant
- [ ] min-height matches registry
- [ ] padding matches registry
- [ ] radius matches registry
- [ ] shadow matches registry
- [ ] gap matches registry
- [ ] image aspect-ratio matches registry (if applicable)
- [ ] hover behavior matches registry

### Step 3: Flag Mismatches

Any mismatch generates an entry in CONSISTENCY-FIX.md (format below).

### Step 4: Verify Grid Consistency

- [ ] All grids using the same component type use the same gap
- [ ] Equal-height pattern is applied (grid + flex + min-height + auto margin)
- [ ] No ad-hoc width/height overrides on registered components

---

## CONSISTENCY-FIX.md Format

Generated by the audit process, consumed by the builder during fixes:

```markdown
# Consistency Fixes

Generated: 2026-03-30
Audit scope: All sections

## Mismatches Found

### Fix 1: card.default padding mismatch
- **Component:** card
- **Variant:** default
- **Section:** pricing
- **Property:** padding
- **Expected:** `var(--spacing-4)` (24px)
- **Actual:** `16px` (hardcoded)
- **Fix:** Replace `p-4` with `p-[var(--spacing-4)]` or use the shared Card component

### Fix 2: button.primary radius mismatch
- **Component:** button
- **Variant:** primary
- **Section:** hero
- **Property:** radius
- **Expected:** `var(--radius-md)` (12px)
- **Actual:** `rounded-full` (9999px)
- **Fix:** Use registered radius. If pill shape is desired, propose `button.pill` variant.

### Fix 3: section_heading gap inconsistency
- **Component:** section_heading
- **Variant:** default
- **Section:** testimonials
- **Property:** gap (between tag and heading)
- **Expected:** `var(--spacing-3)` (16px)
- **Actual:** `var(--spacing-2)` (8px)
- **Fix:** Apply consistent gap from registry

## Summary
- **Total components audited:** 47
- **Mismatches found:** 3
- **Components compliant:** 44 (93.6%)
```

---

## Component Proposal Process

When a builder needs a component variant that doesn't exist in the registry:

### Step 1: Document in SUMMARY.md

The builder adds a proposal to their section SUMMARY.md:

```yaml
component_proposals:
  - type: "card"
    variant_name: "testimonial"
    reason: "Testimonial cards need avatar + quote + attribution, different from default card"
    dimensions:
      min_height: "200px"
      padding: "var(--spacing-4)"
      radius: "var(--radius-lg)"
      shadow: "var(--shadow-sm)"
      gap: "var(--spacing-3)"
      image_aspect: null           # No image, uses avatar instead
      hover: "border-primary"
    relationship: "Sibling to card.default -- same radius/padding, different min-height and hover"
```

### Step 2: Orchestrator Review

The orchestrator (or quality reviewer) checks:
- [ ] Is this genuinely different from existing variants, or can an existing variant work?
- [ ] Does it follow the same spacing scale and token system?
- [ ] Is the naming clear and consistent with existing variant names?
- [ ] Will it be used in 2+ sections (justify registry addition)?

### Step 3: Registry Update

If approved, the variant is added to DESIGN-SYSTEM.md:

```yaml
card:
  variants:
    default: { ... }
    compact: { ... }
    feature: { ... }
    testimonial:                    # NEW
      min_height: "200px"
      padding: "var(--spacing-4)"
      radius: "var(--radius-lg)"
      shadow: "var(--shadow-sm)"
      gap: "var(--spacing-3)"
      image_aspect: null
      hover: "border-primary"
```

### Step 4: Retroactive Check

After adding a new variant, check if any existing sections should be using it instead of ad-hoc overrides.

---

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Shared Component with Registry-Driven Variants

```tsx
import { cva, type VariantProps } from "class-variance-authority";

// Variants map directly to DESIGN-SYSTEM.md registry entries
const cardVariants = cva(
  "flex flex-col overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "min-h-[280px] p-6 rounded-2xl shadow-md gap-4",
        compact: "min-h-[180px] p-4 rounded-xl shadow-sm gap-3",
        feature: "min-h-[360px] p-8 rounded-3xl shadow-lg gap-6",
        testimonial: "min-h-[200px] p-6 rounded-2xl shadow-sm gap-4",
      },
      hover: {
        lift: "hover:-translate-y-2 hover:shadow-lg",
        "lift-sm": "hover:-translate-y-1 hover:shadow-md",
        scale: "hover:scale-[1.02] hover:shadow-xl",
        border: "hover:border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
    },
  }
);

type CardProps = VariantProps<typeof cardVariants> & {
  children: React.ReactNode;
};

export function Card({ variant, hover, children }: CardProps) {
  return (
    <div className={cardVariants({ variant, hover })}>
      {children}
    </div>
  );
}
```

#### Pattern: Consistent Grid Container

```tsx
// Shared grid component ensures consistent gaps across all sections
const gridVariants = cva("grid w-full", {
  variants: {
    cols: {
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    },
    gap: {
      default: "gap-[var(--spacing-4)]",
      tight: "gap-[var(--spacing-3)]",
      wide: "gap-[var(--spacing-5)]",
    },
  },
  defaultVariants: {
    cols: 3,
    gap: "default",
  },
});
```

### Reference Sites

- **Linear** (linear.app) -- Every card, button, and input is pixel-identical across the entire app. Zero ad-hoc overrides.
- **Vercel** (vercel.com) -- Component registry visible in the consistency: same card treatment from dashboard to marketing site.
- **Raycast** (raycast.com) -- Design system discipline: components are clearly variants, not one-offs.
- **Figma** (figma.com) -- Component structure in UI mirrors a well-organized design system.

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Component Consistency |
|-----------|-------------------------------|
| Spacing scale (5 levels) | All component padding, gap, and margin values reference spacing tokens |
| Radius tokens | Component border-radius values from DNA radius scale |
| Shadow tokens | Component shadow values from DNA shadow scale |
| Color tokens | Component borders, backgrounds, hover states use semantic tokens |
| Type scale (8 levels) | Component font-size values reference type scale |

### Archetype Variants

| Archetype | Component Adaptation |
|-----------|---------------------|
| Brutalist | No radius, hard shadows (offset), thick borders, no hover transitions |
| Ethereal | Large radius, no shadows (glass/blur instead), thin borders, slow hover |
| Kinetic | Medium radius, bouncy hover (spring), medium shadows, scale on interact |
| Editorial | Small radius, subtle shadows, hairline borders, slide hover |
| Glassmorphism | Large radius, no box-shadow (backdrop-blur), glass borders, blur hover |
| Neubrutalism | No radius, hard offset shadows, thick black borders, stamp hover |
| Japanese Minimal | No radius or large radius, no shadows, invisible borders, fade hover |

### Pipeline Stage

- **Input from:** Design DNA tokens, archetype selection, section PLAN.md definitions
- **Output to:** DESIGN-SYSTEM.md (component registry), CONSISTENCY-FIX.md (audit results)

### Related Skills

- **design-dna** -- Provides the token system that component dimensions reference
- **baked-in-defaults** -- Responsive blocks determine how component layouts reflow at breakpoints
- **quality-gate-v2** -- Hard gate #4 (registry compliance) and Integration Quality criterion 2 depend on this skill
- **anti-slop-gate** -- Component mismatch penalty (-4) references this skill's audit output

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Ad-Hoc Dimension Overrides

**What goes wrong:** Builder uses `card.default` but adds `className="p-3 rounded-lg"` because "this section needs smaller cards." Result: same component type with different dimensions across sections. Quality gate penalty: -4 per mismatch.
**Instead:** If smaller cards are needed, use `card.compact`. If neither variant fits, propose a new variant through the proposal process. Never override registered dimensions inline.

### Anti-Pattern: Unregistered Components

**What goes wrong:** Builder creates a testimonial card with custom dimensions not in the registry. Another builder later creates a different testimonial card. Two different-looking components serve the same purpose.
**Instead:** Every component must be registered before use. If the type doesn't exist, follow the proposal process. The registry is the single source of truth.

### Anti-Pattern: Inconsistent Grid Gaps

**What goes wrong:** Features section uses `gap-6`, testimonials use `gap-8`, pricing uses `gap-5`. The page feels subtly wrong but it's hard to pinpoint why.
**Instead:** Grid gaps come from the spacing scale and should be consistent for the same grid type. Card grids get `var(--spacing-4)`, content grids get `var(--spacing-5)`, etc. Define gap variants in the grid component.

### Anti-Pattern: Height Mismatch in Card Grids

**What goes wrong:** Cards in a grid have different heights because some have images, some don't, body text varies in length. The grid looks ragged and unprofessional.
**Instead:** Apply the equal-height pattern: grid container + flex column cards + min-height + flex:1 body + margin-top:auto footer. Truncate content with line-clamp if necessary. Every card in a row must be the same height.

### Anti-Pattern: Design System Drift

**What goes wrong:** DESIGN-SYSTEM.md is created during plan-dev but never updated. Builders add new patterns that aren't registered. By project end, the registry describes 30% of actual components.
**Instead:** Every new component variant goes through the proposal process. Orchestrator reviews proposals between waves. Cross-section audit runs at wave completion to catch drift early.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| registry_compliance | 100 | 100 | % | HARD -- all component instances must match registry |
| card_min_height (default) | 280 | 280 | px | HARD -- from registry |
| card_min_height (compact) | 180 | 180 | px | HARD -- from registry |
| button_height (primary) | 48 | 48 | px | HARD -- from registry |
| button_height (ghost) | 40 | 40 | px | HARD -- from registry |
| input_height (default) | 48 | 48 | px | HARD -- from registry |
| avatar_size (sm) | 32 | 32 | px | HARD -- from registry |
| avatar_size (md) | 48 | 48 | px | HARD -- from registry |
| avatar_size (lg) | 72 | 72 | px | HARD -- from registry |
| grid_gap_variance | 0 | 0 | tokens | HARD -- same grid type = same gap token |
| max_unregistered_components | 0 | 0 | count | HARD -- all components must be registered |
