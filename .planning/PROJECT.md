# Modulo 2.0

## What This Is

A Claude Code plugin for premium frontend design — the world's most complete design system for AI-assisted web development. Modulo 2.0 produces award-caliber (Awwwards SOTD 8.0+) websites through intelligent human-AI collaboration, with a pipeline architecture of specialized agents, multi-layer quality enforcement, and full-stack design capabilities spanning layout, shapes, 3D, animation, content, motion identity, SEO/GEO discoverability, and API integration. Targets Next.js, Astro, React/Vite, Tauri, and Electron with desktop-aware design patterns. Sites are discoverable and rankable by default across search engines, AI engines, and social platforms.

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
- ✓ Comprehensive SEO with framework-native meta tags, sitemaps, robots.txt, hreflang, and AI crawler taxonomy — v1.5
- ✓ Typed JSON-LD structured data for 10 schema types with post-iteration audit protocol — v1.5
- ✓ GEO optimization for AI search engines integrated into Emotional Arc beats — v1.5
- ✓ IndexNow auto-setup with content-hash tracking for Bing/Yandex/Naver instant indexing — v1.5
- ✓ Search visibility with AI-aware robots.txt, llms.txt, and webmaster tools submission workflows — v1.5
- ✓ Context7 MCP integration for live API documentation lookup during builds — v1.5
- ✓ Full-stack API integration: server-side proxies, CRM forms, typed clients, webhooks, env management — v1.5
- ✓ DNA-integrated dynamic OG image generation for Next.js and Astro — v1.5
- ✓ SSR/ISR/streaming decision guidance with CMS revalidation for 5 platforms — v1.5
- ✓ Auth-gated content patterns for Auth.js v5, Clerk, Supabase, and Better Auth — v1.5
- ✓ Cache strategy guidance with Next.js 4-layer cache system and CDN headers — v1.5
- ✓ All v1.5 skills wired into pipeline (5 agents updated, SKILL-DIRECTORY at 51 skills) — v1.5

### Active

(None — next milestone not yet planned)

### Out of Scope

- Backend logic beyond API integration — Modulo handles API routes/server actions for external API wiring, but not custom backend business logic, databases, or ORMs
- Database / ORM integration — API integration connects to external services, not local databases
- Authentication logic — UI patterns only, not auth implementation (v1.5 added auth-gated rendering patterns but not auth setup)
- Mobile native (React Native, Flutter) — web tech only (including in Tauri/Electron shells)
- Hosting / deployment automation — build output only, not deploy infra
- Template gallery / pre-built pages — antithesis of unique design
- Sound design / audio — too niche, controversial in web design
- Excessive archetype count (>19) — quality per archetype > quantity
- SEO keyword research / backlink analysis — Modulo generates code, not marketing strategy
- Automated Rich Results testing — deferred to v2 (SEO-V2-01)
- GEO performance measurement / A/B testing — deferred to v2 (GEO-V2-01)
- GraphQL integration patterns — deferred to v2 (API-V2-01)

## Context

**Current state:** Modulo 2.0 v1.5 shipped with 51 skills (22 Core + 26 Domain + 2 Utility + 1 template), 14 agents (7 pipeline + 3 specialist + 4 protocols), 8 commands, and 1 Figma translator agent. v1.5 added 6 new skills (seo-meta rewrite, structured-data, search-visibility, api-patterns, og-images, ssr-dynamic-content) totaling 8,433 lines plus 4 appendices. 7 agent/skill files updated with pipeline wiring. Plugin version 2.0.0-dev.

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

**Our differentiator:** The only tool that produces premium, award-caliber frontend design through intelligent human-AI collaboration — creative intelligence that proposes ideas designers wouldn't think of, not just code generation. Now also the only design plugin with built-in SEO/GEO discoverability, structured data, and API integration patterns.

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
| 4-layer skill structure + 3-tier organization | Skills teach when/why, not just code snippets | ✓ Good — 51 skills with machine-readable constraints |
| CSS scroll-driven animations as default | Performance + progressive enhancement | ✓ Good — JS only when CSS cannot achieve the effect |
| 6-layer context rot prevention | Structural prevention, not advisory guidelines | ✓ Good — canary checks with real consequences |
| Brand voice + content bank system | Copy quality is design quality | ✓ Good — 19 archetype voice profiles, banned phrase enforcement |
| Severity-based build enforcement | Critical blocks, minor queues — balances quality with velocity | ✓ Good — findings merge with CRITICAL/WARNING/INFO |
| All design intent sources (Figma + references) | Different projects have different sources | ✓ Good — Figma MCP + reference benchmarking |
| Expand into full-stack API patterns (server actions, API routes) | External API integration requires server-side code; frontend-only fetch is insufficient for auth flows, webhooks, env secrets | ✓ Good — v1.5 shipped api-patterns skill (1600 lines) with 22 patterns |
| Replace seo-meta with comprehensive SEO/GEO skill | Existing skill too shallow; sites rank poorly despite looking great | ✓ Good — v1.5 shipped rewritten seo-meta (928 lines) + structured-data (1091 lines) + search-visibility (579 lines) |
| IndexNow auto-setup per framework | Instant indexing on deploy; passive sitemap discovery is too slow | ✓ Good — v1.5 shipped search-visibility with IndexNow auto-setup and content-hash tracking |
| Context7 MCP for live API doc lookup | API docs change frequently; training data goes stale | ✓ Good — v1.5 wired Context7 MCP into researcher agent with 3-step fallback chain |
| 3-skill split for SEO (seo-meta + structured-data + search-visibility) | Each skill has distinct purpose and justified line count | ✓ Good — no consolidation needed, smallest is 579 lines |
| Framework-native only (no react-helmet, next-seo) | Deprecated libraries add bundle weight and lag behind framework APIs | ✓ Good — all patterns use generateMetadata, Astro head, React 19 hoisting |
| Cache Components over PPR (Next.js 16) | PPR graduated to Cache Components in Next.js 16 | ✓ Good — documented as primary approach with clear migration |
| All pipeline wiring strictly additive | No existing agent behavior removed during v1.5 | ✓ Good — zero regressions across 5 agent updates |

---
*Last updated: 2026-02-25 after v1.5 milestone*
