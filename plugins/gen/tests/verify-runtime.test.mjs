// tests/verify-runtime.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { detectFramework, buildCommand, devCommand } from '../scripts/verify/runtime.mjs';

function projWith(deps) {
  const dir = mkdtempSync(join(tmpdir(), 'verify-proj-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ dependencies: deps }));
  return dir;
}

test('detects Next.js', () => {
  assert.equal(detectFramework(projWith({ next: '16.0.0' })), 'next');
});
test('detects Astro', () => {
  assert.equal(detectFramework(projWith({ astro: '6.0.0' })), 'astro');
});
test('unknown when no known framework', () => {
  assert.equal(detectFramework(projWith({ lodash: '4' })), 'unknown');
});
test('build/dev commands map per framework', () => {
  assert.match(buildCommand('next'), /next build|npm(\.cmd)? run build/);
  assert.match(devCommand('vite'), /vite|npm(\.cmd)? run dev/);
});
