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
