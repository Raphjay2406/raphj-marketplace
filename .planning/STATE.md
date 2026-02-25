# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-25)

**Core value:** Every output must be award-winning by default -- sites must also be discoverable and rankable.
**Current focus:** Phase 16 - Indexing & Search Visibility (v1.5 milestone)

## Current Position

Phase: 16 of 19 (Indexing & Search Visibility)
Plan: 02 of 03 in current phase
Status: In progress
Last activity: 2026-02-25 -- Completed 16-PLAN-02.md (AI crawler taxonomy + llms.txt + Layer 2B)

Progress: [████████████░░░░░░░░░░░░] v1: 100% | v1.5: ~33% (5/TBD plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 63 (v1)
- v1.5 plans completed: 5
- Average duration: 4m 27s
- Total execution time: 22m 15s

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 14 | 2 | 8m 11s | 4m 06s |
| 15 | 1 | 7m 04s | 7m 04s |
| 16 | 2 | 7m 00s | 3m 30s |
| 17-19 | TBD | - | - |

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
- 15-01: 941 lines for Layers 1-2 (above 450-600 target) -- 25+ interfaces and 14 code patterns require space
- 15-01: HowToSchema and WebSiteSchema interfaces created fresh (not in research)

### Pending Todos

None.

### Roadmap Evolution

- Phase 19 added: SSR & Dynamic Content Patterns -- SSR/ISR/streaming decision guidance, cache invalidation, CMS revalidation, auth-gated rendering, database-driven pages

### Blockers/Concerns

- GEO impact data: specific multiplier claims avoided in skill; using "significantly higher rates" per research recommendation
- Google IndexNow adoption confirmed NOT supported (Feb 2026) -- dual strategy implemented in 16-01
- Skill bloat risk with 3 new skills -- monitor line counts, consolidate if < 300 lines
- seo-meta SKILL.md at 928 lines (all 4 layers complete) -- manageable but near upper bound; appendix extraction kept main file focused
- structured-data SKILL.md at 941 lines (Layers 1-2 only) -- will grow with Layers 3-4 in Plan 02; may need appendix extraction like seo-meta

## Session Continuity

Last session: 2026-02-25
Stopped at: Completed 16-PLAN-02.md (AI crawler taxonomy + llms.txt + Layer 2B)
Resume file: None
