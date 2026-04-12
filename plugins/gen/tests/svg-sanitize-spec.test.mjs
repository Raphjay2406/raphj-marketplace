import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Sanitization spec test — verifies the SKILL.md security section documents
 * all mandated mitigations. The runtime implementation (svgo-based function)
 * is shipped as skill-documented pattern per D3 decision; projects copy-paste.
 *
 * These tests check the skill TEXT contains the contract; implementation test
 * of an actual sanitizer will live in user projects that copy the pattern.
 */

const ROOT = process.cwd();
const SKILL = readFileSync(join(ROOT, 'skills/3dsvg-extrusion/SKILL.md'), 'utf8');

test('skill documents XXE rejection', () => {
  assert.match(SKILL, /XXE.*ENTITY/i);
});

test('skill documents recursive <use> bomb rejection', () => {
  assert.match(SKILL, /recursive.*use.*bomb|<use>.*recursive/i);
});

test('skill documents <script> rejection', () => {
  assert.match(SKILL, /<script>.*reject|reject.*<script>|Reject `<script>`/i);
});

test('skill documents event handler rejection (on* attrs)', () => {
  assert.match(SKILL, /on\[a-z\]\+|on\*.*attribute|event handler/i);
});

test('skill documents external resource rejection', () => {
  assert.match(SKILL, /External.*forbidden|data: URIs only|external URL/i);
});

test('skill documents recursive nesting depth cap', () => {
  assert.match(SKILL, /depth.*10|Cap depth at 10/i);
});

test('skill prescribes svgo as sanitizer (not hand-rolled regex)', () => {
  assert.match(SKILL, /svgo/i);
  assert.match(SKILL, /import.*optimize.*from.*svgo/);
});

test('skill documents GenorahSVG3D wrapper requirement', () => {
  assert.match(SKILL, /GenorahSVG3D.*Wrapper.*REQUIRED|REQUIRED.*GenorahSVG3D/i);
});

test('skill documents SSR gate (NOT SSR-safe)', () => {
  assert.match(SKILL, /NOT SSR-safe|ssr:\s*false|client:only/i);
});

test('skill enforces max 3 live instances per page (WebGL limit)', () => {
  assert.match(SKILL, /max 3 live|WebGL context|3 `<GenorahSVG3D>`|3 live `<SVG3D>`/i);
});
