// Mock HTTP servers mimicking Sanity / Contentful / Payload responses →
// cms-schema.mjs dispatcher → CMS-SCHEMA.md + manifests/cms-schema.json + ledger.
//
// Base URLs redirected via env vars SANITY_BASE / CONTENTFUL_BASE / --base (Payload).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawn } from 'node:child_process';

function spawnAsync(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { ...opts, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    child.stdout.on('data', d => (stdout += d.toString('utf8')));
    child.stderr.on('data', d => (stderr += d.toString('utf8')));
    child.on('error', reject);
    child.on('close', status => resolve({ status, stdout, stderr }));
  });
}
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'ingest', 'cms-schema.mjs');

function startServer(handler) {
  return new Promise(resolve => {
    const server = createServer(handler);
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

function prepSlug(dir, slug) {
  const slugDir = join(dir, '.planning', 'genorah', 'ingested', slug);
  mkdirSync(join(slugDir, 'manifests'), { recursive: true });
  return slugDir;
}

function makeSandbox() {
  const dir = mkdtempSync(join(tmpdir(), 'genorah-cms-'));
  return { dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

function readLedger(slugDir) {
  return readFileSync(join(slugDir, 'preservation.ledger.ndjson'), 'utf8')
    .split('\n').filter(Boolean).map(l => JSON.parse(l));
}

test('cms-schema: Sanity → hero/pricing/testimonial mapping + unknown gap', async () => {
  const { server, port } = await startServer((req, res) => {
    if (req.url.includes('array%3A%3Aunique')) {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ result: ['hero', 'pricingPlan', 'testimonial', 'mysteryWidget'] }));
    }
    const typeMatch = req.url.match(/_type%20%3D%3D%20%22(\w+)%22/);
    const typeName = typeMatch?.[1];
    const samples = {
      hero: { _id: 'a', _type: 'hero', title: 'x', subtitle: 'y', media: { url: 'img' } },
      pricingPlan: { _id: 'b', _type: 'pricingPlan', name: 'Pro', price: 49, features: ['a'] },
      testimonial: { _id: 'c', _type: 'testimonial', quote: 'x', author: 'y' },
      mysteryWidget: { _id: 'd', _type: 'mysteryWidget', blob: 1 },
    };
    if (typeName && samples[typeName]) {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ result: samples[typeName] }));
    }
    res.writeHead(404); res.end();
  });

  const { dir, cleanup } = makeSandbox();
  try {
    const slugDir = prepSlug(dir, 's');
    const out = await spawnAsync('node', [SCRIPT, 's', '--cms=sanity', '--project=p', '--dataset=production', '--token=t'], {
      encoding: 'utf8',
      cwd: dir,
      env: { ...process.env, SANITY_BASE: `http://127.0.0.1:${port}` },
    });
    assert.equal(out.status, 0, `exit ${out.status}: ${out.stderr}`);

    const md = readFileSync(join(slugDir, 'CMS-SCHEMA.md'), 'utf8');
    assert.match(md, /\| hero \| \d+ \| `hero` \|/);
    assert.match(md, /\| pricingPlan \| \d+ \| `pricing` \|/);
    assert.match(md, /\| testimonial \| \d+ \| `testimonial` \|/);
    assert.match(md, /\| mysteryWidget \| \d+ \| `unknown` \|/);

    const manifest = JSON.parse(readFileSync(join(slugDir, 'manifests', 'cms-schema.json'), 'utf8'));
    assert.equal(manifest.length, 4);

    const ledger = readLedger(slugDir);
    assert.ok(ledger.some(e => e.kind === 'cms.schema-export' && e.platform === 'sanity' && e.types === 4));
    assert.ok(ledger.some(e => e.kind === 'gap' && e.reason === 'cms-type-unmapped' && e.type === 'mysteryWidget'));
  } finally { server.close(); cleanup(); }
});

test('cms-schema: Contentful → full field metadata (type/linkType/required/localized)', async () => {
  const { server, port } = await startServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/vnd.contentful.management.v1+json' });
    res.end(JSON.stringify({
      items: [
        { sys: { id: 'heroBanner' }, name: 'Hero Banner', fields: [
          { id: 'title', type: 'Symbol', required: true, localized: true },
          { id: 'media', type: 'Link', linkType: 'Asset', required: false, localized: false },
        ]},
        { sys: { id: 'faqItem' }, name: 'FAQ Item', fields: [
          { id: 'question', type: 'Symbol', required: true },
          { id: 'answer', type: 'Text', required: true },
        ]},
      ],
    }));
  });

  const { dir, cleanup } = makeSandbox();
  try {
    const slugDir = prepSlug(dir, 'c');
    const out = await spawnAsync('node', [SCRIPT, 'c', '--cms=contentful', '--space=sp', '--token=t'], {
      encoding: 'utf8',
      cwd: dir,
      env: { ...process.env, CONTENTFUL_BASE: `http://127.0.0.1:${port}/content_types` },
    });
    assert.equal(out.status, 0, out.stderr);

    const md = readFileSync(join(slugDir, 'CMS-SCHEMA.md'), 'utf8');
    assert.match(md, /\| heroBanner \| 2 \| `hero` \|/);
    assert.match(md, /\| faqItem \| 2 \| `faq` \|/);

    const manifest = JSON.parse(readFileSync(join(slugDir, 'manifests', 'cms-schema.json'), 'utf8'));
    const hero = manifest.find(t => t.name === 'heroBanner');
    assert.ok(hero.fields.some(f => f.name === 'media' && f.type === 'Link<Asset>'));
    assert.equal(hero.fields.find(f => f.name === 'title').required, true);
    assert.equal(hero.fields.find(f => f.name === 'title').localized, true);
  } finally { server.close(); cleanup(); }
});

test('cms-schema: Payload → discovers via /access, samples collections, filters system fields', async () => {
  const { server, port } = await startServer((req, res) => {
    if (req.url === '/api/access') {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ collections: { pages: {}, articles: {} } }));
    }
    if (req.url.startsWith('/api/pages')) {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ docs: [{ id: '1', slug: 'home', title: 'Home', body: 'x', createdAt: 't', updatedAt: 't' }] }));
    }
    if (req.url.startsWith('/api/articles')) {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ docs: [{ id: '1', title: 'Post', body: 'y', author: 'me', createdAt: 't', updatedAt: 't' }] }));
    }
    res.writeHead(404); res.end();
  });

  const { dir, cleanup } = makeSandbox();
  try {
    const slugDir = prepSlug(dir, 'p');
    const out = await spawnAsync('node', [SCRIPT, 'p', '--cms=payload', `--base=http://127.0.0.1:${port}/api`], {
      encoding: 'utf8',
      cwd: dir,
    });
    if (out.status !== 0) console.error('Payload debug:', { status: out.status, stdout: out.stdout, stderr: out.stderr });
    assert.equal(out.status, 0, `stderr: ${out.stderr}`);

    const md = readFileSync(join(slugDir, 'CMS-SCHEMA.md'), 'utf8');
    assert.match(md, /\| pages \| \d+ \| `page-shell` \|/);
    assert.match(md, /\| articles \| \d+ \| `article` \|/);

    const ledger = readLedger(slugDir);
    assert.ok(ledger.some(e => e.kind === 'cms.schema-export' && e.platform === 'payload' && e.types === 2));
    const pagesMap = ledger.find(e => e.kind === 'cms.type-map' && e.type === 'pages');
    assert.ok(pagesMap.fields >= 2, `expected ≥2 non-system fields on pages, got ${pagesMap.fields}`);
  } finally { server.close(); cleanup(); }
});

test('cms-schema: Sanity without project fails fast', async () => {
  const { dir, cleanup } = makeSandbox();
  try {
    prepSlug(dir, 'q');
    const out = await spawnAsync('node', [SCRIPT, 'q', '--cms=sanity'], { cwd: dir });
    assert.equal(out.status, 2);
    assert.match(out.stderr, /Sanity requires/);
  } finally { cleanup(); }
});

test('cms-schema: unknown platform refused', async () => {
  const { dir, cleanup } = makeSandbox();
  try {
    prepSlug(dir, 'z');
    const out = await spawnAsync('node', [SCRIPT, 'z', '--cms=bogus'], { cwd: dir });
    assert.equal(out.status, 1);
    assert.match(out.stderr, /Unknown --cms/);
  } finally { cleanup(); }
});
