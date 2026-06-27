/**
 * Perf: MemoryGraph p99 query latency for 10k records.
 * Skipped when better-sqlite3 native module fails to load (e.g. mismatched Node ABI).
 */
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { rmSync, mkdtempSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const P99_BUDGET_MS = 50; // p99 query must be under 50ms for 10k records

function loadMemoryGraph() {
  try {
    // Dynamic import to allow skip on native module failure
    return import("../../packages/memory-graph/dist/index.js");
  } catch {
    return null;
  }
}

test("memory-graph-latency: p99 query under 50ms for 10k records", async (t) => {
  let mod;
  try {
    mod = await import("../../packages/memory-graph/dist/index.js");
  } catch (e) {
    t.skip(`memory-graph dist unavailable or native module failed: ${e.message}`);
    return;
  }

  const { MemoryGraph } = mod;
  const dir = mkdtempSync(join(tmpdir(), "genorah-mg-perf-"));
  const dbPath = join(dir, "test.db");
  const DIMS = 16; // small for perf test speed
  const RECORD_COUNT = 10_000;

  const graph = new MemoryGraph({ path: dbPath, dims: DIMS });
  await graph.init();

  // Seed 10k records
  for (let i = 0; i < RECORD_COUNT; i++) {
    await graph.record({
      project_id: `proj-${i % 50}`,
      decision_id: `dec-${i}`,
      archetype: i % 2 === 0 ? "brutalist" : "ethereal",
      score: 150 + (i % 85),
      category: "layout",
      summary: `Decision ${i} summary text for search`,
      embedding: Array.from({ length: DIMS }, (_, j) => Math.sin(i * 0.01 + j * 0.1))
    });
  }

  // Measure 100 queries and compute p99
  const queryEmbedding = Array.from({ length: DIMS }, (_, j) => Math.cos(j * 0.1));
  const latencies = [];

  for (let i = 0; i < 100; i++) {
    const start = performance.now();
    await graph.query({ embedding: queryEmbedding, k: 10 });
    latencies.push(performance.now() - start);
  }

  latencies.sort((a, b) => a - b);
  const p99 = latencies[Math.floor(latencies.length * 0.99)];
  const p50 = latencies[Math.floor(latencies.length * 0.50)];

  console.log(`  MemoryGraph latency (10k records, DIMS=${DIMS}): p50=${p50.toFixed(2)}ms p99=${p99.toFixed(2)}ms`);

  assert.ok(
    p99 < P99_BUDGET_MS,
    `p99 latency ${p99.toFixed(2)}ms exceeds budget ${P99_BUDGET_MS}ms`
  );

  // Cleanup — best-effort; on Windows the SQLite file may be locked briefly
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* EBUSY on Windows — ignored */ }
});
