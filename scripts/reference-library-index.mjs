#!/usr/bin/env node
/**
 * reference-library-index — v3.5.4
 *
 * Reads skills/reference-library-rag/entries/*.md and builds query-able index.
 * Subcommands: rebuild | retrieve
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { argv, exit, stderr } from 'node:process';

const ENTRIES_DIR = 'skills/reference-library-rag/entries';
const INDEX_PATH = '.planning/genorah/index/reference-library.json';

const BEAT_ADJACENT = {
  HOOK: ['TEASE', 'REVEAL'], TEASE: ['HOOK', 'REVEAL'], REVEAL: ['TEASE', 'HOOK'],
  BUILD: ['PROOF', 'REVEAL'], PEAK: ['TENSION'], TENSION: ['PEAK'],
  PROOF: ['BUILD'], PIVOT: ['TENSION', 'CLOSE'], CLOSE: ['PIVOT'], BREATHE: [],
};

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

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = m[1];
  const obj = {};
  for (const line of fm.split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) obj[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  // tags array
  const tagsM = fm.match(/tags:\s*\[(.*?)\]/);
  if (tagsM) obj.tags = tagsM[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
  // nested panel.design / panel.ux
  const qpDesign = fm.match(/design:\s*(\d+)/);
  const qpUx = fm.match(/ux:\s*(\d+)/);
  const qpAww = fm.match(/awwwards_avg:\s*([\d.]+)/);
  obj.quality_panel = {
    design: qpDesign ? Number(qpDesign[1]) : null,
    ux: qpUx ? Number(qpUx[1]) : null,
    awwwards_avg: qpAww ? Number(qpAww[1]) : null,
  };
  return obj;
}

function cmd_rebuild() {
  if (!existsSync(ENTRIES_DIR)) {
    mkdirSync(ENTRIES_DIR, { recursive: true });
    console.log(`created empty ${ENTRIES_DIR}`);
  }
  const files = readdirSync(ENTRIES_DIR).filter((f) => f.endsWith('.md'));
  const entries = [];
  for (const f of files) {
    try {
      const fm = parseFrontmatter(readFileSync(`${ENTRIES_DIR}/${f}`, 'utf8'));
      entries.push({ slug: f.replace(/\.md$/, ''), path: `${ENTRIES_DIR}/${f}`, ...fm });
    } catch (e) { stderr.write(`skipping ${f}: ${e.message}\n`); }
  }
  mkdirSync('.planning/genorah/index', { recursive: true });
  writeFileSync(INDEX_PATH, JSON.stringify(entries, null, 2));
  console.log(`indexed ${entries.length} reference entries → ${INDEX_PATH}`);
}

function cmd_retrieve(args) {
  if (!existsSync(INDEX_PATH)) { stderr.write('index not built. Run: reference-library-index rebuild\n'); exit(1); }
  const entries = JSON.parse(readFileSync(INDEX_PATH, 'utf8'));
  const { archetype, beat, top_k = 5 } = { ...args, top_k: Number(args['top-k'] || 5) };
  if (!archetype) { stderr.write('--archetype required\n'); exit(2); }
  // archetype exact filter
  let filtered = entries.filter((e) => e.archetype === archetype);
  // beat exact or adjacent
  if (beat) {
    const exact = filtered.filter((e) => e.beat === beat);
    const adjacent = filtered.filter((e) => (BEAT_ADJACENT[beat] || []).includes(e.beat));
    filtered = [...exact, ...adjacent];
  }
  // tiebreak on quality_panel.design descending
  filtered.sort((a, b) => (b.quality_panel?.design || 0) - (a.quality_panel?.design || 0));
  const results = filtered.slice(0, top_k);
  console.log(JSON.stringify(results, null, 2));
}

const sub = argv[2];
const args = parseArgs(argv);
switch (sub) {
  case 'rebuild': cmd_rebuild(); break;
  case 'retrieve': cmd_retrieve(args); break;
  default:
    stderr.write('usage: reference-library-index <rebuild|retrieve>\n');
    exit(2);
}
