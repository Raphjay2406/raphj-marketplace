import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

test('uipro-palettes.json parses and remap is 12-token', () => {
  const raw = readFileSync(join(ROOT, 'skills/design-dna/seeds/uipro-palettes.json'), 'utf8');
  const data = JSON.parse(raw);
  assert.ok(data.palettes?.length > 0, 'palettes array non-empty');
  const required = ['primary', 'secondary', 'accent', 'bg', 'text', 'surface', 'muted', 'border', 'tension', 'highlight'];
  for (const p of data.palettes) {
    for (const tok of required) {
      assert.ok(tok in p.tokens, `palette ${p.id} missing token ${tok}`);
    }
    // No orphan 17-token keys leaked through
    for (const forbidden of ['card', 'on-primary', 'destructive', 'ring']) {
      assert.ok(!(forbidden in p.tokens), `palette ${p.id} leaked PRO MAX key ${forbidden}`);
    }
  }
});

test('uipro-palettes every token is a valid CSS color', () => {
  const data = JSON.parse(readFileSync(join(ROOT, 'skills/design-dna/seeds/uipro-palettes.json'), 'utf8'));
  const colorRegex = /^(#[0-9a-f]{3,8}|rgba?\([^)]+\)|oklch\([^)]+\)|hsla?\([^)]+\)|transparent)$/i;
  for (const p of data.palettes) {
    for (const [k, v] of Object.entries(p.tokens)) {
      assert.match(v, colorRegex, `palette ${p.id} token ${k}=${v} not valid CSS color`);
    }
  }
});

test('uipro-fonts.json parses and has pairings', () => {
  const data = JSON.parse(readFileSync(join(ROOT, 'skills/design-dna/seeds/uipro-fonts.json'), 'utf8'));
  assert.ok(data.pairings?.length > 0);
  for (const p of data.pairings) {
    assert.ok(p.display && p.body && p.mono, `pairing ${p.id} missing display/body/mono`);
    assert.ok(p.google_fonts_url?.startsWith('https://fonts.googleapis.com/'), `pairing ${p.id} bad URL`);
  }
});
