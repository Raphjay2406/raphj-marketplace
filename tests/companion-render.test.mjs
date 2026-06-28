// tests/companion-render.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
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
