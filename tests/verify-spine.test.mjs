import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  computeInputHash, writeVerdict, readVerdict, isVerdictFresh, RUBRIC_VERSION,
} from '../scripts/verify/verdict.mjs';
import { evaluateFloor } from '../scripts/verify/floor.mjs';
import { requiredPayload, checkAssetPresence } from '../scripts/verify/asset-requirements.mjs';

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
