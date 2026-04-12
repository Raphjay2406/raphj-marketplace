---
name: font-license-tracker
description: Font license inventory. Every web font + custom font in project tracked with source, license, terms, expiry. Prevents shipped with expired Adobe/Monotype subscription.
tier: domain
triggers: font-license, font-tracking, typography-legal
version: 0.1.0
---

# Font License Tracker

## Layer 1 — Tracking file

`docs/FONTS.md`:

```markdown
# Font Inventory

| Font | Use | Source | License | Commercial? | Expires |
|---|---|---|---|---|---|
| Fraunces | display | Google Fonts | SIL OFL 1.1 | Yes | Never |
| Inter | body | Google Fonts | SIL OFL 1.1 | Yes | Never |
| Söhne | display (premium) | Klim | Proprietary (license #12345) | Yes | 2027-04-12 |
| Founders Grotesk | display | Klim | Proprietary (license #67890) | Yes (desktop+web) | 2027-04-12 |
| Helvetica Neue | fallback | System | Bundled | Yes | Never |
```

## Layer 2 — License categories

| License | Typical use | Commercial free? |
|---|---|---|
| SIL OFL 1.1 | Google Fonts | Yes unlimited |
| Apache-2.0 | IBM Plex, Liberation | Yes unlimited |
| Adobe Fonts | CC subscription required | Tied to sub |
| Monotype | per-view pricing | Depends |
| Foundry (Klim, Grilli Type, Commercial Type) | one-time or yearly | Per contract |
| Custom / owned | client paid | Check contract |

## Layer 3 — Subscription expiry

Adobe Fonts + Monotype + some foundries have subscription dependencies. Track expiry; warn 60 days pre-expiry:

```
⚠️ Söhne license expires 2027-04-12 (60 days).
    Renew via Klim or swap to replacement.
```

## Layer 4 — Self-host vs CDN

**Google Fonts self-host** (performance + privacy):

```css
/* fonts.css */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}
```

Avoids Google Fonts API request (GDPR concern in EU).

**Google Fonts API**: convenience + risk. `<link>` exposes IP to Google per visit.

## Layer 5 — Loading strategy

See existing typography skills; key points:
- `font-display: swap` (show fallback during load)
- Subset fonts (Latin only if no i18n)
- Preload critical fonts: `<link rel="preload" as="font">`
- Variable fonts reduce weight count

## Layer 6 — Integration

- `/gen:security font-audit` verifies all fonts have entry in FONTS.md
- Pre-push hook fails if font imported but not tracked
- Ledger: `font-license-expiring` (60-day warning)

## Layer 7 — Anti-patterns

- ❌ Using Adobe Fonts without tying to paid sub in docs — suddenly breaks
- ❌ Copying OFL file without attribution — license violation
- ❌ Self-hosting without checking license allows redistribution — some foundry licenses don't
- ❌ Ignoring expiry warnings — audit failure on client work
