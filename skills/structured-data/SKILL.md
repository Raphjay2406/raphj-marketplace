---
name: "structured-data"
description: "Typed JSON-LD schemas for all major page types via @graph combination, GEO-optimized content patterns (BLUF, question headings, quotable stats, FAQ-first), and schema audit protocol for content-schema consistency."
tier: "domain"
triggers: "structured data, JSON-LD, schema, rich results, FAQ schema, Article schema, Organization schema, BreadcrumbList, Product schema, LocalBusiness, Event schema, HowTo, WebSite schema, @graph, GEO, generative engine optimization, AI search, BLUF, question headings, quotable statistics, schema audit, content-schema match"
version: "1.0.0"
---

## Layer 1: Decision Guidance

Structured data makes content machine-readable. JSON-LD schemas tell search engines and AI engines what a page contains -- article, product, event, FAQ, organization -- so they can display rich results, populate knowledge panels, and cite content in AI-generated answers. Every public-facing page benefits from structured data, even when Google rich results are not guaranteed, because AI engines extract it independently.

### When to Use

- **Any page with an identifiable content type** (article, product, event, FAQ, local business, etc.) -- attach the matching JSON-LD schema per the recipe table below
- **Any page targeting AI search engine visibility (GEO)** -- add FAQ schema for AI extraction, apply GEO content patterns (BLUF, question headings, quotable stats)
- **Any page where the Emotional Arc assigns TENSION, PROOF, or CLOSE beats** -- these are schema integration points (TENSION = FAQ schema, PROOF = statistics + author markup, CLOSE = Organization schema)
- **Every page with breadcrumb navigation** -- add BreadcrumbList schema (virtually all multi-page sites)

### When NOT to Use

- **Private dashboards behind authentication** -- no search engine will crawl them; structured data adds no value
- **Tauri/Electron desktop apps** -- no web crawling occurs; structured data is meaningless
- **For meta tags, canonical URLs, sitemaps, and robots.txt** -- use the `seo-meta` skill instead. Structured data and meta tags are complementary -- most pages need BOTH skills
- **For IndexNow and proactive indexing** -- use the `search-visibility` skill (Phase 16). This skill handles what the page says about itself; search-visibility handles how the page gets discovered

### Schema Status Matrix

Not all schemas deliver the same value. Google has deprecated or restricted several rich result types while AI engines continue to extract all valid schema. This table is the source of truth for what to promise clients and stakeholders.

| Schema Type | Google Rich Result | Status | AI Engine Value |
|---|---|---|---|
| Article / BlogPosting / NewsArticle | Article rich result, Google News | **Active** | High -- headline, author, dates extracted |
| FAQPage | FAQ rich result | **Restricted** (gov/health only since Aug 2023) | Critical -- high correlation with AI Overview appearance |
| HowTo | NONE | **Deprecated** (mobile Aug 2023, desktop Sep 2023) | Medium -- AI engines extract step-by-step content |
| Organization | Knowledge panel | **Active** | High -- entity recognition |
| WebSite | NONE (sitelinks search box removed Nov 2024) | Schema valid, no rich result | Medium -- site identity, AI entity recognition |
| BreadcrumbList | Breadcrumb trail in search results | **Active** | Medium -- page hierarchy |
| Product | Product snippet, Popular Products | **Active** | High -- price, availability, reviews |
| LocalBusiness | Local business panel | **Active** | High -- location, hours, contact |
| Event | Event experience on Google | **Active** | High -- date, location, tickets |

**Honesty policy:** Never promise rich results for schemas marked Restricted or Deprecated. FAQ schema is implemented for GEO value, not Google rich results. HowTo schema is implemented for AI extraction, not visual search results.

### Per-Page-Type Recipe Table

This is the primary reference for section-planners assigning schemas during `/modulo:plan-dev`. Each page type gets a specific combination of schemas assembled into a single `@graph`.

| Page Type | Schema Combination | Notes |
|---|---|---|
| **Homepage** | Organization + WebSite + BreadcrumbList | WebSite no longer triggers sitelinks search box (deprecated Nov 2024) but aids entity recognition |
| **Blog Post** | BlogPosting + BreadcrumbList + FAQPage (if FAQ exists) | FAQPage for GEO value even though rich results are restricted for most sites |
| **Article / News** | Article or NewsArticle + BreadcrumbList + FAQPage | NewsArticle for time-sensitive content only |
| **Product Page** | Product + BreadcrumbList + FAQPage | Product schema requires `name` + `offers` for rich results |
| **Service Page** | Organization + BreadcrumbList + FAQPage | No dedicated Service rich result; Organization helps entity recognition |
| **About Page** | Organization + BreadcrumbList | Full Organization details here (logo, social, contact) |
| **Contact Page** | Organization (with ContactPoint) + LocalBusiness + BreadcrumbList | LocalBusiness for physical locations only |
| **Event Page** | Event + BreadcrumbList + Organization | Event requires `name` + `startDate` + `location` |
| **Landing Page** | Organization + BreadcrumbList + FAQPage (if content warrants) | Keep schemas minimal; content-schema match is critical -- do not add FAQ schema without visible FAQ content |
| **Tutorial / Guide** | Article + BreadcrumbList + HowTo + FAQPage | HowTo for AI extraction only (no Google rich results); Article is the PRIMARY schema |
| **Portfolio** | Organization + BreadcrumbList | Minimal schemas; visual content is the focus |

### Decision Tree

Key branching decisions when assigning schemas to a page:

1. **Single schema vs multi-schema?** Use `@graph` when 2+ schemas apply. Most pages have at least 3 (Organization + BreadcrumbList + content type). See Layer 2 for the `@graph` combination pattern.

2. **FAQ content exists on the page?** Add FAQPage to the `@graph`. This is for GEO (AI search visibility), NOT for Google FAQ rich results (restricted to gov/health sites). The FAQ data array must drive BOTH the visible FAQ component AND the JSON-LD -- they must match exactly.

3. **Tutorial or guide content?** Use Article (or BlogPosting) as the PRIMARY schema. Optionally add HowTo schema for AI engines to extract step-by-step content. Do NOT expect HowTo rich results from Google (fully deprecated Aug-Sep 2023).

4. **E-commerce product?** Product schema requires `name` + `offers` to be eligible for rich results. Include `aggregateRating` and `review` if available. Missing `offers` means no Product rich result.

5. **Physical location?** Add LocalBusiness schema alongside Organization. Include `address`, `geo` (coordinates), and `openingHoursSpecification`. Use a specific subtype when applicable (Restaurant, Dentist, etc.).

6. **Blog vs news content?** BlogPosting for evergreen blog content. NewsArticle ONLY for time-sensitive news (breaking news, event reports, press releases). NewsArticle in non-news contexts confuses Google.

7. **Content-heavy page (blog, article, documentation)?** Apply GEO content patterns -- BLUF formatting, question-based headings, quotable statistics. See Layer 2 GEO patterns section and the archetype intensity guidance below.

8. **Content-light page (landing page, portfolio)?** Minimal GEO. Focus on schema accuracy and Emotional Arc. Do not force BLUF or FAQ sections where they do not belong.

### GEO Decision Guidance

GEO (Generative Engine Optimization) structures content so AI search engines (ChatGPT, Perplexity, Claude Search, Gemini) can extract, cite, and surface it in AI-generated answers. Not all pages benefit equally.

**When GEO patterns apply:**
- Content-heavy pages (blog posts, articles, documentation, guides) -- **high benefit**
- Service pages with substantial copy -- **moderate benefit**
- Landing pages, portfolios, product pages -- **low benefit** (Emotional Arc drives the story; do not over-optimize)

**GEO pattern types** (detailed in Layer 2):
- **BLUF (Bottom Line Up Front):** Lead with the answer, then supporting details
- **Question-based headings:** H2/H3 phrased as questions for direct AI extraction
- **Quotable statistics with citations:** Formatted for AI extraction with source attribution
- **FAQ-first content:** FAQ sections designed for GEO visibility with archetype-aware styling

**Archetype intensity tiers** (detailed mapping in Layer 3):
- **Full:** Neo-Corporate, Data-Dense, Editorial, Dark Academia -- all GEO patterns, visually prominent
- **Moderate:** Playful/Startup, Organic, Warm Artisan, Retro-Future, Neubrutalism, AI-Native -- GEO patterns styled to match archetype
- **Subtle:** Luxury/Fashion, Japanese Minimal, Ethereal, Swiss/International, Glassmorphism -- restrained GEO, elegant FAQ, no BLUF
- **Minimal:** Brutalist, Kinetic, Neon Noir, Vaporwave -- raw or hidden GEO, declarative statements

**Key principle:** Same SEO signals, different visual expression. A Luxury FAQ section uses elegant typography and generous spacing. A Brutalist FAQ uses raw text blocks. Both produce identical JSON-LD underneath.

### Pipeline Connection

- **Referenced by:** section-planner (assigns schemas per section in PLAN.md), section-builder (generates JSON-LD during implementation), content-specialist (applies GEO content patterns)
- **Consumed at:** `/modulo:plan-dev` (schema assignment per section using the recipe table), `/modulo:execute` Wave 2+ (JSON-LD generation per section, GEO pattern implementation)
- **Verified by:** quality-reviewer (schema audit protocol -- runs on every quality-reviewer pass, after both `/modulo:execute` and `/modulo:iterate`)
- **Related skills:**
  - `seo-meta` -- meta tags, canonical URLs, robots.txt, OG images. This skill handles structured data. Most pages need both.
  - `emotional-arc` -- beat-to-schema mapping. TENSION beats get FAQ schema, PROOF beats get statistics + author markup, CLOSE beats get Organization schema.
  - `search-visibility` (Phase 16) -- IndexNow, sitemaps, proactive indexing. This skill makes content machine-readable; search-visibility makes content discoverable.
