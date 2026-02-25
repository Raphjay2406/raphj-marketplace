# Phase 14: Core SEO Foundation - Research

**Researched:** 2026-02-25
**Domain:** SEO metadata, sitemaps, robots.txt, canonical URLs, framework-native APIs
**Confidence:** HIGH

## Summary

Phase 14 rewrites the existing `seo-meta` skill from utility-tier to Core-tier, replacing all deprecated patterns (react-helmet-async, next-seo) with framework-native APIs for Next.js 16, Astro 5/6, and React 19. The research confirms that the framework-native approach is correct and complete -- no third-party SEO libraries are needed for meta tags, canonicals, sitemaps, or robots.txt.

The most significant finding is that Next.js 16 introduced breaking changes to the async API pattern: `params` in `generateMetadata` is now `Promise<{ slug: string }>` (confirmed, same as Next.js 15 but synchronous fallback removed), and `id` in `generateSitemaps`/`sitemap` is now `Promise<string>` (new in v16). The existing skill's Next.js patterns are mostly correct but need these async updates. React 19's native metadata hoisting (`<title>`, `<meta>`, `<link>`) works for basic cases but has real limitations around deduplication and cleanup that the skill must document honestly. Astro's head management remains unchanged and straightforward.

The AI crawler taxonomy research yielded a comprehensive list of 30+ bots with clear categorization (search vs training vs user-triggered). The blocklist approach (allow by default, block training bots) is confirmed as the right strategy per the CONTEXT.md decisions.

**Primary recommendation:** Write the skill with framework-specific, self-contained recipe sections. Each framework recipe must include the exact async syntax for Next.js 16, raw `<head>` patterns for Astro, and React 19 native hoisting with honest SPA limitation disclosures.

## 1. Next.js 16 generateMetadata Syntax

**Confidence: HIGH** (verified via official Next.js 16.1.6 docs, fetched 2026-02-25)

### Breaking Change: Fully Async Params

Next.js 16 **removes synchronous access entirely**. The `params` and `searchParams` in `generateMetadata` are `Promise` types that must be awaited. This was introduced in Next.js 15 as a deprecation; Next.js 16 makes it mandatory.

**Correct Next.js 16 signature:**

```tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  // ...
}
```

**Type helper (new in Next.js 15.5+):** Run `npx next typegen` to auto-generate `PageProps<'/route'>` and `LayoutProps<'/route'>` helpers:

```tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
}
```

### Streaming Metadata (New in v15.2+)

Next.js can now stream metadata -- it sends the initial UI before `generateMetadata` completes. Metadata is appended to `<body>` for JS-capable bots (Googlebot) and blocks rendering for HTML-limited bots (facebookexternalhit). The framework auto-detects bot type via User-Agent. This is enabled by default.

**Implication for skill:** The skill should mention streaming metadata as a performance benefit but note that HTML-limited bots still get blocking behavior (correct for social previews).

### Key Metadata Fields (verified)

All fields from the existing skill are still valid. Additional confirmed fields:

| Field | Type | Purpose |
|-------|------|---------|
| `metadataBase` | `URL` | Base URL for all relative metadata paths |
| `title` | `string \| { default, template, absolute }` | Page title with template support |
| `description` | `string` | Meta description |
| `openGraph` | `OpenGraph` | Full OG protocol support |
| `twitter` | `Twitter` | Twitter/X card support |
| `robots` | `Robots` | Per-bot crawl directives |
| `alternates` | `{ canonical, languages, media, types }` | Canonicals + hreflang |
| `verification` | `{ google, yandex, yahoo, other }` | Webmaster verification |
| `icons` | `Icons` | Favicon and touch icons |
| `facebook` | `{ appId \| admins }` | Facebook app integration |
| `pinterest` | `{ richPin }` | Pinterest Rich Pins |
| `other` | `Record<string, string \| string[]>` | Custom meta tags |

**Deprecated fields (removed from metadata, moved to viewport):**
- `themeColor` -- use `generateViewport` instead
- `colorScheme` -- use `generateViewport` instead
- `viewport` -- use `generateViewport` instead

### Metadata Merging Behavior

Page metadata **shallowly overrides** layout metadata. Nested fields like `openGraph` are replaced entirely if the page defines them (not deep-merged). The skill must teach the shared metadata pattern:

```tsx
// app/shared-metadata.ts
export const openGraphImage = { images: ['https://...'] }

// app/about/page.tsx
import { openGraphImage } from '../shared-metadata'
export const metadata = {
  openGraph: { ...openGraphImage, title: 'About' },
}
```

## 2. React 19 Native Metadata Hoisting

**Confidence: HIGH for basic behavior, MEDIUM for edge cases** (verified via official React docs at react.dev)

### How It Works

React 19 automatically hoists `<title>`, `<meta>`, and `<link>` elements from anywhere in the component tree to the document `<head>`. This works in:
- Client-side rendering (CSR)
- Streaming SSR
- Server Components

**Basic pattern (replaces react-helmet-async):**

```tsx
function BlogPost({ post }) {
  return (
    <>
      <title>{`${post.title} | My Site`}</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={post.coverImage} />
      <link rel="canonical" href={`https://example.com/blog/${post.slug}`} />
      <article>{/* content */}</article>
    </>
  )
}
```

### Hoisting Exceptions (No Special Behavior)

| Element | Condition | Behavior |
|---------|-----------|----------|
| `<title>` | Inside `<svg>` | SVG accessibility annotation, not hoisted |
| `<title>` | Has `itemProp` prop | Microdata, not hoisted |
| `<meta>` | Has `itemProp` prop | Microdata, rendered inline |
| `<link>` | `rel="stylesheet"` without `precedence` | Rendered in place |
| `<link>` | Has `onLoad` or `onError` | Manual resource management |

### Critical Limitations

**1. Title deduplication is NOT handled:**
If multiple components render `<title>` simultaneously, React places ALL of them in `<head>`. Browser behavior with multiple `<title>` tags is undefined. The skill must warn that only one component should render `<title>` at a time.

**2. Title children must be a single string:**
```tsx
// WRONG -- creates an array, will error
<title>Results page {pageNumber}</title>

// CORRECT -- template literal produces single string
<title>{`Results page ${pageNumber}`}</title>
```

**3. Meta tag cleanup on unmount is NOT guaranteed:**
React docs state it "may leave links in the DOM after component unmounts." This means route changes in SPAs may accumulate stale meta tags. The skill must document this limitation.

**4. No built-in route-aware deduplication:**
Unlike react-helmet-async which deduplicates by `name`/`property` attributes, React 19 native hoisting does not deduplicate `<meta>` tags. Multiple components rendering the same `name="description"` will produce duplicates.

### Comparison: React 19 Native vs react-helmet-async

| Feature | React 19 Native | react-helmet-async |
|---------|----------------|-------------------|
| Basic title/meta hoisting | Yes | Yes |
| Deduplication by name/property | No | Yes |
| Cleanup on unmount | Not guaranteed | Yes |
| SSR support | Yes (built-in) | Yes (with provider) |
| React 19 compatible | Yes | No (peer dep issues) |
| Route-aware overrides | Manual | Automatic |
| Open Graph tags | Yes (via `property` prop) | Yes |

### Recommendation for Skill

Teach React 19 native hoisting as the PRIMARY approach. For the SPA limitation, recommend a `<SEOMeta>` wrapper component that consolidates all meta tags in one place per route, preventing deduplication issues. If a project needs complex route-based metadata management, recommend `@dr.pogodin/react-helmet` (actively maintained fork).

**The skill must be honest:** React 19 native hoisting works well for simple cases but is not a full replacement for react-helmet in complex SPA routing scenarios. The primary recommendation remains: if SEO is critical, use Next.js or Astro instead of React/Vite SPA.

## 3. Astro 5/6 Head Management

**Confidence: HIGH** (Astro patterns are stable and well-documented)

### Astro Head Patterns (Unchanged)

Astro's approach has not changed significantly. You control `<head>` directly in layout components:

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
}
const { title, description, canonicalUrl, image = '/og-image.png' } = Astro.props;
const canonical = canonicalUrl ?? Astro.url.href;
const imageUrl = new URL(image, Astro.site).href;
---
<html>
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={imageUrl} />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body><slot /></body>
</html>
```

**Key APIs:**
- `Astro.url.href` -- current page URL (for canonical generation)
- `Astro.site` -- site base URL from `astro.config.mjs` `site` option
- `Astro.props` -- metadata passed from page to layout

### @astrojs/sitemap (v3.7.0)

**Confidence: HIGH** (official Astro integration)

Configuration options:
- `filter(page)` -- function to exclude pages
- `customPages` -- manual URL list (required for SSR dynamic routes)
- `entryLimit` -- max entries per sitemap file (default: 45,000)
- `changefreq`, `lastmod`, `priority` -- per-entry metadata
- `i18n` -- locale configuration for hreflang in sitemap
- `customSitemaps` (new in 3.7.0) -- split sitemap by custom logic
- `excludeNamespaces` -- remove XML namespaces (news, xhtml, image, video)
- `filenameBase` -- custom sitemap filename

**SSR limitation:** Cannot auto-discover dynamic routes in `output: "server"` mode. Must specify via `customPages`.

### Astro Trailing Slash

Astro offers three modes in `astro.config.mjs`:
- `trailingSlash: 'ignore'` (default) -- matches both with and without
- `trailingSlash: 'always'` -- only URLs with trailing slash
- `trailingSlash: 'never'` -- only URLs without trailing slash

**SEO recommendation:** Set to `'always'` or `'never'` (never `'ignore'`) and ensure server/hosting redirects the other variant with 301. The `astro-canonical` integration can enforce consistency at build time.

## 4. Canonical URL Best Practices 2026

**Confidence: HIGH** (well-established SEO principles, verified via multiple sources)

### Hard Rules for the Skill

1. **Always dynamic, never hardcoded** -- Generate from the current route path
2. **Always absolute URLs** -- `https://example.com/about`, never `/about`
3. **Self-referencing** -- Each page's canonical points to itself (unless consolidating duplicates)
4. **Trailing slash consistency** -- Pick one format, enforce everywhere (canonical, sitemap, internal links)
5. **Protocol consistency** -- Always HTTPS
6. **www consistency** -- Pick www or non-www, redirect the other
7. **Canonical and sitemap must match** -- Every sitemap URL must match its canonical

### Framework Patterns

**Next.js 16 -- `metadataBase` + relative canonical:**

```tsx
// app/layout.tsx -- set once in root layout
export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
}

// app/blog/[slug]/page.tsx -- relative canonical
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    alternates: {
      canonical: `/blog/${slug}`, // resolved against metadataBase
    },
  }
}
```

**Known issue:** `metadataBase` normalizes trailing slashes. Setting `metadataBase: new URL('https://example.com/')` results in `https://example.com` (slash stripped). The canonical path itself controls whether the final URL has a trailing slash. Coordinate with `next.config.ts` `trailingSlash` setting.

**Astro -- `Astro.url.href`:**

```astro
<link rel="canonical" href={Astro.url.href} />
```

**React/Vite -- manual:**

```tsx
<link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}${pathname}`} />
```

### Pagination Canonicals

**Google deprecated `rel="prev"/"next"` in March 2019** and confirmed it had been ignoring the markup for years. Current guidance:

- Each paginated page should have a self-referencing canonical
- Use standard `<a href>` links between paginated pages
- Do NOT canonicalize all pages to page 1 (this hides page 2+ content)
- Do NOT use `noindex` on paginated pages (prevents indexing)
- Google's crawler automatically recognizes pagination patterns

### Cross-Domain Canonicals

Valid for content syndication. The canonical on the syndicated copy points to the original domain. Both domains must be accessible to crawlers.

## 5. AI Crawler Taxonomy 2026

**Confidence: HIGH** (verified via Cloudflare report, Momentic Marketing list, and multiple SEO sources)

### Complete Bot Categorization

#### Search Bots (ALLOW for visibility)

| User-Agent | Operator | Purpose | Respects robots.txt |
|-----------|----------|---------|-------------------|
| `Googlebot` | Google | Search indexing | Yes |
| `Bingbot` | Microsoft | Bing search + Copilot | Yes |
| `OAI-SearchBot` | OpenAI | ChatGPT search results | Yes |
| `ChatGPT-User` | OpenAI | User-triggered page fetches | Yes |
| `PerplexityBot` | Perplexity | Perplexity AI search | Yes |
| `DuckAssistBot` | DuckDuckGo | DuckAssist AI answers | Yes |
| `Applebot` | Apple | Siri, Spotlight, Safari | Yes |
| `YandexBot` | Yandex | Yandex search | Yes |

#### Training Bots (BLOCK unless opted in)

| User-Agent | Operator | Purpose | Respects robots.txt |
|-----------|----------|---------|-------------------|
| `GPTBot` | OpenAI | GPT model training data | Yes |
| `Google-Extended` | Google | Gemini AI training | Yes |
| `ClaudeBot` | Anthropic | Claude model training | Yes |
| `anthropic-ai` | Anthropic | Anthropic data collection | Yes |
| `CCBot` | Common Crawl | Open dataset for AI training | Yes |
| `Meta-ExternalAgent` | Meta | LLM training data | Yes |
| `Bytespider` | ByteDance | AI model training | Yes |
| `cohere-ai` | Cohere | Cohere model training | Yes |
| `Amazonbot` | Amazon | AI/search data collection | Yes |
| `FacebookBot` | Meta | Content indexing | Yes |

#### User-Triggered Fetchers (ALLOW -- on-demand, not crawling)

| User-Agent | Operator | Purpose | Respects robots.txt |
|-----------|----------|---------|-------------------|
| `ChatGPT-User` | OpenAI | User shares link in ChatGPT | Yes |
| `Perplexity-User` | Perplexity | User clicks citation | Generally no |
| `MistralAI-User` | Mistral | Le Chat citation fetch | Unknown |
| `claude-web` | Anthropic | Recent web content for Claude | Unknown |
| `Claude-SearchBot` | Anthropic | Claude search results | Yes |

#### Emerging/Niche Bots

| User-Agent | Operator | Purpose |
|-----------|----------|---------|
| `Applebot-Extended` | Apple | Apple Intelligence training |
| `AI2Bot` | Allen Institute | Research AI training |
| `YouBot` | You.com | You.com AI search |
| `PhindBot` | Phind | Developer AI search |
| `ExaBot` | Exa | AI search engine |

### Market Trends (2025-2026)

- GPTBot surged from 5% to 30% of AI bot traffic between May 2024 and May 2025
- Meta-ExternalAgent entered at 19% market share
- Over 560k sites now have AI-bot-specific robots.txt rules
- `Perplexity-User` generally ignores robots.txt (noted in multiple sources)

### Recommended robots.txt Template

```
# Standard crawlers -- ALLOW
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

# AI Search Bots -- ALLOW for visibility in AI search results
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Applebot
Allow: /

# AI Training Bots -- BLOCK to protect content from model training
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: cohere-ai
Disallow: /

# Sitemap
Sitemap: https://example.com/sitemap.xml
```

### Review Protocol

The skill should include a "last verified" date stamp and quarterly review cadence instruction, as new bots appear frequently. The `Perplexity-User` non-compliance with robots.txt should be flagged as a known issue.

## 6. Core Web Vitals SEO Impact 2026

**Confidence: MEDIUM** (thresholds are well-documented; exact ranking weight is Google's black box)

### Current Thresholds (unchanged since 2024)

| Metric | Good | Needs Improvement | Poor | What It Measures |
|--------|------|--------------------|------|-----------------|
| **LCP** | < 2.5s | 2.5s - 4.0s | > 4.0s | Largest visible content element load time |
| **INP** | < 200ms | 200ms - 500ms | > 500ms | Input responsiveness (replaced FID March 2024) |
| **CLS** | < 0.1 | 0.1 - 0.25 | > 0.25 | Visual stability / layout shift |

Assessment criteria: 75th percentile of page visits must meet "Good" threshold.

### Ranking Impact (Honest Assessment)

- Core Web Vitals are a confirmed Google ranking signal (part of Page Experience update)
- Multiple sources estimate 10-15% of ranking signal weight
- Sites meeting all three thresholds see an estimated 8-15% visibility boost
- **54.2% of websites fail** to meet "good" on all three metrics -- so passing is a competitive advantage
- CWV is a **tiebreaker signal** -- content relevance and authority still dominate rankings
- Google has confirmed CWV will never outweigh content quality

### Skill Guidance Depth (Claude's Discretion)

Per CONTEXT.md, Core Web Vitals guidance depth is at Claude's discretion. Recommendation: include a concise section in the skill covering:

1. The three metrics and their thresholds (table above)
2. How they affect SEO (tiebreaker, not dominant signal)
3. Quick wins per framework (image optimization, font loading, layout stability)
4. Link to `performance-guardian` skill for deep optimization

This phase establishes the SEO hooks; Phase 18 wires deeper CWV patterns into the pipeline.

## 7. Sitemap Validation Requirements

**Confidence: HIGH** (verified via Google Search Console docs and multiple SEO sources)

### Google Search Console Validation Rules

| Rule | Detail | Severity |
|------|--------|----------|
| XML declaration | `<?xml version="1.0" encoding="UTF-8"?>` required | Error |
| Namespace | `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` required | Error |
| URL encoding | `&`, `'`, `"`, `<`, `>` must use entity escape codes | Error |
| Date format | W3C Datetime (`YYYY-MM-DD` or ISO 8601) | Error |
| Max 50,000 URLs | Per sitemap file | Error |
| Max 50MB | Uncompressed file size | Error |
| Non-canonical URLs | URLs in sitemap that differ from their canonical | **Error** (upgraded from Notice in Nov 2025) |
| Redirect URLs | URLs that return 301/302 instead of 200 | Warning |
| Blocked by robots.txt | URLs disallowed in robots.txt | Warning |
| Noindex pages | Pages with `noindex` directive | Conflict |
| Accessible | Must not require authentication | Error |

**Critical 2025 change:** "Non-canonical pages in XML sitemap" is now an **Error** in GSC, not a Notice. This means sloppy sitemaps with trailing slash mismatches or www/non-www inconsistencies actively hurt indexing.

### Sitemap Index Format

For sites with 50,000+ URLs:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap/0.xml</loc>
    <lastmod>2026-02-25T00:00:00.000Z</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap/1.xml</loc>
    <lastmod>2026-02-25T00:00:00.000Z</lastmod>
  </sitemap>
</sitemapindex>
```

Rules:
- Max 50,000 sitemaps per index file
- No nested sitemap indexes (index cannot reference another index)
- Each referenced sitemap must be accessible and valid

### Next.js 16 Sitemap Breaking Change

The `id` parameter in sitemap functions that use `generateSitemaps` is now a `Promise<string>`:

```tsx
// Next.js 16 -- id is Promise<string>
export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id
  const start = Number(id) * 50000
  // ...
}
```

**This is a breaking change from Next.js 15** where `id` was passed directly. The existing skill's sitemap pattern needs this update.

### Next.js Sitemap Features

- Image sitemaps: `images: ['https://example.com/image.jpg']` property
- Video sitemaps: `videos: [{ title, thumbnail_loc, description }]` property
- Localized sitemaps: `alternates: { languages: { es: '...', de: '...' } }` property
- Multiple sitemaps: Via `generateSitemaps()` or nesting `sitemap.ts` in route segments

### Astro Sitemap Features (@astrojs/sitemap v3.7.0)

- Auto-generates `sitemap-index.xml` + `sitemap-0.xml` at build time
- Default entry limit: 45,000 per file (auto-splits)
- i18n support with locale configuration
- `customSitemaps` (v3.7.0) for custom splitting logic
- `excludeNamespaces` for removing XML namespace bloat
- SSR caveat: requires `customPages` for dynamic routes

## 8. hreflang Implementation

**Confidence: HIGH** (verified via Next.js docs and community discussion)

### Core Rules

1. **Bidirectional** -- If page A declares B as alternate, B must declare A back
2. **Self-referencing** -- Each page should include itself in its hreflang set
3. **x-default required** -- Fallback for unmatched language/region
4. **Consistent placement** -- All alternates in `<head>`, or all in sitemap, not mixed

### Next.js 16 Pattern

**x-default IS supported** in the metadata API (confirmed via GitHub discussion #76729):

```tsx
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://example.com/about',
    languages: {
      'en-US': 'https://example.com/en/about',
      'de-DE': 'https://example.com/de/about',
      'x-default': 'https://example.com/about',
    },
  },
}
```

Output:
```html
<link rel="canonical" href="https://example.com/about" />
<link rel="alternate" hreflang="en-us" href="https://example.com/en/about" />
<link rel="alternate" hreflang="de-de" href="https://example.com/de/about" />
<link rel="alternate" hreflang="x-default" href="https://example.com/about" />
```

### Next.js Sitemap hreflang

```tsx
export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: 'https://example.com/about',
    alternates: {
      languages: {
        es: 'https://example.com/es/about',
        de: 'https://example.com/de/about',
      },
    },
  }]
}
```

### Astro Pattern

```astro
---
const locales = ['en', 'de', 'es'];
const currentPath = Astro.url.pathname.replace(/^\/(en|de|es)\//, '/');
---
{locales.map(locale => (
  <link
    rel="alternate"
    hreflang={locale}
    href={new URL(`/${locale}${currentPath}`, Astro.site).href}
  />
))}
<link rel="alternate" hreflang="x-default" href={new URL(currentPath, Astro.site).href} />
```

### @astrojs/sitemap i18n Config

```js
// astro.config.mjs
export default defineConfig({
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          de: 'de-DE',
          es: 'es-ES',
        },
      },
    }),
  ],
})
```

## 9. SPA SEO Limitations

**Confidence: HIGH** (well-documented, consistent across sources)

### What Search Engines See with Client-Side Rendering

| Aspect | What Happens | Impact |
|--------|-------------|--------|
| Initial HTML | Empty shell (`<div id="root"></div>`) | Crawlers that don't execute JS see nothing |
| Googlebot rendering | Uses Chromium, but two-phase process | Content may take minutes to days to index |
| Meta tags (React 19) | Hoisted to `<head>` but only after JS executes | Social crawlers (Facebook, Twitter) see empty `<head>` |
| Canonical URLs | Only exist after hydration | May not be seen by all crawlers |
| JSON-LD | Injected by JS | Same two-phase indexing delay |
| Dynamic routes | No static HTML per route | Google must render to discover pages |

### Two-Phase Indexing (Google)

1. **First wave:** Googlebot crawls raw HTML. Extracts links and basic metadata from static HTML.
2. **Second wave:** Google queues the page for JavaScript rendering. This can take **minutes to days** depending on crawl budget.

**Implication:** Critical metadata and content that exists only in JavaScript may not be indexed promptly.

### Honest Framework Capability Matrix

| SEO Feature | Next.js 16 (SSR/SSG) | Astro 5/6 (SSG/SSR) | React/Vite (SPA) |
|-------------|----------------------|---------------------|-------------------|
| Static HTML with content | Full | Full | No (empty shell) |
| Meta tags in initial HTML | Full (`generateMetadata`) | Full (`<head>`) | No (requires JS execution) |
| Social preview crawlers | Full (blocking for HTML bots) | Full | Broken (empty `<head>`) |
| Canonical URLs | Full (server-rendered) | Full (build-time) | JS-only (unreliable) |
| Sitemaps | `app/sitemap.ts` (native) | `@astrojs/sitemap` (native) | Manual build script |
| robots.txt | `app/robots.ts` (native) | Static file | Static file |
| JSON-LD in HTML | Server-rendered | Build-time | JS-only |
| hreflang | `metadata.alternates` | Manual `<link>` tags | JS-only |
| Dynamic OG images | `next/og` ImageResponse | Satori endpoint | Not feasible (no server) |
| Core Web Vitals (LCP) | Excellent (SSR streaming) | Excellent (zero JS default) | Poor (JS-dependent) |
| Googlebot indexing | Immediate | Immediate | Delayed (two-phase) |

### React/Vite SPA Mitigation Strategies

| Strategy | Helps With | Limitation |
|----------|-----------|------------|
| React 19 native `<title>`/`<meta>` | Runtime metadata after hydration | Social crawlers still see empty head |
| Pre-rendering (react-snap, vite-plugin-ssr) | Static HTML generation | Adds build complexity, may not cover dynamic routes |
| `@dr.pogodin/react-helmet` | Complex route-based metadata | Still JS-dependent for crawlers |
| `VITE_SITE_URL` env variable | Canonical URL base | Still injected by JS |

### Skill Guidance

The framework capability matrix should be in Layer 1 (Decision Guidance) so agents surface it immediately. The guidance should be:

> **If SEO is a primary project goal, use Next.js or Astro.** React/Vite SPAs can implement basic SEO patterns, but search engine visibility will always be limited by JavaScript rendering requirements. Social preview crawlers (Facebook, Twitter/X, LinkedIn) do not execute JavaScript and will see empty previews.

## 10. Framework Capability Matrix (Consolidated)

**Confidence: HIGH** (synthesized from all verified framework documentation)

This matrix should appear in the skill's Layer 1 as a decision tool:

| Capability | Next.js 16 | Astro 5/6 | React/Vite SPA | Tauri/Electron |
|-----------|-----------|-----------|---------------|----------------|
| **SEO Readiness** | Excellent | Excellent | Limited | N/A (not web) |
| Meta tag API | `generateMetadata` | `<head>` in layouts | React 19 native | N/A |
| Server-rendered HTML | Yes (SSR/SSG) | Yes (SSG/SSR) | No (CSR only) | N/A |
| Sitemap generation | `app/sitemap.ts` | `@astrojs/sitemap` | Build script | N/A |
| robots.txt | `app/robots.ts` | Static file | Static file | N/A |
| OG image generation | `next/og` | Satori endpoint | Not feasible | N/A |
| hreflang | `alternates.languages` | Manual/sitemap | Manual (JS-only) | N/A |
| Canonical URLs | `alternates.canonical` | `Astro.url.href` | Manual | N/A |
| JSON-LD delivery | Server-rendered | Build-time | JS-injected | N/A |
| Social preview | Works (blocks for bots) | Works (static HTML) | Broken | N/A |
| Third-party deps needed | None | `@astrojs/sitemap` only | `@dr.pogodin/react-helmet` (optional) | N/A |

## Standard Stack

**Phase 14 requires zero new library dependencies.** Everything is framework-native.

### Core (No Dependencies)

| Framework | API | Purpose |
|-----------|-----|---------|
| Next.js 16 | `metadata` / `generateMetadata` | All meta tags, OG, canonical, hreflang |
| Next.js 16 | `app/sitemap.ts` + `generateSitemaps` | XML sitemap generation |
| Next.js 16 | `app/robots.ts` | robots.txt generation |
| Astro 5/6 | `<head>` in layouts | All meta tags via props |
| Astro 5/6 | `Astro.url.href` / `Astro.site` | Canonical URL generation |
| React 19 | Native `<title>`, `<meta>`, `<link>` | Metadata hoisting (basic) |

### Supporting (Astro Only)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrojs/sitemap` | ^3.7.0 | Sitemap generation | All Astro projects |

### Explicitly NOT Recommended

| Package | Why Avoid | Use Instead |
|---------|-----------|-------------|
| `react-helmet-async` | Unmaintained, React 19 incompatible | React 19 native or `@dr.pogodin/react-helmet` |
| `react-helmet` | Unmaintained since 2020, thread-unsafe | React 19 native |
| `next-seo` | Legacy Pages Router package | Next.js metadata API |
| `next/head` | Pages Router only, silently fails in App Router | `metadata` export |
| `next-sitemap` | Last published 2+ years ago | Next.js `app/sitemap.ts` |

## Architecture Patterns

### Recommended Skill Structure

Per CONTEXT.md decisions (main + appendices, explain-then-recipe):

```
skills/seo-meta/
  SKILL.md              # Main skill -- 4-layer format, Core tier
  appendix-ai-bots.md   # Complete AI crawler taxonomy with per-bot rationale
  appendix-matrix.md    # Detailed framework capability matrix (optional -- may fit in SKILL.md Layer 1)
```

### Pattern: Per-Framework Recipe Sections

Each framework gets a self-contained section with:
1. Brief principle explanation (why this pattern)
2. Complete code pattern (copy-paste ready)
3. Constraint table values the pattern satisfies

### Pattern: Enforceable Constraint Table

```
| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| title length | 30 | 60 | chars | HARD |
| meta description | 70 | 160 | chars | HARD |
| og:image width | 1200 | - | px | HARD |
| og:image height | 630 | - | px | HARD |
| canonical URL | - | - | absolute URL | HARD |
| metadataBase | - | - | required in root layout | HARD |
| sitemap URLs | - | 50000 | per file | HARD |
| hreflang bidirectional | - | - | boolean | HARD |
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Meta tag management (Next.js) | Custom `<Head>` component | `generateMetadata` / `metadata` export | Framework handles merging, streaming, bot detection |
| Sitemap generation (Next.js) | Custom XML builder | `app/sitemap.ts` + `generateSitemaps` | Type-safe, auto-cached, handles splitting |
| Sitemap generation (Astro) | Manual XML file | `@astrojs/sitemap` | Auto-discovers pages, handles i18n, splits automatically |
| robots.txt (Next.js) | Static file | `app/robots.ts` | Type-safe, can be dynamic based on environment |
| Canonical URL resolution | String concatenation | `metadataBase` + relative paths | Framework normalizes slashes, handles composition |
| OG tag deduplication | Custom hook | Framework metadata merging (Next.js) or single `<SEOHead>` (Astro) | Avoid duplicate tags that confuse crawlers |

## Common Pitfalls

### Pitfall 1: `next/head` in App Router
**What goes wrong:** Using Pages Router `Head` component silently produces zero metadata.
**Why it happens:** Old tutorials and LLM training data.
**How to avoid:** Skill Layer 4 anti-pattern. Use `metadata`/`generateMetadata` only.
**Warning signs:** View source shows no `<title>` or `<meta>` tags.

### Pitfall 2: react-helmet-async in React 19
**What goes wrong:** Install fails with peer dependency errors. Using `--force` creates fragile dependency.
**Why it happens:** Package unmaintained since React 18.
**How to avoid:** Use React 19 native hoisting. For complex cases, use `@dr.pogodin/react-helmet`.
**Warning signs:** `npm install` warnings about peer dependencies.

### Pitfall 3: Non-canonical URLs in Sitemap
**What goes wrong:** Sitemap URLs differ from canonical (trailing slash, www, protocol).
**Why it happens:** Sitemap generated independently from canonical logic.
**How to avoid:** Single source of truth for URL format. Validate sitemap against canonicals.
**Warning signs:** GSC "Non-canonical pages in XML sitemap" **Error** (upgraded from Notice, Nov 2025).

### Pitfall 4: Blocking AI Search Bots with Training Bots
**What goes wrong:** Blanket "block all AI bots" hides site from ChatGPT search, Perplexity.
**Why it happens:** Copy-paste robots.txt without understanding search vs training distinction.
**How to avoid:** Separate rules for search bots (allow) and training bots (block).
**Warning signs:** Site invisible in AI-powered search results despite good Google rankings.

### Pitfall 5: Synchronous params in Next.js 16
**What goes wrong:** `generateMetadata({ params })` accessing `params.slug` directly throws error.
**Why it happens:** Next.js 16 removed synchronous fallback. Must `await params`.
**How to avoid:** Always use `const { slug } = await params` pattern.
**Warning signs:** Runtime error about params being a Promise object.

### Pitfall 6: Multiple `<title>` Tags in React 19 SPA
**What goes wrong:** Multiple components render `<title>`, all appear in `<head>`.
**Why it happens:** React 19 does not deduplicate `<title>` tags.
**How to avoid:** Single `<SEOMeta>` component per route that owns all metadata.
**Warning signs:** View source shows multiple `<title>` elements.

### Pitfall 7: Static `lastmod` Dates in Sitemap
**What goes wrong:** All entries use `new Date()` (build time), making everything "fresh."
**Why it happens:** Default pattern uses current timestamp.
**How to avoid:** Use actual content modification dates from CMS/git.
**Warning signs:** Google loses trust in `lastmod` signal.

### Pitfall 8: Broken hreflang (Missing Return Links)
**What goes wrong:** Page A declares Page B as alternate, but B doesn't declare A back.
**Why it happens:** New pages added without updating all existing alternate pages.
**How to avoid:** Generate hreflang from a single data source (all locales). Automate with `generateMetadata`.
**Warning signs:** GSC International Targeting report shows errors.

## Code Examples

### Next.js 16: Complete Page Metadata (verified from official docs)

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Example -- Build Amazing Products',
    template: '%s | Example',
  },
  description: 'The modern development platform for ambitious teams.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Example',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@example',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'google-verification-code',
    other: { 'msvalidate.01': 'bing-verification-code' },
  },
}
```

### Next.js 16: Dynamic generateMetadata (verified syntax)

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}
```

### Next.js 16: robots.ts with AI Bot Taxonomy (verified API)

```tsx
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
  return {
    rules: [
      // Standard crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      // AI Search Bots -- ALLOW for AI search visibility
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      // AI Training Bots -- BLOCK to protect content
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'Meta-ExternalAgent', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### Next.js 16: Sitemap with generateSitemaps (verified v16 async id)

```tsx
// app/product/sitemap.ts
import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  const totalProducts = await getProductCount()
  const sitemapCount = Math.ceil(totalProducts / 50000)
  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }))
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id  // Next.js 16: id is Promise<string>
  const start = Number(id) * 50000
  const products = await getProducts(start, 50000)

  return products.map((product) => ({
    url: `https://example.com/product/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    images: product.images.map(img => img.url),
  }))
}
```

### React 19: SEOMeta Wrapper (new pattern replacing react-helmet-async)

```tsx
// components/SEOMeta.tsx
interface SEOMetaProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
}

export function SEOMeta({
  title,
  description,
  image = '/og-image.png',
  url,
  type = 'website',
  publishedTime,
}: SEOMetaProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'https://example.com'
  const canonical = url ?? `${siteUrl}${window.location.pathname}`
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
    </>
  )
}
```

**Usage note:** Only render ONE `<SEOMeta>` per route to avoid duplicate tags.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next/head` (Pages Router) | `metadata` / `generateMetadata` (App Router) | Next.js 13.2 (2023) | Silently broken if old pattern used in App Router |
| `react-helmet-async` | React 19 native `<title>`/`<meta>`/`<link>` | React 19 (Dec 2024) | No more third-party dep for basic metadata |
| Synchronous `params` | `params: Promise<{...}>` + `await` | Next.js 15 (deprecated), Next.js 16 (enforced) | Breaking change -- old code throws errors |
| Synchronous `id` in `sitemap()` | `id: Promise<string>` + `await` | Next.js 16 | Breaking change for `generateSitemaps` users |
| `rel="prev"/"next"` for pagination | Self-referencing canonicals + standard `<a>` links | Google deprecated March 2019 | Remove rel=prev/next but no harm if present |
| Block all AI bots | Selective block (training) / allow (search) | 2024-2025 AI search explosion | Blanket blocks kill AI search visibility |
| GSC "non-canonical in sitemap" as Notice | Upgraded to Error | November 2025 | Sloppy sitemaps now actively hurt indexing |
| `metadata.viewport` / `themeColor` | `generateViewport` function | Next.js 14 (deprecated) | Move viewport config to separate export |

## Open Questions

1. **React 19 meta deduplication specifics:** The official docs confirm `<title>` is NOT deduplicated and `<link>` may persist after unmount, but the exact behavior of `<meta name="...">` deduplication across route changes is undocumented. Recommendation: the skill should advise a single `<SEOMeta>` wrapper per route as a safe pattern.

2. **Next.js sitemap index auto-generation:** The docs show `generateSitemaps()` creates individual sitemaps at `/product/sitemap/[id].xml`, but do not explicitly confirm whether Next.js auto-generates a `<sitemapindex>`. Based on the URL pattern and docs, each segment's `sitemap.ts` generates its own sitemap, and combining them into an index requires nesting `sitemap.ts` in different route segments or a manual route. The skill should document both approaches.

3. **Astro 6 status:** Astro 5 is current stable. Astro 6 is mentioned in the phase description but has not been released as of this research date. The skill should target Astro 5 patterns with a note that Astro 6 patterns will be similar (Astro's head management is HTML-native and unlikely to change fundamentally).

## Sources

### Primary (HIGH confidence)
- [Next.js 16.1.6 generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- Complete metadata API reference, fetched 2026-02-25
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) -- Breaking changes including async params, async sitemap id
- [Next.js sitemap.xml docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) -- Sitemap API, image/video/localized support
- [Next.js generateSitemaps docs](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) -- Multi-sitemap generation with async id
- [Next.js robots.txt docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) -- Robots API with multi-user-agent support
- [React <meta> docs](https://react.dev/reference/react-dom/components/meta) -- Native metadata hoisting behavior
- [React <title> docs](https://react.dev/reference/react-dom/components/title) -- Title hoisting, deduplication limitation
- [React <link> docs](https://react.dev/reference/react-dom/components/link) -- Link hoisting, stylesheet special behavior
- [GitHub Discussion #76729](https://github.com/vercel/next.js/discussions/76729) -- x-default hreflang confirmed supported

### Secondary (MEDIUM confidence)
- [Cloudflare AI Crawler Report](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/) -- AI bot landscape, market share data
- [Momentic Marketing AI Crawlers List](https://momenticmarketing.com/blog/ai-search-crawlers-bots) -- Comprehensive crawler user-agent strings
- [Google Core Web Vitals docs](https://developers.google.com/search/docs/appearance/core-web-vitals) -- CWV thresholds and SEO impact
- [Search Engine Land Pagination Guide](https://searchengineland.com/pagination-seo-what-you-need-to-know-453707) -- rel=prev/next deprecation confirmation
- [NitroPack CWV 2026](https://nitropack.io/blog/most-important-core-web-vitals-metrics/) -- CWV metrics and adoption rates
- [White Label Coders CWV 2026](https://whitelabelcoders.com/blog/how-important-are-core-web-vitals-for-seo-in-2026/) -- CWV ranking impact estimates

### Tertiary (LOW confidence)
- CWV exact ranking weight (10-15%) -- Estimated from multiple SEO sources, not confirmed by Google
- `Perplexity-User` robots.txt non-compliance -- Reported by multiple sources but behavior may change
- React 19 meta cleanup on unmount -- Docs say "may leave in DOM" but exact behavior is implementation-dependent

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All framework APIs verified via official documentation
- Architecture: HIGH -- Patterns confirmed via official docs, skill structure defined by CONTEXT.md
- Pitfalls: HIGH -- All major pitfalls verified via official docs or GSC documentation
- AI crawler taxonomy: MEDIUM-HIGH -- Major bots verified, but new bots appear regularly
- Core Web Vitals ranking weight: MEDIUM -- Thresholds are official, ranking weight is estimated
- React 19 edge cases: MEDIUM -- Basic behavior documented, route-change cleanup behavior undocumented

**Research date:** 2026-02-25
**Valid until:** 60 days for framework APIs (stable), 30 days for AI crawler list (fast-moving)
