import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

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

test('every skill has required frontmatter fields', () => {
  const skillsDir = join(ROOT, 'skills');
  for (const name of readdirSync(skillsDir)) {
    if (name.startsWith('_')) continue;
    const md = join(skillsDir, name, 'SKILL.md');
    if (!existsSync(md)) continue;
    const f = fm(md);
    assert.ok(f, `skills/${name}/SKILL.md missing frontmatter`);
    for (const field of ['name', 'description', 'tier', 'version']) {
      assert.ok(f.fields[field], `skills/${name}/SKILL.md missing ${field}:`);
    }
  }
});

test('no skill uses category: (must be tier:)', () => {
  const skillsDir = join(ROOT, 'skills');
  for (const name of readdirSync(skillsDir)) {
    if (name.startsWith('_')) continue;
    const md = join(skillsDir, name, 'SKILL.md');
    if (!existsSync(md)) continue;
    const raw = readFileSync(md, 'utf8').replace(/\r\n/g, '\n');
    const hasCategoryDef = raw.match(/^---\n([\s\S]*?)\n---/)?.[1].match(/^category:\s/m);
    assert.equal(hasCategoryDef, null, `skills/${name}/SKILL.md uses 'category:' — must be 'tier:'`);
  }
});

test('every agent has name + description frontmatter', () => {
  function* walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const s = statSync(p);
      if (s.isDirectory()) yield* walk(p);
      else if (name.endsWith('.md')) yield p;
    }
  }
  for (const agent of walk(join(ROOT, 'agents'))) {
    const f = fm(agent);
    assert.ok(f, `${agent} missing frontmatter`);
    assert.ok(f.fields.name, `${agent} missing name:`);
    assert.ok(f.fields.description, `${agent} missing description:`);
  }
});
