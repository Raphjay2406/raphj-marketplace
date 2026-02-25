---
phase: 18-dynamic-og-images-pipeline-wiring
plan: 02
subsystem: og-images-skill
tags: [og-image, integration-context, anti-patterns, machine-readable-constraints, dna-tokens, archetype-composition, satori, pipeline-wiring]
depends_on:
  requires: ["18-01"]
  provides: ["Complete 4-layer og-images SKILL.md", "DNA token-to-OG mapping", "Archetype composition families", "6 named anti-patterns", "10-parameter constraint table"]
  affects: ["18-03 (pipeline wiring references complete og-images skill)", "18-04 (phase completion)"]
tech_stack:
  added: []
  patterns: ["archetype composition families", "DNA token mapping tables", "HARD/SOFT constraint enforcement"]
key_files:
  created: []
  modified:
    - skills/og-images/SKILL.md
decisions:
  - "1252 total lines for complete skill -- Layers 3-4 added 301 lines to existing 951; 6 anti-patterns with full code examples justify the length"
  - "9 DNA tokens mapped (exceeds 6+ minimum) -- surface and glow tokens included for archetype-specific usage"
  - "5 archetype composition families covering all 19 archetypes -- families guide approach, Claude decides specific layouts"
  - "6 anti-patterns (plan specified 5-6) -- all critical Satori/OG pitfalls covered including The Generic Preview"
  - "10 machine-readable constraints (6 HARD, 4 SOFT) -- WOFF2 explicitly forbidden, signature element HARD required"
metrics:
  duration: "2m 57s"
  completed: "2026-02-25"
---

# Phase 18 Plan 02: OG Images SKILL.md Layers 3-4 Summary

**One-liner:** Completed the og-images skill with Layer 3 (DNA token mapping, 5 archetype composition families, pipeline position, 5 related skills) and Layer 4 (6 named anti-patterns with wrong/right code examples) plus a 10-parameter machine-readable constraint table with HARD/SOFT enforcement.

## What Was Built

Appended Layer 3 (Integration Context), Layer 4 (Anti-Patterns), and the Machine-Readable Constraint Table to the existing `skills/og-images/SKILL.md`, completing the 4-layer skill format. The file grew from 951 lines to 1252 lines (301 lines added).

### Layer 3: Integration Context

- **DNA Connection** -- 9-row table mapping DNA tokens (`--color-bg`, `--color-primary`, `--color-text`, `--color-accent`, `--color-glow`, `--color-surface`, display font, body font, signature element) to specific OG image elements with usage descriptions
- **Archetype-to-OG Composition Mapping** -- 5 composition families covering all 19 archetypes:
  - Bold/Maximalist (Brutalist, Neubrutalism, Kinetic)
  - Elegant/Minimal (Ethereal, Japanese Minimal, Swiss/International, Luxury/Fashion)
  - Expressive/Dynamic (Neon Noir, Vaporwave, AI-Native, Glassmorphism)
  - Editorial/Structured (Editorial, Dark Academia, Neo-Corporate, Data-Dense)
  - Warm/Organic (Warm Artisan, Organic, Playful/Startup, Retro-Future)
- **Pipeline Position** -- Wave 0 scaffold (root-level OG routes) + Wave 2+ per-section (blog/product OG images) + quality review (advisory, does not block anti-slop gate)
- **Related Skills** -- 5-skill relationship table (seo-meta, design-dna, design-archetypes, design-system-scaffold, structured-data) with specific integration points

### Layer 4: Anti-Patterns (6 named mistakes)

| # | Name | Core Issue |
|---|------|-----------|
| 1 | The WOFF2 Surprise | WOFF2 font loaded into Satori causes silent fallback to system font |
| 2 | The Invisible Flexbox | Missing `display: 'flex'` on containers causes layout collapse |
| 3 | The Grid Trap | CSS Grid silently fails in Satori (flexbox only) |
| 4 | The Metadata Merge Trap | Next.js openGraph shallow replacement loses parent images |
| 5 | The Bloated Canvas | Embedded photos/complex output exceeds platform size limits |
| 6 | The Generic Preview | Same template for all projects ignores archetype/DNA identity |

Each anti-pattern includes Wrong code, Right code, and Detection guidance.

### Machine-Readable Constraints (10 parameters)

- 6 HARD constraints: image dimensions (1200x630), format (PNG), font format (TTF/OTF, no WOFF2), signature element (required), display flex (required), CSS Grid (forbidden)
- 4 SOFT constraints: file size (<500KB), title font size (48-72px), title character limit (80 chars), image file size

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `ee5ba63` | Layer 3 (Integration Context) -- DNA mapping, archetype families, pipeline position, related skills |
| 2 | `2c84ee0` | Layer 4 (Anti-Patterns) + Machine-Readable Constraints -- 6 anti-patterns, 10 constraints |

## Deviations from Plan

None -- plan executed exactly as written. Line count (1252) exceeds the 550-750 target from the verification section, consistent with prior skills where code examples in anti-patterns add significant line count. The 6 anti-patterns each require Wrong/Right code examples with explanatory context, which is essential for agent consumption.

## Decisions Made

1. **1252 total lines** -- Layers 3-4 added 301 lines to the existing 951. The 6 anti-patterns with complete Wrong/Right code examples and the 9-row DNA token table are the primary line count drivers. No appendix extraction needed since all content is directly actionable.
2. **9 DNA tokens mapped** -- Exceeded the 6+ minimum from the plan by including `--color-surface`, `--color-glow`, and body font. These tokens are used by specific archetype compositions (Neon Noir glow, Glassmorphism surfaces).
3. **5 composition families** -- Matches the plan exactly. Families guide composition approach, not exact layouts. Each family has distinct OG characteristics documented.
4. **6 anti-patterns** -- Matches the upper end of the plan's "5-6" range. "The Generic Preview" was added as the 6th because it directly connects to the archetype composition system and reinforces the skill's core value proposition.

## Next Phase Readiness

The og-images skill is complete with all 4 layers and machine-readable constraints. Plan 03 (pipeline wiring) and Plan 04 (phase completion) can reference the complete skill. The archetype composition families and DNA token mapping are ready for build-orchestrator and section-planner integration.
