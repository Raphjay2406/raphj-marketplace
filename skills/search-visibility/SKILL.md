---
name: "search-visibility"
description: "IndexNow instant indexing, AI-aware robots.txt presets, llms.txt generation, unified indexing strategy, and webmaster tools submission workflows for Next.js 16 and Astro 5"
tier: "domain"
triggers: "IndexNow, indexing, search visibility, llms.txt, AI crawlers, robots.txt AI bots, webmaster tools, Google Search Console, Bing Webmaster, sitemap submission, content discovery, search engine submission"
version: "1.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Public-facing site that publishes or updates content** (blog, e-commerce, CMS-driven, documentation) -- This skill sets up instant indexing for Bing/Yandex/Naver via IndexNow and sitemap-based indexing for Google
- **Need instant indexing for non-Google engines** -- IndexNow pushes new and updated URLs to Bing, Yandex, Naver, Seznam, Yep, Internet Archive, and Amazon within minutes
- **Need AI crawler control** -- Three robots.txt presets (Open/Selective/Restrictive) extend Phase 14's base robots.txt with explicit AI bot directives
- **Need AI discoverability** -- llms.txt provides a structured overview of site content for AI systems (forward-looking convention, ~844k sites adopted)
- **Need webmaster tools setup** -- Step-by-step verification and sitemap submission workflows for Google Search Console, Bing Webmaster Tools, Yandex Webmaster, and Naver Search Advisor
- **"How fast do search engines find my new pages" matters** -- Sites with frequent content updates (product launches, blog posts, news) benefit most from IndexNow's push-based model

### When NOT to Use

- **Meta tags, canonical URLs, sitemaps, hreflang** -- Use the `seo-meta` skill (Phase 14) for all per-page metadata, sitemap generation, and base robots.txt patterns
- **JSON-LD structured data** -- Use the `structured-data` skill (Phase 15) for FAQPage, Article, Product, Organization, and other schema types
- **OG image generation** -- Phase 18 scope (Dynamic OG Images & Pipeline Wiring)
- **Private dashboards behind authentication** -- No search engine should index authenticated content; skip this skill entirely
- **Tauri or Electron desktop apps** -- Desktop apps have no public URLs; this skill is exclusively for web-deployed sites
- **Note:** This skill EXTENDS Phase 14's robots.txt foundation with AI-specific presets. It does NOT replace the base robots.txt patterns in `seo-meta`. The base crawl directives (`/api/`, `/admin/`, `/_next/`) come from `seo-meta`; this skill adds AI bot rules on top

### Unified Indexing Strategy

**IndexNow does NOT work for Google.** Google tested the protocol in 2022 but never adopted it. The official IndexNow registry (`searchengines.json` at indexnow.org) lists 7 engines -- Google is not among them. For Google, the only paths are: submit your sitemap via Google Search Console and reference it in robots.txt. IndexNow works for Bing, Yandex, Naver, Seznam, Yep, Internet Archive, and Amazon -- all via a single POST to `api.indexnow.org`.

#### Engine x Method Comparison Matrix

| Engine | IndexNow | Sitemap | Webmaster Tools | Sitemap Ping | Notes |
|--------|----------|---------|-----------------|--------------|-------|
| Google | No | Yes | GSC submission | Deprecated (June 2023) | Sitemaps + GSC is the only path |
| Bing | Yes | Yes | Bing WMT | N/A (use IndexNow) | IndexNow preferred over sitemap ping |
| Yandex | Yes | Yes | Yandex Webmaster | N/A (use IndexNow) | IndexNow preferred |
| Naver | Yes | Yes | Naver Search Advisor | N/A (use IndexNow) | IndexNow preferred |
| Seznam | Yes | Yes | N/A | N/A | IndexNow auto-shared via global endpoint |
| Yep | Yes | Yes | N/A | N/A | IndexNow auto-shared via global endpoint |
| Internet Archive | Yes | N/A | N/A | N/A | Preservation, not search ranking |
| Amazon | Yes | N/A | N/A | N/A | Alexa/AI features |

#### Dual-Path Strategy

For every project, implement both paths:

1. **Google path:** Generate sitemap (Phase 14's `app/sitemap.ts` or `@astrojs/sitemap`) + submit to Google Search Console + reference in robots.txt. Google sitemap ping was deprecated June 2023 -- skip it entirely.
2. **Everything else:** Set up IndexNow endpoint + submit API key verification file. A single POST to `https://api.indexnow.org/IndexNow` auto-distributes to all 7 participating engines within seconds.

#### Project-Type Recipes

**Static blog / marketing site:**
- Build: Generate sitemap via framework (`app/sitemap.ts` or `@astrojs/sitemap`)
- Deploy: Submit changed URLs to IndexNow via build script or `astro-indexnow` integration
- Once: Submit sitemap to GSC, Bing WMT, Yandex, Naver
- Ongoing: Sitemaps auto-update on rebuild; IndexNow handles Bing/Yandex/Naver on deploy

**E-commerce / CMS-driven site:**
- Runtime: IndexNow Route Handler triggered on product/content publish (CMS webhook or ISR revalidation callback)
- Batch: Submit bulk URLs on inventory updates (up to 10,000 per call)
- Sitemap: Dynamic sitemap with accurate `lastmod` dates
- GSC: Sitemap auto-crawled; manual resubmit only if major URL structure changes

**SaaS landing page (few pages, infrequent changes):**
- Sitemap: Static sitemap, submit to GSC once
- IndexNow: Optional -- few pages with infrequent changes don't benefit much from instant indexing
- Focus: GSC monitoring for indexing issues; Bing WMT import from GSC for zero-effort Bing coverage

### Decision Tree

- **Framework:**
  - Next.js -- Route Handler at `app/api/indexnow/route.ts`
  - Astro SSG -- `astro-indexnow` integration (build-time, automatic change detection)
  - Astro SSR/Hybrid -- API endpoint at `src/pages/api/indexnow.ts`
- **Content frequency:**
  - Frequent updates (daily/hourly) -- Runtime IndexNow endpoint with content-hash tracking
  - Infrequent updates (weekly/monthly) -- Build-time submission only
- **Site size:**
  - < 100 pages -- Single URL submission OK, hash tracking optional
  - 100-10,000 pages -- Batch submission recommended, hash tracking recommended
  - 10,000+ pages -- Batch submission with content-hash tracking mandatory (prevents spam flags)
- **AI visibility:**
  - Choose one of three robots.txt presets based on business goals:
    - **Open** -- Allow all AI crawlers (maximize AI search + training visibility)
    - **Selective** -- Allow AI search bots, block AI training bots (most common choice)
    - **Restrictive** -- Block all AI bots (full content protection)
  - See `appendix-ai-crawlers.md` for the complete crawler taxonomy and preset templates (Plan 02)
- **Google indexing:**
  - Always sitemap + GSC. No IndexNow path exists for Google. Period.

### Pipeline Connection

- **Referenced by:** build-orchestrator at Wave 0-1 (IndexNow endpoint scaffold, key verification file, robots.txt AI presets, llms.txt generation), section-builder during content publish hooks
- **Consumed at:** `/modulo:execute` Wave 0 (IndexNow endpoint scaffold, key verification file, robots.txt AI rules, llms.txt), Wave 2+ (content-hash tracking on per-section publish)
- **Input from:** `seo-meta` skill (base robots.txt directives, sitemap URL), Design DNA (site name, URL for llms.txt)
- **Output to:** IndexNow endpoint (Route Handler or Astro endpoint), AI-aware robots.txt rules, llms.txt file, webmaster tools verification files
