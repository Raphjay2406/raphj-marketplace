// tests/no-dead-mcp-refs.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { globby } from 'globby';
import { readFileSync } from 'fs';

test('no agent references the removed nano-banana MCP tools', async () => {
  const files = await globby(['agents/**/*.md', 'plugins/gen/agents/**/*.md']);
  const offenders = files.filter(f => /mcp__nano-banana__/.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, [], `dead nano-banana refs in: ${offenders.join(', ')}`);
});
