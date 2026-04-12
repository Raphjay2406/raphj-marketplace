#!/usr/bin/env node
/**
 * Pre-push parity check — fails non-zero if plugins/gen/ mirror diverges from root.
 * Usage: node scripts/check-mirror-parity.mjs
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = process.cwd();
const MIRROR = join(ROOT, 'plugins/gen');

if (!existsSync(MIRROR)) {
  console.log('No plugins/gen/ mirror — nothing to check.');
  process.exit(0);
}

const PARITY_DIRS = ['commands', 'agents', 'skills', '.claude-plugin'];
const SKIP = new Set(['_skill-template', 'node_modules', '.DS_Store']);

function hashFile(path) {
  try {
    const buf = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
    return createHash('sha256').update(buf).digest('hex');
  } catch { return null; }
}

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let drift = 0;

for (const d of PARITY_DIRS) {
  const rootDir = join(ROOT, d);
  const mirrorDir = join(MIRROR, d);
  if (!existsSync(rootDir)) continue;

  const rootFiles = new Map();
  for (const p of walk(rootDir)) {
    const rel = relative(rootDir, p).replace(/\\/g, '/');
    if (rel.includes('_skill-template')) continue;
    rootFiles.set(rel, hashFile(p));
  }

  const mirrorFiles = new Map();
  if (existsSync(mirrorDir)) {
    for (const p of walk(mirrorDir)) {
      const rel = relative(mirrorDir, p).replace(/\\/g, '/');
      if (rel.includes('_skill-template')) continue;
      mirrorFiles.set(rel, hashFile(p));
    }
  }

  for (const [f, h] of rootFiles) {
    if (!mirrorFiles.has(f)) { console.error(`  ✗ MISSING in mirror: ${d}/${f}`); drift++; }
    else if (mirrorFiles.get(f) !== h) { console.error(`  ✗ DIVERGED: ${d}/${f}`); drift++; }
  }
  for (const f of mirrorFiles.keys()) {
    if (!rootFiles.has(f)) { console.error(`  ✗ STALE in mirror: ${d}/${f}`); drift++; }
  }
}

if (drift > 0) {
  console.error(`\n❌ Mirror drift: ${drift} file(s). Run: npm run sync-mirror`);
  process.exit(1);
}
console.log(`✓ Mirror parity verified across ${PARITY_DIRS.join(', ')}`);
