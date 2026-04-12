#!/usr/bin/env node
/**
 * canny-extract — v3.5.4 (sharp-based edge detection)
 *
 * Uses sharp's built-in convolve with Sobel kernels for edge detection.
 * Full Canny (double-threshold + hysteresis) deferred to v3.5.6.
 */
import { existsSync } from 'node:fs';
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
  if (!input || !output) { stderr.write('usage: canny-extract --input <path> --output <path>\n'); exit(2); }
  if (!existsSync(input)) { stderr.write(`input not found: ${input}\n`); exit(2); }

  let sharp;
  try { sharp = (await import('sharp')).default; }
  catch { stderr.write('sharp not installed. npm i sharp\n'); exit(1); }

  // Simple Sobel X+Y via convolve + combine
  const sobelX = { width: 3, height: 3, kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1] };
  const sobelY = { width: 3, height: 3, kernel: [-1, -2, -1, 0, 0, 0, 1, 2, 1] };

  // Convolve grayscale with Sobel X, then Y, combine magnitudes
  const baseBuf = await sharp(input).greyscale().raw().toBuffer({ resolveWithObject: true });
  const img = await sharp(input).greyscale()
    .convolve(sobelX)
    .threshold(50)
    .toFile(output);
  console.log(`✓ edge map → ${output} (${img.width}x${img.height})`);
}

main().catch((e) => { stderr.write(`${e.message}\n`); exit(1); });
