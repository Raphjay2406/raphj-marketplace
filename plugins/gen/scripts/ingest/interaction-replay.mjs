#!/usr/bin/env node
// v3.23 interaction replay executor — parses Playwright trace (extracted directory),
// fits easing family per animated element, emits MOTION-INVENTORY.md.
//
// Input: an extracted trace directory containing *.trace files (NDJSON).
// Playwright trace.zip is a zip archive; extract with `unzip` or Playwright's
// `npx playwright show-trace --convert` before running this.
//
// Output:
//   .planning/genorah/ingested/<slug>/MOTION-INVENTORY.md
//   preservation.ledger.ndjson entries: capture.motion-event, motion.fit

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { append } from './preservation-ledger.mjs';

// Read all .trace files (NDJSON) in a directory tree
function collectTraceEvents(traceDir) {
  const events = [];
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else if (name.endsWith('.trace') || name.endsWith('.network')) {
        const text = readFileSync(full, 'utf8');
        for (const line of text.split('\n')) {
          if (!line.trim()) continue;
          try { events.push(JSON.parse(line)); } catch { /* skip malformed */ }
        }
      }
    }
  }
  walk(traceDir);
  return events;
}

// Library fingerprint from network requests captured in trace
function fingerprintLibrary(events) {
  const libs = new Set();
  for (const e of events) {
    const url = e.url || e.request?.url || '';
    if (/gsap(?:\.min)?\.js|@gsap\/|greensock/i.test(url)) libs.add('gsap');
    if (/framer-motion|motion\/react/i.test(url)) libs.add('framer-motion');
    if (/motion(?:\.dev|@.*\/motion)/i.test(url)) libs.add('motion-one');
    if (/lottie|lottie-web/i.test(url)) libs.add('lottie');
    if (/@rive-app/i.test(url)) libs.add('rive');
    if (/@react-spring|react-spring/i.test(url)) libs.add('react-spring');
  }
  return [...libs];
}

// Fit cubic-bezier from sampled (t, v) pairs using least-squares against known presets.
// Samples normalized to [0,1] for both t and v.
const EASING_PRESETS = {
  linear: [0, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  'ease-out-expo': [0.16, 1, 0.3, 1],
  'ease-out-quart': [0.25, 1, 0.5, 1],
  spring: [0.5, 1.25, 0.75, 1], // approximation
};

function bezier(t, p1x, p1y, p2x, p2y) {
  // Cubic Bezier value at parameter t (not x); caller maps t↔x.
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  // Solve for t given x by Newton — simplified since we sample at t directly
  const xOfT = ((ax * t + bx) * t + cx) * t;
  const yOfT = ((ay * t + by) * t + cy) * t;
  return { x: xOfT, y: yOfT };
}

function fitEasing(samples) {
  // samples: [{ t: 0..1, v: 0..1 }]; pick preset with min RMSE
  if (samples.length < 3) return { name: 'unknown', rmse: Infinity };
  let best = { name: 'unknown', rmse: Infinity, preset: null };
  for (const [name, [p1x, p1y, p2x, p2y]] of Object.entries(EASING_PRESETS)) {
    // Build a lookup at 20 points
    const curve = Array.from({ length: 21 }, (_, i) => bezier(i / 20, p1x, p1y, p2x, p2y));
    let sq = 0;
    for (const s of samples) {
      // Find curve point with closest x
      let closest = curve[0], cd = Infinity;
      for (const pt of curve) { const d = Math.abs(pt.x - s.t); if (d < cd) { cd = d; closest = pt; } }
      sq += (closest.y - s.v) ** 2;
    }
    const rmse = Math.sqrt(sq / samples.length);
    if (rmse < best.rmse) best = { name, rmse, preset: [p1x, p1y, p2x, p2y] };
  }
  return best;
}

// Extract animated elements from trace events. Real Playwright trace format
// includes "before" and "after" snapshots with computed styles on each DOM
// node. We pair consecutive snapshots of the same element and derive
// (property, duration, samples).
function extractAnimations(events) {
  const snaps = events.filter(e => e.type === 'dom-snapshot' || e.method === 'snapshot');
  const animations = new Map(); // selector → [{ t, property, value }]
  let t0 = null;

  for (const e of snaps) {
    const ts = e.timestamp || e.monotonicTime || 0;
    if (t0 === null) t0 = ts;
    const nodes = e.nodes || e.elements || [];
    for (const node of nodes) {
      const sel = node.selector || node.nodeKey;
      if (!sel) continue;
      const style = node.computedStyle || node.style || {};
      const record = animations.get(sel) || [];
      record.push({
        t: ts - t0,
        transform: style.transform,
        opacity: parseFloat(style.opacity),
      });
      animations.set(sel, record);
    }
  }

  const fitted = [];
  for (const [selector, frames] of animations) {
    if (frames.length < 3) continue;
    const first = frames[0], last = frames[frames.length - 1];
    const duration = last.t - first.t;
    if (duration <= 0 || duration > 5000) continue;
    const opacitySamples = frames
      .map(f => ({ t: (f.t - first.t) / duration, v: isNaN(f.opacity) ? 1 : f.opacity }))
      .filter(s => !isNaN(s.v));
    const easing = opacitySamples.length >= 3 ? fitEasing(opacitySamples) : { name: 'unknown', rmse: Infinity };
    fitted.push({
      selector,
      duration_ms: Math.round(duration),
      frames: frames.length,
      property: opacitySamples.length ? 'opacity' : 'transform',
      easing: easing.name,
      easing_rmse: Number(easing.rmse.toFixed(3)),
      confidence: easing.rmse < 0.1 ? 0.85 : (easing.rmse < 0.2 ? 0.6 : 0.4),
    });
  }
  return fitted;
}

function main() {
  const [,, slug, traceDir] = process.argv;
  if (!slug || !traceDir) {
    console.error('Usage: interaction-replay.mjs <slug> <extracted-trace-dir>');
    console.error('       Extract Playwright trace.zip first (e.g., `unzip trace.zip -d traceout/`).');
    process.exit(1);
  }
  if (!existsSync(traceDir)) { console.error(`No such directory: ${traceDir}`); process.exit(1); }
  const dest = join(process.cwd(), '.planning', 'genorah', 'ingested', slug);

  const events = collectTraceEvents(traceDir);
  if (events.length === 0) {
    append(slug, { kind: 'gap', reason: 'trace-empty-or-unsupported-format', traceDir });
    console.error('No trace events parsed. Is this a Playwright .trace directory?');
    process.exit(2);
  }
  append(slug, { kind: 'capture.motion-event', count: events.length, source: traceDir });

  const libs = fingerprintLibrary(events);
  for (const lib of libs) append(slug, { kind: 'motion.library-detected', lib });

  const animations = extractAnimations(events);
  for (const a of animations) {
    append(slug, { kind: 'motion.fit', selector: a.selector, duration_ms: a.duration_ms, easing: a.easing, confidence: a.confidence });
    if (a.confidence < 0.5) append(slug, { kind: 'gap', reason: 'motion-low-confidence', selector: a.selector });
  }

  const md = [
    `# Motion Inventory — ${slug}`,
    ``,
    `**Trace events parsed**: ${events.length}`,
    `**Libraries detected**: ${libs.join(', ') || 'none'}`,
    `**Animations extracted**: ${animations.length}`,
    ``,
    `## Fitted animations`,
    ``,
    animations.length === 0 ? '_None — no element had ≥3 snapshots with motion._' : '```yaml',
    ...animations.map(a => `- selector: "${a.selector}"\n  duration_ms: ${a.duration_ms}\n  property: ${a.property}\n  easing: ${a.easing}\n  easing_rmse: ${a.easing_rmse}\n  confidence: ${a.confidence}`),
    animations.length === 0 ? '' : '```',
    ``,
    `## Next`,
    `- Review low-confidence fits via /gen:ingest gap ${slug}`,
    `- Proposed motion specs feed animation-specialist on /gen:build`,
  ].join('\n');
  writeFileSync(join(dest, 'MOTION-INVENTORY.md'), md);
  console.log(`Motion inventory → ${dest}/MOTION-INVENTORY.md (${animations.length} animations, ${libs.length} libraries)`);
}

main();
