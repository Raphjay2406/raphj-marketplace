# Plan 5: Obsidian + Audit + Release

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Obsidian integration, audit all 78 existing skills for stale references, update documentation, and prepare v2.0.0 for marketplace release.

**Architecture:** Obsidian sync is document-based (markdown transformation). Skill audit is bulk grep+sed. Release is version bump + final validation.

**Tech Stack:** Markdown, Bash (grep/sed for audit)

**Spec:** `docs/superpowers/specs/2026-03-30-genorah-v2-design.md` Sections 15-17

**Depends on:** Plans 1-4 must all be complete

---

## File Map

### Obsidian Integration
- `commands/sync-knowledge.md` (already created in Plan 2 -- enhance content)
- `commands/export.md` (already created in Plan 2 -- enhance content)
- `skills/obsidian-integration/SKILL.md` (NEW: vault templates, Dataview queries)

### Skill Audit
- All 78 existing skills in `skills/*/SKILL.md` -- check for stale references

### Documentation
- `CLAUDE.md` -- final pass
- `README.md` -- final pass
- `SKILL-DIRECTORY.md` -- update with new skills

### Release
- `.claude-plugin/plugin.json` -- version 2.0.0
- `.claude-plugin/marketplace.json` -- version 2.0.0

---

### Task 1: Create Obsidian integration skill

**Files:**
- Create: `skills/obsidian-integration/SKILL.md`

- [ ] **Step 1: Write Obsidian integration skill**

Contents:
- Two vaults: Project Vault (.planning/genorah/vault/) and Knowledge Base (user-configured)
- Project vault structure: 00-DNA.md, 01-Brainstorm.md, 02-Master-Plan.md, sections/, decisions/, quality/, consistency/, _index.md
- Knowledge base structure: design-system/, integrations/, ux-rules/, ai-patterns/, project-history/
- Wiki-link conventions for cross-references
- Tag conventions: #wave-N, #beat-hook, #status-built, #score-N, #archetype-X
- Dataview query examples for project dashboard
- Sync direction: pipeline writes -> vault mirrors
- Conflict resolution: Obsidian wins content, plugin wins structure
- Configuration: vault path in .claude/genorah.local.md

- [ ] **Step 2: Commit**
```bash
git add skills/obsidian-integration/SKILL.md
git commit -m "feat: add obsidian-integration skill (vault templates, sync protocol)"
```

---

### Task 2: Enhance sync-knowledge and export commands

**Files:**
- Modify: `commands/sync-knowledge.md`
- Modify: `commands/export.md`

- [ ] **Step 1: Add detailed workflow to sync-knowledge**

Workflow steps:
1. Read vault path from .claude/genorah.local.md
2. Direction 1 (plugin -> Obsidian): for each skill, transform YAML frontmatter + prose to Obsidian note with wiki-links and tags
3. Direction 2 (Obsidian -> plugin): check modification dates, import newer Obsidian edits
4. Report: N skills synced, M conflicts resolved

- [ ] **Step 2: Add detailed workflow to export**

Workflow steps:
1. Read all .planning/genorah/ artifacts
2. Transform to vault notes with [[links]], tags, Dataview-queryable frontmatter
3. Write to .planning/genorah/vault/
4. Generate _index.md dashboard with Dataview tables

- [ ] **Step 3: Commit**
```bash
git add commands/sync-knowledge.md commands/export.md
git commit -m "feat: enhance sync-knowledge and export with detailed workflows"
```

---

### Task 3: Audit existing skills -- stale command references

**Files:**
- Modify: All 78 skills in `skills/*/SKILL.md`

- [ ] **Step 1: Find all stale /modulo: references**
```bash
grep -r "/modulo:" skills/ --include="*.md" -l
```

- [ ] **Step 2: Replace with /gen:**
```bash
find skills/ -name "*.md" | xargs sed -i 's/\/modulo:/\/gen:/g'
```

- [ ] **Step 3: Verify no remaining stale commands**
```bash
grep -r "/modulo:" skills/ --include="*.md" -l
```
Expected: No results

- [ ] **Step 4: Commit**
```bash
git add skills/
git commit -m "fix: replace /modulo: with /gen: across all 78 skills"
```

---

### Task 4: Audit existing skills -- stale artifact references

**Files:**
- Modify: All skills referencing artifact paths

- [ ] **Step 1: Find stale .planning/modulo references**
```bash
grep -r "\.planning/modulo" skills/ --include="*.md" -l
```

- [ ] **Step 2: Replace with .planning/genorah**
```bash
find skills/ -name "*.md" | xargs sed -i 's/\.planning\/modulo/\.planning\/genorah/g'
```

- [ ] **Step 3: Find stale artifact file references (gap-fix variants)**
```bash
grep -ri "gap-fix\b\|gaps\.md\|gap_fix" skills/ --include="*.md" -l | head -20
```

- [ ] **Step 4: Standardize to GAP-FIX.md**
```bash
find skills/ -name "*.md" | xargs sed -i 's/gap-fix\.md/GAP-FIX.md/gi; s/gaps\.md/GAP-FIX.md/gi'
```

- [ ] **Step 5: Verify**
```bash
grep -r "\.planning/modulo" skills/ --include="*.md" -l
```
Expected: No results

- [ ] **Step 6: Commit**
```bash
git add skills/
git commit -m "fix: standardize artifact paths and names across all skills"
```

---

### Task 5: Audit existing skills -- stale Modulo name references

**Files:**
- Modify: Skills that reference "Modulo" by name

- [ ] **Step 1: Find remaining Modulo references**
```bash
grep -r "\bModulo\b\|\bmodulo\b" skills/ --include="*.md" -l | grep -v "docs/superpowers"
```

- [ ] **Step 2: Replace with Genorah**
```bash
find skills/ -name "*.md" | xargs sed -i 's/\bModulo\b/Genorah/g; s/\bmodulo\b/genorah/g'
```

- [ ] **Step 3: Commit**
```bash
git add skills/
git commit -m "fix: replace Modulo references with Genorah in all skills"
```

---

### Task 6: Audit existing skills -- stale agent references

**Files:**
- Modify: Skills that reference old agent names

- [ ] **Step 1: Find old agent name references**
```bash
grep -r "build-orchestrator\|section-builder\|section-planner" skills/ --include="*.md" -l
```

- [ ] **Step 2: Replace with new names**
```bash
find skills/ -name "*.md" | xargs sed -i 's/build-orchestrator/orchestrator/g; s/section-builder/builder/g; s/section-planner/planner/g'
```

- [ ] **Step 3: Find old command name references**
```bash
grep -r "lets-discuss\|plan-dev\|bug-fix\b" skills/ --include="*.md" -l
```

- [ ] **Step 4: Replace**
```bash
find skills/ -name "*.md" | xargs sed -i 's/lets-discuss/discuss/g; s/plan-dev/plan/g; s/\bbug-fix\b/bugfix/g'
```

- [ ] **Step 5: Commit**
```bash
git add skills/
git commit -m "fix: update agent and command name references in all skills"
```

---

### Task 7: Update SKILL-DIRECTORY.md

**Files:**
- Modify: `skills/SKILL-DIRECTORY.md`

- [ ] **Step 1: Add all new skills to the directory**

Add entries for:
- ux-intelligence (core tier)
- quality-gate-v2 (core tier)
- baked-in-defaults (core tier)
- component-consistency (core tier)
- hubspot-integration (domain tier)
- stripe-integration (domain tier)
- shopify-integration (domain tier)
- woocommerce-integration (domain tier)
- propstack-integration (domain tier)
- ai-ui-patterns (domain tier)
- ai-pipeline-features (domain tier)
- ai-ui-components (domain tier)
- visual-companion-screens (utility tier)
- obsidian-integration (utility tier)
- data/palettes (data catalog)
- data/font-pairings (data catalog)
- data/chart-types (data catalog)
- data/industry-rules (data catalog)

Update total count.

- [ ] **Step 2: Commit**
```bash
git add skills/SKILL-DIRECTORY.md
git commit -m "docs: update SKILL-DIRECTORY with all new v2 skills"
```

---

### Task 8: Final documentation pass

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`

- [ ] **Step 1: Final CLAUDE.md review**

Verify:
- Project name is Genorah throughout
- All 11 commands listed with /gen: prefix
- 15 agents listed (7 pipeline + 4 specialists + 4 protocols)
- 4 hooks documented
- 72-point quality gate referenced
- 90+ skills count
- Visual companion documented
- Integration skills listed
- Workflow chain uses /gen: commands

- [ ] **Step 2: Final README.md review**

Verify:
- Installation instructions use correct repo URL
- Plugin table shows genorah with accurate counts
- No remaining modulo references

- [ ] **Step 3: Commit**
```bash
git add CLAUDE.md README.md
git commit -m "docs: final documentation pass for v2.0.0"
```

---

### Task 9: Version bump to 2.0.0

**Files:**
- Modify: `.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Update plugin.json version**

Change `"version": "2.0.0-dev"` to `"version": "2.0.0"`

- [ ] **Step 2: Update marketplace.json version**

Change version to `"2.0.0"` in the genorah plugin entry.

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/plugin.json .claude-plugin/marketplace.json
git commit -m "chore: bump version to 2.0.0 for release"
```

---

### Task 10: Full validation pass

- [ ] **Step 1: Zero stale modulo references (excluding specs/plans)**
```bash
grep -r "modulo" --include="*.md" --include="*.sh" --include="*.mjs" --include="*.json" --include="*.cjs" . | grep -v ".git/" | grep -v "docs/superpowers/" | grep -v "node_modules/" | wc -l
```
Expected: 0

- [ ] **Step 2: All hooks execute cleanly**
```bash
echo '{}' | node .claude-plugin/hooks/session-start.mjs > /dev/null && echo "OK"
echo '{"tool_name":"Write","tool_input":{},"session_id":"t"}' | node .claude-plugin/hooks/pre-tool-use.mjs > /dev/null && echo "OK"
echo '{"user_message":"hi"}' | node .claude-plugin/hooks/user-prompt.mjs > /dev/null && echo "OK"
```
Expected: 3x OK

- [ ] **Step 3: All new skill directories exist with SKILL.md**
```bash
for dir in ux-intelligence quality-gate-v2 baked-in-defaults component-consistency hubspot-integration stripe-integration shopify-integration woocommerce-integration propstack-integration ai-ui-patterns ai-pipeline-features ai-ui-components visual-companion-screens obsidian-integration; do
  test -f "skills/$dir/SKILL.md" && echo "$dir: OK" || echo "$dir: MISSING"
done
```
Expected: All OK

- [ ] **Step 4: Data catalogs exist**
```bash
for f in palettes.md font-pairings.md chart-types.md industry-rules.md; do
  test -f "skills/data/$f" && echo "$f: OK" || echo "$f: MISSING"
done
```
Expected: All OK

- [ ] **Step 5: Command count**
```bash
ls commands/*.md | wc -l
```
Expected: 11

- [ ] **Step 6: Agent count**
```bash
find agents/ -name "*.md" -not -path "*/protocols/*" | wc -l
```
Expected: 12 (7 pipeline + 4 specialists + 1 figma-translator)

- [ ] **Step 7: Plugin version is 2.0.0**
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')).version)"
```
Expected: `2.0.0`

- [ ] **Step 8: Final commit**
```bash
git add -A
git commit -m "chore: genorah v2.0.0 -- full validation pass complete"
```

---

## Plan 5 Summary

10 tasks delivering:
- Obsidian integration skill
- Enhanced sync/export commands
- Full 78-skill audit (stale commands, artifacts, names, agent references)
- Updated SKILL-DIRECTORY
- Final documentation pass
- Version bump to 2.0.0
- Full validation

**Genorah v2.0.0 is ready for marketplace release.**
