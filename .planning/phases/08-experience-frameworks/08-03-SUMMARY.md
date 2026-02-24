---
phase: 08-experience-frameworks
plan: 03
subsystem: accessibility
tags: [accessibility, WCAG, ARIA, keyboard, focus, reduced-motion, color-contrast, archetype]

dependency_graph:
  requires: [01-03, 01-06, 05-01]
  provides: [accessibility-standards, archetype-focus-indicators, reduced-motion-per-archetype, ARIA-component-patterns]
  affects: [08-08, 09-01]

tech_stack:
  added: []
  patterns: [archetype-styled-focus-indicators, per-archetype-reduced-motion, ARIA-component-patterns, inert-focus-trap]

file_tracking:
  key_files:
    created:
      - skills/accessibility/SKILL.md
    modified: []

decisions:
  - id: "08-03-01"
    description: "929 lines exceeds 550-650 target but all content substantive (19 archetype CSS + Tailwind mappings, 6 full ARIA components, 19-row reduced-motion table)"
    confidence: HIGH
  - id: "08-03-02"
    description: "Focus indicators use data-archetype CSS attribute selector for CSS patterns, plus archetypeFocusClass Record for Tailwind JSX usage -- dual approach covers both paradigms"
    confidence: HIGH
  - id: "08-03-03"
    description: "Focus trap uses inert attribute (Baseline 2023) instead of manual Tab key interception -- simpler, more robust, handles edge cases automatically"
    confidence: HIGH
  - id: "08-03-04"
    description: "Reduced-motion table uses 4 entrance types (instant/opacity-only/slow-fade/very-slow-fade) matching archetype personality rather than blanket disable"
    confidence: HIGH

metrics:
  duration: "4 min"
  completed: "2026-02-24"
---

# Phase 8 Plan 03: Accessibility Skill Summary

WCAG 2.1 AA baked into every component with archetype-styled focus indicators, per-archetype reduced-motion alternatives, and full ARIA patterns for 6 interactive component types.

## What Was Built

### skills/accessibility/SKILL.md (929 lines, core tier)

**Layer 1: Decision Guidance (~40 lines)**
- 7 mandatory accessibility requirements for every component
- Decision tree: when to use ARIA vs semantic HTML vs sr-only vs aria-live
- Pipeline connection: referenced by section-builder, quality-reviewer, creative-director

**Layer 2: Award-Winning Examples (~770 lines)**
- Pattern 1: All 19 archetype focus indicators in both CSS (data-archetype selectors) and Tailwind (archetypeFocusClass Record) -- focus as design element
- Pattern 2: Keyboard navigation -- roving tabindex toolbar, focus trap via inert, skip links with sr-only/focus:not-sr-only
- Pattern 3: Full ARIA patterns for 6 components: accordion, tabs, dropdown menu, toast/notification, modal/dialog, carousel
- Pattern 4: Per-archetype reduced-motion table (19 entries) with entrance type, duration, and scroll-driven behavior
- Pattern 5: Color contrast requirements, DNA token contrast rules, color-blind safe StatusBadge pattern, chart-safe palette

**Layer 3: Integration Context (~60 lines)**
- DNA token contrast requirements (text on bg, muted on bg, primary on bg, text on surface, border on bg)
- 19-row archetype variant summary table (focus style + reduced motion + aesthetic alignment)
- Related skills: tailwind-system, responsive-design, cinematic-motion, emotional-arc, design-archetypes, micro-interactions
- Scope boundary: component-level patterns here, page-level testing in live-testing skill

**Layer 4: Anti-Patterns (~50 lines)**
- 7 anti-patterns: div-soup, visible-but-inaccessible, generic-focus, animation-no-reduce, color-only-info, tabindex>0, aria-label-overwrite

**Machine-Readable Constraints**
- 10 enforcement parameters, all HARD: contrast ratios, touch targets, focus visibility, motion alternatives, skip links, heading hierarchy, form labels

## Decisions Made

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | 929 lines (exceeds 550-650 target) | 19 archetype CSS blocks + Tailwind map + 6 ARIA components + 19-row reduced-motion table -- all substantive |
| 2 | Dual CSS + Tailwind focus patterns | CSS data-archetype selectors for global stylesheets; Tailwind Record for JSX component-level usage |
| 3 | inert attribute for focus trap | Baseline 2023, simpler than manual Tab interception, handles edge cases automatically |
| 4 | 4 reduced-motion entrance types | instant/opacity-only/slow-fade/very-slow-fade preserves archetype personality instead of blanket disable |

## Deviations from Plan

None -- plan executed exactly as written.

## Verification

- [x] skills/accessibility/SKILL.md exists and is 929 lines (500+ requirement met)
- [x] Contains all 4 layer headings (Layer 1-4)
- [x] Contains all 19 archetype focus indicator styles (CSS + Tailwind mappings)
- [x] Contains ARIA patterns for 6 component types (accordion, tabs, dropdown, toast, modal, carousel)
- [x] Contains keyboard navigation (roving tabindex, focus trap via inert, skip links)
- [x] Contains reduced-motion per-archetype table (19 entries)
- [x] Contains contrast ratios (4.5:1 body, 3:1 large text/UI)
- [x] Contains 44px touch target requirement
- [x] YAML frontmatter has tier "core"

## Next Phase Readiness

No blockers. The accessibility skill is referenced by:
- Plan 08-08 (surviving skill rewrites) -- all rewritten skills must implement these standards
- All future component patterns in any skill must include ARIA, keyboard, focus, motion-reduce
