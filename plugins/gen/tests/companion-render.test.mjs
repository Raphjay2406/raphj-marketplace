// tests/companion-render.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  esc, TOKENS, swatchRow, fontLinkAll, typeSpecimen, heroBlock,
  mockupBlock, contrastBadges, choiceCard,
} from '../scripts/companion/components.mjs';

const PAL = {
  bg: '#0a0a0f', surface: '#15151f', text: '#e8e8f0', border: '#2a2a3a',
  primary: '#6366f1', secondary: '#22d3ee', accent: '#f472b6', muted: '#8888a0',
  glow: '#a78bfa', tension: '#ef4444', highlight: '#fde047', signature: '#10b981',
};
const OPT = {
  id: 'aurora', label: 'Aurora', blurb: 'ethereal & luminous',
  palette: PAL, fonts: { display: 'Playfair Display', body: 'Inter', mono: 'JetBrains Mono' },
  mockup: { blocks: [{ kind: 'nav', label: 'Brand' }, { kind: 'hero', label: 'Big' }, { kind: 'footer' }] },
  hero: { gradientFrom: '#0a0a0f', gradientTo: '#10b981' },
  motionHint: 'slow fade-up', badges: ['SOTD-ready'],
};

test('esc neutralizes angle brackets and quotes', () => {
  assert.equal(esc('<a href="x">&'), '&lt;a href=&quot;x&quot;&gt;&amp;');
});

test('TOKENS lists all 12 in order', () => {
  assert.equal(TOKENS.length, 12);
  assert.equal(TOKENS[0], 'bg');
  assert.equal(TOKENS[11], 'signature');
});

test('swatchRow emits every token hex as a background', () => {
  const html = swatchRow(PAL);
  for (const t of TOKENS) assert.ok(html.includes(`background:${PAL[t]}`), `missing ${t}`);
});

test('heroBlock uses an img when imagePath set, gradient otherwise', () => {
  assert.match(heroBlock({ ...OPT, hero: { imagePath: 'aurora.png' } }), /<img src="\/files\/aurora\.png"/);
  assert.match(heroBlock(OPT), /linear-gradient\(135deg, #0a0a0f, #10b981\)/);
});

test('mockupBlock colors blocks with real palette hex', () => {
  const html = mockupBlock(OPT.mockup.blocks, PAL);
  assert.ok(html.includes(`background:${PAL.surface}`)); // nav
  assert.ok(html.includes(`background:${PAL.primary}`)); // hero CTA
});

test('typeSpecimen applies the option fonts and bg', () => {
  const html = typeSpecimen(OPT);
  assert.ok(html.includes("font-family:'Playfair Display'"));
  assert.ok(html.includes(`background:${PAL.bg}`));
});

test('contrastBadges reports a ratio and pass/fail', () => {
  const html = contrastBadges(PAL);
  assert.match(html, /text\/bg/);
  assert.match(html, /\d\.\d{1,2}/); // a ratio number
  assert.match(html, /text\/bg 1[0-9]\.\d{2} AA/); // double-digit ratio with AA label
});

test('choiceCard has data-choice and an h3 with the label', () => {
  const html = choiceCard(OPT);
  assert.match(html, /data-choice="aurora"/);
  assert.match(html, /<h3>Aurora<\/h3>/);
});

test('fontLinkAll unions fonts across options into one link', () => {
  const link = fontLinkAll([OPT, { ...OPT, fonts: { display: 'Lora', body: 'Inter' } }]);
  assert.match(link, /fonts\.googleapis\.com/);
  assert.match(link, /Playfair\+Display/);
  assert.match(link, /Lora/);
  assert.ok(link.split('family=').length - 1 >= 3); // Playfair, Inter, JetBrains, Lora (deduped Inter)
});

// Task 2: renderScreen tests
import { renderScreen } from '../scripts/companion/render-screen.mjs';

const SPEC = {
  kind: 'directions', title: 'Pick a direction', subtitle: 'three ways', multiselect: false,
  options: [
    { id: 'a', label: 'Aurora', blurb: 'x', palette: PAL, fonts: { display: 'Lora', body: 'Inter' },
      mockup: { blocks: [{ kind: 'hero', label: 'Hi' }] }, hero: { gradientFrom: '#000', gradientTo: '#fff' } },
    { id: 'b', label: 'Brutal', blurb: 'y', palette: PAL, fonts: { display: 'Archivo', body: 'Inter' },
      mockup: { blocks: [{ kind: 'nav' }] }, hero: { imagePath: 'b.png' } },
  ],
};

test('renderScreen emits a fragment (no doctype) with both cards', () => {
  const html = renderScreen(SPEC);
  assert.ok(!/<!DOCTYPE|<html/i.test(html), 'must be a fragment');
  assert.match(html, /data-choice="a"/);
  assert.match(html, /data-choice="b"/);
  assert.match(html, /class="cards"/);
});

test('single-select container has no data-multiselect; multiselect adds it', () => {
  assert.ok(!/data-multiselect/.test(renderScreen(SPEC)));
  assert.match(renderScreen({ ...SPEC, multiselect: true }), /class="cards" data-multiselect/);
});

test('palette kind turns on contrast badges', () => {
  const html = renderScreen({ ...SPEC, kind: 'palette' });
  assert.match(html, /text\/bg/);
});

test('font link unions both option display fonts', () => {
  const html = renderScreen(SPEC);
  assert.match(html, /Lora/);
  assert.match(html, /Archivo/);
});

// Task 2 CLI spawn test — proves the Windows pathToFileURL guard actually runs
// Fix: lock all documented mockup kinds so doc and code can't silently drift
test('mockupBlock: every documented kind renders non-empty colored output', () => {
  for (const kind of ['nav', 'hero', 'text', 'cards', 'cta', 'footer']) {
    const html = mockupBlock([{ kind, label: 'X' }], PAL);
    assert.ok(
      html.length > 20 && /#[0-9a-f]{6}/i.test(html),
      `kind "${kind}" must render non-empty HTML containing a palette hex`
    );
  }
});

test('mockupBlock: unknown kind renders empty (default-empty is intentional)', () => {
  const html = mockupBlock([{ kind: 'bogus' }], PAL);
  assert.ok(!html.includes('mk-row'), 'unknown kind must not emit an mk-row element');
});

test('CLI spawn writes screen.html to the output dir', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'companion-cli-'));
  const specPath = join(tmpDir, 'spec.json');
  const outDir = join(tmpDir, 'out');

  const cliSpec = {
    kind: 'directions',
    title: 'CLI test',
    options: [
      {
        id: 'opt1',
        label: 'Option One',
        blurb: 'test blurb',
        palette: PAL,
        fonts: { display: 'Playfair Display', body: 'Inter', mono: 'JetBrains Mono' },
        mockup: { blocks: [{ kind: 'hero', label: 'Hero' }] },
        hero: { gradientFrom: '#0a0a0f', gradientTo: '#6366f1' },
      },
    ],
  };

  writeFileSync(specPath, JSON.stringify(cliSpec));

  // Resolve the CLI script path from this test file's URL (Windows-safe)
  const scriptURL = new URL('../scripts/companion/render-screen.mjs', import.meta.url);
  const scriptPath = scriptURL.pathname.replace(/^\/([A-Za-z]:)/, '$1');

  let stdout;
  try {
    stdout = execFileSync(process.execPath, [scriptPath, '--spec', specPath, '--out', outDir], {
      encoding: 'utf8',
    });
  } catch (err) {
    assert.fail(`CLI exited non-zero:\n${err.stderr ?? err.message}`);
  }

  const writtenPath = join(outDir, 'screen.html');
  assert.ok(existsSync(writtenPath), `screen.html was not created at ${writtenPath}`);

  const content = readFileSync(writtenPath, 'utf8');
  assert.ok(content.includes('data-choice='), 'HTML missing data-choice attribute');
  assert.ok(content.includes(PAL.primary), `HTML missing primary hex ${PAL.primary}`);
  assert.ok(stdout.trim().length > 0, 'CLI printed no path to stdout');
});
