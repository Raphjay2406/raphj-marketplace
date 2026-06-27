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

test('quality-gate-v3 contains no silent score multipliers (×0.5/×0.6/×0.7)', () => {
  const txt = readFileSync('skills/quality-gate-v3/SKILL.md', 'utf8');
  assert.equal(/×\s?0\.(5|6|7)0?\b/.test(txt), false, 'cascade multiplier (×0.5/×0.6/×0.7) still present in v3');
});

test('quality-gate-v3 does not contain "Cascade inherited from v2"', () => {
  const txt = readFileSync('skills/quality-gate-v3/SKILL.md', 'utf8');
  assert.equal(/cascade inherited from v2/i.test(txt), false, '"Cascade inherited from v2" phrase still present in v3');
});
