/**
 * sync-obsidian-vault.mjs
 * Syncs the v4 knowledge bundle into the Obsidian vault at D:/Genorah/Genorah-Plugin.
 * - Overwrites generated content (agents, archetypes, indexes, MOC, schema)
 * - Preserves user-created notes
 * - Backs up any conflicting top-level files to <filename>.user.md
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

// 1. Refresh agents (overwrite all agent .md files)
console.log("\n[1] Syncing agents...");
const agentsDst = join(DST, "Agents");
mkdirSync(agentsDst, { recursive: true });
const agentsSrc = join(SRC, "agents");
if (existsSync(agentsSrc)) {
  for (const entry of readdirSync(agentsSrc, { withFileTypes: true })) {
    const srcPath = join(agentsSrc, entry.name);
    const dstPath = join(agentsDst, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(dstPath, { recursive: true });
      for (const sub of readdirSync(srcPath, { withFileTypes: true })) {
        if (sub.isFile() && sub.name.endsWith(".md")) {
          copyFileSync(join(srcPath, sub.name), join(dstPath, sub.name));
          agentsWritten++;
        }
      }
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      copyFileSync(srcPath, dstPath);
      agentsWritten++;
    }
  }
}
console.log(`  → ${agentsWritten} agent files written`);

// 2. Refresh archetypes (new folder for v4)
console.log("\n[2] Syncing archetypes...");
const archetypesDst = join(DST, "Archetypes");
mkdirSync(archetypesDst, { recursive: true });
const archetypesSrc = join(SRC, "archetypes");
if (existsSync(archetypesSrc)) {
  for (const entry of readdirSync(archetypesSrc, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      copyFileSync(join(archetypesSrc, entry.name), join(archetypesDst, entry.name));
      archetypesWritten++;
    }
  }
}
console.log(`  → ${archetypesWritten} archetype files written`);

// 3. Refresh commands index (preserve user-added command notes)
console.log("\n[3] Syncing commands index...");
const cmdsSrc = join(SRC, "commands", "index.md");
const cmdsDst = join(DST, "Commands", "_index.md");
if (existsSync(cmdsSrc)) {
  mkdirSync(join(DST, "Commands"), { recursive: true });
  copyFileSync(cmdsSrc, cmdsDst);
  indexesUpdated++;
  console.log("  → Commands/_index.md written");
}

// 4. Refresh skills index (preserve user-added skill notes)
console.log("\n[4] Syncing skills index...");
const skillsSrc = join(SRC, "skills", "index.md");
const skillsDst = join(DST, "Skills", "_index.md");
if (existsSync(skillsSrc)) {
  mkdirSync(join(DST, "Skills"), { recursive: true });
  copyFileSync(skillsSrc, skillsDst);
  indexesUpdated++;
  console.log("  → Skills/_index.md written");
}

// 5. Top-level MOC + schema (backup if user has customized)
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

// Summary
console.log("\n==============================");
console.log("Sync complete:");
console.log(`  Agents written:     ${agentsWritten}`);
console.log(`  Archetypes written: ${archetypesWritten}`);
console.log(`  Indexes updated:    ${indexesUpdated}`);
console.log(`  Backups created:    ${backupsCreated}`);
console.log("==============================\n");
