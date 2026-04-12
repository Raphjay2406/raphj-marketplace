// Exact-preset regression baselines for interaction-replay easing fitter.
// Each test generates ground-truth samples from a known cubic-Bezier preset
// using the SAME bezier() routine the fitter uses, feeds them as a fake
// trace, and asserts the fitter picks that exact preset (not just the family).
//
// 11 samples per fixture (t ∈ {0, 0.1, ..., 1.0}) — enough resolution to
// disambiguate close presets like ease-out vs ease-out-quart.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'ingest', 'interaction-replay.mjs');

function spawnAsync(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { ...opts, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    child.stdout.on('data', d => (stdout += d.toString('utf8')));
    child.stderr.on('data', d => (stderr += d.toString('utf8')));
    child.on('error', reject);
    child.on('close', status => resolve({ status, stdout, stderr }));
  });
}

// Same cubic-Bezier parameterization used by the fitter (bezier(t, p1x, p1y, p2x, p2y)):
// produces (x(t), y(t)) pairs for a cubic with control points (0,0), (p1x,p1y), (p2x,p2y), (1,1).
function bezierXY(t, p1x, p1y, p2x, p2y) {
  const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
  const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
  return {
    x: ((ax * t + bx) * t + cx) * t,
    y: ((ay * t + by) * t + cy) * t,
  };
}

// Build a fake trace where each frame's (timestamp, opacity) equals the preset's
// (x(t), y(t)) at bezier-parameter t=0..1. The fitter normalizes timestamps back
// to [0,1] which matches its own internal curve lookup x values exactly — so the
// correct preset yields RMSE=0, and any other preset pays the real perceptual cost.
function buildFixture(dir, slug, presetName, [p1x, p1y, p2x, p2y]) {
  const slugDir = join(dir, '.planning', 'genorah', 'ingested', slug);
  mkdirSync(slugDir, { recursive: true });
  const traceDir = join(dir, `trace-${slug}`);
  mkdirSync(traceDir, { recursive: true });

  const lines = [];
  const selector = `span.${presetName.replace(/[^a-z]/g, '')}`;
  // 21 samples at bezier-parameter 0..1 in 0.05 steps — matches fitter's curve resolution.
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const { x, y } = bezierXY(t, p1x, p1y, p2x, p2y);
    lines.push(JSON.stringify({
      type: 'dom-snapshot',
      timestamp: x * 1000,
      nodes: [{ selector, computedStyle: { opacity: String(y.toFixed(4)), transform: 'none' } }],
    }));
  }
  writeFileSync(join(traceDir, '0-trace.trace'), lines.join('\n'));
  return { slugDir, traceDir };
}

function makeSandbox() {
  const dir = mkdtempSync(join(tmpdir(), 'genorah-easing-'));
  return { dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

// Ground-truth presets (must match EASING_PRESETS in interaction-replay.mjs)
const PRESETS = {
  'linear':          [0,    0,    1,    1],
  'ease-out':        [0,    0,    0.58, 1],
  'ease-in':         [0.42, 0,    1,    1],
  'ease-in-out':     [0.42, 0,    0.58, 1],
  'ease-out-expo':   [0.16, 1,    0.3,  1],
  'ease-out-quart':  [0.25, 1,    0.5,  1],
  'spring':          [0.5,  1.25, 0.75, 1],
};

for (const [name, coords] of Object.entries(PRESETS)) {
  test(`easing baseline: exact fit of '${name}' preset`, async () => {
    const { dir, cleanup } = makeSandbox();
    try {
      const slug = name.replace(/[^a-z]/g, '');
      const { slugDir, traceDir } = buildFixture(dir, slug, name, coords);
      const out = await spawnAsync('node', [SCRIPT, slug, traceDir], { cwd: dir });
      assert.equal(out.status, 0, `exit ${out.status}: ${out.stderr}`);

      const md = readFileSync(join(slugDir, 'MOTION-INVENTORY.md'), 'utf8');
      // Must pick the exact preset, not a sibling. RMSE should be very low
      // because fixture is generated from the preset itself.
      const easingLine = md.match(/easing: ([\w-]+)/)?.[1];
      assert.equal(easingLine, name, `fitter picked '${easingLine}', expected '${name}'\n\nFull inventory:\n${md}`);

      const rmseLine = md.match(/easing_rmse: ([\d.]+)/)?.[1];
      assert.ok(parseFloat(rmseLine) < 0.05, `expected near-perfect RMSE, got ${rmseLine}`);

      // Confidence must be ≥0.85 band (rmse < 0.1)
      const confLine = md.match(/confidence: ([\d.]+)/)?.[1];
      assert.ok(parseFloat(confLine) >= 0.85, `expected confidence ≥0.85, got ${confLine}`);
    } finally { cleanup(); }
  });
}

// Regression: a synthetic curve that's halfway between two presets should still
// pick the closer one and have a noticeably higher RMSE than the exact-fit cases.
test('easing baseline: ambiguous curve picks nearest preset with higher RMSE', async () => {
  const { dir, cleanup } = makeSandbox();
  try {
    const slug = 'ambig';
    // Midway between ease-out and ease-out-expo on the y axis at matched x
    const expo = PRESETS['ease-out-expo'];
    const eo = PRESETS['ease-out'];
    const slugDir = join(dir, '.planning', 'genorah', 'ingested', slug);
    mkdirSync(slugDir, { recursive: true });
    const traceDir = join(dir, 'trace-ambig');
    mkdirSync(traceDir, { recursive: true });
    const lines = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const a = bezierXY(t, ...expo);
      const b = bezierXY(t, ...eo);
      const x = (a.x + b.x) / 2;
      const y = (a.y + b.y) / 2;
      lines.push(JSON.stringify({
        type: 'dom-snapshot',
        timestamp: x * 1000,
        nodes: [{ selector: 'div.ambig', computedStyle: { opacity: String(y.toFixed(4)), transform: 'none' } }],
      }));
    }
    writeFileSync(join(traceDir, '0-trace.trace'), lines.join('\n'));

    const out = await spawnAsync('node', [SCRIPT, slug, traceDir], { cwd: dir });
    assert.equal(out.status, 0);
    const md = readFileSync(join(slugDir, 'MOTION-INVENTORY.md'), 'utf8');
    const pick = md.match(/easing: ([\w-]+)/)?.[1];
    // Either neighbor is acceptable — this documents that the fitter picks *some*
    // ease-out variant rather than wandering to ease-in or linear.
    assert.match(pick, /^ease-out/, `ambiguous curve should stay in ease-out family, got ${pick}`);
    const rmse = parseFloat(md.match(/easing_rmse: ([\d.]+)/)?.[1] || '0');
    assert.ok(rmse > 0.005 && rmse < 0.2, `ambiguous RMSE should be >0.005 and <0.2, got ${rmse}`);
  } finally { cleanup(); }
});
