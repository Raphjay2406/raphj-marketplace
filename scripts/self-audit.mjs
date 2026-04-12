#!/usr/bin/env node
/**
 * /gen:self-audit runtime — scriptable counterpart to commands/self-audit.md.
 * Runs the critical subset of checks suitable for CI gating.
 * Exit code: 0 = clean, 1 = BLOCK findings, 2 = script error.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const failOn = args.includes('--fail-on=BLOCK') ? 'BLOCK' : null;

let block = 0, warn = 0, info = 0;

function flag(tier, msg) {
  const symbol = tier === 'BLOCK' ? '❌' : tier === 'WARN' ? '⚠️' : 'ℹ️';
  console.log(`  ${symbol} [${tier}] ${msg}`);
  if (tier === 'BLOCK') block++;
  else if (tier === 'WARN') warn++;
  else info++;
}

// Check 1: version consistency
const plugin = JSON.parse(readFileSync(join(ROOT, '.claude-plugin/plugin.json'), 'utf8'));
const market = JSON.parse(readFileSync(join(ROOT, '.claude-plugin/marketplace.json'), 'utf8'));
const genEntry = market.plugins.find(p => p.name === 'gen');
if (plugin.version !== genEntry.version) {
  flag('BLOCK', `plugin.json ${plugin.version} != marketplace gen ${genEntry.version}`);
}

// Check 2-3: command / agent / skill counts
const commandsCount = readdirSync(join(ROOT, 'commands')).filter(n => n.endsWith('.md')).length;
function countAgents(dir) {
  let n = 0;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) n += countAgents(p);
    else if (name.endsWith('.md')) n++;
  }
  return n;
}
const agentsCount = countAgents(join(ROOT, 'agents'));
const skillDirs = readdirSync(join(ROOT, 'skills')).filter(n => !n.startsWith('_'));
const skillsCount = skillDirs.filter(n => existsSync(join(ROOT, 'skills', n, 'SKILL.md'))).length;
console.log(`  counts — commands: ${commandsCount}, agents: ${agentsCount}, skills: ${skillsCount}`);

// Check 4: skill frontmatter category drift
let categoryDrift = 0;
for (const name of skillDirs) {
  const p = join(ROOT, 'skills', name, 'SKILL.md');
  if (!existsSync(p)) continue;
  const raw = readFileSync(p, 'utf8');
  if (raw.match(/^category:/m)) {
    flag('BLOCK', `skills/${name}/SKILL.md uses 'category:' (must be 'tier:')`);
    categoryDrift++;
  }
}
if (categoryDrift === 0) console.log('  ✓ no category: drift in skill frontmatter');

// Check 5: animation-orchestration word cap (v3.1 guardrail 6a)
const aoPath = join(ROOT, 'skills/animation-orchestration/SKILL.md');
if (existsSync(aoPath)) {
  const words = readFileSync(aoPath, 'utf8').split(/\s+/).filter(Boolean).length;
  if (words > 2500) flag('BLOCK', `animation-orchestration words=${words} > 2500`);
  else console.log(`  ✓ animation-orchestration words=${words} ≤ 2500`);
  // Check 6b: injection_regex field
  if (!readFileSync(aoPath, 'utf8').match(/^injection_regex:/m)) {
    flag('BLOCK', 'animation-orchestration missing injection_regex: frontmatter');
  }
  // Check 6c: no motion-token definitions
  const defLine = readFileSync(aoPath, 'utf8').match(/^\s*--motion-(duration|ease)-\w+:\s*\S/m);
  if (defLine) flag('BLOCK', `animation-orchestration defines a motion token: ${defLine[0]}`);
}

// Check 6: hook files exist
const declaredHooks = [];
for (const evt of Object.values(plugin.hooks)) {
  for (const block of evt) {
    for (const h of block.hooks) declaredHooks.push(h.command);
  }
}
for (const cmd of declaredHooks) {
  const expanded = cmd.replace(/\${CLAUDE_PLUGIN_ROOT}/g, join(ROOT, '.claude-plugin'));
  // Extract path between quotes
  const pathMatch = expanded.match(/"([^"]+)"/);
  if (pathMatch) {
    if (!existsSync(pathMatch[1])) {
      flag('BLOCK', `hook file missing: ${pathMatch[1]}`);
    }
  }
}

// Check 7: plugins/gen mirror drift (exclude _skill-template per v3.1.1)
const mirror = join(ROOT, 'plugins/gen');
if (existsSync(mirror)) {
  const mSkills = readdirSync(join(mirror, 'skills')).filter(n => !n.startsWith('_'));
  if (Math.abs(mSkills.length - skillDirs.length) > 0) {
    flag('WARN', `plugins/gen skills ${mSkills.length} vs root ${skillDirs.length} (after excluding _skill-template)`);
  }
}

// Summary
console.log(`\nSummary: BLOCK=${block}  WARN=${warn}  INFO=${info}`);
if (failOn === 'BLOCK' && block > 0) {
  console.error(`\nFailing due to ${block} BLOCK finding(s) (--fail-on=BLOCK)`);
  process.exit(1);
}
