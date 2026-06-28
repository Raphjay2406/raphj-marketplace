import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  graphifyAvailable, resetCapabilityCache, graphExists, graphAgeMs,
} from '../scripts/graphify/capability.mjs';

test('graphifyAvailable true when version runner succeeds', () => {
  resetCapabilityCache();
  assert.equal(graphifyAvailable({ runner: () => 'graphify 0.8.50' }), true);
});

test('graphifyAvailable false when runner throws', () => {
  resetCapabilityCache();
  assert.equal(graphifyAvailable({ runner: () => { throw new Error('not found'); } }), false);
});

test('graphifyAvailable caches the first result', () => {
  resetCapabilityCache();
  assert.equal(graphifyAvailable({ runner: () => 'ok' }), true);
  // second call with a throwing runner still returns cached true
  assert.equal(graphifyAvailable({ runner: () => { throw new Error('x'); } }), true);
});

test('graphExists / graphAgeMs reflect the file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gcap-'));
  const p = join(dir, 'graph.json');
  assert.equal(graphExists(p), false);
  assert.equal(graphAgeMs(p), null);
  writeFileSync(p, '{}');
  const past = Date.now() - 60_000;
  utimesSync(p, new Date(past / 1000), new Date(past / 1000));
  assert.equal(graphExists(p), true);
  const age = graphAgeMs(p, Date.now());
  assert.ok(age >= 55_000, `age ${age} should be ~60s`);
});
