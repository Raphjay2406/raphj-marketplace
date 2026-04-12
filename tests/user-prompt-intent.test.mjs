import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const HOOK = join(ROOT, '.claude-plugin/hooks/user-prompt.mjs');

function runHook(user_message, cwd = ROOT) {
  const input = JSON.stringify({ user_message });
  const r = spawnSync('node', [HOOK], { input, cwd, encoding: 'utf8' });
  assert.equal(r.status, 0, `hook exited ${r.status}: ${r.stderr}`);
  return r.stdout.trim() ? JSON.parse(r.stdout) : {};
}

test('stale /modulo: reference triggers migration hint', () => {
  const r = runHook('/modulo:execute some section');
  assert.match(r.additionalContext || '', /gen:build/i);
});

test('intent "fix a bug" routes to /gen:bugfix suggestion', () => {
  const r = runHook('I need to fix a bug in the hero');
  assert.match(r.additionalContext || '', /gen:bugfix/);
});

test('plain technical question does NOT trigger lost-user hint', () => {
  const r = runHook('What is the difference between tier and category frontmatter?');
  assert.doesNotMatch(r.additionalContext || '', /Suggested next/i);
});

test('explicit lost signal routes suggestion', () => {
  const r = runHook('I\'m stuck on this. what should I do next?');
  const ctx = r.additionalContext || '';
  assert.match(ctx, /Suggested next/);
});
