# Requirements: Modulo 2.0 v1.5

**Defined:** 2026-02-25
**Core Value:** Every output must be award-winning by default — sites must also be discoverable and rankable, not just visually premium.

## v1 Requirements

Requirements for v1.5 milestone. Each maps to roadmap phases.

### Core SEO

- [ ] **SEO-01**: Comprehensive meta tag generation (title, description) with framework-native patterns (Next.js `generateMetadata`, Astro `<head>`, React 19 native hoisting) — no deprecated libraries (react-helmet, next-seo)
- [ ] **SEO-02**: Open Graph and Twitter Card meta tags with per-page customization and fallback defaults
- [ ] **SEO-03**: Canonical URL strategy with self-referencing canonicals, cross-domain handling, and pagination rules
- [ ] **SEO-04**: XML sitemap generation that passes Google Search Console and Bing Webmaster Tools validation — framework-native (Next.js `app/sitemap.ts`, Astro `@astrojs/sitemap`)
- [ ] **SEO-05**: Sitemap index generation for multi-page sites with proper `<sitemapindex>` wrapper
- [ ] **SEO-06**: robots.txt generation with sitemap references and proper crawl directives
- [ ] **SEO-07**: Core Web Vitals SEO impact guidance — LCP, CLS, INP thresholds and their ranking effects
- [ ] **SEO-08**: hreflang implementation for internationalized sites with x-default fallback

### Structured Data

- [ ] **SDATA-01**: Typed JSON-LD generation using `schema-dts` (TypeScript types, zero runtime, devDependency)
- [ ] **SDATA-02**: FAQ schema with proper Question/Answer markup — validated against Google Rich Results test
- [ ] **SDATA-03**: HowTo schema for tutorial/guide content with step-by-step structured markup
- [ ] **SDATA-04**: Article schema (NewsArticle, BlogPosting) with author, datePublished, dateModified
- [ ] **SDATA-05**: Organization schema with logo, contact, social profiles
- [ ] **SDATA-06**: Post-iteration schema audit protocol to prevent structured data drift from visible content

### Generative Engine Optimization (GEO)

- [ ] **GEO-01**: Content structuring patterns for AI search visibility (Google AI Overviews, Bing Copilot, ChatGPT search)
- [ ] **GEO-02**: BLUF (Bottom Line Up Front) formatting with statistical evidence and citation-friendly content blocks
- [ ] **GEO-03**: FAQ-first content patterns — FAQ schema drives 3.2x higher AI Overview appearance rate
- [ ] **GEO-04**: AI crawler taxonomy: distinguish training bots (GPTBot, Google-Extended, ClaudeBot — block) from search bots (OAI-SearchBot, PerplexityBot — allow)
- [ ] **GEO-05**: SEO-Emotional Arc integration — GEO-optimized content blocks placed at strategic beat positions

### Indexing & Visibility

- [ ] **IDX-01**: IndexNow full auto-setup: API key generation, verification file, framework-specific submission endpoint (Next.js API route, Astro endpoint)
- [ ] **IDX-02**: AI-aware robots.txt with separate rules for training bots vs search bots
- [ ] **IDX-03**: llms.txt template generation — forward-looking convention for AI crawler guidance
- [ ] **IDX-04**: Unified indexing strategy: IndexNow for Bing/Yandex/Naver + sitemap/ping for Google
- [ ] **IDX-05**: GSC and Bing Webmaster Tools submission workflow with step-by-step verification instructions

### API Integration

- [ ] **API-01**: Context7 MCP integration for live API documentation lookup during researcher and specialist agent workflows
- [ ] **API-02**: Server-side proxy patterns: Next.js server actions, Astro API endpoints — secure external API calls with env secret protection
- [ ] **API-03**: CRM form integration patterns: HubSpot Forms API (v2 submission), Salesforce Web-to-Lead, generic webhook POST
- [ ] **API-04**: Typed API client generation with proper error handling, retry logic, and rate limit awareness
- [ ] **API-05**: Webhook receiver patterns: Next.js API routes and Astro endpoints for incoming webhook payloads
- [ ] **API-06**: Environment variable management: framework-specific prefix rules (NEXT_PUBLIC_, PUBLIC_, VITE_) with server-side secret protection

### Dynamic OG Images

- [ ] **OG-01**: DNA-integrated OG image generation using Next.js `ImageResponse` (next/og) + Satori
- [ ] **OG-02**: Dynamic social preview templates that pull Design DNA tokens (colors, fonts, brand elements)
- [ ] **OG-03**: Astro-compatible OG image generation pattern (Satori + sharp/resvg)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced SEO

- **SEO-V2-01**: Automated Google Rich Results testing integration
- **SEO-V2-02**: Internal linking strategy engine with anchor text optimization
- **SEO-V2-03**: Content freshness signals and automated update scheduling

### Advanced GEO

- **GEO-V2-01**: GEO performance measurement and A/B testing patterns
- **GEO-V2-02**: AI search result monitoring and tracking
- **GEO-V2-03**: Multi-language GEO optimization patterns

### Advanced API

- **API-V2-01**: GraphQL integration patterns (Apollo Client, urql)
- **API-V2-02**: Real-time API subscription patterns (WebSocket, SSE)
- **API-V2-03**: API response caching strategies (SWR, TanStack Query integration)

## Out of Scope

| Feature | Reason |
|---------|--------|
| SEO keyword research tools | Modulo generates code, not marketing strategy |
| Backlink analysis or building | Off-page SEO is outside design scope |
| Google Analytics / tracking implementation | Existing `analytics-tracking` skill covers this |
| Custom CMS integration | Existing `cms-integration` skill covers this |
| Full backend API development | Modulo handles API routes for external wiring, not custom business logic |
| SEO A/B testing infrastructure | Too complex for v1.5, defer to v2 |
| Paid search / SEM integration | Advertising is not Modulo's domain |
| Legacy library support (react-helmet, next-seo, next-sitemap) | Deprecated — framework-native patterns only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEO-01 | Phase 14 | Pending |
| SEO-02 | Phase 14 | Pending |
| SEO-03 | Phase 14 | Pending |
| SEO-04 | Phase 14 | Pending |
| SEO-05 | Phase 14 | Pending |
| SEO-06 | Phase 14 | Pending |
| SEO-07 | Phase 14 | Pending |
| SEO-08 | Phase 14 | Pending |
| SDATA-01 | Phase 15 | Pending |
| SDATA-02 | Phase 15 | Pending |
| SDATA-03 | Phase 15 | Pending |
| SDATA-04 | Phase 15 | Pending |
| SDATA-05 | Phase 15 | Pending |
| SDATA-06 | Phase 15 | Pending |
| GEO-01 | Phase 15 | Pending |
| GEO-02 | Phase 15 | Pending |
| GEO-03 | Phase 15 | Pending |
| GEO-04 | Phase 15 | Pending |
| GEO-05 | Phase 15 | Pending |
| IDX-01 | Phase 16 | Pending |
| IDX-02 | Phase 16 | Pending |
| IDX-03 | Phase 16 | Pending |
| IDX-04 | Phase 16 | Pending |
| IDX-05 | Phase 16 | Pending |
| API-01 | Phase 17 | Pending |
| API-02 | Phase 17 | Pending |
| API-03 | Phase 17 | Pending |
| API-04 | Phase 17 | Pending |
| API-05 | Phase 17 | Pending |
| API-06 | Phase 17 | Pending |
| OG-01 | Phase 18 | Pending |
| OG-02 | Phase 18 | Pending |
| OG-03 | Phase 18 | Pending |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 33
- Unmapped: 0

---
*Requirements defined: 2026-02-25*
*Last updated: 2026-02-25 — all 33 requirements mapped to phases 14-18*
