---
name: csp-generator
description: Content Security Policy generator per tech stack. Script-src + style-src + img-src + frame-ancestors + report-uri. Nonce-based for Next.js. Subresource Integrity for CDN assets.
tier: domain
triggers: csp, content-security-policy, sri, subresource-integrity, nonce
version: 0.1.0
---

# CSP + SRI Generator

## Layer 1 — Per-framework strict CSP

### Next.js (middleware with nonce)

```ts
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(req) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' blob: data: https://*.vercel.app https://images.unsplash.com`,
    `font-src 'self' data: https://fonts.gstatic.com`,
    `connect-src 'self' https://*.vercel.app https://*.supabase.co`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ');

  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', cspHeader);
  res.headers.set('x-nonce', nonce);  // Read in app to apply to scripts
  return res;
}
```

Apply nonce to all `<script>` tags.

## Layer 2 — Report-only mode first

Roll out new CSP as report-only before enforcement:

```
Content-Security-Policy-Report-Only: <policy>; report-uri /api/csp-report
```

Collect violation reports for 2 weeks; fix genuine issues; then enforce.

## Layer 3 — SRI for CDN assets

```html
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous">
</script>
```

Generate hashes via:

```bash
curl -s https://cdn.example.com/library.js | openssl dgst -sha384 -binary | openssl base64 -A
```

Script generates + inserts SRI automatically during build.

## Layer 4 — Trusted Types

```ts
// enforce
Content-Security-Policy: require-trusted-types-for 'script';
```

Forces DOM sinks (innerHTML) through Trusted Types policy — XSS-resistant.

## Layer 5 — Per-integration allowlist

Stripe requires `js.stripe.com`. Analytics providers require their domains. Generator maintains:

```json
// .csp-allowlist.json
{
  "stripe": {
    "script-src": ["https://js.stripe.com"],
    "frame-src": ["https://js.stripe.com", "https://hooks.stripe.com"]
  },
  "posthog": {
    "script-src": ["https://app.posthog.com"],
    "connect-src": ["https://app.posthog.com"]
  }
}
```

`/gen:integrate <service>` adds relevant allowlist entries to CSP.

## Layer 6 — Integration

- `/gen:security csp init` scaffolds middleware + allowlist
- CSP violations reported to `/api/csp-report` endpoint
- Dashboard security tab shows violation trends
- Ship-check Tier 2 includes CSP validation (no 'unsafe-inline')

## Layer 7 — Anti-patterns

- ❌ `script-src 'unsafe-inline'` — defeats CSP; XSS-protection gone
- ❌ `*` wildcards for connect-src — leaks to arbitrary domains
- ❌ No report-only phase — break prod with first CSP change
- ❌ Missing SRI on CDN assets — supply chain attack surface
- ❌ Static SRI hash for auto-updating CDN — breaks after their update
