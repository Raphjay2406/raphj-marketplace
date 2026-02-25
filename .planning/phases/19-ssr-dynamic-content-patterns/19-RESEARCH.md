# Phase 19: SSR & Dynamic Content Patterns - Research

**Researched:** 2026-02-25
**Domain:** Server-side rendering strategies, caching, CMS revalidation, auth-gated content, streaming SSR for Next.js 16 and Astro 5/6
**Confidence:** HIGH (all core findings verified against official Next.js 16.1.6 docs and Astro official docs)

## Summary

This research covers the complete domain of the `ssr-dynamic-content` skill: rendering strategy selection (SSG/SSR/ISR/streaming/Cache Components), the Next.js 16 cache system (which has fundamentally changed from prior versions), CMS webhook revalidation for 5 platforms, auth-gated content patterns with 4 auth libraries, Astro server mode and Server Islands, edge vs Node runtime constraints, connection pooling for serverless, and draft preview mode.

The most significant finding is that **Next.js 16 has replaced the experimental PPR (Partial Pre-Rendering) with "Cache Components"** -- a production-ready system using the `"use cache"` directive, `cacheTag`, `cacheLife`, and `updateTag`/`revalidateTag`. The old `experimental: { ppr: true }` config is gone; the new config is `cacheComponents: true`. The `"use cache"` directive works at file, component, or function level and generates cache keys automatically from serialized arguments. This is the recommended approach for hybrid static/dynamic pages in Next.js 16.

For Astro, **Server Islands** (`server:defer` directive, stable since Astro 4.12) provide the equivalent of partial prerendering -- a static shell with deferred server-rendered islands. Astro does NOT have built-in ISR; the pattern is implemented via CDN Cache-Control headers (`stale-while-revalidate`) or platform-specific features (Vercel ISR adapter, Netlify On-Demand Builders).

**Primary recommendation:** Build the skill around Next.js 16's Cache Components (`"use cache"` + `cacheLife` + `cacheTag`) as the primary rendering strategy for hybrid pages. Present Astro Server Islands as the equivalent pattern. Use a decision matrix with 4 dimensions (data freshness x personalization x build frequency x runtime) and 8-10 named scenario recipes.

## Standard Stack

This skill is a knowledge skill (SKILL.md) -- no installable dependencies. It documents patterns that USE these framework features and libraries.

### Core (Framework Features Documented)

| Feature | Framework | Version | Purpose | Why Standard |
|---------|-----------|---------|---------|--------------|
| Cache Components (`"use cache"`) | Next.js | 16.x | Hybrid static/dynamic rendering | Replaces PPR, production-ready, opt-in caching with `cacheLife` profiles |
| `cacheTag` / `cacheLife` | Next.js | 16.x | Tag-based cache invalidation and lifetime control | Official API for on-demand revalidation |
| `revalidateTag` / `updateTag` | Next.js | 16.x | On-demand cache invalidation | `updateTag` for immediate (Server Actions), `revalidateTag` for SWR (Route Handlers) |
| `revalidatePath` | Next.js | 16.x | Path-based cache invalidation | Simpler alternative when tags are not used |
| `draftMode()` | Next.js | 16.x | CMS preview/draft content | Async in v16, sets cookie to bypass static cache |
| Server Islands (`server:defer`) | Astro | 5.x/6.x | Deferred server-rendered components in static pages | Equivalent of Cache Components for Astro |
| `output: 'hybrid'` | Astro | 5.x/6.x | Per-page SSR opt-in | Default static, opt-in SSR with `prerender = false` |
| `Astro.response.headers` | Astro | 5.x/6.x | Cache-Control headers for SSR pages | CDN-level caching for Astro SSR responses |
| React Suspense boundaries | React | 19.x | Streaming SSR with fallback UI | Standard pattern for progressive rendering |

### Supporting (Auth Libraries for SSR Patterns)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Auth.js (NextAuth v5) | v5 stable | Self-hosted auth with Next.js | `auth()` function works in Server Components, Route Handlers, proxy.ts, Server Actions |
| Clerk | Current | Managed auth with Next.js | `auth()` and `currentUser()` in Server Components, `clerkMiddleware()` for route protection |
| Supabase Auth (`@supabase/ssr`) | Current | BaaS auth with Next.js/Astro | Cookie-based SSR auth, `supabase.auth.getClaims()` for server-side validation |
| Better Auth | Current | Modern self-hosted auth (Lucia replacement) | New projects needing self-hosted auth; Lucia is deprecated as of March 2025 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Better Auth | Lucia v3 | Lucia deprecated March 2025 -- do NOT recommend for new projects |
| `"use cache"` | `unstable_cache` | `unstable_cache` is legacy, replaced by `"use cache"` in Next.js 16 |
| Server Islands | Client-side fetch | Server Islands render on server per-request; client fetch adds JS bundle + waterfall |
| `cacheLife('hours')` | `revalidate: 3600` | Route segment config `revalidate` is deprecated with Cache Components; use `cacheLife` |

### No Installation Required

This skill produces SKILL.md patterns. The patterns reference built-in framework features. The skill itself has zero dependencies.

## Architecture Patterns

### Recommended Skill Structure

```
skills/
  ssr-dynamic-content/
    SKILL.md          # 4-layer format, Domain tier
```

### Pattern 1: Rendering Strategy Decision Matrix

**What:** A 4-dimension matrix that maps project requirements to the correct rendering strategy.
**When to use:** Every project that needs to decide between SSG, SSR, Cache Components, streaming, or Server Islands.

**Matrix dimensions:**
1. **Data freshness**: Static (build-time) / Stale-OK (minutes-hours) / Near-real-time (seconds) / Real-time (per-request)
2. **Personalization**: None / Segment-based (A/B) / User-specific (auth)
3. **Build frequency**: Rarely / Daily / Continuous (CMS-driven)
4. **Runtime**: Node.js only / Edge-compatible / Static hosting

**Decision logic:**
- No personalization + static data = SSG (`generateStaticParams`)
- No personalization + stale-OK = Cache Components (`"use cache"` + `cacheLife`)
- Segment personalization = Cache Components with pass-through composition
- User-specific + mostly static = Cache Components shell + Suspense for auth content
- Real-time + user-specific = Full SSR (Suspense boundaries, no cache)
- Astro equivalent: Static default, Server Islands for dynamic parts, `prerender = false` for full SSR

### Pattern 2: Next.js 16 Cache Components (Hybrid Page)

**What:** A page with static shell, cached dynamic content, and streaming per-request content.
**When to use:** Most content-driven pages with some dynamic elements.

Source: Next.js 16.1.6 official docs (https://nextjs.org/docs/app/getting-started/cache-components)

```typescript
// next.config.ts
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  cacheComponents: true,
}
export default nextConfig
```

```tsx
// app/blog/page.tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

export default function BlogPage() {
  return (
    <>
      {/* Static content -- prerendered automatically into shell */}
      <header><h1>Our Blog</h1></header>

      {/* Cached dynamic content -- included in static shell */}
      <BlogPosts />

      {/* Per-request content -- streams at request time */}
      <Suspense fallback={<p>Loading preferences...</p>}>
        <UserPreferences />
      </Suspense>
    </>
  )
}

// Cached: everyone sees the same posts, revalidated hourly
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  cacheTag('blog-posts')

  const posts = await db.query('SELECT * FROM posts ORDER BY published_at DESC LIMIT 10')
  return (
    <section>
      {posts.map(post => <article key={post.id}>{post.title}</article>)}
    </section>
  )
}

// Per-request: personalized, requires cookies
async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  return <aside>Your theme: {theme}</aside>
}
```

**Key rules:**
- `"use cache"` cannot access runtime APIs (`cookies()`, `headers()`, `searchParams`) -- read them outside and pass as arguments
- `cacheLife` accepts preset profiles: `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`
- `cacheTag` enables on-demand invalidation via `revalidateTag` or `updateTag`
- `updateTag` is for Server Actions (immediate expiry); `revalidateTag` is for Route Handlers (SWR with `'max'` profile)
- Cache Components requires Node.js runtime -- Edge runtime is NOT supported

### Pattern 3: Astro Server Islands (Equivalent of Cache Components)

**What:** Static page with deferred server-rendered islands for dynamic content.
**When to use:** Astro sites with mostly static pages that need a few dynamic components.

Source: Astro official docs (https://docs.astro.build/en/guides/server-islands/)

```astro
---
// src/components/UserGreeting.astro
// This component runs on the server PER REQUEST
const session = await getSession(Astro.cookies)
---

{session ? (
  <p>Welcome back, {session.user.name}</p>
) : (
  <a href="/login">Sign in</a>
)}
```

```astro
---
// src/pages/product/[id].astro (static page with server island)
import UserGreeting from '../../components/UserGreeting.astro'
import ProductReviews from '../../components/ProductReviews.astro'

export const prerender = true // Static by default in hybrid mode

const product = await getProduct(Astro.params.id)
---

<BaseLayout title={product.name}>
  <h1>{product.name}</h1>
  <p>{product.description}</p>

  <!-- Static content above, server islands below -->
  <UserGreeting server:defer>
    <p slot="fallback" class="animate-pulse">Loading...</p>
  </UserGreeting>

  <ProductReviews server:defer productId={product.id}>
    <div slot="fallback" class="animate-pulse">Loading reviews...</div>
  </ProductReviews>
</BaseLayout>
```

**Key differences from Next.js Cache Components:**
- Astro Server Islands do NOT stream in a single response; they are fetched as separate requests after the static shell loads
- No equivalent of `cacheLife` profiles -- caching is done via CDN Cache-Control headers
- No built-in tag-based revalidation -- use CDN purge APIs or rebuild

### Pattern 4: CMS Webhook Revalidation (Next.js 16)

**What:** Route Handler that receives CMS webhooks, verifies HMAC signature, and triggers on-demand revalidation.
**When to use:** Any CMS-driven content that needs to update without full rebuilds.

```typescript
// app/api/revalidate/route.ts
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

  // CMS-specific signature header (varies by provider)
  const signature = request.headers.get('x-webhook-signature') // Generic

  if (!signature || !verifySignature(body, signature, process.env.CMS_WEBHOOK_SECRET!)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = JSON.parse(body)

  // Revalidate relevant cache tags
  revalidateTag(payload.collection, 'max') // SWR behavior
  revalidateTag(`${payload.collection}-${payload.slug}`, 'max')

  // SEO bridge: also revalidate sitemap (connects to Phase 14-16)
  revalidateTag('sitemap', 'max')

  // Fire IndexNow for the updated URL (connects to Phase 16)
  await fetch(`${process.env.SITE_URL}/api/indexnow`, {
    method: 'POST',
    body: JSON.stringify({ urls: [`/${payload.collection}/${payload.slug}`] }),
  })

  return Response.json({ revalidated: true })
}
```

### Pattern 5: Auth-Gated Content with Cache Components

**What:** Mixed public/private page using Cache Components for the public shell and Suspense for auth content.
**When to use:** Pages with both public and authenticated content (e.g., product page with personalized pricing).

```tsx
// app/product/[id]/page.tsx
import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <>
      {/* Cached: everyone sees the same product info */}
      <ProductInfo id={id} />

      {/* Auth-gated: streams per-request */}
      <Suspense fallback={<div class="animate-pulse h-20" />}>
        <PersonalizedPricing id={id} />
      </Suspense>
    </>
  )
}

async function ProductInfo({ id }: { id: string }) {
  'use cache'
  cacheLife('hours')
  cacheTag(`product-${id}`)

  const product = await db.product.findUnique({ where: { id } })
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}

// NOT cached -- reads cookies, runs per-request
async function PersonalizedPricing({ id }: { id: string }) {
  const session = await getSession() // reads cookies internally
  if (!session) return <p>Sign in for member pricing</p>

  const price = await getMemberPrice(id, session.user.tier)
  return <p>Your price: ${price}</p>
}
```

### Anti-Patterns to Avoid

- **Using `middleware.ts` in Next.js 16:** Renamed to `proxy.ts` with `export default function proxy()`. `middleware.ts` will not execute.
- **Using `experimental: { ppr: true }`:** Replaced by `cacheComponents: true` in `next.config.ts`.
- **Using `unstable_cache`:** Replaced by `"use cache"` directive in Next.js 16.
- **Route segment config `revalidate`:** Replaced by `cacheLife` with Cache Components.
- **Route segment config `dynamic = 'force-dynamic'`:** Not needed; all pages are dynamic by default with Cache Components.
- **`fetchCache` config:** Not needed; `"use cache"` automatically caches all fetches in its scope.
- **Using `runtime = 'edge'` with Cache Components:** Cache Components requires Node.js runtime. Edge is NOT supported.
- **Calling `cookies()`/`headers()` inside `"use cache"`:** Runtime APIs cannot be used inside cached scopes. Read them outside and pass values as arguments.
- **Using Lucia Auth for new projects:** Deprecated March 2025. Use Better Auth or Auth.js v5 instead.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cache key generation | Manual cache key strings | `"use cache"` directive | Compiler auto-generates keys from function ID + serialized args + build ID |
| Stale-while-revalidate | Manual SWR logic | `cacheLife` profiles | 7 preset profiles with stale/revalidate/expire tuning |
| Tag-based invalidation | Custom cache invalidation system | `cacheTag` + `revalidateTag`/`updateTag` | Framework-integrated, works across Data Cache and Full Route Cache |
| Webhook signature verification | Manual string comparison | `crypto.timingSafeEqual` | Timing-safe comparison prevents side-channel attacks |
| Draft mode toggle | Custom preview cookie system | `draftMode()` API | Built-in async function with enable/disable/isEnabled |
| Partial prerendering | Custom shell + client fetch | Cache Components (Next.js) / Server Islands (Astro) | Framework handles the static shell extraction automatically |
| ISR-equivalent in Astro | Custom revalidation timer | CDN `Cache-Control: s-maxage=X, stale-while-revalidate=Y` | Standard HTTP headers, works with any CDN |
| Connection pooling | Manual pool management | Neon pooler / Prisma Accelerate / Supabase pooler | Built-in poolers handle connection lifecycle in serverless |

**Key insight:** Next.js 16's Cache Components system is a complete rendering strategy -- the compiler handles cache key generation, the framework manages the cache lifecycle, and the static shell is extracted automatically during build. Do not attempt to replicate this behavior manually.

## Common Pitfalls

### Pitfall 1: Assuming PPR Still Exists in Next.js 16

**What goes wrong:** Code uses `experimental: { ppr: true }` or references "Partial Pre-Rendering" as a separate feature. In Next.js 16, PPR graduated to "Cache Components" with a completely different API.
**Why it happens:** Training data and blog posts from 2024-early 2025 reference PPR as experimental. Next.js 16 renamed and stabilized it.
**How to avoid:** Use `cacheComponents: true` in next.config.ts. Use `"use cache"` directive + `cacheLife` + `cacheTag`. Never reference `ppr` config.
**Warning signs:** `experimental.ppr` in config, references to "PPR" in code comments.

### Pitfall 2: Using `"use cache"` with Runtime APIs

**What goes wrong:** Code calls `cookies()`, `headers()`, or accesses `searchParams` inside a `"use cache"` scope. The build either hangs (timeout after 50s) or fails immediately with an error.
**Why it happens:** `"use cache"` executes at build time for prerendering. Runtime APIs need a request context that doesn't exist at build time.
**How to avoid:** Read runtime data OUTSIDE the cached scope, then pass values as arguments to cached functions. The argument becomes part of the cache key.
**Warning signs:** "Filling a cache during prerender timed out" error, "next-request-in-use-cache" error.

### Pitfall 3: Edge Runtime with Cache Components

**What goes wrong:** Route or page uses `runtime = 'edge'` alongside Cache Components. Build fails or runtime errors occur.
**Why it happens:** Cache Components requires Node.js runtime. Edge Runtime does not support ISR or the `"use cache"` directive.
**How to avoid:** Remove `runtime = 'edge'` from any route using Cache Components. In Next.js 16, `proxy.ts` also runs on Node.js only (Edge runtime support removed for proxy).
**Warning signs:** Edge runtime errors, missing cache behavior in production.

### Pitfall 4: Not Understanding the 4 Next.js Cache Layers

**What goes wrong:** Developer expects one cache invalidation call to clear everything, but stale content persists because they only cleared one layer.
**Why it happens:** Next.js has 4 distinct caching layers that interact:
1. **Request Memoization** -- deduplicates fetch calls within a single render pass (automatic, per-request)
2. **Data Cache** -- persistent storage for fetch results (survives restarts, cleared by `revalidateTag`/`updateTag`)
3. **Full Route Cache** -- pre-rendered HTML/RSC payload (depends on Data Cache, cleared when Data Cache is invalidated)
4. **Router Cache** -- client-side, survives navigation (needs `router.refresh()` or hard refresh to clear, minimum 30s stale time)
**How to avoid:** The skill must explain all 4 layers with a diagram showing their relationships. Key insight: invalidating Data Cache also invalidates Full Route Cache, but Router Cache requires a separate client-side refresh.
**Warning signs:** Content updates in CMS but frontend shows stale data, `router.refresh()` fixes the issue.

### Pitfall 5: Astro ISR Expectations

**What goes wrong:** Developer expects Astro to have Next.js-like ISR with built-in `revalidate` intervals. They create SSR pages expecting automatic background revalidation.
**Why it happens:** Astro does NOT have built-in ISR. It has SSG and SSR. ISR-like behavior requires CDN Cache-Control headers.
**How to avoid:** For Astro, ISR is achieved by setting `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` on SSR responses. This is a CDN feature, not an Astro feature. Platform-specific adapters (Vercel, Netlify) may provide ISR-like features.
**Warning signs:** Looking for `revalidate` export in Astro pages, expecting `getStaticPaths` to auto-revalidate.

### Pitfall 6: `revalidateTag` Without `'max'` Profile

**What goes wrong:** Code calls `revalidateTag('products')` without the second argument. This uses deprecated immediate-expiry behavior instead of the recommended SWR pattern.
**Why it happens:** Old documentation and examples show `revalidateTag` with one argument.
**How to avoid:** Always use `revalidateTag('tag-name', 'max')` for stale-while-revalidate behavior. Use `updateTag('tag-name')` for immediate expiry in Server Actions.
**Warning signs:** Content goes blank briefly after revalidation instead of showing stale-then-fresh.

### Pitfall 7: Supabase `getSession()` in Server Code

**What goes wrong:** Server-side code uses `supabase.auth.getSession()` to check authentication. This does NOT validate the JWT signature and can be spoofed.
**Why it happens:** `getSession()` reads the session from cookies without cryptographic verification.
**How to avoid:** Use `supabase.auth.getClaims()` or `supabase.auth.getUser()` in server-side code. Both validate the JWT signature against Supabase's public keys.
**Warning signs:** Using `getSession()` in Server Components, Route Handlers, or Server Actions.

## Code Examples

### Next.js 16 cacheLife Preset Profiles

Source: Next.js 16.1.6 official docs (https://nextjs.org/docs/app/api-reference/functions/cacheLife)

| Profile | Use Case | `stale` | `revalidate` | `expire` |
|---------|----------|---------|--------------|----------|
| `default` | Standard content | 5 min | 15 min | never |
| `seconds` | Real-time data (stock prices, live scores) | 30s | 1s | 1 min |
| `minutes` | Frequently updated (social feeds, news) | 5 min | 1 min | 1 hour |
| `hours` | Multiple daily updates (product inventory) | 5 min | 1 hour | 1 day |
| `days` | Daily updates (blog posts, articles) | 5 min | 1 day | 1 week |
| `weeks` | Weekly updates (podcasts, newsletters) | 5 min | 1 week | 30 days |
| `max` | Rarely changes (legal pages, archives) | 5 min | 30 days | 1 year |

Custom profiles in next.config.ts:

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

### Next.js 16 Draft Mode

Source: Next.js 16.1.6 official docs (https://nextjs.org/docs/app/guides/draft-mode)

```typescript
// app/api/draft/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.CMS_PREVIEW_SECRET || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  // Verify the slug exists in CMS
  const page = await cmsClient.getPageBySlug(slug)
  if (!page) return new Response('Invalid slug', { status: 401 })

  // Enable Draft Mode (async in Next.js 16)
  const draft = await draftMode()
  draft.enable()

  // Redirect to the page (not searchParams.slug to prevent open redirect)
  redirect(page.slug)
}

// app/api/draft/disable/route.ts -- Exit draft mode
export async function GET() {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode disabled')
}
```

Reading draft mode in Server Components:

```tsx
// app/blog/[slug]/page.tsx
import { draftMode } from 'next/headers'

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled } = await draftMode()

  // Fetch draft or published content based on mode
  const post = isEnabled
    ? await cmsClient.getDraft(slug)
    : await cmsClient.getPublished(slug)

  return (
    <>
      {isEnabled && (
        <div className="bg-yellow-100 p-2 text-sm">
          Draft Mode -- <a href="/api/draft/disable">Exit</a>
        </div>
      )}
      <article>{post.content}</article>
    </>
  )
}
```

### CMS Webhook Signature Patterns (Per-CMS)

#### Sanity

```typescript
// Sanity uses @sanity/webhook for verification
// Header: sanity-webhook-signature
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? ''

  if (!isValidSignature(body, signature, process.env.SANITY_WEBHOOK_SECRET!)) {
    return new Response('Invalid signature', { status: 401 })
  }

  const payload = JSON.parse(body)
  revalidateTag(payload._type, 'max')
  return Response.json({ revalidated: true })
}
```

#### Contentful

```typescript
// Contentful uses request verification via @contentful/node-apps-toolkit or manual HMAC
// Headers: x-contentful-signature, x-contentful-signed-headers, x-contentful-timestamp
// Signing secret configured in webhook settings

import { createHmac, timingSafeEqual } from 'crypto'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-contentful-signature')
  const secret = process.env.CONTENTFUL_WEBHOOK_SECRET!

  // Simplified verification (production should use canonical string method)
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  const valid = signature && timingSafeEqual(
    Buffer.from(signature), Buffer.from(expected)
  )

  if (!valid) return new Response('Unauthorized', { status: 401 })

  const payload = JSON.parse(body)
  const contentType = payload.sys?.contentType?.sys?.id
  if (contentType) revalidateTag(contentType, 'max')
  return Response.json({ revalidated: true })
}
```

#### Strapi

```typescript
// Strapi v5 webhooks: configurable at Settings > Webhooks
// Use shared secret token in query string or custom header
// Recommendation: use HMAC signing over raw body + timestamp

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-strapi-signature')
  const secret = process.env.STRAPI_WEBHOOK_SECRET!

  const expected = createHmac('sha256', secret).update(body).digest('hex')
  if (!signature || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = JSON.parse(body)
  const collection = payload.model // e.g., 'article', 'page'
  const slug = payload.entry?.slug

  revalidateTag(collection, 'max')
  if (slug) revalidateTag(`${collection}-${slug}`, 'max')
  return Response.json({ revalidated: true })
}
```

#### Payload CMS

```typescript
// Payload CMS is Next.js-native -- uses afterChange/afterDelete hooks
// Hooks have direct access to revalidateTag since Payload runs in the same Next.js process

// payload.config.ts (collection hook)
{
  collections: [
    {
      slug: 'posts',
      hooks: {
        afterChange: [
          async ({ doc }) => {
            // Direct revalidation -- no webhook needed
            const { revalidateTag } = await import('next/cache')
            revalidateTag('posts', 'max')
            revalidateTag(`post-${doc.slug}`, 'max')
          },
        ],
      },
    },
  ],
}
```

#### Hygraph

```typescript
// Hygraph uses gcms-signature header
// Verify with @hygraph/utils or manual HMAC-SHA256
import { verifyWebhookSignature } from '@hygraph/utils'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('gcms-signature') ?? ''

  const { isValid } = verifyWebhookSignature({
    body,
    signature,
    secret: process.env.HYGRAPH_WEBHOOK_SECRET!,
  })

  if (!isValid) return new Response('Unauthorized', { status: 401 })

  const payload = JSON.parse(body)
  revalidateTag(payload.data.__typename?.toLowerCase(), 'max')
  return Response.json({ revalidated: true })
}
```

### Auth Library Server Component Patterns

#### Auth.js v5

```typescript
// auth.ts (root config)
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig)

// Server Component usage
import { auth } from '@/auth'

export default async function ProtectedPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return <div>Welcome, {session.user.name}</div>
}
```

#### Clerk

```typescript
// Server Component usage
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function ProtectedPage() {
  const { userId, isAuthenticated } = await auth()
  if (!isAuthenticated) redirect('/sign-in')

  const user = await currentUser()
  return <div>Welcome, {user?.firstName}</div>
}
```

#### Supabase

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
}

// Server Component usage
export default async function ProtectedPage() {
  const supabase = await createClient()
  // IMPORTANT: use getClaims() not getSession() for server-side validation
  const { data: claims } = await supabase.auth.getClaims()
  if (!claims) redirect('/login')

  return <div>Welcome, {claims.sub}</div>
}
```

### Connection Pooling for Serverless

```typescript
// Neon with Drizzle (recommended for serverless)
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Use pooled connection string (hostname includes -pooler)
const sql = neon(process.env.DATABASE_URL!) // pooled: *.us-east-2.aws.neon.tech
export const db = drizzle(sql)

// Neon with Prisma
// .env: DATABASE_URL includes -pooler hostname for serverless
// .env: DIRECT_URL uses direct hostname for migrations
// schema.prisma:
// datasource db {
//   provider  = "postgresql"
//   url       = env("DATABASE_URL")       // Pooled for runtime
//   directUrl = env("DIRECT_URL")         // Direct for migrations
// }
```

### Astro SSR with Cache Headers (ISR-Equivalent)

```astro
---
// src/pages/blog/[slug].astro
export const prerender = false // SSR page

const { slug } = Astro.params
const post = await db.post.findUnique({ where: { slug } })

if (!post) return new Response(null, { status: 404 })

// ISR-equivalent via Cache-Control headers
Astro.response.headers.set(
  'Cache-Control',
  'public, s-maxage=3600, stale-while-revalidate=86400'
)
---

<BaseLayout title={post.title}>
  <article>{post.content}</article>
</BaseLayout>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| `experimental: { ppr: true }` | `cacheComponents: true` | Next.js 16 | PPR graduated to Cache Components; completely new API |
| `"use cache"` experimental | `"use cache"` stable | Next.js 16 | Directive is production-ready; `unstable_cache` deprecated |
| `revalidateTag(tag)` one-arg | `revalidateTag(tag, 'max')` two-arg | Next.js 16 | Single-arg is legacy (immediate expiry); two-arg uses SWR |
| No `updateTag` | `updateTag(tag)` | Next.js 16 | New API for Server Actions -- immediate expiry for read-your-own-writes |
| `middleware.ts` | `proxy.ts` | Next.js 16 | Renamed; runs on Node.js only (Edge removed for proxy) |
| Route segment `revalidate` | `cacheLife` profiles | Next.js 16 | Numeric revalidate replaced by semantic profiles |
| Route segment `fetchCache` | Automatic via `"use cache"` | Next.js 16 | No longer needed |
| `dynamic = 'force-dynamic'` | Default behavior | Next.js 16 | All pages are dynamic by default with Cache Components |
| Lucia Auth v3 | Better Auth / Auth.js v5 | March 2025 | Lucia deprecated; Better Auth is the modern replacement |
| `supabase.auth.getSession()` | `supabase.auth.getClaims()` | 2025 | `getSession()` does not validate JWT; `getClaims()` does |
| `@supabase/auth-helpers` | `@supabase/ssr` | 2024-2025 | Old package deprecated in favor of SSR-focused package |

**Deprecated/outdated:**
- `unstable_cache`: Replaced by `"use cache"` directive
- `experimental: { ppr: true }`: Replaced by `cacheComponents: true`
- `middleware.ts`: Renamed to `proxy.ts` in Next.js 16
- Lucia Auth: Deprecated March 2025, now educational resources only
- `@supabase/auth-helpers`: Deprecated in favor of `@supabase/ssr`
- Route segment configs (`revalidate`, `fetchCache`, `dynamic`): Replaced by Cache Components APIs

## Edge Runtime Limitations Matrix

Source: Next.js 16.1.6 official docs (https://nextjs.org/docs/app/api-reference/edge)

| Capability | Node.js Runtime | Edge Runtime |
|---|---|---|
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

**Decision rule:** If the page uses Cache Components, `"use cache"`, on-demand revalidation, or database connections, it MUST use Node.js runtime. Edge runtime is only appropriate for simple Route Handlers doing fetch-based API proxying or redirects.

## Open Questions

1. **Astro 6 Server Islands Changes**
   - What we know: Server Islands are stable in Astro 5 with `server:defer` directive. Astro 6 is described as imminent.
   - What's unclear: Whether Astro 6 introduces any changes to Server Islands behavior, new caching primitives, or streaming improvements.
   - Recommendation: Use `server:defer` as documented -- it is forward-compatible. Note in the skill that Astro 6 may introduce additional features.

2. **`revalidateTag` Second Argument Adoption**
   - What we know: Next.js 16 introduced `revalidateTag(tag, 'max')` for SWR behavior. The single-arg form is labeled "deprecated" in some sources.
   - What's unclear: Whether the single-arg form will be removed in a future version or just discouraged.
   - Recommendation: Always use the two-arg form `revalidateTag(tag, 'max')` in all examples. Document the single-arg form as legacy.

3. **Better Auth Maturity**
   - What we know: Better Auth is recommended as the modern Lucia replacement. It has growing adoption.
   - What's unclear: Exact API stability, version number, and long-term maintenance commitment.
   - Recommendation: Include Better Auth as the Lucia replacement recommendation, but mark it as MEDIUM confidence. Auth.js v5 and Clerk are higher-confidence choices for production.

4. **Contentful Webhook Signature Verification**
   - What we know: Contentful uses a "canonical string" method for signature verification, documented in their official docs.
   - What's unclear: Whether their `@contentful/node-apps-toolkit` package or a simpler pattern is the right recommendation for Next.js Route Handlers.
   - Recommendation: Show the manual HMAC pattern (consistent with other CMS examples) with a note about the official package. Fetch Contentful's verification docs when writing the skill.

## Sources

### Primary (HIGH confidence)

- Next.js 16.1.6 Cache Components Guide -- https://nextjs.org/docs/app/getting-started/cache-components (fetched 2026-02-25, version 16.1.6 confirmed)
- Next.js 16.1.6 Caching and Revalidating -- https://nextjs.org/docs/app/getting-started/caching-and-revalidating (fetched 2026-02-25)
- Next.js 16.1.6 `use cache` API Reference -- https://nextjs.org/docs/app/api-reference/directives/use-cache (fetched 2026-02-25)
- Next.js 16.1.6 `cacheLife` API Reference -- https://nextjs.org/docs/app/api-reference/functions/cacheLife (fetched 2026-02-25)
- Next.js 16.1.6 Edge Runtime API Reference -- https://nextjs.org/docs/app/api-reference/edge (fetched 2026-02-25)
- Next.js 16.1.6 Draft Mode Guide -- https://nextjs.org/docs/app/guides/draft-mode (fetched 2026-02-25)
- Astro On-Demand Rendering Guide -- https://docs.astro.build/en/guides/on-demand-rendering/ (fetched 2026-02-25)
- Astro Server Islands Guide -- https://docs.astro.build/en/guides/server-islands/ (fetched 2026-02-25)
- Modulo `nextjs-patterns` skill -- `skills/nextjs-patterns/SKILL.md` (local, confirms proxy.ts, async params, Cache Components)
- Modulo `astro-patterns` skill -- `skills/astro-patterns/SKILL.md` (local, confirms Server Islands, hybrid mode)
- Modulo Phase 17 Research -- `.planning/phases/17-api-integration-patterns/17-RESEARCH.md` (local, webhook patterns)

### Secondary (MEDIUM confidence)

- Sanity webhook best practices -- https://www.sanity.io/docs/content-lake/webhook-best-practices (WebSearch + official docs)
- Contentful webhook signing -- https://www.contentful.com/developers/docs/webhooks/request-verification/ (WebSearch + official docs)
- Strapi webhook docs -- https://docs.strapi.io/cms/backend-customization/webhooks (WebSearch + official docs)
- Hygraph webhook signing -- https://hygraph.com/blog/introducing-signed-webhooks (WebSearch + official docs)
- `@hygraph/utils` package -- https://github.com/hygraph/hygraph-utils (GitHub)
- Auth.js v5 migration guide -- https://authjs.dev/getting-started/migrating-to-v5 (official docs)
- Clerk Next.js SDK -- https://clerk.com/docs/reference/nextjs/overview (official docs)
- Supabase Server-Side Auth -- https://supabase.com/docs/guides/auth/server-side/nextjs (official docs)
- Neon connection pooling -- https://neon.com/docs/connect/connection-pooling (official docs)
- Prisma deploy to Vercel -- https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-vercel (official docs)

### Tertiary (LOW confidence)

- Better Auth recommendation -- Multiple WebSearch sources (no official docs verified); Lucia deprecation confirmed
- Astro 6 Server Islands forward-compatibility -- Based on Astro patterns skill (local) + general WebSearch
- `revalidateTag` second argument deprecation status -- WebSearch only, not found in official changelog
- Drizzle vs Prisma serverless performance claims -- https://designrevision.com/blog/prisma-vs-drizzle (blog, 2026)

## Metadata

**Confidence breakdown:**
- Standard stack (Next.js 16 Cache Components): HIGH -- All APIs verified against official Next.js 16.1.6 docs (dated 2026-02-20)
- Standard stack (Astro SSR/Server Islands): HIGH -- Verified against official Astro docs and existing Modulo astro-patterns skill
- Architecture patterns: HIGH -- Code examples sourced from official Next.js and Astro docs
- CMS revalidation: MEDIUM-HIGH -- Sanity, Strapi, Payload patterns well-documented; Contentful and Hygraph verification details less clear
- Auth libraries: MEDIUM-HIGH -- Auth.js v5 and Clerk well-documented; Supabase SSR verified; Better Auth is MEDIUM
- Edge runtime limitations: HIGH -- Verified against official Next.js Edge Runtime API reference
- Connection pooling: MEDIUM -- Neon and Prisma patterns verified with official docs; Drizzle comparison is MEDIUM
- Cache layer explanation: HIGH -- 4-layer model verified with multiple official and high-quality sources
- Pitfalls: HIGH -- Based on official documentation notes and verified error messages

**Research date:** 2026-02-25
**Valid until:** 2026-04-25 (60 days -- Next.js and Astro APIs are stable; check for minor updates to cacheLife profiles and auth library versions)
