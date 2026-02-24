# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-23)

**Core value:** Every output must be award-winning by default (Awwwards SOTD 8.0+) -- not as a stretch goal, but as the baseline.
**Current focus:** Phase 1 - Foundation (executing)

## Current Position

Phase: 1 of 9 (Foundation)
Plan: 5 of 6 in current phase (COMPLETE)
Status: In progress -- executing Phase 1
Last activity: 2026-02-24 -- Completed 01-05-PLAN.md (Emotional Arc skill, 10 beat types with hard constraints)

Progress: [██░░░░░░░░] 6% (3/52 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 3
- Average duration: 3 min
- Total execution time: 9 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 3/6 | 9 min | 3 min |

**Recent Trend:**
- Last 5 plans: 01-01 (2 min), 01-02 (3 min), 01-05 (4 min)
- Trend: Consistent, fast execution for markdown-only plans

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: 9-phase comprehensive build derived from 54 requirements across 11 categories
- [Roadmap]: Foundation (identity + skills) before Pipeline (agents) before Commands -- research confirmed this ordering prevents context rot
- [Roadmap]: Brainstorming (BRNS) grouped with Content (CONT-01) in Phase 6 since creative direction feeds copy intelligence
- [Phase 1-01]: CLAUDE.md kept to 98 lines -- references skills for detail, avoids duplicating content
- [Phase 1-01]: Skill template uses HTML guidance comments for self-documentation
- [Phase 1-01]: Machine-readable constraint table is optional section in skill template (not all skills need it)
- [Phase 1-02]: 12 color tokens split 8 semantic + 4 expressive -- expressive tokens encode creative intent beyond functional roles
- [Phase 1-02]: Motion tokens use :root CSS custom properties (NOT @theme) -- consumed by GSAP/motion-react, not Tailwind
- [Phase 1-02]: @theme block includes --color-*: initial to reset Tailwind defaults -- project owns full palette
- [Phase 1-02]: Signature element format: name: param=value -- machine-parseable, enforceable by anti-slop gate
- [Phase 1-05]: 680 lines exceeds 400-550 target but all content substantive (10 archetype templates vs. 4-5 minimum)
- [Phase 1-05]: PEAK animation intensity set to HARD enforcement (not SOFT) -- PEAK is the designated wow moment
- [Phase 1-05]: Added "min 3 different beat types per page" as HARD sequence validation rule
- [Phase 2]: Spawn prompt budget increased to ~300 lines to fit full Design DNA document (user decision)
- [Phase 2]: CD has real authority -- can request changes, reviews both plans and output per wave
- [Phase 2]: Build failures bubble to user (no auto-retry)
- [Phase 2]: Subagents cannot spawn subagents -- build-orchestrator is the only spawner
- [Phase 5]: Motion intensity, wow moment count, tension mandate all archetype-driven (user decision)
- [Phase 5]: Scroll-driven animations are beat-dependent -- HOOK/PEAK get continuous, others entrance-only
- [Phase 5]: Hybrid motion presets -- archetype base family + DNA parameter tweaks
- [Phase 5]: Hard enforcement of DNA tokens in scaffold -- typed utilities only accept DNA tokens
- [Phase 5]: GSAP now 100% free (all plugins) -- Webflow acquisition. No premium caveats
- [Phase 5]: Motion library rebranded to `motion/react` imports (not `framer-motion`)
- [Phase 5]: CSS scroll-driven animations are production default, `@supports` for progressive enhancement
- [Phase 7]: Shapes serve both atmospheric and foreground roles; beat-aware shape intensity
- [Phase 7]: 3D available throughout (not just heroes); three-tier responsive (full/reduced/static)
- [Phase 7]: Marketplace components capped at ~30% of visual elements; category-level recommendations (not specific components)
- [Phase 7]: Tool-agnostic AI image prompts with full DNA translation and DNA-derived negative prompts
- [Phase 7]: WebGPU ~95% browser support; R3F v9 stable target, v10 alpha forward-looking
- [Phase 7]: GSAP MorphSVG + DrawSVG now free -- include in shape skill freely
- [Phase 8]: 375px is design target, fluid scaling gracefully handles down to ~320px
- [Phase 8]: Container queries vs media queries at Claude's discretion per component type
- [Phase 8]: Hybrid typography -- clamp() for body, breakpoint steps for display text
- [Phase 8]: Next.js: full coverage of BOTH App Router and Pages Router equally
- [Phase 8]: Tauri and Electron: full desktop-aware design skills (window chrome, drag regions, titlebars)
- [Phase 8]: Dark/light mode equal parity -- both independently award-worthy, archetype signature transitions
- [Phase 8]: Framework detection auto-detect then user-confirm, stored in DESIGN-DNA.md
- [Phase 8]: Tailwind v4 skill rewrite is foundational -- completes before other skills reference it

### Pending Todos

None yet.

### Blockers/Concerns

- ~~Tailwind v4 @theme syntax needs verification against current docs before Phase 5/8 skill writing~~ RESOLVED: Phase 5 research verified Tailwind v4 @theme syntax
- ~~Next.js 16 and Astro 5 APIs should be spot-checked before Phase 8 framework skills~~ RESOLVED: Phase 8 research verified Next.js 16 (proxy.ts, async params) and Astro 5/6 (ClientRouter, Content Layer API)
- ~~Multi-page orchestration (Phase 8, EXPR-03) is largely uncharted territory -- may need experimentation~~ ADDRESSED: Phase 8 research identified key patterns; creative judgment needed for per-page emotional arcs
- Surviving skill rewrite scope (Plan 08-08) depends on Phases 1-7 execution -- actual file list may shift

## Session Continuity

Last session: 2026-02-24T03:37:23Z
Stopped at: Completed 01-05-PLAN.md (Emotional Arc skill)
Resume file: None
