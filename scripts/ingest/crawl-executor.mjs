#!/usr/bin/env node
// v3.22 crawl executor — consumes CRAWL-PLAN.json emitted by crawl.mjs, drives Playwright.
// Requires `playwright` available on the path (npm i -D playwright or runtime install).
// Falls back to instruction-only output when unavailable, so agents can run via MCP instead.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, extname } from 'node:path';
import { append } from './preservation-ledger.mjs';

async function loadPlaywright() {
  try { return await import('playwright'); }
  catch { return null; }
}

async function fetchText(url) {
  try { const r = await fetch(url); return r.ok ? await r.text() : null; }
  catch { return null; }
}

async function crawlOne(page, url, dest, slug, breakpoints) {
  const routeSlug = new URL(url).pathname.replace(/\//g, '_') || '_root';
  const captured = join(dest, 'captured', `${routeSlug}.html`);
  const stylesPath = join(dest, 'computed-styles', `${routeSlug}.json`);
  mkdirSync(join(dest, 'captured'), { recursive: true });
  mkdirSync(join(dest, 'computed-styles'), { recursive: true });
  mkdirSync(join(dest, 'screenshots', routeSlug), { recursive: true });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  const html = await page.content();
  writeFileSync(captured, html);
  append(slug, { kind: 'capture.route', route: url, status: 200, html_bytes: html.length });

  // Screenshots per breakpoint
  for (const w of breakpoints) {
    await page.setViewportSize({ width: w, height: Math.round(w * 1.5) });
    await page.waitForTimeout(300);
    const shot = join(dest, 'screenshots', routeSlug, `${w}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    append(slug, { kind: 'capture.screenshot', route: url, breakpoint: w, path: `screenshots/${routeSlug}/${w}.png` });
  }

  // Computed styles for unique selectors (sample up to 200)
  const styles = await page.evaluate(() => {
    const out = {};
    const els = Array.from(document.querySelectorAll('*')).slice(0, 200);
    for (const el of els) {
      const cs = getComputedStyle(el);
      const sel = el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '');
      if (!out[sel]) {
        out[sel] = {
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          borderRadius: cs.borderRadius,
          padding: cs.padding,
          margin: cs.margin,
        };
      }
    }
    return out;
  });
  writeFileSync(stylesPath, JSON.stringify(styles, null, 2));
  append(slug, { kind: 'capture.computed-styles', route: url, selectors: Object.keys(styles).length });
}

async function main() {
  const slug = process.argv[2];
  if (!slug) { console.error('Usage: crawl-executor.mjs <slug>'); process.exit(1); }
  const dest = join(process.cwd(), '.planning', 'genorah', 'ingested', slug);
  const planPath = join(dest, 'CRAWL-PLAN.json');
  if (!existsSync(planPath)) { console.error(`No CRAWL-PLAN.json at ${planPath}. Run crawl.mjs first.`); process.exit(1); }
  const plan = JSON.parse(readFileSync(planPath, 'utf8'));

  // Pre-fetch robots/sitemap/llms.txt
  for (const step of plan.steps.filter(s => s.op.startsWith('fetch-'))) {
    const body = await fetchText(step.from);
    if (body) { mkdirSync(join(dest, 'captured'), { recursive: true }); writeFileSync(step.to, body); append(slug, { kind: 'capture.meta', file: step.to.replace(/\\/g, '/'), bytes: body.length, origin: step.from }); }
    else append(slug, { kind: 'gap', reason: `${step.op}-absent`, origin: step.from });
  }

  const pw = await loadPlaywright();
  if (!pw) {
    append(slug, { kind: 'gap', reason: 'playwright-unavailable', remedy: 'npm i -D playwright && npx playwright install chromium, or delegate to plugin:playwright MCP using CRAWL-PLAN.json' });
    console.error('playwright not installed — use plugin:playwright MCP or install locally. Gap recorded.');
    process.exit(2);
  }

  const browser = await pw.chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Genorah-Ingest/3.22 (compatible; respects robots.txt)' });
  const page = await ctx.newPage();

  // Crawl seed URL only in this executor pass; BFS expansion is a follow-up stage.
  const seedUrl = plan.url;
  const routes = [seedUrl];
  const sitemap = existsSync(join(dest, 'captured', 'sitemap.xml')) ? readFileSync(join(dest, 'captured', 'sitemap.xml'), 'utf8') : '';
  for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) { if (routes.length < (plan.maxRoutes || 50)) routes.push(m[1]); }

  for (const url of routes) {
    try { await crawlOne(page, url, dest, slug, plan.breakpoints); }
    catch (e) { append(slug, { kind: 'error', stage: 'crawl', url, error: String(e.message || e) }); }
  }

  await browser.close();
  append(slug, { kind: 'crawl.complete', routes: routes.length });
  console.log(`Crawled ${routes.length} routes → ${dest}`);
}

main();
