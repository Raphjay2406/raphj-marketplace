#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const cards = JSON.parse(readFileSync(".claude-plugin/generated/agent-cards.json", "utf8"));
const directors = cards.filter(c => c.tier === "director");
const workers = cards.filter(c => c.tier === "worker");

let md = "# Genorah v4 Agent Directory\n\n";
md += `**Total:** ${cards.length} agents (${directors.length} directors + ${workers.length} workers)\n\n`;
md += "## Directors\n\n| ID | Capabilities | Description |\n|---|---|---|\n";
for (const d of directors) md += `| \`${d.id}\` | ${d.capabilities.map(c => c.id).join(", ")} | ${d.description} |\n`;
md += "\n## Workers\n\n| ID | Capabilities | Description |\n|---|---|---|\n";
for (const w of workers) md += `| \`${w.id}\` | ${w.capabilities.map(c => c.id).join(", ")} | ${w.description} |\n`;

mkdirSync(dirname("docs/v4-agent-directory.md"), { recursive: true });
writeFileSync("docs/v4-agent-directory.md", md);
console.log(`wrote ${cards.length} entries`);
