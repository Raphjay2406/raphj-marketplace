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
