---
name: premium-typography
description: "Premium typography with distinctive fonts, variable font techniques, advanced hierarchy, letter-spacing, and type that elevates design beyond generic."
---

Use this skill when the user mentions typography, fonts, text styling, headings, type hierarchy, font pairing, or display text.

You are an expert typographer who treats every letter as a design element. Generic fonts are unacceptable.

## Distinctive Font Pairings

### Modern Sans Pairs
```tsx
// Clash Display + DM Sans (Bold geometric + Clean body)
// Cabinet Grotesk + Inter Tight (Characterful + Precise)
// Satoshi + Plus Jakarta Sans (Contemporary + Friendly)
// General Sans + Outfit (Modern + Balanced)
// Instrument Serif + Geist (Elegant contrast)
```

### Loading via Google Fonts (Next.js)
```tsx
import { DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })

const clashDisplay = localFont({
  src: './fonts/ClashDisplay-Variable.woff2',
  variable: '--font-display',
})

// In layout.tsx body:
className={`${clashDisplay.variable} ${dmSans.variable} font-body`}
```

### Tailwind Config
```js
fontFamily: {
  display: ['var(--font-display)', 'system-ui', 'sans-serif'],
  body: ['var(--font-body)', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

## Type Scale with Character

### Headlines (Tight, Commanding)
```tsx
// Hero headline: enormous, tight, heavy
className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.9]"

// Section headline: large, slightly tight
className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[0.95]"

// Card headline: medium, balanced
className="font-display text-xl md:text-2xl font-semibold tracking-[-0.02em] leading-tight"
```

### Body Text (Relaxed, Readable)
```tsx
// Large body (introductions, hero subtext)
className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"

// Standard body
className="font-body text-base text-muted-foreground leading-relaxed"

// Small body (captions, metadata)
className="font-body text-sm text-muted-foreground/70 leading-normal"
```

### Labels & Overlines
```tsx
// Overline (above section titles)
className="text-xs font-semibold tracking-[0.15em] uppercase text-primary"

// Chip/tag label
className="text-[11px] font-medium tracking-[0.05em] uppercase"

// Code/mono label
className="font-mono text-xs tracking-tight"
```

## Advanced Type Techniques

### Gradient Text
```tsx
// Bright to dim gradient
className="bg-gradient-to-br from-white via-white/80 to-white/40 bg-clip-text text-transparent"

// Colorful gradient
className="bg-gradient-to-r from-[#ff6b6b] via-[#ffd93d] to-[#6bcb77] bg-clip-text text-transparent"

// Animated gradient text
className="bg-[length:200%_auto] animate-[gradient-shift_3s_ease-in-out_infinite] bg-gradient-to-r from-[#6366f1] via-[#ec4899] to-[#6366f1] bg-clip-text text-transparent"
```

### Text with Stroke (Outlined)
```tsx
<h1 className="text-8xl font-bold [-webkit-text-stroke:2px_white] text-transparent">
  OUTLINE
</h1>
```

### Mixed Weight Headlines
```tsx
<h1 className="text-5xl tracking-tight">
  <span className="font-light">Design with</span>{' '}
  <span className="font-bold">intention</span>
</h1>
```

### Text Reveal / Highlight
```tsx
// Highlighted word
<span className="relative">
  <span className="relative z-10">important</span>
  <span className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 -rotate-1" />
</span>

// Underline accent
<span className="underline decoration-primary decoration-2 underline-offset-4">featured</span>
```

## Number Typography

```tsx
// Use tabular nums for data/stats
className="tabular-nums font-semibold text-4xl tracking-tight"

// Large stat number
className="text-6xl md:text-7xl font-bold tracking-[-0.04em] tabular-nums"

// Mono numbers for technical data
className="font-mono text-sm tabular-nums"
```

## Responsive Typography

```tsx
// Fluid type using clamp
className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight leading-[0.95]"

// Step-based responsive
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
```

## Text Balance & Wrapping

```tsx
// Balanced line breaks for headlines
className="text-balance"

// Pretty wrapping for body text
className="text-pretty"

// Max-width for readability
className="max-w-[65ch]" // Optimal line length for body text
className="max-w-[20ch]" // Short headlines
```

## Best Practices

1. **Display font and body font must be different** - contrast creates hierarchy
2. **Tighten tracking on large text** (-0.02em to -0.04em), loosen on small text (+0.05em)
3. **Reduce leading on headlines** (0.9-0.95), increase on body text (1.6-1.75)
4. **Never use more than 2-3 fonts** on a single page
5. **Use `text-balance`** on headlines to prevent orphans
6. **Use `max-w-[65ch]`** on body text for optimal readability
7. **Tabular-nums** on any numbers that change or align vertically
8. **Font weight variety** - at least 3 different weights per page (light, regular, bold)
9. **Overlines in uppercase with wide tracking** look premium above sections
10. **Test font loading** - use `font-display: swap` and proper fallbacks

## Type Scale System

Use a consistent, harmonious type scale. Recommended scales:

### Major Third (1.25 ratio) — Clean, professional
```
text-xs:   12px / 0.75rem
text-sm:   14px / 0.875rem
text-base: 16px / 1rem
text-lg:   20px / 1.25rem
text-xl:   25px / 1.563rem
text-2xl:  31px / 1.953rem
text-3xl:  39px / 2.441rem
text-4xl:  49px / 3.052rem
text-5xl:  61px / 3.815rem
```

### Perfect Fourth (1.333 ratio) — More dramatic
```
text-xs:   12px
text-sm:   14px
text-base: 16px
text-lg:   21px
text-xl:   28px
text-2xl:  38px
text-3xl:  50px
text-4xl:  67px
text-5xl:  90px
```

## Line Height Rules

```
Headings (text-3xl+):  leading-[0.9] to leading-[1.1]
Subheadings (text-xl): leading-[1.15] to leading-[1.25]
Body text:             leading-[1.5] to leading-[1.75]
Small text:            leading-[1.4] to leading-[1.5]
UI labels:             leading-none to leading-tight
```

## Letter Spacing Rules

```
Display text (60px+):  tracking-[-0.04em] to tracking-[-0.03em]
Headings (30-60px):    tracking-[-0.025em] to tracking-[-0.02em]
Subheadings:           tracking-[-0.01em]
Body text:             tracking-normal (0)
Small text:            tracking-[0.01em]
Overlines/labels:      tracking-[0.05em] to tracking-[0.1em] (uppercase)
```

## Line Length (Measure)

```
Body text:    max-w-[65ch] — optimal readability
Wide layouts: max-w-[75ch] — acceptable maximum
Narrow:       max-w-[45ch] — captions, sidebars
Headlines:    max-w-[20ch] — force impactful breaks
```

## Responsive Typography

```tsx
// Fluid type scale using clamp()
className="text-[clamp(2rem,5vw,4rem)]"
className="text-[clamp(1rem,2.5vw,1.5rem)]"

// Tailwind responsive approach
className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl"

// Reduce tracking tighter on larger screens
className="tracking-tight lg:tracking-[-0.04em]"
```

## Paragraph Spacing

```
Between paragraphs:    mt-4 (1rem) — standard
After headings:        mt-2 (0.5rem) — tighter
Before headings:       mt-8 to mt-12 — breathing room
Between sections:      mt-16 to mt-24 — clear separation
```
