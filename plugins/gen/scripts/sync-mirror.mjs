#!/usr/bin/env node
/**
 * Sync plugins/gen/ mirror from root. Idempotent.
 * Copies: commands/, agents/, skills/ (excluding _skill-template), .claude-plugin/,
 * scripts/, tests/, docs/, .github/, CLAUDE.md, README.md, package.json, LICENSE
 *
 * Usage: npm run sync-mirror
 */

import { readdirSync, statSync, existsSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

const ROOT = process.cwd();
const MIRROR = join(ROOT, 'plugins/gen');

const DIRS_TO_SYNC = ['commands', 'agents', 'skills', '.claude-plugin', 'scripts', 'tests', 'docs', '.github'];
const FILES_TO_SYNC = ['CLAUDE.md', 'README.md', 'package.json', 'LICENSE', '.gitignore'];
const SKIP_NAMES = new Set(['_skill-template', '.planning', '.DS_Store', 'node_modules']);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_NAMES.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else yield p;
  }
}

mkdirSync(MIRROR, { recursive: true });

let copied = 0, removed = 0;

for (const d of DIRS_TO_SYNC) {
  const src = join(ROOT, d);
  const dest = join(MIRROR, d);
  if (!existsSync(src)) continue;

  // Purge mirror subtree for clean state
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });

  for (const f of walk(src)) {
    const rel = relative(src, f);
    const target = join(dest, rel);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(f, target);
    copied++;
  }
}

for (const f of FILES_TO_SYNC) {
  const src = join(ROOT, f);
  if (!existsSync(src)) continue;
  copyFileSync(src, join(MIRROR, f));
  copied++;
}

console.log(`✓ Mirror synced: ${copied} files → plugins/gen/`);
