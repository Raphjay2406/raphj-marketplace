/**
 * sync-obsidian-vault.mjs
 * Syncs the v4 knowledge bundle into the Obsidian vault at D:/Genorah/Genorah-Plugin.
 * - Overwrites generated content (agents, archetypes, indexes, MOC, schema)
 * - Preserves user-created notes
 * - Backs up any conflicting top-level files to <filename>.user.md
 * - v3.25.1+: mirrors agents/directors/ and agents/workers/<domain>/ subfolders
 * - v3.25.1+: idempotently adds graph.json color groups for v4 paths
 */

import {
  readdirSync,
  statSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  writeFileSync,
  readFileSync,
  renameSync,
} from "fs";
import { join, basename } from "path";

const SRC = "d:/Modulo/Plugins/v0-ahh-skill/docs/v4-knowledge-bundle";
const PLUGIN_AGENTS_SRC = "d:/Modulo/Plugins/v0-ahh-skill/agents";
const DST = "D:/Genorah/Genorah-Plugin";

let agentsWritten = 0;
let archetypesWritten = 0;
let indexesUpdated = 0;
let backupsCreated = 0;

// Helper: copy a file, optionally backing up the destination first
function safeCopy(srcPath, dstPath, { backup = false } = {}) {
  if (backup && existsSync(dstPath)) {
    const backupPath = dstPath.replace(/\.md$/, ".user.md");
    if (!existsSync(backupPath)) {
      renameSync(dstPath, backupPath);
      console.log(`  [backup] ${basename(dstPath)} → ${basename(backupPath)}`);
      backupsCreated++;
    }
  }
  copyFileSync(srcPath, dstPath);
}

// ─── 1. Refresh agents ────────────────────────────────────────────────────────
// Mirror source structure: agents/directors/ → Agents/directors/
//                          agents/workers/<domain>/ → Agents/workers/<domain>/
// Falls back to flat copy for any source files at agents/ root (legacy bundle)
console.log("\n[1] Syncing agents...");
const agentsDst = join(DST, "Agents");
mkdirSync(agentsDst, { recursive: true });

// v3 subdirs preserved — never touched by sync
const V3_DIRS = new Set(["pipeline", "specialists", "protocols"]);
// Root-level override files — stay at Agents/ root
const ROOT_KEEP = new Set(["All Agents.md"]);

// Step 1a: Sync from plugin source (directors/ and workers/<domain>/)
const agentPluginSrc = PLUGIN_AGENTS_SRC;
if (existsSync(agentPluginSrc)) {
  for (const entry of readdirSync(agentPluginSrc, { withFileTypes: true })) {
    if (V3_DIRS.has(entry.name)) continue; // leave v3 dirs alone
    if (entry.name === "figma-translator.md") {
      // figma-translator lives at plugin root — copy to Agents/ root
      copyFileSync(join(agentPluginSrc, entry.name), join(agentsDst, entry.name));
      agentsWritten++;
      continue;
    }
    if (entry.isDirectory()) {
      // directors/ or workers/ (with potential subdomains)
      const dstSubDir = join(agentsDst, entry.name);
      mkdirSync(dstSubDir, { recursive: true });
      const srcSubDir = join(agentPluginSrc, entry.name);
      for (const sub of readdirSync(srcSubDir, { withFileTypes: true })) {
        if (sub.isDirectory()) {
          // workers/<domain>/
          const dstDomain = join(dstSubDir, sub.name);
          mkdirSync(dstDomain, { recursive: true });
          for (const file of readdirSync(join(srcSubDir, sub.name), { withFileTypes: true })) {
            if (file.isFile() && file.name.endsWith(".md") && file.name !== "_template.md") {
              copyFileSync(
                join(srcSubDir, sub.name, file.name),
                join(dstDomain, file.name)
              );
              agentsWritten++;
            }
          }
        } else if (sub.isFile() && sub.name.endsWith(".md") && sub.name !== "_template.md") {
          copyFileSync(join(srcSubDir, sub.name), join(dstSubDir, sub.name));
          agentsWritten++;
        }
      }
    }
    // skip root-level .md files in plugin agents/ — those are the v3 pipeline agents
    // that already live in pipeline/ subdir
  }
}

// Step 1b: Sync agents index from v4 knowledge bundle (flat, named index.md)
const bundleAgentsSrc = join(SRC, "agents");
if (existsSync(bundleAgentsSrc)) {
  for (const entry of readdirSync(bundleAgentsSrc, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    if (entry.name === "index.md") {
      // Sync index — keep named _All Agents v4 (*.md)
      // Find existing descriptive index in vault
      const existing = readdirSync(agentsDst).find((f) =>
        f.startsWith("_All Agents v4")
      );
      const dstName = existing || "_All Agents v4 (index).md";
      copyFileSync(join(bundleAgentsSrc, entry.name), join(agentsDst, dstName));
      agentsWritten++;
      continue;
    }
    // Flat bundle files: only write to Agents/ root if they haven't been placed
    // in a subdir already (catch-all for any new workers not yet in WORKER_DOMAINS)
    const alreadyPlaced = isFilePlacedInSubdir(agentsDst, entry.name, V3_DIRS);
    if (!alreadyPlaced && !ROOT_KEEP.has(entry.name)) {
      // Write to workers/ root as catch-all
      mkdirSync(join(agentsDst, "workers"), { recursive: true });
      const dstPath = join(agentsDst, "workers", entry.name);
      copyFileSync(join(bundleAgentsSrc, entry.name), dstPath);
      agentsWritten++;
    }
  }
}

console.log(`  → ${agentsWritten} agent files written`);

/**
 * Check if a filename already exists somewhere under Agents/directors/ or
 * Agents/workers/<domain>/ so we don't double-write bundle flat files.
 */
function isFilePlacedInSubdir(agentsRoot, filename, skipDirs) {
  for (const entry of readdirSync(agentsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (skipDirs.has(entry.name)) continue;
    const subDir = join(agentsRoot, entry.name);
    for (const sub of readdirSync(subDir, { withFileTypes: true })) {
      if (sub.isDirectory()) {
        // workers/<domain>/
        const domainDir = join(subDir, sub.name);
        if (existsSync(join(domainDir, filename))) return true;
      } else if (sub.name === filename) {
        return true;
      }
    }
  }
  return false;
}

// ─── 2. Refresh archetypes ────────────────────────────────────────────────────
console.log("\n[2] Syncing archetypes...");
const archetypesDst = join(DST, "Archetypes");
mkdirSync(archetypesDst, { recursive: true });
const archetypesSrc = join(SRC, "archetypes");
if (existsSync(archetypesSrc)) {
  for (const entry of readdirSync(archetypesSrc, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      if (entry.name === "index.md") {
        // Keep descriptive name
        const existing = readdirSync(archetypesDst).find((f) =>
          f.startsWith("_All Archetypes")
        );
        const dstName = existing || "_All Archetypes (index).md";
        copyFileSync(join(archetypesSrc, entry.name), join(archetypesDst, dstName));
      } else {
        copyFileSync(join(archetypesSrc, entry.name), join(archetypesDst, entry.name));
      }
      archetypesWritten++;
    }
  }
}
console.log(`  → ${archetypesWritten} archetype files written`);

// ─── 3. Refresh commands index ────────────────────────────────────────────────
console.log("\n[3] Syncing commands index...");
const cmdsSrc = join(SRC, "commands", "index.md");
const cmdsDir = join(DST, "Commands");
if (existsSync(cmdsSrc)) {
  mkdirSync(cmdsDir, { recursive: true });
  // Keep descriptive name
  const existing = readdirSync(cmdsDir).find((f) => f.startsWith("_All Commands"));
  const dstName = join(cmdsDir, existing || "_All Commands (index).md");
  copyFileSync(cmdsSrc, dstName);
  indexesUpdated++;
  console.log(`  → Commands/${basename(dstName)} written`);
}

// ─── 4. Refresh skills index ──────────────────────────────────────────────────
console.log("\n[4] Syncing skills index...");
const skillsSrc = join(SRC, "skills", "index.md");
const skillsDir = join(DST, "Skills");
if (existsSync(skillsSrc)) {
  mkdirSync(skillsDir, { recursive: true });
  const existing = readdirSync(skillsDir).find((f) => f.startsWith("_All Skills"));
  const dstName = join(skillsDir, existing || "_All Skills (index).md");
  copyFileSync(skillsSrc, dstName);
  indexesUpdated++;
  console.log(`  → Skills/${basename(dstName)} written`);
}

// ─── 5. Top-level MOC + schema ────────────────────────────────────────────────
console.log("\n[5] Syncing MOC + frontmatter schema...");
const mocSrc = join(SRC, "MOC.md");
const mocDst = join(DST, "MOC.md");
if (existsSync(mocSrc)) {
  safeCopy(mocSrc, mocDst, { backup: true });
  indexesUpdated++;
  console.log("  → MOC.md written");
}

const schemaSrc = join(SRC, "frontmatter-schema.md");
const schemaDst = join(DST, "frontmatter-schema.md");
if (existsSync(schemaSrc)) {
  safeCopy(schemaSrc, schemaDst, { backup: true });
  indexesUpdated++;
  console.log("  → frontmatter-schema.md written");
}

// ─── 6. Idempotent graph.json color groups ────────────────────────────────────
console.log("\n[6] Updating graph.json color groups...");
const graphPath = join(DST, ".obsidian", "graph.json");
if (existsSync(graphPath)) {
  const graph = JSON.parse(readFileSync(graphPath, "utf8"));
  if (!graph.colorGroups) graph.colorGroups = [];

  const V4_COLOR_GROUPS = [
    { query: "path:Agents/directors",           color: { a: 1, rgb: 16753920 } },
    { query: "path:Agents/workers/3d",           color: { a: 1, rgb: 39423 } },
    { query: "path:Agents/workers/motion",       color: { a: 1, rgb: 16744703 } },
    { query: "path:Agents/workers/asset",        color: { a: 1, rgb: 11534336 } },
    { query: "path:Agents/workers/content",      color: { a: 1, rgb: 6711039 } },
    { query: "path:Agents/workers/mobile",       color: { a: 1, rgb: 4521796 } },
    { query: "path:Agents/workers/integration",  color: { a: 1, rgb: 8421376 } },
    { query: "path:Agents/workers/critic",       color: { a: 1, rgb: 13434880 } },
    { query: "path:Agents/workers/research",     color: { a: 1, rgb: 4259584 } },
    { query: "path:Agents/workers",              color: { a: 1, rgb: 8421504 } },
    { query: "path:Archetypes",                  color: { a: 1, rgb: 16763955 } },
  ];

  const existingQueries = new Set(graph.colorGroups.map((g) => g.query));
  let added = 0;
  for (const entry of V4_COLOR_GROUPS) {
    if (!existingQueries.has(entry.query)) {
      graph.colorGroups.push(entry);
      console.log(`  [added] ${entry.query}`);
      added++;
    }
  }
  if (added === 0) console.log("  → all color groups already present");
  writeFileSync(graphPath, JSON.stringify(graph, null, 2));
  console.log(`  → graph.json updated (${added} new groups)`);
}

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log("\n==============================");
console.log("Sync complete:");
console.log(`  Agents written:     ${agentsWritten}`);
console.log(`  Archetypes written: ${archetypesWritten}`);
console.log(`  Indexes updated:    ${indexesUpdated}`);
console.log(`  Backups created:    ${backupsCreated}`);
console.log("==============================\n");
