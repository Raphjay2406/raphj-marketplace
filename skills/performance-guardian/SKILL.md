---
name: performance-guardian
description: "Non-animation web performance: Core Web Vitals budgets, image optimization, CSS performance, bundle monitoring, and Lighthouse auditing. For animation-specific performance (code-splitting, will-change, font loading, motion budgets), see skills/performance-animation/SKILL.md."
---

Use this skill when optimizing images, auditing bundle size, checking Lighthouse scores, or reviewing CSS performance. Triggers on: performance, Core Web Vitals, Lighthouse, LCP, CLS, TBT, bundle size, image optimization, lazy loading, SSR, caching, build output.

> **Animation performance** (code-splitting, will-change, font loading, motion library budgets, reduced motion, FPS monitoring) has moved to `skills/performance-animation/SKILL.md`.

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
2. [ ] Images use `next/image` with proper sizes
3. [ ] No inline base64 images > 4KB
4. [ ] CSS `backdrop-blur` limited to 3 per viewport
5. [ ] Animation-specific checks in `performance-animation` skill applied

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

