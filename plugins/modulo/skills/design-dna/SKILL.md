---
name: design-dna
description: "Design DNA system — the unique visual identity document generated per project. Defines palette, typography, spacing, signature element, motion language, and texture. All section builders MUST reference this."
---

Use this skill whenever generating a Design DNA document, referencing project identity, or building sections that must match the project's visual language. Triggers on: design DNA, visual identity, project palette, design system, design language, project style, brand identity.

You are a design director who creates unique, distinctive visual identities for every project. No two projects should look alike. The Design DNA is the single source of truth that prevents generic output.

## What is Design DNA?

Design DNA is a **mandatory project artifact** generated after the brainstorm phase and before section planning. It defines the complete visual language for the project. Every section builder, every component, every animation MUST reference this document.

**Without Design DNA, you CANNOT proceed to plan-sections or execute.**

## DESIGN-DNA.md Format

Generate this file at `.planning/modulo/DESIGN-DNA.md`:

```markdown
# Design DNA: [Project Name]

## Archetype: [Name]
> One-sentence personality statement, e.g., "A kinetic, motion-driven interface that feels alive and responsive to every interaction."

## Color System

### Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | #0a0a0f | Main background |
| `--color-bg-secondary` | #111115 | Card/surface background |
| `--color-bg-tertiary` | #1a1a22 | Elevated surfaces |
| `--color-text-primary` | #f0ece6 | Headlines, primary text |
| `--color-text-secondary` | #a09c94 | Body text, descriptions |
| `--color-text-tertiary` | #5c5952 | Muted text, captions |
| `--color-accent-1` | #ff6f3c | Primary accent (CTAs, highlights) |
| `--color-accent-2` | #00e5a0 | Secondary accent (success, tags) |
| `--color-accent-3` | #c084fc | Tertiary accent (decorative) |
| `--color-border` | rgba(255,255,255,0.06) | Default borders |
| `--color-border-hover` | rgba(255,255,255,0.12) | Hover borders |
| `--color-glow` | rgba(255,111,60,0.3) | Glow/shadow color |

### Color Rules
- Background gradient direction: [e.g., "top-left to bottom-right, from bg-primary via bg-secondary"]
- Accent usage ratio: [e.g., "accent-1 for CTAs only, accent-2 for interactive elements, accent-3 for decorative"]
- Forbidden colors: [e.g., "No pure blue (#0000ff), no default indigo, no Tailwind blue-500/purple-600"]

## Typography System

### Fonts
| Role | Font | Fallback | Source |
|------|------|----------|--------|
| Display | [e.g., Clash Display] | system-ui, sans-serif | [local/Google Fonts] |
| Body | [e.g., DM Sans] | system-ui, sans-serif | [Google Fonts] |
| Mono | [e.g., JetBrains Mono] | monospace | [Google Fonts] |

### Type Scale
| Level | Size | Weight | Tracking | Leading | Usage |
|-------|------|--------|----------|---------|-------|
| Hero | text-7xl / text-8xl | bold (700) | -0.04em | 0.85 | Main hero headline |
| H1 | text-5xl / text-6xl | semibold (600) | -0.03em | 0.9 | Section headlines |
| H2 | text-3xl / text-4xl | semibold (600) | -0.02em | 0.95 | Sub-section heads |
| H3 | text-xl / text-2xl | medium (500) | -0.01em | 1.1 | Card/feature titles |
| Body Large | text-lg | regular (400) | normal | 1.6 | Intro paragraphs |
| Body | text-base | regular (400) | normal | 1.65 | Standard body |
| Small | text-sm | regular (400) | 0.01em | 1.5 | Captions, metadata |
| Overline | text-xs | semibold (600) | 0.12em uppercase | 1.0 | Section labels |

### Typography Rules
- Headlines: always font-display, always negative tracking
- Body: always font-body, always max-w-[65ch]
- At least 3 weights visible per page (e.g., 400, 600, 700)
- One typographic surprise per page: [e.g., "gradient text on hero", "outlined text", "mixed weight headline"]

## Spacing System

### Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--space-section` | py-24 md:py-32 lg:py-40 | Between major sections |
| `--space-block` | space-y-12 md:space-y-16 | Between content blocks within sections |
| `--space-element` | space-y-4 md:space-y-6 | Between related elements |
| `--space-tight` | space-y-2 | Between tightly coupled elements |
| `--space-container` | px-6 md:px-12 lg:px-20 | Horizontal container padding |

### Spacing Rules
- Asymmetric padding: [e.g., "Left padding always 1.5x right padding on feature sections"]
- Section rhythm: [e.g., "Alternate between py-24 and py-32 for visual rhythm"]
- Never use uniform `gap-4` across a page — vary gaps per context

## Border Radius System

| Element | Radius | Note |
|---------|--------|------|
| Outer containers | rounded-3xl (24px) | Cards, sections |
| Inner elements | rounded-xl (12px) | Buttons, inputs, chips |
| Small elements | rounded-lg (8px) | Tags, badges |
| Avatars/icons | rounded-full | Always circular |

## Shadow & Depth System

### Shadow Layers
| Level | Value | Usage |
|-------|-------|-------|
| Subtle | shadow-[0_0_0_1px_var(--color-border)] | Resting cards |
| Elevated | shadow-[0_2px_8px_rgba(0,0,0,0.15),0_0_0_1px_var(--color-border)] | Hover cards |
| Float | shadow-[0_12px_40px_-8px_rgba(0,0,0,0.3)] | Modals, dropdowns |
| Glow | shadow-[0_0_30px_var(--color-glow)] | Accent elements |
| Colored | shadow-[0_20px_60px_-15px_var(--color-glow)] | Hero CTA |

### Depth Rules
- Surface hierarchy: [e.g., "3 levels: bg-primary → bg-secondary → bg-tertiary"]
- Glass effect: [yes/no, if yes: "bg-bg-secondary/50 backdrop-blur-xl border border-white/[0.06]"]
- Grain texture: [yes/no, if yes: opacity level]

## Signature Element

> Every project MUST have ONE unique visual element that makes it instantly recognizable.

**This project's signature:** [describe the unique element]

Examples:
- A custom cursor that morphs shape based on what it hovers
- A persistent floating geometric shape that rotates with scroll
- A glitch/distortion effect on the hero headline
- Diagonal section dividers throughout the entire page
- A color accent that shifts hue as the user scrolls down the page
- An animated noise/grain overlay with a unique blend mode
- A persistent dot-grid background that parallax-shifts

**Implementation:** [specific code approach]

## Motion Language

### Animation Defaults
| Property | Value |
|----------|-------|
| Default duration | [e.g., 400ms] |
| Default easing | [e.g., cubic-bezier(0.16, 1, 0.3, 1)] |
| Stagger delay | [e.g., 80ms between elements] |
| Scroll reveal distance | [e.g., 30px translateY] |

### Motion Rules
- Enter direction: [e.g., "All elements enter from bottom, except images which enter from the side"]
- Hover behavior: [e.g., "Cards lift (translateY -4px + shadow increase), buttons glow brighter"]
- Scroll behavior: [e.g., "Fade + slide up, staggered per element, triggered at 20% viewport entry"]
- Page transitions: [if applicable]
- Forbidden motion: [e.g., "No bounce easing, no spinning, no horizontal shake"]

### Easing Library
| Name | Value | Usage |
|------|-------|-------|
| Smooth out | cubic-bezier(0.16, 1, 0.3, 1) | Default enters |
| Snappy | cubic-bezier(0.3, 1.2, 0.2, 1) | Interactive feedback |
| Gentle | cubic-bezier(0.4, 0, 0.2, 1) | Subtle transitions |

## Texture & Effects

| Effect | Used? | Config |
|--------|-------|--------|
| Grain/noise overlay | [yes/no] | opacity: [value], blend: [mode] |
| Gradient orbs | [yes/no] | colors: [...], blur: [value] |
| Grid/dot background | [yes/no] | size: [value], opacity: [value] |
| Glass morphism | [yes/no] | blur: [value], border: [value] |
| Glow effects | [yes/no] | color: [value], intensity: [level] |

## Layout Patterns Required

List the specific layout patterns this project will use (minimum 4 distinct patterns):

1. [e.g., "Full-bleed hero with 3D perspective product shot"]
2. [e.g., "Asymmetric 60/40 two-column feature sections"]
3. [e.g., "Bento grid for capabilities overview"]
4. [e.g., "Full-width marquee for social proof"]
5. [e.g., "Centered narrow-column for testimonials"]

### Diversity Rule
No two adjacent sections may use the same layout pattern type.

## Tension Plan

> Which creative tensions will push this project beyond safe archetype territory?

**Selected tensions (2-3 per project):**
1. [Tension type] — [Which section] — [Approach description]
2. [Tension type] — [Which section] — [Approach description]
3. [Tension type (optional)] — [Which section] — [Approach description]

**Tension budget:** [1-3 per page, spaced apart — never adjacent sections]

Reference the `creative-tension` skill for the archetype's specific aggressive tension zones.

## Emotional Arc Template

> The default emotional beat sequence for this project's archetype.

**Arc:** [e.g., HOOK → TEASE → REVEAL → BUILD → BREATHE → PROOF → BUILD → CLOSE]

**Transition pattern:** [e.g., scroll-fade → acceleration → acceleration → gentle-resume → hard-cut → acceleration → convergence]

Reference the `emotional-arc` skill for archetype-specific arc templates and valid/invalid beat sequences.

## Choreography Defaults

> Per-beat motion choreography that all section builders must follow.

| Beat | Primary Direction | Secondary Direction | Easing | Duration | Stagger |
|------|------------------|--------------------|---------|---------|---------|
| HOOK | RISE (headlines) | REVEAL (background) | [DNA default easing] | 600-800ms | 150ms |
| TEASE | RISE | CASCADE | [DNA default easing] | 400-600ms | 80ms |
| REVEAL | EXPAND | UNFOLD | [DNA default easing] | 600-800ms | 100ms |
| BUILD | CASCADE | RISE | [DNA default easing] | 300-500ms | 60ms |
| PEAK | [Custom per project] | [Custom] | [DNA default easing] | 800-1200ms | 80ms |
| BREATHE | REVEAL | — | [DNA gentle easing] | 600-800ms | — |
| TENSION | RISE | ENTER-STAGE | [DNA default easing] | 500-700ms | 80ms |
| PROOF | CASCADE | REVEAL | [DNA default easing] | 200-400ms | 60ms |
| PIVOT | RISE | REVEAL | [DNA default easing] | 500-700ms | 100ms |
| CLOSE | RISE (CTA) | EXPAND (button glow) | [DNA default easing] | 400-600ms | 80ms |

Reference the `cinematic-motion` skill for detailed choreography sequences and the archetype's motion personality.

## Scaffold Specification

> The design system foundation generated during Wave 0.

Wave 0 scaffold tasks reference the `design-system-scaffold` skill for code generation templates:
- `globals.css` — all DNA tokens as CSS custom properties
- `tailwind.config.ts` — theme extension mapped to CSS variables
- `lib/motion.ts` — reusable Framer Motion presets from DNA motion language
- `components/ui/section-wrapper.tsx` — beat-aware section container
- Font preloading setup matching DNA typography
```

## How Section Builders Use Design DNA

Every section builder MUST:

1. **Read `.planning/modulo/DESIGN-DNA.md` FIRST** before writing any code
2. **Use ONLY the defined color tokens** — no arbitrary hex values
3. **Use ONLY the defined fonts** — no falling back to Inter/system defaults
4. **Follow the spacing scale** — no `gap-4` without checking the scale
5. **Match the motion language** — same easing, same enter directions
6. **Reference the signature element** — at least one section must feature it prominently
7. **Apply the texture/effects** as specified — grain, glow, glass per the DNA

### Code Integration

```tsx
// globals.css — generated from Design DNA
:root {
  --color-bg-primary: #0a0a0f;
  --color-bg-secondary: #111115;
  --color-bg-tertiary: #1a1a22;
  --color-text-primary: #f0ece6;
  --color-text-secondary: #a09c94;
  --color-text-tertiary: #5c5952;
  --color-accent-1: #ff6f3c;
  --color-accent-2: #00e5a0;
  --color-accent-3: #c084fc;
  --color-border: rgba(255,255,255,0.06);
  --color-glow: rgba(255,111,60,0.3);
}
```

```tsx
// tailwind.config.ts — generated from Design DNA
const config = {
  theme: {
    extend: {
      colors: {
        bg: { primary: 'var(--color-bg-primary)', secondary: 'var(--color-bg-secondary)', tertiary: 'var(--color-bg-tertiary)' },
        text: { primary: 'var(--color-text-primary)', secondary: 'var(--color-text-secondary)', tertiary: 'var(--color-text-tertiary)' },
        accent: { 1: 'var(--color-accent-1)', 2: 'var(--color-accent-2)', 3: 'var(--color-accent-3)' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

## Validation Rules

Before approving a Design DNA document, verify:

- [ ] All 12 color tokens are defined with specific values (no placeholders)
- [ ] Display font is NOT Inter, Roboto, Arial, or system-ui
- [ ] At least 3 font weights specified in the type scale
- [ ] Spacing scale has 5+ levels with specific Tailwind classes
- [ ] Signature element is specific and implementable (not vague)
- [ ] Motion language defines easing curves and timing (not "smooth transitions")
- [ ] At least 4 distinct layout patterns listed
- [ ] Forbidden colors/patterns are explicitly listed
- [ ] At least one accent color is NOT blue, indigo, or violet

## Design DNA Generation Process

1. User chooses archetype (or custom) during brainstorm
2. System generates DNA based on archetype constraints
3. User reviews and can adjust specific values
4. DNA is finalized and written to `.planning/modulo/DESIGN-DNA.md`
5. Wave 0 (scaffold) generates `globals.css` + `tailwind.config.ts` from DNA
6. All subsequent section builders read DNA before building
