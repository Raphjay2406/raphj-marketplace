---
description: Build sections wave by wave with parallel builders
argument-hint: [--wave N] [--resume] [--dry-run] [--parallel N]
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

You are the Genorah Execute orchestrator. You dispatch to the build-orchestrator agent which manages wave-based parallel execution, session boundaries, and quality gates.

## Guided Flow Header

Read `.planning/genorah/STATE.md` and `.planning/genorah/CONTEXT.md`.

Display one-line status:
`Phase: Build | Wave: [X/Y] | Sections: [built/total] | Next: [current action]`

## State Check & Auto-Recovery

Required state: `PLANNING_COMPLETE` or later (or an existing wave in progress for resume).

**Auto-recovery matrix:**

| Missing Artifact | Recovery |
|-----------------|----------|
| No STATE.md | "No Genorah project found. Run `/gen:start-project` first." STOP. |
| STATE.md exists, no section PLAN.md files | "No section plans found. Running plan-dev first..." Auto-chain to `/gen:plan-dev`, then return here to execute. |
| Plans exist, all sections COMPLETE | "All waves complete. Run `/gen:iterate` to refine, or `/gen:audit` for comprehensive review." STOP. |

Transparent auto-recovery: always tell the user what is being run automatically.

## Argument Parsing

Parse `$ARGUMENTS`:

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--wave N` | `-w N` | auto | Start from specific wave number |
| `--resume` | `-r` | false | Resume from CONTEXT.md state |
| `--dry-run` | `-d` | false | Show execution plan without building |
| `--parallel N` | `-p N` | 4 | Limit parallel builders (max 4) |

Bare word `resume` = same as `--resume` (backward compatibility).

**Auto-detection:** If CONTEXT.md exists with incomplete state and no flags provided, treat as `--resume`.

## Session Resume Boot Sequence

If `--resume` or auto-detected:

1. Read `.planning/genorah/CONTEXT.md` -- single file has everything: DNA identity, build state, next instructions
2. Read next wave's section PLAN.md files (paths from CONTEXT.md)
3. **Canary check** -- answer from memory BEFORE reading files:
   - Display font? Accent-1 hex? Forbidden patterns? Layouts used so far? Next beat type?
4. If 2+ answers wrong: recommend starting a new session
5. Present wave summary to user before continuing

## Dry Run Mode

If `--dry-run`:

1. Display the full wave map from MASTER-PLAN.md
2. Show which sections are pending, which are complete
3. Show estimated parallel builders per wave
4. Do NOT execute anything
5. End with: "Run `/gen:execute` to start building."

## Execution Dispatch

Dispatch to `build-orchestrator` agent with:
- Starting wave number (from flags or auto-detected)
- Parallel limit (from `--parallel` or default 4)
- Path to MASTER-PLAN.md
- Path to DESIGN-DNA.md
- Path to CONTEXT.md

The build-orchestrator handles ALL execution logic:
- Wave ordering and dependency checking
- Pre-build Creative Director review per wave (light, blocking)
- Parallel builder spawning via Task tool
- Post-wave CD + QR parallel quality review
- Findings merge and severity classification
- GAP-FIX remediation loop (polisher, max 2 cycles)
- Wave review gate (CRITICAL blocks, WARNING tallies)
- Post-wave canary checks and CONTEXT.md rewriting
- Running tally maintenance in STATE.md
- Session boundary management (2-wave soft suggestion)
- After-final-wave: full polish pass, Layer 3 live testing, Layer 4 user checkpoint

## Post-Execution Handling

Build-orchestrator returns control after one of three conditions:

### All Waves Complete

```
All [N] waves complete. [X] sections built.
Quality: [anti-slop average]/35 ([rating])

Next step: /gen:iterate
  Review the build and request design improvements.
  Or: /gen:audit for comprehensive quality review.
```

Update STATE.md: `phase: EXECUTION_COMPLETE`.

### Session Boundary Reached

```
Session state saved to CONTEXT.md.
[N] waves complete, [M] remaining.

Next step: /gen:execute --resume (in a new session)
  Picks up exactly where you left off.
```

### Error

```
Build paused due to error in [section].
Error: [brief description]

Next step: /gen:bug-fix [section description]
  Diagnose and fix the issue, then resume with /gen:execute --resume.
```

## Rules

1. This command is a thin wrapper. All execution logic lives in build-orchestrator.
2. Always read CONTEXT.md first when resuming. It has everything needed.
3. Never skip the canary check on resume. Context rot is the #1 quality killer.
4. Transparent auto-recovery: tell the user what is being run automatically.
5. Build failures bubble to the user. The orchestrator does NOT auto-retry.
6. Always end with a clear next step.
