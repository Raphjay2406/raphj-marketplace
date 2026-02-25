---
phase: 18-dynamic-og-images-pipeline-wiring
plan: 01
subsystem: og-images-skill
tags: [og-image, social-preview, opengraph, satori, next-og, imageresponse, sharp, resvg, satori-html, dna-tokens, signature-element, template-types, font-loading]
depends_on:
  requires: []
  provides: ["og-images SKILL.md Layers 1-2", "Next.js opengraph-image.tsx file convention pattern", "Astro SSG/SSR Satori+sharp endpoints", "3 template types with archetype guidance", "5 signature element patterns", "Satori CSS reference"]
  affects: ["18-02 (Layers 3-4 and constraints)", "18-03 (pipeline wiring -- og-images referenced by build-orchestrator)"]
tech_stack:
  added: []
  patterns: ["file convention opengraph-image.tsx", "satori-html template literals", "readFile font loading", "convention-based template auto-detection", "DNA token integration for OG images"]
key_files:
  created:
    - skills/og-images/SKILL.md
  modified: []
decisions:
  - "951 lines for Layers 1-2 (above 450-600 target) -- 17 code patterns across 7 sections with complete examples for both frameworks justify the length"
  - "Sharp recommended over resvg-js for Astro (no Vite config needed, broader ecosystem support)"
  - "Font loading documented as the #1 pain point -- placed first in Layer 2"
  - "5 signature element patterns (orb, slash, bar, corner, dots) all verified against Satori CSS constraints"
  - "Template auto-detection uses regex matching on route pathname with explicit override support"
metrics:
  duration: "4m 00s"
  completed: "2026-02-25"
---

# Phase 18 Plan 01: OG Images SKILL.md Layers 1-2 Summary

**One-liner:** Domain-tier og-images skill with DNA token mapping, framework decision tree, and 17 code patterns for branded 1200x630 social previews using next/og ImageResponse (Next.js) and Satori+sharp (Astro), with 3 archetype-influenced template types and convention-based auto-detection.

## What Was Built

Created `skills/og-images/SKILL.md` (951 lines) containing YAML frontmatter, Layer 1 (Decision Guidance), and Layer 2 (Award-Winning Examples). The skill is Domain-tier, loaded per project for public-facing sites that need branded social preview images generated from Design DNA tokens.

### Layer 1: Decision Guidance

- **When to Use / When NOT to Use** -- 4 trigger conditions and 5 redirect cases (seo-meta for meta tags, skip for Tauri/Electron/private dashboards/SPAs)
- **DNA Token Mapping** -- bg (canvas), primary (signature element), text (title), accent/glow (sparingly), display font (64px fixed), signature element (always included)
- **Template Types and Auto-Detection** -- 3 types (article, landing, product) with convention-based route matching and explicit override via metadata/frontmatter
- **Framework Decision Tree** -- Next.js file convention (recommended), Astro SSG with getStaticPaths, Astro SSR on-demand, React/Vite SPA (not applicable)
- **Satori Constraints Summary** -- 9-row quick reference (flexbox only, no WOFF2, inline styles, no hooks, no z-index, no calc, no CSS vars, 1200x630 PNG)
- **Pipeline Connection** -- Wave 0 scaffold + Wave 2+ per-section, input from DESIGN-DNA.md

### Layer 2: Code Patterns (17 patterns across 7 sections)

| Section | Patterns | Coverage |
|---------|----------|----------|
| A. Font Loading | 3 | Next.js readFile, Astro readFileSync, shared font config object |
| B. Next.js Patterns | 3 | File convention (primary), root-level default, API route alternative |
| C. Astro Patterns | 3 | SSG with getStaticPaths, SSR on-demand, resvg-js alternative with Vite config |
| D. Template Types | 4 | Auto-detection utility, article template, landing page template, product template |
| E. Signature Elements | 5 | Gradient orb, diagonal slash, accent bar, corner accent, dotted pattern |
| F. Satori CSS Reference | 2 | Fully supported properties table, not supported properties with workarounds |
| G. Platform Requirements | 1 | 6-platform OG image spec table (1200x630, PNG, <500KB universal standard) |

### Key Technical Decisions in Code

- Next.js patterns use `await params` (v16 Promise-based params)
- All font loading is local filesystem only (no HTTP fetching at render time)
- Astro uses `fontData.buffer` (ArrayBuffer) for Satori, not Buffer directly
- Every template includes the DNA signature element for brand consistency
- Archetype composition guidance provided per template (Brutalist, Ethereal, Editorial examples)

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `a1b62bf` | Frontmatter + Layer 1 (Decision Guidance) |
| 2 | `fe5e41f` | Layer 2 (17 code patterns across all 7 sections) |

## Deviations from Plan

None -- plan executed exactly as written. Line count (951) exceeds the 450-600 target, consistent with prior skills that have high pattern counts (seo-meta at 928, structured-data at 1091, api-patterns at 1476 for Layers 1-2). The 17 required code patterns with complete examples for both frameworks justify the length.

## Decisions Made

1. **951 lines for Layers 1-2** -- Above the 450-600 target, but 17 code patterns with complete examples for both Next.js and Astro, 3 full template types with archetype guidance, 5 signature element patterns, and Satori CSS reference tables require space. No appendix extraction needed.
2. **Sharp over resvg-js** -- Sharp is recommended for Astro due to broader ecosystem support and no Vite configuration needed. Resvg-js documented as alternative with required Vite config.
3. **Font loading as first section** -- Placed before framework patterns because it is the #1 Satori pain point per research. Both frameworks covered with distinct patterns (async readFile for Next.js, sync readFileSync with .buffer for Astro).

## Next Phase Readiness

Plan 02 can append Layers 3-4 directly below the `<!-- Layers 3-4 and Machine-Readable Constraints added by Plan 02 -->` comment at line 951. The file structure is clean and ready for integration context (DNA connection, archetype variants, related skills) and anti-patterns + machine-readable constraints.
