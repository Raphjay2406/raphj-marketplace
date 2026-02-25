---
name: "i18n-rtl"
description: "Internationalization and RTL patterns: CSS logical properties, Tailwind logical utilities, next-intl setup, Astro i18n, locale-aware formatting, language switcher, bidirectional layout support."
tier: "utility"
triggers: "i18n, internationalization, localization, RTL, right-to-left, Arabic, Hebrew, language, locale, translation, multi-language, l10n, bidirectional"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- Project requires multiple language support (even if RTL is not needed)
- Site targets Arabic, Hebrew, Farsi, or Urdu audiences (RTL layout required)
- Content needs locale-aware formatting (dates, numbers, currencies)
- URL structure needs locale prefixes (`/en/about`, `/ar/about`)

### When NOT to Use

- Single-language English-only projects -- but still use logical properties (`ms-4` over `ml-4`) for future-proofing
- For SEO hreflang tag output only -- use `seo-meta` for the meta tag side; this skill handles the routing and layout

### Decision Tree

- Framework? Next.js uses `next-intl`; Astro uses built-in `i18n` config; React/Vite uses `react-intl` or `i18next`
- RTL support needed? Always use CSS logical properties regardless -- they work in LTR too and prevent future bugs
- Number/date formatting? Always use `Intl.NumberFormat` and `Intl.DateTimeFormat` -- never format manually
- Pluralization? ICU message format (`{count, plural, ...}`) -- Arabic has 6 plural forms
- Directional icons? Flip arrows and chevrons with `rtl:scale-x-[-1]`

### Pipeline Connection

- **Referenced by:** section-builder when project has multiple locales; build-orchestrator for locale routing setup
- **Consumed at:** `/modulo:execute` wave 0 for routing/layout, wave 1+ for component localization
- **Related commands:** `/modulo:start-project` captures target languages during discovery

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: CSS Logical Properties Reference

```tsx
// WRONG -- physical properties break in RTL
<div className="ml-4 pl-3 text-left border-l-2 rounded-tl-lg float-left left-0" />

// CORRECT -- logical properties adapt to text direction
<div className="ms-4 ps-3 text-start border-s-2 rounded-ss-lg float-start start-0" />
```

**Complete logical property mapping (Tailwind):**

| Physical | Logical | CSS Property |
|----------|---------|-------------|
| `ml-4` | `ms-4` | `margin-inline-start` |
| `mr-4` | `me-4` | `margin-inline-end` |
| `pl-4` | `ps-4` | `padding-inline-start` |
| `pr-4` | `pe-4` | `padding-inline-end` |
| `left-0` | `start-0` | `inset-inline-start` |
| `right-0` | `end-0` | `inset-inline-end` |
| `text-left` | `text-start` | `text-align: start` |
| `text-right` | `text-end` | `text-align: end` |
| `border-l` | `border-s` | `border-inline-start` |
| `border-r` | `border-e` | `border-inline-end` |
| `rounded-tl` | `rounded-ss` | `border-start-start-radius` |
| `rounded-tr` | `rounded-se` | `border-start-end-radius` |
| `float-left` | `float-start` | `float: inline-start` |
| `float-right` | `float-end` | `float: inline-end` |

#### Pattern: Next.js i18n Layout with Direction

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const rtlLocales = new Set(["ar", "he", "fa", "ur"]);

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = rtlLocales.has(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className="bg-bg text-text">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

#### Pattern: RTL-Aware Directional Icons

```tsx
interface DirectionalIconProps {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function DirectionalIcon({ icon: Icon, className }: DirectionalIconProps) {
  return <Icon className={`${className ?? "size-4"} rtl:scale-x-[-1]`} />;
}

// Usage -- arrows, chevrons, and progress indicators flip in RTL
<DirectionalIcon icon={ChevronRightIcon} className="size-4 text-muted" />
<DirectionalIcon icon={ArrowRightIcon} className="size-5 text-primary" />
```

#### Pattern: Locale-Aware Formatting

```tsx
// Always use Intl APIs -- never format manually
function formatPrice(amount: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(date);
}

function formatRelativeTime(date: Date, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const diffDays = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return rtf.format(diffDays, "day");
}

function formatList(items: string[], locale: string): string {
  return new Intl.ListFormat(locale, { type: "conjunction" }).format(items);
}

// Examples:
// formatPrice(29.99, "en-US", "USD") => "$29.99"
// formatPrice(29.99, "de-DE", "EUR") => "29,99 €"
// formatPrice(29.99, "ar-SA", "SAR") => "٢٩٫٩٩ ر.س."
// formatDate(new Date(), "ar-SA") => "٢٤ فبراير ٢٠٢٦"
```

#### Pattern: Language Switcher

```tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

const languages = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "fr", name: "Francais", dir: "ltr" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value })}
        className="appearance-none rounded-md border border-border bg-surface px-3 py-1.5 pe-8 text-sm text-text focus-visible:outline-2 focus-visible:outline-primary"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <GlobeIcon
        className="pointer-events-none absolute end-2 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>
  );
}
```

#### Pattern: ICU Pluralization (Message Files)

```json
{
  "Cart": {
    "itemCount": "{count, plural, =0 {No items} one {# item} other {# items}}",
    "checkout": "Proceed to checkout"
  }
}
```

```json
{
  "Cart": {
    "itemCount": "{count, plural, =0 {لا عناصر} one {عنصر واحد} two {عنصران} few {# عناصر} many {# عنصرًا} other {# عنصر}}",
    "checkout": "المتابعة إلى الدفع"
  }
}
```

#### Pattern: Astro i18n Setup

```ts
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "ar", "fr"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

// src/i18n/utils.ts
import en from "./messages/en.json";
import de from "./messages/de.json";
import ar from "./messages/ar.json";

const messages: Record<string, typeof en> = { en, de, ar };

export function useTranslations(locale: string) {
  const msgs = messages[locale] ?? messages.en;
  return function t(key: string): string {
    return key.split(".").reduce((obj: Record<string, unknown>, k) => (obj?.[k] as Record<string, unknown>) ?? {}, msgs as Record<string, unknown>) as unknown as string ?? key;
  };
}

export function getDir(locale: string): "ltr" | "rtl" {
  return ["ar", "he", "fa", "ur"].includes(locale) ? "rtl" : "ltr";
}
```

### Reference Sites

- **GitHub** (github.com) -- Excellent RTL support: logical properties throughout, proper bidirectional text handling, locale-aware formatting
- **Airbnb** (airbnb.com) -- Award-caliber i18n: seamless language switching, proper RTL mirroring of layouts, locale-aware pricing and dates
- **MDN Web Docs** (developer.mozilla.org) -- Multi-language content with proper hreflang, clean locale routing, accessible language switcher

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in i18n/RTL |
|-----------|-------------------|
| `--spacing-*` | All spacing uses logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) |
| `--font-body` | Must support character sets for target locales (Arabic, CJK, Cyrillic) |
| `bg-surface` / `border-border` | Language switcher styling |
| `text-text` / `text-muted` | Content text and labels in all locales |

### Archetype Variants

Most archetypes work identically in RTL -- the design identity is preserved through logical properties. Exceptions:

| Archetype | RTL Adaptation |
|-----------|---------------|
| Editorial | Asymmetric layouts (pull quotes, offset images) must mirror their positions |
| Brutalist | Directional elements (diagonal lines, skewed layouts) need RTL mirroring |
| Kinetic | Scroll-triggered entrance directions (slide-from-left) must flip to slide-from-right |
| Japanese Minimal | Vertical text (`writing-mode: vertical-rl`) is already RTL-compatible |

### Related Skills

- `seo-meta` -- hreflang alternate links, locale-specific canonical URLs, og:locale
- `tailwind-system` -- Logical utility classes, `rtl:` variant configuration
- `accessibility` -- `lang` attribute on `<html>`, language-specific ARIA labels
- `responsive-design` -- Logical properties ensure responsive layouts work in RTL
- `form-builder` -- Input direction (`dir="auto"` for user-entered text in mixed content)

## Layer 4: Anti-Patterns

### Anti-Pattern: Physical Properties Instead of Logical

**What goes wrong:** Using `ml-4`, `pr-3`, `text-left`, `border-l`, `left-0` throughout the codebase. When RTL is added, every occurrence must be found and changed. Many are missed, producing broken layouts.
**Instead:** Always use logical properties from the start: `ms-4`, `pe-3`, `text-start`, `border-s`, `start-0`. These adapt automatically to text direction. Even if the project is LTR-only today, logical properties prevent future refactoring.

### Anti-Pattern: Ignoring Text Direction in Animations

**What goes wrong:** Slide-in animations hardcode `translateX(-100%)` for "enter from left" and `translateX(100%)` for "enter from right". In RTL, the directions are reversed, making animations feel wrong.
**Instead:** Use CSS logical properties for transforms where possible, or use the `rtl:` Tailwind variant: `motion-safe:translate-x-full rtl:motion-safe:-translate-x-full`. For GSAP/motion animations, read `document.dir` and flip the value programmatically.

### Anti-Pattern: Concatenating Translations

**What goes wrong:** Building translated strings by concatenation: `t('hello') + ' ' + name + '!'`. Word order differs across languages (English: "Hello John" vs Japanese: "ジョンさん、こんにちは"). Concatenation produces ungrammatical output.
**Instead:** Use ICU message format with interpolation: `t('greeting', { name })` where the message file defines: `"greeting": "Hello {name}!"` (English) or `"greeting": "{name}さん、こんにちは！"` (Japanese). The translation controls word order.

### Anti-Pattern: Manual Number and Date Formatting

**What goes wrong:** Using `toFixed(2)` for currency, `toLocaleDateString()` without locale parameter, or string templates for dates. Results are inconsistent across locales and miss locale-specific conventions (Arabic numerals, comma vs period decimal separator).
**Instead:** Always use `Intl.NumberFormat` with explicit locale and currency, `Intl.DateTimeFormat` with explicit locale and options. These handle all locale conventions automatically: digit systems, decimal separators, date component ordering, and calendar systems.
