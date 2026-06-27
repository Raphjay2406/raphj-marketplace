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
