# Feature Landscape: SEO/GEO v1.5 Milestone

**Domain:** SEO, GEO, Sitemaps, IndexNow, AI Search Visibility
**Researched:** 2026-02-25

---

## Table Stakes

Features every professional site must have. Missing = invisible to search engines and AI.

| Feature | Why Expected | Complexity | Framework Coverage |
|---------|--------------|------------|-------------------|
| **Title + meta description** | Basic search result display | Low | All frameworks native |
| **Open Graph tags** (og:title, og:description, og:image, og:url) | Social sharing preview | Low | All frameworks native |
| **Twitter Card tags** | Twitter/X sharing preview | Low | All frameworks native |
| **Canonical URLs** | Prevent duplicate content penalties | Low | Next.js `alternates.canonical`, Astro `Astro.url.href` |
| **robots.txt** | Crawler access control | Low | Next.js `app/robots.ts`, Astro static file |
| **XML sitemap** | Search engine URL discovery | Medium | Next.js `app/sitemap.ts`, Astro `@astrojs/sitemap` |
| **JSON-LD structured data** (Organization, WebSite) | Entity recognition, knowledge panel | Medium | Manual JSON-LD injection |
| **Mobile-friendly meta** (viewport) | Google mobile-first indexing | Low | Framework defaults handle this |
| **HTTPS** | Google ranking signal since 2014 | Low | Deployment concern, not skill concern |
| **Page speed** (Core Web Vitals) | Ranking signal; LCP, CLS, INP | High | Covered by `performance-guardian` skill |

**Notes:** The existing `seo-meta` skill covers most table stakes. Primary gaps are in the structured data depth (only Article, FAQ, BreadcrumbList, Product schemas currently) and canonical URL pitfall documentation.

---

## Differentiators

Features that set a site apart in search and AI visibility. Not all sites have these.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **GEO-optimized content structure** | 3.2x more likely to appear in AI Overviews with FAQ schema | Medium | Content patterns, not library |
| **Dynamic OG images** | Brand-consistent social previews per page | Medium | `next/og` / Satori |
| **IndexNow integration** | Instant Bing/Yandex indexing on publish | Low | Simple HTTP POST |
| **Typed JSON-LD** (via `schema-dts`) | Compile-time schema validation, prevents invalid markup | Low | DevDependency only |
| **AI crawler management** | Control training vs search bot access | Low | robots.txt configuration |
| **hreflang implementation** | Multi-language search results | Medium | Handoff with `i18n-rtl` skill |
| **Article + Author schema** | Authorship rich results, E-E-A-T | Medium | JSON-LD pattern |
| **FAQ schema on content pages** | FAQ rich results + AI citation boost | Low | JSON-LD pattern |
| **HowTo schema** | Step-by-step rich results + AI extraction | Low | JSON-LD pattern |
| **BreadcrumbList schema** | Navigation breadcrumbs in search results | Low | JSON-LD pattern |
| **Sitemap index** (50k+ URLs) | Large-site SEO compliance | Medium | `generateSitemaps()` / Astro `customSitemaps` |
| **llms.txt** | Forward-looking AI discoverability | Low | Markdown file at site root |
| **Google Search Console verification** | Site ownership proof | Low | `metadata.verification` |
| **Bing Webmaster Tools verification** | Site ownership proof | Low | `metadata.verification` |

---

## Anti-Features

Features to explicitly NOT build in the SEO/GEO skill.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **SEO score dashboard** | The plugin generates code, not analytics. SEO monitoring is a SaaS product concern. | Teach patterns that produce high SEO scores. Let GSC/Lighthouse measure. |
| **Keyword research integration** | Keyword research is a pre-design activity. The plugin builds sites, not marketing strategies. | Accept keywords as input during `/gen:start-project` discovery. |
| **Automatic meta description generation** | LLM-generated descriptions risk generic "Learn more about..." copy. | Teach copy intelligence patterns for meta descriptions. Require human-quality descriptions. |
| **Analytics/tracking code injection** | Analytics is not design. Covered by separate tooling (GA, Plausible, PostHog). | Provide clean `<head>` structure. Mention where to add analytics, but do not pre-install. |
| **Server-side rendering for SPAs** | Adding SSR to React/Vite SPAs for SEO is a framework-level architectural decision, not a skill concern. | Document that SPAs have limited SEO. Recommend Next.js or Astro if SEO is critical. |
| **CMS content management** | CMS is infrastructure, not design. Covered by separate tools. | Teach data-fetching patterns that work with any CMS. Focus on how content looks, not where it comes from. |
| **Link building / backlink strategy** | Off-page SEO is marketing, not frontend design. | Out of scope. |

---

## Feature Dependencies

```
Foundation:
  Meta tags (title, description, OG, Twitter)
       |
       v
  Canonical URLs + robots.txt
       |
       +----------+-----------+
       |          |           |
       v          v           v
  Sitemap     JSON-LD     hreflang
  (XML)     (structured   (i18n-rtl
             data)         handoff)
       |          |
       v          v
  IndexNow   GEO patterns
  (proactive  (FAQ schema,
   indexing)   content structure)
       |
       v
  AI Crawler Management
  (robots.txt AI rules, llms.txt)

Visual Enhancement:
  Design DNA tokens
       |
       v
  Dynamic OG Images
  (next/og, Satori)
```

---

## MVP Recommendation for v1.5

### Must Ship:

1. **Updated `seo-meta` skill** with modern patterns (React 19 native metadata, correct canonical pitfalls, current sitemap validation rules)
2. **Typed JSON-LD patterns** using `schema-dts` (Article, FAQPage, Organization, BreadcrumbList, HowTo, Product, WebSite)
3. **GEO content patterns** (question-based headings, direct-answer paragraphs, fact-density, FAQ schema priority)
4. **AI crawler robots.txt** (search bots vs training bots distinction)
5. **IndexNow integration pattern** (Next.js Route Handler, Astro build hook)

### Should Ship:

6. **Dynamic OG image generation** (DNA-integrated `next/og` and Satori patterns)
7. **Sitemap index patterns** for large sites (`generateSitemaps()`)
8. **llms.txt** template and guidance (experimental, forward-looking)

### Defer:

9. **External API integration patterns** (HubSpot, CRM) -- this is a separate skill concern, not SEO-specific
10. **Video sitemap / news sitemap** -- niche, add when needed

---

## Sources

See STACK.md for complete source list.

---
*Research completed: 2026-02-25*
