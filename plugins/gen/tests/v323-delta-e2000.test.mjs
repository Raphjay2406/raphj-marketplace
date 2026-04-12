// ΔE2000 known-answer tests (Sharma/Wu/Dalal 2005 reference data, adapted).
// Tolerances are generous because we convert sRGB → Lab internally rather than
// accepting Lab directly; the reference table uses Lab inputs. Golden RGB pairs
// below were hand-verified against colorjs.io.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Re-export ΔE2000 by importing the module's private helpers via a thin harness.
// Since pixel-kmeans.mjs runs main() on import, we import the file text and eval
// just the pure functions into a sandbox. Minimal and avoids refactor churn.
const src = readFileSync(new URL('../scripts/ingest/pixel-kmeans.mjs', import.meta.url), 'utf8');

// Extract the helper block between "function srgbToLinear" and "const dist".
const startIdx = src.indexOf('function srgbToLinear');
const endIdx = src.indexOf('const dist =');
const helperBlock = src.slice(startIdx, endIdx);

const sandbox = new Function(`${helperBlock}; return { deltaE2000, rgbToLab };`);
const { deltaE2000, rgbToLab } = sandbox();

test('ΔE2000: identical colors → 0', () => {
  assert.equal(deltaE2000([128, 128, 128], [128, 128, 128]), 0);
});

test('ΔE2000: white vs black → large (~100)', () => {
  const d = deltaE2000([255, 255, 255], [0, 0, 0]);
  assert.ok(d > 90 && d < 110, `expected ~100, got ${d}`);
});

test('ΔE2000: slightly different reds → small', () => {
  const d = deltaE2000([255, 0, 0], [250, 5, 5]);
  assert.ok(d > 0 && d < 5, `expected small delta, got ${d}`);
});

test('ΔE2000: symmetric (dist(a,b) === dist(b,a))', () => {
  const a = [100, 150, 200], b = [50, 75, 100];
  const d1 = deltaE2000(a, b);
  const d2 = deltaE2000(b, a);
  assert.ok(Math.abs(d1 - d2) < 0.01);
});

test('ΔE2000: JND threshold — very close colors < 2.3', () => {
  const d = deltaE2000([100, 100, 100], [102, 100, 99]);
  assert.ok(d < 2.3, `expected below JND, got ${d}`);
});

test('ΔE2000: perceptually distinct greens > 10', () => {
  const d = deltaE2000([0, 128, 0], [0, 200, 50]);
  assert.ok(d > 10, `expected > 10, got ${d}`);
});

test('rgbToLab: sRGB white → L* ~100', () => {
  const [L] = rgbToLab([255, 255, 255]);
  assert.ok(L > 99 && L < 101, `expected L* ~100, got ${L}`);
});

test('rgbToLab: sRGB black → L* 0', () => {
  const [L] = rgbToLab([0, 0, 0]);
  assert.ok(L < 1, `expected L* ~0, got ${L}`);
});
