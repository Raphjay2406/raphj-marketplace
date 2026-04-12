#!/usr/bin/env node
/**
 * svg-parametric — v3.5.0 Asset Forge procedural 2D generators
 *
 * Deterministic SVG asset generation. DNA-tokenized, archetype-aware.
 * Works fully offline; no MCP dependency. First-class fallback for /gen:assets 2d.
 *
 * Generators:
 *   - blob        — organic blob shape (Brutalist/Ethereal/Playful sweet spot)
 *   - mesh-gradient — multi-stop radial mesh gradient
 *   - voronoi     — voronoi tessellation (Editorial/Data-Dense)
 *   - noise-field — Perlin-like noise contour
 *   - flow-field  — vector flow field trails
 *
 * Usage:
 *   node scripts/asset-forge/svg-parametric.mjs <generator> [options]
 *
 * Example:
 *   node scripts/asset-forge/svg-parametric.mjs blob --seed 42 --color "#0ea5e9" --size 800 --out public/assets/svg/hero-blob.svg
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { argv, exit, stderr } from 'node:process';

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { args[key] = next; i++; }
      else args[key] = true;
    } else args._.push(a);
  }
  return args;
}

// --- Deterministic RNG (mulberry32) ---
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Hex → HSL for color variation ---
function hexToHsl(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hue = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hue = (b - r) / d + 2; break;
      case b: hue = (r - g) / d + 4; break;
    }
    hue /= 6;
  }
  return { h: hue * 360, s: s * 100, l: l * 100 };
}
const hsl = (h, s, l, a = 1) => `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}% / ${a})`;

// --- Generators ---

function gen_blob({ seed, size, color }) {
  const rnd = mulberry32(seed);
  const cx = size / 2, cy = size / 2;
  const points = 8;
  const baseR = size * 0.35;
  const vary = size * 0.15;

  const angles = [];
  for (let i = 0; i < points; i++) {
    angles.push({
      angle: (i / points) * Math.PI * 2,
      radius: baseR + (rnd() * 2 - 1) * vary,
    });
  }

  const coords = angles.map(({ angle, radius }) => ({
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  }));

  // Smooth closed path via Catmull-Rom
  let d = `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)} `;
  for (let i = 0; i < coords.length; i++) {
    const p0 = coords[(i - 1 + coords.length) % coords.length];
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    const p3 = coords[(i + 2) % coords.length];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
  }
  d += 'Z';

  const { h, s, l } = hexToHsl(color);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" data-genorah-kind="2d/blob" data-genorah-seed="${seed}">
  <defs>
    <radialGradient id="g" cx="40%" cy="35%">
      <stop offset="0%" stop-color="${hsl(h, s, Math.min(95, l + 15))}" />
      <stop offset="100%" stop-color="${color}" />
    </radialGradient>
  </defs>
  <path d="${d}" fill="url(#g)" />
</svg>`;
}

function gen_meshGradient({ seed, size, color, color2 }) {
  const rnd = mulberry32(seed);
  const stops = [];
  const count = 5;
  for (let i = 0; i < count; i++) {
    stops.push({
      cx: rnd() * 100,
      cy: rnd() * 100,
      r: 40 + rnd() * 40,
      color: i % 2 === 0 ? color : (color2 || color),
      opacity: 0.6 + rnd() * 0.3,
    });
  }

  const layers = stops.map((s, i) => {
    const { h, sat, l } = { h: 200, sat: 70, l: 60 };
    return `<circle cx="${s.cx}%" cy="${s.cy}%" r="${s.r}%" fill="${s.color}" fill-opacity="${s.opacity.toFixed(2)}" filter="url(#blur)" />`;
  }).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" data-genorah-kind="2d/mesh-gradient" data-genorah-seed="${seed}">
  <defs>
    <filter id="blur"><feGaussianBlur stdDeviation="15" /></filter>
  </defs>
  <rect width="100" height="100" fill="${color}" fill-opacity="0.4" />
  ${layers}
</svg>`;
}

function gen_voronoi({ seed, size, color, color2, cellCount = 24 }) {
  const rnd = mulberry32(seed);
  const sites = [];
  for (let i = 0; i < cellCount; i++) {
    sites.push({ x: rnd() * size, y: rnd() * size, c: rnd() > 0.5 ? color : (color2 || color) });
  }

  // Crude voronoi: sample grid, find nearest site, emit rects
  // Cheaper than true voronoi and still visually useful as texture
  const cellSize = Math.max(4, size / 100);
  const cells = [];
  for (let y = 0; y < size; y += cellSize) {
    for (let x = 0; x < size; x += cellSize) {
      let minD = Infinity, nearest = null;
      for (const s of sites) {
        const d = (s.x - x) ** 2 + (s.y - y) ** 2;
        if (d < minD) { minD = d; nearest = s; }
      }
      cells.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${nearest.c}" />`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" data-genorah-kind="2d/voronoi" data-genorah-seed="${seed}">
  ${cells.join('')}
</svg>`;
}

function gen_noiseField({ seed, size, color }) {
  const rnd = mulberry32(seed);
  // Value noise via lattice
  const grid = 16;
  const step = size / grid;
  const values = [];
  for (let i = 0; i <= grid; i++) {
    const row = [];
    for (let j = 0; j <= grid; j++) row.push(rnd());
    values.push(row);
  }

  const cells = [];
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const v = (values[i][j] + values[i][j + 1] + values[i + 1][j] + values[i + 1][j + 1]) / 4;
      const alpha = v.toFixed(2);
      cells.push(`<rect x="${j * step}" y="${i * step}" width="${step}" height="${step}" fill="${color}" fill-opacity="${alpha}" />`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" data-genorah-kind="2d/noise-field" data-genorah-seed="${seed}">
  ${cells.join('')}
</svg>`;
}

function gen_flowField({ seed, size, color }) {
  const rnd = mulberry32(seed);
  const trailCount = 80;
  const steps = 60;
  const trails = [];
  for (let t = 0; t < trailCount; t++) {
    let x = rnd() * size, y = rnd() * size;
    const pts = [`M ${x.toFixed(1)} ${y.toFixed(1)}`];
    for (let s = 0; s < steps; s++) {
      const angle = (Math.sin(x * 0.01) + Math.cos(y * 0.01)) * Math.PI;
      x += Math.cos(angle) * 4;
      y += Math.sin(angle) * 4;
      if (x < 0 || x > size || y < 0 || y > size) break;
      pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    trails.push(`<path d="${pts.join(' ')}" fill="none" stroke="${color}" stroke-opacity="0.35" stroke-width="1" />`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" data-genorah-kind="2d/flow-field" data-genorah-seed="${seed}">
  ${trails.join('\n  ')}
</svg>`;
}

// --- CLI ---

const GENERATORS = { blob: gen_blob, 'mesh-gradient': gen_meshGradient, voronoi: gen_voronoi, 'noise-field': gen_noiseField, 'flow-field': gen_flowField };

const args = parseArgs(argv);
const gen = args._[0];

if (!gen || !GENERATORS[gen]) {
  stderr.write(`usage: svg-parametric <generator> [--seed N] [--size 800] [--color "#hex"] [--color2 "#hex"] [--out path]\n`);
  stderr.write(`generators: ${Object.keys(GENERATORS).join(', ')}\n`);
  exit(2);
}

const seed = Number(args.seed || 42);
const size = Number(args.size || 800);
const color = args.color || '#0ea5e9';
const color2 = args.color2;
const out = args.out;

const svg = GENERATORS[gen]({ seed, size, color, color2 });

if (out) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, svg, 'utf8');
  console.log(`✓ ${gen} written to ${out} (seed=${seed}, size=${size})`);
} else {
  process.stdout.write(svg);
}
