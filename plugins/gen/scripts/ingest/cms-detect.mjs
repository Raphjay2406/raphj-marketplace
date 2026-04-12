#!/usr/bin/env node
// v3.22 CMS detection — inspect captured HTML + network for CMS fingerprints.
// Records detection in ledger; does NOT attempt schema access without explicit token.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { append } from './preservation-ledger.mjs';

const FINGERPRINTS = [
  { cms: 'sanity', patterns: [/sanity[._-]io/i, /groq\s*`/, /@sanity\/client/] },
  { cms: 'contentful', patterns: [/cdn\.contentful\.com/, /contentful\.createClient/, /space[_-]?id/i] },
  { cms: 'payload', patterns: [/payload-cms/i, /\/admin\b.*payload/i] },
  { cms: 'wordpress', patterns: [/wp-content\//, /wp-json\/wp\/v2/, /generator.*wordpress/i] },
  { cms: 'strapi', patterns: [/strapi/i, /strapi-plugin/] },
  { cms: 'builder', patterns: [/builder\.io/i, /builder-component/] },
  { cms: 'storyblok', patterns: [/storyblok/i, /a\.storyblok\.com/] },
  { cms: 'shopify', patterns: [/cdn\.shopify\.com/, /shopify\.liquid/, /shopify-section/] },
];

function walkCapture(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkCapture(full, out);
    else if (/\.(html?|json|js|txt)$/i.test(name) && st.size < 5_000_000) out.push(full);
  }
  return out;
}

function main() {
  const slug = process.argv[2];
  if (!slug) { console.error('Usage: cms-detect.mjs <slug>'); process.exit(1); }
  const dest = join(process.cwd(), '.planning', 'genorah', 'ingested', slug);
  const files = [...walkCapture(join(dest, 'captured')), ...walkCapture(join(dest, 'source'))];
  const hits = new Map();
  for (const f of files) {
    let text;
    try { text = readFileSync(f, 'utf8'); } catch { continue; }
    for (const fp of FINGERPRINTS) {
      for (const p of fp.patterns) {
        if (p.test(text)) {
          const current = hits.get(fp.cms) || { hits: 0, matches: new Set() };
          current.hits++;
          current.matches.add(p.source.slice(0, 30));
          hits.set(fp.cms, current);
        }
      }
    }
  }

  if (hits.size === 0) { append(slug, { kind: 'cms.detect', result: 'none' }); console.log('No CMS detected.'); return; }

  const ranked = [...hits.entries()].sort((a, b) => b[1].hits - a[1].hits);
  for (const [cms, state] of ranked) {
    append(slug, { kind: 'cms.detected', cms, hits: state.hits, evidence: [...state.matches] });
  }
  append(slug, { kind: 'gap', reason: 'cms-credentials-missing', detected: ranked[0][0], remedy: 'Provide --cms-token and --cms-project to enable schema discovery.' });
  console.log(`CMS detected: ${ranked.map(([c, s]) => `${c}(${s.hits})`).join(', ')}`);
}

main();
