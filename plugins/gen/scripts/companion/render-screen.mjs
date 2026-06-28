// scripts/companion/render-screen.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'node:url';
import { fontLinkAll, choiceCard, styleBlock, esc } from './components.mjs';

export function renderScreen(spec) {
  const opts = (spec.options || []).map(o =>
    spec.kind === 'palette' ? { ...o, showContrast: true } : o);
  const msAttr = spec.multiselect ? ' data-multiselect' : '';
  const cards = opts.map(choiceCard).join('');
  return `${fontLinkAll(opts)}${styleBlock()}`
    + `<h2 class="cmp-title">${esc(spec.title || '')}</h2>`
    + (spec.subtitle ? `<p class="subtitle">${esc(spec.subtitle)}</p>` : '')
    + `<div class="cards"${msAttr}>${cards}</div>`;
}

// CLI
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
  const specPath = arg('--spec');
  const outDir = arg('--out');
  const name = arg('--name', 'screen.html');
  if (!specPath || !outDir) { console.error('--spec <json> and --out <screen-dir> required'); process.exit(2); }
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, name);
  writeFileSync(outPath, renderScreen(spec));
  console.log(outPath);
}
