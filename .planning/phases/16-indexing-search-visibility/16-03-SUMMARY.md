---
phase: 16-indexing-search-visibility
plan: 03
subsystem: seo
tags: [webmaster-tools, gsc, bing, yandex, naver, search-visibility, anti-patterns, constraints, next.js, astro]

# Dependency graph
requires:
  - phase: 14-core-seo-foundation
    provides: Base seo-meta skill with robots.txt foundation, sitemap patterns, meta tag architecture
  - phase: 16-indexing-search-visibility (plans 01-02)
    provides: search-visibility SKILL.md with Layers 1-2 (IndexNow, AI crawlers, llms.txt)
provides:
  - Webmaster tools submission workflows appendix for GSC, Bing, Yandex, Naver
  - Complete 4-layer search-visibility SKILL.md with machine-readable constraints
  - 7 anti-patterns covering the most common indexing mistakes
  - 12 enforceable constraints (8 HARD, 4 SOFT) for automated quality checking
affects: [18-dynamic-og-images]

# Tech tracking
tech-stack:
  added: []
  patterns: [Unified Next.js verification metadata for all four platforms, step-by-step webmaster tools workflows with per-platform verification tables]

key-files:
  created: [skills/search-visibility/appendix-submission.md]
  modified: [skills/search-visibility/SKILL.md]

key-decisions:
  - "All verification methods documented equally per platform -- no single recommended method"
  - "Unified Next.js verification shortcut consolidates all four platforms in one metadata export"
  - "Machine-readable constraints split HARD (protocol requirements) vs SOFT (best practices)"
  - "Google sitemap ping is a HARD reject constraint (deprecated June 2023)"

patterns-established:
  - "Per-platform webmaster tools workflow: Add Site > Verify > Submit Sitemap > Monitor"
  - "Verification method tables with Method/Steps/Best For columns"
  - "Anti-pattern format: Name / What goes wrong / Instead with specific correction guidance"

# Metrics
duration: 4min
completed: 2026-02-25
---

# Phase 16 Plan 03: Webmaster Tools Workflows + Layers 3-4 + Constraints Summary

**Webmaster tools submission workflows for GSC/Bing/Yandex/Naver with all verification methods, Layer 3 integration context mapping DNA tokens and pipeline stages, 7 Layer 4 anti-patterns, and 12 machine-readable constraints completing the search-visibility Domain-tier skill**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-25T03:20:29Z
- **Completed:** 2026-02-25T03:24:40Z
- **Tasks:** 2
- **Files created:** 1
- **Files modified:** 1

## Accomplishments

- Created `appendix-submission.md` (273 lines) with step-by-step workflows for all four search platforms: GSC (5 verification methods), Bing (4 methods including GSC import), Yandex (4 methods), Naver (2 methods), unified Next.js verification shortcut, IndexNow configuration in Bing WMT, and submission checklist
- Completed SKILL.md (579 lines) with Layer 3 (DNA Connection, Archetype Variants, Pipeline Stage, Related Skills) and Layer 4 (7 anti-patterns covering the most common indexing mistakes)
- Added 12 machine-readable constraints (8 HARD for protocol requirements, 4 SOFT for best practices) enabling automated quality checking
- All 5 IDX requirements fully covered across the complete skill + 3 appendices

## Task Commits

Each task was committed atomically:

1. **Task 1: Create appendix-submission.md (Webmaster Tools Workflows)** - `4c57988` (feat)
2. **Task 2: Append Layers 3-4 and Machine-Readable Constraints to SKILL.md** - `a4bcf99` (feat)

## Files Created/Modified

- `skills/search-visibility/appendix-submission.md` - Step-by-step verification and sitemap submission workflows for GSC, Bing, Yandex, and Naver with all verification methods and unified Next.js shortcut
- `skills/search-visibility/SKILL.md` - Appended Layer 3 (Integration Context), Layer 4 (7 Anti-Patterns), and Machine-Readable Constraints (12 rows)

## Decisions Made

- All verification methods documented equally per platform (no single "recommended" method) -- per CONTEXT.md decision to present all options
- Unified Next.js verification shortcut consolidates all four platforms into a single `metadata.verification` export in `app/layout.tsx`
- Machine-readable constraints use HARD/SOFT enforcement split: HARD for protocol requirements (IndexNow spec, deprecated APIs), SOFT for best practices (llms.txt, webmaster verification)
- Google sitemap ping given HARD reject constraint -- despite being harmless (404 response), it creates false confidence that Google is being notified

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 16 (Indexing & Search Visibility) is COMPLETE: all 3 plans executed, all 5 IDX requirements covered
- Skill directory has 4 files: SKILL.md (579 lines) + appendix-ai-crawlers.md + appendix-llms-txt.md + appendix-submission.md
- IDX-01 (IndexNow auto-setup): Plan 01 Layer 2A
- IDX-02 (AI-aware robots.txt): Plan 02 appendix-ai-crawlers.md + Layer 2B
- IDX-03 (llms.txt): Plan 02 appendix-llms-txt.md + Layer 2B
- IDX-04 (Unified indexing strategy): Plan 01 Layer 1
- IDX-05 (Webmaster tools workflows): Plan 03 appendix-submission.md
- Ready for Phase 17 (API Integration Patterns) or Phase 18 (Dynamic OG Images)

---
*Phase: 16-indexing-search-visibility*
*Completed: 2026-02-25*
