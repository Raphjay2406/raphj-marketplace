import { readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";

export async function validateRegistry() {
  const dir = "skills/design-archetypes/archetypes";
  if (!existsSync(dir)) return { pass: false, count: 0, issues: ["no archetype dir"] };
  const entries = readdirSync(dir, { withFileTypes: true }).filter(e => e.isDirectory() && !e.name.startsWith("_"));
  const issues = [];
  for (const e of entries) {
    const p = join(dir, e.name, "archetype.json");
    if (!existsSync(p)) { issues.push(`missing archetype.json in ${e.name}`); continue; }
    try {
      const j = JSON.parse(readFileSync(p, "utf8"));
      if (!j.slug || !j.name || !j.mandatory_techniques) issues.push(`incomplete manifest in ${e.name}`);
    } catch (ex) {
      issues.push(`parse error in ${e.name}: ${ex.message}`);
    }
  }
  return { pass: issues.length === 0, count: entries.length, issues };
}
