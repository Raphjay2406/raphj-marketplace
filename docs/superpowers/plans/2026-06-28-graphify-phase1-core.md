# Graphify Memory Layer — Phase 1 (Core) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the core graphify memory layer — a capability check, a `recall()` seam that routes to graphify or falls back to BM25, the `gen:graphify` command, the graphify MCP entry, and background checkpoint updates — without touching Obsidian yet.

**Architecture:** New pure-ish Node modules under `scripts/graphify/` and `scripts/memory/` shell out to the installed `graphify` CLI with injected runners so logic is unit-testable. `recall()` picks graphify when its graph exists and the CLI is on PATH, else the existing `semantic-index` BM25. A debounced background `graphify update .` fires on checkpoint ledger events. The memory write path and Obsidian are untouched in this phase.

**Tech Stack:** Node ESM (`.mjs`), `node:test`, the installed `graphify` 0.8.50 CLI + `graphify-mcp`, the existing `scripts/semantic-index.mjs` BM25.

## Global Constraints

- ESM `.mjs`, no TypeScript; match existing `scripts/*.mjs` style.
- Tests use `node --test` (`tests/*.test.mjs`), runnable via `npm test`.
- Every shell-out to `graphify`/`node`/`semantic-index` is injected via a `deps.run` / `runner` parameter so tests never spawn a real subprocess (except the one explicitly-gated integration smoke).
- `graphify` CLI verbs (verified, v0.8.50): build+update = `graphify update <path>`; recall = `graphify query "<q>"`, `graphify explain "<node>"`, `graphify path "A" "B"`; cross-repo = `graphify merge-graphs`. MCP server executable = `graphify-mcp [graph.json]` (stdio).
- Default per-project graph path: `graphify-out/graph.json`.
- BM25 fallback CLI: `node scripts/semantic-index.mjs query --text "<q>" --top-k <k>` → JSON array of `{score, ref, ts, actor, kind, subject, summary}`.
- Nothing in this phase deletes the sqlite-vec write path or removes Obsidian (that's Phase 2). This phase is purely additive.
- No version bump in this phase (the 4.3.0 bump lands in the final phase); mirror sync still runs.
- Capability/feature absence must never throw into a hook or block a build — degrade silently (log to `.claude/hook-errors.log`).

---

## File Structure

| File | Responsibility |
|------|----------------|
| `scripts/graphify/capability.mjs` | Detect graphify on PATH (cached) + graph existence/age — pure with injected runner |
| `scripts/memory/recall.mjs` | `recall(question, opts)` → graphify-or-BM25, normalized hits + provider |
| `scripts/graphify/plan-command.mjs` | Pure: map a `gen:graphify` subcommand → `{exec, message}` given capabilities |
| `scripts/graphify/run.mjs` | CLI: execute the planned command (shells out), `status` report |
| `scripts/graphify/checkpoint.mjs` | Pure: `isCheckpoint(event)` + debounce decision |
| `commands/graphify.md` | `gen:graphify` command doc |
| `.claude-plugin/.mcp.json` | + graphify MCP entry |
| `.claude-plugin/hooks/post-tool-use.mjs` | + debounced background `graphify update .` on checkpoint events |
| `.gitignore` | + `graphify-out/` |

---

## Task 1: Capability detection

**Files:**
- Create: `scripts/graphify/capability.mjs`
- Test: `tests/graphify-capability.test.mjs`

**Interfaces:**
- Produces:
  - `graphifyAvailable({ runner } = {}) -> boolean` — true if `graphify --version` succeeds; cached per process. `runner(cmd, args)` defaults to a real `execFileSync`; injected in tests.
  - `resetCapabilityCache() -> void` — clears the cache (tests).
  - `graphExists(graphPath = 'graphify-out/graph.json') -> boolean`.
  - `graphAgeMs(graphPath = 'graphify-out/graph.json', now = Date.now()) -> number | null` — ms since the graph's mtime, or null if absent.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/graphify-capability.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  graphifyAvailable, resetCapabilityCache, graphExists, graphAgeMs,
} from '../scripts/graphify/capability.mjs';

test('graphifyAvailable true when version runner succeeds', () => {
  resetCapabilityCache();
  assert.equal(graphifyAvailable({ runner: () => 'graphify 0.8.50' }), true);
});

test('graphifyAvailable false when runner throws', () => {
  resetCapabilityCache();
  assert.equal(graphifyAvailable({ runner: () => { throw new Error('not found'); } }), false);
});

test('graphifyAvailable caches the first result', () => {
  resetCapabilityCache();
  assert.equal(graphifyAvailable({ runner: () => 'ok' }), true);
  // second call with a throwing runner still returns cached true
  assert.equal(graphifyAvailable({ runner: () => { throw new Error('x'); } }), true);
});

test('graphExists / graphAgeMs reflect the file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gcap-'));
  const p = join(dir, 'graph.json');
  assert.equal(graphExists(p), false);
  assert.equal(graphAgeMs(p), null);
  writeFileSync(p, '{}');
  const past = Date.now() - 60_000;
  utimesSync(p, new Date(past / 1000), new Date(past / 1000));
  assert.equal(graphExists(p), true);
  const age = graphAgeMs(p, Date.now());
  assert.ok(age >= 55_000, `age ${age} should be ~60s`);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/graphify-capability.test.mjs`
Expected: FAIL — `Cannot find module '../scripts/graphify/capability.mjs'`

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/graphify/capability.mjs
import { existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

let _cache;

export function graphifyAvailable({ runner } = {}) {
  if (_cache !== undefined) return _cache;
  const run = runner || ((cmd, args) =>
    execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).toString());
  try { run('graphify', ['--version']); _cache = true; }
  catch { _cache = false; }
  return _cache;
}

export function resetCapabilityCache() { _cache = undefined; }

export function graphExists(graphPath = 'graphify-out/graph.json') {
  return existsSync(graphPath);
}

export function graphAgeMs(graphPath = 'graphify-out/graph.json', now = Date.now()) {
  if (!existsSync(graphPath)) return null;
  return now - statSync(graphPath).mtimeMs;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/graphify-capability.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/graphify/capability.mjs tests/graphify-capability.test.mjs
git commit -m "feat(graphify): capability detection (cached) + graph existence/age"
```

---

## Task 2: The recall seam

**Files:**
- Create: `scripts/memory/recall.mjs`
- Test: `tests/memory-recall.test.mjs`

**Interfaces:**
- Consumes: `capability.mjs` (`graphifyAvailable`, `graphExists`).
- Produces:
  - `recall(question, { kind = null, k = 10, graphPath = 'graphify-out/graph.json', deps = {} } = {}) -> { provider, hits }`.
  - `hits` is `[{ id, summary, source, score }]`.
  - `provider` is `'graphify'` | `'semantic-index'` | `'none'`.
  - Routing: if graphify is available AND the graph exists → run `graphify query <question> --graph <graphPath>` and parse leniently (one hit per non-empty output line, capped at `k`). On any error there → fall back. Fallback: `node scripts/semantic-index.mjs query --text <question> --top-k <k> [--kind <kind>]`, parse its JSON array. If even the fallback errors → `{ provider: 'none', hits: [] }`.
  - `deps` injection points: `deps.run(cmd, argsArray) -> stdoutString`, `deps.graphifyAvailable()`, `deps.graphExists(path)`.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/memory-recall.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { recall } from '../scripts/memory/recall.mjs';

const BM25_JSON = JSON.stringify([
  { score: 2.5, ref: 'DECISIONS.md#42', ts: 't', actor: 'a', kind: 'decision', subject: 's', summary: 'use indigo primary' },
]);

test('routes to graphify when available and graph exists', () => {
  const calls = [];
  const r = recall('how does auth work', {
    deps: {
      graphifyAvailable: () => true,
      graphExists: () => true,
      run: (cmd, args) => { calls.push([cmd, args]); return 'auth handled by login route\nsession via cookie'; },
    },
  });
  assert.equal(r.provider, 'graphify');
  assert.equal(r.hits.length, 2);
  assert.equal(r.hits[0].summary, 'auth handled by login route');
  assert.equal(calls[0][0], 'graphify');
  assert.equal(calls[0][1][0], 'query');
});

test('falls back to BM25 when graphify unavailable', () => {
  const r = recall('indigo', {
    deps: {
      graphifyAvailable: () => false,
      graphExists: () => false,
      run: (cmd) => { assert.equal(cmd, 'node'); return BM25_JSON; },
    },
  });
  assert.equal(r.provider, 'semantic-index');
  assert.equal(r.hits.length, 1);
  assert.deepEqual(r.hits[0], { id: 'DECISIONS.md#42', summary: 'use indigo primary', source: 'DECISIONS.md#42', score: 2.5 });
});

test('falls back to BM25 when the graphify query throws', () => {
  const r = recall('x', {
    deps: {
      graphifyAvailable: () => true,
      graphExists: () => true,
      run: (cmd) => { if (cmd === 'graphify') throw new Error('graph corrupt'); return BM25_JSON; },
    },
  });
  assert.equal(r.provider, 'semantic-index');
  assert.equal(r.hits.length, 1);
});

test('returns provider none when everything fails', () => {
  const r = recall('x', {
    deps: {
      graphifyAvailable: () => false, graphExists: () => false,
      run: () => { throw new Error('boom'); },
    },
  });
  assert.deepEqual(r, { provider: 'none', hits: [] });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/memory-recall.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/memory/recall.mjs
import { execFileSync } from 'node:child_process';
import { graphifyAvailable as realAvailable, graphExists as realExists } from '../graphify/capability.mjs';

function parseBm25(out) {
  let arr;
  try { arr = JSON.parse(out); } catch { return []; }
  if (!Array.isArray(arr)) return [];
  return arr.map(r => ({ id: r.ref, summary: r.summary || '', source: r.ref, score: r.score ?? 0 }));
}

function parseGraphify(out, k) {
  const lines = String(out).split('\n').map(l => l.trim()).filter(Boolean);
  return lines.slice(0, k).map((line, i) => ({ id: `g${i}`, summary: line, source: 'graphify', score: null }));
}

export function recall(question, { kind = null, k = 10, graphPath = 'graphify-out/graph.json', deps = {} } = {}) {
  const run = deps.run || ((cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', timeout: 30000 }));
  const available = deps.graphifyAvailable || realAvailable;
  const exists = deps.graphExists || realExists;

  if (available() && exists(graphPath)) {
    try {
      const out = run('graphify', ['query', question, '--graph', graphPath]);
      return { provider: 'graphify', hits: parseGraphify(out, k) };
    } catch { /* fall through to BM25 */ }
  }

  try {
    const args = ['scripts/semantic-index.mjs', 'query', '--text', question, '--top-k', String(k)];
    if (kind) { args.push('--kind', kind); }
    const out = run('node', args);
    return { provider: 'semantic-index', hits: parseBm25(out) };
  } catch {
    return { provider: 'none', hits: [] };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/memory-recall.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/memory/recall.mjs tests/memory-recall.test.mjs
git commit -m "feat(memory): recall seam routes graphify-or-BM25 with fallback"
```

---

## Task 3: `gen:graphify` command + runner

**Files:**
- Create: `scripts/graphify/plan-command.mjs`, `scripts/graphify/run.mjs`, `commands/graphify.md`
- Test: `tests/graphify-plan-command.test.mjs`

**Interfaces:**
- Produces:
  - `planCommand(sub, args, caps) -> { exec: [cmd, argsArray] | null, message: string, kind: 'exec'|'info'|'error' }` where `caps = { available, graphExists, ageMs }`.
    - `scan` / `update` → `graphify update .` (exec). If not `available` → `error` with install hint.
    - `query` → `graphify query "<args[0]>"` (exec; error if no query text).
    - `explain` → `graphify explain "<args[0]>"`; `path` → `graphify path "<args[0]>" "<args[1]>"`.
    - `status` → `info` with a human summary built from `caps` (available?, graph exists?, age).
    - `install` → if `available`, `info` "already installed"; else `uv tool install graphifyy` (exec).
    - unknown sub → `error`.
  - `run.mjs` CLI: parse argv → `planCommand` → if `exec`, run it (live), else print message; exit 2 on `error`.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/graphify-plan-command.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { planCommand } from '../scripts/graphify/plan-command.mjs';

const OK = { available: true, graphExists: true, ageMs: 5000 };
const NO = { available: false, graphExists: false, ageMs: null };

test('scan maps to graphify update .', () => {
  const p = planCommand('scan', [], OK);
  assert.equal(p.kind, 'exec');
  assert.deepEqual(p.exec, ['graphify', ['update', '.']]);
});

test('scan errors with install hint when graphify unavailable', () => {
  const p = planCommand('scan', [], NO);
  assert.equal(p.kind, 'error');
  assert.match(p.message, /install/i);
});

test('query needs text and maps to graphify query', () => {
  assert.equal(planCommand('query', [], OK).kind, 'error');
  const p = planCommand('query', ['how does build work'], OK);
  assert.deepEqual(p.exec, ['graphify', ['query', 'how does build work']]);
});

test('path maps to graphify path A B', () => {
  const p = planCommand('path', ['NodeA', 'NodeB'], OK);
  assert.deepEqual(p.exec, ['graphify', ['path', 'NodeA', 'NodeB']]);
});

test('status is info and reports availability + graph state', () => {
  const p = planCommand('status', [], OK);
  assert.equal(p.kind, 'info');
  assert.match(p.message, /available/i);
  assert.match(p.message, /graph/i);
});

test('install execs uv when absent, info when present', () => {
  assert.deepEqual(planCommand('install', [], NO).exec, ['uv', ['tool', 'install', 'graphifyy']]);
  assert.equal(planCommand('install', [], OK).kind, 'info');
});

test('unknown subcommand errors', () => {
  assert.equal(planCommand('frobnicate', [], OK).kind, 'error');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/graphify-plan-command.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/graphify/plan-command.mjs
function err(message) { return { exec: null, message, kind: 'error' }; }
function info(message) { return { exec: null, message, kind: 'info' }; }
function exec(cmd, args, message = '') { return { exec: [cmd, args], message, kind: 'exec' }; }

const INSTALL_HINT = 'graphify not found — run `gen:graphify install` (needs uv + Python 3.10+).';

export function planCommand(sub, args = [], caps = {}) {
  const need = () => caps.available === true;
  switch (sub) {
    case 'scan':
    case 'update':
      return need() ? exec('graphify', ['update', '.'], 'Building/updating the repo graph…') : err(INSTALL_HINT);
    case 'query':
      if (!args[0]) return err('usage: gen:graphify query "<question>"');
      return need() ? exec('graphify', ['query', args[0]]) : err(INSTALL_HINT);
    case 'explain':
      if (!args[0]) return err('usage: gen:graphify explain "<node>"');
      return need() ? exec('graphify', ['explain', args[0]]) : err(INSTALL_HINT);
    case 'path':
      if (!args[0] || !args[1]) return err('usage: gen:graphify path "<A>" "<B>"');
      return need() ? exec('graphify', ['path', args[0], args[1]]) : err(INSTALL_HINT);
    case 'status': {
      const a = caps.available ? 'available' : 'NOT available (BM25 fallback active)';
      const g = caps.graphExists ? `graph present (age ${Math.round((caps.ageMs ?? 0) / 1000)}s)` : 'no graph yet — run `gen:graphify scan`';
      return info(`graphify: ${a}\ngraph: ${g}`);
    }
    case 'install':
      return caps.available ? info('graphify already installed.') : exec('uv', ['tool', 'install', 'graphifyy'], 'Installing graphify…');
    default:
      return err(`unknown subcommand: ${sub}. Use scan|update|query|explain|path|status|install.`);
  }
}
```

```javascript
// scripts/graphify/run.mjs
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { planCommand } from './plan-command.mjs';
import { graphifyAvailable, graphExists, graphAgeMs } from './capability.mjs';

export function main(argv) {
  const sub = argv[2];
  const args = argv.slice(3);
  const caps = { available: graphifyAvailable(), graphExists: graphExists(), ageMs: graphAgeMs() };
  const plan = planCommand(sub, args, caps);
  if (plan.kind === 'error') { process.stderr.write(plan.message + '\n'); process.exit(2); }
  if (plan.kind === 'info') { process.stdout.write(plan.message + '\n'); return; }
  if (plan.message) process.stdout.write(plan.message + '\n');
  const [cmd, cargs] = plan.exec;
  execFileSync(cmd, cargs, { stdio: 'inherit' });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv);
```

```markdown
<!-- commands/graphify.md -->
---
description: "Build and query the repo's graphify knowledge graph (AST + semantic). Subcommands: scan | update | query | explain | path | status | install."
argument-hint: "scan | update | query \"<q>\" | explain \"<node>\" | path \"<A>\" \"<B>\" | status | install"
allowed-tools: Read, Bash
---

# /gen:graphify

Always-on repo understanding + memory recall backed by graphify. Replaces the Obsidian knowledge surface; falls back to the BM25 semantic-index when graphify isn't installed.

## Usage

Run via the runner: `node ${CLAUDE_PLUGIN_ROOT}/scripts/graphify/run.mjs <subcommand> [args]`

- `scan` — build the graph for the current repo (`graphify update .` → `graphify-out/graph.json` + `graph.html` + `GRAPH_REPORT.md`).
- `update` — incremental refresh (AST-only, no LLM).
- `query "<question>"` — BFS recall over the graph.
- `explain "<node>"` — plain-language explanation of a node + neighbors.
- `path "<A>" "<B>"` — shortest path between two nodes.
- `status` — graphify availability, graph presence + freshness.
- `install` — bootstrap graphify (`uv tool install graphifyy`) then scan. Needs uv + Python 3.10+.

## Notes
- The graph lives in `graphify-out/` (gitignored, rebuildable).
- Agents also query the graph live via the `graphify` MCP (`query_graph`, `get_node`, `get_neighbors`, `shortest_path`).
- When graphify is unavailable, recall transparently falls back to BM25 — nothing breaks.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/graphify-plan-command.test.mjs`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/graphify/plan-command.mjs scripts/graphify/run.mjs commands/graphify.md tests/graphify-plan-command.test.mjs
git commit -m "feat(graphify): gen:graphify command (scan/update/query/explain/path/status/install)"
```

---

## Task 4: MCP entry + checkpoint update trigger

**Files:**
- Create: `scripts/graphify/checkpoint.mjs`
- Modify: `.claude-plugin/.mcp.json` (add graphify entry), `.claude-plugin/hooks/post-tool-use.mjs` (background update on checkpoint)
- Test: `tests/graphify-checkpoint.test.mjs`

**Interfaces:**
- Produces:
  - `isCheckpoint(event) -> boolean` — true when `event.kind` ∈ `{ 'section-shipped', 'decision-made', 'commit-made', 'asset-generated' }`.
  - `shouldUpdate({ now, lastStampMs, debounceMs = 30000 }) -> boolean` — true when `lastStampMs` is null or `now - lastStampMs >= debounceMs`.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/graphify-checkpoint.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { isCheckpoint, shouldUpdate } from '../scripts/graphify/checkpoint.mjs';

test('isCheckpoint matches the checkpoint kinds only', () => {
  assert.equal(isCheckpoint({ kind: 'section-shipped' }), true);
  assert.equal(isCheckpoint({ kind: 'decision-made' }), true);
  assert.equal(isCheckpoint({ kind: 'commit-made' }), true);
  assert.equal(isCheckpoint({ kind: 'subgate-fired' }), false);
  assert.equal(isCheckpoint({}), false);
});

test('shouldUpdate respects the debounce window', () => {
  assert.equal(shouldUpdate({ now: 1_000_000, lastStampMs: null }), true);
  assert.equal(shouldUpdate({ now: 1_000_000, lastStampMs: 1_000_000 - 5_000 }), false);
  assert.equal(shouldUpdate({ now: 1_000_000, lastStampMs: 1_000_000 - 40_000 }), true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/graphify-checkpoint.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/graphify/checkpoint.mjs
const CHECKPOINT_KINDS = new Set(['section-shipped', 'decision-made', 'commit-made', 'asset-generated']);

export function isCheckpoint(event) {
  return !!event && CHECKPOINT_KINDS.has(event.kind);
}

export function shouldUpdate({ now, lastStampMs, debounceMs = 30000 }) {
  if (lastStampMs == null) return true;
  return now - lastStampMs >= debounceMs;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/graphify-checkpoint.test.mjs`
Expected: PASS (2 tests)

- [ ] **Step 5: Add the graphify MCP entry to `.claude-plugin/.mcp.json`**

Add this entry (e.g. after the `obsidian-fs` entry — do NOT remove obsidian in this phase):

```json
  "graphify": {
    "type": "stdio",
    "command": "graphify-mcp",
    "args": ["graphify-out/graph.json"],
    "description": "Graphify knowledge-graph MCP — query_graph, get_node, get_neighbors, shortest_path over the repo's AST + semantic graph. Optional — recall() falls back to BM25 when absent.",
    "optional": true
  },
```

Then `npm run lint:json` to confirm the JSON is valid.

- [ ] **Step 6: Wire the background update into `post-tool-use.mjs`**

The hook already builds a ledger `kind` for Write/Edit/Bash and appends to `journal.ndjson`. After that ledger block (inside the existing `try`), add a guarded, non-blocking trigger. Read the file first to place it after the `kind`/`subject` computation; insert:

```javascript
  // v4.3 — graphify checkpoint: debounced background graph update
  try {
    if (kind) {
      const { isCheckpoint, shouldUpdate } = await import(`file://${join(repoRoot, 'scripts/graphify/checkpoint.mjs')}`);
      // repoRoot resolution mirrors pre-tool-use.mjs: dirname(fileURLToPath(import.meta.url)) -> .. -> repo root
      if (isCheckpoint({ kind })) {
        const stampFile = join(planningDir, '.graphify-stamp');
        let lastStampMs = null;
        try { lastStampMs = Number(readFileSync(stampFile, 'utf8')) || null; } catch { /* none */ }
        if (shouldUpdate({ now: Date.now(), lastStampMs })) {
          writeFileSync(stampFile, String(Date.now()));
          const { spawn } = await import('node:child_process');
          // detached, non-blocking, swallow all output; never await
          const child = spawn('graphify', ['update', '.'], { cwd, detached: true, stdio: 'ignore' });
          child.on('error', () => {}); // graphify not installed → ignore
          child.unref();
        }
      }
    }
  } catch (err) {
    logHookError(cwd, `graphify checkpoint failed: ${err.message}`);
  }
```

Confirm `post-tool-use.mjs` imports `readFileSync`, `writeFileSync`, and `join` (it already imports `readFileSync`, `appendFileSync`, `existsSync`, `mkdirSync`, `writeFileSync` and `join`) and computes `repoRoot`. If `repoRoot` is not already computed in this hook, add it next to the existing `cwd`: `const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');` with the matching imports from `node:path`/`node:url`.

- [ ] **Step 7: Run tests + lint, verify the hook still no-ops cleanly**

Run:
```bash
node --test tests/graphify-checkpoint.test.mjs
npm run lint:json
echo '{"tool_name":"Write","tool_input":{"file_path":"x/sections/hero/SUMMARY.md"}}' | node .claude-plugin/hooks/post-tool-use.mjs
```
Expected: tests PASS; lint:json valid; the hook prints `{}` and exits 0 (it may spawn a detached `graphify update` if a `.planning/genorah` exists in cwd, or silently skip — either way it must not error). If run outside a Genorah project the hook gates out early and prints `{}`.

- [ ] **Step 8: Commit**

```bash
git add scripts/graphify/checkpoint.mjs .claude-plugin/.mcp.json .claude-plugin/hooks/post-tool-use.mjs tests/graphify-checkpoint.test.mjs
git commit -m "feat(graphify): MCP entry + debounced background checkpoint updates"
```

---

## Task 5: Integration smoke + gitignore + mirror

**Files:**
- Create: `tests/graphify-integration.test.mjs`
- Modify: `.gitignore` (add `graphify-out/`)
- Modify: `plugins/gen/**` (via `sync-mirror`)

**Interfaces:**
- Produces: a gated end-to-end test proving the real graphify CLI builds a graph that `recall()` reads — skipped cleanly when graphify is absent so CI without Python passes.

- [ ] **Step 1: Write the gated integration test**

```javascript
// tests/graphify-integration.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { recall } from '../scripts/memory/recall.mjs';
import { resetCapabilityCache } from '../scripts/graphify/capability.mjs';

function graphifyInstalled() {
  try { execFileSync('graphify', ['--version'], { stdio: 'ignore', timeout: 5000 }); return true; }
  catch { return false; }
}

test('real graphify build + recall (skipped if graphify absent)', { skip: graphifyInstalled() ? false : 'graphify not installed' }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'gfx-int-'));
  writeFileSync(join(dir, 'app.js'), 'export function login(user){ return session(user); }\nfunction session(u){ return u; }\n');
  // build the graph in the fixture dir
  execFileSync('graphify', ['update', '.'], { cwd: dir, timeout: 120000, stdio: 'ignore' });
  const graphPath = join(dir, 'graphify-out', 'graph.json');
  assert.ok(existsSync(graphPath), 'graph.json should be produced');

  resetCapabilityCache();
  const r = recall('login', { graphPath });
  assert.equal(r.provider, 'graphify');
  assert.ok(Array.isArray(r.hits));
});
```

- [ ] **Step 2: Run it**

Run: `node --test tests/graphify-integration.test.mjs`
Expected: PASS — either the real build+recall passes, or the test reports `skipped` (if graphify isn't on PATH). On this machine graphify IS installed, so expect a real PASS.

- [ ] **Step 3: gitignore the derived graph**

Add to `.gitignore`:
```
graphify-out/
```
Confirm: `git status --porcelain | grep graphify-out` returns nothing after a scan.

- [ ] **Step 4: Full suite + mirror**

Run:
```bash
npm test
npm run sync-mirror
npm run check-mirror
```
Expected: all tests pass; mirror clean. **Manually confirm** `plugins/gen/scripts/graphify/` (capability, plan-command, run, checkpoint), `plugins/gen/scripts/memory/recall.mjs`, `plugins/gen/commands/graphify.md`, and the mirrored `.mcp.json` + `post-tool-use.mjs` exist. If `sync-mirror` skips `scripts/graphify/` or `scripts/memory/`, inspect `scripts/sync-mirror.mjs` and copy by hand, noting it. Re-run `check-mirror` until clean.

- [ ] **Step 5: Commit**

```bash
git add tests/graphify-integration.test.mjs .gitignore plugins/gen
git commit -m "test(graphify): gated integration smoke; gitignore graph; mirror sync"
```

---

## Self-Review

**Spec coverage (Phase 1 scope):**
- Recall seam (graphify-or-BM25, observable provider) → Task 2. ✓
- Capability detection / degradation → Task 1; used by recall (Task 2), runner (Task 3), checkpoint (Task 4). ✓
- `gen:graphify` command (scan/update/query/explain/path/status/install) → Task 3. ✓
- graphify MCP entry → Task 4. ✓
- Checkpoint background updates (debounced, non-blocking, silent when absent) → Task 4. ✓
- Integration smoke (gated) + gitignore + mirror → Task 5. ✓
- **Deferred to Phase 2/3 (not in this plan):** Obsidian removal, dashboard graph panel, version bump to 4.3.0, cross-project `merge-graphs` on session-end, config-key migration. Noted in the spec's phasing.

**Placeholder scan:** No TBD/TODO; every code step shows complete code; the one real-subprocess test is explicitly gated. ✓

**Type consistency:** `recall(question, {kind,k,graphPath,deps})` (Task 2) consumes `graphifyAvailable`/`graphExists` exactly as Task 1 exports. `planCommand(sub,args,caps)` (Task 3) consumes the `caps` shape `run.mjs` builds from Task 1's `graphifyAvailable`/`graphExists`/`graphAgeMs`. `isCheckpoint`/`shouldUpdate` (Task 4) match their hook call sites. The `.events`-style ledger `kind` strings used by `isCheckpoint` (`section-shipped`, `decision-made`, `commit-made`, `asset-generated`) match the exact strings `post-tool-use.mjs` already writes to `journal.ndjson`. ✓

**Open items deferred to implementer judgement:** the exact `graphify query` stdout shape (parsed leniently in `parseGraphify`; the integration test asserts only that hits come back, not their text) and whether `graphify-mcp` resolves the relative `graphify-out/graph.json` against the project cwd in the plugin MCP context (verified at runtime; the MCP is optional so a wrong path degrades to BM25, not breakage).
