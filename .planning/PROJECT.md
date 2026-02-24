# Modulo 2.0

## What This Is

A Claude Code plugin for premium frontend design — the world's most complete design system for AI-assisted web development. Modulo 2.0 produces award-caliber (Awwwards SOTD 8.0+) websites through intelligent human-AI collaboration, with a pipeline architecture of specialized agents, multi-layer quality enforcement, and full-stack design capabilities spanning layout, shapes, 3D, animation, content, and motion identity. Targets Next.js, Astro, React/Vite, Tauri, and Electron with desktop-aware design patterns.

## Core Value

Every output must be award-winning by default — not as a stretch goal, but as the baseline. If a site built with Modulo 2.0 wouldn't score 8.0+ on Awwwards criteria, the system has failed.

## Requirements

### Validated

- ✓ 8-command guided workflow (start-project, lets-discuss, plan-dev, execute, iterate, bug-fix, status, audit) — v1
- ✓ Pipeline architecture (researcher → creative-director → section-planner → build-orchestrator → section-builder → quality-reviewer → polisher) — v1
- ✓ 19 design archetypes with machine-enforceable constraints + custom builder — v1
- ✓ Design DNA system (12 color tokens, type/spacing/motion, Tailwind v4 @theme) — v1
- ✓ 35-point Anti-Slop Gate across 7 categories with post-review enforcement — v1
- ✓ Emotional Arc (10 beat types with hard parameter constraints) — v1
- ✓ 45 skills in 4-layer format (Decision Guidance, Examples, Integration, Anti-Patterns) — v1
- ✓ 3-tier skill organization (Core/Domain/Utility) — v1
- ✓ Cinematic motion system with CSS scroll-driven default and diversity enforcement — v1
- ✓ Creative tension system (5 levels, per-archetype TSX implementations) — v1
- ✓ 35+ wow moment patterns with auto-suggestion matrix — v1
- ✓ Design system scaffold auto-generated from DNA — v1
- ✓ Multi-layer quality enforcement wired into build pipeline (CD + QR after every wave) — v1
- ✓ Content intelligence engine (brand voice, content bank, banned phrases) — v1
- ✓ Research-first brainstorming with cross-pollination and constraint-breaking — v1
- ✓ Shape & asset generation, 3D/WebGL, Remotion, Spline, image prompts — v1
- ✓ Responsive design (375px floor), accessibility (WCAG 2.1 AA), multi-page architecture — v1
- ✓ Dark/light mode with archetype-aware transitions — v1
- ✓ Framework support: Next.js 16, Astro 5/6, React/Vite, Tauri v2, Electron — v1
- ✓ Figma integration via MCP tools with DNA-Figma hybrid token resolution — v1
- ✓ Design system export (Storybook 10 + W3C DTCG tokens via Style Dictionary 5) — v1
- ✓ 6-layer context rot prevention with canary checks and session boundaries — v1
- ✓ Error recovery with severity classification and checkpoint resume — v1
- ✓ Guided flow (user always knows what to do next) — v1

### Active

**v1.5 — SEO/GEO & API Integration**

- [ ] Comprehensive SEO skill replacing seo-meta (meta tags, OG, Twitter Cards, canonical URLs, hreflang, JSON-LD structured data)
- [ ] GEO optimization for AI search engines (Google AI Overviews, Bing Copilot, ChatGPT search)
- [ ] XML sitemap generation + sitemap index for multi-page sites, validated for GSC and Bing Webmaster Tools
- [ ] robots.txt generation with sitemap references
- [ ] Full GSC/Bing submission workflow with verification instructions
- [ ] IndexNow full auto-setup: API key generation, verification file, framework-specific submission endpoint (Next.js API route, Astro endpoint, etc.)
- [ ] Context7 MCP integration for live API documentation lookup during builds
- [ ] Full-stack API integration patterns: server actions, API routes, middleware, env handling
- [ ] Typed client generation for external APIs (HubSpot, CRMs, etc.)
- [ ] Frontend data-fetching layer with loading/error states for API integrations

### Out of Scope

- Backend logic beyond API integration — Modulo handles API routes/server actions for external API wiring, but not custom backend business logic, databases, or ORMs
- Database / ORM integration — API integration connects to external services, not local databases
- Authentication logic — UI patterns only, not auth implementation
- Mobile native (React Native, Flutter) — web tech only (including in Tauri/Electron shells)
- Hosting / deployment automation — build output only, not deploy infra
- Template gallery / pre-built pages — antithesis of unique design
- Sound design / audio — too niche, controversial in web design
- Excessive archetype count (>19) — quality per archetype > quantity

## Context

**Current state:** Modulo 2.0 v1 shipped with 45 v2.0 skills, 14 agents (7 pipeline + 3 specialist + 4 protocols), 8 commands, and 1 Figma translator agent. 43,547 lines across 99 files. Plugin version 2.0.0-dev.

**v1.5 motivation:** Sites built with Modulo look award-worthy but perform poorly in search — missing structured data, no valid sitemaps, no indexing automation. Additionally, there's no systematic way to wire up external APIs (CRMs, SaaS tools) into the frontend. v1.5 addresses both gaps: comprehensive SEO/GEO best practices with submittable sitemaps and IndexNow, plus full-stack API integration patterns with Context7 MCP for live doc lookup.

**v6.1.0 pain points — all resolved:**
1. ~~Output quality drops over extended sessions~~ → 6-layer context rot prevention
2. ~~Agents gradually ignore design direction~~ → Creative Director with real authority + canary checks
3. ~~Animations break or default to fade-in-up~~ → Animation specialist + cinematic motion system
4. ~~Iteration breaks adjacent components~~ → Blast radius checking in iterate command
5. ~~Generated copy is generic~~ → Content intelligence engine with brand voice

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
| Ground-up rewrite (not incremental improvement) | v6.1.0 had fundamental quality enforcement gaps that can't be patched | ✓ Good — v2.0 shipped with all 54 requirements met |
| 8 commands replacing 13 (expanded from original 6) | Clear workflow with utility commands (status, audit) for observability | ✓ Good — guided flow works, no dead ends |
| Pipeline agent model with stateless builders | Specialization + context isolation prevents quality drift | ✓ Good — spawn prompts keep builders focused |
| Creative Director as dedicated agent with real authority | APPROVE/FLAG/PUSH authority catches drift immediately | ✓ Good — two-checkpoint review (pre-build + post-wave) |
| Domain specialist builders (3D, animation, content) | Generic builders can't be expert at everything | ✓ Good — routing via builder_type in PLAN.md |
| Multi-layer quality enforcement (4 layers) | Progressive enforcement catches problems where cheapest to fix | ✓ Good — wired into every wave via Steps 3.5/6.5-6.8 |
| 4-layer skill structure + 3-tier organization | Skills teach when/why, not just code snippets | ✓ Good — 45 skills with machine-readable constraints |
| CSS scroll-driven animations as default | Performance + progressive enhancement | ✓ Good — JS only when CSS cannot achieve the effect |
| 6-layer context rot prevention | Structural prevention, not advisory guidelines | ✓ Good — canary checks with real consequences |
| Brand voice + content bank system | Copy quality is design quality | ✓ Good — 19 archetype voice profiles, banned phrase enforcement |
| Severity-based build enforcement | Critical blocks, minor queues — balances quality with velocity | ✓ Good — findings merge with CRITICAL/WARNING/INFO |
| All design intent sources (Figma + references) | Different projects have different sources | ✓ Good — Figma MCP + reference benchmarking |

| Expand into full-stack API patterns (server actions, API routes) | External API integration requires server-side code; frontend-only fetch is insufficient for auth flows, webhooks, env secrets | — Pending |
| Replace seo-meta with comprehensive SEO/GEO skill | Existing skill too shallow; sites rank poorly despite looking great | — Pending |
| IndexNow auto-setup per framework | Instant indexing on deploy; passive sitemap discovery is too slow | — Pending |
| Context7 MCP for live API doc lookup | API docs change frequently; training data goes stale | — Pending |

---
*Last updated: 2026-02-25 after v1.5 milestone planning*
