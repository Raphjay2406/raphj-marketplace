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
