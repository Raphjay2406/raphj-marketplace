# CLAUDE.md

This file provides guidance to Claude Code when working with the Genorah plugin repository.

## Project Overview

**Genorah v3.4.1** is a Claude Code plugin for premium frontend design — "Measurably Enforced Quality with Closed-Loop Refinement." It produces award-caliber websites (Awwwards SOTD 8.0+ baseline) through a pipeline of 21 specialized agents, machine-enforceable design identity, a 234-point weighted quality gate enforced via a 6-stage validation pipeline (DNA compliance → render → registry → consistency → design fidelity → full gate), and a Visual Companion for localhost delivery. v3.0 introduces closed-loop visual refiner, DNA drift detection (92% coverage hard gate), per-beat perf budgets, motion-health sub-gate, reference-diff-protocol (pixel-diff vs reference URL), AI variant tournament, section consistency auditor, live localhost dashboard, interactive click-to-refine companion, competitive benchmarking, smart intent router, self-audit, WebGPU/TSL frontier, Sanity + Payload CMS round-trip, Remotion section video, brand voice extractor, cognitive accessibility (CVD ΔE2000), and i18n-by-default. It is NOT a template generator -- every project gets a unique visual identity enforced through Design DNA, 19 Design Archetypes, Emotional Arc storytelling, and the Quality Gate. Framework-aware pipeline supports Next.js, Astro, and React/Vite with per-framework code generation. ~150 skills across 12 design domains.

This repository contains only markdown definitions and a plugin manifest -- there is no application code, build system, or test suite. Targets Next.js, Astro, React/Vite, Tauri, Electron, Swift/SwiftUI, Kotlin/Compose, React Native, Expo, and Flutter.

## Architecture

Three-tier system where commands are entry points, agents orchestrate work, and skills provide domain knowledge:

```
commands/ (26 commands -- user-facing pipeline stages)
    | invoke
agents/ (21 agents -- 8 pipeline + 7 specialists + 5 protocols + 1 figma)
    | reference
skills/ (3-tier, 4-layer SKILL.md files -- ~150 modular knowledge bases)
```

**Plugin manifest:** `.claude-plugin/plugin.json`

### File Conventions

- **Skills:** `skills/{skill-name}/SKILL.md` -- 4-layer format with YAML frontmatter (name, description, tier, triggers, version)
- **Agents:** `agents/{agent-name}.md` -- role definition, input/output contracts, context budget
- **Commands:** `commands/{command-name}.md` -- description, argument-hint, numbered workflow steps
- **Hooks:** `.claude-plugin/hooks/` -- 7 hooks: `session-start.mjs`, `pre-tool-use.mjs`, `post-tool-use.mjs`, `user-prompt.mjs`, `pre-compact.mjs`, `session-end.mjs`, `dna-compliance-check.sh`
- **MCP Servers:** `.claude-plugin/.mcp.json` -- 5 optional MCP servers (nano-banana, stitch, playwright, obsidian, obsidian-fs)
- **Template:** `skills/_skill-template/SKILL.md` -- canonical 4-layer format reference

## Agents (21 total)

### Pipeline Agents (8)
Researcher, Creative Director, Planner, Builder, Quality Reviewer, Polisher, Orchestrator, **Visual Refiner** (v3.0 — closed-loop refinement)

### Specialist Agents (7)
3D Specialist, Animation Specialist, Content Specialist, AI-UI Specialist, SEO/GEO Specialist, Mobile Specialist, **Consistency Auditor** (v3.0 — runs parallel with builders)

### Protocol Agents (5)
Visual Companion, Agent Memory System, Canary Check, Context Rot Prevention, Discussion Protocol

### Figma Agent (1)
Figma Translator

## MCP Server Integrations

Five optional MCP servers declared in `.claude-plugin/.mcp.json`:

| Server | Package | Purpose |
|--------|---------|---------|
| **nano-banana** | Gemini 3.1 Flash Image | AI image generation -- hero backgrounds, textures, OG images, style transfer |
| **stitch** | Google Stitch | Visual mockup generation -- text-to-screen, design system sync, variant exploration |
| **playwright** | Playwright MCP | Visual QA -- 4-breakpoint screenshots, CSS/DOM verification, hover testing, console errors |
| **obsidian** | obsidian-mcp-server | Obsidian REST API -- frontmatter management, tag ops, global search |
| **obsidian-fs** | obsidian-mcp | Obsidian filesystem -- direct vault read/write, no Obsidian required |

All servers are optional. Commands gracefully degrade when servers are unavailable.

## Commands (25)

| Command | Purpose |
|---------|---------|
| `/gen:start-project` | Discovery, research, archetype selection, Design DNA generation, tech stack selection |
| `/gen:discuss` | Per-phase creative deep dive, visual features, brand voice, tech stack trade-offs. Stitch mockups + nano-banana concept art when available. |
| `/gen:plan` | Phase-scoped re-research, framework-aware PLAN.md generation with rendering rationale |
| `/gen:build` | Wave-based implementation with framework-specific code generation. AI images via nano-banana. |
| `/gen:iterate` | Brainstorm-first design changes with post-iterate stale-audit detection |
| `/gen:review` | Focused creative review — archetype personality, conversion readiness, visual polish, mobile quality |
| `/gen:bugfix` | Diagnostic root cause analysis with Playwright visual evidence capture |
| `/gen:audit` | Full 234-point quality gate audit. Playwright visual QA when available. |
| `/gen:status` | Current pipeline state, wave progress, section statuses, next action suggestion |
| `/gen:sync-knowledge` | Bidirectional sync between plugin skills and Obsidian knowledge vault |
| `/gen:companion` | Launch/interact with Visual Companion on localhost |
| `/gen:export` | Export deliverables, design tokens, vault format, and build artifacts |
| `/gen:migrate` | Migrate legacy .planning/modulo/ projects to .planning/genorah/ |
| `/gen:feedback` | Accept client/user feedback and route into Design DNA or quality loop |
| `/gen:design-system` | Extract/sync component registry, design tokens, Figma integration |
| `/gen:self-audit` | Self-heal audit — validates plugin consistency (versions, counts, frontmatter, mirror drift) |
| `/gen:tournament` | (v3.0) Blind-ranked N=3 variants for HOOK/PEAK sections; vision-LLM judge commits winner |
| `/gen:dashboard` | (v3.0) Launch live localhost:4455 project cockpit with SSE updates, DNA swatches, wave progress |
| `/gen:benchmark` | (v3.0) Score 3-5 reference SOTD sites against 234-pt gate; auto-inject gap targets per section |
| `/gen:cms-init` | (v3.0) Scaffold headless CMS (Sanity or Payload) with DNA-themed Studio + auto-generated schemas |
| `/gen:video` | (v3.0) Render DNA-parameterized Remotion section video with 5 templates + AVIF/MP4/WebM dual encode |
| `/gen:next` | (v3.0.1) Preview next /gen:* command for current pipeline state — primary + alternatives + rationale |
| `/gen:brandkit` | (v3.1) Generate brand kit deliverables — logo variants, favicon, OG templates, color exports, guidelines PDF, /brand public route |
| `/gen:ci-setup` | (v3.2) Scaffold Lighthouse CI + GitHub Actions + Playwright preview-smoke from perf-budgets |
| `/gen:review-share` | (v3.2) Generate shareable client-review URL with pinnable comments + approval tracking |

## Skill Tiers

Skills are organized into three tiers with different loading behaviors:

| Tier | Loading | Examples |
|------|---------|----------|
| **Core** | Always loaded | design-dna, design-archetypes, quality-gate-v2, emotional-arc, visual-qa-protocol |
| **Domain** | Per project type | 3d-webgl, remotion, ecommerce-ui, dashboard-patterns, ai-ui, icon-system |
| **Utility** | On-demand | accessibility, seo, performance, responsive-design |

Every skill uses the **4-layer format**: Layer 1 (Decision Guidance) explains when and why to use it. Layer 2 (Award-Winning Examples) provides copy-paste TSX and reference site annotations. Layer 3 (Integration Context) maps to DNA tokens, archetypes, and pipeline stages. Layer 4 (Anti-Patterns) lists common mistakes with corrections. Skills with enforceable parameters include a machine-readable constraint table (Parameter/Min/Max/Unit/Enforcement).

## Core Workflow

```
/gen:start-project -> /gen:discuss -> /gen:plan -> /gen:build -> /gen:iterate
```

1. **start-project** -- Discovery questions, parallel research agents, competitive benchmarking, archetype selection, Design DNA generation, content planning
2. **discuss** -- Per-phase creative deep dive with visual feature proposals, brand voice refinement, Stitch mockups, and auto-organized task output
3. **plan** -- Phase-scoped re-research, context-rot-safe PLAN.md generation with wow-moment specs, reference targets, and accessibility blocks
4. **build** -- Wave-based implementation (parallel or sequential per master plan) with real-time status. Builders generate AI images via nano-banana when available.
5. **iterate** -- Brainstorm-first design changes or bug diagnosis with user approval before applying

Additional: `/gen:bugfix` for diagnostic root cause analysis with proposed solutions. `/gen:audit` for standalone quality gate runs with Playwright visual QA. `/gen:companion` for Visual Companion interaction.

## Key Concepts

**Design DNA** -- Per-project visual identity with 12 color tokens (8 semantic: bg, surface, text, border, primary, secondary, accent, muted + 4 expressive: glow, tension, highlight, signature), display/body/mono fonts, 8-level type scale, 5-level spacing, signature element, and 8+ motion tokens. Generates Tailwind v4 `@theme` CSS directly.

**Design Archetypes** -- 19 opinionated personality systems (Brutalist, Ethereal, Kinetic, Editorial, Neo-Corporate, Organic, Retro-Future, Luxury/Fashion, Playful/Startup, Data-Dense, Japanese Minimal, Glassmorphism, Neon Noir, Warm Artisan, Swiss/International, Vaporwave, Neubrutalism, Dark Academia, AI-Native) plus a custom builder. Each locks in colors, fonts, mandatory techniques, forbidden patterns, and 3 tension zones. Escape hatch: builders may break ONE rule via tension override with documented rationale.

**Creative Tension** -- Controlled rule-breaking with 5 tension types (Scale Violence, Material Collision, Temporal Disruption, Dimensional Break, Interaction Shock). Per-archetype techniques, 1-3 per page, spaced apart.

**Emotional Arc** -- 10 beat types (Hook, Tease, Reveal, Build, Peak, Breathe, Tension, Proof, Pivot, Close) with hard parameter constraints (whitespace %, element count, viewport height). Archetype-specific arc templates. Invalid sequences auto-rejected.

**Quality Gate** -- 234-point weighted scoring across 12 categories (Color System, Typography, Layout & Composition, Depth & Polish, Motion & Interaction, Creative Courage, UX Intelligence, Accessibility, Content Quality, Responsive Craft, Performance, Integration Quality). Weights: Color 1.2x, Typography 1.2x, Creative Courage 1.2x, others 1.0x-1.1x. Named tiers: Reject (<140), Baseline (140-169), Strong (170-199), SOTD-Ready (200-219), Honoree (220-234), SOTM-Ready (235+). Penalties: missing signature element (-8), forbidden pattern (-10), no creative tension (-6), generic CTA (-3 each), plus 13 more.

**Hard Gates** -- 5 binary pass/fail checks that block scoring entirely: (1) Motion exists, (2) 4-breakpoint responsive, (3) Compatibility tier respected, (4) Component registry compliance, (5) Archetype specificity (section could NOT exist with a different archetype).

**Awwwards 4-Axis Scoring** -- Design, Usability, Creativity, Content each scored /10. SOTD target: 8.0+ average, no axis below 7.

**Wave System** -- Wave 0: scaffold and design tokens. Wave 1: shared UI (nav, footer, theme). Wave 2+: independent sections in parallel (max 4 per wave). Higher waves for dependent sections.

## Visual QA Pipeline

When Playwright MCP is available, the quality-reviewer agent runs automated browser-based verification:

1. **4-breakpoint screenshots** -- Full-page captures at 375px, 768px, 1280px, 1440px saved to `.planning/genorah/audit/`
2. **CSS/DOM token verification** -- JavaScript evaluation checks rendered CSS against DNA tokens
3. **Hover state testing** -- Playwright hovers over interactive elements and screenshots the state change
4. **Console error detection** -- Runtime errors are CRITICAL findings
5. **Accessibility snapshot** -- DOM accessibility tree for heading hierarchy and landmark validation

Defined in the `visual-qa-protocol` skill (core tier). Falls back to code-only review when Playwright is unavailable.

## AI Image Generation

When nano-banana MCP is available, the pipeline generates DNA-matched images directly:

- **Builder agents** generate hero backgrounds, textures, and illustrations during section construction
- **Per-beat templates** (HOOK = dramatic cinematic, BREATHE = subtle atmosphere, PEAK = maximum expression)
- **Style transfer** via reference images maintains visual consistency across multi-section pages
- **Iterative editing** for DNA color alignment using continue_editing workflow
- Falls back to text prompts saved to `.planning/genorah/image-prompts/` when MCP is unavailable

Defined in the `image-prompt-generation` skill (domain tier).

## Visual Companion

The Visual Companion is a localhost-delivered design review interface available at every pipeline stage. It renders the current build in an opinionated viewport harness with DNA token overlays, Emotional Arc position indicators, and real-time quality gate scores. Invoked via `/gen:companion`. The Visual Companion agent coordinates screenshot capture, annotation, and feedback routing back into the pipeline.

## Integration Skills

Genorah ships baked-in integration skills for major platforms:

| Integration | Scope |
|-------------|-------|
| **HubSpot** | CRM forms, contact sync, marketing automation hooks |
| **Stripe** | Checkout, subscriptions, payment element theming |
| **Shopify** | Storefront API, cart, product display, checkout |
| **WooCommerce** | REST API, product grids, cart, order flows |
| **Propstack** | Real estate listings, property search, CRM sync |

Each integration skill follows the 4-layer format and maps to DNA tokens for consistent visual theming of third-party UI components.

## SEO/GEO Intelligence

Three core skills cover the full visibility stack, backed by the `seo-geo-specialist` agent which runs in both build and audit modes:

| Skill | Scope |
|-------|-------|
| **seo-technical** | Sitemaps (XML/image/video/news), robots.txt, meta architecture, CWV enforcement, canonical strategy, hreflang, search console submission |
| **geo-optimization** | llms.txt generation and hosting, AI crawler directives (GPTBot, ClaudeBot, PerplexityBot), citation pattern optimization, entity disambiguation, LLM indexing signals |
| **structured-data-v2** | Comprehensive JSON-LD @graph composition: schema decision tree, rich result eligibility matrix, FAQPage/HowTo/Product/LocalBusiness/@graph combinations, schema audit protocol |

## Mobile App Pipeline

Five framework-native skills plus store submission validation and a cross-platform performance suite, all backed by the `mobile-specialist` agent:

| Skill | Framework | Scope |
|-------|-----------|-------|
| **mobile-swift** | Swift/SwiftUI | DNA token mapping to SwiftUI design tokens, SF Symbols, NavigationStack, HIG compliance |
| **mobile-kotlin** | Kotlin/Jetpack Compose | Material You DNA bridge, Compose navigation, ViewModel, adaptive layouts for foldables |
| **mobile-react-native** | React Native (bare) | NativeWind DNA bridge, React Navigation v7, Reanimated 3 motion profiles, Hermes optimization |
| **mobile-expo** | Expo (managed) | EAS Build/Submit, Expo Router, OTA updates, config plugins, expo-linear-gradient theming |
| **mobile-flutter** | Flutter/Dart | ThemeData DNA mapping, go_router, Riverpod, platform adaptive widgets, Impeller renderer |
| **store-submission** | App Store + Play Store | Screenshot specs, metadata limits, ASO keywords, review guideline checklist, TestFlight/internal track |
| **mobile-performance** | All frameworks | Cold start <600ms, warm <300ms, 60/120fps budget, memory profiling, bundle size, battery impact |

## Obsidian Integration

Two-vault system with MCP-powered bidirectional sync:

- **Project Vault** at `.planning/genorah/vault/` -- per-project, ephemeral, mirrors build state with Dataview-compatible frontmatter
- **Knowledge Base Vault** at user-configured path -- persistent, cross-project, accumulates archetype history and pattern discovery
- **Session-start hook** detects vault presence and reports drift warnings
- **Session-end hook** prompts knowledge base accumulation on project completion
- Config stored in `.claude/genorah.local.md` with standardized keys: `vault_path`, `obsidian_installed`, `vault_sync`

## Session Infrastructure

Advanced session management and resource governance hooks active by default:

| Hook | Event | Purpose |
|------|-------|---------|
| `session-start.mjs` | SessionStart | Loads CONTEXT.md, detects vault drift, reports MCP availability, auto-migrates legacy projects |
| `session-end.mjs` | Stop | Writes SESSION-LOG.md with phase, wave, decisions, next actions, vault sync status |
| `pre-compact.mjs` | PreCompact | Preserves critical context (DNA tokens, arc position, wave state) into CONTEXT.md before compaction |
| `post-tool-use.mjs` | PostToolUse | Records tool call metrics to METRICS.md for pipeline observability |
| `pre-tool-use.mjs` | PreToolUse | Injects relevant skill content, enforces resource constraints, scans for PII patterns |
| `user-prompt.mjs` | UserPromptSubmit | Detects stale command references, suggests next actions, routes lost users |
| `dna-compliance-check.sh` | PreToolUse (Bash) | Pre-commit hook greps staged files for anti-slop violations, animation absence, PII/secrets |

## Baked-In Defaults

These behaviors are active by default on every project and require explicit override to disable:

- **Animation mandatory** -- Every section must have at least one intentional motion element. Static pages fail the quality gate.
- **4-breakpoint responsive** -- Mobile (375px), Tablet (768px), Desktop (1280px), Wide (1440px). All four must pass layout review. Mobile must be a real redesign, not stacked desktop.
- **Browser compatibility tiers** -- Tier 1: Chrome/Edge/Firefox/Safari latest-2. Tier 2: graceful degradation for older. No IE support.
- **Archetype specificity** -- Every section must be unmistakably the chosen archetype. Generic premium = hard gate failure.
- **Reference targets for all beats** -- All sections except BREATHE get reference targets (visual spectacle, subtlety craft, information organization, or conversion craft per beat type).

## Managed Artifacts

All state lives under `.planning/genorah/` in the target project:

| File | Purpose |
|------|---------|
| `PROJECT.md` | Discovery output and requirements |
| `DESIGN-DNA.md` | Locked visual identity document |
| `BRAINSTORM.md` | Creative directions and chosen archetype |
| `MASTER-PLAN.md` | Wave map with section dependencies and layout assignments |
| `CONTEXT.md` | Single source of truth -- DNA anchor, build state, arc position, next instructions |
| `STATE.md` | Current execution state (phase, wave, section statuses) |
| `CONTENT.md` | Approved page copy organized by section |
| `DESIGN-SYSTEM.md` | Component registry with variants, dimensions, DNA token usage |
| `DECISIONS.md` | Decision log with rationale |
| `METRICS.md` | Tool call metrics for pipeline observability |
| `SESSION-LOG.md` | Cross-session continuity log |
| `sections/*/PLAN.md` | Per-section task list with motion, responsive, compat, accessibility blocks |
| `sections/*/SUMMARY.md` | Builder completion report |
| `sections/*/GAP-FIX.md` | Quality reviewer / creative director fix instructions |
| `audit/` | Screenshots, Lighthouse, axe-core, visual QA results |
| `vault/` | Obsidian project vault (when configured) |

## Modifying This Plugin

When adding a new **skill**: create `skills/{skill-name}/SKILL.md` following the 4-layer format in `skills/_skill-template/SKILL.md`. Skills are auto-discovered by the plugin system.

When adding a new **agent**: create `agents/{agent-name}.md` with role, input/output contracts, tools list, and protocol.

When adding a new **command**: create `commands/{command-name}.md` with description, argument-hint, and numbered workflow steps.

After changes, bump the version in `.claude-plugin/plugin.json` and update `README.md`.

**Important:** The `plugins/gen/` directory is the published plugin distribution. After modifying root files, sync changes to `plugins/gen/` or they will diverge.
