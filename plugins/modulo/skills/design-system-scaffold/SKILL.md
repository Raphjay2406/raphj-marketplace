---
name: design-system-scaffold
description: "Wave 0 scaffold templates: globals.css, tailwind.config.ts, lib/motion.ts, section-wrapper component — all generated directly from Design DNA tokens."
---

Use this skill during Wave 0 scaffold tasks or when setting up the design system foundation from Design DNA. Triggers on: scaffold, design system, globals.css, tailwind config, tokens, CSS variables, font preloading, Wave 0, setup, foundation, motion presets.

You are a design system engineer who translates Design DNA into production-ready code foundations. Wave 0 is the most critical wave — every subsequent section builder depends on these tokens and utilities being correct.

## globals.css Template

Generate from `.planning/modulo/DESIGN-DNA.md` color system, typography, spacing, shadows, and textures.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* === COLORS (from Design DNA palette) === */
    --color-bg-primary: /* DNA value */;
    --color-bg-secondary: /* DNA value */;
    --color-bg-tertiary: /* DNA value */;
    --color-text-primary: /* DNA value */;
    --color-text-secondary: /* DNA value */;
    --color-text-tertiary: /* DNA value */;
    --color-accent-1: /* DNA value */;
    --color-accent-2: /* DNA value */;
    --color-accent-3: /* DNA value */;
    --color-border: /* DNA value */;
    --color-border-hover: /* DNA value */;
    --color-glow: /* DNA value */;

    /* === TYPOGRAPHY (from DNA fonts) === */
    --font-display: /* DNA display font */, system-ui, sans-serif;
    --font-body: /* DNA body font */, system-ui, sans-serif;
    --font-mono: /* DNA mono font */, monospace;

    /* === SPACING (from DNA spacing scale) === */
    --space-section: /* DNA section spacing, e.g., 6rem */;
    --space-block: /* DNA block spacing, e.g., 3rem */;
    --space-element: /* DNA element spacing, e.g., 1.5rem */;
    --space-tight: /* DNA tight spacing, e.g., 0.5rem */;

    /* === SHADOWS (from DNA shadow system) === */
    --shadow-subtle: /* DNA subtle shadow */;
    --shadow-elevated: /* DNA elevated shadow */;
    --shadow-float: /* DNA float shadow */;
    --shadow-glow: /* DNA glow shadow */;
    --shadow-colored: /* DNA colored shadow */;

    /* === BORDER RADIUS (from DNA radius system) === */
    --radius-outer: /* DNA outer radius, e.g., 1.5rem */;
    --radius-inner: /* DNA inner radius, e.g., 0.75rem */;
    --radius-small: /* DNA small radius, e.g., 0.5rem */;

    /* === MOTION (from DNA motion language) === */
    --ease-default: /* DNA default easing, e.g., cubic-bezier(0.16, 1, 0.3, 1) */;
    --ease-snappy: /* DNA snappy easing */;
    --ease-gentle: /* DNA gentle easing */;
    --duration-fast: /* e.g., 200ms */;
    --duration-default: /* e.g., 400ms */;
    --duration-slow: /* e.g., 800ms */;
    --stagger-delay: /* DNA stagger, e.g., 80ms */;
  }

  /* === BASE STYLES === */
  body {
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-family: var(--font-body);
  }

  /* Custom selection color */
  ::selection {
    background-color: color-mix(in srgb, var(--color-accent-1) 20%, transparent);
    color: var(--color-accent-1);
  }

  /* Custom scrollbar (if DNA specifies) */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--color-bg-primary);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-hover);
  }
}

/* === NOISE OVERLAY (if DNA specifies grain texture) === */
.noise-overlay {
  position: relative;
}
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
}

/* === ANIMATION KEYFRAMES (from DNA motion language) === */
@keyframes reveal {
  from { opacity: 0; transform: translateY(var(--reveal-distance, 2rem)); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes drift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -20px); }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* === SCROLL-DRIVEN ANIMATION SUPPORT === */
@keyframes scrollReveal {
  from { opacity: 0; transform: translateY(2rem); }
  to { opacity: 1; transform: translateY(0); }
}
```

## tailwind.config.ts Template

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        accent: {
          1: 'var(--color-accent-1)',
          2: 'var(--color-accent-2)',
          3: 'var(--color-accent-3)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        outer: 'var(--radius-outer)',
        inner: 'var(--radius-inner)',
        small: 'var(--radius-small)',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        elevated: 'var(--shadow-elevated)',
        float: 'var(--shadow-float)',
        glow: 'var(--shadow-glow)',
        colored: 'var(--shadow-colored)',
      },
      transitionTimingFunction: {
        default: 'var(--ease-default)',
        snappy: 'var(--ease-snappy)',
        gentle: 'var(--ease-gentle)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        default: 'var(--duration-default)',
        slow: 'var(--duration-slow)',
      },
    },
  },
  plugins: [],
}

export default config
```

## lib/motion.ts Template

Reusable Framer Motion presets generated from DNA motion language.

```typescript
// lib/motion.ts — Generated from Design DNA motion language
import type { Variants, Transition } from 'framer-motion'

// === EASING CURVES (from DNA) ===
export const easing = {
  default: [0.16, 1, 0.3, 1] as const,    // DNA default easing
  snappy: [0.3, 1.2, 0.2, 1] as const,     // DNA snappy easing
  gentle: [0.4, 0, 0.2, 1] as const,       // DNA gentle easing
}

// === TIMING (from DNA) ===
export const duration = {
  fast: 0.2,      // DNA fast duration
  default: 0.4,   // DNA default duration
  slow: 0.8,      // DNA slow duration
}

export const stagger = {
  default: 0.08,  // DNA stagger delay (seconds)
  fast: 0.04,
  slow: 0.15,
}

// === MOTION VARIANTS ===

/** Rise from below — default for text/content */
export const rise: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.default, ease: easing.default },
  },
}

/** Reveal in place — for backgrounds/ambient */
export const reveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.default, ease: easing.gentle },
  },
}

/** Expand from smaller — for cards/containers */
export const expand: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.default, ease: easing.default },
  },
}

/** Enter from left */
export const enterLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.default, ease: easing.default },
  },
}

/** Enter from right */
export const enterRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.default, ease: easing.default },
  },
}

/** Cascade container — wraps staggered children */
export const cascadeContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.default,
      delayChildren: 0.1,
    },
  },
}

/** Cascade item — child of cascadeContainer */
export const cascadeItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.fast, ease: easing.default },
  },
}

// === VIEWPORT SETTINGS ===
export const viewportOnce = { once: true, margin: '-80px' as any }

// === TRANSITION HELPERS ===
export const defaultTransition: Transition = {
  duration: duration.default,
  ease: easing.default,
}

export const slowTransition: Transition = {
  duration: duration.slow,
  ease: easing.gentle,
}
```

## components/ui/section-wrapper.tsx Template

Beat-aware section container with automatic padding from DNA spacing scale.

```tsx
import { motion } from 'framer-motion'
import { rise, reveal, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/utils'

type BeatType = 'hook' | 'tease' | 'reveal' | 'build' | 'peak' | 'breathe' | 'tension' | 'proof' | 'pivot' | 'close'

interface SectionWrapperProps {
  beat?: BeatType
  children: React.ReactNode
  className?: string
  id?: string
  background?: 'primary' | 'secondary' | 'tertiary' | 'accent'
}

const beatPadding: Record<BeatType, string> = {
  hook: 'pt-32 pb-20 md:pt-40 md:pb-28 min-h-screen flex items-center',
  tease: 'py-16 md:py-20',
  reveal: 'py-20 md:py-28',
  build: 'py-20 md:py-24',
  peak: 'py-24 md:py-32',
  breathe: 'py-28 md:py-40',
  tension: 'py-20 md:py-24',
  proof: 'py-20 md:py-24',
  pivot: 'py-20 md:py-28',
  close: 'py-24 md:py-32',
}

const bgClasses = {
  primary: 'bg-[var(--color-bg-primary)]',
  secondary: 'bg-[var(--color-bg-secondary)]',
  tertiary: 'bg-[var(--color-bg-tertiary)]',
  accent: 'bg-[var(--color-accent-1)]/5',
}

export function SectionWrapper({
  beat = 'build',
  children,
  className,
  id,
  background = 'primary',
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={beat === 'hook' ? reveal : rise}
      className={cn(
        beatPadding[beat],
        bgClasses[background],
        'relative overflow-hidden',
        className
      )}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {children}
      </div>
    </motion.section>
  )
}
```

## Font Preloading Setup (Next.js)

```tsx
// app/layout.tsx
import { /* DisplayFont, BodyFont */ } from 'next/font/google'

// Example for Clash Display + DM Sans
// Replace with actual DNA fonts
const displayFont = localFont({
  src: '../public/fonts/ClashDisplay-Variable.woff2',
  variable: '--font-display',
  display: 'swap',
  preload: true,
})

// Or with Google Fonts:
const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
```

## Wave 0 Scaffold Task List

When creating the `00-shared` section PLAN.md, include these tasks:

```markdown
<tasks>
- [auto] Create globals.css with all DNA tokens as CSS custom properties (reference design-system-scaffold skill)
- [auto] Create tailwind.config.ts extending theme with DNA tokens (reference design-system-scaffold skill)
- [auto] Create lib/motion.ts with Framer Motion presets from DNA motion language
- [auto] Create components/ui/section-wrapper.tsx beat-aware container
- [auto] Set up font preloading in app/layout.tsx with DNA fonts
- [auto] Create lib/utils.ts with cn() helper (clsx + tailwind-merge)
- [auto] Install dependencies: framer-motion, clsx, tailwind-merge
- [auto] Verify all CSS variables resolve correctly (no missing tokens)
</tasks>
```
