#!/usr/bin/env node
/**
 * ledger-write — v3.5 Context Fabric (L4)
 *
 * Append one NDJSON line to .planning/genorah/journal.ndjson.
 *
 * Usage:
 *   node scripts/ledger-write.mjs <actor> <kind> <subject> [payload-json] [refs-json]
 *
 * Example:
 *   node scripts/ledger-write.mjs judge variant-scored hero/variant-3 '{"design":187,"ux":94}' '["sections/hero/trajectory.json#it3"]'
 *
 * Writes with O_APPEND for multi-process safety. Rotates at 50MB → archive/journal-YYYYMMDD.ndjson.
 */
import { appendFileSync, statSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { argv, exit, stderr } from 'node:process';

const [, , actor, kind, subject, payloadRaw = '{}', refsRaw = '[]'] = argv;

if (!actor || !kind || !subject) {
  stderr.write('usage: ledger-write <actor> <kind> <subject> [payload-json] [refs-json]\n');
  exit(2);
}

const VALID_ACTORS = new Set([
  'orchestrator', 'planner', 'builder', 'quality-reviewer',
  'judge', 'critic', 'ux-probe', 'visual-refiner',
  'polisher', 'consistency-auditor', 'user'
]);
if (!VALID_ACTORS.has(actor) && !actor.startsWith('hook:') && !actor.startsWith('agent:')) {
  stderr.write(`ledger-write: unknown actor '${actor}'; allowed: ${[...VALID_ACTORS].join(', ')}, hook:*, agent:*\n`);
  exit(2);
}

let payload, refs;
try {
  payload = JSON.parse(payloadRaw);
  refs = JSON.parse(refsRaw);
  if (!Array.isArray(refs)) throw new Error('refs must be array');
} catch (e) {
  stderr.write(`ledger-write: invalid JSON — ${e.message}\n`);
  exit(2);
}

const LEDGER_DIR = '.planning/genorah';
const LEDGER_PATH = join(LEDGER_DIR, 'journal.ndjson');
const ARCHIVE_DIR = join(LEDGER_DIR, 'archive');
const ROTATE_BYTES = 50 * 1024 * 1024;

if (!existsSync(LEDGER_DIR)) mkdirSync(LEDGER_DIR, { recursive: true });

// Rotate if > 50MB
try {
  const s = statSync(LEDGER_PATH);
  if (s.size > ROTATE_BYTES) {
    if (!existsSync(ARCHIVE_DIR)) mkdirSync(ARCHIVE_DIR, { recursive: true });
    const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    renameSync(LEDGER_PATH, join(ARCHIVE_DIR, `journal-${dateTag}.ndjson`));
  }
} catch {
  // doesn't exist yet — fine
}

const line = JSON.stringify({
  ts: new Date().toISOString(),
  actor,
  kind,
  subject,
  payload,
  refs,
}) + '\n';

appendFileSync(LEDGER_PATH, line, { encoding: 'utf8' });
