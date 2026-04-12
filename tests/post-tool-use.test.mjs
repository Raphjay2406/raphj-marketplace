import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const HOOK = join(ROOT, '.claude-plugin/hooks/post-tool-use.mjs');

function runHookIn(cwd, tool_name, tool_input) {
  const r = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_name, tool_input }),
    cwd,
    encoding: 'utf8',
  });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}

test('post-tool-use exits 0 when no .planning/genorah exists', () => {
  const dir = mkdtempSync(join(tmpdir(), 'genorah-pthook-'));
  try {
    const r = runHookIn(dir, 'Write', { file_path: join(dir, 'x.tsx') });
    assert.equal(r.status, 0);
    assert.equal(r.stdout.trim(), '{}');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('post-tool-use appends METRICS.md when .planning/genorah exists', () => {
  const dir = mkdtempSync(join(tmpdir(), 'genorah-pthook-'));
  try {
    mkdirSync(join(dir, '.planning', 'genorah'), { recursive: true });
    const r = runHookIn(dir, 'Write', { file_path: join(dir, 'sections/hero/Hero.tsx') });
    assert.equal(r.status, 0);
    assert.ok(existsSync(join(dir, '.planning/genorah/METRICS.md')));
    const content = readFileSync(join(dir, '.planning/genorah/METRICS.md'), 'utf8');
    assert.match(content, /# Build Metrics/);
    assert.match(content, /Write/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('post-tool-use survives malformed tool_input', () => {
  const dir = mkdtempSync(join(tmpdir(), 'genorah-pthook-'));
  try {
    mkdirSync(join(dir, '.planning', 'genorah'), { recursive: true });
    const r = runHookIn(dir, 'Bash', null);
    assert.equal(r.status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('post-tool-use escapes pipe chars in target', () => {
  const dir = mkdtempSync(join(tmpdir(), 'genorah-pthook-'));
  try {
    mkdirSync(join(dir, '.planning', 'genorah'), { recursive: true });
    runHookIn(dir, 'Bash', { command: 'grep "foo | bar" file.txt' });
    const content = readFileSync(join(dir, '.planning/genorah/METRICS.md'), 'utf8');
    assert.match(content, /\\\|/);  // pipe should be escaped
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
