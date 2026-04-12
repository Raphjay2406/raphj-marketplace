/**
 * PostToolUse Hook — Genorah v2.0
 *
 * Fires after: Write, Edit, Bash tool completions
 * Appends a metrics row to .planning/genorah/METRICS.md
 * Designed for minimal I/O — single appendFileSync per invocation.
 */

import { readFileSync, appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// Hoisted error-log helper: ensures .claude/ exists once, reused from both
// the normal flow and fatal-catch. Swallows its own errors (never crashes hook).
function logHookError(cwd, message) {
  try {
    const claudeDir = join(cwd, '.claude');
    if (!existsSync(claudeDir)) mkdirSync(claudeDir, { recursive: true });
    appendFileSync(join(claudeDir, 'hook-errors.log'),
      `[${new Date().toISOString()}] post-tool-use: ${message}\n`);
  } catch { /* swallow */ }
}

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const { tool_name, tool_input } = input;

  // Resolve the project working directory (cwd of the process)
  const cwd = process.cwd();
  const planningDir = join(cwd, '.planning', 'genorah');

  // Gate: only track if .planning/genorah/ exists
  if (!existsSync(planningDir)) {
    process.stdout.write('{}');
    process.exit(0);
  }

  // Extract target info
  let target = '';
  if (tool_name === 'Write' || tool_name === 'Edit') {
    target = tool_input?.file_path || '';
  } else if (tool_name === 'Bash') {
    const cmd = tool_input?.command || '';
    target = cmd.length > 80 ? cmd.slice(0, 80) + '...' : cmd;
  }

  const metricsFile = join(planningDir, 'METRICS.md');
  const timestamp = new Date().toISOString();
  const header = `# Build Metrics\n\n| Timestamp | Tool | Target | Status |\n|-----------|------|--------|--------|\n`;

  // Create file with header if it doesn't exist (atomic: check-then-write)
  if (!existsSync(metricsFile)) {
    try {
      writeFileSync(metricsFile, header, { flag: 'wx' }); // wx = fail if exists (race-safe)
    } catch {
      // Another process created it first — that's fine, proceed to append.
    }
  }

  // Append row (escape pipe characters in target to prevent table corruption)
  const safeTarget = target.replace(/\|/g, '\\|');
  try {
    appendFileSync(metricsFile, `| ${timestamp} | ${tool_name} | ${safeTarget} | OK |\n`);
  } catch (err) {
    logHookError(cwd, `append failed: ${err.message}`);
  }

  process.stdout.write('{}');
} catch (err) {
  logHookError(process.cwd(), `fatal: ${err.message}`);
  process.stdout.write('{}');
}
