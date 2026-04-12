---
name: pipeline-guidance
tier: core
description: "Canonical state-detection + next-command library. One source of truth for 'what /gen:* should run next' — shared by /gen:next, /gen:status, user-prompt hook, and command footers. Maps pipeline state to primary + alternatives + rationale + prereq."
triggers: ["next command", "what next", "pipeline state", "next action", "guidance", "routing", "suggest command"]
used_by: ["next", "status", "user-prompt hook", "build", "audit", "iterate", "start-project", "plan", "discuss"]
version: "3.0.0"
---

## Layer 1: Decision Guidance

### Why Pipeline Guidance

Users lose the pipeline thread. They finish `/gen:build`, don't know if they should `/gen:audit`, `/gen:iterate`, or `/gen:companion`. They paste errors without knowing `/gen:bugfix` exists. v2.x partially solved this (STATE.md + lost-user hook), but the logic was duplicated across commands and drifted.

This skill is the **single source of truth** for state→command mapping. Hook, `/gen:next`, `/gen:status`, and command footers all read the same rules. No drift.

### When to Use

- `/gen:next` entry point — user explicitly asks "what's next".
- `/gen:status` footer — render "Next Action" block.
- `user-prompt.mjs` hook — when lost-user signal fires, inject primary suggestion.
- Command footer — every pipeline-advancing command ends with a "Next Action" block sourced here.

### When NOT to Use

- Inside Claude's prose response for a technical question (overuse turns into noise).
- In commands that don't advance pipeline state (companion, dashboard, self-audit).

## Layer 2: State Detection

### State FSM

```
EMPTY (no .planning/genorah OR only template)
   │ /gen:start-project  [or /gen:migrate if .planning/modulo/ detected]
   ▼
DISCOVERY (PROJECT.md exists, BRAINSTORM.md absent)
   │ continue /gen:start-project
   ▼
RESEARCH (BRAINSTORM.md exists, DESIGN-DNA.md absent)
   │ continue /gen:start-project
   ▼
DNA_COMPLETE (DESIGN-DNA.md exists, MASTER-PLAN.md absent)
   │ /gen:plan  [or /gen:discuss to explore first]
   ▼
PLANNING_COMPLETE (MASTER-PLAN.md exists, no sections/*/SUMMARY.md)
   │ /gen:build
   ▼
EXECUTION_IN_PROGRESS (≥1 SUMMARY.md, < all sections complete)
   │ /gen:build --resume  [or /gen:bugfix {section} if failed]
   ▼
EXECUTION_COMPLETE (all sections COMPLETE, AUDIT-REPORT.md absent)
   │ /gen:audit
   ▼
AUDIT_BELOW_GATE (AUDIT-REPORT.md exists, score < target tier)
   │ /gen:iterate {lowest-scoring section}
   ▼
AUDIT_PASSED (score ≥ SOTD-Ready 200)
   │ /gen:export  [or /gen:iterate for optional polish, /gen:benchmark]
```

### State detection algorithm

Check in order (first match wins):

```
1. if !exists(.planning/genorah/) and !exists(.planning/modulo/): EMPTY
2. if exists(.planning/modulo/) and !exists(.planning/genorah/): EMPTY_LEGACY (migrate path)
3. if !exists(PROJECT.md):                                     EMPTY
4. if !exists(BRAINSTORM.md):                                  DISCOVERY
5. if !exists(DESIGN-DNA.md):                                  RESEARCH
6. if !exists(MASTER-PLAN.md):                                 DNA_COMPLETE
7. if !any(sections/*/SUMMARY.md):                             PLANNING_COMPLETE
8. if any(sections/*/STATUS: FAILED in SUMMARY.md):            EXECUTION_FAILED
9. if any(sections/*/SUMMARY.md has STATUS != COMPLETE):       EXECUTION_IN_PROGRESS
10. if !exists(audit/AUDIT-REPORT.md):                         EXECUTION_COMPLETE
11. parse AUDIT-REPORT.md for score:
      < 200:  AUDIT_BELOW_GATE
      ≥ 200:  AUDIT_PASSED
12. default:                                                   UNKNOWN (report state, suggest /gen:status -v)
```

### Off-path conditions (can be active in any state)

Checked after primary state detection, surfaced as "also consider":

- `.planning/genorah/GAP-FIX.md` exists → `/gen:build --resume` (polisher pending)
- `.planning/genorah/CONSISTENCY-AUDIT.md` has CRITICAL findings → polisher/iterate
- `.planning/genorah/.action-queue/` has entries → surface queued dashboard commands
- `.planning/genorah/refinement-queue/` has `status: pending` → `/gen:iterate --from-queue`
- CONTEXT.md contains "Next Wave Instructions" → follow CONTEXT's override

## Layer 2: Command Mapping Table

Canonical. Any guidance consumer reads from this table.

| State | Primary | Rationale | Prereq | Alternatives |
|-------|---------|-----------|--------|--------------|
| EMPTY | `/gen:start-project` | Begin a new Genorah project | none | — |
| EMPTY_LEGACY | `/gen:migrate` | Legacy .planning/modulo/ detected — migrate first | none | `/gen:start-project` fresh |
| DISCOVERY | `/gen:start-project` | Continue discovery (research + archetype) | PROJECT.md | `/gen:status -v` for detail |
| RESEARCH | `/gen:start-project` | Lock direction, generate DNA | BRAINSTORM.md | `/gen:discuss` to dig deeper on a direction |
| DNA_COMPLETE | `/gen:plan` | Sections, waves, emotional arc | DESIGN-DNA.md | `/gen:discuss` before planning; `/gen:benchmark` to set quality targets |
| PLANNING_COMPLETE | `/gen:build` | Wave-based implementation | MASTER-PLAN.md | `/gen:tournament {section}` for variants on hero beats; `/gen:companion` preview scaffold |
| EXECUTION_IN_PROGRESS | `/gen:build --resume` | Continue the current wave | ≥1 SUMMARY.md | `/gen:dashboard` for live view; `/gen:bugfix {section}` for failures |
| EXECUTION_FAILED | `/gen:bugfix {section}` | Diagnose and fix broken section | SUMMARY.md with FAILED | `/gen:discuss` to refine plan; `/gen:iterate` for redesign |
| EXECUTION_COMPLETE | `/gen:audit` | Score on 234-point gate | all sections COMPLETE | `/gen:iterate` polish first; `/gen:companion` visual review |
| AUDIT_BELOW_GATE | `/gen:iterate {lowest-scoring}` | Improve lowest category scores | AUDIT-REPORT.md | `/gen:tournament {section}`; `/gen:iterate --from-queue`; `/gen:benchmark` to reset targets |
| AUDIT_PASSED | `/gen:export` | Produce deliverables | score ≥ 200 | `/gen:iterate` final polish; `/gen:benchmark`; `/gen:sync-knowledge` |

### Off-path suggestions (always available, not tied to state)

| Trigger | Suggest | Why |
|---------|---------|-----|
| Dashboard action queue non-empty | `/gen:{queued command}` | User queued from dashboard |
| refinement-queue non-empty | `/gen:iterate --from-queue` | Interactive refinements pending |
| Plugin drift suspected | `/gen:self-audit` | Validate plugin itself |
| Obsidian vault configured + stale | `/gen:sync-knowledge` | Vault bidirectional sync |
| Client feedback received | `/gen:feedback` | Route feedback into DNA/quality loop |

## Layer 2: Output Format

All consumers render the same block format for consistency:

```markdown
⚡ NEXT ACTION

Primary: `/gen:{command}`
  {one-line rationale}

Prereq: {check} or "none"

Alternatives:
  - `/gen:{alt-1}` — {one-line why}
  - `/gen:{alt-2}` — {one-line why}
```

### Compact form (hook context additionalContext)

When injected via `user-prompt.mjs` additionalContext, use a single line:

```
Suggested next: `/gen:{command}` — {rationale} (alt: /gen:{alt-1})
```

### Verbose form (/gen:next command output, /gen:status footer)

Full block with time estimate + prereq + all alternatives.

## Layer 3: Integration Context

### Consumers

- **`commands/next.md`** — standalone entry point; prints full verbose block; accepts `--verbose` for extra context.
- **`commands/status.md`** — appends the block to its output (already has "Next Action Logic" table; this skill supersedes as canonical).
- **`.claude-plugin/hooks/user-prompt.mjs`** — injects compact form when `isLost` signal fires AND project state detected.
- **Command footers** — `build.md`, `audit.md`, `iterate.md`, `plan.md`, `start-project.md`, `discuss.md`, `export.md` end with a "## Next Action" section sourcing this table.

### Implementation notes

- **Idempotent**: same state input → same output every time. No randomness.
- **Read-only**: guidance never modifies project files; STATE.md updates are the command's responsibility.
- **Graceful**: if state detection returns UNKNOWN, suggest `/gen:status -v` for diagnostics.
- **Context-aware overrides**: if CONTEXT.md has explicit "Next Wave Instructions", those override the table (command authors hand-craft specific routing when they know more).

## Layer 4: Anti-Patterns

- ❌ **Duplicating the state table** — if `/gen:status` has its own mapping, and the hook has another, they will drift. One table, one truth.
- ❌ **Making suggestions without a prereq** — user runs `/gen:build` before `/gen:plan` exists → silent failure. Prereq check is mandatory.
- ❌ **Surfacing every off-path at every state** — noise. Show off-path only when trigger condition is actually present.
- ❌ **Ignoring CONTEXT.md overrides** — commands sometimes emit explicit "next" (e.g., build complete with failures → "run bugfix on 03-hero"). Honor those over the table.
- ❌ **Active-nudge hooks without telemetry** — proactive suggestions without knowing what the user has been doing = alert fatigue. v3.0 keeps suggestions passive + end-of-command only. Active mode defers to v3.1.
- ❌ **Suggesting /gen:start-project when .planning/modulo/ exists** — that's a legacy migration path; suggest /gen:migrate first.
