---
name: cookie-compliance
description: GDPR / CCPA / LGPD cookie banner patterns. Consent-mode v2 (Google) + TCF v2.2 integration. Cookieless-default posture with banner only when analytics/ads require.
tier: domain
triggers: cookies, gdpr, ccpa, lgpd, consent-banner, tcf
version: 0.1.0
---

# Cookie Compliance

## Layer 1 — Regional matrix

| Region | Framework | Pre-consent allowed |
|---|---|---|
| EU | GDPR + ePrivacy | Essential only; no analytics cookies |
| UK | PECR | Same as EU |
| California | CCPA/CPRA | Opt-out model (banner still required for "Do Not Sell") |
| Brazil | LGPD | Similar to GDPR |
| Other | Self-regulate | Vary |

## Layer 2 — Default posture (Genorah)

**Cookieless first.** Before adding a banner, consider:
- Vercel Analytics (cookieless)
- Plausible/Fathom (cookieless)
- Vercel Speed Insights (cookieless)

If you can avoid cookies, you avoid banner. Most sites don't need more analytics than Vercel provides.

## Layer 3 — If cookies required

Pattern: 2-tier banner

```tsx
function CookieBanner() {
  const [state, setState] = useState<'closed'|'detail'>('closed');
  if (accepted()) return null;

  return (
    <aside role="dialog" aria-label="Cookie consent" className="fixed bottom-0 inset-x-0 bg-surface p-4 border-t">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
        <p className="flex-1">We use cookies to enhance your experience. <a href="/privacy" className="underline">Learn more</a></p>
        <button onClick={() => setState('detail')}>Customize</button>
        <button onClick={rejectAll} className="text-sm">Reject all</button>
        <button onClick={acceptAll} className="bg-primary text-white px-4 py-2 rounded">Accept all</button>
      </div>
      {state === 'detail' && <ConsentCustomize onSave={save} onClose={() => setState('closed')} />}
    </aside>
  );
}
```

Customize panel categorizes:
- Essential (always on)
- Analytics (opt-in)
- Marketing (opt-in)
- Preferences (opt-in)

## Layer 4 — Google Consent Mode v2

```ts
// BEFORE gtag.js loads
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
});

// After user consent
gtag('consent', 'update', {
  analytics_storage: user.analyticsOK ? 'granted' : 'denied',
  ad_storage: user.adOK ? 'granted' : 'denied',
  // ...
});
```

## Layer 5 — Dark pattern avoidance

- "Accept all" button size === "Reject all" button size
- "Reject all" visible in primary view (not hidden behind "Customize")
- No pre-checked consent boxes (GDPR violation)
- "Save preferences" clear affordance

EU regulators fine ~€100K+ for dark patterns.

## Layer 6 — Integration

- `/gen:integrate cookie-banner --region eu`
- Chains with privacy-policy-generator
- Conversion-gate CV6 attribution check works with consent state (respect when denied)

## Layer 7 — Anti-patterns

- ❌ Cookie banner without reject-all — CNIL fine (France)
- ❌ Tracking before consent — GDPR violation
- ❌ Infinite banner (can't dismiss) — UX hostile
- ❌ No consent-mode wrapper around GA — EU analytics blocked
