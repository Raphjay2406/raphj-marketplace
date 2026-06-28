import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { readSelection } from '../scripts/companion/read-selection.mjs';

function eventsFile(lines) {
  const dir = mkdtempSync(join(tmpdir(), 'cmp-ev-'));
  const p = join(dir, '.events');
  writeFileSync(p, lines.map(l => JSON.stringify({ type: 'ws-message', ts: 't', data: l })).join('\n') + '\n');
  return p;
}

test('missing file → empty selection', () => {
  const r = readSelection(join(tmpdir(), 'nope-cmp', '.events'), {});
  assert.deepEqual(r, { choices: [], labels: [] });
});

test('single-select: last selected click wins', () => {
  // NOTE: server.cjs wraps the client message under `data`
  const p = eventsFile([
    { type: 'click', choice: 'a', text: 'Aurora', selected: true, timestamp: 1 },
    { type: 'click', choice: 'b', text: 'Brutal', selected: true, timestamp: 2 },
  ]);
  const r = readSelection(p, { multiselect: false });
  assert.deepEqual(r.choices, ['b']);
  assert.deepEqual(r.labels, ['Brutal']);
});

test('deselect (selected:false) clears a single-select pick', () => {
  const p = eventsFile([
    { type: 'click', choice: 'a', text: 'Aurora', selected: true, timestamp: 1 },
    { type: 'click', choice: 'a', text: 'Aurora', selected: false, timestamp: 2 },
  ]);
  assert.deepEqual(readSelection(p, {}).choices, []);
});

test('multi-select: all choices whose latest event is selected', () => {
  const p = eventsFile([
    { type: 'click', choice: 'x', text: 'X', selected: true, timestamp: 1 },
    { type: 'click', choice: 'y', text: 'Y', selected: true, timestamp: 2 },
    { type: 'click', choice: 'x', text: 'X', selected: false, timestamp: 3 },
  ]);
  const r = readSelection(p, { multiselect: true });
  assert.deepEqual(r.choices.sort(), ['y']);
});
