---
status: testing
phase: 08-experience-frameworks
source: 08-01-SUMMARY.md, 08-02-SUMMARY.md, 08-03-SUMMARY.md, 08-04-SUMMARY.md, 08-05-SUMMARY.md, 08-06-SUMMARY.md, 08-07-SUMMARY.md, 08-08-SUMMARY.md
started: 2026-02-24T11:00:00Z
updated: 2026-02-24T11:00:00Z
---

## Current Test

number: 1
name: Tailwind v4 System skill replaces v3
expected: |
  skills/tailwind-system/SKILL.md exists with 4-layer format and YAML frontmatter.
  Contains @theme block with all 12 DNA color tokens.
  Contains @custom-variant dark pattern.
  Old skills/tailwind-patterns/ directory is deleted.
awaiting: user response

## Tests

### 1. Tailwind v4 System skill replaces v3
expected: skills/tailwind-system/SKILL.md exists with 4-layer format, @theme DNA mapping, @custom-variant dark, container queries. Old tailwind-patterns deleted.
result: [pending]

### 2. Responsive Design skill with mobile-first enforcement
expected: skills/responsive-design/SKILL.md exists with 375px hard constraint, hybrid typography (clamp body + stepped display), container queries, 44px touch targets, 7 code patterns.
result: [pending]

### 3. Accessibility skill with archetype-aware patterns
expected: skills/accessibility/SKILL.md exists with 19 archetype focus indicators (CSS + Tailwind), 6 ARIA component patterns, keyboard nav, per-archetype reduced-motion table, inert-based focus trap.
result: [pending]

### 4. Dark/Light Mode skill with dual palettes
expected: skills/dark-light-mode/SKILL.md exists with dual independent palettes, 19 archetype signature transitions, FOUC prevention for all 5 frameworks, accessible toggle component, View Transitions API.
result: [pending]

### 5. Multi-Page Architecture skill with page-type templates
expected: skills/multi-page-architecture/SKILL.md exists with 7 page-type templates (landing, about, pricing, blog index, article, docs, contact) each with distinct emotional arcs, shared component patterns, cross-page consistency rules.
result: [pending]

### 6. Next.js 16 and Astro 5/6 framework skills
expected: skills/nextjs-patterns/SKILL.md covers both App Router and Pages Router with proxy.ts, async params. skills/astro-patterns/SKILL.md covers ClientRouter, Content Layer API, Islands architecture. Both reference Tailwind v4 integration.
result: [pending]

### 7. React/Vite and Desktop framework skills
expected: skills/react-vite-patterns/SKILL.md covers SPA patterns with client-side routing, code splitting, no Next.js API leakage. skills/desktop-patterns/SKILL.md covers Tauri v2 + Electron with custom titlebars, drag regions, platform detection, 10 archetype titlebar variants.
result: [pending]

### 8. Domain skills rewritten to 4-layer format
expected: ecommerce-ui, dashboard-patterns, blog-patterns, portfolio-patterns all rewritten with 4-layer format, YAML frontmatter v2.0.0, DNA tokens, container queries, ARIA attributes.
result: [pending]

### 9. Utility skills rewritten to 4-layer format
expected: seo-meta, i18n-rtl, form-builder all rewritten with 4-layer format, current library versions (generateMetadata not Head, CSS logical properties, react-hook-form + zod).
result: [pending]

### 10. No deprecated patterns across all Phase 8 skills
expected: No framer-motion imports (should be motion/react), no tailwind.config.ts as recommended pattern, no Astro.glob (should be getCollection), no middleware.ts (should be proxy.ts in Next.js context). Deprecated patterns appear only in anti-pattern sections.
result: [pending]

## Summary

total: 10
passed: 0
issues: 0
pending: 10
skipped: 0

## Gaps

[none yet]
