---
name: plan-format
description: "PLAN.md format reference for Modulo section plans. Complete frontmatter specification (wave, depends_on, must_haves, autonomous, files_modified), body sections (objective, context, tasks, verification, success_criteria), task types, and SUMMARY.md format."
---

Use this skill when creating, reading, or modifying section PLAN.md files, understanding the plan format, or working with must_haves. Triggers on: plan format, PLAN.md, section plan, frontmatter, must_haves, task types, checkpoint, plan structure, SUMMARY.md format.

You are a format expert for Modulo section plans. You know every field, every task type, and every convention.

## Complete PLAN.md Format

### Frontmatter (YAML)

```yaml
---
section: XX-name              # Section number and slug (e.g., 02-hero, 00-shared)
wave: 2                       # Wave number for execution order
depends_on: [00-shared]       # List of section names this depends on
files_modified:               # Exact file paths to create or modify
  - src/components/sections/hero.tsx
  - src/components/sections/hero/hero-cta.tsx
autonomous: true              # Whether builder can execute without constant supervision
type: section                 # Plan type: section | iteration | bugfix | gap-fix
must_haves:
  truths:                     # Assertions that MUST be true when section is complete
    - "Section renders with all specified elements"
    - "Responsive at 375/768/1024/1440px breakpoints"
    - "Scroll-triggered entrance animation with stagger"
    - "All interactive elements have hover/focus states"
  artifacts:                  # Files that MUST exist and be non-empty
    - src/components/sections/hero.tsx
  key_links:                  # Reference files the builder should read
    - BRAINSTORM.md
    - 00-shared/PLAN.md
---
```

### Frontmatter Field Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `section` | Yes | string | Section identifier: `XX-name` format |
| `wave` | Yes | number | Wave number (0 = scaffold, 1 = shared UI, 2+ = sections) |
| `depends_on` | Yes | string[] | Section names this depends on (empty `[]` for wave 0) |
| `files_modified` | Yes | string[] | Exact file paths to create/modify |
| `autonomous` | Yes | boolean | Whether builder can run without supervision |
| `type` | No | string | Plan type: `section` (default), `iteration`, `bugfix`, `gap-fix` |
| `must_haves.truths` | Yes | string[] | Verifiable assertions about the completed section |
| `must_haves.artifacts` | Yes | string[] | Files that must exist and be non-empty |
| `must_haves.key_links` | No | string[] | Reference files for the builder |

### Body Sections

The body uses XML-style tags for structure:

#### `<objective>`
One-paragraph statement of what to build and why.

```markdown
<objective>
Build the hero section that creates a striking first impression with a gradient mesh background,
bold typography with the Space Grotesk display font, and a scroll-triggered entrance animation,
following the "Midnight Luxe" creative direction.
</objective>
```

#### `<context>`
Key information the builder needs to reference.

```markdown
<context>
- Design direction: Midnight Luxe — dark surfaces, gold accents, glass morphism depth
- Color tokens: --bg-primary: #0a0a0f, --accent: #c9a55c, --surface: #1a1a2e
- Typography: Space Grotesk (display, tight tracking), Inter (body)
- Animation: Framer Motion with stagger entrance, parallax on scroll
- Dependencies: imports SectionWrapper and GradientText from 00-shared
</context>
```

#### `<tasks>`
Ordered list of tasks with type prefixes. Tasks execute sequentially.

```markdown
<tasks>
- [auto] Create hero section container with full-viewport height and CSS grid layout
- [auto] Build gradient mesh background using CSS radial-gradient layers
- [auto] Add headline with GradientText component and Space Grotesk at 4xl/5xl/6xl responsive sizes
- [auto] Build CTA button group with primary (gold accent) and secondary (ghost) variants
- [auto] Implement scroll-triggered entrance animation with 0.1s stagger between elements
- [auto] Add responsive breakpoints: stack on mobile, side-by-side on desktop
- [auto] Add hover states: button glow, subtle text color shift
- [checkpoint:human-verify] Review hero section appearance, animation timing, and responsive behavior
</tasks>
```

#### `<verification>`
Specific checks to run after implementation.

```markdown
<verification>
- All must_haves.truths hold true
- No horizontal overflow at any viewport width (320px - 2560px)
- Animations smooth at 60fps (no layout-triggering properties)
- Follows anti-slop-design principles (no generic gradients, no default fonts)
- Touch targets 44x44px minimum on mobile
- WCAG AA contrast ratios met
</verification>
```

#### `<success_criteria>`
Definition of done for this section.

```markdown
<success_criteria>
- Hero creates a striking first impression that matches the Midnight Luxe direction
- Gradient mesh background has depth and isn't a flat single-color gradient
- Typography uses Space Grotesk with proper tracking (-0.03em) and weight hierarchy
- Entrance animation is choreographed (not all-at-once) with smooth easing
- Responsive: stacked on mobile with proper spacing, side-by-side on desktop
- All interactive elements (buttons) have hover, focus, and active states
- Code is complete — no TODOs, no placeholder text, no missing imports
</success_criteria>
```

## Task Types

| Type | Syntax | Behavior |
|------|--------|----------|
| Auto | `[auto]` | Builder executes autonomously, commits when done |
| Human verify | `[checkpoint:human-verify]` | Builder pauses, describes output, waits for user approval |
| Decision | `[checkpoint:decision]` | Builder presents options, waits for user choice |
| Human action | `[checkpoint:human-action]` | Builder needs user to do something (provide asset, etc.) |

### When to Use Each Type

- **`[auto]`** — For all standard implementation tasks. The builder knows what to do from the task description.
- **`[checkpoint:human-verify]`** — After building something visual that the user should see. Use at least once per section plan.
- **`[checkpoint:decision]`** — When there are multiple valid approaches and the user should choose. E.g., "Choose between tabbed layout or accordion for the FAQ section."
- **`[checkpoint:human-action]`** — When the builder can't continue without user input. E.g., "Provide the logo SVG file" or "Enter the API key for the analytics service."

## SUMMARY.md Format

Written by section-builder on completion.

### Frontmatter

```yaml
---
section: XX-name
status: complete
subsystem: landing-page       # Broader category this section belongs to
tags: [hero, animation, responsive, gradient]
provides:                     # What other sections can import/use from this
  - GradientMeshBackground component
  - useScrollEntrance hook
affects:                      # Shared files this section modified (if any)
  - src/lib/animations.ts (added useScrollEntrance)
key_files:
  - src/components/sections/hero.tsx
  - src/components/sections/hero/hero-cta.tsx
key_decisions:
  - "Used CSS gradient layers instead of canvas: better performance, easier to maintain"
  - "Split CTA into sub-component: reusable in other sections"
duration: 4 turns
---
```

### Body

```markdown
## What Was Built
[Brief description of the section and key features]

## Files Created
- `src/components/sections/hero.tsx`: Main hero section with gradient mesh and entrance animation
- `src/components/sections/hero/hero-cta.tsx`: CTA button group component

## Dependencies Added
- None (used existing Framer Motion)

## Integration Notes
Import `HeroSection` from `@/components/sections/hero` and place as first section in the page.

## Deviations from Plan
None
```

## Examples of Well-Formed Plans

### Minimal Plan (shared/scaffold)

```yaml
---
section: 00-shared
wave: 0
depends_on: []
files_modified:
  - tailwind.config.ts
  - src/styles/globals.css
  - src/components/layout/section-wrapper.tsx
  - src/components/ui/gradient-text.tsx
autonomous: true
must_haves:
  truths:
    - "Tailwind config has custom colors, fonts, and spacing"
    - "CSS variables defined for all design tokens"
    - "SectionWrapper component handles responsive container"
  artifacts:
    - tailwind.config.ts
    - src/styles/globals.css
    - src/components/layout/section-wrapper.tsx
---
```

### Full Section Plan

```yaml
---
section: 04-pricing
wave: 2
depends_on: [00-shared]
files_modified:
  - src/components/sections/pricing.tsx
  - src/components/sections/pricing/pricing-card.tsx
  - src/components/sections/pricing/pricing-toggle.tsx
autonomous: true
must_haves:
  truths:
    - "Three pricing tiers displayed with clear visual hierarchy"
    - "Monthly/annual toggle with animated switch"
    - "Recommended tier has distinctive visual treatment"
    - "Responsive: stacked on mobile, side-by-side on desktop"
    - "Hover state on each card with shadow elevation"
  artifacts:
    - src/components/sections/pricing.tsx
    - src/components/sections/pricing/pricing-card.tsx
  key_links:
    - BRAINSTORM.md
    - 00-shared/PLAN.md
---
```

### Iteration Plan

```yaml
---
section: 02-hero
type: iteration
wave: 2
depends_on: [00-shared]
files_modified:
  - src/components/sections/hero.tsx
autonomous: true
must_haves:
  truths:
    - "Gradient updated from linear to radial mesh"
    - "Heading letter-spacing tightened to -0.03em"
  artifacts:
    - src/components/sections/hero.tsx
---
```

### Bugfix Plan

```yaml
---
section: 02-hero
type: bugfix
files_modified:
  - src/components/sections/hero.tsx
autonomous: true
must_haves:
  truths:
    - "No horizontal overflow on mobile (375px)"
    - "No regression in desktop layout"
  artifacts:
    - src/components/sections/hero.tsx
---
```
