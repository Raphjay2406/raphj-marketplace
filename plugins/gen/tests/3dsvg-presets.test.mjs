import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PRESETS = JSON.parse(readFileSync(join(ROOT, 'skills/design-archetypes/seeds/3dsvg-presets.json'), 'utf8'));

test('75 presets total (25 archetypes × 3 beats)', () => {
  assert.equal(PRESETS.presets.length, 75);
});

test('every preset has an id matching pattern', () => {
  for (const p of PRESETS.presets) {
    assert.match(p.id, /^[a-z0-9]+_(hook|peak|close)_(\d{3}|disabled)$/, `bad id: ${p.id}`);
  }
});

test('beats are evenly distributed (25 HOOK + 25 PEAK + 25 CLOSE)', () => {
  const byBeat = {};
  for (const p of PRESETS.presets) byBeat[p.beat] = (byBeat[p.beat] || 0) + 1;
  assert.equal(byBeat.HOOK, 25);
  assert.equal(byBeat.PEAK, 25);
  assert.equal(byBeat.CLOSE, 25);
});

test('exactly 25 distinct archetypes covered', () => {
  const archetypes = new Set(PRESETS.presets.map(p => p.archetype));
  assert.equal(archetypes.size, 25, `expected 25, got ${archetypes.size}: ${[...archetypes].join(', ')}`);
});

test('Pixel-Art has all 3 disabled presets with fallback_strategy', () => {
  const pixelArt = PRESETS.presets.filter(p => p.archetype === 'Pixel-Art');
  assert.equal(pixelArt.length, 3);
  for (const p of pixelArt) {
    assert.equal(p.disabled, true);
    assert.ok(p.fallback_strategy, `${p.id} missing fallback_strategy`);
    assert.ok(p.reason, `${p.id} missing reason`);
  }
});

test('every enabled preset has required fields', () => {
  const required = ['id', 'archetype', 'beat', 'display_name', 'text_template', 'material', 'animation', 'depth', 'intro', 'export_formats', 'motion_health_budget_units', 'live_component_cost_kb', 'offline_export_cost_kb', 'notes'];
  for (const p of PRESETS.presets) {
    if (p.disabled) continue;
    for (const field of required) {
      assert.ok(field in p, `preset ${p.id} missing ${field}`);
    }
  }
});

test('material enum constraint (10 valid 3dsvg materials)', () => {
  const valid = new Set(['default', 'plastic', 'metal', 'glass', 'rubber', 'chrome', 'gold', 'clay', 'emissive', 'holographic']);
  for (const p of PRESETS.presets) {
    if (p.disabled) continue;
    assert.ok(valid.has(p.material), `preset ${p.id} bad material: ${p.material}`);
  }
});

test('animation enum constraint (7 valid 3dsvg animations)', () => {
  const valid = new Set(['none', 'spin', 'float', 'pulse', 'wobble', 'spinFloat', 'swing']);
  for (const p of PRESETS.presets) {
    if (p.disabled) continue;
    assert.ok(valid.has(p.animation), `preset ${p.id} bad animation: ${p.animation}`);
  }
});

test('motion_health_budget_units matches animation type', () => {
  for (const p of PRESETS.presets) {
    if (p.disabled) continue;
    if (p.animation === 'none') {
      assert.equal(p.motion_health_budget_units, 0, `${p.id} should be 0 budget for no animation`);
    } else {
      assert.ok(p.motion_health_budget_units >= 1, `${p.id} animated should be ≥1 budget`);
    }
  }
});

test('depth within 3dsvg supported range (0.1-2.0)', () => {
  for (const p of PRESETS.presets) {
    if (p.disabled) continue;
    assert.ok(p.depth >= 0.1 && p.depth <= 2.0, `${p.id} depth out of range: ${p.depth}`);
  }
});

test('Brutalist + Neubrutalism presets have bevel=null (hard-edge rule)', () => {
  for (const p of PRESETS.presets) {
    if (p.disabled) continue;
    if (p.archetype === 'Brutalist' || p.archetype === 'Neubrutalism') {
      assert.equal(p.bevel, null, `${p.id} (${p.archetype}) must have bevel=null`);
    }
  }
});

test('Luxury presets use gold/chrome/metal (preferred materials)', () => {
  const preferred = new Set(['gold', 'chrome', 'metal']);
  for (const p of PRESETS.presets.filter(p => p.archetype === 'Luxury' && !p.disabled)) {
    assert.ok(preferred.has(p.material), `${p.id} uses ${p.material}, expected one of: ${[...preferred].join(', ')}`);
  }
});

test('Ethereal presets use glass or holographic (preferred)', () => {
  const preferred = new Set(['glass', 'holographic']);
  for (const p of PRESETS.presets.filter(p => p.archetype === 'Ethereal' && !p.disabled)) {
    assert.ok(preferred.has(p.material), `${p.id} uses ${p.material}`);
  }
});

test('Neo-Corporate + Swiss forbid gold/holographic (too flashy)', () => {
  const forbidden = new Set(['gold', 'holographic']);
  for (const p of PRESETS.presets.filter(p => (p.archetype === 'Neo-Corporate' || p.archetype === 'Swiss') && !p.disabled)) {
    assert.ok(!forbidden.has(p.material), `${p.id} uses forbidden material ${p.material} for ${p.archetype}`);
  }
});

test('color_override when present is valid hex', () => {
  for (const p of PRESETS.presets) {
    if (p.disabled || p.color_override === null) continue;
    assert.match(p.color_override, /^#[0-9a-fA-F]{3,8}$/, `${p.id} bad color: ${p.color_override}`);
  }
});

test('text_template uses placeholder pattern', () => {
  const valid = new Set(['{brand_name}', '{headline}', '{cta_text}']);
  for (const p of PRESETS.presets) {
    if (p.disabled) continue;
    assert.ok(valid.has(p.text_template), `${p.id} unknown text_template: ${p.text_template}`);
  }
});

test('perf cost split: live + offline both declared, logic consistent', () => {
  for (const p of PRESETS.presets) {
    if (p.disabled) continue;
    assert.equal(typeof p.live_component_cost_kb, 'number');
    assert.equal(typeof p.offline_export_cost_kb, 'number');
    // Offline export is always 0 (it's a static PNG/MP4, not JS)
    assert.equal(p.offline_export_cost_kb, 0, `${p.id} offline cost should be 0 (static asset)`);
    // Live component cost should be substantial (three.js + R3F + 3dsvg + opentype.js)
    assert.ok(p.live_component_cost_kb >= 150, `${p.id} live cost unrealistically low`);
  }
});
