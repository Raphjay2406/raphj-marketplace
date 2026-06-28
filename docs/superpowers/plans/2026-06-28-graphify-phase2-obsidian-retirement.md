# Graphify Memory Layer — Phase 2 (Obsidian Retirement) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire Obsidian from the live runtime surface — delete the core integration outright, repurpose `/gen:sync-knowledge` into graphify sync, scrub incidental mentions — so graphify (shipped in Phase 1) is the sole knowledge/recall surface, locked by a regression test.

**Architecture:** Mechanical removal + doc rewrites across `.mcp.json`, two session hooks, ~6 commands, ~10 skills, and `CLAUDE.md`. The core pieces (the two Obsidian MCP servers, the `obsidian-integration` skill, the session-start vault-drift block, the vault-sync command behavior) are deleted/replaced; incidental one-line mentions are scrubbed. A `no-obsidian-refs` test over the runtime surface drives completeness. The memory write path and Phase-1 graphify layer are untouched.

**Tech Stack:** Node ESM (`.mjs`), `node:test`, `globby` (already a dependency), markdown.

## Global Constraints

- The two retirement decisions are locked: **delete Obsidian outright** (do not leave deprecated stubs) and **repurpose `/gen:sync-knowledge`** into graphify sync (`graphify update .` + cross-project `graphify merge-graphs`).
- "Obsidian" must not remain (case-insensitive) in the **runtime surface**: `.claude-plugin/.mcp.json`, `.claude-plugin/hooks/*.{mjs,sh}`, `commands/**/*.md`, `skills/**/*.md`, `agents/**/*.md`, `CLAUDE.md`. It MAY remain in `docs/**` (historical changelogs + the graphify design spec that describes the removal) and in `.superpowers/`, `node_modules/`, git history.
- Session hooks are LOAD-BEARING — remove ONLY the Obsidian/vault-specific blocks; every other responsibility (CONTEXT.md load, MCP availability report, METRICS, journal emit, next-action routing) must keep working. After each hook edit: `node --check` + a stdin smoke that still prints valid hook output and exits 0.
- No version bump in this phase (the 4.3.0 bump lands in Phase 3). Mirror sync still runs.
- Replacing a vault behavior with a graphify behavior must degrade silently when graphify is absent (reuse Phase 1's `capability`/`recall` patterns; never throw into a hook).
- Mirror: every edited/deleted file must be reflected in `plugins/gen/` via `npm run sync-mirror`; `npm run check-mirror` green (final task).

---

## File Structure (the removal/rewrite surface)

| File(s) | Action |
|---------|--------|
| `.claude-plugin/.mcp.json` | delete `obsidian` + `obsidian-fs` entries |
| `skills/obsidian-integration/SKILL.md` | **delete the file** |
| `skills/cross-project-kb/SKILL.md` | repoint lesson storage/retrieval to ledgers + graph; drop vault |
| `skills/sqlite-vec-memory-graph`, `context-fabric-ledger`, `quality-learning` SKILL.md | scrub Obsidian references in memory skills |
| `.claude-plugin/hooks/session-start.mjs` | remove vault-drift detection block |
| `.claude-plugin/hooks/session-end.mjs` | replace Obsidian KB nudge with a graphify update note |
| `.claude-plugin/hooks/user-prompt.mjs` | reroute "sync vault" keywords to `gen:graphify` |
| `commands/sync-knowledge.md` | repurpose to graphify sync |
| `commands/export.md` | drop Obsidian-vault format conversion; keep artifact export |
| `commands/dashboard.md`, `next.md`, `tutorial.md`, `graphify.md` | scrub Obsidian mentions (graphify.md: reword "Obsidian" → "legacy knowledge-vault") |
| `skills/SKILL-DIRECTORY.md`, `pipeline-guidance`, `client-review-workflow`, `git-workflow`, `motion-health` SKILL.md | scrub incidental mentions |
| `.claude/genorah.local.md` | replace `vault_path`/`obsidian_installed`/`vault_sync` with graphify config |
| `CLAUDE.md` | remove the Obsidian Integration section; update MCP table |
| `tests/no-obsidian-refs.test.mjs` | regression guard (completeness driver) |

---

## Task 1: Remove the Obsidian MCP servers

**Files:**
- Modify: `.claude-plugin/.mcp.json`
- Test: `tests/no-obsidian-refs.test.mjs` (start the file here, scoped to `.mcp.json`)

**Interfaces:**
- Produces: a `.mcp.json` with no `obsidian` or `obsidian-fs` entries, valid JSON, all other servers intact.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/no-obsidian-refs.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

test('.mcp.json declares no obsidian servers', () => {
  const mcp = JSON.parse(readFileSync('.claude-plugin/.mcp.json', 'utf8'));
  assert.ok(!('obsidian' in mcp), 'obsidian entry must be removed');
  assert.ok(!('obsidian-fs' in mcp), 'obsidian-fs entry must be removed');
  // the other servers survive
  assert.ok('gpt-image' in mcp && 'graphify' in mcp, 'non-obsidian servers must remain');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/no-obsidian-refs.test.mjs`
Expected: FAIL — `obsidian entry must be removed`

- [ ] **Step 3: Edit `.claude-plugin/.mcp.json`**

Delete the two top-level entries `"obsidian": { … }` (≈ lines 2–12) and `"obsidian-fs": { … }` (≈ lines 13–21) entirely. Leave `gpt-image`, `stitch`, `playwright`, `chrome-devtools`, `next-devtools`, `3dsvg-export`, `flux-kontext`, `recraft`, and `graphify` untouched. Ensure the resulting JSON is valid (no leading comma on the now-first `gpt-image` entry).

- [ ] **Step 4: Run test + lint**

Run:
```bash
node --test tests/no-obsidian-refs.test.mjs
npm run lint:json
```
Expected: test PASS; `lint:json` reports `.mcp.json` valid.

- [ ] **Step 5: Commit**

```bash
git add .claude-plugin/.mcp.json tests/no-obsidian-refs.test.mjs
git commit -m "feat(graphify): remove obsidian + obsidian-fs MCP servers"
```

---

## Task 2: Delete/repoint the memory skills

**Files:**
- Delete: `skills/obsidian-integration/SKILL.md`
- Modify: `skills/cross-project-kb/SKILL.md`, `skills/sqlite-vec-memory-graph/SKILL.md`, `skills/context-fabric-ledger/SKILL.md`, `skills/quality-learning/SKILL.md`
- Test: `tests/no-obsidian-refs.test.mjs` (extend)

**Interfaces:**
- Produces: no Obsidian references in any `skills/{obsidian-integration,cross-project-kb,sqlite-vec-memory-graph,context-fabric-ledger,quality-learning}` path; `cross-project-kb` lessons now described as ledger/graph-backed.

- [ ] **Step 1: Extend the failing test**

```javascript
// tests/no-obsidian-refs.test.mjs (append)
import { globby } from 'globby';
import { existsSync } from 'node:fs';

test('obsidian-integration skill is deleted', () => {
  assert.equal(existsSync('skills/obsidian-integration/SKILL.md'), false);
});

test('memory skills carry no obsidian references', async () => {
  const files = await globby([
    'skills/cross-project-kb/SKILL.md',
    'skills/sqlite-vec-memory-graph/SKILL.md',
    'skills/context-fabric-ledger/SKILL.md',
    'skills/quality-learning/SKILL.md',
  ]);
  const offenders = files.filter(f => /obsidian/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `obsidian refs remain in: ${offenders.join(', ')}`);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/no-obsidian-refs.test.mjs`
Expected: FAIL — the skill still exists / refs remain.

- [ ] **Step 3: Delete + scrub**

- `git rm skills/obsidian-integration/SKILL.md` (delete the whole skill).
- In `skills/cross-project-kb/SKILL.md`: replace every description of lessons living in the Obsidian vault (e.g. "lessons live in `vault/lessons/...`", the two-vault sync prose) with the ledger/graph model: lessons are appended as markdown under `.planning/genorah/lessons/` and indexed by graphify (queryable via `recall()` / `gen:graphify query`). Remove the Dataview/vault frontmatter prose. Keep the lesson SCHEMA and the at-completion extraction trigger.
- In `skills/sqlite-vec-memory-graph/SKILL.md`, `skills/context-fabric-ledger/SKILL.md`, `skills/quality-learning/SKILL.md`: remove the sentences/bullets that reference Obsidian (vault export, vault sync, "mirror to Obsidian"). Re-point any "knowledge surface" phrasing to the graphify graph. Do not delete the skills' core content.

Find the exact mentions first: `grep -niE "obsidian|vault" skills/cross-project-kb/SKILL.md skills/sqlite-vec-memory-graph/SKILL.md skills/context-fabric-ledger/SKILL.md skills/quality-learning/SKILL.md`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/no-obsidian-refs.test.mjs`
Expected: PASS (the memory-skills + deletion tests; `.mcp.json` test still green).

- [ ] **Step 5: Commit**

```bash
git add -A skills tests/no-obsidian-refs.test.mjs
git commit -m "feat(graphify): delete obsidian-integration skill; repoint memory skills to graph/ledgers"
```

---

## Task 3: Session hooks — remove vault behavior

**Files:**
- Modify: `.claude-plugin/hooks/session-start.mjs`, `.claude-plugin/hooks/session-end.mjs`, `.claude-plugin/hooks/user-prompt.mjs`
- Test: `tests/no-obsidian-refs.test.mjs` (extend)

**Interfaces:**
- Produces: hooks with zero Obsidian/vault-drift code; all other hook behavior intact; each hook still `node --check`-clean and no-ops on a smoke input.

- [ ] **Step 1: Extend the failing test**

```javascript
// tests/no-obsidian-refs.test.mjs (append)
test('session hooks carry no obsidian references', async () => {
  const files = await globby(['.claude-plugin/hooks/*.mjs', '.claude-plugin/hooks/*.sh']);
  const offenders = files.filter(f => /obsidian/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `obsidian refs remain in hooks: ${offenders.join(', ')}`);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/no-obsidian-refs.test.mjs`
Expected: FAIL — `session-start.mjs`, `user-prompt.mjs` still reference obsidian.

- [ ] **Step 3: Surgical hook edits**

Read each hook first. Remove ONLY the Obsidian/vault blocks:

- `session-start.mjs`: delete the vault-drift block (reads `.claude/genorah.local.md` `vault_path`/`vault_sync`/`obsidian_installed`, detects `.planning/genorah/vault/`, compares `_index.md` mtime vs `STATE.md`, injects vault status). Keep CONTEXT.md loading, MCP-availability reporting, legacy-project migration, and the additional-context emit. If a `vault`-status string was concatenated into the additional context, remove just that segment.
- `session-end.mjs`: replace the Obsidian KB-accumulation nudge (the "run `/gen:export --full` to accumulate to Knowledge Base" prompt on project completion) with a graphify line: on completion, suggest `gen:graphify update` + cross-project `graphify merge-graphs` to refresh the graph. Keep SESSION-LOG.md writing and all other behavior.
- `user-prompt.mjs`: change the keyword router so "sync vault"/"obsidian" prompts route to `gen:graphify` instead of `/gen:sync-knowledge`-as-vault-sync. (The command still exists but is now graphify sync — Task 4.)

- [ ] **Step 4: Verify hooks still work**

Run:
```bash
node --check .claude-plugin/hooks/session-start.mjs
node --check .claude-plugin/hooks/session-end.mjs
node --check .claude-plugin/hooks/user-prompt.mjs
echo '{"hook_event_name":"SessionStart","session_id":"t"}' | node .claude-plugin/hooks/session-start.mjs
echo '{"prompt":"hello"}' | node .claude-plugin/hooks/user-prompt.mjs
node --test tests/no-obsidian-refs.test.mjs
```
Expected: all `node --check` pass; the two hook smokes print valid output (JSON or `{}`) and exit 0 without throwing; the test passes.

- [ ] **Step 5: Commit**

```bash
git add .claude-plugin/hooks tests/no-obsidian-refs.test.mjs
git commit -m "feat(graphify): strip vault-drift + KB-nudge from session hooks; reroute to gen:graphify"
```

---

## Task 4: Commands — repurpose sync-knowledge, gut export, scrub the rest

**Files:**
- Modify: `commands/sync-knowledge.md`, `commands/export.md`, `commands/dashboard.md`, `commands/next.md`, `commands/tutorial.md`, `commands/graphify.md`
- Test: `tests/no-obsidian-refs.test.mjs` (extend)

**Interfaces:**
- Produces: no Obsidian references in `commands/**`; `sync-knowledge` now documents graphify sync.

- [ ] **Step 1: Extend the failing test**

```javascript
// tests/no-obsidian-refs.test.mjs (append)
test('commands carry no obsidian references', async () => {
  const files = await globby(['commands/**/*.md']);
  const offenders = files.filter(f => /obsidian/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `obsidian refs remain in commands: ${offenders.join(', ')}`);
});

test('sync-knowledge documents graphify sync', () => {
  const t = readFileSync('commands/sync-knowledge.md', 'utf8');
  assert.match(t, /graphify/i);
  assert.match(t, /merge-graphs|gen:graphify/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/no-obsidian-refs.test.mjs`
Expected: FAIL — commands still reference obsidian / sync-knowledge not graphify.

- [ ] **Step 3: Rewrite `commands/sync-knowledge.md`**

Replace the whole file body (keep the `---` frontmatter shape, update its `description`) with the graphify-sync version:

```markdown
---
description: "Refresh the graphify knowledge graph for this repo and the cross-project graph. Replaces the legacy vault sync."
argument-hint: "(no args)"
allowed-tools: Read, Bash
---

# /gen:sync-knowledge

Refreshes the repo's graphify graph and the cross-project graph. Graphify already updates incrementally on pipeline checkpoints; run this to force a full sync (e.g. after a large refactor or before reviewing the graph).

## Workflow

1. Update this repo's graph: `node ${CLAUDE_PLUGIN_ROOT}/scripts/graphify/run.mjs update`
2. Refresh the cross-project graph (links the plugin + known projects):
   `graphify merge-graphs graphify-out/graph.json "$HOME/.claude/genorah/graphify/"*/graph.json --out "$HOME/.claude/genorah/graphify/merged-graph.json"`
   (skip silently if graphify is unavailable — `gen:graphify status` reports the fallback.)
3. Report node/edge counts via `gen:graphify status`.

## Notes
- When graphify isn't installed, recall falls back to the BM25 semantic-index; nothing breaks.
- Per-project graphs live in each repo's `graphify-out/` (gitignored).
```

- [ ] **Step 4: Gut `commands/export.md` + scrub the rest**

- `commands/export.md`: remove the Obsidian-vault format-conversion section (vault structure, wiki-links, Dataview frontmatter, `_index.md`, graph.json color config, `mcp__plugin_gen_obsidian*` tools). Keep the deliverables/design-tokens/build-artifact export. Add one line: "Knowledge lives in the graphify graph (`gen:graphify`), not an Obsidian vault."
- `commands/dashboard.md`: remove "open Obsidian" from the quick-actions list (line ~42); leave the rest.
- `commands/next.md`, `commands/tutorial.md`: remove the Obsidian suggestions/steps; where they pointed users at the vault, point at `gen:graphify`.
- `commands/graphify.md`: reword the one "Replaces the Obsidian knowledge surface" line to "Replaces the legacy knowledge-vault surface."

Find them: `grep -niE "obsidian" commands/*.md`.

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/no-obsidian-refs.test.mjs`
Expected: PASS (commands + sync-knowledge tests; all earlier tests still green).

- [ ] **Step 6: Commit**

```bash
git add commands tests/no-obsidian-refs.test.mjs
git commit -m "feat(graphify): repurpose sync-knowledge to graphify sync; gut export vault; scrub commands"
```

---

## Task 5: Scrub remaining skills + CLAUDE.md + config; full lock + mirror

**Files:**
- Modify: `skills/SKILL-DIRECTORY.md`, `skills/pipeline-guidance/SKILL.md`, `skills/client-review-workflow/SKILL.md`, `skills/git-workflow/SKILL.md`, `skills/motion-health/SKILL.md`, `CLAUDE.md`, `.claude/genorah.local.md`
- Test: `tests/no-obsidian-refs.test.mjs` (final whole-surface assertion)
- Modify: `plugins/gen/**` (via `sync-mirror`)

**Interfaces:**
- Produces: zero Obsidian references across the entire runtime surface; graphify config in `.claude/genorah.local.md`; mirror in sync.

- [ ] **Step 1: Add the comprehensive failing assertion**

```javascript
// tests/no-obsidian-refs.test.mjs (append — the whole-surface lock)
test('no obsidian references anywhere in the runtime surface', async () => {
  const files = await globby([
    '.claude-plugin/.mcp.json',
    '.claude-plugin/hooks/*.mjs', '.claude-plugin/hooks/*.sh',
    'commands/**/*.md', 'skills/**/*.md', 'agents/**/*.md', 'CLAUDE.md',
  ]);
  const offenders = files.filter(f => /obsidian/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `obsidian refs remain in: ${offenders.join(', ')}`);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/no-obsidian-refs.test.mjs`
Expected: FAIL — listing the remaining offenders (`SKILL-DIRECTORY.md`, `pipeline-guidance`, `client-review-workflow`, `git-workflow`, `motion-health`, `CLAUDE.md`).

- [ ] **Step 3: Scrub the incidental skill mentions + CLAUDE.md + config**

- The 5 remaining skills: these are one-line/incidental mentions. Find each (`grep -niE "obsidian" skills/SKILL-DIRECTORY.md skills/pipeline-guidance/SKILL.md skills/client-review-workflow/SKILL.md skills/git-workflow/SKILL.md skills/motion-health/SKILL.md`) and remove or reword the obsidian mention (drop the obsidian-integration row from SKILL-DIRECTORY; remove "sync to Obsidian" asides; where a knowledge surface is named, say "graphify graph").
- `CLAUDE.md`: delete the "## Obsidian Integration" section and remove the two Obsidian MCP rows from the MCP table; replace with a one-paragraph "Knowledge Graph (graphify)" note pointing at `gen:graphify`.
- `.claude/genorah.local.md`: replace the `vault_path`/`obsidian_installed`/`vault_sync` keys with graphify config:
  ```markdown
  graphify_graph_path: graphify-out/graph.json
  graphify_auto_update: true
  ```

- [ ] **Step 4: Full lock + suite + mirror**

Run:
```bash
node --test tests/no-obsidian-refs.test.mjs
npm test
npm run sync-mirror
npm run check-mirror
```
Expected: the whole-surface test PASS (zero offenders); full suite PASS; mirror clean. **Manually confirm** the mirror reflects the deletion (`plugins/gen/skills/obsidian-integration/` is gone) and the rewrites (`plugins/gen/commands/sync-knowledge.md` is the graphify version, `plugins/gen/.claude-plugin/.mcp.json` has no obsidian). If `sync-mirror` doesn't propagate a deletion, remove the mirror copy by hand and note it. Re-run `check-mirror` until clean.

- [ ] **Step 5: Verify the graphify layer still works end-to-end**

Run: `node --test tests/graphify-integration.test.mjs`
Expected: PASS (graphify build + recall still green — Phase 2 didn't disturb the Phase 1 layer).

- [ ] **Step 6: Commit**

```bash
git add -A skills CLAUDE.md .claude/genorah.local.md plugins/gen tests/no-obsidian-refs.test.mjs
git commit -m "feat(graphify): scrub remaining obsidian mentions; graphify config; full retirement lock + mirror"
```

---

## Self-Review

**Spec coverage (Obsidian-retirement section):**
- Remove obsidian + obsidian-fs MCPs → Task 1. ✓
- Repurpose sync-knowledge into graphify sync → Task 4. ✓
- Drop export Obsidian-vault conversion → Task 4. ✓
- Remove session-start vault-drift; replace session-end KB nudge; reroute user-prompt → Task 3. ✓
- Retire obsidian-integration skill; repoint cross-project-kb to graph + ledgers → Task 2. ✓
- Replace `.claude/genorah.local.md` vault keys with graphify config → Task 5. ✓
- Drop Obsidian refs from dashboard/next/CLAUDE.md → Tasks 4, 5. ✓
- **Deferred to Phase 3:** dashboard graph panel, v4.3.0 bump/changelog. Not in this plan.

**Placeholder scan:** No TBD/TODO; the regression test is complete code; the repurposed `sync-knowledge.md` is given in full; doc-scrub steps name the exact files + the grep to locate mentions + the test that gates completeness. The doc rewrites are removals/rewordings (self-evident per mention), gated deterministically by the `no-obsidian-refs` test — not placeholders. ✓

**Type consistency:** the single test file `tests/no-obsidian-refs.test.mjs` grows by appended `test()` blocks across tasks; `globby`/`readFileSync` imports are added once (Task 1 imports `readFileSync`; Task 2 adds `globby`/`existsSync`) — later tasks reuse them without re-importing. The whole-surface glob in Task 5 is a superset of the per-task globs, so passing Task 5 implies all earlier slices stayed clean. ✓

**Risk note for the implementer:** the session hooks (Task 3) are the only behavioral risk — every edit there is verified by `node --check` + a stdin smoke that the hook still emits valid output and exits 0. Everything else is doc/config text gated by the regression test.
