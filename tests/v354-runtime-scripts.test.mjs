/**
 * v3.5.4 runtime scripts — smoke tests
 *
 * Each script must: load without crash, handle missing inputs, produce expected shape.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();

function run(script, args = [], opts = {}) {
  return spawnSync('node', [join(ROOT, 'scripts', script), ...args], {
    encoding: 'utf8',
    cwd: opts.cwd || ROOT,
    input: opts.input,
  });
}

test('pareto-select: 3 variants, one dominates all', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  const variants = [
    { id: 'v1', design: 150, ux: 80, archetype_fit: 0.7, reference_ssim: 0.5 },
    { id: 'v2', design: 200, ux: 110, archetype_fit: 0.9, reference_ssim: 0.8 },
    { id: 'v3', design: 160, ux: 90, archetype_fit: 0.8, reference_ssim: 0.6 },
  ];
  const vpath = join(tmp, 'v.json');
  writeFileSync(vpath, JSON.stringify(variants));
  const r = run('pareto-select.mjs', ['--variants', vpath, '--archetype', 'editorial']);
  assert.equal(r.status, 0, `stderr: ${r.stderr}`);
  const out = JSON.parse(r.stdout);
  assert.equal(out.winner, 'v2');
  assert.deepEqual(out.pareto_front, ['v2']);
});

test('pareto-select: empty variants exits 1', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  const vpath = join(tmp, 'v.json');
  writeFileSync(vpath, '[]');
  const r = run('pareto-select.mjs', ['--variants', vpath, '--archetype', 'editorial']);
  assert.notEqual(r.status, 0);
});

test('decision-graph: add + query roundtrip', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  let r = run('decision-graph.mjs', ['add', '--title', 'test', '--category', 'design', '--rationale', 'because'], { cwd: tmp });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Created d-001/);
  r = run('decision-graph.mjs', ['query', '--status', 'pending'], { cwd: tmp });
  assert.equal(r.status, 0);
  const decisions = JSON.parse(r.stdout);
  assert.equal(decisions.length, 1);
  assert.equal(decisions[0].title, 'test');
});

test('decision-graph: apply transitions status', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  run('decision-graph.mjs', ['add', '--title', 't', '--rationale', 'r'], { cwd: tmp });
  const r = run('decision-graph.mjs', ['apply', 'd-001', '--by', 'test'], { cwd: tmp });
  assert.equal(r.status, 0);
  const q = run('decision-graph.mjs', ['query'], { cwd: tmp });
  const d = JSON.parse(q.stdout);
  assert.equal(d[0].status, 'applied');
  assert.equal(d[0].applied_by, 'test');
});

test('decision-graph: validate passes on clean graph', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  run('decision-graph.mjs', ['add', '--title', 't', '--rationale', 'r'], { cwd: tmp });
  const r = run('decision-graph.mjs', ['validate'], { cwd: tmp });
  assert.equal(r.status, 0);
});

test('agent-memory: write + query + render-for-spawn', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  const fp = JSON.stringify({ section_id: 'hero', archetype: 'editorial', beat: 'PEAK' });
  const out = JSON.stringify({ final_score: { design: 193, ux: 92 }, techniques_used: ['SplitText'], key_choices: ['typographic'] });
  const fb = JSON.stringify({ shipped: true });
  let r = run('agent-memory.mjs', ['write', '--agent', 'builder', '--task-fingerprint', fp, '--output', out, '--feedback', fb], { cwd: tmp });
  assert.equal(r.status, 0);
  r = run('agent-memory.mjs', ['query', '--agent', 'builder', '--task-fingerprint', JSON.stringify({ archetype: 'editorial', beat: 'PEAK' }), '--top-k', '3'], { cwd: tmp });
  assert.equal(r.status, 0);
  const results = JSON.parse(r.stdout);
  assert.equal(results.length, 1);
  r = run('agent-memory.mjs', ['render-for-spawn', '--agent', 'builder', '--task-fingerprint', JSON.stringify({ archetype: 'editorial', beat: 'PEAK' })], { cwd: tmp });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /PAST RELEVANT WORK/);
});

test('semantic-index: BM25 write + query', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  run('semantic-index.mjs', ['write', '--actor', 'judge', '--kind', 'variant-scored', '--subject', 'hero/v1',
    '--summary', 'Judge scored variant 1 design 180 ux 90', '--archetype', 'editorial', '--beat', 'PEAK'], { cwd: tmp });
  run('semantic-index.mjs', ['write', '--actor', 'builder', '--kind', 'section-shipped', '--subject', 'hero',
    '--summary', 'Hero section shipped with editorial serif display'], { cwd: tmp });
  const r = run('semantic-index.mjs', ['query', '--text', 'editorial serif display', '--top-k', '3'], { cwd: tmp });
  assert.equal(r.status, 0);
  const results = JSON.parse(r.stdout);
  assert.ok(results.length >= 1);
});

test('reference-library-index: rebuild empty dir works', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  const r = run('reference-library-index.mjs', ['rebuild'], { cwd: tmp });
  assert.equal(r.status, 0);
});

test('calibration-store: init + judge-write + kappa-write', () => {
  // Note: uses user-global ~/.claude so we skip hermetic isolation here; just verify commands don't crash
  let r = run('calibration-store.mjs', ['init']);
  assert.equal(r.status, 0);
  r = run('calibration-store.mjs', ['judge-write', '--subject', 'test-smoke', '--judge-model', 'test',
    '--design', '180', '--ux', '90', '--mode', 'calibration']);
  assert.equal(r.status, 0);
  r = run('calibration-store.mjs', ['kappa-write', '--section', 'test', '--kappa', '0.75', '--verdict', 'ship']);
  assert.equal(r.status, 0);
});

test('ship-check: runs in empty dir without crashing', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  const r = run('ship-check.mjs', [], { cwd: tmp });
  // Exit 0 on PASS/WARN, 1 on BLOCK — empty dir has all SKIPs, should PASS
  assert.ok(r.status === 0 || r.status === 1);
  assert.match(r.stdout, /SHIP-READINESS SCORECARD/);
});

test('asset-forge/3d-procedural: box emits valid glTF', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  const out = join(tmp, 'box.gltf');
  const r = run('asset-forge/3d-procedural.mjs', ['box', '--seed', '42', '--size', '2', '--out', out]);
  assert.equal(r.status, 0);
  assert.ok(existsSync(out));
  const gltf = JSON.parse(readFileSync(out, 'utf8'));
  assert.equal(gltf.asset.version, '2.0');
  assert.ok(gltf.buffers.length > 0);
});

test('asset-forge/3d-procedural: deterministic with same seed', () => {
  const tmp1 = mkdtempSync(join(tmpdir(), 'gen-test-'));
  const tmp2 = mkdtempSync(join(tmpdir(), 'gen-test-'));
  const out1 = join(tmp1, 'a.gltf'), out2 = join(tmp2, 'b.gltf');
  run('asset-forge/3d-procedural.mjs', ['sphere', '--seed', '7', '--size', '1', '--out', out1]);
  run('asset-forge/3d-procedural.mjs', ['sphere', '--seed', '7', '--size', '1', '--out', out2]);
  assert.equal(readFileSync(out1, 'utf8'), readFileSync(out2, 'utf8'));
});

test('regression-diff: capture + check roundtrip', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-test-'));
  let r = run('regression-diff.mjs', ['capture'], { cwd: tmp });
  assert.equal(r.status, 0);
  r = run('regression-diff.mjs', ['check'], { cwd: tmp });
  assert.equal(r.status, 0);
});
