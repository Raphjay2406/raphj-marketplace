# Roadmap: Modulo 2.0

## Overview

Modulo 2.0 is a ground-up rebuild of the world's most complete frontend design plugin for Claude Code, transforming v6.1.0's proven design theory (archetypes, DNA, emotional arc, anti-slop gate) into structurally enforceable systems. The rebuild progresses from identity definitions through pipeline architecture, commands, quality enforcement, design skills, content intelligence, asset specialists, framework support, and finally integration polish -- each phase delivering a coherent, verifiable capability that the next phase builds upon.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Core identity system, skill architecture, and plugin skeleton
- [ ] **Phase 2: Pipeline Architecture** - Agent pipeline model with stateless builders and context rot prevention
- [ ] **Phase 3: Command System** - 6 user-facing commands replacing 13, with guided workflow
- [ ] **Phase 4: Quality Enforcement** - Multi-layer quality gates from build-time to user checkpoints
- [ ] **Phase 5: Motion & Design Skills** - Cinematic motion, creative tension, wow moments, and design system scaffold
- [ ] **Phase 6: Brainstorming & Content** - Research-first ideation and copy intelligence engine
- [ ] **Phase 7: Asset & Specialist Skills** - Shape generation, 3D/WebGL, component marketplace, Remotion, Spline, image prompts
- [ ] **Phase 8: Experience & Frameworks** - Responsive, accessibility, multi-page, dark/light mode, framework support, skill rewrites
- [ ] **Phase 9: Integration & Polish** - Figma integration, design system export, progress reporting, error recovery

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
- [ ] 01-01-PLAN.md -- Plugin skeleton + CLAUDE.md rewrite + 4-layer skill template
- [ ] 01-02-PLAN.md -- Design DNA skill (12 color tokens, type/spacing/motion, Tailwind v4 @theme)
- [ ] 01-03-PLAN.md -- Design Archetypes skill (19 archetypes with locked constraints + custom builder)
- [ ] 01-04-PLAN.md -- Anti-Slop Gate skill (35-point weighted scoring, post-review enforcement)
- [ ] 01-05-PLAN.md -- Emotional Arc skill (10 beats with hard parameter constraints)
- [ ] 01-06-PLAN.md -- Skill directory (3-tier structure, cull list, v6.1.0 cleanup)

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
- [ ] 02-01-PLAN.md -- Pipeline agent definitions (researcher, section-planner, build-orchestrator)
- [ ] 02-02-PLAN.md -- Creative Director agent with active review protocol
- [ ] 02-03-PLAN.md -- Section builder with stateless spawn prompt pattern
- [ ] 02-04-PLAN.md -- Quality reviewer and polisher agents
- [ ] 02-05-PLAN.md -- Domain specialist agent definitions (3D, animation, content)
- [ ] 02-06-PLAN.md -- Context rot prevention system (CONTEXT.md lifecycle, canary checks, session boundaries)
- [ ] 02-07-PLAN.md -- Agent memory system (3-layer: context file, design system, feedback loop)

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
- [ ] 03-01-PLAN.md -- Start-Project command: thin router for discovery, parallel research, DNA generation, content planning (~120-150 lines)
- [ ] 03-02-PLAN.md -- Lets-Discuss command: per-phase creative deep dive with visual proposals, voice refinement, DISCUSSION-{phase}.md output (~100-130 lines)
- [ ] 03-03-PLAN.md -- Plan-Dev command: phase-scoped re-research, discussion integration, context-rot-safe PLAN.md generation (~100-140 lines)
- [ ] 03-04-PLAN.md -- Execute command: thin wrapper around build-orchestrator with session resume, flags, canary checks (~80-120 lines)
- [ ] 03-05-PLAN.md -- Iterate + Bug-Fix commands: brainstorm-first design changes (creative) and diagnostic root cause analysis (bugs)
- [ ] 03-06-PLAN.md -- Utility commands (status, audit), v6.1.0 cleanup, plugin manifest update, guided flow consistency verification

### Phase 4: Quality Enforcement
**Goal**: Design quality is enforced progressively through 4 layers (build-time, post-wave, end-of-phase, user checkpoint) so problems are caught where they are cheapest to fix
**Depends on**: Phase 2
**Requirements**: QUAL-01, QUAL-02, QUAL-03, QUAL-04, BILD-04
**Success Criteria** (what must be TRUE):
  1. Every section plan includes a real-world quality target (URL or screenshot of award-winning work) that sets the bar for builder output
  2. Post-build polish pass adds micro-details (noise textures, gradient borders, custom selection color, hover micro-interactions, cursor effects) as a dedicated stage, not an afterthought
  3. No two adjacent sections share the same layout pattern -- this is structurally enforced via pre-assignment in MASTER-PLAN.md, not caught in review
  4. Live browser testing auto-screenshots at 4 breakpoints (375, 768, 1024, 1440px), runs Lighthouse with hard fail at score <80, monitors animation FPS (flag <30fps), and runs axe-core accessibility audit
  5. Creative Director reviews each section against DNA and creative vision before acceptance, with specific improvement actions when drift is detected
**Plans**: TBD

Plans:
- [ ] 04-01: Reference-quality benchmarking system (real-world targets per section)
- [ ] 04-02: Compositional diversity enforcement (layout pre-assignment, adjacency rules)
- [ ] 04-03: Polish pass protocol (micro-detail checklist, polisher agent refinement)
- [ ] 04-04: Live browser testing integration (screenshots, Lighthouse, FPS, axe-core)
- [ ] 04-05: Quality gate integration (severity classification, 4-layer progressive enforcement)

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
**Plans**: TBD

Plans:
- [ ] 05-01: Cinematic Motion skill (DNA presets, diversity enforcement, CSS scroll-driven default)
- [ ] 05-02: Creative Tension skill (copy-paste TSX per archetype, PEAK enforcement, boldness calibration)
- [ ] 05-03: Wow Moment Library skill (30+ patterns, auto-suggestion matrix)
- [ ] 05-04: Page Transition skill (View Transitions, AnimatePresence, shared elements)
- [ ] 05-05: Performance-Aware Animation skill (CWV compliance, code-splitting, font loading)
- [ ] 05-06: Design System Scaffold skill (typed utilities, beat templates, DNA-enforced tokens)

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
**Plans**: TBD

Plans:
- [ ] 06-01: Research-first brainstorming protocol (Awwwards/Dribbble/competitor study)
- [ ] 06-02: Cross-pollination and constraint-breaking techniques
- [ ] 06-03: Creative direction format (ASCII mockups, motion identity, competitive benchmarking)
- [ ] 06-04: Copy Intelligence Engine skill (brand voice, content bank, banned phrases, archetype tone)

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
**Plans**: TBD

Plans:
- [ ] 07-01: Shape & Asset Generation skill (procedural patterns, archetype palettes, DNA tokens)
- [ ] 07-02: 3D/WebGL Effects skill (R3F, shaders, scroll-driven, progressive enhancement)
- [ ] 07-03: Component Marketplace skill (when-to-use matrix, restyling guidance)
- [ ] 07-04: Remotion skill (video content patterns)
- [ ] 07-05: Spline Integration skill (3D scene embedding, performance)
- [ ] 07-06: Image Prompt Generation skill (DNA-matched prompts for AI image tools)

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
**Plans**: TBD

Plans:
- [ ] 08-01: Responsive Design skill (mobile-first, 375px constraint, clamp(), container queries)
- [ ] 08-02: Accessibility skill (WCAG AA baked-in, ARIA, keyboard, focus, motion-safe)
- [ ] 08-03: Multi-page architecture skill (site DNA, page templates, shared components)
- [ ] 08-04: Dark/Light mode skill (archetype-aware, both themes award-worthy, transition animation)
- [ ] 08-05: Framework skills -- Next.js and Astro (App Router, Islands, detection)
- [ ] 08-06: Framework skills -- React/Vite, Tauri, Electron (desktop-aware patterns)
- [ ] 08-07: Tailwind v4 skill rewrite (@theme CSS-first, DNA token mapping)
- [ ] 08-08: Remaining skill rewrites to 4-layer format and current library versions

### Phase 9: Integration & Polish
**Goal**: The system delivers a complete end-to-end workflow with Figma design import, design system export for handoff, transparent execution progress, and graceful error recovery from any failure state
**Depends on**: Phase 3, Phase 4
**Requirements**: BILD-05, BILD-06, DEVX-02, DEVX-03
**Success Criteria** (what must be TRUE):
  1. Figma Integration reads designs via MCP tools, translates to code following project Design DNA, and supports Figma as a design intent source for visual QA comparison
  2. Design System Export produces Storybook components and design tokens package from the generated system for handoff to design teams
  3. Multi-level progress reporting shows real-time agent status updates, wave summaries with screenshots, and milestone checkpoints with user review gates
  4. Error recovery diagnoses problems, proposes solutions for user approval before applying, and can cleanly resume from any failure state including mid-wave crashes and session interruptions
**Plans**: TBD

Plans:
- [ ] 09-01: Figma Integration skill (MCP tools, DNA translation, visual QA source)
- [ ] 09-02: Design System Export skill (Storybook components, design tokens package)
- [ ] 09-03: Progress reporting system (real-time status, wave summaries, checkpoints)
- [ ] 09-04: Error recovery system (diagnosis, proposed solutions, clean resume)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9
Note: Phases 3 and 4 both depend on Phase 2. Phases 5, 6, 7, 8 can partially overlap as they depend on Phase 1 (and some on Phase 2/5).

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/6 | Planned | - |
| 2. Pipeline Architecture | 0/7 | Planned | - |
| 3. Command System | 0/6 | Planned | - |
| 4. Quality Enforcement | 0/5 | Not started | - |
| 5. Motion & Design Skills | 0/6 | Not started | - |
| 6. Brainstorming & Content | 0/4 | Not started | - |
| 7. Asset & Specialist Skills | 0/6 | Not started | - |
| 8. Experience & Frameworks | 0/8 | Not started | - |
| 9. Integration & Polish | 0/4 | Not started | - |

---
*Roadmap created: 2026-02-23*
*Last updated: 2026-02-23*
