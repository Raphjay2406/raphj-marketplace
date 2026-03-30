---
description: Export current project artifacts to Obsidian vault format
argument-hint: "[--full | --scores | --decisions]"
allowed-tools: Read, Write, Grep, Glob
---

You are the Genorah Export orchestrator. You transform project planning artifacts into Obsidian vault format with wiki-links, Dataview metadata, and an index dashboard -- enabling project knowledge to live in a connected graph.

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

Transform each artifact to Obsidian vault format and write to `.planning/genorah/vault/`:

### Core Artifacts
| Source | Vault Path | Treatment |
|--------|-----------|-----------|
| `PROJECT.md` | `vault/Project/Project-Brief.md` | Add frontmatter, link to DNA and Brainstorm |
| `DESIGN-DNA.md` | `vault/Design/Design-DNA.md` | Add color swatches as callouts, link to archetype |
| `BRAINSTORM.md` | `vault/Design/Creative-Direction.md` | Link to archetype skill, cross-ref tensions |
| `CONTENT.md` | `vault/Content/Content-Plan.md` | Link to sections that consume each content block |
| `MASTER-PLAN.md` | `vault/Build/Master-Plan.md` | Add Dataview task queries per wave |
| `CONTEXT.md` | `vault/Build/Context-Snapshot.md` | Timestamp and link to current wave |
| `STATE.md` | `vault/Build/State.md` | Dataview status fields |
| `DESIGN-SYSTEM.md` | `vault/Design/Design-System.md` | Token tables with color previews |

### Section Artifacts
For each section in `.planning/genorah/sections/*/`:
| Source | Vault Path |
|--------|-----------|
| `PLAN.md` | `vault/Sections/{section-name}/Plan.md` |
| `SUMMARY.md` | `vault/Sections/{section-name}/Summary.md` |
| `GAP-FIX.md` | `vault/Sections/{section-name}/Gap-Fix.md` |
| `CONSISTENCY-FIX.md` | `vault/Sections/{section-name}/Consistency-Fix.md` |

### Discussion Artifacts
For each `DISCUSSION-{phase}.md`:
  → `vault/Discussions/{phase}.md` with links to adopted features and sections

### Audit Artifacts
| Source | Vault Path |
|--------|-----------|
| `audit/AUDIT-REPORT.md` | `vault/Quality/Audit-Report.md` |
| `audit/FIX-PLAN.md` | `vault/Quality/Fix-Plan.md` |

## Vault Note Format

Each exported note includes:

```yaml
---
project: [project name from PROJECT.md]
created: [ISO date]
exported: [ISO date]
type: [artifact type]
tags: [genorah, artifact-type, phase]
---
```

Body transformations:
- Cross-reference other artifacts with `[[wiki-links]]`
- Add Dataview inline fields where appropriate: `status:: complete`, `score:: 28/35`
- Use Obsidian callouts for structured data: `> [!info]`, `> [!warning]`
- Preserve all original content -- transformation is additive, not lossy

## Scores Export (--scores)

Export only quality-related artifacts:
- `audit/AUDIT-REPORT.md` → `vault/Quality/Audit-Report.md`
- `audit/FIX-PLAN.md` → `vault/Quality/Fix-Plan.md`
- Per-section quality data from SUMMARY.md files → `vault/Quality/Section-Scores.md`

## Decisions Export (--decisions)

Export only decision artifacts:
- `BRAINSTORM.md` → `vault/Decisions/Creative-Direction.md`
- `DESIGN-DNA.md` → `vault/Decisions/Design-DNA.md`
- All `DISCUSSION-{phase}.md` → `vault/Decisions/{phase}-Discussion.md`

## Index Dashboard

Generate `vault/_index.md`:

```markdown
---
tags: [genorah, dashboard]
---

# [Project Name] - Genorah Dashboard

## Project Overview
- **Phase:** `= this.phase`
- **Archetype:** [[Design-DNA#Archetype]]
- **Quality:** `= [[Audit-Report]].score`

## Artifacts
```dataview
TABLE type, status, file.mtime as "Modified"
FROM "vault"
SORT file.mtime DESC
```

## Sections
```dataview
TABLE wave, beat, status, score
FROM "vault/Sections"
SORT wave ASC
```

## Quality History
```dataview
TABLE score, tier, date
FROM "vault/Quality"
SORT date DESC
```

## Decisions
```dataview
LIST
FROM "vault/Decisions"
SORT file.ctime DESC
```
```

## Completion

```
Export complete.

Artifacts exported: [N]
Vault location: .planning/genorah/vault/
Dashboard: .planning/genorah/vault/_index.md

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

### 3. Transform Each Artifact

For every artifact read above, apply these transformations before writing:

1. Add Dataview-compatible frontmatter at the top:
   ```yaml
   ---
   name: [artifact name]
   type: [context | state | design-dna | brainstorm | master-plan | content | decisions | design-system | section-plan | section-summary | section-gap-fix | section-consistency-fix]
   status: [extracted from content or "active"]
   tags: [genorah, artifact-type]
   ---
   ```
2. Convert cross-artifact references to `[[wiki-links]]`:
   - Any reference to another artifact filename (e.g. `DESIGN-DNA.md`) becomes `[[Design-DNA]]`.
   - Section names used in MASTER-PLAN become `[[Sections/{section-name}/Plan]]`.
3. Add `#tag` annotations inline where relevant:
   - Quality scores: append `#quality` to score lines.
   - Decisions: append `#decision` to lines that record a resolved choice.
   - Warnings or blockers: append `#blocker`.

### 4. Write to Vault

Write all transformed artifacts to `.planning/genorah/vault/` following the path map in the **Full Export** section above.

### 5. Generate `_index.md` Dashboard

Write `.planning/genorah/vault/_index.md` with the following Dataview blocks:

**Sections table** (name, status, beat, score):
```dataview
TABLE status, beat, score
FROM "vault/Sections"
SORT file.name ASC
```

**Quality scores table**:
```dataview
TABLE score, tier, date
FROM "vault/Quality"
SORT date DESC
```

**Decisions list**:
```dataview
LIST
FROM "vault/Decisions"
SORT file.ctime DESC
```

### 6. Mode Behavior

| Mode | Action |
|------|--------|
| `--full` | Run steps 1–5: export all artifacts, all sections, generate dashboard |
| `--scores` | Run steps 1–5 scoped to `audit/` artifacts and per-section SUMMARY.md quality data only; write to `vault/Quality/` |
| `--decisions` | Run steps 1–5 scoped to BRAINSTORM.md, DESIGN-DNA.md, and all DISCUSSION-{phase}.md files only; write to `vault/Decisions/` |

## Rules

1. Export is additive -- never modify source artifacts.
2. All wiki-links must point to valid vault paths.
3. Dataview fields must use correct inline syntax.
4. Preserve all original content -- vault format adds metadata, never removes content.
5. NEVER suggest the next command. The hook handles routing.
