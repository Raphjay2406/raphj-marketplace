#!/usr/bin/env node
/**
 * decision-graph — v3.5.4
 *
 * Typed decision graph at .planning/genorah/decisions.json.
 * Subcommands: add | apply | reject | query | validate
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { argv, exit, stderr } from 'node:process';
import { spawnSync } from 'node:child_process';

const STORE = '.planning/genorah/decisions.json';
const MARKDOWN_SURFACE = '.planning/genorah/DECISIONS.md';

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 3; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) {
      const vals = [];
      while (argv[i + 1] && !argv[i + 1].startsWith('--')) { vals.push(argv[++i]); }
      a[k.slice(2)] = vals.length === 1 ? vals[0] : (vals.length === 0 ? true : vals);
    } else a._.push(k);
  }
  return a;
}

function load() {
  if (!existsSync(STORE)) return { version: 1, decisions: [] };
  try { return JSON.parse(readFileSync(STORE, 'utf8')); }
  catch (e) { throw new Error(`decisions.json corrupt: ${e.message}`); }
}

function save(db) {
  mkdirSync(dirname(STORE), { recursive: true });
  writeFileSync(STORE + '.tmp', JSON.stringify(db, null, 2));
  // atomic
  try { spawnSync('node', ['-e', `require('fs').renameSync('${STORE}.tmp','${STORE}')`], { stdio: 'inherit' }); }
  catch { writeFileSync(STORE, JSON.stringify(db, null, 2)); }
}

function nextId(db) {
  const max = db.decisions.reduce((m, d) => {
    const n = parseInt(d.id.replace(/^d-/, ''), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `d-${String(max + 1).padStart(3, '0')}`;
}

function asArray(x) {
  if (x === undefined) return [];
  return Array.isArray(x) ? x : [x];
}

function cmd_add(args) {
  const db = load();
  const id = nextId(db);
  const d = {
    id,
    ts: new Date().toISOString(),
    actor: args.actor || 'user',
    title: args.title || '(untitled)',
    category: args.category || 'design',
    rationale: args.rationale || '',
    status: 'pending',
    impacts: asArray(args.impacts),
    supersedes: asArray(args.supersedes),
    evidence: asArray(args.evidence),
    applied_at: null,
    applied_by: null,
  };
  db.decisions.push(d);
  save(db);
  appendMarkdown(d);
  console.log(`Created ${id}`);
  return d;
}

function cmd_apply(args) {
  const id = args._[0];
  const db = load();
  const d = db.decisions.find((x) => x.id === id);
  if (!d) { stderr.write(`decision ${id} not found\n`); exit(1); }
  if (d.status === 'applied') { console.log(`${id} already applied`); return; }
  d.status = 'applied';
  d.applied_at = new Date().toISOString();
  d.applied_by = args.by || 'user';
  save(db);
  console.log(`Applied ${id}`);
}

function cmd_reject(args) {
  const id = args._[0];
  const db = load();
  const d = db.decisions.find((x) => x.id === id);
  if (!d) { stderr.write(`decision ${id} not found\n`); exit(1); }
  d.status = 'rejected';
  d.rejected_reason = args.reason || '';
  save(db);
  console.log(`Rejected ${id}`);
}

function cmd_query(args) {
  const db = load();
  let results = db.decisions;
  if (args.impacts) {
    const needle = args.impacts;
    results = results.filter((d) => d.impacts.some((i) => i.includes(needle)));
  }
  if (args.status) results = results.filter((d) => d.status === args.status);
  if (args.since) results = results.filter((d) => d.ts >= args.since);
  if (args.graph === 'supersedes') {
    const edges = results.flatMap((d) => d.supersedes.map((s) => ({ from: d.id, to: s })));
    console.log(JSON.stringify({ nodes: results.map((d) => ({ id: d.id, title: d.title })), edges }, null, 2));
    return;
  }
  console.log(JSON.stringify(results, null, 2));
}

function cmd_validate() {
  const db = load();
  const issues = [];
  const ids = new Set(db.decisions.map((d) => d.id));
  // uniqueness
  if (ids.size !== db.decisions.length) issues.push('duplicate decision IDs');
  // supersedes targets exist
  for (const d of db.decisions) {
    for (const s of d.supersedes) if (!ids.has(s)) issues.push(`${d.id} supersedes missing ${s}`);
  }
  // cycle detection in supersedes (DFS)
  const adj = new Map(db.decisions.map((d) => [d.id, d.supersedes]));
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  function dfs(u) {
    color.set(u, GRAY);
    for (const v of adj.get(u) || []) {
      if (color.get(v) === GRAY) { issues.push(`cycle via ${u} → ${v}`); return; }
      if (!color.get(v)) dfs(v);
    }
    color.set(u, BLACK);
  }
  for (const d of db.decisions) if (!color.get(d.id)) dfs(d.id);
  if (issues.length) { console.log('ISSUES:'); issues.forEach((i) => console.log('  ' + i)); exit(1); }
  console.log(`Validated ${db.decisions.length} decisions OK`);
}

function appendMarkdown(d) {
  const line = `\n## ${d.id} (${d.status}) — ${d.ts}\n**Category:** ${d.category}  \n**Title:** ${d.title}  \n**Rationale:** ${d.rationale}  \n**Impacts:** ${d.impacts.join(', ') || '—'}  \n**Supersedes:** ${d.supersedes.join(', ') || '—'}  \n**Evidence:** ${d.evidence.join(', ') || '—'}  \n`;
  mkdirSync(dirname(MARKDOWN_SURFACE), { recursive: true });
  try {
    if (!existsSync(MARKDOWN_SURFACE)) writeFileSync(MARKDOWN_SURFACE, '# Decisions (human-readable surface)\n');
    const cur = readFileSync(MARKDOWN_SURFACE, 'utf8');
    writeFileSync(MARKDOWN_SURFACE, cur + line);
  } catch {}
}

const sub = argv[2];
const args = parseArgs(argv);
switch (sub) {
  case 'add': cmd_add(args); break;
  case 'apply': cmd_apply(args); break;
  case 'reject': cmd_reject(args); break;
  case 'query': cmd_query(args); break;
  case 'validate': cmd_validate(); break;
  default:
    stderr.write('usage: decision-graph <add|apply|reject|query|validate> [args]\n');
    exit(2);
}
