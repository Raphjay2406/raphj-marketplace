# Verification Spine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a harness-enforced Verification Spine that makes Genorah's generated UI actually build, run, pass real visual/functional/a11y/perf checks, and contain mandatory wow-assets before any section can be marked complete.

**Architecture:** A deterministic Node engine (`scripts/verify/`) drives Playwright-as-a-library to measure a built, running section and writes a reproducible `VERDICT.json` with a hard `floor.pass`. A blocking Claude Code hook (`verify-gate.mjs`) refuses section completion unless a fresh, passing verdict exists — executed by the harness, so the model cannot skip it. A thin `verifier` agent interprets verdicts into fixes. Subjective "taste" scoring is decoupled into an advisory Ceiling that can never silently lower a Floor pass.

**Tech Stack:** Node ESM (`.mjs`), `node:test`, Playwright (library), `@axe-core/playwright`, `lighthouse` (programmatic), existing Genorah hook + validator + scripts conventions.

## Global Constraints

- Engine + helpers are ESM `.mjs`, no TypeScript, matching `scripts/*.mjs`.
- Tests use `node --test` (`tests/*.test.mjs`), runnable via `npm test`.
- Hooks read `JSON.parse(readFileSync(0,'utf8'))` → `{ tool_name, tool_input, session_id, ... }`; **block by writing a reason to stderr and `process.exit(2)`**; pass by `process.stdout.write('{}')` + `exit(0)`; never crash (wrap in try/catch, log to `.claude/hook-errors.log`).
- All hooks gate on `existsSync(.planning/genorah)` — zero effect outside Genorah projects.
- Plugin root resolves via `resolve(dirname(fileURLToPath(import.meta.url)), '..')`; repo root is one level above that (pattern from `pre-tool-use.mjs`).
- New deps added to root `package.json`: `playwright`, `@axe-core/playwright`, `lighthouse`.
- Every new/edited file under repo root that has a `plugins/gen/` mirror MUST be re-synced via `npm run sync-mirror`; `npm run check-mirror` stays green.
- Section state lives at `.planning/genorah/sections/<name>/` with `PLAN.md`, `SUMMARY.md`; asset manifest at `public/assets/MANIFEST.json`.
- Version bump to `4.1.0` in `.claude-plugin/plugin.json` happens in the final task only.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `scripts/verify/verdict.mjs` | Verdict schema, input-hash, read/write/freshness — pure fs+crypto |
| `scripts/verify/floor.mjs` | `evaluateFloor(measurements)` → pass/failures — pure |
| `scripts/verify/asset-requirements.mjs` | Beat→required-payload rubric + presence check — pure |
| `scripts/verify/runtime.mjs` | Framework detect, build, dev-server lifecycle — integration |
| `scripts/verify/probe.mjs` | Playwright: 4-bp load, console, overflow, axe, screenshots — integration |
| `scripts/verify/lighthouse.mjs` | Programmatic Lighthouse perf score — integration |
| `scripts/verify/gate-decision.mjs` | Pure `gateDecision(sectionDir)` → {block, reason} — shared by hook + tests |
| `scripts/verify/verify-section.mjs` | CLI orchestrator: measure → VERDICT.json → exit code |
| `.claude-plugin/hooks/verify-gate.mjs` | Blocking PostToolUse+Stop hook wrapping `gate-decision` |
| `scripts/validators/asset-declaration.mjs` | Planner-lint: HOOK/PEAK PLAN must declare a wow payload |
| `agents/verifier.md` | Thin agent: read verdict → GAP-FIX.md → route remediation |
| `tests/verify-spine.test.mjs` | Aggregated spine tests, wired into `npm run validate` |
| `tests/fixtures/verify/` | Static HTML fixtures (clean + broken) for probe/orchestrator tests |

---

## Task 1: Verdict schema, input-hash, freshness

**Files:**
- Create: `scripts/verify/verdict.mjs`
- Test: `tests/verify-spine.test.mjs` (start the file here)

**Interfaces:**
- Produces:
  - `computeInputHash(sectionDir: string) -> string` — sha256 hex of sorted section source files (`PLAN.md` + any `*.tsx`/`*.jsx`/`*.astro`/`*.svelte`/`*.vue`/`*.css` under the section's `srcGlobs`, plus referenced asset filenames). Deterministic.
  - `RUBRIC_VERSION: string` (const `"1.0.0"`).
  - `writeVerdict(sectionDir, verdict) -> void` — writes `VERDICT.json` (pretty JSON).
  - `readVerdict(sectionDir) -> object | null`.
  - `isVerdictFresh(sectionDir, verdict) -> boolean` — `verdict.inputHash === computeInputHash(sectionDir)` AND `verdict.rubricVersion === RUBRIC_VERSION`.
  - Verdict shape: `{ section, rubricVersion, inputHash, floor: { pass, failures: [{check, detail}] }, ceiling: { score, notes }, measurements, generatedAt }`.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/verify-spine.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  computeInputHash, writeVerdict, readVerdict, isVerdictFresh, RUBRIC_VERSION,
} from '../scripts/verify/verdict.mjs';

function makeSection(files) {
  const dir = mkdtempSync(join(tmpdir(), 'verify-sec-'));
  for (const [name, content] of Object.entries(files)) {
    const p = join(dir, name);
    mkdirSync(join(p, '..'), { recursive: true });
    writeFileSync(p, content);
  }
  return dir;
}

test('input-hash is stable for identical inputs', () => {
  const a = makeSection({ 'PLAN.md': 'beat: HOOK', 'Hero.tsx': 'export const Hero = 1;' });
  const b = makeSection({ 'PLAN.md': 'beat: HOOK', 'Hero.tsx': 'export const Hero = 1;' });
  assert.equal(computeInputHash(a), computeInputHash(b));
});

test('input-hash changes when a source file changes', () => {
  const a = makeSection({ 'PLAN.md': 'beat: HOOK', 'Hero.tsx': 'export const Hero = 1;' });
  const h1 = computeInputHash(a);
  writeFileSync(join(a, 'Hero.tsx'), 'export const Hero = 2;');
  assert.notEqual(computeInputHash(a), h1);
});

test('verdict round-trips and freshness tracks the hash', () => {
  const dir = makeSection({ 'PLAN.md': 'beat: PEAK', 'X.tsx': 'a' });
  const v = {
    section: 'hero', rubricVersion: RUBRIC_VERSION, inputHash: computeInputHash(dir),
    floor: { pass: true, failures: [] }, ceiling: { score: 72, notes: '' },
    measurements: {}, generatedAt: '2026-06-27T00:00:00Z',
  };
  writeVerdict(dir, v);
  assert.equal(readVerdict(dir).section, 'hero');
  assert.equal(isVerdictFresh(dir, readVerdict(dir)), true);
  writeFileSync(join(dir, 'X.tsx'), 'b'); // mutate → stale
  assert.equal(isVerdictFresh(dir, readVerdict(dir)), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/verify-spine.test.mjs`
Expected: FAIL — `Cannot find module '../scripts/verify/verdict.mjs'`

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/verify/verdict.mjs
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/verify-spine.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/verify/verdict.mjs tests/verify-spine.test.mjs
git commit -m "feat(verify): verdict schema, input-hash, freshness"
```

---

## Task 2: Floor evaluator

**Files:**
- Create: `scripts/verify/floor.mjs`
- Test: `tests/verify-spine.test.mjs` (append)

**Interfaces:**
- Consumes: a `measurements` object produced later by the orchestrator.
- Produces: `evaluateFloor(measurements) -> { pass: boolean, failures: [{check, detail}] }`.
- Floor checks (each hard PASS/FAIL): `build` (`measurements.build.ok`), `console` (`measurements.console.errors.length === 0`), `overflow` (`measurements.overflow.length === 0`), `axe` (`measurements.axe.critical === 0 && measurements.axe.serious === 0`), `perf` (`measurements.lighthouse.performance >= measurements.perfBudget`), `assets` (`measurements.assets.ok`), `interactions` (`measurements.interactions.failed.length === 0`), `motion` (`measurements.motion.present`).

- [ ] **Step 1: Write the failing test**

```javascript
// tests/verify-spine.test.mjs (append)
import { evaluateFloor } from '../scripts/verify/floor.mjs';

const CLEAN = {
  build: { ok: true },
  console: { errors: [] },
  overflow: [],
  axe: { critical: 0, serious: 0 },
  lighthouse: { performance: 0.92 }, perfBudget: 0.85,
  assets: { ok: true },
  interactions: { failed: [] },
  motion: { present: true },
};

test('clean measurements pass the floor', () => {
  const r = evaluateFloor(CLEAN);
  assert.equal(r.pass, true);
  assert.equal(r.failures.length, 0);
});

test('a console error fails the floor with a named check', () => {
  const r = evaluateFloor({ ...CLEAN, console: { errors: ['TypeError: x'] } });
  assert.equal(r.pass, false);
  assert.ok(r.failures.some(f => f.check === 'console'));
});

test('missing required asset fails the floor', () => {
  const r = evaluateFloor({ ...CLEAN, assets: { ok: false, detail: 'PEAK has no wow payload' } });
  assert.equal(r.pass, false);
  assert.ok(r.failures.some(f => f.check === 'assets'));
});

test('perf under budget fails the floor', () => {
  const r = evaluateFloor({ ...CLEAN, lighthouse: { performance: 0.70 } });
  assert.equal(r.pass, false);
  assert.ok(r.failures.some(f => f.check === 'perf'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/verify-spine.test.mjs`
Expected: FAIL — `Cannot find module '../scripts/verify/floor.mjs'`

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/verify/floor.mjs
export function evaluateFloor(m) {
  const failures = [];
  const fail = (check, detail) => failures.push({ check, detail });

  if (!m.build?.ok) fail('build', m.build?.detail || 'build failed');
  if ((m.console?.errors?.length ?? 0) > 0) fail('console', `${m.console.errors.length} console error(s): ${m.console.errors[0]}`);
  if ((m.overflow?.length ?? 0) > 0) fail('overflow', `horizontal overflow at: ${m.overflow.join(', ')}`);
  if ((m.axe?.critical ?? 0) > 0 || (m.axe?.serious ?? 0) > 0) fail('axe', `${m.axe.critical} critical / ${m.axe.serious} serious a11y violations`);
  if ((m.lighthouse?.performance ?? 0) < (m.perfBudget ?? 0.85)) fail('perf', `Lighthouse perf ${m.lighthouse?.performance} < budget ${m.perfBudget}`);
  if (!m.assets?.ok) fail('assets', m.assets?.detail || 'required asset missing');
  if ((m.interactions?.failed?.length ?? 0) > 0) fail('interactions', `failed interactions: ${m.interactions.failed.join(', ')}`);
  if (!m.motion?.present) fail('motion', 'no motion detected');

  return { pass: failures.length === 0, failures };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/verify-spine.test.mjs`
Expected: PASS (all tests in file)

- [ ] **Step 5: Commit**

```bash
git add scripts/verify/floor.mjs tests/verify-spine.test.mjs
git commit -m "feat(verify): deterministic floor evaluator"
```

---

## Task 3: Beat → required-asset rubric + presence check

**Files:**
- Create: `scripts/verify/asset-requirements.mjs`
- Test: `tests/verify-spine.test.mjs` (append)

**Interfaces:**
- Produces:
  - `requiredPayload(beat) -> 'wow' | 'texture' | null` — HOOK/PEAK → `'wow'`; TENSION/CLOSE → `'texture'`; BREATHE/others → `null`.
  - `checkAssetPresence({ beat, html, manifest }) -> { ok, detail }` where `html` is rendered section HTML string and `manifest` is the parsed `MANIFEST.json` array (or `[]`). A `'wow'` payload is satisfied when the rendered HTML contains a real generated `<img>` whose `src` is listed in the manifest, OR a signature mount (`<canvas`, `data-r3f`, `data-signature`, or a `<video`/shader marker). `'texture'` satisfied by any manifest-listed asset reference in the HTML. `null` requirement is always `ok:true`. A TODO/placeholder src (`/placeholder`, `TODO`, empty) never satisfies.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/verify-spine.test.mjs (append)
import { requiredPayload, checkAssetPresence } from '../scripts/verify/asset-requirements.mjs';

test('beat → payload mapping', () => {
  assert.equal(requiredPayload('HOOK'), 'wow');
  assert.equal(requiredPayload('PEAK'), 'wow');
  assert.equal(requiredPayload('TENSION'), 'texture');
  assert.equal(requiredPayload('BREATHE'), null);
});

test('PEAK with a manifest-backed generated image passes', () => {
  const r = checkAssetPresence({
    beat: 'PEAK',
    html: '<section><img src="/assets/hero-abc.png" alt="x"></section>',
    manifest: [{ path: '/assets/hero-abc.png', source: 'gpt-image' }],
  });
  assert.equal(r.ok, true);
});

test('PEAK with only a gradient + heading fails', () => {
  const r = checkAssetPresence({
    beat: 'PEAK',
    html: '<section class="bg-gradient-to-b"><h1>Title</h1></section>',
    manifest: [],
  });
  assert.equal(r.ok, false);
});

test('PEAK satisfied by a canvas signature mount', () => {
  const r = checkAssetPresence({ beat: 'PEAK', html: '<section><canvas data-r3f></canvas></section>', manifest: [] });
  assert.equal(r.ok, true);
});

test('placeholder src does not satisfy', () => {
  const r = checkAssetPresence({
    beat: 'HOOK',
    html: '<img src="/placeholder.png">',
    manifest: [{ path: '/placeholder.png' }],
  });
  assert.equal(r.ok, false);
});

test('BREATHE is always ok', () => {
  assert.equal(checkAssetPresence({ beat: 'BREATHE', html: '<section></section>', manifest: [] }).ok, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/verify-spine.test.mjs`
Expected: FAIL — `Cannot find module '../scripts/verify/asset-requirements.mjs'`

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/verify/asset-requirements.mjs
const WOW_BEATS = new Set(['HOOK', 'PEAK']);
const TEXTURE_BEATS = new Set(['TENSION', 'CLOSE']);

export function requiredPayload(beat) {
  const b = String(beat || '').toUpperCase();
  if (WOW_BEATS.has(b)) return 'wow';
  if (TEXTURE_BEATS.has(b)) return 'texture';
  return null;
}

const PLACEHOLDER = /(placeholder|\bTODO\b|^data:|^\s*$)/i;
const SIGNATURE = /<canvas|data-r3f|data-signature|<video|data-shader/i;

function manifestPaths(manifest) {
  return new Set((manifest || []).map(a => a.path).filter(Boolean));
}

function realImageSrcs(html) {
  const srcs = [];
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  let mch;
  while ((mch = re.exec(html))) srcs.push(mch[1]);
  return srcs.filter(s => !PLACEHOLDER.test(s));
}

export function checkAssetPresence({ beat, html = '', manifest = [] }) {
  const need = requiredPayload(beat);
  if (!need) return { ok: true, detail: 'no asset requirement for beat' };

  const paths = manifestPaths(manifest);
  const backedImage = realImageSrcs(html).some(s => paths.has(s));

  if (need === 'wow') {
    if (backedImage) return { ok: true, detail: 'generated image present' };
    if (SIGNATURE.test(html)) return { ok: true, detail: 'signature mount present' };
    return { ok: false, detail: `${beat} requires a generated image or signature moment; none found` };
  }
  // texture
  if (backedImage || SIGNATURE.test(html)) return { ok: true, detail: 'texture/atmosphere asset present' };
  return { ok: false, detail: `${beat} requires a texture/atmosphere asset or signature interaction; none found` };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/verify-spine.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/verify/asset-requirements.mjs tests/verify-spine.test.mjs
git commit -m "feat(verify): beat→required-asset rubric and presence check"
```

---

## Task 4: Framework detection, build, dev-server lifecycle

**Files:**
- Create: `scripts/verify/runtime.mjs`
- Test: `tests/verify-runtime.test.mjs`

**Interfaces:**
- Produces:
  - `detectFramework(projectDir) -> 'next'|'astro'|'sveltekit'|'nuxt'|'vite'|'unknown'` — reads `package.json` deps.
  - `buildCommand(framework) -> string` and `devCommand(framework) -> string`.
  - `async ensureBuild(projectDir) -> { ok, detail }` — runs the build command, returns ok on exit 0.
  - `async ensureDevServer(projectDir, { port }) -> { url, stop }` — spawns dev server, waits until the port answers HTTP (timeout 60s), returns `url` and an async `stop()` that kills the process tree.

- [ ] **Step 1: Write the failing test** (detection + command mapping are the pure, unit-testable core; server spawn is smoke-tested separately)

```javascript
// tests/verify-runtime.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { detectFramework, buildCommand, devCommand } from '../scripts/verify/runtime.mjs';

function projWith(deps) {
  const dir = mkdtempSync(join(tmpdir(), 'verify-proj-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ dependencies: deps }));
  return dir;
}

test('detects Next.js', () => {
  assert.equal(detectFramework(projWith({ next: '16.0.0' })), 'next');
});
test('detects Astro', () => {
  assert.equal(detectFramework(projWith({ astro: '6.0.0' })), 'astro');
});
test('unknown when no known framework', () => {
  assert.equal(detectFramework(projWith({ lodash: '4' })), 'unknown');
});
test('build/dev commands map per framework', () => {
  assert.match(buildCommand('next'), /next build|npm run build/);
  assert.match(devCommand('vite'), /vite|npm run dev/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/verify-runtime.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/verify/runtime.mjs
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { request } from 'http';

const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

export function detectFramework(projectDir) {
  const pkgPath = join(projectDir, 'package.json');
  if (!existsSync(pkgPath)) return 'unknown';
  let pkg;
  try { pkg = JSON.parse(readFileSync(pkgPath, 'utf8')); } catch { return 'unknown'; }
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  if (deps.next) return 'next';
  if (deps.astro) return 'astro';
  if (deps['@sveltejs/kit']) return 'sveltekit';
  if (deps.nuxt) return 'nuxt';
  if (deps.vite) return 'vite';
  return 'unknown';
}

export function buildCommand() { return `${NPM} run build`; }
export function devCommand() { return `${NPM} run dev`; }

export function ensureBuild(projectDir) {
  return new Promise((resolve) => {
    const p = spawn(buildCommand(), { cwd: projectDir, shell: true });
    let err = '';
    p.stderr.on('data', d => { err += d.toString(); });
    p.on('close', code => resolve(code === 0 ? { ok: true } : { ok: false, detail: err.slice(-500) }));
    p.on('error', e => resolve({ ok: false, detail: e.message }));
  });
}

function ping(port) {
  return new Promise(resolve => {
    const req = request({ host: '127.0.0.1', port, path: '/', timeout: 1500 }, res => {
      res.resume(); resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });
}

export async function ensureDevServer(projectDir, { port = 3000 } = {}) {
  const proc = spawn(devCommand(), { cwd: projectDir, shell: true, env: { ...process.env, PORT: String(port) } });
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (await ping(port)) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  const stop = async () => {
    try {
      if (process.platform === 'win32') spawn('taskkill', ['/pid', String(proc.pid), '/t', '/f']);
      else process.kill(-proc.pid, 'SIGKILL');
    } catch { /* already dead */ }
  };
  return { url: `http://127.0.0.1:${port}`, stop };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/verify-runtime.test.mjs`
Expected: PASS (4 tests; server spawn not exercised by unit test)

- [ ] **Step 5: Commit**

```bash
git add scripts/verify/runtime.mjs tests/verify-runtime.test.mjs
git commit -m "feat(verify): framework detect + build/dev-server lifecycle"
```

---

## Task 5: Browser probe (Playwright library)

**Files:**
- Create: `scripts/verify/probe.mjs`
- Create: `tests/fixtures/verify/clean.html`, `tests/fixtures/verify/broken.html`
- Test: `tests/verify-probe.test.mjs`
- Modify: `package.json` (add `playwright`, `@axe-core/playwright`)

**Interfaces:**
- Consumes: a URL serving a section.
- Produces: `async probe(url, { breakpoints }) -> { console: {errors}, overflow: [], axe: {critical,serious}, motion: {present}, html, screenshots: {} }`.
  - `breakpoints` default `[375,768,1280,1440]`.
  - `console.errors`: page console messages of type `error` + uncaught page errors.
  - `overflow`: list of breakpoint labels where `document.documentElement.scrollWidth > innerWidth + 1`.
  - `axe`: counts from `@axe-core/playwright` at 1280.
  - `motion.present`: heuristic — any element with a CSS transition/animation OR a `data-motion`/framer marker (evaluated in page).
  - `html`: outerHTML at 1280 (fed to asset presence check).

- [ ] **Step 1: Write the fixtures and failing test**

```html
<!-- tests/fixtures/verify/clean.html -->
<!doctype html><html><head><style>
  body{margin:0} .hero{height:100vh;transition:opacity .3s}
</style></head><body>
  <section class="hero"><h1>Clean</h1><img src="/assets/hero-abc.png" alt="hero"></section>
</body></html>
```

```html
<!-- tests/fixtures/verify/broken.html -->
<!doctype html><html><head><style>body{margin:0}.wide{width:3000px;height:200px}</style></head>
<body><section><div class="wide">overflow</div></section>
<script>console.error('Boom: simulated runtime error');</script></body></html>
```

```javascript
// tests/verify-probe.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { probe } from '../scripts/verify/probe.mjs';

const here = dirname(fileURLToPath(import.meta.url));
let server, base;

before(async () => {
  server = createServer((req, res) => {
    const file = req.url.includes('broken') ? 'broken.html' : 'clean.html';
    res.setHeader('content-type', 'text/html');
    res.end(readFileSync(join(here, 'fixtures/verify', file)));
  });
  await new Promise(r => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test('clean page: no console errors, no overflow, motion present', async () => {
  const r = await probe(`${base}/clean`, {});
  assert.equal(r.console.errors.length, 0);
  assert.equal(r.overflow.length, 0);
  assert.equal(r.motion.present, true);
  assert.match(r.html, /hero-abc\.png/);
});

test('broken page: console error and overflow detected', async () => {
  const r = await probe(`${base}/broken`, {});
  assert.ok(r.console.errors.length >= 1);
  assert.ok(r.overflow.length >= 1);
});
```

- [ ] **Step 2: Install deps, run test to verify it fails**

Run:
```bash
npm install -D playwright @axe-core/playwright
npx playwright install chromium
node --test tests/verify-probe.test.mjs
```
Expected: FAIL — `Cannot find module '../scripts/verify/probe.mjs'`

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/verify/probe.mjs
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

export async function probe(url, { breakpoints = [375, 768, 1280, 1440] } = {}) {
  const browser = await chromium.launch();
  const result = { console: { errors: [] }, overflow: [], axe: { critical: 0, serious: 0 }, motion: { present: false }, html: '', screenshots: {} };
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('console', m => { if (m.type() === 'error') result.console.errors.push(m.text()); });
    page.on('pageerror', e => result.console.errors.push(String(e)));

    for (const w of breakpoints) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(url, { waitUntil: 'networkidle' });
      const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (over) result.overflow.push(`${w}px`);
      result.screenshots[`${w}`] = await page.screenshot({ fullPage: true });
    }

    // measure motion + html + axe at desktop
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle' });
    result.html = await page.content();
    result.motion.present = await page.evaluate(() => {
      if (document.querySelector('[data-motion],[data-framer-motion],[style*="animation"]')) return true;
      return [...document.querySelectorAll('*')].some(el => {
        const s = getComputedStyle(el);
        return (s.transitionDuration && s.transitionDuration !== '0s') ||
               (s.animationName && s.animationName !== 'none');
      });
    });
    const axe = await new AxeBuilder({ page }).analyze();
    for (const v of axe.violations) {
      if (v.impact === 'critical') result.axe.critical += 1;
      else if (v.impact === 'serious') result.axe.serious += 1;
    }
  } finally {
    await browser.close();
  }
  return result;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/verify-probe.test.mjs`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/verify/probe.mjs tests/verify-probe.test.mjs tests/fixtures/verify package.json package-lock.json
git commit -m "feat(verify): playwright browser probe (console/overflow/axe/motion)"
```

---

## Task 6: Lighthouse perf runner

**Files:**
- Create: `scripts/verify/lighthouse.mjs`
- Modify: `package.json` (add `lighthouse`)
- Test: `tests/verify-lighthouse.test.mjs`

**Interfaces:**
- Produces: `async runLighthouse(url, { port }) -> { performance: number }` (0–1). On any failure returns `{ performance: 0, error }` so the Floor fails closed (never silently passes).

- [ ] **Step 1: Write the failing test** (asserts the failure-closed contract, which is deterministic and doesn't require a real run)

```javascript
// tests/verify-lighthouse.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { runLighthouse } from '../scripts/verify/lighthouse.mjs';

test('unreachable url fails closed with performance 0', async () => {
  const r = await runLighthouse('http://127.0.0.1:9', {}); // nothing listening
  assert.equal(r.performance, 0);
  assert.ok(r.error);
});
```

- [ ] **Step 2: Install dep, run test to verify it fails**

Run:
```bash
npm install -D lighthouse
node --test tests/verify-lighthouse.test.mjs
```
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/verify/lighthouse.mjs
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

export async function runLighthouse(url) {
  let chrome;
  try {
    chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
    const runnerResult = await lighthouse(url, {
      port: chrome.port, onlyCategories: ['performance'], output: 'json', logLevel: 'silent',
    });
    const score = runnerResult?.lhr?.categories?.performance?.score;
    if (typeof score !== 'number') return { performance: 0, error: 'no performance score' };
    return { performance: score };
  } catch (e) {
    return { performance: 0, error: e.message };
  } finally {
    if (chrome) await chrome.kill();
  }
}
```

(`chrome-launcher` ships as a Lighthouse dependency; if not hoisted, add it explicitly: `npm install -D chrome-launcher`.)

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/verify-lighthouse.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/verify/lighthouse.mjs tests/verify-lighthouse.test.mjs package.json package-lock.json
git commit -m "feat(verify): programmatic lighthouse perf runner (fails closed)"
```

---

## Task 7: Orchestrator `verify-section.mjs`

**Files:**
- Create: `scripts/verify/verify-section.mjs`
- Test: `tests/verify-orchestrator.test.mjs`

**Interfaces:**
- Consumes: `verdict.mjs`, `floor.mjs`, `asset-requirements.mjs`, `runtime.mjs`, `probe.mjs`, `lighthouse.mjs`.
- Produces:
  - `async verifySection({ sectionDir, projectDir, url, beat, perfBudget, skipBuild }) -> verdict` — runs measurements, evaluates floor, writes `VERDICT.json`, returns it.
  - CLI: `node scripts/verify/verify-section.mjs --section <dir> --project <dir> [--url <url>] [--beat PEAK] [--budget 0.85]`. Exit `0` if `floor.pass`, else `1`.
  - Reads `beat` from `PLAN.md` if `--beat` omitted (looks for `beat:` line).
  - Reads manifest from `<projectDir>/public/assets/MANIFEST.json` if present.
  - To keep it unit-testable, `verifySection` accepts injected `deps` (probe/lighthouse/runtime) defaulting to the real ones.

- [ ] **Step 1: Write the failing test** (inject fakes so the orchestrator logic is tested without booting a real app)

```javascript
// tests/verify-orchestrator.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { verifySection } from '../scripts/verify/verify-section.mjs';
import { readVerdict } from '../scripts/verify/verdict.mjs';

function section(beat) {
  const dir = mkdtempSync(join(tmpdir(), 'orch-'));
  writeFileSync(join(dir, 'PLAN.md'), `beat: ${beat}\n`);
  writeFileSync(join(dir, 'Hero.tsx'), 'export const Hero = () => null;');
  return dir;
}

const fakeClean = {
  ensureBuild: async () => ({ ok: true }),
  ensureDevServer: async () => ({ url: 'http://x', stop: async () => {} }),
  probe: async () => ({
    console: { errors: [] }, overflow: [], axe: { critical: 0, serious: 0 },
    motion: { present: true }, html: '<img src="/assets/hero-abc.png">', screenshots: {},
  }),
  runLighthouse: async () => ({ performance: 0.95 }),
};

test('PEAK with generated image and clean probe → floor pass', async () => {
  const dir = section('PEAK');
  const proj = mkdtempSync(join(tmpdir(), 'proj-'));
  mkdirSync(join(proj, 'public/assets'), { recursive: true });
  writeFileSync(join(proj, 'public/assets/MANIFEST.json'), JSON.stringify([{ path: '/assets/hero-abc.png', source: 'gpt-image' }]));
  const v = await verifySection({ sectionDir: dir, projectDir: proj, perfBudget: 0.85, deps: fakeClean });
  assert.equal(v.floor.pass, true);
  assert.equal(readVerdict(dir).floor.pass, true);
});

test('PEAK with no asset → floor fail on assets', async () => {
  const dir = section('PEAK');
  const proj = mkdtempSync(join(tmpdir(), 'proj-'));
  const deps = { ...fakeClean, probe: async () => ({ ...await fakeClean.probe(), html: '<section><h1>flat</h1></section>' }) };
  const v = await verifySection({ sectionDir: dir, projectDir: proj, perfBudget: 0.85, deps });
  assert.equal(v.floor.pass, false);
  assert.ok(v.floor.failures.some(f => f.check === 'assets'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/verify-orchestrator.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/verify/verify-section.mjs
import { readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { computeInputHash, writeVerdict, RUBRIC_VERSION } from './verdict.mjs';
import { evaluateFloor } from './floor.mjs';
import { checkAssetPresence } from './asset-requirements.mjs';
import { ensureBuild as realBuild, ensureDevServer as realDev } from './runtime.mjs';
import { probe as realProbe } from './probe.mjs';
import { runLighthouse as realLh } from './lighthouse.mjs';

function readBeat(sectionDir) {
  const plan = join(sectionDir, 'PLAN.md');
  if (!existsSync(plan)) return 'UNKNOWN';
  const m = readFileSync(plan, 'utf8').match(/beat:\s*([A-Za-z]+)/i);
  return m ? m[1].toUpperCase() : 'UNKNOWN';
}

function readManifest(projectDir) {
  const p = join(projectDir, 'public/assets/MANIFEST.json');
  if (!existsSync(p)) return [];
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return []; }
}

export async function verifySection({ sectionDir, projectDir, url, beat, perfBudget = 0.85, skipBuild = false, deps = {} }) {
  const d = {
    ensureBuild: deps.ensureBuild || realBuild,
    ensureDevServer: deps.ensureDevServer || realDev,
    probe: deps.probe || realProbe,
    runLighthouse: deps.runLighthouse || realLh,
  };
  beat = beat || readBeat(sectionDir);

  const build = skipBuild ? { ok: true } : await d.ensureBuild(projectDir);
  let server = url ? { url, stop: async () => {} } : null;
  let pr, lh;
  try {
    if (!server) server = await d.ensureDevServer(projectDir, {});
    pr = await d.probe(server.url, {});
    lh = await d.runLighthouse(server.url, {});
  } finally {
    if (server && !url) await server.stop();
  }

  const assets = checkAssetPresence({ beat, html: pr.html, manifest: readManifest(projectDir) });
  const measurements = {
    build, console: pr.console, overflow: pr.overflow, axe: pr.axe,
    lighthouse: lh, perfBudget, assets, interactions: { failed: [] }, motion: pr.motion,
  };
  const floor = evaluateFloor(measurements);
  const verdict = {
    section: basename(sectionDir), rubricVersion: RUBRIC_VERSION,
    inputHash: computeInputHash(sectionDir), floor,
    ceiling: { score: null, notes: 'advisory — set by judge agent, never gates the floor' },
    measurements: { ...measurements, screenshots: undefined }, generatedAt: new Date().toISOString(),
  };
  writeVerdict(sectionDir, verdict);
  return verdict;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (k, def) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : def; };
  const sectionDir = arg('--section');
  const projectDir = arg('--project', process.cwd());
  if (!sectionDir) { console.error('--section <dir> required'); process.exit(2); }
  const v = await verifySection({
    sectionDir, projectDir, url: arg('--url'), beat: arg('--beat'),
    perfBudget: Number(arg('--budget', '0.85')),
  });
  console.log(JSON.stringify(v.floor, null, 2));
  process.exit(v.floor.pass ? 0 : 1);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/verify-orchestrator.test.mjs`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/verify/verify-section.mjs tests/verify-orchestrator.test.mjs
git commit -m "feat(verify): orchestrator writes reproducible VERDICT.json"
```

---

## Task 8: Blocking gate (pure decision + hook + registration)

**Files:**
- Create: `scripts/verify/gate-decision.mjs`
- Create: `.claude-plugin/hooks/verify-gate.mjs`
- Modify: `.claude-plugin/plugin.json` (register hook on PostToolUse + Stop)
- Test: `tests/verify-gate.test.mjs`

**Interfaces:**
- Produces:
  - `gateDecision({ planningDir, target }) -> { block: boolean, reason?: string }`. Given the section a completion-signal touched, returns block when the section's verdict is missing, stale, or `floor.pass !== true`. `target` is the file path the tool wrote (used to locate the section). If `target` is not a section completion signal, returns `{ block: false }`.
  - Completion signal = a write to `.../sections/<name>/SUMMARY.md`.
- Hook contract: PostToolUse on `Write|Edit`, plus `Stop`. On block: write reason to stderr, `exit(2)`. Else `'{}'` + `exit(0)`.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/verify-gate.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { gateDecision } from '../scripts/verify/gate-decision.mjs';
import { writeVerdict, computeInputHash, RUBRIC_VERSION } from '../scripts/verify/verdict.mjs';

function planningWithSection(name) {
  const planning = mkdtempSync(join(tmpdir(), 'planning-'));
  const sec = join(planning, 'sections', name);
  mkdirSync(sec, { recursive: true });
  writeFileSync(join(sec, 'PLAN.md'), 'beat: PEAK');
  writeFileSync(join(sec, 'Hero.tsx'), 'x');
  return { planning, sec };
}

test('non-section write does not block', () => {
  const { planning } = planningWithSection('hero');
  assert.equal(gateDecision({ planningDir: planning, target: 'README.md' }).block, false);
});

test('SUMMARY write with no verdict blocks', () => {
  const { planning } = planningWithSection('hero');
  const r = gateDecision({ planningDir: planning, target: join(planning, 'sections/hero/SUMMARY.md') });
  assert.equal(r.block, true);
  assert.match(r.reason, /verdict/i);
});

test('SUMMARY write with a fresh passing verdict does not block', () => {
  const { planning, sec } = planningWithSection('hero');
  writeVerdict(sec, { section: 'hero', rubricVersion: RUBRIC_VERSION, inputHash: computeInputHash(sec), floor: { pass: true, failures: [] } });
  const r = gateDecision({ planningDir: planning, target: join(planning, 'sections/hero/SUMMARY.md') });
  assert.equal(r.block, false);
});

test('SUMMARY write with a failing verdict blocks with the failure reason', () => {
  const { planning, sec } = planningWithSection('hero');
  writeVerdict(sec, { section: 'hero', rubricVersion: RUBRIC_VERSION, inputHash: computeInputHash(sec), floor: { pass: false, failures: [{ check: 'console', detail: 'Boom' }] } });
  const r = gateDecision({ planningDir: planning, target: join(planning, 'sections/hero/SUMMARY.md') });
  assert.equal(r.block, true);
  assert.match(r.reason, /console/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/verify-gate.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/verify/gate-decision.mjs
import { join, dirname } from 'path';
import { readVerdict, isVerdictFresh } from './verdict.mjs';

const SUMMARY_RE = /[\\/]sections[\\/]([^\\/]+)[\\/]SUMMARY\.md$/;

export function gateDecision({ planningDir, target }) {
  if (!target || !SUMMARY_RE.test(target.replace(/\\/g, '/'))) return { block: false };
  const sectionDir = dirname(target);
  const verdict = readVerdict(sectionDir);
  if (!verdict) return { block: true, reason: `No VERDICT.json for this section. Run: node scripts/verify/verify-section.mjs --section "${sectionDir}" --project <projectDir> before marking it complete.` };
  if (!isVerdictFresh(sectionDir, verdict)) return { block: true, reason: `VERDICT.json is stale (section files changed since verification). Re-run verify-section before completing.` };
  if (verdict.floor?.pass !== true) {
    const fails = (verdict.floor?.failures || []).map(f => `${f.check}: ${f.detail}`).join('; ');
    return { block: true, reason: `Floor FAILED — section cannot be marked complete until fixed: ${fails}` };
  }
  return { block: false };
}
```

```javascript
// .claude-plugin/hooks/verify-gate.mjs
import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

function logErr(cwd, msg) {
  try {
    const d = join(cwd, '.claude');
    if (!existsSync(d)) mkdirSync(d, { recursive: true });
    appendFileSync(join(d, 'hook-errors.log'), `[${new Date().toISOString()}] verify-gate: ${msg}\n`);
  } catch { /* swallow */ }
}

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const { tool_name, tool_input } = input;
  const cwd = process.cwd();
  const planningDir = join(cwd, '.planning', 'genorah');
  if (!existsSync(planningDir)) { process.stdout.write('{}'); process.exit(0); }

  const hookDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(hookDir, '..', '..');
  const { gateDecision } = await import(`file://${join(repoRoot, 'scripts/verify/gate-decision.mjs')}`);

  const target = (tool_name === 'Write' || tool_name === 'Edit') ? (tool_input?.file_path || '') : '';
  const decision = gateDecision({ planningDir, target });
  if (decision.block) { process.stderr.write(decision.reason); process.exit(2); }
  process.stdout.write('{}');
} catch (err) {
  logErr(process.cwd(), `fatal: ${err.message}`);
  process.stdout.write('{}'); // fail-open on hook crash; never wedge the session
}
```

- [ ] **Step 4: Register the hook in `.claude-plugin/plugin.json`**

In the `PostToolUse` array, add a second entry (after the existing `Write|Edit|Bash` block):

```json
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/verify-gate.mjs\""
          }
        ]
      }
```

And add a `Stop` backstop entry to the existing `Stop` array:

```json
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/verify-gate.mjs\""
          }
        ]
      }
```

(For the Stop variant, `tool_input` is absent; the hook reads no target and returns `{}` — the Stop entry is a placeholder for a future full-page sweep and must not crash. Confirm `gateDecision` returns `{block:false}` when `target` is empty — it does, via the `!target` guard.)

- [ ] **Step 5: Run test + validate JSON**

Run:
```bash
node --test tests/verify-gate.test.mjs
npm run lint:json
```
Expected: tests PASS; `lint:json` reports plugin.json valid.

- [ ] **Step 6: Commit**

```bash
git add scripts/verify/gate-decision.mjs .claude-plugin/hooks/verify-gate.mjs .claude-plugin/plugin.json tests/verify-gate.test.mjs
git commit -m "feat(verify): harness-enforced blocking gate on section completion"
```

---

## Task 9: Planner-lint — HOOK/PEAK must declare a wow payload

**Files:**
- Create: `scripts/validators/asset-declaration.mjs`
- Test: `tests/asset-declaration.test.mjs`

**Interfaces:**
- Produces: `lintPlanAssets(planText) -> { ok, violations: [{beat, detail}] }`. Parses a `PLAN.md`'s `beat:` and an optional `assets:` block; if beat ∈ {HOOK,PEAK} and there is no non-empty `assets:` block naming a payload, it's a violation.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/asset-declaration.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { lintPlanAssets } from '../scripts/validators/asset-declaration.mjs';

test('PEAK without assets block is a violation', () => {
  const r = lintPlanAssets('beat: PEAK\n## Layout\nA hero.');
  assert.equal(r.ok, false);
  assert.ok(r.violations.some(v => v.beat === 'PEAK'));
});

test('PEAK with a declared gpt-image payload passes', () => {
  const r = lintPlanAssets('beat: PEAK\nassets:\n  - source: gpt-image\n    intent: dramatic hero\n');
  assert.equal(r.ok, true);
});

test('BREATHE without assets is fine', () => {
  const r = lintPlanAssets('beat: BREATHE\n## Layout\ncalm.');
  assert.equal(r.ok, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/asset-declaration.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/validators/asset-declaration.mjs
const REQUIRES_ASSET = new Set(['HOOK', 'PEAK']);

export function lintPlanAssets(planText) {
  const beatMatch = String(planText).match(/beat:\s*([A-Za-z]+)/i);
  const beat = beatMatch ? beatMatch[1].toUpperCase() : 'UNKNOWN';
  const violations = [];
  if (REQUIRES_ASSET.has(beat)) {
    const assetsMatch = planText.match(/assets:\s*\n((?:\s*-\s.*\n?)+)/i);
    const hasPayload = assetsMatch && /source:|intent:|3d|shader|canvas/i.test(assetsMatch[1]);
    if (!hasPayload) violations.push({ beat, detail: `${beat} beat must declare an assets: block naming a wow payload (gpt-image/3d/shader/canvas).` });
  }
  return { ok: violations.length === 0, violations };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/asset-declaration.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/validators/asset-declaration.mjs tests/asset-declaration.test.mjs
git commit -m "feat(verify): planner-lint requires wow payload on HOOK/PEAK"
```

---

## Task 10: Remove silent cascade addenda; document Floor/Ceiling split

**Files:**
- Modify: `skills/quality-gate-v2/SKILL.md` (remove cascade-multiplier addenda)
- Modify: `skills/quality-gate-v3/SKILL.md` (add Floor/Ceiling decoupling note)
- Test: `tests/quality-gate-semantics.test.mjs`

**Interfaces:**
- Produces: no code interface; a documented semantic guarantee asserted by a grep-style test.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/quality-gate-semantics.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'fs';

test('quality-gate-v2 no longer applies silent score multipliers', () => {
  const txt = readFileSync('skills/quality-gate-v2/SKILL.md', 'utf8');
  assert.equal(/×\s?0\.(5|6|7)0?\b/.test(txt), false, 'cascade multiplier (×0.5/×0.6/×0.7) still present');
});

test('quality-gate-v3 documents that ceiling never lowers a floor pass', () => {
  const txt = readFileSync('skills/quality-gate-v3/SKILL.md', 'utf8');
  assert.match(txt, /never\s+(lowers?|caps?).*floor/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/quality-gate-semantics.test.mjs`
Expected: FAIL — multipliers still present / decoupling note absent

- [ ] **Step 3: Make the edits**

In `skills/quality-gate-v2/SKILL.md`: delete the "Quality Cascade" / sub-gate multiplier addenda (the `× 0.50 / × 0.60 / × 0.70` tables and any prose that applies them to category scores). Replace with one line:

```markdown
> **v4.1:** Sub-gate failures no longer multiply category scores. Measurable failures are enforced as hard Floor checks by the Verification Spine (`scripts/verify/`); subjective shortfalls are reported as an advisory Ceiling score and never silently lower a passing Floor.
```

In `skills/quality-gate-v3/SKILL.md`, add under the scoring overview:

```markdown
### Floor / Ceiling decoupling (v4.1)

The deterministic **Floor** (build, console-clean, responsive, axe, perf budget, required assets, interactions, motion) is computed by `scripts/verify/verify-section.mjs` and is a hard pass/fail. The subjective **Ceiling** (wow, archetype specificity, boldness) is an advisory 0–100 judge score that drives the tournament and emits GAP-FIX items. The Ceiling **never lowers or caps a Floor pass** — it can only request improvements. This guarantees reproducible scores and removes the silent multiplier cascades of v2.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/quality-gate-semantics.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add skills/quality-gate-v2/SKILL.md skills/quality-gate-v3/SKILL.md tests/quality-gate-semantics.test.mjs
git commit -m "refactor(quality-gate): remove silent cascades; document floor/ceiling split"
```

---

## Task 11: gpt-image wiring sweep (kill dead nano-banana refs)

**Files:**
- Modify: every `agents/**/*.md` (and `plugins/gen/agents/**`) listing `mcp__nano-banana__*` tools
- Test: `tests/no-dead-mcp-refs.test.mjs`

**Interfaces:**
- Produces: a repo-wide guarantee (asserted by test) that no `mcp__nano-banana__*` tool reference survives in agent tool lists.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/no-dead-mcp-refs.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { globby } from 'globby';
import { readFileSync } from 'fs';

test('no agent references the removed nano-banana MCP tools', async () => {
  const files = await globby(['agents/**/*.md', 'plugins/gen/agents/**/*.md']);
  const offenders = files.filter(f => /mcp__nano-banana__/.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `dead nano-banana refs in: ${offenders.join(', ')}`);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/no-dead-mcp-refs.test.mjs`
Expected: FAIL — lists `agents/pipeline/builder.md`, `agents/specialists/3d-specialist.md`, etc.

- [ ] **Step 3: Fix the references**

For each offending file, replace the four dead tools with the two live ones in the `tools:` frontmatter and body:
- `mcp__nano-banana__generate_image` → `mcp__gpt-image__generate_image`
- `mcp__nano-banana__edit_image` → `mcp__gpt-image__edit_image`
- Remove `mcp__nano-banana__continue_editing` and `mcp__nano-banana__get_last_image_info` (gpt-image is stateless; no replacement — delete them).

Locate them first:
```bash
node -e "const {globbySync}=require('globby');const fs=require('fs');for(const f of globbySync(['agents/**/*.md','plugins/gen/agents/**/*.md']))if(/mcp__nano-banana__/.test(fs.readFileSync(f,'utf8')))console.log(f)"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/no-dead-mcp-refs.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add agents plugins/gen/agents tests/no-dead-mcp-refs.test.mjs
git commit -m "fix(agents): repoint dead nano-banana MCP tools to gpt-image"
```

---

## Task 12: Verifier agent + pipeline wiring

**Files:**
- Create: `agents/verifier.md`
- Modify: `agents/quality-reviewer.md` (consume VERDICT.json), `agents/visual-refiner.md` (consume VERDICT.json)
- Modify: `commands/build.md`, `commands/audit.md`, `commands/ship-check.md` (attach spine), `commands/plan.md` (emit `assets:` block + run planner-lint)
- Test: `tests/verifier-wiring.test.mjs`

**Interfaces:**
- Produces: agent + command docs referencing the spine. Asserted by a presence test (markdown has no executable unit test; the test verifies the wiring text + frontmatter exist).

- [ ] **Step 1: Write the failing test**

```javascript
// tests/verifier-wiring.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'fs';

test('verifier agent exists and consumes VERDICT.json', () => {
  assert.ok(existsSync('agents/verifier.md'));
  assert.match(readFileSync('agents/verifier.md', 'utf8'), /VERDICT\.json/);
});

test('build command attaches the verification spine', () => {
  assert.match(readFileSync('commands/build.md', 'utf8'), /verify-section\.mjs|Verification Spine/);
});

test('plan command emits an assets block and runs the planner-lint', () => {
  const txt = readFileSync('commands/plan.md', 'utf8');
  assert.match(txt, /assets:/);
  assert.match(txt, /asset-declaration/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/verifier-wiring.test.mjs`
Expected: FAIL — `agents/verifier.md` missing

- [ ] **Step 3: Author `agents/verifier.md`**

```markdown
---
name: verifier
description: Reads a section's VERDICT.json (produced by scripts/verify/verify-section.mjs), interprets Floor failures into a prioritized GAP-FIX.md, and routes remediation to polisher/visual-refiner. Never measures directly — the deterministic engine does that.
tools: Read, Write, Edit, Bash, Grep, Glob
---

# Verifier Agent

## Role
You are the interpretation layer of the Verification Spine. You do NOT decide whether the site is good — `scripts/verify/verify-section.mjs` already measured that and wrote `VERDICT.json`. Your job is to turn a failing verdict into the smallest set of concrete fixes.

## Protocol
1. Run the engine if no fresh verdict exists:
   `node scripts/verify/verify-section.mjs --section <sectionDir> --project <projectDir>`
2. Read `<sectionDir>/VERDICT.json`.
3. If `floor.pass === true`: write a one-line PASS note to SUMMARY.md context and stop. Report the advisory `ceiling.score` if present.
4. If `floor.pass === false`: for each entry in `floor.failures`, write a prioritized, specific fix into `<sectionDir>/GAP-FIX.md` (check name → file/line → exact change). Order: build > console > assets > overflow > axe > perf > interactions > motion.
5. Route: hand GAP-FIX.md to `polisher` (code) or `visual-refiner` (layout/visual). Max 2 remediation cycles, then escalate to the user.

## Hard rule
Never edit `VERDICT.json`. Never mark a section complete (never write its SUMMARY.md completion marker) while `floor.pass !== true` — the verify-gate hook will block you anyway.
```

In `agents/quality-reviewer.md` and `agents/visual-refiner.md`: add a section stating they now **read `VERDICT.json` for Floor results** instead of independently deciding whether to run Playwright, and only contribute the advisory Ceiling score. Keep their existing interfaces.

In `commands/build.md`: after the wave-completion step, add: "Run the Verification Spine on each built section (`node scripts/verify/verify-section.mjs --section .planning/genorah/sections/<name> --project <projectDir>`); a section is not complete until its VERDICT.json shows `floor.pass: true`. The verify-gate hook enforces this."

In `commands/audit.md` and `commands/ship-check.md`: add the spine as a required step (full-page: run verify-section across all sections; ship-check fails if any `floor.pass !== true`).

In `commands/plan.md`: require each scored section's `PLAN.md` to include an `assets:` block (source + intent), and add a step: "Validate with `node -e \"import('./scripts/validators/asset-declaration.mjs')...\"` — a HOOK/PEAK PLAN with no declared wow payload is rejected before build."

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/verifier-wiring.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add agents/verifier.md agents/quality-reviewer.md agents/visual-refiner.md commands/build.md commands/audit.md commands/ship-check.md commands/plan.md tests/verifier-wiring.test.mjs
git commit -m "feat(verify): verifier agent + pipeline spine wiring"
```

---

## Task 13: Aggregate tests, version bump, mirror, dogfood proof

**Files:**
- Modify: `package.json` (add spine tests to `validate`)
- Modify: `.claude-plugin/plugin.json` (version `4.1.0`)
- Create: `docs/v4.1-changelog.md`
- Modify: `plugins/gen/**` (via `sync-mirror`)

- [ ] **Step 1: Ensure all spine tests run under `npm test`**

`package.json` `test` script already globs `tests/*.test.mjs`, so all new test files are included. Confirm:

Run: `npm test`
Expected: PASS across all `tests/*.test.mjs` (including the 6 new spine test files).

- [ ] **Step 2: Bump version + changelog**

Edit `.claude-plugin/plugin.json`: `"version": "4.1.0"`.

Create `docs/v4.1-changelog.md`:

```markdown
# Genorah v4.1.0 — "Enforcement"

## Verification Spine
- Deterministic engine (`scripts/verify/`) builds, runs, and measures each section with Playwright + axe + Lighthouse; writes reproducible `VERDICT.json`.
- Harness-enforced blocking hook (`verify-gate.mjs`): a section cannot be marked complete without a fresh, passing Floor verdict.
- Floor/Ceiling split: measurable checks are hard gates; subjective taste is an advisory Ceiling that never silently lowers a Floor pass. Silent v2 cascade multipliers removed.
- Asset enforcement: HOOK/PEAK beats must contain a real generated image or signature moment, verified against the rendered DOM + manifest; planner-lint rejects PLANs that don't declare a wow payload.
- Dead `mcp__nano-banana__*` agent tool refs repointed to `mcp__gpt-image__*`.
```

- [ ] **Step 3: Sync the mirror**

Run:
```bash
npm run sync-mirror
npm run check-mirror
```
Expected: mirror updated; `check-mirror` exits 0. **Manually confirm** `plugins/gen/scripts/verify/` and `plugins/gen/.claude-plugin/hooks/verify-gate.mjs` exist (known footgun: mirror tooling has skipped directories before).

- [ ] **Step 4: Run full validation**

Run: `npm run validate`
Expected: lint + self-audit + all tests PASS.

- [ ] **Step 5: Dogfood proof (evidence, not assertion)**

On one real generated Genorah project:
1. Plant a bug: introduce a `console.error('planted')` in a PEAK section and delete its hero image reference.
2. Run: `node scripts/verify/verify-section.mjs --section <peakSection> --project <proj>` → expect exit 1, `floor.pass:false` with `console` + `assets` failures.
3. Fix both; re-run → expect exit 0, `floor.pass:true`.
4. Paste both `VERDICT.json` floor blocks into the PR description as proof.

- [ ] **Step 6: Commit**

```bash
git add package.json .claude-plugin/plugin.json docs/v4.1-changelog.md plugins/gen
git commit -m "chore(release): v4.1.0 enforcement — spine wired, validated, mirrored"
```

---

## Self-Review

**Spec coverage:**
- Verification Spine engine → Tasks 1–7. ✓
- Blocking hook (harness-enforced) → Task 8. ✓
- Floor/Ceiling split + reproducibility + remove cascades → Tasks 2, 10. ✓
- Asset-gen enforcement (rubric, planner-lint, DOM-reality check) → Tasks 3, 9, 12. ✓
- gpt-image wiring sweep → Task 11. ✓
- Verifier agent + refactor quality-reviewer/visual-refiner + attach points → Task 12. ✓
- Versioning, changelog, mirror discipline, tests in `validate`, dogfood proof → Task 13. ✓

**Placeholder scan:** No "TBD/TODO" in requirements; every code step shows complete code; the only `TODO` strings are literal regex/test fixtures (intentional). ✓

**Type consistency:** `computeInputHash`, `readVerdict`, `isVerdictFresh`, `RUBRIC_VERSION` (Task 1) reused identically in Tasks 7, 8. `evaluateFloor(measurements)` shape (Task 2) matches the `measurements` object built in Task 7. `checkAssetPresence({beat,html,manifest})` (Task 3) called with that exact shape in Task 7. `gateDecision({planningDir,target})` (Task 8) matches the hook call site. `probe`/`ensureBuild`/`ensureDevServer`/`runLighthouse` signatures (Tasks 4–6) match the injected `deps` defaults in Task 7. ✓

**Open items intentionally deferred to implementer judgement:** exact lines to delete in `quality-gate-v2` cascade addenda (Task 10) and the precise per-framework `assets:` block prose (Task 12) — both are content edits guided by a test that locks the outcome.
