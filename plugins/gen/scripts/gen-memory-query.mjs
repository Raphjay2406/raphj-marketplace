#!/usr/bin/env node
/**
 * /gen:memory-query runner
 * Queries the cross-project MemoryGraph with a hash-based embedding stub (offline-safe).
 * Wire to a real embedder (e.g. Flux Kontext) when available.
 */
import { createHash } from "crypto";
import { homedir } from "os";
import { join } from "path";

const query = process.argv[2] || "";
if (!query) {
  console.error("usage: gen-memory-query.mjs <query> [--archetype=<a>] [--min-score=<n>] [--project=<p>]");
  process.exit(1);
}

// Parse optional flags
const args = process.argv.slice(3);
const archetypeFlag = args.find(a => a.startsWith("--archetype="))?.split("=")[1];
const minScoreFlag = args.find(a => a.startsWith("--min-score="))?.split("=")[1];
const projectFlag = args.find(a => a.startsWith("--project="))?.split("=")[1];

// Hash-based stub embedding: produces a deterministic 16-dim float vector from query text
function stubEmbed(text) {
  const hash = createHash("sha256").update(text).digest();
  const vec = [];
  for (let i = 0; i < 16; i++) {
    vec.push((hash[i] - 128) / 128);
  }
  return vec;
}

const dbPath = join(homedir(), ".claude/genorah/memory.db");

// Dynamically import — memory-graph may not be built yet, degrade gracefully
let MemoryGraph;
try {
  const mod = await import(
    new URL("../packages/memory-graph/dist/index.js", import.meta.url).href
  );
  MemoryGraph = mod.MemoryGraph;
} catch {
  console.error("memory-graph package not built. Run: cd packages/memory-graph && npm run build");
  process.exit(1);
}

const g = new MemoryGraph({ path: dbPath, dims: 16 });
await g.init();

const filter = {};
if (archetypeFlag) filter.archetype = archetypeFlag;
if (minScoreFlag) filter.min_score = parseInt(minScoreFlag, 10);
if (projectFlag) filter.project_id = projectFlag;

const results = await g.query({
  embedding: stubEmbed(query),
  k: 10,
  filter: Object.keys(filter).length ? filter : undefined
});

if (results.length === 0) {
  console.log("No matching decisions found.");
} else {
  console.log(`Found ${results.length} matching decision(s):\n`);
  for (const r of results) {
    console.log(`  [${r.decision_id}] project=${r.project_id} archetype=${r.archetype} score=${r.score}`);
    console.log(`    category: ${r.category}`);
    console.log(`    summary:  ${r.summary}`);
    console.log(`    distance: ${r.distance.toFixed(4)}\n`);
  }
}
