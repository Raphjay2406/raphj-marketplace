---
name: design-workflow
description: "Reference for the Modulo design workflow. Covers the 5-command flow, wave-based execution, PLAN.md format, STATE.md format, SUMMARY.md format, checkpoint protocol, commit conventions, session continuity, and agent coordination."
---

Use this skill when referencing the design workflow, understanding project phases, working with planning files, or coordinating the build process. Triggers on: design workflow, project phases, design process, modulo workflow, planning structure, design pipeline, build process, section planning, wave execution, session continuity.

You are a workflow expert for the Modulo design system. You understand every command, every file format, every wave rule, and every coordination pattern.

## Command Flow

```
/modulo:start-design → /modulo:plan-sections → /modulo:execute → /modulo:verify → /modulo:iterate
```

| Command | Purpose | Input | Output |
|---------|---------|-------|--------|
| `start-design` | Discovery + Research + Brainstorm | User requirements | PROJECT.md, research/SUMMARY.md, BRAINSTORM.md, STATE.md |
| `plan-sections` | Section plans with wave assignments | BRAINSTORM.md | Section PLAN.md files, MASTER-PLAN.md |
| `execute` | Wave-based parallel implementation | PLAN.md files | Built components, SUMMARY.md per section |
| `verify` | Three-level goal-backward verification | Built components + PLAN.md | Verification report, GAP-FIX.md |
| `iterate` | Targeted fixes from verify or user feedback | GAP-FIX.md or user input | Updated components |
| `change-plan` | Modify plans with wave recalculation | User changes | Updated PLAN.md files |
| `bugfix` | Scientific hypothesis-test-fix cycle | Bug description | Minimal targeted fix |

## Wave Assignment Rules

| Wave | Purpose | Rule |
|------|---------|------|
| **0** | Scaffold & tokens | Tailwind config, CSS variables, layout wrapper, utilities |
| **1** | Shared UI | Navigation, footer, theme provider — things many sections import |
| **2+** | Independent sections | Sections that only depend on wave 0/1 |
| **Higher** | Dependent sections | Sections depending on other section outputs |

**Constraints:**
- Max 4 sections per wave (parallel builder limit)
- Sections in the same wave MUST be independent of each other
- A section's wave = max(wave of its dependencies) + 1

## Planning Directory Structure

```
.planning/modulo/
├── PROJECT.md                # Discovery output
├── BRAINSTORM.md             # Creative directions + chosen direction
├── MASTER-PLAN.md            # Wave map + dependency graph + file structure
├── STATE.md                  # Current phase, wave, section statuses (<100 lines)
├── .continue-here.md         # Session resumption context (created on pause)
├── research/                 # Parallel researcher outputs
│   ├── DESIGN-TRENDS.md
│   ├── REFERENCE-ANALYSIS.md
│   ├── COMPONENT-LIBRARY.md
│   ├── ANIMATION-TECHNIQUES.md
│   └── SUMMARY.md            # Synthesized research findings
└── sections/
    ├── 00-shared/
    │   ├── PLAN.md            # GSD frontmatter + structured tasks
    │   └── SUMMARY.md         # Machine-readable completion summary
    ├── 01-hero/
    │   ├── PLAN.md
    │   ├── SUMMARY.md
    │   └── GAP-FIX.md         # Created by /verify if gaps found
    └── ...
```

## STATE.md Format (<100 lines, machine-readable)

```markdown
# Modulo Design State

## Current Phase
phase: [BRAINSTORM_COMPLETE | PLANNING_COMPLETE | EXECUTING | EXECUTION_COMPLETE | VERIFIED]
current_wave: [number]
last_updated: [ISO date]

## Project
direction: [chosen direction name]
platform: [desktop-first | mobile-first]
total_sections: [N]
total_waves: [N]

## Completed Phases
- [x] Discovery — PROJECT.md
- [x] Research — SUMMARY.md
- [x] Brainstorm — Direction: [name]
- [x] Section Planning — [N] sections, [N] waves
- [ ] Execution
- [ ] Verification

## Section Status
| Section | Wave | Status | Notes |
|---------|------|--------|-------|
| 00-shared | 0 | COMPLETE | — |
| 01-hero | 2 | IN_PROGRESS | Builder active |
| 02-features | 2 | PENDING | — |

## Recent Decisions
- [date]: [decision]

## Next Action
[what to do next]
```

## PLAN.md Format (GSD frontmatter + structured body)

See the `plan-format` skill for the complete specification.

**Frontmatter:**
```yaml
---
section: XX-name
wave: [number]
depends_on: [section names]
files_modified: [file paths]
autonomous: true
must_haves:
  truths: [assertions]
  artifacts: [file paths]
  key_links: [reference files]
---
```

**Body sections:** `<objective>`, `<context>`, `<tasks>`, `<verification>`, `<success_criteria>`

## SUMMARY.md Format (machine-readable frontmatter)

```yaml
---
section: XX-name
status: complete
subsystem: [e.g., landing-page]
tags: [categories]
provides: [exports for other sections]
affects: [shared files modified]
key_files: [file paths]
key_decisions: [decisions with rationale]
duration: [time/turns]
---
```

## Checkpoint Types

| Type | Behavior |
|------|----------|
| `[auto]` | Builder executes autonomously |
| `[checkpoint:human-verify]` | Builder pauses, describes output, waits for user approval |
| `[checkpoint:decision]` | Builder presents options, waits for user choice |
| `[checkpoint:human-action]` | Builder needs user to do something (provide asset, etc.) |

## Commit Conventions

| Prefix | When | Example |
|--------|------|---------|
| `feat(section-XX)` | New section task completed | `feat(section-02-hero): create hero with gradient mesh` |
| `fix(section-XX)` | Bug fix via `/modulo:bugfix` | `fix(section-02-hero): fix mobile overflow` |
| `refactor(section-XX)` | Iteration via `/modulo:iterate` | `refactor(section-02-hero): improve animation timing` |

## Session Continuity

When a session ends mid-execution, `.continue-here.md` is written:

```markdown
# Continue Here

## Session ended during
wave: [N]
date: [ISO date]

## Completed this session
- [list]

## In progress
- [section]: [what remains]

## Resume instructions
[Specific steps to resume]
```

Resume with: `/modulo:execute resume`

## Agent Coordination

### Team Structure
```
start-design command
├── design-researcher (DESIGN-TRENDS)
├── design-researcher (REFERENCE-ANALYSIS)
├── design-researcher (COMPONENT-LIBRARY)
└── design-researcher (ANIMATION-TECHNIQUES)

execute command → design-lead (orchestrator)
├── section-builder (wave N sections, max 4 parallel)
├── section-builder (...)
└── ...

verify command → quality-reviewer
```

### Agent Roles
| Agent | Role | Key Behavior |
|-------|------|-------------|
| `design-researcher` | Research one track | Writes to research/{TRACK}.md |
| `design-lead` | Wave orchestrator | Reads STATE.md first, spawns builders, updates state |
| `section-builder` | Build one section | Follows PLAN.md tasks, pauses at checkpoints, writes SUMMARY.md |
| `quality-reviewer` | Three-level verifier | Goal-backward checking, creates GAP-FIX.md |
