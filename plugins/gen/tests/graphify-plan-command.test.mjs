import { test } from 'node:test';
import assert from 'node:assert';
import { planCommand } from '../scripts/graphify/plan-command.mjs';

const OK = { available: true, graphExists: true, ageMs: 5000 };
const NO = { available: false, graphExists: false, ageMs: null };

test('scan maps to graphify update .', () => {
  const p = planCommand('scan', [], OK);
  assert.equal(p.kind, 'exec');
  assert.deepEqual(p.exec, ['graphify', ['update', '.']]);
});

test('scan errors with install hint when graphify unavailable', () => {
  const p = planCommand('scan', [], NO);
  assert.equal(p.kind, 'error');
  assert.match(p.message, /install/i);
});

test('query needs text and maps to graphify query', () => {
  assert.equal(planCommand('query', [], OK).kind, 'error');
  const p = planCommand('query', ['how does build work'], OK);
  assert.deepEqual(p.exec, ['graphify', ['query', 'how does build work']]);
});

test('path maps to graphify path A B', () => {
  const p = planCommand('path', ['NodeA', 'NodeB'], OK);
  assert.deepEqual(p.exec, ['graphify', ['path', 'NodeA', 'NodeB']]);
});

test('status is info and reports availability + graph state', () => {
  const p = planCommand('status', [], OK);
  assert.equal(p.kind, 'info');
  assert.match(p.message, /available/i);
  assert.match(p.message, /graph/i);
});

test('install execs uv when absent, info when present', () => {
  assert.deepEqual(planCommand('install', [], NO).exec, ['uv', ['tool', 'install', 'graphifyy']]);
  assert.equal(planCommand('install', [], OK).kind, 'info');
});

test('unknown subcommand errors', () => {
  assert.equal(planCommand('frobnicate', [], OK).kind, 'error');
});
