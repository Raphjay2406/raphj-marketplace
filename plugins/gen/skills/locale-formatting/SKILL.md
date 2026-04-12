---
name: locale-formatting
description: Intl API patterns — DateTimeFormat, NumberFormat, PluralRules, RelativeTimeFormat, ListFormat. Currency, phone, address formatting per locale.
tier: domain
triggers: intl, locale-formatting, date-format, number-format, plural-rules, currency
version: 0.1.0
---

# Locale Formatting

Never concatenate `"${count} items"` — use `Intl` everywhere.

## Layer 1 — Date/time

```ts
const formatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
  timeStyle: 'short',
});
formatter.format(new Date());
// en-US: "April 12, 2026 at 10:30 AM"
// de-DE: "12. April 2026 um 10:30"
// ja-JP: "2026年4月12日 10:30"
```

## Layer 2 — Numbers + currency

```ts
new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(1234.5);
// en-US: "$1,234.50"
// de-DE: "1.234,50 $"
// hi-IN: "$1,234.50" but if currency INR: "₹1,234.50" (no Indian grouping yet in all browsers)
```

For INR lakh/crore:

```ts
new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(1234567);
// "12,34,567"
```

## Layer 3 — Plurals

```ts
const rules = new Intl.PluralRules(locale);
const messages = {
  zero: 'No items',
  one: '1 item',
  two: '2 items',
  few: '{count} items',
  many: '{count} items',
  other: '{count} items',
};
messages[rules.select(count)].replace('{count}', count);
// Arabic has 6 plural forms; English has 2; Russian has 3+
```

## Layer 4 — Relative time

```ts
const rt = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
rt.format(-1, 'day');  // "yesterday" / "gestern" / "昨日"
rt.format(3, 'week');  // "in 3 weeks" / "in 3 Wochen"
```

## Layer 5 — Lists

```ts
new Intl.ListFormat('en').format(['a', 'b', 'c']);
// "a, b, and c"
new Intl.ListFormat('de').format(['a', 'b', 'c']);
// "a, b und c"
```

## Layer 6 — Addresses + phone

`libphonenumber-js` for phones:

```ts
import { parsePhoneNumber } from 'libphonenumber-js';
parsePhoneNumber('+12125551234').formatInternational();
// "+1 212 555 1234"
```

Addresses: country-specific; reuse `@shopify/address` or Stripe address element.

## Layer 7 — Integration

- Auto-imported helper `lib/locale.ts` with `formatDate`, `formatMoney`, etc.
- UX cognitive-load-gate C2 reading-grade is locale-aware (different band per lang)
- Quality-gate: hardcoded formats flagged by lint rule

## Layer 8 — Anti-patterns

- ❌ `date.toLocaleString()` without specifying locale — inherits OS locale, inconsistent
- ❌ String concat for plurals — breaks in most non-English
- ❌ Hardcoded currency format — misleading to international users
- ❌ No list-format — "a, b, c" reads wrong in Arabic, German
