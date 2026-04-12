# v4 M3 — Asset Forge 2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the photoreal composite pipeline with 5 new MCP integrations (Rodin Gen-2, Meshy 5, Flux Kontext, Recraft V3, Kling 2.1), recipe-driven orchestration, user-global asset cache, full provenance tracking, per-project soft budget with downgrade chain, and the new 13th quality category "Scene Craft".

**Architecture:** A new `@genorah/asset-forge` npm package exposes provider adapters, cache, cost ledger, and recipe executor. `asset-director` (M1 scaffold) grows into a full director that reads YAML recipes from `recipes/*.yml` and dispatches asset workers in the recipe order, injecting followups as dynamic corrections. Cache is sha256-keyed at `~/.claude/genorah/asset-cache/`. Provenance flows into `public/assets/MANIFEST.json` via an extended `asset-forge-manifest` skill schema.

**Tech Stack:** Node.js 24, TypeScript 5.6, Zod 3.23, `yaml` 2.6, native `fetch`, `sharp` 0.33 (image resize), `p-limit` 6 (concurrency), `keyv` 5 + `@keyv/sqlite` 4 (persistent cache metadata), `@modelcontextprotocol/sdk` (MCP clients).

**Scope:** 4 weeks. 32 tasks. 5 new MCP adapters, 1 new package, 8+1 asset worker full bodies, recipe executor, cache, cost ledger, provenance writer, Scene Craft gate category.

**Milestone completion criteria:**
1. `@genorah/asset-forge` package with all 5 provider adapters + cache + cost ledger + recipe executor
2. At least 3 working composite recipes (`photoreal-character-product.yml`, `hero-scene.yml`, `brand-marks.yml`)
3. `public/assets/MANIFEST.json` tracks full provenance per spec §5.4
4. Cost ledger enforces per-project soft budget; downgrade chain triggers on breach
5. User-global cache at `~/.claude/genorah/asset-cache/` eliminates redundant API spend across projects
6. Scene Craft (20 pts) category added to quality gate, bringing Design Craft axis to 254
7. 50+ new M3 tests pass (total ~245)

---

## File Structure

### New files
- `packages/asset-forge/package.json`
- `packages/asset-forge/tsconfig.json`
- `packages/asset-forge/src/providers/base.ts` — common `AssetProvider` interface
- `packages/asset-forge/src/providers/rodin.ts`
- `packages/asset-forge/src/providers/meshy.ts`
- `packages/asset-forge/src/providers/flux-kontext.ts`
- `packages/asset-forge/src/providers/recraft.ts`
- `packages/asset-forge/src/providers/kling.ts`
- `packages/asset-forge/src/providers/nano-banana.ts` (wraps existing MCP)
- `packages/asset-forge/src/cache.ts` — sha256-keyed store + metadata
- `packages/asset-forge/src/cost-ledger.ts`
- `packages/asset-forge/src/recipe.ts` — YAML recipe parser + executor
- `packages/asset-forge/src/provenance.ts` — MANIFEST.json writer
- `packages/asset-forge/src/schemas/recipe.schema.ts`
- `packages/asset-forge/src/schemas/manifest.schema.ts`
- `packages/asset-forge/src/index.ts`
- `packages/asset-forge/tests/*.test.ts` (11 test files)
- `recipes/photoreal-character-product.yml`
- `recipes/hero-scene.yml`
- `recipes/brand-marks.yml`
- `skills/photoreal-compositing-pipeline/SKILL.md`
- `skills/composite-recipes/SKILL.md`
- `skills/texture-provenance/SKILL.md`
- `skills/user-global-asset-cache/SKILL.md`
- `skills/cost-governance/SKILL.md`
- `.claude-plugin/.mcp.json` — new server entries (5 optional)

### Modified files
- `agents/directors/asset-director.md` — full body
- `agents/workers/asset/*.md` — 9 worker bodies (flux-hero-gen, nano-banana-iterator, rodin-3d-gen, meshy-prototyper, character-poser, inpainter, upscaler, recraft-vector-author, video-reel-gen)
- `skills/asset-forge-manifest/SKILL.md` — extend manifest schema
- `skills/quality-gate-v2/SKILL.md` → `skills/quality-gate-v3/SKILL.md` (new file, with Scene Craft 13th category)
- `.claude-plugin/plugin.json` → 4.0.0-alpha.3

---

## Task 1: Asset-forge package scaffold

**Files:**
- Create: `packages/asset-forge/package.json`
- Create: `packages/asset-forge/tsconfig.json`

- [ ] **Step 1: Package manifest**

`packages/asset-forge/package.json`:

```json
{
  "name": "@genorah/asset-forge",
  "version": "4.0.0-alpha.3",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": { "build": "tsc -p .", "test": "vitest run" },
  "dependencies": {
    "zod": "^3.23.8",
    "yaml": "^2.6.0",
    "sharp": "^0.33.5",
    "p-limit": "^6.1.0",
    "keyv": "^5.2.1",
    "@keyv/sqlite": "^4.0.0",
    "@genorah/protocol": "4.0.0-alpha.1"
  },
  "devDependencies": {
    "typescript": "^5.6.2",
    "vitest": "^2.1.4",
    "@types/node": "^24.0.0"
  }
}
```

- [ ] **Step 2: tsconfig (same template)**

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "declaration": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Install + commit**

```bash
cd packages/asset-forge && npm install
git add packages/asset-forge/package.json packages/asset-forge/tsconfig.json
git commit -m "feat(v4-m3): @genorah/asset-forge workspace"
```

---

## Task 2: AssetProvider base interface + dummy provider (test-first)

**Files:**
- Create: `packages/asset-forge/src/providers/base.ts`
- Create: `packages/asset-forge/tests/providers-base.test.ts`

- [ ] **Step 1: Test the shape**

```typescript
import { describe, it, expect } from "vitest";
import { DummyProvider } from "../src/providers/base.js";

describe("AssetProvider base", () => {
  it("DummyProvider returns a deterministic artifact", async () => {
    const p = new DummyProvider();
    const r = await p.generate({ prompt: "hi" });
    expect(r.provider).toBe("dummy");
    expect(r.cost_usd).toBe(0);
    expect(typeof r.sha256).toBe("string");
  });

  it("exposes cost estimation", async () => {
    const p = new DummyProvider();
    const est = await p.estimateCost({ prompt: "hi" });
    expect(est.cost_usd).toBe(0);
    expect(est.duration_ms_estimate).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Implement base + dummy**

```typescript
import { createHash } from "crypto";

export interface AssetInput {
  prompt: string;
  reference_paths?: string[];
  seed?: number;
  params?: Record<string, unknown>;
}

export interface AssetResult {
  provider: string;
  model?: string;
  sha256: string;
  path: string;
  bytes: number;
  cost_usd: number;
  duration_ms: number;
  input: AssetInput;
}

export interface CostEstimate {
  cost_usd: number;
  duration_ms_estimate: number;
}

export interface AssetProvider {
  readonly name: string;
  readonly kind: "image" | "3d" | "vector" | "video";
  estimateCost(input: AssetInput): Promise<CostEstimate>;
  generate(input: AssetInput): Promise<AssetResult>;
}

export class DummyProvider implements AssetProvider {
  readonly name = "dummy";
  readonly kind = "image";
  async estimateCost(): Promise<CostEstimate> {
    return { cost_usd: 0, duration_ms_estimate: 100 };
  }
  async generate(input: AssetInput): Promise<AssetResult> {
    const sha = createHash("sha256").update(JSON.stringify(input)).digest("hex");
    return {
      provider: "dummy",
      sha256: sha,
      path: `/tmp/dummy-${sha}.bin`,
      bytes: 0,
      cost_usd: 0,
      duration_ms: 100,
      input
    };
  }
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/providers-base.test.ts
git add packages/asset-forge/src/providers/base.ts packages/asset-forge/tests/providers-base.test.ts
git commit -m "feat(v4-m3): AssetProvider interface + DummyProvider"
```

---

## Task 3: sha256-keyed user-global cache (test-first)

**Files:**
- Create: `packages/asset-forge/src/cache.ts`
- Create: `packages/asset-forge/tests/cache.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { mkdirSync, rmSync } from "fs";
import { AssetCache, computeCacheKey } from "../src/cache.js";

const TMP = "/tmp/genorah-cache-test";

beforeEach(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
});

describe("AssetCache", () => {
  it("computeCacheKey is stable for same input", () => {
    const a = computeCacheKey({ provider: "rodin", model: "gen-2", prompt: "hero", seed: 1, reference_hashes: [] });
    const b = computeCacheKey({ provider: "rodin", model: "gen-2", prompt: "hero", seed: 1, reference_hashes: [] });
    expect(a).toEqual(b);
  });

  it("computeCacheKey differs when seed changes", () => {
    const a = computeCacheKey({ provider: "rodin", model: "gen-2", prompt: "x", seed: 1, reference_hashes: [] });
    const b = computeCacheKey({ provider: "rodin", model: "gen-2", prompt: "x", seed: 2, reference_hashes: [] });
    expect(a).not.toEqual(b);
  });

  it("set/get roundtrips metadata", async () => {
    const cache = new AssetCache({ rootDir: TMP });
    await cache.init();
    const key = "abc123";
    await cache.set(key, { path: "/tmp/x.bin", sha256: "abc", bytes: 10, provider: "rodin", cost_usd: 0.35, cached_at: Date.now() });
    const hit = await cache.get(key);
    expect(hit?.sha256).toBe("abc");
  });

  it("miss returns null", async () => {
    const cache = new AssetCache({ rootDir: TMP });
    await cache.init();
    expect(await cache.get("nope")).toBeNull();
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import { createHash } from "crypto";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";
import Keyv from "keyv";
import KeyvSqlite from "@keyv/sqlite";

export interface CacheKeyInput {
  provider: string;
  model?: string;
  prompt: string;
  seed?: number;
  reference_hashes: string[];
}

export function computeCacheKey(input: CacheKeyInput): string {
  const normalized = JSON.stringify({
    p: input.provider,
    m: input.model ?? "",
    r: input.prompt,
    s: input.seed ?? 0,
    refs: [...input.reference_hashes].sort()
  });
  return createHash("sha256").update(normalized).digest("hex");
}

export interface CacheEntry {
  path: string;
  sha256: string;
  bytes: number;
  provider: string;
  cost_usd: number;
  cached_at: number;
}

export interface CacheOptions {
  rootDir: string;
}

export class AssetCache {
  private keyv: Keyv<CacheEntry>;
  readonly rootDir: string;

  constructor(opts: CacheOptions) {
    this.rootDir = opts.rootDir;
    const dbPath = join(opts.rootDir, "metadata.sqlite");
    this.keyv = new Keyv<CacheEntry>({ store: new KeyvSqlite(`sqlite://${dbPath}`) });
  }

  async init(): Promise<void> {
    if (!existsSync(this.rootDir)) mkdirSync(this.rootDir, { recursive: true });
  }

  async get(key: string): Promise<CacheEntry | null> {
    const v = await this.keyv.get(key);
    return v ?? null;
  }

  async set(key: string, entry: CacheEntry): Promise<void> {
    await this.keyv.set(key, entry);
  }

  async has(key: string): Promise<boolean> {
    return (await this.keyv.get(key)) !== undefined;
  }

  blobPath(key: string): string {
    return join(this.rootDir, "blobs", key.slice(0, 2), key);
  }
}

export function defaultCacheDir(): string {
  return join(process.env.HOME ?? process.env.USERPROFILE ?? ".", ".claude/genorah/asset-cache");
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/cache.test.ts
git add packages/asset-forge/src/cache.ts packages/asset-forge/tests/cache.test.ts
git commit -m "feat(v4-m3): sha256 user-global asset cache"
```

---

## Task 4: Cost ledger (test-first)

**Files:**
- Create: `packages/asset-forge/src/cost-ledger.ts`
- Create: `packages/asset-forge/tests/cost-ledger.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect } from "vitest";
import { CostLedger } from "../src/cost-ledger.js";

describe("CostLedger", () => {
  it("starts at zero spend", () => {
    const l = new CostLedger({ budget_usd: 30 });
    expect(l.spend_usd).toBe(0);
    expect(l.status()).toBe("ok");
  });

  it("transitions to warn at >= 80% of budget", () => {
    const l = new CostLedger({ budget_usd: 10 });
    l.record({ provider: "rodin", cost_usd: 8 });
    expect(l.status()).toBe("warn");
  });

  it("transitions to exceeded over budget", () => {
    const l = new CostLedger({ budget_usd: 10 });
    l.record({ provider: "rodin", cost_usd: 12 });
    expect(l.status()).toBe("exceeded");
  });

  it("pickDowngrade returns the cheaper provider when over budget", () => {
    const l = new CostLedger({ budget_usd: 10, downgrade_chain: { rodin: "meshy", kling: "flux-kontext" } });
    l.record({ provider: "rodin", cost_usd: 12 });
    expect(l.pickDowngrade("rodin")).toBe("meshy");
  });

  it("preview does not mutate ledger", () => {
    const l = new CostLedger({ budget_usd: 10 });
    l.preview({ provider: "rodin", cost_usd: 5 });
    expect(l.spend_usd).toBe(0);
  });
});
```

- [ ] **Step 2: Implement**

```typescript
export interface LedgerEntry { provider: string; cost_usd: number; at?: number; note?: string; }
export interface LedgerOptions {
  budget_usd: number;
  warn_at: number; // 0..1
  downgrade_chain?: Record<string, string>;
}
export type LedgerStatus = "ok" | "warn" | "exceeded";

export class CostLedger {
  readonly opts: LedgerOptions;
  readonly entries: LedgerEntry[] = [];
  constructor(opts: Partial<LedgerOptions> & { budget_usd: number }) {
    this.opts = { warn_at: 0.8, ...opts } as LedgerOptions;
  }
  get spend_usd(): number {
    return this.entries.reduce((s, e) => s + e.cost_usd, 0);
  }
  record(entry: LedgerEntry): void {
    this.entries.push({ ...entry, at: entry.at ?? Date.now() });
  }
  preview(entry: LedgerEntry): { would_exceed: boolean; projected_spend: number } {
    const projected = this.spend_usd + entry.cost_usd;
    return { would_exceed: projected > this.opts.budget_usd, projected_spend: projected };
  }
  status(): LedgerStatus {
    const ratio = this.spend_usd / this.opts.budget_usd;
    if (ratio > 1) return "exceeded";
    if (ratio >= this.opts.warn_at) return "warn";
    return "ok";
  }
  pickDowngrade(provider: string): string | null {
    return this.opts.downgrade_chain?.[provider] ?? null;
  }
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/cost-ledger.test.ts
git add packages/asset-forge/src/cost-ledger.ts packages/asset-forge/tests/cost-ledger.test.ts
git commit -m "feat(v4-m3): cost ledger with warn/exceeded states + downgrade chain"
```

---

## Task 5: Manifest schema + writer (test-first)

**Files:**
- Create: `packages/asset-forge/src/schemas/manifest.schema.ts`
- Create: `packages/asset-forge/src/provenance.ts`
- Create: `packages/asset-forge/tests/provenance.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { rmSync, mkdirSync, readFileSync, existsSync } from "fs";
import { ProvenanceWriter } from "../src/provenance.js";

const TMP = "/tmp/genorah-prov-test";

beforeEach(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
});

describe("ProvenanceWriter", () => {
  it("creates a fresh manifest when none exists", async () => {
    const w = new ProvenanceWriter({ path: `${TMP}/MANIFEST.json` });
    await w.append({
      path: "public/assets/hero.glb",
      sha256: "abc",
      bytes: 1234,
      provider: "rodin",
      model: "gen-2",
      seed: 42,
      prompt: "stone bust",
      reference_hashes: [],
      cost_usd: 0.35,
      duration_ms: 90_000,
      cache_hit: false,
      dna_compliance_pass: true
    });
    expect(existsSync(`${TMP}/MANIFEST.json`)).toBe(true);
    const m = JSON.parse(readFileSync(`${TMP}/MANIFEST.json`, "utf8"));
    expect(m.entries).toHaveLength(1);
    expect(m.entries[0].provider).toBe("rodin");
  });

  it("dedupes by sha256 when re-appended", async () => {
    const w = new ProvenanceWriter({ path: `${TMP}/MANIFEST.json` });
    const entry = { path: "public/assets/x.jpg", sha256: "s1", bytes: 10, provider: "flux-kontext", seed: 1, prompt: "x", reference_hashes: [], cost_usd: 0.05, duration_ms: 5000, cache_hit: false, dna_compliance_pass: true };
    await w.append(entry); await w.append(entry);
    const m = JSON.parse(readFileSync(`${TMP}/MANIFEST.json`, "utf8"));
    expect(m.entries).toHaveLength(1);
  });

  it("preserves parent_sha256 for derivative assets", async () => {
    const w = new ProvenanceWriter({ path: `${TMP}/MANIFEST.json` });
    await w.append({ path: "a.jpg", sha256: "parent", bytes: 10, provider: "flux-kontext", prompt: "parent", reference_hashes: [], cost_usd: 0.05, duration_ms: 1000, cache_hit: false, dna_compliance_pass: true });
    await w.append({ path: "a-up.jpg", sha256: "child", bytes: 40, provider: "upscaler", prompt: "2x", reference_hashes: [], cost_usd: 0, duration_ms: 2000, cache_hit: false, dna_compliance_pass: true, parent_sha256: "parent" });
    const m = JSON.parse(readFileSync(`${TMP}/MANIFEST.json`, "utf8"));
    expect(m.entries.find((e: any) => e.sha256 === "child").parent_sha256).toBe("parent");
  });
});
```

- [ ] **Step 2: Implement schema + writer**

`packages/asset-forge/src/schemas/manifest.schema.ts`:

```typescript
import { z } from "zod";

export const ManifestEntrySchema = z.object({
  path: z.string(),
  sha256: z.string().length(64).or(z.string().min(1)),
  bytes: z.number().int().nonnegative(),
  provider: z.string(),
  model: z.string().optional(),
  seed: z.number().optional(),
  prompt: z.string(),
  reference_hashes: z.array(z.string()),
  cost_usd: z.number().nonnegative(),
  duration_ms: z.number().nonnegative(),
  cache_hit: z.boolean(),
  dna_compliance_pass: z.boolean(),
  parent_sha256: z.string().optional(),
  recorded_at: z.string().optional()
});
export type ManifestEntry = z.infer<typeof ManifestEntrySchema>;

export const ManifestSchema = z.object({
  schema_version: z.literal("4.0.0"),
  entries: z.array(ManifestEntrySchema)
});
export type Manifest = z.infer<typeof ManifestSchema>;
```

`packages/asset-forge/src/provenance.ts`:

```typescript
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { ManifestSchema, ManifestEntry, Manifest } from "./schemas/manifest.schema.js";

export interface WriterOptions { path: string; }

export class ProvenanceWriter {
  constructor(private opts: WriterOptions) {}

  read(): Manifest {
    if (!existsSync(this.opts.path)) return { schema_version: "4.0.0", entries: [] };
    return ManifestSchema.parse(JSON.parse(readFileSync(this.opts.path, "utf8")));
  }

  async append(entry: Omit<ManifestEntry, "recorded_at">): Promise<void> {
    const manifest = this.read();
    if (manifest.entries.some(e => e.sha256 === entry.sha256)) return;
    manifest.entries.push({ ...entry, recorded_at: new Date().toISOString() });
    mkdirSync(dirname(this.opts.path), { recursive: true });
    writeFileSync(this.opts.path, JSON.stringify(manifest, null, 2));
  }
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/provenance.test.ts
git add packages/asset-forge/src/schemas/manifest.schema.ts packages/asset-forge/src/provenance.ts packages/asset-forge/tests/provenance.test.ts
git commit -m "feat(v4-m3): manifest schema + provenance writer"
```

---

## Task 6: Rodin Gen-2 provider adapter (test-first, with mocked fetch)

**Files:**
- Create: `packages/asset-forge/src/providers/rodin.ts`
- Create: `packages/asset-forge/tests/providers-rodin.test.ts`

- [ ] **Step 1: Test with mocked fetch**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RodinProvider } from "../src/providers/rodin.js";

beforeEach(() => { vi.restoreAllMocks(); });

describe("RodinProvider", () => {
  it("estimates $0.35/model", async () => {
    const p = new RodinProvider({ apiKey: "test" });
    const est = await p.estimateCost({ prompt: "bust" });
    expect(est.cost_usd).toBeCloseTo(0.35);
  });

  it("generates via POST to API, returns AssetResult", async () => {
    const fakeResponse = {
      id: "gen_abc",
      status: "succeeded",
      output: { url: "https://cdn.rodin.ai/abc.glb", bytes: 2_800_000 }
    };
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(fakeResponse), { status: 200 }));
    globalThis.fetch = fetchMock;
    const p = new RodinProvider({ apiKey: "test", downloadDir: "/tmp/rodin-test" });
    const r = await p.generate({ prompt: "bust" });
    expect(r.provider).toBe("rodin");
    expect(r.cost_usd).toBeCloseTo(0.35);
    expect(r.bytes).toBe(2_800_000);
    expect(fetchMock).toHaveBeenCalled();
  });

  it("throws PROVIDER_UNAVAILABLE on non-200", async () => {
    globalThis.fetch = vi.fn(async () => new Response("{}", { status: 503 }));
    const p = new RodinProvider({ apiKey: "test" });
    await expect(p.generate({ prompt: "x" })).rejects.toThrow(/PROVIDER_UNAVAILABLE/);
  });
});
```

- [ ] **Step 2: Implement Rodin adapter**

```typescript
import { createHash } from "crypto";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { GenorahError } from "@genorah/protocol";
import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";

export interface RodinOptions {
  apiKey: string;
  endpoint?: string;
  downloadDir?: string;
  quality?: "standard" | "high";
}

const PRICE = { standard: 0.35, high: 0.5 };

export class RodinProvider implements AssetProvider {
  readonly name = "rodin";
  readonly kind = "3d" as const;
  constructor(private opts: RodinOptions) {}

  async estimateCost(_: AssetInput): Promise<CostEstimate> {
    return { cost_usd: PRICE[this.opts.quality ?? "standard"], duration_ms_estimate: 90_000 };
  }

  async generate(input: AssetInput): Promise<AssetResult> {
    const start = Date.now();
    const endpoint = this.opts.endpoint ?? "https://api.rodin.ai/v2/generate";
    const body = {
      prompt: input.prompt,
      quality: this.opts.quality ?? "standard",
      seed: input.seed ?? 0,
      ...(input.params ?? {})
    };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.opts.apiKey}` },
      body: JSON.stringify(body)
    });
    if (res.status !== 200) {
      throw new GenorahError({
        code: "PROVIDER_UNAVAILABLE",
        message: `Rodin ${res.status}`,
        recovery_hint: "retry_with_fallback",
        retry_strategy: { max_attempts: 2, backoff_ms: 4000, fallback_worker: "meshy-prototyper" }
      });
    }
    const data = await res.json() as { id: string; output: { url: string; bytes: number } };
    const downloadDir = this.opts.downloadDir ?? "/tmp/rodin";
    if (!existsSync(downloadDir)) mkdirSync(downloadDir, { recursive: true });
    const target = join(downloadDir, `${data.id}.glb`);
    const blobRes = await fetch(data.output.url);
    const buf = Buffer.from(await blobRes.arrayBuffer());
    writeFileSync(target, buf);
    const sha = createHash("sha256").update(buf).digest("hex");
    return {
      provider: "rodin",
      model: "gen-2",
      sha256: sha,
      path: target,
      bytes: buf.byteLength,
      cost_usd: PRICE[this.opts.quality ?? "standard"],
      duration_ms: Date.now() - start,
      input
    };
  }
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/providers-rodin.test.ts
git add packages/asset-forge/src/providers/rodin.ts packages/asset-forge/tests/providers-rodin.test.ts
git commit -m "feat(v4-m3): RodinProvider with mocked API + error taxonomy"
```

---

## Task 7: Meshy 5 provider (same pattern, $0.20/model)

**Files:**
- Create: `packages/asset-forge/src/providers/meshy.ts`
- Create: `packages/asset-forge/tests/providers-meshy.test.ts`

- [ ] **Step 1: Follow Rodin pattern**

Test + implement. Differences:
- `name = "meshy"`, `PRICE = 0.20`, endpoint `https://api.meshy.ai/v5/text-to-3d`
- Response envelope: `{ id, result: { model_url, stats: { file_size } } }`
- `duration_ms_estimate: 45_000`

Same error taxonomy (`PROVIDER_UNAVAILABLE`, fallback `dummy`).

- [ ] **Step 2: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/providers-meshy.test.ts
git add packages/asset-forge/src/providers/meshy.ts packages/asset-forge/tests/providers-meshy.test.ts
git commit -m "feat(v4-m3): MeshyProvider"
```

---

## Task 8: Flux Kontext provider (DNA-locked hero images)

**Files:**
- Create: `packages/asset-forge/src/providers/flux-kontext.ts`
- Create: `packages/asset-forge/tests/providers-flux-kontext.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect, vi } from "vitest";
import { FluxKontextProvider } from "../src/providers/flux-kontext.js";

describe("FluxKontextProvider", () => {
  it("sends reference_paths + prompt to API", async () => {
    const captured: any = {};
    globalThis.fetch = vi.fn(async (url, init: any) => {
      captured.url = url;
      captured.body = JSON.parse(init.body);
      return new Response(JSON.stringify({ id: "x", output: { url: "https://cdn/x.jpg", bytes: 500_000 } }), { status: 200 });
    });
    const p = new FluxKontextProvider({ apiKey: "k", downloadDir: "/tmp/flux-test" });
    await p.generate({ prompt: "hero", reference_paths: ["/tmp/ref.jpg"] });
    expect(captured.body.references).toEqual(["/tmp/ref.jpg"]);
  });

  it("estimates $0.05/image", async () => {
    const p = new FluxKontextProvider({ apiKey: "k" });
    const est = await p.estimateCost({ prompt: "hero" });
    expect(est.cost_usd).toBeCloseTo(0.05);
  });
});
```

- [ ] **Step 2: Implement (Replicate/fal.ai-style endpoint)**

Same structure as Rodin. `name = "flux-kontext"`, `PRICE = 0.05`, endpoint `https://api.fal.ai/v1/flux-1.1-pro-ultra-kontext/run`. Include `references` array in body.

- [ ] **Step 3: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/providers-flux-kontext.test.ts
git add packages/asset-forge/src/providers/flux-kontext.ts packages/asset-forge/tests/providers-flux-kontext.test.ts
git commit -m "feat(v4-m3): FluxKontextProvider with reference conditioning"
```

---

## Task 9: Recraft V3 provider (native SVG)

**Files:**
- Create: `packages/asset-forge/src/providers/recraft.ts`
- Create: `packages/asset-forge/tests/providers-recraft.test.ts`

- [ ] **Step 1: Follow pattern**

- `name = "recraft"`, `kind = "vector"`, `PRICE = 0.04`, endpoint `https://external.api.recraft.ai/v1/images/generations`, response `{ data: [{ url }] }`.
- Test asserts output path ends in `.svg`.

- [ ] **Step 2: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/providers-recraft.test.ts
git add packages/asset-forge/src/providers/recraft.ts packages/asset-forge/tests/providers-recraft.test.ts
git commit -m "feat(v4-m3): RecraftProvider (native SVG)"
```

---

## Task 10: Kling 2.1 provider (video)

**Files:**
- Create: `packages/asset-forge/src/providers/kling.ts`
- Create: `packages/asset-forge/tests/providers-kling.test.ts`

- [ ] **Step 1: Follow pattern**

- `name = "kling"`, `kind = "video"`, pricing `0.35 * duration_seconds`, endpoint `https://api.klingai.com/v2.1/videos/text2video`.
- Test: estimateCost({prompt: "x", params: { duration_seconds: 6 }}) returns 2.10.

- [ ] **Step 2: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/providers-kling.test.ts
git add packages/asset-forge/src/providers/kling.ts packages/asset-forge/tests/providers-kling.test.ts
git commit -m "feat(v4-m3): KlingProvider (video, duration-based pricing)"
```

---

## Task 11: Nano-banana MCP bridge provider

**Files:**
- Create: `packages/asset-forge/src/providers/nano-banana.ts`
- Create: `packages/asset-forge/tests/providers-nano-banana.test.ts`

- [ ] **Step 1: Wrap existing MCP**

Unlike the HTTP providers, nano-banana is an MCP server. The bridge accepts an optional MCP client; when missing, falls back to text-prompt file write (graceful degradation).

Test (MCP-absent fallback):

```typescript
import { describe, it, expect } from "vitest";
import { NanoBananaProvider } from "../src/providers/nano-banana.js";

describe("NanoBananaProvider (fallback)", () => {
  it("when no MCP client: writes prompt file and returns path", async () => {
    const p = new NanoBananaProvider({ mcpClient: null, downloadDir: "/tmp/nb-test" });
    const r = await p.generate({ prompt: "character holding product" });
    expect(r.provider).toBe("nano-banana");
    expect(r.path.endsWith(".prompt.txt")).toBe(true);
    expect(r.cost_usd).toBe(0);
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";

export interface NanoBananaOptions {
  mcpClient: { callTool: (name: string, args: unknown) => Promise<unknown> } | null;
  downloadDir?: string;
}

export class NanoBananaProvider implements AssetProvider {
  readonly name = "nano-banana";
  readonly kind = "image" as const;
  constructor(private opts: NanoBananaOptions) {}

  async estimateCost(): Promise<CostEstimate> {
    return { cost_usd: this.opts.mcpClient ? 0.02 : 0, duration_ms_estimate: 8_000 };
  }

  async generate(input: AssetInput): Promise<AssetResult> {
    const start = Date.now();
    const dir = this.opts.downloadDir ?? "/tmp/nano-banana";
    mkdirSync(dir, { recursive: true });
    if (!this.opts.mcpClient) {
      const sha = createHash("sha256").update(input.prompt).digest("hex");
      const path = join(dir, `${sha.slice(0, 12)}.prompt.txt`);
      writeFileSync(path, input.prompt);
      return { provider: "nano-banana", sha256: sha, path, bytes: input.prompt.length, cost_usd: 0, duration_ms: Date.now() - start, input };
    }
    const resp = await this.opts.mcpClient.callTool("generate_image", { prompt: input.prompt, seed: input.seed ?? 0 });
    const ({ image_path, bytes } = resp as any);
    const buf = Buffer.alloc(0); // production impl reads image_path
    const sha = createHash("sha256").update(image_path).digest("hex");
    return { provider: "nano-banana", sha256: sha, path: image_path, bytes: bytes ?? 0, cost_usd: 0.02, duration_ms: Date.now() - start, input };
  }
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/providers-nano-banana.test.ts
git add packages/asset-forge/src/providers/nano-banana.ts packages/asset-forge/tests/providers-nano-banana.test.ts
git commit -m "feat(v4-m3): nano-banana MCP bridge provider"
```

---

## Task 12: Recipe schema (test-first)

**Files:**
- Create: `packages/asset-forge/src/schemas/recipe.schema.ts`
- Create: `packages/asset-forge/tests/recipe-schema.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect } from "vitest";
import { RecipeSchema } from "../src/schemas/recipe.schema.js";

const minimal = {
  name: "hero-scene",
  version: "1.0.0",
  steps: [
    { worker: "rodin-3d-gen", input: { prompt: "bust" } },
    { worker: "character-poser", input: { model: "${previous.artifact}", pose: "contrapposto" } }
  ],
  validators_per_step: ["dna-compliance", "license"]
};

describe("RecipeSchema", () => {
  it("accepts a minimal 2-step recipe", () => {
    expect(() => RecipeSchema.parse(minimal)).not.toThrow();
  });

  it("rejects empty steps", () => {
    expect(() => RecipeSchema.parse({ ...minimal, steps: [] })).toThrow();
  });

  it("rejects bad semver", () => {
    expect(() => RecipeSchema.parse({ ...minimal, version: "draft" })).toThrow();
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import { z } from "zod";

export const StepSchema = z.object({
  worker: z.string().min(1),
  input: z.record(z.unknown()),
  when: z.string().optional(),
  fallback: z.string().optional()
});

export const RecipeSchema = z.object({
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().optional(),
  steps: z.array(StepSchema).min(1),
  validators_per_step: z.array(z.string()).default([]),
  followups_enabled: z.boolean().default(true)
});
export type Recipe = z.infer<typeof RecipeSchema>;
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/recipe-schema.test.ts
git add packages/asset-forge/src/schemas/recipe.schema.ts packages/asset-forge/tests/recipe-schema.test.ts
git commit -m "feat(v4-m3): recipe schema (YAML-compatible)"
```

---

## Task 13: Recipe executor (test-first)

**Files:**
- Create: `packages/asset-forge/src/recipe.ts`
- Create: `packages/asset-forge/tests/recipe.test.ts`

- [ ] **Step 1: Test (with fake workers)**

```typescript
import { describe, it, expect, vi } from "vitest";
import { executeRecipe } from "../src/recipe.js";

describe("executeRecipe", () => {
  it("runs steps in sequence and interpolates ${previous.artifact}", async () => {
    const workers = new Map<string, any>();
    workers.set("rodin-3d-gen", vi.fn(async () => ({
      schema_version: "4.0.0", status: "ok",
      artifact: { path: "a.glb" }, verdicts: [], followups: []
    })));
    workers.set("character-poser", vi.fn(async (input: any) => ({
      schema_version: "4.0.0", status: "ok",
      artifact: { path: "b.glb", base: input.model }, verdicts: [], followups: []
    })));
    const recipe = {
      name: "t", version: "1.0.0",
      steps: [
        { worker: "rodin-3d-gen", input: { prompt: "x" } },
        { worker: "character-poser", input: { model: "${previous.artifact.path}", pose: "p" } }
      ],
      validators_per_step: [], followups_enabled: true
    };
    const result = await executeRecipe({ recipe, dispatch: async (worker, input) => workers.get(worker)!(input) });
    expect(result.status).toBe("ok");
    expect(workers.get("character-poser").mock.calls[0][0].model).toBe("a.glb");
  });

  it("stops and returns partial when step status is failed", async () => {
    const recipe = {
      name: "t", version: "1.0.0",
      steps: [
        { worker: "w1", input: {} },
        { worker: "w2", input: {} }
      ],
      validators_per_step: [], followups_enabled: true
    };
    const dispatch = vi.fn()
      .mockResolvedValueOnce({ schema_version: "4.0.0", status: "failed", artifact: null, verdicts: [{ validator: "x", pass: false }], followups: [] });
    const result = await executeRecipe({ recipe, dispatch });
    expect(result.status).toBe("failed");
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("injects followups between steps when followups_enabled", async () => {
    const recipe = {
      name: "t", version: "1.0.0",
      steps: [
        { worker: "w1", input: {} },
        { worker: "w3", input: {} }
      ],
      validators_per_step: [], followups_enabled: true
    };
    const dispatch = vi.fn()
      .mockResolvedValueOnce({ schema_version: "4.0.0", status: "ok", artifact: {}, verdicts: [], followups: [{ suggested_worker: "w2", reason: "correction" }] })
      .mockResolvedValueOnce({ schema_version: "4.0.0", status: "ok", artifact: {}, verdicts: [], followups: [] })
      .mockResolvedValueOnce({ schema_version: "4.0.0", status: "ok", artifact: {}, verdicts: [], followups: [] });
    await executeRecipe({ recipe, dispatch });
    expect(dispatch).toHaveBeenCalledTimes(3); // w1 -> injected w2 -> w3
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import type { Recipe } from "./schemas/recipe.schema.js";
import type { ResultEnvelope } from "@genorah/protocol";

export interface ExecuteInput {
  recipe: Recipe;
  dispatch: (worker: string, input: Record<string, unknown>) => Promise<ResultEnvelope<unknown>>;
}

function interpolate(value: unknown, context: Record<string, unknown>): unknown {
  if (typeof value !== "string") return value;
  return value.replace(/\$\{([^}]+)\}/g, (_, path: string) => {
    const parts = path.trim().split(".");
    let node: any = context;
    for (const part of parts) {
      if (node == null) return "";
      node = node[part];
    }
    return node == null ? "" : String(node);
  });
}

function resolveInput(input: Record<string, unknown>, context: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    out[k] = typeof v === "object" && v !== null
      ? resolveInput(v as Record<string, unknown>, context)
      : interpolate(v, context);
  }
  return out;
}

export async function executeRecipe(inp: ExecuteInput): Promise<{ status: "ok"|"partial"|"failed"; envelopes: ResultEnvelope<unknown>[] }>{
  const envelopes: ResultEnvelope<unknown>[] = [];
  let previous: ResultEnvelope<unknown> | null = null;
  const queue = [...inp.recipe.steps];
  while (queue.length) {
    const step = queue.shift()!;
    const context = { previous: previous ?? { artifact: {} } };
    const resolvedInput = resolveInput(step.input, context);
    const env = await inp.dispatch(step.worker, resolvedInput);
    envelopes.push(env);
    if (env.status === "failed") return { status: "failed", envelopes };
    if (inp.recipe.followups_enabled) {
      for (const f of env.followups.reverse()) {
        queue.unshift({ worker: f.suggested_worker, input: f.context_override ?? {} });
      }
    }
    previous = env;
  }
  const anyPartial = envelopes.some(e => e.status === "partial");
  return { status: anyPartial ? "partial" : "ok", envelopes };
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/recipe.test.ts
git add packages/asset-forge/src/recipe.ts packages/asset-forge/tests/recipe.test.ts
git commit -m "feat(v4-m3): recipe executor with followup injection + interpolation"
```

---

## Task 14: Barrel + build

**Files:**
- Create: `packages/asset-forge/src/index.ts`

- [ ] **Step 1: Barrel + build + commit**

```typescript
export * from "./providers/base.js";
export * from "./providers/rodin.js";
export * from "./providers/meshy.js";
export * from "./providers/flux-kontext.js";
export * from "./providers/recraft.js";
export * from "./providers/kling.js";
export * from "./providers/nano-banana.js";
export * from "./cache.js";
export * from "./cost-ledger.js";
export * from "./provenance.js";
export * from "./recipe.js";
export * from "./schemas/manifest.schema.js";
export * from "./schemas/recipe.schema.js";
```

```bash
cd packages/asset-forge && npm run build
git add packages/asset-forge/src/index.ts packages/asset-forge/dist
git commit -m "feat(v4-m3): asset-forge barrel + build"
```

---

## Task 15: Write 3 canonical composite recipes

**Files:**
- Create: `recipes/photoreal-character-product.yml`
- Create: `recipes/hero-scene.yml`
- Create: `recipes/brand-marks.yml`

- [ ] **Step 1: photoreal-character-product.yml**

```yaml
name: photoreal-character-product
version: 1.0.0
description: Photoreal character holding or interacting with a product, DNA-locked.
steps:
  - worker: rodin-3d-gen
    input: { prompt: "${brand.character_prompt}", quality: "high", style: "${dna.archetype}" }
  - worker: character-poser
    input: { model: "${previous.artifact.path}", pose: "${recipe.pose}" }
  - worker: inpainter
    input:
      base: "${previous.artifact.path}"
      mask: "hands"
      prompt: "${brand.product_prompt}"
      strength: 0.75
  - worker: upscaler
    input: { image: "${previous.artifact.path}", scale: 2 }
validators_per_step: [dna-compliance, license, provenance]
followups_enabled: true
```

- [ ] **Step 2: hero-scene.yml**

```yaml
name: hero-scene
version: 1.0.0
description: Single cinematic hero scene — background + subject + lighting consistency.
steps:
  - worker: flux-hero-gen
    input: { prompt: "${brand.hero_prompt}", style: "${dna.archetype}", aspect: "16:9", references: "${dna.reference_images}" }
  - worker: rodin-3d-gen
    input: { prompt: "${brand.subject_prompt}", quality: "high" }
  - worker: ktx2-encoder
    input: { source: "${previous.artifact.path}" }
  - worker: gltf-lod-generator
    input: { source: "${previous.artifact.path}" }
validators_per_step: [dna-compliance, license, provenance, mesh-triangle-count, texture-size]
followups_enabled: true
```

- [ ] **Step 3: brand-marks.yml**

```yaml
name: brand-marks
version: 1.0.0
description: Vector brand marks + favicon + OG template.
steps:
  - worker: recraft-vector-author
    input: { prompt: "${brand.logo_prompt}", substyle: "${dna.archetype}" }
  - worker: recraft-vector-author
    input: { prompt: "${brand.logo_prompt} — monochrome variant", substyle: "${dna.archetype}" }
  - worker: recraft-vector-author
    input: { prompt: "${brand.logo_prompt} — mark only", substyle: "${dna.archetype}" }
validators_per_step: [dna-compliance, license]
followups_enabled: false
```

- [ ] **Step 4: Lint recipes against schema**

Add to `packages/asset-forge/tests/recipe-lint.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { parse } from "yaml";
import { RecipeSchema } from "../src/schemas/recipe.schema.js";

describe("canonical recipes", () => {
  const dir = "../../recipes";
  for (const f of readdirSync(dir).filter(n => n.endsWith(".yml"))) {
    it(`${f} validates against RecipeSchema`, () => {
      const body = parse(readFileSync(join(dir, f), "utf8"));
      expect(() => RecipeSchema.parse(body)).not.toThrow();
    });
  }
});
```

- [ ] **Step 5: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/recipe-lint.test.ts
git add recipes/ packages/asset-forge/tests/recipe-lint.test.ts
git commit -m "feat(v4-m3): 3 canonical composite recipes (character-product, hero-scene, brand-marks)"
```

---

## Task 16: Register new MCP servers in .mcp.json

**Files:**
- Modify: `.claude-plugin/.mcp.json`

- [ ] **Step 1: Add 3 servers that have MCP implementations**

Rodin, Meshy, Flux Kontext expose HTTP adapters above, not native MCPs yet. Nano-banana already exists. Kling is HTTP only.

For v4.0-alpha.3 the new MCP adds are optional image-processing helpers. Append to `.mcp.json`:

```json
{
  "flux-kontext": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@fal/flux-kontext-mcp@^1.0.0"],
    "env": { "FAL_KEY": "${FAL_KEY}" }
  },
  "recraft": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@recraft/mcp-server@^1.0.0"],
    "env": { "RECRAFT_API_KEY": "${RECRAFT_API_KEY}" }
  }
}
```

- [ ] **Step 2: Document env vars in README**

Add a subsection to `README.md` listing required env vars: `ROD_API_KEY`, `MESHY_API_KEY`, `FAL_KEY`, `RECRAFT_API_KEY`, `KLING_API_KEY`. All optional — pipeline gracefully degrades.

- [ ] **Step 3: Commit**

```bash
git add .claude-plugin/.mcp.json README.md
git commit -m "feat(v4-m3): register flux-kontext + recraft MCP servers (optional)"
```

---

## Task 17: Flesh out `asset-director`

**Files:**
- Modify: `agents/directors/asset-director.md`

- [ ] **Step 1: Add full protocol body**

After frontmatter:

```markdown
## State Ownership

Holds `CostLedger` initialized from `DESIGN-DNA.md:asset_budget_usd` (default 20).
Reads `recipes/*.yml` at startup.
Writes `public/assets/MANIFEST.json` via `ProvenanceWriter`.

## Protocol

1. Read CompositeBrief (recipe_id + context overrides).
2. Load recipe from `recipes/<recipe_id>.yml`.
3. Compose dispatch: for each step, check cache first; on miss, route to worker. If ledger status = "warn" or "exceeded" and `auto_downgrade: true`, substitute downgrade worker.
4. Run `executeRecipe`.
5. For each ok step: append to MANIFEST.json via ProvenanceWriter.
6. If final status = failed: emit followup to creative-director for fallback plan.
7. Return Result envelope with cost summary + manifest diff.

## Skills Invoked

- `photoreal-compositing-pipeline`
- `composite-recipes`
- `cost-governance`
- `user-global-asset-cache`
- `texture-provenance`

## Failure Recovery

- Provider unavailable → downgrade_chain (spec §5.3)
- Budget exceeded → pause + escalate_user
- DNA compliance fail → rerun step with tighter prompt (followup)
```

- [ ] **Step 2: Commit**

```bash
git add agents/directors/asset-director.md
git commit -m "feat(v4-m3): asset-director full body"
```

---

## Task 18: Flesh out 9 asset worker bodies

**Files:**
- Modify: `agents/workers/asset/*.md` (9 files)

- [ ] **Step 1: Body template per worker**

Each worker invokes its provider adapter and returns `Result<AssetResult>`. Template:

```markdown
## Protocol

1. Accept AssetInput payload (prompt + references + seed + params).
2. Invoke `<Provider>.generate(input)` via `@genorah/asset-forge`.
3. Self-check validators: dna-compliance, license, provenance.
4. Return Result<AssetResult> with cost + duration + provider.

## Skills Invoked

- `image-cascade` (for fallback chain)
- `texture-provenance`
- `cost-governance`

## Followups

- `cost_ratio > 0.8` → followup `{ suggested_worker: "upscaler", reason: "finalize before further spend" }`
- `dna-compliance.pass: false` → followup `{ suggested_worker: "inpainter", reason: "lift DNA coverage" }`
```

Apply pattern to each of: flux-hero-gen, nano-banana-iterator, rodin-3d-gen, meshy-prototyper, character-poser, inpainter, upscaler, recraft-vector-author, video-reel-gen.

Bodies vary only in provider name + headline skills. Keep structure identical.

- [ ] **Step 2: Commit**

```bash
git add agents/workers/asset/
git commit -m "feat(v4-m3): full bodies for 9 asset workers"
```

---

## Task 19: Skill docs — 5 new skills (4-layer each)

**Files:**
- Create: `skills/photoreal-compositing-pipeline/SKILL.md`
- Create: `skills/composite-recipes/SKILL.md`
- Create: `skills/texture-provenance/SKILL.md`
- Create: `skills/user-global-asset-cache/SKILL.md`
- Create: `skills/cost-governance/SKILL.md`

- [ ] **Step 1: Write each skill in 4-layer format**

Per skill:
- **Layer 1 — Decision Guidance:** when to invoke (recipe trigger, cache miss, ledger threshold, etc.)
- **Layer 2 — Examples:** working recipe YAML, manifest entry, ledger snapshot
- **Layer 3 — Integration Context:** DNA tokens consumed (archetype, asset_budget_usd, reference images); pipeline stage
- **Layer 4 — Anti-Patterns:** silent provider fallbacks, missing provenance, no cache check

- [ ] **Step 2: Commit**

```bash
git add skills/photoreal-compositing-pipeline skills/composite-recipes skills/texture-provenance skills/user-global-asset-cache skills/cost-governance
git commit -m "feat(v4-m3): 5 asset-forge skills (4-layer)"
```

---

## Task 20: Scene Craft — 13th quality category

**Files:**
- Create: `skills/quality-gate-v3/SKILL.md`
- Create: `scripts/validators/scene-craft.mjs`
- Create: `scripts/validators/scene-craft.test.mjs`

- [ ] **Step 1: Test for Scene Craft scoring**

```javascript
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { scoreSceneCraft } from "./scene-craft.mjs";

test("gives full 20 pts to a polished cinematic scene", () => {
  const s = scoreSceneCraft({
    intensity: "cinematic",
    choreography: { bookmarks: [1,2,3], cameras_coherent: true, morphs_smooth: true },
    scene_graph: { mesh_count: 4, lighting_consistent: true, material_realism: 0.9 },
    perf_budget_pass: true
  });
  assert.equal(s.score, 20);
});

test("skips Scene Craft when intensity not cinematic/immersive", () => {
  const s = scoreSceneCraft({ intensity: "accent" });
  assert.equal(s.skipped, true);
});

test("penalizes non-coherent camera cuts", () => {
  const s = scoreSceneCraft({
    intensity: "cinematic",
    choreography: { bookmarks: [1,2,3], cameras_coherent: false, morphs_smooth: true },
    scene_graph: { mesh_count: 4, lighting_consistent: true, material_realism: 0.9 },
    perf_budget_pass: true
  });
  assert.ok(s.score < 20);
});
```

- [ ] **Step 2: Implement**

```javascript
const RUBRIC = [
  { key: "choreography.cameras_coherent", weight: 5, label: "Camera coherence across sections" },
  { key: "choreography.morphs_smooth",    weight: 4, label: "Morph-target smoothness" },
  { key: "scene_graph.lighting_consistent", weight: 4, label: "Lighting consistency with DNA" },
  { key: "scene_graph.material_realism",  weight: 4, label: "Material realism (0..1)" },
  { key: "perf_budget_pass",              weight: 3, label: "Perf budget compliance" }
];

function resolve(obj, path) { return path.split(".").reduce((a, k) => a?.[k], obj); }

export function scoreSceneCraft(input) {
  if (input.intensity !== "cinematic" && input.intensity !== "immersive") return { skipped: true, score: 0 };
  let score = 0;
  const findings = [];
  for (const rule of RUBRIC) {
    const v = resolve(input, rule.key);
    let award = 0;
    if (typeof v === "boolean") award = v ? rule.weight : 0;
    else if (typeof v === "number") award = Math.round(rule.weight * v);
    findings.push({ key: rule.key, label: rule.label, award, max: rule.weight });
    score += award;
  }
  return { score, findings };
}
```

- [ ] **Step 3: Write quality-gate-v3 skill doc**

Copy `quality-gate-v2/SKILL.md`, extend to 13 categories with Scene Craft (20 pts), updated weights, updated tier thresholds:

- Reject <150 (was 140)
- Baseline 150–189
- Strong 190–229
- SOTD-Ready 230–249
- Honoree 250–269
- SOTM-Ready 270+

Design Craft total becomes 254 pts (was 234).

- [ ] **Step 4: Commit**

```bash
git add skills/quality-gate-v3 scripts/validators/scene-craft.mjs scripts/validators/scene-craft.test.mjs
git commit -m "feat(v4-m3): Scene Craft 13th quality category (Design Craft -> 254)"
```

---

## Task 21: Integration test — full recipe E2E

**Files:**
- Create: `packages/asset-forge/tests/integration-recipe.test.ts`

- [ ] **Step 1: Write**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { rmSync, mkdirSync } from "fs";
import { AssetCache, CostLedger, ProvenanceWriter, executeRecipe, DummyProvider } from "../src/index.js";
import { parse } from "yaml";
import { readFileSync } from "fs";

const TMP = "/tmp/genorah-recipe-e2e";
beforeEach(() => { rmSync(TMP, { recursive: true, force: true }); mkdirSync(TMP, { recursive: true }); });

describe("recipe E2E", () => {
  it("brand-marks runs 3 steps with cache + ledger + provenance", async () => {
    const cache = new AssetCache({ rootDir: `${TMP}/cache` });
    await cache.init();
    const ledger = new CostLedger({ budget_usd: 5 });
    const prov = new ProvenanceWriter({ path: `${TMP}/MANIFEST.json` });
    const dummy = new DummyProvider();
    const recipe = parse(readFileSync("../../recipes/brand-marks.yml", "utf8"));

    const dispatch = async (_worker: string, input: any) => {
      const r = await dummy.generate({ prompt: input.prompt ?? "" });
      ledger.record({ provider: r.provider, cost_usd: r.cost_usd });
      await prov.append({
        path: r.path, sha256: r.sha256, bytes: r.bytes,
        provider: r.provider, prompt: r.input.prompt,
        reference_hashes: [], cost_usd: r.cost_usd, duration_ms: r.duration_ms,
        cache_hit: false, dna_compliance_pass: true
      });
      return { schema_version: "4.0.0" as const, status: "ok" as const, artifact: r, verdicts: [], followups: [] };
    };

    const result = await executeRecipe({ recipe, dispatch });
    expect(result.status).toBe("ok");
    expect(result.envelopes).toHaveLength(3);
    expect(ledger.spend_usd).toBe(0);
  });
});
```

- [ ] **Step 2: Run + commit**

```bash
cd packages/asset-forge && npx vitest run tests/integration-recipe.test.ts
git add packages/asset-forge/tests/integration-recipe.test.ts
git commit -m "test(v4-m3): recipe E2E with cache + ledger + provenance"
```

---

## Task 22: M3 regression + tag

- [ ] **Step 1: Full suite**

```bash
cd packages/protocol && npm test
cd ../canvas-runtime && npm test
cd ../asset-forge && npm test
cd ../.. && npm test
node --test scripts/validators/*.test.mjs
```
Expected: all pass, total ~245 tests.

- [ ] **Step 2: Regenerate agent cards (bodies changed)**

Run: `node scripts/generate-agent-cards.mjs` → 104 cards.

- [ ] **Step 3: Bump version**

Edit `.claude-plugin/plugin.json`: `"version": "4.0.0-alpha.3"`.

- [ ] **Step 4: Tag**

```bash
git tag v4.0.0-alpha.3 -m "v4 M3 shipping: asset forge 2.0 + scene craft gate"
```

- [ ] **Step 5: Completion summary**

Create `docs/superpowers/plans/v4-m3-completion.md` — 1 page.

---

## M3 Exit Criteria

- [ ] `@genorah/asset-forge` builds + tests pass
- [ ] 5 provider adapters (Rodin, Meshy, Flux Kontext, Recraft, Kling) + nano-banana bridge
- [ ] 3 canonical recipes validated against schema
- [ ] Cache at `~/.claude/genorah/asset-cache/` working end-to-end
- [ ] Cost ledger warns at 80%, triggers downgrade at 100%
- [ ] MANIFEST.json writes full provenance per entry
- [ ] Scene Craft category scored in `/gen:audit`; Design Craft axis = 254 pts
- [ ] 9 asset workers + asset-director have full bodies
- [ ] `v4.0.0-alpha.3` tag exists
