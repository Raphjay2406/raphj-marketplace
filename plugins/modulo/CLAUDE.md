# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Modulo** (v6.1.0) is a Claude Code plugin for premium frontend design. It provides 87 skills, 13 slash commands, and 17 agents that work together to produce distinctive, production-quality websites for Next.js and Astro. It is NOT a template generator — it enforces unique visual identity per project through eight interlocking quality systems: Design DNA, Design Archetypes, Creative Tension, Emotional Arc, Cinematic Motion, Anti-Slop Gate (35-point/7-category), Awwwards 4-Axis Scoring, and Context Rot Prevention.

This repository contains only markdown definitions and a plugin manifest — there is no application code, build system, or test suite.

## Architecture

Three-tier system where commands are entry points, agents do the work, and skills provide domain knowledge:

```
commands/ (13 slash commands — user-facing entry points)
    ↓ invoke
agents/ (16 agents — orchestrators, builders, auditors)
    ↓ reference
skills/ (87 SKILL.md files — modular knowledge bases)
```

**Plugin manifest:** `.claude-plugin/plugin.json`

### File Conventions

- **Skills:** `skills/{skill-name}/SKILL.md` — each skill is a folder with a single SKILL.md
- **Agents:** `agents/{agent-name}.md` — markdown with role definition, tools list, and protocol
- **Commands:** `commands/{command-name}.md` — markdown with description, argument-hint, and numbered workflow steps

### Key Agents

- `design-lead` — Orchestrator that manages STATE.md, spawns parallel section-builders in waves, enforces layout diversity
- `section-builder` — Worker that executes a single section's PLAN.md tasks, reads Design DNA first, writes SUMMARY.md on completion
- `quality-reviewer` — Runs three-level verification (Existence → Substantive → Wired) plus the mandatory 35-point anti-slop gate and Awwwards 4-axis scoring

## Core Workflow

```
/modulo:start-design → /modulo:plan-sections → /modulo:execute → /modulo:verify → /modulo:iterate
```

1. **start-design** — Discovery questions, 4 parallel research tracks, competitive benchmarking, archetype selection, Design DNA generation (with tension plan, emotional arc, choreography defaults)
2. **plan-sections** — Breaks page into sections with wave assignments, emotional beat assignments, wow moments, creative tensions, transition techniques, and GSD-format PLAN.md files
3. **execute** — Wave-based parallel implementation (max 4 builders per wave) with beat-aware section building
4. **verify** — Three-level check + 35-point anti-slop gate (score < 25/35 = automatic fail) + Awwwards 4-axis scoring + performance audit + live browser testing
5. **iterate** — Targeted gap fixes or user feedback refinement

### Managed Artifacts (created in target projects)

All state lives under `.planning/modulo/` in the target project:

| File | Purpose |
|------|---------|
| `PROJECT.md` | Discovery output |
| `DESIGN-DNA.md` | Locked visual identity (colors, fonts, spacing, signature element, motion) |
| `BRAINSTORM.md` | Creative directions and chosen archetype |
| `MASTER-PLAN.md` | Wave map with section dependencies |
| `CONTEXT.md` | Context anchor — DNA identity, build state, arc position, next instructions |
| `STATE.md` | Current execution state (phase, wave, section statuses) |
| `sections/*/PLAN.md` | Per-section task list with GSD frontmatter |
| `sections/*/SUMMARY.md` | Builder completion report |

## Context Rot Prevention (v6.1.0)

Six-layer defense system to maintain award-winning quality through extended build sessions:

| Layer | Mechanism | Context Cost |
|-------|-----------|-------------|
| **L0** | Pre-commit DNA compliance hook | Zero (shell script) |
| **L1** | CONTEXT.md — single source of truth | Low (~50 lines) |
| **L2** | Pre-extracted spawn prompts | Amortized across builders |
| **L3** | Canary checks after each wave | Minimal (5 self-test questions) |
| **L4** | 2-wave session boundaries | Zero (policy) |
| **L5** | Baked-in rules in agent files | Zero (already in prompt) |

**Key files:**
- `.planning/modulo/CONTEXT.md` — Rewritten after every wave. Contains DNA anchor, build state, arc position, next instructions. Replaces `.continue-here.md` and `.session-transfer.md`.
- `.claude-plugin/hooks/dna-compliance-check.sh` — Greps for anti-slop violations before commits.

**Session management:** Design-lead suggests new session every 2 waves. Canary checks detect context rot. Turn 31+ = mandatory session save.

**Builder optimization:** Section builders read exactly 1 file (PLAN.md). All other context is pre-extracted by design-lead into spawn prompts.

## Key Concepts

**Design DNA** — Unique per-project visual identity document with 12 color tokens, display/body/mono fonts, 8-level type scale, 5-level spacing, signature element, motion language, forbidden patterns, tension plan, emotional arc template, and choreography defaults. Section builders must read it before writing any code.

**Design Archetypes** — 16 opinionated personality systems (Brutalist, Ethereal, Kinetic, Editorial, Neo-Corporate, Organic, Retro-Future, Luxury/Fashion, Playful/Startup, Data-Dense, Japanese Minimal, Glassmorphism, Neon Noir, Warm Artisan, Swiss/International, Vaporwave) plus a custom builder. Each locks in specific colors, fonts, mandatory techniques, forbidden patterns, and 3 aggressive tension zones.

**Creative Tension** — Controlled rule-breaking system with 5 tension levels (Scale Violence, Material Collision, Temporal Disruption, Dimensional Break, Interaction Shock). Each archetype has 3 specific tension techniques. 1-3 tensions per page, spaced apart.

**Emotional Arc** — 10 beat types (Hook, Tease, Reveal, Build, Peak, Breathe, Tension, Proof, Pivot, Close) with measurable parameters per beat. Archetype-specific arc templates and 6 transition techniques between beats. Invalid sequences auto-rejected.

**Anti-Slop Gate** — 35-point scoring across 7 categories (Colors, Typography, Layout, Depth & Polish, Motion, Creative Courage, UX Intelligence). Enforced during `/modulo:verify`. Score < 25 = fail. SOTD-ready: 30+. Additional penalties: missing signature element (-3), archetype forbidden pattern (-5), no creative tension (-5).

**Awwwards 4-Axis Scoring** — Design, Usability, Creativity, Content each scored /10. SOTD prediction: 8.0+ average, no dimension below 7.

**Wave System** — Wave 0: scaffold & tokens (references design-system-scaffold skill). Wave 1: shared UI (nav, footer, theme). Wave 2+: independent sections (parallel, max 4 per wave). Higher waves for dependent sections.

## Modifying This Plugin

When adding a new **skill**: create `skills/{skill-name}/SKILL.md` with trigger patterns and detailed guidance. Skills are auto-discovered by the plugin system.

When adding a new **agent**: create `agents/{agent-name}.md` with role, tools list, and protocol. Register it in `plugin.json` if needed.

When adding a new **command**: create `commands/{command-name}.md` with description, argument-hint, and numbered workflow steps.

After changes, bump the version in `.claude-plugin/plugin.json` and update `README.md`.
