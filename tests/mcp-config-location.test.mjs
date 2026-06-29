// tests/mcp-config-location.test.mjs
// Regression guard for the v4.5.4 fix: Claude Code's plugin loader reads a plugin's MCP
// config from the plugin ROOT (<plugin>/.mcp.json) only — NOT from .claude-plugin/.mcp.json.
// The config lived in .claude-plugin/ since day one, so none of gen's bundled MCP servers
// (gpt-image, graphify, …) ever loaded. These tests keep it at the root, in source and mirror.
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';

test('.mcp.json lives at the plugin root and declares gpt-image', () => {
  assert.ok(existsSync('.mcp.json'), '.mcp.json must be at the plugin root');
  const mcp = JSON.parse(readFileSync('.mcp.json', 'utf8'));
  assert.ok('gpt-image' in mcp, 'gpt-image server must be declared');
});

test('.mcp.json is NOT misplaced inside .claude-plugin/ (the loader ignores it there)', () => {
  assert.equal(existsSync('.claude-plugin/.mcp.json'), false, '.mcp.json must not live in .claude-plugin/');
});

test('the published mirror exposes .mcp.json at its plugin root', () => {
  assert.ok(existsSync('plugins/gen/.mcp.json'), 'plugins/gen/.mcp.json must exist (sync-mirror FILES_TO_SYNC)');
  assert.equal(existsSync('plugins/gen/.claude-plugin/.mcp.json'), false, 'mirror must not keep the old .claude-plugin/.mcp.json');
  const mcp = JSON.parse(readFileSync('plugins/gen/.mcp.json', 'utf8'));
  assert.ok('gpt-image' in mcp, 'mirror must declare gpt-image at its root');
});

test('every optional gpt-image env var has a default (an unset no-default var can drop the server)', () => {
  const env = JSON.parse(readFileSync('.mcp.json', 'utf8'))['gpt-image'].env;
  for (const [k, v] of Object.entries(env)) {
    if (k === 'OPENAI_API_KEY') continue; // the one required var
    assert.match(v, /:-/, `${k} must use \${VAR:-default} so an undefined value cannot drop the whole server`);
  }
});
