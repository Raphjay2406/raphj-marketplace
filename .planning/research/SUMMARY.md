# Project Research Summary

**Project:** Modulo 2.0 -- Premium Frontend Design Plugin
**Domain:** AI-powered premium frontend design (Claude Code plugin, markdown-only)
**Researched:** 2026-02-23
**Confidence:** HIGH

## Executive Summary

Modulo 2.0 is a ground-up restructuring of a Claude Code plugin that produces Awwwards SOTD-caliber websites. The v6.1.0 system proved that archetype-driven, DNA-constrained design generation works in theory -- its 16 archetypes, 35-point anti-slop gate, emotional arc system, and 10-direction motion vocabulary are genuinely innovative and have no direct competitors. However, the system fails in practice because of three root causes: context rot degrades output quality over extended sessions, builders under-enforce design constraints (producing technically correct but compositionally bland output), and 87 skills create knowledge bloat that dilutes focus. The rebuild is not about inventing new design theory -- it is about making existing theory structurally enforceable.

The recommended approach is a **pipeline architecture** replacing v6.1.0's hub-and-spoke model. Instead of a single design-lead agent that reads everything and coordinates everything (creating a context window bottleneck), work flows through specialized stages: Research, Design, Build, Review, Polish. Each stage has a defined input/output contract. Section builders receive pre-extracted context in spawn prompts (~265 tokens total) and read exactly one file (PLAN.md). Quality enforcement shifts from post-hoc verification to progressive gates at build-time, post-wave, and end-of-phase. The skill library is culled from 87 to ~40 pure design skills, organized in tiers with critical rules embedded directly in agent files rather than referenced at runtime.

The primary risk is context rot -- the progressive loss of design identity over multi-wave builds, which is a fundamental property of LLM attention, not a fixable bug. Mitigation requires structural enforcement: session boundaries every 2 waves (hard, not suggested), pre-compiled DNA snapshots in spawn prompts, automated DNA compliance checking via pre-commit hooks, and canary checks with real consequences (2+ failures = mandatory new session). The secondary risk is the generic output trap -- despite following DNA tokens, output defaults to statistically probable layouts. This requires boldness enforcement: mandatory creative tension in PEAK beats, layout diversity tracking that blocks on violations, and reference-quality benchmarking during planning.

## Key Findings

### Recommended Stack

The premium frontend stack centers on three pillars: animation layering (GSAP for scroll-driven choreography, Motion/Framer Motion for React component animation, native CSS for micro-interactions), component ecosystem (shadcn/ui as accessible foundation, Aceternity UI and Magic UI as effect pattern sources), and modern CSS (Tailwind v4 with CSS-first `@theme` configuration). These are not alternative choices -- all three layers work together for Awwwards-caliber output.

**Core technologies:**
- **GSAP 3.14** (ScrollTrigger, SplitText, Timeline): Scroll-driven choreography engine -- no competitor matches its precision for pinned sections, scrubbed animations, and text reveals
- **Motion 12.x** (Framer Motion): React component animation -- declarative API for entrance/exit animations, shared element transitions, and gesture-driven states. Complementary to GSAP, not competing
- **Tailwind CSS v4**: CSS-first configuration via `@theme` directive maps directly to Design DNA tokens. Oxide engine is 10x faster than v3
- **shadcn/ui + Radix**: Accessible component foundation -- copy-paste model ensures customization per Design DNA. Not a library dependency, but owned code
- **Lenis**: Smooth scrolling standard for premium sites (3KB gzipped, integrates with GSAP ScrollTrigger)
- **React Three Fiber + Drei**: 3D elements for hero backgrounds, product viewers, scroll-driven 3D. Dynamic import only, SSR disabled
- **Playwright**: Visual testing at 4 breakpoints (375, 768, 1024, 1440) with screenshot diffing and accessibility auditing

**Framework targets:** Next.js 16 (primary, App Router), Astro 5 (secondary, islands architecture), React/Vite (tertiary), Tauri/Electron (desktop)

**Critical version note:** Tailwind v4's `@theme` CSS-first config is a breaking change from v3's `tailwind.config.ts`. All skills must teach v4 patterns. The exact `@theme` syntax should be verified against current Tailwind docs before writing skills.

### Expected Features

**Must have (table stakes) -- without these, the plugin is worse than v6.1.0:**
- **TS-1: Design DNA** -- foundational identity system; everything depends on it
- **TS-2: Design Archetypes** -- 16 personality systems with machine-enforced constraints
- **TS-3: Anti-Slop Gate** -- 35-point scoring shifted from post-hoc to inline enforcement
- **TS-4: Emotional Arc** -- 10 beat types with enforced parameters (not advisory)
- **TS-5: Cinematic Motion** -- 10-direction vocabulary with presets generated from DNA
- **TS-6: Wave System** -- parallel builder execution with stateless builders
- **TS-7: Creative Tension** -- controlled rule-breaking with concrete TSX implementations
- **TS-8: Responsive Design** -- mobile-first enforced, 375px as hard constraint, clamp() typography
- **TS-9: Performance-Aware Animation** -- CWV compliance alongside heavy animation
- **TS-10: Accessibility** -- WCAG AA baked into scaffold, not bolted on

**Should have (differentiators) -- these make Modulo 2.0 clearly superior to v6.1.0:**
- **D-8: Design System Scaffold** -- Wave 0 auto-generates typed utilities that make slop harder to produce than quality
- **D-10: Context Rot Prevention** -- 6-layer defense system (the hardest problem to solve)
- **D-2: Copy Intelligence** -- currently the weakest output; needs voice document, banned word enforcement, archetype-specific tone
- **D-1: Wow Moment Library** -- 30+ patterns expanded with View Transitions, scroll-snap, shader effects
- **D-3: Shape Generation** -- procedural decorative assets per archetype

**Defer to post-MVP:**
- **D-7: Live Browser Testing** -- highest-impact differentiator but highest complexity; integrate incrementally
- **D-5: 3D/WebGL Effects** -- impressive but niche; lightweight CSS 3D alternatives cover 80% of cases
- **D-11: Multi-Page Architecture** -- important but can start with single-page excellence
- **D-6: Page Transitions** -- critical gap in v6.1.0 but needs View Transitions API maturity
- **D-4: Component Marketplace** -- teach usage of Aceternity/Magic UI, don't vendor them

**Anti-features (explicitly do NOT build):**
- Template gallery, drag-and-drop builder, real-time collaboration, backend/auth integration, CMS management, AI image generation, analytics tracking. These dilute focus. Modulo makes frontends beautiful; other tools handle the rest.

### Architecture Approach

The rebuild moves from a hub-and-spoke model (design-lead reads everything, spawns builders, coordinates quality) to a pipeline model (Research -> Design -> Build -> Review -> Polish) where each stage has defined input/output contracts. 6 commands replace 13. Skills are culled from 87 to ~40 and organized in 4 tiers (Core/Domain/Utility/Cull). Quality enforcement uses 4 progressive gates instead of verify-at-end. The artifact store in `.planning/modulo/` has clear ownership rules -- each file has exactly one writer agent.

**Major components:**
1. **Commands (6)** -- User entry points that route to pipeline stages. Zero domain logic.
2. **Pipeline Agents (7)** -- researcher, creative-director, section-planner, build-orchestrator, section-builder, quality-reviewer, polisher. Each has explicit context budget.
3. **Specialist Agents (3)** -- 3d-specialist, animation-specialist, content-specialist. Sub-types of section-builder with domain knowledge.
4. **Skill Library (~40)** -- Tiered: Core (5, embedded in agents), Domain (11, loaded per project), Utility (15+, on-demand). 4-layer structure per skill: Decision Guidance, Award-Winning Examples, Integration Context, Anti-Patterns.
5. **Quality Gates (4 layers)** -- L0: pre-commit hook (zero cost), L1: post-wave creative audit (low cost), L2: full verification (high cost), L3: user checkpoints.
6. **Artifact Store** -- `.planning/modulo/` with CONTEXT.md as living heartbeat, rewritten every wave.

**Key architectural insight:** Section builders are the most context-efficient stage (~2,000 tokens each vs ~8,000+ for v6.1.0's design-lead pre-wave). Quality review is the most expensive (~7,000+ tokens). This is correct: builders should be cheap and parallelizable; review should be thorough.

### Critical Pitfalls

1. **C1: Context Rot** -- LLM attention degrades on early instructions as conversation grows. By wave 3-4, builders forget DNA tokens, default to Inter/blue-500/rounded-lg. **Prevent with:** hard session boundaries every 2 waves, pre-extracted spawn prompts, canary checks with teeth (2+ wrong = new session), CONTEXT.md rewritten every wave, builders as separate Task invocations with own context windows.

2. **C2: Generic Output Trap** -- Despite following DNA, output is compositionally bland (symmetric layouts, safe animations, predictable arrangements). LLMs default to the statistical mode of "good web design." **Prevent with:** reference-quality benchmarking during planning, layout diversity enforcement (5+ distinct patterns per page, no repeats in adjacent sections), Creative Courage scoring that requires specific evidence ("which element is the screenshot moment?"), creative tension TSX code in PLAN.md (not vague descriptions).

3. **C5: Agent Coordination Failures** -- Parallel builders make conflicting decisions (same layout, same background, inconsistent typography). **Prevent with:** pre-planned background progression, pre-assigned layout patterns in MASTER-PLAN, "patterns already used" list in spawn prompts, blocking post-wave coherence check.

4. **C4: Animation Reliability** -- GSAP/Motion/Three.js lifecycle conflicts, missing cleanup, SSR failures, CLS violations, mobile jank. **Prevent with:** one animation library per section (assigned in PLAN.md), mandatory cleanup patterns in code templates, dynamic import as default, animation budget enforcement at planning time.

5. **M1: Generic Copy** -- Headlines default to "Unlock Your Potential" regardless of brand. **Prevent with:** CONTENT.md mandatory before execution, archetype tone embedded in spawn prompts, copy validation as hard gate (no "Submit", "Learn More", "Click Here").

## Implications for Roadmap

Based on combined research, the rebuild should follow 8 phases in this order. The dependency chain is: Foundation (identity + quality) -> Pipeline (agents + commands) -> Design System (skills + scaffold) -> Quality Enforcement -> Specialists -> Remaining Skills -> Polish -> Multi-Page.

### Phase 1: Foundation (Plugin Skeleton + Core Identity)
**Rationale:** Everything depends on the plugin manifest, CLAUDE.md with embedded rules, and the 5 core skills. Without these, no other phase can function. This phase also establishes the tiered skill structure and the 4-layer skill format that all subsequent skills follow.
**Delivers:** plugin.json, CLAUDE.md, core skills (anti-slop-design, design-dna, design-archetypes, quality-standards, plan-format), discussion protocol agent, skill directory structure.
**Addresses:** TS-1 (Design DNA format), TS-2 (Archetype definitions), TS-3 (Anti-Slop Gate criteria).
**Avoids:** C2 (Generic Output) by establishing quality bar from day 1; M2 (Skill Bloat) by starting with tiered structure.
**Research flag:** Standard patterns. Core skills exist in v6.1.0 and need restructuring, not invention.

### Phase 2: Pipeline Core (Agent Architecture)
**Rationale:** The pipeline architecture is the single biggest structural improvement over v6.1.0. Building agents in execution order ensures each stage's output contract is validated by the next stage's input requirements. Context rot prevention must be woven into the build-orchestrator from the start.
**Delivers:** All 7 pipeline agents (researcher, creative-director, section-planner, build-orchestrator, section-builder, quality-reviewer, polisher). Context injection via spawn prompt pattern. CONTEXT.md lifecycle.
**Addresses:** TS-6 (Wave System), D-10 (Context Rot Prevention), TS-4 (Emotional Arc enforcement via section-planner).
**Avoids:** C1 (Context Rot) by designing pipeline with pre-extracted spawn prompts from the start; C5 (Coordination Failures) by building Complete Build Context template into build-orchestrator.
**Research flag:** Needs research. Spawn prompt optimization (what context to extract, what to omit) requires experimentation. Canary check question design needs tuning.

### Phase 3: Commands (User Interface Layer)
**Rationale:** Commands wire the pipeline to user-facing entry points. They are thin routing layers, so building them after agents ensures they route correctly. 6 commands replace 13, reducing user cognitive load.
**Delivers:** start-project, lets-discuss, plan-dev, execute, iterate, bug-fix commands. State checking and pipeline routing.
**Addresses:** All user-facing workflows. Discovery, planning, execution, verification, iteration.
**Avoids:** M5 (User Expectation Mismatch) by building reference-first discovery into start-project command.
**Research flag:** Standard patterns. Command format is well-established in v6.1.0.

### Phase 4: Quality Enforcement System
**Rationale:** Quality gates must exist before any real building happens. v6.1.0's verify-at-end approach catches problems too late. This phase builds the 4-layer progressive enforcement: pre-commit hook, post-wave audit, full verification, user checkpoints. Also adds severity-based classification (Critical/Major/Minor).
**Delivers:** Updated dna-compliance-check.sh hook with severity levels. Post-wave creative audit protocol. Quality-reviewer's 35-point gate + 4-axis Awwwards scoring. GAP-FIX.md format. Polisher agent refinement.
**Addresses:** TS-3 (Anti-Slop Gate enforcement), TS-9 (Performance budgets), TS-10 (Accessibility audit).
**Avoids:** C2 (Generic Output) by making Creative Courage scoring rigorous; M4 (Performance vs Aesthetics) by checking budgets at planning, not just verification.
**Research flag:** Needs research. Severity classification thresholds need calibration. Which violations are truly Critical vs Major?

### Phase 5: Design Skills (Emotional Arc, Motion, Tension, Wow Moments)
**Rationale:** These are the skills that make output award-worthy rather than merely correct. They depend on the foundation (Phase 1) and the pipeline (Phase 2) to deliver their value. Each skill is rewritten to the 4-layer structure (Decision Guidance, Award-Winning Examples, Integration Context, Anti-Patterns) with a 300-line maximum.
**Delivers:** emotional-arc, creative-tension, cinematic-motion, wow-moments, premium-typography, premium-dark-ui, light-mode-patterns, geometry-shapes, glow-neon-effects skills. Design system scaffold skill (D-8).
**Addresses:** TS-4 (Emotional Arc), TS-5 (Cinematic Motion), TS-7 (Creative Tension), D-1 (Wow Moments), D-3 (Shape Generation), D-8 (Scaffold), D-12 (Dark/Light Mode).
**Avoids:** D1 (Flat Arc) by embedding beat parameter constraints; D2 (Fade-In-Up Monoculture) by requiring animation direction assignments in PLAN.md.
**Research flag:** Needs research for new additions (View Transitions API patterns, scroll-snap storytelling, Lottie/Rive integration, WebGL shader backgrounds). Existing patterns from v6.1.0 are well-understood.

### Phase 6: Specialist Agents + Framework Skills
**Rationale:** With the pipeline and design skills in place, specialist agents add domain depth for complex sections. Framework skills ensure generated code actually works in Next.js, Astro, and Vite.
**Delivers:** animation-specialist, 3d-specialist, content-specialist agents. nextjs-app-router, astro-patterns, tailwind-patterns, shadcn-components, framer-motion, gsap-animations, css-animations, three-js-webgl skills.
**Addresses:** D-5 (3D/WebGL), D-2 (Copy Intelligence via content-specialist), D-4 (Component Marketplace knowledge). Framework compatibility (M3 prevention).
**Avoids:** C4 (Animation Reliability) by embedding cleanup patterns and library isolation rules; M3 (Framework Compatibility) by framework-specific skill sections.
**Research flag:** Needs research for Tailwind v4 `@theme` exact syntax, Next.js 16 specific features, Astro 5 Content Layer API. Verify against current docs before writing these skills.

### Phase 7: UX + Utility Skills
**Rationale:** These skills complete the knowledge base. They are referenced on-demand, not loaded by default, so they are lower priority than design skills.
**Delivers:** responsive-layout, accessibility-patterns, navigation-patterns, mobile-patterns, form-builder, error-states-ui, skeleton-loading, conversion-patterns, micro-copy, landing-page, portfolio-patterns, performance-patterns, seo-meta, testing-patterns, image-asset-pipeline, chart-data-viz skills.
**Addresses:** TS-8 (Responsive), TS-10 (Accessibility), D-9 (Competitive Benchmarking knowledge).
**Avoids:** D3 (Responsive as Afterthought) by making responsive specifications mandatory in PLAN.md format.
**Research flag:** Standard patterns. Well-documented in v6.1.0, needs restructuring to 4-layer format.

### Phase 8: System Polish + Multi-Page Support
**Rationale:** Final phase addresses the remaining gaps: multi-page architecture, canary check tuning, session boundary UX, page transitions, visual auditor integration. These are enhancements to a working system, not prerequisites.
**Delivers:** Multi-page artifact structure (pages/ directory, PAGE-CONSISTENCY.md). Canary check refinement. Session resume UX. Page transition knowledge. Visual auditor live testing integration.
**Addresses:** D-11 (Multi-Page Architecture), D-6 (Page Transitions), D-7 (Live Browser Testing).
**Avoids:** C1 (Context Rot) in multi-page context by isolating per-page state.
**Research flag:** Needs research. Multi-page orchestration across sessions is untested territory. Page-level DNA variants may need experimentation.

### Phase Ordering Rationale

- **Phases 1-2 first** because the pipeline architecture and core identity are prerequisites for everything. Without them, building skills or commands is building on sand.
- **Phase 3 (Commands) before Phase 4 (Quality)** because commands define the user workflow that quality gates plug into. Quality gates need to know when they are triggered (post-wave, post-phase, etc.).
- **Phase 5 (Design Skills) before Phase 6 (Specialists)** because specialist agents reference design skills. The animation-specialist needs cinematic-motion and gsap-animations skills to exist.
- **Phase 7 (UX/Utility) is low-priority** because these skills are on-demand references, not loaded by default. The system works without them; they add completeness.
- **Phase 8 last** because multi-page support and visual testing are enhancements to a working single-page system. Ship single-page excellence first.
- **This order avoids all 5 critical pitfalls**: C1 is addressed in Phase 2 (pipeline + spawn prompts), C2 in Phase 1 (quality bar) + Phase 5 (boldness enforcement), C3 in Phase 4 (immutable shared layer), C4 in Phase 6 (animation specialist + library isolation), C5 in Phase 2 (Complete Build Context).

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 2 (Pipeline Core):** Spawn prompt context optimization -- what to include/exclude requires experimentation. Canary check question calibration.
- **Phase 4 (Quality System):** Severity classification thresholds. Which violations truly warrant blocking vs queueing.
- **Phase 5 (Design Skills):** View Transitions API patterns, scroll-snap storytelling, Lottie/Rive integration -- these are new to the system and need API research.
- **Phase 6 (Framework Skills):** Tailwind v4 `@theme` exact syntax, Next.js 16 specific features, Astro 5 Content Layer API -- versions confirmed but APIs are from training data.
- **Phase 8 (Multi-Page):** Multi-page orchestration is largely uncharted. Per-page DNA variants, cross-page consistency enforcement, and session isolation patterns need design.

**Phases with standard patterns (skip deep research):**
- **Phase 1 (Foundation):** Core skills exist in v6.1.0; restructure, do not reinvent.
- **Phase 3 (Commands):** Command format is well-established. Route to pipeline stages.
- **Phase 7 (UX/Utility Skills):** Well-documented in v6.1.0, needs format conversion to 4-layer structure.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions verified via npm. API knowledge from training (May 2025) needs spot-checking for Tailwind v4, Next.js 16, Astro 5. |
| Features | HIGH | Primary source is the v6.1.0 codebase itself. Feature landscape derived from what exists + known gaps. WebSearch unavailable for competitor analysis. |
| Architecture | HIGH | Based on deep analysis of v6.1.0's 17 agents, 13 commands, and failure modes. Pipeline pattern is well-understood. |
| Pitfalls | HIGH | All pitfalls traced to specific v6.1.0 code (design-lead.md spawn patterns, section-builder embedded rules, quality-reviewer protocol). LLM context rot mechanisms are well-understood. |

**Overall confidence: HIGH** -- Research is primarily grounded in the existing codebase, which is the highest-fidelity source available. The rebuild is restructuring a known system, not inventing a new one.

### Gaps to Address

- **Tailwind v4 `@theme` syntax**: Version 4.2.0 confirmed but exact CSS-first configuration syntax needs validation against current docs before writing the tailwind-patterns skill. Design DNA token mapping depends on this.
- **Next.js 16 specific features**: PPR, Turbopack as default, improved Image component -- features from training data. Verify against nextjs.org before writing the nextjs-app-router skill.
- **Aceternity UI / Magic UI current state**: Component names and APIs may have changed since training cutoff. Verify against live sites before writing component marketplace guidance.
- **View Transitions API browser support**: Chrome 111+, Safari 18+ from training. Cross-browser fallback strategy needs current data.
- **Multi-page orchestration patterns**: No existing implementation to reference. Phase 8 will need experimentation and iteration.
- **Competitor landscape**: WebSearch was unavailable during research. Current state of v0, Cursor, Figma AI capabilities should be assessed when writing competitive benchmarking guidance.

## Sources

### Primary (HIGH confidence)
- Modulo v6.1.0 codebase: 87 skills, 17 agents, 13 commands -- full architecture analysis
- CLAUDE.md system overview and context rot prevention architecture
- agent files: design-lead.md, section-builder.md, quality-reviewer.md -- spawn patterns, embedded rules, verification protocol
- skill files: anti-slop-design, cinematic-motion, emotional-arc, creative-tension, wow-moments, micro-copy, performance-guardian, design-dna, design-archetypes -- domain knowledge
- npm registry: All package versions verified (GSAP 3.14.2, Motion 12.34.3, Tailwind 4.2.0, Next.js 16.1.6, Astro 5.17.3, Lenis 1.3.17, Three.js 0.183.1, Playwright 1.58.2)

### Secondary (MEDIUM confidence)
- Training data (through May 2025): Awwwards SOTD winner patterns, premium web design techniques, CSS scroll-driven animations API, View Transitions API
- Training data: Aceternity UI component catalog, Magic UI component catalog, 21st.dev marketplace
- Training data: Tailwind v4 breaking changes, Next.js 16 features, Astro 5 Content Layer API

### Tertiary (LOW confidence)
- 21st.dev marketplace (existence confirmed, current state unknown)
- Specific SOTD winner frequency percentages (domain expertise estimates, not verified against live data)

---
*Research completed: 2026-02-23*
*Ready for roadmap: yes*
