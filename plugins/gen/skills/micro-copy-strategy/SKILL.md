---
name: micro-copy-strategy
description: "The words that convert: CTA button copy psychology, error message templates that don't demoralize, form label strategy, empty state encouragement, 404 page personality, tooltip micro-copy, loading state messaging, notification copy, and per-archetype voice adaptation."
tier: core
triggers: "micro-copy, copy, button text, CTA text, error message, label, placeholder, empty state, 404 copy, tooltip text, loading text, notification copy, form copy, voice, tone"
version: "2.5.0"
---

## Layer 1: Decision Guidance

### When to Use

Every component has words. Every word is a design decision. Every design decision affects conversion, trust, and user satisfaction. This skill is not optional -- it is referenced by ALL builder agents for every text element in every section.

- **Any CTA button** -- Generic verbs like "Submit" or "Click Here" destroy conversion. This skill provides outcome-framed alternatives.
- **Any error state** -- Shaming error messages ("Invalid input") erode user trust. This skill provides redirect-first templates.
- **Any form** -- Label and placeholder strategy directly affects task completion rate (89% with labels above vs 76% with placeholder-only).
- **Any empty state** -- "No data" with no next step is a dead end. This skill provides encouragement patterns with action CTAs.
- **Any 404 or error page** -- These are brand moments, not failure states. This skill provides per-archetype personality.
- **Any loading state** -- Silence during waits breeds anxiety. This skill provides duration-aware messaging patterns.
- **Any tooltip or helper text** -- Bad tooltips ("Click to click") waste attention. This skill provides benefit-first copy rules.
- **Any notification** -- Vague alerts confuse users. This skill provides type-specific patterns with next steps.

### When NOT to Use

- **Long-form content** (blog posts, articles, case studies) -- Use `copy-intelligence` instead for brand voice and content bank.
- **SEO meta titles/descriptions** -- Use `seo-meta` for search-optimized metadata patterns.
- **Structured data and schema markup** -- Use `structured-data-v2` for JSON-LD.
- **Image alt text** -- Use `accessibility` for alt text decision tree and ARIA patterns.

### Decision Tree

- If writing a **CTA button**: go to Layer 2 > CTA Button Copy. Select the closest context row and adapt to the archetype voice in Layer 3.
- If writing an **error message**: go to Layer 2 > Error Messages. Follow the three-part formula. Check archetype tone in Layer 3.
- If writing **form labels**: go to Layer 2 > Form Labels & Placeholders. Apply the label-above rule unconditionally.
- If writing an **empty state**: go to Layer 2 > Empty States. Include illustration + acknowledgment + action.
- If writing a **404 page**: go to Layer 2 > 404 Page Copy. Match the archetype row exactly.
- If writing **loading text**: go to Layer 2 > Loading State Messages. Select pattern based on expected duration.
- If writing **tooltip copy**: go to Layer 2 > Tooltip & Helper Copy. Check if the tooltip is even needed first.
- If writing a **notification**: go to Layer 2 > Notification Copy. Match the notification type pattern.

### Pipeline Connection

- **Referenced by:** Builder agent during `/gen:build` for every text element in every section
- **Referenced by:** Reviewer agent during quality gate checks for copy quality
- **Referenced by:** Creative Director during `/gen:discuss` for voice and tone decisions
- **Referenced by:** Polisher agent during `/gen:iterate` for copy refinement passes
- **Consumed at:** `/gen:plan` workflow step 3 (section task generation -- copy direction per section)
- **Consumed at:** `/gen:build` workflow step 2 (implementation -- every text element)
- **Consumed at:** `/gen:audit` workflow step 4 (copy quality scoring)

---

## Layer 2: Copy Pattern Library

### CTA Button Copy (The Highest-Impact Words)

The CTA button is the most consequential text element on any page. A single word change can move conversion rates 20-40%. Every CTA in every Genorah project MUST use conversion-optimized copy.

**Formula:** `[Action Verb]` + `[Benefit/Object]` + `[Qualifier]`

| Context | Generic (NEVER use) | Conversion-Optimized | Why It Works |
|---------|---------------------|---------------------|--------------|
| Signup | "Submit" | "Start my free trial" | First-person ownership (endowment effect) |
| Purchase | "Buy Now" | "Get instant access" | Outcome framing over transaction framing |
| Newsletter | "Subscribe" | "Send me weekly tips" | Specificity + first-person voice |
| Demo | "Request Demo" | "See it in action" | Visual promise, lower perceived commitment |
| Download | "Download" | "Get the free guide" | Value framing emphasizes what they receive |
| Contact | "Submit" | "Send my message" | First-person + confirmation of completed action |
| Pricing | "See Pricing" | "Find my plan" | Personal relevance, implies a match exists |
| Free trial | "Sign Up" | "Try free for 14 days" | Specificity + risk reversal in one phrase |
| Waitlist | "Join Waitlist" | "Save my spot" | Scarcity + ownership language |
| Upgrade | "Upgrade" | "Unlock all features" | Benefit framing over action framing |

**First-person vs second-person rule:** First-person ("Start my trial") outperforms second-person ("Start your trial") by 25% in A/B tests. Use first-person for primary CTAs. Second-person is acceptable for secondary actions and navigation.

**Risk-reversal micro-copy (below CTA):**

Place one of these directly below the primary CTA button in `text-sm text-muted` styling:

- "No credit card required" -- removes financial risk
- "Cancel anytime" -- removes lock-in fear
- "Free forever for up to 3 users" -- specificity builds trust
- "Setup takes 2 minutes" -- time commitment clarity
- "Join 10,000+ teams" -- social proof at decision point
- "30-day money-back guarantee" -- reverses purchase risk
- "Works with your existing tools" -- removes integration anxiety

```tsx
// CTA with risk-reversal micro-copy
<div className="flex flex-col items-center gap-3">
  <Button size="lg" className="font-display text-lg px-8 py-4">
    Start my free trial
  </Button>
  <p className="text-sm text-muted">
    No credit card required. Cancel anytime.
  </p>
</div>
```

**Secondary CTA pairing rule:** Every primary CTA should have a lower-commitment secondary option:

| Primary CTA | Secondary CTA |
|------------|---------------|
| "Start my free trial" | "See how it works" |
| "Get instant access" | "Compare plans" |
| "Send my message" | "View FAQ" |
| "Book a demo" | "Watch a 2-min overview" |

---

### Error Messages (Don't Demoralize, Redirect)

Error messages are trust moments. A bad error message makes the user feel stupid. A good one makes the product feel helpful.

**Formula:** `[What happened]` + `[Why it matters]` + `[What to do next]`

| Error Type | Bad (shaming) | Good (helpful) |
|-----------|---------------|----------------|
| Wrong password | "Invalid credentials" | "That password doesn't match. Try again or reset it." |
| Required field | "This field is required" | "We need your email to create your account" |
| Invalid email | "Invalid email format" | "That doesn't look like an email -- check for typos?" |
| Server error | "Error 500" | "Something went wrong on our end. Try again in a moment." |
| Rate limit | "Too many requests" | "You're moving fast! Wait a moment and try again." |
| Payment failed | "Transaction failed" | "Your payment didn't go through. Check your card details or try another." |
| File too large | "File exceeds maximum size" | "That file is too large (max 10MB). Try compressing it first." |
| Network error | "Network error" | "Looks like you're offline. We'll retry when you're back." |
| Expired session | "Session expired" | "Your session timed out for security. Sign in again to continue." |
| Permission denied | "403 Forbidden" | "You don't have access to this page. Request access or contact your admin." |

**Tone rules for errors:**
1. Errors should sound like a helpful friend, not a system log
2. Never blame the user -- blame the situation
3. Always include a concrete next step (link, button, or instruction)
4. Use contractions ("doesn't" not "does not") for warmth
5. Include specifics when possible ("max 10MB" not "too large")

```tsx
// Error message component pattern
<div role="alert" className="flex items-start gap-3 rounded-lg border border-tension/20 bg-tension/5 p-4">
  <AlertCircle className="h-5 w-5 text-tension shrink-0 mt-0.5" />
  <div>
    <p className="font-medium text-text">Your payment didn't go through</p>
    <p className="text-sm text-muted mt-1">
      Check your card details or <button className="underline text-primary">try another payment method</button>.
    </p>
  </div>
</div>
```

---

### Form Labels & Placeholders

Form copy has measurable impact on task completion. Poor labels cause errors. Missing labels fail accessibility.

| Element | Generic | Optimized | Rule |
|---------|---------|-----------|------|
| Name field label | "Name" | "Full name" | Specific = fewer errors |
| Email placeholder | "Enter your email" | "you@company.com" | Format example > instruction |
| Password placeholder | "Enter password" | "8+ characters" | Requirement > instruction |
| Textarea placeholder | "Enter message" | "Tell us about your project..." | Conversational, open-ended |
| Search | "Search" | "Search docs, features, or FAQs..." | Show scope of search |
| Phone | "Phone" | "Phone number (optional)" | Indicate optionality explicitly |
| Optional fields | (no indication) | "Optional" label in muted text | Reduce form anxiety |
| Date of birth | "DOB" | "Date of birth" | No abbreviations in labels |

**Label position rule:** Labels ABOVE inputs (not inside as placeholders that disappear). Research shows 89% task completion with persistent labels vs 76% with placeholder-only labels. This is non-negotiable for accessibility compliance.

**Validation timing:** Validate on blur (when user leaves field), not on every keystroke. Show success checkmarks for correctly completed fields to build momentum.

```tsx
// Accessible form field with persistent label
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium text-text">
    Email address
  </label>
  <input
    id="email"
    type="email"
    placeholder="you@company.com"
    className="w-full rounded-md border border-border bg-surface px-3 py-2
               text-text placeholder:text-muted/60
               focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
  />
  <p className="text-xs text-muted">We'll send your confirmation here</p>
</div>
```

---

### Empty States (Encourage, Don't Depress)

An empty state is either a dead end or an invitation. Every empty state must include three elements: friendly acknowledgment, clear next action, and a visual element.

**Formula:** `[Friendly acknowledgment]` + `[What to do]` + `[Visual element]`

| Context | Sad empty state | Encouraging empty state |
|---------|----------------|----------------------|
| No search results | "No results found" | "No matches for '[query]'. Try a broader search or browse categories." |
| Empty inbox | "You have no messages" | "All clear! New messages will appear here." |
| No notifications | "No notifications" | "You're all caught up. Nice work." |
| Empty dashboard | "No data yet" | "Your dashboard will come alive once you connect a data source." |
| Empty cart | "Your cart is empty" | "Nothing here yet. Ready to browse?" |
| No projects | "No projects" | "Start your first project and it will appear here." |
| No team members | "No members" | "Invite your team to start collaborating." |
| No saved items | "No saved items" | "Bookmark items you like and find them here later." |

```tsx
// Conversion-optimized empty state
<div className="flex flex-col items-center justify-center text-center py-16 px-4">
  <div className="w-48 h-48 mb-6 opacity-60">
    <IllustrationEmpty className="w-full h-full text-muted" />
  </div>
  <h3 className="font-display text-h3 text-text">No projects yet</h3>
  <p className="text-muted mt-2 max-w-[40ch] mx-auto leading-relaxed">
    Start your first project and it will appear here.
  </p>
  <Button className="mt-6" size="lg">
    Create your first project
  </Button>
</div>
```

**Empty state CTA rule:** The CTA text must name the exact action ("Create your first project"), not a generic verb ("Get started"). The word "first" is powerful -- it acknowledges the user is beginning something new.

---

### 404 Page Copy (Per Archetype)

A 404 page is a brand personality moment. The headline, subhead, and CTA must match the archetype voice exactly.

| Archetype | Headline | Subhead | CTA |
|-----------|----------|---------|-----|
| Brutalist | "404." | "This page doesn't exist." | "Go back" |
| Ethereal | "Lost in the mist" | "This page has drifted away. Let us guide you home." | "Return home" |
| Kinetic | "Whoa, wrong turn!" | "This page bounced somewhere else." | "Back to speed" |
| Editorial | "Page not found" | "The story you're looking for isn't here. Try the homepage." | "Read on" |
| Neo-Corporate | "Page not found" | "The page you requested could not be located." | "Return to homepage" |
| Organic | "This path leads nowhere" | "But there are plenty of others to explore." | "Find your way" |
| Playful/Startup | "Oops! Page not found" | "We looked everywhere but this page is playing hide and seek." | "Go home" |
| Japanese Minimal | "404" | "Nothing here." | "Home" |
| Luxury/Fashion | "We can't find that page" | "Perhaps you'd like to explore our latest collection instead." | "Explore collection" |
| Neon Noir | "ERROR::404" | "Signal lost. This node doesn't exist in the network." | "Return to grid" |
| Retro-Future | "TRANSMISSION LOST" | "This frequency is no longer active. Retuning..." | "Return to broadcast" |
| Dark Academia | "This chapter is missing" | "The page you seek has been lost to time. Return to the library." | "Explore the archive" |
| Warm Artisan | "Hmm, nothing here" | "This page seems to have wandered off. Let's get you back." | "Back to the workshop" |
| AI-Native | "404 // Not Found" | "This endpoint returned null. Rerouting to index." | "Go to index" |
| Swiss/International | "Page not found" | "The requested page does not exist." | "Homepage" |
| Glassmorphism | "Lost in the blur" | "This page couldn't be found. Let's get you somewhere real." | "Return home" |
| Neubrutalism | "NOPE." | "This page? Doesn't exist." | "Go back" |
| Data-Dense | "404 - Not Found" | "Resource unavailable. Check the URL or return to the main view." | "Main dashboard" |
| Vaporwave | "~ page not found ~" | "This aesthetic no longer exists in this dimension." | "Return to paradise" |

---

### Loading State Messages

Silence during waits breeds anxiety. Duration determines the copy strategy:

| Duration | Pattern | Example |
|----------|---------|---------|
| < 1 second | No text, skeleton only | -- |
| 1-3 seconds | Simple indicator | "Loading..." |
| 3-10 seconds | Progress + context | "Setting up your workspace..." |
| 10-30 seconds | Multi-step progress | "Analyzing data... Generating report... Almost there..." |
| 30+ seconds | Time estimate | "This usually takes about 30 seconds" |
| 60+ seconds | Time estimate + engagement | "Processing your data (about 1 min). You can close this and we'll notify you." |

**Multi-step loading messages** should feel like genuine progress, not faked. Each step should name a real operation:

```tsx
// Multi-step loading with real progress
const steps = [
  "Connecting to your account...",
  "Syncing your data...",
  "Building your dashboard...",
  "Almost ready...",
];
```

**Loading state anti-patterns:**
- Never show a blank screen -- always show skeleton or spinner
- Never show "Loading..." for more than 3 seconds without additional context
- Never fake progress (showing 90% when it could be 20%)
- Never show technical jargon ("Resolving DNS..." / "Hydrating components...")

---

### Tooltip & Helper Copy

Tooltips clarify -- they don't decorate. Most elements don't need tooltips. Only add one when the element's purpose isn't obvious from its label and context.

**Rules:**
- Max 120 characters per tooltip
- Answer ONE question per tooltip
- Lead with the benefit, not the mechanism
- Don't tooltip obvious things

| Element | Bad tooltip | Good tooltip |
|---------|------------|--------------|
| Save button | "Click to save" | -- (obvious, no tooltip needed) |
| Export button | "Export data" | "Download as CSV or PDF" |
| Toggle | "Enable/disable" | "Sync changes in real-time across all devices" |
| Info icon | "More information" | "We use this to personalize your experience" |
| Lock icon | "Locked" | "Upgrade to Pro to unlock this feature" |
| Star icon | "Star" | "Add to favorites for quick access" |
| Archive button | "Archive" | "Move to archive -- you can restore it anytime" |

**Helper text (below fields) rules:**
- Use for requirements the user needs BEFORE they type, not after they fail
- Keep to one line (under 60 characters ideal)
- Use muted text color (`text-muted`) and small size (`text-xs`)

---

### Notification Copy

Notifications must be scannable in under 2 seconds. Each type follows a distinct pattern:

| Type | Pattern | Example |
|------|---------|---------|
| Success | "[Action] complete" | "Project saved successfully" |
| Error | "[What happened]. [Next step]." | "Upload failed. Check file size and try again." |
| Info | "[What changed]" | "Your plan renews on April 15" |
| Warning | "[Risk]. [Prevention]." | "You have unsaved changes. Save before leaving." |
| Destructive | "[Consequence]. [Confirmation]." | "This will permanently delete 12 files. Are you sure?" |

**Notification duration rules:**
- Success: 3 seconds auto-dismiss
- Info: 5 seconds auto-dismiss
- Warning: persist until dismissed
- Error: persist until dismissed or resolved
- Destructive: require explicit confirmation, never auto-dismiss

```tsx
// Success notification
toast.success("Project saved successfully");

// Error notification with action
toast.error("Upload failed. Check file size and try again.", {
  action: {
    label: "Retry",
    onClick: () => retryUpload(),
  },
  duration: Infinity,
});
```

---

### Confirmation Dialog Copy

Destructive actions need clear, specific confirmation copy. Never use generic "Are you sure?"

| Action | Bad | Good |
|--------|-----|------|
| Delete account | "Are you sure?" | "Delete your account? This removes all data and can't be undone." |
| Remove member | "Confirm removal" | "Remove Alex from the team? They'll lose access immediately." |
| Cancel subscription | "Cancel?" | "Cancel your Pro plan? You'll keep access until April 30." |
| Discard draft | "Discard changes?" | "Discard this draft? Your unsaved changes will be lost." |

**Confirmation button labeling:** The confirm button must name the action, not just say "OK" or "Confirm":

| Action | Bad button | Good button |
|--------|-----------|------------|
| Delete | "OK" | "Delete permanently" |
| Remove | "Confirm" | "Remove from team" |
| Cancel | "Yes" | "Cancel my plan" |

---

## Layer 3: Integration Context

### Per-Archetype Voice Adaptation

Every text element in a Genorah project must match the archetype voice. This table is the canonical reference for tone calibration:

| Archetype | Tone | Formality | Humor | Example CTA | Error Voice |
|-----------|------|-----------|-------|-------------|-------------|
| Brutalist | Direct, blunt | Minimal | None | "Get started" | "Wrong password. Reset it." |
| Ethereal | Gentle, poetic | Low | None | "Begin your journey" | "That doesn't seem right. Try once more." |
| Kinetic | Energetic, urgent | Low | Light | "Let's go!" | "Whoops! Check that and try again." |
| Editorial | Precise, authoritative | High | Rare | "Read the full story" | "Incorrect password. Reset your password." |
| Neo-Corporate | Professional, clear | Medium-High | None | "Schedule a demo" | "The password entered is incorrect. Reset it here." |
| Organic | Warm, natural | Low-Medium | Gentle | "Grow with us" | "That didn't work. Give it another try." |
| Playful/Startup | Casual, friendly | Low | Frequent | "Jump in -- it's free!" | "Oops, wrong password! Reset it?" |
| Japanese Minimal | Restrained, quiet | Medium | None | "Start" | "Incorrect. Try again." |
| Luxury/Fashion | Refined, exclusive | High | Never | "Discover the collection" | "We couldn't verify your credentials. Please try again." |
| Data-Dense | Functional, specific | Medium | None | "View analytics" | "Authentication failed. Verify your password." |
| Dark Academia | Scholarly, warm | Medium-High | Subtle | "Explore the archive" | "That password isn't quite right. Try again or reset it." |
| Neon Noir | Terse, cyberpunk | Low | Dark irony | "Jack in" | "Access denied. Wrong credentials." |
| Retro-Future | Nostalgic, optimistic | Medium | Light | "Tune in" | "Signal mismatch. Re-enter your password." |
| Warm Artisan | Handcrafted, personal | Low | Gentle | "Start crafting" | "Hmm, that password didn't work. Try again?" |
| AI-Native | Precise, technical-casual | Medium | None | "Deploy now" | "Auth error: invalid password. Reset or retry." |
| Neubrutalism | Bold, confrontational | Minimal | Blunt | "DO IT" | "Wrong. Try again." |
| Swiss/International | Neutral, systematic | Medium-High | None | "Begin" | "Password incorrect. Reset password." |
| Glassmorphism | Smooth, modern | Medium | None | "Get started" | "That password didn't match. Try again." |
| Vaporwave | Dreamy, ironic | Low | Ironic | "Enter the void" | "~incorrect password~ try again, friend" |

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--color-text` | All body copy, labels, form text, error message body |
| `--color-muted` | Placeholder text, helper text, risk-reversal micro-copy, timestamps |
| `--color-primary` | CTA button text, inline action links in error messages |
| `--color-tension` | Error highlight color, destructive action buttons, warning accents |
| `--color-accent` | Success notification accents, positive confirmation states |
| `--color-surface` | Input field backgrounds, tooltip backgrounds, notification cards |
| `--color-border` | Input borders, notification card borders, tooltip borders |
| `--color-bg` | Page-level background behind empty states and 404 pages |
| `--font-display` | CTA button text, empty state headings, 404 headlines |
| `--font-body` | Error messages, form labels, tooltips, notification body |
| `--spacing-*` | Gap between CTA and risk-reversal text, form field spacing |

### Pipeline Stage

- **Input from:** Creative Director (archetype selection, voice direction), Researcher (competitor copy analysis), `/gen:plan` (per-section copy direction)
- **Output to:** Builder (exact copy for every text element), Reviewer (copy quality checklist), Polisher (copy refinement targets), Auditor (copy scoring criteria)

### Related Skills

- `copy-intelligence` -- Long-form content voice and brand tone. Micro-copy-strategy handles UI text; copy-intelligence handles content.
- `emotional-arc` -- Beat type affects copy intensity. Hook beats need high-energy CTAs. Breathe beats need gentle, low-pressure copy.
- `design-archetypes` -- Each archetype defines the voice parameters this skill adapts to.
- `form-builder` -- Form structure and validation UX. This skill provides the words; form-builder provides the layout and interaction patterns.
- `error-states-ui` -- Error page layouts and visual design. This skill provides the copy; error-states-ui provides the component structure.
- `accessibility` -- ARIA labels, screen reader text, and alt text. This skill provides visible copy; accessibility provides invisible copy.
- `landing-page` -- Hero and CTA section layouts. This skill provides the CTA text; landing-page provides the component structure.
- `ux-patterns` -- Navigation labels, breadcrumbs, and user flow copy. Overlaps with this skill at interaction text boundaries.

---

## Layer 4: Anti-Patterns

### Anti-Pattern: "Submit" as CTA Text

**What goes wrong:** "Submit" tells the user nothing about the outcome of their action. It is a system-oriented verb (the form submits), not a user-oriented verb (the user gets something). Conversion rates drop 15-30% compared to outcome-framed alternatives.
**Instead:** Use the CTA formula: `[Action Verb] + [Benefit/Object]`. "Send my message", "Create my account", "Get the free guide". The user should know exactly what happens when they click.

### Anti-Pattern: Blaming Error Messages

**What goes wrong:** Messages like "You entered an invalid email" or "Invalid credentials" make the user feel at fault. This creates negative emotional association with the product. Users abandon forms at 2x the rate when error messages use accusatory language.
**Instead:** Blame the situation, not the person. "That doesn't look like an email -- check for typos?" acknowledges the problem without assigning blame. Always include a resolution path.

### Anti-Pattern: Placeholder-Only Labels

**What goes wrong:** Using the placeholder attribute as the only label means the label disappears when the user starts typing. Users forget what field they're filling in, especially in longer forms. Fails WCAG 2.1 AA compliance. Task completion drops from 89% to 76%.
**Instead:** Always use a visible `<label>` element above the input. Placeholders are supplementary (showing format examples like "you@company.com"), never primary.

### Anti-Pattern: Empty States Without Action

**What goes wrong:** Showing "No data" or "No results" with no CTA creates a dead end. The user has nowhere to go and no guidance on what to do next. This is the #1 cause of new-user drop-off in dashboards and SaaS products.
**Instead:** Every empty state must include: (1) friendly acknowledgment, (2) a clear next action as a button or link, and (3) a visual element (illustration or icon). The CTA should name the specific action: "Create your first project", not "Get started".

### Anti-Pattern: Tooltips on Obvious Elements

**What goes wrong:** Tooltipping a "Save" button with "Click to save" wastes the user's time and trains them to ignore tooltips. When every element has a tooltip, none of them are useful. Tooltip fatigue makes users miss the tooltips that actually matter.
**Instead:** Only add tooltips when the element's purpose is genuinely unclear from its label and context. A tooltip should reveal something the user doesn't already know: "Download as CSV or PDF" on an Export button tells them about format options they couldn't infer.

### Anti-Pattern: Generic Confirmation Dialogs

**What goes wrong:** "Are you sure?" with "OK" and "Cancel" buttons gives the user no information about consequences. They can't make an informed decision. This leads to either accidental destructive actions or unnecessary hesitation on safe ones.
**Instead:** Name the consequence in the dialog body ("This removes all data and can't be undone") and name the action on the confirm button ("Delete permanently"). The user should understand exactly what will happen without reading the title.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| CTA button text length | 2 | 6 | words | SOFT -- warn if outside range |
| CTA first-person voice | -- | -- | boolean | SOFT -- prefer first-person for primary CTAs |
| Risk-reversal text below primary CTA | 1 | 2 | lines | SOFT -- warn if missing on conversion pages |
| Error message parts (what/why/next) | 2 | 3 | parts | HARD -- reject if missing next step |
| Form label position | -- | -- | above | HARD -- reject placeholder-only labels |
| Tooltip character length | 1 | 120 | chars | HARD -- reject if exceeds 120 characters |
| Empty state elements (visual/text/CTA) | 3 | 3 | elements | HARD -- reject if missing CTA or visual |
| Loading text threshold | 3 | -- | seconds | HARD -- require text after 3 seconds of loading |
| Notification auto-dismiss (success) | 2 | 5 | seconds | SOFT -- warn if outside range |
| Notification auto-dismiss (error) | -- | -- | persist | HARD -- errors must persist until dismissed |
| Confirmation button specificity | -- | -- | action-named | HARD -- reject "OK" or "Confirm" on destructive actions |
| 404 archetype match | -- | -- | exact | HARD -- 404 copy must match selected archetype row |
