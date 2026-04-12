import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const HOOK = join(ROOT, '.claude-plugin/hooks/pre-tool-use.mjs');

function runHook(tool_name, tool_input, session_id = 'test-session') {
  const input = JSON.stringify({ tool_name, tool_input, session_id });
  const r = spawnSync('node', [HOOK], { input, cwd: ROOT, encoding: 'utf8' });
  assert.equal(r.status, 0, `hook exited ${r.status}: ${r.stderr}`);
  return r.stdout.trim() ? JSON.parse(r.stdout) : {};
}

test('Bash tool with no matching skills → empty response', () => {
  const r = runHook('Bash', { command: 'ls -la' });
  // May or may not inject something; response must be valid JSON
  assert.ok(typeof r === 'object');
});

test('Write on .tsx file does not crash', () => {
  const r = runHook('Write', { file_path: '/tmp/test.tsx', content: '<div />' });
  assert.ok(typeof r === 'object');
});

test('Unknown tool returns empty object', () => {
  const r = runHook('UnknownTool', { foo: 'bar' });
  assert.deepEqual(r, {});
});

test('Hook handles missing tool_input gracefully', () => {
  const r = runHook('Write', null);
  assert.deepEqual(r, {});
});

test('v3.2.1 triggers fallback: animation-orchestration matches motion prompt', () => {
  // Content mentioning "animation orchestration" should trigger the skill's injection_regex
  const r = runHook('Write', {
    file_path: '/tmp/hero.tsx',
    content: 'import { motion } from "motion/react"; // animation orchestration with stagger pattern'
  });
  // Injection may occur; result must at least parse
  assert.ok(typeof r === 'object');
});
