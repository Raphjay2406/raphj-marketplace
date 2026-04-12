#!/usr/bin/env node
/**
 * dna-drift-check — v3.4.2 enforcement
 *
 * Computes DNA coverage across staged .tsx/.jsx/.ts/.css files:
 *   coverage = (tokenized-color-refs) / (tokenized + hardcoded)
 *
 * HARD BLOCK when coverage < 92% and env DNA_STRICT=1.
 * WARNING when coverage < 92% and DNA_STRICT unset (rollout-window default).
 *
 * Invoked from dna-compliance-check.sh or standalone:
 *   node scripts/dna-drift-check.mjs [--strict] [--files <file1> <file2> ...]
 *
 * Exits 0 on pass / warn, 1 on hard-block.
 */
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { argv, env, exit } from 'node:process';

const STRICT = argv.includes('--strict') || env.DNA_STRICT === '1';
const THRESHOLD = 0.92;
const filesFlag = argv.indexOf('--files');
let files;
if (filesFlag >= 0) {
  files = argv.slice(filesFlag + 1).filter((a) => a && !a.startsWith('--'));
} else {
  try {
    files = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
      .split('\n')
      .filter((f) => /\.(tsx?|jsx?|css)$/.test(f) && existsSync(f));
  } catch {
    files = [];
  }
}

if (files.length === 0) exit(0);

// Hardcoded color patterns (off-DNA)
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const RGB_RE = /\brgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g;
const HSL_RE = /\bhsla?\(\s*\d+/g;
const NAMED_COLORS = /\b(red|blue|green|yellow|orange|purple|pink|cyan|magenta|black|white|gray|grey)\b(?=\s*[;\)])/g;

// Tokenized references — Tailwind classes, CSS vars, theme accessors
const TOKEN_TAILWIND = /\b(bg|text|border|ring|from|to|via|fill|stroke|accent|caret|decoration|divide|outline|placeholder|shadow)-(primary|secondary|accent|muted|surface|signature|glow|tension|highlight|bg|fg|foreground|background|border|ink)\b/g;
const TOKEN_CSS_VAR = /var\(--(color|token|dna)-[a-z0-9-]+\)/gi;
const TOKEN_THEME_FN = /theme\(['"]?colors\./g;

let hardcoded = 0;
let tokenized = 0;
const offenders = [];

for (const file of files) {
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }

  // Strip single-line + block comments to avoid false positives
  const clean = src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');

  const hx = (clean.match(HEX_RE) || []).filter((h) => h !== '#fff' && h !== '#000' && h !== '#FFFFFF' && h !== '#000000');
  const rgb = clean.match(RGB_RE) || [];
  const hsl = clean.match(HSL_RE) || [];
  const nm = clean.match(NAMED_COLORS) || [];

  const fileHardcoded = hx.length + rgb.length + hsl.length + nm.length;
  const fileTokenized =
    (clean.match(TOKEN_TAILWIND) || []).length +
    (clean.match(TOKEN_CSS_VAR) || []).length +
    (clean.match(TOKEN_THEME_FN) || []).length;

  hardcoded += fileHardcoded;
  tokenized += fileTokenized;

  if (fileHardcoded > 0) offenders.push({ file, hardcoded: fileHardcoded, tokenized: fileTokenized });
}

const total = hardcoded + tokenized;
if (total === 0) exit(0);

const coverage = tokenized / total;
const pct = (coverage * 100).toFixed(1);

if (coverage >= THRESHOLD) {
  console.log(`[dna-drift] coverage ${pct}% — pass (${tokenized} tokenized / ${hardcoded} hardcoded)`);
  exit(0);
}

const severity = STRICT ? '[BLOCK]' : '[WARN]';
console.log('');
console.log('==========================================');
console.log(` DNA DRIFT ${severity} — coverage ${pct}% (threshold ${THRESHOLD * 100}%)`);
console.log('==========================================');
console.log(`Tokenized: ${tokenized}   Hardcoded: ${hardcoded}`);
console.log('');
console.log('Offenders:');
for (const o of offenders.slice(0, 10)) {
  const filePct = ((o.tokenized / (o.tokenized + o.hardcoded)) * 100).toFixed(0);
  console.log(`  ${filePct.padStart(3)}%  ${o.file}  (hardcoded=${o.hardcoded})`);
}
if (offenders.length > 10) console.log(`  ... +${offenders.length - 10} more`);
console.log('');
console.log('Use DNA tokens from DESIGN-DNA.md (theme() / var(--color-*) / Tailwind bg-primary etc.).');
if (!STRICT) {
  console.log('Run with DNA_STRICT=1 to make this a hard block.');
}

exit(STRICT ? 1 : 0);
