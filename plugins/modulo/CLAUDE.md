# CLAUDE.md

This file provides guidance to Claude Code when working with the Genorah plugin repository.

## Project Overview

**Genorah 2.0** is a Claude Code plugin for premium frontend design. It produces award-caliber websites (Awwwards SOTD 8.0+ baseline) through a pipeline of specialized agents, machine-enforceable design identity, and multi-layer quality gates. It is NOT a template generator -- every project gets a unique visual identity enforced through Design DNA, 19 Design Archetypes, Emotional Arc storytelling, and a 35-point Anti-Slop Gate.

This repository contains only markdown definitions and a plugin manifest -- there is no application code, build system, or test suite. Targets Next.js, Astro, React/Vite, Tauri, and Electron.

## Architecture

Three-tier system where commands are entry points, agents orchestrate work, and skills provide domain knowledge:

```
commands/ (6 commands -- user-facing pipeline stages)
    | invoke
agents/ (pipeline agents -- researcher, creative director, builder, reviewer, polisher)
    | reference
skills/ (3-tier, 4-layer SKILL.md files -- modular knowledge bases)
```

**Plugin manifest:** `.claude-plugin/plugin.json`

### File Conventions

- **Skills:** `skills/{skill-name}/SKILL.md` -- 4-layer format with YAML frontmatter (name, description, tier, triggers, version)
- **Agents:** `agents/{agent-name}.md` -- role definition, input/output contracts, context budget
- **Commands:** `commands/{command-name}.md` -- description, argument-hint, numbered workflow steps
- **Hooks:** `.claude-plugin/hooks/` -- DNA compliance pre-commit check
- **Template:** `skills/_skill-template/SKILL.md` -- canonical 4-layer format reference

## Skill Tiers

Skills are organized into three tiers with different loading behaviors:

| Tier | Loading | Examples |
|------|---------|----------|
| **Core** | Always loaded | design-dna, design-archetypes, anti-slop-gate, emotional-arc, typography, color-system |
| **Domain** | Per project type | 3d-webgl, remotion, ecommerce-ui, dashboard-patterns |
| **Utility** | On-demand | accessibility, seo, performance, responsive-design |

Every skill uses the **4-layer format**: Layer 1 (Decision Guidance) explains when and why to use it. Layer 2 (Award-Winning Examples) provides copy-paste TSX and reference site annotations. Layer 3 (Integration Context) maps to DNA tokens, archetypes, and pipeline stages. Layer 4 (Anti-Patterns) lists common mistakes with corrections. Skills with enforceable parameters include a machine-readable constraint table (Parameter/Min/Max/Unit/Enforcement).

## Core Workflow

```
/gen:start-project -> /gen:lets-discuss -> /gen:plan-dev -> /gen:execute -> /gen:iterate
```

1. **start-project** -- Discovery questions, parallel research agents, competitive benchmarking, archetype selection, Design DNA generation, content planning
2. **lets-discuss** -- Per-phase creative deep dive with visual feature proposals, brand voice refinement, and auto-organized task output
3. **plan-dev** -- Phase-scoped re-research, context-rot-safe PLAN.md generation with verification questions
4. **execute** -- Wave-based implementation (parallel or sequential per master plan) with real-time status
5. **iterate** -- Brainstorm-first design changes or bug diagnosis with user approval before applying

Additional: `/gen:bug-fix` for diagnostic root cause analysis with proposed solutions.

## Key Concepts

**Design DNA** -- Per-project visual identity with 12 color tokens (8 semantic: bg, surface, text, border, primary, secondary, accent, muted + 4 expressive: glow, tension, highlight, signature), display/body/mono fonts, 8-level type scale, 5-level spacing, signature element, and 8+ motion tokens. Generates Tailwind v4 `@theme` CSS directly.

**Design Archetypes** -- 19 opinionated personality systems (Brutalist, Ethereal, Kinetic, Editorial, Neo-Corporate, Organic, Retro-Future, Luxury/Fashion, Playful/Startup, Data-Dense, Japanese Minimal, Glassmorphism, Neon Noir, Warm Artisan, Swiss/International, Vaporwave, Neubrutalism, Dark Academia, AI-Native) plus a custom builder. Each locks in colors, fonts, mandatory techniques, forbidden patterns, and 3 tension zones. Escape hatch: builders may break ONE rule via tension override with documented rationale.

**Creative Tension** -- Controlled rule-breaking with 5 tension types (Scale Violence, Material Collision, Temporal Disruption, Dimensional Break, Interaction Shock). Per-archetype techniques, 1-3 per page, spaced apart.

**Emotional Arc** -- 10 beat types (Hook, Tease, Reveal, Build, Peak, Breathe, Tension, Proof, Pivot, Close) with hard parameter constraints (whitespace %, element count, viewport height). Archetype-specific arc templates. Invalid sequences auto-rejected.

**Anti-Slop Gate** -- 35-point weighted scoring across 7 categories (Colors, Typography, Layout, Depth & Polish, Motion, Creative Courage, UX Intelligence). Design quality categories weighted highest. Post-review enforcement during `/gen:iterate` and verification. Named tiers: Pass (25+), Strong (28+), SOTD-Ready (30+), Honoree-Level (33+). Penalties: missing signature element (-3), forbidden pattern (-5), no creative tension (-5).

**Awwwards 4-Axis Scoring** -- Design, Usability, Creativity, Content each scored /10. SOTD target: 8.0+ average, no axis below 7.

**Wave System** -- Wave 0: scaffold and design tokens. Wave 1: shared UI (nav, footer, theme). Wave 2+: independent sections in parallel (max 4 per wave). Higher waves for dependent sections.

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
