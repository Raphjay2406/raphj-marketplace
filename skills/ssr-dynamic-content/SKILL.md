---
name: "ssr-dynamic-content"
description: "SSR/ISR/streaming/Cache Components decision guidance, CMS revalidation, auth-gated rendering, and cache strategy for Next.js 16 and Astro 5/6"
tier: "domain"
triggers: "SSR, ISR, streaming, cache, revalidation, CMS webhook, draft mode, preview, auth-gated, Cache Components, use cache, cacheLife, cacheTag, Server Islands, server:defer, on-demand revalidation, stale-while-revalidate, connection pooling, serverless, dynamic rendering, static generation"
version: "1.0.0"
---

## Layer 1: Decision Guidance

You are a rendering strategy specialist for server-capable frameworks. This skill covers WHEN and HOW to apply SSR, ISR, Cache Components, streaming, and Server Islands -- the server-side rendering decisions that determine page freshness, performance, and personalization. Every pattern targets Next.js 16 (Cache Components, `"use cache"`, `cacheLife`) and Astro 5/6 (Server Islands, `server:defer`, hybrid mode). React/Vite SPAs are out of scope -- this skill assumes a server-capable framework.

### When to Use

Apply this skill when the project goes beyond fully static pages. Specific triggers:

- **Content updates more frequently than weekly** -- Needs ISR or on-demand revalidation, not full rebuilds. CMS editors publish without developer deploys.
- **Pages mix public and personalized content** -- Needs Cache Components (Next.js) or Server Islands (Astro) to serve a cached shell with per-request dynamic zones.
- **CMS-driven content that editors publish independently** -- Needs webhook revalidation to push fresh content without rebuilds.
- **Authenticated sections coexist with public pages** -- Dashboards, profiles, member pricing alongside marketing pages require rendering strategy decisions per section.
- **Pages have slow data sources** -- Needs streaming SSR with Suspense boundaries to send the shell immediately while slow queries resolve.
- **Database-driven dynamic routes with frequent data changes** -- Product catalogs, listings, inventory pages that change multiple times per day.
- **Real-time or near-real-time data display** -- Live scores, stock prices, social feeds, event schedules that must reflect current state.

### When NOT to Use

- **Fully static marketing sites** -- Standard SSG (`generateStaticParams` in Next.js, default static in Astro) is sufficient. This skill adds unnecessary complexity to pages that never change between deploys. Use `nextjs-patterns` or `astro-patterns` skill instead.
- **Client-side data fetching (SWR, TanStack Query)** -- Deferred to v2. This skill covers server-side rendering strategies only. Client-side fetching is a complementary pattern, not a replacement.
- **API endpoint creation** -- Use `api-patterns` skill. This skill covers how PAGES render, not how API routes work. Webhook Route Handlers are the exception (they bridge CMS to cache invalidation).
- **Authentication UX (login, signup, sessions)** -- Use `auth-ui` skill (future). This skill covers how auth state affects RENDERING decisions, not auth flows themselves.
- **CMS data modeling or content fetching** -- Use `cms-integration` skill (future). This skill covers the REVALIDATION pipeline after CMS content changes, not how to fetch CMS data.

### Rendering Strategy Decision Matrix

The core framework for choosing a rendering strategy. Evaluate the page along 4 dimensions, then follow the decision logic.

**Dimension 1: Data Freshness**

| Level | Definition | Example |
|-------|-----------|---------|
| Static | Content set at build time, changes only on deploy | Legal pages, docs, about |
| Stale-OK | Tolerates minutes to hours of staleness | Blog posts, product info, pricing |
| Near-real-time | Must update within seconds to minutes | News feeds, stock levels, schedules |
| Real-time | Must reflect current state per request | Dashboards, live scores, chat |

**Dimension 2: Personalization**

| Level | Definition | Example |
|-------|-----------|---------|
| None | Same content for all visitors | Marketing pages, blog, docs |
| Segment-based | Varies by group (locale, A/B, plan tier) | Localized pricing, feature flags |
| User-specific | Unique per authenticated user | Dashboard, profile, cart, member pricing |

**Dimension 3: Build Frequency**

| Level | Definition | Example |
|-------|-----------|---------|
| Rarely | Deploy-triggered only | Documentation, legal |
| Daily | Scheduled rebuilds or periodic revalidation | News aggregators, weekly blogs |
| Continuous | CMS-driven, updates arrive at any time | Editorial content, product catalogs |

**Dimension 4: Runtime**

| Level | Definition | Constraint |
|-------|-----------|-----------|
| Node.js only | Full server capabilities | Required for Cache Components, ISR, `proxy.ts`, DB connections |
| Edge-compatible | Limited runtime, global distribution | No `"use cache"`, no ISR, no `proxy.ts`, no direct DB |
| Static hosting | No server at all | SSG only, no server-side rendering |

**Decision Logic**

| Data Freshness | Personalization | Runtime | Strategy (Next.js 16) | Strategy (Astro 5/6) |
|----------------|-----------------|---------|----------------------|----------------------|
| Static | None | Any | SSG (`generateStaticParams`) | Default static |
| Stale-OK | None | Node.js | Cache Components (`"use cache"` + `cacheLife`) | Static + `Cache-Control` headers on SSR pages |
| Stale-OK | Segment | Node.js | Cache Components with segment as cache key argument | Static per-locale + Server Island for segment-specific content |
| Stale-OK/RT | User-specific | Node.js | Cache Components shell + `<Suspense>` for auth content | Static shell + Server Island (`server:defer`) for auth content |
| Real-time | User-specific | Node.js | Full SSR with Suspense boundaries, no cache | Full SSR (`prerender = false`) |
| Near-real-time | None | Node.js | Cache Components + `cacheLife('minutes')` or `cacheLife('seconds')` | SSR + short `Cache-Control` (e.g., `s-maxage=60`) |
| Any | Any | Edge | SSR without Cache Components (Edge does NOT support `"use cache"` or ISR) | N/A (Astro does not target Edge) |
| Static | None | Static hosting | SSG only | Default static (Astro's strength) |

**Key rule:** If the page uses Cache Components, `"use cache"`, on-demand revalidation, `proxy.ts`, or direct database connections, it MUST use Node.js runtime. Edge is only for simple Route Handlers doing fetch-based proxying or redirects.

### Named Scenario Recipes

Practical scenarios mapping project types to rendering strategies. Each recipe identifies the data profile, recommended strategy per framework, and one critical implementation note.

#### 1. Blog / CMS Editorial

- **Data profile:** Stale-OK (hours) | No personalization | Continuous (CMS-driven)
- **Next.js 16:** Cache Components with `cacheLife('hours')` + `cacheTag('posts')` + webhook Route Handler calling `revalidateTag('posts', 'max')` on CMS publish
- **Astro:** Static build with ISR-equivalent via `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` on SSR pages
- **Key note:** Wire CMS webhook to both cache invalidation AND sitemap/IndexNow update (see `search-visibility` skill)

#### 2. E-commerce Product Page (PDP)

- **Data profile:** Stale-OK (product info) | User-specific (pricing/cart) | Continuous
- **Next.js 16:** Cache Components shell for product info (`cacheLife('hours')`) + `<Suspense>` for personalized pricing (streams per-request)
- **Astro:** Static product page + Server Island (`server:defer`) for cart widget and member pricing
- **Key note:** Product info and personalized pricing are different rendering zones -- never cache user-specific data in the shared product cache

#### 3. Dashboard / Admin Panel

- **Data profile:** Real-time | User-specific | Continuous
- **Next.js 16:** Full SSR with Suspense boundaries around slow data sources, no cache. Auth check in top-level Server Component.
- **Astro:** Full SSR (`prerender = false`), auth check in page frontmatter, no caching
- **Key note:** Do NOT use Cache Components for dashboards. Every request must hit the server for fresh, user-specific data.

#### 4. Marketing Landing Page

- **Data profile:** Static | No personalization | Rarely updated (deploy-triggered)
- **Next.js 16:** SSG with `generateStaticParams`. No Cache Components needed.
- **Astro:** Default static (Astro's ideal use case)
- **Key note:** This scenario does NOT need this skill. Use `nextjs-patterns` or `astro-patterns` directly.

#### 5. User Profile / Settings

- **Data profile:** Real-time (per-request) | User-specific
- **Next.js 16:** Full SSR. Auth check in Server Component via `auth()` (Auth.js) or equivalent. No caching.
- **Astro:** Full SSR with auth check in page frontmatter. Server Islands for sections that load independently.
- **Key note:** Profile pages often have multiple independent data sources (account info, billing, preferences) -- use separate Suspense boundaries for each.

#### 6. API-Driven Feed (News, Social)

- **Data profile:** Near-real-time (minutes) | No personalization
- **Next.js 16:** Cache Components with `cacheLife('minutes')` or `cacheLife('seconds')` depending on required freshness
- **Astro:** SSR page with `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- **Key note:** For feeds that update every few seconds, `cacheLife('seconds')` gives a 30s stale window -- acceptable for most news/social feeds.

#### 7. SaaS Pricing Page

- **Data profile:** Stale-OK | Segment-based (locale, plan tier)
- **Next.js 16:** Cache Components with locale and plan tier as function arguments (each combination gets its own cache entry)
- **Astro:** Static per-locale page + Server Island for plan-specific pricing widget
- **Key note:** Pass the segment identifier (locale, plan) as an argument to the cached function -- it becomes part of the cache key automatically.

#### 8. Documentation Site

- **Data profile:** Static | No personalization | Rarely updated (deploy-triggered)
- **Next.js 16:** SSG with `generateStaticParams`
- **Astro:** Default static (Astro is the ideal framework for documentation)
- **Key note:** Like marketing pages, docs do not need this skill. Use framework-native SSG.

#### 9. Marketplace Listing

- **Data profile:** Stale-OK (product) | Near-real-time (availability/stock) | Continuous
- **Next.js 16:** Cache Components for product info (`cacheLife('hours')`) + `<Suspense>` for live stock count (per-request or `cacheLife('seconds')`)
- **Astro:** Static product page + Server Island for stock availability badge
- **Key note:** Separate product info (slow-changing) from stock/availability (fast-changing) into different rendering zones with different cache lifetimes.

#### 10. Event / Conference Page

- **Data profile:** Near-real-time (schedule) | CMS-driven | No personalization
- **Next.js 16:** Cache Components with `cacheLife('minutes')` + `cacheTag('schedule')` + webhook revalidation on schedule updates
- **Astro:** Hybrid mode with SSR schedule component + `Cache-Control` headers for short caching
- **Key note:** Event schedules change unpredictably (speaker cancellations, room changes) -- use webhook revalidation rather than time-based, with a short `cacheLife` as the safety net.

### Next.js 16 Cache System Breakdown

Next.js 16 has 4 distinct cache layers. Understanding all 4 is essential for debugging stale content and configuring invalidation correctly.

```
Request Flow:
                                          SERVER                              CLIENT
                                          ------                              ------
  Browser Request
       |
       v
  [Router Cache] <-- Client-side, survives navigation, min 30s stale
       |
       | (cache miss or stale)
       v
  [Full Route Cache] <-- Pre-rendered HTML + RSC payload
       |
       | (cache miss or invalidated)
       v
  [Data Cache] <-- Persistent server storage (survives restarts/deploys)
       |
       | (during render, automatic)
       v
  [Request Memoization] <-- Deduplicates identical fetches within one render
```

#### Layer 1: Request Memoization

Deduplicates identical `fetch` calls within a single render pass. If two Server Components request the same URL with the same options, only one network request is made. Automatic, per-request, no configuration needed. Scope: one render only -- does not persist across requests.

#### Layer 2: Data Cache

Persistent server-side storage for cached data. This is what `"use cache"` + `cacheLife` controls. Survives server restarts and deploys. Cache entries are tagged via `cacheTag` and invalidated via `revalidateTag` or `updateTag`. When a Data Cache entry is invalidated, the Full Route Cache for routes that depend on it is also invalidated.

#### Layer 3: Full Route Cache

Pre-rendered HTML and RSC payload stored on the server. Built at deploy time for static routes. For Cache Components routes, the static shell is cached here and dynamic zones are filled per-request. Depends on Data Cache -- when Data Cache invalidates, Full Route Cache also invalidates for affected routes.

#### Layer 4: Router Cache

Client-side cache of visited routes. Survives navigation between pages within the same browser session. Has a minimum 30-second stale time -- even after server-side invalidation, the client may show stale content for up to 30 seconds. Cleared only by:
- `router.refresh()` -- programmatic, current route only
- Hard browser refresh (Cmd/Ctrl + R)
- Page reload / new tab

**Critical insight:** Invalidating server caches (Data Cache, Full Route Cache) does NOT clear Router Cache. If a CMS editor publishes content and you call `revalidateTag`, the next NEW visitor sees fresh content, but an already-browsing user may see stale content for up to 30 seconds. Call `router.refresh()` in the client after server-side mutations if immediate freshness is required.

#### Invalidation API Summary

| API | Where to Call | Behavior | Use Case |
|-----|--------------|----------|----------|
| `revalidateTag(tag, 'max')` | Route Handlers (webhooks) | Stale-while-revalidate: marks entry as stale, serves stale while regenerating in background | CMS publishes content, next visitor gets fresh |
| `updateTag(tag)` | Server Actions | Immediate expiry: removes cache entry, next request regenerates from scratch | Editor saves and needs to see their change immediately |
| `revalidatePath(path)` | Route Handlers, Server Actions | Path-based invalidation (all cache entries for that path) | Simpler alternative when tags are not used |
| `router.refresh()` | Client Components | Clears Router Cache for current route, re-fetches from server | After server-side mutation, ensure client sees fresh data |

**When to use which:**
- **Webhook from CMS** -> `revalidateTag(tag, 'max')` in a Route Handler (SWR: fast response, background regeneration)
- **User saves their own content** -> `updateTag(tag)` in a Server Action (immediate: user sees their change on redirect)
- **Need client freshness** -> `router.refresh()` after the Server Action completes

### Edge vs Node.js Runtime Constraints

| Capability | Node.js Runtime | Edge Runtime |
|------------|----------------|--------------|
| Cache Components (`"use cache"`) | Yes | **No** |
| ISR / On-demand revalidation | Yes | **No** |
| `proxy.ts` | Yes (default) | **No** (removed in v16) |
| `crypto` module (Node.js) | Yes | **No** (use Web Crypto API) |
| File system access (`fs`) | Yes | **No** |
| Database connections (pg, mysql) | Yes | **No** (use HTTP-based like Neon serverless) |
| `require()` | Yes | **No** (ES Modules only) |
| Dynamic code evaluation (`eval`) | Yes | **No** |
| Streaming SSR | Yes | Yes |
| `fetch()` | Yes | Yes |
| Web Crypto API | Yes | Yes |
| `process.env` | Yes | Yes |
| Route Handlers | Yes | Yes (limited) |

**Decision rule:** Default to Node.js runtime. Use Edge runtime ONLY for simple Route Handlers that do fetch-based API proxying or URL redirects with no database access, no cache operations, and no `proxy.ts` dependency.

### Streaming SSR Concept

Streaming SSR sends the HTML shell immediately while slow data sources resolve. The browser receives and renders the static parts of the page (navigation, layout, headings) first, providing a fast Time to First Byte (TTFB). Each data-fetching component is wrapped in a React `<Suspense>` boundary with a fallback UI (skeleton, spinner). As each data source resolves, the server streams the resolved HTML to the browser, which swaps out the fallback with the real content -- no client-side JavaScript required for the swap.

Place Suspense boundaries around data-fetching Server Components, NOT around static UI. Each boundary is an independent streaming unit. Astro streams by default in SSR mode; for static pages, use Server Islands (`server:defer`) instead of Suspense -- they achieve the same result but as separate HTTP requests after the static shell loads. The key tradeoff: more Suspense boundaries means faster initial paint but more potential layout shifts. Group related slow data sources under a single boundary when they should appear together.

### `cacheLife` Preset Profiles

Next.js 16 provides 7 built-in `cacheLife` profiles that control how long cached content stays fresh.

| Profile | Use Case | `stale` | `revalidate` | `expire` |
|---------|----------|---------|--------------|----------|
| `default` | Standard content | 5 min | 15 min | never |
| `seconds` | Real-time data (stock prices, live scores) | 30s | 1s | 1 min |
| `minutes` | Frequently updated (social feeds, news) | 5 min | 1 min | 1 hour |
| `hours` | Multiple daily updates (product inventory) | 5 min | 1 hour | 1 day |
| `days` | Daily updates (blog posts, articles) | 5 min | 1 day | 1 week |
| `weeks` | Weekly updates (podcasts, newsletters) | 5 min | 1 week | 30 days |
| `max` | Rarely changes (legal pages, archives) | 5 min | 30 days | 1 year |

- **`stale`** -- Duration the client can serve cached content without checking the server
- **`revalidate`** -- Duration the server can serve cached content while regenerating in the background (SWR window)
- **`expire`** -- Maximum time before the cached entry is fully removed

**Custom profiles** are defined in `next.config.ts`:

```typescript
// next.config.ts
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    'cms-content': {
      stale: 300,       // 5 min client-side
      revalidate: 900,  // 15 min server-side
      expire: 86400,    // 1 day max
    },
  },
}
export default nextConfig
```

Use custom profiles when the 7 presets do not match your content update frequency. Reference them by name: `cacheLife('cms-content')`.

### Pipeline Connection

- **Referenced by:** section-builder (when generating pages with dynamic data), specialist agents (when configuring cache and revalidation)
- **Consumed at:** `/modulo:plan-dev` for rendering strategy selection per section, `/modulo:execute` Wave 0 for `next.config.ts` cache setup and Wave 2+ for section-specific rendering patterns
- **Input from:** `/modulo:start-project` (project requirements identify data freshness, CMS platform, auth needs). Design DNA provides no direct tokens -- this is a server-side concern.
- **Output to:** Page components with appropriate cache directives, webhook Route Handlers, `next.config.ts` cache configuration, Astro page files with prerender/SSR settings

## Layer 2: Award-Winning Examples

Copy-paste-ready code patterns for the core rendering strategies. Each pattern includes a brief explanation of the principle followed by the implementation. CMS-specific revalidation webhooks and auth-gated content patterns are in Layer 2B (added by Plan 02).

### A. Next.js 16 Cache Components Setup

#### Pattern 1: next.config.ts with Cache Components Enabled

Enable Cache Components with one config flag. Optionally define custom `cacheLife` profiles for content types that do not match the 7 built-in presets.

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,

  // Optional: custom cacheLife profiles
  cacheLife: {
    'cms-content': {
      stale: 300,       // 5 min -- client serves cached without server check
      revalidate: 900,  // 15 min -- server serves stale while regenerating
      expire: 86400,    // 1 day -- hard expiry, forces regeneration
    },
    'product-inventory': {
      stale: 30,        // 30s client cache
      revalidate: 60,   // 1 min server SWR window
      expire: 3600,     // 1 hour hard expiry
    },
  },
}

export default nextConfig
```

**Key rules:**
- `cacheComponents: true` replaces the old `experimental: { ppr: true }` -- do NOT use the experimental flag
- Custom profiles are referenced by name: `cacheLife('cms-content')`
- The 7 built-in profiles (`seconds`, `minutes`, `hours`, `days`, `weeks`, `max`, `default`) are always available without configuration

#### Pattern 2: Cache Components Hybrid Page

The canonical Cache Components pattern: a page with three rendering zones. The static shell (header, layout) is prerendered at build time. Cached dynamic content uses `"use cache"` with a `cacheLife` profile and `cacheTag` for invalidation. Per-request content streams via `<Suspense>` for user-specific data.

```tsx
// app/blog/page.tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'
import { db } from '@/lib/db'
import { PostCard } from '@/components/post-card'
import { UserPreferencesSkeleton } from '@/components/skeletons'

// Page component -- the shell is static, rendered at build time
export default function BlogPage() {
  return (
    <>
      {/* Zone 1: Static shell -- prerendered into HTML at build time */}
      <header>
        <h1>Our Blog</h1>
        <p>Thoughts on design, engineering, and building for the web.</p>
      </header>

      {/* Zone 2: Cached dynamic content -- shared across all visitors */}
      <BlogPosts />

      {/* Zone 3: Per-request content -- streams at request time */}
      <Suspense fallback={<UserPreferencesSkeleton />}>
        <UserPreferences />
      </Suspense>
    </>
  )
}

// CACHED: Everyone sees the same posts. Revalidated hourly via cacheLife,
// or on-demand via revalidateTag('blog-posts', 'max') from a CMS webhook.
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  cacheTag('blog-posts')

  const posts = await db.post.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 10,
    select: { id: true, title: true, excerpt: true, slug: true, publishedAt: true },
  })

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  )
}

// PER-REQUEST: Reads cookies (personalized), cannot be cached.
// Streams after the static shell and cached posts are already visible.
async function UserPreferences() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value ?? 'light'
  const fontSize = cookieStore.get('font-size')?.value ?? 'base'

  return (
    <aside className="rounded-lg border p-4">
      <p>Your reading preferences: {theme} theme, {fontSize} text</p>
    </aside>
  )
}
```

**Critical rules:**
- `"use cache"` CANNOT access `cookies()`, `headers()`, or `searchParams` -- read them outside the cached function and pass as arguments
- `cacheLife` accepts preset profiles: `'seconds'`, `'minutes'`, `'hours'`, `'days'`, `'weeks'`, `'max'`
- `cacheTag` enables on-demand invalidation via `revalidateTag` (SWR) or `updateTag` (immediate)
- Cache Components requires **Node.js runtime** -- Edge is NOT supported
- The cache key is auto-generated from the function identity + serialized arguments + build ID

#### Pattern 3: On-Demand Invalidation (Server Action vs Route Handler)

Two companion patterns for cache invalidation. Use `updateTag` in Server Actions for read-your-own-writes (editor sees their change immediately). Use `revalidateTag` with `'max'` in Route Handlers for webhook-triggered stale-while-revalidate (next visitor gets fresh content while current visitors see stale briefly).

```typescript
// app/actions/content.ts -- Server Action: immediate invalidation
'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

export async function updateBlogPost(formData: FormData) {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await db.post.update({
    where: { id },
    data: { title, content, updatedAt: new Date() },
  })

  // updateTag: IMMEDIATE expiry -- the editor will see their change on redirect
  updateTag('blog-posts')
  updateTag(`post-${id}`)

  redirect(`/blog/${id}`)
}
```

```typescript
// app/api/revalidate/route.ts -- Route Handler: SWR invalidation
import { revalidateTag } from 'next/cache'
import { createHmac, timingSafeEqual } from 'crypto'

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-webhook-signature')

  if (!signature || !verifySignature(body, signature, process.env.CMS_WEBHOOK_SECRET!)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = JSON.parse(body) as { collection: string; slug: string }

  // revalidateTag with 'max': STALE-WHILE-REVALIDATE
  // Serves stale content to current visitors while regenerating in background.
  // Next NEW request after regeneration gets fresh content.
  revalidateTag(payload.collection, 'max')
  revalidateTag(`${payload.collection}-${payload.slug}`, 'max')

  // SEO bridge: also revalidate sitemap (see search-visibility skill)
  revalidateTag('sitemap', 'max')

  return Response.json({ revalidated: true, collection: payload.collection })
}
```

**Key difference:**
- `updateTag(tag)` = **immediate expiry**. Cache entry is removed. Next request regenerates from scratch. Use in Server Actions where the user needs to see their own change.
- `revalidateTag(tag, 'max')` = **stale-while-revalidate**. Cache entry is marked stale. Current request gets stale content. Background regeneration starts. Next request gets fresh content. Use in Route Handlers for webhook-triggered updates where brief staleness is acceptable.

### B. Astro Server Islands and SSR

#### Pattern 4: Astro Server Island Component

A component that runs server-side per-request within a static page. Server Islands are fetched as separate requests after the static shell loads -- they do NOT stream in the initial response like React Suspense.

```astro
---
// src/components/UserGreeting.astro
// This component runs on the server PER REQUEST (not at build time)
import { getSession } from '@/lib/auth'

const session = await getSession(Astro.cookies)
---

{session ? (
  <div class="flex items-center gap-2">
    <img src={session.user.avatar} alt="" class="h-8 w-8 rounded-full" />
    <p>Welcome back, {session.user.name}</p>
  </div>
) : (
  <a href="/login" class="text-primary underline">Sign in</a>
)}
```

#### Pattern 5: Astro Static Page with Server Islands

A product page that is statically generated at build time, but defers two components to server-side per-request rendering. The static shell (product name, description, images) loads instantly. The Server Islands (user greeting, reviews) load shortly after as separate HTTP requests.

```astro
---
// src/pages/product/[id].astro
import BaseLayout from '@/layouts/BaseLayout.astro'
import UserGreeting from '@/components/UserGreeting.astro'
import ProductReviews from '@/components/ProductReviews.astro'
import { getProduct } from '@/lib/products'

export const prerender = true // Static page in hybrid mode

const { id } = Astro.params
const product = await getProduct(id!)
if (!product) return Astro.redirect('/404')
---

<BaseLayout title={product.name}>
  {/* Static shell -- rendered at build time, cached by CDN */}
  <h1 class="text-4xl font-bold">{product.name}</h1>
  <p class="text-lg text-muted">{product.description}</p>
  <img src={product.image} alt={product.name} width={800} height={600} />
  <p class="text-2xl font-semibold">${product.price}</p>

  {/* Server Island: fetched per-request after static shell loads */}
  <UserGreeting server:defer>
    <p slot="fallback" class="animate-pulse text-muted">Loading...</p>
  </UserGreeting>

  {/* Server Island: fetched per-request, shows fresh reviews */}
  <ProductReviews server:defer productId={product.id}>
    <div slot="fallback" class="animate-pulse space-y-4">
      <div class="h-20 rounded bg-surface" />
      <div class="h-20 rounded bg-surface" />
    </div>
  </ProductReviews>
</BaseLayout>
```

**Key differences from Next.js Cache Components:**
- Server Islands are fetched as **separate HTTP requests** after the static shell loads (NOT streamed in a single response like Suspense)
- No built-in `cacheLife` profiles -- caching is done via CDN `Cache-Control` headers
- No built-in tag-based revalidation -- use CDN purge APIs or full rebuild
- `server:defer` is the directive; `slot="fallback"` provides the loading state

#### Pattern 6: Astro ISR-Equivalent via Cache-Control Headers

Astro does NOT have built-in ISR. ISR-like behavior is achieved by setting `Cache-Control` headers on SSR pages, which instructs the CDN to cache and revalidate. This is a standard HTTP caching pattern that works with any CDN (Vercel, Cloudflare, Netlify).

```astro
---
// src/pages/blog/[slug].astro
export const prerender = false // SSR page (not static)

import BaseLayout from '@/layouts/BaseLayout.astro'
import { db } from '@/lib/db'

const { slug } = Astro.params
const post = await db.post.findUnique({ where: { slug } })

if (!post) return new Response(null, { status: 404 })

// ISR-equivalent: CDN caches for 1 hour, serves stale for 24 hours while revalidating
Astro.response.headers.set(
  'Cache-Control',
  'public, s-maxage=3600, stale-while-revalidate=86400'
)
---

<BaseLayout title={post.title}>
  <article>
    <h1>{post.title}</h1>
    <time datetime={post.publishedAt.toISOString()}>
      {post.publishedAt.toLocaleDateString()}
    </time>
    <div set:html={post.content} />
  </article>
</BaseLayout>
```

**Important:** `s-maxage` controls CDN cache duration (shared cache). `max-age` controls browser cache duration. For ISR-equivalent behavior, use `s-maxage` (CDN) with `stale-while-revalidate` (background refresh). Do NOT set long `max-age` values on dynamic content -- the browser will not check for updates.

### C. Streaming SSR

#### Pattern 7: Streaming SSR with Suspense Boundaries (Next.js)

A dashboard page demonstrating strategic Suspense boundary placement. The static header arrives immediately. Fast data (user info) streams in one boundary. Slow data (external API analytics) streams in another with a skeleton fallback. Place boundaries around data-fetching components, not around static UI.

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import {
  UserInfoSkeleton,
  AnalyticsSkeleton,
  NotificationsSkeleton,
} from '@/components/skeletons'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="space-y-8">
      {/* Static: renders immediately, no data fetching */}
      <header>
        <h1>Dashboard</h1>
        <p>Welcome back, {session.user.name}</p>
      </header>

      {/* Suspense boundary 1: Fast data (database query, ~50ms) */}
      <Suspense fallback={<UserInfoSkeleton />}>
        <UserInfo userId={session.user.id} />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Suspense boundary 2: Slow external API (~800ms) */}
        <Suspense fallback={<AnalyticsSkeleton />}>
          <AnalyticsOverview userId={session.user.id} />
        </Suspense>

        {/* Suspense boundary 3: Medium speed (~200ms) */}
        <Suspense fallback={<NotificationsSkeleton />}>
          <RecentNotifications userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  )
}

// Fast: direct database query
async function UserInfo({ userId }: { userId: string }) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true, usage: true, billingDate: true },
  })
  return (
    <section className="rounded-lg border p-6">
      <h2>Account</h2>
      <p>Plan: {user?.plan} | Usage: {user?.usage}%</p>
      <p>Next billing: {user?.billingDate?.toLocaleDateString()}</p>
    </section>
  )
}

// Slow: external analytics API
async function AnalyticsOverview({ userId }: { userId: string }) {
  const data = await fetch(`https://analytics.example.com/api/overview?user=${userId}`, {
    cache: 'no-store', // Always fresh for dashboards
  }).then((r) => r.json())

  return (
    <section className="rounded-lg border p-6">
      <h2>Analytics</h2>
      <p>Page views: {data.pageViews.toLocaleString()}</p>
      <p>Visitors: {data.visitors.toLocaleString()}</p>
    </section>
  )
}

// Medium: database query with join
async function RecentNotifications({ userId }: { userId: string }) {
  const notifications = await db.notification.findMany({
    where: { userId, read: false },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
  return (
    <section className="rounded-lg border p-6">
      <h2>Notifications ({notifications.length})</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>{n.message}</li>
        ))}
      </ul>
    </section>
  )
}
```

**Alternative: Route-level loading state.** Instead of per-component Suspense, create `app/dashboard/loading.tsx` for a route-level skeleton that shows while the entire page loads. Use this for simpler pages; use per-component Suspense for pages with mixed-speed data sources.

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 w-48 rounded bg-surface" />
      <div className="h-40 rounded bg-surface" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-40 rounded bg-surface" />
        <div className="h-40 rounded bg-surface" />
      </div>
    </div>
  )
}
```

### D. Draft Preview Mode

#### Pattern 8: Next.js 16 Draft Mode -- Enable Route

Route Handler that validates a CMS preview secret, verifies the slug exists in the CMS, enables draft mode, and redirects to the page. In Next.js 16, `draftMode()` is **async** -- always `await` it.

```typescript
// app/api/draft/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { cmsClient } from '@/lib/cms'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // 1. Validate the preview secret
  if (secret !== process.env.CMS_PREVIEW_SECRET || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  // 2. Verify the slug exists in CMS (prevents open redirect)
  const page = await cmsClient.getPageBySlug(slug)
  if (!page) {
    return new Response('Invalid slug', { status: 404 })
  }

  // 3. Enable Draft Mode (ASYNC in Next.js 16)
  const draft = await draftMode()
  draft.enable()

  // 4. Redirect to the page -- use the CMS-returned slug, NOT the query param
  redirect(page.slug)
}
```

#### Pattern 9: Next.js 16 Draft Mode -- Disable Route

Simple Route Handler to exit draft mode. Link to this from the draft mode banner in the UI.

```typescript
// app/api/draft/disable/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}
```

#### Pattern 10: Draft-Aware Server Component

A blog post page that checks draft mode status and fetches draft or published content accordingly. Includes a visible banner when in draft mode so editors know they are previewing unpublished content.

```tsx
// app/blog/[slug]/page.tsx
import { draftMode } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'
import { cmsClient } from '@/lib/cms'
import { notFound } from 'next/navigation'

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { isEnabled: isDraft } = await draftMode()

  // Draft mode: fetch unpublished content, no caching
  // Published mode: fetch published content, cached
  const post = isDraft
    ? await cmsClient.getDraft(slug)
    : await getCachedPost(slug)

  if (!post) notFound()

  return (
    <>
      {isDraft && (
        <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-sm text-yellow-900">
          <strong>Draft Mode</strong> -- You are viewing unpublished content.{' '}
          <a href="/api/draft/disable" className="underline">
            Exit preview
          </a>
        </div>
      )}
      <article className="prose mx-auto">
        <h1>{post.title}</h1>
        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
        {/* CMS content is trusted HTML -- sanitized by CMS before storage */}
        <div>{post.contentHtml}</div>
      </article>
    </>
  )
}

// Cached version for published content
async function getCachedPost(slug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`post-${slug}`)

  return cmsClient.getPublished(slug)
}
```

#### Pattern 11: Astro Draft Preview Pattern

Astro does not have built-in Draft Mode. Use a cookie-based preview mechanism: (a) a preview API endpoint sets a cookie and redirects, (b) pages check the cookie to decide draft vs published, (c) an exit-preview endpoint clears the cookie.

```typescript
// src/pages/api/preview.ts -- Enable preview (Astro API route)
import type { APIRoute } from 'astro'
import { cmsClient } from '@/lib/cms'

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const secret = url.searchParams.get('secret')
  const slug = url.searchParams.get('slug')

  if (secret !== import.meta.env.CMS_PREVIEW_SECRET || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  const page = await cmsClient.getPageBySlug(slug)
  if (!page) {
    return new Response('Invalid slug', { status: 404 })
  }

  // Set preview cookie (httpOnly, secure, 1 hour expiry)
  cookies.set('preview-mode', 'true', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 3600,
  })

  return redirect(page.slug)
}
```

```typescript
// src/pages/api/preview-exit.ts -- Disable preview
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('preview-mode', { path: '/' })
  return redirect('/')
}
```

```astro
---
// src/pages/blog/[slug].astro -- Draft-aware page
export const prerender = false // Must be SSR for cookie access

import BaseLayout from '@/layouts/BaseLayout.astro'
import { cmsClient } from '@/lib/cms'

const { slug } = Astro.params
const isDraft = Astro.cookies.get('preview-mode')?.value === 'true'

const post = isDraft
  ? await cmsClient.getDraft(slug!)
  : await cmsClient.getPublished(slug!)

if (!post) return new Response(null, { status: 404 })

// No caching for draft content; cache published content
if (!isDraft) {
  Astro.response.headers.set(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400'
  )
}
---

<BaseLayout title={post.title}>
  {isDraft && (
    <div class="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-sm text-yellow-900">
      <strong>Draft Mode</strong> -- You are viewing unpublished content.
      <a href="/api/preview-exit" class="underline">Exit preview</a>
    </div>
  )}
  <article class="prose mx-auto">
    <h1>{post.title}</h1>
    <time datetime={post.publishedAt}>{post.publishedAt}</time>
    <div set:html={post.content} />
  </article>
</BaseLayout>
```

### E. Connection Pooling for Serverless

#### Pattern 12: Neon Serverless Connection (HTTP-based)

Neon provides a native HTTP-based driver for serverless environments. The pooled connection string uses a hostname with `-pooler` suffix. No TCP connection overhead -- each query is an HTTP request.

```typescript
// lib/db.ts -- Neon with Drizzle ORM (recommended for serverless)
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Connection string uses pooled hostname: *.us-east-2.aws.neon.tech
// The -pooler suffix routes through Neon's built-in connection pooler
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// Usage in Server Components or Route Handlers:
// const posts = await db.query.posts.findMany({ limit: 10 })
```

**Key rule:** The `DATABASE_URL` must include the `-pooler` hostname suffix (e.g., `ep-cool-name-123456-pooler.us-east-2.aws.neon.tech`). Without `-pooler`, each serverless invocation opens a direct connection, exhausting the 100-connection limit within seconds under load.

#### Pattern 13: Prisma with Dual Connection URLs

Prisma requires two connection URLs for serverless: a pooled URL for runtime queries (via `url`) and a direct URL for migrations (via `directUrl`). The pooled URL routes through a connection pooler; the direct URL connects to the database directly.

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")    // Pooled: used at runtime (serverless)
  directUrl = env("DIRECT_URL")      // Direct: used for migrations only
}
```

```bash
# .env
# Pooled connection (Neon pooler, Prisma Accelerate, or Supabase PgBouncer)
DATABASE_URL="postgresql://user:pass@ep-cool-name-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require"

# Direct connection (for prisma migrate, prisma db push)
DIRECT_URL="postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

**Notice:** The only difference between the two URLs is the `-pooler` suffix in the hostname. The pooled URL goes through the connection pooler; the direct URL connects to the database instance directly.

#### Pattern 14: Connection Pooling Decision Rule

If deploying to serverless (Vercel, Netlify, Cloudflare Workers), ALWAYS use a connection pooler. Serverless functions spin up and tear down rapidly -- each invocation that opens a direct database connection consumes one connection slot. Under traffic spikes, this exhausts the connection limit (typically 100 for managed Postgres) and causes connection errors. Options: **Neon pooler** (built-in, `-pooler` hostname suffix), **Prisma Accelerate** (managed pool for any database), **Supabase pooler** (built-in PgBouncer on port 6543). For long-running servers (VPS, Docker, dedicated hosting), pooling is still recommended but not as critical since the process reuses connections.

### F. Cache-Control Header Patterns

#### Pattern 15: Standard Cache-Control Headers for Common Page Types

Reference table mapping page types to recommended `Cache-Control` header values. In Next.js 16 with Cache Components, explicit `Cache-Control` headers are rarely needed -- the framework manages caching via `cacheLife`. These headers are primarily for Astro SSR pages and Next.js Route Handlers where manual cache control is appropriate.

| Page Type | Cache-Control | Rationale |
|-----------|--------------|-----------|
| Static marketing | `public, max-age=31536000, immutable` | Fully static, versioned by deploy hash |
| Blog post (ISR) | `public, s-maxage=3600, stale-while-revalidate=86400` | Fresh hourly at CDN, stale OK for 24h |
| E-commerce PDP | `public, s-maxage=300, stale-while-revalidate=3600` | Fresh every 5min (price/stock changes), stale OK for 1h |
| Dashboard (SSR) | `private, no-store` | User-specific, never cache at CDN or browser |
| API response (public) | `public, s-maxage=60, stale-while-revalidate=300` | Short CDN cache, quick revalidation for API consumers |
| API response (auth) | `private, no-cache` | User-specific, revalidate every time but allow conditional requests |

**Header glossary:**
- `public` -- CDN and browser can cache
- `private` -- Only the user's browser can cache (no CDN)
- `s-maxage` -- CDN cache duration (shared cache), overrides `max-age` for CDNs
- `max-age` -- Browser cache duration
- `stale-while-revalidate` -- CDN serves stale while fetching fresh in background
- `no-store` -- Do not cache anywhere, ever
- `no-cache` -- Cache but revalidate with server before serving (allows 304 Not Modified)
- `immutable` -- Content will never change at this URL (use with hashed filenames)

### B2. CMS Webhook Revalidation

The publish-revalidate-verify loop is the core workflow for CMS-driven content freshness. When an editor publishes content, a webhook fires to the Next.js backend, which verifies the signature, invalidates relevant cache tags, and optionally bridges to SEO (sitemap update + IndexNow submission). Every CMS webhook handler MUST verify the signature using HMAC or a platform-specific verification library before processing -- never trust raw payloads.

**Critical security rule:** Always read the raw body with `request.text()` BEFORE parsing JSON. Signature verification operates on the raw string, not the parsed object. Parse JSON only after verification succeeds.

#### Pattern 16: Sanity Webhook Revalidation

Sanity provides the `@sanity/webhook` package with `isValidSignature()` for signature verification. The signature is sent in the `sanity-webhook-signature` header. Sanity payloads include `_type` (content type) and `slug.current` for per-entry identification.

```typescript
// app/api/revalidate/sanity/route.ts
import { revalidateTag } from 'next/cache'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { notifySeoUpdate } from '@/lib/seo-bridge'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? ''

  if (!isValidSignature(body, signature, process.env.SANITY_WEBHOOK_SECRET!)) {
    return new Response('Invalid signature', { status: 401 })
  }

  const payload = JSON.parse(body) as {
    _type: string
    slug?: { current: string }
  }

  // Revalidate by content type and optionally by slug
  revalidateTag(payload._type, 'max')
  if (payload.slug?.current) {
    revalidateTag(`${payload._type}-${payload.slug.current}`, 'max')
  }

  // SEO bridge: update sitemap + notify search engines
  if (payload.slug?.current) {
    await notifySeoUpdate([`/${payload._type}/${payload.slug.current}`])
  }

  return Response.json({ revalidated: true, type: payload._type })
}
```

#### Pattern 17: Contentful Webhook Revalidation

Contentful uses manual HMAC-SHA256 verification. The signature is sent in the `x-contentful-signature` header. The webhook signing secret is configured in Contentful's webhook settings. Production deployments should use the canonical string method from Contentful's official verification docs; the pattern below uses simplified HMAC for consistency with other CMS examples.

```typescript
// app/api/revalidate/contentful/route.ts
import { revalidateTag } from 'next/cache'
import { createHmac, timingSafeEqual } from 'crypto'
import { notifySeoUpdate } from '@/lib/seo-bridge'

function verifyContentfulSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-contentful-signature')

  if (
    !signature ||
    !verifyContentfulSignature(body, signature, process.env.CONTENTFUL_WEBHOOK_SECRET!)
  ) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = JSON.parse(body) as {
    sys: {
      contentType: { sys: { id: string } }
    }
    fields?: { slug?: { 'en-US'?: string } }
  }

  const contentType = payload.sys.contentType.sys.id
  const slug = payload.fields?.slug?.['en-US']

  revalidateTag(contentType, 'max')
  if (slug) {
    revalidateTag(`${contentType}-${slug}`, 'max')
    await notifySeoUpdate([`/${contentType}/${slug}`])
  }

  return Response.json({ revalidated: true, contentType })
}
```

**Note:** Contentful's canonical verification method uses a combination of the HTTP method, path, headers, and body to construct the signing string. For production webhooks handling sensitive content operations, consider using `@contentful/node-apps-toolkit` for full canonical string verification.

#### Pattern 18: Strapi Webhook Revalidation

Strapi v5 webhooks are configured at Settings > Webhooks. Use a shared secret with HMAC-SHA256 signing via a custom `x-strapi-signature` header. Strapi payloads include `model` (collection name) and `entry` with the full entry data including `slug`.

```typescript
// app/api/revalidate/strapi/route.ts
import { revalidateTag } from 'next/cache'
import { createHmac, timingSafeEqual } from 'crypto'
import { notifySeoUpdate } from '@/lib/seo-bridge'

function verifyStrapiSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-strapi-signature')

  if (
    !signature ||
    !verifyStrapiSignature(body, signature, process.env.STRAPI_WEBHOOK_SECRET!)
  ) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = JSON.parse(body) as {
    model: string
    entry?: { slug?: string }
  }

  const collection = payload.model // e.g., 'article', 'page'
  const slug = payload.entry?.slug

  // Revalidate by collection and optionally by specific entry
  revalidateTag(collection, 'max')
  if (slug) {
    revalidateTag(`${collection}-${slug}`, 'max')
    await notifySeoUpdate([`/${collection}/${slug}`])
  }

  return Response.json({ revalidated: true, collection })
}
```

#### Pattern 19: Payload CMS Revalidation (afterChange Hooks)

Payload CMS is fundamentally different from the other 4 platforms: it runs INSIDE the Next.js process. There is no webhook endpoint needed. Instead, use `afterChange` and `afterDelete` collection hooks that directly call `revalidateTag`. This is the simplest revalidation pattern because Payload shares the Next.js runtime -- no HTTP requests, no signature verification, no separate Route Handler.

```typescript
// payload.config.ts -- Collection hooks for on-demand revalidation
import { buildConfig } from 'payload'
import { revalidateTag } from 'next/cache'

async function revalidateAfterChange({ doc, collection }: {
  doc: { slug?: string }
  collection: { slug: string }
}) {
  revalidateTag(collection.slug, 'max')
  if (doc.slug) {
    revalidateTag(`${collection.slug}-${doc.slug}`, 'max')
  }

  // SEO bridge: update sitemap
  revalidateTag('sitemap', 'max')

  // Fire IndexNow for the updated URL
  if (doc.slug && process.env.SITE_URL) {
    fetch(`${process.env.SITE_URL}/api/indexnow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: [`/${collection.slug}/${doc.slug}`],
      }),
    }).catch(() => {
      // IndexNow is best-effort -- do not block content save
    })
  }
}

export default buildConfig({
  collections: [
    {
      slug: 'posts',
      hooks: {
        afterChange: [
          async ({ doc }) => {
            revalidateTag('posts', 'max')
            revalidateTag(`post-${doc.slug}`, 'max')
            revalidateTag('sitemap', 'max')
          },
        ],
        afterDelete: [
          async ({ doc }) => {
            revalidateTag('posts', 'max')
            revalidateTag('sitemap', 'max')
          },
        ],
      },
      // ... fields config
    },
  ],
})
```

**Key advantage:** No webhook infrastructure to maintain. No signature verification needed (the hook runs in the same trusted process). No network latency between CMS and revalidation. Payload CMS is the zero-overhead revalidation pattern.

#### Pattern 20: Hygraph Webhook Revalidation

Hygraph provides the `@hygraph/utils` package with `verifyWebhookSignature()` for signature verification. The signature is sent in the `gcms-signature` header. Hygraph payloads include `data.__typename` (the GraphQL type name) for content type identification.

```typescript
// app/api/revalidate/hygraph/route.ts
import { revalidateTag } from 'next/cache'
import { verifyWebhookSignature } from '@hygraph/utils'
import { notifySeoUpdate } from '@/lib/seo-bridge'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('gcms-signature') ?? ''

  const { isValid } = verifyWebhookSignature({
    body,
    signature,
    secret: process.env.HYGRAPH_WEBHOOK_SECRET!,
  })

  if (!isValid) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = JSON.parse(body) as {
    data: {
      __typename: string
      slug?: string
    }
  }

  const contentType = payload.data.__typename.toLowerCase()
  const slug = payload.data.slug

  revalidateTag(contentType, 'max')
  if (slug) {
    revalidateTag(`${contentType}-${slug}`, 'max')
    await notifySeoUpdate([`/${contentType}/${slug}`])
  }

  return Response.json({ revalidated: true, contentType })
}
```

#### SEO Bridge: Revalidation to Sitemap + IndexNow

After any CMS webhook triggers cache revalidation, the SEO bridge ensures search engines learn about the content change. This utility connects Phase 19 (rendering/caching) to Phase 14 (seo-meta: sitemap lastmod) and Phase 16 (search-visibility: IndexNow submission). Every CMS webhook handler above calls this helper after successful revalidation.

```typescript
// lib/seo-bridge.ts
import { revalidateTag } from 'next/cache'

/**
 * Notify SEO systems of content changes after cache revalidation.
 *
 * 1. Revalidates the sitemap cache tag so the next sitemap.xml request
 *    reflects the updated lastmod timestamp (connects to seo-meta skill).
 * 2. Fires IndexNow to push updated URLs to search engines immediately
 *    (connects to search-visibility skill).
 *
 * Call this AFTER revalidateTag for the content itself.
 * IndexNow is best-effort -- failures are logged but do not throw.
 */
export async function notifySeoUpdate(urls: string[]): Promise<void> {
  // 1. Revalidate sitemap so lastmod reflects the content change
  revalidateTag('sitemap', 'max')

  // 2. Fire IndexNow for immediate search engine notification
  // The /api/indexnow endpoint pattern comes from the search-visibility skill (Phase 16)
  if (process.env.SITE_URL && urls.length > 0) {
    const absoluteUrls = urls.map((url) =>
      url.startsWith('http') ? url : `${process.env.SITE_URL}${url}`
    )

    try {
      await fetch(`${process.env.SITE_URL}/api/indexnow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: absoluteUrls }),
      })
    } catch (error) {
      // IndexNow is best-effort -- log but do not block the webhook response
      console.error('[SEO Bridge] IndexNow notification failed:', error)
    }
  }
}
```

**Usage in any CMS webhook handler:**

```typescript
import { notifySeoUpdate } from '@/lib/seo-bridge'

// After revalidateTag calls succeed:
await notifySeoUpdate([`/blog/${slug}`, `/blog`])
```

#### Astro CMS Revalidation Note

Astro does not have built-in on-demand revalidation like Next.js `revalidateTag`. The approach depends on the rendering mode:

- **Astro SSG (static):** A CMS webhook should trigger a rebuild via the hosting platform's deploy hook (Vercel Deploy Hook, Netlify Build Hook). The entire site rebuilds with fresh CMS data. This is acceptable for sites with fewer than ~5,000 pages.
- **Astro SSR:** The CDN cache is managed by `Cache-Control` headers. Cache purging depends on the CDN provider: Vercel's Purge API, Cloudflare's Cache Purge API, or Netlify's cache invalidation. The CMS webhook calls the CDN purge endpoint instead of `revalidateTag`.
- **Astro with Server Islands:** The islands are fetched per-request and do not need revalidation -- they always show fresh data. The static shell is rebuilt on deploy. This is the simplest model for mixed static/dynamic Astro sites.

### Auth-Gated Content Rendering

Auth-gated content requires careful rendering strategy decisions. The wrong approach either exposes private data in cached HTML, shows unnecessary loading spinners for content that could be pre-rendered, or breaks caching for the entire page. This section covers 3 mixed-page approaches and 4 auth library patterns for Server Components.

#### Three Mixed-Page Approaches

When a page contains both public and authenticated content, choose one of these three approaches based on your UX priorities:

| Approach | Caching | Loading UX | SEO | Best For |
|----------|---------|-----------|-----|----------|
| **Server-Side Conditional** | Cannot cache (every request hits server) | No spinner, full content on load | Public content in initial HTML | Fully personalized pages (dashboards, profiles) |
| **Client-Side Auth Gate** | Public shell cached/static | Layout shift when auth resolves | Public shell only | Simple auth gating with static marketing shell |
| **Cache Components + Auth Boundary** | Public content cached, auth content streams | Skeleton then content (no shift if skeleton matches) | Public content in initial HTML | Mixed pages with significant public + private zones |

**1. Server-Side Conditional Rendering** -- Check auth in the Server Component, render different content based on session state. The entire page is SSR per-request. No loading spinner because the full HTML arrives in one response. Cannot be cached because every request may produce different output based on auth state. Use for fully personalized pages where most content is user-specific.

**2. Client-Side Auth Gate with Skeleton** -- Pre-render the public shell as static HTML. Use a client component that checks auth and conditionally renders private content after hydration. The public shell is cached by CDN, giving fast initial load. The private content appears after a brief loading state. Downsides: layout shift when auth resolves (unless skeleton matches final dimensions), private content is not in the initial HTML (empty div until JS runs).

**3. Cache Components + Auth Boundary (Recommended for mixed pages)** -- Use `"use cache"` for the public content (cached and shared across all visitors), wrap auth-dependent content in a `<Suspense>` boundary that streams per-request. The cached public content arrives instantly. The auth-dependent content streams in as the server resolves the session. This is the recommended approach for pages with significant both-public-and-private content because it gives the best of both worlds: cached shell for performance and SEO, streaming auth content without layout shift (if the skeleton matches the final layout).

#### Pattern 21: Cache Components + Auth Boundary (Recommended)

The recommended approach for mixed public/private pages. Product info is cached for all visitors. Personalized pricing streams per-request inside a Suspense boundary. The public content is SEO-friendly and fast; the auth content streams without blocking the initial response.

```tsx
// app/product/[id]/page.tsx
import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <>
      {/* Cached: everyone sees the same product info */}
      <CachedProductInfo id={id} />

      {/* Auth boundary: streams per-request, shows skeleton until resolved */}
      <Suspense fallback={<PricingSkeleton />}>
        <PersonalizedPricing id={id} />
      </Suspense>
    </>
  )
}

// CACHED: shared across all visitors, revalidated hourly
async function CachedProductInfo({ id }: { id: string }) {
  'use cache'
  cacheLife('hours')
  cacheTag(`product-${id}`)

  const product = await db.product.findUnique({
    where: { id },
    select: { name: true, description: true, image: true, basePrice: true },
  })

  if (!product) return null

  return (
    <div>
      <h1 className="text-4xl font-bold">{product.name}</h1>
      <p className="text-lg text-muted">{product.description}</p>
      <img src={product.image} alt={product.name} width={800} height={600} />
      <p className="text-2xl">From ${product.basePrice}</p>
    </div>
  )
}

// PER-REQUEST: reads session, cannot be cached
async function PersonalizedPricing({ id }: { id: string }) {
  const session = await auth()

  if (!session) {
    return (
      <p className="text-muted">
        <a href="/login" className="underline">Sign in</a> for member pricing
      </p>
    )
  }

  const memberPrice = await db.memberPrice.findUnique({
    where: { productId_tier: { productId: id, tier: session.user.tier } },
  })

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
      <p className="text-sm text-muted">Member pricing ({session.user.tier})</p>
      <p className="text-3xl font-bold">${memberPrice?.price ?? 'N/A'}</p>
    </div>
  )
}

function PricingSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border p-4">
      <div className="h-4 w-24 rounded bg-surface" />
      <div className="mt-2 h-8 w-20 rounded bg-surface" />
    </div>
  )
}
```

#### Auth Library Server Component Patterns

For each auth library, the pattern shows how to check authentication in a Server Component. All auth functions are async in current versions -- always `await` them.

#### Pattern 22: Auth.js v5 (NextAuth v5) Server Component

Auth.js v5 exports an `auth()` function from the root config that works in Server Components, Route Handlers, `proxy.ts`, and Server Actions. The session includes user data and expiry information.

```typescript
// auth.ts -- Root config (create once, import everywhere)
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})
```

```tsx
// app/dashboard/page.tsx -- Protected Server Component
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
    </div>
  )
}
```

**Where `auth()` works:** Server Components, Route Handlers, `proxy.ts`, Server Actions. It reads the session cookie and validates the JWT or database session automatically.

#### Pattern 23: Clerk Server Component

Clerk provides `auth()` for lightweight session checks and `currentUser()` for full user data. Both are imported from `@clerk/nextjs/server`. Clerk's `clerkMiddleware()` (now in `proxy.ts`) can protect entire route groups declaratively.

```tsx
// app/dashboard/page.tsx -- Protected Server Component
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Full user data (only fetch when needed -- adds latency)
  const user = await currentUser()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.firstName} {user?.lastName}</p>
      <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
    </div>
  )
}
```

**Performance tip:** Use `auth()` for simple auth checks (fast, reads JWT). Use `currentUser()` only when you need full user data (makes an API call to Clerk's backend).

#### Pattern 24: Supabase Server Component

Supabase uses `@supabase/ssr` with cookie-based auth for Server Components. CRITICAL: use `getClaims()` or `getUser()` for server-side validation -- NOT `getSession()`. `getSession()` reads the JWT from cookies without verifying the signature, making it vulnerable to spoofing. `getClaims()` validates the JWT signature against Supabase's public keys.

```typescript
// lib/supabase/server.ts -- Server client factory
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

```tsx
// app/dashboard/page.tsx -- Protected Server Component
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  // CORRECT: getClaims() validates the JWT signature
  const { data: claims, error } = await supabase.auth.getClaims()
  if (error || !claims) redirect('/login')

  // Fetch user profile with validated claims
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', claims.sub)
    .single()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {profile?.full_name}</p>
    </div>
  )
}
```

**NEVER use in Server Components:**
```typescript
// WRONG: getSession() does NOT validate the JWT signature
const { data: { session } } = await supabase.auth.getSession()
// This can be spoofed by modifying the cookie -- INSECURE for server-side checks
```

#### Pattern 25: Better Auth Server Component

Better Auth is the modern replacement for Lucia (deprecated March 2025). It provides a server-side session helper that validates the session from cookies. Better Auth is self-hosted and framework-agnostic with first-class Next.js support.

**MEDIUM confidence:** Better Auth's API is newer and may evolve. Auth.js v5 and Clerk are higher-confidence choices for production projects. Use Better Auth when you need self-hosted auth with a modern API and Lucia is no longer an option.

```typescript
// lib/auth.ts -- Better Auth server instance
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/lib/prisma'

export const authServer = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
})
```

```typescript
// lib/auth-server.ts -- Server-side session helper
import { headers } from 'next/headers'
import { authServer } from '@/lib/auth'

export async function getServerSession() {
  const headersList = await headers()
  const session = await authServer.api.getSession({
    headers: headersList,
  })
  return session
}
```

```tsx
// app/dashboard/page.tsx -- Protected Server Component
import { getServerSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
    </div>
  )
}
```

**Note:** Better Auth does NOT recommend Lucia patterns. Lucia was deprecated in March 2025 and is now educational resources only. Do not use Lucia for new projects.

#### Pattern 26: proxy.ts Route Protection

Next.js 16 renamed `middleware.ts` to `proxy.ts`. The proxy runs on every matching request BEFORE the route renders. Use it to protect entire route groups by checking auth and redirecting unauthenticated users. The proxy runs on Node.js runtime only (Edge runtime support was removed in Next.js 16).

```typescript
// proxy.ts -- Generic route protection pattern
import { NextRequest, NextResponse } from 'next/server'

// Define protected route patterns
const protectedRoutes = ['/dashboard', '/settings', '/admin']
const authRoutes = ['/login', '/register', '/forgot-password']

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Check for session (implementation depends on auth library)
  const sessionCookie = request.cookies.get('session')?.value
  const isAuthenticated = !!sessionCookie // Replace with actual validation

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth routes (already logged in)
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/admin/:path*', '/login', '/register'],
}
```

**Per-library proxy patterns:**

- **Auth.js v5:** Export `auth` as the proxy wrapper -- it enriches the request with session data. Use `auth` directly: `export { auth as default } from '@/auth'` with a custom `authorized` callback.
- **Clerk:** Use `clerkMiddleware()` with `createRouteMatcher` to define protected routes. Clerk handles session validation and enrichment automatically.
- **Supabase:** Call `updateSession()` in the proxy to refresh auth cookies on every request. This ensures the Supabase client in Server Components always has a valid session.
- **Better Auth:** Manual session check in proxy -- read the session cookie and validate via Better Auth's server API. No built-in proxy wrapper.

#### Pattern 27: Server-Side Role-Based Rendering

Render different content based on user role. Check the session in the Server Component, extract the role, and render the appropriate component tree. No client-side JavaScript needed -- the correct content is in the initial HTML.

```tsx
// app/workspace/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin-dashboard'
import { MemberDashboard } from '@/components/member-dashboard'
import { GuestView } from '@/components/guest-view'

type UserRole = 'admin' | 'member' | 'guest'

export default async function WorkspacePage() {
  const session = await auth()

  if (!session) {
    return <GuestView />
  }

  const role = (session.user.role as UserRole) ?? 'member'

  return (
    <div>
      <header>
        <h1>Workspace</h1>
        <p>Signed in as {session.user.name} ({role})</p>
      </header>

      {role === 'admin' && <AdminDashboard userId={session.user.id} />}
      {role === 'member' && <MemberDashboard userId={session.user.id} />}
    </div>
  )
}
```

**Where roles are stored by auth library:**
- **Auth.js v5:** Custom field in JWT via `jwt` callback, or in the database session via adapter. Access via `session.user.role`.
- **Clerk:** User metadata (`publicMetadata.role`). Set via Clerk Dashboard or Backend API. Access via `(await auth()).sessionClaims?.metadata?.role`.
- **Supabase:** Custom claims in JWT via `app_metadata` or a custom `roles` table. Access via `claims.app_metadata?.role` from `getClaims()`.
- **Better Auth:** Custom field in user model via Prisma/Drizzle schema. Access via `session.user.role` from the session helper.

### Reference Sites

Sites demonstrating excellent SSR, caching, and dynamic content rendering strategies. Study these for rendering architecture decisions and perceived performance benchmarks.

- **Vercel.com** (vercel.com) -- Industry reference for Cache Components and ISR. The dashboard uses full SSR with streaming for project data, analytics, and deployment logs. Marketing pages use Cache Components with on-demand revalidation. The docs site demonstrates ISR with webhook revalidation from their CMS. Signature element: sub-second navigation between dashboard views with streaming data.

- **Linear.app** (linear.app) -- SaaS dashboard demonstrating streaming SSR with progressive data loading. Project lists, issue boards, and activity feeds stream independently via Suspense boundaries. Excellent perceived performance despite data-heavy pages. Signature element: the entire app feels instant because the shell renders immediately while data streams in.

- **Hashnode** (hashnode.dev) -- CMS-driven blog platform using ISR with webhook revalidation. Blog posts appear within seconds of publish. The editorial interface publishes to Hashnode's API, which fires webhooks to revalidate the affected blog and sitemap. Demonstrates the publish-revalidate-verify loop at scale.

- **Notion** (notion.so) -- Mixed public/private pages with auth-gated rendering. Public Notion pages are cached aggressively for fast loads. Authenticated workspace pages use full SSR with streaming for databases, kanban boards, and documents. Demonstrates the Cache Components + Auth Boundary pattern at scale.

- **Payload CMS website** (payloadcms.com) -- Self-referential: built on Payload CMS + Next.js, demonstrating the `afterChange` hook revalidation pattern. Content updates on the site reflect immediately because Payload's hooks call `revalidateTag` directly in the Next.js process. No external webhook infrastructure needed.

## Layer 3: Integration Context

How this skill connects to the rest of the Modulo system. SSR/dynamic content has lighter DNA coupling than visual skills -- the primary touchpoints are loading state aesthetics (skeletons/shimmers should use DNA colors) and draft mode banner styling. Rendering strategies, caching, and revalidation are server-side concerns with no visual dependency on DNA tokens.

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| Domain / `metadataBase` | Webhook callback URLs in CMS configuration, draft preview redirect base URL, IndexNow notification URLs |
| `--color-bg` / `--color-surface` | Skeleton/shimmer loading state background colors (must match page background to avoid flash) |
| `--color-border` | Skeleton placeholder border and divider colors for loading states |
| `--color-muted` | Shimmer animation highlight color, loading text color |
| `--font-body` | Draft mode banner font family (visual consistency during preview) |
| Brand name | Draft mode banner text (e.g., "Draft Mode -- [Brand Name] Preview"), CMS webhook identification |

### Archetype Variants

SSR rendering logic is identical across archetypes -- server-side code does not change with visual style. However, loading states and skeleton UIs should match archetype personality. These variants apply to Suspense fallback components, Server Island fallback slots, draft mode banners, and `loading.tsx` special files. The section-builder should adapt loading state JSX to match the project archetype.

| Archetype Group | Loading State Style | Skeleton Pattern | Draft Banner Style |
|-----------------|--------------------|-----------------|--------------------|
| Neo-Corporate, Swiss/International | Clean shimmer, subtle pulse | Geometric block placeholders, sharp edges | Minimal banner with muted background |
| Brutalist, Neubrutalism | Static gray blocks, no animation | Bold rectangular blocks, thick borders | High-contrast banner, monospace text |
| Luxury/Fashion, Dark Academia | Elegant fade-in, slow shimmer | Refined line placeholders, thin dividers | Understated banner with serif text |
| Playful/Startup, Vaporwave | Bouncing dots or colorful pulse | Rounded placeholders with brand accent | Colorful banner with playful text |
| Japanese Minimal, Ethereal | Subtle opacity pulse, minimal | Thin line placeholders, generous whitespace | Near-invisible banner, light text |
| Data-Dense, AI-Native | Progressive skeleton with data structure hints | Table/grid skeleton matching final layout | Technical banner showing preview metadata |
| Glassmorphism, Neon Noir | Glass blur effect on loading, glow pulse | Frosted glass placeholder cards | Glassmorphic banner with backdrop blur |
| Kinetic, Retro-Future | Animated scanning line effect | Wireframe skeleton with motion hints | Retro-styled banner with animation |

Remaining archetypes (Organic, Warm Artisan) should follow the closest personality match -- Warm Artisan aligns with Luxury/Fashion (elegant, refined loading), Organic with Japanese Minimal (subtle, nature-inspired).

### Pipeline Stage

- **Input from:** `/modulo:start-project` discovers content update frequency, CMS platform, auth requirements, and real-time data needs. `/modulo:plan-dev` section planner assigns rendering strategies per section based on the decision matrix. Design DNA provides domain and brand tokens for webhook URLs and loading states.
- **Output to:** Page components with cache directives (`"use cache"`, `cacheLife`, `cacheTag`), Server Components with auth checks, webhook Route Handlers (`app/api/revalidate/route.ts`), `next.config.ts` cache configuration, Astro page files with `prerender` settings and `server:defer` components, `proxy.ts` route protection, and `loading.tsx` skeleton components.
- **Pipeline position:** Wave 0 scaffold includes `next.config.ts` cache setup (`cacheComponents: true`), `proxy.ts` auth protection, and skeleton `loading.tsx` files. Wave 1 establishes shared webhook handler and SEO bridge utility. Wave 2+ sections implement specific rendering strategies per the decision matrix.
- **Cross-phase integration:** CMS webhook handlers call the SEO bridge to update sitemap (`seo-meta` skill) and fire IndexNow (`search-visibility` skill). Draft mode integrates with CMS preview URLs. Auth patterns reference `auth-ui` skill for the login/signup UX.

### Related Skills

- `api-patterns` -- Provides server-side proxy patterns, webhook signature verification, and env management. This skill USES those patterns for CMS webhook endpoints. The generic HMAC verifier and Stripe/GitHub webhook patterns are in api-patterns; the CMS-specific webhook patterns (Sanity, Contentful, Strapi, Payload, Hygraph) are in this skill.
- `seo-meta` -- Provides sitemap generation patterns. This skill's SEO bridge calls `revalidateTag('sitemap')` to keep sitemap lastmod fresh after CMS publishes. The sitemap endpoint itself is defined by seo-meta.
- `search-visibility` -- Provides IndexNow submission endpoint. This skill's SEO bridge fires IndexNow after CMS webhook revalidation. The IndexNow endpoint pattern is defined by search-visibility.
- `cms-integration` -- Handles CMS data fetching and content modeling. This skill handles what happens AFTER content changes (revalidation, cache invalidation, draft preview). cms-integration handles how to FETCH the content.
- `auth-ui` -- Handles authentication UX (login, signup, password reset). This skill handles how auth state affects RENDERING decisions (cached vs per-request, route protection, role-based content). auth-ui handles the user-facing auth flows.
- `nextjs-patterns` -- Documents Next.js framework patterns at the framework level (Server Components, Route Handlers, `proxy.ts`). This skill documents how to USE those patterns for specific rendering strategies and caching.
- `astro-patterns` -- Documents Astro framework patterns (Server Islands, hybrid mode, API endpoints). This skill documents how to USE those patterns for SSR, ISR-equivalent caching, and Server Islands.
- `performance-guardian` -- Cache strategy directly affects Core Web Vitals (LCP, TTFB). Streaming SSR improves TTFB. Proper cache headers reduce server response time. This skill's cacheLife profiles and Cache-Control headers align with performance-guardian's thresholds.
- `emotional-arc` -- Loading states (Suspense fallbacks, Server Island fallbacks) are part of the page's emotional pacing. A well-designed skeleton maintains the arc's rhythm; a blank screen or jarring spinner disrupts it.

## Layer 4: Anti-Patterns

The 10 most dangerous SSR/caching mistakes. Each produces silent failures, security vulnerabilities, or production cache invalidation bugs that are extremely difficult to debug after deployment.

### Anti-Pattern 1: Using `experimental: { ppr: true }` in Next.js 16

**What goes wrong:** Config references the experimental PPR flag from Next.js 14-15. In Next.js 16, PPR graduated to "Cache Components" with a completely different API. The old config is silently ignored -- no caching behavior is applied. Pages that should be partially cached render as full SSR per-request, destroying performance and increasing server costs.

**Instead:** Use `cacheComponents: true` in `next.config.ts`. Use `"use cache"` directive + `cacheLife` + `cacheTag` in components and functions. Cache Components is the production-ready successor to PPR. See Pattern 1 for the correct `next.config.ts` setup.

### Anti-Pattern 2: Using `unstable_cache` Instead of `"use cache"`

**What goes wrong:** Code imports `unstable_cache` from `next/cache` for data caching. This is the legacy API, deprecated in Next.js 16. It requires manual cache key management and has a different invalidation model. The `unstable_` prefix signals it was never intended as a stable API -- breaking changes are expected.

**Instead:** Use the `"use cache"` directive at file, component, or function level. The compiler auto-generates cache keys from function ID + serialized arguments + build ID. Combined with `cacheLife` for TTL and `cacheTag` for on-demand invalidation, this replaces `unstable_cache` entirely. See Pattern 2 for the correct Cache Components pattern.

### Anti-Pattern 3: Calling Runtime APIs Inside `"use cache"` Scope

**What goes wrong:** Code calls `cookies()`, `headers()`, or accesses `searchParams` inside a function or component marked with `"use cache"`. Build either hangs (timeout after 50s) or fails with `next-request-in-use-cache` error. Runtime APIs need a request context that does not exist at build time when the cache is being populated.

**Instead:** Read runtime data OUTSIDE the cached scope, then pass values as serialized arguments to cached functions. The argument becomes part of the cache key, so different cookie values produce different cache entries. See Pattern 2 where `UserPreferences` reads cookies outside the cached `BlogPosts` function.

### Anti-Pattern 4: Edge Runtime with Cache Components

**What goes wrong:** Route or page uses `runtime = 'edge'` alongside Cache Components. Build fails or cache behavior silently does not apply. Cache Components requires Node.js runtime -- Edge Runtime does NOT support `"use cache"`, ISR, or on-demand revalidation. The Edge constraint table in Layer 1 lists 8 capabilities unavailable on Edge.

**Instead:** Remove `runtime = 'edge'` from any route using Cache Components. Also note: `proxy.ts` runs on Node.js only in Next.js 16 (Edge runtime support was removed for proxy). Edge is only appropriate for simple Route Handlers doing fetch-based proxying. See the Edge vs Node.js Runtime Constraints table in Layer 1.

### Anti-Pattern 5: Using `middleware.ts` Instead of `proxy.ts`

**What goes wrong:** Developer creates `middleware.ts` for route protection or request manipulation. In Next.js 16, the file was renamed to `proxy.ts` with `export default function proxy()`. The old `middleware.ts` file is NOT executed -- routes are unprotected, redirects do not fire, and request manipulation is silently skipped.

**Instead:** Create `proxy.ts` at the project root. Export `default function proxy(request)` (not `function middleware`). The API is similar but the file name and export name have changed. See Pattern 26 for the correct `proxy.ts` route protection pattern.

### Anti-Pattern 6: Supabase `getSession()` for Server-Side Auth

**What goes wrong:** Server-side code uses `supabase.auth.getSession()` to check authentication. This reads the session from cookies WITHOUT validating the JWT signature. An attacker can forge a session cookie and bypass auth checks entirely. This is a critical security vulnerability that allows unauthorized access to protected routes and data.

**Instead:** Use `supabase.auth.getClaims()` or `supabase.auth.getUser()` in Server Components, Route Handlers, and Server Actions. Both validate the JWT signature against Supabase's public keys. `getClaims()` is cheaper (no network call -- validates locally); `getUser()` always hits Supabase servers (more expensive but guarantees up-to-date user data). See Pattern 24 for the correct Supabase auth pattern and the explicit "NEVER use" warning.

### Anti-Pattern 7: Recommending Lucia Auth for New Projects

**What goes wrong:** Code uses Lucia Auth patterns for session management. Lucia was deprecated in March 2025 and is now "educational resources only." No security patches, no new features, no community support. Using Lucia in a new project means building on an unmaintained auth foundation that will accumulate unpatched vulnerabilities.

**Instead:** For self-hosted auth, use Better Auth (modern Lucia replacement) or Auth.js v5. For managed auth, use Clerk. For BaaS, use Supabase Auth. Better Auth has growing adoption but mark it as MEDIUM confidence; Auth.js v5 and Clerk are the highest-confidence choices. See Patterns 22-25 for all four auth library patterns.

### Anti-Pattern 8: Single-Argument `revalidateTag` in Webhook Handlers

**What goes wrong:** Code calls `revalidateTag('products')` with one argument in a Route Handler. This uses the deprecated immediate-expiry behavior. Content briefly goes blank (or shows a 404/error) while regenerating, instead of showing stale content during background revalidation. Users see a broken page for the regeneration duration.

**Instead:** Always use `revalidateTag('tag-name', 'max')` for stale-while-revalidate behavior in Route Handlers (webhook endpoints). Use `updateTag('tag-name')` for immediate expiry only in Server Actions where the editor needs to see their own changes instantly. See Pattern 3 for the correct invalidation API comparison.

### Anti-Pattern 9: Expecting Astro to Have Built-In ISR

**What goes wrong:** Developer looks for a `revalidate` export in Astro pages or expects `getStaticPaths` to auto-revalidate. Astro does NOT have built-in ISR. SSG pages are static until the next build. SSR pages are per-request with no built-in background revalidation. The developer either adds non-existent exports (silently ignored) or gives up and uses full SSR (unnecessary server load).

**Instead:** For ISR-equivalent behavior in Astro, set `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` on SSR page responses. This is a CDN feature, not an Astro feature. The CDN serves stale content while re-fetching from the Astro server in the background. Platform-specific adapters (Vercel, Netlify) may provide ISR-like features at the adapter level. See Pattern 6 for the correct Astro ISR-equivalent setup.

### Anti-Pattern 10: JSON-Parsing CMS Webhook Body Before Signature Verification

**What goes wrong:** CMS webhook handler calls `request.json()` before verifying the HMAC signature. JSON serialization may differ from the raw payload (whitespace, key ordering, Unicode escaping), causing the HMAC digest to not match the expected value. Signature verification fails on every real webhook, and the developer either disables verification (security vulnerability) or spends hours debugging serialization differences.

**Instead:** Always use `request.text()` first. Verify the HMAC signature against the raw string. Parse JSON with `JSON.parse(body)` only AFTER verification succeeds. This applies to all CMS webhooks using HMAC-SHA256 verification (Contentful, Strapi, Hygraph). Sanity uses a library (`@sanity/webhook`) that handles this internally. Payload CMS does not use webhooks (direct hooks). See Patterns 16-20 for the correct raw-body-first verification flow.

## Machine-Readable Constraints

Enforceable parameters for the quality-reviewer agent. HARD constraints cause rejection -- the code is incorrect and will fail or be insecure. SOFT constraints produce warnings -- the code works but may have suboptimal behavior.

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Next.js cache config | - | - | must use `cacheComponents: true`, NOT `experimental.ppr` | HARD -- reject if PPR config present |
| Cache directive | - | - | must use `"use cache"`, NOT `unstable_cache` | HARD -- reject if unstable_cache import found |
| Runtime APIs in cache scope | - | - | must NOT call cookies()/headers()/searchParams inside `"use cache"` | HARD -- reject if runtime API in cached scope |
| Edge + Cache Components | - | - | must NOT use `runtime = 'edge'` with `"use cache"` | HARD -- reject if Edge with Cache Components |
| Proxy file name | - | - | must be `proxy.ts`, NOT `middleware.ts` | HARD -- reject if middleware.ts exists in Next.js 16 project |
| Supabase server auth | - | - | must use `getClaims()` or `getUser()`, NOT `getSession()` | HARD -- reject if getSession() in server-side code |
| Auth library currency | - | - | must NOT recommend Lucia for new projects | HARD -- reject if Lucia auth patterns in new project |
| revalidateTag form | - | - | must use two-arg `revalidateTag(tag, 'max')` in Route Handlers | HARD -- reject if single-arg revalidateTag in webhook handler |
| Webhook body access | - | - | must use `request.text()` before HMAC verification | HARD -- reject if request.json() precedes verification |
| Signature comparison | - | - | must use `crypto.timingSafeEqual` or official verification library | HARD -- reject if using === for HMAC comparison |
| cacheLife profiles | - | - | must use preset or custom cacheLife, NOT route segment `revalidate` | SOFT -- warn if numeric revalidate used with Cache Components |
| Astro ISR mechanism | - | - | must use Cache-Control headers, NOT expect built-in ISR | SOFT -- warn if looking for revalidate export in Astro |
| Connection pooling | - | - | must use pooler for serverless deployments (Vercel, Netlify) | SOFT -- warn if direct database URL in serverless |
| Router Cache awareness | - | - | should note Router Cache 30s minimum stale time in user-facing content | SOFT -- warn if no router.refresh() guidance after server invalidation |

**Enforcement notes:** SOFT constraints produce warnings. HARD constraints cause rejection. The `experimental.ppr` and `middleware.ts` constraints are the most critical -- they indicate the code was written for an older Next.js version and will silently fail in Next.js 16. The `getSession()` constraint is the most security-critical -- it creates an auth bypass vulnerability.
