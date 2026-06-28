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
