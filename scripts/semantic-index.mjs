#!/usr/bin/env node
/**
 * semantic-index — v3.5.4
 *
 * L5 Context Fabric index. BM25 mode only in v3.5.4; embedding mode (sqlite-vec) deferred to v3.5.6
 * when runtime disk-size story is settled.
 *
 * Backing store: JSONL entries + BM25 ranker in pure JS (no native deps).
 *
 * Subcommands: write | query | rebuild
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { argv, exit, stderr } from 'node:process';

const STORE = '.planning/genorah/index/entries.ndjson';

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 3; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) {
      const v = argv[i + 1];
      if (v && !v.startsWith('--')) { a[k.slice(2)] = v; i++; } else a[k.slice(2)] = true;
    } else a._.push(k);
  }
  return a;
}

function ensureStore() {
  mkdirSync('.planning/genorah/index', { recursive: true });
}

function tokenize(text) {
  return (text || '').toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
}

function cmd_write(args) {
  if (!args.summary) { stderr.write('--summary required\n'); exit(2); }
  const entry = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    ts: new Date().toISOString(),
    layer: args.layer || 'L4',
    source_path: args['source-path'] || '',
    actor: args.actor || null,
    kind: args.kind || null,
    subject: args.subject || null,
    summary: args.summary,
    archetype: args.archetype || null,
    beat: args.beat || null,
    project_id: args.project || null,
    tags: args.tags ? args.tags.split(',') : [],
  };
  ensureStore();
  appendFileSync(STORE, JSON.stringify(entry) + '\n');
  console.log(`indexed ${entry.id}`);
}

function readEntries() {
  if (!existsSync(STORE)) return [];
  return readFileSync(STORE, 'utf8').split('\n').filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

// BM25 scoring
function bm25Score(query, doc, stats) {
  const qTokens = tokenize(query);
  const docTokens = tokenize(doc.summary);
  const k1 = 1.5, b = 0.75;
  let score = 0;
  const docLen = docTokens.length;
  const avgDocLen = stats.avgDocLen;
  const N = stats.N;
  for (const qt of qTokens) {
    const f = docTokens.filter((t) => t === qt).length;
    if (f === 0) continue;
    const n = stats.df.get(qt) || 1;
    const idf = Math.log(((N - n + 0.5) / (n + 0.5)) + 1);
    const norm = f * (k1 + 1) / (f + k1 * (1 - b + b * docLen / avgDocLen));
    score += idf * norm;
  }
  return score;
}

function buildStats(entries) {
  const df = new Map();
  let totalLen = 0;
  for (const e of entries) {
    const tokens = new Set(tokenize(e.summary));
    for (const t of tokens) df.set(t, (df.get(t) || 0) + 1);
    totalLen += tokenize(e.summary).length;
  }
  return { df, N: entries.length, avgDocLen: totalLen / Math.max(entries.length, 1) };
}

function cmd_query(args) {
  if (!args.text) { stderr.write('--text required\n'); exit(2); }
  const topK = parseInt(args['top-k'] || '5', 10);
  let entries = readEntries();
  // filters
  if (args.actor) entries = entries.filter((e) => e.actor === args.actor);
  if (args.kind) entries = entries.filter((e) => e.kind === args.kind);
  if (args.archetype) entries = entries.filter((e) => e.archetype === args.archetype);
  if (args.beat) entries = entries.filter((e) => e.beat === args.beat);
  if (args.since) entries = entries.filter((e) => e.ts >= args.since);
  if (entries.length === 0) { console.log('[]'); return; }
  const stats = buildStats(entries);
  const scored = entries.map((e) => ({ e, score: bm25Score(args.text, e, stats) }));
  scored.sort((a, b) => b.score - a.score);
  const results = scored.slice(0, topK).filter((r) => r.score > 0).map((r) => ({
    score: Number(r.score.toFixed(3)),
    ref: `${r.e.source_path}#${r.e.id}`,
    ts: r.e.ts,
    actor: r.e.actor,
    kind: r.e.kind,
    subject: r.e.subject,
    summary: r.e.summary,
  }));
  console.log(JSON.stringify(results, null, 2));
}

function cmd_rebuild() {
  // For BM25 this is a no-op; reserved for future embedding mode
  const entries = readEntries();
  console.log(`BM25 index active with ${entries.length} entries (rebuild not required in BM25 mode)`);
}

const sub = argv[2];
const args = parseArgs(argv);
switch (sub) {
  case 'write': cmd_write(args); break;
  case 'query': cmd_query(args); break;
  case 'rebuild': cmd_rebuild(); break;
  default:
    stderr.write('usage: semantic-index <write|query|rebuild>\n');
    exit(2);
}
