#!/usr/bin/env node
/**
 * v3.4 — Retrofit metadata.pathPatterns to skills where file-type associations exist.
 *
 * Strategy: NOT every skill benefits from pathPatterns. Pipeline/quality/protocol
 * skills trigger on content + command matching (v3.2.1 triggers fallback handles).
 * Framework/file-type skills genuinely benefit from pathPattern injection.
 *
 * This script adds metadata blocks to ~40 skills where patterns are clear,
 * leaves the remaining ~110 on trigger-based matching.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SKILLS = join(ROOT, 'skills');

const PATTERN_MAP = {
  // React / JSX / TSX generic
  'react-vite-patterns':      ['**/*.tsx', '**/*.jsx'],
  'nextjs-patterns':          ['**/app/**/*.tsx', '**/pages/**/*.tsx', '**/*.tsx'],
  'astro-patterns':           ['**/*.astro'],
  'svelte-patterns':          ['**/*.svelte'],
  'vue-patterns':             ['**/*.vue'],
  'nuxt-patterns':            ['**/*.vue', '**/nuxt.config.ts'],
  'tailwind-system':          ['**/tailwind.config.*', '**/*.css', '**/*.tsx', '**/*.jsx'],
  'shadcn-components':        ['**/components/ui/*.tsx', '**/*.tsx'],

  // Mobile
  'mobile-swift':             ['**/*.swift'],
  'mobile-kotlin':            ['**/*.kt', '**/*.kts'],
  'mobile-react-native':      ['**/*.tsx', '**/*.jsx', '**/App.tsx'],
  'mobile-expo':              ['**/app/**/*.tsx', '**/app.json'],
  'mobile-flutter':           ['**/*.dart'],

  // Styling / CSS / motion
  'anchor-positioning':       ['**/*.css', '**/*.tsx', '**/*.jsx'],
  'speculation-rules':        ['**/*.tsx', '**/*.astro', '**/_document.tsx'],
  'cross-doc-view-transitions': ['**/*.css', '**/*.tsx', '**/*.astro'],
  'cinematic-motion':         ['**/*.tsx', '**/*.jsx', '**/*.css'],
  'page-transitions':         ['**/*.tsx', '**/*.jsx', '**/*.astro'],
  'kinetic-typography':       ['**/*.tsx', '**/*.jsx'],
  'glow-neon-effects':        ['**/*.css', '**/*.tsx'],
  'skeleton-loading':         ['**/*.tsx', '**/*.jsx'],

  // Markdown/MDX
  'markdown-mdx':             ['**/*.md', '**/*.mdx'],
  'blog-patterns':            ['**/*.md', '**/*.mdx', '**/blog/**/*'],

  // Components & patterns
  'data-table':               ['**/data-table.tsx', '**/table/*.tsx'],
  'drag-and-drop':            ['**/*.tsx', '**/*.jsx'],
  'auth-ui':                  ['**/auth/**/*.tsx', '**/login/*.tsx', '**/signup/*.tsx'],
  'form-builder':             ['**/form/**/*.tsx', '**/*.tsx'],
  'context-menu':             ['**/*.tsx', '**/*.jsx'],
  'navigation-patterns':      ['**/nav/**/*.tsx', '**/layout.tsx', '**/header.tsx'],
  'search-ui':                ['**/search/**/*.tsx', '**/*.tsx'],
  'landing-page':             ['**/page.tsx', '**/index.tsx', '**/landing/*.tsx'],
  'dashboard-patterns':       ['**/dashboard/**/*.tsx', '**/admin/**/*.tsx'],
  'chart-data-viz':           ['**/charts/*.tsx', '**/*.tsx'],
  'error-states-ui':          ['**/error.tsx', '**/not-found.tsx', '**/*.tsx'],
  'notification-center':      ['**/*.tsx', '**/*.jsx'],
  'rating-review':            ['**/*.tsx', '**/*.jsx'],

  // 3D + assets
  '3d-asset-generation':      ['**/*.tsx', '**/*.gltf', '**/*.glb'],
  '3dsvg-extrusion':          ['**/*.tsx', '**/*.svg'],
  'three-d-webgl-effects':    ['**/*.tsx', '**/*.jsx', '**/*.glsl'],
  'gltf-optimization':        ['**/*.gltf', '**/*.glb', '**/*.ktx2'],
  'shape-asset-generation':   ['**/*.svg', '**/*.tsx'],
  'image-asset-pipeline':     ['**/public/**/*.{png,jpg,webp,avif}', '**/*.tsx'],

  // Integrations
  'hubspot-integration':      ['**/hubspot/**/*.ts', '**/*.ts'],
  'stripe-integration':       ['**/stripe/**/*.ts', '**/webhooks/*.ts'],
  'shopify-integration':      ['**/shopify/**/*.ts', '**/*.ts'],
  'woocommerce-integration':  ['**/woo/**/*.ts', '**/*.ts'],
  'propstack-integration':    ['**/propstack/**/*.ts', '**/*.ts'],
  'cms-sanity':               ['**/sanity/**/*.ts', '**/sanity.config.ts'],
  'cms-payload':              ['**/payload/**/*.ts', '**/payload.config.ts'],
  'cms-content-pipeline':     ['**/content/**/*', '**/*.ts'],

  // Testing / perf / SEO / a11y
  'testing-patterns':         ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
  'accessibility':            ['**/*.tsx', '**/*.jsx', '**/*.astro'],
  'seo-technical':            ['**/app/robots.ts', '**/app/sitemap.ts', '**/*.tsx'],
  'structured-data':          ['**/*.tsx', '**/layout.tsx'],
  'structured-data-v2':       ['**/*.tsx', '**/layout.tsx'],
  'og-images':                ['**/opengraph-image.tsx', '**/og/**/*'],
  'performance-patterns':     ['**/next.config.*', '**/vite.config.*', '**/*.tsx'],
  'performance-animation':    ['**/*.tsx', '**/*.jsx', '**/*.css'],

  // Video / media
  'remotion-video':           ['**/remotion/**/*.tsx'],
  'remotion-section-video':   ['**/remotion/**/*.tsx'],
  'file-upload-media':        ['**/upload/**/*.tsx', '**/*.tsx'],

  // Typography
  'typography-rules':         ['**/*.tsx', '**/*.mdx', '**/*.md'],

  // i18n
  'i18n-rtl':                 ['**/messages/*.json', '**/i18n/**/*', '**/*.tsx'],
};

const BASH_PATTERN_MAP = {
  'git-workflow':             ['git commit', 'git worktree', 'git log'],
  'lighthouse-ci-setup':      ['lhci', 'lighthouse-ci'],
};

function retrofitOne(skillName, pathPatterns, bashPatterns) {
  const md = join(SKILLS, skillName, 'SKILL.md');
  if (!existsSync(md)) return { skill: skillName, status: 'missing' };

  let raw = readFileSync(md, 'utf8').replace(/\r\n/g, '\n');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { skill: skillName, status: 'no-frontmatter' };

  const fm = fmMatch[1];
  // Skip if metadata block already exists
  if (/^metadata:\s*\n\s+(pathPatterns|bashPatterns):/m.test(fm)) {
    return { skill: skillName, status: 'already-has-metadata' };
  }

  // Build the metadata block
  const lines = ['metadata:'];
  if (pathPatterns?.length) {
    lines.push('  pathPatterns:');
    for (const p of pathPatterns) lines.push(`    - "${p}"`);
  }
  if (bashPatterns?.length) {
    lines.push('  bashPatterns:');
    for (const p of bashPatterns) lines.push(`    - "${p}"`);
  }
  const metadataBlock = lines.join('\n');

  // Insert before closing ---
  const newFm = fm.trimEnd() + '\n' + metadataBlock;
  const newRaw = raw.replace(fmMatch[0], `---\n${newFm}\n---`);
  writeFileSync(md, newRaw);

  return { skill: skillName, status: 'retrofitted' };
}

const results = [];

for (const [name, patterns] of Object.entries(PATTERN_MAP)) {
  const bashPatterns = BASH_PATTERN_MAP[name];
  results.push(retrofitOne(name, patterns, bashPatterns));
}
for (const [name, bashPatterns] of Object.entries(BASH_PATTERN_MAP)) {
  if (PATTERN_MAP[name]) continue; // already handled above
  results.push(retrofitOne(name, undefined, bashPatterns));
}

const byStatus = results.reduce((acc, r) => ((acc[r.status] = (acc[r.status] || 0) + 1), acc), {});
console.log('v3.4 metadata retrofit results:');
for (const [status, count] of Object.entries(byStatus)) console.log(`  ${status}: ${count}`);
console.log(`Skills NOT retrofitted (rely on v3.2.1 triggers fallback): ${readdirSync(SKILLS).filter(n => !n.startsWith('_')).length - Object.keys(PATTERN_MAP).length}`);
