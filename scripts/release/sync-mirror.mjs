#!/usr/bin/env node
/**
 * sync-mirror.mjs
 * Syncs root source dirs into plugins/gen/ mirror.
 * Usage: node scripts/release/sync-mirror.mjs
 */
import { cpSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "..");
const MIRROR = join(ROOT, "plugins", "gen");

if (!existsSync(MIRROR)) {
  console.log("plugins/gen/ mirror not found — skipping sync (not configured).");
  process.exit(0);
}

const dirs = ["agents", "commands", "skills", ".claude-plugin"];
let synced = 0;

for (const dir of dirs) {
  const src = join(ROOT, dir);
  const dst = join(MIRROR, dir);
  if (!existsSync(src)) { console.warn(`  skip: ${dir} (source not found)`); continue; }
  mkdirSync(dst, { recursive: true });
  cpSync(src, dst, { recursive: true, force: true });
  console.log(`  synced: ${dir}/`);
  synced++;
}

console.log(`\nMirror sync complete. ${synced}/${dirs.length} directories updated.`);
