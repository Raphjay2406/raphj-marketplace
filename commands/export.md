---
description: Export current project artifacts — deliverables, design tokens, and build artifacts.
argument-hint: "[--full | --scores | --decisions]"
allowed-tools: Read, Write, Grep, Glob
---

You are the Genorah Export orchestrator. You package project planning artifacts into portable deliverables — design tokens, audit data, decision records, and build artifacts — ready for handoff or archiving.

Knowledge lives in the graphify graph (`gen:graphify`), not a vault.

## Command Behavior Contract

1. Read `.planning/genorah/STATE.md` and `.planning/genorah/CONTEXT.md` FIRST.
2. Execute export in the specified mode.
3. Report results.
4. NEVER suggest next command -- the hook handles routing.

## Argument Parsing

Parse `$ARGUMENTS`:

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--full` | `-f` | true | Export all project artifacts |
| `--scores` | `-s` | false | Export only audit scores and quality data |
| `--decisions` | `-d` | false | Export only decision artifacts (discussions, brainstorm, DNA) |

No arguments = `--full`.

## State Check

Read `.planning/genorah/` directory. If no artifacts exist:
  "No Genorah artifacts to export. Run start-project first."
  STOP.

## Full Export

Copy and package each artifact into `.planning/genorah/export/`:

### Core Artifacts
| Source | Export Path | Treatment |
|--------|------------|-----------|
| `PROJECT.md` | `export/Project-Brief.md` | As-is |
| `DESIGN-DNA.md` | `export/Design-DNA.md` | As-is; also emit `export/design-tokens.json` |
| `BRAINSTORM.md` | `export/Creative-Direction.md` | As-is |
| `CONTENT.md` | `export/Content-Plan.md` | As-is |
| `MASTER-PLAN.md` | `export/Master-Plan.md` | As-is |
| `CONTEXT.md` | `export/Context-Snapshot.md` | Timestamped copy |
| `STATE.md` | `export/State.md` | As-is |
| `DESIGN-SYSTEM.md` | `export/Design-System.md` | As-is; also emit `export/component-registry.json` |

### Design Tokens Export

Extract all CSS custom properties from `DESIGN-DNA.md` and write `export/design-tokens.json` in W3C Design Token format:

```json
{
  "color": {
    "bg": { "$value": "#…", "$type": "color" },
    "surface": { "$value": "#…", "$type": "color" }
  },
  "font": {
    "display": { "$value": "…", "$type": "fontFamily" },
    "body":    { "$value": "…", "$type": "fontFamily" }
  }
}
```

### Section Artifacts
For each section in `.planning/genorah/sections/*/`:
| Source | Export Path |
|--------|------------|
| `PLAN.md` | `export/sections/{section-name}/Plan.md` |
| `SUMMARY.md` | `export/sections/{section-name}/Summary.md` |
| `GAP-FIX.md` | `export/sections/{section-name}/Gap-Fix.md` |
| `CONSISTENCY-FIX.md` | `export/sections/{section-name}/Consistency-Fix.md` |

### Discussion Artifacts
For each `DISCUSSION-{phase}.md`:
  → `export/discussions/{phase}.md`

### Audit Artifacts
| Source | Export Path |
|--------|-----------|
| `audit/AUDIT-REPORT.md` | `export/quality/Audit-Report.md` |
| `audit/FIX-PLAN.md` | `export/quality/Fix-Plan.md` |

## Scores Export (--scores)

Export only quality-related artifacts:
- `audit/AUDIT-REPORT.md` → `export/quality/Audit-Report.md`
- `audit/FIX-PLAN.md` → `export/quality/Fix-Plan.md`
- Per-section quality data from SUMMARY.md files → `export/quality/Section-Scores.md`

## Decisions Export (--decisions)

Export only decision artifacts:
- `BRAINSTORM.md` → `export/decisions/Creative-Direction.md`
- `DESIGN-DNA.md` → `export/decisions/Design-DNA.md`
- All `DISCUSSION-{phase}.md` → `export/decisions/{phase}-Discussion.md`

## Completion

```
Export complete.

Artifacts exported: [N]
Export location: .planning/genorah/export/
Design tokens: .planning/genorah/export/design-tokens.json

Mode: [full | scores | decisions]
```

## Export Implementation Details

### 1. Read All Artifacts

Read the following files from `.planning/genorah/` (skip silently if a file does not exist):

- `CONTEXT.md`
- `STATE.md`
- `DESIGN-DNA.md`
- `BRAINSTORM.md`
- `MASTER-PLAN.md`
- `CONTENT.md`
- `DECISIONS.md`
- `DESIGN-SYSTEM.md`

### 2. Read All Section Artifacts

Glob `.planning/genorah/sections/*/` and for each section directory read:

- `PLAN.md`
- `SUMMARY.md`
- `GAP-FIX.md`
- `CONSISTENCY-FIX.md`

### 3. Write to Export Directory

Write all artifacts to `.planning/genorah/export/` following the path map in the **Full Export** section above.

### 4. Emit Design Tokens

Parse `DESIGN-DNA.md` for all CSS custom property declarations. Emit `export/design-tokens.json` in W3C Design Token format (see Design Tokens Export above).

### 5. Mode Behavior

| Mode | Action |
|------|--------|
| `--full` | Run steps 1–4: export all artifacts, all sections, emit design tokens |
| `--scores` | Scope to `audit/` artifacts and per-section SUMMARY.md quality data only; write to `export/quality/` |
| `--decisions` | Scope to BRAINSTORM.md, DESIGN-DNA.md, and all DISCUSSION-{phase}.md files only; write to `export/decisions/` |

## Rules

1. Export is additive — never modify source artifacts.
2. Preserve all original content — export adds structure, never removes content.
3. At completion, render the "⚡ NEXT ACTION" block sourced from `skills/pipeline-guidance/SKILL.md`. Export is terminal — primary is typically `/gen:benchmark` (competitive positioning) or `/gen:sync-knowledge` (refresh graphify graph). Offer a note that the project is shippable.
