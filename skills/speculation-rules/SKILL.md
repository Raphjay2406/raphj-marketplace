---
name: speculation-rules
tier: domain
description: "Speculation Rules API — progressive-enhancement prerender/prefetch for instant navigation. Chrome/Edge stable; Safari + Firefox not yet shipped (2026-04). Feature-detect via HTMLScriptElement.supports('speculationrules'). Moderate eagerness default, analytics-safe via document.prerendering gate."
triggers: ["speculation rules", "prerender", "prefetch", "instant navigation", "speculative loading", "eagerness"]
used_by: ["seo-technical", "performance-guardian", "nextjs-patterns"]
version: "3.2.0"
---

## Layer 1: Decision Guidance

### Why

Single largest perceived-perf win available in 2026: user clicks a link, page is already rendered in hidden browser context. Chrome-only but graceful — non-supporting browsers just do normal navigation. No polyfill, no runtime cost when unsupported.

### When to Use

- Multi-page sites where next-link is predictable (home → pricing, article → next article).
- Links that are NOT auth-gated, cart-mutating, OTP-expiring, or analytics-sensitive without proper gating.
- Production deployments (Chrome/Edge majority traffic).

### When NOT to Use

- Logout, add-to-cart, payment, OTP URLs (prerender mutates state).
- SPAs with full client-side routing (no benefit — React Router prefetches differently).
- Safari/Firefox-dominant audiences (not supported; no cost, no benefit).

### Decision Tree

```
Site is multi-page (MPA)? no → skip entirely
                         yes → has auth routes? → exclude those via where.not.href_matches
                              → analytics instrumented? → add document.prerendering gate
                              → inject rules, test, monitor cache-hit rate
```

## Layer 2: Technical Spec

### Basic inline rules (static prerender)

```html
<script type="speculationrules">
{
  "prerender": [
    {
      "where": {
        "and": [
          { "href_matches": "/*" },
          { "not": { "href_matches": "/logout" } },
          { "not": { "href_matches": "/cart/*" } },
          { "not": { "selector_matches": ".no-prerender" } }
        ]
      },
      "eagerness": "moderate"
    }
  ],
  "prefetch": [
    { "where": { "href_matches": "/*" }, "eagerness": "eager" }
  ]
}
</script>
```

Eagerness:
- `immediate` — prerender now (use sparingly, <5 URLs max)
- `eager` — on hover or pointer-down
- `moderate` — ~200ms hover (default recommended)
- `conservative` — pointer-down only (lowest cost)

### HTTP header alternative

For cross-document application of rules:

```
Speculation-Rules: "/speculation-rules.json"
```

Content-Type: `application/speculationrules+json`

### Analytics double-counting guard (REQUIRED)

```js
// In analytics init (gtag, Plausible, Umami, etc.):
if (document.prerendering) {
  document.addEventListener('prerenderingchange', () => initAnalytics(), { once: true });
} else {
  initAnalytics();
}
```

Without this, prerendered pages fire analytics before user actually navigates → inflates pageviews.

### CSP requirement

Inline rules require `script-src 'inline-speculation-rules'`. Genorah builders emit CSP accordingly; see `security-posture` skill (v3.2) for full CSP generation.

### Server-side `Sec-Purpose` header

Requests from speculation rules carry `Sec-Purpose: prefetch` or `Sec-Purpose: prefetch;prerender`. Server should:
- Log them separately (don't count toward rate limits)
- Skip personalized / session-dependent rendering
- Return same response structure (caching still works)

### Feature detection

```js
const supported = HTMLScriptElement.supports?.('speculationrules');
if (supported) {
  // Inject rules
}
```

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| immediate_rules | 0 | 5 | URLs | HARD (memory pressure) |
| moderate_eagerness_default | on | — | — | default |
| auth_route_exclusion | required | — | — | HARD — prerender mutates state |
| document_prerendering_gate | required | — | analytics | HARD — prevents inflated counts |
| safari_firefox_fallback | graceful-no-op | — | — | HARD — no JS errors when unsupported |

## Layer 3: Integration Context

- **seo-technical** — consumes this skill when generating per-page meta + speculation rule injection.
- **performance-guardian** — validates prerender cache-hit rate via Chrome DevTools MCP (v3.2) after deploy.
- **nextjs-patterns** — Next 15+ has `<Link prefetch>` handling; speculation rules complement (not replace) for MPA hard navigations.
- **security-posture** — CSP must allow `'inline-speculation-rules'`.
- **Analytics skills** (when they land) — must gate on `document.prerendering`.

## Layer 4: Anti-Patterns

- ❌ **Immediate eagerness on >5 URLs** — prerender reserves memory. Mobile breaks.
- ❌ **Not excluding auth routes** — prerendered logout/cart mutates server state before user clicks.
- ❌ **Forgetting document.prerendering gate** — analytics doubles. User metrics become meaningless.
- ❌ **CSP blocking inline rules** — must allow `'inline-speculation-rules'` in script-src.
- ❌ **Relying on prerender for critical path** — it's progressive enhancement. Site must work identically without it.
- ❌ **Polyfilling for Safari/Firefox** — no official polyfill exists (the API requires browser-level prerender support). Accept graceful degradation.
