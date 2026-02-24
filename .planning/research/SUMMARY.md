# Project Research Summary

**Project:** Modulo 2.0 v1.5 Milestone -- SEO/GEO & API Integration
**Domain:** Search engine optimization, generative engine optimization, proactive indexing, external API integration for a Claude Code design plugin
**Researched:** 2026-02-25
**Confidence:** HIGH

## Executive Summary

The v1.5 milestone adds search engine visibility and AI search discoverability to Modulo 2.0. The central finding across all research dimensions is that the SEO/GEO stack is 95% framework-native -- unlike the v1.0 animation stack (GSAP, Motion, Three.js), this milestone requires essentially zero new runtime dependencies. Next.js provides `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`, and `next/og` out of the box. Astro provides `<head>` management and `@astrojs/sitemap`. React 19 introduces native metadata hoisting that eliminates the need for `react-helmet-async` (which is now unmaintained and incompatible with React 19). The only universally recommended addition is `schema-dts` -- TypeScript types for Schema.org, installed as a devDependency with zero runtime cost. This means v1.5 is a skill content milestone, not a library integration milestone.

The genuine differentiator for v1.5 is GEO -- Generative Engine Optimization. No other AI code generation tool (v0, Cursor, Bolt, etc.) has GEO awareness. With 50%+ of consumers using AI-powered search by late 2025, sites invisible to AI engines are increasingly invisible to users. The research shows that FAQ schema produces a 3.2x higher appearance rate in Google AI Overviews, making it the single highest-impact structured data type for AI search visibility. Content structuring patterns (BLUF formatting, question-based headings, quotable statistics with citations) improve visibility by 28-41%. Modulo can integrate these patterns directly into its Emotional Arc system -- each beat type gets GEO guidance, making the connection between storytelling and search visibility organic rather than bolted-on.

The primary risks are: (1) API key exposure through framework env prefixes (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`) -- this is the #1 security pitfall, exacerbated by CVE-2025-66478 in Next.js; (2) structured data drift where JSON-LD schemas claim content that no longer matches the visible page after iterations; (3) skill bloat from adding 5+ new skills when 1-2 well-structured skills would serve better; and (4) the critical distinction between AI training bots and AI search bots in robots.txt -- blocking all AI bots (a common copy-paste pattern) destroys AI search visibility. Each of these has a concrete prevention strategy documented in the research.

## Key Findings

### Recommended Stack

The SEO/GEO stack is almost entirely framework-native. The existing `seo-meta` skill's foundation is correct but incomplete -- it needs expansion, not replacement.

**Core technologies (zero new runtime dependencies):**
- **Next.js Metadata API** (`metadata` export / `generateMetadata`): Complete meta, OG, canonical, robots management -- replaces all third-party SEO libraries. `next-seo` and `next/head` are explicitly deprecated for App Router.
- **Next.js `next/og` ImageResponse**: Dynamic OG image generation from JSX via Satori/Resvg. Bundled with the framework. Produces 1200x630px PNG from Design DNA tokens.
- **Next.js `app/sitemap.ts` + `app/robots.ts`**: Native sitemap and robots.txt generation. `generateSitemaps()` for 50k+ URL splitting. No `next-sitemap` package needed.
- **Astro `<head>` + `@astrojs/sitemap` v3.7.0**: Native head management in layouts. Official sitemap integration with auto-generation, i18n support, and SSR workarounds.
- **React 19 native metadata hoisting**: `<title>`, `<meta>`, `<link>` tags auto-hoist to `<head>` from any component. Eliminates `react-helmet-async` dependency (unmaintained, React 19 incompatible).
- **`schema-dts` v1.1.5** (devDependency): TypeScript types for all Schema.org vocabulary. `WithContext<T>` utility type for JSON-LD. Zero runtime cost -- types stripped at compilation.
- **IndexNow API** (zero-dependency HTTP POST): Instant Bing/Yandex/Naver indexing. No library needed -- raw `fetch()` POST to `api.indexnow.org/IndexNow`.

**Explicitly NOT recommended:**
- `next-seo` -- Legacy, App Router has everything built in
- `react-helmet-async` / `react-helmet` -- Unmaintained, React 19 incompatible
- `next-sitemap` -- Last published 2+ years ago, migration trend toward built-in
- `react-schemaorg` -- Thin wrapper, unnecessary over raw `schema-dts`

**Critical version note:** Google does NOT support IndexNow (despite testing since 2021). IndexNow covers Bing, Yandex, Naver, Seznam.cz, and Yep only. For Google indexing, rely on sitemaps + Search Console.

### Expected Features

**Must have (table stakes) -- missing = invisible to search engines:**
- **TS-1: Complete Meta Tag Architecture** -- per-page title templates, meta description (120-160 chars), viewport, charset. Framework-native implementation for all targets.
- **TS-2: Open Graph & Social Sharing** -- og:title, og:description, og:image (1200x630px), og:url, og:type, twitter:card. Fallback chain: page-specific > section > site-wide default.
- **TS-4: JSON-LD Structured Data** -- Organization, WebSite, WebPage, BreadcrumbList, Article, FAQPage, Product. Typed via `schema-dts`. Per-page-type schema recipes.
- **TS-5: XML Sitemap Generation** -- Framework-native generators. Canonical URLs only. No `changeFrequency`/`priority` (Google/Bing ignore both). Accurate `lastmod` or omit entirely.
- **TS-6: robots.txt with AI Crawler Management** -- Search bots allowed, training bots blocked. Complete taxonomy of GPTBot, OAI-SearchBot, Google-Extended, ClaudeBot, PerplexityBot.
- **TS-7: Core Web Vitals SEO Connection** -- LCP < 2.5s, INP < 200ms, CLS < 0.1 as ranking signals. Link to existing `performance-patterns` skill.
- **TS-8: Canonical URL Strategy** -- Dynamic generation from route, never hardcoded. Trailing slash consistency. `metadataBase` mandatory for Next.js.

**Should have (differentiators) -- these make Modulo uniquely capable:**
- **D-1: GEO Content Structuring** -- BLUF formatting, question-based headings, quotable statistics, FAQ sections with schema. The single biggest competitive advantage. No other AI tool has this.
- **D-2: IndexNow Integration** -- Instant Bing/Yandex indexing on content publish. Next.js Route Handler + Astro build hook patterns.
- **D-3: AI Bot Taxonomy** -- Nuanced robots.txt distinguishing search bots (allow for visibility) from training bots (block to protect content).
- **D-7: CRM Form Integration** -- Server-side proxy to HubSpot Forms API, Salesforce Web-to-Lead, generic webhooks. Thin one-way push, not deep CRM backend.
- **D-8: Advanced Schema Markup** -- HowTo, Speakable, `@graph` patterns, `sameAs` entity linking. Forward-looking for AI citation.
- **D-10: SEO-Aware Emotional Arc** -- Per-beat-type SEO guidance: Hook = H1 + primary keyword, Proof = statistics + schema, Tension = FAQ + FAQPage schema. Uniquely Modulo.
- **TS-3: Dynamic OG Images** -- `next/og` ImageResponse with Design DNA tokens (brand colors, display font). Satori endpoint for Astro.

**Defer to v2+:**
- SEO score calculator/dashboard (use Lighthouse/GSC instead)
- Keyword research engine (accept keywords as input, optimize placement)
- Analytics/tracking integration (provide clean `<head>`, don't implement)
- Deep CRM backend (OAuth, sync, webhooks -- out of scope)
- Google Search Console API integration (requires Google Cloud infrastructure)
- AI content generation for SEO (Copy Intelligence handles brand voice)

### Architecture Approach

The architecture splits the existing `seo-meta` skill into 2-3 focused skills integrated at three pipeline touchpoints: content planning (GEO formatting during `/modulo:start-project`), section planning (schema assignments in PLAN.md during `/modulo:plan-dev`), and build execution (metadata, sitemaps, robots.txt, IndexNow in waves during `/modulo:execute`). SEO quality checks fold into existing gates as a supplementary checklist, not a separate quality layer.

**Major components:**

1. **`seo-meta` skill (rewrite, Core tier)** -- Promoted from Utility to Core. Per-page metadata, Open Graph, Twitter cards, canonical URLs, robots directives. Every public-facing project needs this loaded by default. 400-500 lines.

2. **`structured-data` skill (new, Domain tier)** -- JSON-LD schemas per page type, `schema-dts` typed patterns, GEO-optimized schemas (FAQ, HowTo, Speakable), `@graph` pattern for combining schemas. Loaded when project is public-facing web. 350-450 lines.

3. **`search-visibility` skill (new, Domain tier)** -- Sitemap generation, IndexNow integration, robots.txt AI bot rules, GEO content structuring, llms.txt, AI search optimization. Loaded for public web projects. 400-500 lines.

**Architecture tension -- 3-skill split vs consolidation:** The ARCHITECTURE.md research recommends 3 skills (concerns have different pipeline touchpoints). The PITFALLS.md research warns that 3+ new skills risk bloat (D6). The resolution: start with the 3-skill split for clean separation of concerns, but consolidate to 2 skills if any skill falls under 300 lines. The builder agent should embed the 5 most critical SEO rules directly in its spawn prompt (canonical URLs, JSON-LD sync, og:image required, sitemap validation, no client-side metadata in SPAs) so it never needs to read a skill just for those checks.

**Pipeline integration:**
- **Wave 0** generates: `sitemap.ts`, `robots.ts`, IndexNow route + verification file, `JsonLd` component, `llms.txt`
- **Wave 1** generates: Root layout metadata defaults, `metadataBase`, site-level JSON-LD (Organization, WebSite), default og:image
- **Wave 2+** generates: Per-page `generateMetadata`, per-page JSON-LD per PLAN.md schema assignment, per-page canonical URLs
- **Post-build** verifies: Sitemap XML validity, robots.txt correctness, metadata completeness, JSON-LD structural validation
- **Post-deploy** triggers: IndexNow submission for changed URLs

**Quality enforcement:** SEO checks are supplementary to the existing 35-point anti-slop gate, not mixed into it. The anti-slop gate measures design quality; SEO measures technical correctness. They are orthogonal concerns reported alongside each other. GEO readiness is reported as INFO, not gated.

### Critical Pitfalls

1. **C1: Structured Data Mismatch** -- JSON-LD claims content the page does not show (price changed, FAQ rewritten, schema not updated). Google penalizes with manual action for "Spammy Structured Markup." **Prevent with:** single source of truth (JSON-LD and UI derive from same data object), post-iteration schema audit in `/modulo:iterate` blast radius analysis, mandatory Rich Results Test validation before deploy.

2. **C2: Canonical URL Misconfiguration** -- Relative URLs, trailing slash inconsistency, stale hardcoded canonicals, missing `metadataBase`. Splits link equity silently. Bing confirms duplicate content hurts both traditional SEO and AI search visibility. **Prevent with:** dynamic canonical generation from route (never hardcoded), `metadataBase` as mandatory in root layout, trailing slash policy enforced site-wide via framework config.

3. **C3: API Key Exposure via Framework Env Prefixes** -- `NEXT_PUBLIC_`, `VITE_`, `PUBLIC_` prefixed variables containing secrets are bundled into client JavaScript. CVE-2025-66478 (CVSS 10.0) showed even server-side secrets can leak. **Prevent with:** server-side proxy as default pattern for all external API calls, prefix audit rule in skill, explicit note that IndexNow key is public by design (not a secret).

4. **C4: React/Vite SPA Invisibility** -- Client-rendered SPAs serve empty `<div id="root">` to crawlers. Metadata via `react-helmet-async` is invisible until JS executes. Bing and AI crawlers may not execute JS at all. **Prevent with:** honest framework capability matrix, pre-rendering guidance for Vite, recommendation to use Next.js or Astro if SEO is a primary goal.

5. **M3: GEO Over-Optimization Cannibalizing Design** -- Stuffing pages with statistics, fake FAQ sections, and citation-heavy content that destroys premium aesthetic. **Prevent with:** archetype-aware GEO (Brutalist gets concise statements, Editorial gets natural citations), unified SEO+GEO strategy ("good SEO content IS good GEO content"), schema only for real visible content.

## Implications for Roadmap

Based on combined research, the v1.5 milestone should follow 4 phases. The dependency chain is: Foundation SEO (correct patterns) -> Structured Data + GEO (AI visibility) -> Proactive Indexing (instant discoverability) -> Visual Enhancement + Integration (polish).

### Phase 1: Core SEO Skill Rewrite
**Rationale:** The foundation must be correct before layering GEO. Wrong canonicals, broken sitemaps, or missing metadata undermine everything downstream. The existing `seo-meta` skill has correct foundations but needs modernization (React 19, Next.js 15+ async params, removal of deprecated patterns like `changeFrequency`/`priority`).
**Delivers:** Rewritten `seo-meta` skill promoted to Core tier. Complete meta tag architecture for Next.js 16, Astro 5/6, React 19. Canonical URL strategy. Framework capability matrix (honest about SPA limitations). robots.txt with AI crawler taxonomy. Sitemap validation rules.
**Addresses:** TS-1, TS-2, TS-5, TS-6, TS-7, TS-8, D-3 (AI bot taxonomy)
**Avoids:** C2 (canonical misconfiguration), C4 (SPA invisibility -- honest disclosure), M1 (sitemap validation failures), M4 (Next.js metadata API misuse)
**Research flag:** Standard patterns. Framework APIs are well-documented. Verify Next.js 16 `generateMetadata` async params syntax against current docs.

### Phase 2: Structured Data + GEO Content Patterns
**Rationale:** This is where the competitive advantage lives. Structured data bridges traditional SEO and GEO -- it serves both Google rich results and AI engine citation. FAQ schema's 3.2x AI Overview impact makes it the highest-priority addition. GEO content patterns connect to the Emotional Arc system, making this uniquely Modulo.
**Delivers:** New `structured-data` skill (Domain tier). Typed JSON-LD via `schema-dts` for Article, FAQPage, Organization, WebSite, BreadcrumbList, HowTo, Product. Per-page-type schema recipes. `@graph` pattern for combining schemas. GEO content structuring (BLUF, question headings, quotable statistics). SEO-Emotional Arc integration (per-beat-type SEO guidance).
**Addresses:** TS-4, D-1 (GEO content), D-8 (advanced schema), D-10 (SEO + Emotional Arc)
**Avoids:** C1 (schema-content mismatch -- single source of truth rule), M3 (GEO over-optimization -- archetype-aware patterns), D1 (schema over-application -- decision matrix)
**Research flag:** Needs research. GEO is a fast-moving field (foundational paper from 2023). FAQ schema's 3.2x impact figure comes from a single source (Frase.io). Verify with newer data when writing the skill. Speakable schema adoption should be checked.

### Phase 3: Proactive Indexing + Search Visibility
**Rationale:** With correct metadata and structured data in place, proactive indexing maximizes discoverability. IndexNow is a post-deploy concern, not a design-time concern -- it belongs after the build-time skills are established. This phase also covers llms.txt and the unified indexing strategy.
**Delivers:** New `search-visibility` skill (Domain tier). IndexNow API integration (Next.js Route Handler, Astro `astro-indexnow` hook, CI/CD scripts). IndexNow key generation and verification-first setup. llms.txt template and honest assessment (low impact today, forward-looking). Unified indexing strategy (IndexNow for Bing + sitemaps for Google). Content freshness signals (`datePublished`, `dateModified`, accurate `lastmod`).
**Addresses:** D-2 (IndexNow), D-4 (llms.txt), D-6 (sitemap index), D-9 (unified indexing strategy)
**Avoids:** M2 (IndexNow key verification failures -- verification-first setup), N2 (submitting unchanged URLs -- content hash tracking), D4 (robots.txt over-blocking)
**Research flag:** Needs research for IndexNow. Google's IndexNow adoption status should be rechecked -- if Google joins, IndexNow becomes critical. `astro-indexnow` v2.1.0 version should be verified via npm. Rate limit behavior is undisclosed per search engine.

### Phase 4: Dynamic OG Images + CRM Integration
**Rationale:** These are polish and integration features that depend on the foundation being complete. Dynamic OG images use Design DNA tokens (brand colors, display font) and require the DNA system. CRM form integration is a server-side proxy pattern that is independent of SEO but naturally groups with the "external communication" theme.
**Delivers:** Dynamic OG image generation (Next.js `next/og` ImageResponse, Astro Satori endpoint). DNA-integrated OG templates. CRM form integration patterns (HubSpot Forms API, Salesforce Web-to-Lead, generic webhooks). Server-side proxy pattern. Three-state UI for API-dependent components (loading, success, error). hreflang implementation guidance (cross-reference with `i18n-rtl` skill).
**Addresses:** TS-3 (dynamic OG), D-5 (hreflang), D-7 (CRM forms)
**Avoids:** C3 (API key exposure -- server proxy default), M5 (CORS blocking -- server proxy pattern), D3 (missing OG images -- DNA-integrated defaults)
**Research flag:** Standard patterns for OG images (Satori CSS limitations are known -- flexbox only). Needs research for CRM integration: HubSpot Forms API v3 submission endpoint, Salesforce Web-to-Lead limits (500/day), rate limiting patterns.

### Phase Ordering Rationale

- **Phase 1 first** because every downstream phase depends on correct meta tags, canonical URLs, and sitemap infrastructure. A broken foundation makes GEO and IndexNow pointless.
- **Phase 2 second** because structured data is the bridge between traditional SEO and GEO. FAQ schema drives both rich results and AI citations. The Emotional Arc integration is what makes Modulo's approach unique.
- **Phase 3 third** because proactive indexing is a post-build/post-deploy concern. IndexNow submits URLs that must already have correct metadata and structured data.
- **Phase 4 last** because dynamic OG images and CRM integration are enhancement features. The site functions correctly for search without them. OG images depend on DNA tokens being in place.
- **This order avoids all critical pitfalls**: C1 (schema mismatch) addressed in Phase 2 with single-source-of-truth rule. C2 (canonicals) addressed in Phase 1 with dynamic generation. C3 (API key exposure) addressed in Phase 4 with server proxy default. C4 (SPA invisibility) addressed in Phase 1 with honest framework matrix.

### Agent Updates Required

After skill creation, the following agents need updates (Phase B in architecture research):

| Agent | Update | Depends On |
|-------|--------|------------|
| **section-planner** | Add schema assignment from `structured-data` skill. Add SEO Registry to MASTER-PLAN.md template. Add metadata `must_haves.truths` to PLAN.md. | Phases 1-2 |
| **content-specialist** | Add `search-visibility` skill reference for GEO content formatting. Add SEO/GEO section to CONTENT.md. | Phase 2 |
| **build-orchestrator** | Add Wave 0 SEO scaffold items (sitemap.ts, robots.ts, IndexNow route, JsonLd component). | Phase 1 |
| **quality-reviewer** | Add supplementary SEO checklist to post-wave verification. Add SEO live testing to Layer 3. | Phase 1 |
| **researcher** | Add Context7 MCP tools to tool list. Update research protocol to prefer Context7 for library questions. | Phase 3 |

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 2 (Structured Data + GEO):** GEO is < 3 years old. Best practices evolve rapidly. FAQ schema 3.2x figure needs newer verification. Speakable schema adoption and AI engine support should be checked. Per-archetype GEO guidance needs creative direction input.
- **Phase 3 (Proactive Indexing):** Google's IndexNow adoption status should be rechecked. `astro-indexnow` package version and API should be verified. Rate limit behavior is undisclosed per search engine.
- **Phase 4 (CRM Integration):** HubSpot Forms API v3 submission endpoint details. Salesforce Web-to-Lead vs REST API decision matrix. Rate limiting per CRM provider.

**Phases with standard patterns (skip deep research):**
- **Phase 1 (Core SEO):** Framework metadata APIs are well-documented with official docs. The existing `seo-meta` skill provides correct foundations. This is modernization and expansion, not invention.
- **Phase 4 (Dynamic OG Images):** `next/og` ImageResponse and Satori patterns are well-documented. Flexbox-only constraint is known.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All framework APIs verified against official documentation. `schema-dts` v1.1.5 confirmed. 95% framework-native -- minimal dependency risk. |
| Features | HIGH | SEO requirements derived from Google Search Central, official framework docs. GEO techniques from multiple 2025-2026 sources (Princeton research, Search Engine Land, Frase.io). Feature prioritization informed by dependency analysis. |
| Architecture | HIGH | Based on deep analysis of 45 existing skills, 14 agents, 8 commands. Pipeline integration points verified against existing agent protocols. Skill decomposition follows established 4-layer format. |
| Pitfalls | HIGH | Critical pitfalls backed by official sources (Google structured data policies, CVE-2025-66478, Bing canonical URL research). Framework-specific pitfalls verified against official docs. |
| GEO Impact Data | MEDIUM | FAQ schema 3.2x figure from single source (Frase.io). 50% AI search adoption from McKinsey. GEO techniques are from 2025-2026 guides that may evolve. The field is < 3 years old. |
| llms.txt | LOW-MEDIUM | Emerging standard. Impact data is minimal (1 out of 94,614 cited URLs in one study). 600+ website adoption. Not yet a W3C/IETF standard. Include as forward-looking, not critical. |

**Overall confidence: HIGH** -- The SEO/GEO domain is well-documented by authoritative sources (Google, Bing, framework maintainers). The primary uncertainty is in GEO-specific impact data, which is an emerging field. The stack recommendation of "framework-native + `schema-dts`" is high-conviction.

### Gaps to Address

- **GEO technique validation:** GEO is evolving rapidly. The FAQ 3.2x impact and "Statistics Addition 28-41% improvement" figures should be re-verified when writing Phase 2 skills. Flag for re-research.
- **Google + IndexNow:** Google has tested IndexNow since 2021 but not adopted as of Feb 2026. If Google joins, IndexNow becomes critical infrastructure, not just a Bing optimization. Monitor for changes.
- **Satori version pinning:** Exact current version could not be verified for non-Next.js usage. The `next/og` bundled version is what matters for Next.js. Pin to "latest" for Astro Satori usage and verify at implementation time.
- **AI crawler list completeness:** New AI crawlers appear frequently. The taxonomy covers major bots as of Feb 2026 (GPTBot, OAI-SearchBot, Google-Extended, ClaudeBot, PerplexityBot, Applebot-Extended, CCBot) but will need periodic updates.
- **llms.txt specification stability:** Not yet a formal standard. May change significantly. Low-risk inclusion (static markdown file) but do not over-invest in tooling around it.
- **Skill bloat resolution:** The 3-skill vs 2-skill architecture tension must be resolved during implementation. If any skill falls under 300 lines, consolidate. Target: no more than 2 new skills total.
- **`react-helmet` fallback:** `@dr.pogodin/react-helmet` is recommended for complex React/Vite cases but its exact version could not be verified. Verify at implementation time.

## Sources

### Primary (HIGH confidence)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- generateMetadata, metadata export, MetadataRoute types
- [Next.js OG Image Docs](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- ImageResponse API, opengraph-image convention
- [Next.js Sitemap Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) -- sitemap.ts, generateSitemaps
- [Next.js Data Security Guide](https://nextjs.org/docs/app/guides/data-security) -- env prefix behavior, React Taint APIs
- [Google Structured Data Policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) -- schema-content match requirement
- [Google Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) -- sitemap specification, validation
- [Google Canonical URL Consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) -- canonical best practices
- [IndexNow.org Documentation](https://www.indexnow.org/documentation) -- API spec, endpoint, verification
- [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/) -- @astrojs/sitemap v3.7.0, config, SSR limitations
- [React 19 Release Blog](https://react.dev/blog/2024/12/05/react-19) -- native metadata hoisting
- [schema-dts npm](https://www.npmjs.com/package/schema-dts) -- v1.1.5, TypeScript types for Schema.org
- [HubSpot Developer Docs: Forms API](https://developers.hubspot.com/docs/api-reference/marketing-forms-v3/guide) -- submission endpoint, rate limits
- Existing `seo-meta` skill analysis (398 lines, current v2.0 implementation)
- Existing Modulo codebase (45 skills, 14 agents, 8 commands -- pipeline integration analysis)

### Secondary (MEDIUM confidence)
- [Search Engine Land: Mastering GEO in 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142) -- GEO techniques, AI Overviews optimization
- [Frase.io FAQ Schema + GEO](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo) -- FAQ schema 3.2x AI Overview impact
- [Bing: Duplicate Content and AI Search (Dec 2025)](https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility) -- canonical URL importance for AI search
- [Bing: lastmod Importance (2023)](https://blogs.bing.com/webmaster/february-2023/The-Importance-of-Setting-the-lastmod-Tag-in-Your-Sitemap) -- accurate lastmod signal
- [GEO Research Paper (arXiv 2311.09735)](https://arxiv.org/pdf/2311.09735) -- foundational GEO research
- [CVE-2025-66478 Next.js Security Advisory](https://nextjs.org/blog/CVE-2025-66478) -- server-side secret leakage
- [Cloudflare AI Crawler Report](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/) -- AI bot landscape, robots.txt adoption patterns
- [Paul Calvano: AI Bots and Robots.txt (2025)](https://paulcalvano.com/2025-08-21-ai-bots-and-robots-txt/) -- empirical research on AI crawler prevalence

### Tertiary (LOW confidence)
- [ALLMO llms.txt Report](https://www.allmo.ai/articles/llms-txt) -- llms.txt citation data (1/94,614 URLs cited), impact unproven
- [Bluehost: What Is llms.txt?](https://www.bluehost.com/blog/what-is-llms-txt/) -- llms.txt specification, format details
- Training data (May 2025) -- Satori CSS limitations, `@dr.pogodin/react-helmet` functionality

---
*Research completed: 2026-02-25*
*Ready for roadmap: yes*
