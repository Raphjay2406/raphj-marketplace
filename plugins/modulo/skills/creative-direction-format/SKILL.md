---
name: creative-direction-format
description: "Comprehensive format for presenting creative directions with concept boards, ASCII mockup prototypes, distinctness validation, and free mixing protocol. Ensures directions are genuinely distinct and richly detailed."
tier: core
triggers: "creative direction, concept board, direction format, brainstorm output, direction presentation, ASCII mockup, distinctness validation, free mixing, direction comparison"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are an art director who presents creative directions as rich, decision-enabling concept boards. Every direction must be detailed enough for the user to viscerally feel the difference, and distinct enough to represent a real choice -- not the same concept in three color palettes. A direction is a COMPLETE visual identity preview: archetype personality, color mood, motion feel, layout philosophy, typography voice, tension plan, and emotional arc -- all rendered as concrete examples, not abstract descriptions.

### When to Use

- **After research is complete and archetypes are shortlisted** -- when assembling the 3 creative directions for user presentation during brainstorm
- **When formatting concept boards** -- every direction must follow this template exactly, no shortcuts
- **When validating direction distinctness** -- run the validation matrix BEFORE presenting to the user
- **When the user wants to mix elements** -- follow the free mixing protocol to synthesize a coherent hybrid

### When NOT to Use

- **During build execution** -- the direction is already chosen and locked into Design DNA. Reference `design-dna` for build-time identity.
- **During iteration** -- use `iterate.md` command for post-build changes. Directions are a brainstorm-phase artifact.
- **For single-archetype selection** -- if the user already knows their archetype, skip directions and go straight to DNA generation.

### Direction Assembly Process

1. Select 3 distinct archetypes from the research shortlist (one bold, one moderate, one unexpected)
2. For each archetype: build a FULL concept board using the template in Layer 2
3. Run the distinctness validation matrix (Layer 3) across all 3 directions
4. If validation FAILS: regenerate the most similar direction with forced shifts on 2+ dimensions
5. Present all 3 directions with competitive benchmark comparison
6. After user reviews: offer free mixing protocol (Layer 3) for cherry-picking across directions
7. Final synthesized direction becomes the seed for Design DNA generation

### How Many Directions

**3 per brainstorm.** This is the CONTEXT.md override from the default 2. Three provides genuine choice without overwhelming. One bold direction pushes boundaries. One moderate direction feels safe but polished. One unexpected direction brings cross-pollination surprise.

### Pipeline Connection

- **Referenced by:** `design-brainstorm` skill during brainstorm phase (defines the output format for all directions)
- **Consumed at:** Creative director agent when assembling BRAINSTORM.md artifact
- **Output feeds:** Design DNA generation (the chosen/mixed direction seeds all 12 color tokens, fonts, motion tokens, signature element)

---

## Layer 2: Award-Winning Examples

### Full Concept Board Template

Every creative direction MUST include ALL of the following sections. No section may be skipped or abbreviated. The concept board is the complete specification per direction.

```markdown
## Direction [A/B/C]: "[Evocative Name]"

### Identity
- **Archetype:** [name from design-archetypes skill, or "Custom" with parent archetype noted]
- **Mood:** [3-4 adjectives that capture the visceral feeling]
- **Visual DNA Summary:** [2-3 sentences describing the overall visual approach -- not generic, specific to THIS direction]
- **Competitive Position:** "Like [reference A] meets [reference B]" -- [1 sentence explaining the synthesis and what makes it fresh]

### Color Mood
| Token | Hex | Character |
|-------|-----|-----------|
| bg | [hex] | [2-3 word character: "warm canvas", "deep void", "cool slate"] |
| surface | [hex] | [character] |
| text | [hex] | [character] |
| border | [hex] | [character] |
| primary | [hex] | [character] |
| secondary | [hex] | [character] |
| accent | [hex] | [character] |
| muted | [hex] | [character] |
| glow | [hex or "none"] | [character] |
| tension | [hex] | [character] |
| highlight | [hex] | [character] |
| signature | [hex] | [character] |

**Palette narrative:** [1 sentence: what story do these colors tell together?]

### Typography Pairing
- **Display:** [specific font name] -- [weight, tracking, character description]
- **Body:** [specific font name] -- [weight, line-height, character description]
- **Mono/Accent:** [specific font name or "none"] -- [when and where used]
- **Sample headline in voice:** "[actual headline written in THIS direction's voice -- not placeholder text]"
- **Sample subheadline:** "[supporting text that demonstrates the tone]"

### Motion Identity
- **Motion personality:** [1-2 sentences: what motion FEELS like in this direction -- visceral, not technical]
- **Signature motion:** [the ONE motion that defines this direction: "glacial parallax fade", "sharp snap-in with overshoot", etc.]
- **Entrance pattern:** [how elements appear: fade-up, slide-in, scale-reveal, mask-wipe, etc.]
- **Hover behavior:** [what happens on hover: subtle lift, color shift, magnetic pull, glitch, morph, etc.]
- **Scroll behavior:** [parallax intensity, sticky sections, scroll-reveal, continuous animation, etc.]
- **Transition pace:** [snappy <200ms | smooth 300-500ms | cinematic 600ms+]
- **Motion reference:** [real site that has similar motion feel -- name + what to observe]

### ASCII Hero Mockup
[Full ASCII mockup using standardized format -- see ASCII Format Specification below]

### ASCII Sample Section Mockup
[Second ASCII mockup showing a BUILD, REVEAL, or PROOF section -- demonstrates direction beyond the hero]

### Tension Plan Preview
- **Tension level:** [conservative / moderate / bold -- from creative-tension archetype frequency table]
- **Planned tension type:** [which of the 5 tension types from creative-tension skill: Scale Violence, Material Collision, Temporal Disruption, Dimensional Break, Interaction Shock]
- **Where it hits:** [which beat/section receives the tension moment]
- **What it looks like:** [2-3 sentences describing the SPECIFIC implementation -- not abstract, concrete enough to visualize]

### Emotional Arc Suggestion
- **Recommended arc:** [sequence of 5-7 beat types for a typical page, e.g., HOOK > BUILD > REVEAL > BREATHE > PEAK > PROOF > CLOSE]
- **Peak moment:** [which section gets the PEAK beat and what makes it the emotional climax]
- **Pacing:** [fast-start / slow-build / wave-pattern -- and WHY this pacing suits the archetype]
- **Arc rationale:** [1 sentence connecting this arc to the archetype personality]

### Constraint Breaks
- **Break 1:** RULE: [industry or archetype convention]. WE BREAK BY: [specific alternative]. WHY: [strategic rationale connecting to project goals].
- **Break 2:** [if applicable based on archetype boldness -- bold archetypes get 2-3 breaks, conservative get 1]

### Why This Direction
[3-4 sentences: what makes this direction strategically right for the project, how it differentiates from competitors found in research, what emotional response it creates in users, and why the archetype-content-motion combination works as a unified identity. This is NOT a summary -- it is a persuasive argument for this direction.]
```

### Worked Example: Complete Direction for a SaaS Analytics Platform

```markdown
## Direction B: "Quiet Authority"

### Identity
- **Archetype:** Neo-Corporate
- **Mood:** Confident, restrained, intelligent, premium
- **Visual DNA Summary:** A dark-mode data environment that communicates competence through whitespace and precision, not flashiness. Every element earns its place. The design whispers "we are serious about your data" through surgical typography and deliberate negative space rather than shouting with gradients and animations.
- **Competitive Position:** "Like Linear's spatial clarity meets Stripe's typographic confidence" -- combining Linear's information hierarchy with Stripe's ability to make technical content feel premium.

### Color Mood
| Token | Hex | Character |
|-------|-----|-----------|
| bg | #0a0a0f | deep void |
| surface | #141420 | elevated dark |
| text | #e8e6e3 | warm white |
| border | #2a2a3a | subtle divider |
| primary | #6366f1 | confident indigo |
| secondary | #818cf8 | lighter indigo |
| accent | #22d3ee | data cyan |
| muted | #64748b | quiet slate |
| glow | #6366f1 | indigo halo |
| tension | #f43f5e | alert rose |
| highlight | #22d3ee | cyan pulse |
| signature | #6366f1 | brand indigo |

**Palette narrative:** A deep, controlled darkness where indigo signals action and cyan highlights data -- every color serves an information purpose.

### Typography Pairing
- **Display:** Inter -- 700 weight, -0.02em tracking, geometric precision without coldness
- **Body:** Inter -- 400 weight, 1.65 line-height, optimized for long-form data descriptions
- **Mono/Accent:** JetBrains Mono -- used in metric callouts, data labels, and code references
- **Sample headline in voice:** "See what your data is actually telling you."
- **Sample subheadline:** "Real-time analytics for teams who make decisions, not dashboards."

### Motion Identity
- **Motion personality:** Precise and purposeful -- every animation communicates a state change or draws attention to data. Nothing decorative. Motion feels like a well-engineered instrument responding to input.
- **Signature motion:** Smooth number counters that tick up from zero when metrics scroll into view, using tabular-nums for stable layout.
- **Entrance pattern:** Fade-up with 20px translate, staggered 80ms per element in a group.
- **Hover behavior:** Subtle border-color transition to primary + soft glow ring (0 0 20px rgba(99,102,241,0.15)).
- **Scroll behavior:** Sticky metric dashboard section that updates values as user scrolls through feature explanations.
- **Transition pace:** Snappy 180ms for interactions, smooth 350ms for section entrances.
- **Motion reference:** Linear.app -- observe the precise, minimal entrance animations and how hover states feel mechanical rather than playful.

### ASCII Hero Mockup
+------------------------------------------------------+
|  [LOGO]              [Features] [Pricing] [LOG IN]   |
*bg: var(--color-bg), sticky, backdrop-blur on scroll*
+------------------------------------------------------+
|                                                      |
|                                                      |
|        See what your data is                         |
|        actually telling you.                         |
|        *text-6xl, font-bold, tracking-tight*         |
|                                                      |
|   Real-time analytics for teams who                  |
|   make decisions, not dashboards.                    |
|   *text-xl, text-muted, max-w-lg*                   |
|                                                      |
|   [ Start Free Trial ]    View Demo ->               |
|   *bg-primary, rounded-lg*                           |
|                                                      |
|        +----------------------------------+          |
|        |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |          |
|        |  ▓▓  DASHBOARD SCREENSHOT  ▓▓▓▓  |          |
|        |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |          |
|        +----------------------------------+          |
|        *rounded-xl, shadow-2xl, border,*             |
|        *fade-up 400ms, translateY(40px)*             |
|                                                      |
+------------------------------------------------------+
*viewport: ~100vh, bg: var(--color-bg)*
*mobile: stack vertically, text-4xl headline*

### ASCII Sample Section Mockup
+------------------------------------------------------+
|                                                      |
|        Built for how teams                           |
|        actually work.                                |
|        *text-5xl, font-bold, text-center*            |
|                                                      |
|  +------------+  +--------------------------+        |
|  |  2.4s      |  |                          |        |
|  |  avg query |  |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |        |
|  |  *mono,    |  |  ▓▓  FEATURE VISUAL  ▓▓  |        |
|  |   text-4xl |  |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |        |
|  |   cyan*    |  |                          |        |
|  +------------+  +--------------------------+        |
|  +------------+  *fade-up, stagger 80ms*             |
|  |  99.97%    |                                      |
|  |  uptime    |  Unified view across every           |
|  |  *mono*    |  data source. No more tab            |
|  +------------+  switching between tools.            |
|                  *text-lg, text-muted*                |
|                                                      |
+------------------------------------------------------+
*viewport: ~80vh, bg: var(--color-surface)*
*beat: BUILD, layout: asymmetric metrics + visual*
*mobile: stack metrics horizontal, visual below*

### Tension Plan Preview
- **Tension level:** moderate (Neo-Corporate = LOW group, but data platform context allows one bold moment)
- **Planned tension type:** Scale Violence -- oversized metric counter
- **Where it hits:** PEAK beat (the "by the numbers" section)
- **What it looks like:** A single key metric (e.g., "2.4 billion events processed") renders at text-9xl / 120px+ with the number animating from 0 in JetBrains Mono. The number is so large it nearly touches the viewport edges on mobile. Surrounding whitespace is extreme (py-32+). The precision of the monospace font at absurd scale creates tension between the controlled Neo-Corporate aesthetic and the raw impact of the data.

### Emotional Arc Suggestion
- **Recommended arc:** HOOK > BUILD > REVEAL > BREATHE > PEAK > PROOF > CLOSE
- **Peak moment:** "By the numbers" section with the oversized metric counter -- the emotional climax lands the product's scale and reliability before social proof reinforces it.
- **Pacing:** slow-build -- Neo-Corporate earns attention through accumulating credibility, not grabbing it with flash.
- **Arc rationale:** Neo-Corporate personality rewards patience; the slow escalation from confident headline to detailed features to dramatic data payoff mirrors how enterprise buyers build conviction.

### Constraint Breaks
- **Break 1:** RULE: SaaS products must show a product screenshot in the hero. WE BREAK BY: The hero leads with the headline and metric promise; the product visual appears below the fold as a REVEAL. WHY: Delaying the product screenshot creates anticipation and lets the value proposition land before the visual evidence confirms it.

### Why This Direction
Quiet Authority positions the product as the grown-up in a market full of colorful, playful analytics dashboards. By leaning into dark-mode precision and restrained motion, it signals enterprise reliability without looking corporate-boring. The Neo-Corporate archetype gives us the framework to be serious and premium while the Scale Violence tension moment at PEAK prevents the design from becoming forgettable. Competitors in the analytics space either go full-playful (Mixpanel, Amplitude) or full-corporate (Tableau, Looker) -- this direction occupies the underserved middle: premium, modern, and technically confident.
```

### ASCII Mockup Format Specification

The ASCII mockup format is a standardized symbol vocabulary for communicating layout, hierarchy, and motion intent in plain text. Every mockup in a concept board MUST use these conventions consistently.

#### Symbol Vocabulary

```
+------+     Section boundary (always full width, marks section start/end)
|      |     Content container edge
[TEXT]        Button or CTA (interactive element, clickable)
(TEXT)        Decorative element (background shape, orb, gradient zone)
███████       Visual weight / emphasis block (heavy presence)
▓▓▓▓▓▓▓      Image or media placeholder (screenshot, video, illustration)
░░░░░░░      Subtle background texture or pattern area
────────      Horizontal rule or divider (within a section)
│             Vertical alignment guide or column separator
->            Direction / flow indicator (navigation, scroll hint)
*text*        Annotation (sizing, effects, treatments, motion notes)
//text//      Alternative state note (hover state, scroll state)
```

#### Mockup Rules (Enforced)

1. **Width:** 56 characters maximum (fits in markdown code blocks without horizontal scroll)
2. **Annotations are mandatory:** Every non-obvious element gets an annotation line directly below it in `*annotation*` format. Include: Tailwind sizing classes, viewport height, motion/animation notes, background specification.
3. **Desktop is primary:** Show the full desktop layout. Add a single-line mobile note at the bottom: `*mobile: [simplified description of mobile adaptation]*`
4. **Section height:** Every mockup includes a viewport estimate: `*viewport: ~100vh*` or `*viewport: ~60vh*`
5. **Motion annotations:** At least 1 motion annotation per mockup describing an entrance, scroll, or interaction animation
6. **Background specification:** Every mockup includes `*bg: var(--color-*)*` noting which DNA token drives the background
7. **Beat label (for section mockups):** Non-hero mockups include `*beat: [TYPE]*` to connect to the emotional arc

#### Canonical ASCII Mockup Templates

These templates serve as starting points. Adapt them to each direction's archetype and layout philosophy.

**Template 1: Cinematic Hero** (full-viewport, centered headline, product visual below)
```
+------------------------------------------------------+
|  [LOGO]            [Nav Links]        [CTA BUTTON]   |
*sticky nav, backdrop-blur on scroll*
+------------------------------------------------------+
|                                                      |
|                                                      |
|          ██████████████████████████                   |
|          ██  HERO HEADLINE  ██████                   |
|          ██████████████████████████                   |
|          *text-7xl, font-bold, fade-up 300ms*        |
|                                                      |
|     Supporting text that clarifies the                |
|     value proposition in one sentence.                |
|     *text-xl, text-muted, max-w-2xl, mx-auto*       |
|                                                      |
|     [ Primary CTA ]     Secondary ->                 |
|     *bg-primary, scale hover 1.02*                   |
|                                                      |
|        +----------------------------------+          |
|        |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |          |
|        |  ▓▓  PRODUCT VISUAL  ▓▓▓▓▓▓▓▓▓  |          |
|        |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |          |
|        +----------------------------------+          |
|        *rounded-xl, shadow-2xl, fade-up 500ms*      |
|                                                      |
+------------------------------------------------------+
*viewport: ~110vh, bg: var(--color-bg)*
*mobile: text-5xl headline, full-width visual*
```

**Template 2: Editorial Hero** (asymmetric, large type left, image right)
```
+------------------------------------------------------+
|  [LOGO]            [Nav Links]        [CTA BUTTON]   |
+------------------------------------------------------+
|                          |                           |
|  HERO                    |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |
|  HEAD-                   |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |
|  LINE                    |  ▓▓  HERO IMAGE  ▓▓▓▓▓  |
|  *text-8xl,              |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |
|   tracking-tighter*      |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |
|                          |  *parallax: -15%*        |
|  Supporting text here.   |                           |
|  *text-lg, text-muted*   |                           |
|                          |                           |
|  [ Get Started ]         |                           |
|                          |                           |
+------------------------------------------------------+
*viewport: ~100vh, bg: var(--color-bg)*
*grid: 50/50 split, gap-0*
*mobile: stack, image above headline*
```

**Template 3: Bento Features** (asymmetric grid cards, mixed sizes)
```
+------------------------------------------------------+
|                                                      |
|     Section Headline Here                            |
|     *text-5xl, font-bold, mb-16*                     |
|                                                      |
|  +------------------+  +------------------+          |
|  |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |  |  Feature Title   |          |
|  |  ▓▓  VISUAL  ▓▓▓  |  |  Description of  |          |
|  |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |  |  this feature.   |          |
|  |  *col-span-2*     |  |  *bg-surface*    |          |
|  +------------------+  +------------------+          |
|  +---------+  +---------+  +------------------+     |
|  | Metric  |  | Metric  |  |  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  |     |
|  | 99.9%   |  | <50ms   |  |  ▓▓  VISUAL  ▓▓▓  |     |
|  | *mono*  |  | *mono*  |  |  *col-span-2*     |     |
|  +---------+  +---------+  +------------------+     |
|  *stagger fade-up 100ms per card*                    |
|                                                      |
+------------------------------------------------------+
*viewport: ~80vh, bg: var(--color-surface)*
*beat: BUILD, grid: auto-fit minmax(280px, 1fr)*
*mobile: single column stack*
```

**Template 4: Split Proof** (testimonial left, metric right)
```
+------------------------------------------------------+
|                                                      |
|  +------------------------+  +--------------------+  |
|  |                        |  |                    |  |
|  |  "Quote from a real    |  |    ████████████    |  |
|  |   customer that shows  |  |    ██  4.9/5  ██   |  |
|  |   genuine impact."     |  |    ████████████    |  |
|  |                        |  |    *text-7xl,      |  |
|  |  -- Name, Title, Co.   |  |     font-mono*     |  |
|  |  *text-2xl, italic*    |  |                    |  |
|  |                        |  |    2,400+ reviews   |  |
|  |  (company-logo)        |  |    *text-muted*    |  |
|  |                        |  |                    |  |
|  +------------------------+  +--------------------+  |
|  *fade-in-left 400ms*        *fade-in-right 400ms*   |
|                                                      |
+------------------------------------------------------+
*viewport: ~60vh, bg: var(--color-bg)*
*beat: PROOF, grid: 60/40 split*
*mobile: stack, quote first, metric below*
```

**Template 5: Minimal CTA** (centered, generous whitespace, single action)
```
+------------------------------------------------------+
|                                                      |
|                                                      |
|                                                      |
|          Ready to see the difference?                |
|          *text-5xl, font-bold, text-center*          |
|                                                      |
|          Start your free trial today.                |
|          No credit card. Cancel anytime.             |
|          *text-lg, text-muted, text-center*          |
|                                                      |
|              [ Start Free Trial ]                    |
|              *bg-primary, px-12, py-4*               |
|              *scale 1.05 on hover, 200ms*            |
|                                                      |
|                                                      |
|                                                      |
+------------------------------------------------------+
*viewport: ~60vh, bg: var(--color-surface)*
*beat: CLOSE, 70%+ whitespace ratio*
*mobile: same layout, text-3xl headline*
```

---

## Layer 3: Integration Context

### Distinctness Validation Matrix

After generating 3 directions, ALWAYS validate distinctness before presenting to the user. Fill the matrix and check pass criteria.

| Dimension | Values | Direction A | Direction B | Direction C | All Different? |
|-----------|--------|-------------|-------------|-------------|----------------|
| **Archetype** | [name from design-archetypes] | | | | yes/no |
| **Color Mood** | warm / cool / neutral / dark / vibrant | | | | yes/no |
| **Motion Style** | kinetic / subtle / static / cinematic | | | | yes/no |
| **Tension Level** | conservative / moderate / bold | | | | yes/no |
| **Typography Voice** | serif-led / sans-led / mono-led / mixed | | | | yes/no |
| **Layout Philosophy** | cinematic / dense / bento / minimal / immersive | | | | yes/no |

**Pass criteria:** At least 3 of 6 dimensions are "yes" (meaning all three directions have DIFFERENT values in that dimension).

**Fail criteria:** Fewer than 3 dimensions are "yes." Action: Identify the most similar pair of directions. Regenerate the weaker direction with FORCED shifts on at least 2 of the failing dimensions. Re-validate.

**Validation example:**
If Direction A is "Ethereal / cool / cinematic / conservative / serif-led / minimal" and Direction B is "Ethereal / cool / subtle / moderate / sans-led / minimal" -- these share Archetype, Color Mood, and Layout Philosophy (3 matches). They FAIL distinctness. Direction B must be regenerated with a different archetype, different color mood, AND different layout philosophy.

### Free Mixing Protocol

After the user reviews all 3 directions, they may want to cherry-pick elements across directions. This is expected and encouraged -- the goal is the best possible Design DNA, not allegiance to a single direction.

**Step 1: Capture preferences.**
User indicates likes: "I prefer A's colors, B's typography, C's motion feel." Document each pick with the source direction.

**Step 2: Identify the base direction.**
The base direction is the one contributing the MOST elements (plurality wins). In a tie, prefer the direction whose archetype is closest to the majority of picks. The base archetype provides the constraint system (mandatory techniques, forbidden patterns).

**Step 3: Map cherry-picked elements onto the base.**
For each cherry-picked element, verify it can be expressed within the base archetype's constraint system:
- Color token: Does the new color conflict with any mandatory or forbidden palette rule?
- Font: Does the new font conflict with the archetype's required font category?
- Motion: Does the new motion style conflict with the archetype's motion intensity range?
- Tension: Is the new tension level compatible with the archetype's frequency group?

**Step 4: Run coherence check.**
Check for conflicts between cherry-picked elements:
- Brutalist motion (instant, raw) + Ethereal typography (delicate serifs) = CONFLICT (raw motion undermines delicate type)
- Neon Noir colors (dark, saturated) + Swiss typography (clean sans-serif) = COMPATIBLE (dark palette works with clean type)
- Kinetic motion (aggressive, continuous) + Japanese Minimal layout (sparse, restrained) = CONFLICT (continuous motion overwhelms sparse layout)

**Step 5a: If coherent** -- present the synthesized direction as a NEW concept board with all cherry-picked elements integrated. Mark the source of each element: `[from Direction B]`. Run distinctness validation is NOT needed (there is only one synthesis).

**Step 5b: If conflict detected** -- explain the specific tension between the conflicting elements. Propose a resolution: which element to adjust, and how. Present 2 options:
1. Adapt the cherry-picked element to fit the base (e.g., "slow down the Kinetic motion to fit the Minimal layout")
2. Adapt the base to accommodate the cherry-pick (e.g., "shift the Minimal layout to allow more visual density to support the motion")

**Step 6: User confirms.**
Present the final synthesis. User approves or requests further adjustments.

**Step 7: Lock into DNA.**
The final synthesized direction becomes the seed for Design DNA generation. Every token, font, motion parameter, and signature element from the synthesis populates the DNA document.

### How This Skill Connects to Other Skills

**design-brainstorm** -- The brainstorm protocol produces 3 directions using this format. This skill defines the OUTPUT FORMAT. The brainstorm skill defines the PROCESS of arriving at each direction (research methodology, archetype shortlisting, cross-pollination). Separation of concerns: process vs. presentation.

**design-archetypes** -- Each direction is anchored to an archetype from this skill. The archetype provides the constraint system (locked palette, required fonts, mandatory techniques, forbidden patterns, signature element, tension zones). Directions must respect archetype constraints or explicitly document breaks.

**emotional-arc** -- The "Emotional Arc Suggestion" section in each concept board references beat types (HOOK, BUILD, REVEAL, BREATHE, PEAK, PROOF, CLOSE, etc.) and arc rules from the emotional-arc skill. Arc suggestions must follow the enforced rules: no 3+ consecutive high-energy, PEAK followed by BREATHE, etc.

**creative-tension** -- The "Tension Plan Preview" section references the 5 tension levels (Scale Violence, Material Collision, Temporal Disruption, Dimensional Break, Interaction Shock) and the archetype frequency table from the creative-tension skill. Tension plans must match the archetype's group (HIGH/MEDIUM/MODERATE/LOW).

### BRAINSTORM.md Output Format

The final artifact saved to `.planning/genorah/BRAINSTORM.md` after the brainstorm session includes:

```markdown
# Creative Direction Brainstorm

## Research Summary
[Brief summary of competitive research findings -- key patterns, gaps, opportunities]

## Direction A: "[Name]"
[Full concept board in the template format above]

## Direction B: "[Name]"
[Full concept board]

## Direction C: "[Name]"
[Full concept board]

## Distinctness Validation
[Filled matrix with pass/fail]

## Competitive Benchmark Comparison
| Dimension | Direction A | Direction B | Direction C | [Competitor 1] | [Competitor 2] |
|-----------|-------------|-------------|-------------|-----------------|-----------------|
| Color approach | | | | | |
| Typography | | | | | |
| Motion intensity | | | | | |
| Layout style | | | | | |
| Overall personality | | | | | |

## User Selection
[Which direction chosen, or mixing notes if cherry-picking]

## Final Synthesis
[If mixing occurred: the synthesized concept board with source annotations]

## Design DNA Seed
[The parameters that will populate DESIGN-DNA.md: 12 color tokens, fonts, motion tokens, signature element, archetype name]
```

### DNA Connection

| DNA Token | How This Skill Uses It |
|-----------|----------------------|
| All 12 color tokens | Concept board includes full 12-token palette per direction with hex values and character descriptions |
| Display/Body/Mono fonts | Typography Pairing section specifies fonts that become DNA font selections |
| Motion tokens | Motion Identity section defines personality, pace, and signature that seed DNA motion parameters |
| Signature element | Archetype selection determines signature element format (name: param=value) |
| Spacing scale | Layout philosophy in concept board informs DNA spacing scale (dense = tight, minimal = generous) |

### Archetype Variants

The concept board template is archetype-agnostic by design -- it works for all 19 archetypes. However, certain sections adapt:

| Archetype Group | Concept Board Adaptation |
|-----------------|------------------------|
| HIGH tension (Brutalist, Neubrutalism, Kinetic, Neon Noir) | Tension Plan Preview includes 2-3 tension moments, not just 1. Constraint Breaks section includes 2-3 breaks. |
| LOW tension (Swiss, Japanese Minimal, Warm Artisan, Luxury, Neo-Corporate) | Tension Plan Preview is conservative (1 moment at PEAK only). Constraint Breaks limited to 1 strategic break. |
| Motion-heavy (Kinetic, Neon Noir, Vaporwave) | Motion Identity section is expanded: include specific GSAP/CSS animation descriptions, not just personality words. |
| Typography-led (Editorial, Swiss, Dark Academia) | Typography Pairing section is expanded: include type scale examples at 3+ sizes, not just display/body/mono. |
| Custom archetype | Identity section notes "Custom (derived from [parent])". All sections filled using the custom archetype's generated constraints. |

---

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Three Shades of Beige

**What goes wrong:** All 3 directions use the same archetype with minor variations (different color palette, same layout, same motion, same tension level). The user has no real choice -- they are picking a color scheme, not a creative direction.

**Instead:** Force different archetypes for each direction. Use the distinctness validation matrix BEFORE presenting. If two directions share an archetype, the second MUST use a different one. Aim for one bold archetype (HIGH tension group), one moderate (MEDIUM/MODERATE), and one unexpected (from outside the obvious industry recommendation in the archetype selection guide).

### Anti-Pattern 2: ASCII Art Theater

**What goes wrong:** ASCII mockups look decorative but communicate nothing about actual layout intent. Boxes without labels. No sizing annotations. No motion notes. No viewport height. The mockup could represent any design.

**Instead:** Every element in the ASCII mockup gets an annotation line. Include Tailwind sizing classes (`text-7xl`, `py-40`, `max-w-2xl`), viewport height estimate (`*viewport: ~100vh*`), motion description (`*fade-up 300ms, stagger 80ms*`), and background token (`*bg: var(--color-surface)*`). If a developer cannot estimate the actual implementation from the ASCII mockup, it is not detailed enough.

### Anti-Pattern 3: Motion Afterthought

**What goes wrong:** The direction includes rich visual specifications (12-token palette, font pairings, layout philosophy) but the Motion Identity section is a single word ("smooth") or a generic sentence ("elements animate in gracefully"). Motion is 25% of the Awwwards Design score. Treating it as an afterthought guarantees a sub-8.0 score.

**Instead:** Motion Identity MUST include all 7 sub-items: personality (visceral description), signature motion (the ONE defining animation), entrance pattern (specific technique), hover behavior (specific response), scroll behavior (specific approach), transition pace (specific timing range), and motion reference (real site with observation notes). If any sub-item says "smooth" or "elegant" without specifics, it is too vague.

### Anti-Pattern 4: Missing the "Why"

**What goes wrong:** Directions are presented as pure visual specifications -- a color table, a font list, a motion description -- without connecting any of it to the project's goals, competitive landscape, or target audience. The user must guess WHY this direction is right.

**Instead:** Every direction ends with a "Why This Direction" section that is a 3-4 sentence ARGUMENT, not a summary. Connect visual choices to project goals ("this positions you as the premium alternative to..."). Reference competitors found in research ("competitor X uses playful motion; we counter with precision"). Describe the emotional response ("users will feel confident and in control, not entertained"). The "Why" section is what separates a concept board from a mood board.

### Anti-Pattern 5: False Choice

**What goes wrong:** Two directions are safe, polished, and obviously viable. The third is intentionally wild, impractical, or misaligned with the project -- included so the user "has three options" but really has two. The wild card exists to be rejected, making the choice feel predetermined.

**Instead:** All 3 directions MUST be genuinely viable and defensible for the project. The "unexpected" direction should be surprising but strategically justified -- the "Why This Direction" section must make a compelling case for it. If you cannot write a genuine "Why" for a direction, it should not be presented. The user should struggle to choose because all three are excellent but different, not because one is obviously wrong.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| directions_per_brainstorm | 3 | 3 | count | HARD -- always exactly 3 |
| concept_board_sections | 11 | 11 | sections | HARD -- all sections required per direction |
| color_tokens_per_direction | 12 | 12 | tokens | HARD -- full DNA palette per direction |
| motion_identity_sub_items | 7 | 7 | items | HARD -- all 7 motion sub-items required |
| ascii_mockups_per_direction | 2 | 2 | mockups | HARD -- hero + sample section |
| ascii_width | 1 | 56 | characters | HARD -- no horizontal overflow |
| distinctness_dimensions_pass | 3 | 6 | dimensions | HARD -- at least 3 of 6 must differ |
| constraint_breaks_low_tension | 1 | 1 | breaks | SOFT -- LOW archetypes get 1 break |
| constraint_breaks_high_tension | 2 | 3 | breaks | SOFT -- HIGH archetypes get 2-3 breaks |
| free_mixing_steps | 7 | 7 | steps | HARD -- full protocol required for mixing |
