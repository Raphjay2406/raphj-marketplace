# Roadmap: Modulo 2.0

## Overview

Modulo 2.0 is a ground-up rebuild of the world's most complete frontend design plugin for Claude Code, transforming v6.1.0's proven design theory (archetypes, DNA, emotional arc, anti-slop gate) into structurally enforceable systems. The rebuild progresses from identity definitions through pipeline architecture, commands, quality enforcement, design skills, content intelligence, asset specialists, framework support, and finally integration polish -- each phase delivering a coherent, verifiable capability that the next phase builds upon.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Core identity system, skill architecture, and plugin skeleton
- [x] **Phase 2: Pipeline Architecture** - Agent pipeline model with stateless builders and context rot prevention
- [x] **Phase 3: Command System** - 6 user-facing commands replacing 13, with guided workflow
- [ ] **Phase 4: Quality Enforcement** - Multi-layer quality gates from build-time to user checkpoints
- [x] **Phase 5: Motion & Design Skills** - Cinematic motion, creative tension, wow moments, and design system scaffold
- [x] **Phase 6: Brainstorming & Content** - Research-first ideation and copy intelligence engine
- [ ] **Phase 7: Asset & Specialist Skills** - Shape generation, 3D/WebGL, component marketplace, Remotion, Spline, image prompts
- [x] **Phase 8: Experience & Frameworks** - Responsive, accessibility, multi-page, dark/light mode, framework support, skill rewrites
- [x] **Phase 9: Integration & Polish** - Figma integration, design system export, progress reporting, error recovery
- [ ] **Phase 10: Wire Quality Enforcement** - Add CD/QR invocation to build-orchestrator wave protocol (GAP-1)
- [ ] **Phase 11: Fix Stale Cross-References** - Repair all stale agent/command references across skills (GAP-2, GAP-3, ISSUE-1-3)
- [ ] **Phase 12: Registry & Documentation** - Rebuild SKILL-DIRECTORY.md and rewrite README.md (ISSUE-4-5)
- [ ] **Phase 13: Legacy Cleanup** - Remove v6.1.0 agents/skills, fix bookkeeping, resolve duplicates

## Phase Details

### Phase 1: Foundation
**Goal**: Agents and commands can reference a complete, machine-enforceable identity system with tiered skill loading and the 4-layer skill format established as the standard
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, SKIL-01, SKIL-02, SKIL-03
**Success Criteria** (what must be TRUE):
  1. Design DNA skill defines all 12 color tokens, type scale, spacing scale, signature element, motion language, and forbidden patterns in a format that agents can parse and enforce programmatically
  2. All 16+ archetypes (including Neubrutalism, AI-Native, Dark Academia) have locked constraints, mandatory techniques, forbidden patterns, and 3 tension zones that are machine-readable (not advisory prose)
  3. Anti-Slop Gate defines all 35 points across 7 categories with scoring protocol (NOTE: CONTEXT.md overrides FOUND-03 -- post-review enforcement only, NOT inline self-check. The skill defines the scoring SYSTEM, enforcement is Phase 2/4)
  4. Emotional Arc defines all 10 beat types with hard parameter constraints (whitespace %, element count, viewport height) that are enforceable values, not suggestions
  5. Skill directory uses 3-tier structure (Core/Domain/Utility) with the 4-layer format (Decision Guidance, Award-Winning Examples, Integration Context, Anti-Patterns) and a concrete cull list of removed v6.1.0 skills
**Plans**: 6 plans

Plans:
- [x] 01-01-PLAN.md -- Plugin skeleton + CLAUDE.md rewrite + 4-layer skill template
- [x] 01-02-PLAN.md -- Design DNA skill (12 color tokens, type/spacing/motion, Tailwind v4 @theme)
- [x] 01-03-PLAN.md -- Design Archetypes skill (19 archetypes with locked constraints + custom builder)
- [x] 01-04-PLAN.md -- Anti-Slop Gate skill (35-point weighted scoring, post-review enforcement)
- [x] 01-05-PLAN.md -- Emotional Arc skill (10 beats with hard parameter constraints)
- [x] 01-06-PLAN.md -- Skill directory (3-tier structure, cull list, v6.1.0 cleanup)

### Phase 2: Pipeline Architecture
**Goal**: Work flows through a defined pipeline (Research -> Design -> Build -> Review -> Polish) where each agent has explicit input/output contracts, builders are stateless with pre-extracted context, and context rot is structurally prevented
**Depends on**: Phase 1
**Requirements**: AGNT-01, AGNT-02, AGNT-03, AGNT-04, BILD-01, BILD-03
**Success Criteria** (what must be TRUE):
  1. Seven pipeline agents (researcher, creative-director, section-planner, build-orchestrator, section-builder, quality-reviewer, polisher) each have defined input/output contracts with explicit context budgets
  2. Section builders receive all context via spawn prompts (<200 lines total) and read exactly one file (PLAN.md) -- no STATE.md access, no cross-referencing other builders
  3. Creative Director agent actively reviews output against DNA and creative vision, proposes bold directions, and catches drift immediately (not at end-of-phase)
  4. Context rot prevention is structural: mandatory session boundaries every 2 waves, pre-compiled DNA snapshots in spawn prompts, canary checks with real consequences (2+ failures = new session), CONTEXT.md rewritten every wave
  5. 3-layer agent memory (living context file, growing design system, reviewer feedback loop) enables pattern accumulation across waves without context window bloat
**Plans**: 7 plans

Plans:
- [x] 02-01-PLAN.md -- Pipeline agent definitions (researcher, section-planner, build-orchestrator)
- [x] 02-02-PLAN.md -- Creative Director agent with active review protocol
- [x] 02-03-PLAN.md -- Section builder with stateless spawn prompt pattern
- [x] 02-04-PLAN.md -- Quality reviewer and polisher agents
- [x] 02-05-PLAN.md -- Domain specialist agent definitions (3D, animation, content)
- [x] 02-06-PLAN.md -- Context rot prevention system (CONTEXT.md lifecycle, canary checks, session boundaries)
- [x] 02-07-PLAN.md -- Agent memory system (3-layer: context file, design system, feedback loop)

### Phase 3: Command System
**Goal**: Users interact with Modulo through 6 clear commands that route to pipeline stages, with guided flow making it impossible to get lost
**Depends on**: Phase 2
**Requirements**: CMND-01, CMND-02, CMND-03, CMND-04, CMND-05, CMND-06, DEVX-01
**Success Criteria** (what must be TRUE):
  1. `/modulo:Start-Project` runs questioning, parallel research agents, requirements generation, and roadmap creation -- producing PROJECT.md, DESIGN-DNA.md, and BRAINSTORM.md
  2. `/modulo:lets-discuss` enables per-phase creative deep dive with visual feature proposals (user chooses), brand voice content suggestions, and auto-organized task output
  3. `/modulo:plan-dev` produces context-rot-safe PLAN.md files for each section with re-research, verification questions, and chunk boundaries
  4. `/modulo:execute` runs plans sequentially or in parallel waves per master plan, with real-time status updates
  5. `/modulo:iterate` and `/modulo:bug-fix` both require brainstorming before changes, present proposed solutions for user approval, and preserve adjacent component integrity
  6. At every step, the plugin tells the user exactly what to do next -- there is never a "now what?" moment
**Plans**: 6 plans

Plans:
- [x] 03-01-PLAN.md -- Start-Project command: thin router for discovery, parallel research, DNA generation, content planning (~120-150 lines)
- [x] 03-02-PLAN.md -- Lets-Discuss command: per-phase creative deep dive with visual proposals, voice refinement, DISCUSSION-{phase}.md output (~100-130 lines)
- [x] 03-03-PLAN.md -- Plan-Dev command: phase-scoped re-research, discussion integration, context-rot-safe PLAN.md generation (~100-140 lines)
- [x] 03-04-PLAN.md -- Execute command: thin wrapper around build-orchestrator with session resume, flags, canary checks (~80-120 lines)
- [x] 03-05-PLAN.md -- Iterate + Bug-Fix commands: brainstorm-first design changes (creative) and diagnostic root cause analysis (bugs)
- [x] 03-06-PLAN.md -- Utility commands (status, audit), v6.1.0 cleanup, plugin manifest update, guided flow consistency verification

### Phase 4: Quality Enforcement
**Goal**: Design quality is enforced progressively through 4 layers (build-time, post-wave, end-of-build, user checkpoint) so problems are caught where they are cheapest to fix
**Depends on**: Phase 2
**Requirements**: QUAL-01, QUAL-02, QUAL-03, QUAL-04, BILD-04
**Success Criteria** (what must be TRUE):
  1. Every section plan includes a real-world quality target (URL or screenshot of award-winning work) that sets the bar for builder output
  2. Post-build polish pass adds micro-details (noise textures, gradient borders, custom selection color, hover micro-interactions, cursor effects) as a dedicated stage, not an afterthought
  3. No two adjacent sections share the same layout pattern -- this is structurally enforced via pre-assignment in MASTER-PLAN.md, not caught in review
  4. Live browser testing auto-screenshots at 4 breakpoints (375, 768, 1024, 1440px), runs Lighthouse with hard fail at score <80, monitors animation FPS (flag <30fps), and runs axe-core accessibility audit
  5. Creative Director reviews each section against DNA and creative vision before acceptance, with specific improvement actions when drift is detected
**Plans**: 5 plans

Plans:
- [x] 04-01-PLAN.md -- Reference benchmarking skill: curated per-archetype library, PLAN.md reference target format, quality comparison protocol
- [x] 04-02-PLAN.md -- Compositional diversity skill: 18-pattern taxonomy across 6 visual groups, adjacency rules, MASTER-PLAN.md layout assignment format
- [x] 04-03-PLAN.md -- Polish pass skill: universal 8-category checklist, 19 archetype addenda with FORBIDDEN items, creative license protocol
- [x] 04-04-PLAN.md -- Live testing skill: 4-step Playwright MCP protocol (screenshots, Lighthouse, axe-core, FPS), thresholds, report format
- [x] 04-05-PLAN.md -- Quality gate protocol skill: 4-layer progressive enforcement, severity classification, running tally, user checkpoint logic

### Phase 5: Motion & Design Skills
**Goal**: The plugin produces award-winning motion design through DNA-generated presets, diversity enforcement, and a rich library of wow moments, with a design system scaffold that makes slop harder to produce than quality
**Depends on**: Phase 1
**Requirements**: MOTN-01, MOTN-02, MOTN-03, MOTN-04, MOTN-05, BILD-02
**Success Criteria** (what must be TRUE):
  1. Cinematic Motion skill generates per-project motion presets from DNA, enforces motion diversity (no 3 consecutive same-direction animations), and defaults to CSS scroll-driven animations
  2. Creative Tension skill provides copy-paste TSX implementations per archetype, mandates tension moments in PEAK beats, and pushes boldness further rather than holding back
  3. Wow Moment Library includes 30+ patterns spanning View Transitions API, Lottie/Rive, WebGL shaders, and scroll-linked video, with auto-suggestion based on archetype + beat type
  4. Page Transition skill covers View Transitions API (native), Framer Motion AnimatePresence, shared element transitions, and per-archetype transition choreography
  5. Design System Scaffold skill auto-generates typed utilities, section templates per beat type, motion presets, and color utilities from DNA -- making arbitrary hex values and unsanctioned patterns structurally difficult
**Plans**: 6 plans

Plans:
- [x] 05-01-PLAN.md -- Cinematic Motion skill: unified motion system (CSS scroll-driven default, 19 archetype profiles, diversity enforcement, v6.1.0 library skill cull)
- [x] 05-02-PLAN.md -- Creative Tension skill: 5 levels with safe/aggressive ranges, 19 archetype TSX implementations, dual adjacency rules, PEAK mandate
- [x] 05-03-PLAN.md -- Wow Moment Library skill: 33+ tiered patterns (copy-paste/pattern/guidance), three-factor auto-suggestion matrix
- [x] 05-04-PLAN.md -- Page Transition skill: View Transitions API (Astro stable, Next.js experimental), AnimatePresence fallback, per-archetype choreography
- [x] 05-05-PLAN.md -- Performance-Aware Animation skill: CWV compliance, code-splitting patterns, font loading, performance budgets, will-change discipline
- [x] 05-06-PLAN.md -- Design System Scaffold skill: Tailwind v4 @theme generation, typed utilities, 10 beat templates, extension mechanism

### Phase 6: Brainstorming & Content
**Goal**: The plugin produces genuinely creative design directions through real-world research and cross-pollination, backed by a content intelligence engine that generates brand-appropriate copy instead of generic placeholder text
**Depends on**: Phase 1, Phase 2
**Requirements**: BRNS-01, BRNS-02, BRNS-03, BRNS-04, BRNS-05, CONT-01
**Success Criteria** (what must be TRUE):
  1. Brainstorming starts with real-world research of Awwwards winners, Dribbble, and competitor sites for the specific industry -- never from a blank slate
  2. Cross-pollination technique borrows from unrelated industries (e.g., SaaS from fashion editorial, fintech from gaming) for unexpected visual language
  3. Constraint-breaking identifies the "rules" for the target industry and proposes breaking specific ones with clear intent and rationale
  4. 2 refined creative directions include ASCII mockup prototypes and motion identity, each distinct enough to represent a real choice
  5. Copy Intelligence Engine generates a brand voice document during brainstorm, maintains a content bank of pre-generated headlines/CTAs/descriptions, enforces banned generic phrases ("Submit", "Learn More", "Click Here"), and produces archetype-aware micro-copy
**Plans**: 4 plans

Plans:
- [x] 06-01-PLAN.md -- Research-first brainstorming protocol: complete design-brainstorm rewrite with 7-phase process, curated 12-industry library, competitive teardown framework
- [x] 06-02-PLAN.md -- Cross-pollination skill: industry rule catalogs, distant-industry pairing matrix, constraint-breaking protocol, double coherence guardrails
- [x] 06-03-PLAN.md -- Creative direction format skill: full concept board template, ASCII mockup system, distinctness validation, free mixing protocol
- [x] 06-04-PLAN.md -- Copy Intelligence Engine skill: brand voice template, archetype voice profiles, content bank matrix, tiered banned phrases, voice extraction protocol

### Phase 7: Asset & Specialist Skills
**Goal**: The plugin can generate or integrate rich visual assets -- procedural shapes, 3D scenes, marketplace components, video content, Spline embeds, and AI image prompts -- all constrained to project DNA
**Depends on**: Phase 1, Phase 5
**Requirements**: CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07
**Success Criteria** (what must be TRUE):
  1. Shape & Asset Generation skill produces geometric patterns, organic shapes, isometric objects, custom illustrations, animated SVG paths, and per-archetype shape palettes -- all using DNA color tokens, never random
  2. 3D/WebGL skill covers React Three Fiber integration, shader effects (noise, liquid, holographic), scroll-driven 3D, with progressive enhancement (static fallback) and mobile detection/downgrade
  3. Component Marketplace skill provides a when-to-use matrix per archetype + beat for Aceternity UI, Magic UI, 21st.dev, and Framer marketplace, with restyling guidance for DNA token integration
  4. Remotion and Spline skills provide integration patterns for video content generation and 3D scene embedding with proper performance handling
  5. Image Prompt Generation skill produces prompts for AI image tools (Midjourney, DALL-E, Flux) that match project DNA palette, style, and archetype personality
**Plans**: 6 plans

Plans:
- [x] 07-01-PLAN.md -- Shape & Asset Generation skill: procedural patterns, archetype palettes, DNA tokens, SVG animation suite, v6.1.0 geometry-shapes cull
- [x] 07-02-PLAN.md -- 3D/WebGL Effects skill: R3F v9, shader building blocks, three-tier responsive, scroll-driven 3D, WebGPU forward-looking, v6.1.0 three-js-webgl cull
- [x] 07-03-PLAN.md -- Component Marketplace skill: category-level when-to-use matrix, 4-step restyling protocol, 30% hard cap, Framer as reference
- [x] 07-04-PLAN.md -- Remotion skill: DNA-aware video compositions, core API, hero/product/social templates, licensing, @remotion/player
- [x] 07-05-PLAN.md -- Spline Integration skill: embedding, DNA color mapping, event handling, R3F bridge, performance, scene creation guidance
- [x] 07-06-PLAN.md -- Image Prompt Generation skill: DNA-to-prompt translation, category templates, negative prompts, archetype image stance

### Phase 8: Experience & Frameworks
**Goal**: Every generated site works correctly across all target frameworks, is responsive from 375px up, meets WCAG 2.1 AA, supports multi-page architecture, and has award-worthy dark/light modes
**Depends on**: Phase 1, Phase 5
**Requirements**: EXPR-01, EXPR-02, EXPR-03, EXPR-04, DEVX-04, DEVX-05, SKIL-04
**Success Criteria** (what must be TRUE):
  1. Responsive Design skill enforces mobile-first with 375px hard constraint, clamp() typography, and container queries -- responsive is not a review concern but a build constraint
  2. Accessibility skill bakes WCAG 2.1 AA into every component template: ARIA attributes, keyboard navigation, focus management, motion-safe/motion-reduce variants, automated axe-core audit patterns
  3. Multi-page architecture skill covers site-level DNA, page-type templates (landing, about, pricing, blog, docs, contact), shared components, and per-page emotional arcs
  4. Framework skills for Next.js (App Router), Astro (Islands), React/Vite, Tauri, and Electron produce correct idiomatic code with framework-specific patterns detected and adapted automatically
  5. All surviving skills are rewritten to current library versions (Tailwind v4 @theme, Motion 12.x, GSAP 3.14) with the 4-layer quality standard, and code quality standards (TypeScript strict, clean structure, consistent naming) are enforced
**Plans**: 8 plans

Plans:
- [x] 08-01-PLAN.md -- Tailwind v4 system skill: @theme CSS-first config, DNA 12-token mapping, container queries, dark mode @custom-variant, animation presets
- [x] 08-02-PLAN.md -- Responsive Design skill: mobile-first 375px floor, hybrid typography (clamp body + stepped display), container queries, touch targets
- [x] 08-03-PLAN.md -- Accessibility skill: WCAG 2.1 AA baked-in, 19 archetype focus indicators, ARIA patterns, keyboard nav, reduced-motion per archetype
- [x] 08-04-PLAN.md -- Dark/Light Mode skill: dual independent palettes, archetype signature transitions, FOUC prevention, dual asset support
- [x] 08-05-PLAN.md -- Multi-page Architecture skill: site-level DNA, 6 page-type templates with emotional arcs, shared components, cross-page cohesion
- [x] 08-06-PLAN.md -- Next.js 16 + Astro 5/6 framework skills: proxy.ts, async params, ClientRouter, Content Layer, Islands architecture
- [x] 08-07-PLAN.md -- React/Vite + Desktop (Tauri/Electron) framework skills: SPA patterns, custom titlebars, drag regions, platform awareness
- [x] 08-08-PLAN.md -- Remaining skill rewrites: 7 domain/utility skills to 4-layer format with current library versions

### Phase 9: Integration & Polish
**Goal**: The system delivers a complete end-to-end workflow with Figma design import, design system export for handoff, transparent execution progress, and graceful error recovery from any failure state
**Depends on**: Phase 3, Phase 4
**Requirements**: BILD-05, BILD-06, DEVX-02, DEVX-03
**Success Criteria** (what must be TRUE):
  1. Figma Integration reads designs via MCP tools, translates to code following project Design DNA, and supports Figma as a design intent source for visual QA comparison
  2. Design System Export produces Storybook components and design tokens package from the generated system for handoff to design teams
  3. Multi-level progress reporting shows real-time agent status updates, wave summaries with screenshots, and milestone checkpoints with user review gates
  4. Error recovery diagnoses problems, proposes solutions for user approval before applying, and can cleanly resume from any failure state including mid-wave crashes and session interruptions
**Plans**: 4 plans

Plans:
- [x] 09-01-PLAN.md -- Figma Integration skill: MCP tool decision tree, DNA-Figma hybrid token resolution, PLAN.md generation from Figma, visual QA overlay diff, agent rewrite
- [x] 09-02-PLAN.md -- Design System Export skill: Storybook 10 CSF Factories stories, W3C DTCG tokens via Style Dictionary 5, multi-format output (CSS/JSON/Figma)
- [x] 09-03-PLAN.md -- Progress Reporting skill: 4-tier reporting (task/section/wave/milestone), STATE.md extensions, review gates, screenshot protocol
- [x] 09-04-PLAN.md -- Error Recovery skill: severity classification (MINOR/MAJOR/CRITICAL), structured diagnosis, checkpoint resume, failure pattern escalation

### Phase 10: Wire Quality Enforcement into Build Pipeline
**Goal**: Quality enforcement (CD + QR review after every wave) fires automatically during `/execute`, completing the build-time -> post-wave -> end-of-build -> user-checkpoint quality chain
**Depends on**: Phase 2, Phase 4
**Requirements**: GAP-1 (CRITICAL), Flow 1 (partial), Flow 3 (broken)
**Gap Closure**: Closes audit GAP-1 + Flow 3 + Flow 1 partial
**Success Criteria** (what must be TRUE):
  1. Build-orchestrator spawns creative-director and quality-reviewer in parallel after every wave completes
  2. Build-orchestrator `tools:` frontmatter includes CD and QR agent references
  3. GAP-FIX.md from QR triggers polisher automatically, then re-review loop runs
  4. Wave review gate blocks next wave until CD/QR findings are addressed or user approves proceeding
**Plans**: 1 plan

Plans:
- [ ] 10-01-PLAN.md -- Wire CD/QR invocation into build-orchestrator wave protocol: pre-build CD review, post-wave CD+QR parallel review, findings merge, GAP-FIX remediation loop, wave review gate, running tally, execute.md update

### Phase 11: Fix Stale Cross-References
**Goal**: All agent and command references across skills point to correct v2.0 names, and the REFERENCES.md producer/consumer chain is resolved
**Depends on**: Phase 10
**Requirements**: GAP-2 (CRITICAL), GAP-3 (CRITICAL), ISSUE-1 (MAJOR), ISSUE-2 (MAJOR), ISSUE-3 (MAJOR), Flow 2 (broken), Flow 4 (broken)
**Gap Closure**: Closes audit GAP-2, GAP-3, ISSUE-1, ISSUE-2, ISSUE-3 + Flow 2, Flow 4
**Success Criteria** (what must be TRUE):
  1. Zero references to `design-lead` in any v2.0 skill or agent (replaced with `build-orchestrator`)
  2. Zero references to `start-design` in any skill or agent (replaced with `start-project`)
  3. Zero references to `plan-sections` in any skill (replaced with `plan-dev`)
  4. Zero references to `/modulo:verify` (replaced with `/modulo:audit`) or `/modulo:export` (removed or rewired)
  5. REFERENCES.md either produced by a command/agent or consumers updated to read the correct artifact

Plans:
- [ ] 11-01-PLAN.md -- Systematic cross-reference repair: design-lead, start-design, plan-sections, verify/export replacements
- [ ] 11-02-PLAN.md -- Resolve REFERENCES.md producer gap (either add production step or update consumers)

### Phase 12: Registry & Documentation Update
**Goal**: SKILL-DIRECTORY.md accurately reflects the complete v2.0 skill inventory and README.md documents the correct v2.0 architecture, commands, and workflow
**Depends on**: Phase 11
**Requirements**: ISSUE-4 (MAJOR), ISSUE-5 (MAJOR)
**Gap Closure**: Closes audit ISSUE-4 and ISSUE-5
**Success Criteria** (what must be TRUE):
  1. SKILL-DIRECTORY.md lists every skill in `skills/` with correct name, tier, status, and description
  2. No "PLANNED" entries remain for skills that are complete
  3. README.md documents v2.0 commands (8), pipeline agents, 19 archetypes, and correct workflow sequence
  4. README.md version matches plugin manifest version

Plans:
- [ ] 12-01-PLAN.md -- Rebuild SKILL-DIRECTORY.md from actual skill inventory
- [ ] 12-02-PLAN.md -- Rewrite README.md for v2.0

### Phase 13: Legacy Cleanup
**Goal**: Remove all legacy v6.1.0 artifacts that conflict with or shadow v2.0 definitions, fix remaining bookkeeping, and ensure clean repository state
**Depends on**: Phase 12
**Requirements**: Tech debt items from audit
**Gap Closure**: Closes all tech debt items from milestone audit
**Success Criteria** (what must be TRUE):
  1. No legacy v6.1.0 agents remain in `agents/` root (design-lead, design-researcher, quality-reviewer, section-builder, specialist auditors removed)
  2. Duplicate discussion-protocol.md resolved (keep Phase 2 version at agents/protocols/)
  3. Superseded v6.1.0 skills removed from `skills/`
  4. REQUIREMENTS.md and ROADMAP.md bookkeeping updated (checkmarks, status)
  5. react-vite-patterns has Machine-Readable Constraints section
  6. Phantom typography/color-system directory entries resolved
  7. Phase 6 brainstorm skills explicitly referenced by relevant agents

Plans:
- [ ] 13-01-PLAN.md -- Remove legacy v6.1.0 agents and resolve duplicates
- [ ] 13-02-PLAN.md -- Remove superseded skills, fix bookkeeping, add missing constraints, wire brainstorm skills

## Progress

**Execution Order:**
Phases 1-9: original build (complete). Phases 10-13: gap closure from v1 milestone audit.
Phase order: 10 -> 11 -> 12 -> 13 (sequential, each depends on prior)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 6/6 | Complete | 2026-02-24 |
| 2. Pipeline Architecture | 7/7 | Complete | 2026-02-24 |
| 3. Command System | 6/6 | Complete | 2026-02-24 |
| 4. Quality Enforcement | 5/5 | Complete | 2026-02-24 |
| 5. Motion & Design Skills | 6/6 | Complete | 2026-02-24 |
| 6. Brainstorming & Content | 4/4 | Complete | 2026-02-24 |
| 7. Asset & Specialist Skills | 6/6 | Complete | 2026-02-24 |
| 8. Experience & Frameworks | 8/8 | Complete | 2026-02-24 |
| 9. Integration & Polish | 4/4 | Complete | 2026-02-24 |
| 10. Wire Quality Enforcement | 0/1 | Planned | -- |
| 11. Fix Stale Cross-References | 0/2 | Pending | -- |
| 12. Registry & Documentation | 0/2 | Pending | -- |
| 13. Legacy Cleanup | 0/2 | Pending | -- |

---
*Roadmap created: 2026-02-23*
*Last updated: 2026-02-25 -- Phase 10 planned (1 plan, 1 wave)*
