import { test } from 'node:test';
import assert from 'node:assert';
import { recall } from '../scripts/memory/recall.mjs';

const BM25_JSON = JSON.stringify([
  { score: 2.5, ref: 'DECISIONS.md#42', ts: 't', actor: 'a', kind: 'decision', subject: 's', summary: 'use indigo primary' },
]);

test('routes to graphify when available and graph exists', () => {
  const calls = [];
  const r = recall('how does auth work', {
    deps: {
      graphifyAvailable: () => true,
      graphExists: () => true,
      run: (cmd, args) => { calls.push([cmd, args]); return 'auth handled by login route\nsession via cookie'; },
    },
  });
  assert.equal(r.provider, 'graphify');
  assert.equal(r.hits.length, 2);
  assert.equal(r.hits[0].summary, 'auth handled by login route');
  assert.equal(calls[0][0], 'graphify');
  assert.equal(calls[0][1][0], 'query');
});

test('falls back to BM25 when graphify unavailable', () => {
  const r = recall('indigo', {
    deps: {
      graphifyAvailable: () => false,
      graphExists: () => false,
      run: (cmd) => { assert.equal(cmd, 'node'); return BM25_JSON; },
    },
  });
  assert.equal(r.provider, 'semantic-index');
  assert.equal(r.hits.length, 1);
  assert.deepEqual(r.hits[0], { id: 'DECISIONS.md#42', summary: 'use indigo primary', source: 'DECISIONS.md#42', score: 2.5 });
});

test('falls back to BM25 when the graphify query throws', () => {
  const r = recall('x', {
    deps: {
      graphifyAvailable: () => true,
      graphExists: () => true,
      run: (cmd) => { if (cmd === 'graphify') throw new Error('graph corrupt'); return BM25_JSON; },
    },
  });
  assert.equal(r.provider, 'semantic-index');
  assert.equal(r.hits.length, 1);
});

test('returns provider none when everything fails', () => {
  const r = recall('x', {
    deps: {
      graphifyAvailable: () => false, graphExists: () => false,
      run: () => { throw new Error('boom'); },
    },
  });
  assert.deepEqual(r, { provider: 'none', hits: [] });
});
