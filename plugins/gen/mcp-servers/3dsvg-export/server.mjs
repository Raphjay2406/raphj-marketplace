#!/usr/bin/env node
/**
 * 3dsvg-export MCP Server — stdio protocol
 *
 * Exposes 3 tools: render_preset, render_batch, render_video.
 * Implementation delegates to render.mjs which uses Playwright + the 3dsvg
 * package's registerCanvas prop to capture the WebGL canvas headlessly.
 *
 * Security: Playwright launched with network access disabled; user-provided
 * text/svg inputs sanitized via svgo before passing to 3dsvg.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read stdin JSON-RPC-ish messages line by line
const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', async () => {
  const input = Buffer.concat(chunks).toString('utf8').trim();
  if (!input) {
    printManifest();
    return;
  }

  try {
    const msg = JSON.parse(input);
    await handle(msg);
  } catch (err) {
    respond({ error: { code: -32700, message: `Parse error: ${err.message}` } });
  }
});

function respond(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function printManifest() {
  // Called with no input — print tool manifest
  respond({
    name: '3dsvg-export',
    version: '1.0.0',
    tools: [
      {
        name: 'render_preset',
        description: 'Render a single 3dsvg preset to PNG. Returns path + size.',
        inputSchema: {
          type: 'object',
          required: ['preset_id', 'output_dir'],
          properties: {
            preset_id:   { type: 'string' },
            override:    { type: 'object' },
            output_dir:  { type: 'string' },
            width:       { type: 'integer', default: 3840 },
            height:      { type: 'integer', default: 2160 }
          }
        }
      },
      {
        name: 'render_batch',
        description: 'Render 5 materials × 3 angles × 2 breakpoints matrix.',
        inputSchema: {
          type: 'object',
          required: ['archetype', 'beat', 'brand_name', 'output_dir'],
          properties: {
            archetype:    { type: 'string' },
            beat:         { enum: ['HOOK','PEAK','CLOSE'] },
            brand_name:   { type: 'string' },
            materials:    { type: 'array', items: { type: 'string' } },
            angles:       { type: 'array', items: { type: 'number' } },
            breakpoints:  { type: 'array', items: { type: 'integer' } },
            output_dir:   { type: 'string' }
          }
        }
      },
      {
        name: 'render_video',
        description: 'Render preset to MP4 via Playwright + FFmpeg.',
        inputSchema: {
          type: 'object',
          required: ['preset_id', 'output_path'],
          properties: {
            preset_id:    { type: 'string' },
            override:     { type: 'object' },
            duration_s:   { type: 'number', default: 4 },
            fps:          { type: 'integer', default: 60 },
            width:        { type: 'integer', default: 1920 },
            height:       { type: 'integer', default: 1080 },
            output_path:  { type: 'string' }
          }
        }
      }
    ]
  });
}

async function handle(msg) {
  const { method, params = {} } = msg;

  try {
    if (method === 'render_preset') {
      const { renderPreset } = await loadRenderer();
      const result = await renderPreset(params);
      respond({ result });
    } else if (method === 'render_batch') {
      const { renderBatch } = await loadRenderer();
      const result = await renderBatch(params);
      respond({ result });
    } else if (method === 'render_video') {
      const { renderVideo } = await loadRenderer();
      const result = await renderVideo(params);
      respond({ result });
    } else {
      respond({ error: { code: -32601, message: `Method not found: ${method}` } });
    }
  } catch (err) {
    respond({ error: { code: -32000, message: err.message, data: { stack: err.stack } } });
  }
}

async function loadRenderer() {
  try {
    return await import('./render.mjs');
  } catch (err) {
    throw new Error(
      `Failed to load renderer: ${err.message}\n` +
      `Ensure playwright is installed: npm i -g playwright && npx playwright install chromium`
    );
  }
}
