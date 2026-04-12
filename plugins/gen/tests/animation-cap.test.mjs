import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SKILL = join(ROOT, 'skills/animation-orchestration/SKILL.md');

test('animation-orchestration word count ≤ 2500', () => {
  const raw = readFileSync(SKILL, 'utf8');
  const words = raw.split(/\s+/).filter(Boolean).length;
  assert.ok(words <= 2500, `word count ${words} exceeds 2500`);
});

test('animation-orchestration declares injection_regex frontmatter', () => {
  const raw = readFileSync(SKILL, 'utf8').replace(/\r\n/g, '\n');
  assert.match(raw, /^injection_regex:\s*["']?\/.+\/[a-z]*["']?\s*$/m);
});

test('animation-orchestration does not define motion tokens', () => {
  const raw = readFileSync(SKILL, 'utf8');
  const badDef = raw.match(/^\s*--motion-(duration|ease)-\w+:\s*\S/m);
  assert.equal(badDef, null, `found motion token definition: ${badDef?.[0]}`);
});
