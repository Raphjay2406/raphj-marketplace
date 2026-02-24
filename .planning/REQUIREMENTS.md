# Requirements: Modulo 2.0

**Defined:** 2026-02-23
**Core Value:** Every output must be award-winning by default (Awwwards SOTD 8.0+) -- not as a stretch goal, but as the baseline.

## v1 Requirements

### Foundation & Identity

- [ ] **FOUND-01**: Machine-enforced Design DNA -- every color, font, spacing value traces to DNA tokens. Violations are compile-time errors, not review-time catches.
- [ ] **FOUND-02**: 16+ Design Archetypes with locked constraints + 2-3 new archetypes (Neubrutalism, AI-Native, Dark Academia). All constraints machine-enforced via code, not advisory.
- [ ] **FOUND-03**: Anti-Slop Gate shifted from post-hoc to inline enforcement -- builders self-check before emitting code. 35-point / 7-category scoring with hard fail at 25/35.
- [ ] **FOUND-04**: Emotional Arc with beat parameters as hard constraints -- BREATHE must have 70-80% whitespace, BUILD must have 8-12 elements, HOOK must be 90-100vh. Parameters enforced, not suggested.

### Motion & Creativity

- [ ] **MOTN-01**: Cinematic Motion System with DNA-generated presets, motion diversity enforcement (no 3 consecutive same-direction animations), CSS scroll-driven as default path.
- [ ] **MOTN-02**: Creative Tension with copy-paste implementations per archetype, mandatory tension moment in PEAK beats, boldness calibration that pushes further not holds back.
- [ ] **MOTN-03**: Expanded Wow Moment Library (30+) with View Transitions API, Lottie/Rive, WebGL shaders, scroll-linked video. Auto-suggestion given archetype + beat type.
- [ ] **MOTN-04**: Page Transition System -- View Transitions API (native browser), Framer Motion AnimatePresence, shared element transitions, per-archetype transition choreography.
- [ ] **MOTN-05**: Performance-Aware Animation -- CWV compliance alongside heavy animation. Auto code-splitting of GSAP/Three.js. CSS scroll-driven as default. Font loading strategy baked into scaffold.

### Build System

- [x] **BILD-01**: Stateless Wave System -- all context pre-extracted into spawn prompts (<200 lines total). No builder reads STATE.md or cross-references other builders' output.
- [ ] **BILD-02**: Design System Scaffold from DNA -- typed utilities, section templates per beat type, motion presets, color utilities that prevent arbitrary hex values. Makes it harder to produce slop than quality.
- [x] **BILD-03**: Context Rot Prevention -- radical context minimization, pre-compiled DNA snapshots (~20 values per section), automated drift detection comparing output against DNA tokens, mandatory session boundaries.
- [ ] **BILD-04**: Live Browser Testing -- auto screenshot at 4 breakpoints (375, 768, 1024, 1440px), Lighthouse audit with hard fail at score <80, animation FPS monitoring (flag <30fps), axe-core accessibility audit.
- [ ] **BILD-05**: Figma Integration -- read Figma designs via MCP tools, translate to code following project Design DNA, support as design intent source for visual QA comparison.
- [ ] **BILD-06**: Design System Export -- export generated design system as Storybook components and design tokens package for handoff to design teams.

### Content & Assets

- [ ] **CONT-01**: Copy Intelligence Engine -- brand voice document generated during brainstorm, content bank of pre-generated headlines/CTAs/descriptions, copy validation gates (no "Submit"/"Learn More"/"Click Here" survives the build), archetype-aware micro-copy.
- [ ] **CONT-02**: Shape & Asset Generation -- geometric patterns, organic shapes, isometric objects, custom illustrations, ASCII art, dot matrix patterns, animated SVG paths, per-archetype shape palettes. All shapes use DNA color tokens. Intentional, not random.
- [ ] **CONT-03**: 3D & WebGL Effects -- React Three Fiber integration, shader effects (noise displacement, liquid distortion, holographic), scroll-driven 3D scenes, progressive enhancement with static image fallback, mobile detection and downgrade.
- [ ] **CONT-04**: Component Marketplace Knowledge -- Aceternity UI, Magic UI, 21st.dev, Framer marketplace. When-to-use matrix per archetype + beat. Restyling guidance for DNA token integration. Research, suggest, implement with user approval.
- [ ] **CONT-05**: Remotion Integration -- video content generation for hero animations, product showcases, social media assets, micro-interactions. Used when video-based animation is the right approach.
- [ ] **CONT-06**: Spline Integration -- embed Spline 3D scenes, configure for project needs, proper loading and performance handling.
- [ ] **CONT-07**: Image Prompt Generation -- generate high-quality prompts for AI image tools (Midjourney, DALL-E, Flux) matching project DNA palette, style, and archetype personality.

### Quality Mechanisms

- [ ] **QUAL-01**: Reference-based building -- each section has a real-world quality target (URL/screenshot of award-winning work) that sets the bar for builder output.
- [ ] **QUAL-02**: Polish pass -- dedicated post-build pass adding micro-details (noise textures, gradient borders, custom selection color, hover micro-interactions, cursor effects).
- [ ] **QUAL-03**: Compositional diversity enforcement -- no two adjacent sections share the same layout pattern. Structurally enforced via PLAN.md pre-assignment.
- [ ] **QUAL-04**: Real-time Creative Director review -- each section reviewed against DNA and creative vision before acceptance. Drift caught immediately, not at end.

### Experience & Frameworks

- [ ] **EXPR-01**: Responsive Design enforced -- mobile-first, 375px as hard constraint, clamp() typography, container queries for component responsiveness.
- [ ] **EXPR-02**: Accessibility baked in -- WCAG 2.1 AA in every component template, ARIA attributes, keyboard navigation, focus management, motion-safe/motion-reduce variants, automated axe-core audit.
- [ ] **EXPR-03**: Multi-page architecture -- site-level DNA, page-type templates (landing, about, pricing, blog, docs, contact), shared components (nav, footer, theme), per-page emotional arcs.
- [ ] **EXPR-04**: Archetype-aware dark/light mode -- both themes hand-tuned per archetype, both award-worthy. Transition animation matches archetype personality.

### Agent Architecture

- [x] **AGNT-01**: Pipeline model -- Researcher -> Designer -> Builder -> Reviewer -> Polisher, each with defined input/output contracts and limited context scope.
- [x] **AGNT-02**: Creative Director agent -- dedicated vision owner, actively reviews output against DNA and creative brief, proposes bold directions, catches drift immediately.
- [x] **AGNT-03**: Domain specialist builders -- 3D/Spline specialist, animation specialist (GSAP/Motion), layout specialist, content specialist. Each deeply expert in their domain.
- [x] **AGNT-04**: 3-layer agent memory -- living context file capturing patterns/decisions, growing design system shared across builders, reviewer feedback loop informing future work.

### Command System

- [ ] **CMND-01**: `/modulo:Start-Project` -- Questioning (design direction, archetype, animation style/intensity, brand voice) -> Research (parallel agents) -> Requirements -> Roadmap
- [ ] **CMND-02**: `/modulo:lets-discuss` -- Per-phase creative deep dive: visual features with choices, content systems with brand voice, auto-organized task list
- [ ] **CMND-03**: `/modulo:plan-dev` -- Re-research focused on phase sector, plan in context-rot-safe chunks, verification questions before execution
- [ ] **CMND-04**: `/modulo:execute` -- Run plans sequential or parallel per planning/master plan definition
- [ ] **CMND-05**: `/modulo:iterate` -- Design changes with user verification, brainstorming before changes, marketplace component sourcing from 21st.dev/Aceternity/Magic UI
- [ ] **CMND-06**: `/modulo:bug-fix` -- Diagnose + propose solutions, user approval before fixing, brainstorming to ensure best approach

### Skill System

- [ ] **SKIL-01**: 4-layer skill structure -- decision guidance (when/why) + award-winning examples (not basic usage) + integration context (DNA/archetype connection) + anti-patterns (common mistakes)
- [ ] **SKIL-02**: Tiered organization -- Core (always loaded: DNA, anti-slop, typography, color, layout, motion), Domain (per project: 3D, Remotion, e-commerce, dashboard), Utility (on demand: SEO, a11y, perf, testing)
- [ ] **SKIL-03**: Cull non-design skills -- remove backend/infrastructure skills (admin-panel, webhook-api-patterns, database-crud-ui, auth logic, CMS, payment, analytics). Target ~30-40 pure design skills.
- [ ] **SKIL-04**: Every surviving skill rewritten to new quality standard with current library versions (Tailwind v4, Motion 12.x, GSAP 3.14, etc.)

### Developer Experience

- [ ] **DEVX-01**: Guided flow -- plugin tells user exactly what to do next at every step. Impossible to get lost.
- [ ] **DEVX-02**: Multi-level progress -- real-time agent status updates, wave summaries with screenshots, milestone checkpoints with user review.
- [ ] **DEVX-03**: Error recovery -- diagnose problems, propose solutions, user approves before applying. Clean resume from any failure state.
- [ ] **DEVX-04**: Framework support -- Next.js (App Router), Astro (Islands), React/Vite, Tauri (desktop-aware), Electron (desktop-aware). Detect target and adapt patterns.
- [ ] **DEVX-05**: Code quality standards -- TypeScript strict mode, clean component structure, proper file organization, consistent naming conventions in target projects.

### Brainstorming

- [ ] **BRNS-01**: Research-first brainstorming -- study actual Awwwards winners, Dribbble, competitor sites for the specific industry before ideating.
- [ ] **BRNS-02**: Cross-pollination -- borrow from unrelated industries for unexpected visual language. SaaS that borrows from fashion editorial, fintech from gaming.
- [ ] **BRNS-03**: Constraint-breaking -- identify the "rules" for the target industry and propose breaking specific ones with intent.
- [ ] **BRNS-04**: 2 refined creative directions with ASCII mockup prototyping, motion identity included in each direction.
- [ ] **BRNS-05**: Competitive Benchmarking -- category-specific baseline knowledge, "avoid these" lists per category, opportunity mapping for underused techniques.

## v2 Requirements

(None -- all items moved to v1)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend / API / database logic | Frontend design only -- Modulo handles the visual layer |
| Template gallery / pre-built pages | Antithesis of unique design -- archetypes + DNA ensure uniqueness |
| Drag-and-drop visual builder | CLI-based tool, code output -- different architecture entirely |
| Real-time collaboration / multiplayer | Single session scope, CONTEXT.md enables handoff |
| CMS integration logic | Infrastructure, not design -- output clean data structures CMS can populate |
| Direct AI image generation | Different AI models required -- generate prompts instead (CONT-07) |
| Analytics / tracking code | Boilerplate, not design -- clean head structure, user adds their own |
| Sound design / audio | Too niche, controversial in web design |
| Mobile native (React Native, Flutter) | Web tech only (including in Tauri/Electron shells) |
| Hosting / deployment automation | Build output only, not deploy infrastructure |
| Excessive archetype count (>19) | Quality per archetype > quantity -- max 19 with custom builder |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1: Foundation | Complete |
| FOUND-02 | Phase 1: Foundation | Complete |
| FOUND-03 | Phase 1: Foundation | Complete |
| FOUND-04 | Phase 1: Foundation | Complete |
| MOTN-01 | Phase 5: Motion & Design Skills | Pending |
| MOTN-02 | Phase 5: Motion & Design Skills | Pending |
| MOTN-03 | Phase 5: Motion & Design Skills | Pending |
| MOTN-04 | Phase 5: Motion & Design Skills | Pending |
| MOTN-05 | Phase 5: Motion & Design Skills | Pending |
| BILD-01 | Phase 2: Pipeline Architecture | Complete |
| BILD-02 | Phase 5: Motion & Design Skills | Pending |
| BILD-03 | Phase 2: Pipeline Architecture | Complete |
| BILD-04 | Phase 4: Quality Enforcement | Pending |
| BILD-05 | Phase 9: Integration & Polish | Pending |
| BILD-06 | Phase 9: Integration & Polish | Pending |
| CONT-01 | Phase 6: Brainstorming & Content | Pending |
| CONT-02 | Phase 7: Asset & Specialist Skills | Pending |
| CONT-03 | Phase 7: Asset & Specialist Skills | Pending |
| CONT-04 | Phase 7: Asset & Specialist Skills | Pending |
| CONT-05 | Phase 7: Asset & Specialist Skills | Pending |
| CONT-06 | Phase 7: Asset & Specialist Skills | Pending |
| CONT-07 | Phase 7: Asset & Specialist Skills | Pending |
| QUAL-01 | Phase 4: Quality Enforcement | Pending |
| QUAL-02 | Phase 4: Quality Enforcement | Pending |
| QUAL-03 | Phase 4: Quality Enforcement | Pending |
| QUAL-04 | Phase 4: Quality Enforcement | Pending |
| EXPR-01 | Phase 8: Experience & Frameworks | Pending |
| EXPR-02 | Phase 8: Experience & Frameworks | Pending |
| EXPR-03 | Phase 8: Experience & Frameworks | Pending |
| EXPR-04 | Phase 8: Experience & Frameworks | Pending |
| AGNT-01 | Phase 2: Pipeline Architecture | Complete |
| AGNT-02 | Phase 2: Pipeline Architecture | Complete |
| AGNT-03 | Phase 2: Pipeline Architecture | Complete |
| AGNT-04 | Phase 2: Pipeline Architecture | Complete |
| CMND-01 | Phase 3: Command System | Pending |
| CMND-02 | Phase 3: Command System | Pending |
| CMND-03 | Phase 3: Command System | Pending |
| CMND-04 | Phase 3: Command System | Pending |
| CMND-05 | Phase 3: Command System | Pending |
| CMND-06 | Phase 3: Command System | Pending |
| SKIL-01 | Phase 1: Foundation | Complete |
| SKIL-02 | Phase 1: Foundation | Complete |
| SKIL-03 | Phase 1: Foundation | Complete |
| SKIL-04 | Phase 8: Experience & Frameworks | Pending |
| DEVX-01 | Phase 3: Command System | Pending |
| DEVX-02 | Phase 9: Integration & Polish | Pending |
| DEVX-03 | Phase 9: Integration & Polish | Pending |
| DEVX-04 | Phase 8: Experience & Frameworks | Pending |
| DEVX-05 | Phase 8: Experience & Frameworks | Pending |
| BRNS-01 | Phase 6: Brainstorming & Content | Pending |
| BRNS-02 | Phase 6: Brainstorming & Content | Pending |
| BRNS-03 | Phase 6: Brainstorming & Content | Pending |
| BRNS-04 | Phase 6: Brainstorming & Content | Pending |
| BRNS-05 | Phase 6: Brainstorming & Content | Pending |

**Coverage:**
- v1 requirements: 54 total
- Mapped to phases: 54
- Unmapped: 0

---
*Requirements defined: 2026-02-23*
*Last updated: 2026-02-24 — Phase 1 requirements marked Complete*
