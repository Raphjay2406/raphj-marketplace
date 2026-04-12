#!/usr/bin/env node
/**
 * agent-memory — v3.5.4
 *
 * Per-agent-kind NDJSON at .planning/genorah/agent-memory/{agent}.ndjson.
 * Subcommands: write | query | render-for-spawn
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { argv, exit, stderr } from 'node:process';

const DIR = '.planning/genorah/agent-memory';

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

function safeJson(s, label) {
  try { return JSON.parse(s); }
  catch { throw new Error(`invalid JSON for ${label}`); }
}

function cmd_write(args) {
  if (!args.agent) { stderr.write('--agent required\n'); exit(2); }
  const entry = {
    ts: new Date().toISOString(),
    task_fingerprint: safeJson(args['task-fingerprint'] || '{}', 'task-fingerprint'),
    input: safeJson(args.input || '{}', 'input'),
    output: safeJson(args.output || '{}', 'output'),
    feedback: safeJson(args.feedback || '{"shipped":false}', 'feedback'),
  };
  mkdirSync(DIR, { recursive: true });
  appendFileSync(`${DIR}/${args.agent}.ndjson`, JSON.stringify(entry) + '\n');
  console.log(`appended to ${DIR}/${args.agent}.ndjson`);
}

function readEntries(agent) {
  const path = `${DIR}/${agent}.ndjson`;
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8').split('\n').filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

function matchScore(entry, fp) {
  let score = 0;
  for (const k of Object.keys(fp)) {
    if (entry.task_fingerprint?.[k] === fp[k]) score += 1;
  }
  return score;
}

function cmd_query(args) {
  if (!args.agent) { stderr.write('--agent required\n'); exit(2); }
  const fp = safeJson(args['task-fingerprint'] || '{}', 'task-fingerprint');
  const topK = parseInt(args['top-k'] || '3', 10);
  const shippedOnly = args['shipped-only'] === 'true' || args['shipped-only'] === true;
  let entries = readEntries(args.agent);
  if (shippedOnly) entries = entries.filter((e) => e.feedback?.shipped);
  const scored = entries.map((e) => ({ e, s: matchScore(e, fp) }));
  scored.sort((a, b) => b.s - a.s || (b.e.ts > a.e.ts ? 1 : -1));
  const top = scored.slice(0, topK).map((x) => x.e);
  console.log(JSON.stringify(top, null, 2));
}

function cmd_render_for_spawn(args) {
  if (!args.agent) { stderr.write('--agent required\n'); exit(2); }
  const fp = safeJson(args['task-fingerprint'] || '{}', 'task-fingerprint');
  const entries = readEntries(args.agent).filter((e) => e.feedback?.shipped);
  const scored = entries.map((e) => ({ e, s: matchScore(e, fp) }));
  scored.sort((a, b) => b.s - a.s);
  const top = scored.slice(0, 3).map((x) => x.e);
  if (top.length === 0) { console.log(''); return; }
  const md = ['PAST RELEVANT WORK (top 3, informational — your task is the CURRENT one):'];
  top.forEach((e, i) => {
    const fp = e.task_fingerprint || {};
    const out = e.output || {};
    const score = out.final_score ? `design=${out.final_score.design}, ux=${out.final_score.ux}` : '';
    md.push(`${i + 1}. [${fp.archetype || '?'}/${fp.beat || '?'}, ${e.ts.slice(0, 10)}] → shipped @ ${score}`);
    if (out.techniques_used) md.push(`   Techniques: ${out.techniques_used.join(', ')}`);
    if (out.key_choices) md.push(`   Key choice: ${out.key_choices[0] || ''}`);
  });
  console.log(md.join('\n'));
}

const sub = argv[2];
const args = parseArgs(argv);
switch (sub) {
  case 'write': cmd_write(args); break;
  case 'query': cmd_query(args); break;
  case 'render-for-spawn': cmd_render_for_spawn(args); break;
  default:
    stderr.write('usage: agent-memory <write|query|render-for-spawn> [args]\n');
    exit(2);
}
