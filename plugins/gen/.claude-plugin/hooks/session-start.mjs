/**
 * SessionStart Hook — Genorah v2.0
 *
 * Fires on: startup, resume, clear, compact
 * Reads project state from .planning/genorah/ and injects context.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const event = input.event || 'startup';
  const cwd = process.cwd();

  const planningDir = join(cwd, '.planning', 'genorah');
  const contextFile = join(planningDir, 'CONTEXT.md');
  const stateFile = join(planningDir, 'STATE.md');
  const serverInfoFile = join(planningDir, 'companion', '.server-info');

  let additionalContext = '';

  if (existsSync(planningDir)) {
    if (existsSync(contextFile)) {
      // Extract first 80 lines as compressed project state
      const contextRaw = readFileSync(contextFile, 'utf8');
      const contextLines = contextRaw.split('\n').slice(0, 80).join('\n');
      additionalContext += `<!-- genorah:session-context -->\n`;
      additionalContext += `## Genorah Project State (auto-loaded)\n\n`;
      additionalContext += contextLines + '\n';

      // Check STATE.md for current phase/wave
      if (existsSync(stateFile)) {
        const stateRaw = readFileSync(stateFile, 'utf8');
        const phaseMatch = stateRaw.match(/^##?\s*.*phase[:\s]*(.*)/im);
        const waveMatch = stateRaw.match(/^##?\s*.*wave[:\s]*(.*)/im);
        const currentPhase = phaseMatch ? phaseMatch[1].trim() : null;
        const currentWave = waveMatch ? waveMatch[1].trim() : null;

        if (currentPhase || currentWave) {
          additionalContext += `\n### Execution State\n`;
          if (currentPhase) additionalContext += `- **Phase:** ${currentPhase}\n`;
          if (currentWave) additionalContext += `- **Wave:** ${currentWave}\n`;
        }
      }

      // Check companion server info
      if (existsSync(serverInfoFile)) {
        const serverInfo = readFileSync(serverInfoFile, 'utf8').trim();
        if (serverInfo && serverInfo !== 'server-stopped') {
          additionalContext += `\n### Companion Server\n`;
          additionalContext += `- **URL:** ${serverInfo}\n`;
        }
      }
    } else {
      // Planning dir exists but no CONTEXT.md
      additionalContext += `<!-- genorah:no-context -->\n`;
      additionalContext += `Genorah project directory exists at \`.planning/genorah/\` but no CONTEXT.md found. `;
      additionalContext += `Use \`/gen:start-project\` to begin.\n`;
    }
  } else {
    // No planning directory at all — getting started guidance
    additionalContext += `<!-- genorah:no-project -->\n`;
    additionalContext += `## No Genorah Project\n\n`;
    additionalContext += `No \`.planning/genorah/\` directory found in this workspace. Available commands:\n\n`;
    additionalContext += `- \`/gen:start-project\` — Discovery, research, archetype selection, Design DNA generation\n`;
    additionalContext += `- \`/gen:discuss\` — Creative deep dive for a specific phase\n`;
    additionalContext += `- \`/gen:plan\` — Generate implementation plan (PLAN.md) for a phase\n`;
    additionalContext += `- \`/gen:build\` — Execute wave-based implementation\n`;
    additionalContext += `- \`/gen:iterate\` — Design refinement or bug diagnosis\n`;
    additionalContext += `- \`/gen:audit\` — Run quality gate audit\n`;
    additionalContext += `- \`/gen:bugfix\` — Diagnostic root cause analysis\n`;
    additionalContext += `- \`/gen:status\` — Show current project status\n`;
    additionalContext += `\nStart with \`/gen:start-project\` to create a new project.\n`;
  }

  // On resume, suggest canary check
  if (event === 'resume') {
    additionalContext += `\n### Resume Notice\n`;
    additionalContext += `Session resumed. Consider running a canary check: verify CONTEXT.md matches `;
    additionalContext += `the current codebase state to detect context integrity drift.\n`;
  }

  additionalContext += `<!-- /genorah:session-context -->\n`;

  const response = {};
  if (additionalContext) {
    response.additionalContext = additionalContext;
  }

  process.stdout.write(JSON.stringify(response));
} catch (err) {
  // Never crash — output empty response on error
  process.stdout.write(JSON.stringify({}));
}
