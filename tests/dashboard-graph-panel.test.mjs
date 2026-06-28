// tests/dashboard-graph-panel.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

test('dashboard.html has a graph panel wired to /api/graph and state.graph', () => {
  const html = readFileSync('.claude-plugin/companion/dashboard.html', 'utf8');
  assert.match(html, /\/api\/graph\b/, 'must iframe/link the graph route');
  assert.match(html, /state\.graph|data\.graph/, 'must read the graph summary from state');
  assert.match(html, /gen:graphify scan/, 'must show the scan prompt when no graph');
});

test('dashboard command documents the graph panel', () => {
  assert.match(readFileSync('commands/dashboard.md', 'utf8'), /graph/i);
});
