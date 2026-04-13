#!/usr/bin/env node
/**
 * build-knowledge-bundle.mjs
 * Generates docs/v4-knowledge-bundle/ — Obsidian-compatible markdown
 * for all 108 agents, 50 archetypes, commands index, skills index, MOC, and frontmatter schema.
 *
 * Usage: node scripts/docs/build-knowledge-bundle.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { join, basename, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "..");
const OUT = join(ROOT, "docs", "v4-knowledge-bundle");

const PREVIEW_CHARS = 200;

// ── helpers ──────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function writeFile(path, content) {
  writeFileSync(path, content, "utf8");
}

function readFileSafe(filePath) {
  try { return readFileSync(filePath, "utf8"); } catch { return ""; }
}

/** Extract YAML frontmatter block (raw string between first --- fences). */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1].trim() : "";
}

/** Strip frontmatter, return body text. */
function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
}

/** Get all .md files in a directory (non-recursive). */
function mdFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith(".md") && !f.startsWith("_"))
    .sort();
}

/** Walk a directory recursively, returning all .md files. */
function walkMd(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkMd(full));
    } else if (entry.endsWith(".md") && !entry.startsWith("_")) {
      results.push(full);
    }
  }
  return results.sort();
}

/** Parse simple YAML frontmatter key: value pairs into an object. */
function parseFrontmatter(raw) {
  const obj = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^(\w[\w-]*):\s*"?(.+?)"?\s*$/);
    if (m) obj[m[1]] = m[2];
  }
  return obj;
}

// ── stats ─────────────────────────────────────────────────────────────────────

const stats = {
  agents: 0,
  archetypes: 0,
  commands: 0,
  skills: 0,
  files: 0,
};

// ── Task A1: Agents ──────────────────────────────────────────────────────────

function buildAgents() {
  const agentsOut = join(OUT, "agents");
  ensureDir(agentsOut);

  const agentDirs = [
    { subdir: "directors", tier: "director" },
    { subdir: "workers",   tier: "worker"   },
    { subdir: "pipeline",  tier: "pipeline" },
    { subdir: "specialists", tier: "specialist" },
    { subdir: "protocols", tier: "protocol" },
  ];

  // figma-translator is standalone
  const standaloneFiles = [join(ROOT, "agents", "figma-translator.md")];

  const index = [];

  function processAgentFile(filePath, tier) {
    const content = readFileSafe(filePath);
    const fmRaw = extractFrontmatter(content);
    const fm = parseFrontmatter(fmRaw);
    const body = stripFrontmatter(content);
    const preview = body.slice(0, PREVIEW_CHARS).replace(/\n/g, " ").trim();

    const name = fm.name || basename(filePath, ".md");
    const id = fm.id || `genorah/${name}`;
    const version = fm.version || "4.0.0";
    const channel = fm.channel || "stable";
    const description = fm.description || preview || "";

    // Gather capabilities from description + first body line
    const capabilities = description
      .replace(/"/g, "")
      .slice(0, 120)
      .replace(/\.$/, "");

    const slug = basename(filePath, ".md");
    const outFile = join(agentsOut, `${slug}.md`);

    const outputFm = [
      `---`,
      `id: "${id}"`,
      `name: "${name}"`,
      `tier: "${tier}"`,
      `version: "${version}"`,
      `channel: "${channel}"`,
      `capabilities: "${capabilities.replace(/"/g, "'")}"`,
      `source: "agents/${relative(join(ROOT, "agents"), filePath).replace(/\\/g, "/")}"`,
      `tags: [agent, genorah, ${tier}]`,
      `---`,
    ].join("\n");

    const outputBody = [
      `# ${name}`,
      ``,
      `> ${description.replace(/"/g, "").slice(0, 200) || "Genorah agent."}`,
      ``,
      `## Preview`,
      ``,
      preview || "_No body preview available._",
      ``,
      `## Frontmatter`,
      ``,
      "```yaml",
      fmRaw || `name: ${name}`,
      "```",
    ].join("\n");

    writeFile(outFile, `${outputFm}\n\n${outputBody}\n`);
    stats.agents++;
    stats.files++;

    index.push({ name, slug, tier, id, version, capabilities });
  }

  for (const { subdir, tier } of agentDirs) {
    const dir = join(ROOT, "agents", subdir);
    // Walk recursively (workers has asset/ subdir)
    for (const filePath of walkMd(dir)) {
      processAgentFile(filePath, tier);
    }
  }

  for (const filePath of standaloneFiles) {
    if (existsSync(filePath)) processAgentFile(filePath, "specialist");
  }

  // Write agents/index.md
  const indexContent = [
    `---`,
    `type: index`,
    `entity: agents`,
    `count: ${stats.agents}`,
    `version: "4.0.0"`,
    `tags: [index, agents]`,
    `---`,
    ``,
    `# Agent Index (${stats.agents} total)`,
    ``,
    `## Directors (${index.filter(a => a.tier === "director").length})`,
    ``,
    ...index
      .filter(a => a.tier === "director")
      .map(a => `- [[${a.slug}]] — ${a.capabilities.slice(0, 80)}`),
    ``,
    `## Workers (${index.filter(a => a.tier === "worker").length})`,
    ``,
    ...index
      .filter(a => a.tier === "worker")
      .map(a => `- [[${a.slug}]] — ${a.capabilities.slice(0, 80)}`),
    ``,
    `## Pipeline Agents (${index.filter(a => a.tier === "pipeline").length})`,
    ``,
    ...index
      .filter(a => a.tier === "pipeline")
      .map(a => `- [[${a.slug}]] — ${a.capabilities.slice(0, 80)}`),
    ``,
    `## Specialists (${index.filter(a => a.tier === "specialist").length})`,
    ``,
    ...index
      .filter(a => a.tier === "specialist")
      .map(a => `- [[${a.slug}]] — ${a.capabilities.slice(0, 80)}`),
    ``,
    `## Protocols (${index.filter(a => a.tier === "protocol").length})`,
    ``,
    ...index
      .filter(a => a.tier === "protocol")
      .map(a => `- [[${a.slug}]] — ${a.capabilities.slice(0, 80)}`),
  ].join("\n");

  writeFile(join(agentsOut, "index.md"), indexContent + "\n");
  stats.files++;

  return index;
}

// ── Task A2: Archetypes ───────────────────────────────────────────────────────

function buildArchetypes() {
  const archetypesOut = join(OUT, "archetypes");
  ensureDir(archetypesOut);

  const ARCH_BASE = join(ROOT, "skills", "design-archetypes");
  const index = [];

  // New v4 archetypes stored in archetypes/ subdirs with archetype.json
  const v4ArchDir = join(ARCH_BASE, "archetypes");
  if (existsSync(v4ArchDir)) {
    for (const slug of readdirSync(v4ArchDir).sort()) {
      const dir = join(v4ArchDir, slug);
      if (!statSync(dir).isDirectory()) continue;

      const jsonPath = join(dir, "archetype.json");
      let meta = { slug, name: slug, tier: "webgpu-native" };
      if (existsSync(jsonPath)) {
        try { meta = { ...meta, ...JSON.parse(readFileSafe(jsonPath)) }; } catch {}
      }

      const name = meta.name || slug;
      const tier = meta.tier || "standard";
      const mandatory = Array.isArray(meta.mandatory_techniques)
        ? meta.mandatory_techniques.join(", ")
        : "";
      const forbidden = Array.isArray(meta.forbidden_patterns)
        ? meta.forbidden_patterns.join(", ")
        : "";

      const outputFm = [
        `---`,
        `id: "archetype/${slug}"`,
        `name: "${name}"`,
        `slug: "${slug}"`,
        `tier: "${tier}"`,
        `version: "4.0.0"`,
        `group: "v4-webgpu"`,
        `mandatory_techniques: "${mandatory}"`,
        `forbidden_patterns: "${forbidden}"`,
        `tags: [archetype, genorah, ${tier}]`,
        `---`,
      ].join("\n");

      const body = [
        `# ${name}`,
        ``,
        `**Tier:** ${tier}`,
        ``,
        mandatory ? `**Mandatory techniques:** ${mandatory}` : "",
        forbidden ? `**Forbidden patterns:** ${forbidden}` : "",
        ``,
        `## Source`,
        ``,
        `\`skills/design-archetypes/archetypes/${slug}/\``,
      ].filter(l => l !== undefined).join("\n");

      writeFile(join(archetypesOut, `${slug}.md`), `${outputFm}\n\n${body}\n`);
      stats.archetypes++;
      stats.files++;
      index.push({ slug, name, tier, group: "v4-webgpu" });
    }
  }

  // v3 archetypes embedded in the SKILL.md (no separate files)
  // Extract archetype names from SKILL.md body headings
  const skillMdPath = join(ARCH_BASE, "SKILL.md");
  const skillContent = readFileSafe(skillMdPath);
  const headings = [...skillContent.matchAll(/^###\s+\d+\.\s+(.+)$/gm)].map(m => m[1].trim());

  // Known v3 archetypes from CLAUDE.md
  const v3Archetypes = [
    "brutalist", "ethereal", "kinetic", "editorial", "neo-corporate",
    "organic", "retro-future", "luxury-fashion", "playful-startup",
    "data-dense", "japanese-minimal", "glassmorphism", "neon-noir",
    "warm-artisan", "swiss-international", "vaporwave", "neubrutalism",
    "dark-academia", "ai-native", "claymorphism", "neumorphism",
    "soft-ui", "y2k", "cyberpunk-hud", "spatial-visionos",
    "pixel-art", "custom",
    // additional distilled archetypes
    "distilled-uipro", "distilled-bencium",
    "brutalist-editorial", "kinetic-data", "organic-luxury",
    "neo-dark-academia", "glassmorphism-neon", "warm-editorial",
  ];

  // Use headings if found, else fall back to known list
  const v3Names = headings.length > 0 ? headings : v3Archetypes;

  for (const rawName of v3Names) {
    const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-");
    // Don't duplicate if already written as v4
    if (index.find(a => a.slug === slug)) continue;

    const outputFm = [
      `---`,
      `id: "archetype/${slug}"`,
      `name: "${rawName}"`,
      `slug: "${slug}"`,
      `tier: "standard"`,
      `version: "3.x"`,
      `group: "v3-classic"`,
      `tags: [archetype, genorah, standard, v3]`,
      `---`,
    ].join("\n");

    const body = [
      `# ${rawName}`,
      ``,
      `**Tier:** standard (v3 classic)`,
      ``,
      `## Source`,
      ``,
      `\`skills/design-archetypes/SKILL.md\` — search for \`### ${rawName}\``,
    ].join("\n");

    writeFile(join(archetypesOut, `${slug}.md`), `${outputFm}\n\n${body}\n`);
    stats.archetypes++;
    stats.files++;
    index.push({ slug, name: rawName, tier: "standard", group: "v3-classic" });
  }

  // Write archetypes/index.md
  const v4List = index.filter(a => a.group === "v4-webgpu");
  const v3List = index.filter(a => a.group === "v3-classic");

  const indexContent = [
    `---`,
    `type: index`,
    `entity: archetypes`,
    `count: ${stats.archetypes}`,
    `version: "4.0.0"`,
    `tags: [index, archetypes]`,
    `---`,
    ``,
    `# Archetype Index (${stats.archetypes} total)`,
    ``,
    `## v4 WebGPU-Native (${v4List.length})`,
    ``,
    ...v4List.map(a => `- [[${a.slug}]] — ${a.name} (${a.tier})`),
    ``,
    `## v3 Classic (${v3List.length})`,
    ``,
    ...v3List.map(a => `- [[${a.slug}]] — ${a.name}`),
  ].join("\n");

  writeFile(join(archetypesOut, "index.md"), indexContent + "\n");
  stats.files++;

  return index;
}

// ── Task A3: Commands index ───────────────────────────────────────────────────

function buildCommands() {
  const commandsOut = join(OUT, "commands");
  ensureDir(commandsOut);

  const cmdDir = join(ROOT, "commands");
  const files = mdFiles(cmdDir);

  const pipeline = [];
  const ingestion = [];
  const deployment = [];
  const cms = [];
  const integrations = [];
  const other = [];

  const pipelineNames = ["start-project","align","discuss","plan","rehearse","build","audit","ux-audit","narrative-audit","regression","ship-check","export","postship","iterate","review","bugfix"];
  const ingestNames = ["ingest"];
  const deployNames = ["deploy","ci-setup","ship-check"];
  const cmsNames = ["cms-init"];
  const integrationNames = ["integrate","supabase","api","db-init","workflow"];

  for (const f of files) {
    const slug = basename(f, ".md");
    const content = readFileSafe(join(cmdDir, f));
    const fm = parseFrontmatter(extractFrontmatter(content));
    const body = stripFrontmatter(content);
    const preview = (fm.description || body).slice(0, PREVIEW_CHARS).replace(/\n/g, " ").trim();

    const entry = { slug, preview, argHint: fm["argument-hint"] || "" };

    if (pipelineNames.includes(slug)) pipeline.push(entry);
    else if (ingestNames.includes(slug)) ingestion.push(entry);
    else if (deployNames.includes(slug)) deployment.push(entry);
    else if (cmsNames.includes(slug)) cms.push(entry);
    else if (integrationNames.includes(slug)) integrations.push(entry);
    else other.push(entry);

    stats.commands++;
  }

  function renderGroup(title, list) {
    if (!list.length) return "";
    return [
      `### ${title}`,
      ``,
      ...list.map(e => `- \`/gen:${e.slug}\`${e.argHint ? ` \`${e.argHint}\`` : ""} — ${e.preview}`),
      ``,
    ].join("\n");
  }

  const indexContent = [
    `---`,
    `type: index`,
    `entity: commands`,
    `count: ${stats.commands}`,
    `version: "4.0.0"`,
    `tags: [index, commands]`,
    `---`,
    ``,
    `# Command Index (${stats.commands} /gen:* commands)`,
    ``,
    `## Core Pipeline`,
    ``,
    `\`\`\``,
    `/gen:start-project → /gen:align → /gen:discuss → /gen:plan → /gen:build → /gen:audit → /gen:ship-check → /gen:export → /gen:postship`,
    `\`\`\``,
    ``,
    renderGroup("Pipeline Stage Commands", pipeline),
    renderGroup("Ingestion Commands", ingestion),
    renderGroup("Deployment / CI", deployment),
    renderGroup("CMS", cms),
    renderGroup("Integrations", integrations),
    renderGroup("Other", other),
  ].join("\n");

  writeFile(join(commandsOut, "index.md"), indexContent + "\n");
  stats.files++;
}

// ── Task A4: Skills index ─────────────────────────────────────────────────────

function buildSkills() {
  const skillsOut = join(OUT, "skills");
  ensureDir(skillsOut);

  const skillsDir = join(ROOT, "skills");
  const skillDirs = readdirSync(skillsDir)
    .filter(d => !d.startsWith("_") && d !== "SKILL-DIRECTORY.md")
    .sort();

  const core = [];
  const domain = [];
  const utility = [];

  for (const d of skillDirs) {
    const skillMd = join(skillsDir, d, "SKILL.md");
    if (!existsSync(skillMd)) continue;

    const content = readFileSafe(skillMd);
    const fm = parseFrontmatter(extractFrontmatter(content));
    const body = stripFrontmatter(content);
    const preview = body.slice(0, PREVIEW_CHARS).replace(/\n/g, " ").trim();

    const entry = {
      slug: d,
      name: fm.name || d,
      tier: fm.tier || "utility",
      description: fm.description || preview,
      version: fm.version || "1.0.0",
    };

    if (entry.tier === "core") core.push(entry);
    else if (entry.tier === "domain") domain.push(entry);
    else utility.push(entry);

    stats.skills++;
  }

  function renderSkillGroup(title, list) {
    if (!list.length) return "";
    return [
      `### ${title} (${list.length})`,
      ``,
      ...list.map(e => `- **${e.name || e.slug}** \`v${e.version}\` — ${(e.description || "").slice(0, 100)}`),
      ``,
    ].join("\n");
  }

  const indexContent = [
    `---`,
    `type: index`,
    `entity: skills`,
    `count: ${stats.skills}`,
    `version: "4.0.0"`,
    `tags: [index, skills]`,
    `---`,
    ``,
    `# Skill Index (${stats.skills} skills)`,
    ``,
    renderSkillGroup("Core (always loaded)", core),
    renderSkillGroup("Domain (per project type)", domain),
    renderSkillGroup("Utility (on-demand)", utility),
  ].join("\n");

  writeFile(join(skillsOut, "index.md"), indexContent + "\n");
  stats.files++;
}

// ── Task A5: MOC ──────────────────────────────────────────────────────────────

function buildMOC() {
  const moc = [
    `---`,
    `type: moc`,
    `title: "Genorah v4.0.0 Knowledge Bundle"`,
    `version: "4.0.0"`,
    `generated: "${new Date().toISOString().slice(0, 10)}"`,
    `tags: [moc, genorah, v4]`,
    `---`,
    ``,
    `# Genorah v4.0.0 — Map of Content`,
    ``,
    `> Cinematic Intelligence. 108-agent A2A-protocol pipeline for award-caliber frontend design.`,
    ``,
    `## Sections`,
    ``,
    `| Section | Index | Count |`,
    `|---------|-------|-------|`,
    `| Agents | [[agents/index]] | ${stats.agents} |`,
    `| Archetypes | [[archetypes/index]] | ${stats.archetypes} |`,
    `| Commands | [[commands/index]] | ${stats.commands} |`,
    `| Skills | [[skills/index]] | ${stats.skills} |`,
    ``,
    `## Quick Links`,
    ``,
    `- [[frontmatter-schema]] — Standard frontmatter for all vault assets`,
    `- [[agents/index]] — All 108 agents by tier`,
    `- [[archetypes/index]] — All 50 archetypes (17 WebGPU-native + 33 classic)`,
    `- [[commands/index]] — All /gen:* commands grouped by phase`,
    `- [[skills/index]] — All skills by tier (core / domain / utility)`,
    ``,
    `## Pipeline Overview`,
    ``,
    `\`\`\``,
    `/gen:start-project`,
    `  └─ Research Director → Creative Director → Research Runner → Competitor Analyzer`,
    `/gen:align`,
    `  └─ Master Orchestrator → Goal alignment`,
    `/gen:plan`,
    `  └─ Wave Director → Planner → Section planners`,
    `/gen:build`,
    `  └─ Master Orchestrator → Wave Director → 98 Workers (parallel)`,
    `/gen:audit`,
    `  └─ Quality Director → All quality agents`,
    `/gen:ship-check`,
    `  └─ Protocol Director → All validators`,
    `\`\`\``,
    ``,
    `## A2A Protocol`,
    ``,
    `- Result envelope: \`Result<T, E>\` typed JSON`,
    `- Agent cards: \`/.well-known/agent.json\``,
    `- Event emitter: AG-UI 16-event stream`,
    `- Memory: sqlite-vec cross-project episodic graph`,
    ``,
    `## Quality Gate`,
    ``,
    `**394 points total — two axis:**`,
    ``,
    `| Axis | Points | Gate |`,
    `|------|--------|------|`,
    `| Design Craft | 254 | Hard gate at 170+ |`,
    `| UX Integrity | 140 | Hard gate at 100+ |`,
    `| **Total** | **394** | **SOTD ≥ 300** |`,
  ].join("\n");

  writeFile(join(OUT, "MOC.md"), moc + "\n");
  stats.files++;
}

// ── Task A6: Frontmatter schema ───────────────────────────────────────────────

function buildFrontmatterSchema() {
  const schema = [
    `---`,
    `type: schema`,
    `title: "Genorah Vault Frontmatter Schema"`,
    `version: "4.0.0"`,
    `tags: [schema, frontmatter, genorah]`,
    `---`,
    ``,
    `# Frontmatter Schema`,
    ``,
    `Standard frontmatter fields used across all Genorah vault assets.`,
    `Compatible with Dataview plugin for queries.`,
    ``,
    `## Agent Files (\`agents/*.md\`)`,
    ``,
    `\`\`\`yaml`,
    `---`,
    `id: "genorah/<slug>"          # Unique agent ID`,
    `name: "<Human Name>"          # Display name`,
    `tier: "director|worker|pipeline|specialist|protocol"`,
    `version: "4.0.0"`,
    `channel: "stable|beta|alpha"`,
    `capabilities: "<one-line description>"`,
    `source: "agents/<path>.md"    # Path in repo`,
    `tags: [agent, genorah, <tier>]`,
    `---`,
    `\`\`\``,
    ``,
    `## Archetype Files (\`archetypes/*.md\`)`,
    ``,
    `\`\`\`yaml`,
    `---`,
    `id: "archetype/<slug>"`,
    `name: "<Human Name>"`,
    `slug: "<slug>"`,
    `tier: "webgpu-native|standard"`,
    `version: "4.0.0|3.x"`,
    `group: "v4-webgpu|v3-classic"`,
    `mandatory_techniques: "<comma-separated>"`,
    `forbidden_patterns: "<comma-separated>"`,
    `tags: [archetype, genorah, <tier>]`,
    `---`,
    `\`\`\``,
    ``,
    `## Index Files (\`*/index.md\`)`,
    ``,
    `\`\`\`yaml`,
    `---`,
    `type: index`,
    `entity: "agents|archetypes|commands|skills"`,
    `count: <N>`,
    `version: "4.0.0"`,
    `tags: [index, <entity>]`,
    `---`,
    `\`\`\``,
    ``,
    `## MOC File (\`MOC.md\`)`,
    ``,
    `\`\`\`yaml`,
    `---`,
    `type: moc`,
    `title: "<Title>"`,
    `version: "4.0.0"`,
    `generated: "YYYY-MM-DD"`,
    `tags: [moc, genorah, v4]`,
    `---`,
    `\`\`\``,
    ``,
    `## Dataview Example Queries`,
    ``,
    `\`\`\`dataview`,
    `TABLE tier, capabilities FROM "agents" WHERE type != "index" SORT tier ASC`,
    `\`\`\``,
    ``,
    `\`\`\`dataview`,
    `TABLE group, tier FROM "archetypes" WHERE type != "index" SORT group ASC`,
    `\`\`\``,
  ].join("\n");

  writeFile(join(OUT, "frontmatter-schema.md"), schema + "\n");
  stats.files++;
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log("Building Genorah v4 knowledge bundle...\n");

ensureDir(OUT);

buildAgents();
buildArchetypes();
buildCommands();
buildSkills();
buildMOC();
buildFrontmatterSchema();

const totalFiles = stats.files;

console.log(`Knowledge bundle written to: docs/v4-knowledge-bundle/`);
console.log(`\nStats:`);
console.log(`  Agents:     ${stats.agents}`);
console.log(`  Archetypes: ${stats.archetypes}`);
console.log(`  Commands:   ${stats.commands} (commands/index.md)`);
console.log(`  Skills:     ${stats.skills} (skills/index.md)`);
console.log(`  Total files: ${totalFiles}`);
