#!/usr/bin/env node
// v3.21 codebase ingestion — mirror + inventory + framework detect.
// Does NOT interpret design tokens yet — that is stage 3 (dna-extract).

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, resolve } from 'node:path';
import { append } from './preservation-ledger.mjs';

const SKIP_DIRS = new Set(['node_modules', '.git', '.next', '.nuxt', '.svelte-kit', 'dist', 'build', '.cache', 'coverage']);

function walk(root, out = []) {
  for (const name of readdirSync(root)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(root, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function detectFramework(srcRoot) {
  const pkgPath = join(srcRoot, 'package.json');
  if (!existsSync(pkgPath)) return { framework: 'unknown', confidence: 0 };
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (deps.next) return { framework: 'next', version: deps.next, confidence: 1 };
  if (deps.astro) return { framework: 'astro', version: deps.astro, confidence: 1 };
  if (deps['@sveltejs/kit']) return { framework: 'sveltekit', version: deps['@sveltejs/kit'], confidence: 1 };
  if (deps.nuxt) return { framework: 'nuxt', version: deps.nuxt, confidence: 1 };
  if (deps.vite && deps.react) return { framework: 'react-vite', version: deps.vite, confidence: 0.9 };
  if (deps.remix || deps['@remix-run/react']) return { framework: 'remix', confidence: 1 };
  return { framework: 'unknown', confidence: 0.3 };
}

function detectTokenSources(srcRoot) {
  const sources = [];
  const candidates = [
    'tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs',
    'theme.ts', 'theme.js', 'design-tokens.json',
    'src/theme.ts', 'src/styles/theme.ts', 'src/styles/tokens.css',
    'app/globals.css', 'src/app/globals.css', 'src/styles/globals.css',
  ];
  for (const c of candidates) {
    if (existsSync(join(srcRoot, c))) sources.push(c);
  }
  return sources;
}

function main() {
  const [,, path, ...args] = process.argv;
  if (!path) { console.error('Usage: codebase-scan.mjs <path> [--slug=<slug>]'); process.exit(1); }
  const slug = (args.find(a => a.startsWith('--slug=')) || '--slug=ingested').split('=')[1];
  const srcRoot = resolve(path);
  const dest = join(process.cwd(), '.planning', 'genorah', 'ingested', slug);
  const sourceDir = join(dest, 'source');
  mkdirSync(sourceDir, { recursive: true });
  mkdirSync(join(dest, 'manifests'), { recursive: true });

  append(slug, { kind: 'ingest.start', mode: 'codebase', origin: srcRoot });

  const fw = detectFramework(srcRoot);
  append(slug, { kind: 'framework.detect', ...fw });

  const tokenSources = detectTokenSources(srcRoot);
  for (const s of tokenSources) append(slug, { kind: 'token.source', path: s });

  const files = walk(srcRoot);
  const routes = [];
  const components = [];
  for (const f of files) {
    const rel = relative(srcRoot, f);
    const destPath = join(sourceDir, rel);
    mkdirSync(destPath.substring(0, destPath.lastIndexOf('/') || destPath.lastIndexOf('\\')) || sourceDir, { recursive: true });
    copyFileSync(f, destPath);
    const bytes = statSync(f).size;
    const sha = createHash('sha256').update(readFileSync(f)).digest('hex');
    append(slug, { kind: 'capture.file', path: `source/${rel.replace(/\\/g, '/')}`, bytes, sha256: sha });

    // Lightweight inventory — routes and components from common Next/Astro patterns
    if (/app\/.*page\.(tsx|jsx|ts|js|mdx)$/.test(rel) || /pages\/.*\.(tsx|jsx|ts|js|mdx)$/.test(rel) || /src\/routes\/.*\/\+page/.test(rel)) {
      routes.push(rel);
    }
    if (/components?\/.*\.(tsx|jsx|vue|svelte|astro)$/.test(rel)) {
      components.push(rel);
    }
  }

  writeFileSync(join(dest, 'manifests', 'routes.json'), JSON.stringify(routes, null, 2));
  writeFileSync(join(dest, 'manifests', 'components.json'), JSON.stringify(components.map(c => ({ file: c })), null, 2));

  const summary = [
    `# Ingestion Summary`,
    ``,
    `**Slug**: ${slug}`,
    `**Mode**: codebase`,
    `**Origin**: ${srcRoot}`,
    `**Framework**: ${fw.framework} (confidence ${fw.confidence})`,
    `**Token sources**: ${tokenSources.length}`,
    `**Files captured**: ${files.length}`,
    `**Routes detected**: ${routes.length}`,
    `**Components detected**: ${components.length}`,
    ``,
    `## Next steps`,
    ``,
    `1. Run stage 3 (dna-extract)`,
    `2. Run stage 4 (archetype-score)`,
    `3. Review GAP-REPORT.md`,
    `4. /gen:ingest verify ${slug}`,
  ].join('\n');
  writeFileSync(join(dest, 'INGESTION.md'), summary);
  append(slug, { kind: 'ingest.complete', stage: 'capture+inventory', files: files.length, routes: routes.length, components: components.length });
  console.log(`Captured ${files.length} files → ${dest}`);
}

main();
