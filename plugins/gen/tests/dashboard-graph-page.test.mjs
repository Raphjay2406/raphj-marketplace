// tests/dashboard-graph-page.test.mjs
// The full-page Knowledge Graph view: dedicated /graph route + page, linked from the panel.
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const page = readFileSync('.claude-plugin/companion/graph-page.html', 'utf8');
const server = readFileSync('.claude-plugin/companion/dashboard-server.mjs', 'utf8');
const dash = readFileSync('.claude-plugin/companion/dashboard.html', 'utf8');

test('graph-page.html fills the viewport with the graph and links back', () => {
  assert.match(page, /<iframe[^>]+src="\/api\/graph"/, 'must embed the graph viz');
  assert.match(page, /href="\/"/, 'must link back to the dashboard');
  assert.match(page, /\/api\/state/, 'must read the live graph summary from state');
  assert.match(page, /gen:graphify scan/, 'must show the empty-state prompt when no graph');
});

test('server serves the full-page view at /graph', () => {
  assert.match(server, /p === '\/graph'/, 'must route /graph');
  assert.match(server, /graph-page\.html/, 'must serve graph-page.html');
});

test('dashboard panel links to the full-page graph', () => {
  assert.match(dash, /href="\/graph"/, 'panel must link to /graph');
});
