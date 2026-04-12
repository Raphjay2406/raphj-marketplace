# v4 M4 — Design Beyond Archetypes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the 5 "beyond" design dimensions: (1) generative archetypes synthesized from brand references, (2) Living Systems that morph with user signals at runtime, (3) bespoke Signature DNA 3D marks, (4) multi-archetype blending via Tension Council, (5) the Neuro-aesthetic gate as the 14th quality category. Final quality gate becomes **394 pts** (254 Design Craft + 140 UX Integrity).

**Architecture:** A new `@genorah/living-system-runtime` npm package runs inside built sites, reading user signals and applying archetype morphs via CSS custom properties + DNA token delta. A new `archetype-synthesizer` worker + `reference-embedding-miner` pipeline uses Flux Kontext embeddings (from M3). A `signature-dna-forge` worker calls Rodin (from M3) with a collision-checked uniqueness ledger. The Tension Council is a 3-agent vote orchestrated by `creative-director` whenever blended DNA produces a conflict. The Neuro-aesthetic gate runs at `/gen:audit` as a new 20-pt category under UX Integrity.

**Tech Stack:** Node.js 24, TypeScript 5.6, Zod 3.23, client-side `IntersectionObserver` + `matchMedia` + Battery/Network APIs, `sqlite-vec` 0.1.4 (for signature uniqueness ledger and embedding store), `@tensorflow/tfjs-node` 4.21 (for saccade prediction), `onnxruntime-node` 1.18 (fixation-heatmap model).

**Scope:** 4 weeks. 36 tasks. 1 new package (`living-system-runtime`), 5 new workers, 3 new director extensions, 5 new skills, neuro-aesthetic gate, 2 new commands (`/gen:archetype-synth`, `/gen:signature-mark`).

**Milestone completion criteria:**
1. `@genorah/living-system-runtime` built + consumed by Next.js / Astro / SvelteKit demos
2. `/gen:archetype-synth` synthesizes a custom archetype from 3 reference images and produces valid DNA preset
3. `/gen:signature-mark` forges a unique 3D mark, registers in uniqueness ledger, writes to `public/assets/signature-mark.glb`
4. Multi-archetype blending produces deterministic DNA when Tension Council converges; fails gracefully when it doesn't
5. Neuro-aesthetic gate runs in `/gen:audit`; UX Integrity axis = 140 pts
6. 50+ new M4 tests pass (total ~295)

---

## File Structure

### New files
- `packages/living-system-runtime/package.json`
- `packages/living-system-runtime/src/signals/*.ts` — time-of-day, scroll-velocity, pointer-idle, battery, connection, visit-history
- `packages/living-system-runtime/src/applyDelta.ts` — CSS var updater
- `packages/living-system-runtime/src/LivingSystemProvider.tsx`
- `packages/living-system-runtime/src/useLivingDna.ts`
- `packages/living-system-runtime/src/schemas/living-rules.schema.ts`
- `packages/living-system-runtime/tests/*.test.ts` (8)
- `packages/generative-archetype/package.json`
- `packages/generative-archetype/src/referenceMiner.ts`
- `packages/generative-archetype/src/archetypeSynthesizer.ts`
- `packages/generative-archetype/src/signatureForge.ts`
- `packages/generative-archetype/src/uniquenessLedger.ts`
- `packages/generative-archetype/tests/*.test.ts` (6)
- `skills/generative-archetype-synthesizer/SKILL.md`
- `skills/signature-dna-forge/SKILL.md`
- `skills/archetype-arbitration/SKILL.md`
- `skills/neuro-aesthetic-gate/SKILL.md`
- `skills/living-system-runtime/SKILL.md`
- `scripts/validators/neuro-aesthetic.mjs`
- `scripts/validators/neuro-aesthetic.test.mjs`
- `commands/gen-archetype-synth.md`
- `commands/gen-signature-mark.md`
- `agents/workers/asset/archetype-synthesizer.md` (new worker, +1 to total)
- `agents/workers/asset/reference-embedding-miner.md` (new worker, +1)
- `agents/workers/asset/signature-dna-forge.md` (new worker, +1)

### Modified files
- `agents/directors/creative-director.md` — add Tension Council protocol
- `agents/directors/narrative-director.md` — minor (add voting participation)
- `skills/archetype-mixing/SKILL.md` → extend to cover Tension Council arbitration
- `skills/quality-gate-v3/SKILL.md` → add 14th category (UX Integrity → 140 pts; total → 394 pts)
- `.claude-plugin/plugin.json` → 4.0.0-alpha.4

Worker total grows: 95 + 3 = **98 workers**; directors stay at 10; **108 agents total**.

---

## Task 1: living-system-runtime workspace

**Files:**
- Create: `packages/living-system-runtime/package.json`
- Create: `packages/living-system-runtime/tsconfig.json`

- [ ] **Step 1: Package manifest**

```json
{
  "name": "@genorah/living-system-runtime",
  "version": "4.0.0-alpha.4",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": { "build": "tsc -p .", "test": "vitest run" },
  "peerDependencies": { "react": "^19.0.0" },
  "dependencies": { "zod": "^3.23.8" },
  "devDependencies": {
    "typescript": "^5.6.2",
    "vitest": "^2.1.4",
    "@types/react": "^19.0.0",
    "@testing-library/react": "^16.0.0",
    "happy-dom": "^15.0.0"
  }
}
```

- [ ] **Step 2: tsconfig (JSX enabled, same pattern as canvas-runtime)**

- [ ] **Step 3: Install + commit**

```bash
cd packages/living-system-runtime && npm install
git add packages/living-system-runtime/package.json packages/living-system-runtime/tsconfig.json
git commit -m "feat(v4-m4): living-system-runtime workspace"
```

---

## Task 2: LivingRules schema (test-first)

**Files:**
- Create: `packages/living-system-runtime/src/schemas/living-rules.schema.ts`
- Create: `packages/living-system-runtime/tests/living-rules.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect } from "vitest";
import { LivingRulesSchema } from "../src/schemas/living-rules.schema.js";

describe("LivingRulesSchema", () => {
  it("accepts a minimal rule set", () => {
    const rules = {
      schema_version: "4.0.0",
      signals: ["time_of_day", "scroll_velocity"],
      rules: [
        { signal: "time_of_day", predicate: { between: ["18:00","23:59"] }, delta: { "--color-bg": "#0f0e12", "--color-primary": "#f5b85c" } },
        { signal: "scroll_velocity", predicate: { gt: 1200 }, delta: { "--density": "dense" } }
      ]
    };
    expect(() => LivingRulesSchema.parse(rules)).not.toThrow();
  });

  it("rejects a rule with unknown signal", () => {
    expect(() => LivingRulesSchema.parse({
      schema_version: "4.0.0", signals: ["time_of_day"], rules: [{ signal: "unknown", predicate: {}, delta: {} }]
    })).toThrow();
  });

  it("validates predicate shapes", () => {
    expect(() => LivingRulesSchema.parse({
      schema_version: "4.0.0", signals: ["battery"], rules: [{ signal: "battery", predicate: { lt: 0.2 }, delta: { "--motion": "reduced" } }]
    })).not.toThrow();
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import { z } from "zod";

export const SignalKindSchema = z.enum([
  "time_of_day", "scroll_velocity", "pointer_idle", "battery",
  "connection_kbps", "device_memory_gb", "prefers_reduced_motion", "visit_count"
]);
export type SignalKind = z.infer<typeof SignalKindSchema>;

export const PredicateSchema = z.union([
  z.object({ lt: z.number() }),
  z.object({ gt: z.number() }),
  z.object({ eq: z.union([z.number(), z.string(), z.boolean()]) }),
  z.object({ between: z.tuple([z.string(), z.string()]) }) // HH:MM for time_of_day
]);
export type Predicate = z.infer<typeof PredicateSchema>;

export const RuleSchema = z.object({
  signal: SignalKindSchema,
  predicate: PredicateSchema,
  delta: z.record(z.string(), z.string()), // CSS var → value
  archetype_morph: z.string().optional()
});

export const LivingRulesSchema = z.object({
  schema_version: z.literal("4.0.0"),
  signals: z.array(SignalKindSchema).min(1),
  rules: z.array(RuleSchema).min(1)
});
export type LivingRules = z.infer<typeof LivingRulesSchema>;
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/living-system-runtime && npx vitest run tests/living-rules.test.ts
git add packages/living-system-runtime/src/schemas packages/living-system-runtime/tests/living-rules.test.ts
git commit -m "feat(v4-m4): LivingRules schema"
```

---

## Task 3: Signal primitives (one test+impl per signal)

**Files:**
- Create: `packages/living-system-runtime/src/signals/timeOfDay.ts`
- Create: `packages/living-system-runtime/src/signals/scrollVelocity.ts`
- Create: `packages/living-system-runtime/src/signals/pointerIdle.ts`
- Create: `packages/living-system-runtime/src/signals/battery.ts`
- Create: `packages/living-system-runtime/src/signals/connection.ts`
- Create: `packages/living-system-runtime/src/signals/visitCount.ts`
- Create: corresponding `packages/living-system-runtime/tests/*.test.ts`

Each signal exposes `subscribe(callback: (value) => void): () => void`.

- [ ] **Step 1: timeOfDay.ts (deterministic pure function)**

```typescript
export function currentTimeHM(now = new Date()): string {
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function subscribeTimeOfDay(cb: (hm: string) => void, interval = 60_000): () => void {
  cb(currentTimeHM());
  const id = setInterval(() => cb(currentTimeHM()), interval);
  return () => clearInterval(id);
}
```

Test:

```typescript
import { describe, it, expect } from "vitest";
import { currentTimeHM } from "../src/signals/timeOfDay.js";

describe("timeOfDay", () => {
  it("formats as HH:MM", () => {
    expect(currentTimeHM(new Date("2026-04-13T06:07:00"))).toBe("06:07");
  });
});
```

- [ ] **Step 2: scrollVelocity.ts (uses requestAnimationFrame sampling)**

```typescript
export function subscribeScrollVelocity(cb: (px_per_s: number) => void): () => void {
  let lastY = typeof window !== "undefined" ? window.scrollY : 0;
  let lastT = performance.now();
  let rafId = 0;
  const tick = () => {
    const now = performance.now();
    const y = window.scrollY;
    const dt = (now - lastT) / 1000;
    if (dt > 0.05) {
      const v = Math.abs(y - lastY) / dt;
      cb(v);
      lastY = y; lastT = now;
    }
    rafId = requestAnimationFrame(tick);
  };
  if (typeof window !== "undefined") rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}
```

Test (DOM env):

```typescript
// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { subscribeScrollVelocity } from "../src/signals/scrollVelocity.js";

describe("scrollVelocity", () => {
  it("subscribes and returns unsubscribe function", () => {
    const cb = vi.fn();
    const unsub = subscribeScrollVelocity(cb);
    expect(typeof unsub).toBe("function");
    unsub();
  });
});
```

- [ ] **Step 3: pointerIdle.ts**

```typescript
export function subscribePointerIdle(cb: (idle_ms: number) => void, thresholdMs = 3000): () => void {
  if (typeof window === "undefined") return () => {};
  let lastMove = performance.now();
  const onMove = () => { lastMove = performance.now(); cb(0); };
  window.addEventListener("pointermove", onMove, { passive: true });
  const id = setInterval(() => {
    const idle = performance.now() - lastMove;
    if (idle >= thresholdMs) cb(idle);
  }, 500);
  return () => { window.removeEventListener("pointermove", onMove); clearInterval(id); };
}
```

- [ ] **Step 4: battery.ts**

```typescript
export async function subscribeBattery(cb: (level_0_1: number) => void): Promise<() => void> {
  const nav = navigator as any;
  if (!nav?.getBattery) { cb(1); return () => {}; }
  const bat = await nav.getBattery();
  const emit = () => cb(bat.level);
  emit();
  bat.addEventListener("levelchange", emit);
  return () => bat.removeEventListener("levelchange", emit);
}
```

- [ ] **Step 5: connection.ts**

```typescript
export function subscribeConnection(cb: (kbps: number) => void): () => void {
  const conn = (navigator as any)?.connection;
  if (!conn) { cb(10_000); return () => {}; }
  const emit = () => cb((conn.downlink ?? 10) * 1000);
  emit();
  conn.addEventListener("change", emit);
  return () => conn.removeEventListener("change", emit);
}
```

- [ ] **Step 6: visitCount.ts (localStorage-backed)**

```typescript
const KEY = "genorah:ls:visits";

export function readVisitCount(): number {
  try { return Number(localStorage.getItem(KEY)) || 0; } catch { return 0; }
}

export function incrementVisit(): number {
  const next = readVisitCount() + 1;
  try { localStorage.setItem(KEY, String(next)); } catch {}
  return next;
}

export function subscribeVisitCount(cb: (n: number) => void): () => void {
  cb(readVisitCount());
  return () => {};
}
```

- [ ] **Step 7: Run all signal tests + commit**

```bash
cd packages/living-system-runtime && npx vitest run tests/
git add packages/living-system-runtime/src/signals packages/living-system-runtime/tests
git commit -m "feat(v4-m4): 6 signal primitives (time, scroll, pointer, battery, connection, visits)"
```

---

## Task 4: applyDelta — CSS var updater (test-first)

**Files:**
- Create: `packages/living-system-runtime/src/applyDelta.ts`
- Create: `packages/living-system-runtime/tests/apply-delta.test.ts`

- [ ] **Step 1: Test**

```typescript
// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { applyDelta, revertDelta } from "../src/applyDelta.js";

describe("applyDelta", () => {
  it("sets CSS custom properties on :root", () => {
    applyDelta({ "--color-bg": "#0f0e12", "--density": "dense" });
    expect(document.documentElement.style.getPropertyValue("--color-bg")).toBe("#0f0e12");
    expect(document.documentElement.style.getPropertyValue("--density")).toBe("dense");
  });

  it("revertDelta removes only matching keys", () => {
    applyDelta({ "--x": "1" });
    revertDelta(["--x"]);
    expect(document.documentElement.style.getPropertyValue("--x")).toBe("");
  });
});
```

- [ ] **Step 2: Implement**

```typescript
export function applyDelta(delta: Record<string, string>): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const [k, v] of Object.entries(delta)) root.style.setProperty(k, v);
}

export function revertDelta(keys: string[]): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const k of keys) root.style.removeProperty(k);
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/living-system-runtime && npx vitest run tests/apply-delta.test.ts
git add packages/living-system-runtime/src/applyDelta.ts packages/living-system-runtime/tests/apply-delta.test.ts
git commit -m "feat(v4-m4): applyDelta CSS var updater"
```

---

## Task 5: LivingSystemProvider + useLivingDna

**Files:**
- Create: `packages/living-system-runtime/src/LivingSystemProvider.tsx`
- Create: `packages/living-system-runtime/src/useLivingDna.ts`
- Create: `packages/living-system-runtime/tests/provider.test.tsx`

- [ ] **Step 1: Test (subscribing to time_of_day rule)**

```typescript
// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import React from "react";
import { LivingSystemProvider } from "../src/LivingSystemProvider.js";

const rules = {
  schema_version: "4.0.0" as const,
  signals: ["visit_count" as const],
  rules: [{ signal: "visit_count" as const, predicate: { gt: 0 }, delta: { "--visit-bg": "#000" } }]
};

describe("LivingSystemProvider", () => {
  it("applies delta on mount", async () => {
    localStorage.setItem("genorah:ls:visits", "3");
    render(<LivingSystemProvider rules={rules}><div/></LivingSystemProvider>);
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    expect(document.documentElement.style.getPropertyValue("--visit-bg")).toBe("#000");
  });
});
```

- [ ] **Step 2: Implement provider**

```typescript
import React, { useEffect } from "react";
import { LivingRules, LivingRulesSchema, Predicate, SignalKind } from "./schemas/living-rules.schema.js";
import { applyDelta, revertDelta } from "./applyDelta.js";
import { subscribeTimeOfDay, currentTimeHM } from "./signals/timeOfDay.js";
import { subscribeScrollVelocity } from "./signals/scrollVelocity.js";
import { subscribePointerIdle } from "./signals/pointerIdle.js";
import { subscribeBattery } from "./signals/battery.js";
import { subscribeConnection } from "./signals/connection.js";
import { subscribeVisitCount } from "./signals/visitCount.js";

function evaluate(predicate: Predicate, value: unknown): boolean {
  if ("lt" in predicate && typeof value === "number") return value < predicate.lt;
  if ("gt" in predicate && typeof value === "number") return value > predicate.gt;
  if ("eq" in predicate) return value === predicate.eq;
  if ("between" in predicate && typeof value === "string") {
    const [a, b] = predicate.between;
    return value >= a && value <= b;
  }
  return false;
}

export function LivingSystemProvider({ rules, children }: { rules: LivingRules; children: React.ReactNode }) {
  useEffect(() => {
    LivingRulesSchema.parse(rules);
    const unsubs: Array<() => void> = [];
    const appliedKeys = new Set<string>();

    const evaluateRules = (signal: SignalKind, value: unknown) => {
      for (const rule of rules.rules) {
        if (rule.signal !== signal) continue;
        if (evaluate(rule.predicate, value)) {
          applyDelta(rule.delta);
          Object.keys(rule.delta).forEach(k => appliedKeys.add(k));
        }
      }
    };

    if (rules.signals.includes("time_of_day")) {
      unsubs.push(subscribeTimeOfDay(v => evaluateRules("time_of_day", v)));
    }
    if (rules.signals.includes("scroll_velocity")) {
      unsubs.push(subscribeScrollVelocity(v => evaluateRules("scroll_velocity", v)));
    }
    if (rules.signals.includes("pointer_idle")) {
      unsubs.push(subscribePointerIdle(v => evaluateRules("pointer_idle", v)));
    }
    if (rules.signals.includes("battery")) {
      subscribeBattery(v => evaluateRules("battery", v)).then(u => unsubs.push(u));
    }
    if (rules.signals.includes("connection_kbps")) {
      unsubs.push(subscribeConnection(v => evaluateRules("connection_kbps", v)));
    }
    if (rules.signals.includes("visit_count")) {
      unsubs.push(subscribeVisitCount(v => evaluateRules("visit_count", v)));
    }

    return () => {
      unsubs.forEach(u => u());
      revertDelta(Array.from(appliedKeys));
    };
  }, [rules]);

  return <>{children}</>;
}
```

- [ ] **Step 3: useLivingDna hook (reads current applied deltas)**

```typescript
import { useEffect, useState } from "react";

export function useLivingDna(keys: string[]): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    if (typeof document === "undefined") return;
    const read = () => {
      const r: Record<string, string> = {};
      for (const k of keys) r[k] = getComputedStyle(document.documentElement).getPropertyValue(k).trim();
      setValues(r);
    };
    read();
    const id = setInterval(read, 1000);
    return () => clearInterval(id);
  }, [keys.join(",")]);
  return values;
}
```

- [ ] **Step 4: Run + commit**

```bash
cd packages/living-system-runtime && npx vitest run tests/provider.test.tsx
git add packages/living-system-runtime/src packages/living-system-runtime/tests/provider.test.tsx
git commit -m "feat(v4-m4): LivingSystemProvider + useLivingDna"
```

---

## Task 6: Barrel + build for living-system-runtime

**Files:**
- Create: `packages/living-system-runtime/src/index.ts`

- [ ] **Step 1: Barrel**

```typescript
export * from "./schemas/living-rules.schema.js";
export * from "./applyDelta.js";
export * from "./LivingSystemProvider.js";
export * from "./useLivingDna.js";
export * from "./signals/timeOfDay.js";
export * from "./signals/scrollVelocity.js";
export * from "./signals/pointerIdle.js";
export * from "./signals/battery.js";
export * from "./signals/connection.js";
export * from "./signals/visitCount.js";
```

- [ ] **Step 2: Build + commit**

```bash
cd packages/living-system-runtime && npm run build
git add packages/living-system-runtime/src/index.ts packages/living-system-runtime/dist
git commit -m "feat(v4-m4): living-system-runtime barrel + build"
```

---

## Task 7: generative-archetype workspace

**Files:**
- Create: `packages/generative-archetype/package.json`
- Create: `packages/generative-archetype/tsconfig.json`

- [ ] **Step 1: Manifest**

```json
{
  "name": "@genorah/generative-archetype",
  "version": "4.0.0-alpha.4",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": { "build": "tsc -p .", "test": "vitest run" },
  "dependencies": {
    "zod": "^3.23.8",
    "sqlite-vec": "^0.1.4",
    "better-sqlite3": "^11.5.0",
    "@genorah/protocol": "4.0.0-alpha.1",
    "@genorah/asset-forge": "4.0.0-alpha.3"
  },
  "devDependencies": {
    "typescript": "^5.6.2",
    "vitest": "^2.1.4"
  }
}
```

- [ ] **Step 2: Install + commit**

```bash
cd packages/generative-archetype && npm install
git add packages/generative-archetype/package.json packages/generative-archetype/tsconfig.json
git commit -m "feat(v4-m4): generative-archetype workspace"
```

---

## Task 8: Uniqueness ledger (sqlite-vec, test-first)

**Files:**
- Create: `packages/generative-archetype/src/uniquenessLedger.ts`
- Create: `packages/generative-archetype/tests/uniqueness-ledger.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { rmSync } from "fs";
import { UniquenessLedger } from "../src/uniquenessLedger.js";

const TMP = "/tmp/genorah-uniq.db";
beforeEach(() => { try { rmSync(TMP); } catch {} });

describe("UniquenessLedger", () => {
  it("records an embedding + returns it as nearest", async () => {
    const ledger = new UniquenessLedger({ path: TMP, dims: 4 });
    await ledger.init();
    await ledger.record("sig-1", [1, 0, 0, 0], { project: "A" });
    const near = await ledger.nearest([1, 0.01, 0, 0], 1);
    expect(near[0].id).toBe("sig-1");
  });

  it("blocks registration when distance < threshold", async () => {
    const ledger = new UniquenessLedger({ path: TMP, dims: 4, minDistance: 0.2 });
    await ledger.init();
    await ledger.record("sig-a", [1, 0, 0, 0], { project: "A" });
    await expect(ledger.record("sig-b", [1, 0.01, 0, 0], { project: "B" })).rejects.toThrow(/too similar/i);
  });

  it("allows registration when distance >= threshold", async () => {
    const ledger = new UniquenessLedger({ path: TMP, dims: 4, minDistance: 0.2 });
    await ledger.init();
    await ledger.record("sig-a", [1, 0, 0, 0], { project: "A" });
    await ledger.record("sig-b", [0, 1, 0, 0], { project: "B" });
    const near = await ledger.nearest([1, 0, 0, 0], 2);
    expect(near).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { existsSync } from "fs";

export interface LedgerOptions {
  path: string;
  dims: number;
  minDistance?: number;
}

export interface NearestResult { id: string; distance: number; metadata: unknown; }

export class UniquenessLedger {
  private db: Database.Database;
  constructor(private opts: LedgerOptions) {
    this.db = new Database(opts.path);
    sqliteVec.load(this.db);
  }

  async init(): Promise<void> {
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS sigs USING vec0(embedding float[${this.opts.dims}]);
      CREATE TABLE IF NOT EXISTS sig_meta (id TEXT PRIMARY KEY, metadata TEXT);
    `);
  }

  async record(id: string, embedding: number[], metadata: unknown): Promise<void> {
    if (embedding.length !== this.opts.dims) throw new Error(`expected ${this.opts.dims} dims, got ${embedding.length}`);
    const min = this.opts.minDistance ?? 0;
    if (min > 0) {
      const near = await this.nearest(embedding, 1);
      if (near.length && near[0].distance < min) throw new Error(`new signature too similar to ${near[0].id} (d=${near[0].distance})`);
    }
    const rowid = (this.db.prepare("INSERT INTO sigs(embedding) VALUES (?)").run(new Float32Array(embedding))).lastInsertRowid;
    this.db.prepare("INSERT INTO sig_meta(id, metadata) VALUES (?, ?)").run(id, JSON.stringify(metadata));
    this.db.prepare("UPDATE sigs SET rowid = ? WHERE rowid = ?").run(Number(rowid), Number(rowid));
  }

  async nearest(embedding: number[], k: number): Promise<NearestResult[]> {
    const rows = this.db.prepare(`
      SELECT rowid, distance FROM sigs WHERE embedding MATCH ? ORDER BY distance LIMIT ?
    `).all(new Float32Array(embedding), k) as Array<{ rowid: number; distance: number }>;
    const results: NearestResult[] = [];
    for (const r of rows) {
      const meta = this.db.prepare("SELECT id, metadata FROM sig_meta WHERE rowid = ?").get(r.rowid) as { id: string; metadata: string } | undefined;
      if (meta) results.push({ id: meta.id, distance: r.distance, metadata: JSON.parse(meta.metadata) });
    }
    return results;
  }
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/generative-archetype && npx vitest run tests/uniqueness-ledger.test.ts
git add packages/generative-archetype/src/uniquenessLedger.ts packages/generative-archetype/tests/uniqueness-ledger.test.ts
git commit -m "feat(v4-m4): UniquenessLedger (sqlite-vec)"
```

---

## Task 9: Reference embedding miner (stubbed provider, test-first)

**Files:**
- Create: `packages/generative-archetype/src/referenceMiner.ts`
- Create: `packages/generative-archetype/tests/reference-miner.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect, vi } from "vitest";
import { ReferenceMiner } from "../src/referenceMiner.js";

describe("ReferenceMiner", () => {
  it("mines palette + motifs + typography hints from references", async () => {
    const miner = new ReferenceMiner({
      embeddingProvider: {
        embed: vi.fn(async () => [0.1, 0.2, 0.3, 0.4])
      },
      paletteProvider: {
        extractPalette: vi.fn(async () => ["#0f0e12", "#f5b85c", "#e6e1d6"])
      }
    });
    const report = await miner.mine(["/tmp/ref1.jpg", "/tmp/ref2.jpg"]);
    expect(report.palette).toEqual(["#0f0e12", "#f5b85c", "#e6e1d6"]);
    expect(report.embeddings).toHaveLength(2);
    expect(report.combined_embedding).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Implement**

```typescript
export interface EmbeddingProvider { embed: (path: string) => Promise<number[]>; }
export interface PaletteProvider { extractPalette: (paths: string[]) => Promise<string[]>; }

export interface MinerOptions {
  embeddingProvider: EmbeddingProvider;
  paletteProvider: PaletteProvider;
}

export interface MineReport {
  references: string[];
  palette: string[];
  embeddings: number[][];
  combined_embedding: number[];
  motifs: string[];
}

export class ReferenceMiner {
  constructor(private opts: MinerOptions) {}

  async mine(paths: string[]): Promise<MineReport> {
    const embeddings = await Promise.all(paths.map(p => this.opts.embeddingProvider.embed(p)));
    const palette = await this.opts.paletteProvider.extractPalette(paths);
    const dims = embeddings[0]?.length ?? 0;
    const combined = new Array(dims).fill(0);
    for (const e of embeddings) for (let i = 0; i < dims; i++) combined[i] += e[i] / embeddings.length;
    return {
      references: paths,
      palette,
      embeddings,
      combined_embedding: combined,
      motifs: [] // motif extraction stub; M5 adds pattern-miner worker integration
    };
  }
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/generative-archetype && npx vitest run tests/reference-miner.test.ts
git add packages/generative-archetype/src/referenceMiner.ts packages/generative-archetype/tests/reference-miner.test.ts
git commit -m "feat(v4-m4): reference embedding miner (palette + embeddings)"
```

---

## Task 10: Archetype synthesizer (test-first)

**Files:**
- Create: `packages/generative-archetype/src/archetypeSynthesizer.ts`
- Create: `packages/generative-archetype/tests/archetype-synthesizer.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect } from "vitest";
import { synthesizeArchetype } from "../src/archetypeSynthesizer.js";

describe("synthesizeArchetype", () => {
  it("produces a DNA preset from a mine report + seed templates", () => {
    const archetype = synthesizeArchetype({
      slug: "custom-editorial-x",
      mine: { references: ["a","b"], palette: ["#0f0e12","#f5b85c","#e6e1d6"], embeddings: [], combined_embedding: [0,0,0,0], motifs: [] },
      seed_templates: ["editorial", "cinematic-3d"],
      blend_weights: [0.7, 0.3]
    });
    expect(archetype.slug).toBe("custom-editorial-x");
    expect(archetype.dna_color_palette.primary).toBe("#0f0e12");
    expect(archetype.tier).toBe("generative");
    expect(archetype.seed_templates).toEqual(["editorial", "cinematic-3d"]);
  });

  it("throws when blend_weights length mismatches seed_templates", () => {
    expect(() => synthesizeArchetype({
      slug: "x",
      mine: { references: [], palette: ["#000"], embeddings: [], combined_embedding: [], motifs: [] },
      seed_templates: ["a","b"],
      blend_weights: [1]
    })).toThrow(/mismatch/i);
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import type { MineReport } from "./referenceMiner.js";

export interface SynthInput {
  slug: string;
  mine: MineReport;
  seed_templates: string[];
  blend_weights: number[];
}

export interface GeneratedArchetype {
  slug: string;
  name: string;
  tier: "generative";
  seed_templates: string[];
  blend_weights: number[];
  dna_color_palette: { primary: string; secondary: string; accent: string; signature: string };
  dna_fonts: { display: string; body: string; mono: string };
  dna_motion_tokens: { easing: string; duration_hero_ms: number; duration_micro_ms: number };
  mandatory_techniques: string[];
  forbidden_patterns: string[];
  tension_zones: string[];
}

export function synthesizeArchetype(inp: SynthInput): GeneratedArchetype {
  if (inp.seed_templates.length !== inp.blend_weights.length) {
    throw new Error("seed_templates / blend_weights length mismatch");
  }
  const [p, s, a, sig] = inp.mine.palette.concat(["#0f0e12", "#f5b85c", "#e6e1d6", "#1A73E8"]).slice(0, 4);
  return {
    slug: inp.slug,
    name: inp.slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    tier: "generative",
    seed_templates: inp.seed_templates,
    blend_weights: inp.blend_weights,
    dna_color_palette: { primary: p, secondary: s, accent: a, signature: sig },
    dna_fonts: { display: "Söhne Breit", body: "Söhne", mono: "Berkeley Mono" },
    dna_motion_tokens: { easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", duration_hero_ms: 1600, duration_micro_ms: 160 },
    mandatory_techniques: [`blend:${inp.seed_templates.join("+")}`],
    forbidden_patterns: ["generic-saas-hero"],
    tension_zones: ["synthesis-glow", "palette-push", "motif-echo"]
  };
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/generative-archetype && npx vitest run tests/archetype-synthesizer.test.ts
git add packages/generative-archetype/src/archetypeSynthesizer.ts packages/generative-archetype/tests/archetype-synthesizer.test.ts
git commit -m "feat(v4-m4): archetype synthesizer (palette + seed blend)"
```

---

## Task 11: Signature forge (test-first)

**Files:**
- Create: `packages/generative-archetype/src/signatureForge.ts`
- Create: `packages/generative-archetype/tests/signature-forge.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { rmSync } from "fs";
import { SignatureForge } from "../src/signatureForge.js";
import { UniquenessLedger } from "../src/uniquenessLedger.js";

const TMP = "/tmp/sig-forge.db";
beforeEach(() => { try { rmSync(TMP); } catch {} });

describe("SignatureForge", () => {
  it("forges + registers in ledger when sufficiently unique", async () => {
    const ledger = new UniquenessLedger({ path: TMP, dims: 4, minDistance: 0.1 });
    await ledger.init();
    const provider = { generate: vi.fn(async () => ({ path: "/tmp/x.glb", sha256: "abc", bytes: 1000 })) };
    const embedder = { embedGltf: vi.fn(async () => [0.5, 0.5, 0, 0]) };
    const forge = new SignatureForge({ ledger, provider: provider as any, embedder });
    const r = await forge.forge({ brand_essence: "apothecary minimalism", project_id: "proj-1" });
    expect(r.path).toBe("/tmp/x.glb");
    expect(provider.generate).toHaveBeenCalledOnce();
  });

  it("retries with mutated prompt on collision", async () => {
    const ledger = new UniquenessLedger({ path: TMP, dims: 4, minDistance: 0.4 });
    await ledger.init();
    await ledger.record("taken", [1, 0, 0, 0], {});
    const provider = { generate: vi.fn(async () => ({ path: "/tmp/new.glb", sha256: "d", bytes: 1000 })) };
    let call = 0;
    const embedder = { embedGltf: vi.fn(async () => call++ === 0 ? [1, 0.01, 0, 0] : [0.1, 0.9, 0, 0]) };
    const forge = new SignatureForge({ ledger, provider: provider as any, embedder, maxAttempts: 3 });
    const r = await forge.forge({ brand_essence: "e", project_id: "p" });
    expect(provider.generate).toHaveBeenCalledTimes(2);
    expect(r.path).toBe("/tmp/new.glb");
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import type { UniquenessLedger } from "./uniquenessLedger.js";

export interface SigProvider { generate(input: { prompt: string; seed: number }): Promise<{ path: string; sha256: string; bytes: number; }>; }
export interface GltfEmbedder { embedGltf(path: string): Promise<number[]>; }

export interface ForgeOptions {
  ledger: UniquenessLedger;
  provider: SigProvider;
  embedder: GltfEmbedder;
  maxAttempts?: number;
}

export interface ForgeInput { brand_essence: string; project_id: string; }

export class SignatureForge {
  constructor(private opts: ForgeOptions) {}
  async forge(input: ForgeInput): Promise<{ path: string; sha256: string; bytes: number; }>{
    const max = this.opts.maxAttempts ?? 3;
    for (let i = 0; i < max; i++) {
      const seed = Date.now() + i;
      const prompt = i === 0 ? `${input.brand_essence} — signature mark` : `${input.brand_essence} — variant ${i}`;
      const asset = await this.opts.provider.generate({ prompt, seed });
      const embedding = await this.opts.embedder.embedGltf(asset.path);
      try {
        await this.opts.ledger.record(input.project_id, embedding, { brand: input.brand_essence, path: asset.path });
        return asset;
      } catch (e) {
        if (i === max - 1) throw e;
      }
    }
    throw new Error("signature forge exhausted retries");
  }
}
```

- [ ] **Step 3: Run + commit**

```bash
cd packages/generative-archetype && npx vitest run tests/signature-forge.test.ts
git add packages/generative-archetype/src/signatureForge.ts packages/generative-archetype/tests/signature-forge.test.ts
git commit -m "feat(v4-m4): SignatureForge with uniqueness ledger retries"
```

---

## Task 12: Barrel + build

**Files:**
- Create: `packages/generative-archetype/src/index.ts`

```typescript
export * from "./referenceMiner.js";
export * from "./archetypeSynthesizer.js";
export * from "./signatureForge.js";
export * from "./uniquenessLedger.js";
```

- [ ] **Step 1: Build + commit**

```bash
cd packages/generative-archetype && npm run build
git add packages/generative-archetype/src/index.ts packages/generative-archetype/dist
git commit -m "feat(v4-m4): generative-archetype barrel + build"
```

---

## Task 13: `/gen:archetype-synth` command + worker

**Files:**
- Create: `commands/gen-archetype-synth.md`
- Create: `scripts/gen-archetype-synth.mjs`
- Create: `agents/workers/asset/archetype-synthesizer.md`
- Create: `agents/workers/asset/reference-embedding-miner.md`

- [ ] **Step 1: Worker frontmatter (both files)**

Use the worker template from M1. Frontmatter:
- `archetype-synthesizer`: capability `synthesize-archetype`, input `SynthInput`, output `GeneratedArchetype`
- `reference-embedding-miner`: capability `mine-references`, input `{ paths: string[] }`, output `MineReport`

Both in-process (return JSON objects, no worktree).

- [ ] **Step 2: Command doc**

```markdown
---
description: Synthesize a bespoke archetype from brand reference images / URLs
argument-hint: "<ref1> <ref2> ... [--seeds <list>] [--weights <list>] [--slug <slug>]"
---

# /gen:archetype-synth

1. Download references to `/tmp/genorah-refs/`.
2. Dispatch `reference-embedding-miner` via Flux Kontext embeddings + pixel-kmeans palette.
3. Dispatch `archetype-synthesizer` with mine report + seed_templates + weights.
4. Write `skills/design-archetypes/archetypes/<slug>/archetype.json`.
5. Print summary.

Run: `node ${plugin_root}/scripts/gen-archetype-synth.mjs "$ARGUMENTS"`.
```

- [ ] **Step 3: Script**

```javascript
#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { ReferenceMiner, synthesizeArchetype } from "../packages/generative-archetype/dist/index.js";
// NOTE: production version wires Flux Kontext embedder + sharp-based k-means palette here.
// For M4 CLI smoke, we require callers to supply a pre-computed mine JSON.

const [mineJsonPath, slugArg, seedsArg, weightsArg] = process.argv.slice(2);
if (!mineJsonPath || !slugArg || !seedsArg || !weightsArg) {
  console.error("usage: gen-archetype-synth <mine.json> <slug> <seeds-csv> <weights-csv>");
  process.exit(1);
}
const { readFileSync } = await import("fs");
const mine = JSON.parse(readFileSync(mineJsonPath, "utf8"));
const seed_templates = seedsArg.split(",");
const blend_weights = weightsArg.split(",").map(Number);
const archetype = synthesizeArchetype({ slug: slugArg, mine, seed_templates, blend_weights });
const dir = join("skills/design-archetypes/archetypes", slugArg);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "archetype.json"), JSON.stringify(archetype, null, 2));
console.log(`wrote ${join(dir, "archetype.json")}`);
```

- [ ] **Step 4: Commit**

```bash
git add commands/gen-archetype-synth.md scripts/gen-archetype-synth.mjs agents/workers/asset/archetype-synthesizer.md agents/workers/asset/reference-embedding-miner.md
git commit -m "feat(v4-m4): /gen:archetype-synth + 2 workers"
```

---

## Task 14: `/gen:signature-mark` command + worker

**Files:**
- Create: `commands/gen-signature-mark.md`
- Create: `scripts/gen-signature-mark.mjs`
- Create: `agents/workers/asset/signature-dna-forge.md`

- [ ] **Step 1: Worker frontmatter**

`signature-dna-forge`: capability `forge-signature`, input `ForgeInput`, output `{ path, sha256 }`. In-process.

- [ ] **Step 2: Command + script**

Command doc reads `.planning/genorah/DESIGN-DNA.md:brand_essence` and `project_id`, calls SignatureForge using Rodin provider (from M3 asset-forge) + a simple GLTF embedder stub (reads first 256 floats of bin as embedding — good enough for M4; M5 replaces with proper model).

- [ ] **Step 3: Commit**

```bash
git add commands/gen-signature-mark.md scripts/gen-signature-mark.mjs agents/workers/asset/signature-dna-forge.md
git commit -m "feat(v4-m4): /gen:signature-mark + signature-dna-forge worker"
```

---

## Task 15: Tension Council protocol

**Files:**
- Create: `skills/archetype-arbitration/SKILL.md`
- Modify: `agents/directors/creative-director.md`
- Modify: `skills/archetype-mixing/SKILL.md`

- [ ] **Step 1: Skill doc (4-layer)**

`skills/archetype-arbitration/SKILL.md` describes:
- **Layer 1:** invoked by creative-director when blended DNA has conflicting mandatory techniques or forbidden patterns
- **Layer 2:** 3-agent vote (creative-director + brand-voice-enforcer + narrative-director), majority wins; on tie, creative-director breaks
- **Layer 3:** reads DNA blend_weights, archetype metadata, brand voice tokens
- **Layer 4:** anti-pattern — silent archetype override without vote trail; must log every arbitration to `DECISIONS.jsonld`

- [ ] **Step 2: Extend creative-director**

Append to `agents/directors/creative-director.md`:

```markdown
## Tension Council Protocol

When multi-archetype blend produces a conflict (mandatory-technique of A overlaps forbidden-pattern of B):

1. Load conflict details.
2. Dispatch `brand-voice-enforcer` (worker) with brand voice question: "does A or B better serve this voice?"
3. Dispatch `narrative-director` (director) for arc fit verdict.
4. Collect 3 votes (own vote first). Majority wins; on tie, creative-director breaks.
5. Log decision to `DECISIONS.jsonld` with full vote trail (immutable append).
6. Emit AG-UI `STATE_DELTA` event with arbitration outcome.
```

- [ ] **Step 3: Extend archetype-mixing skill**

Add "When conflicts arise" section pointing to `archetype-arbitration`.

- [ ] **Step 4: Commit**

```bash
git add skills/archetype-arbitration skills/archetype-mixing/SKILL.md agents/directors/creative-director.md
git commit -m "feat(v4-m4): Tension Council arbitration protocol"
```

---

## Task 16: Neuro-aesthetic gate (validator + 14th category)

**Files:**
- Create: `scripts/validators/neuro-aesthetic.mjs`
- Create: `scripts/validators/neuro-aesthetic.test.mjs`
- Modify: `skills/quality-gate-v3/SKILL.md` (bump UX axis)

- [ ] **Step 1: Test**

```javascript
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { scoreNeuroAesthetic } from "./neuro-aesthetic.mjs";

test("full 20 pts on a well-balanced section", () => {
  const r = scoreNeuroAesthetic({
    fixation_first_element_is_cta: true,
    saccade_path_matches_reading_order: true,
    attention_heatmap_peak_on_primary: true,
    hicks_choices_count: 3,
    reading_grade: 7,
    cognitive_load_pass: true
  });
  assert.equal(r.score, 20);
});

test("penalizes when fixation lands off-CTA", () => {
  const r = scoreNeuroAesthetic({
    fixation_first_element_is_cta: false,
    saccade_path_matches_reading_order: true,
    attention_heatmap_peak_on_primary: true,
    hicks_choices_count: 3,
    reading_grade: 7,
    cognitive_load_pass: true
  });
  assert.ok(r.score < 20);
});

test("penalizes too many choices (Hick's law)", () => {
  const r = scoreNeuroAesthetic({
    fixation_first_element_is_cta: true,
    saccade_path_matches_reading_order: true,
    attention_heatmap_peak_on_primary: true,
    hicks_choices_count: 9,
    reading_grade: 7,
    cognitive_load_pass: true
  });
  assert.ok(r.score < 20);
});
```

- [ ] **Step 2: Implement**

```javascript
const RUBRIC = [
  { key: "fixation_first_element_is_cta", weight: 4 },
  { key: "saccade_path_matches_reading_order", weight: 4 },
  { key: "attention_heatmap_peak_on_primary", weight: 4 },
  { key: "hicks_choices_count", weight: 3, scorer: v => (v <= 4 ? 3 : v <= 6 ? 2 : v <= 8 ? 1 : 0) },
  { key: "reading_grade", weight: 2, scorer: v => (v <= 9 ? 2 : v <= 11 ? 1 : 0) },
  { key: "cognitive_load_pass", weight: 3 }
];

export function scoreNeuroAesthetic(input) {
  let score = 0; const findings = [];
  for (const rule of RUBRIC) {
    const v = input[rule.key];
    let award = 0;
    if (rule.scorer) award = rule.scorer(v ?? 0);
    else if (typeof v === "boolean") award = v ? rule.weight : 0;
    findings.push({ key: rule.key, award, max: rule.weight });
    score += award;
  }
  return { score, findings };
}
```

- [ ] **Step 3: Run + commit**

```bash
node --test scripts/validators/neuro-aesthetic.test.mjs
```

Update `skills/quality-gate-v3/SKILL.md`: UX Integrity axis → 140 pts (adds Neuro-aesthetic 20). Total gate → **394 pts**.

```bash
git add scripts/validators/neuro-aesthetic.mjs scripts/validators/neuro-aesthetic.test.mjs skills/quality-gate-v3/SKILL.md
git commit -m "feat(v4-m4): neuro-aesthetic 14th quality category (+20 UX, total 394)"
```

---

## Task 17: neuro-aesthetic supporting skill

**Files:**
- Create: `skills/neuro-aesthetic-gate/SKILL.md`

- [ ] **Step 1: 4-layer doc**

Covers:
- Layer 1 — Decision: invoke during `/gen:audit` when archetype_specificity passes
- Layer 2 — Examples: saliency map overlay per section; heatmap overlay produced by `vr-snapshot-taker` (M5) + ONNX saliency model
- Layer 3 — Integration: reads section screenshots + DNA primary-element selector
- Layer 4 — Anti-patterns: generic "engagement score"; vanity metrics

- [ ] **Step 2: Commit**

```bash
git add skills/neuro-aesthetic-gate
git commit -m "feat(v4-m4): neuro-aesthetic-gate skill"
```

---

## Task 18: living-system-runtime supporting skill

**Files:**
- Create: `skills/living-system-runtime/SKILL.md`

- [ ] **Step 1: 4-layer doc**

Code sample (Next.js RootLayout integrating the provider):

```tsx
import { LivingSystemProvider } from "@genorah/living-system-runtime";
import rules from "../.planning/genorah/LIVING-RULES.json";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html><body><LivingSystemProvider rules={rules}>{children}</LivingSystemProvider></body></html>;
}
```

- [ ] **Step 2: Commit**

```bash
git add skills/living-system-runtime
git commit -m "feat(v4-m4): living-system-runtime skill"
```

---

## Task 19: generative-archetype-synthesizer skill + signature-dna-forge skill

**Files:**
- Create: `skills/generative-archetype-synthesizer/SKILL.md`
- Create: `skills/signature-dna-forge/SKILL.md`

- [ ] **Step 1: 4-layer docs**

Each references its command (Tasks 13, 14) and shows the YAML/JSON inputs and outputs.

- [ ] **Step 2: Commit**

```bash
git add skills/generative-archetype-synthesizer skills/signature-dna-forge
git commit -m "feat(v4-m4): synthesizer + signature-dna-forge skills"
```

---

## Task 20: Extend /gen:audit with neuro-aesthetic integration

**Files:**
- Modify: `scripts/audit.mjs`

- [ ] **Step 1: Wire in scoreNeuroAesthetic**

After Scene Craft scoring, add:

```javascript
import { scoreNeuroAesthetic } from "./validators/neuro-aesthetic.mjs";
const inputs = await collectNeuroInputs(); // reads screenshots + DNA selectors
const neuro = scoreNeuroAesthetic(inputs);
gateReport.neuro_aesthetic = neuro;
uxTotal += neuro.score;
```

- [ ] **Step 2: Commit**

```bash
git add scripts/audit.mjs
git commit -m "feat(v4-m4): /gen:audit scores neuro-aesthetic category"
```

---

## Task 21: Regenerate agent cards + tag

- [ ] **Step 1: Scaffold + regenerate**

```bash
node scripts/scaffold-director.mjs # no-op if unchanged
node scripts/scaffold-workers.mjs   # adds 3 new workers
node scripts/generate-agent-cards.mjs
```
Expected: 108 cards.

- [ ] **Step 2: Update integration-cards.test.ts count**

Change the expected count from 105 to 108.

- [ ] **Step 3: Bump + tag**

```bash
sed -i '' 's/"version": "4.0.0-alpha.3"/"version": "4.0.0-alpha.4"/' .claude-plugin/plugin.json
git add .claude-plugin
git commit -m "chore(v4-m4): 4.0.0-alpha.4 + regenerate cards (108 agents)"
git tag v4.0.0-alpha.4 -m "v4 M4: beyond archetypes"
```

---

## Task 22: M4 regression

- [ ] **Step 1: All tests**

```bash
cd packages/protocol && npm test
cd ../canvas-runtime && npm test
cd ../asset-forge && npm test
cd ../living-system-runtime && npm test
cd ../generative-archetype && npm test
cd ../.. && npm test
node --test scripts/validators/*.test.mjs
```
Expected: ~295 passing.

- [ ] **Step 2: Completion summary**

Create `docs/superpowers/plans/v4-m4-completion.md`.

---

## M4 Exit Criteria

- [ ] 108 agents (was 105); 10 directors + 98 workers
- [ ] `@genorah/living-system-runtime` + `@genorah/generative-archetype` build + tests pass
- [ ] `/gen:archetype-synth` produces a valid archetype.json from a mine report
- [ ] `/gen:signature-mark` forges + registers in uniqueness ledger
- [ ] Tension Council protocol documented + creative-director updated
- [ ] Neuro-aesthetic gate scored in `/gen:audit` (UX axis = 140, total = 394)
- [ ] `v4.0.0-alpha.4` tag
