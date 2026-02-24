---
phase: 07-asset-specialist-skills
plan: 02
subsystem: 3d-webgl-effects
tags: [3d, webgl, r3f, shaders, three-tier-responsive, scroll-driven, webgpu, post-processing]

dependency-graph:
  requires: [01-02, 05-01, 05-05]
  provides: [three-d-webgl-effects-skill]
  affects: [08-08]

tech-stack:
  added: []
  patterns: [three-tier-responsive-3d, shader-building-blocks, csm-material-extension, scroll-driven-3d, dna-guided-materials]

key-files:
  created:
    - skills/three-d-webgl-effects/SKILL.md
  modified: []
  deleted:
    - skills/three-js-webgl/SKILL.md

decisions:
  - id: 07-02-01
    decision: "1138 lines exceeds 800-1000 target but all content substantive (full simplex noise implementation, 5 scroll-driven patterns, 12 archetype variants)"
    confidence: HIGH
  - id: 07-02-02
    decision: "Complete simplex noise GLSL implementation included inline in Tier 1 noise displacement -- builders need copy-paste ready shader code"
    confidence: HIGH
  - id: 07-02-03
    decision: "Post-processing archetype mapping table (8 archetypes x 4 effects) included for direct builder reference"
    confidence: HIGH

metrics:
  duration: "5 min"
  completed: "2026-02-24"
---

# Phase 7 Plan 2: 3D/WebGL Effects Skill Summary

**One-liner:** R3F v9 3D/WebGL skill with composable shader building blocks, mandatory three-tier responsive pattern, scroll-driven 3D (camera + scene), DNA-guided materials with creative freedom, and WebGPU forward-looking documentation.

## What Was Done

### Task 1: Write 3D/WebGL Effects SKILL.md (4-layer format)
**Commit:** `cfda1e1`
**Files:** `skills/three-d-webgl-effects/SKILL.md` (1138 lines)

Created the complete 3D/WebGL effects skill as the single authority on 3D and WebGL in Modulo 2.0.

**Layer 1 -- Decision Guidance (~90 lines):**
- 5-question decision framework for when to use 3D vs CSS
- Three-tier responsive 3D table (mandatory for ALL 3D content)
- 3D-specific performance budgets (triangle count, texture memory, draw calls per tier)
- DNA material guidance with two-tier color authority (tokens for primary, creative freedom for computed)
- Technology stack table with R3F v9 as production standard

**Layer 2 -- Award-Winning Examples (~830 lines):**
- Section A: Core R3F setup (Next.js dynamic import, Astro island, three-tier responsive component, basic Canvas)
- Section B: Shader building blocks in 3 tiers:
  - Tier 1 (full code): Noise displacement with CSM, particle field, glass material
  - Tier 2 (pattern + setup): Liquid/fluid distortion, holographic/iridescent, post-processing chain
  - Tier 3 (guidance + reference): Volumetric fog, ray marching, custom post-processing
- Section C: drei helpers (Float, Environment, OrbitControls, Html, Detailed, ContactShadows)
- Section D: Scroll-driven 3D (camera orbit, camera zoom, material changes, geometry morphing, element reveals)
- Section E: WebGPU forward-looking (browser support table, import path, async init, R3F v10 alpha)

**Layer 3 -- Integration Context (~50 lines):**
- DNA token mapping (9 tokens with 3D usage)
- Archetype variants table (12 archetypes with 3D approach, environment, post-processing, signature)
- Related skills cross-references (6 skills)

**Layer 4 -- Anti-Patterns (~60 lines):**
- 7 anti-patterns: loading R3F on mobile, raw Three.js in React, full ShaderMaterial from scratch, no SSR disabling, mixing import paths, hardcoded colors, no post-processing merging

**Machine-Readable Constraints:**
- 10 parameters for automated checking (triangle count, texture memory, draw calls, FPS, canvas instances per tier)

### Task 2: Delete v6.1.0 three-js-webgl skill
**Commit:** `2bd2510`
**Files deleted:** `skills/three-js-webgl/SKILL.md` (311 lines removed)

Removed the outdated v6.1.0 skill that used raw Three.js, hardcoded hex colors (#8b5cf6), no progressive enhancement, no responsive tiers, and no DNA integration.

## Decisions Made

1. **[07-02-01] 1138 lines exceeds target** -- All content substantive. The noise displacement shader requires a full simplex noise GLSL implementation (~50 lines). Five scroll-driven 3D patterns each need complete code. Twelve archetype variants need the mapping table. Comparable to Phase 5's creative-tension (998 lines) and cinematic-motion (705 lines) which were also complex domain skills.

2. **[07-02-02] Complete simplex noise GLSL inline** -- Builders need copy-paste ready shader code. Referencing an external noise library or telling them to "import simplex noise" does not work in GLSL -- the function must be inlined in the vertex shader string.

3. **[07-02-03] Post-processing archetype mapping** -- 8 archetypes with 4 effect columns (Bloom, Noise, Vignette, DOF) gives builders direct reference for which effects suit which archetype personality. Clean archetypes (Swiss, Japanese Minimal) explicitly show "No" for most effects.

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

| Check | Status |
|-------|--------|
| File exists and is 700+ lines | PASS (1138 lines) |
| YAML frontmatter with tier: domain, version: 2.0.0 | PASS |
| All 4 layer headings present | PASS |
| Three-tier responsive with dynamic import and useMediaQuery | PASS |
| 'use client' in code examples | PASS (14 occurrences) |
| ssr: false in Next.js patterns | PASS (5 occurrences) |
| Shader building blocks as Tier 1/2/3 | PASS |
| Noise displacement with CSM (csm_Position) | PASS (4 occurrences) |
| EffectComposer from @react-three/postprocessing | PASS (9 occurrences) |
| Scroll-driven 3D with drei useScroll | PASS (12 occurrences) |
| WebGPU section with browser support table | PASS |
| await renderer.init() in WebGPU section | PASS |
| 3D performance budget table | PASS |
| R3F v9 as production recommendation | PASS |
| No raw Three.js scene management in examples | PASS (only in anti-pattern) |
| No hardcoded hex colors in examples | PASS (only in anti-pattern) |
| v6.1.0 three-js-webgl directory deleted | PASS |
| three-d-webgl-effects still exists after deletion | PASS |

## Next Phase Readiness

No blockers. The 3D/WebGL effects skill is complete and the v6.1.0 replacement is deleted. Remaining Phase 7 plans (07-01) can proceed independently.
