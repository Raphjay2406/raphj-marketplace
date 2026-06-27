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
