#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync } from "fs";

const target = process.argv[2] || "4.0.0";

// Collect files manually to avoid glob version issues
const files = [];

// root package.json
if (existsSync("package.json")) files.push("package.json");

// packages/*/package.json
if (existsSync("packages")) {
  for (const pkg of readdirSync("packages")) {
    const f = `packages/${pkg}/package.json`;
    if (existsSync(f)) files.push(f);
  }
}

// plugin manifest
if (existsSync(".claude-plugin/plugin.json")) files.push(".claude-plugin/plugin.json");
if (existsSync(".claude-plugin/marketplace.json")) files.push(".claude-plugin/marketplace.json");

const bad = [];
for (const f of files) {
  const pkg = JSON.parse(readFileSync(f, "utf8"));
  // marketplace.json has nested plugins with versions
  if (f.includes("marketplace.json")) {
    for (const p of pkg.plugins || []) {
      if (p.name === "gen" && p.version !== target) bad.push(`${f}::gen: ${p.version}`);
    }
  } else if (pkg.version !== target) {
    bad.push(`${f}: ${pkg.version}`);
  }
}
if (bad.length) {
  console.error(`version mismatch vs ${target}:`);
  for (const b of bad) console.error(`  ${b}`);
  process.exit(1);
}
console.log(`ok: all ${files.length} files at ${target}`);
