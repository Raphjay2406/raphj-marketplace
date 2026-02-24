---
phase: 08-experience-frameworks
plan: 07
subsystem: ui
tags: [react, vite, tauri, electron, desktop, spa, titlebar, drag-region, client-side-routing]

# Dependency graph
requires:
  - phase: 08-01
    provides: "Tailwind v4 system skill with @theme and @tailwindcss/vite patterns"
  - phase: 08-02
    provides: "Responsive design skill with container queries and breakpoint system"
  - phase: 08-03
    provides: "Accessibility skill with focus indicators and reduced-motion patterns"
  - phase: 08-04
    provides: "Dark/light mode skill with FOUC prevention and archetype transitions"
provides:
  - "React/Vite SPA patterns skill (client-side routing, Vite setup, no-SSR patterns)"
  - "Desktop patterns skill (Tauri v2 + Electron titlebar, drag regions, platform detection)"
affects: [08-08-remaining-rewrites]

# Tech tracking
tech-stack:
  added: ["@tailwindcss/vite", "@tauri-apps/api", "react-router", "tanstack-router", "fontsource"]
  patterns: ["SPA dark mode via inline script", "Platform-aware titlebar", "Desktop-specific responsive breakpoints", "Multi-window DNA theming"]

key-files:
  created:
    - "skills/react-vite-patterns/SKILL.md"
    - "skills/desktop-patterns/SKILL.md"
  modified: []

key-decisions:
  - "React/Vite skill focuses on differences from Next.js, not duplication -- 8 code patterns cover what is unique to SPAs"
  - "Desktop skill covers both Tauri v2 and Electron in one skill -- platform detection at runtime, shared DNA theming"
  - "Desktop responsive starts at 800px minimum, no mobile breakpoints -- sidebar collapse pattern replaces hamburger menu"
  - "10 archetype titlebar variants documented -- titlebar is a first-class design surface, not a generic gray bar"

patterns-established:
  - "React/Vite: @tailwindcss/vite replaces @tailwindcss/postcss -- no PostCSS config needed"
  - "React/Vite: React.lazy + Suspense for route-based code splitting (not automatic like Next.js)"
  - "Desktop: data-tauri-drag-region for Tauri, app-region: drag for Electron"
  - "Desktop: Platform detection determines control layout (macOS left, Windows right)"
  - "Desktop: Content offset via pt-{height} matching titlebar height"

# Metrics
duration: 6min
completed: 2026-02-24
---

# Phase 8 Plan 7: React/Vite & Desktop Patterns Summary

**React/Vite SPA skill (617 lines) with client-side routing and Vite setup, plus Tauri v2 + Electron desktop patterns skill (771 lines) with platform-aware titlebars, drag regions, and multi-window DNA theming**

## Performance

- **Duration:** 6 min
- **Started:** 2026-02-24T09:50:11Z
- **Completed:** 2026-02-24T09:56:51Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments

- Created React/Vite skill that clearly differentiates SPA patterns from Next.js -- 11-row comparison table, 8 code patterns, 7 anti-patterns preventing incorrect API usage
- Created Desktop patterns skill covering both Tauri v2 and Electron with platform-aware design -- custom titlebars, drag regions, content offset, multi-window, system tray, resizable sidebars
- Both skills integrate DNA tokens, archetype variants, and reference the Phase 8 foundational skills (Tailwind v4, responsive, accessibility, dark/light mode)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create React/Vite patterns skill** - `3012766` (feat)
2. **Task 2: Create Desktop patterns skill** - `17812f7` (feat)

## Files Created/Modified

- `skills/react-vite-patterns/SKILL.md` - 617-line domain skill: Vite config, React Router routing, font loading via @font-face, SPA dark mode, image handling without next/image, environment variables
- `skills/desktop-patterns/SKILL.md` - 771-line domain skill: Tauri v2 titlebar, Electron chrome, platform detection, multi-window patterns, system tray, desktop-specific responsive, resizable sidebar

## Decisions Made

- **React/Vite skill line count (617) exceeds 300-400 target** -- all content substantive. 8 code patterns needed because SPA setup (routing, fonts, images, env vars, code splitting) all differ from Next.js and need complete examples.
- **Desktop skill line count (771) exceeds 400-500 target** -- all content substantive. Tauri and Electron have different APIs requiring separate code examples, plus platform detection, multi-window, system tray, and resizable sidebar patterns are all essential.
- **10 archetype titlebar variants** -- titlebar is a design surface, not just chrome. Each archetype needs specific treatment (Brutalist thick border, Ethereal translucent blur, Neon Noir glow, etc.).
- **Desktop responsive starts at 800px** -- mobile breakpoints are dead code in desktop apps. Sidebar collapse at narrow window widths replaces hamburger menu pattern.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 5 target frameworks now have skills or are in-progress (Next.js and Astro in plan 08-06, React/Vite and Desktop in this plan)
- Plan 08-08 (remaining skill rewrites) can proceed -- these skills establish the patterns for framework-specific knowledge
- Desktop patterns skill establishes the convention that desktop apps load BOTH desktop-patterns AND react-vite-patterns skills together

---
*Phase: 08-experience-frameworks*
*Completed: 2026-02-24*
