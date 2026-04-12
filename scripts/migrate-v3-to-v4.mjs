#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const backupIdx = args.indexOf("--backup-to");
const backup = backupIdx >= 0 ? args[backupIdx + 1] : null;

const stateDir = ".planning/genorah";
if (!existsSync(stateDir)) {
  console.error("no .planning/genorah — not a Genorah project");
  process.exit(1);
}

const changes = [];

if (backup && !dryRun) {
  mkdirSync(backup, { recursive: true });
  if (existsSync(join(stateDir, "CONTEXT.md"))) {
    copyFileSync(join(stateDir, "CONTEXT.md"), join(backup, "CONTEXT.md.bak"));
    changes.push(`backed up CONTEXT.md → ${backup}`);
  }
}

const dnaPath = join(stateDir, "DESIGN-DNA.md");
if (existsSync(dnaPath)) {
  let dna = readFileSync(dnaPath, "utf8");
  if (!dna.includes("3d_intensity:")) {
    dna = dna.replace(/^---\n/, `---\n3d_intensity: accent\nasset_budget_usd: 20\nmigration_tag: v4.0.0\n`);
    if (!dryRun) writeFileSync(dnaPath, dna);
    changes.push("added 3d_intensity + asset_budget_usd to DESIGN-DNA.md");
  }
}

const contextPath = join(stateDir, "CONTEXT.md");
if (existsSync(contextPath)) {
  let ctx = readFileSync(contextPath, "utf8");
  if (!ctx.includes("protocol_version:")) {
    ctx += `\n\n## Protocol\nprotocol_version: 4.0.0\nartifact_registry: {}\n`;
    if (!dryRun) writeFileSync(contextPath, ctx);
    changes.push("added protocol_version + artifact_registry to CONTEXT.md");
  }
}

const errorsPath = join(stateDir, "errors.jsonld");
if (!existsSync(errorsPath)) {
  if (!dryRun) writeFileSync(errorsPath, '{"@context":"https://genorah.dev/schemas/errors","entries":[]}');
  changes.push("created errors.jsonld");
}

console.log(dryRun ? "DRY RUN — would make these changes:" : "migrated to v4.0:");
for (const c of changes) console.log(`  - ${c}`);
