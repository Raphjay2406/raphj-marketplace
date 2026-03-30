# Research Summary: v1.5 SEO/GEO Milestone

**Domain:** SEO, GEO, Sitemaps, IndexNow, AI Search Visibility, External API Integration
**Researched:** 2026-02-25
**Overall confidence:** HIGH

## Executive Summary

The v1.5 milestone adds comprehensive search engine visibility to Genorah 2.0. The core insight driving this research is that search optimization in 2026 has bifurcated: traditional SEO (Google rankings, rich results, sitemaps) remains essential, but a new dimension -- Generative Engine Optimization (GEO) -- has emerged as equally critical. By late 2025, 50% of consumers were using AI-powered search as their primary information source. Sites invisible to AI engines are increasingly invisible to users.

The good news for Genorah: the SEO/GEO stack is almost entirely framework-native. Unlike the animation stack (GSAP, Motion, Three.js), SEO/GEO relies on built-in framework APIs (Next.js `generateMetadata`, Astro `<head>`, React 19 native metadata hoisting), hand-crafted JSON-LD, and simple HTTP calls. The only recommended library dependency is `schema-dts` (TypeScript types for Schema.org, zero runtime cost). This means the v1.5 milestone is primarily about skill content, not library integration.

The existing `seo-meta` skill provides a solid foundation with correct Next.js metadata patterns, Astro head components, and JSON-LD examples. However, it lacks: (1) GEO optimization techniques, (2) AI crawler management (robots.txt for GPTBot, OAI-SearchBot, PerplexityBot), (3) IndexNow protocol integration, (4) `llms.txt` standard, (5) typed structured data via `schema-dts`, (6) dynamic OG image generation patterns, and (7) sitemap validation requirements. These gaps represent the v1.5 work.

The architectural approach is to expand the existing `seo-meta` skill into a comprehensive SEO/GEO skill (or split into two skills if content exceeds the 300-line target), add IndexNow as a build-integration pattern, and add AI crawler management to the robots.txt patterns.

## Key Findings

**Stack:** Framework-native APIs cover 95% of SEO/GEO needs. Only addition: `schema-dts` (TypeScript types, devDependency). No runtime libraries required.
**Architecture:** Existing skill structure is correct. Expand content, add GEO layer, add IndexNow integration pattern.
**Critical pitfall:** FAQ schema has 3.2x higher AI Overview appearance rate -- this is the single highest-impact structured data for GEO. Missing it is the biggest visibility gap sites have in 2026.

## Implications for Roadmap

Based on research, the v1.5 SEO/GEO milestone should be structured as follows:

1. **Phase 1: Core SEO Modernization** -- Update `seo-meta` skill
   - Addresses: Meta tag patterns (already solid), canonical URL pitfalls, sitemap validation requirements
   - Reason first: Foundation must be correct before adding GEO layer

2. **Phase 2: Structured Data & GEO** -- Add typed JSON-LD + GEO techniques
   - Addresses: `schema-dts` integration, FAQ/HowTo/Article schemas, GEO content patterns, question-based headings, direct-answer paragraphs
   - Reason second: GEO builds on correct structured data

3. **Phase 3: Proactive Indexing** -- IndexNow + AI Crawler Management
   - Addresses: IndexNow API integration, robots.txt AI bot rules, llms.txt
   - Reason third: Indexing optimization is post-deployment, not design-time

4. **Phase 4: Dynamic OG Images** -- DNA-integrated OG generation
   - Addresses: `next/og` ImageResponse, Satori patterns for Astro, DNA token integration
   - Reason last: OG images are a polish feature, not a structural one

**Phase ordering rationale:**
- SEO fundamentals must be correct before layering GEO (wrong canonicals or duplicate sitemaps undermine everything)
- Structured data is the bridge between traditional SEO and GEO -- it serves both
- IndexNow is a deployment-time integration, not a design-time concern
- OG images are a visual enhancement that depends on the DNA system being in place

**Research flags for phases:**
- Phase 2: GEO is a fast-moving field. FAQ schema's 3.2x impact should be verified with newer data when writing the skill. Techniques may evolve.
- Phase 3: Google's IndexNow adoption status should be rechecked. If Google joins, IndexNow becomes critical (not just Bing/Yandex).
- Phase 4: Satori's CSS limitations need testing against DNA token complexity. Flexbox-only may constrain OG image designs.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Framework-native APIs verified via official docs. `schema-dts` version confirmed. |
| Features | HIGH | SEO requirements well-documented. GEO techniques from multiple 2025-2026 sources. |
| Architecture | HIGH | Existing skill structure is sound. Expansion is additive, not restructuring. |
| Pitfalls | HIGH | Sitemap validation, canonical URL issues, and React Helmet deprecation are well-documented. |
| GEO Impact Data | MEDIUM | FAQ schema 3.2x figure from single source (Frase.io). 50% AI search adoption from McKinsey. |
| llms.txt | LOW-MEDIUM | Emerging standard. Impact data is minimal (1/94,614 citations). Include as forward-looking. |

## Gaps to Address

- **Satori exact version**: Could not verify via npm registry (Bash restricted). Use `next/og` bundled version for Next.js.
- **GEO technique validation**: GEO is <2 years old. Best practices are evolving. Flag for re-research when writing the skill.
- **Google + IndexNow**: Google has tested IndexNow since 2021 but not adopted. Monitor for changes.
- **AI crawler list completeness**: New AI crawlers appear frequently. The list in STACK.md covers major ones as of Feb 2026 but will need periodic updates.
- **llms.txt specification stability**: Not yet a W3C/IETF standard. May change significantly.

## Sources

See STACK.md for complete source list with confidence levels and URLs.

---
*Research completed: 2026-02-25*
*Ready for roadmap: yes*
