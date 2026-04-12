#!/usr/bin/env node
/**
 * Parse every .json file under the repo (excluding node_modules and
 * plugins/gen mirror since it duplicates root). Exit non-zero on any parse error.
 */

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.git', 'plugins', '.planning']);

let checked = 0;
let failures = 0;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (name.endsWith('.json')) yield p;
  }
}

for (const file of walk(ROOT)) {
  try {
    JSON.parse(readFileSync(file, 'utf8'));
    checked++;
  } catch (e) {
    console.error(`  ✗ ${file.replace(ROOT, '.')}\n    ${e.message}`);
    failures++;
  }
}

console.log(`${checked} JSON file(s) parsed, ${failures} failure(s)`);
if (failures > 0) process.exit(1);
