---
name: design-system-scaffold
description: "Wave 0 scaffold generator: Tailwind v4 @theme from DNA, typed color/spacing/motion utilities, beat templates per emotional arc type, hard token enforcement, extension mechanism."
tier: core
triggers: "scaffold, design system, globals.css, tailwind theme, tokens, CSS variables, font preloading, Wave 0, setup, foundation, motion presets, beat template, typed utilities"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a design system engineer who translates Design DNA into production-ready code foundations. Wave 0 is the most critical wave -- every subsequent section builder depends on these tokens and utilities being correct. Your output is the structural enforcement mechanism that makes slop HARDER to produce than quality.

### When This Skill Runs

- **Wave 0 ONLY.** This is the first thing built before any section builders run
- Triggered by the orchestrator agent after `DESIGN-DNA.md` and `MASTER-PLAN.md` exist
- **Input:** `.planning/genorah/DESIGN-DNA.md` -- color tokens, type scale, spacing, motion language, signature element
- **Output:** Complete set of scaffold files in the target project (see file manifest below)

### What Gets Generated (File Manifest)

Every Wave 0 scaffold generates these files from DNA:

| File | Purpose | Source |
|------|---------|--------|
| `app/globals.css` | `@theme` block with all DNA tokens, `@keyframes`, reduced-motion baseline, `@font-face` | DNA color, type, spacing, motion tokens |
| `lib/tokens.ts` | TypeScript types and utilities for DNA tokens (colors, spacing, type scale) | DNA token definitions |
| `lib/motion.ts` | Motion preset utilities (archetype profile, DNA-tweaked easings/durations) | DNA motion language + archetype profile |
| `lib/beats.ts` | Beat template definitions (constraints per beat type) | Emotional arc from DNA |
| `components/ui/section-wrapper.tsx` | Section container with beat-aware defaults | Beat templates |
| `app/sitemap.ts` | Dynamic sitemap generation | Page routes + seo-meta skill |
| `app/robots.ts` | Crawler directives with sitemap reference | seo-meta skill |
| `app/opengraph-image.tsx` | Root-level default OG image | DNA tokens + og-images skill |

Optional (if archetype uses them):
| `lib/effects.ts` | Signature element utilities, texture patterns | DNA signature element |

### Hard Enforcement Philosophy

> "Making slop structurally impossible beats catching slop in review."

- **Typed utilities ONLY accept DNA token values.** `bg('primary')` works, `bg('#ff0000')` is a TypeScript error
- **Tailwind `@theme` maps DNA tokens to utilities.** Builders use `bg-primary` not `bg-[#ff0000]`
- **Beat templates define constraints as typed objects.** A HOOK beat template says `minHeight: '90vh'` -- the section-wrapper enforces it
- **Arbitrary values** (`[#hex]`, `[400px]`) should be caught by the quality reviewer, but the scaffold makes them unnecessary by providing every token a builder needs

### Extension Mechanism

When a builder needs a token not in the scaffold:

1. Builder adds the token to `lib/tokens.ts` with a `// EXTENDED: reason` comment
2. Builder adds the Tailwind mapping to `globals.css` `@theme` block with `/* EXTENDED: reason */`
3. Quality reviewer verifies the extension is justified (not a DNA violation)
4. Design system grows organically while staying typed and intentional

Extensions are **proposals** -- the quality reviewer may reject them if they duplicate existing tokens or violate DNA constraints.

### When NOT to Use

- For choosing colors, fonts, or archetypes -- use `design-dna` and `design-archetypes` skills
- For beat assignment and page flow -- use `emotional-arc` skill (this skill consumes beat definitions, not defines them)
- For motion decision-making (CSS vs GSAP vs Motion) -- use `cinematic-motion` and `performance-aware-animation` skills

### Pipeline Connection

- **Referenced by:** `orchestrator` during Wave 0 scaffold generation
- **Consumed by:** `builder` agents (every build uses the scaffold's typed utilities)
- **Verified by:** `quality-reviewer` (checks DNA token compliance via typed utilities and Tailwind classes)
- **Input from:** `DESIGN-DNA.md` (all tokens), `emotional-arc` skill (beat constraints)
- **Output to:** Every section builder inherits the scaffold. They use `bg('primary')` not `bg-[#ff0000]`. They wrap sections in `<SectionWrapper beat="hook">`

---

## Layer 2: Award-Winning Examples

### 1. globals.css Template

Complete, production-ready CSS file generated from DNA. Uses Tailwind v4 `@theme` directive -- no `tailwind.config.ts` needed for token configuration.

```css
@import "tailwindcss";

/* ========================================
 * Design System Scaffold
 * Generated from DESIGN-DNA.md
 * DO NOT EDIT MANUALLY — regenerate from DNA
 * ======================================== */

@theme {
  /* === COLORS (12 DNA tokens) === */
  /* Reset Tailwind defaults — project owns the full palette */
  --color-*: initial;

  /* Semantic Core (8 tokens) */
  --color-bg: /* DNA:bg — main background */;
  --color-surface: /* DNA:surface — card/panel backgrounds */;
  --color-text: /* DNA:text — primary text */;
  --color-border: /* DNA:border — default borders */;
  --color-primary: /* DNA:primary — primary accent, CTAs */;
  --color-secondary: /* DNA:secondary — secondary accent */;
  --color-accent: /* DNA:accent — tertiary/decorative */;
  --color-muted: /* DNA:muted — muted text, captions */;

  /* Expressive (4 tokens) */
  --color-glow: /* DNA:glow — glow/shadow effects */;
  --color-tension: /* DNA:tension — creative tension accents */;
  --color-highlight: /* DNA:highlight — emphasis, selection */;
  --color-signature: /* DNA:signature — signature element color */;

  /* === TYPOGRAPHY === */
  --font-display: /* DNA:display-font */, serif;
  --font-body: /* DNA:body-font */, sans-serif;
  --font-mono: /* DNA:mono-font */, monospace;

  /* Type Scale (8 levels, fluid responsive via clamp) */
  --text-hero: /* DNA: e.g., clamp(3rem, 8vw, 6rem) */;
  --text-h1: /* DNA: e.g., clamp(2.25rem, 5vw, 3.75rem) */;
  --text-h2: /* DNA: e.g., clamp(1.75rem, 3.5vw, 2.5rem) */;
  --text-h3: /* DNA: e.g., clamp(1.25rem, 2.5vw, 1.75rem) */;
  --text-h4: /* DNA: e.g., clamp(1.125rem, 2vw, 1.375rem) */;
  --text-body-lg: 1.25rem;
  --text-body: 1rem;
  --text-sm: 0.875rem;

  /* === SPACING (5-level scale) === */
  --spacing-xs: /* DNA:xs — e.g., 0.5rem */;
  --spacing-sm: /* DNA:sm — e.g., 1rem */;
  --spacing-md: /* DNA:md — e.g., 2rem */;
  --spacing-lg: /* DNA:lg — e.g., 4rem */;
  --spacing-xl: /* DNA:xl — e.g., 8rem */;

  /* === EASING CURVES === */
  --ease-default: /* DNA: e.g., cubic-bezier(0.16, 1, 0.3, 1) */;
  --ease-gentle: /* DNA: e.g., cubic-bezier(0.4, 0, 0.2, 1) */;
  --ease-snappy: /* DNA: e.g., cubic-bezier(0.3, 1.2, 0.2, 1) */;

  /* === ANIMATION PRESETS (--animate-* generates Tailwind animate-{name} utilities) === */
  --animate-reveal: reveal 0.6s var(--ease-gentle) both;
  --animate-rise: rise 0.5s var(--ease-default) both;
  --animate-expand: expand 0.5s var(--ease-default) both;
  --animate-slide-left: slide-left 0.5s var(--ease-default) both;
  --animate-slide-right: slide-right 0.5s var(--ease-default) both;
  --animate-drift: drift 20s ease-in-out infinite;

  @keyframes reveal {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(var(--rise-distance, 2rem)); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes expand {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slide-left {
    from { opacity: 0; transform: translateX(2rem); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slide-right {
    from { opacity: 0; transform: translateX(-2rem); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes drift {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, -20px); }
  }
}

/* === REDUCED MOTION BASELINE === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* === DNA MOTION CUSTOM PROPERTIES (consumed by JS libraries, NOT by Tailwind) === */
/* These live in :root, not @theme, because JS libraries read them via getComputedStyle */
:root {
  --motion-speed-multiplier: /* DNA: e.g., 1.0 */;
  --motion-stagger-base: /* DNA: e.g., 60ms */;
  --motion-entrance-duration: /* DNA: e.g., 400ms */;
  --motion-entrance-easing: var(--ease-default);
  --motion-hover-duration: /* DNA: e.g., 200ms */;
  --motion-hover-easing: var(--ease-snappy);
}

/* === BASE STYLES === */
body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-bg);
}

::selection {
  background-color: color-mix(in srgb, var(--color-highlight) 25%, transparent);
  color: var(--color-text);
}
```

**Key patterns:** `--color-*: initial` resets Tailwind defaults (project owns palette). `--animate-*` variables generate `animate-reveal`, `animate-rise` utilities. `@keyframes` live inside `@theme` (Tailwind v4 convention). `--motion-*` properties live in `:root` (NOT `@theme`) because JS libraries read them via `getComputedStyle`. Usage: `<div class="bg-primary text-text font-display text-hero animate-rise p-spacing-md">`.

---

### 2. lib/tokens.ts Template

Typed utilities that enforce DNA tokens at the TypeScript level. Builders import these instead of writing raw Tailwind class strings.

```typescript
// lib/tokens.ts — Generated from Design DNA
// TYPE-SAFE utilities that prevent arbitrary values

// DNA Color Tokens

/** All 12 DNA color tokens — the ONLY colors in the system */
export type DNAColor =
  | 'bg' | 'surface' | 'text' | 'border'          // Semantic core
  | 'primary' | 'secondary' | 'accent' | 'muted'    // Semantic core
  | 'glow' | 'tension' | 'highlight' | 'signature'  // Expressive

// Usage: bg('primary') -> 'bg-primary'
// Prevents: bg('#ff0000') -> TypeScript error
export function bg(color: DNAColor): string { return `bg-${color}` }
export function text(color: DNAColor): string { return `text-${color}` }
export function border(color: DNAColor): string { return `border-${color}` }
export function ring(color: DNAColor): string { return `ring-${color}` }
export function shadow(color: DNAColor): string { return `shadow-${color}` }

// DNA Spacing Tokens

/** 5-level DNA spacing scale */
export type DNASpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export function padding(size: DNASpacing): string { return `p-spacing-${size}` }
export function paddingX(size: DNASpacing): string { return `px-spacing-${size}` }
export function paddingY(size: DNASpacing): string { return `py-spacing-${size}` }
export function margin(size: DNASpacing): string { return `m-spacing-${size}` }
export function gap(size: DNASpacing): string { return `gap-spacing-${size}` }

// DNA Type Scale

/** 8-level DNA type scale */
export type DNATypeScale = 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'body-lg' | 'body' | 'sm'

export function fontSize(scale: DNATypeScale): string { return `text-${scale}` }

// DNA Font Family

/** 3 DNA font families */
export type DNAFont = 'display' | 'body' | 'mono'

export function font(family: DNAFont): string { return `font-${family}` }

// DNA Motion Presets (CSS class helpers)

/** Animation preset names from @theme --animate-* variables */
export type DNAAnimation = 'reveal' | 'rise' | 'expand' | 'slide-left' | 'slide-right' | 'drift'

export function animate(preset: DNAAnimation): string { return `animate-${preset}` }

// Easing Curves (for inline style or JS)

/** DNA easing curves as CSS values */
export const easing = {
  default: 'var(--ease-default)',
  gentle: 'var(--ease-gentle)',
  snappy: 'var(--ease-snappy)',
} as const

// Combined utility helper

/**
 * Build a className string from DNA tokens
 * @example classes(bg('surface'), text('text'), padding('md'), font('body'))
 * // -> 'bg-surface text-text p-spacing-md font-body'
 */
export function classes(...tokens: string[]): string {
  return tokens.filter(Boolean).join(' ')
}
```

Builders can still use raw Tailwind classes for non-DNA properties (flex, grid, w-full, etc.) but all COLOR, SPACING, TYPOGRAPHY, and ANIMATION usage is funneled through typed utilities. Calling `bg('#ff0000')` produces a TypeScript error -- only `DNAColor` values compile.

---

### 3. lib/motion.ts Template

Motion preset utilities matching the archetype profile. Uses Motion library (`motion/react`) variants with DNA-connected timing.

```typescript
// lib/motion.ts — Generated from Design DNA motion language
// Import: import { motion } from 'motion/react'

// DNA-Connected Timing

/** Read DNA motion parameters from CSS custom properties */
function getDNAMotion() {
  if (typeof window === 'undefined') return { speed: 1, stagger: 0.06, duration: 0.4 }
  const style = getComputedStyle(document.documentElement)
  return {
    speed: parseFloat(style.getPropertyValue('--motion-speed-multiplier') || '1'),
    stagger: parseFloat(style.getPropertyValue('--motion-stagger-base') || '60') / 1000,
    duration: parseFloat(style.getPropertyValue('--motion-entrance-duration') || '400') / 1000,
  }
}

// Motion Variants (for motion/react <motion.div>)

/** Rise from below — default for text and content blocks */
export const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => {
    const dna = getDNAMotion()
    return {
      opacity: 1, y: 0,
      transition: {
        delay: i * dna.stagger * dna.speed,
        duration: dna.duration * dna.speed,
        ease: [0.16, 1, 0.3, 1], // matches --ease-default
      },
    }
  },
}

/** Reveal in place — for backgrounds, ambient elements */
export const reveal = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => {
    const dna = getDNAMotion()
    return {
      opacity: 1,
      transition: {
        delay: i * dna.stagger * dna.speed,
        duration: dna.duration * 1.5 * dna.speed,
        ease: [0.4, 0, 0.2, 1], // matches --ease-gentle
      },
    }
  },
}

/** Expand from smaller — for cards, containers */
export const expand = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => {
    const dna = getDNAMotion()
    return {
      opacity: 1, scale: 1,
      transition: {
        delay: i * dna.stagger * dna.speed,
        duration: dna.duration * dna.speed,
        ease: [0.16, 1, 0.3, 1],
      },
    }
  },
}

/** Enter from left */
export const enterLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

/** Enter from right */
export const enterRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

// CSS Class Helpers (for @theme --animate-* presets)

/** CSS animation classes generated from @theme */
export const animateClass = {
  reveal: 'animate-reveal',
  rise: 'animate-rise',
  expand: 'animate-expand',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  drift: 'animate-drift',
} as const

// Stagger Calculator

/** Calculate stagger delay for child element at index */
export function stagger(index: number, baseMs = 60): number {
  return index * baseMs / 1000 // returns seconds for Motion library
}

// Viewport Settings

/** Standard viewport trigger config for whileInView */
export const viewportOnce = { once: true, margin: '-80px' as const }
```

---

### 4. lib/beats.ts Template

Beat template definitions with hard constraints from the Emotional Arc skill. These constraints are NOT suggestions -- the section-wrapper enforces `minHeight` and exposes `data-beat` attributes for CSS targeting.

```typescript
// lib/beats.ts — Generated from Emotional Arc beat constraints
// Reference: skills/emotional-arc/SKILL.md

// Beat Types

export type BeatType =
  | 'hook' | 'tease' | 'reveal' | 'build' | 'peak'
  | 'breathe' | 'tension' | 'proof' | 'pivot' | 'close'

// Beat Template Interface

export interface BeatTemplate {
  /** Minimum section height (CSS value) */
  minHeight: string
  /** Maximum number of primary content elements */
  maxElements: number
  /** Target whitespace ratio (e.g., '60-70%') */
  whitespace: string
  /** Recommended motion approach */
  motionPreset: 'dramatic-entrance' | 'choreographed-reveal' | 'staggered-grid'
    | 'reveal-only' | 'subtle-entrance' | 'asymmetric-build' | 'steady-cascade'
    | 'gentle-rise' | 'shift-transition' | 'final-attention'
  /** Recommended background treatment */
  background: string
  /** Scroll animation behavior for this beat */
  scrollBehavior: 'continuous' | 'entrance-only' | 'minimal'
  /** Whether creative tension techniques are allowed */
  tensionAllowed: boolean
  /** Energy level for sequence validation */
  energy: 'high' | 'medium-high' | 'medium' | 'medium-low' | 'low'
}

// Beat Templates — ALL 10 Beat Types

export const beatTemplates: Record<BeatType, BeatTemplate> = {
  hook: {
    minHeight: '90vh', maxElements: 5, whitespace: '60-70%',
    motionPreset: 'dramatic-entrance', background: 'primary or accent gradient',
    scrollBehavior: 'continuous', tensionAllowed: false, energy: 'high',
  },
  peak: {
    minHeight: '80vh', maxElements: 5, whitespace: '40-60%',
    motionPreset: 'choreographed-reveal', background: 'accent or signature',
    scrollBehavior: 'continuous', tensionAllowed: true, energy: 'high', // PEAK MUST have tension
  },
  tension: {
    minHeight: '40vh', maxElements: 6, whitespace: '30-50%',
    motionPreset: 'asymmetric-build', background: 'darker palette, contrast shift',
    scrollBehavior: 'entrance-only', tensionAllowed: true, energy: 'high',
  },
  tease: {
    minHeight: '40vh', maxElements: 6, whitespace: '50-60%',
    motionPreset: 'subtle-entrance', background: 'surface or slight contrast',
    scrollBehavior: 'entrance-only', tensionAllowed: false, energy: 'medium',
  },
  reveal: {
    minHeight: '60vh', maxElements: 8, whitespace: '40-50%',
    motionPreset: 'choreographed-reveal', background: 'surface with product showcase',
    scrollBehavior: 'entrance-only', tensionAllowed: false, energy: 'medium-high',
  },
  build: {
    minHeight: '80vh', maxElements: 12, whitespace: '30-40%',
    motionPreset: 'staggered-grid', background: 'alternating primary/surface',
    scrollBehavior: 'entrance-only', tensionAllowed: false, energy: 'medium',
  },
  pivot: {
    minHeight: '40vh', maxElements: 4, whitespace: '50-65%',
    motionPreset: 'shift-transition', background: 'tone change, visual shift',
    scrollBehavior: 'entrance-only', tensionAllowed: false, energy: 'medium',
  },
  breathe: {
    minHeight: '30vh', maxElements: 3, whitespace: '70-80%',
    motionPreset: 'reveal-only', background: 'bg (clean, no decorations)',
    scrollBehavior: 'minimal', tensionAllowed: false, energy: 'low', // BREATHE is rest
  },
  proof: {
    minHeight: '60vh', maxElements: 10, whitespace: '35-45%',
    motionPreset: 'steady-cascade', background: 'surface (credibility backdrop)',
    scrollBehavior: 'entrance-only', tensionAllowed: false, energy: 'low',
  },
  close: {
    minHeight: '40vh', maxElements: 5, whitespace: '50-65%',
    motionPreset: 'final-attention', background: 'primary or echo HOOK treatment',
    scrollBehavior: 'entrance-only', tensionAllowed: false,
    energy: 'medium-low',
  },
}

// Beat Constraint Validation

/** Check if a section respects its beat's element count constraint */
export function validateElementCount(beat: BeatType, count: number): boolean {
  return count <= beatTemplates[beat].maxElements
}

/** Get the minimum height CSS value for a beat */
export function getMinHeight(beat: BeatType): string {
  return beatTemplates[beat].minHeight
}

/** Check if creative tension is allowed for this beat */
export function isTensionAllowed(beat: BeatType): boolean {
  return beatTemplates[beat].tensionAllowed
}
```

**Beat Constraint Summary (from Emotional Arc skill):**

| Beat | Height | Elements | Whitespace | Scroll | Tension |
|------|--------|----------|------------|--------|---------|
| HOOK | 90-100vh | 3-5 | 60-70% | continuous | no |
| TEASE | 40-60vh | 3-6 | 50-60% | entrance-only | no |
| REVEAL | 60-80vh | 4-8 | 40-50% | entrance-only | no |
| BUILD | 80-120vh | 8-12 | 30-40% | entrance-only | no |
| PEAK | 80-100vh | 3-5 | 40-60% | continuous | YES |
| BREATHE | 30-50vh | 1-3 | 70-80% | minimal | no |
| TENSION | 40-70vh | 3-6 | 30-50% | entrance-only | yes |
| PROOF | 60-100vh | 5-10 | 35-45% | entrance-only | no |
| PIVOT | 40-60vh | 2-4 | 50-65% | entrance-only | no |
| CLOSE | 40-60vh | 3-5 | 50-65% | entrance-only | no |

---

### 5. components/ui/section-wrapper.tsx Template

Section container that applies beat constraints automatically. Every section builder wraps content in this component.

```tsx
// components/ui/section-wrapper.tsx
import { type BeatType, beatTemplates } from '@/lib/beats'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  /** Emotional arc beat type — determines constraints */
  beat: BeatType
  /** Section content */
  children: React.ReactNode
  /** Additional Tailwind classes */
  className?: string
  /** HTML id for navigation anchors */
  id?: string
  /** Background variant (maps to DNA tokens) */
  background?: 'bg' | 'surface' | 'primary' | 'accent'
}

const bgClasses: Record<NonNullable<SectionWrapperProps['background']>, string> = {
  bg: 'bg-bg',
  surface: 'bg-surface',
  primary: 'bg-primary/5',
  accent: 'bg-accent/5',
}

export function SectionWrapper({
  beat,
  children,
  className,
  id,
  background = 'bg',
}: SectionWrapperProps) {
  const template = beatTemplates[beat]

  return (
    <section
      id={id}
      className={cn(
        'relative w-full',
        bgClasses[background],
        className,
      )}
      style={{ minHeight: template.minHeight }}
      data-beat={beat}
      data-scroll-behavior={template.scrollBehavior}
      data-energy={template.energy}
    >
      {children}
    </section>
  )
}
```

**Data attributes enable CSS targeting:**
- `data-beat="hook"` -- CSS scroll-driven animations target sections by beat type (e.g., `[data-beat="hook"] .hero-media { animation-timeline: scroll(); }`)
- `data-scroll-behavior="continuous"` -- JS motion libraries read this to decide animation approach
- `data-energy="high"` -- Quality reviewer validates energy sequence by scanning data attributes

---

### 6. Extension Mechanism

When a builder needs a token not in the scaffold, they EXTEND the system rather than bypass it.

**In lib/tokens.ts -- adding a color token:**
```typescript
export type DNAColor =
  | 'bg' | 'surface' | 'text' | 'border'
  | 'primary' | 'secondary' | 'accent' | 'muted'
  | 'glow' | 'tension' | 'highlight' | 'signature'
  | 'feature-bg'  // EXTENDED: feature section card background (surface variant)
```

**In globals.css @theme -- adding the Tailwind mapping:**
```css
@theme {
  /* ... existing DNA tokens ... */
  --color-feature-bg: oklch(0.95 0.01 240);  /* EXTENDED: feature card bg — derived from DNA surface */
}
```

Quality reviewer checks: Is the extension justified? Does it conflict with existing tokens? Should it be promoted to a standard DNA token? Is the `// EXTENDED: reason` comment present?

---

### 7. Font Preloading Setup (Next.js)

Font configuration is part of the scaffold. DNA fonts are preloaded in the root layout using `next/font` with `display: 'swap'` and variable fonts preferred.

```tsx
// app/layout.tsx — Font preloading from DNA
import localFont from 'next/font/local'

const displayFont = localFont({
  src: '../public/fonts/DisplayFont-Variable.woff2',
  variable: '--font-display', display: 'swap', preload: true,
})
const bodyFont = localFont({
  src: '../public/fonts/BodyFont-Variable.woff2',
  variable: '--font-body', display: 'swap', preload: true,
})
const monoFont = localFont({
  src: '../public/fonts/MonoFont-Variable.woff2',
  variable: '--font-mono', display: 'swap', preload: true,
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
```

Font CSS variables (`--font-display`, `--font-body`, `--font-mono`) match `@theme` declarations in globals.css.

---

### 8. Wave 0 Scaffold Task List

When creating the `00-shared` section PLAN.md, include these tasks:

```markdown
<tasks>
- [auto] Create app/globals.css with Tailwind v4 @theme block containing all DNA tokens (reference design-system-scaffold skill)
- [auto] Create lib/tokens.ts with typed DNA utilities for colors, spacing, type scale, fonts (reference design-system-scaffold skill)
- [auto] Create lib/motion.ts with Motion library presets from DNA motion language (reference design-system-scaffold skill)
- [auto] Create lib/beats.ts with beat template definitions for all 10 emotional arc types (reference design-system-scaffold skill)
- [auto] Create components/ui/section-wrapper.tsx with beat-aware container (reference design-system-scaffold skill)
- [auto] Create lib/utils.ts with cn() helper (clsx + tailwind-merge)
- [auto] Set up font preloading in app/layout.tsx with DNA fonts
- [auto] Install dependencies: motion, clsx, tailwind-merge
- [auto] Verify all CSS variables resolve correctly (no missing DNA tokens)
- [auto] Create app/sitemap.ts with dynamic sitemap generation from page routes (reference seo-meta skill)
- [auto] Create app/robots.ts with sitemap reference and crawler directives (reference seo-meta skill)
- [auto] Add metadataBase to app/layout.tsx metadata export (reference seo-meta skill)
- [auto] Create app/opengraph-image.tsx root-level default OG image with DNA tokens (reference og-images skill)
</tasks>

**Astro variant:** Replace Next.js-specific files:
- `app/sitemap.ts` -> `@astrojs/sitemap` integration in `astro.config.mjs`
- `app/robots.ts` -> `public/robots.txt` static file
- `app/opengraph-image.tsx` -> `src/pages/og/default.png.ts` endpoint
- metadataBase -> BaseLayout `<head>` meta tags
```

**Note:** `motion` package (NOT `framer-motion`). All imports use `motion/react`.

---

## Layer 3: Integration Context

### DNA Connection

The scaffold IS the DNA made real. Every token in `DESIGN-DNA.md` becomes a CSS variable, Tailwind utility, and TypeScript type.

| DNA Token Category | Scaffold Output | Files |
|--------------------|----------------|-------|
| 12 Color tokens (8 semantic + 4 expressive) | `@theme --color-*` + `DNAColor` type + `bg()`, `text()`, `border()` utilities | globals.css, lib/tokens.ts |
| Type scale (8 levels) | `@theme --text-*` + `DNATypeScale` type + `fontSize()` utility | globals.css, lib/tokens.ts |
| 3 Font families | `@theme --font-*` + `DNAFont` type + `font()` utility + `next/font` preload | globals.css, lib/tokens.ts, app/layout.tsx |
| 5 Spacing levels | `@theme --spacing-*` + `DNASpacing` type + `padding()`, `gap()` utilities | globals.css, lib/tokens.ts |
| Motion language | `@theme --animate-*` + `:root --motion-*` + Motion variants | globals.css, lib/motion.ts |
| Signature element | `lib/effects.ts` utilities (if archetype uses signature element) | lib/effects.ts (optional) |

### Downstream Connections

- **Build Orchestrator** spawns a scaffold builder at Wave 0 with DNA as context. This skill tells that builder exactly what to generate. Builder reads `DESIGN-DNA.md`, follows templates, substitutes DNA values into `/* DNA: */` placeholders
- **Section Builders** inherit the scaffold. They `import { bg, text, padding } from '@/lib/tokens'` for type-safe DNA usage, `import { rise, viewportOnce } from '@/lib/motion'` for DNA-connected animations, and wrap sections in `<SectionWrapper beat="hook">`. They NEVER use arbitrary hex values
- **Cinematic Motion** -- scaffold provides both CSS path (`@theme --animate-*` + `@keyframes`, zero-JS) and JS path (`lib/motion.ts` variants reading `:root --motion-*` via `getComputedStyle`). Both reference the same DNA motion parameters
- **Emotional Arc** -- beat templates in `lib/beats.ts` encode hard constraints. Section-wrapper enforces `minHeight` and exposes `data-beat` + `data-scroll-behavior` for CSS targeting
- **Anti-Slop Gate** verifies DNA token compliance. `bg-[#hex]` = violation, `text-[#hex]` = violation, Tailwind default spacing (`p-4 mt-8`) = warning, system fonts (`font-sans`) = violation

### Related Skills

- `design-dna` -- Provides all token values consumed by the scaffold
- `emotional-arc` -- Provides beat constraint definitions encoded in `lib/beats.ts`
- `cinematic-motion` -- Provides motion vocabulary that the scaffold's presets implement
- `performance-aware-animation` -- Provides CSS-first decision tree that scaffold defaults align with
- `design-archetypes` -- Provides archetype-specific motion profiles for `lib/motion.ts` presets
- `seo-meta` -- Provides sitemap, robots.txt, and metadata patterns scaffolded in Wave 0
- `og-images` -- Provides OG image generation patterns for the root-level opengraph-image.tsx
- `structured-data` -- Section builders may need to add JSON-LD scripts per section PLAN.md schema_type

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Tailwind v3 Config as Primary

**What goes wrong:** Generating `tailwind.config.ts` with `theme.extend.colors` and `theme.extend.fontFamily` as the primary token configuration.
**Why bad:** Tailwind v4 uses CSS-first `@theme` directive. JS config is legacy and adds unnecessary complexity. The `@theme` block is the single source of truth for design tokens.
**Instead:** All tokens in `@theme` block in `globals.css`. Only use `tailwind.config.ts` for plugins or complex features that cannot be expressed in CSS. Never for colors, fonts, spacing, or animation definitions.

### Anti-Pattern: Arbitrary Hex Values

**What goes wrong:** Using `bg-[#ff6600]`, `text-[#333333]`, or `border-[rgba(0,0,0,0.1)]` in components.
**Why bad:** Breaks the token system. Impossible to theme. Anti-slop gate catches it. Creates visual inconsistency when DNA colors change. Makes dark mode implementation fragile.
**Instead:** Use `bg-primary`, `text-text`, `border-border` Tailwind utilities, or typed utilities `bg('primary')`, `text('text')`. If the exact color needed is not in DNA, extend the system (see Extension Mechanism).

### Anti-Pattern: Hardcoded Spacing

**What goes wrong:** Using `p-4 mt-8 gap-6 mb-12` with Tailwind default spacing scale (4px increments).
**Why bad:** Spacing does not follow DNA rhythm. Creates inconsistent visual pacing across sections. Different builders use different numbers, producing no coherent spacing system.
**Instead:** Use DNA spacing tokens: `p-spacing-sm`, `gap-spacing-md`, `py-spacing-lg`. The 5-level scale (xs/sm/md/lg/xl) covers all spacing needs. For section-level spacing, the section-wrapper handles it via beat constraints.

### Anti-Pattern: Missing Beat Constraints

**What goes wrong:** Section ignoring beat template `minHeight`, exceeding element count, or violating whitespace ratio.
**Why bad:** Breaks the emotional arc. A BREATHE section with 8 elements is not a BREATHE -- it is a BUILD mislabeled. PEAK without sufficient height loses its wow-moment impact.
**Instead:** Use `<SectionWrapper beat="hook">` which enforces `minHeight` via inline style. Check element count against `beatTemplates[beat].maxElements`. If the section needs more elements, it might be the wrong beat type.

### Anti-Pattern: System Font for Display

**What goes wrong:** Using `font-sans` (Inter/system-ui) or `font-serif` (Georgia/Times) for display headings.
**Why bad:** Instant "generic AI output" signal. System fonts are the typography equivalent of stock photos. The display font is THE most visible expression of the project's personality.
**Instead:** Use `font-display` which maps to the archetype's chosen display font (set in DNA, preloaded in `layout.tsx`). Display fonts are never system fonts -- Inter, Roboto, Arial, and system-ui are forbidden as display fonts per the Design DNA skill.

### Anti-Pattern: Motion Without DNA Connection

**What goes wrong:** Hardcoding easing values like `ease: [0.16, 1, 0.3, 1]` or durations like `duration: 0.4` directly in components.
**Why bad:** Not DNA-connected. Cannot adjust motion globally via `--motion-speed-multiplier`. Different builders hardcode different values, creating inconsistent motion language.
**Instead:** Reference `var(--ease-default)` in CSS or use `lib/motion.ts` presets which read DNA values from CSS custom properties. All timing is centralized in the scaffold.

### Anti-Pattern: Extension Without Documentation

**What goes wrong:** Adding new tokens to `lib/tokens.ts` or `globals.css` without `// EXTENDED: reason` comments.
**Why bad:** Quality reviewer cannot distinguish intentional extensions from DNA violations. Future builders cannot understand why the token was added. Extensions become invisible tech debt.
**Instead:** Every extension must include `// EXTENDED: reason` in TypeScript and `/* EXTENDED: reason */` in CSS. The reason must explain WHY the token is needed and how it relates to existing DNA tokens.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| DNA color tokens in @theme | 12 | - | tokens | HARD -- all 12 must be present |
| Type scale levels in @theme | 8 | - | levels | HARD -- hero through sm |
| Spacing scale levels in @theme | 5 | - | levels | HARD -- xs through xl |
| Font families in @theme | 3 | - | families | HARD -- display, body, mono |
| Animation presets in @theme | 4 | - | presets | SOFT -- at least reveal, rise, expand, drift |
| Motion custom properties in :root | 4 | - | properties | HARD -- speed, stagger, entrance-duration, entrance-easing |
| Beat templates defined | 10 | 10 | beat types | HARD -- all 10 emotional arc beats |
| `--color-*: initial` reset | 1 | - | declaration | HARD -- must reset Tailwind color defaults |
| reduced-motion media query | 1 | - | block | HARD -- must include prefers-reduced-motion baseline |
| Arbitrary hex values in components | - | 0 | occurrences | HARD -- bg-[#hex] and text-[#hex] are violations |
