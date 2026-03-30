/**
 * PreCompact Hook — Genorah v2.0
 *
 * Fires when Claude's context window fills and compaction occurs.
 * Injects ~800 tokens of critical project state to survive compression.
 *
 * Protocol: Read JSON from stdin, output JSON with additionalContext to stdout.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/** Read a file safely, returning empty string on any error. */
function safeRead(filePath) {
  try {
    if (!existsSync(filePath)) return '';
    return readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

/** Take first N lines of text. */
function firstLines(text, n) {
  if (!text) return '';
  return text.split('\n').slice(0, n).join('\n');
}

/** Take last N non-empty lines of text. */
function lastNonEmptyLines(text, n) {
  if (!text) return '';
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  return lines.slice(-n).join('\n');
}

/** Truncate text to approximate token budget (1 token ~ 4 chars). */
function truncateTokens(text, maxTokens) {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n[truncated]';
}

/**
 * Extract compressed DNA summary from DESIGN-DNA.md:
 * - Lines containing hex color values (#xxx or #xxxxxx)
 * - Lines mentioning font names
 * - Lines mentioning compat tier
 * Target ~200 tokens.
 */
function extractDnaSummary(raw) {
  if (!raw) return '';
  const lines = raw.split('\n');
  const colorLines = [];
  const fontLines = [];
  const tierLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Hex color values
    if (/#[0-9a-fA-F]{3,8}\b/.test(trimmed)) {
      colorLines.push(trimmed);
    }
    // Font references (common patterns in DNA files)
    if (/font/i.test(trimmed) && !colorLines.includes(trimmed)) {
      fontLines.push(trimmed);
    }
    // Compat tier
    if (/compat|tier/i.test(trimmed) && !colorLines.includes(trimmed) && !fontLines.includes(trimmed)) {
      tierLines.push(trimmed);
    }
  }

  const parts = [];
  if (colorLines.length) parts.push(colorLines.join('\n'));
  if (fontLines.length) parts.push(fontLines.join('\n'));
  if (tierLines.length) parts.push(tierLines.join('\n'));

  return truncateTokens(parts.join('\n'), 200);
}

try {
  // Read stdin (hook protocol)
  readFileSync(0, 'utf8');

  const cwd = process.cwd();
  const planningDir = join(cwd, '.planning', 'genorah');

  // If no project directory, output empty response
  if (!existsSync(planningDir)) {
    process.stdout.write(JSON.stringify({}));
    process.exit(0);
  }

  // Read source files
  const contextRaw = safeRead(join(planningDir, 'CONTEXT.md'));
  const dnaRaw = safeRead(join(planningDir, 'DESIGN-DNA.md'));
  const stateRaw = safeRead(join(planningDir, 'STATE.md'));
  const designSystemRaw = safeRead(join(planningDir, 'DESIGN-SYSTEM.md'));
  const decisionsRaw = safeRead(join(planningDir, 'DECISIONS.md'));

  // Build sections
  const sections = [];

  sections.push('## Genorah Context (PreCompact Injection)');

  // DNA Anchor — compressed design DNA (~200 tokens)
  const dnaSummary = extractDnaSummary(dnaRaw);
  if (dnaSummary) {
    sections.push('### DNA Anchor');
    sections.push(truncateTokens(dnaSummary, 200));
  }

  // Build State — from CONTEXT.md (first 60 lines) + STATE.md (first 30 lines)
  const contextSnippet = firstLines(contextRaw, 60);
  const stateSnippet = firstLines(stateRaw, 30);
  if (contextSnippet || stateSnippet) {
    sections.push('### Build State');
    if (contextSnippet) sections.push(truncateTokens(contextSnippet, 200));
    if (stateSnippet) sections.push(truncateTokens(stateSnippet, 150));
  }

  // Component Registry — from DESIGN-SYSTEM.md (first 20 lines)
  const designSystemSnippet = firstLines(designSystemRaw, 20);
  if (designSystemSnippet) {
    sections.push('### Component Registry');
    sections.push(truncateTokens(designSystemSnippet, 100));
  }

  // Recent Decisions — last 5 non-empty lines
  const recentDecisions = lastNonEmptyLines(decisionsRaw, 5);
  if (recentDecisions) {
    sections.push('### Recent Decisions');
    sections.push(truncateTokens(recentDecisions, 100));
  }

  const additionalContext = sections.join('\n\n') + '\n';

  // Only output if we actually have content beyond the header
  if (sections.length > 1) {
    process.stdout.write(JSON.stringify({ additionalContext }));
  } else {
    process.stdout.write(JSON.stringify({}));
  }
} catch {
  // Never crash — output empty response on error
  process.stdout.write(JSON.stringify({}));
}
