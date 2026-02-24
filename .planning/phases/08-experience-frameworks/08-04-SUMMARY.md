---
phase: 08-experience-frameworks
plan: 04
subsystem: dark-light-mode
tags: [dark-mode, light-mode, theme-toggle, archetype-transitions, FOUC, view-transitions, dual-palette, tailwind-v4]

dependency_graph:
  requires: [01-02, 01-03, 08-01]
  provides: [archetype-aware-dual-themes, FOUC-prevention-per-framework, signature-transition-animations, dual-asset-support]
  affects: [08-05, 08-06, 08-07, 08-08]

tech_stack:
  added: [next-themes, view-transitions-api, light-dark-css-function]
  patterns: [custom-variant-dark, class-based-dark-mode, view-transition-theme-switch, dual-palette-dna, opacity-vs-glow-shadows]

file_tracking:
  key_files:
    created:
      - skills/dark-light-mode/SKILL.md
    modified: []

decisions:
  - id: "08-04-01"
    description: "743 lines exceeds 500-600 target but all content substantive (19 archetype transitions with 3 full CSS implementations, 7 code patterns, dual depth model, accessible toggle component)"
    confidence: HIGH
  - id: "08-04-02"
    description: "View Transitions API (Baseline 2024) as primary transition mechanism with CSS fallback -- progressive enhancement, no JS library needed"
    confidence: HIGH
  - id: "08-04-03"
    description: "Positional transitions (Organic, Glassmorphism) use CSS custom properties --toggle-x/--toggle-y set from click event -- enables circle-expand from button position"
    confidence: HIGH

metrics:
  duration: "3 min"
  completed: "2026-02-24"
---

# Phase 08 Plan 04: Dark/Light Mode Skill Summary

**Archetype-aware dual-theme system with independently designed palettes, 19 signature transition animations, FOUC prevention across all frameworks, and dual asset support.**

## What Was Built

Created `skills/dark-light-mode/SKILL.md` (743 lines) -- a comprehensive 4-layer skill that replaces both `light-mode-patterns` and `premium-dark-ui` with a unified, archetype-aware dual-theme system.

### Key Capabilities

1. **Dual Palette Architecture** -- Both light and dark palettes are independently designed with 12 DNA tokens each. Neither is derived from the other. Both undergo anti-slop scoring independently.

2. **Complete Tailwind v4 Setup** -- `@custom-variant dark (&:where(.dark, .dark *))` with `@theme` for light tokens and `.dark` selector for dark overrides. Includes shadow system differences (opacity-based light, glow-based dark).

3. **FOUC Prevention** -- Framework-specific inline scripts for all 5 target frameworks:
   - Next.js: `next-themes` library
   - Astro: `is:inline` script in layout
   - React/Vite: inline in `index.html` `<head>`
   - Tauri/Electron: same React/Vite pattern

4. **19 Archetype Signature Transitions** -- Every archetype has a defined transition animation using the View Transitions API (Baseline 2024), from Brutalist's instant hard-cut to Japanese Minimal's 1000ms zen dissolve. Three transitions have full CSS implementation examples (Ethereal bloom, Kinetic wipe, Organic circle-expand).

5. **Dual Asset Support** -- Three approaches: CSS `light-dark()` for background images, `<picture>` with media query, and class-based `dark:hidden`/`dark:block`. Automatic photo dimming with opt-out via `[data-theme-aware]`.

6. **Depth Model Differences** -- Light mode uses shadow-based depth (increasing shadow intensity), dark mode uses luminance-based depth (increasing surface brightness) with colored glow accents.

7. **Accessible Toggle Component** -- Full implementation with `aria-label`, keyboard operability, system preference sync, hydration-safe mounting, and positional transition support.

## Verification Results

| Criterion | Result |
|-----------|--------|
| File exists, 450+ lines | PASS (743 lines) |
| All 4 layer headings | PASS |
| `@custom-variant dark` present | PASS (4 occurrences) |
| FOUC prevention for 3+ frameworks | PASS (5 frameworks) |
| 10+ archetype transitions | PASS (all 19) |
| Dual asset support patterns | PASS (light-dark, picture, class-based) |
| Shadow system differences | PASS (opacity vs glow documented) |
| No `darkMode: 'class'` as recommendation | PASS (anti-pattern only) |

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **743 lines exceeds 500-600 target** -- Content is substantive: 7 code patterns (Tailwind setup, FOUC x4 frameworks, transitions, assets, depth, toggle, system sync), 19 archetype transitions with 3 full CSS implementations, and accessible toggle component. No padding or redundancy.

2. **View Transitions API as primary** -- Uses the native browser View Transitions API (Baseline 2024 for same-document) as the primary transition mechanism. CSS property transitions as fallback. No Motion library dependency for theme switching.

3. **Positional transitions via CSS custom properties** -- Archetypes like Organic (circle-expand) and Glassmorphism (frosted spread) use `--toggle-x`/`--toggle-y` CSS custom properties set from the click event to animate from the toggle button position.

## Commit Log

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `3ae4053` | Create dark/light mode skill |

## Next Phase Readiness

Dark/light mode skill provides the dual-theme foundation referenced by all subsequent framework skills (08-05 through 08-07) and the skill rewrites (08-08).
