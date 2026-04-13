#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";
import { buildAgentCard } from "../packages/protocol/dist/agent-card.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function extractFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]+?)\n---/);
  if (!m) throw new Error("no frontmatter");
  return parseYaml(m[1]);
}

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith(".md") && !e.name.startsWith("_")) out.push(p);
  }
  return out;
}

const cards = [];
const errors = [];
for (const dir of ["agents/directors", "agents/workers"]) {
  for (const file of walk(join(root, dir))) {
    const md = readFileSync(file, "utf8");
    try {
      const fm = extractFrontmatter(md);
      const card = buildAgentCard(fm);
      cards.push(card);
    } catch (err) {
      errors.push({ file, error: err.message });
    }
  }
}

if (errors.length > 0) {
  console.error(`\nFrontmatter validation errors (${errors.length}):`);
  for (const e of errors) {
    console.error(`  ${e.file}: ${e.error}`);
  }
  process.exit(1);
}

mkdirSync(join(root, ".claude-plugin/generated"), { recursive: true });
writeFileSync(
  join(root, ".claude-plugin/generated/agent-cards.json"),
  JSON.stringify(cards, null, 2)
);
console.log(`wrote ${cards.length} cards`);
