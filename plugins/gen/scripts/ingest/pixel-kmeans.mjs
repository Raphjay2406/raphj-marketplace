#!/usr/bin/env node
// v3.22 pixel k-means — extract dominant colors from breakpoint screenshots.
// Uses PNG.js via pure-Node 'pngjs' if available; else reports actionable gap.
// Output feeds dna-extract.mjs pixel path with 12 semantic slots assigned by role.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { append } from './preservation-ledger.mjs';

async function loadPng() { try { return (await import('pngjs')).PNG; } catch { return null; } }

// sRGB [0,255] → linear sRGB
function srgbToLinear(v) { const x = v / 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }

// sRGB → XYZ (D65)
function rgbToXyz([r, g, b]) {
  const R = srgbToLinear(r), G = srgbToLinear(g), B = srgbToLinear(b);
  return [
    (R * 0.4124564 + G * 0.3575761 + B * 0.1804375) * 100,
    (R * 0.2126729 + G * 0.7151522 + B * 0.0721750) * 100,
    (R * 0.0193339 + G * 0.1191920 + B * 0.9503041) * 100,
  ];
}

// XYZ → CIELAB (D65 reference white)
function xyzToLab([x, y, z]) {
  const Xn = 95.047, Yn = 100.000, Zn = 108.883;
  const f = t => (t > 0.008856) ? Math.cbrt(t) : (7.787 * t + 16 / 116);
  const fx = f(x / Xn), fy = f(y / Yn), fz = f(z / Zn);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function rgbToLab(rgb) { return xyzToLab(rgbToXyz(rgb)); }

// CIEDE2000 — full implementation per Sharma, Wu, Dalal (2005).
function deltaE2000(rgbA, rgbB) {
  const [L1, a1, b1] = rgbToLab(rgbA);
  const [L2, a2, b2] = rgbToLab(rgbB);
  const kL = 1, kC = 1, kH = 1;

  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cbar = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cbar, 7) / (Math.pow(Cbar, 7) + Math.pow(25, 7))));

  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);

  const hp = (ap, b) => {
    if (ap === 0 && b === 0) return 0;
    let h = Math.atan2(b, ap) * 180 / Math.PI;
    return h < 0 ? h + 360 : h;
  };
  const h1p = hp(a1p, b1);
  const h2p = hp(a2p, b2);

  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp;
  if (C1p * C2p === 0) dhp = 0;
  else if (Math.abs(h2p - h1p) <= 180) dhp = h2p - h1p;
  else if (h2p - h1p > 180) dhp = h2p - h1p - 360;
  else dhp = h2p - h1p + 360;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp / 2 * Math.PI / 180);

  const Lbarp = (L1 + L2) / 2;
  const Cbarp = (C1p + C2p) / 2;
  let hbarp;
  if (C1p * C2p === 0) hbarp = h1p + h2p;
  else if (Math.abs(h1p - h2p) <= 180) hbarp = (h1p + h2p) / 2;
  else if (h1p + h2p < 360) hbarp = (h1p + h2p + 360) / 2;
  else hbarp = (h1p + h2p - 360) / 2;

  const T = 1
    - 0.17 * Math.cos((hbarp - 30) * Math.PI / 180)
    + 0.24 * Math.cos((2 * hbarp) * Math.PI / 180)
    + 0.32 * Math.cos((3 * hbarp + 6) * Math.PI / 180)
    - 0.20 * Math.cos((4 * hbarp - 63) * Math.PI / 180);

  const dTheta = 30 * Math.exp(-Math.pow((hbarp - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(Cbarp, 7) / (Math.pow(Cbarp, 7) + Math.pow(25, 7)));
  const SL = 1 + (0.015 * Math.pow(Lbarp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbarp - 50, 2));
  const SC = 1 + 0.045 * Cbarp;
  const SH = 1 + 0.015 * Cbarp * T;
  const RT = -Math.sin(2 * dTheta * Math.PI / 180) * RC;

  return Math.sqrt(
    Math.pow(dLp / (kL * SL), 2) +
    Math.pow(dCp / (kC * SC), 2) +
    Math.pow(dHp / (kH * SH), 2) +
    RT * (dCp / (kC * SC)) * (dHp / (kH * SH))
  );
}

// Default distance: ΔE2000 (perceptual). Use GENORAH_KMEANS_FAST=1 to switch to rMean approximation.
function rMeanDist(a, b) {
  const rMean = (a[0] + b[0]) / 2;
  const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
  return Math.sqrt((2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db);
}
const dist = process.env.GENORAH_KMEANS_FAST ? rMeanDist : deltaE2000;

function kmeans(samples, k = 12, iter = 20) {
  if (samples.length === 0) return [];
  // Init: pick k samples evenly spaced by frequency
  const step = Math.floor(samples.length / k) || 1;
  let centroids = Array.from({ length: k }, (_, i) => samples[Math.min(i * step, samples.length - 1)]);
  const buckets = Array.from({ length: k }, () => []);
  for (let it = 0; it < iter; it++) {
    buckets.forEach(b => b.length = 0);
    for (const s of samples) {
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < k; i++) { const d = dist(s, centroids[i]); if (d < bestDist) { bestDist = d; best = i; } }
      buckets[best].push(s);
    }
    for (let i = 0; i < k; i++) {
      const b = buckets[i];
      if (b.length === 0) continue;
      centroids[i] = [
        Math.round(b.reduce((s, p) => s + p[0], 0) / b.length),
        Math.round(b.reduce((s, p) => s + p[1], 0) / b.length),
        Math.round(b.reduce((s, p) => s + p[2], 0) / b.length),
      ];
    }
  }
  return centroids.map((c, i) => ({ rgb: c, hex: `#${c.map(x => x.toString(16).padStart(2, '0')).join('')}`, count: buckets[i].length }));
}

function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function assignSlots(clusters) {
  const sorted = [...clusters].sort((a, b) => b.count - a.count);
  const result = {};
  // bg: most frequent extreme luminance; text: opposite extreme; surface: second-most-frequent near bg
  const byLum = [...sorted].sort((a, b) => luminance(a.rgb) - luminance(b.rgb));
  result.bg = sorted[0];
  result.text = luminance(sorted[0].rgb) > 0.5 ? byLum[0] : byLum[byLum.length - 1];
  result.surface = sorted[1] || sorted[0];
  result.border = sorted[2] || sorted[0];
  // primary: most chromatic (highest saturation) cluster
  const saturation = c => { const [r, g, b] = c.rgb; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx === 0 ? 0 : (mx - mn) / mx; };
  const bySat = [...clusters].sort((a, b) => saturation(b) - saturation(a));
  result.primary = bySat[0];
  result.secondary = bySat[1] || bySat[0];
  result.accent = bySat[2] || bySat[0];
  result.muted = byLum[Math.floor(byLum.length / 2)];
  // glow/tension/highlight/signature — reuse top-saturation; user can reassign
  result.glow = bySat[0];
  result.tension = bySat[3] || bySat[0];
  result.highlight = bySat[4] || bySat[0];
  result.signature = bySat[0];
  return result;
}

async function main() {
  const slug = process.argv[2];
  if (!slug) { console.error('Usage: pixel-kmeans.mjs <slug>'); process.exit(1); }
  const dest = join(process.cwd(), '.planning', 'genorah', 'ingested', slug);
  const shotsDir = join(dest, 'screenshots');
  if (!existsSync(shotsDir)) { console.error(`No screenshots/ — run crawl-executor first.`); process.exit(1); }

  const PNG = await loadPng();
  if (!PNG) {
    append(slug, { kind: 'gap', reason: 'pngjs-unavailable', remedy: 'npm i pngjs (peer dep), then re-run pixel-kmeans' });
    console.error('pngjs not installed. Gap recorded.');
    process.exit(2);
  }

  // Gather all PNGs; sample every Nth pixel for speed (stride = 10 → ~1% sampling)
  const samples = [];
  function walkShots(dir) {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, name.name);
      if (name.isDirectory()) walkShots(full);
      else if (name.name.endsWith('.png')) {
        const png = PNG.sync.read(readFileSync(full));
        for (let y = 0; y < png.height; y += 10) {
          for (let x = 0; x < png.width; x += 10) {
            const idx = (y * png.width + x) * 4;
            samples.push([png.data[idx], png.data[idx + 1], png.data[idx + 2]]);
          }
        }
      }
    }
  }
  walkShots(shotsDir);

  if (samples.length < 100) { console.error('Too few pixels; ensure screenshots are present.'); process.exit(1); }

  const clusters = kmeans(samples, 12);
  const slots = assignSlots(clusters);

  for (const [slot, cluster] of Object.entries(slots)) {
    const total = samples.length;
    const coverage = cluster.count / total;
    const confidence = Math.min(0.95, 0.5 + coverage * 5);
    append(slug, { kind: 'dna.extract', token: `color.${slot}`, value: cluster.hex, confidence, method: 'pixel-kmeans', evidence: `coverage=${coverage.toFixed(3)}` });
    if (confidence < 0.5) append(slug, { kind: 'gap', reason: 'dna-low-confidence', token: `color.${slot}` });
  }

  const md = [
    `# DNA Extracted (pixel-kmeans) — ${slug}`,
    ``,
    `Samples: ${samples.length}. Clusters: 12.`,
    ``,
    `## Colors`,
    ``,
    ...Object.entries(slots).map(([slot, c]) => `- **${slot}**: \`${c.hex}\` (coverage ${(c.count / samples.length * 100).toFixed(1)}%)`),
  ].join('\n');
  writeFileSync(join(dest, 'DNA-EXTRACTED.md'), md);
  console.log(`Pixel k-means extracted 12 slots → ${dest}/DNA-EXTRACTED.md`);
}

main();
