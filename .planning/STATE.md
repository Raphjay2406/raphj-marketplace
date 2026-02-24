# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-23)

**Core value:** Every output must be award-winning by default (Awwwards SOTD 8.0+) -- not as a stretch goal, but as the baseline.
**Current focus:** Phase 3 - Command System (executing)

## Current Position

Phase: 3 of 9 (Command System)
Plan: 5 of 6 in current phase (03-01, 03-02, 03-03, 03-04, 03-05 complete)
Status: In progress
Last activity: 2026-02-24 -- Completed 03-05-PLAN.md (iterate & bug-fix commands)

Progress: [████░░░░░░] 37% (19/52 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 19
- Average duration: 3 min
- Total execution time: 53 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 6/6 | 22 min | 4 min |
| 2. Pipeline Architecture | 7/7 | 24 min | 3 min |
| 3. Command System | 5/6 | 7 min | 1 min |

**Recent Trend:**
- Last 5 plans: 03-05 (2 min), 03-03 (2 min), 03-01 (2 min), 03-04 (1 min), 02-07 (3 min)
- Trend: Accelerating; command plans completing in 1-2 min

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
- [Phase 2-04]: Quality reviewer embeds full anti-slop scoring inline -- zero-cost enforcement, no runtime skill reads
- [Phase 2-04]: Polisher reads exactly 3 things (GAP-FIX.md + code files + DNA) -- minimal context by design
- [Phase 2-04]: Scope discipline absolute -- polisher NEVER changes unlisted code, new gaps documented not fixed
- [Phase 2-04]: Lessons learned format includes DESIGN_SYSTEM_PROPOSALS for design system growth
- [Phase 2-02]: CD has APPROVE/FLAG/PUSH authority -- FLAG creates GAP-FIX.md, PUSH provides boldness opportunities
- [Phase 2-02]: 9 creative domains for CD, 4 technical domains for QR, zero overlap
- [Phase 2-02]: Pre-build review blocking but light (~5 min); post-build review thorough after all builders complete
- [Phase 2-02]: 8 creative dimensions: archetype personality, creative tension, emotional arc, color journey, typography drama, compositional interest, wow moment impact, transition quality
- [Phase 2-02]: Creative direction notes use 5 fields: Overall, Strengths, Drift, Push, Calibration
- [Phase 2-01]: 5 research tracks (expanded from v6.1.0's 4) -- added CONTENT-VOICE for brand voice analysis
- [Phase 2-01]: Build-orchestrator reads max 5 file types (CONTEXT.md, MASTER-PLAN.md, PLANs, SUMMARYs, DESIGN-SYSTEM.md) -- not DNA/brainstorm/content directly
- [Phase 2-01]: Full DNA embedded in every builder spawn prompt (~150 lines for DNA section) -- not compressed extract
- [Phase 2-01]: Spawn prompt template has 9 sections covering all builder context needs
- [Phase 2-01]: builder_type field in PLAN.md frontmatter routes to correct specialist agent
- [Phase 2-01]: Beat validation + layout diversity + background progression rules embedded in section-planner (no runtime skill reads)
- [Phase 2-05]: Specialists are enhanced section-builders -- same I/O contract (spawn prompt + PLAN.md in, code + SUMMARY.md out), plus domain expertise
- [Phase 2-05]: Animation decision tree defaults to CSS scroll-driven -- 10-item flowchart, JS only when CSS cannot achieve the effect
- [Phase 2-05]: Content specialist expanded banned list to 8 items and includes brand voice "swap test" for headline quality
- [Phase 2-05]: 3D specialist FPS monitoring auto-downgrades to static image after 2s sustained below 30fps
- [Phase 2-05]: Parallax intensity mapped to archetype personality (subtle/medium/strong tiers)
- [Phase 2-03]: No fallback file reads -- builder with missing spawn prompt STOPs immediately (no fallback to reading DESIGN-DNA.md)
- [Phase 2-03]: 10-item auto-polish checklist mandatory on every section (expanded from v6.1.0's 5 items)
- [Phase 2-03]: Machine-readable SUMMARY.md with beat_compliance, anti_slop_self_check booleans, and reusable_components proposals
- [Phase 2-03]: Anti-context-rot DNA checks: 3-question after every task, 7-question every 3rd task
- [Phase 2-06]: CONTEXT.md lifecycle: full rewrite after every wave (not append), target 80-100 lines, compression rules if exceeded
- [Phase 2-06]: CONTEXT.md split ownership: orchestrator writes 5 sections, CD writes Creative Direction Notes
- [Phase 2-06]: Canary scoring 3-tier: HEALTHY (5/5), DEGRADING (3-4/5), ROT_DETECTED (0-2/5 triggers session boundary)
- [Phase 2-06]: Session boundaries: soft (2 waves), hard (turn 31+), canary-triggered (score 0-2)
- [Phase 2-06]: Anti-gaming: orchestrator answers 5 canary questions from memory BEFORE reading any files
- [Phase 2-07]: 3 memory layers: CONTEXT.md (short-term, rewritten per wave), DESIGN-SYSTEM.md (medium-term, grows per wave), reviewer platform memory (cross-session)
- [Phase 2-07]: Design system growth has no approval gate -- builder proposes in SUMMARY.md, orchestrator collects automatically
- [Phase 2-07]: Feedback loop sized at 10 lines per destination (CONTEXT.md, spawn prompts), last 2 waves only
- [Phase 2-07]: Platform memory supplements (not replaces) file-based feedback -- file-based is primary, platform memory is secondary
- [Phase 2-07]: Discussion protocol: 6 decision gates, 4 participating agents, builders explicitly exempt
- [Phase 2-07]: Protocol violations handled through quality review feedback loop, not hard errors
- [Phase 3-01]: start-project.md at 154 lines (within 100-180 range) -- all domain logic in agents, zero in command
- [Phase 3-01]: Discovery phase in-command (not dispatched to agent) -- conversational UX needs direct user interaction
- [Phase 3-01]: 4 research tracks dispatched in parallel via Task tool (trends, references, components, animation)
- [Phase 3-01]: Content planning gated behind --skip-content flag for deferred copy workflows
- [Phase 3-02]: lets-discuss.md is new command (no v6.1.0 predecessor) -- 143 lines, 3 interleaved conversation tracks
- [Phase 3-02]: DISCUSSION-{phase}.md file existence serves as tracking mechanism for plan-dev auto-offer
- [Phase 3-02]: Creative-director agent dispatched via Task tool for visual proposals with ASCII mockups
- [Phase 3-03]: plan-dev replaces plan-sections (353 -> 121 lines) -- all domain logic in section-planner agent
- [Phase 3-03]: Discussion auto-offer checks DISCUSSION-{phase}.md existence, offers lets-discuss if missing
- [Phase 3-03]: Re-research is default-on, skippable via --skip-research flag
- [Phase 3-04]: Execute command is thinnest core command at 127 lines -- all wave/builder/diversity logic in build-orchestrator
- [Phase 3-04]: Auto-detection: CONTEXT.md with incomplete state auto-triggers resume mode
- [Phase 3-04]: Backward compatibility: bare word 'resume' treated as --resume flag
- [Phase 3-05]: Two distinct brainstorm types: iterate uses creative approaches (2-3 ASCII mockups), bug-fix uses diagnostic hypotheses (root cause analysis)
- [Phase 3-05]: change-plan.md merged into iterate.md -- plan modifications are a type of iteration
- [Phase 3-05]: GAP-FIX.md --from-gaps flag skips brainstorm since gaps are already diagnosed by quality-reviewer
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
- [Phase 9]: Figma-DNA hybrid: Figma styles where present, DNA fills gaps; raw hex always flagged for user
- [Phase 9]: Figma import produces PLAN.md files through normal execute pipeline (not direct code)
- [Phase 9]: Visual QA overlay diff (pixelmatch) as part of verify step
- [Phase 9]: Code Connect mappings used when available; page-by-page import for multi-page Figma files
- [Phase 9]: Storybook 10 CSF Factories + W3C DTCG tokens via Style Dictionary 5; multi-format (CSS/JSON/Figma)
- [Phase 9]: Progress reporting: per-task in STATE.md, review gate after every wave, screenshots after final wave only
- [Phase 9]: Error recovery: MINOR/MAJOR/CRITICAL severity; detailed diagnosis + 2-3 fix options; failure escalation at 3+

### Pending Todos

None yet.

### Blockers/Concerns

- ~~Tailwind v4 @theme syntax needs verification against current docs before Phase 5/8 skill writing~~ RESOLVED: Phase 5 research verified Tailwind v4 @theme syntax
- ~~Next.js 16 and Astro 5 APIs should be spot-checked before Phase 8 framework skills~~ RESOLVED: Phase 8 research verified Next.js 16 (proxy.ts, async params) and Astro 5/6 (ClientRouter, Content Layer API)
- ~~Multi-page orchestration (Phase 8, EXPR-03) is largely uncharted territory -- may need experimentation~~ ADDRESSED: Phase 8 research identified key patterns; creative judgment needed for per-page emotional arcs
- Surviving skill rewrite scope (Plan 08-08) depends on Phases 1-7 execution -- actual file list may shift

## Session Continuity

Last session: 2026-02-24
Stopped at: Completed 03-05-PLAN.md (iterate & bug-fix commands)
Resume file: None
