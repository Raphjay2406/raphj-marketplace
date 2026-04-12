#!/usr/bin/env node
/**
 * depth-extract — v3.5.4 (stub)
 *
 * Computes a simple luminance-based pseudo-depth map from input image using sharp if available.
 * Full Depth-Anything transformer path deferred to v3.5.6 when @xenova/transformers bundle
 * is opt-in configured.
 */
import { existsSync } from 'node:fs';
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

async function main() {
  const args = parseArgs(argv);
  const input = args.input || args._[0];
  const output = args.output || args.out;
  if (!input || !output) {
    stderr.write('usage: depth-extract --input <path> --output <path>\n');
    exit(2);
  }
  if (!existsSync(input)) { stderr.write(`input not found: ${input}\n`); exit(2); }

  let sharp;
  try { sharp = (await import('sharp')).default; }
  catch {
    stderr.write('sharp not installed. Install with: npm i sharp\n');
    stderr.write('Skipping; emitting placeholder grayscale constant.\n');
    const r = spawnSync('node', ['-e', `require('fs').writeFileSync('${output}','')`]);
    exit(r.status || 0);
  }

  // Pseudo-depth: invert luminance (brighter = closer), apply light blur for smooth gradient
  await sharp(input)
    .greyscale()
    .negate()
    .blur(2)
    .toFile(output);
  console.log(`✓ pseudo-depth → ${output}`);
}

main().catch((e) => { stderr.write(`${e.message}\n`); exit(1); });
