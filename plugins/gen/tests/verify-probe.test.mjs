// tests/verify-probe.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { probe } from '../scripts/verify/probe.mjs';

const here = dirname(fileURLToPath(import.meta.url));
let server, base;

before(async () => {
  server = createServer((req, res) => {
    const file = req.url.includes('broken') ? 'broken.html' : 'clean.html';
    res.setHeader('content-type', 'text/html');
    res.end(readFileSync(join(here, 'fixtures/verify', file)));
  });
  await new Promise(r => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test('clean page: no console errors, no overflow, motion present', async () => {
  const r = await probe(`${base}/clean`, {});
  assert.equal(r.console.errors.length, 0);
  assert.equal(r.overflow.length, 0);
  assert.equal(r.motion.present, true);
  assert.match(r.html, /hero-abc\.png/);
});

test('broken page: console error and overflow detected', async () => {
  const r = await probe(`${base}/broken`, {});
  assert.ok(r.console.errors.length >= 1);
  assert.ok(r.overflow.length >= 1);
});
