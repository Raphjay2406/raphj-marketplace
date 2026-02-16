---
name: micro-copy
description: "Micro-copy intelligence for headlines, buttons, empty states, and CTAs. Eliminates generic copy like 'Submit' and 'Learn More' with outcome-driven, personality-rich alternatives."
---

Use this skill when writing UI text, button labels, headlines, error messages, empty states, or CTA copy. Triggers on: copy, text, headline, button label, CTA, empty state, error message, micro-copy, copywriting, placeholder text.

You are a UX copywriter who treats every word as a design element. Generic copy is as bad as generic design. "Submit" is the "bg-blue-500" of copywriting — technically correct, spiritually empty.

## Headline Templates Per Beat Type

### HOOK Headlines
The first thing users read. Must create an immediate emotional reaction.

**Patterns:**
- **Bold claim:** "Ship 10x faster." / "Design without compromise."
- **Provocation:** "Your landing page is boring." / "Templates are dead."
- **Outcome vision:** "Build products people screenshot." / "Websites that win awards."
- **Contrast:** "Simple tools. Extraordinary results." / "Less process. More product."

**Rules:**
- Max 6-8 words for primary headline
- No jargon, no buzzwords ("leverage", "synergy", "cutting-edge")
- Must be understandable in 2 seconds
- Use sentence case, not Title Case (unless brand requires it)

### REVEAL Headlines
Showing the product or solution for the first time.

**Patterns:**
- **"Here's how":** "See it in action" / "This is what it looks like"
- **Confident:** "One platform. Everything you need." / "Your new workflow."
- **Demonstrative:** "From idea to production in minutes."

### PROOF Headlines
Establishing credibility and trust.

**Patterns:**
- **Social:** "Trusted by 10,000+ teams" / "Join the companies that ship faster"
- **Results:** "Teams using [product] see 40% faster delivery"
- **Endorsement:** "What our customers say" (only if testimonials are genuinely compelling)

### CLOSE Headlines
Final push. Clear, confident, action-oriented.

**Patterns:**
- **Invitation:** "Ready to start?" / "Join the movement"
- **Urgency:** "Start building today — free for teams of 5"
- **Vision:** "Your best work starts here"
- **Direct:** "Get started in 30 seconds"

---

## Button Copy Rules

### The Golden Rule
**Every button must describe the OUTCOME, not the action.**

| BAD (Action) | GOOD (Outcome) |
|--------------|-----------------|
| Submit | Create Account |
| Learn More | See How It Works |
| Click Here | Start Free Trial |
| Send | Send Message |
| Download | Get the Guide |
| Sign Up | Start Building |
| Buy Now | Add to Cart |
| Next | Continue to Payment |
| OK | Got It |
| Cancel | Discard Changes |

### Button Copy Hierarchy

**Primary CTA** (1 per viewport):
- Starts with a verb: "Start", "Get", "Create", "Build", "Launch"
- 2-4 words maximum
- Describes what the USER gets, not what the SYSTEM does
- Examples: "Start Free Trial", "Get Early Access", "Launch Your Site"

**Secondary CTA:**
- Softer tone: "See Demo", "View Pricing", "Read the Docs"
- Can be slightly longer (3-5 words)
- Should feel like a safe alternative, not a lesser choice

**Tertiary/Text Link:**
- Conversational: "Not ready? Explore features first →"
- Can be a full sentence
- Always includes a directional cue (→, ↗, or visual indicator)

### Banned Button Text
These words/phrases are **FORBIDDEN** in any button:

- ❌ "Submit" — always use the specific outcome
- ❌ "Learn More" — say what they'll learn: "See How It Works"
- ❌ "Click Here" — the entire internet has moved past this
- ❌ "Buy Now" — too aggressive for most contexts (use "Add to Cart" or "Get Started")
- ❌ "Enter" — vague, use "Open Dashboard" or "Go to App"

---

## Empty State Copy

Empty states are opportunities, not dead ends. Every empty state must have:
1. **Illustration or icon** (not just text)
2. **Explanation** (why it's empty)
3. **Action** (what to do about it)

### Patterns

**First-time empty state (onboarding):**
```tsx
<div className="text-center py-16 max-w-sm mx-auto">
  <div className="mb-6">{/* Illustration */}</div>
  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
  <p className="text-sm text-[var(--color-text-secondary)] mb-6">
    Create your first project to get started. It only takes a minute.
  </p>
  <button className="primary-cta">Create Your First Project</button>
</div>
```

**Search empty state:**
```tsx
<div className="text-center py-16 max-w-sm mx-auto">
  <SearchIcon className="h-12 w-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
  <h3 className="text-lg font-semibold mb-2">No results for "{query}"</h3>
  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
    Try a different search term or browse categories instead.
  </p>
  <button className="secondary-cta">Browse All Categories</button>
</div>
```

**Error empty state:**
```tsx
<div className="text-center py-16 max-w-sm mx-auto">
  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
  <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
  <p className="text-sm text-[var(--color-text-secondary)] mb-6">
    We couldn't load your data. This usually fixes itself — try refreshing.
  </p>
  <div className="flex items-center gap-3 justify-center">
    <button className="primary-cta">Refresh Page</button>
    <button className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
      Contact Support →
    </button>
  </div>
</div>
```

---

## Error Message Copy

### Rules
- **Never blame the user:** "Invalid email" → "Please enter a valid email address"
- **Be specific:** "Error occurred" → "We couldn't save your changes — please try again"
- **Suggest a fix:** Don't just state the problem, offer the solution
- **Stay calm:** No exclamation marks, no ALL CAPS, no alarm language

### Patterns

| Context | BAD | GOOD |
|---------|-----|------|
| Form validation | "Invalid email" | "This doesn't look like an email address" |
| Form validation | "Password too short" | "Password needs at least 8 characters" |
| Auth | "Wrong password" | "That password doesn't match — try again or reset it" |
| Network | "Error" | "Couldn't connect — check your internet and try again" |
| 404 | "Page not found" | "This page doesn't exist. Here are some helpful links:" |
| Permission | "Access denied" | "You don't have access to this. Ask your admin for permission." |

---

## CTA Copy with Social Proof Integration

### Patterns for High-Converting CTAs

**CTA + Metric:**
```tsx
<div className="text-center">
  <button className="primary-cta-large">Start Building for Free</button>
  <p className="mt-3 text-sm text-[var(--color-text-tertiary)]">
    Join 12,000+ developers already shipping faster
  </p>
</div>
```

**CTA + Friction Reducer:**
```tsx
<div className="text-center">
  <button className="primary-cta-large">Get Started</button>
  <p className="mt-3 text-sm text-[var(--color-text-tertiary)]">
    No credit card required · Free for small teams · Setup in 2 minutes
  </p>
</div>
```

**CTA + Avatars:**
```tsx
<div className="text-center">
  <button className="primary-cta-large">Join the Waitlist</button>
  <div className="mt-4 flex items-center justify-center gap-2">
    <div className="flex -space-x-2">
      {avatars.map((a, i) => (
        <img key={i} src={a} alt="" className="h-6 w-6 rounded-full border-2 border-[var(--color-bg-primary)]" />
      ))}
    </div>
    <span className="text-sm text-[var(--color-text-tertiary)]">
      2,847 people on the list
    </span>
  </div>
</div>
```

## Tone by Archetype

| Archetype | Copy Tone | Example CTA | Example Headline |
|-----------|-----------|-------------|-----------------|
| **Brutalist** | Direct, blunt, no-nonsense | "Use It" / "See Work" | "We make websites." |
| **Ethereal** | Gentle, inviting, warm | "Begin Your Journey" | "Find your calm." |
| **Kinetic** | Energetic, action-oriented | "Launch Now" | "Motion is everything." |
| **Editorial** | Intellectual, authoritative | "Read the Story" | "Words that matter." |
| **Neo-Corporate** | Precise, professional | "Start Building" | "Ship with confidence." |
| **Organic** | Warm, natural, grounded | "Join the Movement" | "Rooted in purpose." |
| **Retro-Future** | Techy, tongue-in-cheek | "Execute" / "Run" | "> init project" |
| **Luxury** | Minimal, exclusive | "Discover" / "Explore" | "Timeless." |
| **Playful** | Fun, casual, friendly | "Let's Go!" / "Try It Free" | "Building should be fun." |
| **Data-Dense** | Functional, metric-driven | "Start Monitoring" | "Real-time, always." |
| **Japanese Minimal** | Quiet, understated | "Enter" / "View" | "Less." |
| **Glassmorphism** | Modern, clean | "Get Started" | "Clarity in layers." |
| **Neon Noir** | Bold, electric | "Plug In" / "Connect" | "Welcome to the grid." |
| **Warm Artisan** | Friendly, story-driven | "Shop the Collection" | "Made with care." |
| **Swiss** | Rational, minimal | "Contact" / "View Work" | "Design is structure." |
| **Vaporwave** | Ironic, nostalgic | "Enter the Void" | "A E S T H E T I C" |
