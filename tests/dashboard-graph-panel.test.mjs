// tests/dashboard-graph-panel.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

test('dashboard.html has a graph panel wired to /api/graph and the graph view-model', () => {
  const html = readFileSync('.claude-plugin/companion/dashboard.html', 'utf8');
  assert.match(html, /\/api\/graph\b/, 'must iframe/link the graph route');
  // v4.4.0: the graph summary is derived by buildViewModel (vm.graph) and painted
  // by renderGraph — the raw state.graph access moved into the tested view-model.
  assert.match(html, /vm\.graph|graph\.exists|renderGraph/, 'must read the graph summary from the view model');
  assert.match(html, /gen:graphify scan/, 'must show the scan prompt when no graph');
});

test('dashboard command documents the graph panel', () => {
  assert.match(readFileSync('commands/dashboard.md', 'utf8'), /graph/i);
});
