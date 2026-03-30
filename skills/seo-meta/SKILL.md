---
name: "seo-meta"
description: "Core SEO patterns: meta tags, canonical URLs, sitemaps, robots.txt, hreflang, Open Graph, Twitter Cards, Core Web Vitals guidance -- framework-native for Next.js 16, Astro 5, and React 19."
tier: "core"
triggers: "SEO, metadata, sitemap, robots.txt, canonical, hreflang, Open Graph, Twitter Card, meta tags, Core Web Vitals, AI crawlers, framework capability, og:image, meta description, title tag, social preview"
version: "3.0.0"
---

## Layer 1: Decision Guidance

### When to Use

Every public-facing page needs SEO metadata. This skill provides framework-native patterns for the complete SEO foundation:

- **Meta tags** (title, description, OG, Twitter Card) -- Every public page, no exceptions
- **Canonical URLs** -- Every public page, dynamically generated from the route
- **Sitemaps** -- Every public site, generated at build or request time
- **robots.txt** -- Every public site, with AI crawler taxonomy
- **hreflang** -- Any site with multiple language versions
- **Core Web Vitals awareness** -- Every project (SEO tiebreaker signal)

### When NOT to Use

- **Private dashboards behind authentication** -- Minimal SEO needed; skip meta tags beyond a basic `<title>`
- **Tauri / Electron desktop apps** -- Not web-accessible; SEO is irrelevant
- **JSON-LD / structured data** -- Use the `structured-data` skill (Phase 15) for Article, FAQ, Product, BreadcrumbList, and other schema.org types. JSON-LD patterns are out of scope for this skill
- **IndexNow / llms.txt / AI search optimization** -- Use the `search-visibility` skill (Phase 16) for proactive indexing and AI search discoverability
- **Deep Core Web Vitals optimization** -- Use `performance-guardian` skill for LCP/INP/CLS optimization techniques; this skill covers only the SEO impact framing

### Framework Capability Matrix

Use this matrix to make framework decisions when SEO is a project requirement. The matrix covers every capability this skill teaches:

| Capability | Next.js 16 | Astro 5 | React/Vite SPA | Tauri/Electron |
|---|---|---|---|---|
| **SEO Readiness** | Excellent | Excellent | Limited | N/A (not web) |
| Meta tag API | `generateMetadata` / `metadata` export | `<head>` in layouts via props | React 19 native hoisting | N/A |
| Server-rendered HTML | Yes (SSR/SSG) | Yes (SSG/SSR) | No (CSR only -- empty shell) | N/A |
| Sitemap generation | `app/sitemap.ts` (native) | `@astrojs/sitemap` (official) | Manual build script | N/A |
| robots.txt | `app/robots.ts` (type-safe) | Static file in `public/` | Static file in `public/` | N/A |
| OG image generation | `next/og` ImageResponse | Satori endpoint | Not feasible (no server) | N/A |
| hreflang | `alternates.languages` | Manual `<link>` tags or sitemap | Manual (JS-only, unreliable) | N/A |
| Canonical URLs | `alternates.canonical` + `metadataBase` | `Astro.url.href` | Manual via env variable | N/A |
| JSON-LD delivery | Server-rendered in HTML | Build-time in HTML | JS-injected (delayed indexing) | N/A |
| Social preview (OG/Twitter) | Works (streaming blocks for bots) | Works (static HTML) | Broken (crawlers see empty head) | N/A |
| Third-party deps needed | None | `@astrojs/sitemap` only | None (React 19 native) | N/A |

**If SEO is a primary project goal, use Next.js or Astro.** React/Vite SPAs can implement basic SEO patterns, but search engine visibility will always be limited by JavaScript rendering requirements. Social preview crawlers (Facebook, Twitter/X, LinkedIn) do not execute JavaScript and will see empty previews.

### Decision Tree

Use these branching decisions to determine which patterns to apply:

1. **Framework selection for SEO priority**
   - SEO is critical (marketing site, blog, e-commerce) --> Next.js or Astro
   - SEO is secondary (internal tool, dashboard) --> Any framework; skip most of this skill
   - SEO is irrelevant (desktop app) --> Skip this skill entirely

2. **Static vs dynamic metadata**
   - Page content is known at build time (landing pages, about) --> Static `metadata` export (Next.js) or hardcoded props (Astro)
   - Page content comes from CMS/database (blog posts, products) --> `generateMetadata` async function (Next.js) or frontmatter/data-fetching props (Astro)
   - React/Vite SPA --> `<SEOMeta>` wrapper component with route-specific props

3. **Large site (50k+ URLs)**
   - Use sitemap index with `generateSitemaps` (Next.js) or `entryLimit` config (Astro)
   - Split by content type (products, blog, pages) for manageable files
   - Each sitemap file must contain at most 50,000 URLs

4. **Internationalized site**
   - Implement hreflang with bidirectional links and `x-default` fallback
   - Generate from a single locale data source to ensure consistency
   - Choose one placement: `<head>` tags or sitemap `<xhtml:link>` entries, not both

5. **AI search visibility**
   - Separate search bots (allow) from training bots (block) in robots.txt
   - See `appendix-ai-bots.md` for the complete taxonomy with per-bot rationale
   - Never blanket-block all AI bots -- this hides the site from ChatGPT search, Perplexity, and other AI answer engines

### Core Web Vitals and SEO

Core Web Vitals are a confirmed Google ranking signal. This section frames their SEO impact -- for deep optimization techniques, use the `performance-guardian` skill.

**The three metrics (must meet "Good" at 75th percentile of visits):**

| Metric | Good | Needs Improvement | Poor | Measures |
|---|---|---|---|---|
| **LCP** | < 2.5s | 2.5s -- 4.0s | > 4.0s | Largest visible content load time |
| **INP** | < 200ms | 200ms -- 500ms | > 500ms | Input responsiveness (replaced FID, March 2024) |
| **CLS** | < 0.1 | 0.1 -- 0.25 | > 0.25 | Visual stability / layout shift |

**Honest ranking impact:**
- CWV is a **tiebreaker signal**, estimated at ~10-15% of ranking weight
- Content quality, relevance, and authority still dominate rankings
- Google has confirmed CWV will never outweigh content quality
- However, **54.2% of websites fail** to meet "good" on all three metrics -- passing is a genuine competitive advantage

**Quick framework comparison:**

| Framework | LCP | INP | CLS | Why |
|---|---|---|---|---|
| Astro | Excellent | Excellent | Excellent | Zero JS by default, static HTML |
| Next.js | Excellent | Good | Good | SSR streaming, React hydration overhead |
| React/Vite SPA | Poor | Variable | Variable | JS-dependent LCP, content invisible until hydration |

For deep CWV optimization (image strategies, font loading, layout stability techniques), use the `performance-guardian` skill.

### Pipeline Connection

- **Referenced by:** `builder` (per-page metadata generation), `orchestrator` (site-wide SEO scaffold at Wave 0-1), `quality-reviewer` (constraint table validation)
- **Consumed at:** `/gen:execute` Wave 0 for root layout metadata and site-wide files (robots.txt, sitemap), Wave 2+ for per-page metadata via `generateMetadata` or equivalent
- **Input from:** `/gen:start-project` captures brand name, description, and target audience used in meta descriptions and OG defaults
- **Output to:** Quality reviewer validates constraint table values (title length, description length, OG image dimensions); `structured-data` skill (Phase 15) builds on the meta foundation with JSON-LD schemas

## Layer 2: Award-Winning Examples

### A. Meta Tag Patterns

Every public page needs a title, description, Open Graph tags, and Twitter Card tags. The title is the single most important on-page SEO element. Meta descriptions do not directly affect rankings but control the snippet shown in search results, directly impacting click-through rate.

#### Pattern: Next.js 16 -- Root Layout Metadata

The root layout sets site-wide defaults. `metadataBase` is **mandatory** -- it resolves all relative URLs in metadata (OG images, canonicals). The `title.template` pattern applies to all child pages automatically.

**Deprecated fields:** `viewport`, `themeColor`, and `colorScheme` have moved to `generateViewport`. Do not set them in the `metadata` export.

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  // MANDATORY: base URL for all relative metadata paths
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
  ),
  title: {
    default: 'Example -- Build Amazing Products',
    template: '%s | Example', // child pages: "About | Example"
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

#### Pattern: Next.js 16 -- Dynamic generateMetadata

For pages with CMS/database content. The `params` parameter is `Promise<{ slug: string }>` in Next.js 16 -- you **must** `await params`. Synchronous access throws a runtime error.

**Metadata merging:** Page metadata shallowly overrides layout metadata. Nested fields like `openGraph` are **replaced entirely**, not deep-merged. Use a shared metadata pattern to avoid losing inherited OG images:

```tsx
// app/shared-metadata.ts
export const sharedOGImage = { images: ['/og-image.png'] }
```

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { sharedOGImage } from '../../shared-metadata'

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
      ...sharedOGImage,  // inherit default images unless post has its own
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      ...(post.coverImage && {
        images: [{ url: post.coverImage, width: 1200, height: 630 }],
      }),
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}
```

#### Pattern: Astro 5 -- SEOHead Component

Astro has no built-in metadata merging -- the layout component IS the single source. Pages pass metadata as props to the layout. Use `Astro.url.href` for canonical URLs and `Astro.site` for absolute URL construction.

```astro
---
// src/components/SEOHead.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}

const {
  title,
  description,
  image = '/og-image.png',
  canonicalUrl,
  type = 'website',
  publishedTime,
} = Astro.props;
const canonical = canonicalUrl ?? Astro.url.href;
const imageUrl = new URL(image, Astro.site).href;
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />

<!-- Open Graph -->
<meta property="og:type" content={type} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={imageUrl} />
<meta property="og:url" content={canonical} />
<meta property="og:site_name" content="Example" />
{publishedTime && <meta property="article:published_time" content={publishedTime} />}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={imageUrl} />
```

Usage in a layout:

```astro
---
// src/layouts/BaseLayout.astro
import SEOHead from '../components/SEOHead.astro';
const { title, description } = Astro.props;
---
<html>
<head>
  <SEOHead title={title} description={description} />
</head>
<body><slot /></body>
</html>
```

#### Pattern: React 19 -- SEOMeta Wrapper

React 19 natively hoists `<title>`, `<meta>`, and `<link>` from anywhere in the component tree to `<head>`. This replaces `react-helmet-async` (which is unmaintained and incompatible with React 19).

**Critical limitations -- read before using:**
- `<title>` is NOT deduplicated: if multiple components render `<title>`, ALL appear in `<head>`. Only render ONE `<SEOMeta>` per route.
- `<meta>` is NOT deduplicated: multiple components rendering `name="description"` produce duplicates.
- Cleanup on unmount is NOT guaranteed: stale meta tags may persist across route changes.
- Title children must be a single string: use template literals (`{`Results page ${n}`}`), not JSX interpolation.
- **Social crawlers (Facebook, Twitter/X, LinkedIn) do not execute JavaScript.** They will see an empty `<head>` with no OG tags, no title, and no description. Social previews will be blank.

```tsx
// components/SEOMeta.tsx
// WARNING: Only render ONE instance per route to avoid duplicate tags.
// WARNING: Social preview crawlers cannot see these tags (they don't execute JS).

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
      {/* Title must be a single string -- use template literal, not JSX children */}
      <title>{`${title} | Example`}</title>
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

### B. Canonical URL Patterns

Canonical URLs tell search engines which version of a page is the "original." Getting canonicals wrong causes duplicate content issues, splits link equity, and -- as of November 2025 -- triggers errors in Google Search Console when sitemap URLs disagree with canonicals.

#### Canonical URL Rules

These are hard rules. The quality reviewer flags violations:

1. **Always dynamic from route** -- Generate from the current path, never hardcode
2. **Always absolute URLs** -- `https://example.com/about`, never `/about`
3. **Self-referencing** -- Each page's canonical points to itself (unless consolidating true duplicates)
4. **Trailing slash consistency** -- Pick one format, enforce everywhere (canonical, sitemap, internal links)
5. **Protocol consistency** -- Always HTTPS
6. **www consistency** -- Pick www or non-www, redirect the other with 301
7. **Canonical must match sitemap URL** -- Non-canonical URLs in sitemap is now an **Error** in GSC (upgraded from Notice, November 2025)

#### Pattern: Next.js 16 -- metadataBase + Relative Canonical

Set `metadataBase` once in the root layout. All canonical URLs in child pages are relative to it. This is the safest pattern because URL resolution is centralized.

```tsx
// app/layout.tsx -- set metadataBase once
export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
}

// app/about/page.tsx -- relative canonical
export const metadata: Metadata = {
  alternates: {
    canonical: '/about', // resolves to https://example.com/about
  },
}

// app/blog/[slug]/page.tsx -- dynamic canonical
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    alternates: {
      canonical: `/blog/${slug}`, // resolves against metadataBase
    },
  }
}
```

**Trailing slash note:** `metadataBase` normalizes trailing slashes. The canonical path itself controls the final URL format. Coordinate with `next.config.ts` `trailingSlash` setting.

#### Pattern: Astro -- Astro.url.href Canonical

`Astro.url.href` returns the full canonical URL for the current page. Set `trailingSlash` in `astro.config.mjs` to `'always'` or `'never'` -- never use `'ignore'` (default), as it allows both variants and creates duplicate content.

```astro
---
// In your SEOHead component or layout
const canonical = Astro.url.href;
---
<link rel="canonical" href={canonical} />
```

```js
// astro.config.mjs -- enforce trailing slash consistency
export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'never', // or 'always' -- pick one, never 'ignore'
})
```

#### Pagination Canonicals

Google deprecated `rel="prev"/"next"` in March 2019 and confirmed it had been ignoring the markup for years. Current guidance:

- Each paginated page gets a **self-referencing canonical** (page 2 points to page 2)
- Use standard `<a href>` links between paginated pages for crawl discovery
- Do NOT canonicalize all pages to page 1 (this hides page 2+ content from the index)
- Do NOT use `noindex` on paginated pages (prevents indexing entirely)

#### Cross-Domain Canonicals

For content syndication: the canonical on the syndicated copy points to the original domain. Both domains must be accessible to crawlers. This is the correct way to republish content without duplicate content penalties.

### C. Sitemap Patterns

Sitemaps tell search engines which pages exist, when they were last modified, and how important they are relative to each other. Every public site needs one. Google Search Console uses sitemaps as the primary mechanism for URL discovery and validation.

#### Pattern: Next.js 16 -- Basic Sitemap

The `app/sitemap.ts` convention generates `/sitemap.xml` automatically. Include both static pages and dynamically fetched content. Use real `lastModified` dates -- not `new Date()` at build time -- or Google loses trust in the signal.

```tsx
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date('2026-01-15'), priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date('2026-01-10'), priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.9 },
  ]

  // Dynamic pages from CMS
  const posts = await getAllPosts()
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    images: post.coverImage ? [post.coverImage] : [],
  }))

  return [...staticPages, ...blogPages]
}
```

#### Pattern: Next.js 16 -- Sitemap Index with generateSitemaps

For sites with 50,000+ URLs, split into multiple sitemaps. In Next.js 16, the `id` parameter in the sitemap function is `Promise<string>` -- you **must** `await` it. This is a breaking change from Next.js 15.

```tsx
// app/product/sitemap.ts
import type { MetadataRoute } from 'next'

// Step 1: Define how many sitemaps are needed
export async function generateSitemaps() {
  const totalProducts = await getProductCount()
  const sitemapCount = Math.ceil(totalProducts / 50000)
  return Array.from({ length: sitemapCount }, (_, i) => ({ id: String(i) }))
}

// Step 2: Generate each sitemap -- id is Promise<string> in Next.js 16
export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id  // MUST await -- id is a Promise in Next.js 16
  const start = Number(id) * 50000
  const products = await getProducts(start, 50000)

  return products.map((product) => ({
    url: `https://example.com/product/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    images: product.images.map((img) => img.url),
  }))
}
```

This generates URLs like `/product/sitemap/0.xml`, `/product/sitemap/1.xml`, etc. Each contains at most 50,000 entries.

#### Pattern: Astro -- @astrojs/sitemap

Astro auto-discovers static pages at build time and generates `sitemap-index.xml` plus `sitemap-0.xml` files. For SSR dynamic routes, you must provide URLs manually via `customPages`.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    sitemap({
      // Exclude private routes
      filter: (page) =>
        !page.includes('/admin/') &&
        !page.includes('/api/'),
      // Required for SSR dynamic routes (not auto-discovered)
      customPages: [
        'https://example.com/blog/post-1',
        'https://example.com/blog/post-2',
      ],
      // Auto-splits at this limit (max 50,000 per spec)
      entryLimit: 45000,
    }),
  ],
})
```

#### Sitemap Validation Checklist

Quick reference for Google Search Console compliance. Non-canonical URLs in sitemap is now an **Error** (upgraded from Notice, November 2025):

| Rule | Detail | Severity |
|---|---|---|
| XML declaration | `<?xml version="1.0" encoding="UTF-8"?>` required | Error |
| Namespace | `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` required | Error |
| URL encoding | `&`, `'`, `"`, `<`, `>` must use entity escape codes | Error |
| Date format | W3C Datetime (`YYYY-MM-DD` or full ISO 8601) | Error |
| Max 50,000 URLs | Per sitemap file | Error |
| Max 50MB | Uncompressed file size | Error |
| Non-canonical URLs | Sitemap URL differs from page canonical | **Error** |
| Redirect URLs | Returns 301/302 instead of 200 | Warning |
| Blocked by robots.txt | URL disallowed in robots.txt | Warning |
| Noindex pages | Pages with `noindex` directive in sitemap | Conflict |

### D. robots.txt Patterns

robots.txt controls which crawlers can access which parts of the site. The critical 2025-2026 development is the AI crawler explosion -- blanket-blocking all AI bots hides your site from AI-powered search engines (ChatGPT search, Perplexity, Bing Copilot). The correct approach separates search bots (allow for visibility) from training bots (block to protect content).

#### Pattern: Next.js 16 -- robots.ts with AI Bot Taxonomy

Type-safe `app/robots.ts` with three rule categories: standard crawlers, AI search bots (allow), and AI training bots (block). Reference `appendix-ai-bots.md` for the complete taxonomy with per-bot rationale.

```tsx
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

  return {
    rules: [
      // Standard crawlers -- allow with exclusions
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      // AI Search Bots -- ALLOW for visibility in AI search results
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'DuckAssistBot', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      // AI Training Bots -- BLOCK to protect content from model training
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'Meta-ExternalAgent', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'cohere-ai', disallow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

#### Pattern: Astro -- Static robots.txt

Astro uses a static file. Place in `public/robots.txt` -- it is served as-is at the site root.

```
# public/robots.txt

# Standard crawlers -- ALLOW
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# AI Search Bots -- ALLOW for AI search visibility
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

# AI Training Bots -- BLOCK to protect content
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
Sitemap: https://example.com/sitemap-index.xml
```

#### Pattern: React/Vite -- Static robots.txt

Same static file approach as Astro. Place in `public/robots.txt`. Note: robots.txt works correctly for all crawlers regardless of SPA architecture -- it controls access, not rendering. The SPA limitation is that the pages robots.txt allows may still have JavaScript rendering dependencies.

Use the same template as the Astro pattern above.

### E. hreflang Patterns

hreflang tells search engines which language/region variant of a page to show to users. Getting it wrong causes the wrong language version to appear in search results, or duplicate content penalties across language variants.

**Core rules:**
1. **Bidirectional** -- If page A declares B as alternate, B must declare A back
2. **Self-referencing** -- Each page includes itself in the hreflang set
3. **x-default required** -- Fallback for users whose language/region does not match any variant
4. **Consistent placement** -- All alternates in `<head>` tags, or all in sitemap, not mixed

#### Pattern: Next.js 16 -- hreflang via metadata.alternates

The `alternates.languages` field supports `x-default` (confirmed via GitHub discussion #76729). Use this in `generateMetadata` for dynamic routes.

```tsx
// app/about/page.tsx (static)
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/about',
    languages: {
      'en-US': '/en/about',
      'de-DE': '/de/about',
      'es-ES': '/es/about',
      'x-default': '/about',
    },
  },
}
```

Output:
```html
<link rel="canonical" href="https://example.com/about" />
<link rel="alternate" hreflang="en-us" href="https://example.com/en/about" />
<link rel="alternate" hreflang="de-de" href="https://example.com/de/about" />
<link rel="alternate" hreflang="es-es" href="https://example.com/es/about" />
<link rel="alternate" hreflang="x-default" href="https://example.com/about" />
```

For dynamic routes, generate inside `generateMetadata`:

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    alternates: {
      canonical: `/blog/${slug}`,
      languages: {
        'en-US': `/en/blog/${slug}`,
        'de-DE': `/de/blog/${slug}`,
        'x-default': `/blog/${slug}`,
      },
    },
  }
}
```

#### Pattern: Next.js 16 -- hreflang in Sitemap

For large sites, hreflang in the sitemap is more maintainable than `<head>` tags. The `alternates.languages` field on sitemap entries produces `<xhtml:link>` elements in the XML.

```tsx
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com/about',
      lastModified: new Date('2026-01-15'),
      alternates: {
        languages: {
          en: 'https://example.com/en/about',
          de: 'https://example.com/de/about',
          es: 'https://example.com/es/about',
        },
      },
    },
  ]
}
```

#### Pattern: Astro -- hreflang in Head

Generate `<link rel="alternate">` tags from a locale list. Include `x-default` pointing to the default language version.

```astro
---
// src/components/HreflangTags.astro
interface Props {
  locales: string[];
  defaultLocale: string;
}

const { locales, defaultLocale } = Astro.props;
const currentPath = Astro.url.pathname.replace(
  new RegExp(`^/(${locales.join('|')})/`),
  '/'
);
---

{locales.map((locale) => (
  <link
    rel="alternate"
    hreflang={locale}
    href={new URL(`/${locale}${currentPath}`, Astro.site).href}
  />
))}
<link
  rel="alternate"
  hreflang="x-default"
  href={new URL(`/${defaultLocale}${currentPath}`, Astro.site).href}
/>
```

#### Pattern: Astro -- @astrojs/sitemap i18n Config

The sitemap integration generates hreflang entries in the sitemap XML automatically when i18n is configured.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://example.com',
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

### F. Reference Sites

- **Vercel** (vercel.com) -- Dynamic OG images via `next/og`, comprehensive metadata with title templates, clean sitemap generation, excellent social preview implementation
- **Stripe** (stripe.com) -- Best-in-class meta tag implementation: precise title/description lengths, complete OG/Twitter Card coverage, clean canonical structure across hundreds of pages
- **Next.js Docs** (nextjs.org/docs) -- Reference implementation of the metadata API with proper hreflang for i18n, canonical URLs, and sitemap generation using `generateSitemaps`
- **Linear** (linear.app) -- Clean meta tags with dynamic OG image generation, consistent canonical structure, minimal and precise meta descriptions
- **Astro Docs** (docs.astro.build) -- Reference Astro SEO implementation: `SEOHead` component pattern, `@astrojs/sitemap` integration, clean hreflang for multi-language docs

<!-- END LAYER 2 -->

## Layer 3: Integration Context

### DNA Connection

SEO metadata draws from the project's Design DNA in specific, measurable ways. The quality reviewer validates these connections.

| DNA Token | SEO Usage |
|---|---|
| Brand name | `og:site_name` value, title template suffix (`%s | Brand`), `publisher.name` in JSON-LD (when `structured-data` skill adds Article schema) |
| Brand description | Default `meta description` fallback when no page-specific description exists, `og:description` fallback for pages without custom copy |
| `bg-primary` color | OG image brand accent color -- used as background or accent bar in dynamic OG image generation (Phase 18 scope) |
| `--font-display` | OG image headline font -- rendered via Satori/`next/og` for visual consistency between site and social previews (Phase 18 scope) |
| `signature-element` | OG image brand motif -- the project's signature visual element embedded in OG image templates for brand recognition (Phase 18 scope) |
| Domain / site URL | `metadataBase` value (Next.js), `site` config (Astro), canonical URL base, sitemap URL prefix |

**Phase 18 note:** The `bg-primary`, `--font-display`, and `signature-element` connections become active when dynamic OG image generation is implemented. This skill defines the metadata hooks; Phase 18 wires the visual rendering pipeline.

### Archetype Variants

SEO metadata is functionally identical across all 19 archetypes -- search engines parse structure, not style. The HTML output (`<title>`, `<meta>`, `<link>`) does not change between Brutalist and Luxury.

However, **meta description tone** should match the project's archetype voice. The meta description is the snippet shown in search results, and its tone affects click-through rate. Write descriptions that feel consistent with the site's personality:

| Archetype | Meta Description Tone | Example Snippet |
|---|---|---|
| Neo-Corporate | Professional, benefit-focused, clear value proposition | "Streamline your workflow with enterprise-grade tools built for modern teams." |
| Brutalist | Direct, minimal, no marketing fluff | "Design tools. No bloat." |
| Luxury / Fashion | Refined, aspirational, sensory language | "Discover meticulously crafted pieces for the discerning eye." |
| Playful / Startup | Energetic, conversational, action-oriented | "Build something awesome today -- your next big idea starts here." |
| Japanese Minimal | Clean, precise, understated | "Thoughtfully designed instruments for focused work." |
| Data-Dense / AI-Native | Technical, authoritative, specific | "Real-time analytics across 40M+ data points with sub-200ms query response." |
| Editorial | Story-driven, evocative, editorial voice | "Long-form stories that explore the ideas shaping our world." |
| Warm Artisan | Personal, handcrafted feel, human warmth | "Small-batch ceramics made with care in our Portland studio." |

**OG image styling** should also match the archetype (background color, typography, layout density), but this is Phase 18 scope -- dynamic OG image generation.

### Pipeline Stage

- **Input from:** `/gen:start-project` (brand name, brand description, domain, target audience), Design DNA (colors, fonts, signature element), page content (titles, excerpts, featured images from CMS or markdown frontmatter)
- **Output to:** HTML `<head>` tags (title, meta, link, og, twitter), `sitemap.xml` (or `sitemap-index.xml`), `robots.txt`, `<link rel="alternate">` hreflang tags
- **Pipeline position:**
  - **Wave 0** -- Root layout metadata defaults (`metadataBase`, `title.template`, default OG image, robots config), `robots.ts` / `robots.txt`, `sitemap.ts` scaffold
  - **Wave 1** -- Shared UI components that consume metadata (nav with `<title>` awareness, footer with sitemap link)
  - **Wave 2+** -- Per-page metadata via `generateMetadata` (Next.js) or layout props (Astro) for each section

### Related Skills

| Skill | Relationship | Boundary |
|---|---|---|
| `structured-data` (Phase 15) | JSON-LD schemas (Article, FAQ, Product, BreadcrumbList) build on the meta foundation | This skill handles `<meta>` and `<link>` tags; `structured-data` handles `<script type="application/ld+json">` |
| `search-visibility` (Phase 16) | IndexNow submission, `llms.txt`, Google Search Console workflows | This skill handles discoverability fundamentals (sitemaps, robots.txt); `search-visibility` handles proactive indexing and AI search optimization |
| `performance-guardian` | Deep Core Web Vitals optimization (LCP strategies, INP reduction, CLS prevention) | This skill covers CWV SEO impact framing; `performance-guardian` covers implementation techniques |
| `blog-patterns` | Article page metadata templates, RSS feed `<link>` tag | This skill provides the `generateMetadata` pattern; `blog-patterns` defines blog-specific content structures |
| `ecommerce-ui` | Product page metadata (price, availability, reviews in meta) | This skill provides base metadata patterns; `ecommerce-ui` adds commerce-specific structured data |
| `i18n-rtl` | hreflang alternate links, locale routing, `lang` attribute | This skill covers the `<link rel="alternate" hreflang>` output; `i18n-rtl` covers locale detection, routing, and RTL layout |
| `multi-page-architecture` | Per-page metadata templates, shared layout metadata inheritance | This skill defines the metadata API; `multi-page-architecture` defines page organization and routing |
| `og-images` (Phase 18) | DNA-integrated Open Graph image generation for social previews | This skill defines OG meta tags (`og:image`, `twitter:image`); `og-images` generates the actual image files from Design DNA tokens |
| `accessibility` | Both contribute to page quality; a11y and SEO share semantic HTML concerns | Complementary -- neither depends on the other, but both improve page quality signals |

## Layer 4: Anti-Patterns

Common SEO metadata mistakes that cause real damage. Each anti-pattern describes what goes wrong and how to fix it.

### Anti-Pattern: Legacy Head Component in App Router

**What goes wrong:** Using `import Head from 'next/head'` in a Next.js App Router project. The Pages Router `Head` component is silently ignored in App Router -- it produces zero metadata output. No error, no warning. View source shows an empty `<head>` with no title or meta tags. The site appears to work in the browser (client-side navigation sets document.title via JavaScript), but search engine crawlers see nothing.

**Instead:** Use the `metadata` export for static metadata or `generateMetadata` for dynamic metadata. These are the only metadata APIs that work in App Router. If migrating from Pages Router, search the codebase for `import.*from 'next/head'` and replace every instance.

### Anti-Pattern: Hardcoded Canonical URLs

**What goes wrong:** Writing canonical URLs as literal strings (`<link rel="canonical" href="https://example.com/about" />`). When routes change, the canonical becomes stale and points to a non-existent page. This splits link equity and creates duplicate content signals. Worse, the sitemap (which is dynamically generated) produces different URLs than the hardcoded canonicals, triggering a Google Search Console Error (upgraded from Notice, November 2025).

**Instead:** Generate canonicals dynamically from the current route. In Next.js, use `metadataBase` + relative path (`alternates: { canonical: '/about' }`). In Astro, use `Astro.url.href`. In React/Vite, construct from the site URL environment variable and `window.location.pathname`. The canonical and sitemap should share the same URL construction logic.

### Anti-Pattern: Synchronous Params in Next.js 16

**What goes wrong:** Accessing `params.slug` directly in `generateMetadata` without `await`. Next.js 16 removed the synchronous fallback that existed in Next.js 15 -- `params` is now strictly `Promise<{ slug: string }>`. Synchronous access throws a runtime error that breaks the entire page, not just the metadata.

**Instead:** Always destructure with await: `const { slug } = await params`. This applies to `generateMetadata`, `generateStaticParams`, page components, and layout components. The same applies to `searchParams`. Run `npx next typegen` to get auto-generated type helpers that enforce this pattern.

### Anti-Pattern: Missing og:image

**What goes wrong:** Pages without an `og:image` share on social media with a blank or generic preview. Social platforms (LinkedIn, Twitter/X, Facebook, Slack) show a small text-only card instead of a large visual card. Click-through rates from social shares drop significantly -- the large image card format gets substantially more engagement than text-only cards.

**Instead:** Every page type must have a default 1200x630 OG image. Set it in the root layout metadata (Next.js) or base layout component (Astro) so it inherits to all pages. For content pages (blog posts, products), override with a content-specific image. Always include `width: 1200` and `height: 630` attributes -- social platforms use these to determine card format before fetching the image.

### Anti-Pattern: Blanket AI Bot Blocking

**What goes wrong:** Copying a "block all AI bots" robots.txt snippet hides the site from AI-powered search results (ChatGPT search, Perplexity, DuckAssist, Bing Copilot). The site may rank well in traditional Google search but be invisible in the growing AI search channel. As of 2025-2026, AI-powered search is a significant and increasing traffic source.

**Instead:** Separate search bots (allow for visibility) from training bots (block to protect content). Search bots like `OAI-SearchBot`, `ChatGPT-User`, and `PerplexityBot` surface your content in AI search results. Training bots like `GPTBot`, `ClaudeBot`, and `CCBot` use your content for model training. Block training bots by default; allow search bots. See `appendix-ai-bots.md` for the complete taxonomy with per-bot rationale.

### Anti-Pattern: Non-Canonical URLs in Sitemap

**What goes wrong:** Sitemap URLs differ from canonical URLs due to trailing slash mismatch (`/about` vs `/about/`), www inconsistency (`www.example.com` vs `example.com`), or protocol difference (`http` vs `https`). Google Search Console upgraded this from a Notice to an **Error** in November 2025. Non-canonical URLs in sitemaps now actively hurt indexing -- Google may deprioritize the entire sitemap.

**Instead:** Use a single source of truth for URL format. In Next.js, `metadataBase` controls the base URL for both canonicals and sitemaps. In Astro, the `site` config in `astro.config.mjs` combined with the `trailingSlash` setting controls all URL generation. Validate by comparing sitemap output against canonical tags: every URL in the sitemap must exactly match the canonical URL of that page.

### Anti-Pattern: Multiple Title Tags in React 19

**What goes wrong:** Multiple components in the React tree render `<title>` tags, and React 19 hoists ALL of them to `<head>`. Unlike `react-helmet-async` which deduplicates by tag type, React 19 native hoisting does not deduplicate. The browser sees multiple `<title>` elements and behavior is undefined -- it may show the first, the last, or concatenate them. Search engines may index any of the duplicates.

**Instead:** Designate a single `<SEOMeta>` component per route that owns all metadata. Only that component renders `<title>`, `<meta>`, and `<link>` tags. Other components in the tree must not render metadata elements. For route changes in SPAs, ensure the previous route's `<SEOMeta>` unmounts before the new one mounts (React 19 does not guarantee cleanup of hoisted elements on unmount).

### Anti-Pattern: Static lastmod in Sitemap

**What goes wrong:** All sitemap entries use `new Date()` at build time, making every page appear "just updated." Google quickly learns that the `lastmod` signal is unreliable for this site and stops trusting it. The `lastmod` field is supposed to help Google prioritize re-crawling pages that have genuinely changed -- fake dates waste crawl budget and reduce re-crawl priority for pages that actually changed.

**Instead:** Use actual content modification dates. For CMS-backed pages, use the `updatedAt` timestamp from the content record. For static pages, use a manually maintained date that reflects real content changes. For git-tracked content, extract the last commit date for each file. If you cannot provide accurate `lastmod` dates, omit the field entirely -- an absent `lastmod` is better than a misleading one.

## Machine-Readable Constraints

These SEO parameters are enforced by the quality reviewer during `/gen:iterate` and verification passes. Agents extract values from this table for automated checking.

| Parameter | Min | Max | Unit | Enforcement |
|---|---|---|---|---|
| title length | 30 | 60 | chars | HARD -- reject if outside range |
| meta description length | 70 | 160 | chars | HARD -- reject if outside range |
| og:image width | 1200 | 1200 | px | HARD -- must be exactly 1200px |
| og:image height | 630 | 630 | px | HARD -- must be exactly 630px |
| og:image alt text | 1 | - | present | HARD -- must have alt text |
| canonical URL format | - | - | absolute URL (https://) | HARD -- reject relative URLs |
| metadataBase | - | - | required in root layout | HARD -- reject if missing (Next.js) |
| sitemap URLs per file | - | 50000 | entries | HARD -- split if exceeded |
| sitemap URL = canonical | - | - | boolean match | HARD -- must match exactly |
| hreflang bidirectional | - | - | all alternates reciprocal | HARD -- reject one-way links |
| hreflang x-default | - | - | required if hreflang present | HARD -- reject if missing |
| title uniqueness per page | - | - | no duplicate titles across pages | SOFT -- warn if duplicates detected |
| robots.txt sitemap reference | - | - | Sitemap: directive present | HARD -- reject if missing |
