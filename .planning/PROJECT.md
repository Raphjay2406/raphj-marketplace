# Modulo 2.0

## What This Is

A ground-up rebuild of the Modulo Claude Code plugin — the world's most complete frontend design system. Modulo 2.0 produces award-caliber (Awwwards SOTD 8.0+) websites through intelligent human-AI collaboration, with a pipeline architecture of specialized agents, multi-layer quality enforcement, and full-stack design capabilities spanning layout, shapes, 3D, animation, content, and motion identity. It targets Next.js, Astro, React/Vite, Tauri, and Electron with desktop-aware design patterns.

## Core Value

Every output must be award-winning by default — not as a stretch goal, but as the baseline. If a site built with Modulo 2.0 wouldn't score 8.0+ on Awwwards criteria, the system has failed.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Command System (6 focused commands replacing 13):**
- [ ] `/modulo:Start-Project` — Questioning (design direction, archetype, animation style/intensity, brand voice) → Research (parallel agents studying award-winning design, best practices, competitors) → Requirements (milestone/MVP/v1/v2 boundaries) → Roadmap (phases mapped to requirements)
- [ ] `/modulo:lets-discuss` — Per-phase creative deep dive: visual features (propose award-winning ideas with choices), content systems (brand voice suggestions), task organization (auto-organize by priority)
- [ ] `/modulo:plan-dev` — Re-research focused on the phase sector, plan in context-rot-safe chunks, verification questions
- [ ] `/modulo:execute` — Run plans sequentially or parallel as defined in planning/master plan
- [ ] `/modulo:iterate` — Design changes with user verification, brainstorming and discussion before changes, marketplace component sourcing
- [ ] `/modulo:bug-fix` — Fix issues with user verification, brainstorming before fixes, diagnosis + proposed solutions

**Agent Architecture (Pipeline Model):**
- [ ] Creative Director agent — Owns creative vision, actively reviews output, proposes bold directions, catches drift early
- [ ] Pipeline stages: Researcher → Designer → Builder → Reviewer → Polisher (each adds their layer)
- [ ] Domain specialist builders: 3D/Spline specialist, animation specialist (GSAP/Framer), layout specialist, content specialist
- [ ] 3-layer agent memory: living context file + growing design system + reviewer feedback loop

**Quality System (Multi-Layer Enforcement):**
- [ ] Build-time DNA compliance — hard block on critical deviations (wrong colors, wrong fonts), queue minor issues
- [ ] Visual QA — screenshot comparison against design intent (Figma, AI mockups, reference sites)
- [ ] Creative audit (post-wave) — tension moments, emotional arc, wow factor scoring + specific improvement actions
- [ ] Full verification (end of phase) — 4-axis Awwwards scoring + anti-slop gate, pass/fail with gap-closure plan
- [ ] User checkpoints — strategic approval gates before proceeding
- [ ] Severity-based enforcement: critical violations block, minor issues queued for batch fix

**Capabilities:**
- [ ] Shape & asset generation — geometric patterns, organic shapes, isometric/3D shapes, custom illustrations, ASCII art, dot matrix art. Intentional shapes, not random blobs.
- [ ] 3D & Spline integration — context-dependent: simple Three.js scenes by default, complex scenes (custom shaders, physics, post-processing) when design demands it. Spline embeds supported.
- [ ] Advanced animation system — GSAP ScrollTrigger, Framer Motion choreography, page transitions, Remotion video content (hero animations, product showcases, social media assets, micro-interactions). Natural language generation ("parallax hero with floating 3D objects") backed by a recipe library.
- [ ] Component marketplace integration — research, suggest, and implement (with user approval) from 21st.dev, Aceternity UI, Magic UI, Framer marketplace

**Design Brainstorming:**
- [ ] Real-world research first — study actual Awwwards winners, Dribbble, competitor sites for the specific industry
- [ ] Cross-pollination — borrow from unrelated industries for unexpected visual language
- [ ] Constraint-breaking — identify industry "rules" and propose breaking specific ones
- [ ] Visual prototyping via ASCII mockups before committing to code
- [ ] 2 refined creative directions (less quantity, more depth)
- [ ] Motion identity as part of Design DNA (easing curves, timing, entrance styles, scroll behavior)

**Content System:**
- [ ] Brand voice system — detailed voice guide (vocabulary, sentence structure, do/don't phrases) + pre-generated content bank
- [ ] Content strategy — planned narrative arc across the page, what story each section tells
- [ ] Content generation — real, usable copy, never lorem ipsum or placeholder
- [ ] Copy approval flow — user reviews generated content before it enters sections

**Skill Architecture:**
- [ ] 4-layer skill structure: decision guidance (when/why) + award-winning examples + integration context (DNA/archetype connection) + anti-patterns
- [ ] Tiered organization: Core (always loaded) + Domain (per project) + Utility (on demand)
- [ ] Cull non-design skills (admin-panel, webhook-api-patterns, database-crud-ui, etc.)
- [ ] Every skill rewritten to the new quality standard

**Developer Experience:**
- [ ] Guided flow — plugin tells you exactly what to do next, impossible to get lost
- [ ] Conversational — feels like working with a design partner, not a tool
- [ ] Transparent execution — multi-level progress (real-time agent status, wave summaries, milestone checkpoints)
- [ ] Error recovery — diagnose + propose solutions (user approves before applying)
- [ ] Clean context rot handling — session boundaries, canary checks, seamless resume

**Testing & QA:**
- [ ] Visual verification — screenshots match at all 4 breakpoints (375, 768, 1024, 1440px)
- [ ] Animation verification — smooth triggers, correct behavior, no jank
- [ ] Performance verification — Core Web Vitals green (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] Accessibility verification — WCAG 2.1 AA (keyboard nav, screen reader, contrast, focus states)
- [ ] Automated Playwright tests — layout, animation, interaction, CI-ready
- [ ] Visual snapshot comparison — automated screenshots against reference
- [ ] Guided manual sign-off — plugin opens browser, guides user through checklist

**Framework Support:**
- [ ] Next.js (App Router, React Server Components)
- [ ] Astro (Islands, View Transitions)
- [ ] React/Vite (plain React, no meta-framework)
- [ ] Tauri (detect target, desktop-native UI patterns: title bars, system tray, window management)
- [ ] Electron (detect target, desktop-native UI patterns)

### Out of Scope

- Backend logic / API development — Modulo is frontend design only
- Database / ORM integration — not a full-stack framework
- Authentication logic — UI patterns only, not auth implementation
- Mobile native (React Native, Flutter) — web tech only (including in Tauri/Electron shells)
- Hosting / deployment automation — build output only, not deploy infra

## Context

**Current state:** Modulo v6.1.0 exists with 87 skills, 13 commands, 17 agents. The architecture works but produces inconsistent quality. Section builders ignore Design DNA over time, animations are unreliable, copy is generic, and the command structure is bloated with niche commands.

**Critical pain points to solve:**
1. Output quality drops over extended sessions (context rot)
2. Agents gradually ignore design direction (DNA drift)
3. Animations break or default to fade-in-up (no animation specialization)
4. Iteration breaks adjacent components (no impact analysis)
5. Generated copy is generic despite micro-copy skill (no brand voice integration)

**Competitive landscape:**
- v0 (Vercel) — fast but generic, no design intelligence, one-shot generation
- Cursor / AI code editors — general coding, user directs all design decisions
- Figma + AI plugins — design-first but code-second, animation is separate concern

**Our differentiator:** The only tool that produces premium, award-caliber frontend design through intelligent human-AI collaboration — creative intelligence that proposes ideas designers wouldn't think of, not just code generation.

## Constraints

- **Repository format**: Plugin is markdown-only (skills, agents, commands). No application code, no build system, no test suite.
- **Plugin system**: Must conform to Claude Code plugin manifest format (`.claude-plugin/plugin.json`)
- **Quality baseline**: Every design output must target Awwwards SOTD (8.0+ average, no axis below 7)
- **Context window**: Skills and agents must be written to minimize context consumption. Tiered loading is essential.
- **Framework support**: Must generate correct, idiomatic code for all 5 target frameworks

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Ground-up rewrite (not incremental improvement) | Current architecture has fundamental quality enforcement gaps that can't be patched | -- Pending |
| 6 commands replacing 13 | Current command set is bloated with niche commands (admin-panel, etc.), unclear flow | -- Pending |
| Pipeline agent model (researcher → designer → builder → reviewer → polisher) | Current flat model (one builder does everything) produces inconsistent quality | -- Pending |
| Creative Director as dedicated agent | Design-lead is currently too thin — coordinates but doesn't direct creative vision | -- Pending |
| Domain specialist builders (3D, animation, layout, content) | Generic builders can't be expert at everything — specialization produces better output | -- Pending |
| Multi-layer quality enforcement (build-time + visual + creative + verification) | Current verify-at-end approach catches problems too late, rework is expensive | -- Pending |
| Tiered skill organization (core/domain/utility) | 87 flat skills is overwhelming, many aren't core to frontend design | -- Pending |
| 4-layer skill structure (guidance + examples + integration + anti-patterns) | Current skills are code snippet libraries — they don't teach agents when/why to use techniques | -- Pending |
| ASCII mockups for design prototyping | Immediate, no-tooling-required visualization before committing to code | -- Pending |
| Brand voice + content bank system | Current micro-copy templates produce generic output regardless of project personality | -- Pending |
| Severity-based build enforcement | Hard block on critical DNA violations, queue minor issues — balances quality with velocity | -- Pending |
| All design intent sources (Figma + AI mockups + reference sites) | Different projects have different sources; supporting all maximizes flexibility | -- Pending |

---
*Last updated: 2026-02-23 after initialization*
