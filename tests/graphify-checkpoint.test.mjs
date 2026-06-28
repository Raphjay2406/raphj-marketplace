// tests/graphify-checkpoint.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { isCheckpoint, shouldUpdate } from '../scripts/graphify/checkpoint.mjs';

test('isCheckpoint matches the checkpoint kinds only', () => {
  assert.equal(isCheckpoint({ kind: 'section-shipped' }), true);
  assert.equal(isCheckpoint({ kind: 'decision-made' }), true);
  assert.equal(isCheckpoint({ kind: 'commit-made' }), true);
  assert.equal(isCheckpoint({ kind: 'subgate-fired' }), false);
  assert.equal(isCheckpoint({}), false);
});

test('shouldUpdate respects the debounce window', () => {
  assert.equal(shouldUpdate({ now: 1_000_000, lastStampMs: null }), true);
  assert.equal(shouldUpdate({ now: 1_000_000, lastStampMs: 1_000_000 - 5_000 }), false);
  assert.equal(shouldUpdate({ now: 1_000_000, lastStampMs: 1_000_000 - 40_000 }), true);
});
