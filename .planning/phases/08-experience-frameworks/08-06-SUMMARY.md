---
phase: 08-experience-frameworks
plan: 06
subsystem: framework-skills
tags: [nextjs, astro, framework-patterns, app-router, pages-router, islands, content-layer, view-transitions]
depends_on:
  requires: ["08-01", "08-02", "08-03", "08-04"]
  provides: ["Next.js 16 patterns for App Router + Pages Router", "Astro 5/6 forward-compatible patterns with Islands and Content Layer"]
  affects: ["08-08"]
tech_stack:
  added: []
  patterns: ["proxy.ts replaces middleware.ts", "async params/cookies/headers in Next.js 16", "ClientRouter replaces ViewTransitions", "Content Layer API with loaders replaces Astro.glob", "Islands architecture with hydration directives"]
key_files:
  created: ["skills/nextjs-patterns/SKILL.md"]
  modified: ["skills/astro-patterns/SKILL.md"]
decisions:
  - id: "nextjs-619-lines"
    decision: "Next.js skill at 619 lines exceeds 500-600 target"
    rationale: "Both routers require distinct code patterns; React 19.2 features and 8 machine-readable constraints added necessary content"
    confidence: HIGH
  - id: "astro-570-lines"
    decision: "Astro skill at 570 lines exceeds 400-500 target"
    rationale: "Content Layer API with full blog listing and post examples, Server Islands, hybrid rendering, and archetype transition mapping all substantive"
    confidence: HIGH
metrics:
  duration: "6 min"
  completed: "2026-02-24"
---

# Phase 8 Plan 06: Next.js & Astro Framework Skills Summary

Next.js 16 patterns skill created (619 lines) covering both App Router and Pages Router with all v16 breaking changes (proxy.ts, async params/cookies/headers, Cache Components, explicit default.tsx), plus Astro patterns skill rewritten (570 lines) for Astro 5/6 forward compatibility with ClientRouter, Content Layer API, Islands architecture, and Server Islands.

## Completed Tasks

| # | Task | Commit | Key Output |
|---|------|--------|------------|
| 1 | Create Next.js patterns skill for Next.js 16 | 953604b | `skills/nextjs-patterns/SKILL.md` (619 lines) |
| 2 | Rewrite Astro patterns skill for Astro 5/6 | 0a206c7 | `skills/astro-patterns/SKILL.md` (570 lines) |

## Decisions Made

### 1. Next.js skill at 619 lines (exceeds 500-600 target)
- **Rationale:** Both App Router and Pages Router need distinct code patterns (as mandated by user decision for equal coverage). 8 code patterns with complete TSX, plus React 19.2 features (Cache Components, Activity, React Compiler) and 8 machine-readable constraints all contribute necessary content.
- **Impact:** Slightly larger skill file, but all content is substantive with no filler.

### 2. Astro skill at 570 lines (exceeds 400-500 target)
- **Rationale:** Content Layer API needs complete examples for both collection configuration and usage (blog listing + individual post). Server Islands, hybrid rendering, and archetype-specific transition mapping all add essential guidance.
- **Impact:** Slightly larger skill file, but all content is substantive.

### 3. New skill directory for Next.js
- **Rationale:** Created `skills/nextjs-patterns/` as a NEW directory (replaces old `nextjs-app-router/`). New name reflects that it covers BOTH routers, not just App Router.
- **Impact:** Old `skills/nextjs-app-router/SKILL.md` remains until removed during plan 08-08 (surviving skill cleanup).

## Verification Results

### Next.js Patterns Skill
- 619 lines (exceeds 450 minimum)
- All 4 layer headings present
- Contains `proxy.ts` as recommended pattern (8 mentions)
- Contains `await params` async pattern (6 mentions)
- Contains `await cookies()` async pattern (2 mentions)
- Both App Router and Pages Router sections with full code examples
- Contains `next-themes` for dark mode integration
- Contains `next/font` for font loading
- References `@tailwindcss/postcss` for Tailwind v4 integration
- No deprecated patterns recommended (middleware.ts, sync params, framer-motion only in anti-patterns)
- 8 machine-readable constraints for automated checking

### Astro Patterns Skill
- 570 lines (exceeds 400 minimum)
- All 4 layer headings present
- Contains `ClientRouter` as recommended (not ViewTransitions)
- Contains `getCollection` from Content Layer API (not Astro.glob)
- Content Layer API configuration example with glob loader and Zod schema
- Islands architecture decision tree with hydration directive table
- Contains `is:inline` FOUC prevention script in BaseLayout
- Contains `transition:persist` and `transition:animate` patterns
- References `@tailwindcss/vite` for Tailwind v4 integration
- No deprecated patterns recommended (ViewTransitions, Astro.glob only in forward-compat table and anti-patterns)
- 8 machine-readable constraints for automated checking

## Deviations from Plan

None -- plan executed exactly as written.

## Next Phase Readiness

Both framework skills are complete and reference the foundational Phase 8 skills:
- `tailwind-system` -- Next.js uses `@tailwindcss/postcss`, Astro uses `@tailwindcss/vite`
- `responsive-design` -- Container queries, responsive images, breakpoint patterns
- `accessibility` -- Skip links, focus management, semantic HTML
- `dark-light-mode` -- `next-themes` (Next.js), `is:inline` script (Astro)
- `multi-page-architecture` -- Page-type templates map to route structures

Plan 08-07 (React/Vite and Desktop patterns) can proceed. Plan 08-08 (surviving skill rewrites) should note that `skills/nextjs-app-router/SKILL.md` is now superseded by `skills/nextjs-patterns/SKILL.md` and can be removed.
