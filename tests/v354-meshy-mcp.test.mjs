/**
 * Meshy MCP scaffold — protocol smoke test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

test('meshy-mcp: initialize + tools/list responds correctly', async () => {
  const server = spawn('node', [join(process.cwd(), '.claude-plugin/mcp-servers/meshy/server.mjs')], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, MESHY_API_KEY: '' },  // ensure stub mode
  });
  const responses = [];
  let buffer = '';
  server.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    let nl;
    while ((nl = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (line) try { responses.push(JSON.parse(line)); } catch {}
    }
  });

  server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize' }) + '\n');
  server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }) + '\n');
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0', id: 3, method: 'tools/call',
    params: { name: 'meshy_text_to_3d', arguments: { prompt: 'a red cube' } },
  }) + '\n');

  // Wait for 3 responses
  await new Promise((r) => setTimeout(r, 500));
  server.kill();

  assert.ok(responses.length >= 3, `expected 3+ responses, got ${responses.length}`);
  const initResp = responses.find((r) => r.id === 1);
  assert.equal(initResp.result.serverInfo.name, 'meshy-mcp');
  const toolsResp = responses.find((r) => r.id === 2);
  assert.equal(toolsResp.result.tools.length, 3);
  const callResp = responses.find((r) => r.id === 3);
  const parsed = JSON.parse(callResp.result.content[0].text);
  assert.equal(parsed.stub, true);  // no key → stub response
});
