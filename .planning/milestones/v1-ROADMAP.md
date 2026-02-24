# Milestone v1: Modulo 2.0

**Status:** SHIPPED 2026-02-25
**Phases:** 1-13
**Total Plans:** 63

## Overview

Modulo 2.0 is a ground-up rebuild of the world's most complete frontend design plugin for Claude Code, transforming v6.1.0's proven design theory (archetypes, DNA, emotional arc, anti-slop gate) into structurally enforceable systems. The rebuild progresses from identity definitions through pipeline architecture, commands, quality enforcement, design skills, content intelligence, asset specialists, framework support, and finally integration polish -- each phase delivering a coherent, verifiable capability that the next phase builds upon.

## Phases

### Phase 1: Foundation
**Goal**: Agents and commands can reference a complete, machine-enforceable identity system with tiered skill loading and the 4-layer skill format established as the standard
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, SKIL-01, SKIL-02, SKIL-03
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
**Plans**: 6 plans

Plans:
- [x] 03-01-PLAN.md -- Start-Project command
- [x] 03-02-PLAN.md -- Lets-Discuss command
- [x] 03-03-PLAN.md -- Plan-Dev command
- [x] 03-04-PLAN.md -- Execute command
- [x] 03-05-PLAN.md -- Iterate + Bug-Fix commands
- [x] 03-06-PLAN.md -- Utility commands, v6.1.0 cleanup, plugin manifest update

### Phase 4: Quality Enforcement
**Goal**: Design quality is enforced progressively through 4 layers (build-time, post-wave, end-of-build, user checkpoint) so problems are caught where they are cheapest to fix
**Depends on**: Phase 2
**Requirements**: QUAL-01, QUAL-02, QUAL-03, QUAL-04, BILD-04
**Plans**: 5 plans

Plans:
- [x] 04-01-PLAN.md -- Reference benchmarking skill
- [x] 04-02-PLAN.md -- Compositional diversity skill
- [x] 04-03-PLAN.md -- Polish pass skill
- [x] 04-04-PLAN.md -- Live testing skill
- [x] 04-05-PLAN.md -- Quality gate protocol skill

### Phase 5: Motion & Design Skills
**Goal**: The plugin produces award-winning motion design through DNA-generated presets, diversity enforcement, and a rich library of wow moments, with a design system scaffold that makes slop harder to produce than quality
**Depends on**: Phase 1
**Requirements**: MOTN-01, MOTN-02, MOTN-03, MOTN-04, MOTN-05, BILD-02
**Plans**: 6 plans

Plans:
- [x] 05-01-PLAN.md -- Cinematic Motion skill
- [x] 05-02-PLAN.md -- Creative Tension skill
- [x] 05-03-PLAN.md -- Wow Moment Library skill
- [x] 05-04-PLAN.md -- Page Transition skill
- [x] 05-05-PLAN.md -- Performance-Aware Animation skill
- [x] 05-06-PLAN.md -- Design System Scaffold skill

### Phase 6: Brainstorming & Content
**Goal**: The plugin produces genuinely creative design directions through real-world research and cross-pollination, backed by a content intelligence engine that generates brand-appropriate copy instead of generic placeholder text
**Depends on**: Phase 1, Phase 2
**Requirements**: BRNS-01, BRNS-02, BRNS-03, BRNS-04, BRNS-05, CONT-01
**Plans**: 4 plans

Plans:
- [x] 06-01-PLAN.md -- Research-first brainstorming protocol
- [x] 06-02-PLAN.md -- Cross-pollination skill
- [x] 06-03-PLAN.md -- Creative direction format skill
- [x] 06-04-PLAN.md -- Copy Intelligence Engine skill

### Phase 7: Asset & Specialist Skills
**Goal**: The plugin can generate or integrate rich visual assets -- procedural shapes, 3D scenes, marketplace components, video content, Spline embeds, and AI image prompts -- all constrained to project DNA
**Depends on**: Phase 1, Phase 5
**Requirements**: CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07
**Plans**: 6 plans

Plans:
- [x] 07-01-PLAN.md -- Shape & Asset Generation skill
- [x] 07-02-PLAN.md -- 3D/WebGL Effects skill
- [x] 07-03-PLAN.md -- Component Marketplace skill
- [x] 07-04-PLAN.md -- Remotion skill
- [x] 07-05-PLAN.md -- Spline Integration skill
- [x] 07-06-PLAN.md -- Image Prompt Generation skill

### Phase 8: Experience & Frameworks
**Goal**: Every generated site works correctly across all target frameworks, is responsive from 375px up, meets WCAG 2.1 AA, supports multi-page architecture, and has award-worthy dark/light modes
**Depends on**: Phase 1, Phase 5
**Requirements**: EXPR-01, EXPR-02, EXPR-03, EXPR-04, DEVX-04, DEVX-05, SKIL-04
**Plans**: 8 plans

Plans:
- [x] 08-01-PLAN.md -- Tailwind v4 system skill
- [x] 08-02-PLAN.md -- Responsive Design skill
- [x] 08-03-PLAN.md -- Accessibility skill
- [x] 08-04-PLAN.md -- Dark/Light Mode skill
- [x] 08-05-PLAN.md -- Multi-page Architecture skill
- [x] 08-06-PLAN.md -- Next.js 16 + Astro 5/6 framework skills
- [x] 08-07-PLAN.md -- React/Vite + Desktop (Tauri/Electron) framework skills
- [x] 08-08-PLAN.md -- Remaining skill rewrites

### Phase 9: Integration & Polish
**Goal**: The system delivers a complete end-to-end workflow with Figma design import, design system export for handoff, transparent execution progress, and graceful error recovery from any failure state
**Depends on**: Phase 3, Phase 4
**Requirements**: BILD-05, BILD-06, DEVX-02, DEVX-03
**Plans**: 4 plans

Plans:
- [x] 09-01-PLAN.md -- Figma Integration skill
- [x] 09-02-PLAN.md -- Design System Export skill
- [x] 09-03-PLAN.md -- Progress Reporting skill
- [x] 09-04-PLAN.md -- Error Recovery skill

### Phase 10: Wire Quality Enforcement into Build Pipeline
**Goal**: Quality enforcement (CD + QR review after every wave) fires automatically during /execute
**Depends on**: Phase 2, Phase 4
**Plans**: 1 plan

Plans:
- [x] 10-01-PLAN.md -- Wire CD/QR invocation into build-orchestrator wave protocol

### Phase 11: Fix Stale Cross-References
**Goal**: All agent and command references across skills point to correct v2.0 names
**Depends on**: Phase 10
**Plans**: 2 plans

Plans:
- [x] 11-01-PLAN.md -- Systematic cross-reference repair
- [x] 11-02-PLAN.md -- Resolve REFERENCES.md producer gap

### Phase 12: Registry & Documentation
**Goal**: SKILL-DIRECTORY.md and README.md accurately reflect v2.0
**Depends on**: Phase 11
**Plans**: 2 plans

Plans:
- [x] 12-01-PLAN.md -- Rebuild SKILL-DIRECTORY.md from actual skill inventory
- [x] 12-02-PLAN.md -- Rewrite README.md for v2.0

### Phase 13: Legacy Cleanup
**Goal**: Remove all legacy v6.1.0 artifacts that conflict with or shadow v2.0 definitions
**Depends on**: Phase 12
**Plans**: 2 plans

Plans:
- [x] 13-01-PLAN.md -- Remove legacy v6.1.0 agents and resolve duplicates
- [x] 13-02-PLAN.md -- Remove superseded skills, fix bookkeeping, add missing constraints, wire brainstorm skills

## Milestone Summary

**Key Decisions:**
- Ground-up rewrite (not incremental improvement) -- v6.1.0 had fundamental quality enforcement gaps
- 6 core commands replacing 13 (expanded to 8 with utility commands) -- clear workflow, no bloat
- Pipeline agent model (researcher → designer → builder → reviewer → polisher) -- specialization produces better output
- Creative Director as dedicated agent with real authority (APPROVE/FLAG/PUSH)
- Domain specialist builders (3D, animation, content) -- generic builders can't be expert at everything
- Multi-layer quality enforcement (build-time + visual + creative + verification)
- 4-layer skill structure (guidance + examples + integration + anti-patterns)
- CSS scroll-driven animations as default, JS only when CSS cannot achieve the effect
- Stateless builders receiving pre-extracted context via spawn prompts
- 6-layer context rot prevention with canary checks and real consequences

**Issues Resolved:**
- GAP-1: Build-orchestrator missing CD/QR invocation (Phase 10)
- GAP-2: Stale "design-lead" references in Phase 9 skills (Phase 11)
- GAP-3: Stale "start-design" references in Figma flow (Phase 11)
- ISSUE-1-3: Stale command references across skills (Phase 11)
- ISSUE-4: SKILL-DIRECTORY.md entirely stale (Phase 12)
- ISSUE-5: README.md was v6.1.0 content (Phase 12)
- Legacy v6.1.0 agents and superseded skills removed (Phase 13)

**Issues Deferred:**
- awwwards-scoring legacy skill disposition (keep separate or fold into anti-slop-gate)
- 27 legacy v6.1.0 skills retained (documented, unused by v2.0 agents)
- Plugin manifest description minor inconsistency ("6 workflow commands")
- Frontmatter field naming (category vs tier) inconsistency across early vs late phases

**Technical Debt Incurred:**
- content-specialist baked-in rules need manual sync if copy-intelligence skill updates
- researcher.md has documentation inconsistency (rule says "no skill reads" but specific tracks do load skills)
- reference-benchmarking line count drift (568 claimed, 570 actual)

---

_For current project status, see .planning/ROADMAP.md_
_Archived: 2026-02-25_
