// tests/graph-summary.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { graphSummary } from '../scripts/graphify/graph-summary.mjs';

function repoWithGraph(graph) {
  const dir = mkdtempSync(join(tmpdir(), 'gsum-'));
  mkdirSync(join(dir, 'graphify-out'), { recursive: true });
  writeFileSync(join(dir, 'graphify-out', 'graph.json'), JSON.stringify(graph));
  return dir;
}

test('absent graph → exists false, nulls', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gsum-none-'));
  assert.deepEqual(graphSummary(dir), { exists: false, nodes: null, edges: null, ageMs: null });
});

test('present graph → counts + age', () => {
  const dir = repoWithGraph({ nodes: [1, 2, 3], edges: [{ a: 1 }, { a: 2 }] });
  const p = join(dir, 'graphify-out', 'graph.json');
  const past = Date.now() - 90_000;
  utimesSync(p, new Date(past / 1000), new Date(past / 1000));
  const s = graphSummary(dir, Date.now());
  assert.equal(s.exists, true);
  assert.equal(s.nodes, 3);
  assert.equal(s.edges, 2);
  assert.ok(s.ageMs >= 85_000, `age ${s.ageMs}`);
});

test('edges fallback to links', () => {
  const dir = repoWithGraph({ nodes: [1], links: [{ a: 1 }, { a: 2 }, { a: 3 }] });
  assert.equal(graphSummary(dir).edges, 3);
});

test('corrupt graph → exists false', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gsum-bad-'));
  mkdirSync(join(dir, 'graphify-out'), { recursive: true });
  writeFileSync(join(dir, 'graphify-out', 'graph.json'), '{not json');
  assert.equal(graphSummary(dir).exists, false);
});
