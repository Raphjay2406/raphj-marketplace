---
description: Export current project artifacts to Obsidian vault format
argument-hint: "[--full | --scores | --decisions]"
allowed-tools: Read, Write, Grep, Glob, mcp__plugin_gen_obsidian__*, mcp__plugin_gen_obsidian-fs__*
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

Each exported note uses the unified Obsidian frontmatter schema (matching the obsidian-integration skill spec). Include all applicable fields; omit fields that don't apply to the artifact type.

```yaml
---
name: [artifact or section name]
type: [section | decision | quality | dna | plan | archetype | context | state | content | design-system | master-plan | discussion]
status: [planned | in-progress | built | reviewed | blocked | active | complete]
beat: [hook | tease | reveal | build | peak | breathe | tension | proof | pivot | close]  # sections only
wave: [0-9]                    # sections only
score: [0-35]                  # quality-scored artifacts only
project: [project name from PROJECT.md]
exported: [ISO date]
tags: [genorah, type-tag, wave-N, beat-X, status-X]
date: [ISO date]
---
```

**Field rules:**
- `beat` and `wave`: Only on section notes (Plan.md, Summary.md)
- `score`: Only on quality-scored artifacts (section summaries, audit reports)
- `status`: Always present -- extracted from content or defaulted to `active`
- `tags`: Auto-generated from frontmatter values using `category-value` pattern (e.g., `#wave-2`, `#beat-hook`)

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

1. Add Dataview-compatible frontmatter at the top (using unified schema from Vault Note Format section above):
   ```yaml
   ---
   name: [artifact name]
   type: [context | state | design-dna | brainstorm | master-plan | content | decisions | design-system | section-plan | section-summary | section-gap-fix | section-consistency-fix]
   status: [extracted from content or "active"]
   project: [project name from PROJECT.md]
   exported: [ISO date]
   tags: [genorah, type-tag]
   date: [ISO date]
   ---
   ```
   For section artifacts, also include `beat`, `wave`, and `score` fields when available.
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

### 7. Graph Connectivity & Configuration (MANDATORY on --full export)

After writing all vault notes, run the graph setup protocol from the sync-knowledge command:

1. **Vault structure detection** (CRITICAL) -- Locate the `.obsidian/` directory by walking parent directories from `vault_path`. The vault root is the directory CONTAINING `.obsidian/`. Calculate `graph_path_prefix` as the relative path from vault root to where Genorah content was written. If vault root IS vault_path, prefix is `""`. Otherwise prefix is e.g. `"Genorah-Plugin/"`.
2. **Connectivity pass** -- Convert all cross-references (`gen:skill-name`, backtick-quoted skill names, bold skill names in lists) to `[[wiki-links]]`. Only convert when the target file exists.
3. **Orphan elimination** -- For files with zero outgoing links, add `## See Also` with 3-4 related skill links. For files with zero incoming links, add them to `_Dashboard.md`.
4. **Graph config** -- Write `{vaultRoot}/.obsidian/graph.json` with color groups using the DETECTED prefix in every `path:` query (e.g., `path:{prefix}Skills/core`). Without correct prefix, color groups match nothing. Set `hideUnresolved: true`, `showOrphans: false`, `showArrow: true`.
5. **Dashboard generation** -- Create/update `_Dashboard.md` linking to all skills, commands, and agents. Organized by category.
6. **Index generation** -- Create/update `Skills/_Index.md` with Dataview queries using the same path prefix (e.g., `FROM "{prefix}Skills/core"`).

This ensures every export produces a fully connected, color-coded, navigable Obsidian graph with zero floating nodes.

## Rules

1. Export is additive -- never modify source artifacts.
2. All wiki-links must point to valid vault paths.
3. Dataview fields must use correct inline syntax.
4. Preserve all original content -- vault format adds metadata, never removes content.
5. Graph connectivity pass is MANDATORY on `--full` export. Every node must be reachable from `_Dashboard`.
6. At completion, render the "⚡ NEXT ACTION" block sourced from `skills/pipeline-guidance/SKILL.md`. Export is terminal — primary is typically `/gen:sync-knowledge` (push learnings to KB vault) or `/gen:benchmark` (competitive positioning). Offer a note that the project is shippable.
