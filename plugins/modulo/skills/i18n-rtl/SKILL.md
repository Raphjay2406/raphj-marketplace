---
name: i18n-rtl
description: "Internationalization and RTL patterns: next-intl, Astro i18n, RTL logical properties, language switcher, locale-aware formatting, pluralization, date/number formatting."
---

Use this skill when the user mentions internationalization, i18n, localization, l10n, RTL, right-to-left, Arabic, Hebrew, language switcher, translations, multi-language, or locale. Triggers on: i18n, internationalization, localization, RTL, right-to-left, language, locale, translation, multi-language, l10n.

You are an expert at building fully internationalized, RTL-ready applications.

## Next.js: next-intl Setup

```bash
npm install next-intl
```

### Middleware

```tsx
// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(de|en|ar|fr)/:path*']
}
```

### Routing Config

```tsx
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'de', 'ar', 'fr'],
  defaultLocale: 'en',
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
```

### Request Config

```tsx
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

### Layout with Direction

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'

const rtlLocales = ['ar', 'he', 'fa', 'ur']

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Translation Usage

```tsx
// Server Component
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('HomePage')
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}

// Client Component
'use client'
import { useTranslations } from 'next-intl'

export function Counter() {
  const t = useTranslations('Counter')
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{t('count', { count })}</p>
      <Button onClick={() => setCount(c => c + 1)}>{t('increment')}</Button>
    </div>
  )
}
```

### Message Files

```json
// messages/en.json
{
  "HomePage": {
    "title": "Welcome",
    "description": "Build amazing products"
  },
  "Counter": {
    "count": "{count, plural, =0 {No items} one {# item} other {# items}}",
    "increment": "Add one"
  },
  "Common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "loading": "Loading..."
  }
}
```

```json
// messages/ar.json
{
  "HomePage": {
    "title": "مرحباً",
    "description": "ابنِ منتجات مذهلة"
  },
  "Counter": {
    "count": "{count, plural, =0 {لا عناصر} one {عنصر واحد} two {عنصران} few {# عناصر} many {# عنصراً} other {# عنصر}}",
    "increment": "أضف واحداً"
  }
}
```

## Astro: i18n Setup

```ts
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'ar', 'fr'],
    routing: {
      prefixDefaultLocale: false, // /about → English, /de/about → German
    },
  },
})
```

### Astro Translation Helper

```ts
// src/i18n/utils.ts
import en from './messages/en.json'
import de from './messages/de.json'
import ar from './messages/ar.json'

const messages: Record<string, typeof en> = { en, de, ar }

export function useTranslations(locale: string) {
  const msgs = messages[locale] ?? messages.en
  return function t(key: string): string {
    return key.split('.').reduce((obj: any, k) => obj?.[k], msgs) ?? key
  }
}

export function getDir(locale: string): 'ltr' | 'rtl' {
  return ['ar', 'he', 'fa', 'ur'].includes(locale) ? 'rtl' : 'ltr'
}
```

### Astro Page

```astro
---
// src/pages/[locale]/index.astro
import { useTranslations, getDir } from '../../i18n/utils'

const locale = Astro.params.locale ?? 'en'
const t = useTranslations(locale)
const dir = getDir(locale)
---

<html lang={locale} dir={dir}>
  <body>
    <h1>{t('HomePage.title')}</h1>
    <p>{t('HomePage.description')}</p>
  </body>
</html>
```

## RTL-Safe CSS with Logical Properties

```tsx
// WRONG — physical properties break in RTL
<div className="ml-4 pl-3 text-left border-l-2 rounded-tl-lg" />

// CORRECT — logical properties adapt to text direction
<div className="ms-4 ps-3 text-start border-s-2 rounded-ss-lg" />
```

### Logical Property Reference

| Physical | Logical | Tailwind Physical | Tailwind Logical |
|----------|---------|-------------------|------------------|
| margin-left | margin-inline-start | `ml-4` | `ms-4` |
| margin-right | margin-inline-end | `mr-4` | `me-4` |
| padding-left | padding-inline-start | `pl-4` | `ps-4` |
| padding-right | padding-inline-end | `pr-4` | `pe-4` |
| left | inset-inline-start | `left-0` | `start-0` |
| right | inset-inline-end | `right-0` | `end-0` |
| text-align: left | text-align: start | `text-left` | `text-start` |
| text-align: right | text-align: end | `text-right` | `text-end` |
| border-left | border-inline-start | `border-l` | `border-s` |
| border-right | border-inline-end | `border-r` | `border-e` |
| rounded-tl | rounded-start-start | `rounded-tl` | `rounded-ss` |
| float: left | float: inline-start | `float-left` | `float-start` |

### RTL-Aware Icons

```tsx
// Flip directional icons in RTL
function DirectionalIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className="h-4 w-4 rtl:scale-x-[-1]" />
}

// Usage: arrows, chevrons, progress indicators
<DirectionalIcon icon={ChevronRight} /> // Flips to ChevronLeft in RTL
```

## Language Switcher

```tsx
'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Select value={locale} onValueChange={(v) => router.replace(pathname, { locale: v })}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map(lang => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Locale-Aware Formatting

```tsx
import { useFormatter } from 'next-intl'

function PriceDisplay({ amount, currency }: { amount: number; currency: string }) {
  const format = useFormatter()

  return (
    <div>
      <p>{format.number(amount, { style: 'currency', currency })}</p>
      <p>{format.dateTime(new Date(), { dateStyle: 'long' })}</p>
      <p>{format.relativeTime(new Date('2026-01-01'))}</p>
      <p>{format.list(['Alice', 'Bob', 'Charlie'], { type: 'conjunction' })}</p>
    </div>
  )
}

// Vanilla JS (works in Astro too)
function formatPrice(amount: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date)
}
```

## Best Practices

1. **Logical properties everywhere**: Never use `ml/mr/pl/pr/left/right` — use `ms/me/ps/pe/start/end`
2. **ICU message format**: Use `{count, plural, ...}` for pluralization — Arabic has 6 plural forms
3. **Never concatenate translations**: `t('greeting', { name })` not `t('hello') + name`
4. **Test RTL visually**: Switch to Arabic and verify every component mirrors correctly
5. **Flip directional icons**: Arrows, chevrons, progress bars should flip in RTL with `rtl:scale-x-[-1]`
6. **Locale in URL**: `/en/about`, `/ar/about` — shareable and SEO-friendly
7. **Separate content from layout**: Translations go in JSON files, not hardcoded strings
8. **Intl API for formatting**: Use `Intl.NumberFormat`, `Intl.DateTimeFormat` — never format manually
