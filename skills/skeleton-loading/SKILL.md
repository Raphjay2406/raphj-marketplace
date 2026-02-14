---
name: skeleton-loading
description: "Skeleton loading patterns: shimmer placeholders, content-aware skeletons, Suspense boundaries, streaming SSR shells, progressive loading, table/card/list skeletons. Works with Next.js and Astro."
---

Use this skill when the user mentions skeleton, loading state, shimmer, placeholder, suspense, streaming SSR, progressive loading, or loading skeleton. Triggers on: skeleton, loading, shimmer, placeholder, suspense, streaming, progressive load.

You are an expert at building polished loading states with shadcn/ui.

## Skeleton Primitives

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Card skeleton
function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

// Table skeleton
function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-md border">
      <div className="border-b px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-4 py-3 flex gap-4 border-b last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" style={{ width: `${60 + Math.random() * 40}%` }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// List skeleton
function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-3 w-[40%]" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Stat card skeleton
function StatCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

// Dashboard skeleton (composed)
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 rounded-lg border p-4">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
        <div className="lg:col-span-3">
          <ListSkeleton count={5} />
        </div>
      </div>
    </div>
  )
}
```

## Next.js Suspense Boundaries (loading.tsx)

```tsx
// app/dashboard/loading.tsx — auto-used as Suspense fallback
export default function DashboardLoading() {
  return <DashboardSkeleton />
}

// app/blog/loading.tsx
export default function BlogLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}
```

## Streaming SSR with Suspense

```tsx
// app/dashboard/page.tsx — stream heavy components
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Light header renders immediately */}
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stat cards stream in */}
      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      }>
        <StatCards />
      </Suspense>

      {/* Chart streams independently */}
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <RevenueChart />
      </Suspense>

      {/* Table streams independently */}
      <Suspense fallback={<TableSkeleton rows={10} cols={5} />}>
        <RecentOrders />
      </Suspense>
    </div>
  )
}
```

## Shimmer Animation (enhanced)

```tsx
// Custom shimmer skeleton with wave effect
function ShimmerSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-muted',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
        className
      )}
      {...props}
    />
  )
}

// Add to tailwind.config.ts
// animation: { shimmer: 'shimmer 2s infinite' }
// keyframes: { shimmer: { '100%': { transform: 'translateX(100%)' } } }
```

## Progressive Image Loading

```tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

function ProgressiveImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!loaded && <Skeleton className="absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  )
}
```

## Astro Loading States

```astro
---
// Astro renders static HTML — use CSS-only skeletons for initial paint
// then hydrate interactive parts with client:visible
---

<!-- CSS-only skeleton that shows before JS loads -->
<div class="skeleton-card animate-pulse">
  <div class="h-40 bg-muted rounded-md"></div>
  <div class="h-4 bg-muted rounded mt-3 w-3/4"></div>
  <div class="h-4 bg-muted rounded mt-2 w-1/2"></div>
</div>

<!-- Replace with hydrated component -->
<InteractiveCard client:visible />
```

## Best Practices

1. Match skeleton shape to actual content layout (content-aware skeletons)
2. Use `loading.tsx` in Next.js for automatic Suspense boundaries per route
3. Stream independent sections with separate `<Suspense>` wrappers
4. Skeleton should be slightly lighter than background (use `bg-muted`)
5. Use shimmer animation for premium feel, but keep it subtle
6. Never show both skeleton AND spinner — pick one (prefer skeletons)
7. Progressive image loading: skeleton -> blurred -> full
8. Grid skeletons should match the grid layout (cols, gaps)
9. For Astro: use CSS `animate-pulse` on static divs, replace with `client:visible` islands
10. Skeleton duration should be minimum 200ms to avoid flash (even if data loads fast)
