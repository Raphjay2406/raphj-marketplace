#!/usr/bin/env node
import { readFileSync } from "fs";
const target = process.argv[2] || ".claude-plugin/marketplace.json";
const m = JSON.parse(readFileSync(target, "utf8"));
const gen = m.plugins.find(p => p.name === "gen");
if (!gen) { console.error("gen plugin not found in marketplace"); process.exit(1); }
console.log(`Marketplace ready to publish:
  - Plugin: ${gen.name}@${gen.version}
  - Source: ${gen.source}
  - Keywords: ${gen.keywords.length}

To publish to a public marketplace registry (when the Genorah marketplace registry goes live):
  GENORAH_MARKETPLACE_TOKEN=<token> node scripts/release/publish-marketplace.mjs

For now, the manifest is ready at .claude-plugin/marketplace.json.
Users can install via:
  /plugin install ${gen.source} --version ${gen.version}
`);
