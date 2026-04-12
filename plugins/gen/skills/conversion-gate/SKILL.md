---
name: conversion-gate
description: Machine checks for primary CTA above-fold at both desktop and mobile, trust signal proximity to CTA, friction audit, CTA copy specificity, social proof attribution, and pricing transparency. Scores 20 points in quality-gate-v3 Axis 2.
tier: core
triggers: conversion-gate, cta, trust-signals, friction, social-proof, pricing-transparency, quality-gate-v3
version: 0.1.0-provisional
---

# Conversion Integrity Gate

20 points. Measures whether the section actually *converts*, not whether it looks good. Runs per section; page-level aggregation in /gen:ux-audit.

## Layer 1 — When to use

Axis 2 of quality-gate-v3. Most aggressive on HOOK, PEAK, CLOSE beats. On BREATHE/TEASE/PROOF, some checks relax (documented per-check).

## Layer 2 — Checks

### CV1. Primary CTA above fold — desktop (3pt)

- **PASS**: Section's primary CTA visible at 1280×720 without scroll.
- **CHECK**: See interaction-fidelity-gate I7. Reuses the measurement.

### CV2. Primary CTA above fold — mobile (3pt)

- **PASS**: Same at 375×812.
- **CHECK**: See interaction-fidelity-gate I8.

### CV3. Trust signal ≤ 2 scrolls from primary CTA (3pt)

- **PASS**: Within 2 viewport heights of the primary CTA, at least one trust signal exists: testimonial, customer logo, verified statistic, security badge, press mention.
- **CHECK**: grep for `<Testimonial>`, `<Logo>`, `<Badge>`, `data-trust-signal`, or known patterns (stars rating, "Trusted by", "As seen in").

### CV4. Friction audit (3pt)

- **PASS**: Primary-intent form requires no more fields than the intent warrants.

| Intent | Max required fields |
|---|---|
| Newsletter | 1 (email) |
| Demo request | 3 (name, email, company) |
| Free trial | 3 (email, password OR SSO) |
| Contact | 4 (name, email, message, topic) |
| Checkout | varies — but split into steps |

- **CHECK**: grep `<input required>` per `<form>`; classify form by submit handler/label; flag excess.

### CV5. CTA copy specific (not generic) (2pt)

- **PASS**: Primary CTA copy is not on the generic list: `Get Started`, `Learn More`, `Click Here`, `Submit`, `Sign Up`.
- **CHECK**: grep primary button text against blocklist; must contain verb + specific outcome (`Start 14-day trial`, `Book demo`, `Download report`).
- **NOTE**: Relaxed on BREATHE beats where no CTA is appropriate.

### CV6. Social proof with attribution (3pt)

- **PASS**: Every testimonial has a name; every logo row is labeled ("Trusted by" / "Used at"); every stat has a source or date.
- **CHECK**: grep testimonial components for adjacent name/role/company text; unlabeled logo rows fail.

### CV7. Pricing transparent OR reason stated (3pt)

- **PASS**: If pricing mentioned on page, either explicit numbers visible OR explicit reason for opacity ("Enterprise — custom pricing, book call").
- **CHECK**: grep for pricing patterns (`$`, `€`, `/mo`, `/month`, `/year`, `Free`); if present without numbers, require adjacent "custom" / "enterprise" / "contact sales" signal.
- **NOTE**: Skip entirely on sections where pricing is not the intent (e.g. product feature explainer).

## Layer 3 — Integration

- **Output**: `.planning/genorah/audit/conversion/<section-id>.json`
- **Ledger**: subgate-fired event.
- **Sub-gate cap**: ≥ 3 fails on HOOK/PEAK/CLOSE → conversion × 0.5.

## Layer 4 — Anti-patterns

- ❌ Vanity CTA copy ("Experience the magic") — fails CV5 regardless of aesthetic craft.
- ❌ Testimonial without name/role — fails CV6; users don't trust anonymous quotes.
- ❌ "Starting at $99" without feature comparison or details link — passes CV7 only if the rest of pricing is reachable in ≤ 1 click.
- ❌ Dark-pattern trust signals (fake reviews, purchased logos without permission) — not detected by the gate but flagged by `/gen:critic` adversarial pass.
