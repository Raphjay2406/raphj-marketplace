/**
 * SessionEnd Hook — Genorah v2.0
 *
 * Fires on: session end / stop
 * Generates SESSION-LOG.md for cross-session continuity.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

try {
  // Read input from stdin (hook protocol)
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const cwd = process.cwd();

  const planningDir = join(cwd, '.planning', 'genorah');

  // If no planning directory, nothing to do
  if (!existsSync(planningDir)) {
    process.stdout.write(JSON.stringify({}));
    process.exit(0);
  }

  const stateFile = join(planningDir, 'STATE.md');
  const contextFile = join(planningDir, 'CONTEXT.md');
  const decisionsFile = join(planningDir, 'DECISIONS.md');

  // --- Extract phase and wave from STATE.md ---
  let phase = 'unknown';
  let wave = 'unknown';
  let statePending = [];

  if (existsSync(stateFile)) {
    try {
      const stateRaw = readFileSync(stateFile, 'utf8');
      const phaseMatch = stateRaw.match(/^##?\s*.*phase[:\s]*(.*)/im);
      const waveMatch = stateRaw.match(/^##?\s*.*wave[:\s]*(.*)/im);
      if (phaseMatch) phase = phaseMatch[1].trim();
      if (waveMatch) wave = waveMatch[1].trim();

      // Extract pending items (lines with [ ] or "pending" status)
      const pendingLines = stateRaw.split('\n').filter(
        (line) => /\[\s\]/.test(line) || /pending/i.test(line)
      );
      statePending = pendingLines.slice(0, 5).map((l) => l.trim());
    } catch (_) {
      // Ignore read errors
    }
  }

  // --- Read first 40 lines of CONTEXT.md ---
  let contextSummary = '';
  if (existsSync(contextFile)) {
    try {
      const contextRaw = readFileSync(contextFile, 'utf8');
      contextSummary = contextRaw.split('\n').slice(0, 40).join('\n');
    } catch (_) {
      // Ignore read errors
    }
  }

  // --- Read last 5 decision entries from DECISIONS.md ---
  let recentDecisions = [];
  if (existsSync(decisionsFile)) {
    try {
      const decisionsRaw = readFileSync(decisionsFile, 'utf8');
      // Decisions are typically markdown list items or headed sections
      // Match lines starting with "- " or "### " as entry markers
      const entries = [];
      let currentEntry = '';
      for (const line of decisionsRaw.split('\n')) {
        if (/^(?:###?\s|-\s\*\*|>\s)/.test(line) && currentEntry) {
          entries.push(currentEntry.trim());
          currentEntry = line;
        } else {
          currentEntry += (currentEntry ? '\n' : '') + line;
        }
      }
      if (currentEntry.trim()) entries.push(currentEntry.trim());

      recentDecisions = entries.slice(-5);
    } catch (_) {
      // Ignore read errors
    }
  }

  // --- Generate SESSION-LOG.md ---
  const now = new Date();
  const isoDate = now.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');

  let decisionsBlock = 'No decisions recorded';
  if (recentDecisions.length > 0) {
    decisionsBlock = recentDecisions
      .map((d) => {
        // Ensure each entry is a list item
        const firstLine = d.split('\n')[0];
        return firstLine.startsWith('-') ? firstLine : `- ${firstLine}`;
      })
      .join('\n');
  }

  let nextActions = '- Review STATE.md for pending work';
  if (statePending.length > 0) {
    nextActions = statePending
      .map((item) => {
        // Clean up to bullet format
        const cleaned = item.replace(/^-\s*\[\s\]\s*/, '').replace(/^-\s*/, '');
        return `- ${cleaned}`;
      })
      .join('\n');
  }

  // --- Check if vault export is stale ---
  let vaultStatus = '';
  const vaultDir = join(planningDir, 'vault');
  const localConfigFile = join(cwd, '.claude', 'genorah.local.md');

  if (existsSync(vaultDir)) {
    const indexFile = join(vaultDir, '_index.md');
    if (existsSync(indexFile) && existsSync(stateFile)) {
      try {
        const indexMtime = statSync(indexFile).mtimeMs;
        const stateMtime = statSync(stateFile).mtimeMs;
        if (stateMtime > indexMtime) {
          vaultStatus = '\n- Vault is behind project state — run `/gen:export` next session';
        }
      } catch {
        // Skip vault status on error
      }
    }
  }

  // --- Check for project completion → knowledge base accumulation reminder ---
  let knowledgeBaseHint = '';
  if (phase.toLowerCase().includes('complete') || phase.toLowerCase().includes('done')) {
    knowledgeBaseHint = `\n## Knowledge Base\n- Project appears complete. Run \`/gen:export --full\` to accumulate project history to Knowledge Base.\n`;
  }

  const sessionLog = `# Session Log — ${isoDate}

## Accomplished
- Session state captured at ${phase} / ${wave}

## Current State
- Phase: ${phase}
- Wave: ${wave}${vaultStatus}

## Recent Decisions
${decisionsBlock}
${knowledgeBaseHint}
## Next Actions
${nextActions}
`;

  writeFileSync(join(planningDir, 'SESSION-LOG.md'), sessionLog, 'utf8');

  // Stop hooks don't inject context
  process.stdout.write(JSON.stringify({}));
} catch (err) {
  // Never crash — output empty response on error
  process.stdout.write(JSON.stringify({}));
}
