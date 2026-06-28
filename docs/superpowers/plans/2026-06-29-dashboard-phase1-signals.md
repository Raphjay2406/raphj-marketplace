# Dashboard Redesign Phase 1 (Signal Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the zero-dep dashboard honest and useful — surface each section's Verification Spine VERDICT (floor pass/fail + failing checks), gate-failure hotspots, the 4-breakpoint screenshot capture, and the real project header — without a build step or a visual redesign.

**Architecture:** A new pure `scripts/dashboard/signals.mjs` (3 helpers) does the parsing/aggregation; `dashboard-server.mjs`'s `snapshot()`/`scanSections()` are extended to include the new fields (reusing the spine's `readVerdict`), made importable for tests via a main-guard + call-time root; `dashboard.html`'s SSE `render()` draws the new signals XSS-safe. Vanilla, buildless, no new deps.

**Tech Stack:** Node ESM (`.mjs`), `node:test`, the existing zero-dep `dashboard-server.mjs` + `dashboard.html`, the spine's `scripts/verify/verdict.mjs`.

## Global Constraints

- ESM `.mjs`, no TypeScript; vanilla HTML/CSS/JS; **no build step, no framework, no new dependencies** (the dashboard must keep running via `node dashboard-server.mjs`).
- Tests use `node --test` (`tests/*.test.mjs`), runnable via `npm test`.
- All data reaching the DOM uses `textContent` / element construction (the file's existing XSS-safe idiom) — never `innerHTML` on `state` data.
- Reuse `readVerdict(sectionDir)` from `scripts/verify/verdict.mjs` (a `VERDICT.json` has `floor.pass`, `floor.failures[] = {check, detail}`, `ceiling.score`). Do not re-parse.
- Screenshots are flat at `.planning/genorah/audit/screenshot-{375,768,1280,1440}px.png` (overwritten each QA run); the panel shows the latest capture, not per-section.
- The dashboard runs against a generated project's cwd (`.planning/genorah/`).
- No version bump this phase. Mirror (`scripts/dashboard/` + edited companion files + command doc) syncs into `plugins/gen/` (final task).

---

## File Structure

| File | Responsibility |
|------|----------------|
| `scripts/dashboard/signals.mjs` | Pure: `parseProjectMeta`, `computeHotspots`, `listAuditShots` |
| `.claude-plugin/companion/dashboard-server.mjs` | snapshot/scanSections gain verdict + meta + hotspots + screenshots; importable (main-guard, call-time root) |
| `.claude-plugin/companion/dashboard.html` | render the new signals (header, verdict row, hotspots panel, screenshot grid) |
| `commands/dashboard.md` | document the real panels |

---

## Task 1: Pure signal helpers

**Files:**
- Create: `scripts/dashboard/signals.mjs`
- Test: `tests/dashboard-signals.test.mjs`

**Interfaces:**
- Produces:
  - `parseProjectMeta(projectMd = '', dnaMd = '') -> { name, archetype, goal }` — `name` from a markdown `# Heading` or `name:`/`project:` line in PROJECT.md; `goal` from a `goal:`/`objective:` line; `archetype` from an `archetype:` line in DESIGN-DNA.md. Any missing field → `null`.
  - `computeHotspots(sections = []) -> [{ check, count }]` — count `section.verdict.failures[].check` across all sections, sorted by `count` desc; missing verdict/failures contribute nothing; `[]` when none.
  - `listAuditShots(auditFiles = []) -> [{ label, width, file }]` — for breakpoints 375/768/1280/1440 (labels Mobile/Tablet/Desktop/Wide), include `{label,width,file:'screenshot-<width>px.png'}` only when that file is in `auditFiles`.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/dashboard-signals.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { parseProjectMeta, computeHotspots, listAuditShots } from '../scripts/dashboard/signals.mjs';

test('parseProjectMeta extracts name/goal/archetype', () => {
  const project = '# Acme Landing\n\nGoal: convert visitors to signups\n';
  const dna = '## Design DNA\narchetype: Brutalist\n';
  assert.deepEqual(parseProjectMeta(project, dna), { name: 'Acme Landing', archetype: 'Brutalist', goal: 'convert visitors to signups' });
});

test('parseProjectMeta degrades to nulls when fields absent', () => {
  assert.deepEqual(parseProjectMeta('', ''), { name: null, archetype: null, goal: null });
});

test('computeHotspots aggregates + sorts failures across sections', () => {
  const sections = [
    { verdict: { failures: [{ check: 'console' }, { check: 'perf' }] } },
    { verdict: { failures: [{ check: 'console' }] } },
    { verdict: null },
    { verdict: { failures: [] } },
    { verdict: { failures: [{ check: 'console' }, { check: 'axe' }] } },
  ];
  assert.deepEqual(computeHotspots(sections), [
    { check: 'console', count: 3 },
    { check: 'perf', count: 1 },
    { check: 'axe', count: 1 },
  ]);
});

test('computeHotspots empty input → []', () => {
  assert.deepEqual(computeHotspots([]), []);
});

test('listAuditShots picks only present breakpoints', () => {
  const got = listAuditShots(['screenshot-375px.png', 'screenshot-1280px.png', 'hover-cta.png']);
  assert.deepEqual(got, [
    { label: 'Mobile', width: 375, file: 'screenshot-375px.png' },
    { label: 'Desktop', width: 1280, file: 'screenshot-1280px.png' },
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/dashboard-signals.test.mjs`
Expected: FAIL — `Cannot find module '../scripts/dashboard/signals.mjs'`

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/dashboard/signals.mjs
export function parseProjectMeta(projectMd = '', dnaMd = '') {
  const p = String(projectMd);
  const d = String(dnaMd);
  const name = (p.match(/^#\s+(.+)$/m)?.[1]
    ?? p.match(/^(?:project|name):\s*(.+)$/im)?.[1]
    ?? '').trim() || null;
  const goal = (p.match(/^(?:goal|objective):\s*(.+)$/im)?.[1] ?? '').trim() || null;
  const archetype = (d.match(/^(?:#+\s*)?archetype:\s*(.+)$/im)?.[1] ?? '').trim() || null;
  return { name, archetype, goal };
}

export function computeHotspots(sections = []) {
  const counts = new Map();
  for (const s of sections) {
    for (const f of s?.verdict?.failures ?? []) {
      if (!f?.check) continue;
      counts.set(f.check, (counts.get(f.check) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([check, count]) => ({ check, count }))
    .sort((a, b) => b.count - a.count);
}

const BREAKPOINTS = [
  { label: 'Mobile', width: 375 },
  { label: 'Tablet', width: 768 },
  { label: 'Desktop', width: 1280 },
  { label: 'Wide', width: 1440 },
];

export function listAuditShots(auditFiles = []) {
  const present = new Set(auditFiles);
  const out = [];
  for (const { label, width } of BREAKPOINTS) {
    const file = `screenshot-${width}px.png`;
    if (present.has(file)) out.push({ label, width, file });
  }
  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/dashboard-signals.test.mjs`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/dashboard/signals.mjs tests/dashboard-signals.test.mjs
git commit -m "feat(dashboard): pure signal helpers (project meta, hotspots, audit shots)"
```

---

## Task 2: Wire signals into the dashboard server

**Files:**
- Modify: `.claude-plugin/companion/dashboard-server.mjs`
- Test: `tests/dashboard-snapshot.test.mjs`

**Interfaces:**
- Consumes: `signals.mjs` (Task 1), `readVerdict` from `scripts/verify/verdict.mjs`.
- Produces (exported from the server module so tests can import without starting it):
  - `scanSections()` — each section object gains `verdict: { floorPass, failures, ceiling } | null`.
  - `snapshot()` — gains `project_meta`, `hotspots`, `screenshots`.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/dashboard-snapshot.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ORIG_CWD = process.cwd();
let snapshot, fixture;

before(async () => {
  fixture = mkdtempSync(join(tmpdir(), 'dash-'));
  const g = join(fixture, '.planning', 'genorah');
  mkdirSync(join(g, 'sections', 'hero'), { recursive: true });
  mkdirSync(join(g, 'audit'), { recursive: true });
  writeFileSync(join(g, 'PROJECT.md'), '# Acme Landing\nGoal: ship it\n');
  writeFileSync(join(g, 'DESIGN-DNA.md'), 'archetype: Brutalist\n');
  writeFileSync(join(g, 'sections', 'hero', 'SUMMARY.md'), 'Score: 210\nTier: SOTD-Ready\nStatus: done\n');
  writeFileSync(join(g, 'sections', 'hero', 'PLAN.md'), 'beat: HOOK\n');
  writeFileSync(join(g, 'sections', 'hero', 'VERDICT.json'), JSON.stringify({
    floor: { pass: false, failures: [{ check: 'console', detail: 'x' }] }, ceiling: { score: 72 },
  }));
  writeFileSync(join(g, 'audit', 'screenshot-375px.png'), 'png');
  ({ snapshot } = await import('../.claude-plugin/companion/dashboard-server.mjs'));
});

after(() => process.chdir(ORIG_CWD));

test('importing the server module does not start the HTTP server', () => {
  // if it started, the snapshot import in before() would have bound a port and printed a URL.
  // Reaching here without a thrown EADDR or hang is the signal; assert the export exists.
  assert.equal(typeof snapshot, 'function');
});

test('snapshot includes project_meta, section verdict, hotspots, screenshots', () => {
  process.chdir(fixture);
  const s = snapshot();
  assert.equal(s.project_meta.name, 'Acme Landing');
  assert.equal(s.project_meta.archetype, 'Brutalist');
  const hero = s.sections.find(x => x.name === 'hero');
  assert.equal(hero.verdict.floorPass, false);
  assert.equal(hero.verdict.ceiling, 72);
  assert.deepEqual(hero.verdict.failures, [{ check: 'console', detail: 'x' }]);
  assert.deepEqual(s.hotspots, [{ check: 'console', count: 1 }]);
  assert.deepEqual(s.screenshots, [{ label: 'Mobile', width: 375, file: 'screenshot-375px.png' }]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/dashboard-snapshot.test.mjs`
Expected: FAIL — the import starts the server / `snapshot` not exported / new fields absent.

- [ ] **Step 3: Make the server importable + call-time root**

Read `.claude-plugin/companion/dashboard-server.mjs` first. Make these edits:

(a) Add imports after the existing imports:
```javascript
import { pathToFileURL } from 'node:url';
import { readVerdict } from '../../scripts/verify/verdict.mjs';
import { parseProjectMeta, computeHotspots, listAuditShots } from '../../scripts/dashboard/signals.mjs';
```

(b) Replace the module-level constant `const ROOT = path.join(process.cwd(), '.planning', 'genorah');` with a call-time helper:
```javascript
const root = () => path.join(process.cwd(), '.planning', 'genorah');
```
Then replace **every** remaining `ROOT` reference in the file with `root()` (in `scanSections`, `snapshot`, the `/api/screenshot/` route + its `startsWith` guard, `handleAction`, `listen`, and the `SIGINT` handler). Confirm with `grep -n "ROOT" .claude-plugin/companion/dashboard-server.mjs` returning nothing afterward.

(c) Wrap the bottom `listen();` call in a main-guard so importing the module for tests does not start the server:
```javascript
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  listen();
}
```

- [ ] **Step 4: Add the verdict to scanSections + the new snapshot fields**

In `scanSections()`, inside the `.map(...)`, after reading `summary`/`plan`, add:
```javascript
    const v = readVerdict(dir);
    const verdict = v ? {
      floorPass: v.floor?.pass ?? null,
      failures: v.floor?.failures ?? [],
      ceiling: v.ceiling?.score ?? null,
    } : null;
```
and include `verdict` in the returned section object (alongside `name, score, tier, status, beat`).

Export the function: change `function scanSections()` to `export function scanSections()`.

In `snapshot()`, hoist the sections list and add the new fields. Change the body so it reads:
```javascript
export function snapshot() {
  const sections = scanSections();
  return {
    ts: new Date().toISOString(),
    project: safeRead(path.join(root(), 'PROJECT.md')),
    project_meta: parseProjectMeta(safeRead(path.join(root(), 'PROJECT.md')), safeRead(path.join(root(), 'DESIGN-DNA.md'))),
    dna_tokens: parseDnaTokens(safeRead(path.join(root(), 'DESIGN-DNA.md'))),
    master_plan: safeRead(path.join(root(), 'MASTER-PLAN.md')),
    context: safeRead(path.join(root(), 'CONTEXT.md')),
    state: safeRead(path.join(root(), 'STATE.md')),
    sections,
    hotspots: computeHotspots(sections),
    screenshots: listAuditShots(safeReaddir(path.join(root(), 'audit'))),
    decisions_tail: safeRead(path.join(root(), 'DECISIONS.md')).split('\n').slice(-40).join('\n'),
    action_queue: safeReaddir(path.join(root(), '.action-queue')),
  };
}
```
(Keep `parseDnaTokens`/`safeRead`/`safeReaddir` as-is; just add `export` to `snapshot`.)

- [ ] **Step 5: Run test + node --check**

Run:
```bash
node --test tests/dashboard-snapshot.test.mjs
node --check .claude-plugin/companion/dashboard-server.mjs
```
Expected: tests PASS (2); `node --check` clean.

- [ ] **Step 6: Commit**

```bash
git add .claude-plugin/companion/dashboard-server.mjs tests/dashboard-snapshot.test.mjs
git commit -m "feat(dashboard): snapshot exposes verdict, project meta, hotspots, screenshots"
```

---

## Task 3: Render the new signals in dashboard.html

**Files:**
- Modify: `.claude-plugin/companion/dashboard.html`, `commands/dashboard.md`
- Test: `tests/dashboard-signals-panel.test.mjs`

**Interfaces:**
- Consumes: the snapshot fields from Task 2 (`project_meta`, `sections[].verdict`, `hotspots`, `screenshots`).
- Produces: rendered header/verdict/hotspots/screenshot UI (presence-tested).

- [ ] **Step 1: Write the failing test**

```javascript
// tests/dashboard-signals-panel.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const html = readFileSync('.claude-plugin/companion/dashboard.html', 'utf8');

test('renders the real project name from project_meta', () => {
  assert.match(html, /project_meta/);
});
test('section card renders the floor verdict (PASS/FAIL) from verdict', () => {
  assert.match(html, /verdict/);
  assert.match(html, /floorPass/);
});
test('has a gate hotspots panel reading state.hotspots', () => {
  assert.match(html, /state\.hotspots|\.hotspots\b/);
  assert.match(html, /id="hotspots"/);
});
test('has a screenshot grid reading state.screenshots via /api/screenshot/', () => {
  assert.match(html, /state\.screenshots|\.screenshots\b/);
  assert.match(html, /\/api\/screenshot\//);
  assert.match(html, /id="shots"/);
});
test('dashboard command documents the verdict/hotspots/screenshot panels', () => {
  const md = readFileSync('commands/dashboard.md', 'utf8');
  assert.match(md, /verdict|floor/i);
  assert.match(md, /hotspot/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/dashboard-signals-panel.test.mjs`
Expected: FAIL — markup absent.

- [ ] **Step 3: Add the markup**

In `.claude-plugin/companion/dashboard.html`, add two new `<section>`s (after the existing "Sections" section, before "Quick Actions"):
```html
  <section>
    <h2>Gate Hotspots</h2>
    <div id="hotspots"></div>
  </section>

  <section>
    <h2>Visual QA — latest capture</h2>
    <div class="shots-grid" id="shots"></div>
  </section>
```

Add these CSS rules inside the existing `<style>` (near the other panel rules):
```css
  .verdict { display:flex; align-items:center; gap:6px; margin-top:8px; flex-wrap:wrap; }
  .badge { font-size:10px; font-weight:700; padding:2px 8px; border-radius:999px; letter-spacing:.06em; }
  .badge.pass { background:color-mix(in srgb, var(--ok) 18%, transparent); color:var(--ok); }
  .badge.fail { background:color-mix(in srgb, var(--fail) 18%, transparent); color:var(--fail); }
  .badge.none { background:var(--bg); color:var(--muted); }
  .chk { font-size:10px; color:var(--fail); border:1px solid var(--fail); border-radius:4px; padding:1px 5px; }
  .ceil { font-size:11px; color:var(--muted); margin-left:auto; }
  .hot-row { display:flex; align-items:center; gap:8px; margin:6px 0; font-size:12px; }
  .hot-bar { height:10px; background:var(--fail); border-radius:3px; min-width:2px; }
  .hot-name { width:110px; color:var(--text); }
  .hot-count { color:var(--muted); }
  .shots-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(180px,1fr)); gap:12px; }
  .shot { border:1px solid var(--border); border-radius:8px; overflow:hidden; background:var(--bg); }
  .shot img { width:100%; display:block; }
  .shot .lbl { font-size:10px; color:var(--muted); padding:6px 8px; text-transform:uppercase; letter-spacing:.08em; }
```

- [ ] **Step 4: Add the render logic**

In the `render(state)` function in `dashboard.html`:

(a) Replace the header text update so it uses the real project. Find the `document.getElementById('ts')...` line and add, before it, a header-name update. Give the `<h1>` an id (`id="proj-name"`) in the markup and a subtitle element. In markup change the header to:
```html
    <div>
      <h1><span class="status-dot"></span><span id="proj-name">Genorah Dashboard</span></h1>
      <p style="font-size:12px;color:var(--muted);margin-top:4px;" id="proj-sub">—</p>
      <p style="font-size:12px; color: var(--muted); margin-top: 4px;" id="ts">—</p>
    </div>
```
and in `render()`:
```javascript
  const meta = state.project_meta || {};
  document.getElementById('proj-name').textContent = meta.name || 'Genorah Dashboard';
  document.getElementById('proj-sub').textContent =
    [meta.archetype, meta.goal].filter(Boolean).join(' · ') || '—';
```

(b) In the sections loop, after appending the `tier` div, append the verdict row:
```javascript
      const v = s.verdict;
      const vr = document.createElement('div');
      vr.className = 'verdict';
      const badge = document.createElement('span');
      if (!v) { badge.className = 'badge none'; badge.textContent = 'not verified'; }
      else if (v.floorPass) { badge.className = 'badge pass'; badge.textContent = 'FLOOR PASS'; }
      else { badge.className = 'badge fail'; badge.textContent = 'FLOOR FAIL'; }
      vr.appendChild(badge);
      if (v && v.floorPass === false) {
        for (const f of (v.failures || [])) {
          const chip = document.createElement('span');
          chip.className = 'chk'; chip.textContent = f.check;
          vr.appendChild(chip);
        }
      }
      if (v && v.ceiling != null) {
        const ceil = document.createElement('span');
        ceil.className = 'ceil'; ceil.textContent = 'ceiling ' + v.ceiling;
        vr.appendChild(ceil);
      }
      card.appendChild(vr);
```

(c) After the sections block, render hotspots:
```javascript
  const hot = document.getElementById('hotspots');
  hot.replaceChildren();
  const hotspots = state.hotspots || [];
  if (!hotspots.length) {
    const e = document.createElement('div'); e.className = 'empty';
    e.textContent = 'no failures — floor clean'; hot.appendChild(e);
  } else {
    const max = Math.max(...hotspots.map(h => h.count));
    for (const h of hotspots) {
      const row = document.createElement('div'); row.className = 'hot-row';
      const name = document.createElement('span'); name.className = 'hot-name'; name.textContent = h.check;
      const bar = document.createElement('div'); bar.className = 'hot-bar';
      bar.style.width = Math.round((h.count / max) * 180) + 'px';
      const cnt = document.createElement('span'); cnt.className = 'hot-count'; cnt.textContent = h.count;
      row.append(name, bar, cnt); hot.appendChild(row);
    }
  }
```

(d) Render the screenshot grid:
```javascript
  const shots = document.getElementById('shots');
  shots.replaceChildren();
  const screenshots = state.screenshots || [];
  if (!screenshots.length) {
    const e = document.createElement('div'); e.className = 'empty';
    e.textContent = 'no captures yet — run /gen:audit'; shots.appendChild(e);
  } else {
    for (const sh of screenshots) {
      const cell = document.createElement('div'); cell.className = 'shot';
      const img = document.createElement('img');
      img.loading = 'lazy'; img.alt = sh.label;
      img.src = '/api/screenshot/' + encodeURIComponent(sh.file);
      const lbl = document.createElement('div'); lbl.className = 'lbl';
      lbl.textContent = sh.label + ' · ' + sh.width + 'px';
      cell.append(img, lbl); shots.appendChild(cell);
    }
  }
```

- [ ] **Step 5: Update `commands/dashboard.md`**

In the "What the dashboard shows" list, replace the stale items (score sparklines / gate hotspots / screenshot grid that didn't exist) with the real set, including: "**Section verdicts** — each section card shows its Verification Spine FLOOR pass/fail, the failing checks, and the advisory Ceiling score." / "**Gate Hotspots** — which floor checks fail most across sections." / "**Visual QA** — the latest 4-breakpoint screenshot capture from `audit/`."

- [ ] **Step 6: Run test to verify it passes**

Run: `node --test tests/dashboard-signals-panel.test.mjs`
Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
git add .claude-plugin/companion/dashboard.html commands/dashboard.md tests/dashboard-signals-panel.test.mjs
git commit -m "feat(dashboard): render section verdicts, gate hotspots, screenshot grid, real header"
```

---

## Task 4: Validate + mirror

**Files:**
- Modify: `plugins/gen/**` (via `sync-mirror`)

- [ ] **Step 1: Full suite**

Run: `npm test`
Expected: PASS across all `tests/*.test.mjs` (incl. the 3 new dashboard test files + all prior). The verify-spine browser tests may flake once — re-run `node --test tests/*.test.mjs` if a single browser test flakes.

- [ ] **Step 2: Validate**

Run: `npm run validate`
Expected: lint + self-audit + tests pass. Fix any NEW self-audit issue from this work; note pre-existing ones.

- [ ] **Step 3: Mirror**

Run:
```bash
npm run sync-mirror
npm run check-mirror
```
Expected: clean. **Manually confirm** `plugins/gen/scripts/dashboard/signals.mjs` exists and `plugins/gen/.claude-plugin/companion/{dashboard-server.mjs,dashboard.html}` + `plugins/gen/commands/dashboard.md` reflect the changes. If `sync-mirror` skips `scripts/dashboard/`, inspect `scripts/sync-mirror.mjs`, copy by hand, and note it. Re-run `check-mirror` until clean.

- [ ] **Step 4: Commit**

```bash
git add plugins/gen
git commit -m "chore(mirror): sync dashboard phase-1 signals into plugins/gen"
```

---

## Self-Review

**Spec coverage:**
- `parseProjectMeta` / `computeHotspots` / `listAuditShots` → Task 1. ✓
- Reuse `readVerdict`; `scanSections` gains verdict; `snapshot` gains project_meta/hotspots/screenshots → Task 2. ✓
- Server importable for tests (main-guard, call-time root) → Task 2 (also fixes the import-starts-server side effect). ✓
- Header / verdict row / hotspots panel / screenshot grid render (XSS-safe) → Task 3. ✓
- `commands/dashboard.md` matches reality → Task 3. ✓
- Tests wired into `npm run validate`; mirror → Task 4. ✓
- **Deferred (non-goals):** visual redesign (Phase 2), interaction (Phase 3), per-section screenshots + score history.

**Placeholder scan:** No TBD/TODO; every code step is complete; the doc-edit step (Task 3 Step 5) names the exact items to write, gated by the presence test. ✓

**Type consistency:** `parseProjectMeta`→`{name,archetype,goal}` (Task 1) consumed as `state.project_meta.{name,archetype,goal}` (Tasks 2, 3). `computeHotspots`→`[{check,count}]` consumed by the hotspots render (Task 3) and the snapshot test (Task 2). `listAuditShots`→`[{label,width,file}]` consumed by the screenshot render (Task 3) and snapshot test. `scanSections` `verdict:{floorPass,failures,ceiling}` (Task 2) is exactly what the section-card verdict row reads (Task 3). ✓

**Deferred to implementer judgement:** the exact PROJECT.md/DESIGN-DNA.md regexes (Task 1 — degrade to null on no-match, verified against real artifacts) and the hotspot-bar normalization (normalized to max, chosen in Task 3 Step 4c).
