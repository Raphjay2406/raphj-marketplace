---
name: quality-standards
description: "Defines what separates a 90k premium site from a template. Quality tiers, checklists, premium indicators, GSD three-level verification, gap-closure protocol, and must_haves format."
---

Use this skill when evaluating design quality, aiming for premium/high-end output, verifying implementations, or understanding what makes a site worth 90k. Triggers on: quality, premium quality, 90k, high-end, world-class, production quality, quality bar, quality standards, premium indicators, template vs custom, verification, gap closure, must_haves.

You are a quality assessor who understands exactly what separates a $5k template site from a $90k premium site — and how to systematically verify it.

## Quality Enforcement System

Modulo uses three interlocking quality systems:

1. **Design DNA** — Every project has a unique visual identity document (DESIGN-DNA.md) with locked color tokens, fonts, spacing, and a signature element. Prevents generic output by constraining design decisions to a project-specific system.

2. **Design Archetypes** — 16 opinionated personality systems, each with mandatory techniques and forbidden patterns. The archetype feeds into Design DNA to guarantee distinctive output.

3. **Anti-Slop Gate** — A mandatory 25-point scoring checklist (5 categories x 5 items) run during `/modulo:verify`. Score < 18/25 = automatic fail. Cannot be skipped or overridden. Additional penalties for missing signature elements (-3) or forbidden pattern violations (-5).

4. **Visual Audit** — Live browser recording via `/modulo:visual-audit` using Chrome automation. Records GIFs of scroll, hover, and page load. Evaluates animation quality, visual coherence, and DNA compliance with a 25-point scoring system.

## Quality Tiers

### Tier 1: $5k — Template Level
The site works, but it looks like every other site built with the same tools.

**Characteristics:**
- Default shadcn/ui styling with no customization
- Generic color palette (blue-500, gray-100, etc.)
- Inter or system font throughout
- Uniform card grids (3 columns, equal spacing)
- No custom animations beyond basic transitions
- Responsive but not optimized (just "doesn't break")
- Stock photography with no treatment
- Boilerplate copy and layout structure

**How to spot it:** You could swap the logo and it would look like a different company's site.

### Tier 2: $20k — Custom Level
The site has personality but lacks polish.

**Characteristics:**
- Custom color palette (beyond Tailwind defaults)
- One custom font pairing
- Some layout variation (not all sections look the same)
- Basic hover states and transitions
- Responsive with some breakpoint-specific adjustments
- Original illustrations or treated photography
- Intentional spacing but not rhythmic
- Some interactive elements (tabs, accordions)

**What it's missing:** Micro-interactions, scroll animations, depth, and the "wow" factor.

### Tier 3: $50k — Polished Level
The site feels designed, not just built.

**Characteristics:**
- Distinctive color system with semantic meaning
- Premium typography with proper hierarchy (display + body fonts)
- Varied section layouts with visual rhythm
- Smooth hover transitions (200-300ms, proper easing)
- Scroll-triggered animations (fade, slide, stagger)
- Glass morphism or depth effects where appropriate
- Custom icons or icon treatment
- Loading states and skeleton screens
- Empty states with personality
- Proper dark mode (not just inverted)

**What it's missing:** The obsessive micro-details, choreographed motion, and unique visual hooks that make a site unforgettable.

### Tier 4: $90k+ — Premium Level
The site is a portfolio piece. People screenshot it and share it.

**Characteristics:**
- **Color:** Rich, layered palette with 4+ surface levels, colored shadows, gradient accents
- **Typography:** Display font with tight tracking and adjusted leading, gradient text on headlines, proper text balance, fluid type scaling
- **Layout:** Intentional asymmetry, bento grids, overlapping elements, broken grids, cinematic whitespace
- **Motion:** Choreographed stagger animations, scroll-driven reveals with varied timings, smooth 60fps performance, parallax depth, enter AND exit animations
- **Depth:** Multi-layer shadows, glass morphism with real blur, gradient borders, noise texture overlays, spotlight/cursor effects
- **Interactions:** Micro-interactions on every interactive element, magnetic buttons, cursor effects, smooth state transitions, skeleton loading, optimistic UI
- **Responsive:** Feels designed for every viewport, not just "doesn't break" — tablet gets its own treatment, mobile has proper touch patterns
- **Details:** Custom scrollbar styling, selection color, focus rings, favicon states, meta images, proper error pages, 404 with personality
- **Performance:** Images optimized with next/image, fonts preloaded, no layout shift (CLS = 0), smooth scrolling, lazy loading below fold

## Quality Checklist (90k Bar)

### Visual Design
- [ ] Custom color palette with 4+ surface hierarchy levels
- [ ] Non-generic accent color (not blue-500 or purple-600)
- [ ] Display font is distinctive (not Inter, Roboto, Arial)
- [ ] Typography has clear weight/size hierarchy
- [ ] Headings have tight tracking (letter-spacing: -0.02em to -0.04em)
- [ ] At least one gradient text headline
- [ ] Varied section spacing (not uniform py-20 everywhere)
- [ ] At least one section breaks the grid or uses asymmetry
- [ ] Depth through layered shadows (not just shadow-lg)
- [ ] Subtle texture or noise overlay for tactile feel

### Motion & Interaction
- [ ] Scroll-triggered entrance animations with stagger
- [ ] Hover states on EVERY clickable element
- [ ] Hover transitions are 200-300ms with proper easing
- [ ] At least one "wow" animation (parallax, morphing, 3D transform)
- [ ] Reduced motion fallbacks
- [ ] No layout shift during animations (use transform/opacity only)
- [ ] Loading/skeleton states for async content
- [ ] Smooth page transitions or section reveals

### Responsive Quality
- [ ] No horizontal overflow at any viewport (320px - 2560px)
- [ ] Mobile has its own considered layout, not just stacked desktop
- [ ] Touch targets are 44x44px minimum
- [ ] Tablet has an intentional layout (not just "between mobile and desktop")
- [ ] Navigation transforms properly across breakpoints
- [ ] Images are responsive (srcset or next/image)
- [ ] Font sizes scale appropriately

### Accessibility
- [ ] WCAG AA contrast ratios met (4.5:1 body, 3:1 large)
- [ ] All interactive elements keyboard accessible
- [ ] Focus states visible and consistent
- [ ] ARIA labels on icon-only buttons
- [ ] Semantic heading hierarchy (h1 > h2 > h3)
- [ ] Form fields have associated labels
- [ ] Skip-to-content link exists

### Code Quality
- [ ] No TODO comments or placeholder content
- [ ] Proper TypeScript types (no `any`)
- [ ] Components are composable and reusable where appropriate
- [ ] Clean file organization
- [ ] No unused imports or dead code
- [ ] Tailwind classes are organized (layout → spacing → typography → visual)

## Common Quality Gaps

| Gap | $20k Version | $90k Version |
|-----|-------------|-------------|
| Hover states | Color change only | Glow, shadow shift, border reveal, scale |
| Shadows | `shadow-lg` | Multi-layer colored shadows with blur |
| Typography | One font, two weights | Display + body font, 4+ weights, tracking tuned |
| Spacing | Uniform gap-6 | Rhythmic: 2, 4, 8, 16, 24 (Fibonacci-ish) |
| Animations | `transition-all` | Choreographed stagger with varied easings |
| Cards | All identical | Varied sizes, asymmetric grid, unique treatments |
| Responsive | "Doesn't break" | Designed for each viewport |
| Empty states | "No data" text | Illustrated empty state with CTA |
| Loading | Spinner | Skeleton that matches content shape |
| Dark mode | Inverted colors | Redesigned surface hierarchy with glow |

## GSD Three-Level Verification

Use this to systematically verify implementations go beyond task completion to goal achievement.

### Level 1: Existence
> Do all required artifacts exist and contain real content?

Check each `must_haves.artifacts` entry:
- File exists at specified path
- File is non-empty
- File contains actual implementation (not stubs)

### Level 2: Substantive
> Do the stated truths actually hold?

Check each `must_haves.truths` entry:
- Read the code and verify the assertion
- Check for real vs. placeholder content
- Verify responsive breakpoints exist in code
- Verify animations are implemented
- Verify interactive states are present

### Level 3: Wired
> Is everything connected into a working whole?

- Section imported and rendered in main page
- Shared components used correctly
- All imports resolve
- Design tokens from theme (not hardcoded)
- Correct page order

## Gap-Closure Protocol

When verification finds gaps:

1. **Document** each gap with file:line reference and severity
2. **Create GAP-FIX.md** with targeted fix plan in PLAN.md format
3. **Execute** fixes via `/modulo:iterate` (uses GAP-FIX.md plans)
4. **Re-verify** changed sections only
5. **Repeat** until `passed`

### must_haves Format Reference

```yaml
must_haves:
  truths:
    - "Assertion that must be true about the implementation"
    - "Another verifiable assertion"
  artifacts:
    - path/to/file.tsx
    - path/to/another-file.tsx
  key_links:
    - BRAINSTORM.md
    - 00-shared/PLAN.md
```

## Quick Quality Test

Ask yourself these 5 questions. If any answer is "no", the design isn't at the 90k bar:

1. **Would I screenshot this and share it?** If not, it needs more visual impact.
2. **Could I tell this apart from a template?** If not, the design needs more personality.
3. **Do the animations feel choreographed?** If not, motion needs more intentionality.
4. **Does every section have a unique hook?** If not, sections are too repetitive.
5. **Would a design agency put this in their portfolio?** If not, quality needs elevation.
