---
description: "Preview the next recommended /gen:* command for the current pipeline state — primary + alternatives + rationale + prereq."
argument-hint: "[--verbose]"
allowed-tools: Read, Grep, Glob
---

# /gen:next

Show the canonical next action based on pipeline state. Read-only. Does not modify files. Sources its logic from `skills/pipeline-guidance/SKILL.md` — same table used by `/gen:status`, `user-prompt.mjs` hook, and command footers.

## Workflow

### 1. Detect pipeline state

Follow `skills/pipeline-guidance` Layer 2 state detection algorithm in order:

1. Check `.planning/genorah/` existence.
2. Check `.planning/modulo/` (legacy migration path).
3. Walk the artifact checks (PROJECT.md → BRAINSTORM.md → DESIGN-DNA.md → MASTER-PLAN.md → sections/ → AUDIT-REPORT.md).
4. Parse section SUMMARY.md files for STATUS.
5. Parse AUDIT-REPORT.md for score.

Return one of: EMPTY, EMPTY_LEGACY, DISCOVERY, RESEARCH, DNA_COMPLETE, PLANNING_COMPLETE, EXECUTION_IN_PROGRESS, EXECUTION_FAILED, EXECUTION_COMPLETE, AUDIT_BELOW_GATE, AUDIT_PASSED, UNKNOWN.

### 2. Check off-path triggers

After state detection, inspect:

- `.planning/genorah/GAP-FIX.md` → polisher pending
- `.planning/genorah/CONSISTENCY-AUDIT.md` → CRITICAL findings
- `.planning/genorah/.action-queue/` → queued dashboard actions
- `.planning/genorah/refinement-queue/` → pending interactive refinements
- `.planning/genorah/CONTEXT.md` "Next Wave Instructions" section — if present, this OVERRIDES the state-based primary

### 3. Render output

**Default (no --verbose):**

```
⚡ NEXT ACTION

Primary: /gen:{command}
  {one-line rationale}

Prereq: {check} or "none"

Alternatives:
  - /gen:{alt-1} — {why}
  - /gen:{alt-2} — {why}
```

**With --verbose:**

Add:
- Current state name (e.g., "State: EXECUTION_COMPLETE")
- Expected time estimate (from command frontmatter if present)
- Off-path triggers if any fired
- Full CONTEXT.md "Next Wave Instructions" excerpt if overriding

### 4. Example outputs

**Fresh clone:**
```
⚡ NEXT ACTION

Primary: /gen:start-project
  Begin a new Genorah project — discovery, research, archetype, DNA.

Prereq: none

Alternatives:
  — (no project exists yet)
```

**Mid-build with failed section:**
```
⚡ NEXT ACTION

Primary: /gen:bugfix 03-hero
  Section 03-hero failed to build — diagnose root cause first.

Prereq: sections/03-hero/SUMMARY.md status=FAILED

Alternatives:
  - /gen:build --resume — skip 03-hero and continue wave (not recommended)
  - /gen:discuss — refine plan before re-building
  - /gen:iterate 03-hero — brainstorm redesign instead of bugfix
```

**Audit passed, shippable:**
```
⚡ NEXT ACTION

Primary: /gen:export
  All sections built, audit passed (score 212/234, SOTD-Ready). Produce deliverables.

Prereq: AUDIT-REPORT.md score ≥ 200

Alternatives:
  - /gen:iterate — optional final polish on remaining gap categories
  - /gen:benchmark — score against curated SOTD library for competitive positioning
  - /gen:sync-knowledge — push project learnings to Obsidian KB
```

## Notes

- If state is UNKNOWN (detection returns no match), suggest `/gen:status -v` for diagnostics rather than guessing.
- When CONTEXT.md overrides, include a "(overrides default state routing)" note so the user knows this is command-authored, not state-inferred.
- Read-only. Never writes to STATE.md, DECISIONS.md, or any project file.
