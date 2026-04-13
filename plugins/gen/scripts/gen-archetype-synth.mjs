#!/usr/bin/env node
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";
import { synthesizeArchetype } from "../packages/generative-archetype/dist/index.js";

const [mineJsonPath, slugArg, seedsArg, weightsArg] = process.argv.slice(2);
if (!mineJsonPath || !slugArg || !seedsArg || !weightsArg) {
  console.error("usage: gen-archetype-synth <mine.json> <slug> <seeds-csv> <weights-csv>");
  process.exit(1);
}
const mine = JSON.parse(readFileSync(mineJsonPath, "utf8"));
const seed_templates = seedsArg.split(",");
const blend_weights = weightsArg.split(",").map(Number);
const archetype = synthesizeArchetype({ slug: slugArg, mine, seed_templates, blend_weights });
const dir = join("skills/design-archetypes/archetypes", slugArg);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "archetype.json"), JSON.stringify(archetype, null, 2));
console.log(`wrote ${join(dir, "archetype.json")}`);
