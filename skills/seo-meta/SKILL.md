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

- **Referenced by:** `section-builder` (per-page metadata generation), `build-orchestrator` (site-wide SEO scaffold at Wave 0-1), `quality-reviewer` (constraint table validation)
- **Consumed at:** `/modulo:execute` Wave 0 for root layout metadata and site-wide files (robots.txt, sitemap), Wave 2+ for per-page metadata via `generateMetadata` or equivalent
- **Input from:** `/modulo:start-project` captures brand name, description, and target audience used in meta descriptions and OG defaults
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

<!-- END LAYER 2 -- Plan 02 will append Layer 3 (Integration Context) and Layer 4 (Anti-Patterns) below this line -->
