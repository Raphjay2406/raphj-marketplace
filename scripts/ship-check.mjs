#!/usr/bin/env node
/**
 * ship-check — v3.5.4
 *
 * Unified 4-tier ship-readiness gate. Writes .planning/genorah/ship-check.md.
 *
 * Usage:
 *   node scripts/ship-check.mjs [--skip-slow] [--fix]
 *
 * Tiers are executed best-effort — missing tools are reported as SKIP, not FAIL.
 */
import { existsSync, writeFileSync, readFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { argv, exit } from 'node:process';

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) a[k.slice(2)] = true;
  }
  return a;
}

function tryRun(cmd, args) {
  try {
    const r = spawnSync(cmd, args, { encoding: 'utf8', shell: true });
    return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
  } catch (e) { return { code: -1, stdout: '', stderr: e.message }; }
}

function binExists(cmd) {
  const r = tryRun(process.platform === 'win32' ? 'where' : 'which', [cmd]);
  return r.code === 0 && (r.stdout || '').trim().length > 0;
}

function checkCompile() {
  if (!existsSync('package.json')) return { name: 'compile', status: 'skip', detail: 'no package.json' };
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  if (!pkg.scripts?.build) return { name: 'compile', status: 'skip', detail: 'no build script' };
  const r = tryRun('npm', ['run', 'build', '--silent']);
  return { name: 'compile', status: r.code === 0 ? 'pass' : 'fail', detail: r.code === 0 ? '' : r.stderr.slice(0, 500) };
}

function checkTypecheck() {
  if (!existsSync('tsconfig.json') && !existsSync('tsconfig.build.json')) return { name: 'typecheck', status: 'skip' };
  const r = tryRun('npx', ['-y', 'tsc', '--noEmit']);
  return { name: 'typecheck', status: r.code === 0 ? 'pass' : 'fail', detail: r.code === 0 ? '' : r.stdout.slice(-500) };
}

function checkLint() {
  if (!existsSync('package.json')) return { name: 'lint', status: 'skip' };
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  if (!pkg.scripts?.lint) return { name: 'lint', status: 'skip' };
  const r = tryRun('npm', ['run', 'lint', '--silent']);
  return { name: 'lint', status: r.code === 0 ? 'pass' : 'fail', detail: r.code === 0 ? '' : r.stdout.slice(-500) };
}

function checkTests() {
  if (!existsSync('package.json')) return { name: 'test', status: 'skip' };
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  if (!pkg.scripts?.test || /no test specified/.test(pkg.scripts.test)) return { name: 'test', status: 'skip' };
  const r = tryRun('npm', ['test', '--silent']);
  return { name: 'test', status: r.code === 0 ? 'pass' : 'fail', detail: r.code === 0 ? '' : r.stdout.slice(-500) };
}

function checkDnaDrift() {
  if (!existsSync('scripts/dna-drift-check.mjs')) return { name: 'dna-drift', status: 'skip' };
  const r = tryRun('node', ['scripts/dna-drift-check.mjs']);
  return { name: 'dna-drift', status: r.code === 0 ? 'pass' : 'warn', detail: r.stdout.slice(-300) };
}

function checkManifestIntegrity() {
  const path = 'public/assets/MANIFEST.json';
  if (!existsSync(path)) return { name: 'manifest', status: 'skip', detail: 'no manifest' };
  try {
    const m = JSON.parse(readFileSync(path, 'utf8'));
    const assets = m.assets || [];
    const missingLicense = assets.filter((a) => !a.license || a.license === 'unknown').length;
    const missingSha = assets.filter((a) => !a.cache_key).length;
    const issues = [];
    if (missingLicense) issues.push(`${missingLicense} assets without license`);
    if (missingSha) issues.push(`${missingSha} assets without cache_key`);
    return { name: 'manifest', status: issues.length ? 'fail' : 'pass', detail: issues.join('; ') };
  } catch (e) { return { name: 'manifest', status: 'fail', detail: e.message }; }
}

function checkBundleBudget() {
  if (!existsSync('dist') && !existsSync('.next') && !existsSync('build')) return { name: 'bundle', status: 'skip' };
  const root = existsSync('dist') ? 'dist' : existsSync('.next') ? '.next' : 'build';
  let total = 0;
  function walk(p) {
    try {
      const s = statSync(p);
      if (s.isDirectory()) readdirSync(p).forEach((f) => walk(`${p}/${f}`));
      else if (/\.(js|css|html)$/.test(p)) total += s.size;
    } catch {}
  }
  walk(root);
  const mb = total / 1024 / 1024;
  const warn = mb > 5;
  return { name: 'bundle', status: warn ? 'warn' : 'pass', detail: `${mb.toFixed(2)}MB` };
}

function checkSeoMeta() {
  const pages = [];
  for (const dir of ['app', 'src/app', 'pages', 'src/pages']) {
    if (!existsSync(dir)) continue;
    function walk(p) {
      try {
        readdirSync(p).forEach((f) => {
          const fp = `${p}/${f}`;
          if (statSync(fp).isDirectory()) walk(fp);
          else if (/page\.(tsx?|jsx?)$/.test(f) || /layout\.(tsx?|jsx?)$/.test(f)) pages.push(fp);
        });
      } catch {}
    }
    walk(dir);
  }
  if (pages.length === 0) return { name: 'seo-meta', status: 'skip' };
  const missing = pages.filter((p) => {
    const src = readFileSync(p, 'utf8');
    return !/\bmetadata\b|\btitle\b|<title/.test(src);
  });
  return { name: 'seo-meta', status: missing.length ? 'warn' : 'pass', detail: missing.length ? `${missing.length} pages missing meta` : '' };
}

const args = parseArgs(argv);
const skipSlow = args['skip-slow'];

// Tier 1
console.log('Tier 1 (Build)…');
const t1 = [checkCompile(), checkTypecheck(), checkLint(), checkTests()];
// Tier 2 (omitted in v3.5.4 without dev server — placeholder)
const t2 = [];
// Tier 3
console.log('Tier 3 (Pipeline)…');
const t3 = [checkDnaDrift(), checkManifestIntegrity()];
// Tier 4
console.log('Tier 4 (Metadata)…');
const t4 = [checkBundleBudget(), checkSeoMeta()];

function countStatus(rows, status) { return rows.filter((r) => r.status === status).length; }

function renderTier(label, rows) {
  const lines = [`${label}:`];
  for (const r of rows) {
    const icon = { pass: '✅', warn: '⚠️', fail: '❌', skip: '⏭️' }[r.status] || '?';
    lines.push(`  ${icon} ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
  }
  return lines.join('\n');
}

const allRows = [...t1, ...t2, ...t3, ...t4];
const fails = allRows.filter((r) => r.status === 'fail').length;
const blockers = t4.filter((r) => r.status === 'fail').length + t1.filter((r) => r.status === 'fail').length;
const decision = blockers > 0 ? 'BLOCK' : (fails > 0 ? 'WARN' : 'PASS');

const out = [
  `SHIP-READINESS SCORECARD`,
  `=========================`,
  renderTier('Tier 1 Build', t1),
  skipSlow ? 'Tier 2 Runtime: skipped (--skip-slow)' : renderTier('Tier 2 Runtime', t2.length ? t2 : [{ name: '(not implemented in v3.5.4 ship-check.mjs)', status: 'skip' }]),
  renderTier('Tier 3 Pipeline', t3),
  renderTier('Tier 4 Metadata', t4),
  '',
  `DECISION: ${decision}`,
  `Fails: ${fails}, Warns: ${countStatus(allRows, 'warn')}, Skips: ${countStatus(allRows, 'skip')}`,
].join('\n');

console.log('');
console.log(out);

mkdirSync('.planning/genorah', { recursive: true });
writeFileSync('.planning/genorah/ship-check.md', out + '\n');

exit(decision === 'BLOCK' ? 1 : 0);
