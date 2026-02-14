---
name: performance-patterns
description: "Performance optimization: Core Web Vitals, image optimization, font loading, code splitting, virtualization, bundle analysis, lazy loading. Works with Next.js and Astro."
---

Use this skill when the user mentions performance, Core Web Vitals, LCP, CLS, INP, page speed, optimization, lazy loading, bundle size, image optimization, font loading, or virtualization. Triggers on: performance, speed, Core Web Vitals, LCP, CLS, INP, optimize, lazy load, bundle, image optimization, font.

You are an expert at building high-performance web applications that score 90+ on Lighthouse.

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5 - 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | < 200ms | 200 - 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

## Image Optimization

### Next.js: next/image

```tsx
import Image from 'next/image'

// Responsive hero image (LCP candidate — priority)
<Image
  src="/hero.jpg"
  alt="Hero banner"
  width={1200}
  height={630}
  priority // Preloads — use on above-the-fold images only
  className="w-full h-auto object-cover"
  sizes="100vw"
/>

// Lazy-loaded gallery images
<Image
  src={photo.url}
  alt={photo.alt}
  width={400}
  height={300}
  className="rounded-lg"
  sizes="(max-width: 768px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={photo.blurHash} // Base64 placeholder
/>

// Avatar (small, fixed size)
<Image src={user.avatar} alt="" width={40} height={40} className="rounded-full" />
```

### Astro: Built-in Image

```astro
---
import { Image } from 'astro:assets'
import heroImage from '../assets/hero.jpg'
---

<!-- Astro auto-generates optimized formats (webp, avif) -->
<Image
  src={heroImage}
  alt="Hero banner"
  widths={[400, 800, 1200]}
  sizes="100vw"
  loading="eager"
  class="w-full h-auto"
/>

<!-- Remote images -->
<Image
  src="https://example.com/photo.jpg"
  alt="Remote photo"
  width={800}
  height={600}
  inferSize
/>
```

### Responsive Images (HTML)

```tsx
// Manual responsive images with art direction
<picture>
  <source media="(min-width: 1024px)" srcSet="/hero-desktop.webp" type="image/webp" />
  <source media="(min-width: 768px)" srcSet="/hero-tablet.webp" type="image/webp" />
  <img src="/hero-mobile.jpg" alt="Hero" className="w-full h-auto" loading="eager" fetchPriority="high" />
</picture>
```

## Font Loading Strategy

### Next.js: next/font

```tsx
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' })

// Local font (best performance)
const geist = localFont({
  src: [
    { path: '../fonts/Geist-Regular.woff2', weight: '400' },
    { path: '../fonts/Geist-Medium.woff2', weight: '500' },
    { path: '../fonts/Geist-Bold.woff2', weight: '700' },
  ],
  variable: '--font-sans',
  display: 'swap',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${geist.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

### Astro: Font Loading

```astro
---
// src/layouts/Layout.astro
---

<html>
  <head>
    <!-- Preload critical fonts -->
    <link rel="preload" href="/fonts/Geist-Regular.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/Geist-Medium.woff2" as="font" type="font/woff2" crossorigin />

    <style>
      @font-face {
        font-family: 'Geist';
        src: url('/fonts/Geist-Regular.woff2') format('woff2');
        font-weight: 400;
        font-display: swap;
      }
      @font-face {
        font-family: 'Geist';
        src: url('/fonts/Geist-Medium.woff2') format('woff2');
        font-weight: 500;
        font-display: swap;
      }
    </style>
  </head>
  <body class="font-sans">
    <slot />
  </body>
</html>
```

## Code Splitting & Lazy Loading

### Next.js: Dynamic Imports

```tsx
import dynamic from 'next/dynamic'

// Heavy component — load only when needed
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false, // Client-only
})

// Below-the-fold section
const Testimonials = dynamic(() => import('@/components/Testimonials'))

export default function Page() {
  return (
    <>
      <Hero /> {/* Always loaded */}
      <Testimonials /> {/* Split into separate chunk */}
      <HeavyChart /> {/* Loaded client-side only */}
    </>
  )
}
```

### React: Suspense + lazy

```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Astro: Islands

```astro
---
import { HeavyChart } from '../components/HeavyChart'
---

<!-- Only hydrate when visible in viewport -->
<HeavyChart client:visible />

<!-- Only hydrate on idle (after page loads) -->
<NotificationBell client:idle />

<!-- Only hydrate on media query -->
<MobileMenu client:media="(max-width: 768px)" />
```

## Virtualization (Large Lists)

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated row height
    overscan: 5,
  })

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ListItem item={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Preventing Layout Shift (CLS)

```tsx
// Always specify dimensions on images
<Image src={src} alt={alt} width={400} height={300} />

// Skeleton loading states that match final dimensions
<div className="grid grid-cols-3 gap-4">
  {isLoading
    ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
    : items.map(item => <Card key={item.id} item={item} />)
  }
</div>

// Reserve space for dynamic content
<div className="min-h-[400px]">
  <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
    <DynamicContent />
  </Suspense>
</div>

// Prevent font swap CLS
// font-display: swap + preload critical fonts
```

## Bundle Analysis

```bash
# Next.js
ANALYZE=true next build  # requires @next/bundle-analyzer

# Vite / Astro
npx vite-bundle-visualizer

# Generic
npx source-map-explorer dist/assets/*.js
```

```tsx
// next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer'

const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})({
  // ... next config
})

export default config
```

## Prefetching & Preloading

```tsx
// Next.js Link — prefetches on viewport
import Link from 'next/link'
<Link href="/dashboard" prefetch>Dashboard</Link>

// Preload critical resources
<head>
  <link rel="preload" href="/api/user" as="fetch" crossOrigin="anonymous" />
  <link rel="preconnect" href="https://api.example.com" />
  <link rel="dns-prefetch" href="https://cdn.example.com" />
</head>
```

## Best Practices

1. **LCP hero images**: Use `priority` (Next.js) or `loading="eager"` + `fetchPriority="high"`
2. **Font display: swap**: Always use `display: 'swap'` — never block rendering on fonts
3. **Code split heavy components**: Charts, editors, maps — load on demand
4. **Virtualize long lists**: 100+ items should always use `@tanstack/react-virtual`
5. **Skeleton loaders**: Match exact dimensions of loaded content to prevent CLS
6. **Astro islands**: Use `client:visible` for below-fold components, `client:idle` for non-critical
7. **Preload critical assets**: Fonts, hero images, API data the user will need immediately
8. **Measure before optimizing**: Use Lighthouse, PageSpeed Insights, Chrome DevTools Performance tab
