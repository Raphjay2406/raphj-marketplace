#!/usr/bin/env node
// v3.21 asset provenance — download assets discovered during ingest.
// sha256-name, preserve origin URL, detect license via heuristics, emit gap for unknowns.

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, extname } from 'node:path';
import { append } from './preservation-ledger.mjs';

async function fetchBytes(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return { buf, mime: res.headers.get('content-type') || 'application/octet-stream' };
}

function detectLicense(url) {
  const host = new URL(url).hostname;
  // Heuristic hints only — never authoritative; always demand user confirmation.
  if (/unsplash\.com/.test(host)) return { detected: 'unsplash-license-hint', source: 'host', confirmed_by_user: false };
  if (/pexels\.com/.test(host)) return { detected: 'pexels-license-hint', source: 'host', confirmed_by_user: false };
  if (/wikimedia\.org/.test(host)) return { detected: 'wikimedia-hint', source: 'host', confirmed_by_user: false };
  return { detected: 'unknown', source: null, confirmed_by_user: false };
}

async function main() {
  const [,, slug, ...urls] = process.argv;
  if (!slug || urls.length === 0) { console.error('Usage: asset-download.mjs <slug> <url> [<url>...]'); process.exit(1); }
  const dest = join(process.cwd(), '.planning', 'genorah', 'ingested', slug);
  const assetsDir = join(dest, 'assets');
  mkdirSync(assetsDir, { recursive: true });

  const manifestPath = join(dest, 'manifests', 'assets.json');
  const existing = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : [];

  for (const url of urls) {
    try {
      const { buf, mime } = await fetchBytes(url);
      const sha = createHash('sha256').update(buf).digest('hex');
      const ext = extname(new URL(url).pathname) || '.bin';
      const preserved_at = `assets/${sha.slice(0, 8)}${ext}`;
      writeFileSync(join(dest, preserved_at), buf);
      const license = detectLicense(url);
      const entry = { sha256: sha, preserved_at, origin: url, bytes: buf.length, mime, license };
      existing.push(entry);
      append(slug, { kind: 'asset.download', url, sha256: sha, bytes: buf.length, preserved_at, license: license.detected });
      if (license.detected === 'unknown' || !license.confirmed_by_user) {
        append(slug, { kind: 'gap', reason: 'license-unknown', asset: preserved_at });
      }
      console.log(`✓ ${url} → ${preserved_at} (${license.detected})`);
    } catch (e) {
      append(slug, { kind: 'error', stage: 'asset-download', url, error: String(e) });
      console.error(`✗ ${url}: ${e.message}`);
    }
  }

  writeFileSync(manifestPath, JSON.stringify(existing, null, 2));
}

main();
