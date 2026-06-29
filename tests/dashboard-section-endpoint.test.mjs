// tests/dashboard-section-endpoint.test.mjs
// Exercises the lazy /api/section reader: real section, missing, traversal.
// Own process → no chdir clash with the frozen snapshot test.
import { test, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ORIG_CWD = process.cwd();
let readSectionDetail, fixture;

before(async () => {
  fixture = mkdtempSync(join(tmpdir(), 'dash-sec-'));
  const g = join(fixture, '.planning', 'genorah');
  mkdirSync(join(g, 'sections', 'hero'), { recursive: true });
  writeFileSync(join(g, 'sections', 'hero', 'SUMMARY.md'), 'Score: 210\nTier: SOTD-Ready\n');
  writeFileSync(join(g, 'sections', 'hero', 'PLAN.md'), 'beat: HOOK\nwave: 1\n');
  writeFileSync(join(g, 'sections', 'hero', 'VERDICT.json'), JSON.stringify({
    floor: { pass: false, failures: [{ check: 'console', detail: 'TypeError x' }] }, ceiling: { score: 72 },
  }));
  // a secret file the traversal probe must NOT be able to read
  writeFileSync(join(fixture, 'secret.md'), 'top secret');
  ({ readSectionDetail } = await import('../.claude-plugin/companion/dashboard-server.mjs'));
});

after(() => process.chdir(ORIG_CWD));

test('readSectionDetail returns summary/plan/verdict for a real section', () => {
  process.chdir(fixture);
  const d = readSectionDetail('hero');
  assert.equal(d.name, 'hero');
  assert.match(d.summary, /Score: 210/);
  assert.match(d.plan, /beat: HOOK/);
  assert.equal(d.verdict.floor.pass, false);
  assert.equal(d.verdict.floor.failures[0].detail, 'TypeError x');
  assert.equal(d.verdict.ceiling.score, 72);
});

test('readSectionDetail returns not found for a missing section', () => {
  process.chdir(fixture);
  assert.deepEqual(readSectionDetail('ghost'), { error: 'not found' });
  assert.deepEqual(readSectionDetail(''), { error: 'not found' });
});

test('readSectionDetail rejects path traversal', () => {
  process.chdir(fixture);
  assert.deepEqual(readSectionDetail('../../package'), { error: 'forbidden' });
  assert.deepEqual(readSectionDetail('../../secret'), { error: 'forbidden' });
  assert.deepEqual(readSectionDetail('../secret.md'), { error: 'forbidden' });
});
