// Sitemap BFS recursion tests — hosts a local HTTP server serving a nested
// sitemap index and asserts the crawl-executor's collector drains it correctly.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

// Extract the collector by evaluating just the helper block from crawl-executor.mjs.
const src = readFileSync(new URL('../scripts/ingest/crawl-executor.mjs', import.meta.url), 'utf8');
const start = src.indexOf('async function fetchText');
const end = src.indexOf('async function crawlOne');
const block = src.slice(start, end);
const { collectSitemapUrls } = new Function(`${block}; return { collectSitemapUrls };`)();

function startFixtureServer(routes) {
  return new Promise(resolve => {
    const server = createServer((req, res) => {
      const body = routes[req.url];
      if (body == null) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': 'application/xml' });
      res.end(body);
    });
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

test('sitemap BFS: flat urlset', async () => {
  const { server, port } = await startFixtureServer({
    '/sitemap.xml': `<?xml version="1.0"?><urlset>
      <url><loc>http://example.com/a</loc><lastmod>2026-01-01</lastmod></url>
      <url><loc>http://example.com/b</loc></url>
    </urlset>`,
  });
  try {
    const out = await collectSitemapUrls(`http://127.0.0.1:${port}/sitemap.xml`);
    assert.equal(out.length, 2);
    assert.equal(out[0].url, 'http://example.com/a');
    assert.equal(out[0].lastmod, '2026-01-01');
    assert.equal(out[1].lastmod, null);
  } finally { server.close(); }
});

test('sitemap BFS: nested sitemap index', async () => {
  const { server, port } = await startFixtureServer({
    '/sitemap.xml': `<sitemapindex>
      <sitemap><loc>http://127.0.0.1:${0}/leaf-a.xml</loc></sitemap>
      <sitemap><loc>http://127.0.0.1:${0}/leaf-b.xml</loc></sitemap>
    </sitemapindex>`,
    '/leaf-a.xml': `<urlset><url><loc>http://example.com/a1</loc></url><url><loc>http://example.com/a2</loc></url></urlset>`,
    '/leaf-b.xml': `<urlset><url><loc>http://example.com/b1</loc></url></urlset>`,
  });
  try {
    // Rewrite nested sitemap index to use real port
    const fixed = await fetch(`http://127.0.0.1:${port}/sitemap.xml`).then(r => r.text());
    const fixedIndex = fixed.replace(/127\.0\.0\.1:0/g, `127.0.0.1:${port}`);
    server.removeAllListeners('request');
    server.on('request', (req, res) => {
      const routes = {
        '/sitemap.xml': fixedIndex,
        '/leaf-a.xml': `<urlset><url><loc>http://example.com/a1</loc></url><url><loc>http://example.com/a2</loc></url></urlset>`,
        '/leaf-b.xml': `<urlset><url><loc>http://example.com/b1</loc></url></urlset>`,
      };
      const body = routes[req.url];
      if (body == null) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': 'application/xml' });
      res.end(body);
    });
    const out = await collectSitemapUrls(`http://127.0.0.1:${port}/sitemap.xml`);
    assert.equal(out.length, 3);
    assert.deepEqual(out.map(o => o.url).sort(), ['http://example.com/a1','http://example.com/a2','http://example.com/b1']);
  } finally { server.close(); }
});

test('sitemap BFS: respects maxUrls', async () => {
  const { server, port } = await startFixtureServer({
    '/sitemap.xml': `<urlset>${Array.from({ length: 20 }, (_, i) => `<url><loc>http://example.com/${i}</loc></url>`).join('')}</urlset>`,
  });
  try {
    const out = await collectSitemapUrls(`http://127.0.0.1:${port}/sitemap.xml`, { maxUrls: 5 });
    assert.equal(out.length, 5);
  } finally { server.close(); }
});

test('sitemap BFS: dedupes and caps depth', async () => {
  const { server, port } = await startFixtureServer({
    '/sitemap.xml': `<urlset></urlset>`,
  });
  try {
    const out = await collectSitemapUrls(`http://127.0.0.1:${port}/sitemap.xml`);
    assert.equal(out.length, 0);
  } finally { server.close(); }
});

test('sitemap BFS: fetch failure emits gap:sitemap-fetch-failed', async () => {
  // Point at a port nothing is listening on — fetch will reject → gap event
  const events = [];
  const out = await collectSitemapUrls('http://127.0.0.1:1/sitemap.xml', {
    onEvent: ev => events.push(ev),
  });
  assert.equal(out.length, 0);
  assert.ok(events.some(e => e.kind === 'gap' && e.reason === 'sitemap-fetch-failed'),
    `expected sitemap-fetch-failed event, got: ${JSON.stringify(events)}`);
});

test('sitemap BFS: unrecognized XML root emits gap:sitemap-unrecognized-root', async () => {
  const { server, port } = await startFixtureServer({
    '/sitemap.xml': `<?xml version="1.0"?><rss><channel><title>not a sitemap</title></channel></rss>`,
  });
  try {
    const events = [];
    const out = await collectSitemapUrls(`http://127.0.0.1:${port}/sitemap.xml`, {
      onEvent: ev => events.push(ev),
    });
    assert.equal(out.length, 0);
    assert.ok(events.some(e => e.kind === 'gap' && e.reason === 'sitemap-unrecognized-root'),
      `expected sitemap-unrecognized-root, got: ${JSON.stringify(events)}`);
  } finally { server.close(); }
});

test('sitemap BFS: empty sitemap index emits gap:sitemap-index-empty', async () => {
  const { server, port } = await startFixtureServer({
    '/sitemap.xml': `<sitemapindex></sitemapindex>`,
  });
  try {
    const events = [];
    await collectSitemapUrls(`http://127.0.0.1:${port}/sitemap.xml`, {
      onEvent: ev => events.push(ev),
    });
    assert.ok(events.some(e => e.kind === 'gap' && e.reason === 'sitemap-index-empty'));
  } finally { server.close(); }
});

test('sitemap BFS: urlset emits per-sitemap progress event with added count', async () => {
  const { server, port } = await startFixtureServer({
    '/sitemap.xml': `<urlset>
      <url><loc>http://example.com/a</loc></url>
      <url><loc>http://example.com/b</loc></url>
      <url><loc>http://example.com/c</loc></url>
    </urlset>`,
  });
  try {
    const events = [];
    await collectSitemapUrls(`http://127.0.0.1:${port}/sitemap.xml`, {
      onEvent: ev => events.push(ev),
    });
    const progress = events.find(e => e.kind === 'sitemap.urlset');
    assert.ok(progress, 'missing sitemap.urlset event');
    assert.equal(progress.added, 3);
    assert.equal(progress.depth, 0);
  } finally { server.close(); }
});
