#!/usr/bin/env node
/**
 * cost-tracker — v3.5.6
 *
 * Aggregates token + API cost from METRICS.md and journal.ndjson.
 * Subcommands: record | report | budget-check
 */
import { readFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { argv, exit, stderr } from 'node:process';

const STORE = '.planning/genorah/cost-ledger.ndjson';

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

function cmd_record(args) {
  const entry = {
    ts: new Date().toISOString(),
    actor: args.actor || 'unknown',
    tokens_in: Number(args['tokens-in'] || 0),
    tokens_out: Number(args['tokens-out'] || 0),
    api_usd: Number(args['api-usd'] || 0),
    provider: args.provider || null,
    model: args.model || null,
    subject: args.subject || null,
    cache_hit: args['cache-hit'] === 'true',
  };
  mkdirSync('.planning/genorah', { recursive: true });
  appendFileSync(STORE, JSON.stringify(entry) + '\n');
  console.log('recorded');
}

function readEntries() {
  if (!existsSync(STORE)) return [];
  return readFileSync(STORE, 'utf8').split('\n').filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

function cmd_report(args) {
  const entries = readEntries();
  if (entries.length === 0) { console.log('No cost data yet.'); return; }

  const byActor = new Map();
  let totalIn = 0, totalOut = 0, totalUsd = 0, cacheHits = 0;
  for (const e of entries) {
    const total = e.tokens_in + e.tokens_out;
    totalIn += e.tokens_in; totalOut += e.tokens_out; totalUsd += e.api_usd;
    if (e.cache_hit) cacheHits++;
    const key = e.actor || 'unknown';
    if (!byActor.has(key)) byActor.set(key, { tokens: 0, usd: 0, calls: 0 });
    const a = byActor.get(key);
    a.tokens += total; a.usd += e.api_usd; a.calls += 1;
  }
  const totalTokens = totalIn + totalOut;
  const hitRate = ((cacheHits / entries.length) * 100).toFixed(1);

  const lines = ['COST REPORT', '==========='];
  lines.push(`Tokens (in+out): ${totalTokens.toLocaleString()}  (${totalIn.toLocaleString()} in, ${totalOut.toLocaleString()} out)`);
  lines.push(`API spend:       $${totalUsd.toFixed(2)}`);
  lines.push(`Calls:           ${entries.length}`);
  lines.push(`Cache hit rate:  ${hitRate}%`);
  lines.push('');
  lines.push('Breakdown by actor:');
  const sorted = [...byActor.entries()].sort((a, b) => b[1].tokens - a[1].tokens);
  for (const [actor, a] of sorted) {
    const pct = ((a.tokens / totalTokens) * 100).toFixed(0);
    lines.push(`  ${actor.padEnd(24)} ${String(a.tokens).padStart(10)} tokens (${pct}%)  $${a.usd.toFixed(2)}  (${a.calls} calls)`);
  }
  console.log(lines.join('\n'));
}

function cmd_budget_check(args) {
  const entries = readEntries();
  const totalTokens = entries.reduce((s, e) => s + e.tokens_in + e.tokens_out, 0);
  const totalUsd = entries.reduce((s, e) => s + e.api_usd, 0);
  const maxTokens = Number(args['max-tokens'] || 1000000);
  const maxUsd = Number(args['max-usd'] || 50);

  const tokenPct = (totalTokens / maxTokens) * 100;
  const usdPct = (totalUsd / maxUsd) * 100;
  const result = {
    tokens: { used: totalTokens, max: maxTokens, pct: tokenPct },
    usd: { used: totalUsd, max: maxUsd, pct: usdPct },
    over_budget: tokenPct >= 100 || usdPct >= 100,
    near_budget: tokenPct >= 75 || usdPct >= 75,
  };
  console.log(JSON.stringify(result, null, 2));
  if (result.over_budget) exit(1);
}

const sub = argv[2];
const args = parseArgs(argv);
switch (sub) {
  case 'record': cmd_record(args); break;
  case 'report': cmd_report(args); break;
  case 'budget-check': cmd_budget_check(args); break;
  default:
    stderr.write('usage: cost-tracker <record|report|budget-check>\n');
    exit(2);
}
