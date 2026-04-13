#!/usr/bin/env node
import { readFileSync } from "fs";

const dnaPath = ".planning/genorah/DESIGN-DNA.md";
let dna;
try { dna = readFileSync(dnaPath, "utf8"); }
catch { console.error(`no ${dnaPath}`); process.exit(1); }

const brandEssence = (/brand_essence:\s*(.+)$/m.exec(dna) || [])[1] || "Genorah project";
const projectId = (/project_id:\s*(.+)$/m.exec(dna) || [])[1] || "default";

if (!process.env.ROD_API_KEY) {
  console.log("ROD_API_KEY not set — signature forge requires Rodin API. Skipping.");
  process.exit(0);
}

// Production: dispatch SignatureForge here.
console.log(`would forge signature for ${projectId} (essence: ${brandEssence})`);
