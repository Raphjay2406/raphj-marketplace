# Genorah v2.0 — Full Design Specification

> **Date:** 2026-03-30
> **Author:** raphj + Claude
> **Status:** Draft — awaiting user approval
> **Scope:** Complete ground-up redesign of the Modulo plugin, rebranded as Genorah

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Rebrand](#2-rebrand)
3. [System Architecture](#3-system-architecture)
4. [Hooks System](#4-hooks-system)
5. [Agent Pipeline](#5-agent-pipeline)
6. [Command Redesign](#6-command-redesign)
7. [Visual Companion (Localhost Delivery)](#7-visual-companion)
8. [Design Intelligence (12 Domains)](#8-design-intelligence)
9. [Quality Gate System (72-Point)](#9-quality-gate-system)
10. [Baked-In Defaults](#10-baked-in-defaults)
11. [Component Consistency Enforcement](#11-component-consistency)
12. [Integration Skills (Full Depth)](#12-integration-skills)
13. [AI UI Features](#13-ai-ui-features)
14. [Performance & Optimization](#14-performance-optimization)
15. [Obsidian Integration](#15-obsidian-integration)
16. [Data Catalog Format](#16-data-catalog-format)
17. [Migration Checklist](#17-migration-checklist)

---

## 1. Executive Summary

Genorah v2.0 is a complete ground-up redesign of the Modulo plugin (v1.5.0), rebranded as **Genorah** with `/gen:*` commands. It leverages Claude Code's latest platform features (Agent Teams, hooks, PlanMode, TodoWrite, visual companion) while massively expanding design intelligence, quality enforcement, and integration capabilities.

### 6 Major Workstreams

1. **Claude Platform Modernization** — Agent Teams with worktree isolation, 4-hook system, PlanMode gates, TodoWrite progress, named agent messaging
2. **Broken Dev Flow Fix** — Hooks own command routing (no more stale suggestions), artifact name registry prevents stale references, agent pipeline consistency improved
3. **UI Quality Massive Upgrade** — 12 design intelligence domains (up from scattered guidance), 72-point quality gate (up from 35), component consistency enforcement, baked-in animation/responsive/compatibility
4. **Visual Companion** — Superpowers-style localhost HTML+WebSocket server for visual content at every pipeline stage
5. **Integration Skills** — HubSpot (full depth + marketing events), Stripe, Shopify, WooCommerce, Propstack — all with 4-layer format and pipeline awareness
6. **AI UI Features** — AI product design patterns, AI pipeline features, AI Elements integration, Obsidian knowledge base with bidirectional sync

### What's Preserved

- All 78 existing skills (audited for stale references, enhanced where noted)
- 19 design archetypes with locked constraints
- Design DNA identity system (expanded with compatibility tier + component registry)
- Emotional arc with 10 beat types
- Creative tension framework
- Awwwards 4-axis scoring (now part of expanded quality gate)
- Context rot prevention (6 layers, enhanced with hook infrastructure)
- Wave-based execution model

---

## 2. Rebrand

| v1.5 (Modulo) | v2.0 (Genorah) |
|----------------|----------------|
| Plugin name: `modulo` | Plugin name: `genorah` |
| Commands: `/modulo:*` | Commands: `/gen:*` |
| Artifacts: `.planning/modulo/` | Artifacts: `.planning/genorah/` |
| Agent references: "Modulo" | Agent references: "Genorah" |
| All skill/agent/command/hook references updated | — |

---

## 3. System Architecture

### Directory Structure

```
genorah/ (plugin root)
+-- .claude-plugin/
|   +-- plugin.json                  <- manifest with hooks config
|   +-- marketplace.json             <- marketplace metadata
|   +-- hooks/
|   |   +-- session-start.mjs        <- context injection on startup/resume
|   |   +-- pre-tool-use.mjs         <- DNA enforcement + skill injection + compat check + registry validation
|   |   +-- user-prompt.mjs          <- intent routing + stale reference guard
|   |   +-- dna-compliance-check.sh  <- preserved pre-commit enforcement (enhanced)
|   +-- scripts/
|       +-- server.cjs               <- visual companion (zero-dep localhost)
|       +-- start-server.sh          <- platform-aware startup
|       +-- stop-server.sh           <- graceful shutdown
|       +-- frame-template.html      <- themed frame with Genorah branding
|       +-- helper.js                <- WebSocket + click/selection tracking
|
+-- commands/                        <- 8 pipeline + 3 utility
|   +-- start-project.md
|   +-- discuss.md
|   +-- plan.md
|   +-- build.md
|   +-- iterate.md
|   +-- bugfix.md
|   +-- audit.md
|   +-- status.md
|   +-- sync-knowledge.md            <- NEW: Obsidian bidirectional sync
|   +-- companion.md                 <- NEW: visual companion start/stop
|   +-- export.md                    <- NEW: Obsidian vault export
|
+-- agents/
|   +-- pipeline/
|   |   +-- orchestrator.md          <- Agent Teams, TodoWrite, SendMessage
|   |   +-- builder.md               <- worktree isolation, motion/responsive/compat in spawn
|   |   +-- creative-director.md     <- vision enforcement, companion screens
|   |   +-- quality-reviewer.md      <- 72-point gate + consistency audit
|   |   +-- planner.md               <- generates motion/responsive/compat blocks in PLAN.md
|   |   +-- researcher.md            <- background agents, 6 tracks (incl. integration research)
|   |   +-- polisher.md              <- GAP-FIX + CONSISTENCY-FIX remediation
|   +-- specialists/
|   |   +-- 3d-specialist.md
|   |   +-- animation-specialist.md
|   |   +-- content-specialist.md
|   |   +-- ai-ui-specialist.md      <- NEW: AI interface patterns
|   +-- protocols/
|       +-- agent-memory.md
|       +-- canary-check.md
|       +-- context-rot-prevention.md
|       +-- visual-companion.md      <- NEW: localhost delivery protocol
|
+-- skills/
|   +-- [all 78 existing skills]     <- audited for stale refs, enhanced
|   +-- data/                        <- NEW: absorbed catalog data
|   |   +-- palettes.md              <- 97+ palettes (UIUX PRO MAX + expanded)
|   |   +-- font-pairings.md         <- 57+ pairings (UIUX PRO MAX + expanded)
|   |   +-- chart-types.md           <- 25+ chart types with library recs
|   |   +-- industry-rules.md        <- 100+ industry reasoning rules
|   +-- ux-intelligence/             <- NEW: 12 design domains (replaces scattered UX)
|   +-- hubspot-integration/         <- NEW: full depth domain skill
|   +-- stripe-integration/          <- NEW: full depth domain skill
|   +-- shopify-integration/         <- NEW: full depth domain skill
|   +-- woocommerce-integration/     <- NEW: full depth domain skill
|   +-- propstack-integration/       <- NEW: full depth domain skill
|   +-- ai-ui-patterns/             <- NEW: AI product design patterns
|   +-- ai-pipeline-features/       <- NEW: AI within Genorah pipeline
|   +-- ai-ui-components/           <- NEW: AI Elements integration guide
|   +-- visual-companion-screens/   <- NEW: screen templates per stage
|
+-- docs/
    +-- superpowers/specs/           <- design specs
    +-- plans/                       <- implementation plans
```

### Key Architectural Decisions

1. **Hooks as infrastructure** — SessionStart, PreToolUse, UserPromptSubmit hooks handle context injection, DNA enforcement, skill injection, intent routing, and stale reference correction. Replaces scattered in-agent suggestion logic.

2. **Agent Teams** — Orchestrator spawns builders as named agents with `SendMessage` coordination. Parallel builders use `isolation: "worktree"` for safe concurrent writes. Background agents for research.

3. **PlanMode gates** — `plan` and `start-project` commands use `EnterPlanMode` for user approval before execution.

4. **TodoWrite throughout** — Every multi-step command uses TodoWrite for live progress.

5. **Visual companion as protocol** — Shared protocol that any command can invoke. Not tied to one stage.

6. **Quality gates preserved and massively expanded** — 72-point scoring (up from 35), 12 categories (up from 7), 3-tier enforcement, 3 hard gates, component consistency audit.

7. **Baked-in defaults** — Animation, responsive design, and browser compatibility are mandatory in every section PLAN.md, not optional features. Motion intensity derived from beat type + archetype. Responsive specs generated by planner for 4 breakpoints. Compatibility tier set during discovery and enforced throughout.

8. **Component consistency** — Living `DESIGN-SYSTEM.md` registry created during Wave 0-1. All builders receive registry in spawn prompt. Quality reviewer runs cross-section consistency audit.

9. **Integration awareness** — Discovery phase detects integration needs (HubSpot, Stripe, Shopify, etc.), planner includes integration requirements in section PLAN.md files, quality reviewer validates integration quality.

10. **Obsidian as optional visual layer** — Native `.planning/genorah/` is the source of truth. Obsidian vault is an optional sync target for project visualization + knowledge base browsing.

### Managed Artifacts (Updated)

All state lives in `.planning/genorah/` of the target project:

| Artifact | Purpose | Created By |
|----------|---------|-----------|
| `PROJECT.md` | Discovery output, requirements, compatibility tier, integration needs | start-project |
| `DESIGN-DNA.md` | Visual identity + compatibility tier + motion tokens | creative-director |
| `BRAINSTORM.md` | Creative directions, archetype selection | creative-director |
| `CONTENT.md` | All page copy, approved by user | content-specialist |
| `MASTER-PLAN.md` | Wave map, dependencies, beat assignments, layout assignments | planner |
| `CONTEXT.md` | Single source of truth + artifact name registry | orchestrator |
| `STATE.md` | Current execution state | orchestrator |
| `DESIGN-SYSTEM.md` | Component registry (dimensions, padding, radius, shadow, variants) | orchestrator (Wave 0-1) |
| `DECISIONS.md` | Decision log with rationale (NEW) | all agents |
| `sections/{name}/PLAN.md` | Per-section spec WITH motion + responsive + compat blocks (ENHANCED) | planner |
| `sections/{name}/SUMMARY.md` | Builder completion report | builder |
| `sections/{name}/GAP-FIX.md` | Design/creative quality gaps (colors, motion, personality, content) | creative-director / quality-reviewer |
| `sections/{name}/CONSISTENCY-FIX.md` | Component dimension/spacing mismatches across sections (NEW) | quality-reviewer (cross-section audit only) |
| `vault/` | Obsidian project vault (optional sync target) | /gen:export |

---

## 4. Hooks System

### `session-start.mjs` (SessionStart)

**Fires on:** startup, resume, clear, compact

- Reads `.planning/genorah/CONTEXT.md` and injects compressed project state (DNA anchor, current phase/wave, recent decisions, arc position, compatibility tier, integration config)
- If no project exists, injects "getting started" guidance
- Detects if visual companion server is already running
- On **resume**: runs canary check (verifies agent memory)

### `pre-tool-use.mjs` (PreToolUse)

**Fires on:** Write, Edit, Bash

- **DNA compliance** — current `dna-compliance-check.sh` logic extended to Write/Edit (catches violations earlier)
- **Smart skill injection** — matches file paths and bash commands against skill frontmatter patterns with dedup and priority cap (like Vercel plugin)
- **Artifact name validation** — ensures agents reference current file names from CONTEXT.md registry (fixes the `--from-gaps` / stale reference problem)
- **Component registry validation** — checks that written component dimensions match `DESIGN-SYSTEM.md` registry
- **Compatibility tier enforcement** — flags CSS features above the project's compatibility tier without `@supports` fallback
- **Industry anti-pattern checking** — from absorbed UIUX PRO MAX rules

### `user-prompt.mjs` (UserPromptSubmit)

**Fires on:** every user message

- **Intent routing** — analyzes user message, suggests correct command based on current `STATE.md`
- **Flow state awareness** — never suggests `plan` if mid-build, never suggests `build` if no plan exists
- **Stale reference translation** — if user types old flag/artifact name, translates to current and explains

### `dna-compliance-check.sh` (PreToolUse -> Bash, on git commit)

**Preserved and enhanced:**

- Current grep-based color/typography/spacing/microcopy enforcement -> kept
- NEW: compatibility tier violations (features above tier without fallback)
- NEW: component registry mismatches
- NEW: animation absence detection (section without any motion class/keyframe)
- NEW: responsive absence detection (no mobile-targeted styles)

---

## 5. Agent Pipeline

### Orchestrator

```
orchestrator.md
- Uses: Agent Teams, SendMessage, TodoWrite, EnterPlanMode
- Spawns builders as named entities (name: "builder-hero")
- Coordinates via SendMessage({to: "builder-hero"})
- Tracks all progress via TodoWrite (user sees live status)
- Uses PlanMode gate before each wave
- Manages visual companion (pushes screens at key moments)
- Builds component registry in DESIGN-SYSTEM.md during Wave 0-1
- NEVER suggests next command -- hook handles routing
- Updates CONTEXT.md artifact registry after every change
```

### Builder

```
builder.md
- Uses: isolation: "worktree" for parallel section builds
- Spawn prompt includes:
  * Full Design DNA (colors, fonts, spacing, motion tokens, compatibility tier)
  * Emotional arc beat assignment + motion intensity tier
  * Section PLAN.md WITH mandatory motion block
  * Section PLAN.md WITH mandatory responsive block (4 breakpoints)
  * Compatibility tier + required fallbacks list
  * Component registry from DESIGN-SYSTEM.md (all registered variants)
  * Integration requirements (HubSpot form IDs, Stripe keys, etc.)
- Sends completion via SendMessage({to: "orchestrator"})
- Writes SUMMARY.md with anti-slop self-check + component proposals
- Reports TodoWrite completion per task
```

### Creative Director

```
creative-director.md
- Pre-wave: reviews PLAN.md files (motion, responsive, compat blocks present?)
- Post-wave: reviews built sections against DNA + archetype personality
- Flags BELOW_CREATIVE_BAR with required improvements
- Pushes visual companion screens: before/after, breakpoint comparison
- Writes creative notes to CONTEXT.md
```

### Quality Reviewer

```
quality-reviewer.md
- 72-point scoring across 12 categories (see Section 9)
- 3 hard gates: motion exists, 4-breakpoint responsive, compat tier respected
- Cross-section consistency audit (card heights, button sizes, spacing, radii)
- Integration quality validation (UTK, webhook security, token exposure)
- Writes GAP-FIX.md (quality) and CONSISTENCY-FIX.md (consistency)
- Pushes score dashboard to visual companion
```

### Planner

```
planner.md
- Generates MASTER-PLAN.md + per-section PLAN.md files
- Every section PLAN.md includes MANDATORY blocks:
  * motion: { entrance, stagger, scroll_trigger, interactions, archetype_profile }
  * responsive: { mobile_375, tablet_768, desktop_1024, ultrawide_1440 }
  * compatibility: { tier, required_fallbacks }
  * integration: { hubspot_forms, stripe_elements, etc. } (if applicable)
- Motion intensity auto-derived from beat type + archetype
- Responsive layout auto-derived from section content type
- Compatibility fallbacks auto-derived from tier in DNA
```

### Researcher

```
researcher.md
- Runs as background agents (run_in_background: true)
- 6 parallel tracks (was 5):
  1. Industry analysis
  2. Design references
  3. Component patterns
  4. Animation techniques
  5. Content voice
  6. Integration research (NEW: HubSpot forms, Stripe flows, competitor integrations)
- Writes to .planning/genorah/research/
- Orchestrator notified on completion
```

### Polisher

```
polisher.md
- Applies fixes from GAP-FIX.md (quality issues)
- Applies fixes from CONSISTENCY-FIX.md (component consistency violations)
- 2-cycle remediation loop max
- Updates SUMMARY.md on completion
```

### AI UI Specialist (NEW)

```
ai-ui-specialist.md
- Handles sections requiring AI interface patterns
- Chat UIs (AI Elements: Message, Conversation, PromptInput)
- AI search interfaces, prompt playgrounds, model comparison UIs
- Ensures AI text never rendered as raw {text} -- always <MessageResponse>
- Connects AI SDK patterns (useChat, streamText) to DNA-styled components
```

---

## 6. Command Redesign

### Pipeline Commands (8)

| Command | Purpose | Claude Features |
|---------|---------|-----------------|
| `/gen:start-project` | Discovery -> Research -> Creative Direction -> Content | Background researcher agents, Visual companion (archetype picker, palette explorer, font preview, creative directions), TodoWrite, Compatibility tier selection, Integration detection |
| `/gen:discuss` | Per-phase creative deep dive | Visual companion (feature mockups, content voice samples), PlanMode for proposal approval |
| `/gen:plan` | Section planning + master plan | EnterPlanMode (user approves before build), Generates mandatory motion/responsive/compat blocks, Initializes component registry |
| `/gen:build` | Wave execution | Agent Teams (parallel builders with worktree isolation), TodoWrite (per-section progress), Visual companion (build dashboard, scores, breakpoint screenshots) |
| `/gen:iterate` | Brainstorm-first improvements | Visual companion (before/after diff at all breakpoints), 2-3 approaches shown visually |
| `/gen:bugfix` | Root cause diagnosis + fix | Visual companion (diagnostic overlay, breakpoint reproduction), Playwright screenshots |
| `/gen:audit` | Full quality audit | 72-point scoring, Lighthouse, axe-core, 4-breakpoint screenshots, Visual companion (score dashboard, consistency report) |
| `/gen:status` | Project status + smart next-step | Reads STATE.md, shows progress in companion |

### Utility Commands (3)

| Command | Purpose |
|---------|---------|
| `/gen:sync-knowledge` | Obsidian <-> plugin bidirectional sync |
| `/gen:companion` | Start/stop visual companion server manually |
| `/gen:export` | Export project to Obsidian vault format |

### Command Behavior Contract

Every command follows this protocol:

1. Read `STATE.md` and `CONTEXT.md` first (know where we are)
2. Use TodoWrite to show the user what steps are coming
3. Use PlanMode for any decision that changes project direction
4. Push visual companion screens at key moments (if companion running)
5. Update `STATE.md` on completion
6. **Never suggest next command** -- the `user-prompt.mjs` hook handles routing

### `/gen:start-project` Enhanced Discovery

During discovery, the following are now auto-detected and auto-asked:

| Detection | Auto-Ask |
|-----------|----------|
| Client mentions HubSpot | "Which HubSpot products? (CRM, Marketing Hub, CMS Hub)" |
| Client mentions payments | "Stripe Checkout, Billing, or Connect?" |
| Client mentions e-commerce | "Shopify Storefront API, WooCommerce headless, or custom?" |
| Client mentions real estate | "Do you use Propstack for property management?" |
| Client mentions AI features | "Chat interface, AI search, content generation, or dashboard?" |
| Always asked | "What browser support? (Modern/Broad/Legacy/Maximum)" |
| Always asked | "What's the primary device? (Desktop-first/Mobile-first/Equal)" |

Answers stored in `PROJECT.md` and propagated to DNA, PLAN.md files, and builder spawn prompts.

---

## 7. Visual Companion

### Architecture

```
Zero-dependency Node.js server (HTTP + WebSocket)
- server.cjs:         ~300 lines, Node built-ins only (http, crypto, fs, path)
- start-server.sh:    platform-aware (Windows Git Bash, macOS, Linux)
- stop-server.sh:     graceful shutdown (SIGTERM -> SIGKILL)
- frame-template.html: themed frame with Genorah branding, OS-aware light/dark
- helper.js:          WebSocket + click/selection tracking + auto-reconnect
```

**Port:** Random high port (49152-65535)
**Session directory:** `.planning/genorah/companion/`
**Communication:** Browser displays, terminal conversations. Clicks -> `.events` file -> Claude reads next turn.

### Screens Per Pipeline Stage

| Stage | Screen Type | Content |
|-------|-------------|---------|
| `/gen:start-project` | Archetype Picker | 19 archetypes as visual cards with mood boards |
| `/gen:start-project` | Palette Explorer | DNA palettes + industry matches, side-by-side |
| `/gen:start-project` | Font Pairing Preview | Live typography with heading/body combos |
| `/gen:start-project` | Creative Directions | 2-3 concept boards with rendered mockups |
| `/gen:start-project` | Compatibility Tier Picker | Browser support options with feature availability matrix |
| `/gen:discuss` | Feature Proposals | Visual mockups for the phase being discussed |
| `/gen:discuss` | Content Voice | Brand voice samples in DNA typography |
| `/gen:plan` | Emotional Arc Map | Beat sequence as visual timeline |
| `/gen:plan` | Layout Preview | Section layouts from MASTER-PLAN visualized |
| `/gen:plan` | Motion Preview | Animation intensity per beat shown as motion cards |
| `/gen:build` | Build Progress | Wave status dashboard, sections colored by status |
| `/gen:build` | Anti-Slop Scores | Per-section radar charts (12 categories) |
| `/gen:build` | Awwwards Projection | 4-axis score with SOTD threshold line |
| `/gen:build` | Breakpoint Preview | 4-breakpoint screenshots per section (375, 768, 1024, 1440) |
| `/gen:build` | Consistency Report | Component registry compliance across sections |
| `/gen:iterate` | Before/After Diff | Side-by-side at all breakpoints |
| `/gen:iterate` | Approach Picker | 2-3 brainstormed approaches as visual mockups |
| `/gen:bugfix` | Diagnostic View | Bug screenshot + hypothesis overlay + fix preview |
| `/gen:bugfix` | Breakpoint Reproduction | Bug reproduced at each breakpoint |
| `/gen:audit` | Score Dashboard | Full 72-point report + Awwwards + accessibility + performance |
| `/gen:audit` | Consistency Matrix | Component variant compliance across all sections |

### Lifecycle

1. **Start:** First command needing visuals runs `start-server.sh` (background on macOS/Linux, `run_in_background: true` on Windows)
2. **User opens URL:** `http://localhost:{port}` -- "Waiting for Genorah..." until first screen
3. **Agent pushes screen:** HTML fragment to companion dir -> auto-reload via WebSocket
4. **User interacts:** Clicks -> `.events` -> agent reads next turn
5. **Between visuals:** `waiting.html` ("Return to terminal...")
6. **End:** `stop-server.sh` or 30-minute idle timeout
7. **Fallback:** Companion not running? All content falls back to terminal (ASCII mockups, text descriptions)

---

## 8. Design Intelligence (12 Domains)

New skill: `skills/ux-intelligence/SKILL.md` — replaces scattered UX guidance with 12 enforceable domains.

### Domain 1: Visual Proportion & Mathematical Harmony

| Principle | Enforcement |
|-----------|-------------|
| Modular scale | Type sizes must follow defined ratio (1.125-1.5). Random sizes flagged |
| Golden ratio spacing | Key compositional elements use phi (1.618) proportional relationships |
| Optical alignment | Text aligns to visual center, not geometric center |
| Consistent rhythm | Vertical spacing follows base-unit grid (4px or 8px). Mixed values flagged |
| Viewport proportions | Hero sections use deliberate vh (50/66/75/80/100), never arbitrary |

Constraint table:

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Type scale ratio | 1.125 | 1.5 | ratio | Defined scale, no random sizes |
| Base spacing unit | 4 | 8 | px | All spacing divisible by base |
| Max font sizes per page | -- | 6 | count | More = visual noise |
| Section height options | 50 | 100 | vh | Deliberate only (50/66/75/80/100) |

### Domain 2: Color Science

| Principle | Enforcement |
|-----------|-------------|
| Perceptual uniformity | Colors validated in OKLCH space |
| 60-30-10 rule | Dominant/secondary/accent ratio enforced |
| Contrast ladder | 4 levels: subtle (3:1), readable (4.5:1), strong (7:1), maximum (12:1+) |
| Color temperature consistency | Warm DNA = warm grays, Cool DNA = cool grays. Mixing flagged |
| Chromatic depth | Flat single-tone backgrounds flagged. Surfaces need subtle variation |
| Dark mode independence | Dark palettes designed independently, not inverted light mode |

### Domain 3: Typography as Design System

| Principle | Enforcement |
|-----------|-------------|
| Hierarchy through contrast | Must use 2+ of: size, weight, color, case, spacing |
| Measure (line length) | Body text: 45-75 characters. Exceeding flagged |
| Leading (line height) | Body: 1.5-1.7. Headings: 1.0-1.2. Display: 0.85-1.0 |
| Tracking (letter spacing) | Uppercase: +0.05-0.1em. Large display: -0.02-0.04em. Body: default |
| Orphan/widow prevention | Last line must have 2+ words |
| Font weight pairing | Heading/body weight contrast 200+ |
| Numeric typography | Tabular figures for data, proportional for body |

### Domain 4: Micro-Interaction Craft

| Principle | Enforcement |
|-----------|-------------|
| Every interactive element has feedback | Hover, focus, active, disabled states ALL defined |
| Transition choreography | Related elements stagger (30-80ms delay), not simultaneous |
| Easing curves | No `linear` or `ease`. Intentional cubic-bezier only |
| Duration proportionality | Small (150-200ms), Medium (200-300ms), Large (300-500ms) |
| Cursor semantics | pointer/default/grab/not-allowed correctly applied |
| Scroll-linked feedback | Sticky headers change, progress updates, subtle parallax |
| Loading states designed | Skeleton screens match content layout. Shimmer follows reading direction |

### Domain 5: Spatial Depth & Materiality

| Principle | Enforcement |
|-----------|-------------|
| Shadow depth system | 3-5 elevation levels per DNA, consistent light source |
| Light source consistency | All shadows/highlights imply same direction |
| Surface hierarchy | Background < Surface < Elevated < Overlay |
| Blur as depth cue | backdrop-filter only on elevated surfaces |
| Border discipline | Borders <= 1px and subtle. Heavy borders only as design accent |
| Texture and grain | Flat surfaces only for Minimalist/Swiss archetypes |

### Domain 6: Conversion Psychology

| Principle | Enforcement |
|-----------|-------------|
| Visual hierarchy = attention hierarchy | Primary CTA highest-contrast element |
| Hick's law | Max 3 choices per decision point |
| Fitts's law | CTA min 44x44px touch, desktop primary 48px height |
| Social proof proximity | Testimonials within 1 scroll of nearest CTA |
| Scarcity/urgency | Must be genuine. Fake countdowns = penalty |
| Progressive disclosure | Forms with 5+ visible fields flagged |
| F-pattern/Z-pattern | Key content on natural scan patterns |

### Domain 7: Responsive Craft

| Principle | Enforcement |
|-----------|-------------|
| Container queries over media queries | Component-level responsive preferred |
| Touch target scaling | Mobile: 44px min. Desktop: 32px acceptable |
| Thumb zone optimization | Primary actions in bottom 40% of mobile viewport |
| Content reflow | Mobile layout redesigned, not just squeezed |
| Font size floor | Min 16px body on all devices. 14px only for captions |
| Tap spacing | 8px minimum gap between adjacent touch targets |

### Domain 8: Accessibility as Design

| Principle | Enforcement |
|-----------|-------------|
| Focus indicators designed | Custom focus rings matching DNA. Browser default flagged |
| Reduced motion designed | `prefers-reduced-motion` provides alternative, not just disable |
| Color never sole indicator | Error needs icon + text + color. Color-only flagged |
| Heading hierarchy semantic | No skipping levels (h1 -> h3) |
| ARIA is last resort | Native HTML preferred. `role="button"` on div flagged |
| Screen reader narrative | Coherent story without CSS. Out-of-order DOM flagged |

### Domain 9: Content Design Quality

| Principle | Enforcement |
|-----------|-------------|
| Microcopy is specific | "Submit" -> "Send Message". Generic CTAs = penalty |
| Error messages helpful | "Invalid input" -> "Email must include @". Vague = flagged |
| Empty states designed | Illustration + explanation + action. Blank screens = penalty |
| No placeholder content | Lorem ipsum, "Coming soon" without date = penalty |
| Numbers formatted | Currency symbols, locale dates, thousand separators |

### Domain 10: Motion Narrative

| Principle | Enforcement |
|-----------|-------------|
| Motion tells a story | Elements enter from logical origin |
| Spatial consistency | Modal opens from button, closes toward button |
| Scroll animations fire once | Re-triggering on every pass = penalty |
| No animation for animation's sake | Every motion must serve: guide, relate, feedback, or hierarchy |
| Performance budget | Max 3 concurrent animations in viewport |

### Domain 11: Visual Consistency

| Principle | Enforcement |
|-----------|-------------|
| Icon system coherence | One library per project (Lucide OR Heroicons). Mixed = flagged |
| Border radius consistency | Max 3 values per DNA. Random radii = flagged |
| Image treatment consistency | Same aspect ratio per context (hero 16:9, card 4:3, avatar 1:1) |
| Component spacing pattern | Same type = same padding everywhere |
| Hover effect consistency | All cards hover same way. All buttons hover same way |

### Domain 12: Cultural & Contextual Intelligence

| Principle | Enforcement |
|-----------|-------------|
| Language-aware layout | RTL for Arabic/Hebrew. CJK line heights (1.7-2.0). German flexible containers |
| Cultural color awareness | Flag when project serves multiple cultures with conflicting color semantics |
| Date/time/currency localization | Hardcoded formats flagged. Must use Intl APIs |
| Legal/compliance patterns | GDPR consent, German Impressum, VAT display per country |

---

## 9. Quality Gate System

### From 35 Points to 72 Points (12 Categories x 6 Criteria)

Each criterion scores 0-3:

| Score | Meaning |
|-------|---------|
| 0 | Missing or broken |
| 1 | Present but amateur (default/generic) |
| 2 | Professional (correct, intentional, consistent) |
| 3 | Exceptional (craft-level, award-worthy) |

### Categories

| # | Category | Weight | Points | What It Catches |
|---|----------|--------|--------|----------------|
| 1 | Color System | 1.2x | 6 | DNA compliance, 60-30-10, contrast ladder, temperature, chromatic depth, dark mode |
| 2 | Typography | 1.2x | 6 | Scale ratio, measure/leading/tracking, hierarchy, weight pairing, numerics, orphans |
| 3 | Layout & Composition | 1.1x | 6 | Grid, proportional spacing, viewport ratios, diversity, reflow, container queries |
| 4 | Depth & Polish | 1.1x | 6 | Shadow system, light source, surfaces, borders, texture, visual consistency |
| 5 | Motion & Interaction | 1.0x | 6 | Easing, duration, choreography, scroll, states, performance budget |
| 6 | Creative Courage | 1.2x | 6 | Signature element, tension, personality, uniqueness, wow moments, surprise |
| 7 | UX Intelligence | 1.1x | 6 | Conversion psychology, Hick/Fitts, disclosure, patterns, empty states, errors |
| 8 | Accessibility | 1.1x | 6 | Focus design, reduced motion alt, color independence, headings, ARIA, SR narrative |
| 9 | Content Quality | 1.0x | 6 | Microcopy, error messages, placeholder elimination, formatting, voice, CTAs |
| 10 | Responsive Craft | 1.0x | 6 | Touch targets, thumb zone, reflow, font floors, tap spacing, mobile design |
| 11 | Performance | 1.0x | 6 | LCP, CLS, INP, lazy loading, bundle size, image optimization |
| 12 | Integration Quality | 1.0x | 6 | API security, tracking consent, webhooks, form validation, data freshness, env vars |

Raw max: 216 points. Weighted max: ~248 points.

### Named Tiers

| Tier | Weighted Score | Meaning |
|------|---------------|---------|
| Reject | < 140 | Below professional. Mandatory remediation |
| Baseline | 140-169 | Professional but generic. Not award-worthy |
| Strong | 170-199 | Good craft. Portfolio piece |
| SOTD-Ready | 200-219 | Awwwards SOTD candidate (8.0+ avg) |
| Honoree | 220-234 | Awwwards Honoree level |
| SOTM-Ready | 235+ | Site of the Month territory |

### Penalty System

| Violation | Penalty |
|-----------|---------|
| Missing signature element | -8 |
| Forbidden archetype pattern | -10 |
| No creative tension on page | -6 |
| Generic CTA text ("Submit", "Click Here") | -3 per instance |
| Mixed icon libraries | -4 |
| Browser default focus rings | -4 |
| `linear` easing on UI transitions | -2 per instance |
| Hardcoded color (not DNA token) | -3 per instance |
| Missing empty state design | -3 per instance |
| Placeholder/Lorem Ipsum | -10 |
| Form without UTK/tracking (HubSpot active) | -5 |
| API token exposed client-side | -15 |
| Component dimension mismatch (same type, different size) | -4 per mismatch |
| Card height inconsistency in same grid | -4 |
| No entrance animation on section | -3 |
| Desktop layout just squished for mobile | -5 |
| CSS feature above compat tier without fallback | -3 per instance |
| Horizontal scroll on any breakpoint | -5 |

### Hard Gates (Pass/Block, Not Scored)

| Hard Gate | Condition | Consequence |
|-----------|-----------|-------------|
| Motion exists | Every section has entrance animation + interactive states | Build rejected |
| 4-breakpoint responsive | Layout verified at 375, 768, 1024, 1440 | Build rejected |
| Compatibility tier respected | No unsupported features without `@supports` fallback | Build rejected |
| Component registry compliance | No unregistered variants with dimension mismatches | Build rejected |

### 3-Tier Enforcement

**Tier 1: Build-Time (Pre-commit hook, zero context cost)**
- DNA token compliance
- Generic microcopy detection
- Compatibility tier violations
- Animation/responsive absence
- Component registry mismatches

**Tier 2: Post-Build (Quality Reviewer agent)**
- Full 72-point scoring
- Cross-section consistency audit
- Emotional arc validation
- Integration quality verification
- Generates GAP-FIX.md + CONSISTENCY-FIX.md

**Tier 3: Visual Verification (Live Testing + Companion)**
- Playwright screenshots at 4+ breakpoints (375, 768, 1024, 1440, plus 375x667 short + 2560x1440 ultrawide)
- Lighthouse performance audit
- axe-core accessibility audit
- Score dashboard in visual companion
- Manual user approval gate

---

## 10. Baked-In Defaults

### 10.1: Animation (Mandatory in Every Section)

Every section PLAN.md includes a mandatory `motion` block:

```yaml
motion:
  entrance: fade-up
  stagger: 50ms
  scroll_trigger: true
  interactions:
    - target: cards
      hover: lift-shadow
    - target: cta
      hover: fill-sweep
  archetype_profile: kinetic
```

Motion derived from:

| Source | What It Provides |
|--------|-----------------|
| Design DNA | 8+ motion tokens (durations, easings) |
| Archetype | Motion personality (Brutalist=instant, Ethereal=floating, Kinetic=spring) |
| Beat type | Intensity (Hook=dramatic, Breathe=minimal, Peak=maximum) |
| Content | Cards=stagger, Hero=cinematic, Stats=count-up, Testimonials=carousel |

Motion Complexity Tiers (auto-assigned by beat):

| Beat | Tier | Includes |
|------|------|----------|
| Hook | Heavy | Cinematic entrance, parallax, particle animation, text reveal |
| Tease | Medium | Scroll fade+slide, subtle parallax, icon animation |
| Reveal | Heavy | Dramatic unveil, counters, image sequence, split-screen |
| Build | Medium | Card stagger, progressive disclosure, scroll progress |
| Peak | Maximum | 3D transforms, GSAP timeline, creative tension |
| Breathe | Minimal | Gentle fade only, ambient motion, no scroll trigger |
| Tension | Heavy | Scale violence, glitch, direction break |
| Proof | Light | Testimonial carousel, logo ticker, stat count-up |
| Pivot | Medium | Transition animation, section morph |
| Close | Medium | CTA pulse/glow, form focus animation, footer reveal |

`prefers-reduced-motion` mandatory: provides alternative static design, not just disable.

### 10.2: Responsive Design (4 Breakpoints Mandatory)

Every section PLAN.md includes a mandatory `responsive` block:

```yaml
responsive:
  mobile_375:
    layout: single-column
    hero_height: 90vh
    font_scale: 0.85
    hidden: [decorative-shapes, parallax-bg]
    reorder: [heading, image, text, cta]
  tablet_768:
    layout: two-column
    hero_height: 80vh
    font_scale: 0.92
    hidden: [parallax-bg]
  desktop_1024:
    layout: designed
    hero_height: 100vh
    font_scale: 1.0
  ultrawide_1440:
    layout: constrained
    max_content_width: 1280px
    side_padding: auto
```

Mandatory viewport testing:

| Viewport | Purpose |
|----------|---------|
| 375 x 812 | iPhone SE / small mobile |
| 768 x 1024 | iPad / tablet portrait |
| 1024 x 768 | Tablet landscape / small desktop |
| 1440 x 900 | Standard desktop |
| 375 x 667 | Short mobile (content overflow test) |
| 2560 x 1440 | Ultrawide (containment test) |

### 10.3: Browser Compatibility (Tier-Based)

Compatibility tier set during `/gen:start-project` discovery, stored in DNA:

```yaml
# DESIGN-DNA.md
compatibility:
  tier: broad
  browsers:
    chrome: "100+"
    firefox: "100+"
    safari: "15.4+"
    edge: "100+"
  required_fallbacks:
    - container_queries -> media_queries
    - oklch -> hsl
    - has_selector -> js_equivalent
    - view_transitions -> fade_fallback
```

| Tier | Browsers | Implications |
|------|----------|-------------|
| Modern (default) | Chrome 120+, Firefox 120+, Safari 17.4+, Edge 120+ | Full modern CSS |
| Broad | Chrome 100+, Firefox 100+, Safari 15.4+, Edge 100+ | Fallbacks for container queries, :has(), oklch, subgrid |
| Legacy | Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ | No container queries, no :has(), no oklch, progressive enhancement |
| Maximum | Includes IE 11 (rare, explicit) | CSS custom property fallbacks, limited grid |

Builders generate `@supports` fallback code for any feature above the project's tier.

---

## 11. Component Consistency Enforcement

### Component Registry in `DESIGN-SYSTEM.md`

Created during Wave 0-1 by the orchestrator. Living document updated as new component types emerge.

Registered component types:

| Component | Registered Properties |
|-----------|-----------------------|
| Card (default, compact, feature) | min-height, padding, radius, shadow, gap, image-aspect, hover |
| Button (primary, secondary, ghost) | height, padding-x, radius, font-size, font-weight |
| Section Heading | tag-size, tag-weight, heading-size, heading-weight, desc-size, desc-max-width, gap, margin-bottom |
| Badge | height, padding-x, radius, font-size, font-weight |
| Input | height, padding-x, radius, border, font-size, focus-ring |
| Avatar | sizes (sm/md/lg), radius |
| Navigation Item | height, padding, font-size, active-indicator |

### Enforcement Flow

1. **Wave 0-1:** Orchestrator extracts specs from first built components -> writes to DESIGN-SYSTEM.md
2. **Wave 2+:** Every builder receives registry in spawn prompt. Must use registered variants
3. **New variant needed:** Builder documents in SUMMARY.md as "component proposal" for orchestrator approval
4. **Quality reviewer:** Runs cross-section consistency audit after each wave
5. **Violations:** Written to CONSISTENCY-FIX.md, polisher addresses before wave completion

### CSS Enforcement Patterns

Equal-height cards (most common violation):

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.card-grid > .card {
  display: flex;
  flex-direction: column;
  min-height: 320px;       /* from registry */
}

.card-grid > .card .card-body {
  flex: 1;                 /* stretches equally */
}

.card-grid > .card .card-footer {
  margin-top: auto;        /* pinned to bottom */
}
```

Content truncation strategies:

| Strategy | When |
|----------|------|
| `line-clamp: 2` on descriptions | Card grids with varying description lengths |
| `min-height` on content area | All content visible but cards must align |
| `aspect-ratio` on image containers | Mixed source image ratios |
| `flex: 1` on middle section | Push footer to consistent bottom |

**Golden rule:** Same component type = same registered variant dimensions everywhere. Different needs = different registered variant, never ad-hoc tweaks.

---

## 12. Integration Skills (Full Depth)

All integration skills use the 4-layer format with pipeline awareness.

### 12.1: HubSpot Integration

**Scope:** UTK tracking, Forms API v3, CRM API, CMS Blog API, HubDB, Chat Widget, Conversations API, Marketing Events API, Custom Events, GDPR consent management

**Key patterns:**

| Pattern | Description |
|---------|-------------|
| Tracking & UTK | Consent-gated `<HubSpotTracker />` client component, SPA page view tracking via `usePathname()`, UTK cookie server-side read |
| Forms (API submission) | Server-side proxy Route Handler, react-hook-form + zod, CRITICAL: always pass `hutk` + `pageUri` + `pageName` in context |
| Headless Blog | CMS Blog API + ISR (5min revalidate), HTML sanitization |
| CRM Dashboard | SSR for real-time data, ISR for reports, webhook-driven revalidation |
| Chat Widget | `loadImmediately: false`, custom placement via `inlineEmbedSelector` |
| HubDB | Structured content (team, locations, pricing), ISR |
| Marketing Events | Event registration API, attendance tracking, workflow triggers |
| Custom Events | `POST /events/v3/send` for server-side event tracking |

**Form Name Enforcement:** Builder must reference forms by `HUBSPOT_FORM_ID` (GUID). Form names in HubSpot must be human-readable. CSS class names as form names = flagged as critical error.

**Anti-patterns with penalties:**

| Anti-Pattern | Penalty |
|-------------|---------|
| Token exposed client-side | -15 |
| Missing hutk in form context | -5 |
| No consent before tracking script | -5 |
| CSS classes as form names | -5 |
| Using Contacts API instead of Forms API for user forms | -3 |
| Synchronous tracking script load | -3 |

### 12.2: Stripe Integration

**Scope:** Checkout Sessions, Payment Intents, Subscriptions (Billing), Customer Portal, Stripe Link, Webhooks, Connect (marketplace/platform payments)

**Key patterns:**

| Pattern | Description |
|---------|-------------|
| Checkout Sessions | Server-side creation via Route Handler, redirect to Stripe-hosted checkout |
| Payment Intents | Custom payment form with Stripe Elements (DNA-styled) |
| Subscriptions | Pricing table component, plan selection, Billing portal redirect |
| Stripe Link | One-click checkout, saved payment methods, Link button component |
| Webhooks | Route Handler with `stripe.webhooks.constructEvent()` signature verification |
| Connect | Multi-party payments for marketplace/platform projects |

**Anti-patterns:**

| Anti-Pattern | Penalty |
|-------------|---------|
| Secret key (`sk_*`) exposed client-side | -15 (critical security) |
| Missing webhook signature verification | -10 |
| No idempotency keys on payment creation | -5 |
| Hardcoded prices instead of Stripe Price IDs | -3 |
| No loading/error states on payment forms | -3 |

### 12.3: Shopify Integration

**Scope:** Storefront API (GraphQL), Product catalog, Collections, Cart, Checkout, Metafields, Customer accounts, Webhooks

**Key patterns:**

| Pattern | Description |
|---------|-------------|
| Storefront API | GraphQL client with typed queries, ISR for products |
| Product pages | SSG with `generateStaticParams`, variant selector, image gallery |
| Cart | React context + Storefront Cart API, drawer/sheet UI |
| Checkout | Redirect to Shopify checkout (or custom Checkout API) |
| Metafields | Custom content (ingredients, sizing charts, etc.) |
| Webhooks | Product/order updates -> revalidateTag |

**Anti-patterns:**

| Anti-Pattern | Penalty |
|-------------|---------|
| Admin API token exposed client-side | -15 |
| Fetching all products without pagination | -5 |
| Missing inventory/variant state handling | -3 |
| No structured data (Product schema) | -3 |
| Cart state lost on page refresh | -3 |

### 12.4: WooCommerce Integration

**Scope:** REST API v3 headless, Product sync, Cart (CoCart), Checkout, Variations, Webhooks

**Key patterns:**

| Pattern | Description |
|---------|-------------|
| REST API proxy | Server-side proxy, consumer key/secret never client-side |
| Products | ISR with webhook-triggered revalidation |
| Cart | CoCart REST API for headless cart management |
| Checkout | Redirect to WooCommerce or custom checkout form |
| Variations | Complex variation model handling (size x color x material) |
| Webhooks | Order/product updates -> revalidateTag |

**Anti-patterns:**

| Anti-Pattern | Penalty |
|-------------|---------|
| Consumer key/secret exposed client-side | -15 |
| Not handling WooCommerce variation complexity | -5 |
| Missing currency/tax formatting per locale | -3 |
| No fallback for WooCommerce downtime | -3 |

### 12.5: Propstack Integration

**Scope:** Property listings API, Lead capture, Expose PDF generation, Search/filter, Map integration

**Key patterns:**

| Pattern | Description |
|---------|-------------|
| Property listings | ISR with webhook revalidation, grid + map view |
| Detail pages | Gallery, floor plans, energy certificate, location map |
| Lead capture | Contact form -> Propstack lead API, property reference ID |
| Search/filter | Faceted search (price range, rooms, area, type), URL-synced filters |
| Expose PDF | Server-side PDF generation with DNA styling |
| Map integration | Mapbox/Google Maps with clustered property markers |

**Anti-patterns:**

| Anti-Pattern | Penalty |
|-------------|---------|
| API credentials exposed client-side | -15 |
| No pagination for large property sets | -5 |
| Missing image optimization for property photos | -3 |
| No RealEstateListing structured data | -3 |
| Search filters not URL-synced (lost on refresh) | -3 |

---

## 13. AI UI Features

### 13.1: AI UI Patterns (Product Design Catalog)

| Pattern | Description | Key Components |
|---------|-------------|----------------|
| Chat interface | Message list + prompt input + streaming | AI Elements: Message, Conversation, PromptInput |
| AI search | NL query -> structured results + citations | Search input, result cards, source badges |
| Smart forms | AI-assisted completion, suggestions | Input with dropdown suggestions, confidence indicators |
| Content generation | Prompt -> draft -> edit -> publish | Editor with AI sidebar, version comparison |
| Model comparison | Side-by-side outputs | Split view, parameter controls, diff highlighting |
| RAG search | Query -> retrieval -> generated answer | Query input, retrieval indicators, sourced answer |
| AI dashboard | Usage, costs, performance | Metric cards, charts, model selector |
| Prompt playground | Multi-model testing | Tabbed editors, parameter sliders, output panels |

Each pattern includes DNA-styled TSX examples using AI Elements components.

### 13.2: AI Pipeline Features (Genorah's Own AI)

| Feature | Pipeline Stage | Description |
|---------|---------------|-------------|
| AI image prompts | start-project Phase 3 | DNA-matched prompts for hero/section imagery |
| AI copy generation | Content planning | Brand-voice-aware drafts using archetype voice profile |
| AI design suggestions | discuss | "Based on your DNA + archetype, consider..." |
| AI quality prediction | build (pre-build) | Estimated quality score before building |
| AI accessibility audit | audit | axe-core results + AI interpretation + fix suggestions |
| AI competitive analysis | start-project research | Analyze competitor sites for patterns/gaps |

### 13.3: AI Elements Integration Guide

| Component | When to Use | Mandatory Rule |
|-----------|------------|----------------|
| `<Message>` | Chat UIs with `useChat` | Required for chat message rendering |
| `<MessageResponse>` | ANY AI-generated text | NEVER render AI text as raw `{text}` |
| `<Conversation>` | Full chat container | Wraps Message list |
| `<Tool>` | Tool call result display | Required for tool call UIs |
| `<Reasoning>` | Model thinking display | Optional, for transparency UIs |
| `<CodeBlock>` | AI-generated code | Syntax highlighting + copy |
| `<PromptInput>` | Chat input | File attachment, submit handling |

---

## 14. Performance & Optimization

Enhancement of existing `performance-guardian` and `performance-animation` skills.

### Lazy Loading Patterns

| Pattern | Implementation |
|---------|---------------|
| Image lazy loading | `loading="lazy"` on all below-fold images, `next/image` with `sizes` |
| Component lazy loading | `React.lazy()` + Suspense for heavy components (charts, 3D, editors) |
| Below-fold sections | Intersection Observer trigger, skeleton placeholder |
| Route-based splitting | `next/dynamic` with `ssr: false` for client-only components |
| Library lazy loading | Dynamic import for GSAP, Three.js, chart libraries |

### Caching Decision Tree

| Need | Strategy | Revalidation |
|------|----------|-------------|
| Static page content | SSG / `generateStaticParams` | Build time |
| Content with periodic updates | ISR | `revalidate: N` seconds |
| Per-user dynamic | SSR (Server Components) | Every request |
| Expensive shared computation | Runtime Cache | Tag-based purge |
| Static assets | CDN Cache + `Cache-Control` | TTL + tag purge |
| Component-level mixed | Cache Components (`'use cache'`) | `cacheTag()` + `revalidateTag()` |

### Bundle Optimization

| Technique | Enforcement |
|-----------|-------------|
| Dynamic imports for heavy libs | Chart libs, 3D, animation libraries MUST be dynamically imported |
| Tree shaking audit | Unused exports from large packages flagged |
| `@next/bundle-analyzer` | Run during audit, bundle > 200KB per route flagged |
| Font subsetting | `next/font` with `subsets` array, variable fonts preferred |
| Image formats | AVIF > WebP > PNG. No unoptimized images shipped |

### CWV Budgets (Enforced in Quality Gate)

| Metric | Budget | Penalty if Exceeded |
|--------|--------|---------------------|
| LCP | < 2.5s | -3 |
| FID/INP | < 200ms | -3 |
| CLS | < 0.1 | -3 |
| Total bundle per route | < 200KB | -2 |
| Image without optimization | -- | -2 per instance |

---

## 15. Obsidian Integration

### Two Vaults

**Vault 1: Project Vault (per-project, real-time)**

Location: `.planning/genorah/vault/`

```
vault/
+-- 00-DNA.md                  <- DESIGN-DNA mirror with [[links]]
+-- 01-Brainstorm.md           <- creative directions with [[archetype]] links
+-- 02-Master-Plan.md          <- wave map with [[section]] links
+-- sections/
|   +-- 01-hero.md             <- PLAN + SUMMARY merged, status tags
|   +-- 02-features.md
+-- decisions/
|   +-- archetype-choice.md    <- rationale
|   +-- palette-override.md
+-- quality/
|   +-- anti-slop-scores.md    <- Dataview-queryable scores
|   +-- awwwards-projection.md <- 4-axis running estimate
|   +-- arc-map.md             <- emotional arc data
+-- consistency/
|   +-- component-registry.md  <- DESIGN-SYSTEM mirror with Dataview
+-- _index.md                  <- dashboard with Dataview tables
```

Sync direction: Pipeline writes -> vault mirrors (after each wave).

**Vault 2: Knowledge Base (global, persistent)**

Location: User-configured (e.g., `D:\Genorah\Knowledge\`)

```
Knowledge/
+-- design-system/
|   +-- palettes/              <- 97+ palettes as individual notes
|   +-- font-pairings/        <- 57+ pairings
|   +-- archetypes/            <- 19 archetypes as browsable notes
|   +-- industry-rules/        <- 100+ rules by vertical
+-- integrations/
|   +-- hubspot/               <- HubSpot patterns
|   +-- stripe/
|   +-- shopify/
|   +-- woocommerce/
|   +-- propstack/
+-- ux-rules/
|   +-- accessibility.md
|   +-- conversion-psychology.md
|   +-- responsive-craft.md
+-- ai-patterns/
|   +-- chat-interface.md
|   +-- ai-search.md
+-- project-history/           <- cross-project intelligence (Phase 2)
+-- _dashboard.md              <- Dataview overview
```

### Sync Mechanism: `/gen:sync-knowledge`

**Direction 1: Plugin -> Obsidian (export)**
- Transforms skill YAML frontmatter + prose -> Obsidian notes with wiki-links and tags
- Preserves constraint tables as Dataview-queryable format

**Direction 2: Obsidian -> Plugin (import)**
- Reads modified Obsidian notes, updates corresponding skill files
- Conflict resolution: Obsidian wins for content, plugin wins for structure

**Direction 3: Project -> Obsidian (per-project sync)**
- After each wave: reads `.planning/genorah/` artifacts, writes to `vault/`
- Updates `_index.md` dashboard with Dataview queries

### Optional

- Obsidian not installed = everything works via `.planning/genorah/` markdown
- Sync is opt-in (`/gen:sync-knowledge` or `/gen:export`)
- Knowledge base path configured in `.claude/genorah.local.md`

---

## 16. Data Catalog Format

Absorbed data (palettes, fonts, charts, industry rules) stored in two formats:

### Skill Format (LLM-optimized, in `skills/data/`)

```markdown
## Palette: SaaS Trust Blue
- **Primary:** #2563EB (oklch: 0.55 0.2 260)
- **Secondary:** #F97316
- **CTA:** #F97316
- **Background:** #FFFFFF / #0F172A (dark)
- **Text:** #0F172A / #F8FAFC (dark)
- **Archetypes:** Neo-Corporate, AI-Native, Data-Dense
- **Industries:** SaaS, B2B, Developer Tools
- **Mood:** Trust, professional, technical
- **WCAG:** AAA on light, AA on dark
```

### Obsidian Format (human-optimized, in Knowledge Vault)

```markdown
---
name: SaaS Trust Blue
type: palette
archetypes: [neo-corporate, ai-native, data-dense]
industries: [saas, b2b, developer-tools]
tags: [palette, cool, professional, dark-mode-ready]
---

# SaaS Trust Blue

| Token | Light | Dark | OKLCH |
|-------|-------|------|-------|
| Primary | #2563EB | #3B82F6 | oklch(0.55 0.2 260) |
...

**Compatible Archetypes:** [[Neo-Corporate]], [[AI-Native]], [[Data-Dense]]
```

Sync mechanism transforms between formats automatically.

---

## 17. Migration Checklist

### Files to Rename/Move

- [ ] `.claude-plugin/plugin.json` -> update name to "genorah", bump to v2.0.0
- [ ] All `modulo` references -> `genorah` across all files
- [ ] All `/modulo:` command references -> `/gen:`
- [ ] `.planning/modulo/` references -> `.planning/genorah/`
- [ ] `marketplace.json` -> update name, description, version

### Files to Create

- [ ] 4 hook files (session-start.mjs, pre-tool-use.mjs, user-prompt.mjs, enhanced dna-compliance-check.sh)
- [ ] 5 visual companion files (server.cjs, start-server.sh, stop-server.sh, frame-template.html, helper.js)
- [ ] 3 new commands (sync-knowledge.md, companion.md, export.md)
- [ ] 1 new agent (ai-ui-specialist.md)
- [ ] 1 new protocol (visual-companion.md)
- [ ] 6 new domain skills (hubspot, stripe, shopify, woocommerce, propstack, ux-intelligence)
- [ ] 3 new AI skills (ai-ui-patterns, ai-pipeline-features, ai-ui-components)
- [ ] 4 data catalog files (palettes.md, font-pairings.md, chart-types.md, industry-rules.md)
- [ ] Screen template files for visual companion

### Files to Rewrite

- [ ] All 8 pipeline commands (add TodoWrite, PlanMode, companion integration, remove hardcoded suggestions)
- [ ] All 7 pipeline agents (Agent Teams, SendMessage, worktree isolation, spawn prompt includes motion/responsive/compat/registry)
- [ ] Quality reviewer (35-point -> 72-point, add consistency audit, add integration validation)
- [ ] Planner (add mandatory motion/responsive/compat blocks to PLAN.md generation)
- [ ] Orchestrator (Agent Teams, TodoWrite, component registry management, companion management)

### Files to Audit

- [ ] All 78 existing skills (stale references to old artifact names, old command names, old agent behaviors)
- [ ] All protocol documents (update for v2 infrastructure)
- [ ] Existing performance skills (expand with lazy loading, caching, bundle optimization)

### Preserved Without Change

- [ ] 19 design archetypes (content preserved, format may update)
- [ ] Design DNA system (expanded with compat tier + component registry, core preserved)
- [ ] Emotional arc (10 beat types, constraints preserved)
- [ ] Creative tension framework (5 types, preserved)
- [ ] Awwwards 4-axis scoring (now part of expanded quality gate)
- [ ] Context rot prevention (6 layers, enhanced with hooks)
