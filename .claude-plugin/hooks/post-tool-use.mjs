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

  // Create file with header if it doesn't exist
  if (!existsSync(metricsFile)) {
    writeFileSync(metricsFile, `# Build Metrics\n\n| Timestamp | Tool | Target | Status |\n|-----------|------|--------|--------|\n`);
  }

  // Append row (escape pipe characters in target to prevent table corruption)
  const safeTarget = target.replace(/\|/g, '\\|');
  appendFileSync(metricsFile, `| ${timestamp} | ${tool_name} | ${safeTarget} | OK |\n`);

  process.stdout.write('{}');
} catch {
  // Never crash — output empty response on error
  process.stdout.write('{}');
}
