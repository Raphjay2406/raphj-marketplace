import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';

test('self-audit dry-run exits clean (no BLOCK findings)', () => {
  try {
    const out = execSync('node scripts/self-audit.mjs --fail-on=BLOCK', {
      cwd: process.cwd(),
      stdio: 'pipe',
      encoding: 'utf8',
    });
    assert.doesNotMatch(out, /BLOCK=[1-9]/, 'self-audit reported BLOCK findings');
  } catch (e) {
    assert.fail(`self-audit failed with exit ${e.status}:\n${e.stdout || e.message}`);
  }
});
