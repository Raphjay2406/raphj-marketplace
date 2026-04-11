---
description: Sync Genorah skills with Obsidian knowledge vault
argument-hint: "[direction: plugin-to-obsidian | obsidian-to-plugin | both]"
allowed-tools: Read, Write, Grep, Glob, Bash, mcp__plugin_gen_obsidian__*, mcp__plugin_gen_obsidian-fs__*
---

You are the Genorah Knowledge Sync orchestrator. You manage bidirectional synchronization between Genorah plugin skills and an Obsidian knowledge vault, enabling designers to curate and extend the knowledge base through Obsidian's graph-based editing.

## Command Behavior Contract

1. Detect vault path from configuration.
2. Execute sync in the specified direction.
3. Report sync results.
4. NEVER suggest next command -- the hook handles routing.

## Argument Parsing

Parse `$ARGUMENTS`:

| Argument | Description |
|----------|-------------|
| `plugin-to-obsidian` | Export plugin skills to Obsidian vault format |
| `obsidian-to-plugin` | Import modified Obsidian notes back to plugin skills |
| `both` | Bidirectional sync (newer wins) |

No argument defaults to `both`.

## Vault Detection

1. Check `.claude/genorah.local.md` for vault path configuration:
   ```yaml
   vault_path: /path/to/vault
   ```
2. If not configured, check common locations:
   - `~/Documents/Obsidian/Genorah`
   - `~/Obsidian/Genorah`
3. If no vault found: "No Obsidian vault configured. Add `vault_path: /path` to `.claude/genorah.local.md`." STOP.

## Plugin-to-Obsidian Sync

For each skill in `skills/*/SKILL.md`:

1. Parse YAML frontmatter (name, description, tier, triggers, version)
2. Transform to Obsidian note format:
   - Add Obsidian-compatible frontmatter with tags and aliases
   - Convert cross-skill references to `[[wiki-links]]`
   - Add Dataview-compatible metadata fields
   - Preserve 4-layer structure with Obsidian callouts
3. Write to vault at `{vault}/Skills/{tier}/{skill-name}.md`
4. Generate `{vault}/Skills/_Index.md` with Dataview queries:
   - Skills by tier
   - Skills by trigger
   - Recently modified skills

Transform mapping (must match actual SKILL.md layer names):
```
SKILL.md Layer 1 (Decision Guidance)  → > [!tip] Decision Guidance
SKILL.md Layer 2 (varies per skill)   → > [!example] Implementation Reference
SKILL.md Layer 3 (Integration Context)→ > [!info] Integration Context
SKILL.md Layer 4 (Anti-Patterns)      → > [!warning] Anti-Patterns
```

**IMPORTANT:** Layer 2 names vary across skills (e.g., "Vault Structures", "Award-Winning Examples", "Implementation Patterns"). Preserve the actual `## Layer 2:` heading text from each SKILL.md file as the callout title. Do NOT hardcode a single Layer 2 name.

## Obsidian-to-Plugin Sync

1. Scan vault `Skills/` directory for modified notes
2. Compare modification dates with plugin skill files
3. For each newer vault note:
   - Parse Obsidian format (callouts, wiki-links, Dataview fields)
   - Transform back to SKILL.md 4-layer format
   - Restore YAML frontmatter
   - Convert `[[wiki-links]]` back to cross-skill references
4. Write updated skill to `skills/{skill-name}/SKILL.md`
5. Report which skills were updated

## Bidirectional Sync (both)

1. Build modification date index for both sides
2. For each skill:
   - If plugin newer: sync plugin → obsidian
   - If vault newer: sync obsidian → plugin
   - If same: skip
3. Handle conflicts (both modified): present diff and ask user to choose

## Completion

```
Knowledge Sync Complete

Direction: [direction]
Skills synced: [N]
  Plugin → Obsidian: [count]
  Obsidian → Plugin: [count]
  Skipped (unchanged): [count]
  Conflicts: [count]

Vault: [path]
```

## Sync Implementation Details

### 1. Detect Vault Path

Read `.claude/genorah.local.md` and extract `vault_path`:

```yaml
vault_path: /path/to/obsidian/vault
obsidian_installed: true
vault_sync: auto
# Optional: explicit override for vault structure (auto-detected if omitted)
vault_root: /path/to/actual/.obsidian/parent   # If different from vault_path
graph_path_prefix: ""                           # "" if vault root IS vault_path, else "Subfolder/"
```

If `vault_path` is missing or the file does not exist, output: "Vault not configured. Add `vault_path: /path` to `.claude/genorah.local.md`." STOP.

Validate the path exists and is writable before proceeding. If the path does not exist, offer to create it.

**Auto-detect graph path prefix** if not explicitly set (see Step 4 of Plugin → Obsidian Direction below).

### 2. Plugin → Obsidian Direction

For each skill in `skills/*/SKILL.md`:

1. Read `SKILL.md` and parse YAML frontmatter (name, description, tier, triggers, version).
2. Transform frontmatter to Obsidian format:
   - Add `tags` array derived from tier and triggers.
   - Add `type: skill` field.
   - Preserve name, description, version.
3. Convert internal cross-skill references to `[[wiki-links]]`:
   - Pattern: `skills/{skill-name}/SKILL.md` → `[[{skill-name}]]`
4. Convert constraint tables to Dataview-queryable format:
   - Add inline Dataview fields: `parameter:: value`, `min:: value`, `max:: value`
   - Wrap constraint rows in callouts: `> [!info] Constraint: {parameter}`
5. Write transformed note to `{vault_path}/Knowledge/{tier}/{skill-name}.md`.
6. After all skills: output "N skills exported to Obsidian".

### 3. Obsidian → Plugin Direction

For each note in `{vault_path}/Knowledge/`:

1. Check file modification date vs corresponding `skills/{skill-name}/SKILL.md` modification date.
2. If Obsidian note is newer:
   - Read note and extract content (strip Obsidian callout wrappers, restore layer headings).
   - Convert `[[wiki-links]]` back to `skills/{skill-name}/SKILL.md` references.
   - Restore YAML frontmatter from Obsidian frontmatter (drop `tags`, `type`; restore original fields).
   - Conflict resolution rules:
     - Obsidian wins for prose content (layer body text).
     - Plugin wins for frontmatter fields and structural headings.
   - Write updated content to `skills/{skill-name}/SKILL.md`.
3. If plugin skill is newer or dates are equal: skip without modification.
4. After all notes: output "M skills imported from Obsidian, K conflicts resolved".

### 4. Both Direction

Run plugin → Obsidian first (step 2), then run Obsidian → plugin (step 3). The two-pass approach ensures the vault has the latest plugin content before checking for vault-side edits.

### 5. Graph Connectivity Pass (MANDATORY after every plugin→obsidian sync)

After writing all skill/command/agent notes, run the connectivity pass to ensure the Obsidian graph is fully linked:

**Step 1: Convert cross-references to wiki-links**

Scan every exported note for skill references in these formats and convert to `[[wiki-links]]`:
- `` `gen:skill-name` `` → `[[skill-name]]`
- `` `skill-name` `` in "Related Skills" list items → `[[skill-name]]`
- `**skill-name**` in list items → `[[skill-name]]`
- `` `/gen:command-name` `` → `[[command-name]]`

Only convert if the target filename exists in the vault. Never create broken links.

**Step 2: Add "See Also" to orphan nodes**

For any exported file that has zero outgoing `[[wiki-links]]`, append a `## See Also` section with 3-4 links to topically related skills based on:
- Same tier (core skills link to other core skills)
- Same category (UI patterns link to other UI patterns)
- Pipeline stage (build-time skills link to the builder agent)
- Always include `[[_Dashboard]]` as a fallback link

**Step 3: Verify zero orphan targets**

After all links are written, verify every file has at least one INCOMING link (another file links TO it). If any file has zero incoming links, add it to `_Dashboard.md` under the appropriate category section.

**Step 4: Detect vault structure (CRITICAL for path queries)**

Obsidian's `path:` queries are RELATIVE TO THE VAULT ROOT — the folder containing `.obsidian/`. This affects how color group queries must be constructed.

Determine the vault structure:

1. **Locate `.obsidian` directory** by searching `vault_path` and its parent directories
2. **The vault root is the directory containing `.obsidian/`**
3. **Calculate the path prefix**: relative path from vault root to where Genorah content was written

```
Case A — Vault root IS the Genorah folder:
  vault_path:    D:/Genorah/Genorah-Plugin
  .obsidian at:  D:/Genorah/Genorah-Plugin/.obsidian
  Genorah at:    D:/Genorah/Genorah-Plugin/Skills/, /Commands/, /Agents/
  → Path prefix: "" (empty)
  → Use: path:Skills/core, path:Commands, path:Agents/pipeline

Case B — Genorah is a SUBFOLDER of the vault:
  vault_path:    D:/Genorah/Genorah-Plugin
  .obsidian at:  D:/Genorah/.obsidian
  Genorah at:    D:/Genorah/Genorah-Plugin/Skills/, /Commands/, /Agents/
  → Path prefix: "Genorah-Plugin/"
  → Use: path:Genorah-Plugin/Skills/core, path:Genorah-Plugin/Commands
```

Detection algorithm (pseudocode):
```
let vaultRoot = vault_path
let prefix = ""

if not exists(vault_path + "/.obsidian"):
  // Walk up parent directories looking for .obsidian
  let current = vault_path
  while current != filesystem_root:
    let parent = dirname(current)
    if exists(parent + "/.obsidian"):
      vaultRoot = parent
      prefix = relativePath(parent, vault_path) + "/"
      break
    current = parent

// Use prefix in all path: queries
```

**Step 5: Write graph configuration**

Write/update the Obsidian graph config at `{vaultRoot}/.obsidian/graph.json` with color groups using the detected prefix:

**Note on `{prefix}` substitution:** Replace `{prefix}` with the auto-detected graph_path_prefix from Step 4. If empty (vault root IS the Genorah folder), queries become `path:Skills/core`. If `Genorah-Plugin/`, queries become `path:Genorah-Plugin/Skills/core`. The search filter `{prefixSearch}` becomes empty if no prefix needed, or `path:{prefix}` if Genorah is a subfolder.

```json
{
  "collapse-filter": false,
  "search": "{prefixSearch}",
  "showTags": false,
  "showAttachments": false,
  "hideUnresolved": true,
  "showOrphans": false,
  "collapse-color-groups": false,
  "colorGroups": [
    { "query": "path:{prefix}Skills/core", "color": { "a": 1, "rgb": 14423100 } },
    { "query": "path:{prefix}Skills/domain", "color": { "a": 1, "rgb": 5025616 } },
    { "query": "path:{prefix}Skills/utility", "color": { "a": 1, "rgb": 38655 } },
    { "query": "path:{prefix}Commands", "color": { "a": 1, "rgb": 16744448 } },
    { "query": "path:{prefix}Agents/pipeline", "color": { "a": 1, "rgb": 16711680 } },
    { "query": "path:{prefix}Agents/specialists", "color": { "a": 1, "rgb": 16711935 } },
    { "query": "path:{prefix}Agents/protocols", "color": { "a": 1, "rgb": 8388736 } },
    { "query": "file:_Dashboard", "color": { "a": 1, "rgb": 16776960 } }
  ],
  "collapse-display": false,
  "showArrow": true,
  "textFadeMultiplier": -0.5,
  "nodeSizeMultiplier": 1.2,
  "lineSizeMultiplier": 0.8,
  "collapse-forces": false,
  "centerStrength": 0.5,
  "repelStrength": 8,
  "linkStrength": 0.6,
  "linkDistance": 150,
  "scale": 1,
  "close": true
}
```

**Color group legend:**
| Color | RGB | Group |
|-------|-----|-------|
| Red-orange | 5046016 | Core Skills |
| Green | 34816 | Domain Skills |
| Blue-teal | 11141290 | Utility Skills |
| Orange | 16744448 | Commands |
| Red | 16711680 | Pipeline Agents |
| Magenta | 16711935 | Specialist Agents |
| Purple | 8388736 | Protocol Agents |
| Yellow | 16776960 | Dashboard (hub node) |

### 6. Generate Dashboard

Write/update `{vault_path}/_Dashboard.md` as the central hub linking to ALL nodes. Structure:

```markdown
## Quick Navigation
[links to key commands]

## Key Skills
[links to core and high-impact domain skills organized by category]

## Pipeline Agents / Specialist Agents / Protocol Agents
[links to all agents]

## Integrations / UI Patterns / Framework & Content
[links to ALL remaining skills ensuring zero orphan nodes]
```

The dashboard MUST link to every file that has zero other incoming links. This ensures the graph has no disconnected nodes.

### 7. Generate Skills Index

Write/update `{vault_path}/Skills/_Index.md` with Dataview queries using paths relative to vault root (e.g., `FROM "Skills/core"` or `FROM "Genorah-Plugin/Skills/core"` depending on vault structure).

## Rules

1. Never overwrite without checking modification dates.
2. Preserve all SKILL.md structural requirements (4-layer, YAML frontmatter).
3. Wiki-link conversion must be reversible.
4. Report every file changed for transparency.
5. NEVER suggest the next command. The hook handles routing.
