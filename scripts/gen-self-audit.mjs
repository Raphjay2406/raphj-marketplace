#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const checks = [];
function check(name, cond, fail) {
  checks.push({ name, pass: !!cond, fail: cond ? null : fail });
}

// Check 1: plugin.json version
try {
  const pkg = JSON.parse(readFileSync(".claude-plugin/plugin.json", "utf8"));
  check("plugin.json version is 4.0.0-alpha.5", pkg.version === "4.0.0-alpha.5", `got ${pkg.version}`);
} catch (e) {
  check("plugin.json readable", false, e.message);
}

// Check 2: agent count
function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith(".md") && !e.name.startsWith("_")) out.push(p);
  }
  return out;
}
const dirs = walk("agents/directors").length;
const workers = walk("agents/workers").length;
check("10 directors", dirs === 10, `got ${dirs}`);
check("98 workers", workers === 98, `got ${workers}`);

// Check 3: agent-cards.json
try {
  const cards = JSON.parse(readFileSync(".claude-plugin/generated/agent-cards.json", "utf8"));
  check("108 agent cards generated", cards.length === 108, `got ${cards.length}`);
  check("all cards have schema_version a2a-v0.3", cards.every(c => c.schema_version === "a2a-v0.3"), "mixed");
  check("all cards at version 4.0.0 + stable channel", cards.every(c => c.version === "4.0.0" && c.channel === "stable"), "mixed");
} catch (e) {
  check("agent-cards.json readable", false, e.message);
}

// Check 4: protocol dist exists
check("packages/protocol/dist exists", existsSync("packages/protocol/dist"), "run npm run build in packages/protocol");
check("dist/index.js", existsSync("packages/protocol/dist/index.js"), "missing barrel");
check("dist/bin/daemon.js", existsSync("packages/protocol/dist/bin/daemon.js"), "missing daemon CLI");

// Check 5: hooks registered
try {
  const pluginConfig = JSON.parse(readFileSync(".claude-plugin/plugin.json", "utf8"));
  const hooksObj = pluginConfig.hooks || {};
  // Flatten all hook commands across all events
  const allCmds = Object.values(hooksObj)
    .flat()
    .flatMap(entry => (entry.hooks || []).map(h => h.command || ""))
    .join(" ");
  check("agent-message-validator hook registered", allCmds.includes("agent-message-validator"), "missing");
  check("daemon-lifecycle hook registered", allCmds.includes("daemon-lifecycle"), "missing");
} catch (e) {
  check("hooks readable", false, e.message);
}

// Check 6: migration command + script
check("/gen:migrate-v3-to-v4 command exists", existsSync("commands/gen-migrate-v3-to-v4.md"), "missing");
check("migrate-v3-to-v4 script exists", existsSync("scripts/migrate-v3-to-v4.mjs"), "missing");

// Output
let passed = 0, failed = 0;
for (const c of checks) {
  const mark = c.pass ? "✓" : "✗";
  console.log(`${mark} ${c.name}${c.pass ? "" : " — " + c.fail}`);
  if (c.pass) passed++; else failed++;
}
console.log(`\n${passed}/${passed + failed} passed`);
process.exit(failed > 0 ? 1 : 0);
