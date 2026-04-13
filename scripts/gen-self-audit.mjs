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

// Check 7 (M6): All 6 hard gates registered
// Hard gates: (1) Motion exists, (2) 4-breakpoint responsive, (3) Compatibility tier,
// (4) Component registry compliance, (5) Archetype specificity, (6) Scroll Coherence (v4)
try {
  const sh = readFileSync(".claude-plugin/hooks/dna-compliance-check.sh", "utf8");
  check("hard gate #1 motion check present", sh.includes("has_motion") || sh.includes("animate-"), "motion check missing from dna-compliance-check.sh");
  check("hard gate #6 scroll coherence present", sh.includes("Scroll Coherence") || sh.includes("scroll-coherence"), "hard gate #6 (Scroll Coherence) missing from dna-compliance-check.sh");
  check("scroll-coherence validator exists", existsSync("scripts/validators/scroll-coherence.mjs"), "missing scripts/validators/scroll-coherence.mjs");
} catch (e) {
  check("dna-compliance-check.sh readable", false, e.message);
}

// Check 8 (M6): Archetype registry — all present archetypes have archetype.json
try {
  const { validateRegistry } = await import("./validators/archetype-registry.mjs");
  const regResult = await validateRegistry();
  check(`archetype registry valid (${regResult.count} archetypes)`, regResult.pass, regResult.issues.join("; "));
} catch (e) {
  check("archetype-registry validator loadable", false, e.message);
}

// Check 9 (M6): All recipes/*.yml validate against RecipeSchema
try {
  const { readFileSync: rfs, readdirSync: rds } = await import("fs");
  const yaml = await import("js-yaml").catch(() => null);
  if (!yaml) {
    check("recipes yml validation (js-yaml available)", false, "js-yaml not installed — run: npm install js-yaml");
  } else {
    const { RecipeSchema } = await import("../packages/asset-forge/dist/schemas/recipe.schema.js");
    const recipeFiles = rds("recipes").filter(f => f.endsWith(".yml"));
    check("recipes directory has yml files", recipeFiles.length > 0, "no .yml files in recipes/");
    let recipeIssues = [];
    for (const f of recipeFiles) {
      try {
        const data = yaml.default.load(rfs(`recipes/${f}`, "utf8"));
        const r = RecipeSchema.safeParse(data);
        if (!r.success) recipeIssues.push(`${f}: ${r.error.issues[0]?.message}`);
      } catch (ex) {
        recipeIssues.push(`${f}: ${ex.message}`);
      }
    }
    check(`all ${recipeFiles.length} recipes/*.yml valid`, recipeIssues.length === 0, recipeIssues.join("; "));
  }
} catch (e) {
  check("recipes validation runnable", false, e.message);
}

// Check 10 (M6): quality-gate-v3 weights.json exists
check("quality-gate-v3/weights.json exists", existsSync("skills/quality-gate-v3/weights.json"), "missing skills/quality-gate-v3/weights.json");

// Check 11 (M6): All M2-M5 completion docs exist
const mDocs = [
  "docs/superpowers/plans/v4-m2-completion.md",
  "docs/superpowers/plans/v4-m3-completion.md",
  "docs/superpowers/plans/v4-m4-completion.md",
  "docs/superpowers/plans/v4-m5-completion.md"
];
for (const doc of mDocs) {
  check(`${doc} exists`, existsSync(doc), `missing — milestone not documented`);
}

// Output
let passed = 0, failed = 0;
for (const c of checks) {
  const mark = c.pass ? "✓" : "✗";
  console.log(`${mark} ${c.name}${c.pass ? "" : " — " + c.fail}`);
  if (c.pass) passed++; else failed++;
}
console.log(`\n${passed}/${passed + failed} passed`);
process.exit(failed > 0 ? 1 : 0);
