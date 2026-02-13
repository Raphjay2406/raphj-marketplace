---
name: nextjs-app-router
description: "Next.js App Router conventions including layouts, loading states, error boundaries, server/client components, and metadata."
---

Use this skill when the user mentions Next.js, App Router, server components, client components, layouts, routing, metadata, or Next.js page structure.

You are an expert in Next.js App Router architecture and conventions.

## File Conventions

```
app/
  layout.tsx          # Root layout (required)
  page.tsx            # Home page (/)
  loading.tsx         # Loading UI (Suspense boundary)
  error.tsx           # Error boundary ('use client')
  not-found.tsx       # 404 page
  global-error.tsx    # Global error boundary ('use client')

  dashboard/
    layout.tsx        # Nested layout
    page.tsx          # /dashboard
    loading.tsx       # Dashboard loading

  blog/
    [slug]/
      page.tsx        # /blog/:slug (dynamic route)

  (marketing)/        # Route group (no URL impact)
    about/page.tsx    # /about

  @modal/             # Parallel route (named slot)
    default.tsx       # Default fallback

  api/
    route.ts          # API route handler
```

## Server vs Client Components

### Server Components (default)
```tsx
// No directive needed - server by default
// Can: fetch data, access backend, read files, use async/await
// Cannot: use hooks, browser APIs, event handlers, useState, useEffect

export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const posts = await data.json()

  return <div>{posts.map(p => <p key={p.id}>{p.title}</p>)}</div>
}
```

### Client Components
```tsx
'use client'

// Must add 'use client' directive at top
// Can: use hooks, browser APIs, event handlers, interactivity
// Cannot: be async, directly fetch without useEffect/SWR/React Query

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Composition Pattern
```tsx
// Server component with client islands
import ClientButton from './client-button'

export default async function Page() {
  const data = await getData() // Server-side fetch

  return (
    <div>
      <h1>{data.title}</h1>           {/* Server rendered */}
      <ClientButton />                 {/* Client island */}
    </div>
  )
}
```

## Layouts

```tsx
// app/layout.tsx - Root layout (required)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/dashboard/layout.tsx - Nested layout (persists across pages)
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
```

## Loading & Error States

```tsx
// app/dashboard/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[350px]" />
    </div>
  )
}

// app/dashboard/error.tsx
'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

## Metadata

```tsx
// Static metadata
export const metadata = {
  title: 'My App',
  description: 'Description of my app',
  openGraph: { title: 'My App', description: 'OG description', images: ['/og.png'] },
}

// Dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return { title: post.title, description: post.excerpt }
}
```

## Dynamic Routes

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return <article>{post.content}</article>
}

// Static generation
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

// Catch-all: app/docs/[...slug]/page.tsx
// Optional catch-all: app/docs/[[...slug]]/page.tsx
```

## API Routes

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const posts = await getPosts()
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const post = await createPost(body)
  return NextResponse.json(post, { status: 201 })
}
```

## Navigation

```tsx
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

// Declarative
<Link href="/dashboard" className="text-primary hover:underline">Dashboard</Link>

// Programmatic (client component)
const router = useRouter()
router.push('/dashboard')
router.replace('/login')
router.back()

// Active link detection
const pathname = usePathname()
<Link href="/about" className={pathname === '/about' ? 'font-bold' : ''}>About</Link>
```

## Images

```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={630}
  priority              // Preload for above-fold images
  className="rounded-lg"
/>

// Fill mode (parent needs relative positioning)
<div className="relative aspect-video">
  <Image src="/bg.jpg" alt="" fill className="object-cover" />
</div>
```

## Best Practices

1. Default to Server Components - only add `'use client'` when you need interactivity
2. Push client boundaries down - keep client components as small/leaf-level as possible
3. Use `loading.tsx` for instant loading states instead of manual Suspense
4. Use `error.tsx` for graceful error handling per route segment
5. Colocate components near their route when they're route-specific
6. Use route groups `(folder)` to organize without affecting URLs
7. Prefer `Link` over `router.push` for navigation (prefetching)
8. Use `priority` on above-the-fold `Image` components
