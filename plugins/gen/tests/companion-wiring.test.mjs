// tests/companion-wiring.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'fs';

const HANDSHAKE = /render-screen\.mjs[\s\S]*read-selection\.mjs/;

test('start-project wires the companion render→read handshake', () => {
  const t = readFileSync('commands/start-project.md', 'utf8');
  assert.match(t, /render-screen\.mjs/);
  assert.match(t, /read-selection\.mjs/);
});
test('discuss wires the companion handshake', () => {
  assert.match(readFileSync('commands/discuss.md', 'utf8'), HANDSHAKE);
});
test('iterate wires the companion handshake', () => {
  assert.match(readFileSync('commands/iterate.md', 'utf8'), HANDSHAKE);
});
test('visual-companion-screens skill points at the deterministic renderer', () => {
  assert.match(readFileSync('skills/visual-companion-screens/SKILL.md', 'utf8'), /render-screen\.mjs/);
});
