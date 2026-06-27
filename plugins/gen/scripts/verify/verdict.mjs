import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { createHash } from 'crypto';

export const RUBRIC_VERSION = '1.0.0';

const SRC_EXT = new Set(['.md', '.tsx', '.jsx', '.ts', '.js', '.astro', '.svelte', '.vue', '.css']);

function collectFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'VERDICT.json' || entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) collectFiles(full, acc);
    else if (SRC_EXT.has(extname(entry))) acc.push(full);
  }
  return acc;
}

export function computeInputHash(sectionDir) {
  const files = collectFiles(sectionDir).sort();
  const h = createHash('sha256');
  for (const f of files) {
    h.update(f.replace(sectionDir, '')); // path relative to section, stable
    h.update('\0');
    h.update(readFileSync(f));
    h.update('\0');
  }
  return h.digest('hex');
}

export function writeVerdict(sectionDir, verdict) {
  writeFileSync(join(sectionDir, 'VERDICT.json'), JSON.stringify(verdict, null, 2));
}

export function readVerdict(sectionDir) {
  const p = join(sectionDir, 'VERDICT.json');
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

export function isVerdictFresh(sectionDir, verdict) {
  if (!verdict) return false;
  return verdict.rubricVersion === RUBRIC_VERSION
    && verdict.inputHash === computeInputHash(sectionDir);
}
