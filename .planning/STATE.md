# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-23)

**Core value:** Every output must be award-winning by default (Awwwards SOTD 8.0+) -- not as a stretch goal, but as the baseline.
**Current focus:** Phase 1 - Foundation (COMPLETE)

## Current Position

Phase: 1 of 9 (Foundation) -- COMPLETE
Plan: 6 of 6 in current phase (COMPLETE)
Status: Phase 1 complete -- ready for Phase 2
Last activity: 2026-02-24 -- Completed 01-06-PLAN.md (Skill Directory and Cleanup)

Progress: [██░░░░░░░░] 12% (6/52 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 6
- Average duration: 4 min
- Total execution time: 22 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 6/6 | 22 min | 4 min |

**Recent Trend:**
- Last 5 plans: 01-02 (3 min), 01-05 (4 min), 01-04 (3 min), 01-03 (7 min), 01-06 (3 min)
- Trend: Consistent fast execution; 01-03 longer due to 19 archetype definitions

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
- [Phase 1-04]: Typography and Depth & Polish both at 6 points (17% each) -- craft quality weighted highest
- [Phase 1-04]: UX Intelligence at 3 points (9%) -- functional quality is baseline, not differentiator
- [Phase 1-04]: Generic CTA penalty capped at -6 (3 instances max) -- beyond 3 is systemic, covered by U3 scoring 0
- [Phase 1-04]: Gate runs before Awwwards 4-axis scoring -- if gate FAIL, Awwwards is skipped
- [Phase 1-04]: Max 2 remediation cycles before escalation to user
- [Phase 1-03]: All 19 archetypes in single SKILL.md (1184 lines) -- structured tables are token-efficient
- [Phase 1-03]: AI-Native defined as "machine intelligence made visible" -- monospace, blue-purple palette, data viz as decoration (LOW confidence, creative synthesis)
- [Phase 1-03]: Named-pattern signature format for all 19 archetypes -- name: param=value, machine-parseable
- [Phase 1-05]: 680 lines exceeds 400-550 target but all content substantive (10 archetype templates vs. 4-5 minimum)
- [Phase 1-05]: PEAK animation intensity set to HARD enforcement (not SOFT) -- PEAK is the designated wow moment
- [Phase 1-05]: Added "min 3 different beat types per page" as HARD sequence validation rule
- [Phase 1-06]: SKILL-DIRECTORY.md is a registry document (not a skill) -- no YAML frontmatter, agents reference explicitly
- [Phase 1-06]: 27 culled skill directories removed from filesystem; surviving v6.1.0 skills retained as reference until rewrite
- [Phase 1-06]: awwwards-scoring disposition deferred to Phase 4/8 (keep separate or fold into anti-slop-gate)
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

Last session: 2026-02-24T03:45:26Z
Stopped at: Completed 01-06-PLAN.md (Skill Directory and Cleanup) -- Phase 1 COMPLETE
Resume file: None
