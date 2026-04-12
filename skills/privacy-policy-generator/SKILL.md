---
name: privacy-policy-generator
description: Privacy policy + TOS + accessibility statement generator. Archetype-aligned tone. Jurisdiction-aware clauses (GDPR/CCPA/LGPD/UK PECR). Disclaimer: template, not legal advice.
tier: domain
triggers: privacy-policy, tos, terms-of-service, accessibility-statement, legal-template
version: 0.1.0
---

# Legal Template Generator

**DISCLAIMER:** Generated documents are templates. User must review with counsel before publishing. Especially for: CCPA (California), GDPR (EU), HIPAA (US healthcare), COPPA (children).

## Layer 1 — Inputs

```yaml
company:
  legal_name: Acme Inc.
  address: "123 Market St, San Francisco, CA 94103"
  contact_email: privacy@acme.com
  dpo_email: dpo@acme.com  # EU
jurisdictions: [us-california, eu, uk, brazil]
data_collected:
  - name
  - email
  - ip_address
  - cookies
  - analytics_events
third_parties:
  - name: Stripe
    purpose: payment processing
    country: US
  - name: Vercel
    purpose: hosting
    country: US
  - name: Resend
    purpose: transactional email
    country: US
user_rights:
  - access
  - deletion
  - correction
  - portability
  - opt_out_sale  # CCPA
```

## Layer 2 — Generated sections

### Privacy Policy (standard outline)

1. Who we are + contact
2. What data we collect
3. How we use it
4. Legal basis (GDPR: consent/contract/legitimate-interest)
5. Third-party processors
6. Cookies + tracking
7. Data retention
8. User rights (per jurisdiction)
9. International transfers (EU → US requires SCCs or DPF)
10. Children (COPPA if <13)
11. Changes to policy
12. Contact + complaints (including DPA)

### Terms of Service

1. Acceptance
2. Eligibility
3. Account obligations
4. Acceptable use
5. Payment (if applicable)
6. Intellectual property
7. User content
8. Termination
9. Disclaimers
10. Limitation of liability
11. Indemnification
12. Governing law + venue
13. Changes to terms
14. Contact

### Accessibility Statement

1. Commitment
2. Conformance (WCAG 2.2 AA target)
3. Known limitations
4. Feedback contact
5. Enforcement procedures (EU EN 301 549)

## Layer 3 — Tone per archetype

- Neo-Corporate: formal, standard legalese, scannable
- Playful: plain language, still legally sound, bullet-heavy
- Editorial: measured, sentence-by-sentence
- Luxury: restrained, minimal
- Dark Academia: no overly formal Latin — still readable

All archetypes must pass plain-language readability (Flesch grade ≤ 12).

## Layer 4 — Integration

- `/gen:legal privacy-policy` generates `/privacy` route
- `/gen:legal tos` generates `/terms`
- `/gen:legal accessibility` generates `/accessibility`
- Auto-linked from footer (nav-patterns skill)
- Review reminder: 6-month cadence

## Layer 5 — Anti-patterns

- ❌ Shipping without legal review — not-legal-advice disclaimer doesn't protect the business
- ❌ Copying from competitor — may include clauses irrelevant / missing ones critical
- ❌ No update log — users can't see what changed
- ❌ Listing third parties generically — need specific names + purposes per GDPR
