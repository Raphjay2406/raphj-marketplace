---
name: print-pdf-parity
description: Print + PDF rendering parity. Brandkit PDF must match web. Paged Media CSS + @page rules + page-break rules.
tier: domain
triggers: print-css, pdf-render, paged-media, brandkit-pdf
version: 0.1.0
---

# Print / PDF Parity

Brandkit PDF outputs via Remotion or headless Chrome print. Must match web-rendered equivalent.

## Layer 1 — Paged Media CSS

```css
@page {
  size: A4;
  margin: 2cm;
}

@page :first {
  margin-top: 4cm;  /* cover page */
}

@media print {
  h2, h3 { break-after: avoid; }
  p { orphans: 3; widows: 3; }
  .no-print { display: none; }
}
```

## Layer 2 — Generation via Playwright

```ts
await page.emulateMedia({ media: 'print' });
const pdf = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
});
```

## Layer 3 — Brandkit-specific

```ts
// Generate cover + section pages + appendix + style-guide tokens
const pages = [
  { route: '/brand/cover', format: 'A4' },
  { route: '/brand/tokens', format: 'A4' },
  { route: '/brand/logo-system', format: 'A4' },
  // ...
];
// Playwright generates per-route PDF; merge with pdf-lib
```

## Layer 4 — Visual parity test

```ts
// Rasterize PDF page → compare to web screenshot
const pdfImage = await pdfToImage(pdfBuffer, { page: 0, scale: 2 });
const webImage = await page.screenshot();
const lpips = await comparePerceptual(pdfImage, webImage);
if (lpips > 0.15) flag('PDF drifts from web');
```

## Layer 5 — Integration

- `/gen:brandkit export` runs this parity check
- Chains with brandkit-suite skill
- Ledger: `pdf-parity-drift`

## Layer 6 — Anti-patterns

- ❌ No `-webkit-print-color-adjust: exact` — colors desaturated in print
- ❌ Ignoring page breaks — orphan headings on new page
- ❌ Custom fonts not embedded in PDF — Times New Roman fallback
- ❌ Single-page PDF for 40-page brandkit — forced-scroll UX
