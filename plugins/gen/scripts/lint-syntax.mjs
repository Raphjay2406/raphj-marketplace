#!/usr/bin/env node
/**
 * Syntax-check every .mjs hook + companion file via `node --check`
 * and every .sh hook via `bash -n`. Exit non-zero on any failure.
 */

import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const targets = [
  join(ROOT, '.claude-plugin/hooks'),
  join(ROOT, '.claude-plugin/companion'),
  join(ROOT, 'scripts'),
];

let failures = 0;

function* walk(dir) {
  if (!statSync(dir, { throwIfNoEntry: false })) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else yield p;
  }
}

for (const base of targets) {
  for (const file of walk(base)) {
    const ext = extname(file);
    try {
      if (ext === '.mjs' || ext === '.js') {
        execSync(`node --check "${file}"`, { stdio: 'pipe' });
      } else if (ext === '.sh') {
        execSync(`bash -n "${file}"`, { stdio: 'pipe' });
      } else {
        continue;
      }
      console.log(`  ✓ ${file.replace(ROOT, '.')}`);
    } catch (e) {
      console.error(`  ✗ ${file.replace(ROOT, '.')}\n    ${e.stderr?.toString() || e.message}`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} syntax failure(s)`);
  process.exit(1);
}
console.log(`\nAll syntax checks passed.`);
