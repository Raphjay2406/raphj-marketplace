import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chdir, cwd } from 'node:process';
import { append, readAll, verify } from '../scripts/ingest/preservation-ledger.mjs';

function inSandbox(fn) {
  const origCwd = cwd();
  const dir = mkdtempSync(join(tmpdir(), 'genorah-ingest-'));
  chdir(dir);
  try { return fn(dir); }
  finally { chdir(origCwd); rmSync(dir, { recursive: true, force: true }); }
}

test('ledger: append + readAll roundtrip', () => {
  inSandbox(() => {
    append('p', { kind: 'capture.file', path: 'source/a.txt', bytes: 10, sha256: 'x' });
    append('p', { kind: 'dna.extract', token: 'color.primary', value: '#000', confidence: 0.9, method: 'css-var' });
    const all = readAll('p');
    assert.equal(all.length, 2);
    assert.equal(all[0].kind, 'capture.file');
    assert.equal(all[1].token, 'color.primary');
  });
});

test('ledger: verify flags asset without license or gap', () => {
  inSandbox(() => {
    append('t1', { kind: 'asset.download', url: 'https://x', sha256: 's1', preserved_at: 'assets/s1.jpg', license: 'unknown' });
    const r = verify('t1');
    assert.equal(r.verdict, 'BLOCK');
    assert.ok(r.findings.some(f => f.kind === 'asset.unlicensed-no-gap'));
  });
});

test('ledger: verify passes when asset has paired gap', () => {
  inSandbox(() => {
    append('t2', { kind: 'asset.download', url: 'https://x', sha256: 's1', preserved_at: 'assets/s1.jpg', license: 'unknown' });
    append('t2', { kind: 'gap', reason: 'license-unknown', asset: 'assets/s1.jpg' });
    const r = verify('t2');
    assert.equal(r.verdict, 'PASS');
  });
});

test('ledger: verify blocks low-confidence dna without paired gap', () => {
  inSandbox(() => {
    append('t3', { kind: 'dna.extract', token: 'color.primary', value: '#000', confidence: 0.3, method: 'kmeans' });
    const r = verify('t3');
    assert.equal(r.verdict, 'BLOCK');
    assert.ok(r.findings.some(f => f.kind === 'dna.low-confidence-no-gap'));
  });
});

test('ledger: append requires event.kind', () => {
  inSandbox(() => {
    assert.throws(() => append('t4', {}), /event\.kind/);
  });
});

test('ledger: content.extract with invalid destination flags BLOCK', () => {
  inSandbox(() => {
    append('t5', { kind: 'content.extract', selector: 'h1', text: 'x', destination: 'wrong.md:hero.title' });
    const r = verify('t5');
    assert.equal(r.verdict, 'BLOCK');
    assert.ok(r.findings.some(f => f.kind === 'content.extract'));
  });
});

test('ledger: content.extract with valid CONTENT.md destination passes', () => {
  inSandbox(() => {
    append('t6', { kind: 'content.extract', selector: 'h1', text: 'x', destination: 'CONTENT.md:hero.title' });
    const r = verify('t6');
    assert.equal(r.verdict, 'PASS');
  });
});
