---
name: analytics-tracking
description: "Analytics and tracking patterns: GA4 setup, PostHog/Plausible integration, event tracking, A/B testing, consent banners (GDPR), cookie management, conversion tracking. Works with Next.js and Astro."
---

Use this skill when the user mentions analytics, tracking, GA4, Google Analytics, PostHog, Plausible, A/B testing, consent banner, GDPR, cookies, or conversion tracking. Triggers on: analytics, tracking, GA4, Google Analytics, PostHog, Plausible, A/B test, consent, GDPR, cookie.

You are an expert at implementing analytics and consent management.

## Google Analytics 4 (Next.js)

```tsx
// components/analytics.tsx
'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID!

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      window.gtag?.('config', GA_ID, { page_path: pathname + (searchParams?.toString() ? `?${searchParams}` : '') })
    }
  }, [pathname, searchParams])

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false})`}
      </Script>
    </>
  )
}

// Event tracking helper
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  window.gtag?.('event', action, { event_category: category, event_label: label, value })
}
```

## PostHog Integration

```tsx
// app/providers.tsx
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}

// Feature flags / A/B testing
import { useFeatureFlagEnabled } from 'posthog-js/react'

function PricingPage() {
  const showNewPricing = useFeatureFlagEnabled('new-pricing-page')

  return showNewPricing ? <NewPricingPage /> : <OldPricingPage />
}
```

## GDPR Consent Banner

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type ConsentState = { analytics: boolean; marketing: boolean; necessary: boolean }

export function CookieConsent() {
  const [show, setShow] = useState(false)
  const [consent, setConsent] = useState<ConsentState>({ analytics: false, marketing: false, necessary: true })

  useEffect(() => {
    const saved = localStorage.getItem('cookie-consent')
    if (!saved) setShow(true)
    else setConsent(JSON.parse(saved))
  }, [])

  const save = (state: ConsentState) => {
    localStorage.setItem('cookie-consent', JSON.stringify(state))
    setConsent(state)
    setShow(false)
    // Update consent for analytics providers
    if (state.analytics) {
      window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
    }
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-semibold mb-2">Cookie Preferences</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We use cookies to improve your experience. You can customize your preferences below.
          </p>
          <div className="space-y-3 mb-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Necessary</p>
                <p className="text-xs text-muted-foreground">Required for the site to function</p>
              </div>
              <Switch checked disabled />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Analytics</p>
                <p className="text-xs text-muted-foreground">Help us understand how you use the site</p>
              </div>
              <Switch checked={consent.analytics} onCheckedChange={v => setConsent(c => ({ ...c, analytics: v }))} />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Marketing</p>
                <p className="text-xs text-muted-foreground">Personalized ads and content</p>
              </div>
              <Switch checked={consent.marketing} onCheckedChange={v => setConsent(c => ({ ...c, marketing: v }))} />
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => save({ necessary: true, analytics: false, marketing: false })}>
              Reject All
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => save(consent)}>
              Save Preferences
            </Button>
            <Button className="flex-1" onClick={() => save({ necessary: true, analytics: true, marketing: true })}>
              Accept All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Plausible Analytics (Privacy-first)

```tsx
// Next.js — add to layout
import Script from 'next/script'

<Script
  defer
  data-domain="example.com"
  src="https://plausible.io/js/script.js"
  strategy="afterInteractive"
/>

// Custom events
function trackPlausible(event: string, props?: Record<string, string>) {
  ;(window as any).plausible?.(event, { props })
}

// Usage
<Button onClick={() => { trackPlausible('Signup', { plan: 'pro' }); handleSignup() }}>
  Sign Up
</Button>
```

```astro
---
// Astro — Plausible in BaseLayout
---
<script defer data-domain="example.com" src="https://plausible.io/js/script.js"></script>
```

## Conversion Tracking

```tsx
// Track key conversion events
function useConversionTracking() {
  const trackSignup = (method: string) => {
    trackEvent('sign_up', 'engagement', method)
    posthog.capture('user_signed_up', { method })
  }

  const trackPurchase = (value: number, currency: string) => {
    window.gtag?.('event', 'purchase', { value, currency, transaction_id: crypto.randomUUID() })
    posthog.capture('purchase_completed', { value, currency })
  }

  const trackFeatureUsed = (feature: string) => {
    posthog.capture('feature_used', { feature })
  }

  return { trackSignup, trackPurchase, trackFeatureUsed }
}
```

## Best Practices

1. GA4: load with `afterInteractive`, track page views on route changes
2. PostHog: self-hostable, built-in feature flags, session replay
3. Plausible: privacy-first, no cookies needed, GDPR-compliant by default
4. Consent banner: show on first visit, persist in localStorage, 3 tiers (necessary/analytics/marketing)
5. Default GA4 consent to `denied`, update to `granted` after user accepts
6. Track meaningful events only: sign_up, purchase, feature_used — not every click
7. A/B testing: use PostHog feature flags or Vercel Edge Config
8. For Astro: add analytics scripts in layout `<head>`, custom events via global function
9. Never load marketing/analytics scripts before consent (GDPR requirement)
10. Use `data-domain` attribute for Plausible multi-site tracking
