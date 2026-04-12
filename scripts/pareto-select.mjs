#!/usr/bin/env node
/**
 * pareto-select — v3.5.4
 *
 * Multi-objective Pareto variant selection with archetype-weighted tiebreaker.
 *
 * Usage:
 *   node scripts/pareto-select.mjs --variants variants.json --archetype editorial --out result.json
 *
 * variants.json shape:
 *   [{ id, design: 0-234, ux: 0-120, archetype_fit: 0-1, reference_ssim: 0-1, tokens_used }]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { argv, exit, stderr } from 'node:process';

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) {
      const v = argv[i + 1];
      if (v && !v.startsWith('--')) { a[k.slice(2)] = v; i++; } else a[k.slice(2)] = true;
    } else a._.push(k);
  }
  return a;
}

const DEFAULT_WEIGHTS = { w_design: 0.30, w_ux: 0.25, w_fit: 0.25, w_ref: 0.20 };
const WEIGHTS_PATH = 'skills/design-archetypes/seeds/archetype-weights.json';

function loadWeights(archetype) {
  if (!existsSync(WEIGHTS_PATH)) return DEFAULT_WEIGHTS;
  try {
    const raw = JSON.parse(readFileSync(WEIGHTS_PATH, 'utf8'));
    return raw.weights?.[archetype] || DEFAULT_WEIGHTS;
  } catch { return DEFAULT_WEIGHTS; }
}

function normalize(v) {
  return {
    O1: (v.design ?? 0) / 234,
    O2: (v.ux ?? 0) / 120,
    O3: v.archetype_fit ?? 0,
    O4: v.reference_ssim ?? 0,
  };
}

function dominates(a, b) {
  const na = normalize(a), nb = normalize(b);
  const geAll = na.O1 >= nb.O1 && na.O2 >= nb.O2 && na.O3 >= nb.O3 && na.O4 >= nb.O4;
  const gtOne = na.O1 > nb.O1 || na.O2 > nb.O2 || na.O3 > nb.O3 || na.O4 > nb.O4;
  return geAll && gtOne;
}

function paretoFront(variants) {
  const front = [];
  for (const v of variants) {
    if (!variants.some((u) => u !== v && dominates(u, v))) front.push(v);
  }
  return front;
}

function scalarScore(v, w) {
  const n = normalize(v);
  return w.w_design * n.O1 + w.w_ux * n.O2 + w.w_fit * n.O3 + w.w_ref * n.O4;
}

export function select({ variants, archetype }) {
  if (!Array.isArray(variants) || variants.length === 0) {
    throw new Error('pareto-select: no variants provided');
  }
  const valid = variants.filter((v) => {
    if (typeof v.design !== 'number' || Number.isNaN(v.design)) return false;
    if (typeof v.ux !== 'number' || Number.isNaN(v.ux)) return false;
    return true;
  });
  if (valid.length === 0) throw new Error('pareto-select: all variants invalid');

  const weights = loadWeights(archetype);
  const front = paretoFront(valid);
  let winner;
  if (front.length === 1) {
    winner = front[0];
  } else {
    const scored = front.map((v) => ({ v, s: scalarScore(v, weights) }));
    scored.sort((a, b) => b.s - a.s || (b.v.design ?? 0) - (a.v.design ?? 0));
    winner = scored[0].v;
  }
  return { front, winner, weights };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1].endsWith('pareto-select.mjs')) {
  const args = parseArgs(argv);
  if (!args.variants) { stderr.write('usage: pareto-select --variants <file> --archetype <name> [--out <file>]\n'); exit(2); }
  let variants;
  try { variants = JSON.parse(readFileSync(args.variants, 'utf8')); }
  catch (e) { stderr.write(`failed to read variants: ${e.message}\n`); exit(2); }
  try {
    const result = select({ variants, archetype: args.archetype || 'default' });
    const output = {
      pareto_front: result.front.map((v) => v.id),
      winner: result.winner.id,
      weights: result.weights,
      scores: variants.map((v) => ({ id: v.id, ...normalize(v), scalar: scalarScore(v, result.weights) })),
    };
    if (args.out) writeFileSync(args.out, JSON.stringify(output, null, 2));
    else console.log(JSON.stringify(output, null, 2));
  } catch (e) { stderr.write(`${e.message}\n`); exit(1); }
}
