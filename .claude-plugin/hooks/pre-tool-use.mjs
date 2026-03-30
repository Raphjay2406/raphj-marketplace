/**
 * PreToolUse Hook — Genorah v2.0
 *
 * Fires on: Write, Edit, Bash tool invocations
 * Scans skills/ for matching SKILL.md files based on pathPatterns / bashPatterns
 * in YAML frontmatter, deduplicates per session, and injects skill content as
 * additionalContext.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename, dirname, resolve } from 'path';
import { createHash } from 'crypto';
import { tmpdir } from 'os';

const MAX_SKILLS = 3;
const MAX_BYTES = 18000;

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const { tool_name, tool_input, session_id } = input;

  // Determine the plugin root (one level up from hooks dir)
  const hookDir = dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
  const pluginRoot = resolve(hookDir, '..');
  const repoRoot = resolve(pluginRoot, '..');
  const skillsDir = join(repoRoot, 'skills');

  // Determine target path or command
  let targetPath = null;
  let targetCommand = null;

  if (tool_name === 'Write' || tool_name === 'Edit') {
    targetPath = tool_input?.file_path || null;
  } else if (tool_name === 'Bash') {
    targetCommand = tool_input?.command || null;
  }

  // If no target to match against, bail early
  if (!targetPath && !targetCommand) {
    process.stdout.write(JSON.stringify({}));
    process.exit(0);
  }

  // Session dedup: track injected skills per session
  const sessionHash = createHash('sha256').update(session_id || 'default').digest('hex').slice(0, 16);
  const dedupDir = join(tmpdir(), 'genorah-hooks');
  const dedupFile = join(dedupDir, `session-${sessionHash}.json`);

  let injectedSkills = new Set();
  try {
    if (!existsSync(dedupDir)) {
      mkdirSync(dedupDir, { recursive: true });
    }
    if (existsSync(dedupFile)) {
      const raw = readFileSync(dedupFile, 'utf8');
      injectedSkills = new Set(JSON.parse(raw));
    }
  } catch {
    // Dedup file corrupt — start fresh
    injectedSkills = new Set();
  }

  // Scan skills directory
  if (!existsSync(skillsDir)) {
    process.stdout.write(JSON.stringify({}));
    process.exit(0);
  }

  const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_'))
    .map(d => d.name);

  /**
   * Parse YAML frontmatter from a SKILL.md file.
   * Returns an object with extracted fields, or null on failure.
   */
  function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;

    const yaml = match[1];
    const result = { priority: 5, pathPatterns: [], bashPatterns: [] };

    // Extract simple scalar fields
    const nameMatch = yaml.match(/^name:\s*(.+)/m);
    if (nameMatch) result.name = nameMatch[1].trim().replace(/^["']|["']$/g, '');

    const priorityMatch = yaml.match(/^priority:\s*(\d+)/m);
    if (priorityMatch) result.priority = parseInt(priorityMatch[1], 10);

    const tierMatch = yaml.match(/^tier:\s*(.+)/m);
    if (tierMatch) result.tier = tierMatch[1].trim().replace(/^["']|["']$/g, '');

    // Extract metadata block arrays (pathPatterns, bashPatterns)
    const metadataMatch = yaml.match(/^metadata:\s*\n((?:\s{2,}.+\n?)*)/m);
    if (metadataMatch) {
      const metaBlock = metadataMatch[1];

      // Extract pathPatterns
      const pathPatternsMatch = metaBlock.match(/pathPatterns:\s*\n((?:\s+-\s+.+\n?)*)/);
      if (pathPatternsMatch) {
        result.pathPatterns = pathPatternsMatch[1]
          .split('\n')
          .map(line => line.match(/^\s+-\s+['"]?(.+?)['"]?\s*$/))
          .filter(Boolean)
          .map(m => m[1]);
      }

      // Extract bashPatterns
      const bashPatternsMatch = metaBlock.match(/bashPatterns:\s*\n((?:\s+-\s+.+\n?)*)/);
      if (bashPatternsMatch) {
        result.bashPatterns = bashPatternsMatch[1]
          .split('\n')
          .map(line => line.match(/^\s+-\s+['"]?(.+?)['"]?\s*$/))
          .filter(Boolean)
          .map(m => m[1]);
      }
    }

    return result;
  }

  /**
   * Convert a simple glob pattern to a regex.
   * Supports * (anything except /) and ** (anything including /).
   */
  function globToRegex(pattern) {
    let re = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')  // escape regex chars (not * and ?)
      .replace(/\*\*/g, '{{GLOBSTAR}}')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '[^/]')
      .replace(/\{\{GLOBSTAR\}\}/g, '.*');
    return new RegExp(`^${re}$`, 'i');
  }

  /**
   * Check if a file path matches any of the given glob patterns.
   */
  function matchesPath(filePath, patterns) {
    if (!filePath || patterns.length === 0) return false;
    const base = basename(filePath);
    const normalized = filePath.replace(/\\/g, '/');
    return patterns.some(p => {
      const re = globToRegex(p);
      return re.test(base) || re.test(normalized);
    });
  }

  /**
   * Check if a command matches any of the given regex patterns.
   */
  function matchesCommand(command, patterns) {
    if (!command || patterns.length === 0) return false;
    return patterns.some(p => {
      try {
        return new RegExp(p).test(command);
      } catch {
        return false;
      }
    });
  }

  /**
   * Parse restricted_paths from a skill's constraints frontmatter block.
   * Returns an array of path patterns, or empty array if none found.
   */
  function parseConstraintPaths(content) {
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return [];

    const yaml = fmMatch[1];
    const constraintsMatch = yaml.match(/^constraints:\s*\n((?:\s{2,}.+\n?)*)/m);
    if (!constraintsMatch) return [];

    const block = constraintsMatch[1];
    const rpMatch = block.match(/restricted_paths:\s*\[([^\]]*)\]/);
    if (rpMatch) {
      // Inline array format: ["path1", "path2"]
      return rpMatch[1]
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }

    // YAML list format
    const rpListMatch = block.match(/restricted_paths:\s*\n((?:\s+-\s+.+\n?)*)/);
    if (rpListMatch) {
      return rpListMatch[1]
        .split('\n')
        .map(line => line.match(/^\s+-\s+['"]?(.+?)['"]?\s*$/))
        .filter(Boolean)
        .map(m => m[1]);
    }

    return [];
  }

  // Collect matching skills
  const matched = [];

  for (const skillName of skillDirs) {
    if (injectedSkills.has(skillName)) continue;

    const skillFile = join(skillsDir, skillName, 'SKILL.md');
    if (!existsSync(skillFile)) continue;

    const content = readFileSync(skillFile, 'utf8');
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter) continue;

    let isMatch = false;

    if (targetPath && frontmatter.pathPatterns.length > 0) {
      isMatch = matchesPath(targetPath, frontmatter.pathPatterns);
    }

    if (!isMatch && targetCommand && frontmatter.bashPatterns.length > 0) {
      isMatch = matchesCommand(targetCommand, frontmatter.bashPatterns);
    }

    if (isMatch) {
      matched.push({
        name: skillName,
        priority: frontmatter.priority,
        content
      });
    }
  }

  // Sort by priority (higher first), cap at MAX_SKILLS
  matched.sort((a, b) => b.priority - a.priority);
  const selected = matched.slice(0, MAX_SKILLS);

  // --- Resource constraint enforcement (restricted_paths) ---
  if ((tool_name === 'Write' || tool_name === 'Edit') && targetPath) {
    for (const skill of matched) {
      const restrictedPaths = parseConstraintPaths(skill.content);
      if (restrictedPaths.length > 0) {
        const normalizedTarget = targetPath.replace(/\\/g, '/');
        for (const rp of restrictedPaths) {
          const rpRegex = globToRegex(rp);
          const targetBase = basename(targetPath);
          if (rpRegex.test(targetBase) || rpRegex.test(normalizedTarget)) {
            const blockResponse = {
              decision: 'block',
              reason: `Resource constraint: path restricted by ${skill.name} skill`
            };
            process.stdout.write(JSON.stringify(blockResponse));
            process.exit(0);
          }
        }
      }
    }
  }

  // Build additionalContext within byte budget
  let additionalContext = '';
  let totalBytes = 0;
  const newlyInjected = [];

  for (const skill of selected) {
    const chunk = `<!-- genorah:skill-inject:${skill.name} -->\n${skill.content}\n<!-- /genorah:skill-inject:${skill.name} -->\n\n`;
    const chunkBytes = Buffer.byteLength(chunk, 'utf8');

    if (totalBytes + chunkBytes > MAX_BYTES) break;

    additionalContext += chunk;
    totalBytes += chunkBytes;
    newlyInjected.push(skill.name);
  }

  // Update session dedup file
  if (newlyInjected.length > 0) {
    for (const name of newlyInjected) {
      injectedSkills.add(name);
    }
    try {
      writeFileSync(dedupFile, JSON.stringify([...injectedSkills]));
    } catch {
      // Non-fatal: dedup persistence failure
    }
  }

  // Output response
  const response = {};
  if (additionalContext) {
    response.additionalContext = additionalContext;
  }

  process.stdout.write(JSON.stringify(response));
} catch (err) {
  // Never crash — output empty response on error
  process.stdout.write(JSON.stringify({}));
}
