---
name: "obsidian-integration"
description: "Obsidian vault integration for project visualization and knowledge base browsing. Project vault with Dataview queries, knowledge base with wiki-links, and bidirectional sync protocol."
tier: "utility"
triggers: "obsidian, vault, knowledge base, sync, export, dataview"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- User mentions Obsidian, vault, or knowledge base -- set up or sync the project vault at `.planning/genorah/vault/`
- After `/gen:sync-knowledge` command -- trigger full bidirectional sync between project artifacts and vault
- After `/gen:export` command -- generate or refresh the vault from current project state
- `SessionStart` hook detects vault presence -- validate vault structure and surface any drift warnings
- User wants to query project state with Dataview -- ensure frontmatter and tags are Dataview-compatible
- Per-wave completion -- mirror build artifacts to vault after each wave closes

### When NOT to Use

- Obsidian is not installed and user has not configured a vault path -- everything works via `.planning/genorah/` markdown; no vault operations needed
- User wants to change design decisions or DNA tokens -- use the source-of-truth pipeline artifacts (DESIGN-DNA.md, CONTEXT.md); Obsidian is a view, not an editor
- User wants to store binary assets -- vault notes should reference image paths, not embed binary files

### Decision Tree

- If vault path is configured in `.claude/genorah.local.md`, use that path for the Knowledge Base vault
- If no vault path is configured, create only the Project Vault at `.planning/genorah/vault/`
- If both vaults exist, run bidirectional sync: Obsidian wins content edits, plugin wins structure and frontmatter
- If conflict detected (same note edited in both places), prompt user before overwriting
- If Obsidian is not installed, skip vault operations silently -- all planning artifacts remain readable as plain markdown

### Pipeline Connection

- **Referenced by:** builder agent after each wave to mirror section summaries
- **Referenced by:** reviewer agent to update quality scores in `quality/anti-slop-scores.md`
- **Consumed at:** `/gen:sync-knowledge` (full sync), `/gen:export` (vault generation from project)
- **SessionStart hook:** checks for vault presence and reports sync status

---

## Layer 2: Vault Structures

### Project Vault

Located at `.planning/genorah/vault/` inside the target project. Mirrors build state and is regenerated from pipeline artifacts. This vault is per-project and ephemeral -- it is a structured view, not a source of truth.

```
.planning/genorah/vault/
+-- 00-DNA.md                  <- DESIGN-DNA mirror with [[links]]
+-- 01-Brainstorm.md           <- creative directions with [[archetype]] links
+-- 02-Master-Plan.md          <- wave map with [[section]] links
+-- sections/
|   +-- 01-hero.md             <- PLAN + SUMMARY merged, status tags
|   +-- 02-features.md
|   +-- 03-social-proof.md
+-- decisions/
|   +-- archetype-choice.md
|   +-- palette-override.md
+-- quality/
|   +-- anti-slop-scores.md    <- Dataview-queryable score history
|   +-- awwwards-projection.md
|   +-- arc-map.md
+-- consistency/
|   +-- component-registry.md
+-- _index.md                  <- dashboard with Dataview tables
```

### Knowledge Base Vault

Located at the user-configured path in `.claude/genorah.local.md`. Global, persistent, cross-project reference library. Survives project deletion. Accumulates intelligence over time.

```
Knowledge/
+-- design-system/
|   +-- palettes/              <- individual palette notes (one per project/palette)
|   +-- font-pairings/         <- curated pairing notes with usage context
|   +-- archetypes/            <- 19 archetypes as notes with decision history
|   +-- industry-rules/        <- vertical-specific design constraints
+-- integrations/
|   +-- hubspot/
|   +-- stripe/
|   +-- shopify/
+-- ux-rules/
+-- ai-patterns/
+-- project-history/           <- cross-project intelligence; decisions, outcomes, retros
+-- _dashboard.md              <- global Dataview overview across all projects
```

### Configuration

Vault paths and behavior are configured in `.claude/genorah.local.md` inside the project. This file is gitignored and machine-local.

```markdown
## Obsidian Config

knowledge-base-path: /Users/name/Documents/Obsidian/Knowledge
obsidian-installed: true
vault-sync: auto          # auto | manual | off
```

If `obsidian-installed` is `false` or the key is absent, all vault operations are skipped silently. Planning artifacts in `.planning/genorah/` remain the working format and are always readable without Obsidian.

### _index.md Dashboard (Project Vault)

The `_index.md` file at the root of the project vault is auto-generated. It contains three Dataview queries for live project state.

**Section Status Table**

````markdown
```dataview
TABLE status, beat, wave, score
FROM "sections"
SORT wave ASC
```
````

**Quality Scores Table**

````markdown
```dataview
TABLE score, phase, reviewer
FROM "quality"
WHERE type = "anti-slop"
SORT date DESC
```
````

**Decisions Log**

````markdown
```dataview
LIST
FROM "decisions"
SORT file.mtime DESC
```
````

### Obsidian Note Frontmatter Format

Every note generated by the plugin uses this frontmatter structure to ensure Dataview compatibility:

```yaml
---
name: "Hero Section"
type: section        # section | decision | quality | dna | plan | archetype
status: built        # planned | in-progress | built | reviewed | blocked
beat: hook           # hook | tease | reveal | build | peak | breathe | tension | proof | pivot | close
wave: 2
score: 28
tags: [wave-2, beat-hook, status-built, score-28]
date: 2026-03-30
---
```

Omit fields that are not applicable. For example, `beat` and `wave` are irrelevant for `decision` notes.

### Tag Conventions

Tags follow a `category-value` pattern so Dataview can group and filter by axis:

| Tag Pattern | Examples | Used In |
|-------------|----------|---------|
| `#wave-N` | `#wave-0`, `#wave-2` | section notes |
| `#beat-X` | `#beat-hook`, `#beat-peak` | section notes |
| `#status-X` | `#status-built`, `#status-planned` | section notes |
| `#score-N` | `#score-28`, `#score-31` | quality notes |
| `#archetype-X` | `#archetype-brutalist` | brainstorm, decisions |

### Wiki-Link Conventions

Use wiki-links to create navigable relationships between notes:

- `[[section-name]]` -- links from plan/summary to its section note
- `[[archetype-name]]` -- links from brainstorm or DNA to the archetype note in Knowledge Base
- `[[decision-name]]` -- links from DNA or master plan to its decision rationale note
- `[[palette-name]]` -- links DNA color section to the palette note in Knowledge Base

---

### Sample Section Note (sections/01-hero.md)

A fully populated section note after Wave 2 build and review:

```markdown
---
name: "Hero Section"
type: section
status: built
beat: hook
wave: 2
score: 29
tags: [wave-2, beat-hook, status-built, score-29, archetype-neo-corporate]
date: 2026-03-28
reviewer: anti-slop-gate
---

# Hero Section

[[02-Master-Plan]] > Wave 2 > Section 01

## Implementation Summary

Full-viewport hero with kinetic headline split. Uses [[archetype-neo-corporate]] tension zone: scale
violence on the headline (clamp 4rem → 9vw), restrained body copy. Signature element: SVG noise
overlay at 4% opacity locks visual identity across all sections.

## Anti-Slop Gate Score: 29/35

| Category | Score | Notes |
|----------|-------|-------|
| Colors | 5/5 | Primary gradient + tension accent |
| Typography | 5/5 | Display font, scale violence applied |
| Layout | 4/5 | Asymmetric grid, -1 for missing offset column on mobile |
| Depth & Polish | 5/5 | Noise overlay, drop shadow layering |
| Motion | 4/5 | Entrance animation present, no scroll-linked motion |
| Creative Courage | 3/5 | One tension technique used |
| UX Intelligence | 3/5 | CTA accessible, contrast passes AA |

## Open Questions

- [ ] Confirm headline copy with client before Wave 3

## Links

[[00-DNA]] | [[decisions/archetype-choice]] | [[quality/anti-slop-scores]]
```

### Sync Protocol

**Plugin → Obsidian (export direction)**

Triggered after each wave or by `/gen:export`:

1. Read source artifact (e.g., `sections/hero/PLAN.md` + `sections/hero/SUMMARY.md`)
2. Merge content into a single Obsidian note with full frontmatter
3. Inject wiki-links for any referenced sections, archetypes, or decisions
4. Write to `.planning/genorah/vault/sections/01-hero.md`
5. Regenerate `_index.md` with fresh Dataview blocks

**Obsidian → Plugin (import direction)**

Triggered by `/gen:sync-knowledge` or `SessionStart` hook:

1. Check modification timestamps on all vault notes
2. For notes newer than their source artifact, read the note body
3. Strip frontmatter and wiki-link syntax to recover plain markdown
4. Write recovered content back to the source artifact
5. Preserve all machine-enforceable frontmatter fields -- never import values that override DNA locks

**Sync Trigger Matrix**

| Event | Direction | Scope |
|-------|-----------|-------|
| Wave N closes | Plugin → Obsidian | sections/, quality/ |
| `/gen:export` | Plugin → Obsidian | Full vault regeneration |
| `/gen:sync-knowledge` | Bidirectional | Full vault |
| `SessionStart` hook | Obsidian → Plugin | Drift detection only; no writes unless `vault-sync: auto` |
| Project closes | Plugin → Knowledge Base | Palette, archetype, retro notes |

**Project → Knowledge Base**

After project close or on explicit export:

1. Copy palette note to `Knowledge/design-system/palettes/{project-slug}.md`
2. Copy archetype decision note to `Knowledge/design-system/archetypes/{archetype-name}.md` (append, do not overwrite)
3. Append project retro to `Knowledge/project-history/{project-slug}.md`

**Conflict Resolution Rules**

| Field type | Winner | Rationale |
|------------|--------|-----------|
| Note body (prose, annotations) | Obsidian | Human edits are content edits |
| `status`, `wave`, `beat` frontmatter | Plugin | Machine-computed from build state |
| `score` frontmatter | Plugin | Anti-Slop Gate owns this value |
| DNA tokens, archetype locks | Plugin | Cannot be overridden via vault |
| `tags` array | Plugin | Regenerated from frontmatter values |

---

## Layer 3: Integration Context

### DNA Connection

The vault mirrors DNA tokens as prose references, not as editable config. DNA is locked by the pipeline; the vault displays it.

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--color-primary` | Referenced in `00-DNA.md` and `palettes/` note; displayed, not editable via vault |
| `--font-display` | Noted in `00-DNA.md` with pairing rationale; links to `font-pairings/` in Knowledge Base |
| `--motion-*` | Summarized in `00-DNA.md`; motion tokens are not exposed in Dataview queries |
| Signature element | Captured in `00-DNA.md` with description; referenced in section notes that implement it |

### Archetype Variants

Obsidian note structure does not change per archetype. Archetype identity affects only the content written into notes, not the schema.

| Archetype | Adaptation |
|-----------|-----------|
| Data-Dense | `quality/anti-slop-scores.md` includes additional Dataview columns for information density metrics |
| Brutalist | Decision notes include a `tension-override` field documenting which rule was broken and why |
| Luxury/Fashion | `font-pairings/` notes include editorial spacing rationale alongside the pairing |
| Dark Academia | Knowledge Base palette notes include reference library sources alongside color derivation |

### Pipeline Stage

- **Input from:** DESIGN-DNA.md, BRAINSTORM.md, MASTER-PLAN.md, sections/*/PLAN.md, sections/*/SUMMARY.md, STATE.md
- **Output to:** `.planning/genorah/vault/` (project vault) and user-configured Knowledge Base path

### Commands That Trigger This Skill

- `/gen:sync-knowledge` -- bidirectional sync between vault and planning artifacts
- `/gen:export` -- generate or refresh the entire project vault from current state
- `SessionStart` hook -- detect vault presence, report drift count, warn if vault is stale

### SessionStart Hook Behavior

When the `SessionStart` hook runs, this skill performs the following checks:

1. Read `.claude/genorah.local.md` -- detect `knowledge-base-path` and `obsidian-installed`
2. If vault exists at `.planning/genorah/vault/`, compare note modification times to source artifacts
3. Count notes where Obsidian is newer (drift count)
4. If drift count > 0 and `vault-sync: auto`, run import direction automatically
5. If drift count > 0 and `vault-sync: manual`, surface a warning: "Vault has N notes newer than source artifacts. Run /gen:sync-knowledge to import."
6. If vault does not exist, skip silently

The hook never blocks session start. Sync failures are warnings, not errors.

### Knowledge Base Note: Archetype Entry

When a project closes, the archetype note in the Knowledge Base is appended (not overwritten) with a project entry:

```markdown
## Project: Rosenstein Real Estate (2026-03)

**Archetype used:** Neo-Corporate
**Client vertical:** Real estate / luxury residential
**Tension override:** Scale violence on headline (rule broken: no display font above 5rem -- rationale: brand demanded editorial presence)
**Final Anti-Slop score:** 30/35 (SOTD-Ready)
**Outcome:** Client approved. Launch scheduled April 2026.

**Palette:** [[palettes/rosenstein-slate]]
**Retro:** [[project-history/rosenstein-real-estate]]
```

This accumulation pattern is what makes the Knowledge Base valuable over time: every project adds decision history to each archetype note, building a searchable record of what worked and why.

### Reference Sites

These sites demonstrate best-in-class use of structured markdown knowledge bases and Dataview-style project dashboards:

- **Obsidian Publish: Maggie Appleton** (maggieappleton.com) -- exemplary use of wiki-links and growing knowledge graph; annotation: bidirectional links surface unexpected connections across 300+ notes
- **Andy Matuschak's notes** (notes.andymatuschak.org) -- evergreen note structure with explicit status tracking; annotation: each note has a single clear concept and explicit links to related notes, no orphans
- **Notion Engineering Wiki** (internal) -- Dataview-equivalent table queries for project state; annotation: status fields in frontmatter enable dashboard views without manual maintenance

### Related Skills

- `design-dna` -- DNA tokens are the source data for `00-DNA.md`; this skill consumes DNA output
- `anti-slop-gate` -- scores written to `quality/anti-slop-scores.md`; Dataview queries surface score history
- `emotional-arc` -- arc beat assignments populate section note frontmatter (`beat` field)
- `design-archetypes` -- archetype choice feeds `01-Brainstorm.md` and `decisions/archetype-choice.md`

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Obsidian as Source of Truth

**What goes wrong:** User edits DNA tokens, archetype selections, or wave assignments directly in vault notes. Plugin overwrites on next sync, losing the edits. User loses trust in sync and stops using the vault.

**Instead:** Treat the vault as a read-optimized view. All structural decisions (DNA, archetype, waves, scores) are made via pipeline commands. Only prose content -- annotations, rationale, retro notes -- is safe to edit in Obsidian and will survive sync.

### Anti-Pattern: Non-Dataview-Compatible Frontmatter

**What goes wrong:** Notes use ad-hoc frontmatter keys or omit required fields. Dataview queries in `_index.md` return empty tables or errors. The dashboard becomes useless.

**Instead:** Every generated note must include `type`, `status`, and `tags` at minimum. Use the canonical frontmatter schema defined in Layer 2. Validate frontmatter fields against the schema before writing.

### Anti-Pattern: Manual Vault Editing Without Syncing Back

**What goes wrong:** Developer edits a section note in Obsidian to refine rationale, then runs `/gen:execute` for the next wave. The builder agent reads from `sections/hero/PLAN.md`, not the vault. The vault edit is never propagated. Vault and planning artifacts diverge silently.

**Instead:** Run `/gen:sync-knowledge` before any pipeline command that reads planning artifacts. The sync step checks modification timestamps and imports newer vault content back to source artifacts before the agent reads them.

### Anti-Pattern: Embedding Binary Files in Vault

**What goes wrong:** Screenshots, exported PNGs, or font files are copied into the vault directory. Obsidian sync tools or Git LFS conflicts appear. Vault size balloons. Plugin sync slows down.

**Instead:** Store only markdown files in the vault. Reference images by absolute or project-relative path (e.g., `![Hero screenshot](../../../public/screenshots/hero.png)`). Never copy binary assets into `.planning/genorah/vault/`.

### Anti-Pattern: Single Vault for Both Purposes

**What goes wrong:** User points the Knowledge Base path to the same directory as the project vault. Per-project ephemeral notes overwrite persistent cross-project knowledge. Archetype notes accumulate stale per-project frontmatter. The Knowledge Base loses its persistent value.

**Instead:** Keep the two vaults strictly separate. Project Vault lives inside the project at `.planning/genorah/vault/`. Knowledge Base lives at a user-configured path outside any single project, typically in a dedicated Obsidian vault directory.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Frontmatter `score` | 0 | 35 | points | HARD -- reject vault import if score outside range |
| Frontmatter `wave` | 0 | 9 | integer | HARD -- reject if wave number does not match STATE.md |
| Tags array length | 1 | 10 | tags | SOFT -- warn if no tags present |
| Note body length | 10 | 2000 | lines | SOFT -- warn if note exceeds 2000 lines (split recommended) |
| Vault sync interval | -- | -- | -- | SOFT -- warn if last sync was more than 3 waves ago |
