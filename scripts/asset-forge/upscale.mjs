#!/usr/bin/env node
/**
 * upscale — v3.5.4
 *
 * Upscale via Real-ESRGAN local binary if available; otherwise log guidance.
 * API path (Replicate SUPIR) deferred to v3.5.6 with REPLICATE_API_TOKEN wiring.
 */
import { existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { argv, exit, stderr } from 'node:process';

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) {
      const v = argv[i + 1];
      if (v && !v.startsWith('--')) { a[k.slice(2)] = v; i++; } else a[k.slice(2)] = true;
    } else a._.push(k);
  }
  return a;
}

function hasBin(name) {
  const r = spawnSync(process.platform === 'win32' ? 'where' : 'which', [name], { encoding: 'utf8' });
  return r.status === 0 && (r.stdout || '').trim().length > 0;
}

const args = parseArgs(argv);
const input = args.input || args._[0];
const output = args.output || args.out;
const scale = Number(args.scale || 4);

if (!input || !output) {
  stderr.write('usage: upscale --input <path> --output <path> [--scale 2|4]\n');
  exit(2);
}
if (!existsSync(input)) { stderr.write(`input not found: ${input}\n`); exit(2); }

const binary = 'realesrgan-ncnn-vulkan';
if (!hasBin(binary)) {
  stderr.write(`${binary} not on PATH. Install from https://github.com/xinntao/Real-ESRGAN/releases or skip upscaling.\n`);
  stderr.write(`Falling back: copying input as-is.\n`);
  const r = spawnSync('node', ['-e', `require('fs').copyFileSync('${input}','${output}')`]);
  exit(r.status || 0);
}

const r = spawnSync(binary, ['-i', input, '-o', output, '-s', String(scale), '-n', 'realesrgan-x4plus'], { stdio: 'inherit' });
if (r.status !== 0) { stderr.write(`upscale failed with code ${r.status}\n`); exit(r.status || 1); }

const before = existsSync(input) ? statSync(input).size : 0;
const after = existsSync(output) ? statSync(output).size : 0;
console.log(`✓ upscaled ${before}B → ${after}B (scale ${scale}x)`);
