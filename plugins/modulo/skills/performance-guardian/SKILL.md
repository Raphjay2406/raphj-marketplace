---
name: performance-guardian
description: "Performance budgets and rules for Core Web Vitals, font loading, images, animations, code splitting, and CSS performance. Ensures award-winning design doesn't come at the cost of speed."
---

Use this skill when implementing animations, loading images, adding libraries, or during performance audits. Triggers on: performance, Core Web Vitals, Lighthouse, LCP, CLS, FID, TBT, bundle size, font loading, image optimization, code splitting, lazy loading.

You are a performance engineer who ensures that premium design ships with premium speed. A beautiful site that takes 5 seconds to load is a failed site. Performance is not optional — it's a design feature.

## Performance Budgets

| Metric | Budget | Red Line (Fail) |
|--------|--------|-----------------|
| **LCP** (Largest Contentful Paint) | < 2.0s | > 2.5s |
| **FID** (First Input Delay) | < 100ms | > 200ms |
| **CLS** (Cumulative Layout Shift) | < 0.05 | > 0.1 |
| **TBT** (Total Blocking Time) | < 200ms | > 350ms |
| **Lighthouse Performance** | 90+ | < 80 |
| **JS bundle (gzipped)** | < 200KB | > 300KB |
| **First meaningful paint** | < 1.5s | > 2.5s |
| **Time to Interactive** | < 3.0s | > 4.5s |

## Font Loading Rules

### Requirements
- **Preload display fonts** — the display font appears on hero headlines. Delay = bad LCP.
- **`font-display: swap`** — always. Never `block` (causes invisible text).
- **Variable fonts preferred** — one file, all weights. Smaller than multiple static files.
- **Subset fonts** when possible — Latin-only subset saves significant bytes.

### Implementation
```tsx
// Next.js font preloading (preferred approach)
import { DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'

const displayFont = localFont({
  src: '../public/fonts/ClashDisplay-Variable.woff2',
  variable: '--font-display',
  display: 'swap',
  preload: true,
})

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})
```

### Font Budget
| Font Role | Max Size (woff2) |
|-----------|-----------------|
| Display (variable) | < 80KB |
| Body (variable or static) | < 60KB |
| Mono (if used) | < 50KB |
| **Total fonts** | < 150KB |

## Image Rules

### Always Use Next/Image
```tsx
// GOOD — optimized, responsive, lazy by default
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Product screenshot"
  width={1200}
  height={800}
  priority // ONLY for above-fold images
  className="rounded-2xl"
/>

// BAD — no optimization
<img src="/hero.jpg" alt="Product" />
```

### Image Priorities
| Position | `priority` | `loading` |
|----------|-----------|-----------|
| **Above the fold** (hero, nav logo) | `priority` | N/A (eager) |
| **Below the fold** | — | `lazy` (default) |
| **Background/decorative** | — | `lazy` |

### Image Format Preference
1. **AVIF** — best compression, wide support (use if Next.js image optimization is on)
2. **WebP** — good compression, universal support
3. **PNG** — only for images requiring transparency without lossy compression
4. **Never JPEG** for screenshots — use WebP/AVIF

### Image Sizing Rules
- Hero images: max 1920px wide, quality 80-85
- Feature images: max 1200px wide, quality 80
- Thumbnails: max 600px wide, quality 75
- Use `sizes` prop to prevent oversized downloads:

```tsx
<Image
  src="/feature.jpg"
  alt="Feature"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
/>
```

## Animation Rules

### GPU-Friendly Properties ONLY
For animations that run during scroll or user interaction:

**ALLOWED (GPU composited):**
- `transform` (translate, scale, rotate, skew)
- `opacity`
- `filter` (blur, brightness — with caution)
- `clip-path`

**FORBIDDEN (causes layout/paint):**
- `width` / `height`
- `top` / `left` / `right` / `bottom`
- `margin` / `padding` (animated)
- `border-width`
- `font-size` (animated)
- `box-shadow` (animated — use pseudo-element with opacity instead)

### will-change Usage
```tsx
// GOOD — apply only during animation, remove after
className="will-change-transform" // Only on elements currently animating

// BAD — applied everywhere permanently
className="will-change-auto" // Wastes GPU memory
```

**Rule:** `will-change` on max 5 elements simultaneously. Remove it after animation completes.

### CSS Scroll-Driven Preferred
When available, prefer CSS `animation-timeline: view()` over JavaScript scroll listeners:

```css
/* CSS scroll-driven — zero JS, best performance */
.scroll-reveal {
  animation: reveal 1s ease both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}

/* Fallback for browsers without support */
@supports not (animation-timeline: view()) {
  .scroll-reveal {
    opacity: 1; /* Graceful degradation */
  }
}
```

### Animation Budget Per Page
| Category | Max Count |
|----------|-----------|
| Concurrent scroll-driven animations | 10 |
| GSAP ScrollTrigger instances | 5 |
| Framer Motion `whileInView` elements | 15 |
| CSS keyframe animations (continuous) | 5 |
| `backdrop-blur` elements visible | 3 |

## Code Splitting Rules

### Dynamic Import Heavy Libraries
```tsx
// GOOD — GSAP only loaded when needed
const gsap = await import('gsap')
const ScrollTrigger = (await import('gsap/ScrollTrigger')).default

// GOOD — dynamic import for below-fold sections
const HeavyComponent = dynamic(() => import('@/components/sections/heavy'), {
  loading: () => <SectionSkeleton />,
  ssr: false, // If it uses browser APIs
})

// BAD — importing everything at top level
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three' // 500KB+
```

### Lighter Framer Motion Imports
```tsx
// GOOD — import only what you need
import { motion, useScroll, useTransform } from 'framer-motion'

// BAD — importing the entire library
import * as fm from 'framer-motion'
```

### Library Size Budget
| Library | Max Budget | Notes |
|---------|-----------|-------|
| Framer Motion | ~40KB gzip | Tree-shakes well with named imports |
| GSAP + ScrollTrigger | ~30KB gzip | Dynamic import only |
| Three.js / R3F | 150KB+ gzip | MUST dynamic import, ssr: false |
| Lottie | ~50KB gzip | Dynamic import for below-fold |

## CSS Performance

### Backdrop-Blur Limits
`backdrop-blur` is expensive. Limit usage:

```tsx
// Maximum 3 backdrop-blur elements visible simultaneously
// Prefer smaller blur values (blur-md over blur-3xl)
// Combine with will-change-transform for composited layer

className="backdrop-blur-md" // OK
className="backdrop-blur-3xl" // Expensive — limit to 1-2 per viewport
```

### CSS Containment
Use `contain` on sections to limit browser repaint scope:

```tsx
// Apply to independent sections
<section className="[contain:layout_style_paint]">
  {/* Section content — repaints isolated to this container */}
</section>
```

### Isolation for Stacking Context
```tsx
// Use isolation instead of z-index battles
<div className="isolate">
  {/* Creates new stacking context without z-index */}
</div>
```

## Bundle Monitoring

### Pre-Build Checks
Before building, verify:

1. [ ] No `import *` from large libraries
2. [ ] GSAP/Three.js dynamically imported
3. [ ] Images use `next/image` with proper sizes
4. [ ] Fonts preloaded with `font-display: swap`
5. [ ] No inline base64 images > 4KB
6. [ ] CSS `backdrop-blur` limited to 3 per viewport

### Build Output Check
After build, verify:

```bash
# Check bundle size
npx next build
# Review .next/analyze (if @next/bundle-analyzer installed)

# Quick check for large chunks
ls -la .next/static/chunks/*.js | sort -k5 -n | tail -20
```

### Performance Audit Command
```bash
# Lighthouse CI
npx lighthouse http://localhost:3000 --output=json --quiet

# Check for:
# - Performance score > 90
# - LCP < 2.0s
# - CLS < 0.05
# - TBT < 200ms
```

## Performance-Safe Wow Moments

Some wow moments are inherently expensive. Use these guidelines:

| Wow Moment | Performance Impact | Mitigation |
|------------|-------------------|------------|
| Gradient mesh (ambient) | Low | CSS only, no JS |
| Magnetic buttons | Low | Transform only |
| Spotlight cards | Low | CSS custom properties |
| Parallax tilt | Medium | Limit to 6 cards |
| Text distortion | Medium | Limit to < 50 chars |
| Particle field | High | Canvas, dynamic import, ssr: false |
| 3D product viewer | High | Dynamic import, loading skeleton |
| Image sequence | Very High | Preload frames, IntersectionObserver |
| GSAP ScrollTrigger | Medium | Max 5 instances, dynamic import |

## Reduced Motion Performance Bonus
When `prefers-reduced-motion: reduce` is active, skip all animations. This:
- Reduces JS execution (no Framer Motion re-renders)
- Eliminates GPU compositing overhead
- Improves battery life on mobile
- Is an accessibility AND performance win
