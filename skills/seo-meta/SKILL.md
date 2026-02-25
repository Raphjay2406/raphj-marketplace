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
