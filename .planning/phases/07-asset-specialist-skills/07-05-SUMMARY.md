---
phase: 07-asset-specialist-skills
plan: 05
subsystem: spline-integration
tags: [spline, 3d-embedding, react-spline, dna-mapping, r3f-bridge, performance]

dependency-graph:
  requires: [01-02, 01-03, 05-05]
  provides: [spline-integration-skill]
  affects: [08-08]

tech-stack:
  added: []
  patterns: [lazy-spline-loading, dna-color-mapping-onload, r3f-bridge-spline, three-tier-responsive-3d, spline-naming-convention]

file-tracking:
  key-files:
    created:
      - skills/spline-integration/SKILL.md
    modified: []

decisions:
  - id: spline-422-lines
    decision: "422 lines slightly exceeds 300-400 target but all content substantive (7 code patterns, scene creation guidance, 6 anti-patterns)"
    confidence: HIGH

metrics:
  duration: "3 min"
  completed: "2026-02-24"
---

# Phase 7 Plan 5: Spline Integration Skill Summary

**One-liner:** Spline 3D scene embedding skill with programmatic DNA color mapping via findObjectByName, R3F bridge for post-processing, and archetype-aware scene creation guidance.

## What Was Built

Created `skills/spline-integration/SKILL.md` (422 lines) -- a domain-tier skill teaching builders how to embed, optimize, and create Spline 3D scenes that integrate with Design DNA.

### Layer 1: Decision Guidance (~55 lines)
- Spline vs R3F decision tree: Spline is designer-first (visual editor), R3F is developer-first (code-first), R3F Bridge combines both
- When Spline Is Appropriate table: 8 use cases with YES/NO guidance
- Performance awareness: .splinecode files are 5-50MB, lazy loading is mandatory
- Pipeline connection: referenced by section builders during Wave 2+ execution

### Layer 2: Award-Winning Examples (~215 lines)
- **Basic Embedding** -- React.lazy + Suspense with DNA-styled placeholder
- **Next.js SSR** -- `@splinetool/react-spline/next` for blurred placeholder
- **DNA Color Mapping** -- `onLoad` + `findObjectByName` with `DNA_` naming convention and HSL-to-RGB conversion helper
- **Event Handling** -- `onSplineMouseDown`, `onSplineMouseHover`, programmatic event emission via `emitEvent`
- **R3F Bridge** -- `@splinetool/r3f-spline` with EffectComposer for post-processing on Spline scenes
- **Performance Checklist** -- 10-item checklist covering lazy loading, self-hosting, renderOnDemand, mobile fallback
- **Scene Creation Guidance** -- Camera angles, lighting profiles, materials, and animation intensity mapped to archetype families

### Layer 3: Integration Context (~30 lines)
- DNA Connection table: 7 DNA tokens mapped to Spline usage
- Related skills: 3D/WebGL Effects, Performance-Aware Animation, Wow Moments, Design DNA, Design Archetypes, Emotional Arc
- Pipeline stage: input from section PLAN.md, output to built section with embedded Spline scene

### Layer 4: Anti-Patterns (~60 lines)
- Eager Spline Loading (blocks FCP with 5-50MB download)
- Spline Default Hosting in Production (no cache control, external dependency)
- No Mobile Fallback (battery drain, imprecise touch)
- Unnamed Objects (fragile programmatic access)
- Continuous Render for Static Scenes (wasted GPU)
- Hardcoded Colors in Spline Scenes (breaks DNA propagation)

### Machine-Readable Constraints
- 8 parameters: splinecode-file-size, lazy-load-required, suspense-placeholder, mobile-fallback-breakpoint, render-on-demand-default, self-host-production, dna-naming-convention, scene-load-time

## Decisions Made

1. **422 lines exceeds 300-400 target:** All content is substantive -- 7 code patterns plus scene creation guidance and 6 anti-patterns required the extra lines. No filler content.

## Deviations from Plan

None -- plan executed exactly as written.

## Commits

| # | Hash | Message |
|---|------|---------|
| 1 | a37b2e8 | feat(07-05): write Spline Integration skill with DNA color mapping, R3F bridge, and scene creation guidance |

## Verification Results

| Criterion | Result |
|-----------|--------|
| File exists and is 250+ lines | PASS (422 lines) |
| YAML frontmatter with tier: domain, version: 2.0.0 | PASS |
| All 4 layer headings present | PASS |
| Spline vs R3F decision guidance | PASS |
| Basic embedding with lazy/Suspense | PASS (21 matches) |
| Next.js SSR with @splinetool/react-spline/next | PASS (4 matches) |
| DNA color mapping via onLoad + findObjectByName | PASS (8 matches) |
| Event handling (onSplineMouseDown, onSplineMouseHover) | PASS (5 matches) |
| R3F bridge (@splinetool/r3f-spline) | PASS (4 matches) |
| Performance optimization checklist | PASS |
| Scene creation guidance (camera, lighting, materials) | PASS |
| DNA_ prefix naming convention | PASS (13 matches) |
| Three-tier responsive with mobile fallback | PASS (7 matches) |

## Next Phase Readiness

Plan 07-05 is complete. No blockers for remaining phase 7 plans. The Spline skill cross-references 3D/WebGL Effects (07-02) and Performance-Aware Animation (05-05) correctly.
