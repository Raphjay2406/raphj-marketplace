# Technology Stack: SEO/GEO, Sitemaps, IndexNow, and External API Integration

**Project:** Genorah 2.0 v1.5 Milestone -- SEO/GEO Capabilities
**Researched:** 2026-02-25
**Research Mode:** Ecosystem (Stack dimension)
**Overall Confidence:** HIGH (cross-referenced WebSearch findings with official documentation URLs, npm registry data, and existing skill analysis)

---

## Executive Summary

This document maps the complete technology stack for adding SEO, GEO (Generative Engine Optimization), XML sitemap generation, IndexNow integration, AI crawler management, and external API patterns to Genorah 2.0. The existing `seo-meta` skill has solid foundations (Next.js `generateMetadata`, Astro head components, JSON-LD patterns) but needs significant expansion for 2026 realities: AI search engines now drive 50%+ of information-seeking behavior, the IndexNow protocol is production-ready for Bing/Yandex, and structured data has become critical for both traditional and AI search visibility.

**Key insight:** The SEO/GEO stack for Genorah is almost entirely framework-native or zero-dependency. Unlike the animation stack (GSAP, Motion, Lenis), SEO/GEO relies on built-in framework APIs, hand-crafted JSON-LD, and simple HTTP calls. The skill's value is in teaching correct patterns and avoiding pitfalls, not in library selection.

**Three strategic pillars for v1.5:**

1. **Framework-native SEO** -- Next.js `metadata` API + Astro `<head>` management + React 19 native metadata hoisting. No third-party SEO libraries needed for core meta/OG/canonical.
2. **Structured data for dual visibility** -- JSON-LD schemas (typed via `schema-dts`) that serve both Google rich results AND AI engine citation. FAQ, HowTo, Article, Organization schemas are the highest-impact for GEO.
3. **Proactive indexing** -- IndexNow API integration (zero-dependency HTTP POST), XML sitemaps via framework-native generators, and `llms.txt` + AI-crawler-aware `robots.txt` for AI search discoverability.

---

## 1. SEO Meta Tags & Open Graph

### Next.js: Built-in Metadata API (PRIMARY -- no library needed)

| Property | Value |
|----------|-------|
| **API** | `metadata` export (static) / `generateMetadata` function (dynamic) |
| **Available since** | Next.js 13.2 (App Router) |
| **Current target** | Next.js 16 |
| **Confidence** | HIGH (official Next.js docs verified via WebSearch) |

**Why this is the right choice:**

Next.js's built-in Metadata API is the definitive approach for App Router projects. It handles:
- Static and dynamic metadata with type safety (`Metadata` type from `next`)
- `metadataBase` for automatic URL resolution
- `title.template` for consistent page titles (`"%s | Brand"`)
- `openGraph` with full OG protocol support (type, locale, images with dimensions)
- `twitter` card configuration
- `robots` with per-bot directives (googleBot, etc.)
- `alternates.canonical` and `alternates.languages` for hreflang
- `verification` for Google Search Console and Bing Webmaster Tools

**What NOT to use:**

| Package | Why Avoid |
|---------|-----------|
| `next-seo` | Legacy Pages Router era package. App Router has everything built in. Adds unnecessary dependency. |
| `next/head` | Pages Router only. Does NOT work in App Router. Silently fails -- metadata is missing with no error. |

**Recommendation:** Use Next.js built-in metadata exclusively. The existing `seo-meta` skill already teaches this correctly. Expand with GEO-specific patterns.

### Astro: Native `<head>` Management (PRIMARY -- no library needed)

| Property | Value |
|----------|-------|
| **API** | Astro component props in layout `<head>` |
| **Ecosystem packages** | `astro-seo` (v1.1.0), `astro-seo-meta` (v5.2.0) -- optional convenience |
| **Confidence** | HIGH (official Astro docs verified via WebSearch) |

**Why no library is needed:**

Astro generates static HTML. You control `<head>` directly in layout components. A simple `<SEOHead>` component (as already in the existing skill) handles everything:
- `<title>`, `<meta name="description">`, `<link rel="canonical">`
- Open Graph meta tags via `<meta property="og:*">`
- Twitter card meta tags
- `Astro.url.href` for automatic canonical URL generation
- `Astro.site` for absolute URL construction

**Optional convenience packages:**

| Package | Version | Use Case | Recommendation |
|---------|---------|----------|----------------|
| `astro-seo` | 1.1.0 | Component wrapper for common meta tags | OPTIONAL -- reduces boilerplate but adds dependency. Raw `<meta>` tags are clearer for a teaching skill. |
| `astro-seo-meta` | 5.2.0 | Similar convenience wrapper | OPTIONAL -- same tradeoff. |

**Recommendation:** Teach raw Astro `<head>` patterns in the skill (no dependencies). Mention `astro-seo` as an optional convenience for builders who prefer it. The skill should demonstrate the mechanics, not hide them behind a wrapper.

### React/Vite: React 19 Native Metadata + Fallback

| Property | Value |
|----------|-------|
| **React 19 native** | `<title>`, `<meta>`, `<link>` tags auto-hoisted to `<head>` |
| **Fallback** | `@dr.pogodin/react-helmet` (maintained fork of react-helmet-async) |
| **Confidence** | HIGH for React 19 native (official React docs); MEDIUM for fallback library |

**React 19 changed everything for SPA metadata:**

React 19 introduces native metadata hoisting. When you render `<title>`, `<meta>`, or `<link>` anywhere in your component tree, React automatically hoists them to `<head>`. This works with:
- Client-side rendering (CSR)
- Streaming SSR
- Server Components

**What this means for Genorah:**

For React/Vite (SPA) projects targeting React 19, `react-helmet-async` is no longer necessary for basic metadata. Use React's native `<title>` and `<meta>` components directly.

**Fallback for complex cases:**

| Package | Version | Status | Use When |
|---------|---------|--------|----------|
| `@dr.pogodin/react-helmet` | Latest | Actively maintained fork | Route-based metadata overrides, SSR deduplication, complex meta management |
| `react-helmet-async` | 2.0.5 | Unmaintained, React 19 peer dep issues | DO NOT USE -- install fails with --force needed |
| `react-helmet` | 6.1.0 | Unmaintained since 2020 | DO NOT USE -- thread-unsafe, React 19 incompatible |

**Recommendation:** Teach React 19 native metadata as primary. Mention `@dr.pogodin/react-helmet` as fallback for complex routing. The existing skill's `react-helmet-async` reference needs updating.

---

## 2. Structured Data (JSON-LD / Schema.org)

### schema-dts: TypeScript Types for Schema.org

| Property | Value |
|----------|-------|
| **Package** | `schema-dts` |
| **Version** | 1.1.5 |
| **Maintainer** | Google (not officially supported product) |
| **Confidence** | HIGH (npm verified, Google GitHub repo confirmed) |

**Why use `schema-dts`:**

- Provides TypeScript types for ALL Schema.org vocabulary
- Zero runtime cost -- types only, stripped at compilation
- `WithContext<T>` utility type for JSON-LD `@context` wrapping
- Catches schema errors at compile time (wrong property names, invalid values)
- Works with the `JsonLd` component pattern already in the existing skill

**Installation:**
```
npm install -D schema-dts
```

**Usage pattern:**
```tsx
import type { WithContext, Article, FAQPage } from "schema-dts";

const articleSchema: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  // ... TypeScript enforces valid properties
};
```

**What NOT to use:**

| Package | Why Avoid |
|---------|-----------|
| `next-seo` JSON-LD | Opinionated wrapper that hides schema structure. Skill should teach raw JSON-LD. |
| `react-schemaorg` | Thin wrapper around `schema-dts`. Adds dependency for minimal value. Use `schema-dts` types directly. |
| Microdata format | Google recommends JSON-LD. Microdata is harder to maintain and test. |
| RDFa format | Same -- JSON-LD is the recommended format. |

**Recommendation:** Use `schema-dts` for type safety. Teach raw `<script type="application/ld+json">` injection. The `JsonLd` component in the existing skill is correct -- add typing with `schema-dts`.

### Priority Schema Types for SEO + GEO

Based on research into what drives both Google rich results AND AI engine citations:

| Schema Type | SEO Impact | GEO Impact | Priority |
|-------------|-----------|-----------|----------|
| `Article` | Rich results, authorship | HIGH -- AI engines cite article metadata | CRITICAL |
| `FAQPage` | FAQ rich results | CRITICAL -- 3.2x more likely to appear in AI Overviews | CRITICAL |
| `Organization` | Knowledge panel | HIGH -- brand entity recognition by AI | CRITICAL |
| `BreadcrumbList` | Breadcrumb rich results | MEDIUM -- navigation context for AI | HIGH |
| `HowTo` | Step rich results | HIGH -- AI engines extract step-by-step | HIGH |
| `Product` | Product rich results | MEDIUM -- pricing/availability in AI answers | HIGH |
| `WebSite` | Sitelinks search box | MEDIUM -- site identity for AI | MEDIUM |
| `LocalBusiness` | Local pack | HIGH -- local AI queries | MEDIUM (niche) |
| `Event` | Event rich results | LOW | LOW |
| `VideoObject` | Video rich results | MEDIUM -- AI references video content | LOW |

**GEO-specific insight:** FAQ schema has emerged as the single highest-impact structured data type for AI search visibility. Pages with FAQ schema are 3.2x more likely to appear in Google AI Overviews. This should be a primary teaching focus in the updated skill.

---

## 3. XML Sitemap Generation

### Next.js: Built-in `sitemap.ts` (PRIMARY)

| Property | Value |
|----------|-------|
| **API** | `app/sitemap.ts` file convention |
| **Type** | `MetadataRoute.Sitemap` |
| **Multiple sitemaps** | `generateSitemaps()` function |
| **Confidence** | HIGH (official Next.js docs verified) |

**How it works:**

- Export a default function from `app/sitemap.ts` returning `MetadataRoute.Sitemap`
- Each entry: `{ url, lastModified, changeFrequency, priority, alternates, images }`
- For large sites (50k+ URLs): use `generateSitemaps()` which returns `{ id }[]` and generates `/sitemap/[id].xml`
- Sitemap is cached by default (special Route Handler)
- Sitemap index: manually create via `/sitemap-index.xml/route.ts` when using `generateSitemaps()`

**When to use `next-sitemap` instead:**

| Package | Version | Status | Use When |
|---------|---------|--------|----------|
| `next-sitemap` | 4.2.3 | Last published 2 years ago | Need automatic splitting, robots.txt generation, server-side rendered page discovery, advanced hooks/transforms |

**Recommendation:** Teach the built-in `sitemap.ts` as primary. The existing skill already has this pattern. For large sites with 50k+ URLs, mention `generateSitemaps()` for splitting. The `next-sitemap` package is aging and the trend is migrating away from it.

### Astro: `@astrojs/sitemap` (PRIMARY)

| Property | Value |
|----------|-------|
| **Package** | `@astrojs/sitemap` |
| **Version** | 3.7.0 |
| **Confidence** | HIGH (npm verified, official Astro integration) |

**Key features:**

- Generates `sitemap-index.xml` and `sitemap-0.xml` automatically at build time
- Configuration options: `filter`, `customPages`, `entryLimit`, `changefreq`, `lastmod`, `priority`, `i18n`
- New in 3.7.0: `customSitemaps` for splitting into multiple named files
- New: `excludeNamespaces` to remove XML namespaces (news, xhtml, image, video)
- New: `filenameBase` for custom sitemap filenames

**SSR limitation:** The integration cannot discover dynamic routes in SSR mode (`output: "server"`). For SSR, manually specify URLs via `customPages`.

**Installation:**
```
npx astro add sitemap
```

**Recommendation:** Use `@astrojs/sitemap` for all Astro projects. It is the official integration and covers all standard use cases. Teach the SSR workaround for dynamic routes.

### React/Vite: Manual or `sitemap` npm Package

| Property | Value |
|----------|-------|
| **Approach** | Build-time script or `sitemap` npm package |
| **Package** | `sitemap` (generic XML sitemap generator) |
| **Confidence** | MEDIUM (standard approach but no framework integration) |

**For React/Vite SPAs:**

SPAs typically have limited SEO needs (they run client-side). If the project is a pre-rendered static site (Vite SSG), generate sitemaps at build time using a script that reads the route manifest.

For Tauri/Electron desktop apps: sitemaps are not applicable (not web-crawlable).

**Recommendation:** Teach a build-time Node.js script pattern for Vite SSG projects. For true SPAs, note that sitemaps have limited value since crawlers may not execute JavaScript.

### Sitemap Validation Requirements

Based on research into GSC and Bing Webmaster Tools validation:

| Requirement | Detail |
|-------------|--------|
| **XML encoding** | UTF-8, proper XML declaration `<?xml version="1.0" encoding="UTF-8"?>` |
| **Namespace** | `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` required |
| **URL escaping** | `&`, `'`, `"`, `<`, `>` must use entity escape codes |
| **Date format** | W3C Datetime (`YYYY-MM-DD` or full ISO 8601) |
| **Max URLs** | 50,000 per sitemap file |
| **Max file size** | 50MB uncompressed |
| **No redirects** | URLs must return 200, not 301/302 (upgraded to Warning in GSC Nov 2025) |
| **Canonical only** | Only include canonical URLs (non-canonical pages now flagged as Error in GSC) |
| **Accessible** | Not blocked by robots.txt or authentication |

**Critical 2025 update:** Google Search Console now marks "non-canonical pages in XML sitemap" and "XML sitemap is too large" as Errors (not Notices). This means sloppy sitemaps actively hurt indexing.

---

## 4. IndexNow Protocol Integration

### IndexNow API (Zero-dependency HTTP POST)

| Property | Value |
|----------|-------|
| **Protocol** | IndexNow (open standard) |
| **Endpoint** | `POST https://api.indexnow.org/IndexNow` |
| **Supported by** | Bing, Yandex, Naver, Seznam.cz, Yep |
| **NOT supported by** | Google (as of Feb 2026, despite testing since 2021) |
| **Max URLs/request** | 10,000 |
| **Cost** | Free, no rate limiting |
| **Confidence** | HIGH (official IndexNow.org documentation verified) |

**API specification:**

```
POST /IndexNow HTTP/1.1
Host: api.indexnow.org
Content-Type: application/json; charset=utf-8

{
  "host": "www.example.com",
  "key": "abc123def456...",
  "keyLocation": "https://www.example.com/abc123def456.txt",
  "urlList": [
    "https://www.example.com/page1",
    "https://www.example.com/page2"
  ]
}
```

**Key generation:**
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

**Verification:** Place a text file at `/{key}.txt` in the public directory containing only the key string.

**Response codes:**
- `200` -- Success
- `202` -- Accepted (URLs queued)
- `400` -- Bad request (invalid format)
- `403` -- Key not valid
- `422` -- URLs don't match host
- `429` -- Too many requests

### Framework-Specific Integration

**Next.js:** Create a Route Handler at `app/api/indexnow/route.ts` that:
1. Accepts a list of URLs (from CMS webhook, form submission, or deployment hook)
2. Validates URLs belong to the site's domain
3. POSTs to `api.indexnow.org/IndexNow`
4. For large sites: batch into chunks of 10,000 with 1-second delay

**Astro:** Two approaches:
1. Build-time integration via `astro:build:done` hook (submit all new/changed URLs after each build)
2. Use `astro-indexnow` package (v2.1.0) which automates this -- reads the generated sitemap and submits

| Package | Version | Use Case |
|---------|---------|----------|
| `astro-indexnow` | 2.1.0 | Automated build-time IndexNow submission for Astro |

**React/Vite + Tauri/Electron:** Not applicable (no server-side, not web-crawlable).

**Recommendation:** Teach the raw HTTP pattern (no library needed for Next.js). For Astro, mention `astro-indexnow` as a convenience but also teach the manual `astro:build:done` hook approach.

### Complementary: Google Indexing

Since Google does not support IndexNow, the skill should also teach:

| Method | Use Case | Limitation |
|--------|----------|------------|
| **XML Sitemap submission** | Passive -- crawled periodically by Googlebot | Not instant |
| **Google Search Console URL Inspection** | Manual -- for individual pages | Manual, not automated |
| **Google Indexing API** | Programmatic -- for `JobPosting` and `BroadcastEvent` schemas only | Officially limited to specific schema types |

**Recommendation:** Teach IndexNow for Bing/Yandex instant indexing. For Google, rely on sitemaps + proper `robots.txt`. Mention the Google Indexing API as a specialized tool (not general-purpose).

---

## 5. GEO: Generative Engine Optimization

### What GEO Requires (No Libraries -- Content Patterns Only)

GEO is not a library problem. It is a content structure and markup problem. The skill needs to teach:

| Technique | Implementation | Impact |
|-----------|---------------|--------|
| **FAQ schema on every content page** | JSON-LD `FAQPage` with real Q&A | 3.2x more likely to appear in AI Overviews |
| **Direct-answer paragraphs** | First 50-70 words of each section directly answer a question | AI engines extract these as citations |
| **Question-based headings** | `<h2>` tags phrased as questions | AI engines match to user queries |
| **Structured, scannable content** | Bullet points, numbered lists, tables | 40-61% of AI Overviews use lists |
| **E-E-A-T signals** | Author info, dates, citations, expertise markers | Trust signals for AI source selection |
| **Statistics and citations** | Verifiable data points, source attribution | Increases fact-density for AI extraction |
| **Organization + Author schema** | JSON-LD for entity recognition | Helps AI identify authoritative sources |

### AI Crawler Management

**robots.txt for AI bots (2026 landscape):**

| Bot | Operator | Purpose | Default Recommendation |
|-----|----------|---------|----------------------|
| `Googlebot` | Google | Search indexing | Allow |
| `GPTBot` | OpenAI | LLM training | Block (unless explicitly wanting to contribute to training) |
| `OAI-SearchBot` | OpenAI | ChatGPT search | Allow (for AI search visibility) |
| `ChatGPT-User` | OpenAI | ChatGPT browsing | Allow |
| `Google-Extended` | Google | Gemini training | Block (unless wanting to contribute) |
| `PerplexityBot` | Perplexity | AI search index | Allow (for Perplexity visibility) |
| `ClaudeBot` | Anthropic | Claude training | Block (unless wanting to contribute) |
| `CCBot` | Common Crawl | Open dataset | Site owner's choice |
| `Applebot-Extended` | Apple | Apple Intelligence | Allow (for Apple search/Siri visibility) |

**Key insight:** There is a critical distinction between AI training bots (GPTBot, Google-Extended, ClaudeBot) and AI search bots (OAI-SearchBot, PerplexityBot). Sites that want AI search visibility should ALLOW search bots while BLOCKING training bots.

**robots.txt pattern:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# AI Search Bots -- ALLOW for visibility
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

# AI Training Bots -- BLOCK to protect content
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: https://example.com/sitemap.xml
```

### llms.txt (Emerging Standard)

| Property | Value |
|----------|-------|
| **Specification** | Proposed by Jeremy Howard (Sep 2024) |
| **Adoption** | 600+ websites as of early 2026 |
| **Support** | Anthropic (Claude), Cursor, Mintlify official; OpenAI, Perplexity analyze it |
| **Format** | Markdown file at site root (`/llms.txt`) |
| **Confidence** | LOW-MEDIUM (emerging, not yet a W3C/IETF standard, impact data is minimal) |

**What it is:** A Markdown file at `/llms.txt` that tells AI systems which pages are most important, accurate, and brand-approved. Think of it as a curated index for AI consumption.

**Current reality:** Impact data is nearly zero -- only 1 out of 94,614 cited URLs in a study of 11,867 AI responses was an `/llms.txt` page. The standard is aspirational, not proven.

**Recommendation:** Include as a LOW-priority, forward-looking pattern in the skill. Teach the format but flag it as experimental. Do not present it as a required SEO/GEO step.

---

## 6. Dynamic OG Image Generation

### Next.js: `next/og` ImageResponse (PRIMARY)

| Property | Value |
|----------|-------|
| **API** | `ImageResponse` from `next/og` |
| **Engine** | Satori (HTML/CSS to SVG) + Resvg (SVG to PNG) |
| **Runtime** | Edge Runtime or Node.js Runtime |
| **Confidence** | HIGH (official Next.js docs verified) |

**How it works:**

The `opengraph-image.tsx` file convention in Next.js uses `ImageResponse` to generate OG images dynamically from JSX. Satori renders a subset of CSS (flexbox only, no grid, no pseudo-elements) into SVG, then Resvg converts to PNG.

**Key constraints:**
- Only flexbox layout (no CSS Grid)
- Each element with multiple children must use `display: flex`
- Limited CSS subset (no pseudo-elements, no complex selectors)
- Default font: Noto Sans. Custom fonts must be loaded explicitly (TTF, OTF, WOFF)
- Target size: 1200x630px for OG images

**Previous approach:** `@vercel/og` package -- still works but `next/og` is preferred as it ships with the framework.

### Astro: Satori + Resvg (Manual)

| Property | Value |
|----------|-------|
| **Packages** | `satori`, `satori-html`, `@resvg/resvg-js` |
| **Approach** | Server endpoint that generates PNG on request |
| **Confidence** | MEDIUM (community pattern, well-documented) |

For Astro, use `satori` directly in a Server Endpoint. The `satori-html` package bridges HTML template strings to Satori's VNode format.

### DNA Connection for OG Images

OG images should use Design DNA tokens:
- Background color from `bg-primary` or `surface` token
- Headline in `--font-display` font
- Accent color from `primary` or `accent` token
- Brand logo placement

**Recommendation:** Teach the `next/og` `ImageResponse` pattern for Next.js. For Astro, teach the Satori endpoint pattern. Both should integrate with Design DNA tokens for brand consistency.

---

## 7. Canonical URLs & hreflang

### Canonical URLs

**Next.js:**
```tsx
// In generateMetadata or static metadata
alternates: {
  canonical: `https://example.com/${slug}`,
}
```

**Astro:**
```astro
<link rel="canonical" href={canonicalUrl ?? Astro.url.href} />
```

**Critical pitfalls (verified via research):**
1. URLs must be absolute, never relative
2. Canonical must NOT point to a redirect target
3. Trailing slash consistency (pick one, enforce everywhere)
4. www vs non-www must be consistent
5. Canonical and sitemap URLs must match

### hreflang

**Next.js:**
```tsx
alternates: {
  languages: {
    'en': 'https://example.com/en/page',
    'de': 'https://example.com/de/page',
    'x-default': 'https://example.com/page',
  },
}
```

**Astro:** Use `@astrojs/sitemap` with `i18n` config + manual `<link rel="alternate" hreflang="...">` tags in layout.

**Key rule:** hreflang is bidirectional -- if page A points to page B as an alternate, page B MUST point back to page A. Missing return links cause Google to ignore the hreflang declaration.

**Handoff:** The `i18n-rtl` skill handles routing and layout. The `seo-meta` skill handles the meta tag output (hreflang `<link>` tags, sitemap alternates). This boundary is already correctly defined.

---

## 8. External API Integration Patterns

### Server Actions vs Route Handlers (Next.js)

| Pattern | Use When | Example |
|---------|----------|---------|
| **Server Actions** | Direct component-to-server interaction, form submissions, mutations | Contact form submitting to HubSpot |
| **Route Handlers** | External webhooks, third-party integrations, public API endpoints, non-React callers | CMS webhook triggering IndexNow, analytics endpoint |

**Recommendation for the skill:** Teach both patterns. Server Actions for user-facing interactions (forms, CRM submissions). Route Handlers for machine-to-machine communication (webhooks, IndexNow, external API proxies).

### Typed API Clients

For external API integration (HubSpot, CRMs, etc.), the skill should teach:

1. **Type-safe API wrapper pattern** -- Create a typed client in `lib/api/[service].ts`
2. **Environment variable management** -- API keys in `.env.local`, validated at startup
3. **Error handling** -- Typed error responses, retry logic for transient failures
4. **Rate limiting awareness** -- Respect API rate limits, implement backoff

**No specific library needed** -- use native `fetch` with TypeScript generics. The pattern is more valuable than the package.

### Context7 MCP for Doc Lookup

Context7 is available as an MCP tool within Claude Code sessions. It provides current, authoritative documentation for libraries.

**How Genorah should teach this:** The skill doesn't need to integrate Context7 as a runtime dependency. It should:
1. Reference Context7 in the research/planning agents as a documentation source
2. Teach builders to verify library patterns against current docs
3. Not ship Context7 as a runtime dependency (it's a dev-time tool)

---

## 9. Complete Recommended Stack Summary

### Zero-Dependency (Framework Native)

| Capability | Next.js | Astro | React/Vite |
|-----------|---------|-------|------------|
| **Meta tags** | `metadata` / `generateMetadata` | `<head>` in layouts | React 19 native `<title>/<meta>` |
| **Open Graph** | `metadata.openGraph` | `<meta property="og:*">` | `<meta property="og:*">` |
| **Canonical** | `metadata.alternates.canonical` | `Astro.url.href` | Manual `<link>` |
| **hreflang** | `metadata.alternates.languages` | Manual `<link>` | Manual `<link>` |
| **robots.txt** | `app/robots.ts` | Static `public/robots.txt` | Static `public/robots.txt` |
| **Sitemap** | `app/sitemap.ts` | `@astrojs/sitemap` (official) | Build-time script |
| **JSON-LD** | `<script type="application/ld+json">` | `<script set:html>` | `<script>` via component |
| **OG images** | `next/og` (`ImageResponse`) | Satori endpoint | N/A (SSR needed) |
| **IndexNow** | Route Handler (`fetch` POST) | Build hook / `astro-indexnow` | N/A |

### Required Dependencies

| Package | Version | Purpose | When |
|---------|---------|---------|------|
| `schema-dts` | ^1.1.5 | TypeScript types for JSON-LD | All projects with structured data (devDependency, zero runtime cost) |
| `@astrojs/sitemap` | ^3.7.0 | Sitemap generation | Astro projects only |

### Optional Dependencies

| Package | Version | Purpose | When |
|---------|---------|---------|------|
| `@dr.pogodin/react-helmet` | Latest | Metadata management | React/Vite projects needing complex route-based metadata |
| `astro-indexnow` | ^2.1.0 | Automated IndexNow submission | Astro projects wanting build-time IndexNow integration |
| `satori` | Latest | OG image generation | Astro projects needing dynamic OG images |
| `satori-html` | Latest | HTML-to-VNode bridge for Satori | Used with Satori in non-React contexts |
| `@resvg/resvg-js` | Latest | SVG-to-PNG conversion | Used with Satori for OG image generation |

### Explicitly NOT Recommended

| Package | Why Avoid | Use Instead |
|---------|-----------|-------------|
| `next-seo` | Legacy; App Router has everything built in | Next.js metadata API |
| `next/head` | Pages Router only; silently fails in App Router | `metadata` export |
| `react-helmet-async` | Unmaintained; React 19 peer dep issues | React 19 native or `@dr.pogodin/react-helmet` |
| `react-helmet` | Unmaintained since 2020; thread-unsafe | React 19 native or `@dr.pogodin/react-helmet` |
| `next-sitemap` | Last published 2+ years ago; trend is migration to built-in | Next.js built-in `sitemap.ts` |
| `react-schemaorg` | Thin wrapper; unnecessary over raw schema-dts | `schema-dts` types + raw JSON-LD |

---

## 10. Version Pinning Recommendations

```json
{
  "seo-core": {
    "schema-dts": "^1.1.5"
  },
  "astro-seo": {
    "@astrojs/sitemap": "^3.7.0",
    "astro-indexnow": "^2.1.0"
  },
  "og-images": {
    "satori": "latest",
    "satori-html": "latest",
    "@resvg/resvg-js": "latest"
  },
  "react-vite-fallback": {
    "@dr.pogodin/react-helmet": "latest"
  }
}
```

**Note:** Most SEO/GEO capabilities require zero additional dependencies. The framework-native APIs in Next.js 16 and Astro 5 cover 95% of use cases. `schema-dts` is the only universally recommended addition (and it's a devDependency with zero runtime cost).

---

## 11. Stack Interaction Map

```
                    Design DNA (tokens)
                         |
            +------------+------------+
            |                         |
    OG Image Generation        Brand voice/tone
    (bg, font, accent          (meta descriptions,
     from DNA tokens)           copy intelligence)
            |                         |
            v                         v
    +-------+--------+     +---------+--------+
    | next/og         |     | Meta Tags        |
    | Satori          |     | (generateMetadata|
    | ImageResponse   |     |  / <head>)       |
    +-------+---------+     +---------+--------+
            |                         |
            v                         v
    +-------+-------------------------+--------+
    |           Page <head> Output              |
    |  title, meta, og:*, twitter:*, canonical  |
    |  JSON-LD, hreflang, verification          |
    +-------+-------------------------+--------+
            |                         |
            v                         v
    +-------+---------+     +---------+--------+
    | Sitemap          |     | robots.txt       |
    | (XML, validated  |     | (AI bot rules,   |
    |  GSC/Bing)       |     |  sitemap ref)    |
    +-------+---------+     +---------+--------+
            |                         |
            v                         v
    +-------+---------+     +---------+--------+
    | IndexNow API     |     | llms.txt         |
    | (POST to Bing    |     | (AI visibility   |
    |  /Yandex/Naver)  |     |  markdown index) |
    +------------------+     +------------------+
```

---

## Sources & Confidence

| Source | What It Verified | Confidence |
|--------|-----------------|------------|
| [Next.js Metadata Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) | Sitemap API, MetadataRoute types | HIGH |
| [Next.js OG Image Docs](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) | ImageResponse API, opengraph-image convention | HIGH |
| [IndexNow.org Documentation](https://www.indexnow.org/documentation) | API spec, endpoint, request format | HIGH |
| [Astro Sitemap Docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | @astrojs/sitemap config, features | HIGH |
| [schema-dts npm](https://www.npmjs.com/package/schema-dts) | Version 1.1.5, TypeScript types | HIGH |
| [@astrojs/sitemap npm](https://www.npmjs.com/package/@astrojs/sitemap) | Version 3.7.0, features | HIGH |
| [Google Structured Data Docs](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) | JSON-LD recommendation, validation | HIGH |
| [React 19 Release Blog](https://react.dev/blog/2024/12/05/react-19) | Native metadata hoisting | HIGH |
| [Search Engine Land GEO Guide](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142) | GEO techniques, AI Overviews optimization | MEDIUM |
| [Frase.io FAQ Schema + GEO](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo) | FAQ schema 3.2x AI Overview impact | MEDIUM |
| [Cloudflare AI Crawler Report](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/) | AI bot landscape, robots.txt adoption | MEDIUM |
| [FreeCodeCamp IndexNow Guide](https://www.freecodecamp.org/news/how-to-index-nextjs-pages-with-indexnow/) | Next.js IndexNow implementation | MEDIUM |
| [Bluehost llms.txt Guide](https://www.bluehost.com/blog/what-is-llms-txt/) | llms.txt specification, adoption | LOW-MEDIUM |
| [ALLMO llms.txt Report](https://www.allmo.ai/articles/llms-txt) | llms.txt citation data (1/94,614) | LOW-MEDIUM |
| Training data (May 2025) | Satori CSS limitations, OG image patterns | MEDIUM |

### Verification Gaps

- **Satori version number**: Could not verify exact current version via npm (Bash restricted). Listed as "latest" for non-Next.js usage. The `next/og` bundled version is the one that matters for Next.js.
- **`@dr.pogodin/react-helmet` version**: Could not verify exact version. Recommended as "latest" -- functional details confirmed via WebSearch.
- **`astro-indexnow` 2.1.0**: Version from WebSearch (Libraries.io), not independently verified via npm registry.
- **Google's IndexNow adoption**: Multiple sources confirm Google has NOT adopted IndexNow as of Feb 2026. This should be re-checked periodically as Google has been testing since 2021.
- **llms.txt impact data**: Based on a single study by ALLMO. The standard is too new for robust impact measurement.

---

*Research completed: 2026-02-25*
*Milestone: v1.5 SEO/GEO Capabilities*
*Ready for roadmap: yes*
