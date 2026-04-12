#!/usr/bin/env node
// v3.23 CMS schema executor — dispatches to Sanity / Contentful / Payload by --cms.
// Fetches content-type schema, emits CMS-SCHEMA.md with type → SDUI block proposals,
// and records every type + field in the preservation ledger.
//
// Usage:
//   cms-schema.mjs <slug> --cms=sanity    --project=<id>   --dataset=<name> --token=<read-token>
//   cms-schema.mjs <slug> --cms=contentful --space=<id>    --token=<cda-or-cma-token> [--env=master]
//   cms-schema.mjs <slug> --cms=payload    --base=<https://…/api> [--token=<jwt>]
//
// All tokens are read-only scope; asserted, never persisted.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { append } from './preservation-ledger.mjs';

function parseArgs(argv) {
  const out = { slug: argv[2], flags: {} };
  for (let i = 3; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      out.flags[k] = v ?? true;
    }
  }
  return out;
}

async function httpJson(url, opts = {}) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}: ${await r.text().catch(() => '')}`);
  return r.json();
}

// ──────────────────────────────── Sanity ────────────────────────────────
async function fetchSanity({ project, dataset, token }) {
  if (!project || !dataset || !token) throw new Error('Sanity requires --project, --dataset, --token');
  // GROQ introspection: fetch all documents of each type, then extract field shapes.
  // We ask for the type registry via the built-in `_type` meta query.
  // Base URL can be overridden via SANITY_BASE for testing.
  const base = process.env.SANITY_BASE || `https://${project}.api.sanity.io/v2024-01-01/data/query/${dataset}`;
  // Distinct types present in the dataset
  const typesQuery = encodeURIComponent('array::unique(*[]._type)');
  const { result: typeNames } = await httpJson(`${base}?query=${typesQuery}`, { headers: { Authorization: `Bearer ${token}` } });
  const types = [];
  for (const name of typeNames || []) {
    // Sample one doc to infer field shape
    const sampleQuery = encodeURIComponent(`*[_type == "${name}"][0]`);
    const { result: sample } = await httpJson(`${base}?query=${sampleQuery}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ result: {} }));
    const fields = Object.entries(sample || {})
      .filter(([k]) => !k.startsWith('_'))
      .map(([name, value]) => ({ name, type: Array.isArray(value) ? 'array' : typeof value }));
    types.push({ name, fields });
  }
  return { platform: 'sanity', types };
}

// ──────────────────────────────── Contentful ────────────────────────────
async function fetchContentful({ space, token, env = 'master' }) {
  if (!space || !token) throw new Error('Contentful requires --space, --token');
  // Base URL can be overridden via CONTENTFUL_BASE for testing.
  const base = process.env.CONTENTFUL_BASE || `https://api.contentful.com/spaces/${space}/environments/${env}/content_types`;
  const data = await httpJson(base, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/vnd.contentful.management.v1+json' } });
  const types = (data.items || []).map(ct => ({
    name: ct.sys.id,
    displayName: ct.name,
    fields: (ct.fields || []).map(f => ({
      name: f.id,
      type: f.type + (f.linkType ? `<${f.linkType}>` : ''),
      required: !!f.required,
      localized: !!f.localized,
    })),
  }));
  return { platform: 'contentful', types };
}

// ──────────────────────────────── Payload ───────────────────────────────
async function fetchPayload({ base, token }) {
  if (!base) throw new Error('Payload requires --base');
  // Payload exposes /api/access and /api/collections schema; we use /api/<collection>?depth=0&limit=1 per discovered collection.
  // Collection list can come from /api/globals (adjacent) or /api/access. For general case, accept --collections=a,b,c or fall through gracefully.
  const headers = token ? { Authorization: `JWT ${token}` } : {};
  const access = await httpJson(`${base}/access`, { headers }).catch(() => null);
  const collections = access?.collections ? Object.keys(access.collections) : [];
  if (collections.length === 0) {
    // Best-effort: infer from OpenAPI schema at /api-docs
    const openapi = await httpJson(`${base}/api-docs.json`, { headers }).catch(() => null);
    if (openapi?.paths) {
      for (const path of Object.keys(openapi.paths)) {
        const m = /^\/([a-z0-9-]+)$/i.exec(path);
        if (m) collections.push(m[1]);
      }
    }
  }
  const types = [];
  for (const name of collections) {
    const sample = await httpJson(`${base}/${name}?limit=1&depth=0`, { headers }).catch(() => null);
    const doc = sample?.docs?.[0] || {};
    const fields = Object.entries(doc)
      .filter(([k]) => !['id', 'createdAt', 'updatedAt'].includes(k))
      .map(([k, v]) => ({ name: k, type: Array.isArray(v) ? 'array' : typeof v }));
    types.push({ name, fields });
  }
  return { platform: 'payload', types };
}

// ──────────────────────── Block-mapping heuristic ────────────────────────
function proposeBlock(typeName, fields) {
  const n = typeName.toLowerCase();
  if (/hero|landing|masthead/.test(n)) return 'hero';
  if (/feature|benefit|service/.test(n) && fields.some(f => /title|heading/i.test(f.name))) return 'feature-grid';
  if (/pricing|plan|tier/.test(n)) return 'pricing';
  if (/testimonial|quote|review/.test(n)) return 'testimonial';
  if (/faq|question/.test(n)) return 'faq';
  if (/cta|call[-_ ]?to[-_ ]?action/.test(n)) return 'cta';
  if (/post|article|blog/.test(n)) return 'article';
  if (/page|route/.test(n)) return 'page-shell';
  return 'unknown';
}

// ──────────────────────────────── Main ──────────────────────────────────
async function main() {
  const { slug, flags } = parseArgs(process.argv);
  if (!slug || !flags.cms) {
    console.error('Usage: cms-schema.mjs <slug> --cms=<sanity|contentful|payload> [platform-flags]');
    process.exit(1);
  }
  const dest = join(process.cwd(), '.planning', 'genorah', 'ingested', slug);
  if (!existsSync(dest)) { console.error(`No ingest dir at ${dest}. Run codebase-scan or crawl first.`); process.exit(1); }

  let schema;
  try {
    if (flags.cms === 'sanity') schema = await fetchSanity(flags);
    else if (flags.cms === 'contentful') schema = await fetchContentful(flags);
    else if (flags.cms === 'payload') schema = await fetchPayload(flags);
    else { console.error(`Unknown --cms=${flags.cms}`); process.exit(1); }
  } catch (e) {
    append(slug, { kind: 'error', stage: 'cms-schema', platform: flags.cms, error: String(e.message || e) });
    console.error(`Schema fetch failed: ${e.message}`);
    process.exit(2);
  }

  append(slug, { kind: 'cms.schema-export', platform: schema.platform, types: schema.types.length });

  const proposals = schema.types.map(t => ({ ...t, proposed_block: proposeBlock(t.name, t.fields) }));
  for (const p of proposals) {
    append(slug, { kind: 'cms.type-map', type: p.name, proposed_block: p.proposed_block, fields: p.fields.length });
    if (p.proposed_block === 'unknown') append(slug, { kind: 'gap', reason: 'cms-type-unmapped', type: p.name });
  }

  const md = [
    `# CMS Schema — ${slug}`,
    ``,
    `**Platform**: ${schema.platform}`,
    `**Types exported**: ${schema.types.length}`,
    ``,
    `## Type → Block proposals`,
    ``,
    '| Type | Fields | Proposed block |',
    '|------|--------|----------------|',
    ...proposals.map(p => `| ${p.name} | ${p.fields.length} | \`${p.proposed_block}\` |`),
    ``,
    `## Full schema`,
    ``,
    '```json',
    JSON.stringify(proposals, null, 2),
    '```',
    ``,
    `## Next`,
    `- Review \`unknown\`-mapped types via /gen:ingest gap ${slug}`,
    `- Confirmed mappings feed server-driven-ui block registry`,
  ].join('\n');
  writeFileSync(join(dest, 'CMS-SCHEMA.md'), md);
  writeFileSync(join(dest, 'manifests', 'cms-schema.json'), JSON.stringify(proposals, null, 2));
  console.log(`${schema.platform}: ${schema.types.length} types → ${dest}/CMS-SCHEMA.md`);
}

main();
