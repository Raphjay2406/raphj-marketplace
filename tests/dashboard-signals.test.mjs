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
