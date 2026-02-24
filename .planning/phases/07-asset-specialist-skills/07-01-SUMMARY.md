---
phase: 07-asset-specialist-skills
plan: 01
subsystem: shape-generation
tags: [shape-asset-generation, procedural-shapes, SVG-animation, DrawSVG, MorphSVG, simplex-noise, beat-aware, DNA-constrained, archetype-palettes]

dependency_graph:
  requires: [01-02, 01-03, 01-05, 05-01]
  provides: [shape-asset-generation-skill, purpose-primary-shape-taxonomy, per-archetype-shape-palettes, beat-aware-shape-intensity, SVG-animation-suite, hybrid-generation-utilities]
  affects: [08-08]

tech_stack:
  added: [simplex-noise, GSAP-DrawSVG, GSAP-MorphSVG]
  patterns: [purpose-primary-taxonomy, beat-aware-intensity, hybrid-generation, seeded-procedural, DNA-color-enforcement]

file_tracking:
  key_files:
    created:
      - skills/shape-asset-generation/SKILL.md
    modified: []
    deleted:
      - skills/geometry-shapes/SKILL.md

decisions:
  - id: "07-01-01"
    decision: "1304 lines exceeds 700-900 target but all content substantive (25 code patterns across 5 categories, 19-archetype palette, full SVG animation suite, hybrid generation utilities)"
    rationale: "Comprehensive code patterns with DNA token usage require complete examples; reducing would sacrifice copy-paste readiness"
    confidence: HIGH
  - id: "07-01-02"
    decision: "Isometric/CSS pseudo-3D placed in shape skill (not 3D skill) per research recommendation"
    rationale: "CSS transforms are a shape/styling technique, not WebGL -- clear boundary at Canvas requirement"
    confidence: MEDIUM

metrics:
  duration: "6 min"
  completed: "2026-02-24"
---

# Phase 7 Plan 01: Shape & Asset Generation Skill Summary

**One-liner:** Purpose-primary shape taxonomy with 25 DNA-constrained patterns across 5 categories, per-archetype palettes for all 19 archetypes, beat-aware intensity mapping, full SVG animation suite (DrawSVG, MorphSVG, procedural noise, scroll-linked sequences), and hybrid generation utilities -- replacing v6.1.0 geometry-shapes.

## What Was Done

### Task 1: Write Shape & Asset Generation SKILL.md (4-layer format)
**Commit:** `ae07728`

Created `skills/shape-asset-generation/SKILL.md` (1304 lines) as a complete 2.0 domain skill replacing the v6.1.0 geometry-shapes skill.

**Key content delivered:**

**Layer 1 -- Decision Guidance:**
- **Shape Purpose Decision Tree** -- 5 purpose categories (dividers, backgrounds, accents, illustrations, SVG animation) with complexity guidance
- **Technique Selection Matrix** -- 14-row table mapping needs to CSS / SVG / Canvas/WebGL technique choices
- **Per-Archetype Shape Palette** -- All 19 archetypes with Primary, Secondary, Forbidden shape families and intensity levels (VERY LOW to HIGH)
- **Beat-Aware Shape Intensity** -- All 10 emotional arc beat types mapped to shape complexity (HOOK: bold/complex, BREATHE: minimal/none, PEAK: complex/animated)
- **DNA Color Enforcement** -- Correct patterns, forbidden patterns, computed color rules

**Layer 2 -- Award-Winning Examples (25 patterns):**
- **Category 1: Section Dividers** (4 patterns) -- Wave, Angled, Organic (procedural), Stepped
- **Category 2: Backgrounds & Atmospherics** (6 patterns) -- Dot Grid, Grid Lines, Noise Texture (feTurbulence), Gradient Mesh, Particle Field (Canvas), Animated Gradient
- **Category 3: Accents & Decorative** (5 patterns) -- Floating Shapes, Concentric Rings, Geometric Pattern, Line Art/Wireframe, Dot Matrix Text
- **Category 4: Hero Illustrations** (4 patterns) -- Procedural Blob (simplex-noise), Isometric Objects (CSS pseudo-3D), Abstract Composition, Branded Signature Shape
- **Category 5: SVG Animation Suite** (6 patterns) -- DrawSVG path drawing, MorphSVG shape morphing, Declarative SVG morph, Procedural animated noise, Animated SVG pattern, Scroll-linked SVG sequence
- **Hybrid Generation Approach** -- seededRandom(), dnaColor() helper, generateNoisePath() utility, algorithmic composition instructions

**Layer 3 -- Integration Context:**
- DNA Connection table (10 token mappings)
- Pipeline stage (section planner input, quality reviewer output)
- 7 related skill connections (cinematic-motion, emotional-arc, creative-tension, design-system-scaffold, 3D/WebGL Effects, design-dna, design-archetypes)
- Archetype variant groups (Minimal, Bold, Organic, Technical, Atmospheric)

**Layer 4 -- Anti-Patterns:**
- 7 anti-patterns: Hardcoded Hex Colors, Math.random() for Procedural, Shape Overload, CSS-Only Complex Organic, Wrong Shapes for Archetype, Hand-Rolling SVG Morph, Heavy Canvas/WebGL for Simple Patterns
- 10 machine-readable constraints (4 HARD, 6 SOFT)

### Task 2: Delete v6.1.0 geometry-shapes skill
**Commit:** `d819995`

Deleted `skills/geometry-shapes/SKILL.md` (321 lines) and its directory. The v6.1.0 skill used hardcoded hex colors, lacked DNA integration, had no archetype awareness, and no beat-aware intensity mapping. All useful patterns (clip-path shapes, SVG patterns, blob generation) are integrated into the new skill with proper DNA enforcement.

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | 1304 lines exceeds 700-900 target | All content substantive -- 25 code patterns, 19-archetype palette, full SVG animation suite, hybrid generation utilities. Each pattern includes complete code with DNA tokens, beat recommendation, and archetype compatibility. |
| 2 | Isometric/CSS pseudo-3D in shape skill | Per research recommendation: CSS transforms are a shape technique, not WebGL. Clear boundary: if it needs a `<Canvas>`, use the 3D skill. Cross-reference added. |

## Verification Results

| Check | Result |
|-------|--------|
| File exists and 600+ lines | PASS -- 1304 lines |
| YAML frontmatter with `tier: domain` and `version: "2.0.0"` | PASS |
| Contains all 4 layer headings | PASS -- Layer 1, 2, 3, 4 |
| Purpose-primary taxonomy (5 categories) | PASS -- Dividers, Backgrounds, Accents, Illustrations, Animation Suite |
| Per-archetype shape palette (19 archetypes) | PASS -- all 19 with Primary, Secondary, Forbidden, Intensity |
| Beat-aware shape intensity mapping (10 beats) | PASS -- HOOK through CLOSE |
| simplex-noise procedural generation | PASS -- 13 references |
| GSAP DrawSVG (no "paid"/"premium") | PASS -- 8 references, described as free |
| GSAP MorphSVG (no "paid"/"premium") | PASS -- 7 references, described as free |
| SVG feTurbulence noise overlay | PASS -- 4 references |
| DNA color enforcement section | PASS -- Correct/Forbidden pattern lists |
| ALL code uses DNA tokens (no hardcoded hex) | PASS -- 43 hsl(var(--color-*)) usages; hex only in Forbidden documentation |
| Isometric CSS pseudo-3D with 3D skill cross-reference | PASS -- 3 cross-references |
| Hybrid generation approach (utility functions) | PASS -- seededRandom, dnaColor, generateNoisePath |
| v6.1.0 geometry-shapes deleted | PASS -- directory does not exist |
| shape-asset-generation still exists | PASS |

## Commits

| Hash | Message |
|------|---------|
| ae07728 | feat(07-01): write shape-asset-generation skill with 4-layer format |
| d819995 | chore(07-01): delete v6.1.0 geometry-shapes skill (replaced by shape-asset-generation) |

## Next Phase Readiness

Plan 07-01 completes the Shape & Asset Generation skill, the first of 6 skills in Phase 7. The remaining skills are:
- 07-02: 3D/WebGL Effects (R3F, shaders, three-tier responsive)
- 07-03: Component Marketplace (category recommendations, restyling protocol)
- 07-04: Remotion Video (DNA-aware compositions, hero/product/social templates)
- 07-05: Spline Integration (embedding, events, DNA color mapping)
- 07-06: Image Prompt Generation (DNA-to-prompt translation, negative prompts)
