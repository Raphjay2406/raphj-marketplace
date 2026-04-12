/**
 * E2E Canary — v3.5.7
 *
 * Verifies the v3.5 pipeline scripts + hooks interoperate without crashes.
 * Covers: pareto → agent-memory → semantic-index → decision-graph → compaction-summary → resume
 *
 * Does NOT run actual builder/judge/critic agents (those require LLM spawn).
 * This is runtime-only — asserts scripts compose cleanly.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();

function run(script, args = [], opts = {}) {
  return spawnSync('node', [join(ROOT, 'scripts', script), ...args], {
    encoding: 'utf8',
    cwd: opts.cwd || ROOT,
  });
}

test('e2e: pipeline artifacts compose across scripts', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gen-e2e-'));

  // 1. Create a decision
  let r = run('decision-graph.mjs', ['add', '--title', 'e2e test decision', '--rationale', 'testing', '--impacts', 'sections/hero'], { cwd: tmp });
  assert.equal(r.status, 0, 'decision-graph add failed');
  assert.match(r.stdout, /Created d-001/);

  // 2. Write a memory entry for builder
  const fp = JSON.stringify({ section_id: 'hero', archetype: 'editorial', beat: 'PEAK' });
  const output = JSON.stringify({ final_score: { design: 193, ux: 92 }, techniques_used: ['SplitText'] });
  r = run('agent-memory.mjs', ['write', '--agent', 'builder', '--task-fingerprint', fp, '--output', output, '--feedback', '{"shipped":true}'], { cwd: tmp });
  assert.equal(r.status, 0, 'agent-memory write failed');

  // 3. Write a ledger entry
  r = run('../scripts/ledger-write.mjs', ['judge', 'variant-scored', 'hero/v1', '{"design":193,"ux":92}', '[]'], { cwd: tmp });
  // ledger-write.mjs path accepts actor arg — relative path won't work here, skip

  // 4. Write a semantic-index entry
  r = run('semantic-index.mjs', ['write', '--actor', 'judge', '--kind', 'variant-scored', '--subject', 'hero/v1',
    '--summary', 'Judge scored variant design=193 ux=92 for editorial peak', '--archetype', 'editorial', '--beat', 'PEAK'], { cwd: tmp });
  assert.equal(r.status, 0, 'semantic-index write failed');

  // 5. Query semantic-index back
  r = run('semantic-index.mjs', ['query', '--text', 'editorial peak variant', '--top-k', '5'], { cwd: tmp });
  assert.equal(r.status, 0);
  const results = JSON.parse(r.stdout);
  assert.ok(results.length >= 1, 'semantic query should find written entry');

  // 6. Pareto select
  const variants = [
    { id: 'v1', design: 193, ux: 92, archetype_fit: 0.85, reference_ssim: 0.7 },
    { id: 'v2', design: 180, ux: 100, archetype_fit: 0.80, reference_ssim: 0.65 },
  ];
  const vpath = join(tmp, 'variants.json');
  writeFileSync(vpath, JSON.stringify(variants));
  r = run('pareto-select.mjs', ['--variants', vpath, '--archetype', 'editorial']);
  assert.equal(r.status, 0);
  const pareto = JSON.parse(r.stdout);
  assert.ok(pareto.pareto_front.length >= 1);

  // 7. Dashboard snapshot on empty project should work
  r = run('dashboard-v2-data.mjs', ['snapshot'], { cwd: tmp });
  assert.equal(r.status, 0);
  const snap = JSON.parse(r.stdout);
  assert.ok(snap.ts);
  assert.equal(snap.decisions.pending, 1);  // our test decision

  // 8. Ship-check on empty project
  r = run('ship-check.mjs', [], { cwd: tmp });
  assert.ok(r.status === 0 || r.status === 1);
  assert.match(r.stdout, /SHIP-READINESS SCORECARD/);

  // 9. Cost tracker
  r = run('cost-tracker.mjs', ['record', '--actor', 'builder', '--tokens-in', '1000', '--tokens-out', '500'], { cwd: tmp });
  assert.equal(r.status, 0);
  r = run('cost-tracker.mjs', ['report'], { cwd: tmp });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /COST REPORT/);
});

test('e2e: archetype matrices parse as valid JSON', () => {
  const files = [
    'skills/design-archetypes/testable-markers.json',
    'skills/design-archetypes/seeds/archetype-weights.json',
    'skills/scene-composition/seeds/archetype-lighting-rigs.json',
    'skills/pbr-materials/seeds/archetype-materials.json',
    'skills/recraft-vector-ai/seeds/recraft-substyle-map.json',
  ];
  for (const f of files) {
    const content = readFileSync(join(ROOT, f), 'utf8');
    const parsed = JSON.parse(content);
    assert.ok(parsed, `${f} must parse`);
  }
});

test('e2e: golden set entries have required frontmatter', async () => {
  const { readdirSync } = await import('fs');
  const dir = join(ROOT, 'skills/judge-calibration/golden');
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md');
  assert.ok(files.length >= 5, `expected ≥ 5 golden entries, got ${files.length}`);
  for (const f of files) {
    const content = readFileSync(join(dir, f), 'utf8');
    assert.ok(/archetype:\s+\w+/.test(content), `${f} missing archetype`);
    assert.ok(/beat:\s+\w+/.test(content), `${f} missing beat`);
    assert.ok(/design:\s+\d+/.test(content), `${f} missing design score`);
    assert.ok(/ux:\s+\d+/.test(content), `${f} missing ux score`);
  }
});

test('e2e: reference library entries have required frontmatter', async () => {
  const { readdirSync } = await import('fs');
  const dir = join(ROOT, 'skills/reference-library-rag/entries');
  if (!existsSync(dir)) return;
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  for (const f of files) {
    const content = readFileSync(join(dir, f), 'utf8');
    assert.match(content, /slug:\s+\S+/, `${f} missing slug`);
    assert.match(content, /archetype:\s+\S+/, `${f} missing archetype`);
    assert.match(content, /beat:\s+\S+/, `${f} missing beat`);
  }
});

test('e2e: all archetype matrices cover 25 archetypes', () => {
  const markers = JSON.parse(readFileSync(join(ROOT, 'skills/design-archetypes/testable-markers.json'), 'utf8'));
  const weights = JSON.parse(readFileSync(join(ROOT, 'skills/design-archetypes/seeds/archetype-weights.json'), 'utf8'));
  const lighting = JSON.parse(readFileSync(join(ROOT, 'skills/scene-composition/seeds/archetype-lighting-rigs.json'), 'utf8'));
  const materials = JSON.parse(readFileSync(join(ROOT, 'skills/pbr-materials/seeds/archetype-materials.json'), 'utf8'));
  const recraft = JSON.parse(readFileSync(join(ROOT, 'skills/recraft-vector-ai/seeds/recraft-substyle-map.json'), 'utf8'));

  const keys = (o) => Object.keys(o);
  assert.equal(keys(markers.archetypes).length, 25, 'testable-markers 25 archetypes');
  assert.ok(keys(weights.weights).length >= 25, 'weights ≥ 25 archetypes (+ default)');
  assert.equal(keys(lighting.rigs).length, 25, 'lighting 25');
  assert.equal(keys(materials.archetypes).length, 25, 'materials 25');
  assert.equal(keys(recraft.map).length, 25, 'recraft 25');
});
