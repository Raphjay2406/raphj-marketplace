---
name: user-style-adapter
tier: utility
description: "Detects user communication style (high-context vs low-context, terse vs verbose, technical vs business) from their /gen:discuss and /gen:feedback messages. Adapts discovery question depth, proposal verbosity, and tone. Distilled from bencium-marketplace/adaptive-communication (MIT)."
triggers: ["user style", "communication style", "adaptive communication", "discussion tone", "high-context", "low-context", "terse", "verbose"]
used_by: ["discuss", "feedback", "start-project", "iterate"]
version: "3.1.0"
---

## Layer 1: Decision Guidance

### Why Adapt

A senior designer sending "move the CTA right 40px and tighten leading" wants a 2-line confirmation, not a 3-paragraph discussion of creative intent. A non-designer founder sending "can we make it feel more premium?" wants a guided conversation, not "OK, moved".

Mismatched register — terse responses to verbose users, or verbose responses to terse users — creates friction that erodes trust faster than any single creative mistake.

**Source attribution:** Distilled from `bencium-marketplace/adaptive-communication` (MIT).

### When to Use

- `/gen:discuss` — calibrate per-phase deep-dive verbosity.
- `/gen:feedback` — match tone when interpreting feedback.
- `/gen:start-project` — calibrate discovery question batching.
- `/gen:iterate` — match response density.

### When NOT to Use

- Safety-critical acknowledgments — always verbose enough to confirm intent for destructive ops.
- First message from a user — not enough signal yet. Default to moderate register.

## Layer 2: Style Detection

### Axis 1: Context Density

**High-context signals:**
- Short messages (<15 words)
- Domain jargon used correctly ("em dash", "optical size", "scroll-linked animation", "grid tension")
- Implicit references ("the hero", "that part")
- Decisive language ("do X", "change Y")

**Low-context signals:**
- Longer messages (>40 words for a single ask)
- Descriptive language over technical
- Questions framing ("could we maybe...", "I wonder if...")
- Explicit naming of features / components

### Axis 2: Verbosity Preference

**Terse:**
- Replies in fragments ("yes", "move it", "better")
- No pleasantries or filler

**Verbose:**
- Full sentences, context setting
- Expresses reasoning alongside request

### Axis 3: Technical Register

**Technical:**
- Uses framework names, CSS property names, design-system terms
- References tools (Figma layers, git branches, specific components)

**Business:**
- Outcomes language ("feel premium", "convert better", "stand out")
- ROI / user / brand framing

### Axis 4: Emotional Register

**Direct:**
- "This is wrong." "Fix it." "Ship it."

**Collaborative:**
- "What do you think about..." "Would it work if..." "Let's try..."

### Axis 5: Decision Speed

**Fast:**
- Decisive on first proposal
- Rarely asks "what else?"

**Deliberate:**
- Wants to see 2-3 alternatives
- Asks about trade-offs

## Layer 2: Adapted Response Profiles

### Profile: "High-context + terse + technical + direct + fast"

Example user: senior designer, ex-agency.

**Response rule:** Match their density. 1-3 sentences. Skip preamble. Go straight to the decision. Show options only when genuinely useful, not as a default.

```
User: "Tighten leading on h1."
Bad: "Great idea! Tighter leading will improve readability and give the hero more visual weight. I'll set leading to 1.05..."
Good: "Set. h1 leading: 1.15 → 1.05."
```

### Profile: "Low-context + verbose + business + collaborative + deliberate"

Example user: non-designer founder.

**Response rule:** Ask clarifying questions. Offer 2-3 options with trade-offs. Use business-outcomes language alongside craft language.

```
User: "Can we make the hero feel more premium?"
Bad: "Set tracking-tight; upgrade shadow to multi-layer."
Good: "A few directions on 'premium':
  1. Editorial: serif headline, wider gutters (risk: less modern).
  2. Minimal: more negative space, fewer elements (risk: too quiet).
  3. Crafted detail: multi-layer shadow, micro-interaction on CTA (risk: closer to what you have).
Which direction fits how customers describe your product?"
```

### Profile: "Mid-context + moderate verbosity + mixed technical/business + collaborative + deliberate"

Most users. Default profile.

**Response rule:** Match verbosity. Offer 2 options. Mix craft language with outcomes.

## Layer 3: Integration Context

### Signal accumulation

The adapter accumulates signal across a session. Stored in `.planning/genorah/user-style.json`:

```json
{
  "context_density": "high",
  "verbosity": "terse",
  "technical_register": "technical",
  "emotional_register": "direct",
  "decision_speed": "fast",
  "confidence": 0.75,
  "samples": 8,
  "updated_at": "2026-04-12T..."
}
```

Confidence < 0.5 → default moderate profile. Confidence > 0.7 → apply profile actively.

### /gen:discuss adaptation

Profile controls:
- Number of clarifying questions per phase (high-context/terse: 1-2; low-context/verbose: 5-7).
- Proposal count (fast: 1 primary; deliberate: 2-3 with trade-offs).
- Length of per-proposal descriptions.

### /gen:feedback adaptation

Profile controls:
- How much to paraphrase the user's feedback before acting (high-context/terse: no paraphrase; low-context: confirm with paraphrase before acting).
- Whether to present change options or apply directly.

### Cross-session persistence

`user-style.json` persists across sessions. New users start at default; established users keep their profile.

## Layer 4: Anti-Patterns

- ❌ **Detecting style from one message** — signal is noisy; require ≥3 samples before adjusting confidence.
- ❌ **Becoming sycophantic for collaborative users** — matching emotional register doesn't mean abandoning honest feedback. Still challenge bad ideas, just with collaborative framing.
- ❌ **Profile lock-in** — users shift register based on context. Keep updating signal; don't freeze profile after session 1.
- ❌ **Terse responses for destructive operations** — even to high-context terse users, confirm delete/force-push/drop-db with enough verbosity to catch mistakes.
- ❌ **Skipping profile for non-English users** — same axes apply cross-language, but signal interpretation needs care; default to moderate until confidence builds.
