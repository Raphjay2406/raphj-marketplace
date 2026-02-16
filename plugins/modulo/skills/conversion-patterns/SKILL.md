---
name: conversion-patterns
description: "Conversion optimization patterns: social proof placement, CTA hierarchy, friction reduction, and cognitive load management for maximum conversion without sacrificing design quality."
---

Use this skill when optimizing for conversions, placing CTAs, adding social proof, reducing friction, or managing information density. Triggers on: conversion, CTA, social proof, trust, testimonial, pricing, signup, friction, cognitive load, conversion rate, call to action.

You are a conversion designer who maximizes action-taking without resorting to dark patterns. Beautiful design AND high conversion are not mutually exclusive — they reinforce each other when done right.

## Social Proof Placement Rules

### The "Within 2 Scrolls" Rule
Social proof (logo bar, metrics, or trust badges) must appear within 2 viewport scrolls of the hero. Users need validation before they invest attention.

### Placement Hierarchy

1. **Logo bar** — immediately after hero (TEASE beat). Grayscale logos, hover reveals color.
2. **Single compelling metric** — within the first 3 sections ("Trusted by 50,000+ teams").
3. **Testimonials** — near the product reveal or after features (PROOF beat). Place near CTAs.
4. **Case studies / detailed proof** — deeper on the page, for users who need more convincing.

### Logo Bar Pattern
```tsx
<section className="border-y border-[var(--color-border)] py-8">
  <div className="container mx-auto px-6">
    <p className="text-center text-xs text-[var(--color-text-tertiary)] tracking-widest uppercase mb-6">
      Trusted by teams at
    </p>
    <div className="flex items-center justify-center gap-12 flex-wrap">
      {logos.map(logo => (
        <img
          key={logo.name}
          src={logo.src}
          alt={logo.name}
          className="h-7 opacity-40 hover:opacity-80 grayscale hover:grayscale-0 transition-all duration-300"
        />
      ))}
    </div>
  </div>
</section>
```

### Testimonial Near CTA Pattern
```tsx
<section className="py-24">
  <div className="container mx-auto px-6 max-w-3xl text-center">
    {/* Testimonial */}
    <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-[var(--color-text-primary)] mb-8">
      "This tool cut our deployment time from hours to minutes. Our team ships 3x faster now."
    </blockquote>
    <div className="flex items-center justify-center gap-3 mb-12">
      <img src="/avatar.jpg" alt="Jane Doe" className="h-10 w-10 rounded-full" />
      <div className="text-left">
        <p className="text-sm font-medium">Jane Doe</p>
        <p className="text-xs text-[var(--color-text-tertiary)]">CTO at Acme Corp</p>
      </div>
    </div>

    {/* CTA immediately after proof */}
    <button className="rounded-xl bg-[var(--color-accent-1)] px-8 py-4 text-sm font-semibold text-white">
      Start Your Free Trial
    </button>
    <p className="mt-3 text-sm text-[var(--color-text-tertiary)]">
      No credit card required
    </p>
  </div>
</section>
```

## CTA Hierarchy

### The One-Primary Rule
**Maximum ONE primary CTA per viewport.** Multiple competing CTAs create decision paralysis.

### Three-Level CTA System

**Primary CTA:**
- Solid filled background (accent color)
- Largest button on screen
- Prominent shadow/glow
- ONE per viewport maximum
- Action: the main thing you want users to do

**Secondary CTA:**
- Ghost/outline style (border + transparent bg)
- Smaller than primary
- No glow/shadow
- Action: alternative for users not ready for primary

**Tertiary CTA:**
- Text link style (no background or border)
- Smallest, with arrow indicator
- Action: exploratory ("See pricing", "Read docs")

```tsx
<div className="flex flex-col sm:flex-row items-center gap-4">
  {/* Primary — ONE of these */}
  <button className="rounded-xl bg-[var(--color-accent-1)] px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_var(--color-glow)] hover:shadow-[0_0_50px_var(--color-glow)] transition-shadow">
    Start Free Trial
  </button>

  {/* Secondary */}
  <button className="rounded-xl border border-[var(--color-border)] bg-transparent px-6 py-4 text-sm font-medium text-[var(--color-text-primary)] hover:bg-white/5 transition-colors">
    Watch Demo
  </button>
</div>

{/* Tertiary — below or separate */}
<a href="/pricing" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mt-4 inline-flex items-center gap-1">
  View Pricing <ArrowRight className="h-3 w-3" />
</a>
```

### CTA Placement Rules
- **Above the fold:** Primary CTA must be visible without scrolling
- **After every PROOF section:** Place a CTA after testimonials/social proof
- **At page end (CLOSE beat):** Final, prominent CTA section
- **Sticky CTA:** For long pages, consider a sticky bottom bar with CTA on mobile

## Friction Reduction

### "No Credit Card Required" and Friends
Friction reducers are small text elements near CTAs that address objections BEFORE the user has them.

**Effective Friction Reducers:**
- "No credit card required" (removes payment fear)
- "Free for teams of 5" (clarifies free tier)
- "Setup in 2 minutes" (reduces time commitment)
- "Cancel anytime" (removes lock-in fear)
- "14-day free trial" (risk-free preview)
- "No installation needed" (reduces effort)

**Where to place:** Directly below the primary CTA button, in smaller text, using tertiary text color.

```tsx
<div className="text-center">
  <button className="primary-cta-large">Get Started Free</button>
  <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[var(--color-text-tertiary)]">
    <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Free forever for small teams</span>
    <span className="flex items-center gap-1"><Check className="h-3 w-3" /> No credit card</span>
    <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Setup in 2 min</span>
  </div>
</div>
```

### Preview Before Commitment
Let users SEE what they'll get before asking them to sign up:
- Live demo / interactive playground
- Screenshot/video of the dashboard
- Sample output or results
- Template gallery they can browse

## Cognitive Load Management

### Progressive Disclosure
Don't show everything at once. Reveal complexity as users need it.

```tsx
{/* Collapsed features — show 3, reveal all on click */}
<div className="space-y-4">
  {features.slice(0, 3).map(f => <FeatureCard key={f.id} {...f} />)}

  {!showAll && features.length > 3 && (
    <button
      onClick={() => setShowAll(true)}
      className="text-sm text-[var(--color-accent-1)] hover:underline"
    >
      Show all {features.length} features →
    </button>
  )}

  {showAll && features.slice(3).map(f => <FeatureCard key={f.id} {...f} />)}
</div>
```

### Chunking
Group related information into digestible chunks:
- **3-4 items per group** (magical number for short-term memory)
- **Clear group labels** (headings, dividers, spacing)
- **Visual grouping** (cards, backgrounds, borders)

### Visual Hierarchy Rules
1. **One focal point per viewport** — the user's eye should know where to go
2. **Size = importance** — most important element is largest
3. **Color = action** — accent color reserved for interactive/important elements
4. **Space = separation** — more space = more importance

### Pricing Table Best Practices
```tsx
{/* Highlight the recommended plan */}
<div className="grid md:grid-cols-3 gap-6">
  {plans.map(plan => (
    <div
      key={plan.name}
      className={`rounded-2xl p-8 ${
        plan.recommended
          ? 'border-2 border-[var(--color-accent-1)] bg-[var(--color-accent-1)]/5 relative'
          : 'border border-[var(--color-border)] bg-[var(--color-bg-secondary)]'
      }`}
    >
      {plan.recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent-1)] px-4 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}
      <h3 className="text-lg font-semibold">{plan.name}</h3>
      <p className="mt-2 text-3xl font-bold">
        ${plan.price}<span className="text-sm font-normal text-[var(--color-text-tertiary)]">/mo</span>
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[var(--color-accent-2)]" />
            {f}
          </li>
        ))}
      </ul>
      <button className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold ${
        plan.recommended
          ? 'bg-[var(--color-accent-1)] text-white'
          : 'border border-[var(--color-border)] hover:bg-white/5'
      }`}>
        {plan.cta}
      </button>
    </div>
  ))}
</div>
```

## Conversion Compliance Checklist

1. [ ] Social proof within 2 scrolls of hero
2. [ ] Maximum ONE primary CTA per viewport
3. [ ] CTA button text describes outcome (no "Submit"/"Learn More")
4. [ ] Friction reducer text below primary CTA
5. [ ] Testimonials placed near CTAs (not orphaned)
6. [ ] Pricing highlights recommended plan
7. [ ] Progressive disclosure for 4+ features/items
8. [ ] Visual hierarchy has ONE clear focal point per viewport
9. [ ] Above-the-fold primary CTA visible without scrolling
10. [ ] Final page section is CLOSE beat with prominent CTA
