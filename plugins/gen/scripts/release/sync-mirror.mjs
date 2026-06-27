#!/usr/bin/env node
/**
 * sync-mirror.mjs
 * Syncs root source dirs into plugins/gen/ mirror.
 * v4.0.0: also copies packages-dist + package.json + src/schemas/*.json
 * Usage: node scripts/release/sync-mirror.mjs
 */
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "..");
const MIRROR = join(ROOT, "plugins", "gen");

if (!existsSync(MIRROR)) {
  console.log("plugins/gen/ mirror not found — skipping sync (not configured).");
  process.exit(0);
}

// ── 1. Sync standard dirs ─────────────────────────────────────────────────────
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

// ── 2. Sync packages/*/dist + package.json + src/schemas/*.json ───────────────
const pkgRoot = join(ROOT, "packages");
const mirrorPkgRoot = join(MIRROR, "packages");

if (!existsSync(pkgRoot)) {
  console.log("\nNo packages/ directory found — skipping package sync.");
  process.exit(0);
}

const packages = readdirSync(pkgRoot).filter(
  (name) => statSync(join(pkgRoot, name)).isDirectory()
);

console.log(`\nSyncing ${packages.length} packages to mirror...`);
let pkgSynced = 0;
let pkgFailed = 0;

for (const pkg of packages) {
  const src = join(pkgRoot, pkg);
  const dst = join(mirrorPkgRoot, pkg);
  const distDir = join(src, "dist");

  // Build dist if missing
  if (!existsSync(distDir)) {
    console.log(`  building ${pkg}...`);
    try {
      execSync("npm run build", { cwd: src, stdio: "pipe" });
      console.log(`    built OK`);
    } catch (e) {
      const msg = e.message ? e.message.slice(0, 200) : String(e);
      console.error(`    BUILD FAILED for ${pkg}: ${msg}`);
      pkgFailed++;
      continue;
    }
  }

  mkdirSync(dst, { recursive: true });

  // Copy dist/
  if (existsSync(distDir)) {
    cpSync(distDir, join(dst, "dist"), { recursive: true, force: true });
    console.log(`  synced: packages/${pkg}/dist/`);
  }

  // Copy package.json
  const pkgJson = join(src, "package.json");
  if (existsSync(pkgJson)) {
    cpSync(pkgJson, join(dst, "package.json"), { force: true });
  }

  // Copy src/schemas/*.json (runtime hooks use result-envelope.schema.json etc.)
  const schemasDir = join(src, "src", "schemas");
  if (existsSync(schemasDir)) {
    const schemaFiles = readdirSync(schemasDir).filter((f) => f.endsWith(".json"));
    if (schemaFiles.length > 0) {
      const dstSchemas = join(dst, "src", "schemas");
      mkdirSync(dstSchemas, { recursive: true });
      for (const f of schemaFiles) {
        cpSync(join(schemasDir, f), join(dstSchemas, f), { force: true });
      }
      console.log(`  synced: packages/${pkg}/src/schemas/ (${schemaFiles.length} file(s))`);
    }
  }

  pkgSynced++;
}

console.log(
  `\nPackage sync complete. ${pkgSynced}/${packages.length} packages updated${pkgFailed > 0 ? `, ${pkgFailed} failed` : ""}.`
);
