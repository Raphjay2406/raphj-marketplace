#!/usr/bin/env node
/**
 * regression-diff — v3.5.4
 *
 * Delta vs .planning/genorah/regression-baseline/. Dimensions present depend on
 * what was captured; missing dimensions are reported as SKIP, not FAIL.
 *
 * Subcommands: capture | check
 */
import { existsSync, writeFileSync, readFileSync, mkdirSync, readdirSync, statSync, cpSync } from 'node:fs';
import { argv, exit, stderr } from 'node:process';

const BASELINE = '.planning/genorah/regression-baseline';
const REPORT = '.planning/genorah/regression-report.md';

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 3; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) {
      const v = argv[i + 1];
      if (v && !v.startsWith('--')) { a[k.slice(2)] = v; i++; } else a[k.slice(2)] = true;
    } else a._.push(k);
  }
  return a;
}

function dirSize(root) {
  if (!existsSync(root)) return 0;
  let total = 0;
  function walk(p) {
    try {
      const s = statSync(p);
      if (s.isDirectory()) readdirSync(p).forEach((f) => walk(`${p}/${f}`));
      else total += s.size;
    } catch {}
  }
  walk(root);
  return total;
}

async function cmd_capture() {
  mkdirSync(BASELINE, { recursive: true });
  const meta = { captured_at: new Date().toISOString(), git_sha: null };
  try {
    const { execSync } = await import('node:child_process');
    meta.git_sha = execSync('git rev-parse HEAD').toString().trim();
  } catch {}
  // Capture bundle size snapshot
  const bundleRoot = existsSync('dist') ? 'dist' : existsSync('.next') ? '.next' : existsSync('build') ? 'build' : null;
  if (bundleRoot) meta.bundle_bytes = dirSize(bundleRoot);
  writeFileSync(`${BASELINE}/META.json`, JSON.stringify(meta, null, 2));
  console.log(`baseline captured: ${JSON.stringify(meta)}`);
}

function cmd_check(args) {
  if (!existsSync(`${BASELINE}/META.json`)) {
    console.log('No baseline. Run: regression-diff capture');
    return;
  }
  const baseline = JSON.parse(readFileSync(`${BASELINE}/META.json`, 'utf8'));
  const current = { ts: new Date().toISOString() };
  const issues = [];
  // bundle size delta
  const bundleRoot = existsSync('dist') ? 'dist' : existsSync('.next') ? '.next' : existsSync('build') ? 'build' : null;
  if (bundleRoot && baseline.bundle_bytes) {
    current.bundle_bytes = dirSize(bundleRoot);
    const delta = current.bundle_bytes - baseline.bundle_bytes;
    const pct = (delta / baseline.bundle_bytes) * 100;
    if (pct > 10) issues.push({ severity: 'HIGH', dim: 'bundle', detail: `+${pct.toFixed(1)}% (${(delta/1024).toFixed(0)}KB)` });
    else if (pct > 0) issues.push({ severity: 'INFO', dim: 'bundle', detail: `+${pct.toFixed(1)}%` });
  }
  // Additional dimensions (lighthouse, visual, a11y, links) flagged as "not-captured" if not present
  const report = [
    'REGRESSION REPORT',
    '=================',
    `Baseline: ${baseline.captured_at} (${baseline.git_sha || 'no-sha'})`,
    `Current:  ${current.ts}`,
    '',
    ...(issues.length ? issues.map((i) => `  [${i.severity}] ${i.dim}: ${i.detail}`) : ['  No regressions detected on measured dimensions.']),
    '',
    'Dimensions not captured in v3.5.4 baseline (future work):',
    '  - Lighthouse performance/a11y',
    '  - Visual pixel diff',
    '  - Axe-core violation count',
    '  - Broken-link scan',
  ].join('\n');
  mkdirSync('.planning/genorah', { recursive: true });
  writeFileSync(REPORT, report);
  console.log(report);
  if (issues.some((i) => i.severity === 'HIGH' || i.severity === 'CRITICAL')) exit(1);
}

const sub = argv[2];
const args = parseArgs(argv);
switch (sub) {
  case 'capture': await cmd_capture(); break;
  case 'check': cmd_check(args); break;
  default:
    stderr.write('usage: regression-diff <capture|check>\n');
    exit(2);
}
