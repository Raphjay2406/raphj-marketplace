# Graphify Memory Layer — Phase 3 (Dashboard Panel + v4.3.0 Release) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Embed graphify's interactive graph into the existing `localhost:4455` dashboard as a Graph panel, then ship the whole graphify migration as **v4.3.0**.

**Architecture:** A pure `graphSummary(cwd)` reads `graphify-out/graph.json` (counts + freshness); the zero-dep dashboard server gains a `graph` field in its `snapshot()` plus two path-guarded routes to serve graphify's self-contained `graph.html` and its assets; `dashboard.html` gets a Graph tab that iframes the graph and shows the summary (or a "run `gen:graphify scan`" prompt when absent). Then a release task bumps the version, writes the changelog, and syncs the mirror.

**Tech Stack:** Node ESM (`.mjs`), `node:test`, the existing zero-dep `dashboard-server.mjs` + `dashboard.html`, graphify 0.8.50 outputs.

## Global Constraints

- ESM `.mjs`, no TypeScript; match existing `scripts/*.mjs` / `.claude-plugin/companion/*.mjs` style.
- Tests use `node --test` (`tests/*.test.mjs`), runnable via `npm test`.
- graphify writes `graphify-out/graph.json` + `graph.html` + `GRAPH_REPORT.md` at the **repo root** (cwd), NOT under `.planning/genorah/`. `graphify-out/` is gitignored (Phase 1).
- The dashboard runs against `process.cwd()`; serve graph files from `<cwd>/graphify-out/`.
- Path-serving routes MUST guard against directory traversal (reject any resolved path that escapes `<cwd>/graphify-out/`).
- The panel must degrade gracefully: no graph yet → show a "run `gen:graphify scan`" prompt, never a broken iframe.
- This phase ships the whole feature as **v4.3.0**: bump `.claude-plugin/plugin.json` AND the `gen` entry in `.claude-plugin/marketplace.json`; add `docs/v4.3-changelog.md`. The git tag + GitHub release happen AFTER merge (outward-facing; offered separately), not in this plan.
- Mirror: edited `.claude-plugin/companion/*` + scripts + manifests sync into `plugins/gen/` via `npm run sync-mirror`; `check-mirror` green (final task).

---

## File Structure

| File | Responsibility |
|------|----------------|
| `scripts/graphify/graph-summary.mjs` | Pure `graphSummary(cwd)` → `{exists, nodes, edges, ageMs}` from `graphify-out/graph.json` |
| `scripts/graphify/graph-path.mjs` | Pure `safeGraphAsset(cwd, rel)` → absolute path inside `graphify-out/` or null (traversal guard) |
| `.claude-plugin/companion/dashboard-server.mjs` | + `graph` in snapshot; + `/api/graph` and `/api/graph-asset/*` routes |
| `.claude-plugin/companion/dashboard.html` | + Graph panel (iframe + summary / scan-prompt) |
| `commands/dashboard.md` | document the Graph panel |
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | v4.3.0 |
| `docs/v4.3-changelog.md` | the graphify feature changelog |

---

## Task 1: `graphSummary` — read graph stats

**Files:**
- Create: `scripts/graphify/graph-summary.mjs`
- Test: `tests/graph-summary.test.mjs`

**Interfaces:**
- Produces: `graphSummary(cwd = '.', now = Date.now()) -> { exists, nodes, edges, ageMs }`.
  - Reads `<cwd>/graphify-out/graph.json`. `exists` = file present + parseable.
  - `nodes` = `Array.isArray(json.nodes) ? json.nodes.length : null`.
  - `edges` = length of the first present of `json.edges` / `json.links` / `json.relationships`, else `null`.
  - `ageMs` = `now - mtimeMs` of graph.json, or `null` if absent.
  - Never throws; missing/corrupt file → `{ exists:false, nodes:null, edges:null, ageMs:null }`.

- [ ] **Step 1: Confirm the real graph.json shape, then write the failing test**

First confirm which key graphify uses for edges (this resolves the spec's open question). Build a throwaway graph and inspect:
```bash
node -e "const{mkdtempSync,writeFileSync}=require('fs');const{tmpdir}=require('os');const{join}=require('path');const d=mkdtempSync(join(tmpdir(),'gshape-'));writeFileSync(join(d,'a.js'),'export function f(){return g()} function g(){}');require('child_process').execFileSync('graphify',['update','.'],{cwd:d,stdio:'ignore'});console.log(d)"
# then read <printed-dir>/graphify-out/graph.json and note whether top-level edges are under `edges`, `links`, or `relationships`.
```
The test fixture below uses `{nodes:[...], edges:[...]}`; if the real key is `links`/`relationships`, the implementation's fallback chain already covers it — keep the fixture as `edges` (the chain tries `edges` first).

```javascript
// tests/graph-summary.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { graphSummary } from '../scripts/graphify/graph-summary.mjs';

function repoWithGraph(graph) {
  const dir = mkdtempSync(join(tmpdir(), 'gsum-'));
  mkdirSync(join(dir, 'graphify-out'), { recursive: true });
  writeFileSync(join(dir, 'graphify-out', 'graph.json'), JSON.stringify(graph));
  return dir;
}

test('absent graph → exists false, nulls', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gsum-none-'));
  assert.deepEqual(graphSummary(dir), { exists: false, nodes: null, edges: null, ageMs: null });
});

test('present graph → counts + age', () => {
  const dir = repoWithGraph({ nodes: [1, 2, 3], edges: [{ a: 1 }, { a: 2 }] });
  const p = join(dir, 'graphify-out', 'graph.json');
  const past = Date.now() - 90_000;
  utimesSync(p, new Date(past / 1000), new Date(past / 1000));
  const s = graphSummary(dir, Date.now());
  assert.equal(s.exists, true);
  assert.equal(s.nodes, 3);
  assert.equal(s.edges, 2);
  assert.ok(s.ageMs >= 85_000, `age ${s.ageMs}`);
});

test('edges fallback to links', () => {
  const dir = repoWithGraph({ nodes: [1], links: [{ a: 1 }, { a: 2 }, { a: 3 }] });
  assert.equal(graphSummary(dir).edges, 3);
});

test('corrupt graph → exists false', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gsum-bad-'));
  mkdirSync(join(dir, 'graphify-out'), { recursive: true });
  writeFileSync(join(dir, 'graphify-out', 'graph.json'), '{not json');
  assert.equal(graphSummary(dir).exists, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/graph-summary.test.mjs`
Expected: FAIL — `Cannot find module '../scripts/graphify/graph-summary.mjs'`

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/graphify/graph-summary.mjs
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function graphSummary(cwd = '.', now = Date.now()) {
  const graphPath = join(cwd, 'graphify-out', 'graph.json');
  if (!existsSync(graphPath)) return { exists: false, nodes: null, edges: null, ageMs: null };
  let json;
  try { json = JSON.parse(readFileSync(graphPath, 'utf8')); }
  catch { return { exists: false, nodes: null, edges: null, ageMs: null }; }

  const nodes = Array.isArray(json.nodes) ? json.nodes.length : null;
  const edgeArr = [json.edges, json.links, json.relationships].find(Array.isArray);
  const edges = edgeArr ? edgeArr.length : null;
  let ageMs = null;
  try { ageMs = now - statSync(graphPath).mtimeMs; } catch { /* ignore */ }
  return { exists: true, nodes, edges, ageMs };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/graph-summary.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/graphify/graph-summary.mjs tests/graph-summary.test.mjs
git commit -m "feat(graphify): graphSummary reads node/edge counts + freshness"
```

---

## Task 2: Dashboard server — graph in snapshot + serving routes

**Files:**
- Create: `scripts/graphify/graph-path.mjs`
- Modify: `.claude-plugin/companion/dashboard-server.mjs`
- Test: `tests/graph-path.test.mjs`

**Interfaces:**
- Consumes: `graph-summary.mjs` (`graphSummary`).
- Produces:
  - `safeGraphAsset(cwd, rel) -> string | null` — resolves `<cwd>/graphify-out/<rel>`; returns the absolute path only if it stays inside `<cwd>/graphify-out/`, else `null` (traversal guard).
  - `snapshot()` gains `graph: graphSummary(process.cwd())`.
  - `GET /api/graph` → serves `<cwd>/graphify-out/graph.html` (or 404 when absent).
  - `GET /api/graph-asset/<rel>` → serves a guarded file from `graphify-out/` (for `graph.json` / assets the html may fetch).

- [ ] **Step 1: Write the failing test (the guard is the testable core)**

```javascript
// tests/graph-path.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { join, sep } from 'node:path';
import { safeGraphAsset } from '../scripts/graphify/graph-path.mjs';

test('resolves a normal asset inside graphify-out', () => {
  const got = safeGraphAsset('/proj', 'graph.html');
  assert.equal(got, join('/proj', 'graphify-out', 'graph.html'));
});

test('rejects directory traversal', () => {
  assert.equal(safeGraphAsset('/proj', '../secret.txt'), null);
  assert.equal(safeGraphAsset('/proj', '..%2f..%2fetc/passwd'), null);
  assert.equal(safeGraphAsset('/proj', `..${sep}..${sep}etc`), null);
});

test('rejects absolute escape', () => {
  assert.equal(safeGraphAsset('/proj', '/etc/passwd'), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/graph-path.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Write the guard module**

```javascript
// scripts/graphify/graph-path.mjs
import { join, resolve, sep } from 'node:path';

export function safeGraphAsset(cwd, rel) {
  const base = resolve(cwd, 'graphify-out');
  const target = resolve(base, rel);
  if (target !== base && !target.startsWith(base + sep)) return null;
  return target;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/graph-path.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 5: Wire into `dashboard-server.mjs`**

Add the imports near the top (after the existing imports):
```javascript
import { graphSummary } from '../../scripts/graphify/graph-summary.mjs';
import { safeGraphAsset } from '../../scripts/graphify/graph-path.mjs';
```

In `snapshot()`, add the `graph` field to the returned object (alongside `action_queue`):
```javascript
    graph: graphSummary(process.cwd()),
```

In the request handler, add two routes BEFORE the final `else` 404. (Place them after the `/api/screenshot/` block.)
```javascript
  } else if (p === '/api/graph') {
    streamFile(res, path.join(process.cwd(), 'graphify-out', 'graph.html'), 'text/html; charset=utf-8');
  } else if (p.startsWith('/api/graph-asset/')) {
    const rel = decodeURIComponent(p.slice('/api/graph-asset/'.length));
    const abs = safeGraphAsset(process.cwd(), rel);
    if (!abs) return res.writeHead(403).end('forbidden');
    const ct = abs.endsWith('.json') ? 'application/json'
      : abs.endsWith('.js') ? 'application/javascript'
      : abs.endsWith('.css') ? 'text/css' : 'application/octet-stream';
    streamFile(res, abs, ct);
```
(`streamFile` already 404s a missing file, so the no-graph case is handled.)

- [ ] **Step 6: Verify the server still parses + serves**

Run:
```bash
node --check .claude-plugin/companion/dashboard-server.mjs
node --test tests/graph-path.test.mjs
```
Expected: `node --check` clean; tests pass.

- [ ] **Step 7: Commit**

```bash
git add scripts/graphify/graph-path.mjs .claude-plugin/companion/dashboard-server.mjs tests/graph-path.test.mjs
git commit -m "feat(graphify): dashboard serves graph.html + assets (guarded); graph in snapshot"
```

---

## Task 3: Dashboard HTML — the Graph panel

**Files:**
- Modify: `.claude-plugin/companion/dashboard.html`
- Modify: `commands/dashboard.md`
- Test: `tests/dashboard-graph-panel.test.mjs`

**Interfaces:**
- Produces: a Graph panel in `dashboard.html` that (a) iframes `/api/graph`, (b) renders `state.graph` summary (nodes/edges/age) when `state.graph.exists`, (c) shows a "Run `gen:graphify scan`" prompt when `!state.graph.exists`.

- [ ] **Step 1: Write the failing test (markup presence)**

```javascript
// tests/dashboard-graph-panel.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

test('dashboard.html has a graph panel wired to /api/graph and state.graph', () => {
  const html = readFileSync('.claude-plugin/companion/dashboard.html', 'utf8');
  assert.match(html, /\/api\/graph\b/, 'must iframe/link the graph route');
  assert.match(html, /state\.graph|data\.graph/, 'must read the graph summary from state');
  assert.match(html, /gen:graphify scan/, 'must show the scan prompt when no graph');
});

test('dashboard command documents the graph panel', () => {
  assert.match(readFileSync('commands/dashboard.md', 'utf8'), /graph/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/dashboard-graph-panel.test.mjs`
Expected: FAIL — markup absent

- [ ] **Step 3: Add the panel to `dashboard.html`**

Read the file first to match its existing panel/section structure and its SSE state-render JS. Add a Graph panel consistent with the existing dark-theme panels. The panel needs:
- A container, e.g. `<section class="panel" id="graph-panel"><h2>Knowledge Graph</h2><div id="graph-summary"></div><iframe id="graph-frame" src="/api/graph" title="Knowledge graph"></iframe></section>` (style the iframe to a reasonable height, e.g. 420px, full width, no border).
- In the existing state-render function (the one that consumes the SSE/`/api/state` payload — find where it renders other panels from `state`), add rendering for `state.graph`:
  - if `state.graph && state.graph.exists`: set `#graph-summary` to `${nodes} nodes · ${edges} edges · updated ${Math.round(ageMs/1000)}s ago` and show the iframe.
  - else: set `#graph-summary` to a prompt `No graph yet — run <code>gen:graphify scan</code>` and hide the iframe.
  Use the file's existing DOM-update idiom (textContent/innerHTML as the file already does). Keep it consistent with how other panels guard missing data.

- [ ] **Step 4: Document it in `commands/dashboard.md`**

In the "What the dashboard shows" list, add an item: "**Knowledge graph panel** — embeds graphify's interactive `graph.html` with a node/edge/freshness summary; prompts `gen:graphify scan` when no graph exists."

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/dashboard-graph-panel.test.mjs`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add .claude-plugin/companion/dashboard.html commands/dashboard.md tests/dashboard-graph-panel.test.mjs
git commit -m "feat(graphify): dashboard Graph panel (iframe + summary + scan prompt)"
```

---

## Task 4: Release v4.3.0

**Files:**
- Modify: `.claude-plugin/plugin.json` (version `4.3.0`), `.claude-plugin/marketplace.json` (gen entry → `4.3.0`)
- Create: `docs/v4.3-changelog.md`
- Modify: `plugins/gen/**` (via `sync-mirror`)
- Test: `tests/no-obsidian-refs.test.mjs` + `tests/graphify-integration.test.mjs` (re-run; no new test)

- [ ] **Step 1: Confirm the full suite**

Run: `npm test`
Expected: PASS across all `tests/*.test.mjs` (incl. the new graph-summary/graph-path/dashboard-graph-panel tests + the Phase 1/2 graphify tests). The verify-spine browser tests may flake once — re-run `node --test tests/*.test.mjs` if a single browser test flakes.

- [ ] **Step 2: Version bump + changelog**

- `.claude-plugin/plugin.json`: `"version": "4.3.0"`, and update the leading version phrase in its `description` to `Genorah v4.3.0 — Knowledge Graph.`
- `.claude-plugin/marketplace.json`: set the `gen` entry `"version": "4.3.0"` and update its description's leading phrase to `Genorah v4.3.0 — Knowledge Graph.` (self-audit requires the two manifest versions to match — bump BOTH.)

Create `docs/v4.3-changelog.md`:
```markdown
# Genorah v4.3.0 — "Knowledge Graph"

## Graphify Memory Layer (replaces Obsidian)
- **graphify** (AST knowledge-graph CLI + MCP) is the repo-understanding + memory-recall brain. `recall()` routes to graphify with a BM25 fallback so memory never goes dark.
- `gen:graphify` (scan/update/query/explain/path/status/install) builds and queries the graph; the graphify MCP exposes `query_graph`/`get_node`/`get_neighbors`/`shortest_path` to agents.
- Always-on: a debounced background `graphify update .` fires on pipeline checkpoints.
- **Obsidian retired**: the two Obsidian MCP servers, the `obsidian-integration` skill, and vault-drift hooks are gone; `/gen:sync-knowledge` is now graphify sync; lessons live in `.planning/genorah/lessons/`, graphify-indexed. Locked by a `no-obsidian-refs` + vault-config regression test.
- **Dashboard Graph panel**: the `localhost:4455` dashboard embeds graphify's interactive `graph.html` with a node/edge/freshness summary.
- Requires graphify (`uv tool install graphifyy`, Python 3.10+) for the graph; absent that, recall falls back to BM25 — nothing breaks.
```

- [ ] **Step 3: Sync the mirror**

Run:
```bash
npm run sync-mirror
npm run check-mirror
```
Expected: clean. **Manually confirm** `plugins/gen/scripts/graphify/{graph-summary,graph-path}.mjs`, the updated `plugins/gen/.claude-plugin/companion/{dashboard-server.mjs,dashboard.html}`, and both manifests (4.3.0) are mirrored.

- [ ] **Step 4: Full validation**

Run: `npm run validate`
Expected: lint + self-audit + tests pass. Fix any NEW self-audit issue from this work (e.g. version drift); note pre-existing ones.

- [ ] **Step 5: Dashboard graph smoke (evidence)**

```bash
# build a graph at repo root, then confirm graphSummary sees it
node -e "import('./scripts/graphify/graph-summary.mjs').then(m=>console.log(JSON.stringify(m.graphSummary('.'))))"
```
If a `graphify-out/graph.json` exists at the repo root (from a prior `gen:graphify scan`), expect `{exists:true,nodes:...}`. If not, expect `{exists:false,...}` — both are valid; the point is `graphSummary` runs clean. (Do not commit any `graphify-out/` — it's gitignored.)

- [ ] **Step 6: Commit**

```bash
git add .claude-plugin/plugin.json .claude-plugin/marketplace.json docs/v4.3-changelog.md plugins/gen
git commit -m "chore(release): v4.3.0 Knowledge Graph — dashboard panel + graphify feature complete"
```

---

## Self-Review

**Spec coverage (dashboard-panel + rollout sections):**
- Dashboard route serving `graph.html` + assets → Task 2. ✓
- Graph tab/panel iframing it + `GRAPH_REPORT`/summary + freshness + scan prompt → Tasks 1 (summary), 3 (panel). ✓
- Reuses dashboard SSE so the panel refreshes on checkpoint update → Task 3 (renders from the SSE `state.graph`, which `snapshot()` recomputes each broadcast). ✓
- v4.3.0 bump + changelog + mirror → Task 4. ✓
- **Deferred (offered post-merge, outward-facing):** git tag `v4.3.0` + GitHub release.

**Placeholder scan:** No TBD/TODO; pure modules + tests are complete code; the dashboard.html panel step names the exact markup + the exact `state.graph` fields to render and the file's existing render idiom to follow — gated by the presence test. The one runtime-shape check (graph.json edge key) is an explicit verify step with a covered fallback chain, not a placeholder. ✓

**Type consistency:** `graphSummary(cwd, now)` (Task 1) is consumed by `snapshot()` (Task 2) and its `{exists, nodes, edges, ageMs}` shape is exactly what the dashboard panel renders (Task 3). `safeGraphAsset(cwd, rel)` (Task 2) returns an absolute path or null, matching its route call site. The `state.graph` field the panel reads (Task 3) is the same object `snapshot().graph` produces (Task 2). ✓

**Open item deferred to implementer judgement:** the exact height/styling of the graph iframe (match the dashboard's existing panel styling) and the precise graph.json edge key (verified in Task 1 Step 1; fallback chain covers `edges`/`links`/`relationships`).
