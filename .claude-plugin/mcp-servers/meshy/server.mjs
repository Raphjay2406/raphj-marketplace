#!/usr/bin/env node
/**
 * meshy-mcp — v3.5.4 scaffold
 *
 * Minimal stdio MCP server for Meshy v4. Implements:
 *   - initialize
 *   - tools/list
 *   - tools/call (text_to_3d, image_to_3d, check_status)
 *
 * For v3.5.4 this is a SCAFFOLD — API calls return stub responses when MESHY_API_KEY is
 * missing, so callers see consistent shape. Full implementation in v3.5.6 once test
 * budget for external calls is allocated.
 */
import { stdin, stdout, stderr, exit, env } from 'node:process';

const TOOLS = [
  {
    name: 'meshy_text_to_3d',
    description: 'Submit a text prompt to Meshy v4 for text-to-3D generation. Returns a job ID; poll with meshy_check_status.',
    inputSchema: {
      type: 'object',
      required: ['prompt'],
      properties: {
        prompt: { type: 'string', description: 'Text description of the object to generate' },
        art_style: { type: 'string', enum: ['realistic', 'sculpture'], default: 'realistic' },
        topology: { type: 'string', enum: ['triangle', 'quad'], default: 'triangle' },
        target_polycount: { type: 'integer', default: 30000 },
        seed: { type: 'integer' },
      },
    },
  },
  {
    name: 'meshy_image_to_3d',
    description: 'Submit an image URL for image-to-3D generation. Returns a job ID.',
    inputSchema: {
      type: 'object',
      required: ['image_url'],
      properties: {
        image_url: { type: 'string', description: 'Publicly-accessible image URL' },
        ai_model: { type: 'string', enum: ['meshy-4'], default: 'meshy-4' },
        texture_richness: { type: 'string', enum: ['high', 'medium', 'low'], default: 'medium' },
      },
    },
  },
  {
    name: 'meshy_check_status',
    description: 'Poll status for a previously-submitted job. Returns status + result URL when complete.',
    inputSchema: {
      type: 'object',
      required: ['job_id'],
      properties: {
        job_id: { type: 'string' },
      },
    },
  },
];

const HAS_KEY = !!env.MESHY_API_KEY;

function respond(id, result) {
  stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}
function error(id, code, message) {
  stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n');
}

async function handleInitialize(id) {
  respond(id, {
    protocolVersion: '2024-11-05',
    capabilities: { tools: {} },
    serverInfo: { name: 'meshy-mcp', version: '0.1.0' },
  });
}

async function handleListTools(id) {
  respond(id, { tools: TOOLS });
}

async function handleCallTool(id, params) {
  const { name, arguments: args = {} } = params;

  if (!HAS_KEY) {
    // Scaffold mode — return structured stub response so pipelines don't crash.
    respond(id, {
      content: [{
        type: 'text',
        text: JSON.stringify({
          stub: true,
          message: 'MESHY_API_KEY not set; returning stub. Set env var to enable real Meshy calls.',
          tool: name,
          arguments: args,
        }, null, 2),
      }],
    });
    return;
  }

  // Real API path — v3.5.6 will flesh out. For v3.5.4: minimal async submit.
  try {
    if (name === 'meshy_text_to_3d') {
      const r = await fetch('https://api.meshy.ai/v2/text-to-3d', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.MESHY_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'preview',
          prompt: args.prompt,
          art_style: args.art_style || 'realistic',
          seed: args.seed,
        }),
      });
      const data = await r.json();
      respond(id, { content: [{ type: 'text', text: JSON.stringify(data) }] });
    } else if (name === 'meshy_check_status') {
      const r = await fetch(`https://api.meshy.ai/v2/text-to-3d/${args.job_id}`, {
        headers: { 'Authorization': `Bearer ${env.MESHY_API_KEY}` },
      });
      const data = await r.json();
      respond(id, { content: [{ type: 'text', text: JSON.stringify(data) }] });
    } else if (name === 'meshy_image_to_3d') {
      const r = await fetch('https://api.meshy.ai/v1/image-to-3d', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.MESHY_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: args.image_url, ai_model: args.ai_model || 'meshy-4' }),
      });
      const data = await r.json();
      respond(id, { content: [{ type: 'text', text: JSON.stringify(data) }] });
    } else {
      error(id, -32601, `Unknown tool: ${name}`);
    }
  } catch (e) {
    error(id, -32000, `Meshy API error: ${e.message}`);
  }
}

// stdio JSON-RPC loop
let buffer = '';
stdin.setEncoding('utf8');
stdin.on('data', async (chunk) => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    try {
      const msg = JSON.parse(line);
      const { id, method, params } = msg;
      if (method === 'initialize') await handleInitialize(id);
      else if (method === 'tools/list') await handleListTools(id);
      else if (method === 'tools/call') await handleCallTool(id, params);
      else if (method === 'notifications/initialized') { /* no-op */ }
      else error(id, -32601, `Unknown method: ${method}`);
    } catch (e) {
      stderr.write(`parse error: ${e.message}\n`);
    }
  }
});

stdin.on('end', () => exit(0));
