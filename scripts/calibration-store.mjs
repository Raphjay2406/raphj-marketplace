#!/usr/bin/env node
/**
 * calibration-store — v3.5.4
 *
 * User-global judge calibration at ~/.claude/genorah/calibration.db (SQLite).
 * Gracefully degrades to JSONL when sqlite3 unavailable.
 *
 * Subcommands: init | judge-write | kappa-write | drift | kappa-trend | alerts | ingest-goldens
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { argv, exit, stderr } from 'node:process';

const ROOT = join(homedir(), '.claude', 'genorah');
const JSONL = join(ROOT, 'calibration');

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

function ensureDir() {
  mkdirSync(JSONL, { recursive: true });
}

function appendJsonl(table, row) {
  ensureDir();
  appendFileSync(join(JSONL, `${table}.ndjson`), JSON.stringify(row) + '\n');
}

function readJsonl(table) {
  const path = join(JSONL, `${table}.ndjson`);
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8').split('\n').filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

function cmd_init() {
  ensureDir();
  for (const t of ['goldens', 'judgments', 'kappa_history', 'drift_alerts', 'recalibrations']) {
    const p = join(JSONL, `${t}.ndjson`);
    if (!existsSync(p)) writeFileSync(p, '');
  }
  console.log(`initialized at ${JSONL}`);
}

function cmd_judge_write(args) {
  const row = {
    ts: new Date().toISOString(),
    project_id: args.project || null,
    section_id: args.section || null,
    subject: args.subject,
    judge_model: args['judge-model'],
    prompt_hash: args['prompt-hash'] || null,
    design_score: Number(args.design),
    ux_score: Number(args.ux),
    confidence: args.confidence ? Number(args.confidence) : null,
    shot_count: args['shot-count'] ? Number(args['shot-count']) : null,
    anchor_slugs: args.anchors ? args.anchors.split(',') : [],
    mode: args.mode || 'production',
  };
  if (!row.subject || !row.judge_model || Number.isNaN(row.design_score)) {
    stderr.write('required: --subject --judge-model --design --ux\n'); exit(2);
  }
  appendJsonl('judgments', row);
  console.log('ok');
}

function cmd_kappa_write(args) {
  const row = {
    ts: new Date().toISOString(),
    project_id: args.project || null,
    section_id: args.section,
    judges_count: Number(args['judges-count'] || 2),
    kappa: Number(args.kappa),
    verdict: args.verdict,
  };
  appendJsonl('kappa_history', row);
  console.log('ok');
}

function cmd_drift(args) {
  const windowDays = Number(args.window || 30);
  const cutoff = new Date(Date.now() - windowDays * 86400000).toISOString();
  const judgments = readJsonl('judgments').filter((j) => j.ts >= cutoff && j.mode === 'production');
  const goldens = readJsonl('goldens');
  if (goldens.length === 0 || judgments.length === 0) {
    console.log(JSON.stringify({ delta_rmse: null, alert: false, reason: 'insufficient-data' }));
    return;
  }
  // per-subject average vs consensus
  const bySubject = new Map();
  for (const j of judgments) {
    if (!bySubject.has(j.subject)) bySubject.set(j.subject, []);
    bySubject.get(j.subject).push(j);
  }
  let se = 0, n = 0;
  for (const g of goldens) {
    const rows = bySubject.get(g.id);
    if (!rows) continue;
    const avgD = rows.reduce((s, r) => s + r.design_score, 0) / rows.length;
    const avgU = rows.reduce((s, r) => s + r.ux_score, 0) / rows.length;
    se += (avgD - g.design_consensus) ** 2 + (avgU - g.ux_consensus) ** 2;
    n += 2;
  }
  const rmse = n > 0 ? Math.sqrt(se / n) : null;
  const baseline = Number(args.baseline || 8);  // baseline RMSE from R1
  const delta = rmse != null ? (rmse - baseline) / baseline : null;
  const alert = delta != null && delta > 0.1;
  if (alert) {
    appendJsonl('drift_alerts', { ts: new Date().toISOString(), window_days: windowDays, delta_rmse: delta });
  }
  console.log(JSON.stringify({ rmse, baseline, delta_rmse: delta, alert }));
}

function cmd_kappa_trend(args) {
  const days = Number(args.days || 30);
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  const rows = readJsonl('kappa_history').filter((k) => k.ts >= cutoff);
  const byDay = new Map();
  for (const r of rows) {
    const day = r.ts.slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(r.kappa);
  }
  const trend = [...byDay.entries()]
    .map(([day, ks]) => ({ day, avg_kappa: ks.reduce((a, b) => a + b, 0) / ks.length, n: ks.length }))
    .sort((a, b) => a.day.localeCompare(b.day));
  console.log(JSON.stringify(trend, null, 2));
}

function cmd_alerts(args) {
  const alerts = readJsonl('drift_alerts');
  const filtered = args.unresolved ? alerts.filter((a) => !a.resolved_at) : alerts;
  console.log(JSON.stringify(filtered, null, 2));
}

function cmd_ingest_goldens(args) {
  const dir = args._[0];
  if (!dir || !existsSync(dir)) { stderr.write('provide golden dir path\n'); exit(2); }
  ensureDir();
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md');
  const golden = [];
  for (const f of files) {
    const content = readFileSync(join(dir, f), 'utf8');
    const m = content.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = m[1];
    const id = f.replace(/\.md$/, '');
    const archetype = (fm.match(/archetype:\s*(\S+)/) || [])[1];
    const beat = (fm.match(/beat:\s*(\S+)/) || [])[1];
    const design = Number((fm.match(/design:\s*(\d+)/) || [])[1]);
    const ux = Number((fm.match(/ux:\s*(\d+)/) || [])[1]);
    if (!archetype || !beat || Number.isNaN(design)) continue;
    golden.push({ id, archetype, beat, design_consensus: design, ux_consensus: ux, captured_at: new Date().toISOString() });
  }
  // overwrite goldens
  writeFileSync(join(JSONL, 'goldens.ndjson'), golden.map((g) => JSON.stringify(g)).join('\n') + '\n');
  console.log(`ingested ${golden.length} goldens`);
}

const sub = argv[2];
const args = parseArgs(argv);
switch (sub) {
  case 'init': cmd_init(); break;
  case 'judge-write': cmd_judge_write(args); break;
  case 'kappa-write': cmd_kappa_write(args); break;
  case 'drift': cmd_drift(args); break;
  case 'kappa-trend': cmd_kappa_trend(args); break;
  case 'alerts': cmd_alerts(args); break;
  case 'ingest-goldens': cmd_ingest_goldens(args); break;
  default:
    stderr.write('usage: calibration-store <init|judge-write|kappa-write|drift|kappa-trend|alerts|ingest-goldens>\n');
    exit(2);
}
