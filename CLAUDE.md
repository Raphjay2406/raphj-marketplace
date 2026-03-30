# CLAUDE.md

This file provides guidance to Claude Code when working with the Genorah plugin repository.

## Project Overview

**Genorah v2.0** is a Claude Code plugin for premium frontend design. It produces award-caliber websites (Awwwards SOTD 8.0+ baseline) through a pipeline of 19 specialized agents, machine-enforceable design identity, a 72-point quality gate across 12 categories, and a Visual Companion for localhost delivery. It is NOT a template generator -- every project gets a unique visual identity enforced through Design DNA, 19 Design Archetypes, Emotional Arc storytelling, and the 72-point Quality Gate. Covers 12 design domains with ~120 skills.

This repository contains only markdown definitions and a plugin manifest -- there is no application code, build system, or test suite. Targets Next.js, Astro, React/Vite, Tauri, Electron, Swift/SwiftUI, Kotlin/Compose, React Native, Expo, and Flutter.

## Architecture

Three-tier system where commands are entry points, agents orchestrate work, and skills provide domain knowledge:

```
commands/ (12 commands -- user-facing pipeline stages)
    | invoke
agents/ (19 agents -- 7 pipeline + 6 specialists + 4 protocols + 2 new)
    | reference
skills/ (3-tier, 4-layer SKILL.md files -- ~120 modular knowledge bases)
```

**Plugin manifest:** `.claude-plugin/plugin.json`

### File Conventions

- **Skills:** `skills/{skill-name}/SKILL.md` -- 4-layer format with YAML frontmatter (name, description, tier, triggers, version)
- **Agents:** `agents/{agent-name}.md` -- role definition, input/output contracts, context budget
- **Commands:** `commands/{command-name}.md` -- description, argument-hint, numbered workflow steps
- **Hooks:** `.claude-plugin/hooks/` -- 7 hooks: `session-start.mjs`, `pre-tool-use.mjs`, `post-tool-use.mjs`, `user-prompt.mjs`, `pre-compact.mjs`, `stop.mjs`, `dna-compliance-check.sh`
- **Template:** `skills/_skill-template/SKILL.md` -- canonical 4-layer format reference

## Agents (19 total)

### Pipeline Agents (7)
Researcher, Creative Director, Builder, Reviewer, Polisher, Auditor, Coordinator

### Specialist Agents (6)
Integration Specialist, AI-UI Specialist, Performance Specialist, Accessibility Specialist, SEO/GEO Specialist, Mobile Specialist

### Protocol Agents (4)
Visual Companion, Knowledge Sync, Export Coordinator, Status Reporter

## Commands (12)

| Command | Purpose |
|---------|---------|
| `/gen:start-project` | Discovery, research, archetype selection, Design DNA generation |
| `/gen:discuss` | Per-phase creative deep dive, visual feature proposals, brand voice |
| `/gen:plan` | Phase-scoped re-research, context-rot-safe PLAN.md generation |
| `/gen:build` | Wave-based implementation with real-time status |
| `/gen:iterate` | Brainstorm-first design changes or bug diagnosis with approval |
| `/gen:bugfix` | Diagnostic root cause analysis with proposed solutions |
| `/gen:audit` | Full quality gate audit across 12 categories, 72 points |
| `/gen:status` | Current pipeline state, wave progress, section statuses |
| `/gen:sync-knowledge` | Refresh skill knowledge base from latest sources |
| `/gen:companion` | Launch/interact with Visual Companion on localhost |
| `/gen:export` | Export deliverables, design tokens, and build artifacts |
| `/gen:migrate` | Migrate legacy .planning/modulo/ projects to .planning/genorah/ |

## Skill Tiers

Skills are organized into three tiers with different loading behaviors:

| Tier | Loading | Examples |
|------|---------|----------|
| **Core** | Always loaded | design-dna, design-archetypes, quality-gate, emotional-arc, typography, color-system |
| **Domain** | Per project type | 3d-webgl, remotion, ecommerce-ui, dashboard-patterns, ai-ui |
| **Utility** | On-demand | accessibility, seo, performance, responsive-design |

Every skill uses the **4-layer format**: Layer 1 (Decision Guidance) explains when and why to use it. Layer 2 (Award-Winning Examples) provides copy-paste TSX and reference site annotations. Layer 3 (Integration Context) maps to DNA tokens, archetypes, and pipeline stages. Layer 4 (Anti-Patterns) lists common mistakes with corrections. Skills with enforceable parameters include a machine-readable constraint table (Parameter/Min/Max/Unit/Enforcement).

## Core Workflow

```
/gen:start-project -> /gen:discuss -> /gen:plan -> /gen:build -> /gen:iterate
```

1. **start-project** -- Discovery questions, parallel research agents, competitive benchmarking, archetype selection, Design DNA generation, content planning
2. **discuss** -- Per-phase creative deep dive with visual feature proposals, brand voice refinement, and auto-organized task output
3. **plan** -- Phase-scoped re-research, context-rot-safe PLAN.md generation with verification questions
4. **build** -- Wave-based implementation (parallel or sequential per master plan) with real-time status
5. **iterate** -- Brainstorm-first design changes or bug diagnosis with user approval before applying

Additional: `/gen:bugfix` for diagnostic root cause analysis with proposed solutions. `/gen:audit` for standalone quality gate runs. `/gen:companion` for Visual Companion interaction.

## Key Concepts

**Design DNA** -- Per-project visual identity with 12 color tokens (8 semantic: bg, surface, text, border, primary, secondary, accent, muted + 4 expressive: glow, tension, highlight, signature), display/body/mono fonts, 8-level type scale, 5-level spacing, signature element, and 8+ motion tokens. Generates Tailwind v4 `@theme` CSS directly.

**Design Archetypes** -- 19 opinionated personality systems (Brutalist, Ethereal, Kinetic, Editorial, Neo-Corporate, Organic, Retro-Future, Luxury/Fashion, Playful/Startup, Data-Dense, Japanese Minimal, Glassmorphism, Neon Noir, Warm Artisan, Swiss/International, Vaporwave, Neubrutalism, Dark Academia, AI-Native) plus a custom builder. Each locks in colors, fonts, mandatory techniques, forbidden patterns, and 3 tension zones. Escape hatch: builders may break ONE rule via tension override with documented rationale.

**Creative Tension** -- Controlled rule-breaking with 5 tension types (Scale Violence, Material Collision, Temporal Disruption, Dimensional Break, Interaction Shock). Per-archetype techniques, 1-3 per page, spaced apart.

**Emotional Arc** -- 10 beat types (Hook, Tease, Reveal, Build, Peak, Breathe, Tension, Proof, Pivot, Close) with hard parameter constraints (whitespace %, element count, viewport height). Archetype-specific arc templates. Invalid sequences auto-rejected.

**Quality Gate** -- 72-point weighted scoring across 12 categories (Colors, Typography, Layout, Depth & Polish, Motion, Creative Courage, UX Intelligence, Performance, Accessibility, Integration Correctness, AI-UI Fidelity, Responsiveness). Named tiers: Pass (50+), Strong (58+), SOTD-Ready (63+), Honoree-Level (68+). Penalties: missing signature element (-3), forbidden pattern (-5), no creative tension (-5).

**Awwwards 4-Axis Scoring** -- Design, Usability, Creativity, Content each scored /10. SOTD target: 8.0+ average, no axis below 7.

**Wave System** -- Wave 0: scaffold and design tokens. Wave 1: shared UI (nav, footer, theme). Wave 2+: independent sections in parallel (max 4 per wave). Higher waves for dependent sections.

## Visual Companion

The Visual Companion is a localhost-delivered design review interface available at every pipeline stage. It renders the current build in an opinionated viewport harness with DNA token overlays, Emotional Arc position indicators, and real-time quality gate scores. Invoked via `/gen:companion`. The Visual Companion agent coordinates screenshot capture, annotation, and feedback routing back into the pipeline.

## Integration Skills

Genorah v2.0 ships baked-in integration skills for major platforms:

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

The `seo-geo-specialist` agent validates technical SEO compliance and AI discoverability on every `/gen:audit` run, and generates llms.txt + schema markup during `/gen:build`.

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

The `mobile-specialist` agent bridges Design DNA tokens to each framework's native theming system and runs store submission validation before release.

## Ruflo-Inspired Infrastructure

Advanced session management and resource governance hooks active by default:

| Hook | Event | Purpose |
|------|-------|---------|
| `pre-compact.mjs` | PreCompact | Preserves critical context (DNA tokens, arc position, wave state) into CONTEXT.md before compaction |
| `stop.mjs` | Stop | Writes session summary to STATE.md on agent stop: completed tasks, open items, next instructions |
| `post-tool-use.mjs` | PostToolUse | Records tool call metrics (latency, token cost, error rate) for pipeline observability |

Additional infrastructure:

- **PII scanning** -- `pre-tool-use.mjs` scans outbound tool calls for email, phone, SSN, credit card patterns before external API calls
- **Per-skill resource constraints** -- Each skill declares max token budget and load priority in frontmatter; the plugin loader enforces total Core tier budget (~10,000 lines)

## Baked-In Defaults

These behaviors are active by default on every project and require explicit override to disable:

- **Animation mandatory** -- Every section must have at least one intentional motion element. Static pages fail the quality gate.
- **4-breakpoint responsive** -- Mobile (375px), Tablet (768px), Desktop (1280px), Wide (1920px). All four must pass layout review.
- **Browser compatibility tiers** -- Tier 1: Chrome/Edge/Firefox/Safari latest-2. Tier 2: graceful degradation for older. No IE support.

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
| `sections/*/PLAN.md` | Per-section task list |
| `sections/*/SUMMARY.md` | Builder completion report |

## Modifying This Plugin

When adding a new **skill**: create `skills/{skill-name}/SKILL.md` following the 4-layer format in `skills/_skill-template/SKILL.md`. Skills are auto-discovered by the plugin system.

When adding a new **agent**: create `agents/{agent-name}.md` with role, input/output contracts, tools list, and protocol.

When adding a new **command**: create `commands/{command-name}.md` with description, argument-hint, and numbered workflow steps.

After changes, bump the version in `.claude-plugin/plugin.json` and update `README.md`.
