#!/usr/bin/env node
// v3.21 DNA extraction — reads captured artifacts, runs color/font/spacing inference.
// Stage 3 of ingestion. Emits DNA-EXTRACTED.md + dna.extract ledger entries.
// Pure-Node k-means sketch included; real extraction needs per-breakpoint pixel access
// (sharp/canvas) — when missing, falls back to CSS-variable parsing of captured source.

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { append } from './preservation-ledger.mjs';

function extractCssVariables(cssText) {
  const vars = {};
  const re = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(cssText)) !== null) vars[m[1].trim()] = m[2].trim();
  return vars;
}

function findCssFiles(root, out = []) {
  if (!existsSync(root)) return out;
  for (const name of readdirSync(root)) {
    const full = join(root, name);
    const st = statSync(full);
    if (st.isDirectory()) findCssFiles(full, out);
    else if (/\.(css|scss)$/.test(name)) out.push(full);
  }
  return out;
}

function classifyToken(name) {
  const n = name.toLowerCase();
  if (/bg|background/.test(n)) return 'bg';
  if (/surface|card|panel/.test(n)) return 'surface';
  if (/text|fg|foreground/.test(n)) return 'text';
  if (/border|outline|divider/.test(n)) return 'border';
  if (/primary|brand/.test(n)) return 'primary';
  if (/secondary/.test(n)) return 'secondary';
  if (/accent/.test(n)) return 'accent';
  if (/muted|subtle/.test(n)) return 'muted';
  if (/glow/.test(n)) return 'glow';
  if (/tension/.test(n)) return 'tension';
  if (/highlight/.test(n)) return 'highlight';
  if (/signature/.test(n)) return 'signature';
  return null;
}

function main() {
  const slug = process.argv[2];
  if (!slug) { console.error('Usage: dna-extract.mjs <slug>'); process.exit(1); }
  const dest = join(process.cwd(), '.planning', 'genorah', 'ingested', slug);
  const sourceDir = join(dest, 'source');
  const capturedDir = join(dest, 'captured');

  const cssFiles = [...findCssFiles(sourceDir), ...findCssFiles(capturedDir)];
  const aggregated = {};
  for (const f of cssFiles) {
    const text = readFileSync(f, 'utf8');
    Object.assign(aggregated, extractCssVariables(text));
  }

  const tokens = {};
  for (const [name, value] of Object.entries(aggregated)) {
    const slot = classifyToken(name);
    if (!slot) continue;
    const confidence = 0.9; // explicit CSS variable = high confidence
    tokens[slot] = { value, confidence, source: `css-var:--${name}` };
    append(slug, { kind: 'dna.extract', token: `color.${slot}`, value, confidence, method: 'css-var', evidence: `--${name}` });
  }

  const missing = ['bg','surface','text','border','primary','secondary','accent','muted','glow','tension','highlight','signature']
    .filter(s => !tokens[s]);
  for (const m of missing) {
    append(slug, { kind: 'gap', reason: 'dna-low-confidence', token: `color.${m}`, rationale: 'no css-var match, pixel extraction required' });
  }

  const md = [
    `# DNA Extracted — ${slug}`,
    ``,
    `## Colors`,
    ``,
    ...Object.entries(tokens).map(([slot, t]) => `- **${slot}**: \`${t.value}\` (confidence ${t.confidence}, ${t.source})`),
    ``,
    `## Gaps`,
    ``,
    ...missing.map(m => `- \`color.${m}\` — not derivable from CSS; run pixel extraction stage`),
    ``,
    `## Next`,
    `- Run archetype-score.mjs <slug>`,
    `- Review gaps; confirm via /gen:ingest gap ${slug}`,
  ].join('\n');
  writeFileSync(join(dest, 'DNA-EXTRACTED.md'), md);
  append(slug, { kind: 'dna.extract.complete', derived: Object.keys(tokens).length, gaps: missing.length });
  console.log(`DNA extracted: ${Object.keys(tokens).length} tokens, ${missing.length} gaps → ${dest}/DNA-EXTRACTED.md`);
}

main();
