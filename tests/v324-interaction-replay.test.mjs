// Synthetic Playwright-trace fixture → interaction-replay.mjs → MOTION-INVENTORY.md.
// Avoids needing a real browser/trace capture. Fixture mimics the NDJSON shape
// the executor expects: dom-snapshot events with selector + computedStyle per frame,
// plus network events for library fingerprinting.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'ingest', 'interaction-replay.mjs');

function writeTraceFixture(traceDir, { animations = [], networkUrls = [] } = {}) {
  mkdirSync(traceDir, { recursive: true });
  const lines = [];
  // Network events (top) — any shape that has .url or .request.url is fingerprinted
  for (const url of networkUrls) lines.push(JSON.stringify({ type: 'network', url }));
  // DOM snapshots — the executor groups by selector and fits easing from frames
  // animations: [{ selector, frames: [{ t, opacity?, transform? }] }]
  const frameGroups = new Map();
  for (const a of animations) {
    for (const f of a.frames) {
      const group = frameGroups.get(f.t) || [];
      group.push({ selector: a.selector, computedStyle: { opacity: String(f.opacity ?? 1), transform: f.transform ?? 'none' } });
      frameGroups.set(f.t, group);
    }
  }
  const sortedT = [...frameGroups.keys()].sort((a, b) => a - b);
  for (const t of sortedT) {
    lines.push(JSON.stringify({ type: 'dom-snapshot', timestamp: t, nodes: frameGroups.get(t) }));
  }
  writeFileSync(join(traceDir, '0-trace.trace'), lines.join('\n'));
}

function inSandbox(fn) {
  const origCwd = process.cwd();
  const dir = mkdtempSync(join(tmpdir(), 'genorah-replay-'));
  process.chdir(dir);
  try { return fn(dir); }
  finally { process.chdir(origCwd); rmSync(dir, { recursive: true, force: true }); }
}

test('interaction-replay: fits ease-out-expo from opacity fade-in', () => {
  inSandbox(dir => {
    // Pre-create ingestion dir so MOTION-INVENTORY.md has a home
    const slugDir = join(dir, '.planning', 'genorah', 'ingested', 'fx');
    mkdirSync(slugDir, { recursive: true });

    const traceDir = join(dir, 'traceout');
    // ease-out-expo: fast then slow → opacity reaches 0.8 at t=0.3, near 1.0 by t=0.6
    writeTraceFixture(traceDir, {
      animations: [{
        selector: 'h1.hero',
        frames: [
          { t: 0,    opacity: 0.0 },
          { t: 200,  opacity: 0.70 },
          { t: 400,  opacity: 0.93 },
          { t: 600,  opacity: 0.99 },
          { t: 800,  opacity: 1.00 },
        ],
      }],
      networkUrls: ['https://cdn.example.com/gsap.min.js'],
    });

    const out = spawnSync('node', [SCRIPT, 'fx', traceDir], { encoding: 'utf8' });
    assert.equal(out.status, 0, `exit ${out.status}: ${out.stderr}`);

    const md = readFileSync(join(slugDir, 'MOTION-INVENTORY.md'), 'utf8');
    assert.match(md, /h1\.hero/, 'selector not surfaced');
    assert.match(md, /duration_ms: 800/, 'duration not computed');
    assert.match(md, /gsap/, 'library fingerprint missing');
    // Should fit one of the "ease-out" family — expo/quart or plain ease-out
    assert.match(md, /easing: ease-out/, `expected ease-out-family, got: ${md}`);

    // Ledger assertions
    const ledger = readFileSync(join(slugDir, 'preservation.ledger.ndjson'), 'utf8')
      .split('\n').filter(Boolean).map(l => JSON.parse(l));
    assert.ok(ledger.some(e => e.kind === 'capture.motion-event'), 'missing capture.motion-event');
    assert.ok(ledger.some(e => e.kind === 'motion.library-detected' && e.lib === 'gsap'), 'missing gsap detection');
    assert.ok(ledger.some(e => e.kind === 'motion.fit' && e.selector === 'h1.hero'), 'missing motion.fit');
  });
});

test('interaction-replay: linear animation fits linear', () => {
  inSandbox(dir => {
    const slugDir = join(dir, '.planning', 'genorah', 'ingested', 'lin');
    mkdirSync(slugDir, { recursive: true });

    const traceDir = join(dir, 'traceout');
    writeTraceFixture(traceDir, {
      animations: [{
        selector: 'div.progress',
        frames: [
          { t: 0,    opacity: 0.0 },
          { t: 250,  opacity: 0.25 },
          { t: 500,  opacity: 0.5 },
          { t: 750,  opacity: 0.75 },
          { t: 1000, opacity: 1.0 },
        ],
      }],
      networkUrls: [],
    });

    const out = spawnSync('node', [SCRIPT, 'lin', traceDir], { encoding: 'utf8' });
    assert.equal(out.status, 0, out.stderr);
    const md = readFileSync(join(slugDir, 'MOTION-INVENTORY.md'), 'utf8');
    assert.match(md, /easing: linear/, `expected linear fit, got: ${md}`);
  });
});

test('interaction-replay: exits non-zero with useful gap when trace empty', () => {
  inSandbox(dir => {
    const slugDir = join(dir, '.planning', 'genorah', 'ingested', 'empty');
    mkdirSync(slugDir, { recursive: true });
    const traceDir = join(dir, 'traceout');
    mkdirSync(traceDir, { recursive: true });
    writeFileSync(join(traceDir, '0-trace.trace'), '');

    const out = spawnSync('node', [SCRIPT, 'empty', traceDir], { encoding: 'utf8' });
    assert.equal(out.status, 2, `expected exit 2, got ${out.status}`);
    const ledger = readFileSync(join(slugDir, 'preservation.ledger.ndjson'), 'utf8');
    assert.match(ledger, /trace-empty-or-unsupported-format/);
  });
});

test('interaction-replay: refuses without trace directory arg', () => {
  inSandbox(() => {
    const out = spawnSync('node', [SCRIPT, 'x'], { encoding: 'utf8' });
    assert.equal(out.status, 1);
    assert.match(out.stderr, /Usage:/);
  });
});
