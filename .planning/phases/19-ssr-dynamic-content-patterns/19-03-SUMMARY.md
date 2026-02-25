---
phase: 19-ssr-dynamic-content-patterns
plan: 03
subsystem: rendering-strategy
tags: [integration-context, anti-patterns, constraints, dna-connection, archetype-variants, loading-states, skeleton-ui, quality-reviewer]
depends_on:
  requires:
    - phase: 19-02
      provides: "ssr-dynamic-content SKILL.md Layers 1-2 complete (1706 lines)"
  provides:
    - "Layer 3: DNA Connection with 6 token mappings for loading states and draft banners"
    - "Layer 3: Archetype Variants with 8 groups for skeleton/shimmer/banner personality"
    - "Layer 3: Pipeline Stage with Wave 0/1/2+ positioning"
    - "Layer 3: Related Skills with 9 cross-references"
    - "Layer 4: 10 anti-patterns covering the most dangerous SSR/caching mistakes"
    - "Machine-Readable Constraints table with 14 enforceable parameters (10 HARD, 4 SOFT)"
    - "Complete 4-layer Domain-tier ssr-dynamic-content skill (1842 lines)"
  affects:
    - "quality-reviewer agent (uses constraint table for automated checking)"
    - "section-builder agent (uses archetype variants for loading state styling)"
tech-stack:
  added: []
  patterns:
    - "Archetype-specific loading states (skeleton, shimmer, draft banner)"
    - "DNA-coupled skeleton colors (--color-bg, --color-surface, --color-border, --color-muted)"
    - "Cross-skill delegation (api-patterns for webhooks, seo-meta for sitemap, search-visibility for IndexNow)"
key-files:
  created: []
  modified:
    - "skills/ssr-dynamic-content/SKILL.md"
decisions:
  - "19-03: Complete skill at 1842 lines -- Layers 3-4 added only 136 lines to existing 1706; anti-patterns and constraints are lean"
  - "19-03: 10 HARD + 4 SOFT constraints -- experimental.ppr and middleware.ts most critical (silent failures), getSession most security-critical (auth bypass)"
  - "19-03: 8 archetype groups cover all 19 archetypes -- Organic/Warm Artisan mapped to closest personality match"
  - "19-03: 9 related skills documented with explicit boundary definitions (what THIS skill does vs what the RELATED skill does)"
metrics:
  duration: "3m 06s"
  completed: "2026-02-25"
---

# Phase 19 Plan 03: SSR Dynamic Content Layers 3-4 + Constraints Summary

**Layer 3 Integration Context (DNA connections, archetype loading states, 9 related skills) + Layer 4 Anti-Patterns (10 dangerous SSR/caching mistakes) + 14 machine-readable constraints (10 HARD, 4 SOFT) completing the ssr-dynamic-content Domain-tier skill**

## Performance

- **Duration:** 3m 06s
- **Started:** 2026-02-25T04:40:34Z
- **Completed:** 2026-02-25T04:43:40Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Layer 3 Integration Context wiring ssr-dynamic-content into the Modulo system with DNA token mappings, archetype-specific loading state variants, pipeline positioning, and comprehensive related skill cross-references
- Layer 4 Anti-Patterns documenting the 10 most dangerous SSR/caching mistakes with correct alternatives referencing specific Layer 2 patterns
- Machine-Readable Constraints table with 14 enforceable parameters for quality-reviewer agent automation
- Complete 4-layer Domain-tier skill at 1842 lines covering rendering strategy decision guidance, 27 code patterns, CMS webhook revalidation, auth-gated content, and cache strategy

## Task Commits

Each task was committed atomically:

1. **Task 1: Layer 3 (Integration Context)** - `70294a1` (feat)
2. **Task 2: Layer 4 (Anti-Patterns) + Machine-Readable Constraints** - `7bbf4d5` (feat)

## Files Created/Modified

- `skills/ssr-dynamic-content/SKILL.md` - Appended Layer 3 (50 lines) and Layer 4 + constraints (87 lines). Total: 1842 lines (all 4 layers + constraints complete)

## Decisions Made

1. **1842 lines for complete skill** -- Above the 1100-1600 estimate. Layers 3-4 added only 136 lines to the existing 1706; the overshoot comes entirely from Layers 1-2 which were justified by 27 patterns across 8 categories. Layers 3-4 themselves are lean.

2. **10 HARD + 4 SOFT constraints** -- The experimental.ppr and middleware.ts constraints are the most critical (code silently fails in Next.js 16). The getSession constraint is the most security-critical (creates an auth bypass vulnerability). SOFT constraints cover best practices that are correct but suboptimal.

3. **8 archetype groups cover all 19 archetypes** -- Two remaining archetypes (Organic, Warm Artisan) mapped to closest personality match in a note below the table rather than adding 2 more rows.

4. **9 related skills with explicit boundaries** -- Each cross-reference clearly defines what THIS skill does vs what the RELATED skill does, preventing scope confusion between overlapping skills.

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## Full Phase Verification

All 7 roadmap success criteria verified as covered across the complete skill:

| Criteria | Coverage |
|----------|----------|
| Decision guidance | Layer 1 decision matrix + 10 scenario recipes |
| ISR/revalidation | Layer 2A invalidation patterns + Layer 2B CMS webhooks |
| Streaming SSR | Layer 1 streaming concept + Layer 2A Suspense pattern |
| Auth-gated content | Layer 2B mixed-page approaches + 4 auth library patterns + proxy.ts |
| Cache strategy | Layer 1 4-layer cache breakdown + Layer 2A Cache-Control headers + cacheLife profiles |
| CMS integration | Layer 2B 5-platform webhook patterns + draft mode + SEO bridge |
| Database-driven pages | Layer 2A connection pooling + Layer 1 scenario recipes |

## Next Phase Readiness

Phase 19 is complete. The ssr-dynamic-content skill is a self-contained Domain-tier knowledge base ready for use by the section-builder and specialist agents. No further plans needed for this phase.

The v1.5 roadmap is complete with all 18 plans across Phases 14-19 executed.

---
*Phase: 19-ssr-dynamic-content-patterns*
*Completed: 2026-02-25*
