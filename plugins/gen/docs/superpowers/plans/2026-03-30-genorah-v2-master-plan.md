# Genorah v2.0 — Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete ground-up redesign of the Modulo plugin (v1.5.0), rebranded as Genorah v2.0 with `/gen:*` commands, Claude platform modernization, 72-point quality gate, visual companion, 5 integration skills, AI UI features, and Obsidian integration.

**Architecture:** Markdown-only plugin with hook scripts (.mjs/.sh) and a zero-dependency localhost server (.cjs). No application code, no build system, no test suite. Validation is structural (file exists, frontmatter valid, references consistent).

**Tech Stack:** Markdown, YAML frontmatter, Node.js (hooks + server), Bash (startup/shutdown scripts)

**Spec:** `docs/superpowers/specs/2026-03-30-genorah-v2-design.md`

---

## Plan Decomposition

| Sub-Plan | Name | File | Depends On |
|----------|------|------|------------|
| 1 | Foundation & Infrastructure | `2026-03-30-genorah-v2-plan-1-foundation.md` | None |
| 2 | Pipeline Core | `2026-03-30-genorah-v2-plan-2-pipeline.md` | Plan 1 |
| 3 | Quality & Design Intelligence | `2026-03-30-genorah-v2-plan-3-quality.md` | Plan 1 |
| 4 | Content Expansion | `2026-03-30-genorah-v2-plan-4-content.md` | Plan 1 |
| 5 | Obsidian + Audit + Release | `2026-03-30-genorah-v2-plan-5-release.md` | Plans 1-4 |

**Plans 2, 3, 4 can run in parallel** after Plan 1 completes. Plan 5 runs last.

```
Plan 1 (Foundation)
  |
  +---> Plan 2 (Pipeline)  ---|
  +---> Plan 3 (Quality)   ---+--> Plan 5 (Release)
  +---> Plan 4 (Content)   ---|
```

---

## Execution Strategy

### For each sub-plan:
1. Create a feature branch: `git checkout -b genorah-v2/plan-N-name`
2. Execute tasks sequentially within the plan
3. Commit after each task
4. Merge to `genorah-v2` integration branch when plan completes

### Validation approach (no test suite):
Since this is a markdown-only plugin, validation is:
- **Structural:** File exists at expected path, has correct frontmatter
- **Reference consistency:** `grep` for stale references (`modulo`, old artifact names)
- **Hook scripts:** Manual test by running with sample input JSON

---

## What Each Plan Delivers

### Plan 1: Foundation & Infrastructure (~25 tasks)
- Rebrand: modulo -> genorah everywhere
- Plugin manifest update (plugin.json, marketplace.json)
- 4 hook files (session-start.mjs, pre-tool-use.mjs, user-prompt.mjs, enhanced dna-compliance-check.sh)
- Visual companion server (server.cjs, start-server.sh, stop-server.sh, frame-template.html, helper.js)
- Visual companion protocol document
- CLAUDE.md update
- Deliverable: Plugin loads as "genorah", hooks fire, companion server starts

### Plan 2: Pipeline Core (~20 tasks)
- 7 rewritten pipeline agents (orchestrator, builder, creative-director, quality-reviewer, planner, researcher, polisher)
- 1 new specialist agent (ai-ui-specialist)
- 3 updated specialist agents (3d, animation, content)
- 4 updated protocol documents
- 8 rewritten pipeline commands + 3 new utility commands
- Deliverable: Full `/gen:*` command pipeline works end-to-end

### Plan 3: Quality & Design Intelligence (~12 tasks)
- UX Intelligence skill (12 domains, ~1200 lines)
- Quality gate upgrade in quality-reviewer agent (72-point, already done in Plan 2 agent rewrite — this plan writes the standalone skill reference)
- Baked-in defaults integration (motion/responsive/compat templates for planner)
- Component consistency enforcement rules
- Deliverable: Quality gate scores 72 points, every PLAN.md has motion/responsive/compat blocks

### Plan 4: Content Expansion (~18 tasks)
- 4 data catalog files (palettes, fonts, charts, industry rules)
- 5 integration skills (HubSpot, Stripe, Shopify, WooCommerce, Propstack)
- 3 AI UI skills (patterns, pipeline features, components)
- Performance/optimization skill enhancement
- Visual companion screen templates
- Deliverable: All new skills loadable, catalogs browsable

### Plan 5: Obsidian + Audit + Release (~15 tasks)
- Obsidian sync command + export command
- 78 existing skills audit (stale reference cleanup)
- README.md rewrite
- marketplace.json update
- Version bump to v2.0.0
- Final validation pass
- Deliverable: v2.0.0 ready for marketplace release
