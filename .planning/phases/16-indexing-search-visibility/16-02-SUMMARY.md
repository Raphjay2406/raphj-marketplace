---
phase: 16-indexing-search-visibility
plan: 02
subsystem: seo
tags: [ai-crawlers, robots.txt, llms.txt, ai-presets, next.js, astro, search-visibility]

# Dependency graph
requires:
  - phase: 14-core-seo-foundation
    provides: Base seo-meta skill with robots.txt foundation and AI bot taxonomy
  - phase: 16-indexing-search-visibility (plan 01)
    provides: search-visibility SKILL.md with Layers 1-2A (IndexNow patterns)
provides:
  - AI crawler taxonomy appendix with 25+ bots in four tiers and three unbiased presets
  - llms.txt template appendix with manual and auto-generation patterns for Next.js and Astro
  - SKILL.md Layer 2 Part B with concise IDX-02 and IDX-03 decision guidance
affects: [16-PLAN-03, 18-dynamic-og-images]

# Tech tracking
tech-stack:
  added: []
  patterns: [Three-tier AI crawler preset system (Open/Selective/Restrictive), AI_ROBOTS_PRESET env var for Next.js robots.ts, llms.txt forward-looking convention with manual + auto-gen approaches]

key-files:
  created: [skills/search-visibility/appendix-ai-crawlers.md, skills/search-visibility/appendix-llms-txt.md]
  modified: [skills/search-visibility/SKILL.md]

key-decisions:
  - "All three AI crawler presets presented as equal business choices -- no recommended or default preset"
  - "llms.txt consistently framed as forward-looking convention with uncertain AI platform consumption"
  - "SKILL.md Layer 2B provides concise decision guidance pointing to appendices -- full content lives in appendix files"
  - "Perplexity-User flagged for robots.txt non-compliance but included in presets anyway (partial compliance > none)"

patterns-established:
  - "Three-tier AI bot classification: search bots / training bots / user-triggered fetchers"
  - "Three unbiased robots.txt presets: Open, Selective, Restrictive with env var selection"
  - "llms.txt manual template for small sites, auto-generation Route Handler for large sites"
  - "llms-full.txt as build-time generated variant (not runtime)"

# Metrics
duration: 4min
completed: 2026-02-25
---

# Phase 16 Plan 02: AI Crawler Taxonomy + llms.txt + Layer 2B Summary

**Three-tier AI crawler taxonomy (25 bots, 4 tiers) with unbiased Open/Selective/Restrictive robots.txt presets, llms.txt/llms-full.txt templates with Next.js and Astro auto-generation, and SKILL.md Layer 2B integrating IDX-02 and IDX-03 as concise appendix-backed decision guidance**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-25T03:14:05Z
- **Completed:** 2026-02-25T03:18:10Z
- **Tasks:** 2
- **Files created:** 2
- **Files modified:** 1

## Accomplishments

- Created `appendix-ai-crawlers.md` (367 lines) with complete three-tier bot classification (7 search bots, 9 training bots, 3 user-triggered fetchers, 6 emerging/niche), three complete robots.txt preset templates with inline comments, Next.js `robots.ts` programmatic implementation with `AI_ROBOTS_PRESET` env var, market context, and quarterly review protocol
- Created `appendix-llms-txt.md` (239 lines) with llms.txt format specification, llms-full.txt detailed variant template, three generation approaches (manual, Next.js Route Handler, Astro endpoint), build-time llms-full.txt generation, and "What NOT to Do" section
- Appended Layer 2 Part B to SKILL.md with concise IDX-02 (AI-aware robots.txt) and IDX-03 (llms.txt) sections that provide decision guidance and quick-reference tables while pointing to appendices for full content

## Task Commits

Each task was committed atomically:

1. **Task 1: Create appendix-ai-crawlers.md (AI Crawler Taxonomy with Three-Tier Presets)** - `2c723d2` (feat)
2. **Task 2: Create appendix-llms-txt.md + Append Layer 2 Part B to SKILL.md** - `1f8ab02` (feat)

## Files Created/Modified

- `skills/search-visibility/appendix-ai-crawlers.md` - Complete AI crawler taxonomy with 25 bots across 4 tiers, 3 unbiased presets with full robots.txt templates, Next.js robots.ts implementation
- `skills/search-visibility/appendix-llms-txt.md` - llms.txt/llms-full.txt format spec, manual + auto-generation patterns for Next.js and Astro
- `skills/search-visibility/SKILL.md` - Appended Layer 2 Part B with IDX-02 (robots.txt presets) and IDX-03 (llms.txt) decision guidance

## Decisions Made

- All three AI crawler presets presented as equal business choices with no editorial bias -- per CONTEXT.md decision, no preset is labeled "recommended" or "default"
- llms.txt consistently described as "forward-looking convention" with honest disclosure that no AI platform has confirmed reading these files
- Perplexity-User included in robots.txt presets despite known non-compliance (flagged in taxonomy) -- partial compliance is better than no rules
- SKILL.md Layer 2B keeps content concise (quick-reference tables, abbreviated code) and points to appendices for full details -- avoids bloating the main skill file

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- SKILL.md is ready for Plan 03 to add Layers 3-4 and machine-readable constraints after the end marker comment
- Plan 03 will also create `appendix-submission.md` for GSC/Bing/Yandex/Naver workflows
- Requirement coverage after Plan 02: IDX-01 COVERED (Plan 01), IDX-04 COVERED (Plan 01), IDX-02 COVERED (this plan), IDX-03 COVERED (this plan), IDX-05 pending (Plan 03)

---
*Phase: 16-indexing-search-visibility*
*Completed: 2026-02-25*
