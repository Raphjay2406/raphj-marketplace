// scripts/companion/components.mjs
export const TOKENS = ['bg','surface','text','border','primary','secondary','accent','muted','glow','tension','highlight','signature'];

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function swatchRow(palette) {
  const chips = TOKENS.map(t => {
    const hex = palette[t] || '#000000';
    return `<div class="cmp-swatch"><span class="cmp-chip" style="background:${esc(hex)}"></span>`
      + `<code>${esc(t)}</code><code class="cmp-hex">${esc(hex)}</code></div>`;
  }).join('');
  return `<div class="cmp-swatches">${chips}</div>`;
}

export function fontLinkAll(options) {
  const fams = [];
  for (const o of options) {
    for (const f of [o.fonts?.display, o.fonts?.body, o.fonts?.mono]) {
      if (f) fams.push(f.trim());
    }
  }
  const uniq = [...new Set(fams)];
  if (!uniq.length) return '';
  const q = uniq.map(f => `family=${esc(f).replace(/\s+/g, '+')}:wght@400;600;700`).join('&');
  return `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${q}&display=swap">`;
}

export function typeSpecimen(option) {
  const p = option.palette;
  const disp = option.fonts?.display || 'Georgia';
  const body = option.fonts?.body || 'system-ui';
  return `<div class="cmp-specimen" style="background:${esc(p.bg)};border-color:${esc(p.border)}">`
    + `<div class="cmp-display" style="font-family:'${esc(disp)}',serif;color:${esc(p.text)}">${esc(option.label)}</div>`
    + `<div class="cmp-body" style="font-family:'${esc(body)}',sans-serif;color:${esc(p.muted)}">The quick brown fox jumps over the lazy dog — 0123456789</div>`
    + `<span class="cmp-cta" style="background:${esc(p.primary)};color:${esc(p.bg)}">Primary action</span>`
    + `</div>`;
}

export function heroBlock(option) {
  const p = option.palette;
  const h = option.hero || {};
  if (h.imagePath) {
    return `<div class="cmp-hero"><img src="/files/${esc(h.imagePath)}" alt="${esc(option.label)} hero"></div>`;
  }
  const from = h.gradientFrom || p.bg;
  const to = h.gradientTo || p.signature || p.primary;
  return `<div class="cmp-hero" style="background:linear-gradient(135deg, ${esc(from)}, ${esc(to)})"></div>`;
}

export function mockupBlock(blocks, p) {
  const row = (b) => {
    switch (b.kind) {
      case 'nav': return `<div class="mk-row mk-nav" style="background:${esc(p.surface)};border-color:${esc(p.border)}">`
        + `<span style="color:${esc(p.primary)}">${esc(b.label || 'Logo')}</span><span style="color:${esc(p.muted)}">menu</span></div>`;
      case 'hero': return `<div class="mk-row mk-hero" style="background:${esc(p.bg)};color:${esc(p.text)}">`
        + `<span class="mk-h1">${esc(b.label || 'Headline')}</span>`
        + `<span class="mk-cta" style="background:${esc(p.primary)};color:${esc(p.bg)}">CTA</span></div>`;
      case 'text': return `<div class="mk-row mk-text" style="background:${esc(p.bg)}">`
        + `<span style="background:${esc(p.muted)}"></span><span style="background:${esc(p.muted)}"></span></div>`;
      case 'cards': return `<div class="mk-row mk-cards" style="background:${esc(p.bg)}">`
        + [0, 1, 2].map(() => `<span style="background:${esc(p.surface)};border-color:${esc(p.border)}"></span>`).join('') + `</div>`;
      case 'cta': return `<div class="mk-row mk-ctaband" style="background:${esc(p.accent)};color:${esc(p.bg)}">${esc(b.label || 'Get started')}</div>`;
      case 'footer': return `<div class="mk-row mk-footer" style="background:${esc(p.surface)};color:${esc(p.muted)}">footer</div>`;
      default: return '';
    }
  };
  return `<div class="cmp-mockup" style="border-color:${esc(p.border)}">${(blocks || []).map(row).join('')}</div>`;
}

function lum(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return 0;
  const n = parseInt(m[1], 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
function ratio(a, b) {
  const l1 = lum(a), l2 = lum(b);
  const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

export function contrastBadges(p) {
  const pairs = [['text/bg', p.text, p.bg], ['primary/bg', p.primary, p.bg]];
  return `<div class="cmp-contrast">` + pairs.map(([name, fg, bg]) => {
    const r = ratio(fg, bg);
    const ok = r >= 4.5;
    return `<span class="cmp-badge ${ok ? 'ok' : 'warn'}">${esc(name)} ${r.toFixed(2)} ${ok ? 'AA' : 'low'}</span>`;
  }).join('') + `</div>`;
}

export function choiceCard(option) {
  const p = option.palette;
  return `<div class="card cmp-card" data-choice="${esc(option.id)}">`
    + `<h3>${esc(option.label)}</h3>`
    + (option.blurb ? `<p>${esc(option.blurb)}</p>` : '')
    + heroBlock(option)
    + mockupBlock(option.mockup?.blocks || [], p)
    + swatchRow(p)
    + typeSpecimen(option)
    + (option.showContrast ? contrastBadges(p) : '')
    + (option.motionHint ? `<p class="cmp-motion">↻ ${esc(option.motionHint)}</p>` : '')
    + (option.badges || []).map(b => `<span class="cmp-badge">${esc(b)}</span>`).join('')
    + `</div>`;
}

export function styleBlock() {
  return `<style>
  .cmp-title{font-size:20px;font-weight:700;margin-bottom:4px}
  .cmp-card{display:flex;flex-direction:column;gap:10px;cursor:pointer}
  .cmp-hero{height:120px;border-radius:8px;overflow:hidden}
  .cmp-hero img{width:100%;height:100%;object-fit:cover;display:block}
  .cmp-mockup{display:flex;flex-direction:column;gap:3px;border:1px solid;border-radius:8px;overflow:hidden;padding:3px}
  .mk-row{padding:8px 10px;font-size:11px;border-radius:4px}
  .mk-nav{display:flex;justify-content:space-between;border:1px solid}
  .mk-hero{display:flex;flex-direction:column;gap:6px;align-items:flex-start;padding:16px 10px}
  .mk-h1{font-size:15px;font-weight:700}
  .mk-cta{padding:3px 8px;border-radius:4px;font-size:10px}
  .mk-text span{display:block;height:6px;border-radius:3px;margin:4px 0;opacity:.5}
  .mk-cards{display:flex;gap:6px}.mk-cards span{flex:1;height:34px;border:1px solid;border-radius:4px}
  .mk-ctaband{text-align:center;font-weight:600}
  .cmp-swatches{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
  .cmp-swatch{display:flex;flex-direction:column;align-items:center;gap:2px}
  .cmp-chip{width:100%;height:24px;border-radius:4px;border:1px solid rgba(0,0,0,.2)}
  .cmp-swatch code{font-size:9px;opacity:.8}.cmp-hex{opacity:.5}
  .cmp-specimen{border:1px solid;border-radius:8px;padding:12px}
  .cmp-display{font-size:22px;font-weight:700;line-height:1.1}
  .cmp-body{font-size:12px;margin:6px 0}
  .cmp-cta{display:inline-block;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600}
  .cmp-contrast{display:flex;gap:6px;flex-wrap:wrap}
  .cmp-badge{font-size:10px;padding:2px 7px;border-radius:99px;background:var(--surface);border:1px solid var(--border)}
  .cmp-badge.ok{color:#22c55e}.cmp-badge.warn{color:#f59e0b}
  .cmp-motion{font-size:11px;color:var(--text-muted)}
  </style>`;
}
