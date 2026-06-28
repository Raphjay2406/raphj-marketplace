// tests/graph-path.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { join, sep } from 'node:path';
import { safeGraphAsset } from '../scripts/graphify/graph-path.mjs';

test('resolves a normal asset inside graphify-out', () => {
  const got = safeGraphAsset('/proj', 'graph.html');
  assert.equal(got, join('/proj', 'graphify-out', 'graph.html'));
});

test('rejects directory traversal', () => {
  assert.equal(safeGraphAsset('/proj', '../secret.txt'), null);
  assert.equal(safeGraphAsset('/proj', '..%2f..%2fetc/passwd'), null);
  assert.equal(safeGraphAsset('/proj', `..${sep}..${sep}etc`), null);
});

test('rejects absolute escape', () => {
  assert.equal(safeGraphAsset('/proj', '/etc/passwd'), null);
});
