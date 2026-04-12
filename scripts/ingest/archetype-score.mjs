#!/usr/bin/env node
// v3.21 archetype inference — score ingested source against 33 archetype testable-markers.
// Returns top-3 with per-marker evidence. Never auto-locks.

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { append } from './preservation-ledger.mjs';

function loadMarkers() {
  // Look relative to script first (plugin install), then cwd (dev).
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(scriptDir, '..', '..', 'skills', 'design-archetypes', 'testable-markers.json'),
    join(process.cwd(), 'skills', 'design-archetypes', 'testable-markers.json'),
    process.env.GENORAH_MARKERS_PATH,
  ].filter(Boolean);
  for (const p of candidates) {
    if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf8'));
  }
  console.error(`Missing testable-markers.json (tried: ${candidates.join(', ')})`);
  return null;
}

function readAllSource(root, out = [], limit = 5_000_000) {
  if (!existsSync(root)) return out;
  let size = 0;
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop();
    for (const name of readdirSync(cur)) {
      const full = join(cur, name);
      const st = statSync(full);
      if (st.isDirectory()) stack.push(full);
      else if (/\.(tsx?|jsx?|css|scss|html|vue|svelte|astro|mdx?)$/.test(name) && st.size < 2_000_000) {
        if (size + st.size > limit) return out;
        size += st.size;
        out.push(readFileSync(full, 'utf8'));
      }
    }
  }
  return out;
}

function scoreArchetype(archetype, markerGroups, corpus) {
  // markerGroups: { mandatory: [regex...], forbidden: [regex...], signature: [regex...] }
  const evidence = [];
  let score = 0;
  const bucketWeight = { mandatory: 1, signature: 1.5, forbidden: -2 };
  for (const [bucket, patterns] of Object.entries(markerGroups || {})) {
    if (!Array.isArray(patterns)) continue;
    const weight = bucketWeight[bucket] ?? 0;
    for (const pattern of patterns) {
      let re;
      try { re = new RegExp(pattern, 'i'); } catch { continue; }
      const hits = corpus.filter(t => re.test(t)).length;
      if (hits > 0) {
        score += hits * weight;
        evidence.push({ bucket, marker: pattern.slice(0, 40), hits, weight });
      }
    }
  }
  return { archetype, score, evidence };
}

function main() {
  const slug = process.argv[2];
  if (!slug) { console.error('Usage: archetype-score.mjs <slug>'); process.exit(1); }
  const dest = join(process.cwd(), '.planning', 'genorah', 'ingested', slug);
  const sourceDir = join(dest, 'source');
  const capturedDir = join(dest, 'captured');

  const markers = loadMarkers();
  if (!markers) { console.error('Cannot score without testable-markers.json'); process.exit(1); }

  const corpus = [...readAllSource(sourceDir), ...readAllSource(capturedDir)];
  if (corpus.length === 0) { console.error(`Empty corpus for ${slug}`); process.exit(1); }

  const archetypeMap = markers.archetypes || markers;
  const scores = [];
  for (const [archetype, markerGroups] of Object.entries(archetypeMap)) {
    if (typeof markerGroups !== 'object' || !markerGroups) continue;
    scores.push(scoreArchetype(archetype, markerGroups, corpus));
  }

  const sortable = scores.filter(s => s.score > 0);
  const maxScore = Math.max(1, ...sortable.map(s => s.score));
  const normalized = sortable.map(s => ({ ...s, confidence: s.score / maxScore }));
  normalized.sort((a, b) => b.confidence - a.confidence);
  const top3 = normalized.slice(0, 3);

  for (let i = 0; i < top3.length; i++) {
    append(slug, { kind: 'archetype.match', archetype: top3[i].archetype, confidence: top3[i].confidence, rank: i + 1, evidence: top3[i].evidence.slice(0, 5) });
  }

  // Mixing candidate: top-2 within 0.1 confidence
  const mixing = top3.length >= 2 && (top3[0].confidence - top3[1].confidence) < 0.1;
  if (mixing) append(slug, { kind: 'gap', reason: 'archetype-ambiguous', top: [top3[0].archetype, top3[1].archetype], delta: top3[0].confidence - top3[1].confidence });

  const md = [
    `# Archetype Match — ${slug}`,
    ``,
    top3.length === 0 ? `_No matches — insufficient evidence in corpus (${corpus.length} files)._` : top3.map((t, i) => [
      `## ${i + 1}. ${t.archetype} — confidence ${t.confidence.toFixed(2)}`,
      ``,
      `**Raw score**: ${t.score}`,
      ``,
      `**Top evidence**:`,
      ...t.evidence.slice(0, 5).map(e => `- \`${e.marker}\` — ${e.hits} hits (weight ${e.weight})`),
      ``,
    ].join('\n')).join('\n'),
    mixing ? `## Mixing candidate\nTop-2 within 0.1 confidence — archetype-mixing protocol applies (primary 60% + secondary 30% + tension 10%).\n` : '',
    `## Next`,
    `- Confirm via /gen:align (never auto-locks)`,
    `- Then: component-mapping`,
  ].join('\n');

  writeFileSync(join(dest, 'ARCHETYPE-MATCH.md'), md);
  append(slug, { kind: 'archetype.score.complete', top3: top3.map(t => ({ archetype: t.archetype, confidence: t.confidence })) });
  console.log(`Archetype inference → ${top3.map(t => `${t.archetype}(${t.confidence.toFixed(2)})`).join(', ')}`);
}

main();
