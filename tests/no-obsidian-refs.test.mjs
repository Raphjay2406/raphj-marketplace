// tests/no-obsidian-refs.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { globby } from 'globby';
import { existsSync } from 'node:fs';

test('.mcp.json declares no obsidian servers', () => {
  const mcp = JSON.parse(readFileSync('.mcp.json', 'utf8'));
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

test('no obsidian references anywhere in the runtime surface', async () => {
  const files = await globby([
    '.mcp.json',
    '.claude-plugin/hooks/*.mjs', '.claude-plugin/hooks/*.sh',
    'commands/**/*.md', 'skills/**/*.md', 'agents/**/*.md', 'CLAUDE.md',
  ]);
  const offenders = files.filter(f => /obsidian/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `obsidian refs remain in: ${offenders.join(', ')}`);
});

test('no deleted vault config keys remain in the runtime surface', async () => {
  const files = await globby(['commands/**/*.md', 'skills/**/*.md', '.claude-plugin/hooks/*.mjs', 'CLAUDE.md']);
  const offenders = files.filter(f => /vault_path|vault_sync|obsidian_installed|vault\/lessons/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `deleted vault-config refs remain in: ${offenders.join(', ')}`);
});
