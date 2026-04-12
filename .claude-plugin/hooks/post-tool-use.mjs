/**
 * PostToolUse Hook — Genorah v2.0
 *
 * Fires after: Write, Edit, Bash tool completions
 * Appends a metrics row to .planning/genorah/METRICS.md
 * Designed for minimal I/O — single appendFileSync per invocation.
 */

import { readFileSync, appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

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
    // Log append failure to .claude/hook-errors.log for diagnostics (silent to user)
    try {
      const errorLog = join(cwd, '.claude', 'hook-errors.log');
      if (!existsSync(join(cwd, '.claude'))) mkdirSync(join(cwd, '.claude'), { recursive: true });
      appendFileSync(errorLog, `[${timestamp}] post-tool-use append failed: ${err.message}\n`);
    } catch { /* swallow — never crash hook */ }
  }

  process.stdout.write('{}');
} catch (err) {
  // Never crash — output empty response on error, log for diagnostics
  try {
    const errorLog = join(process.cwd(), '.claude', 'hook-errors.log');
    const errDir = join(process.cwd(), '.claude');
    if (!existsSync(errDir)) mkdirSync(errDir, { recursive: true });
    appendFileSync(errorLog, `[${new Date().toISOString()}] post-tool-use fatal: ${err.message}\n`);
  } catch { /* swallow */ }
  process.stdout.write('{}');
}
