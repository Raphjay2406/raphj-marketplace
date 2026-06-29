// tests/dashboard-signals-panel.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const html = readFileSync('.claude-plugin/companion/dashboard.html', 'utf8');

test('renders the real project name from the project view-model', () => {
  // v4.4.0: project_meta → vm.project.name (derived in the tested view-model),
  // painted into #proj-name by the renderer.
  assert.match(html, /id="proj-name"/);
  assert.match(html, /project\.name/);
});
test('section card renders the floor verdict (PASS/FAIL) from verdict', () => {
  assert.match(html, /verdict/);
  assert.match(html, /verdict\.state|verdict\.label/);
});
test('has a gate hotspots panel reading state.hotspots', () => {
  assert.match(html, /state\.hotspots|\.hotspots\b/);
  assert.match(html, /id="hotspots"/);
});
test('has a screenshot grid reading state.screenshots via /api/screenshot/', () => {
  assert.match(html, /state\.screenshots|\.screenshots\b/);
  assert.match(html, /\/api\/screenshot\//);
  assert.match(html, /id="shots"/);
});
test('dashboard command documents the verdict/hotspots/screenshot panels', () => {
  const md = readFileSync('commands/dashboard.md', 'utf8');
  assert.match(md, /verdict|floor/i);
  assert.match(md, /hotspot/i);
});
