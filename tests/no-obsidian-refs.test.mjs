// tests/no-obsidian-refs.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { globby } from 'globby';
import { existsSync } from 'node:fs';

test('.mcp.json declares no obsidian servers', () => {
  const mcp = JSON.parse(readFileSync('.claude-plugin/.mcp.json', 'utf8'));
  assert.ok(!('obsidian' in mcp), 'obsidian entry must be removed');
  assert.ok(!('obsidian-fs' in mcp), 'obsidian-fs entry must be removed');
  // the other servers survive
  assert.ok('gpt-image' in mcp && 'graphify' in mcp, 'non-obsidian servers must remain');
});

test('obsidian-integration skill is deleted', () => {
  assert.equal(existsSync('skills/obsidian-integration/SKILL.md'), false);
});

test('memory skills carry no obsidian references', async () => {
  const files = await globby([
    'skills/cross-project-kb/SKILL.md',
    'skills/sqlite-vec-memory-graph/SKILL.md',
    'skills/context-fabric-ledger/SKILL.md',
    'skills/quality-learning/SKILL.md',
  ]);
  const offenders = files.filter(f => /obsidian/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `obsidian refs remain in: ${offenders.join(', ')}`);
});

test('session hooks carry no obsidian references', async () => {
  const files = await globby(['.claude-plugin/hooks/*.mjs', '.claude-plugin/hooks/*.sh']);
  const offenders = files.filter(f => /obsidian/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `obsidian refs remain in hooks: ${offenders.join(', ')}`);
});

test('commands carry no obsidian references', async () => {
  const files = await globby(['commands/**/*.md']);
  const offenders = files.filter(f => /obsidian/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `obsidian refs remain in commands: ${offenders.join(', ')}`);
});

test('sync-knowledge documents graphify sync', () => {
  const t = readFileSync('commands/sync-knowledge.md', 'utf8');
  assert.match(t, /graphify/i);
  assert.match(t, /merge-graphs|gen:graphify/);
});
