// tests/dashboard-wave.test.mjs
// Verifies scanSections emits the additive `wave` field parsed from PLAN.md.
// Separate file → own process, so its process.chdir does not clash with the
// frozen dashboard-snapshot test.
import { test, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ORIG_CWD = process.cwd();
let scanSections, fixture;

before(async () => {
  fixture = mkdtempSync(join(tmpdir(), 'dash-wave-'));
  const g = join(fixture, '.planning', 'genorah');
  mkdirSync(join(g, 'sections', 'hero'), { recursive: true });
  writeFileSync(join(g, 'sections', 'hero', 'SUMMARY.md'), 'Score: 210\nStatus: done\n');
  writeFileSync(join(g, 'sections', 'hero', 'PLAN.md'), 'beat: HOOK\nwave: 2\n');
  ({ scanSections } = await import('../.claude-plugin/companion/dashboard-server.mjs'));
});

after(() => process.chdir(ORIG_CWD));

test('scanSections parses wave number from PLAN.md', () => {
  process.chdir(fixture);
  const sections = scanSections();
  const hero = sections.find(s => s.name === 'hero');
  assert.equal(hero.wave, 2);
});

test('scanSections yields null wave when PLAN.md omits it', () => {
  process.chdir(fixture);
  const fx2 = mkdtempSync(join(tmpdir(), 'dash-nowave-'));
  const g = join(fx2, '.planning', 'genorah');
  mkdirSync(join(g, 'sections', 'cta'), { recursive: true });
  writeFileSync(join(g, 'sections', 'cta', 'PLAN.md'), 'beat: CLOSE\n');
  process.chdir(fx2);
  const hero = scanSections().find(s => s.name === 'cta');
  assert.equal(hero.wave, null);
});
