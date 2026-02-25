# Phase 19: SSR & Dynamic Content Patterns - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

New `ssr-dynamic-content` skill (Domain tier) providing rendering strategy decision guidance, CMS revalidation patterns, auth-gated content rendering, and cache strategy for Next.js and Astro. Covers SSG, SSR, ISR, streaming, and PPR. React/Vite SPA is explicitly out of scope — this skill assumes a server-capable framework.

</domain>

<decisions>
## Implementation Decisions

### Rendering Decision Framework
- **Matrix + scenarios format**: Quick-reference matrix (data freshness x personalization x build frequency x edge/Node runtime) plus 8-10 named scenario recipes that reference the matrix
- **Edge runtime as a matrix dimension**: Edge vs Node runtime affects which strategies are viable — include as a full dimension, not a footnote
- **8-10 named scenarios**: Blog/CMS, E-commerce PDP, Dashboard, Marketing landing, User profile, API-driven feed, SaaS pricing page, docs site, marketplace listing, social feed
- **Next.js + Astro only**: No SPA coverage. No React/Vite disclaimer section — just scope to server frameworks
- **PPR presented as recommended**: Next.js Partial Pre-Rendering is the preferred approach for hybrid pages, with non-PPR fallback shown
- **Astro SSR treated as equally mature**: Cover Astro server mode at the same depth as Next.js SSR without hedging
- **Streaming SSR**: Conceptual explanation + one detailed example of Suspense boundary placement. Not per-scenario boundary maps.

### CMS Revalidation Depth
- **5 CMS platforms**: Sanity, Contentful, Strapi (big 3) + Payload CMS and Hygraph (emerging). Each gets specific webhook/revalidation patterns
- **Full draft preview patterns**: Cover Next.js Draft Mode and Astro preview routes including secure token flow, preview API route, and exit-preview mechanism
- **Explicit SEO bridge**: Show how revalidation triggers should also update sitemap lastmod and fire IndexNow. Connects Phase 19 to Phases 14-16 (seo-meta + search-visibility)
- **Webhook signature verification**: Include HMAC verification code patterns for each CMS webhook. Security is non-negotiable for production

### Auth-Gated Content Approach
- **Auth + rendering integration**: Go beyond just rendering implications — cover session checks in server components, middleware patterns, AND integration with specific auth libraries
- **4 auth libraries**: NextAuth, Supabase, Clerk, Lucia. Covers self-hosted (NextAuth, Lucia), managed (Clerk), and BaaS (Supabase)
- **Mixed pages — multiple approaches**: Show three approaches with trade-offs: (1) server-side conditional rendering, (2) client-side auth gate with skeleton, (3) PPR with auth boundary. Let users choose based on UX priority
- **Role-based rendering patterns included**: Server-side role checks and how they affect component trees (admin vs member vs guest rendering)

### Cache Strategy
- **Framework-level only**: Cover Cache-Control headers and framework APIs (Next.js fetch cache, Astro response headers). No CDN-specific config (Vercel, Cloudflare, etc.)
- **Next.js cache — detailed breakdown**: Explain the 4 Next.js cache layers (fetch cache, full route cache, router cache, data cache), when each applies, and how to opt out. Major developer pain point
- **Cache and CMS kept separate**: Cache strategy stands alone. CMS revalidation handles the webhook side. Cross-reference but don't merge into unified flow
- **Cache debugging as anti-patterns**: Include cache pitfalls in Layer 4 — stale content after deployment, cache-busting during dev, verifying cache headers

### Claude's Discretion
- Hybrid page composition approach (PPR-first vs Suspense boundary composition — Claude picks based on framework maturity research)
- Cache strategy presentation format (prescriptive recipes vs framework + overrides — Claude picks what fits the matrix + scenarios format)
- Exact count of scenarios (8-10 range, Claude determines based on coverage needs vs skill size budget)
- Connection pooling patterns for serverless (depth and library choices)

</decisions>

<specifics>
## Specific Ideas

- Matrix should have edge/Node as an explicit dimension — not just a footnote
- PPR is the future of Next.js rendering — treat it as recommended, not experimental
- The CMS revalidation section should bridge to SEO skills (Phases 14-16) by showing how revalidation triggers update sitemap lastmod and fire IndexNow
- Auth coverage spans 4 libraries representing different philosophies: self-hosted (NextAuth, Lucia), managed (Clerk), BaaS (Supabase)
- Next.js caching layers are a known developer pain point — give them a detailed breakdown, not just a reference table

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 19-ssr-dynamic-content-patterns*
*Context gathered: 2026-02-25*
