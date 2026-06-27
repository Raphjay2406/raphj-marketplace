// .claude-plugin/hooks/verify-gate.mjs
import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

function logErr(cwd, msg) {
  try {
    const d = join(cwd, '.claude');
    if (!existsSync(d)) mkdirSync(d, { recursive: true });
    appendFileSync(join(d, 'hook-errors.log'), `[${new Date().toISOString()}] verify-gate: ${msg}\n`);
  } catch { /* swallow */ }
}

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const { tool_name, tool_input } = input;
  const cwd = process.cwd();
  const planningDir = join(cwd, '.planning', 'genorah');
  if (!existsSync(planningDir)) { process.stdout.write('{}'); process.exit(0); }

  const hookDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(hookDir, '..', '..');
  const { gateDecision } = await import(`file://${join(repoRoot, 'scripts/verify/gate-decision.mjs')}`);

  const target = (tool_name === 'Write' || tool_name === 'Edit') ? (tool_input?.file_path || '') : '';
  const decision = gateDecision({ planningDir, target });
  if (decision.block) { process.stderr.write(decision.reason); process.exit(2); }
  process.stdout.write('{}');
} catch (err) {
  logErr(process.cwd(), `fatal: ${err.message}`);
  process.stdout.write('{}'); // fail-open on hook crash; never wedge the session
}
