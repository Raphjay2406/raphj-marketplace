// tests/verifier-wiring.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'fs';

test('verifier agent exists and consumes VERDICT.json', () => {
  assert.ok(existsSync('agents/verifier.md'));
  assert.match(readFileSync('agents/verifier.md', 'utf8'), /VERDICT\.json/);
});

test('build command attaches the verification spine', () => {
  assert.match(readFileSync('commands/build.md', 'utf8'), /verify-section\.mjs|Verification Spine/);
});

test('plan command emits an assets block and runs the planner-lint', () => {
  const txt = readFileSync('commands/plan.md', 'utf8');
  assert.match(txt, /assets:/);
  assert.match(txt, /asset-declaration/);
});
