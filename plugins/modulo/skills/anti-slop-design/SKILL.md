---
name: anti-slop-design
description: "Core design philosophy that eliminates generic AI-slop aesthetics. Enforces premium, intentional, memorable design quality in every component."
---

Use this skill for EVERY frontend design task. This is the foundational design philosophy skill. It triggers on: design, frontend, UI, component, page, layout, build, create, make.

You are a world-class design engineer who REFUSES to produce generic, template-looking interfaces. Every pixel must feel intentional, every component must feel crafted, not generated.

## The Anti-Slop Manifesto

**AI slop** is the visual equivalent of filler text. It's technically correct but spiritually empty. You must recognize and eliminate these patterns:

### What AI Slop Looks Like (NEVER do these)

**Colors:**
- Purple-to-blue gradient on white background (the #1 AI cliche)
- Indigo/violet as default accent color
- Safe, lifeless palettes with no personality
- Generic `blue-500`, `purple-600` defaults

**Typography:**
- Inter, Roboto, Arial, system-ui as display fonts
- Same font weight everywhere (no hierarchy)
- Default line-height with no adjustment
- No letter-spacing tuning on headings

**Layout:**
- Perfectly symmetric grids with equal spacing everywhere
- Cookie-cutter card grids (3 cards, all identical padding)
- Generic hero: centered text + two buttons + stock image below
- Predictable section rhythm with no visual surprise

**Components:**
- Rounded-lg on everything with no variation
- Default shadcn styling with zero customization
- Same border-radius across all elements
- Identical card patterns repeated verbatim

**Animations:**
- `transition-all duration-300` as the only animation
- No stagger, no choreography, no surprise
- Hover effects that just darken the background

## Premium Design Principles

### 1. Color with Intent
```tsx
// BAD: Generic AI palette
className="bg-blue-600 text-white"

// GOOD: Considered, unique palette with depth
className="bg-[#0a0a0f] text-[#e8e4df]"

// GOOD: Rich gradients with uncommon color stops
className="bg-gradient-to-br from-[#1a0533] via-[#0d1b2a] to-[#0a0f1a]"

// GOOD: Accent color that has character
className="text-[#ff6f3c]"  // Warm orange instead of generic blue
className="text-[#00e5a0]"  // Vibrant mint instead of generic green
className="text-[#c4b5fd]"  // Soft lavender instead of harsh purple
```

### 2. Typography That Commands
```tsx
// Import distinctive fonts (Google Fonts or local)
// Display: Clash Display, Satoshi, Cabinet Grotesk, General Sans, Switzer, Instrument Serif
// Body: DM Sans, Plus Jakarta Sans, Outfit, Manrope

// GOOD: Tight tracking on large headings
className="text-6xl font-bold tracking-[-0.04em] leading-[0.95]"

// GOOD: Generous tracking on small labels
className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground"

// GOOD: Mixed weights for hierarchy
className="font-light text-4xl" // Light weight for elegance
className="font-black text-lg"  // Heavy weight for emphasis
```

### 3. Spatial Rhythm That Breathes
```tsx
// BAD: Same gap everywhere
className="gap-4" // Boring, no rhythm

// GOOD: Varied spacing creates rhythm
className="space-y-16" // Between major sections
className="space-y-6"  // Within sections
className="space-y-2"  // Between related elements

// GOOD: Generous whitespace for premium feel
className="py-24 md:py-32 lg:py-40" // Sections breathe
className="px-6 md:px-12 lg:px-20"  // Wide margins on desktop

// GOOD: Asymmetric padding for visual interest
className="pl-8 pr-16" // Intentional asymmetry
```

### 4. Depth and Dimension
```tsx
// Layered shadows (not just shadow-lg)
className="shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)]"

// Colored shadows that match the element
className="shadow-[0_20px_60px_-15px_rgba(255,111,60,0.3)]" // Orange glow shadow

// Elevation through background variation
className="bg-card/50 backdrop-blur-xl border border-white/[0.08]" // Frosted glass

// Overlapping elements for depth
className="relative z-10 -mt-20" // Overlap previous section
```

### 5. Micro-Details That Matter
```tsx
// Custom cursors on interactive elements
className="cursor-[url('/cursor.svg'),pointer]"

// Gradient borders
<div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.03] p-[1px]">
  <div className="rounded-2xl bg-card p-6">{children}</div>
</div>

// Text gradient for headings
className="bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent"

// Subtle noise texture overlay for tactile feel
// (add as an absolute overlay div with opacity-[0.02])

// Custom selection color
className="selection:bg-primary/20 selection:text-primary"
```

### 6. Motion with Choreography
```tsx
// BAD: Everything transitions at once
// GOOD: Staggered reveals with different timings

// Hero sequence: title -> subtitle -> CTA -> image
// Each element 100-150ms apart with different easings

// Scroll reveals: elements enter from different directions
// Cards: scale from 0.96 + opacity from 0
// Text: slide from bottom 20px + opacity from 0
// Images: slide from side 40px + opacity from 0
```

### 7. Breaking the Grid (Intentionally)
```tsx
// Elements that break out of their container
className="relative -mx-4 md:-mx-12" // Bleed beyond container

// Rotated elements for dynamism
className="rotate-[-2deg]" // Subtle tilt
className="[transform:perspective(800px)_rotateY(-5deg)]" // 3D tilt

// Overlapping grid items
className="col-span-2 -mr-8 relative z-10" // Overlap adjacent

// Diagonal dividers instead of straight lines
// Curved sections instead of rectangles
// Asymmetric two-column with 60/40 or 70/30 splits
```

## Design Audit Checklist (Before Finishing)

Ask yourself for every component:

1. **Would a human designer be proud of this?** Not just functional - beautiful.
2. **Is the color palette unique?** Not blue/purple/indigo default.
3. **Does the typography have character?** Display font ≠ body font. Weights vary.
4. **Is there spatial rhythm?** Varying spacing, not uniform `gap-4` everywhere.
5. **Is there depth?** Shadows, layers, glass, overlaps - not flat.
6. **Are there micro-details?** Gradient borders, noise textures, custom cursors.
7. **Is the motion choreographed?** Staggered, directional, not all `duration-300`.
8. **Does something break the grid?** At least one element that surprises.
9. **Would I screenshot this?** If not, it needs more work.

## Reference Aesthetics

Study these design languages:
- **Huly.io**: Dark + neon glow + glass + tight typography + colored shadows
- **Linear.app**: Monochrome elegance + subtle gradients + precision spacing
- **Vercel.com**: Dark minimalism + gradient text + dramatic whitespace
- **Stripe.com**: Color boldness + layered depth + animated gradients
- **Raycast.com**: Dark UI + vibrant accents + glass morphism + keyboard-first
- **Arc browser**: Playful color + spatial design + unexpected interactions

Every design should feel like it belongs on Dribbble's Popular page, not in a template marketplace.
