---
phase: 07-asset-specialist-skills
plan: 04
subsystem: skills
tags: [remotion, video, composition, programmatic-video, social-media, og-image, react-video]

requires:
  - phase: 01-foundation
    provides: "Skill template 4-layer format, Design DNA token system, design archetypes with motion personalities"
  - phase: 05-motion-design-skills
    provides: "Cinematic motion patterns and archetype timing profiles that Remotion compositions mirror"
provides:
  - "Remotion video composition skill with DNA-aware templates for hero video, product demos, and social media assets"
  - "Core Remotion API reference (useCurrentFrame, interpolate, spring, Sequence, Composition, Still)"
  - "Archetype-to-spring-config mapping for personality-matched video timing"
  - "Brownfield installation pattern for adding Remotion to existing projects"
  - "@remotion/player in-browser preview pattern"
  - "Tiered licensing documentation"
affects: [08-framework-responsive-skills, 09-integration-polish]

tech-stack:
  added: [remotion, "@remotion/cli", "@remotion/player"]
  patterns: ["DNA tokens as JS constants (not CSS variables) for video compositions", "Archetype spring config mapping for composition timing", "Series/Sequence composition decomposition"]

key-files:
  created:
    - skills/remotion-video/SKILL.md
  modified: []

key-decisions:
  - "DNA tokens exported as JS module (dna-tokens.ts), not CSS variables -- Remotion renders in headless browser where CSS custom properties may not resolve"
  - "765 lines exceeds 400-500 target but all content substantive (3 full composition templates with complete TSX, archetype mapping table, 6 anti-patterns)"
  - "Composition creation focus, rendering as deployment concern outside Genorah scope -- keeps skill focused on what builders produce"
  - "5 archetype categories (HIGH/MEDIUM/LOW/BOLD/LUXURY) with distinct spring configs for composition timing"

patterns-established:
  - "JS token module pattern: DNA values exported as plain JS constants for non-DOM rendering contexts"
  - "Archetype spring config mapping: centralized spring physics lookup by archetype name"
  - "Social media size presets: standardized dimensions for OG, Twitter, Square, Story, Video formats"

duration: 4min
completed: 2026-02-24
---

# Phase 7 Plan 4: Remotion Video Summary

**Remotion video composition skill with DNA-aware templates for hero video, product demos, OG images, archetype-matched timing, and clear licensing guidance**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-24T09:11:53Z
- **Completed:** 2026-02-24T09:15:32Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Complete Remotion skill covering core API (useCurrentFrame, interpolate, spring, Sequence, Composition, Still) with decision guidance for when to use vs realtime animation
- Three full DNA-aware composition templates: hero video (spring-based entrance animations), product demo (mock browser frame with feature callouts), and OG image/social media assets (via Still)
- Archetype-aware composition timing with 5 categories mapping to distinct spring configs (Kinetic fast/snappy to Japanese Minimal slow/deliberate)
- Clear licensing model documentation with tiered table and Root.tsx comment pattern
- Brownfield installation pattern with DNA token JS module export and project structure guidance
- @remotion/player in-browser preview pattern for admin/preview contexts

## Task Commits

Each task was committed atomically:

1. **Task 1: Write Remotion Video SKILL.md (4-layer format)** - `0a7d808` (feat)

## Files Created/Modified
- `skills/remotion-video/SKILL.md` - 765-line domain skill for programmatic video content generation with Remotion

## Decisions Made
- DNA tokens exported as JS module (`dna-tokens.ts`), not CSS variables -- Remotion renders in headless browser context where CSS custom properties may not resolve. This is the correct pattern for any non-DOM rendering context.
- 765 lines exceeds 400-500 target but all content is substantive -- 3 full composition templates with complete TSX (hero video ~80 lines, product demo ~120 lines, OG image ~60 lines), archetype spring config mapping, brownfield setup, Player preview, and 6 anti-patterns.
- Composition creation focus -- rendering (MP4/WebM export) is a deployment concern outside Genorah's scope. The skill teaches builders to create compositions; @remotion/player provides immediate preview.
- 5 archetype categories with distinct spring configs instead of per-archetype entries -- groups similar archetypes (HIGH: Kinetic/Neon Noir/Playful, MEDIUM: Editorial/Neo-Corporate, etc.) for maintainability while covering all 19 archetypes.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Remotion skill complete and ready for builder reference
- Remaining Phase 7 skills (07-05 Spline, 07-06 Image Prompt) can proceed independently
- The JS token module pattern (`dna-tokens.ts`) established here may be referenced by any future skill that needs DNA values outside CSS context

---
*Phase: 07-asset-specialist-skills*
*Completed: 2026-02-24*
