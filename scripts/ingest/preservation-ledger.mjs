#!/usr/bin/env node
// v3.21 preservation ledger — append-only NDJSON per ingested project slug.
// API: append(slug, event), readAll(slug), verify(slug).

import { mkdirSync, appendFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = () => join(process.cwd(), '.planning', 'genorah', 'ingested');

export function ledgerPath(slug) {
  return join(BASE(), slug, 'preservation.ledger.ndjson');
}

export function append(slug, event) {
  if (!event || typeof event.kind !== 'string') throw new Error('event.kind required');
  const dir = join(BASE(), slug);
  mkdirSync(dir, { recursive: true });
  const entry = { ts: new Date().toISOString(), ...event };
  appendFileSync(ledgerPath(slug), JSON.stringify(entry) + '\n');
  return entry;
}

export function readAll(slug) {
  const p = ledgerPath(slug);
  if (!existsSync(p)) return [];
  return readFileSync(p, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

export function verify(slug) {
  const events = readAll(slug);
  const findings = [];
  const captures = new Set();
  const assets = new Map(); // preserved_at → { licensed, gapLogged }
  const contentExtracts = [];
  const dnaLow = [];
  const gaps = new Set();

  for (const e of events) {
    switch (e.kind) {
      case 'capture.file': captures.add(e.path); break;
      case 'asset.download':
        assets.set(e.preserved_at, { licensed: e.license && e.license !== 'unknown', gapLogged: false });
        break;
      case 'gap':
        gaps.add(`${e.reason}:${e.asset || e.token || e.section || ''}`);
        if (e.reason === 'license-unknown' && e.asset && assets.has(e.asset)) {
          assets.get(e.asset).gapLogged = true;
        }
        break;
      case 'content.extract':
        contentExtracts.push(e);
        if (!e.destination || !e.destination.startsWith('CONTENT.md:')) {
          findings.push({ severity: 'BLOCK', kind: 'content.extract', reason: 'invalid destination', event: e });
        }
        break;
      case 'dna.extract':
        if (typeof e.confidence === 'number' && e.confidence < 0.5) dnaLow.push(e);
        break;
    }
  }

  // Asset invariant: every asset needs either confirmed license or paired gap
  for (const [path, state] of assets) {
    if (!state.licensed && !state.gapLogged) {
      findings.push({ severity: 'BLOCK', kind: 'asset.unlicensed-no-gap', asset: path });
    }
  }

  // DNA invariant: every low-confidence extract needs a paired gap
  for (const d of dnaLow) {
    const expected = `dna-low-confidence:${d.token}`;
    if (!gaps.has(expected)) {
      findings.push({ severity: 'BLOCK', kind: 'dna.low-confidence-no-gap', token: d.token, confidence: d.confidence });
    }
  }

  return {
    slug,
    events: events.length,
    captures: captures.size,
    assets: assets.size,
    contentExtracts: contentExtracts.length,
    gaps: gaps.size,
    findings,
    verdict: findings.length === 0 ? 'PASS' : 'BLOCK',
  };
}

// CLI
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('preservation-ledger.mjs')) {
  const cmd = process.argv[2];
  const slug = process.argv[3];
  if (cmd === 'verify' && slug) {
    const result = verify(slug);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.verdict === 'PASS' ? 0 : 2);
  } else if (cmd === 'read' && slug) {
    for (const e of readAll(slug)) console.log(JSON.stringify(e));
  } else if (cmd === 'append' && slug) {
    const event = JSON.parse(process.argv[4] || '{}');
    console.log(JSON.stringify(append(slug, event)));
  } else {
    console.error('Usage: preservation-ledger.mjs <verify|read|append> <slug> [event-json]');
    process.exit(1);
  }
}
