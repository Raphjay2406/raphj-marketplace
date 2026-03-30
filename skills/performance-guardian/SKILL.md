---
name: performance-guardian
description: "Non-animation web performance: Core Web Vitals budgets, image optimization, CSS performance, bundle monitoring, lazy loading, caching strategies, and Lighthouse auditing. For animation-specific performance (code-splitting, will-change, font loading, motion budgets), see skills/performance-animation/SKILL.md."
tier: utility
triggers: "performance, Core Web Vitals, Lighthouse, LCP, CLS, TBT, bundle size, image optimization, lazy loading, SSR, caching, build output, route budget, INP"
version: "2.0.0"
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

---

## Genorah v2.0: Expanded Performance

### Lazy Loading Patterns

Lazy loading is the single highest-impact optimization for initial load. Every component, image, and library that can be deferred MUST be deferred.

#### Image Lazy Loading

All below-fold images MUST use native lazy loading:

```tsx
// Above the fold -- eager load with priority
<Image src="/hero.jpg" alt="Hero" width={1920} height={1080} priority />

// Below the fold -- lazy load (default in next/image, explicit in HTML)
<Image src="/feature.jpg" alt="Feature" width={1200} height={800} />
<img src="/fallback.jpg" alt="Decorative" loading="lazy" />
```

**Rule:** `loading="lazy"` on ALL below-fold images. Only hero images and nav logos get `priority`.

#### Component Lazy Loading with React.lazy + Suspense

Heavy components MUST be lazy loaded. This includes charts, 3D viewers, rich text editors, code editors, and any component over 50KB.

```tsx
import { lazy, Suspense } from 'react';

const Chart = lazy(() => import('@/components/Chart'));
const ThreeScene = lazy(() => import('@/components/ThreeScene'));
const RichEditor = lazy(() => import('@/components/RichEditor'));

export function Dashboard() {
  return (
    <>
      <Suspense fallback={<div className="h-64 animate-pulse bg-surface rounded-xl" />}>
        <Chart data={chartData} />
      </Suspense>
      <Suspense fallback={<div className="h-96 animate-pulse bg-surface rounded-xl" />}>
        <ThreeScene />
      </Suspense>
    </>
  );
}
```

#### Intersection Observer for Below-Fold Sections

Load entire sections only when they scroll into view:

```tsx
'use client';
import { useEffect, useRef, useState, lazy, Suspense } from 'react';

const HeavySection = lazy(() => import('@/sections/HeavySection'));

export function LazySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: '200px' } // preload 200px before visible
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[400px]">
      {visible ? (
        <Suspense fallback={<div className="h-96 animate-pulse bg-surface rounded-xl" />}>
          <HeavySection />
        </Suspense>
      ) : null}
    </div>
  );
}
```

#### next/dynamic for Client-Only Components

Components that use browser APIs (WebGL, Canvas, Web Audio) MUST use `next/dynamic` with `ssr: false`:

```tsx
import dynamic from 'next/dynamic';

const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-surface rounded-xl" />,
});

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });
```

#### Mandatory Dynamic Imports for Heavy Libraries

The following libraries MUST NEVER be statically imported. Always use dynamic imports:

| Library | Reason | Approx Size |
|---------|--------|-------------|
| **GSAP** | Animation runtime | ~80KB |
| **Three.js** | 3D rendering engine | ~150KB |
| **Recharts** | Charting library | ~120KB |
| **Chart.js** | Charting library | ~60KB |
| **Monaco Editor** | Code editor | ~2MB |
| **Lottie** | Animation player | ~50KB |
| **Framer Motion** (full) | Animation library | ~100KB |

```tsx
// BAD -- statically imported, blocks initial bundle
import { gsap } from 'gsap';
import * as THREE from 'three';

// GOOD -- dynamically imported, loaded on demand
const gsap = await import('gsap').then(m => m.gsap);
const THREE = await import('three');
```

---

### Caching Decision Tree

Choose the right caching strategy based on data freshness requirements:

| Need | Strategy | Revalidation |
|------|----------|-------------|
| Static pages | SSG / `generateStaticParams` | Build time |
| Periodic updates | ISR | `revalidate: N` seconds |
| Per-user dynamic | SSR (Server Components) | Every request |
| Shared expensive data | Runtime Cache | Tag-based purge |
| Static assets | CDN Cache + `Cache-Control` | TTL + tag purge |
| Component-level mixed | Cache Components (`'use cache'`) | `cacheTag` + `revalidateTag` |

#### Decision Flow

```
Is the data the same for all users?
  YES -> Does it change?
    NEVER -> SSG (generateStaticParams)
    HOURLY/DAILY -> ISR (revalidate: 3600 or 86400)
    MINUTES -> Runtime Cache with tag-based purge
  NO -> Is it sensitive?
    YES -> SSR with no-store
    NO -> SSR with short Cache-Control
```

#### ISR Example

```tsx
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // revalidate every hour

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

#### Tag-Based Cache Invalidation

```tsx
import { unstable_cache, revalidateTag } from 'next/cache';

const getProducts = unstable_cache(
  async () => fetchProducts(),
  ['products'],
  { tags: ['products'], revalidate: 600 }
);

// Purge when data changes
export async function updateProduct(id: string) {
  await db.product.update({ where: { id }, data: { ... } });
  revalidateTag('products');
}
```

---

### Bundle Optimization

#### Dynamic Imports (Mandatory)

Every route MUST stay under the 200KB budget. Dynamic imports are the primary tool:

```tsx
// Split heavy features into separate chunks
const FeaturePanel = dynamic(() => import('./FeaturePanel'));
const AdminTools = dynamic(() => import('./AdminTools'));
```

#### Tree Shaking Audit Checklist

Run this checklist during `/gen:audit`:

- [ ] No `import *` from any library
- [ ] No barrel file re-exports pulling unused modules (`import { X } from '@/components'`)
- [ ] Named imports only from utility libraries (`import { debounce } from 'lodash-es'`, NOT `import _ from 'lodash'`)
- [ ] No side-effect-only imports on unused modules
- [ ] `"sideEffects": false` in package.json where applicable
- [ ] Verify with `@next/bundle-analyzer` that no unexpected large chunks exist

#### Bundle Analyzer Integration

```bash
# Install
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

**Enforcement:** Run `@next/bundle-analyzer` during `/gen:audit`. Any route exceeding 200KB triggers a -2 penalty.

#### Font Optimization

```tsx
// GOOD -- next/font with variable font, automatic subsetting
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

// Apply in layout
<body className={`${inter.variable} ${playfair.variable}`}>
```

**Rules:**
- Variable fonts preferred over static weights (one file vs many)
- Always use `next/font` for automatic subsetting and self-hosting
- `display: 'swap'` mandatory to prevent FOIT
- Local fonts via `next/font/local` for custom typefaces

#### Image Format Enforcement

| Priority | Format | Use Case |
|----------|--------|----------|
| 1 | **AVIF** | Default for all images when Next.js optimization is active |
| 2 | **WebP** | Fallback when AVIF is not supported |
| 3 | **PNG** | Only for images requiring lossless transparency |
| **NEVER** | JPEG | Do not ship unoptimized JPEG in production |
| **NEVER** | Unoptimized | Any image without `next/image` or manual optimization |

**Penalty:** -2 per unoptimized image found in production build.

---

### CWV Budgets (Enforced in Quality Gate)

These budgets are enforced during `/gen:audit` and the anti-slop gate review. Violations trigger score penalties that affect the overall quality tier.

| Metric | Budget | Red Line | Penalty |
|--------|--------|----------|---------|
| **LCP** (Largest Contentful Paint) | < 2.0s | > 2.5s | **-3** |
| **FID/INP** (First Input Delay / Interaction to Next Paint) | < 100ms | > 200ms | **-3** |
| **CLS** (Cumulative Layout Shift) | < 0.05 | > 0.1 | **-3** |
| **Route JS bundle** (gzipped) | < 150KB | > 200KB | **-2** |
| **Unoptimized image** | 0 | any | **-2 per instance** |

#### Enforcement Rules

1. **Hard fail on red line:** Any metric past its red line triggers an automatic review blocker. The section cannot pass until fixed.
2. **Cumulative penalties:** Multiple violations stack. A page with LCP > 2.5s AND an unoptimized image receives -3 + -2 = -5.
3. **Audit timing:** CWV checks run after each wave completes, not only at final review.
4. **INP replaces FID:** As of 2024, INP is the primary responsiveness metric. Measure with `web-vitals` library or Lighthouse.

#### Quick CWV Diagnostic

```tsx
// Add to layout.tsx during development
import { onCLS, onINP, onLCP } from 'web-vitals';

if (process.env.NODE_ENV === 'development') {
  onCLS(console.log);
  onINP(console.log);
  onLCP(console.log);
}
```

### Machine-Readable Constraints (Genorah v2.0)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| LCP | — | 2.5 | seconds | HARD -- -3 penalty if exceeded |
| FID/INP | — | 200 | ms | HARD -- -3 penalty if exceeded |
| CLS | — | 0.1 | score | HARD -- -3 penalty if exceeded |
| Route bundle (gzipped) | — | 200 | KB | HARD -- -2 penalty if exceeded |
| Unoptimized images | — | 0 | count | HARD -- -2 per instance |
| Lighthouse Performance | 90 | — | score | SOFT -- warn if below |
| backdrop-blur elements | — | 3 | count | SOFT -- warn if exceeded per viewport |

