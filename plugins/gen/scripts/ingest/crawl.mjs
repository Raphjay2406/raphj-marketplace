#!/usr/bin/env node
// v3.21 URL ingestion — Playwright crawl. This is the contract/orchestrator.
// Full Playwright capture runs via plugin:playwright MCP or local Playwright install.
// When neither is available, emits the plan file so another agent can execute.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { append } from './preservation-ledger.mjs';

function parseArgs(argv) {
  const out = { url: null, slug: 'ingested-url', maxRoutes: 50, consent: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--') && !out.url) out.url = a;
    else if (a.startsWith('--slug=')) out.slug = a.split('=')[1];
    else if (a.startsWith('--max-routes=')) out.maxRoutes = parseInt(a.split('=')[1], 10);
    else if (a === '--consent') out.consent = true;
  }
  return out;
}

function main() {
  const { url, slug, maxRoutes, consent } = parseArgs(process.argv);
  if (!url) { console.error('Usage: crawl.mjs <url> --slug=<slug> --consent [--max-routes=N]'); process.exit(1); }
  if (!consent) {
    console.error('REFUSED: --consent flag required. Confirm you have authority to scrape this URL per ToS and applicable law.');
    process.exit(2);
  }

  const dest = join(process.cwd(), '.planning', 'genorah', 'ingested', slug);
  mkdirSync(join(dest, 'captured'), { recursive: true });
  mkdirSync(join(dest, 'screenshots'), { recursive: true });
  mkdirSync(join(dest, 'computed-styles'), { recursive: true });
  mkdirSync(join(dest, 'assets'), { recursive: true });
  mkdirSync(join(dest, 'manifests'), { recursive: true });

  append(slug, { kind: 'ingest.start', mode: 'url', origin: url, consent: true });

  const plan = {
    slug,
    url,
    maxRoutes,
    breakpoints: [375, 768, 1280, 1440],
    steps: [
      { op: 'fetch-robots', from: new URL('/robots.txt', url).href, to: `${dest}/captured/robots.txt` },
      { op: 'fetch-sitemap', from: new URL('/sitemap.xml', url).href, to: `${dest}/captured/sitemap.xml` },
      { op: 'fetch-llms', from: new URL('/llms.txt', url).href, to: `${dest}/captured/llms.txt` },
      { op: 'crawl', seedUrl: url, maxRoutes, throttleRps: 2, respectRobots: true },
      { op: 'per-route', capture: ['html', 'computed-styles', 'screenshots:375,768,1280,1440', 'assets'] },
    ],
    executor: 'plugin:playwright MCP or local Playwright',
  };

  writeFileSync(join(dest, 'CRAWL-PLAN.json'), JSON.stringify(plan, null, 2));
  append(slug, { kind: 'crawl.plan-written', steps: plan.steps.length });

  console.log(`Crawl plan written to ${dest}/CRAWL-PLAN.json`);
  console.log('Next: invoke plugin:playwright MCP with this plan, or run a full-Playwright executor script in a follow-up turn.');
}

main();
