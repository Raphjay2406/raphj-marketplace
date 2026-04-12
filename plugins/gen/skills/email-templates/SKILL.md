---
name: email-templates
description: Transactional email library via React Email. Cross-client HTML (Gmail/Outlook/Apple Mail/iOS Mail). 9 templates (welcome/password-reset/magic-link/order-confirmation/shipping-update/invoice/re-engagement/newsletter/event-invitation). DNA-theme applied safely within email-client constraints.
tier: domain
triggers: email-templates, react-email, transactional-email, gmail-outlook, mjml
version: 0.1.0
---

# Email Templates

React Email (`@react-email/components`) renders to inline-CSS HTML that works across Gmail, Outlook (incl. MSO), Apple Mail, iOS Mail.

## Layer 1 — When to use

Every project with user accounts / orders / newsletters gets templates. Extensions beyond the 9 default templates follow same pattern.

## Layer 2 — Templates

### welcome
Post-signup greeting + onboarding step CTA.

### password-reset
Secure link (single-use, 15-min expiry). Security-aware wording: "If you didn't request this..."

### magic-link
OTP-style sign-in. Link + 6-digit code fallback for copy-paste into app.

### order-confirmation
Line items, total, shipping ETA, tracking hint. Archetype-themed.

### shipping-update
Status transitions (shipped / out-for-delivery / delivered). Carrier tracking link.

### invoice-receipt
PDF attachment + HTML version. Legal address block for tax compliance.

### re-engagement
30/60/90 day drip for inactive accounts. Personalized based on past activity.

### newsletter-weekly
Digest of curated content. MJML-compatible layout. Segmentable.

### event-invitation
ICS calendar attachment + event summary + RSVP buttons.

## Layer 3 — React Email pattern

```tsx
// emails/welcome.tsx
import { Html, Head, Preview, Body, Container, Section, Heading, Text, Button, Hr, Img } from '@react-email/components';

export function WelcomeEmail({ userName, ctaUrl, brand }: {
  userName: string;
  ctaUrl: string;
  brand: { name: string; primary: string; logoUrl: string };
}) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {brand.name}, {userName}</Preview>
      <Body style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', backgroundColor: '#fafafa', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: 32, backgroundColor: '#ffffff' }}>
          <Img src={brand.logoUrl} alt={brand.name} width={40} height={40} />
          <Heading style={{ fontSize: 24, fontWeight: 600, marginTop: 24 }}>
            Welcome, {userName}
          </Heading>
          <Text style={{ fontSize: 16, lineHeight: 1.6, color: '#374151' }}>
            Thanks for joining {brand.name}. Here's where to start.
          </Text>
          <Section style={{ marginTop: 24 }}>
            <Button href={ctaUrl} style={{
              backgroundColor: brand.primary,
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Open your dashboard
            </Button>
          </Section>
          <Hr style={{ margin: '32px 0', borderColor: '#e5e7eb' }} />
          <Text style={{ fontSize: 12, color: '#9ca3af' }}>
            If you didn't sign up, ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

## Layer 4 — DNA application (email-safe subset)

Full DNA palette NOT usable in email (client fallback CSS differs). Email-safe DNA subset:

- Colors: primary + neutral grays only; avoid accent unless high-contrast
- Fonts: system stack fallback ALWAYS; custom font via Google import (may fail silently in Outlook)
- No: backdrop-blur, CSS grid, custom fonts without fallback, CSS variables, @supports

## Layer 5 — Testing

**Render test**: Every template rendered via `@react-email/render` → HTML file at `emails/output/<template>.html` for preview.

**Client test** (recommended): Litmus / Email on Acid subscription renders across 40+ client combos. Or free:  Mailtrap + manual client check.

**Accessibility**: contrast WCAG AA, alt text, no all-images (text version fallback).

## Layer 6 — Sending

Provider-agnostic abstraction:

```ts
// lib/email.ts
import { render } from '@react-email/render';
import { WelcomeEmail } from '../emails/welcome';

export async function sendEmail(to: string, template: React.ReactElement) {
  const html = await render(template);
  const text = await render(template, { plainText: true });

  // Resend (default)
  await resend.emails.send({ from, to, subject, html, text });
  // Or SES, Postmark, SendGrid — same shape
}
```

## Layer 7 — Integration

- `/gen:email scaffold <template>` generates file
- `/gen:email preview <template>` opens local preview server (react-email dev)
- `/gen:email send-test <template> --to <addr>` smoke-test via provider
- Ledger: `email-sent` per send (aggregated metrics, no PII)

## Layer 8 — Anti-patterns

- ❌ Background images — fail in Outlook; use bg color
- ❌ Custom fonts without system fallback — Outlook renders Times New Roman
- ❌ CSS grid layout — fails widely; use tables still
- ❌ No plain-text version — spam filter penalty
- ❌ Unsubscribe link missing in marketing emails — CAN-SPAM violation
- ❌ Unsafe HTML (SVG, iframes, script) — strip during render
