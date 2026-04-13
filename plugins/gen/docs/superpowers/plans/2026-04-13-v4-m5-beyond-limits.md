# v4 M5 — Built Beyond Limits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship all 8 "beyond limits" features: (F1) streaming pipeline with AG-UI, (F2) cross-project memory graph via sqlite-vec, (F3) self-improving quality judge, (F4) agent marketplace with sandbox, (F5) offline-first mode, (F6) live synthetic-user streaming, (F7) server-driven UI + agentic UX as production defaults, (F8) full WebGPU + WebGL2 fallback everywhere (not just 3D).

**Architecture:** Three new packages: `@genorah/memory-graph` (sqlite-vec + decision log), `@genorah/marketplace` (registry client + sandbox runner), `@genorah/webgpu-effects` (UI-level compute shaders with CSS fallback). Self-improving judge is a new `scripts/judge-calibration/` runner triggered on `/gen:recalibrate`. Offline mode is a configuration switch + cached skill bundles. Synthetic-user streaming extends the `synthetic-persona-prober` worker (M1 scaffold) to run mid-wave.

**Tech Stack:** `better-sqlite3` 11 + `sqlite-vec` 0.1.4 (memory graph — already in M4), `deno` 2.1 (sandbox runtime for third-party agents), `playwright` 1.48, `@copilotkit/runtime` 1.8 (AG-UI emission already present from M1, extended here), WebGPU + WebGL2 via existing `@genorah/canvas-runtime` patterns, `json-schema` 0.4 (offline manifest validation).

**Scope:** 4 weeks. 40 tasks. 3 new packages, 1 registry client + sandbox, 1 judge-calibration runner, extended synthetic-user worker, SDUI scaffolding, WebGPU UI effects, 6 new skills, 2 new commands (`/gen:memory-query`, `/gen:marketplace-run`).

**Milestone completion criteria:**
1. Memory graph records a decision in project A and retrieves it from project B via `/gen:memory-query`
2. Self-improving judge re-weights based on 3+ post-ship deltas
3. At least one third-party marketplace agent installs, runs in sandbox, returns valid Result envelope
4. Full pipeline runs end-to-end with **zero MCP servers** (offline-first smoke test passes)
5. Synthetic-user personas emit findings mid-wave; polisher consumes them before wave merge
6. SDUI pattern: a JSON page-spec renders to a real React tree with no build step
7. WebGPU UI effects (e.g. noise-modulated backdrop blur) ship with CSS `backdrop-filter` fallback
8. 70+ new M5 tests pass (total ~365)

---

## File Structure

### New files
- `packages/memory-graph/{package.json,tsconfig.json,src/*.ts,tests/*.test.ts}`
- `packages/marketplace/{package.json,tsconfig.json,src/*.ts,tests/*.test.ts}`
- `packages/webgpu-effects/{package.json,tsconfig.json,src/*.ts,tests/*.test.ts}`
- `scripts/judge-calibration/{calibrate.mjs,delta-log.mjs,calibrate.test.mjs}`
- `skills/streaming-pipeline-events/SKILL.md`
- `skills/sqlite-vec-memory-graph/SKILL.md`
- `skills/self-improving-judge/SKILL.md`
- `skills/agent-marketplace-client/SKILL.md`
- `skills/offline-first-mode/SKILL.md`
- `skills/synthetic-user-streaming/SKILL.md`
- `commands/gen-memory-query.md`
- `commands/gen-marketplace-run.md`
- `.claude-plugin/hooks/offline-mode-gate.mjs`

### Modified files
- `packages/protocol/src/ag-ui.ts` — extend with new M5 event shapes (streaming progress chunks)
- `agents/workers/observability/synthetic-persona-prober.md` — full body
- `agents/workers/ai-feature/*.md` — 3 bodies (chat-ui, rag-pipeline, agent-trace-ui)
- `commands/gen-agents-publish.md` → no longer a stub; wires to marketplace client
- `commands/gen-agents-discover.md` → wires to marketplace client
- `commands/gen-agents-install.md` → wires to sandbox install flow
- `.claude-plugin/plugin.json` → 4.0.0-alpha.5

---

## Task 1: memory-graph package (schema + record/query)

**Files:**
- Create: `packages/memory-graph/package.json`
- Create: `packages/memory-graph/tsconfig.json`
- Create: `packages/memory-graph/src/schema.ts`
- Create: `packages/memory-graph/src/graph.ts`
- Create: `packages/memory-graph/tests/graph.test.ts`

- [ ] **Step 1: Package manifest (same pattern as M4 generative-archetype — sqlite-vec already installed)**

```json
{
  "name": "@genorah/memory-graph",
  "version": "4.0.0-alpha.5",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": { "build": "tsc -p .", "test": "vitest run" },
  "dependencies": {
    "better-sqlite3": "^11.5.0",
    "sqlite-vec": "^0.1.4",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "typescript": "^5.6.2",
    "vitest": "^2.1.4"
  }
}
```

- [ ] **Step 2: Test**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { rmSync } from "fs";
import { MemoryGraph } from "../src/graph.js";

const TMP = "/tmp/memory-graph-test.db";
beforeEach(() => { try { rmSync(TMP); } catch {} });

describe("MemoryGraph", () => {
  it("records a decision with embedding + metadata", async () => {
    const g = new MemoryGraph({ path: TMP, dims: 4 });
    await g.init();
    await g.record({
      project_id: "proj-a", decision_id: "d-1",
      archetype: "brutalist", score: 218, category: "pre-ship-design-critique",
      summary: "chose wide-weight display over neutral humanist",
      embedding: [0.5, 0.5, 0, 0]
    });
    const res = await g.query({ embedding: [0.5, 0.5, 0, 0], k: 1 });
    expect(res[0].decision_id).toBe("d-1");
  });

  it("filters by archetype + score range", async () => {
    const g = new MemoryGraph({ path: TMP, dims: 4 });
    await g.init();
    await g.record({ project_id: "p1", decision_id: "d-1", archetype: "brutalist", score: 210, category: "x", summary: "", embedding: [1,0,0,0] });
    await g.record({ project_id: "p2", decision_id: "d-2", archetype: "minimal",  score: 185, category: "x", summary: "", embedding: [0,1,0,0] });
    const r = await g.query({ embedding: [1,0,0,0], k: 5, filter: { archetype: "brutalist", min_score: 200 } });
    expect(r).toHaveLength(1);
    expect(r[0].decision_id).toBe("d-1");
  });
});
```

- [ ] **Step 3: Implement schema + graph**

`packages/memory-graph/src/schema.ts`:

```typescript
import { z } from "zod";
export const DecisionRecordSchema = z.object({
  project_id: z.string().min(1),
  decision_id: z.string().min(1),
  archetype: z.string(),
  score: z.number().int().min(0).max(500),
  category: z.string(),
  summary: z.string(),
  embedding: z.array(z.number())
});
export type DecisionRecord = z.infer<typeof DecisionRecordSchema>;

export const QuerySchema = z.object({
  embedding: z.array(z.number()),
  k: z.number().int().min(1).max(100),
  filter: z.object({
    archetype: z.string().optional(),
    min_score: z.number().optional(),
    project_id: z.string().optional()
  }).optional()
});
export type Query = z.infer<typeof QuerySchema>;
```

`packages/memory-graph/src/graph.ts`:

```typescript
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { DecisionRecord } from "./schema.js";

export interface GraphOptions { path: string; dims: number; }

export class MemoryGraph {
  private db: Database.Database;
  constructor(private opts: GraphOptions) {
    this.db = new Database(opts.path);
    sqliteVec.load(this.db);
  }
  async init(): Promise<void> {
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS vec_decisions USING vec0(embedding float[${this.opts.dims}]);
      CREATE TABLE IF NOT EXISTS decisions (
        rowid INTEGER PRIMARY KEY,
        project_id TEXT, decision_id TEXT, archetype TEXT,
        score INTEGER, category TEXT, summary TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_archetype ON decisions(archetype);
      CREATE INDEX IF NOT EXISTS idx_score ON decisions(score);
    `);
  }
  async record(d: DecisionRecord): Promise<void> {
    if (d.embedding.length !== this.opts.dims) throw new Error(`expected ${this.opts.dims} dims`);
    const rowid = this.db.prepare("INSERT INTO vec_decisions(embedding) VALUES (?)").run(new Float32Array(d.embedding)).lastInsertRowid;
    this.db.prepare(`
      INSERT INTO decisions(rowid, project_id, decision_id, archetype, score, category, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(Number(rowid), d.project_id, d.decision_id, d.archetype, d.score, d.category, d.summary);
  }
  async query(q: { embedding: number[]; k: number; filter?: { archetype?: string; min_score?: number; project_id?: string } }): Promise<Array<DecisionRecord & { distance: number }>> {
    const rows = this.db.prepare(`
      SELECT rowid, distance FROM vec_decisions WHERE embedding MATCH ? ORDER BY distance LIMIT ?
    `).all(new Float32Array(q.embedding), q.k * 4) as Array<{ rowid: number; distance: number }>;
    const out: Array<DecisionRecord & { distance: number }> = [];
    for (const r of rows) {
      const meta = this.db.prepare("SELECT * FROM decisions WHERE rowid = ?").get(r.rowid) as any;
      if (!meta) continue;
      if (q.filter?.archetype && meta.archetype !== q.filter.archetype) continue;
      if (q.filter?.min_score != null && meta.score < q.filter.min_score) continue;
      if (q.filter?.project_id && meta.project_id !== q.filter.project_id) continue;
      out.push({ ...meta, embedding: q.embedding, distance: r.distance });
      if (out.length === q.k) break;
    }
    return out;
  }
}
```

- [ ] **Step 4: Run + commit**

```bash
cd packages/memory-graph && npm install
npx vitest run tests/graph.test.ts
git add packages/memory-graph
git commit -m "feat(v4-m5): memory-graph with sqlite-vec"
```

---

## Task 2: `/gen:memory-query` command

**Files:**
- Create: `commands/gen-memory-query.md`
- Create: `scripts/gen-memory-query.mjs`

- [ ] **Step 1: Command + script**

`commands/gen-memory-query.md`:

```markdown
---
description: Query the cross-project memory graph by natural language or archetype
argument-hint: "<natural-language-or-json-filter>"
---

# /gen:memory-query

1. Embed the query string via embedder (Flux Kontext text-to-embedding).
2. Load MemoryGraph from `~/.claude/genorah/memory.db`.
3. Run k=10 nearest query with filters parsed from arguments.
4. Print matching decisions with scores.

Run: `node ${plugin_root}/scripts/gen-memory-query.mjs "$ARGUMENTS"`.
```

`scripts/gen-memory-query.mjs` reads args, embeds (stub — hash-based for offline demo), queries, prints.

- [ ] **Step 2: Commit**

```bash
git add commands/gen-memory-query.md scripts/gen-memory-query.mjs
git commit -m "feat(v4-m5): /gen:memory-query command"
```

---

## Task 3: Post-ship delta log (judge calibration input)

**Files:**
- Create: `scripts/judge-calibration/delta-log.mjs`
- Create: `scripts/judge-calibration/delta-log.test.mjs`

- [ ] **Step 1: Test**

```javascript
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { rmSync } from "fs";
import { DeltaLog } from "./delta-log.mjs";

const TMP = "/tmp/delta-log-test.jsonld";
try { rmSync(TMP); } catch {}

test("append + read roundtrips", async () => {
  const log = new DeltaLog(TMP);
  await log.append({ project_id: "p1", predicted_score: 210, actual_post_ship_score: 195, missed_categories: ["Creative Courage"], observed_at: Date.now() });
  const entries = await log.read();
  assert.equal(entries.length, 1);
  assert.equal(entries[0].predicted_score, 210);
});

test("delta() reports mean error per category", async () => {
  const log = new DeltaLog(TMP);
  await log.append({ project_id: "p2", predicted_score: 220, actual_post_ship_score: 200, missed_categories: ["Creative Courage"], observed_at: Date.now() });
  const r = await log.delta();
  assert.ok(r.mean_error >= 15);
  assert.ok(r.missed_category_counts["Creative Courage"] >= 1);
});
```

- [ ] **Step 2: Implement**

```javascript
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "fs";

export class DeltaLog {
  constructor(path) { this.path = path; }
  async append(entry) {
    appendFileSync(this.path, JSON.stringify(entry) + "\n");
  }
  async read() {
    if (!existsSync(this.path)) return [];
    return readFileSync(this.path, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
  }
  async delta() {
    const rows = await this.read();
    const mean_error = rows.reduce((s, r) => s + Math.abs(r.predicted_score - r.actual_post_ship_score), 0) / rows.length;
    const missed_category_counts = {};
    for (const r of rows) for (const c of (r.missed_categories || [])) missed_category_counts[c] = (missed_category_counts[c] || 0) + 1;
    return { samples: rows.length, mean_error, missed_category_counts };
  }
}
```

- [ ] **Step 3: Run + commit**

```bash
node --test scripts/judge-calibration/delta-log.test.mjs
git add scripts/judge-calibration/
git commit -m "feat(v4-m5): judge calibration delta log"
```

---

## Task 4: Self-improving judge calibration runner

**Files:**
- Create: `scripts/judge-calibration/calibrate.mjs`
- Create: `scripts/judge-calibration/calibrate.test.mjs`

- [ ] **Step 1: Test**

```javascript
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { calibrateWeights } from "./calibrate.mjs";

test("increases weight on category with high mean error", () => {
  const current = { "Creative Courage": 1.2, "Color System": 1.2, "Typography": 1.2 };
  const delta = { samples: 5, mean_error: 20, missed_category_counts: { "Creative Courage": 4, "Color System": 1 } };
  const next = calibrateWeights(current, delta, { max_shift: 0.2 });
  assert.ok(next["Creative Courage"] > current["Creative Courage"]);
  assert.ok(next["Creative Courage"] <= current["Creative Courage"] + 0.2);
});

test("does not shift when mean_error < 10", () => {
  const current = { A: 1, B: 1 };
  const next = calibrateWeights(current, { samples: 3, mean_error: 5, missed_category_counts: { A: 1 } }, { max_shift: 0.2 });
  assert.deepEqual(next, current);
});
```

- [ ] **Step 2: Implement**

```javascript
export function calibrateWeights(currentWeights, delta, opts = {}) {
  const maxShift = opts.max_shift ?? 0.2;
  if (delta.mean_error < 10) return { ...currentWeights };
  const next = { ...currentWeights };
  const total = Object.values(delta.missed_category_counts).reduce((s, n) => s + n, 0) || 1;
  for (const [cat, count] of Object.entries(delta.missed_category_counts)) {
    if (!(cat in next)) continue;
    const shift = Math.min(maxShift, (count / total) * maxShift * 2);
    next[cat] = +(next[cat] + shift).toFixed(2);
  }
  return next;
}
```

- [ ] **Step 3: Run + commit**

```bash
node --test scripts/judge-calibration/calibrate.test.mjs
git add scripts/judge-calibration/calibrate.mjs scripts/judge-calibration/calibrate.test.mjs
git commit -m "feat(v4-m5): self-improving judge weight calibration"
```

---

## Task 5: Wire calibration into `/gen:recalibrate`

**Files:**
- Modify: `commands/gen-recalibrate.md`
- Modify: `scripts/gen-recalibrate.mjs` (assumed existing; else create)

- [ ] **Step 1: Run calibration, update quality-gate-v3 weights file**

Script reads `~/.claude/genorah/post-ship-delta.jsonld`, calls `DeltaLog.delta()`, `calibrateWeights()`, then patches `skills/quality-gate-v3/weights.json` (new file).

- [ ] **Step 2: Commit**

```bash
git add commands/gen-recalibrate.md scripts/gen-recalibrate.mjs skills/quality-gate-v3/weights.json
git commit -m "feat(v4-m5): /gen:recalibrate applies self-improving weights"
```

---

## Task 6: Marketplace package scaffold + registry client

**Files:**
- Create: `packages/marketplace/package.json`
- Create: `packages/marketplace/tsconfig.json`
- Create: `packages/marketplace/src/client.ts`
- Create: `packages/marketplace/tests/client.test.ts`

- [ ] **Step 1: Manifest (minimal deps)**

```json
{
  "name": "@genorah/marketplace",
  "version": "4.0.0-alpha.5",
  "type": "module",
  "main": "./dist/index.js",
  "scripts": { "build": "tsc -p .", "test": "vitest run" },
  "dependencies": {
    "@genorah/protocol": "4.0.0-alpha.1",
    "zod": "^3.23.8"
  },
  "devDependencies": { "typescript": "^5.6.2", "vitest": "^2.1.4" }
}
```

- [ ] **Step 2: Test**

```typescript
import { describe, it, expect, vi } from "vitest";
import { MarketplaceClient } from "../src/client.js";

describe("MarketplaceClient", () => {
  it("discover returns agent summaries", async () => {
    globalThis.fetch = vi.fn(async () => new Response(JSON.stringify({ agents: [{ id: "x/y", version: "1.0.0", tier: "worker", description: "z" }] }), { status: 200 }));
    const c = new MarketplaceClient({ registry: "https://registry.test/v1" });
    const list = await c.discover("typography");
    expect(list[0].id).toBe("x/y");
  });

  it("fetchManifest returns the full agent package", async () => {
    globalThis.fetch = vi.fn(async () => new Response(JSON.stringify({
      id: "x/y", version: "1.0.0", tier: "worker", source_url: "https://registry.test/pkg/xy.tar.gz",
      integrity: "sha256-abc", capabilities: [{ id: "cap1" }]
    }), { status: 200 }));
    const c = new MarketplaceClient({ registry: "https://registry.test/v1" });
    const m = await c.fetchManifest("x/y@1.0.0");
    expect(m.source_url).toBe("https://registry.test/pkg/xy.tar.gz");
  });
});
```

- [ ] **Step 3: Implement**

```typescript
import { z } from "zod";

export const AgentSummarySchema = z.object({
  id: z.string(), version: z.string(), tier: z.enum(["director","worker"]), description: z.string()
});
export const ManifestSchema = z.object({
  id: z.string(), version: z.string(), tier: z.enum(["director","worker"]),
  source_url: z.string().url(), integrity: z.string(),
  capabilities: z.array(z.object({ id: z.string() }))
});

export interface MarketplaceOptions { registry: string; apiToken?: string; }

export class MarketplaceClient {
  constructor(private opts: MarketplaceOptions) {}

  async discover(query: string): Promise<Array<z.infer<typeof AgentSummarySchema>>> {
    const url = `${this.opts.registry}/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) throw new Error(`discover failed ${res.status}`);
    const body = await res.json() as { agents: unknown[] };
    return body.agents.map(a => AgentSummarySchema.parse(a));
  }

  async fetchManifest(idWithVersion: string) {
    const url = `${this.opts.registry}/agents/${encodeURIComponent(idWithVersion)}`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) throw new Error(`fetchManifest failed ${res.status}`);
    return ManifestSchema.parse(await res.json());
  }

  private headers(): Record<string, string> {
    return this.opts.apiToken ? { authorization: `Bearer ${this.opts.apiToken}` } : {};
  }
}
```

- [ ] **Step 4: Run + commit**

```bash
cd packages/marketplace && npm install
npx vitest run tests/client.test.ts
git add packages/marketplace
git commit -m "feat(v4-m5): marketplace client (discover + fetchManifest)"
```

---

## Task 7: Sandbox runner (deno subprocess)

**Files:**
- Create: `packages/marketplace/src/sandbox.ts`
- Create: `packages/marketplace/tests/sandbox.test.ts`

- [ ] **Step 1: Test (uses `--allow-none` to assert isolation)**

```typescript
import { describe, it, expect } from "vitest";
import { runInSandbox } from "../src/sandbox.js";

describe("runInSandbox", () => {
  it("executes a pure script and returns stdout", async () => {
    const src = `const input = JSON.parse(await new Response(Deno.stdin.readable).text()); console.log(JSON.stringify({doubled: input.x * 2}));`;
    const result = await runInSandbox({ entry_source: src, payload: { x: 3 }, timeout_ms: 5000 });
    expect(result.parsed.doubled).toBe(6);
  });

  it("blocks filesystem writes by default", async () => {
    const src = `await Deno.writeTextFile("/tmp/bad", "x"); console.log("{}");`;
    await expect(runInSandbox({ entry_source: src, payload: {}, timeout_ms: 5000 })).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import { spawn } from "child_process";
import { writeFileSync, mkdtempSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export interface SandboxInput {
  entry_source: string;
  payload: unknown;
  timeout_ms: number;
  allow_net?: string[];
}

export interface SandboxResult {
  stdout: string;
  parsed: any;
  duration_ms: number;
}

export async function runInSandbox(input: SandboxInput): Promise<SandboxResult> {
  const dir = mkdtempSync(join(tmpdir(), "genorah-sandbox-"));
  const entry = join(dir, "agent.ts");
  writeFileSync(entry, input.entry_source);
  const allowNet = input.allow_net?.length ? [`--allow-net=${input.allow_net.join(",")}`] : [];
  const args = ["run", "--no-prompt", ...allowNet, entry];
  return await new Promise((resolve, reject) => {
    const started = Date.now();
    const child = spawn("deno", args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = ""; let stderr = "";
    child.stdout.on("data", d => stdout += d.toString());
    child.stderr.on("data", d => stderr += d.toString());
    const to = setTimeout(() => child.kill(), input.timeout_ms);
    child.on("exit", (code) => {
      clearTimeout(to);
      if (code !== 0) return reject(new Error(`sandbox exited ${code}: ${stderr}`));
      try {
        const parsed = JSON.parse(stdout || "{}");
        resolve({ stdout, parsed, duration_ms: Date.now() - started });
      } catch (e) { reject(new Error(`sandbox output not JSON: ${stdout}`)); }
    });
    child.stdin.write(JSON.stringify(input.payload));
    child.stdin.end();
  });
}
```

- [ ] **Step 3: Run + commit (requires deno installed locally; CI needs deno step)**

```bash
cd packages/marketplace && npx vitest run tests/sandbox.test.ts
git add packages/marketplace/src/sandbox.ts packages/marketplace/tests/sandbox.test.ts
git commit -m "feat(v4-m5): deno-backed agent sandbox"
```

---

## Task 8: Install flow (fetch manifest + verify integrity + run in sandbox)

**Files:**
- Create: `packages/marketplace/src/installer.ts`
- Create: `packages/marketplace/tests/installer.test.ts`

- [ ] **Step 1: Test (integrity check failure)**

```typescript
import { describe, it, expect, vi } from "vitest";
import { installAgent } from "../src/installer.js";

describe("installAgent", () => {
  it("rejects when integrity does not match", async () => {
    const fetches = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "x/y", version: "1.0.0", tier: "worker", source_url: "https://cdn/test.tar.gz", integrity: "sha256-wrong", capabilities: [{ id: "c" }] })))
      .mockResolvedValueOnce(new Response(new Uint8Array([1,2,3])));
    globalThis.fetch = fetches as any;
    await expect(installAgent({ registry: "https://r/v1", idWithVersion: "x/y@1.0.0", installDir: "/tmp/install-test" })).rejects.toThrow(/integrity/i);
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { MarketplaceClient } from "./client.js";

export interface InstallInput {
  registry: string;
  idWithVersion: string;
  installDir: string;
  apiToken?: string;
}

export async function installAgent(inp: InstallInput): Promise<{ path: string }>{
  const client = new MarketplaceClient({ registry: inp.registry, apiToken: inp.apiToken });
  const manifest = await client.fetchManifest(inp.idWithVersion);
  const res = await fetch(manifest.source_url);
  const buf = Buffer.from(await res.arrayBuffer());
  const actual = "sha256-" + createHash("sha256").update(buf).digest("hex");
  if (actual !== manifest.integrity) throw new Error(`integrity mismatch expected ${manifest.integrity} got ${actual}`);
  mkdirSync(inp.installDir, { recursive: true });
  const pkgPath = join(inp.installDir, manifest.id.replace("/", "__") + ".tar.gz");
  writeFileSync(pkgPath, buf);
  return { path: pkgPath };
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/marketplace && npx vitest run tests/installer.test.ts
git add packages/marketplace/src/installer.ts packages/marketplace/tests/installer.test.ts
git commit -m "feat(v4-m5): marketplace installer with sha256 integrity check"
```

---

## Task 9: Replace `/gen:agents-{publish,discover,install}` stubs

**Files:**
- Modify: `commands/gen-agents-publish.md`
- Modify: `commands/gen-agents-discover.md`
- Modify: `commands/gen-agents-install.md`
- Create: `scripts/gen-agents-publish.mjs`
- Create: `scripts/gen-agents-discover.mjs`
- Create: `scripts/gen-agents-install.mjs`

- [ ] **Step 1: Wire to MarketplaceClient + installAgent**

Each command invokes its script, which imports the marketplace package and calls the appropriate method. Publish reads the local agent card and POSTs to `${registry}/agents`. Discover calls `discover()`. Install calls `installAgent()` then `runInSandbox()` for smoke.

Registry URL is read from env `GENORAH_MARKETPLACE_URL` (default: `https://registry.genorah.dev/v1` — not yet hosted in v4.0-alpha.5; users can self-host).

- [ ] **Step 2: Commit**

```bash
git add commands/gen-agents-*.md scripts/gen-agents-*.mjs
git commit -m "feat(v4-m5): wire /gen:agents-{publish,discover,install} to marketplace"
```

---

## Task 10: `/gen:marketplace-run` (execute remote agent in sandbox)

**Files:**
- Create: `commands/gen-marketplace-run.md`
- Create: `scripts/gen-marketplace-run.mjs`

- [ ] **Step 1: Command doc**

```markdown
---
description: Execute a marketplace agent in the local sandbox and return its Result envelope
argument-hint: "<id@version> <capability> <json-payload>"
---

# /gen:marketplace-run

1. Ensure agent is installed at `~/.claude/genorah/marketplace/`.
2. Extract source entry from manifest.
3. Run in Deno sandbox via `runInSandbox`.
4. Validate output against `ResultEnvelopeSchema`.
5. Print envelope or error.
```

- [ ] **Step 2: Commit**

```bash
git add commands/gen-marketplace-run.md scripts/gen-marketplace-run.mjs
git commit -m "feat(v4-m5): /gen:marketplace-run command"
```

---

## Task 11: Offline-first mode gate hook

**Files:**
- Create: `.claude-plugin/hooks/offline-mode-gate.mjs`
- Modify: `.claude-plugin/plugin.json`

- [ ] **Step 1: Hook**

```javascript
#!/usr/bin/env node
import { readFileSync } from "fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const offline = process.env.GENORAH_OFFLINE === "1";
if (!offline) process.exit(0);

const tool = input.tool_name || "";
const args = input.tool_input || {};
const NET_TOOLS = ["WebFetch", "WebSearch"];
if (NET_TOOLS.includes(tool)) {
  console.error(`[offline-mode] blocked network tool ${tool}`);
  process.exit(2);
}
// Also block MCP-tool calls whose server_name is in NET_MCP_SERVERS
const NET_MCP = new Set(["rodin", "meshy", "flux-kontext", "recraft", "kling", "nano-banana"]);
if (tool.startsWith("mcp__")) {
  const server = tool.split("__")[1];
  if (NET_MCP.has(server)) {
    console.error(`[offline-mode] blocked MCP call to ${server}`);
    process.exit(2);
  }
}
process.exit(0);
```

- [ ] **Step 2: Register as PreToolUse**

In plugin.json:

```json
{ "event": "PreToolUse", "command": "node ${plugin_root}/.claude-plugin/hooks/offline-mode-gate.mjs" }
```

- [ ] **Step 3: Smoke test**

```bash
GENORAH_OFFLINE=1
echo '{"tool_name":"WebFetch","tool_input":{"url":"https://x"}}' | node .claude-plugin/hooks/offline-mode-gate.mjs; echo $?
```
Expected: exit 2, stderr contains "blocked network tool WebFetch".

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/hooks/offline-mode-gate.mjs .claude-plugin/plugin.json
git commit -m "feat(v4-m5): offline-first gate hook (GENORAH_OFFLINE=1)"
```

---

## Task 12: Synthetic-user streaming worker body

**Files:**
- Modify: `agents/workers/observability/synthetic-persona-prober.md`
- Create: `skills/synthetic-user-streaming/SKILL.md`
- Create: `scripts/synthetic-persona/run-persona.mjs`
- Create: `scripts/synthetic-persona/run-persona.test.mjs`

- [ ] **Step 1: Worker protocol body**

Append to `synthetic-persona-prober.md`:

```markdown
## Protocol (streaming mode)

1. Read section SUMMARY.md + built-artifact URL.
2. Launch Playwright with persona context (viewport, colour scheme, reduced-motion, lang).
3. Execute persona script (6 personas: Skeptic CFO, First-timer, Power user, Mobile, Screen-reader, B1 non-native).
4. Emit AG-UI `AGENT_STATE_UPDATE` events for each completed persona (streaming, not batched).
5. Write findings to `.planning/genorah/sections/<slug>/synthetic-findings.ndjson`.
6. Return Result<{ findings_path, summary }>.

## Skills Invoked

- `synthetic-user-testing`
- `synthetic-user-streaming`

## Followups

- Any CRITICAL finding → `{ suggested_worker: "a11y-polisher", reason: "screen-reader persona flagged" }`.
- 3+ MAJOR findings on same section → `{ suggested_worker: "creative-director", reason: "request GAP-FIX" }`.
```

- [ ] **Step 2: Test the runner**

```javascript
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { runPersonaOnMock } from "./run-persona.mjs";

test("runs a persona and returns findings shape", async () => {
  const r = await runPersonaOnMock({ persona: "skeptic-cfo", url: "about:blank" });
  assert.ok(Array.isArray(r.findings));
  assert.equal(typeof r.summary, "string");
});
```

Implement `run-persona.mjs` exporting a deterministic mock (real Playwright integration runs via the existing `synthetic-persona-prober` agent).

- [ ] **Step 3: Commit**

```bash
node --test scripts/synthetic-persona/run-persona.test.mjs
git add agents/workers/observability/synthetic-persona-prober.md skills/synthetic-user-streaming scripts/synthetic-persona/
git commit -m "feat(v4-m5): synthetic-persona streaming mode + findings file"
```

---

## Task 13: Consume streaming findings in polisher

**Files:**
- Modify: `agents/workers/polish/polisher.md`
- Modify: `agents/directors/wave-director.md`

- [ ] **Step 1: Polisher protocol update**

Append:

```markdown
## Streaming Findings Input

Before running GAP-FIX.md corrections, polisher reads `.planning/genorah/sections/<slug>/synthetic-findings.ndjson`. Any line with severity=CRITICAL must be addressed and marked resolved in a new `synthetic-fixes.ndjson`.

Polisher returns `partial` status if any CRITICAL remains unresolved after 1 cycle.
```

- [ ] **Step 2: Wave-director dispatch order**

Append to wave-director:

```markdown
## Wave Completion Check

Before merging worktrees:
1. For each section: verify `synthetic-findings.ndjson` has zero unresolved CRITICAL entries.
2. If any remain, dispatch polisher once more.
3. If still unresolved after 2 cycles, escalate to user via AG-UI `ERROR` event.
```

- [ ] **Step 3: Commit**

```bash
git add agents/workers/polish/polisher.md agents/directors/wave-director.md
git commit -m "feat(v4-m5): wave-director + polisher consume synthetic findings"
```

---

## Task 14: SDUI renderer + schema (for F7)

**Files:**
- Create: `packages/sdui/package.json`
- Create: `packages/sdui/tsconfig.json`
- Create: `packages/sdui/src/schema.ts`
- Create: `packages/sdui/src/renderer.tsx`
- Create: `packages/sdui/tests/renderer.test.tsx`

- [ ] **Step 1: Manifest**

```json
{
  "name": "@genorah/sdui",
  "version": "4.0.0-alpha.5",
  "type": "module",
  "main": "./dist/index.js",
  "peerDependencies": { "react": "^19.0.0" },
  "dependencies": { "zod": "^3.23.8" },
  "devDependencies": {
    "typescript": "^5.6.2", "vitest": "^2.1.4",
    "@testing-library/react": "^16.0.0", "happy-dom": "^15.0.0",
    "@types/react": "^19.0.0"
  },
  "scripts": { "build": "tsc -p .", "test": "vitest run" }
}
```

- [ ] **Step 2: Schema (discriminated union)**

```typescript
import { z } from "zod";

export const HeroSchema = z.object({ kind: z.literal("hero"), heading: z.string(), sub: z.string().optional(), cta: z.object({ label: z.string(), href: z.string() }).optional() });
export const TextSchema = z.object({ kind: z.literal("text"), body: z.string() });
export const GridSchema = z.object({ kind: z.literal("grid"), columns: z.number().int().min(1).max(12), children: z.array(z.any()) });
export const SectionSchema = z.discriminatedUnion("kind", [HeroSchema, TextSchema, GridSchema]);
export const PageSchema = z.object({ schema_version: z.literal("4.0.0"), sections: z.array(SectionSchema) });
export type Page = z.infer<typeof PageSchema>;
```

- [ ] **Step 3: Renderer**

```typescript
import React from "react";
import type { Page } from "./schema.js";

export function PageRenderer({ page }: { page: Page }) {
  return <>{page.sections.map((s, i) => <SectionRenderer key={i} section={s} />)}</>;
}

function SectionRenderer({ section }: { section: any }) {
  if (section.kind === "hero") {
    return <section data-sdui="hero">
      <h1>{section.heading}</h1>
      {section.sub && <p>{section.sub}</p>}
      {section.cta && <a href={section.cta.href}>{section.cta.label}</a>}
    </section>;
  }
  if (section.kind === "text") return <section data-sdui="text"><p>{section.body}</p></section>;
  if (section.kind === "grid") return <section data-sdui="grid" style={{ display: "grid", gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}>
    {section.children.map((c: any, i: number) => <SectionRenderer key={i} section={c} />)}
  </section>;
  return null;
}
```

- [ ] **Step 4: Test**

```typescript
// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { PageRenderer } from "../src/renderer.js";

describe("PageRenderer", () => {
  it("renders hero with heading + CTA", () => {
    const { getByText } = render(<PageRenderer page={{ schema_version: "4.0.0", sections: [{ kind: "hero", heading: "X", cta: { label: "Go", href: "/a" } }] }} />);
    expect(getByText("X")).toBeTruthy();
    expect(getByText("Go")).toBeTruthy();
  });
  it("renders grid with N columns", () => {
    const { container } = render(<PageRenderer page={{ schema_version: "4.0.0", sections: [{ kind: "grid", columns: 3, children: [] }] }} />);
    expect(container.querySelector("[data-sdui='grid']")!.getAttribute("style")).toMatch(/repeat\(3,\s*1fr\)/);
  });
});
```

- [ ] **Step 5: Run + commit**

```bash
cd packages/sdui && npm install && npx vitest run
git add packages/sdui
git commit -m "feat(v4-m5): SDUI schema + renderer"
```

---

## Task 15: WebGPU-effects package (UI-level compute + CSS fallback)

**Files:**
- Create: `packages/webgpu-effects/package.json`
- Create: `packages/webgpu-effects/src/NoiseBackdrop.tsx`
- Create: `packages/webgpu-effects/src/DitherOverlay.tsx`
- Create: `packages/webgpu-effects/src/ColorGradeLUT.tsx`
- Create: `packages/webgpu-effects/tests/*.test.tsx`

- [ ] **Step 1: Manifest (peer-depends on canvas-runtime, not a hard dep)**

```json
{
  "name": "@genorah/webgpu-effects",
  "version": "4.0.0-alpha.5",
  "type": "module",
  "main": "./dist/index.js",
  "peerDependencies": { "react": "^19.0.0" },
  "dependencies": { "@genorah/canvas-runtime": "4.0.0-alpha.2" },
  "devDependencies": { "typescript": "^5.6.2", "vitest": "^2.1.4", "@testing-library/react": "^16.0.0", "happy-dom": "^15.0.0" },
  "scripts": { "build": "tsc -p .", "test": "vitest run" }
}
```

- [ ] **Step 2: NoiseBackdrop component (WebGPU path + CSS fallback)**

```typescript
import React, { useEffect, useState } from "react";
import { probeCapabilities } from "@genorah/canvas-runtime";

export function NoiseBackdrop({ intensity = 0.12 }: { intensity?: number }) {
  const [mode, setMode] = useState<"probing"|"webgpu"|"css">("probing");
  useEffect(() => { probeCapabilities().then(c => setMode(c.webgpu ? "webgpu" : "css")); }, []);
  if (mode === "probing") return null;
  if (mode === "css") {
    return <div data-effect="noise-backdrop-css"
      style={{ position: "fixed", inset: 0, pointerEvents: "none",
               backgroundImage: "url('/noise.png')", opacity: intensity, mixBlendMode: "overlay" }} />;
  }
  return <div data-effect="noise-backdrop-webgpu" />;
  // Production body: dispatch a 2D WGSL noise compute pass into a texture blended over page.
}
```

- [ ] **Step 3: Test (fallback path)**

```typescript
// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { NoiseBackdrop } from "../src/NoiseBackdrop.js";

describe("NoiseBackdrop", () => {
  it("falls back to CSS when WebGPU unavailable", async () => {
    const { container } = render(<NoiseBackdrop intensity={0.1} />);
    await waitFor(() => expect(container.querySelector("[data-effect='noise-backdrop-css']")).toBeTruthy());
  });
});
```

- [ ] **Step 4: Implement DitherOverlay + ColorGradeLUT similarly (repeat pattern, each has CSS fallback via SVG filter or backdrop-filter)**

- [ ] **Step 5: Run + commit**

```bash
cd packages/webgpu-effects && npm install && npx vitest run
git add packages/webgpu-effects
git commit -m "feat(v4-m5): webgpu-effects package (noise, dither, color-grade)"
```

---

## Task 16: 3 AI-feature worker bodies

**Files:**
- Modify: `agents/workers/ai-feature/chat-ui-author.md`
- Modify: `agents/workers/ai-feature/rag-pipeline-author.md`
- Modify: `agents/workers/ai-feature/agent-trace-ui-author.md`

- [ ] **Step 1: Bodies**

Same format as asset workers — protocol section, skills invoked, followups. Each references AI SDK v6 patterns and uses the `AI Elements` component library (ai-ui-components skill).

- [ ] **Step 2: Commit**

```bash
git add agents/workers/ai-feature/
git commit -m "feat(v4-m5): AI-feature worker bodies (chat, rag, agent-trace)"
```

---

## Task 17: 6 skill docs (M5 group)

**Files:**
- Create: `skills/streaming-pipeline-events/SKILL.md`
- Create: `skills/sqlite-vec-memory-graph/SKILL.md`
- Create: `skills/self-improving-judge/SKILL.md`
- Create: `skills/agent-marketplace-client/SKILL.md`
- Create: `skills/offline-first-mode/SKILL.md`
- Create: `skills/synthetic-user-streaming/SKILL.md` (may already be created in Task 12 — ensure it exists)

- [ ] **Step 1: 4-layer docs each**

Each doc covers Decision / Examples / Integration / Anti-patterns for its feature, referencing the M5 implementations.

- [ ] **Step 2: Commit**

```bash
git add skills/streaming-pipeline-events skills/sqlite-vec-memory-graph skills/self-improving-judge skills/agent-marketplace-client skills/offline-first-mode
git commit -m "feat(v4-m5): 6 beyond-limits skills"
```

---

## Task 18: Integration test — full offline pipeline smoke

**Files:**
- Create: `scripts/tests/offline-smoke.mjs`

- [ ] **Step 1: Write runner**

```javascript
#!/usr/bin/env node
import { spawn } from "child_process";

const env = { ...process.env, GENORAH_OFFLINE: "1" };
const child = spawn("node", ["scripts/gen-self-audit.mjs"], { env, stdio: "inherit" });
child.on("exit", code => process.exit(code ?? 1));
```

- [ ] **Step 2: Run**

```bash
node scripts/tests/offline-smoke.mjs
```
Expected: exit 0. Self-audit passes without any MCP or WebFetch call.

- [ ] **Step 3: Commit**

```bash
git add scripts/tests/offline-smoke.mjs
git commit -m "test(v4-m5): offline smoke (self-audit runs with GENORAH_OFFLINE=1)"
```

---

## Task 19: Regenerate agent cards + bump

- [ ] **Step 1: Regenerate**

```bash
node scripts/generate-agent-cards.mjs
```
Expected: still 108 cards (no agent count changes in M5).

- [ ] **Step 2: Bump version**

`.claude-plugin/plugin.json`: `"version": "4.0.0-alpha.5"`.

- [ ] **Step 3: Commit + tag**

```bash
git add .claude-plugin/plugin.json .claude-plugin/generated
git commit -m "chore(v4-m5): 4.0.0-alpha.5"
git tag v4.0.0-alpha.5 -m "v4 M5 shipping: beyond limits"
```

---

## Task 20: M5 regression

- [ ] **Step 1: All tests**

```bash
cd packages/protocol && npm test
cd ../canvas-runtime && npm test
cd ../asset-forge && npm test
cd ../living-system-runtime && npm test
cd ../generative-archetype && npm test
cd ../memory-graph && npm test
cd ../marketplace && npm test
cd ../sdui && npm test
cd ../webgpu-effects && npm test
cd ../.. && npm test
node --test scripts/validators/*.test.mjs scripts/judge-calibration/*.test.mjs scripts/synthetic-persona/*.test.mjs
```
Expected: ~365 passing.

- [ ] **Step 2: Completion summary**

Create `docs/superpowers/plans/v4-m5-completion.md`.

---

## M5 Exit Criteria

- [ ] memory-graph: record + query across projects works
- [ ] judge calibration re-weights based on delta log
- [ ] Marketplace: publish → discover → install → sandbox run round-trips
- [ ] `GENORAH_OFFLINE=1` blocks all network calls; self-audit still passes
- [ ] Synthetic-persona findings stream into wave-director; polisher resolves CRITICAL pre-merge
- [ ] SDUI renderer renders hero + grid + text sections from JSON
- [ ] webgpu-effects ships NoiseBackdrop + DitherOverlay + ColorGradeLUT with CSS fallbacks
- [ ] 3 AI-feature workers have full bodies
- [ ] `v4.0.0-alpha.5` tag
