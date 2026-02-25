# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-25)

**Core value:** Every output must be award-winning by default -- sites must also be discoverable and rankable.
**Current focus:** Phase 18 in progress (Dynamic OG Images & Pipeline Wiring)

## Current Position

Phase: 18 of 19 (Dynamic OG Images & Pipeline Wiring)
Plan: 04 of 04 in current phase (01, 03, 04 complete; 02 remaining)
Status: In progress
Last activity: 2026-02-25 -- Completed 18-PLAN-04 (SKILL-DIRECTORY v1.5 milestone update)

Progress: [█████████████████░░░░░░░] v1: 100% | v1.5: ~78% (14/18 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 63 (v1)
- v1.5 plans completed: 14
- Average duration: 4m 04s
- Total execution time: 56m 55s

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 14 | 2 | 8m 11s | 4m 06s |
| 15 | 2 | 10m 00s | 5m 00s |
| 16 | 3 | 11m 00s | 3m 40s |
| 17 | 2 | 8m 57s | 4m 29s |
| 18 | 3 (of 4) | 8m 47s | 2m 56s |
| 19 | TBD | - | - |

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- v1.5: Replace seo-meta (not patch) -- existing skill too shallow for SEO-critical sites
- v1.5: 3-skill split (seo-meta rewrite + structured-data + search-visibility) -- consolidate to 2 if any falls under 300 lines
- v1.5: Framework-native only -- no react-helmet, next-seo, next-sitemap
- v1.5: API integration as separate phase -- architecturally different from SEO skills
- v1.5: Phase 17 (API) is independent of Phases 14-16 (SEO chain) -- can parallelize
- 14-01: React 19 native hoisting as primary SPA pattern (no react-helmet fork)
- 14-01: Shared metadata pattern documented for OG image inheritance (shallow merge issue)
- 14-01: Framework capability matrix in Layer 1 (not appendix) -- 11 rows, fits cleanly
- 14-02: 8 archetype tone variants for meta descriptions (not all 19) -- remaining map to one of the 8
- 14-02: 13 constraint parameters (12 HARD, 1 SOFT) -- title uniqueness is SOFT
- 14-02: Emerging bots commented-out in robots.txt template (not active rules)
- 16-01: All IndexNow patterns use api.indexnow.org global endpoint (never per-engine)
- 16-01: Content-hash tracking built into Next.js Route Handler by default
- 16-01: astro-indexnow v2.1.0 for Astro SSG; custom endpoint for Astro SSR
- 16-02: All three AI crawler presets presented as equal business choices (no recommended/default)
- 16-02: llms.txt framed as forward-looking convention (no confirmed AI platform consumption)
- 16-02: Perplexity-User included in presets despite non-compliance (flagged in taxonomy)
- 16-03: All verification methods documented equally per platform (no single recommended method)
- 16-03: Machine-readable constraints split HARD (protocol) vs SOFT (best practices) -- 8 HARD, 4 SOFT
- 16-03: Google sitemap ping is a HARD reject constraint (deprecated June 2023)
- 15-01: 941 lines for Layers 1-2 (above 450-600 target) -- 25+ interfaces and 14 code patterns require space
- 15-01: HowToSchema and WebSiteSchema interfaces created fresh (not in research)
- 15-02: 1091 total lines for complete SKILL.md (Layers 3-4 added only ~150 lines to existing 941)
- 17-01: api-patterns SKILL.md Layers 1-2 at 1476 lines -- 22 patterns across 6 requirements justify the length
- 17-01: Resend as primary email recommendation, SendGrid as alternative
- 17-01: Cloudflare Turnstile as sole spam protection (privacy-first, no reCAPTCHA)
- 17-01: createApiClient factory pattern with discriminated union ApiResult<T>
- 17-02: 1600 total lines for complete skill -- Layers 3-4 added only 124 lines to existing 1476
- 17-02: 8 archetype voice groups (all 19 archetypes covered) -- added Organic/Warm Artisan and Kinetic/Retro-Future
- 17-02: 13 machine-readable constraints (9 HARD, 4 SOFT) -- env secret prefix is highest priority
- 18-03: All pipeline wiring changes strictly additive -- no existing behavior removed
- 18-03: SEO verification checklist is advisory (does not block anti-slop gate)
- 18-03: Context7 fallback chain: Context7 -> WebFetch -> WebSearch
- 18-03: GEO patterns conditional on content-heavy sections with schema_type set
- 18-01: og-images SKILL.md Layers 1-2 at 951 lines -- 17 patterns across 7 sections justify the length
- 18-01: Sharp recommended over resvg-js for Astro (no Vite config, broader ecosystem)
- 18-01: Font loading documented first in Layer 2 (the #1 Satori pain point)
- 18-01: 5 signature element patterns all verified against Satori CSS constraints
- 18-04: seo-meta moved from Utility to Core tier in SKILL-DIRECTORY.md (Phase 14 rewrite, v3.0.0)
- 18-04: 3 new Domain skills under SEO & Visibility subcategory (structured-data, search-visibility, og-images)
- 18-04: Registry version bumped 2.0.0 -> 2.1.0 (v1.5 milestone close)

### Pending Todos

None.

### Roadmap Evolution

- Phase 19 added: SSR & Dynamic Content Patterns -- SSR/ISR/streaming decision guidance, cache invalidation, CMS revalidation, auth-gated rendering, database-driven pages

### Blockers/Concerns

- GEO impact data: specific multiplier claims avoided in skill; using "significantly higher rates" per research recommendation
- Google IndexNow adoption confirmed NOT supported (Feb 2026) -- dual strategy implemented in 16-01
- Skill bloat risk with 3 new skills -- monitor line counts, consolidate if < 300 lines
- seo-meta SKILL.md at 928 lines (all 4 layers complete) -- manageable but near upper bound; appendix extraction kept main file focused
- structured-data SKILL.md at 1091 lines (all 4 layers complete) -- Layers 3-4 added only ~150 lines; no appendix extraction needed since growth was modest
- search-visibility SKILL.md at 579 lines (all 4 layers complete) + 3 appendices -- well within target, no bloat concern
- api-patterns SKILL.md at 1600 lines (all 4 layers complete) -- largest skill but justified by 22 patterns across 6 API requirements; Layers 3-4 growth was modest (124 lines)
- og-images SKILL.md at 951 lines (Layers 1-2 complete) -- 17 patterns across both frameworks; Plan 02 will add Layers 3-4

## Session Continuity

Last session: 2026-02-25
Stopped at: Completed 18-PLAN-04 (SKILL-DIRECTORY v1.5 milestone update). Phase 18 Plan 02 remaining.
Resume file: None
