// tests/graphify-integration.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { recall } from '../scripts/memory/recall.mjs';
import { resetCapabilityCache } from '../scripts/graphify/capability.mjs';

function graphifyInstalled() {
  try { execFileSync('graphify', ['--version'], { stdio: 'ignore', timeout: 5000 }); return true; }
  catch { return false; }
}

test('real graphify build + recall (skipped if graphify absent)', { skip: graphifyInstalled() ? false : 'graphify not installed' }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'gfx-int-'));
  writeFileSync(join(dir, 'app.js'), 'export function login(user){ return session(user); }\nfunction session(u){ return u; }\n');
  // build the graph in the fixture dir
  execFileSync('graphify', ['update', '.'], { cwd: dir, timeout: 120000, stdio: 'ignore' });
  const graphPath = join(dir, 'graphify-out', 'graph.json');
  assert.ok(existsSync(graphPath), 'graph.json should be produced');

  resetCapabilityCache();
  const r = recall('login', { graphPath });
  assert.equal(r.provider, 'graphify');
  assert.ok(Array.isArray(r.hits));
});
