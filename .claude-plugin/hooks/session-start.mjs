/**
 * SessionStart Hook — Genorah v2.0
 *
 * Fires on: startup, resume, clear, compact
 * Reads project state from .planning/genorah/ and injects context.
 */

import { readFileSync, existsSync, renameSync, mkdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const event = input.event || 'startup';
  const cwd = process.cwd();

  const planningDir = join(cwd, '.planning', 'genorah');
  const legacyDir = join(cwd, '.planning', 'modulo');
  const contextFile = join(planningDir, 'CONTEXT.md');
  const stateFile = join(planningDir, 'STATE.md');
  const serverInfoFile = join(planningDir, 'companion', '.server-info');

  let additionalContext = '';
  let migrated = false;

  // Auto-migrate legacy .planning/modulo/ → .planning/genorah/
  if (!existsSync(planningDir) && existsSync(legacyDir)) {
    try {
      renameSync(legacyDir, planningDir);
      migrated = true;
    } catch {
      // Rename failed (e.g., cross-device) — notify user to run /gen:migrate
      additionalContext += `<!-- genorah:migration-needed -->\n`;
      additionalContext += `## Legacy Project Detected\n\n`;
      additionalContext += `Found \`.planning/modulo/\` from a previous Modulo version. `;
      additionalContext += `Auto-migration failed. Run \`/gen:migrate\` to migrate manually.\n`;
    }
  }

  if (migrated) {
    additionalContext += `<!-- genorah:auto-migrated -->\n`;
    additionalContext += `## Project Auto-Migrated\n\n`;
    additionalContext += `Migrated \`.planning/modulo/\` → \`.planning/genorah/\` automatically. `;
    additionalContext += `All existing project state (DNA, plans, sections, context) preserved. `;
    additionalContext += `Internal file references using old paths may need updating — run \`/gen:migrate\` for a full reference audit.\n\n`;
  }

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

      // --- Vault drift detection ---
      const vaultDir = join(planningDir, 'vault');
      const localConfigFile = join(cwd, '.claude', 'genorah.local.md');

      let vaultPath = null;
      let vaultSync = 'manual';
      let obsidianInstalled = false;

      // Read local config
      if (existsSync(localConfigFile)) {
        try {
          const localConfig = readFileSync(localConfigFile, 'utf8');
          const vpMatch = localConfig.match(/^vault_path:\s*(.+)/m);
          const vsMatch = localConfig.match(/^vault_sync:\s*(.+)/m);
          const oiMatch = localConfig.match(/^obsidian_installed:\s*(.+)/m);
          if (vpMatch) vaultPath = vpMatch[1].trim();
          if (vsMatch) vaultSync = vsMatch[1].trim();
          if (oiMatch) obsidianInstalled = oiMatch[1].trim() === 'true';
        } catch {
          // Config read failed — skip vault detection
        }
      }

      // Report vault status
      if (existsSync(vaultDir)) {
        additionalContext += `\n### Obsidian Vault\n`;
        additionalContext += `- **Project Vault:** \`.planning/genorah/vault/\` (exists)\n`;
        if (vaultPath) {
          additionalContext += `- **Knowledge Base:** ${vaultPath}\n`;
        }
        additionalContext += `- **Sync Mode:** ${vaultSync}\n`;
        if (obsidianInstalled) {
          additionalContext += `- **Obsidian:** Installed (MCP servers available)\n`;
        }

        // Check vault freshness by comparing _index.md mtime to STATE.md mtime
        try {
          const indexFile = join(vaultDir, '_index.md');
          if (existsSync(indexFile) && existsSync(stateFile)) {
            const indexMtime = statSync(indexFile).mtimeMs;
            const stateMtime = statSync(stateFile).mtimeMs;
            if (stateMtime - indexMtime > 0) {
              additionalContext += `- **Drift Warning:** Vault is behind project state. Run \`/gen:export\` to sync.\n`;
            }
          }
        } catch {
          // Drift check failed — skip silently
        }
      } else if (vaultPath) {
        additionalContext += `\n### Obsidian Vault\n`;
        additionalContext += `- **Knowledge Base:** ${vaultPath} (configured)\n`;
        additionalContext += `- **Project Vault:** Not yet created. Run \`/gen:export\` to generate.\n`;
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
