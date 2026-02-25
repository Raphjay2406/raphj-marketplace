---
phase: 16-indexing-search-visibility
plan: 01
subsystem: seo
tags: [indexnow, search-visibility, astro-indexnow, robots.txt, llms.txt, next.js, astro]

# Dependency graph
requires:
  - phase: 14-core-seo-foundation
    provides: Base seo-meta skill with robots.txt foundation, sitemap patterns, meta tag architecture
provides:
  - search-visibility SKILL.md with Layer 1 (Decision Guidance) and Layer 2 Part A (IndexNow patterns)
  - Unified indexing strategy with engine comparison matrix
  - IndexNow auto-setup patterns for Next.js 16 and Astro (SSR + SSG)
  - Content-hash tracking approaches (4 methods)
affects: [16-PLAN-02, 16-PLAN-03, 18-dynamic-og-images]

# Tech tracking
tech-stack:
  added: [astro-indexnow v2.1.0 (Astro SSG only)]
  patterns: [IndexNow Route Handler with content-hash tracking, dual-path indexing strategy, api.indexnow.org global endpoint]

key-files:
  created: [skills/search-visibility/SKILL.md]
  modified: []

key-decisions:
  - "All IndexNow patterns use api.indexnow.org global endpoint -- never per-engine endpoints"
  - "Content-hash tracking built into Next.js Route Handler by default (not optional)"
  - "In-memory Map for serverless hash tracking, with KV store as upgrade path for persistent tracking"
  - "astro-indexnow v2.1.0 for Astro SSG (build-time only); custom API endpoint for Astro SSR"

patterns-established:
  - "IndexNow submission via single global endpoint with batch support (10k URL limit)"
  - "Internal auth via Bearer token on IndexNow endpoints (INDEXNOW_INTERNAL_SECRET)"
  - "Content-hash tracking with SHA-256 for URL deduplication before IndexNow submission"
  - "Dual-path indexing: IndexNow for Bing/Yandex/Naver + sitemap/GSC for Google"

# Metrics
duration: 3min
completed: 2026-02-25
---

# Phase 16 Plan 01: Search Visibility Layers 1-2A Summary

**Domain-tier search-visibility skill with unified indexing strategy (honest Google non-support disclosure), IndexNow Route Handler for Next.js 16 with SHA-256 content-hash tracking, Astro SSR/SSG endpoints, and engine comparison matrix covering all 8 IndexNow participants**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-25T03:07:58Z
- **Completed:** 2026-02-25T03:11:14Z
- **Tasks:** 2
- **Files created:** 1

## Accomplishments

- Created `search-visibility` SKILL.md (Domain tier) with complete Layer 1 Decision Guidance including unified indexing strategy, engine comparison matrix (8 engines), 3 project-type recipes, and decision tree
- Layer 2 Part A provides 7 IndexNow patterns: API key setup, key verification file (static + dynamic), Next.js 16 Route Handler with content-hash tracking, Astro SSR endpoint, Astro SSG astro-indexnow integration, content-hash tracking approaches, and monitoring with response status reference
- File structured with clear end marker for Plan 02 to append Layer 2 Part B (AI crawlers, llms.txt)

## Task Commits

Each task was committed atomically:

1. **Task 1: Write SKILL.md frontmatter + Layer 1 (Decision Guidance)** - `cfcc50d` (feat)
2. **Task 2: Write SKILL.md Layer 2 Part A (IndexNow Patterns)** - `4442f88` (feat)

## Files Created/Modified

- `skills/search-visibility/SKILL.md` - New Domain-tier skill with Layers 1 and 2A (413 lines)

## Decisions Made

- All IndexNow patterns use `api.indexnow.org` global endpoint (never per-engine endpoints) -- simplifies implementation and auto-distributes to all 7 engines
- Content-hash tracking is built into the Next.js Route Handler by default, not an optional add-on -- prevents spam flags from unchanged URL resubmission
- In-memory Map chosen as default hash storage for serverless (simple, zero-dep); KV store documented as upgrade path for persistent tracking
- `astro-indexnow` v2.1.0 recommended for Astro SSG only; custom API endpoint pattern for Astro SSR -- the integration is build-time only and cannot handle runtime updates
- Internal Bearer token auth on IndexNow endpoints using INDEXNOW_INTERNAL_SECRET -- prevents unauthorized URL submissions

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- SKILL.md is ready for Plan 02 to append Layer 2 Part B (AI-aware robots.txt presets, llms.txt generation) after the end marker comment
- Plan 03 will add Layer 3, Layer 4, and machine-readable constraints
- Requirement coverage: IDX-01 (IndexNow auto-setup) COVERED, IDX-04 (Unified indexing strategy) COVERED

---
*Phase: 16-indexing-search-visibility*
*Completed: 2026-02-25*
