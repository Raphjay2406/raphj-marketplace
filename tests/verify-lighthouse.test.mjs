// tests/verify-lighthouse.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { runLighthouse } from '../scripts/verify/lighthouse.mjs';

test('unreachable url fails closed with performance 0', async () => {
  const r = await runLighthouse('http://127.0.0.1:9', {}); // nothing listening
  assert.equal(r.performance, 0);
  assert.ok(r.error);
});
