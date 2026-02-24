---
name: emotional-arc
description: "Page storytelling system with 10 beat types. Each beat has hard parameter constraints (whitespace %, element count, viewport height) for enforceable emotional pacing."
tier: core
triggers: "emotional arc, page flow, beat type, pacing, section order, storytelling, narrative, page rhythm, user journey, beat assignment"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a narrative designer who treats every page as a story. Each section is a BEAT with a specific emotional role and measurable parameters. Pages that list features are forgettable. Pages with emotional arcs convert.

### When to Use

- **During section planning** (`/modulo:plan-sections`): Assign beat types to each section based on content and desired emotional flow
- **During section building**: Builders read beat constraints and build within parameters -- height, whitespace, element count are not suggestions
- **During verify** (`/modulo:verify`): Quality reviewer checks beat parameter compliance against Hard Constraint tables
- **During iteration** (`/modulo:iterate`): Re-sequence beats when pacing feels wrong, swap beat types to fix emotional flatness

### How Arc Planning Works

1. Section planner assigns beat types based on content and desired emotional flow
2. Each beat has HARD constraints (must be within range) and SOFT constraints (recommended, flexible)
3. Archetype may override specific beat parameters (e.g., Japanese Minimal reduces HOOK height)
4. Arc template from archetype provides a default beat sequence
5. Planner can deviate from default sequence but must follow arc rules (no invalid sequences)

### Arc Rules (Enforced)

These rules are HARD -- planners and quality reviewers must reject sequences that violate them.

- Every page MUST start with HOOK or TEASE (never BUILD or PROOF first)
- Every page MUST end with CLOSE or PIVOT (never BREATHE or BUILD last)
- No 3+ consecutive high-energy beats (HOOK, PEAK, TENSION) -- must breathe between peaks
- No 3+ consecutive low-energy beats (BREATHE, PROOF) -- needs re-engagement
- PEAK beat can appear at most twice per page
- BREATHE must follow PEAK (mandatory cooldown)

### Beat Energy Levels (for Sequence Validation)

| Beat | Energy | Role |
|------|--------|------|
| HOOK | High | Grab attention |
| TEASE | Medium | Create desire to scroll |
| REVEAL | Medium-High | Show the product/concept |
| BUILD | Medium | Stack value and features |
| PEAK | High | Maximum intensity wow moment |
| BREATHE | Low | Decompression and rest |
| TENSION | High | Urgency, conflict, challenge |
| PROOF | Low | Social proof and validation |
| PIVOT | Medium | Shift direction or perspective |
| CLOSE | Medium-Low | Final action and CTA |

### Pipeline Connection

- **Referenced by:** `design-lead` during `/modulo:plan-sections` (assigns beats to sections in MASTER-PLAN.md)
- **Consumed at:** `section-builder` spawn prompt (beat type + constraint table extracted)
- **Verified by:** `quality-reviewer` during `/modulo:verify` (checks parameter compliance)

---

## Layer 2: Award-Winning Examples

All 10 beat types with enforceable constraint tables. Builders read these tables and MUST produce output within the specified ranges.

### 1. HOOK

> The first 2 seconds. Grab attention. Make them stop scrolling.

**Purpose:** Create an immediate emotional response. The user must feel something in the first 2 seconds -- curiosity, excitement, awe, intrigue. This is the page's first impression. If the HOOK fails, nothing else matters.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 90 | 100 | vh | HARD |
| Element count | 3 | 5 | elements | HARD |
| Whitespace ratio | 60 | 70 | % | HARD |
| Type scale | hero | hero | level | HARD |
| Animation intensity | high | high | level | SOFT |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | Simple (centered or split) | Can use asymmetric for Editorial |
| Animation duration | 800-1500ms entrance | Shorter for Data-Dense |
| Color intensity | High contrast, signature colors | Archetype-dependent |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Japanese Minimal | Height: 50-70vh, Elements: 1-2 | Restraint IS the statement |
| Data-Dense | Skip HOOK entirely -- data IS the hook | Opens with BUILD instead |
| Editorial | Height: 60-80vh, content-first layout | Typography carries the weight |
| Ethereal | Whitespace: 70-80% | Atmosphere needs more breathing room |

#### Common Patterns

- Full-viewport hero with oversized headline, brief subtext, and one CTA
- Split hero: media on one side, text on the other, asymmetric tension
- Single-word or single-phrase hero with dramatic motion entrance

---

### 2. TEASE

> Hint at depth. Show just enough to create desire to scroll.

**Purpose:** Create a gap between what the user sees and what they want to know. Social proof logos, a single compelling metric, or a provocative statement. The TEASE doesn't explain -- it baits.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 40 | 60 | vh | HARD |
| Element count | 3 | 6 | elements | HARD |
| Whitespace ratio | 50 | 60 | % | HARD |
| Type scale | h2 | h3 | level | HARD |
| Animation intensity | medium | medium | level | SOFT |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | Simple to medium | More complex for dashboard teasers |
| Animation duration | 400-600ms subtle reveals | Kinetic archetype can go faster |
| Content type | Logo bar, metric, question | Flexible per archetype |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Kinetic | Animation intensity: high | Motion IS the tease |
| Luxury | Height: 30-50vh, Elements: 1-2 | Single provocative word or image |
| Vaporwave | Animation intensity: high, glitch effects | Aesthetic disorientation as hook |

#### Common Patterns

- Logo bar with "Trusted by" credibility strip
- Single compelling metric with brief context ("10x faster than...")
- Provocative question or statement that demands scroll for the answer

---

### 3. REVEAL

> The "aha moment." Show the product/concept clearly.

**Purpose:** Unveil the product, the solution, the key insight. This is where desire converts to understanding. The user goes from "I'm curious" to "I get it." The REVEAL must be visually distinctive -- product screenshots, demos, interactive previews.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 60 | 80 | vh | HARD |
| Element count | 4 | 8 | elements | HARD |
| Whitespace ratio | 40 | 50 | % | HARD |
| Type scale | h2 | h2 | level | HARD |
| Animation intensity | medium-high | medium-high | level | SOFT |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | Medium-high (product showcase) | Simpler for editorial reveals |
| Animation duration | 600-1000ms scroll-triggered | Faster for kinetic archetypes |
| Visual anchor | Product image/screenshot/demo | Video or interactive for SaaS |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Luxury | Height: 80-100vh, full-viewport product hero | Product IS art -- give it the whole screen |
| Data-Dense | Dashboard reveal with live data animation | Data visualization as reveal |
| Warm Artisan | Craft process showcase with texture | Handmade quality needs tactile reveal |

#### Common Patterns

- Product screenshot with scroll-triggered UI element animations
- Browser mockup with interface walkthrough
- Split reveal: problem on left, solution (product) on right

---

### 4. BUILD

> Stack value. Layer features and benefits. Create confidence.

**Purpose:** Systematically build the case. Features, capabilities, integrations. Dense but organized. BUILD sections are where the rational brain engages after the emotional HOOK/REVEAL. Multiple BUILD sections are common -- each focusing on a different facet.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 80 | 120 | vh | HARD |
| Element count | 8 | 12 | elements | HARD |
| Whitespace ratio | 30 | 40 | % | HARD |
| Type scale | h3 | h4 | level | HARD |
| Animation intensity | low | medium | level | SOFT |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | High (bento grids, tabs, feature lists) | Simpler for editorial |
| Animation duration | 300-500ms staggered reveals | Faster stagger for longer lists |
| Content density | Feature cards, icon grids, tabbed showcases | Flexible per content type |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Editorial | Elements: 4-6, Whitespace: 40-55% | Fewer elements, wider spacing for readability |
| Japanese Minimal | Elements: 3-4 per section | Restraint -- never dense |
| Swiss | Grid-strict layout, no decorative elements | Functional purity |

#### Common Patterns

- Bento grid with mixed-size feature cards
- Tabbed showcase: multiple feature categories in one section
- Icon grid: 6-9 features with icon, title, and one-line description

---

### 5. PEAK

> Maximum intensity. The wow moment. The screenshot people share.

**Purpose:** The most impressive moment on the page. Deploy creative tension techniques, signature animations, 3D elements, or interactive demos here. PEAK is where the project's personality shines brightest. At least one creative tension technique should fire during a PEAK beat.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 80 | 100 | vh | HARD |
| Element count | 3 | 5 | elements | HARD |
| Whitespace ratio | 40 | 60 | % | HARD |
| Type scale | h1 | hero | level | HARD |
| Animation intensity | high | high | level | HARD |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | High (interactive, 3D, video) | Simpler if archetype demands restraint |
| Animation duration | 800-1500ms cinematic | Can be continuous/looping |
| Creative tension | At least one tension technique | Required for SOTD-Ready scores |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Swiss | Restrained peak -- geometric precision over spectacle | Restraint IS impressive in Swiss |
| Data-Dense | Data visualization as peak, charts/graphs as wow | Numbers can be cinematic |
| Japanese Minimal | Height: 60-80vh, Elements: 1-2 | Single perfect moment |
| Brutalist | Raw, oversized, deliberately jarring | Shock as craft |

#### Common Patterns

- Interactive product demo with real-time manipulation
- 3D scene with scroll-driven camera movement
- Full-viewport signature animation with creative tension technique

**Note:** PEAK is where creative tension moments belong. BREATHE must follow PEAK (mandatory cooldown).

---

### 6. BREATHE

> Pause. Let the user rest. Decompression space.

**Purpose:** Reset the user's emotional state. A simple quote, a single metric, or just generous whitespace. Prevents fatigue. Peaks only feel intense BECAUSE of the valleys around them. This is the most strictly enforced beat -- the whitespace ratio is non-negotiable.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 30 | 50 | vh | HARD |
| Element count | 1 | 3 | elements | HARD |
| Whitespace ratio | 70 | 80 | % | HARD |
| Type scale | body-large | h3 | level | HARD |
| Animation intensity | minimal | minimal | level | HARD |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | Minimal (centered text, single image) | Never complex |
| Animation duration | 400ms gentle fade or none | No dramatic entrances |
| Content type | Quote, metric, image, empty space | One thing only |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Brutalist | Text-only quote, no imagery | Raw words are the pause |
| Ethereal | Whitespace: 80-90% | Atmosphere amplified through emptiness |
| Luxury | Full-bleed editorial image as breath | Visual rest through beauty |

#### Common Patterns

- Centered pull quote with attribution
- Single large metric ("4.2M users") with minimal context
- Full-width image with no overlaid text

**Critical:** BREATHE whitespace ratio 70-80% is the hardest constraint in the entire arc system. If a BREATHE section feels dense, it is NOT a BREATHE -- reassign it.

---

### 7. TENSION

> Create urgency or conflict. Challenge the user.

**Purpose:** Make the user feel the problem. Without tension, the solution has no weight. TENSION beats create the contrast that makes REVEAL and PROOF sections land harder. Often used for objection handling, before/after comparisons, pain point exposition, or challenge statements.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 40 | 70 | vh | HARD |
| Element count | 3 | 6 | elements | HARD |
| Whitespace ratio | 30 | 50 | % | HARD |
| Type scale | h2 | h3 | level | HARD |
| Animation intensity | medium | high | level | SOFT |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | Medium (comparison, before/after) | Simpler for single-statement tension |
| Animation duration | 500-800ms dramatic, asymmetric | Slower for deliberate builds |
| Color treatment | Darker palette, contrast shift | Archetype-dependent |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Playful | Gamified tension, lighter tone | Tension through playful challenge |
| Neo-Corporate | Statistics-driven tension, data as pressure | Numbers create urgency |
| Neon Noir | Dark dramatic tension, neon accents on pain points | Aesthetic darkness for emotional weight |

#### Common Patterns

- Before/after comparison with dramatic split
- Pain point list with escalating visual intensity
- Challenge statement: "Your current approach costs you X every day"

---

### 8. PROOF

> Social proof, testimonials, case studies. Remove doubt.

**Purpose:** Other people trust this. Real numbers back it up. PROOF sections provide the rational justification for the emotional decision the user has already started making. Testimonials, client logos, case studies, metrics grids.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 60 | 100 | vh | HARD |
| Element count | 5 | 10 | elements | HARD |
| Whitespace ratio | 35 | 45 | % | HARD |
| Type scale | h3 | body-large | level | HARD |
| Animation intensity | low | low | level | SOFT |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | Medium (testimonial cards, logo bars, stats) | More complex for case study deep-dives |
| Animation duration | 200-400ms staggered grid appearance | Faster for logo bars |
| Content mix | Quotes + metrics + logos | At least two proof types per section |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Luxury | Full-page case study with editorial photography | Single proof point, maximum depth |
| Data-Dense | Metrics grid, dashboard-style proof | Numbers speak louder than quotes |
| Brutalist | Raw client list, no embellishment | Proof through names alone |

#### Common Patterns

- Testimonial carousel/grid with photos and company logos
- Metrics bar: 3-4 large numbers with brief labels
- Case study card with before/after results and client quote

---

### 9. PIVOT

> Shift direction. New topic or perspective.

**Purpose:** Change the conversation. "But it's not just about X -- it's about Y." Introduces a new dimension (community, vision, future, secondary offering). PIVOT reframes the narrative and often precedes the final CLOSE. Keeps long pages from feeling monotonous.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 40 | 60 | vh | HARD |
| Element count | 2 | 4 | elements | HARD |
| Whitespace ratio | 50 | 65 | % | HARD |
| Type scale | h2 | h2 | level | HARD |
| Animation intensity | medium | medium | level | SOFT |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | Simple to medium | Can be more complex for multi-product pivots |
| Animation duration | 500-700ms transition emphasis | Faster for editorial pivots |
| Visual treatment | Background shift, tone change | Clear signal that topic is changing |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Editorial | Dramatic type treatment for pivot statement | Typography carries the shift |
| Kinetic | Motion-driven pivot, elements reorganize | Movement signals the change |
| Luxury | Full-bleed image transition | Visual shift through imagery |

#### Common Patterns

- "But that's not all" section with new headline and visual shift
- Vision/mission statement that reframes the product as movement
- Secondary product or offering introduction

---

### 10. CLOSE

> Final action. Clear CTA. No ambiguity about the next step.

**Purpose:** Convert. One clear primary CTA. Supporting text that reinforces urgency or value. The user should feel confident clicking. The CLOSE must leave no question about what to do next. This is the culmination of the entire emotional journey.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 40 | 60 | vh | HARD |
| Element count | 3 | 5 | elements | HARD |
| Whitespace ratio | 50 | 65 | % | HARD |
| Type scale | h2 | h3 | level | HARD |
| Animation intensity | medium | medium | level | SOFT |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | Simple (centered CTA, single action) | Never complex |
| Animation duration | 400-600ms final attention | No long entrances |
| CTA clarity | One primary action, one friction reducer | Never more than two CTAs |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Japanese Minimal | Elements: 1-2, single element + CTA | Restraint to the very end |
| Luxury | Full-page statement close, editorial final image | Grand finale |
| Brutalist | Raw CTA, oversized type, no softening | Blunt honesty |

#### Common Patterns

- Centered headline + subtext + single CTA button + friction reducer
- Split close: summary on left, CTA form on right
- Full-viewport close with background treatment echoing HOOK

**Required:** CLOSE MUST contain a primary CTA. No CLOSE section is complete without a clear next step.

---

### Default Arc Templates by Archetype

These are starting points. Planners may deviate but must follow all arc rules.

**Standard (most archetypes):**
```
HOOK -> TEASE -> BUILD -> PEAK -> BREATHE -> PROOF -> BUILD -> CLOSE
```

**Editorial:**
```
HOOK -> REVEAL -> BUILD -> BREATHE -> BUILD -> PEAK -> BREATHE -> PROOF -> CLOSE
```

**Japanese Minimal:**
```
TEASE -> REVEAL -> BREATHE -> BUILD -> BREATHE -> CLOSE
```

**Data-Dense:**
```
BUILD -> REVEAL -> BUILD -> PROOF -> BUILD -> TENSION -> CLOSE
```

**Luxury / Fashion:**
```
HOOK -> BREATHE -> REVEAL -> PEAK -> BREATHE -> PROOF -> CLOSE
```

**Brutalist:**
```
HOOK -> TENSION -> REVEAL -> BUILD -> PEAK -> BREATHE -> PROOF -> CLOSE
```

**Kinetic:**
```
HOOK -> REVEAL -> BUILD -> PEAK -> BREATHE -> PROOF -> PIVOT -> CLOSE
```

**Ethereal:**
```
HOOK -> TEASE -> REVEAL -> BREATHE -> BUILD -> PROOF -> BREATHE -> CLOSE
```

**Neon Noir:**
```
HOOK -> TENSION -> REVEAL -> BUILD -> PEAK -> BREATHE -> PROOF -> CLOSE
```

**Playful / Startup:**
```
HOOK -> TEASE -> REVEAL -> BUILD -> PEAK -> BREATHE -> PROOF -> CLOSE
```

---

### 6 Transition Techniques Between Beats

Transitions are pacing tools, not decorations. Choose based on the energy delta between adjacent beats.

#### 1. Hard Cut

Immediate energy change with no blending. Background color switches abruptly. Stark, dramatic.

**When to use:** Large energy delta -- BREATHE to PEAK, PROOF to TENSION, any dramatic shift.
**Energy delta:** High (3+ levels apart).
**Implementation:** Abrupt background-color change, no gradient, no fade. First element of new section appears immediately.

#### 2. Gradient Fade

Smooth energy blending via background color shift or opacity crossfade. Continuous, gentle.

**When to use:** Small energy delta -- BUILD to BREATHE, REVEAL to BUILD, gentle transitions.
**Energy delta:** Low (0-1 levels apart).
**Implementation:** CSS scroll-driven crossfade between sections, or background gradient that blends from one section's palette to the next.

#### 3. Spatial Bridge

Overlapping elements that physically connect two sections. A shape, image, or element spans both.

**When to use:** Narrative connection -- TEASE to REVEAL, BUILD to PEAK, any pair where the content is related.
**Energy delta:** Medium (1-2 levels apart).
**Implementation:** Absolutely-positioned element (image, shape, line) that starts in the outgoing section and extends into the incoming section via negative margin or sticky positioning.

#### 4. Narrative Thread

A continuous visual element (line, shape, color accent, illustration) that threads through multiple sections, creating visual continuity.

**When to use:** Multi-section sequences -- multiple BUILD sections, any sequence that tells a progressive story.
**Energy delta:** Any (the thread itself is the continuity).
**Implementation:** SVG path or decorative element that scroll-animates through sections. CSS border or accent color that persists across section boundaries.

#### 5. Rhythm Break

Intentional disruption of the visual rhythm to reset attention. Layout shifts, typography changes, or visual pattern breaks.

**When to use:** Before high-energy beats -- pre-PEAK, pre-TENSION. Resets attention for maximum impact.
**Energy delta:** Preparation for jump (current to much higher).
**Implementation:** Sudden layout change (grid to full-width), typography scale jump, or decorative element that breaks the grid. Brief visual dissonance before the new beat establishes its rhythm.

#### 6. Echo

Subtle visual callback to an earlier section. Creates bookend effect and narrative closure.

**When to use:** CLOSE referencing HOOK, or any callback moment. Creates satisfying resolution.
**Energy delta:** Varies (the echo is about content connection, not energy).
**Implementation:** Reuse a color, shape, or layout motif from an earlier section. Subtle enough to feel like a callback, not a copy. Often used in CLOSE to mirror HOOK elements.

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token/Section | Usage in Emotional Arc |
|-------------------|----------------------|
| Arc template | Default beat sequence stored in DESIGN-DNA.md; planners start from this template |
| Motion tokens | Animation intensity per beat maps to DNA motion vocabulary (entrance, scroll-reveal, etc.) |
| Type scale | Beat type-scale constraints reference DNA's 8-level type scale |
| Spacing scale | Whitespace ratios map to DNA's 5-level spacing system |
| Signature element | PEAK beats are where the DNA signature element should appear most prominently |
| Color tokens | TENSION beats often shift to DNA's `tension` expressive token; BREATHE beats use `muted` |

### Archetype Connection

Archetypes modify emotional arc in three ways:

1. **Beat parameter overrides** -- Individual beats have different constraints per archetype (documented in override tables above)
2. **Default arc template** -- Each archetype has a recommended beat sequence (documented in Arc Templates section above)
3. **Transition preferences** -- Some archetypes favor specific transition types (Brutalist: Hard Cut; Ethereal: Gradient Fade; Kinetic: Rhythm Break)

### Pipeline Stage

- **Input from:** `/modulo:plan-sections` -- receives page content inventory, section count, section purposes
- **Output to:** MASTER-PLAN.md -- each section gets a beat type assignment, transition technique to next section
- **Output to:** Section builder spawn prompts -- beat type + constraint table extracted for each builder
- **Output to:** Quality reviewer -- beat compliance checklist for parameter verification

### Related Skills

- **design-dna** -- Arc template stored in DNA; beat parameters enforce DNA constraints
- **design-archetypes** -- Archetype overrides modify beat defaults; some archetypes skip certain beats
- **anti-slop-gate** -- Layout diversity check (category L1) validates consecutive sections have different layouts -- beat variation enables this
- **creative-tension** -- PEAK beats are where tension techniques belong; tension placement should align with PEAK or TENSION beats
- **cinematic-motion** -- Animation intensity per beat maps to motion skill's intensity tiers

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Feature-List Page

**What goes wrong:** Every section is BUILD. The entire page is a monotonous feature dump with uniform density, uniform whitespace, and zero emotional contrast. Users skim and bounce because there are no peaks, no valleys, no story. The page is informationally complete but emotionally dead.
**Instead:** Vary energy with BREATHE, PEAK, and TENSION beats between BUILD sections. Even a data-heavy SaaS page needs at least one BREATHE and one moment of visual intensity (PEAK or creative tension). Minimum emotional range: at least 3 different beat types per page.

### Anti-Pattern: All High Energy

**What goes wrong:** HOOK -> PEAK -> TENSION -> PEAK -> CLOSE. Every section screams for attention. The user has no baseline to measure intensity against. Peaks only feel intense BECAUSE of the valleys around them. Without contrast, maximum intensity becomes the new normal -- which is the same as no intensity.
**Instead:** Follow the 3-consecutive-same-energy rule. High-energy beats need low-energy beats around them. The sequence PEAK -> BREATHE -> TENSION creates more impact than PEAK -> TENSION -> PEAK, even though the latter has more "wow moments."

### Anti-Pattern: Advisory Constraints

**What goes wrong:** "BREATHE sections should feel open and airy." This is not enforceable. Every builder interprets "open and airy" differently. One builder's BREATHE has 40% whitespace. Another's has 80%. The page has no consistent emotional rhythm because the constraints were vibes, not numbers.
**Instead:** "BREATHE whitespace ratio: 70-80%, HARD enforcement." Every constraint in this skill is a specific number or range with an enforcement level. If you cannot measure it, it is not a constraint -- it is a suggestion, and suggestions rot.

### Anti-Pattern: Ignoring Archetype Overrides

**What goes wrong:** Using the standard HOOK (90-100vh, 3-5 elements) for a Japanese Minimal project. The result violates the archetype's core personality. The HOOK is too tall, too dense, and too loud for a design system built on restraint and negative space.
**Instead:** Always check the Archetype Override table before applying default beat constraints. If the archetype has an override for that beat, the override replaces the default -- it does not layer on top of it.

### Anti-Pattern: Generic Transitions

**What goes wrong:** Every section simply fades into the next. The page has one transition technique applied uniformly. This wastes one of the most powerful pacing tools available. Transitions signal energy changes -- a Hard Cut before PEAK creates anticipation, a Gradient Fade into BREATHE creates calm. Uniform transitions create uniform (boring) pacing.
**Instead:** Choose transition technique based on the energy delta between adjacent beats. Large energy jumps (BREATHE to PEAK) need Hard Cuts or Rhythm Breaks. Small energy shifts (BUILD to BUILD) need Gradient Fades or Narrative Threads. Match the transition to the emotional shift.

---

## Machine-Readable Constraints

Master constraint table for automated validation. Quality reviewers extract values from this table.

### Beat Parameter Ranges

| Beat | Height Min (vh) | Height Max (vh) | Elements Min | Elements Max | Whitespace Min (%) | Whitespace Max (%) | Type Scale | Animation |
|------|----------------|-----------------|-------------|-------------|-------------------|-------------------|-----------|-----------|
| HOOK | 90 | 100 | 3 | 5 | 60 | 70 | hero | high |
| TEASE | 40 | 60 | 3 | 6 | 50 | 60 | h2-h3 | medium |
| REVEAL | 60 | 80 | 4 | 8 | 40 | 50 | h2 | medium-high |
| BUILD | 80 | 120 | 8 | 12 | 30 | 40 | h3-h4 | low-medium |
| PEAK | 80 | 100 | 3 | 5 | 40 | 60 | h1-hero | high |
| BREATHE | 30 | 50 | 1 | 3 | 70 | 80 | body-large-h3 | minimal |
| TENSION | 40 | 70 | 3 | 6 | 30 | 50 | h2-h3 | medium-high |
| PROOF | 60 | 100 | 5 | 10 | 35 | 45 | h3-body-large | low |
| PIVOT | 40 | 60 | 2 | 4 | 50 | 65 | h2 | medium |
| CLOSE | 40 | 60 | 3 | 5 | 50 | 65 | h2-h3 | medium |

### Sequence Validation Rules

| Rule | Enforcement | Rejection |
|------|-------------|-----------|
| First beat must be HOOK or TEASE | HARD | Reject plan if first beat is anything else |
| Last beat must be CLOSE or PIVOT | HARD | Reject plan if last beat is anything else |
| No 3+ consecutive high-energy (HOOK, PEAK, TENSION) | HARD | Reject sequence, insert BREATHE |
| No 3+ consecutive low-energy (BREATHE, PROOF) | HARD | Reject sequence, insert medium-energy beat |
| PEAK max 2 per page | HARD | Reject if 3+ PEAK beats |
| BREATHE must follow PEAK | HARD | Auto-insert BREATHE after every PEAK |
| Min 3 different beat types per page | HARD | Reject monotonous sequences |
