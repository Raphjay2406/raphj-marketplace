/**
 * sync-obsidian-vault.mjs
 * Syncs the v4 knowledge bundle into the Obsidian vault at D:/Genorah/Genorah-Plugin.
 *
 * Strategy (v3.25.2+):
 *  - Agent / command / skill / archetype HUB files are merged in-place into the
 *    canonical hub files (All Agents.md, All Commands.md, Skills Overview.md,
 *    All Archetypes.md) using <!-- v4-auto-sync:start / end --> markers.
 *    User-written prose outside the markers is never touched.
 *  - Individual agent / archetype reference cards are still hard-copied into
 *    their per-file locations as before.
 *  - No new _index or _All* duplicate files are created.
 *  - Re-running produces no diff (idempotent).
 *
 * Preserved behaviours from v3.25.1:
 *  - agents/directors/ and agents/workers/<domain>/ subfolder mirroring
 *  - graph.json color-group idempotent injection
 *  - .user.md backup for top-level files with backup:true
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
  unlinkSync,
} from "fs";
import { join, basename } from "path";

const SRC = "d:/Modulo/Plugins/v0-ahh-skill/docs/v4-knowledge-bundle";
const PLUGIN_AGENTS_SRC = "d:/Modulo/Plugins/v0-ahh-skill/agents";
const DST = "D:/Genorah/Genorah-Plugin";

let agentsWritten = 0;
let archetypesWritten = 0;
let hubsMerged = 0;
let backupsCreated = 0;

// ─── Merge helpers ────────────────────────────────────────────────────────────

const SYNC_START = "<!-- v4-auto-sync:start -->";
const SYNC_END   = "<!-- v4-auto-sync:end -->";

/**
 * Merge freshContent into hubPath inside <!-- v4-auto-sync:start/end --> markers.
 * - If markers exist: replace content between them.
 * - If markers don't exist: append the full block (first run).
 * - User-written content outside markers is never modified.
 */
function mergeIntoHub(hubPath, sectionTitle, freshContent) {
  if (!existsSync(hubPath)) {
    console.log(`  [skip] Hub not found: ${basename(hubPath)}`);
    return;
  }

  const existing = readFileSync(hubPath, "utf8");
  // Canonical form: markers on their own lines, single blank line padding inside
  const normalizedFresh = freshContent.trim();
  const block = `\n${SYNC_START}\n\n${normalizedFresh}\n\n${SYNC_END}\n`;

  const startIdx = existing.indexOf(SYNC_START);
  const endIdx   = existing.indexOf(SYNC_END);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    // Extract what's currently between the markers and compare (trimmed)
    const currentBetween = existing.slice(startIdx + SYNC_START.length, endIdx).trim();
    if (currentBetween === normalizedFresh) {
      console.log(`  [no-diff] ${basename(hubPath)}`);
      return;
    }
    // Replace existing block
    const updated = existing.slice(0, startIdx) + block + existing.slice(endIdx + SYNC_END.length);
    writeFileSync(hubPath, updated, "utf8");
  } else {
    // First run: append block
    const updated = existing.trimEnd() + "\n" + block;
    writeFileSync(hubPath, updated, "utf8");
  }

  console.log(`  [merged] ${basename(hubPath)}`);
  hubsMerged++;
}

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

// ─── 1. Refresh individual agent files ────────────────────────────────────────
// Mirror source structure: agents/directors/ → Agents/directors/
//                          agents/workers/<domain>/ → Agents/workers/<domain>/
// v3 subdirs (pipeline/, specialists/, protocols/) are never touched.
console.log("\n[1] Syncing individual agent files...");
const agentsDst = join(DST, "Agents");
mkdirSync(agentsDst, { recursive: true });

const V3_DIRS = new Set(["pipeline", "specialists", "protocols"]);
const AGENT_HUB = join(agentsDst, "All Agents.md"); // canonical hub — merged, not overwritten

const agentPluginSrc = PLUGIN_AGENTS_SRC;
if (existsSync(agentPluginSrc)) {
  for (const entry of readdirSync(agentPluginSrc, { withFileTypes: true })) {
    if (V3_DIRS.has(entry.name)) continue;
    if (entry.name === "figma-translator.md") {
      copyFileSync(join(agentPluginSrc, entry.name), join(agentsDst, entry.name));
      agentsWritten++;
      continue;
    }
    if (entry.isDirectory()) {
      const dstSubDir = join(agentsDst, entry.name);
      mkdirSync(dstSubDir, { recursive: true });
      const srcSubDir = join(agentPluginSrc, entry.name);
      for (const sub of readdirSync(srcSubDir, { withFileTypes: true })) {
        if (sub.isDirectory()) {
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
  }
}
console.log(`  → ${agentsWritten} individual agent files written`);

// ─── 2. Merge agents hub (All Agents.md) ─────────────────────────────────────
console.log("\n[2] Merging agents hub...");
const bundleAgentsSrc = join(SRC, "agents");
const agentsIndexSrc  = join(bundleAgentsSrc, "index.md");
if (existsSync(agentsIndexSrc)) {
  const raw = readFileSync(agentsIndexSrc, "utf8");
  // Strip YAML frontmatter if present
  const content = raw.replace(/^---[\s\S]*?---\n/, "").trim();
  mergeIntoHub(AGENT_HUB, "v4 Agents", content);
} else {
  console.log("  [skip] No agents/index.md in bundle");
}

// Remove any legacy _All Agents v4 *.md duplicates left from previous syncs
for (const f of readdirSync(agentsDst)) {
  if (f.startsWith("_All Agents v4")) {
    unlinkSync(join(agentsDst, f));
    console.log(`  [removed legacy] ${f}`);
  }
}

// ─── 3. Refresh individual archetype files ────────────────────────────────────
console.log("\n[3] Syncing individual archetype files...");
const archetypesDst = join(DST, "Archetypes");
mkdirSync(archetypesDst, { recursive: true });
const ARCHETYPE_HUB = join(archetypesDst, "All Archetypes.md"); // canonical hub
const archetypesSrc = join(SRC, "archetypes");
if (existsSync(archetypesSrc)) {
  for (const entry of readdirSync(archetypesSrc, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    if (entry.name === "index.md") continue; // handled in step 4
    copyFileSync(join(archetypesSrc, entry.name), join(archetypesDst, entry.name));
    archetypesWritten++;
  }
}
console.log(`  → ${archetypesWritten} individual archetype files written`);

// ─── 4. Merge archetypes hub (All Archetypes.md) ─────────────────────────────
console.log("\n[4] Merging archetypes hub...");
const archetypesIndexSrc = join(archetypesSrc, "index.md");
if (existsSync(archetypesIndexSrc)) {
  const raw = readFileSync(archetypesIndexSrc, "utf8");
  const content = raw.replace(/^---[\s\S]*?---\n/, "").trim();
  // If the canonical hub doesn't exist yet, create it from the index content
  if (!existsSync(ARCHETYPE_HUB)) {
    writeFileSync(ARCHETYPE_HUB, `# All Archetypes\n\n${SYNC_START}\n\n${content}\n\n${SYNC_END}\n`, "utf8");
    console.log(`  [created] All Archetypes.md`);
    hubsMerged++;
  } else {
    mergeIntoHub(ARCHETYPE_HUB, "v4 Archetypes", content);
  }
} else {
  console.log("  [skip] No archetypes/index.md in bundle");
}

// Remove legacy _All Archetypes *.md duplicates
for (const f of readdirSync(archetypesDst)) {
  if (f.startsWith("_All Archetypes")) {
    unlinkSync(join(archetypesDst, f));
    console.log(`  [removed legacy] ${f}`);
  }
}

// ─── 5. Merge commands hub (All Commands.md) ─────────────────────────────────
console.log("\n[5] Merging commands hub...");
const cmdsSrc     = join(SRC, "commands", "index.md");
const cmdsDir     = join(DST, "Commands");
const COMMANDS_HUB = join(cmdsDir, "All Commands.md");
mkdirSync(cmdsDir, { recursive: true });
if (existsSync(cmdsSrc)) {
  const raw = readFileSync(cmdsSrc, "utf8");
  const content = raw.replace(/^---[\s\S]*?---\n/, "").trim();
  mergeIntoHub(COMMANDS_HUB, "v4 Commands", content);
} else {
  console.log("  [skip] No commands/index.md in bundle");
}

// Remove legacy _All Commands *.md duplicates
for (const f of readdirSync(cmdsDir)) {
  if (f.startsWith("_All Commands")) {
    unlinkSync(join(cmdsDir, f));
    console.log(`  [removed legacy] ${f}`);
  }
}

// ─── 6. Merge skills hub (Skills Overview.md) ─────────────────────────────────
console.log("\n[6] Merging skills hub...");
const skillsSrc   = join(SRC, "skills", "index.md");
const skillsDir   = join(DST, "Skills");
const SKILLS_HUB  = join(skillsDir, "Skills Overview.md");
mkdirSync(skillsDir, { recursive: true });
if (existsSync(skillsSrc)) {
  const raw = readFileSync(skillsSrc, "utf8");
  const content = raw.replace(/^---[\s\S]*?---\n/, "").trim();
  mergeIntoHub(SKILLS_HUB, "v4 Skills", content);
} else {
  console.log("  [skip] No skills/index.md in bundle");
}

// Remove legacy _All Skills *.md duplicates
for (const f of readdirSync(skillsDir)) {
  if (f.startsWith("_All Skills")) {
    unlinkSync(join(skillsDir, f));
    console.log(`  [removed legacy] ${f}`);
  }
}

// ─── 7. Top-level frontmatter schema (no hub equivalent — direct copy) ────────
console.log("\n[7] Syncing frontmatter-schema.md...");
const schemaSrc = join(SRC, "frontmatter-schema.md");
const schemaDst = join(DST, "frontmatter-schema.md");
if (existsSync(schemaSrc)) {
  safeCopy(schemaSrc, schemaDst, { backup: true });
  console.log("  → frontmatter-schema.md written");
}

// NOTE: MOC.md is intentionally NOT written — its content has been merged into
// Genorah Plugin Overview.md (the canonical vault map-of-content). Future syncs
// should update that file directly if MOC content changes.

// ─── 8. Idempotent graph.json color groups ────────────────────────────────────
console.log("\n[8] Updating graph.json color groups...");
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
    { query: "file:All Archetypes",              color: { a: 1, rgb: 16763955 } },
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
console.log(`  Individual agent files:  ${agentsWritten}`);
console.log(`  Individual archetype files: ${archetypesWritten}`);
console.log(`  Hubs merged (in-place):  ${hubsMerged}`);
console.log(`  Backups created:         ${backupsCreated}`);
console.log("==============================\n");
