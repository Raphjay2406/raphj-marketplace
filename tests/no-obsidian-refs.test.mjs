// tests/no-obsidian-refs.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

test('.mcp.json declares no obsidian servers', () => {
  const mcp = JSON.parse(readFileSync('.claude-plugin/.mcp.json', 'utf8'));
  assert.ok(!('obsidian' in mcp), 'obsidian entry must be removed');
  assert.ok(!('obsidian-fs' in mcp), 'obsidian-fs entry must be removed');
  // the other servers survive
  assert.ok('gpt-image' in mcp && 'graphify' in mcp, 'non-obsidian servers must remain');
});
