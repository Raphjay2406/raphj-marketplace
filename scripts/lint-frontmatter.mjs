#!/usr/bin/env node
/**
 * Validate skill + agent + command frontmatter.
 * CRITICAL (fail): skills must have name + description + tier + version, must NOT use `category:`.
 * ADVISORY (warn only): agents tools-format, commands argument-hint.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
let failures = 0;
let warnings = 0;

function fm(file) {
  const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fields = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2];
  }
  return { fields, raw: m[1] };
}

function fail(msg, file) {
  console.error(`  ✗ ${file.replace(ROOT, '.')} — ${msg}`);
  failures++;
}
function warn(msg, file) {
  console.warn(`  ⚠ ${file.replace(ROOT, '.')} — ${msg}`);
  warnings++;
}

// Skills — strict
const skillsDir = join(ROOT, 'skills');
for (const name of readdirSync(skillsDir)) {
  if (name.startsWith('_')) continue;
  const skillMd = join(skillsDir, name, 'SKILL.md');
  if (!existsSync(skillMd)) continue;
  const f = fm(skillMd);
  if (!f) { fail('no frontmatter', skillMd); continue; }
  for (const field of ['name', 'description', 'tier', 'version']) {
    if (!f.fields[field]) fail(`missing ${field}:`, skillMd);
  }
  if (f.raw.match(/^category:/m)) fail("uses 'category:' (must be 'tier:')", skillMd);
}

// Agents — lenient (pre-v3.1 agents predate canonical contract)
function* walkAgents(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walkAgents(p);
    else if (name.endsWith('.md')) yield p;
  }
}
for (const agent of walkAgents(join(ROOT, 'agents'))) {
  const f = fm(agent);
  if (!f) { fail('no frontmatter', agent); continue; }
  if (!f.fields.name) fail('missing name:', agent);
  if (!f.fields.description) fail('missing description:', agent);
  if (f.fields.tools?.startsWith('[')) warn('tools: should be comma-string (not JSON array)', agent);
}

// Commands — lenient
for (const name of readdirSync(join(ROOT, 'commands'))) {
  if (!name.endsWith('.md')) continue;
  const cmd = join(ROOT, 'commands', name);
  const f = fm(cmd);
  if (!f) { fail('no frontmatter', cmd); continue; }
  if (!f.fields.description) fail('missing description:', cmd);
}

console.log(`\nCRITICAL ${failures} | ADVISORY ${warnings}`);
if (failures > 0) process.exit(1);
