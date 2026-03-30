# Feature Landscape: v1.5 SEO/GEO Optimization & API Integration

**Domain:** SEO, Generative Engine Optimization, Sitemap Generation, IndexNow, CRM/API Integration
**Researched:** 2026-02-25
**Mode:** Ecosystem
**Overall Confidence:** HIGH (verified against official documentation and multiple current sources)
**Context:** Genorah 2.0 plugin for premium frontend design. Existing `seo-meta` skill is shallow and needs replacement with comprehensive, framework-aware SEO/GEO knowledge.

---

## Table Stakes

Features every premium site must have. Missing = site feels amateur to search engines, AI platforms, and technical auditors.

---

### TS-1: Complete Meta Tag Architecture

| Aspect | Detail |
|--------|--------|
| **What** | Per-page title (with template pattern), meta description, canonical URL, robots directives, viewport meta, charset. Framework-native implementation: Next.js `metadata` export / `generateMetadata`, Astro `<head>` in layouts, React/Vite `react-helmet-async`. |
| **Why Expected** | Foundational SEO. Without proper title/description, pages show raw URLs in search results. Without canonical URLs, duplicate content dilutes rankings. Google explicitly requires these for indexing. |
| **Complexity** | Low |
| **Current Skill Status** | EXISTS in `seo-meta` but incomplete. Has basic patterns for all three frameworks. Missing: viewport meta, charset, title template best practices for deeply nested routes, `metadataBase` configuration, meta description length enforcement (150-160 chars). |
| **v1.5 Requirement** | Complete meta tag coverage with framework-specific implementation. Title templates that cascade properly (`%s | Section | Brand`). Dynamic `generateMetadata` patterns for CMS-driven content. Meta description quality validation (no truncation, no duplication across pages). Canonical URLs generated from route, never hardcoded. |
| **Confidence** | HIGH -- verified against Next.js official docs and Google Search Central |

### TS-2: Open Graph & Social Sharing

| Aspect | Detail |
|--------|--------|
| **What** | Complete Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`, `og:locale`), Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:creator`), and article-specific OG properties (`article:published_time`, `article:modified_time`, `article:author`). |
| **Why Expected** | When a premium site is shared on LinkedIn, X/Twitter, Slack, or Discord, it must show a rich preview -- not a blank card or random scraped image. Social sharing is how premium sites get organic amplification. |
| **Complexity** | Low-Medium |
| **Current Skill Status** | EXISTS in `seo-meta` with good patterns for all three frameworks. Covers `og:image` at 1200x630px. Missing: `og:locale` for i18n sites, article-specific OG properties beyond `published_time`, LinkedIn-specific considerations. |
| **v1.5 Requirement** | Complete OG coverage. Every page type (landing, blog post, product, about) has a prescribed set of OG tags. og:image dimensions enforced at 1200x630px (1.91:1 ratio). Fallback strategy: page-specific image > section-specific image > site-wide branded default. Twitter falls back to OG if twitter-specific tags absent -- document when to use twitter-specific vs rely on fallback. |
| **Confidence** | HIGH -- dimensions verified against platform documentation |

### TS-3: Dynamic OG Image Generation

| Aspect | Detail |
|--------|--------|
| **What** | Programmatic generation of unique Open Graph images per page using `next/og` (Next.js) or build-time generation (Astro/Vite). Uses `ImageResponse` constructor which converts JSX+CSS to PNG via Satori/Resvg. Supports custom fonts, flexbox layout, nested images, text wrapping. |
| **Why Expected** | Premium sites do not use a single static OG image for all pages. Each blog post, product page, and landing page has a unique social preview that includes the page title, brand colors, and relevant imagery. This is what Vercel, Stripe, and Linear do. |
| **Complexity** | Medium |
| **Current Skill Status** | NOT covered in existing `seo-meta` skill. |
| **v1.5 Requirement** | Next.js: `app/og/route.tsx` or `app/[slug]/opengraph-image.tsx` using `ImageResponse` from `next/og` (bundled with Next.js, no separate install needed). Templates should use Design DNA tokens (brand colors, display font). Astro: build-time OG image generation using `@astrojs/og` or `satori` directly. React/Vite: pre-rendered OG images or Vercel OG endpoint. Every template must produce 1200x630px PNG. |
| **Confidence** | HIGH -- verified against Next.js official documentation (updated January 2026) |

### TS-4: JSON-LD Structured Data (Core Types)

| Aspect | Detail |
|--------|--------|
| **What** | Schema.org structured data via JSON-LD `<script>` tags. Core types every premium site needs: `Organization` (site-wide), `WebSite` (with `SearchAction` for sitelinks search box), `WebPage` (per page), `BreadcrumbList` (navigation hierarchy), `Article` (blog/news), `FAQPage` (FAQ sections), `Product` (pricing/offerings), `LocalBusiness` (if applicable). |
| **Why Expected** | Google uses structured data for rich results (FAQ dropdowns, breadcrumb trails, sitelinks search box, article cards). Without JSON-LD, the site gets plain blue links instead of rich snippets. Pages with structured data achieve 30-40% higher click-through rates. |
| **Complexity** | Medium |
| **Current Skill Status** | EXISTS in `seo-meta` with Article, FAQ, BreadcrumbList, and Product schemas. Good `JsonLd` component pattern. Missing: Organization, WebSite, WebPage, HowTo, Event, Review/AggregateRating. No guidance on combining multiple schema types per page. |
| **v1.5 Requirement** | Complete schema coverage for premium site types. Organization + WebSite schemas in root layout (site-wide). Per-page WebPage schema. BreadcrumbList auto-generated from route structure. Article schema for blog posts with author, publisher, dates. FAQ schema for Q&A sections. Product schema for pricing pages. Validation guidance (Rich Results Test, Schema Markup Validator). Multiple schemas per page documented (Article + BreadcrumbList + Organization is valid and recommended). |
| **Confidence** | HIGH -- schema.org types verified against official spec |

### TS-5: XML Sitemap Generation

| Aspect | Detail |
|--------|--------|
| **What** | Auto-generated XML sitemap(s) listing all indexable URLs with `<lastmod>`, `<changefreq>`, and `<priority>` attributes. Sitemap index for sites with multiple sitemaps. Must pass Google Search Console and Bing Webmaster Tools validation. |
| **Why Expected** | Search engines discover pages through sitemaps. Without a sitemap, deep pages may never be indexed. Google Search Console shows sitemap submission status -- a missing or broken sitemap signals an unprofessional setup. |
| **Complexity** | Low-Medium |
| **Current Skill Status** | EXISTS in `seo-meta` with basic Next.js `app/sitemap.ts` pattern. Missing: `generateSitemaps` for large sites (50k+ URLs), sitemap index pattern, Astro `@astrojs/sitemap` integration, validation requirements, dynamic sitemap for CMS content. |
| **v1.5 Requirement** | Framework-specific complete implementation. **Next.js:** `app/sitemap.ts` with `MetadataRoute.Sitemap` for simple sites. `generateSitemaps` function for large sites that auto-splits into `/sitemap/[id].xml` files. Route handler (`app/sitemap.xml/route.ts`) for custom XML when needed. **Astro:** `@astrojs/sitemap` integration with `npx astro add sitemap`. Custom entries via `customPages` config. **Technical requirements:** UTF-8 encoding, absolute canonical URLs, entity escaping (`& ' " < >`), max 50MB/50k URLs per file, sitemap index for multi-sitemap sites. Sitemaps referenced in same or deeper directory than index. |
| **Confidence** | HIGH -- verified against Google Search Central official documentation |

### TS-6: robots.txt Configuration

| Aspect | Detail |
|--------|--------|
| **What** | Framework-native `robots.txt` generation with proper directives: `User-agent`, `Allow`, `Disallow`, `Sitemap` reference. Includes AI crawler management for GPTBot, ClaudeBot, OAI-SearchBot, Google-Extended, PerplexityBot. |
| **Why Expected** | Without robots.txt, search engines may index admin pages, API routes, and internal tooling. With AI crawlers now representing ~21% of user-agent rules on top 1000 sites, managing AI bot access is a table-stakes decision for any professional site. |
| **Complexity** | Low |
| **Current Skill Status** | EXISTS in `seo-meta` with basic Next.js `app/robots.ts` pattern. Has GPTBot and Google-Extended rules. Missing: comprehensive AI bot list, nuanced allow/block strategy (allow search bots, block training bots), Astro equivalent, Cloudflare AI bot blocking context. |
| **v1.5 Requirement** | Complete robots.txt with AI-era awareness. **Default strategy:** Allow all search engine bots. Allow AI search bots (`OAI-SearchBot`, `ChatGPT-User`). Block AI training bots (`GPTBot`, `Google-Extended`, `CCBot`, `anthropic-ai`). Allow Bing/Yandex crawlers (they power IndexNow). Disallow `/api/`, `/admin/`, `/_next/`, `/dashboard/`. Reference sitemap URL. **Framework patterns:** Next.js `app/robots.ts` returning `MetadataRoute.Robots`. Astro `public/robots.txt` static file or dynamic via endpoint. **AI crawler taxonomy** (which bot does what): GPTBot = OpenAI training, OAI-SearchBot = ChatGPT search results, Google-Extended = Gemini training, ClaudeBot = Anthropic use, PerplexityBot = Perplexity search indexing. |
| **Confidence** | HIGH -- verified against multiple 2025-2026 analyses of AI crawler ecosystem |

### TS-7: Core Web Vitals Compliance (SEO Impact)

| Aspect | Detail |
|--------|--------|
| **What** | Meeting Google's Core Web Vitals thresholds: LCP < 2.5s, INP < 200ms, CLS < 0.1. These are confirmed Google ranking signals accounting for ~10-15% of ranking weight. Sites passing all three see 8-15% visibility boost and 24% lower bounce rates. |
| **Why Expected** | Core Web Vitals are a direct SEO ranking factor. A beautifully designed site that scores poorly on CWV will be outranked by a mediocre site that loads fast. Premium agencies ship sites that score well on BOTH design quality AND performance. INP is the most commonly failed metric in 2026 (43% of sites fail). |
| **Complexity** | High (intersects with performance skill) |
| **Current Skill Status** | EXISTS via `performance-patterns` skill. `seo-meta` does not mention CWV at all. The connection between performance and SEO ranking is undocumented. |
| **v1.5 Requirement** | SEO skill must explicitly connect CWV to search ranking. Document the thresholds (LCP < 2.5s, INP < 200ms, CLS < 0.1) and what causes failures. INP failures: heavy JS event handlers, unoptimized React re-renders, long tasks blocking main thread. LCP failures: unoptimized hero images, render-blocking CSS/fonts, slow TTFB. CLS failures: images without dimensions, dynamically injected content, font swap causing layout shift. Link to `performance-patterns` skill for implementation details. |
| **Confidence** | HIGH -- thresholds verified against Google Search Central and web.dev |

### TS-8: Canonical URL Strategy

| Aspect | Detail |
|--------|--------|
| **What** | Every page declares its canonical URL via `<link rel="canonical">`. Prevents duplicate content from URL parameters, trailing slashes, www/non-www variants, HTTP/HTTPS, and paginated content. Self-referencing canonicals on every page. |
| **Why Expected** | Duplicate content dilutes SEO authority across multiple URLs. Without canonicals, Google may pick the "wrong" version of a page as the primary. Premium sites with proper canonicals consolidate all ranking signals to a single URL. |
| **Complexity** | Low |
| **Current Skill Status** | EXISTS in `seo-meta` with `alternates.canonical` pattern. Anti-pattern for hardcoded canonicals documented. Missing: trailing slash normalization strategy, www/non-www guidance, pagination canonical patterns, canonical + hreflang interaction rules. |
| **v1.5 Requirement** | Canonical URLs always generated from route, never hardcoded. Trailing slash strategy must be consistent (Next.js `trailingSlash` config, Astro `trailingSlash` config). Canonical must point to the exact URL that will be indexed (match protocol, domain, trailing slash). For paginated content: page 1 canonical = base URL (no `?page=1`), subsequent pages self-canonical. When hreflang is used: each language version's canonical points to itself, not the primary language. |
| **Confidence** | HIGH -- verified against Google Search Central |

---

## Differentiators

Features that would make Genorah's SEO/GEO skills meaningfully better than what other AI tools produce. Not expected but create competitive advantage.

---

### D-1: Generative Engine Optimization (GEO) Content Structuring

| Aspect | Detail |
|--------|--------|
| **What** | Content structuring patterns that make sites surface in AI-generated answers from ChatGPT, Perplexity, Google AI Overviews, and Bing Copilot. Includes: BLUF (Bottom Line Up Front) formatting, semantic chunking with descriptive headings, quotable statistics with citations, FAQ sections with schema markup, authoritative tone with cited claims, clear hierarchical structure for machine extraction. |
| **Why Differentiator** | GEO is a $886M market in 2025 projected to reach $7B by 2031 at 34% CAGR. No other AI code generation tool has GEO awareness. v0 and Cursor produce pages that look good but are invisible to AI search. 97% of AI Overview citations come from pages already ranking in top 20 organic -- so traditional SEO is the prerequisite, but GEO-optimized content structure is the differentiator that gets you CITED, not just ranked. |
| **Complexity** | Medium |
| **Current Skill Status** | MINIMAL. `seo-meta` mentions "AI search optimization" with FAQ/HowTo schemas and "structured headings, quotable snippets" but provides no concrete patterns, no content structuring guidance, no connection to the emotional arc system. |
| **v1.5 Requirement** | A dedicated GEO layer covering: (a) **Content structure patterns** -- BLUF format (answer first, then detail), semantic chunking (each section answers one question), descriptive H2/H3 headings that match likely search queries; (b) **Citation-ready content** -- statistics with sources, direct quotes, verifiable claims; (c) **FAQ schema integration** -- FAQPage structured data has one of the highest AI citation rates; (d) **Speakable schema** -- marks content sections suitable for voice assistant extraction; (e) **Content freshness signals** -- `datePublished`, `dateModified` in JSON-LD, visible "Last updated" dates; (f) **Entity clarity** -- Organization schema with `sameAs` links to authoritative profiles (LinkedIn, Wikipedia, Crunchbase) to establish entity authority; (g) **Connection to Emotional Arc** -- each beat type gets GEO guidance (Hook sections should have BLUF summary, Proof sections should have statistics, FAQ sections should use FAQPage schema). |
| **Confidence** | HIGH -- verified against Princeton GEO research, multiple 2025-2026 GEO guides, and SEL reporting |

### D-2: IndexNow Protocol Integration

| Aspect | Detail |
|--------|--------|
| **What** | Implementation of the IndexNow protocol for instant search engine notification when content changes. Covers: API key generation, verification file hosting, single-URL submission (GET), batch submission (POST, up to 10,000 URLs), response code handling, and framework-specific integration. |
| **Why Differentiator** | IndexNow gets content indexed in minutes instead of days/weeks. While Google does NOT support IndexNow (as of 2026), Bing, Yandex, Naver, Seznam.cz, and Yep do. For sites targeting international audiences (especially those using Bing-powered search), IndexNow is a meaningful advantage. Astro has a first-party `astro-indexnow` integration. No AI code tool generates IndexNow implementations. |
| **Complexity** | Medium |
| **Current Skill Status** | MENTIONED in `seo-meta` description/triggers but NO implementation patterns exist. Zero code examples. Zero protocol documentation. |
| **v1.5 Requirement** | Complete IndexNow implementation guide: (a) **Key generation** -- 8-128 character hex key via `openssl rand -hex 16` or similar; (b) **Verification** -- host `{key}.txt` at site root containing the key string, accessible at `https://domain.com/{key}.txt`; (c) **Single URL submission** -- GET to `https://api.indexnow.org/indexnow?url={url}&key={key}`; (d) **Batch submission** -- POST to `https://api.indexnow.org/indexnow` with JSON body: `{ host, key, keyLocation, urlList }`, Content-Type: `application/json; charset=utf-8`, max 10,000 URLs per request; (e) **Response codes** -- 200 (success), 400 (bad request), 403 (invalid key), 422 (URL/host mismatch), 429 (too many requests); (f) **Framework patterns** -- Next.js: API route handler for on-demand submission, post-deploy webhook. Astro: `astro-indexnow` integration (auto-submits all built pages). React/Vite: build-time script or CI/CD step; (g) **Key rotation security** -- generate new key, update verification file, update env vars, wait 24-48h before deleting old file; (h) **Important caveat** -- Google does NOT support IndexNow. Use sitemap submission + Google Search Console URL Inspection for Google indexing. IndexNow covers Bing and other engines. Use both strategies together. |
| **Confidence** | HIGH -- verified against indexnow.org official documentation |

### D-3: Intelligent robots.txt with AI Bot Taxonomy

| Aspect | Detail |
|--------|--------|
| **What** | A nuanced robots.txt strategy that distinguishes between beneficial AI crawlers (search bots that drive traffic) and non-beneficial ones (training scrapers that extract value). Includes a complete taxonomy of current AI bots, their purposes, and recommended allow/block decisions. |
| **Why Differentiator** | Most sites either block all AI bots (losing AI search visibility) or allow all (giving away training data). A premium site should selectively allow bots that BRING traffic (search result generation) while blocking those that TAKE content (model training). No AI tool provides this nuanced guidance. The taxonomy changes rapidly -- having current knowledge is valuable. |
| **Complexity** | Low |
| **Current Skill Status** | MINIMAL. `seo-meta` has GPTBot and Google-Extended in robots.ts example but no explanation of WHY or WHAT each bot does. No taxonomy. |
| **v1.5 Requirement** | Complete AI bot taxonomy: **Allow (search-beneficial):** `Googlebot` (Google search), `Bingbot` (Bing search), `OAI-SearchBot` (ChatGPT search results), `ChatGPT-User` (ChatGPT browsing), `PerplexityBot` (Perplexity search -- controversial, consider blocking). **Block (training-only):** `GPTBot` (OpenAI model training), `Google-Extended` (Gemini/Bard training), `CCBot` (Common Crawl, used by many AI companies), `anthropic-ai` (Anthropic training), `Bytespider` (TikTok/ByteDance), `Amazonbot` (Amazon AI), `FacebookBot` (Meta AI). **Decision framework:** If the site WANTS to appear in AI-generated search results, allow search bots. If the site wants to PREVENT content being used for training, block training bots. Note: PerplexityBot has been accused of ignoring robots.txt -- Cloudflare blocks it by default since July 2025. |
| **Confidence** | HIGH -- verified against multiple 2025-2026 AI crawler analyses |

### D-4: llms.txt for AI Discoverability

| Aspect | Detail |
|--------|--------|
| **What** | The `llms.txt` convention -- a markdown file at the site root that provides LLMs with a simplified, structured overview of the site's content. Proposed by Jeremy Howard (September 2024). Also `llms-full.txt` for comprehensive content. |
| **Why Differentiator** | Emerging standard adopted by Anthropic, Cloudflare, Stripe, and 844k+ sites. While adoption is early (2.13% of sites) and major AI engines don't yet actively crawl it (Google, OpenAI, Perplexity bots showed zero visits in one study), implementing it positions premium sites ahead of the curve. If the convention gains traction, early adopters benefit first. Low cost to implement. |
| **Complexity** | Low |
| **Current Skill Status** | NOT covered at all. |
| **v1.5 Requirement** | Document the `llms.txt` convention with honest assessment: (a) **Format** -- markdown file at `/llms.txt` with site title, brief description, sections with links to key pages, and structured content summaries; (b) **llms-full.txt** -- comprehensive version with full page content in markdown; (c) **Implementation** -- static file in `public/` directory for all frameworks; (d) **Honest caveat** -- as of early 2026, no major AI crawler actively uses llms.txt. Google explicitly does not use it. No confirmed impact on AI search visibility. Include it as a low-cost, forward-looking investment, not a critical SEO feature; (e) **Template** -- provide a template that pulls from the site's content structure and Design DNA brand info. |
| **Confidence** | MEDIUM -- convention is real and adopted by notable companies, but actual impact on AI search visibility is unverified |

### D-5: International SEO (hreflang + Locale Canonicals)

| Aspect | Detail |
|--------|--------|
| **What** | `hreflang` alternate link tags for multi-language sites. Self-referencing hreflang on every language version. `x-default` fallback for unmatched locales. Hreflang implementation via HTML `<link>` tags, HTTP headers, or XML sitemap. Canonical URLs that point to each language's own version (not the primary language). |
| **Why Expected for premium multi-language sites** | Incorrect hreflang causes Google to show the wrong language version in search results. Missing `x-default` means users with non-supported locales get random language versions. These are common mistakes that premium agencies avoid. |
| **Complexity** | Medium |
| **Current Skill Status** | `seo-meta` mentions `i18n-rtl` skill for hreflang but provides no implementation. The cross-skill boundary means neither skill fully covers hreflang. |
| **v1.5 Requirement** | Complete hreflang implementation: (a) Every language version links to ALL other versions AND itself; (b) `x-default` points to the default/fallback page; (c) Canonical on each version points to itself, not the primary language; (d) Never point hreflang to non-canonical URLs; (e) For Next.js: `alternates.languages` in metadata. For Astro: `<link rel="alternate">` in layout head. For sitemaps: `<xhtml:link>` elements within `<url>` entries; (f) Audit guidance: check for missing return links, canonical/hreflang conflicts, and orphaned language versions. |
| **Confidence** | HIGH -- verified against Google Search Central and Backlinko implementation guide |

### D-6: Sitemap Index Pattern for Large Sites

| Aspect | Detail |
|--------|--------|
| **What** | Sitemap index files that reference multiple child sitemaps, enabling sites with >50,000 URLs to have complete sitemap coverage. Includes auto-splitting by content type (blog, products, pages) or by volume (50k URL batches). |
| **Why Differentiator** | Most AI tools generate a single flat sitemap. Premium sites with CMS-driven content (blog posts, product pages) quickly exceed the 50k URL / 50MB limit. A proper sitemap index with typed child sitemaps (`sitemap-blog.xml`, `sitemap-products.xml`, `sitemap-pages.xml`) passes GSC validation and enables granular indexing monitoring. |
| **Complexity** | Medium |
| **Current Skill Status** | MENTIONED in `seo-meta` decision tree ("Large site 50k+ URLs? Use sitemap index") but NO implementation pattern exists. |
| **v1.5 Requirement** | Complete sitemap index patterns: (a) **Next.js `generateSitemaps`** -- export function returns `[{ id: 0 }, { id: 1 }, ...]`, generates `/sitemap/[id].xml` files. Next.js auto-creates the sitemap index; (b) **Custom sitemap index** -- route handler at `app/sitemap.xml/route.ts` returning XML with `<sitemapindex>` containing `<sitemap>` entries; (c) **Astro** -- `@astrojs/sitemap` auto-generates sitemap index when URLs exceed threshold; (d) **Validation rules** -- child sitemaps must be in same directory or deeper than index file, all URLs absolute, UTF-8 encoded, entity-escaped; (e) **Content type splitting** -- separate sitemaps for blog posts, products, and static pages enables independent monitoring in GSC. |
| **Confidence** | HIGH -- verified against Google Search Central sitemap index documentation |

### D-7: CRM Form Integration Patterns (HubSpot, Salesforce, Generic)

| Aspect | Detail |
|--------|--------|
| **What** | Patterns for connecting premium website contact/lead forms to CRM systems. Three tiers: (1) HubSpot Forms API -- submit to `https://api.hsforms.com/submissions/v3/integration/submit/:portalId/:formGuid` (still uses v2 submission endpoint despite v3 management API). (2) Salesforce Web-to-Lead -- POST to `https://www.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8` with `oid` identifier. (3) Generic webhook pattern -- POST form data to any endpoint (Zapier, Make, n8n, custom API). |
| **Why Differentiator** | Premium sites generate leads. A beautifully designed contact form that dumps submissions into the void is a wasted opportunity. Table stakes for any business site is CRM connectivity. But most AI tools generate forms with no backend -- the form looks good but submitting it does nothing. Genorah teaching builders how to wire forms to real CRMs creates immediately useful output. |
| **Complexity** | Medium |
| **Current Skill Status** | NOT covered. This is explicitly called out in the existing FEATURES.md under anti-feature AF-4 ("Backend / Database / Auth Integration"). However, CRM form submission is NOT backend logic -- it's a frontend HTTP POST to an external API. This is the same category as analytics integration -- a thin client-side or serverless bridge. |
| **v1.5 Requirement** | Three integration patterns: (a) **Server-side proxy (recommended)** -- Next.js API route / Astro server endpoint that receives form data, validates it, and forwards to CRM. Keeps API keys server-side. Pattern: form POST -> `/api/contact` -> validate -> CRM API -> respond; (b) **Client-side direct (HubSpot only)** -- HubSpot's forms endpoint accepts CORS requests. Client can POST directly to `api.hsforms.com` without a proxy. Simpler but limited to HubSpot; (c) **Webhook relay** -- POST to Zapier/Make webhook URL that routes to any CRM. Zero CRM-specific code. Most flexible; (d) **Key patterns:** Rate limiting (HubSpot: 100 requests per 10 seconds), error handling (what to show user on CRM failure -- never lose the lead, queue locally), honeypot spam prevention, success/error UI states, GDPR consent checkbox. **Salesforce-specific:** Web-to-Lead has a 500/day limit. REST API (`/services/data/vXX/sobjects/Lead`) has no limit but requires OAuth. Recommend Web-to-Lead for simple sites, REST API for high-volume. |
| **Confidence** | HIGH for HubSpot (verified against HubSpot developer docs). HIGH for Salesforce Web-to-Lead (verified against Salesforce docs). MEDIUM for generic webhook patterns (based on established industry patterns). |

### D-8: GEO-Optimized Schema Markup Beyond Basics

| Aspect | Detail |
|--------|--------|
| **What** | Advanced schema.org types that specifically boost AI search visibility: `HowTo` (step-by-step processes AI can cite), `Speakable` (content suitable for voice assistant extraction), `ClaimReview` (fact-checking AI can reference), nested `@graph` patterns for complex entity relationships, `sameAs` for entity disambiguation. |
| **Why Differentiator** | Basic schema (Article, FAQ) is table stakes. Advanced schema types give AI engines MORE structured signals to work with. Pages with structured lists, quotes, and statistics have 30-40% higher visibility in AI responses. Speakable schema is especially forward-looking for voice AI assistants. |
| **Complexity** | Medium-High |
| **Current Skill Status** | NOT covered beyond basic Article/FAQ/BreadcrumbList/Product. |
| **v1.5 Requirement** | (a) **HowTo schema** for process/tutorial content -- AI engines frequently cite step-by-step content; (b) **Speakable schema** identifying content sections suitable for text-to-speech extraction -- forward-looking for voice search; (c) **@graph pattern** for combining multiple schema types in a single JSON-LD block (Organization + WebSite + WebPage + BreadcrumbList as a graph); (d) **sameAs links** connecting Organization entity to LinkedIn, Crunchbase, Wikipedia, social profiles -- strengthens entity authority for AI citation; (e) **Review/AggregateRating** for testimonial sections -- star ratings in search results; (f) **Event schema** for event-driven sites; (g) **VideoObject** for video-heavy pages; (h) **Per-page-type schema recipes** -- landing page gets Organization+WebSite+WebPage, blog post gets Article+BreadcrumbList+Speakable, pricing page gets Product+AggregateRating, FAQ page gets FAQPage+WebPage. |
| **Confidence** | MEDIUM-HIGH -- schema types verified against schema.org spec, GEO impact verified against multiple research studies |

### D-9: Content Freshness & Indexing Velocity Strategy

| Aspect | Detail |
|--------|--------|
| **What** | A unified strategy combining sitemap submission, IndexNow, Google Search Console URL Inspection API, and content freshness signals to maximize indexing speed across all search engines. |
| **Why Differentiator** | Different search engines have different optimal submission methods. Google: sitemap + URL Inspection API (does NOT support IndexNow). Bing: IndexNow + sitemap. Others: IndexNow. A comprehensive strategy covers all engines. No AI tool provides this unified view. |
| **Complexity** | Medium |
| **Current Skill Status** | NOT covered as a unified strategy. |
| **v1.5 Requirement** | (a) **Publish workflow:** When new content is published -> update sitemap `<lastmod>` -> submit to IndexNow (for Bing/Yandex) -> ping Google via Search Console (for Google); (b) **Content freshness signals:** `datePublished` + `dateModified` in JSON-LD, visible "Last updated" dates on articles, `<lastmod>` in sitemap matching actual content changes (not deploy date); (c) **Framework integration:** Next.js ISR/revalidation triggers IndexNow submission. Astro build pipeline includes IndexNow post-build step. CI/CD webhook for GSC notification; (d) **Google Indexing API caveat** -- limited to `JobPosting` and `BroadcastEvent` schema types only. NOT usable for general content. Use sitemap + URL Inspection instead; (e) **Monitoring:** GSC Coverage report, Bing Webmaster Tools indexing status, IndexNow submission logs. |
| **Confidence** | HIGH -- verified against Google, Bing, and IndexNow official documentation |

### D-10: SEO-Aware Emotional Arc Integration

| Aspect | Detail |
|--------|--------|
| **What** | Connecting Genorah's Emotional Arc system to SEO/GEO requirements. Each beat type gets SEO guidance: Hook sections need H1 with primary keyword, Proof sections need statistics with schema markup, FAQ sections need FAQPage JSON-LD, Close sections need clear CTA with conversion tracking. |
| **Why Differentiator** | This is uniquely Genorah. No other tool combines emotional storytelling with SEO optimization. The emotional arc determines page structure, and SEO requirements should inform how each beat is implemented -- not as an afterthought but as a structural integration. |
| **Complexity** | Medium |
| **Current Skill Status** | NOT connected. Emotional arc and SEO are separate concerns in the current skill system. |
| **v1.5 Requirement** | Per-beat-type SEO guidance: (a) **Hook** -- H1 tag with primary keyword, meta description source text, above-the-fold LCP optimization; (b) **Build** -- H2 subheadings with secondary keywords, semantic chunking for AI extraction; (c) **Proof** -- statistics in structured format, testimonial schema (Review), case study with cited metrics; (d) **Peak** -- visual content with alt text, video with VideoObject schema; (e) **Breathe** -- whitespace is SEO-neutral, use for internal linking; (f) **Tension** -- FAQ sections with FAQPage schema, quotable statements for AI citation; (g) **Close** -- CTA section, conversion-focused with clear next action; (h) **Cross-beat:** BreadcrumbList covers page hierarchy, Organization covers publisher identity, canonical covers page identity. |
| **Confidence** | MEDIUM -- the integration concept is sound and Genorah-specific, individual SEO elements verified against official docs |

---

## Anti-Features

Features to explicitly NOT build in v1.5. Common mistakes in the SEO/API integration domain.

---

### AF-1: SEO Score Calculator / Dashboard

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Building an in-plugin "SEO score" that rates pages on a 0-100 scale | SEO scoring is complex, subjective, and constantly changing. Building a custom scorer duplicates what Google Search Console, Lighthouse, and Ahrefs already do better. It would also require maintaining scoring weights as Google algorithm changes. An incorrect score gives false confidence. | Provide structural guidance (correct meta tags, proper schema, valid sitemap) and point users to authoritative tools for scoring: Lighthouse for performance, Rich Results Test for structured data, GSC for indexing status. The skill should make it EASY to do SEO right, not score how well you did it. |

### AF-2: Keyword Research / Content Strategy Engine

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Building keyword research, search volume analysis, or content strategy into the plugin | Keyword research requires access to SEO APIs (Ahrefs, SEMrush, Google Keyword Planner) that cost money and change frequently. This is an SEO strategist's job, not a design plugin's job. Adding keyword research would bloat the plugin into an SEO tool. | Accept keywords as input (the user or their SEO strategist provides target keywords) and teach builders how to place them correctly: H1 for primary keyword, H2s for secondary keywords, meta description including the keyword naturally, alt text on images. The plugin optimizes keyword PLACEMENT, not keyword SELECTION. |

### AF-3: Google Analytics / Tag Manager Integration

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Including Google Analytics, GTM, PostHog, or any analytics implementation | Analytics code is boilerplate, framework-specific, and constantly changing (GA4 replaced Universal Analytics, GTM has its own versioning). Including it adds zero design quality. The existing v1.0 FEATURES.md already flagged this as anti-feature AF-9. | Provide a clean `<head>` structure that makes adding analytics trivial. Document WHERE analytics scripts go (Next.js: `app/layout.tsx` head, Astro: layout head) but don't implement them. |

### AF-4: Full CRM Backend Integration

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Building deep CRM integration (syncing contacts, managing deals, triggering workflows, reading CRM data) | Deep CRM integration is backend infrastructure. It requires OAuth flows, webhook receivers, database for sync state, error recovery queues. This is weeks of backend work that has nothing to do with frontend design. | Provide thin form-submission patterns only (D-7). The pattern is: form data -> API route -> CRM endpoint. One-way push. No read-back, no sync, no webhooks. If users need deep CRM integration, tools like Zapier, Make, or custom middleware handle it. |

### AF-5: Automated Link Building / Outreach

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Any link building, backlink analysis, or outreach automation | Link building is an ongoing marketing activity, not a code generation concern. It requires human relationships, content marketing strategy, and months of effort. No code plugin can automate this. | Focus on making the site's content LINK-WORTHY through quality structured data, quotable statistics, and clear authoritative content (GEO patterns). A well-structured site with authoritative content naturally attracts links. |

### AF-6: Search Console API Integration

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Programmatic interaction with Google Search Console API (submitting URLs, reading performance data, checking indexing status) | GSC API requires Google Cloud credentials, OAuth consent screen, service account setup. This is infrastructure that varies per organization. The Indexing API is limited to JobPosting and BroadcastEvent types only -- not usable for general content. | Document how to manually submit sitemaps in GSC, how to use URL Inspection for individual pages, and how IndexNow covers Bing. For Google-specific programmatic indexing, point users to the official GSC documentation. |

### AF-7: AI Content Generation for SEO

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Generating SEO-optimized blog posts, landing page copy, or meta descriptions via AI | Genorah's Copy Intelligence system (D-2 in v1.0 features) handles copy generation with brand voice. Adding a separate "SEO copy generator" would create conflicting guidance. Also, Google has explicitly stated that AI-generated content is fine IF it's high quality, but churning out SEO-optimized content is a spam signal. | The GEO content structuring patterns (D-1) teach builders HOW to structure content for AI search visibility. The copy intelligence system generates brand-voice copy. The SEO skill ensures that copy is properly tagged with meta tags and schema. These three work together -- no separate SEO content generator needed. |

---

## Feature Dependencies

```
Foundation Layer (must exist first):
  TS-1 (Meta Tags) ─────────────────────────────────┐
       |                                              |
       v                                              v
  TS-2 (Open Graph)     TS-4 (JSON-LD Core)    TS-8 (Canonicals)
       |                      |                       |
       v                      v                       v
  TS-3 (Dynamic OG)    D-1 (GEO Content)       D-5 (hreflang)
                              |
                              v
                        D-8 (Advanced Schema)
                              |
                              v
                        D-10 (SEO + Emotional Arc)

Crawlability Layer (can be built in parallel with Foundation):
  TS-5 (Sitemap) ───────> D-6 (Sitemap Index)
  TS-6 (robots.txt) ────> D-3 (AI Bot Taxonomy)
  D-2 (IndexNow) ───────> D-9 (Unified Indexing Strategy)
  D-4 (llms.txt)         (independent, no deps)

Performance Layer (parallel):
  TS-7 (Core Web Vitals) -- connects to existing performance-patterns skill

Integration Layer (after Foundation):
  D-7 (CRM Forms) -- independent, builds on form UI patterns
```

---

## MVP Recommendation

For v1.5, prioritize features that replace the shallow `seo-meta` skill with comprehensive, framework-aware SEO knowledge.

### Phase 1: Foundation (Core SEO Skill)
Addresses the most critical gaps. Every premium site needs these.

1. **TS-1: Meta Tag Architecture** -- foundational, everything references it
2. **TS-2: Open Graph & Social Sharing** -- immediate visual impact (rich previews)
3. **TS-4: JSON-LD Core Types** -- rich search results, GEO prerequisite
4. **TS-5: Sitemap Generation** -- search engine discovery
5. **TS-6: robots.txt Configuration** -- crawl control including AI bots
6. **TS-8: Canonical URLs** -- duplicate content prevention
7. **TS-7: Core Web Vitals (SEO connection)** -- ranking factor awareness

### Phase 2: GEO & Advanced SEO
Makes Genorah's output AI-search-visible. This is the differentiator.

8. **D-1: GEO Content Structuring** -- the biggest differentiator
9. **D-2: IndexNow Protocol** -- instant indexing for Bing ecosystem
10. **D-3: AI Bot Taxonomy** -- nuanced AI crawler management
11. **D-8: Advanced Schema Markup** -- deeper structured data for AI
12. **D-10: SEO + Emotional Arc Integration** -- uniquely Genorah

### Phase 3: Integration & Polish
External system connectivity and edge cases.

13. **TS-3: Dynamic OG Images** -- per-page social previews
14. **D-7: CRM Form Integration** -- lead capture connectivity
15. **D-4: llms.txt** -- forward-looking AI discoverability
16. **D-5: hreflang** -- i18n SEO (only for multi-language sites)
17. **D-6: Sitemap Index** -- only for large sites (50k+ URLs)
18. **D-9: Unified Indexing Strategy** -- ties everything together

### Defer to Later:
- AF-1 through AF-7: all anti-features listed above

---

## Framework-Specific Implementation Matrix

| Feature | Next.js 16 (App Router) | Astro 5/6 | React/Vite |
|---------|------------------------|-----------|------------|
| Meta tags | `metadata` export / `generateMetadata` | `<head>` in layouts, props from page | `react-helmet-async` |
| Open Graph | Part of `metadata` object | Manual `<meta>` in head | `react-helmet-async` |
| Dynamic OG | `next/og` `ImageResponse` (bundled) | `satori` at build time | Vercel OG endpoint or build script |
| JSON-LD | `<script>` in page component | `<script set:html>` in layout | `<script>` in component |
| Sitemap | `app/sitemap.ts` + `generateSitemaps` | `@astrojs/sitemap` integration | `vite-plugin-sitemap` or build script |
| robots.txt | `app/robots.ts` returning `MetadataRoute.Robots` | `public/robots.txt` static or API endpoint | `public/robots.txt` static |
| IndexNow | API route handler + post-deploy webhook | `astro-indexnow` integration | Build script + CI/CD step |
| Canonical | `alternates.canonical` in metadata | `<link rel="canonical">` in head | `react-helmet-async` |
| hreflang | `alternates.languages` in metadata | `<link rel="alternate">` in head | `react-helmet-async` |
| CRM forms | API route as proxy | Server endpoint as proxy | Direct client POST or serverless function |

---

## Sources

| Source | Type | Confidence | URL |
|--------|------|-----------|-----|
| Google Search Central: Build and Submit a Sitemap | Official docs | HIGH | https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap |
| Google Search Central: Sitemap Index Files | Official docs | HIGH | https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps |
| Google Search Central: Core Web Vitals | Official docs | HIGH | https://developers.google.com/search/docs/appearance/core-web-vitals |
| Next.js: generateMetadata | Official docs | HIGH | https://nextjs.org/docs/app/api-reference/functions/generate-metadata |
| Next.js: JSON-LD Guide | Official docs | HIGH | https://nextjs.org/docs/app/guides/json-ld |
| Next.js: ImageResponse | Official docs | HIGH | https://nextjs.org/docs/app/api-reference/functions/image-response |
| Next.js: generateSitemaps | Official docs | HIGH | https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps |
| Next.js: Metadata and OG Images | Official docs | HIGH | https://nextjs.org/docs/app/getting-started/metadata-and-og-images |
| IndexNow.org Documentation | Official docs | HIGH | https://www.indexnow.org/documentation |
| IndexNow.org FAQ | Official docs | HIGH | https://www.indexnow.org/faq |
| Astro: @astrojs/sitemap | Official docs | HIGH | https://docs.astro.build/en/guides/integrations-guide/sitemap/ |
| Astro: Content Collections | Official docs | HIGH | https://docs.astro.build/en/guides/content-collections/ |
| HubSpot Developer Docs: Forms API | Official docs | HIGH | https://developers.hubspot.com/docs/api-reference/marketing-forms-v3/guide |
| Schema.org: BreadcrumbList | Official spec | HIGH | https://schema.org/BreadcrumbList |
| Schema.org: Organization | Official spec | HIGH | https://schema.org/Organization |
| Search Engine Land: Mastering GEO in 2026 | Industry analysis | MEDIUM | https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142 |
| Search Engine Land: What is GEO? | Industry analysis | MEDIUM | https://searchengineland.com/what-is-generative-engine-optimization-geo-444418 |
| Strapi: GEO Complete Guide | Industry guide | MEDIUM | https://strapi.io/blog/generative-engine-optimization-geo-guide |
| RankHarvest: Structured Data for GEO | Industry guide | MEDIUM | https://rankharvest.com/structured-data-markup-for-geo/ |
| Frase.io: FAQ Schemas for AI Search | Industry analysis | MEDIUM | https://www.frase.io/blog/faq-schema-ai-search-geo-aeo |
| Paul Calvano: AI Bots and Robots.txt | Empirical research | MEDIUM | https://paulcalvano.com/2025-08-21-ai-bots-and-robots-txt/ |
| Bluehost: What Is llms.txt? | Industry guide | MEDIUM | https://www.bluehost.com/blog/what-is-llms-txt/ |
| Semrush: llms.txt | Industry guide | MEDIUM | https://www.semrush.com/blog/llms-txt/ |
| CrawlWP: IndexNow vs Google Indexing API vs Sitemaps | Comparison | MEDIUM | https://crawlwp.com/indexnow-vs-google-indexing-api-vs-sitemaps/ |
| NitroPack: Core Web Vitals Metrics 2026 | Industry analysis | MEDIUM | https://nitropack.io/blog/most-important-core-web-vitals-metrics/ |
| Context7 MCP Documentation | Official docs | HIGH | https://context7.com/docs/clients/claude-code |
| Context7 GitHub Repository | Official source | HIGH | https://github.com/upstash/context7 |

---

## Note on Context7 MCP Integration

Context7 MCP is a tooling concern, not a feature of the SEO/GEO skill itself. Context7 provides two tools:

1. **`resolve-library-id`** -- resolves a library name to a Context7-compatible ID
2. **`query-docs`** -- retrieves version-specific documentation for a library

**Relevance to v1.5:** Context7 can be used DURING skill authoring to verify current API documentation for Next.js metadata API, Astro sitemap integration, HubSpot Forms API, etc. It is not something the SEO skill itself needs to teach -- it's a tool the skill author uses to ensure accuracy.

**Integration point:** If Genorah's agents use Context7 for real-time API doc lookup during code generation, that's an agent-level capability, not a skill-level feature. The SEO skill should contain the verified patterns; agents can use Context7 to validate those patterns against current library versions.
