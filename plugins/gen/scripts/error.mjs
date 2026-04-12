#!/usr/bin/env node
/**
 * error.mjs — v3.5.6 structured error emission
 */
import { appendFileSync, mkdirSync, existsSync } from 'node:fs';
import { stderr } from 'node:process';

const LEDGER = '.planning/genorah/journal.ndjson';

export function emitError(code, opts = {}) {
  const { message, detail, evidence, recovery = [] } = opts;
  const msg = message || code.replace(/_/g, ' ').toLowerCase();

  const lines = [
    '',
    `❌ ${code}`,
    msg,
    '',
  ];
  if (recovery.length) {
    lines.push('Recovery:');
    recovery.forEach((r, i) => lines.push(`  ${i + 1}. ${r}`));
  }
  if (evidence) { lines.push(''); lines.push(`Evidence: ${evidence}`); }
  lines.push(`Docs: docs/troubleshooting/${code.toLowerCase().replace(/_/g, '-')}.md`);
  lines.push('');

  stderr.write(lines.join('\n'));

  // Ledger emit
  try {
    if (!existsSync('.planning/genorah')) mkdirSync('.planning/genorah', { recursive: true });
    appendFileSync(LEDGER, JSON.stringify({
      ts: new Date().toISOString(),
      actor: 'script:error',
      kind: 'error-surfaced',
      subject: code,
      payload: { code, class: code.split('_')[1], detail },
      refs: evidence ? [evidence] : [],
    }) + '\n');
  } catch { /* swallow */ }
}

// CLI: node scripts/error.mjs CODE "message"
if (import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/'))) {
  const [, , code, ...msgParts] = process.argv;
  if (code) emitError(code, { message: msgParts.join(' ') });
}
