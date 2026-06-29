// tests/dashboard-view-model.test.mjs
// Pure unit tests for the dashboard presentation transform. No DOM, no I/O.
import { test } from 'node:test';
import assert from 'node:assert';
import {
  scoreTier, summarize, hotspotBars, themeFromTokens,
  relativeTime, deriveWaves, buildViewModel,
} from '../scripts/dashboard/view-model.mjs';

test('scoreTier maps gate tiers at exact boundaries', () => {
  assert.deepEqual(scoreTier(235), { label: 'SOTM-Ready', klass: 'sotm' });
  assert.deepEqual(scoreTier(234), { label: 'Honoree', klass: 'honoree' });
  assert.deepEqual(scoreTier(220), { label: 'Honoree', klass: 'honoree' });
  assert.deepEqual(scoreTier(219), { label: 'SOTD-Ready', klass: 'sotd' });
  assert.deepEqual(scoreTier(200), { label: 'SOTD-Ready', klass: 'sotd' });
  assert.deepEqual(scoreTier(199), { label: 'Strong', klass: 'strong' });
  assert.deepEqual(scoreTier(170), { label: 'Strong', klass: 'strong' });
  assert.deepEqual(scoreTier(169), { label: 'Baseline', klass: 'baseline' });
  assert.deepEqual(scoreTier(140), { label: 'Baseline', klass: 'baseline' });
  assert.deepEqual(scoreTier(139), { label: 'Reject', klass: 'reject' });
  assert.deepEqual(scoreTier(0), { label: 'Reject', klass: 'reject' });
});

test('scoreTier returns neutral for null / NaN', () => {
  assert.deepEqual(scoreTier(null), { label: '—', klass: 'none' });
  assert.deepEqual(scoreTier(undefined), { label: '—', klass: 'none' });
  assert.deepEqual(scoreTier('nope'), { label: '—', klass: 'none' });
});

test('summarize counts totals, verified, floor pass/fail and avg score', () => {
  const sections = [
    { score: 210, verdict: { floorPass: true } },
    { score: 150, verdict: { floorPass: false } },
    { score: 180, verdict: null },
    { score: null, verdict: { floorPass: true } },
    { /* no score, no verdict */ },
  ];
  const s = summarize(sections);
  assert.equal(s.total, 5);
  assert.equal(s.verified, 3); // three have a verdict object
  assert.equal(s.floorPass, 2);
  assert.equal(s.floorFail, 1);
  assert.equal(s.avgScore, 180); // mean of 210,150,180 = 180
});

test('summarize handles empty input', () => {
  assert.deepEqual(summarize([]), { total: 0, verified: 0, floorPass: 0, floorFail: 0, avgScore: null });
  assert.deepEqual(summarize(), { total: 0, verified: 0, floorPass: 0, floorFail: 0, avgScore: null });
});

test('hotspotBars scales to max with a 2px floor', () => {
  const bars = hotspotBars([{ check: 'console', count: 4 }, { check: 'axe', count: 1 }], 200);
  assert.deepEqual(bars[0], { check: 'console', count: 4, pct: 100, px: 200 });
  assert.equal(bars[1].pct, 25);
  assert.equal(bars[1].px, 50);
  assert.equal(hotspotBars([], 200).length, 0);
});

test('hotspotBars never drops below 2px for tiny ratios', () => {
  const bars = hotspotBars([{ check: 'a', count: 1000 }, { check: 'b', count: 1 }], 100);
  assert.equal(bars[1].px, 2); // round(1/1000*100)=0 → clamped to 2
});

test('themeFromTokens uses tokens when present', () => {
  const t = themeFromTokens({ bg: '#111', primary: '#abcdef', accent: '#00ff00' });
  assert.equal(t.bg, '#111');
  assert.equal(t.primary, '#abcdef');
  assert.equal(t.accent, '#00ff00');
});

test('themeFromTokens falls back per-key when token missing or blank', () => {
  const t = themeFromTokens({ primary: '   ' });
  assert.equal(t.primary, '#7c5cff'); // blank → default
  assert.equal(t.bg, '#0a0a0b');      // absent → default
  assert.equal(t.ok, '#3fc28a');
  // tolerates non-object input
  assert.equal(themeFromTokens(null).primary, '#7c5cff');
});

test('relativeTime buckets seconds/minutes/hours/days', () => {
  const base = '2026-06-29T12:00:00.000Z';
  const plus = (ms) => new Date(Date.parse(base) + ms).toISOString();
  assert.equal(relativeTime(base, plus(5000)), '5s ago');
  assert.equal(relativeTime(base, plus(90 * 1000)), '2m ago');
  assert.equal(relativeTime(base, plus(3 * 3600 * 1000)), '3h ago');
  assert.equal(relativeTime(base, plus(2 * 86400 * 1000)), '2d ago');
  assert.equal(relativeTime('garbage', base), '—');
});

test('deriveWaves groups real sections and derives status by precedence', () => {
  const sections = [
    { name: 'a', wave: 1, score: 210, verdict: { floorPass: true } },
    { name: 'b', wave: 1, score: 205, verdict: { floorPass: true } },
    { name: 'c', wave: 2, score: 150, verdict: { floorPass: false } },
    { name: 'd', wave: 3, status: 'building', score: null, verdict: null },
  ];
  const w = deriveWaves(sections);
  assert.deepEqual(w.map(x => x.n), ['1', '2', '3']);
  assert.equal(w[0].status, 'done');     // all pass
  assert.equal(w[0].count, 2);
  assert.equal(w[1].status, 'failed');   // a floor fail dominates
  assert.equal(w[2].status, 'building'); // status hint
});

test('deriveWaves falls back to scraping the master plan when sections lack waves', () => {
  const w = deriveWaves([{ name: 'x' }], 'Wave 0: scaffold\nwave 1: shell\nWave 2: sections');
  assert.deepEqual(w.map(x => x.n), ['0', '1', '2']);
  assert.ok(w.every(x => x.status === 'planned'));
});

test('buildViewModel composes a render-ready model', () => {
  const snapshot = {
    ts: '2026-06-29T12:00:00.000Z',
    project_meta: { name: 'Acme', archetype: 'Brutalist', goal: 'ship it' },
    dna_tokens: { bg: '#111', primary: '#abcdef' },
    master_plan: 'Wave 1',
    sections: [
      { name: 'hero', beat: 'HOOK', wave: 1, score: 210, verdict: { floorPass: true, ceiling: 80 } },
      { name: 'cta', beat: 'CLOSE', wave: 1, score: 150, verdict: { floorPass: false, failures: [{ check: 'console' }, { check: 'axe' }], ceiling: 60 } },
    ],
    hotspots: [{ check: 'console', count: 1 }, { check: 'axe', count: 1 }],
    screenshots: [{ label: 'Mobile', width: 375, file: 'screenshot-375px.png' }],
    graph: { exists: true, nodes: 3, edges: 2, ageMs: 1000 },
    context: 'ctx', decisions_tail: 'dec', action_queue: ['audit'],
  };
  const vm = buildViewModel(snapshot, '2026-06-29T12:00:03.000Z');
  assert.equal(vm.project.name, 'Acme');
  assert.ok(vm.project.sub.includes('Brutalist'));
  assert.equal(vm.tsLabel, '3s ago');
  assert.equal(vm.theme.primary, '#abcdef');
  assert.deepEqual(vm.dnaChips, [{ token: 'bg', value: '#111' }, { token: 'primary', value: '#abcdef' }]);
  assert.equal(vm.stats.total, 2);
  assert.equal(vm.stats.floorPass, 1);
  assert.equal(vm.stats.floorFail, 1);
  assert.equal(vm.waves[0].status, 'failed'); // wave 1 has a floor fail
  const hero = vm.sections.find(s => s.name === 'hero');
  assert.equal(hero.tierLabel, 'SOTD-Ready');
  assert.equal(hero.verdict.state, 'pass');
  const cta = vm.sections.find(s => s.name === 'cta');
  assert.equal(cta.verdict.state, 'fail');
  assert.deepEqual(cta.verdict.failures, ['console', 'axe']);
  assert.equal(cta.verdict.ceiling, 60);
  assert.equal(vm.hotspots.length, 2);
  assert.equal(vm.screenshots[0].file, 'screenshot-375px.png');
  assert.equal(vm.queue.length, 1);
});

test('non-finite scores never leak NaN into the view model', () => {
  // Defense-in-depth: real data is always int|null, but a malformed score must
  // not reach the UI as "NaN" or poison the average.
  assert.equal(summarize([{ score: NaN, verdict: { floorPass: true } }, { score: 200 }]).avgScore, 200);
  const vm = buildViewModel({ sections: [{ name: 'x', score: NaN }, { name: 'y', score: 'bad' }] }, '');
  assert.equal(vm.sections[0].score, null);
  assert.equal(vm.sections[0].scoreLabel, '—');
  assert.equal(vm.sections[0].tierLabel, '—');
  assert.equal(vm.sections[1].scoreLabel, '—');
});

test('buildViewModel falls back when project name and tokens are absent', () => {
  const vm = buildViewModel({ ts: '2026-06-29T12:00:00.000Z' }, '2026-06-29T12:00:00.000Z');
  assert.equal(vm.project.name, 'Genorah Dashboard');
  assert.equal(vm.project.sub, '—');
  assert.equal(vm.theme.primary, '#7c5cff'); // default theme
  assert.deepEqual(vm.sections, []);
  assert.deepEqual(vm.hotspots, []);
  assert.equal(vm.tsLabel, '0s ago');
});
