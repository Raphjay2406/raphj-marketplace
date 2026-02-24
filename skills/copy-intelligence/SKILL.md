---
name: copy-intelligence
description: "Brand voice generation engine with content bank, tiered banned phrases, and archetype-aware copy profiles. Generates comprehensive voice documents during brainstorm and provides formula templates for every content need."
tier: domain
triggers: "brand voice, copy strategy, content bank, copy intelligence, voice document, headline formula, CTA philosophy, banned phrases, copy quality, content planning"
version: "2.0.0"
---

Use this skill during brainstorm when establishing brand voice, during content planning when building section copy specs, when generating copy for any section, and when validating copy quality against the brand voice document.

You are a brand voice strategist and UX copywriter who generates comprehensive voice systems. Every project gets a distinctive copywriting personality that is as unique as its visual identity -- generic copy is as unacceptable as generic design. "Learn More" is the typographic equivalent of `bg-blue-500`: technically functional, spiritually bankrupt.

## Layer 1: Decision Guidance

### When to Use

- **During brainstorm** (after creative direction is chosen): Generate BRAND-VOICE.md alongside BRAINSTORM.md. The voice document defines the project's entire copywriting personality
- **During section planning** (section-planner agent): Extract relevant voice rules into each section's PLAN.md under a Copy Specification heading
- **During content review** (quality-reviewer agent): Validate section copy against voice document, banned phrase lists, and archetype voice profile
- **During iteration** (`/modulo:iterate`): Diagnose copy quality issues, recommend voice adjustments, and validate revised copy

### When NOT to Use

- **For per-component micro-copy patterns during execution** -- use `micro-copy` skill instead. That skill provides TSX-level button patterns, empty state copy, and error message templates that builders reference when writing code
- **For headline beat-type templates in isolation** -- `micro-copy` skill has concise beat-specific headline patterns. Use copy-intelligence when you need the full voice system, not a quick headline reference

### Relationship to micro-copy Skill

**copy-intelligence is the GENERATOR. micro-copy is the ENFORCER.**

| Aspect | copy-intelligence | micro-copy |
|--------|------------------|------------|
| Pipeline stage | Brainstorm + planning | Execution (build) |
| What it produces | BRAND-VOICE.md, content bank formulas, Copy Specification in PLAN.md | TSX patterns, button copy, error messages, empty states |
| Who reads it | Section-planner, creative-director, quality-reviewer | Section-builders during code implementation |
| Scope | Project-wide voice system | Per-component copy patterns |
| Archetype depth | Full voice personality profiles (19 archetypes) | One-line tone table (16+ archetypes) |

The two skills are **companions**: copy-intelligence generates the voice rules during brainstorm, micro-copy provides the execution-phase patterns builders use to implement them. Neither replaces the other.

### Decision Tree

- Is this about GENERATING a project-wide voice system? --> **copy-intelligence**
- Is this about IMPLEMENTING copy in a specific component? --> **micro-copy**
- Is this about validating copy quality against the brand voice? --> **copy-intelligence**
- Is this about writing a specific CTA button label? --> **micro-copy** (with voice rules from Copy Specification in PLAN.md)
- Is this about defining headline formulas for a content bank? --> **copy-intelligence**
- Is this about the structural pattern of an empty state component? --> **micro-copy**

### Pipeline Stages

1. **Brainstorm** (`/modulo:start-project`): Generate BRAND-VOICE.md alongside BRAINSTORM.md. Creative-director reviews voice document for archetype alignment
2. **Section planning** (`/modulo:plan-dev`): Section-planner reads BRAND-VOICE.md and extracts relevant voice rules into each section's PLAN.md under "Copy Specification"
3. **Execution** (`/modulo:execute`): Builders read Copy Specification in their PLAN.md. They reference micro-copy skill for TSX patterns. They NEVER read BRAND-VOICE.md directly
4. **Content review** (`/modulo:iterate`): Quality-reviewer validates section copy against voice document, banned phrases, and content density rules

### Pipeline Connection

- **Referenced by:** `creative-director` agent during brainstorm (validates voice-archetype alignment)
- **Referenced by:** `section-planner` agent during `/modulo:plan-dev` (extracts voice rules into PLAN.md)
- **Referenced by:** `quality-reviewer` agent during post-build review (banned phrase scan, voice compliance)
- **Consumed at:** `/modulo:start-project` workflow step 3.75 (content planning phase)

---

## Brand Voice Document Template

This template gets filled per-project during brainstorm and saved to `.planning/modulo/BRAND-VOICE.md`. Every section below is REQUIRED -- a voice document missing any section is incomplete.

```markdown
# Brand Voice: [Project Name]

## Voice Identity
- **Archetype:** [from design-archetypes selection]
- **Personality:** [4 adjectives from archetype voice profile table]
- **Voice summary:** [2-3 sentences capturing the overall tone, attitude, and feel. Be specific -- "confident and precise" not "professional"]
- **One-line test:** If this brand were a person at a party, they would: [complete the sentence -- this forces a concrete personality image]

## Tone Spectrum
| Context | Position (1=gentle, 5=bold) | Characteristics | Example |
|---------|----------------------------|-----------------|---------|
| Hero headline | [4-5] | [declarative, bold, concise] | "[project-specific example]" |
| Feature description | [2-3] | [precise, confident, specific] | "[project-specific example]" |
| CTA primary | [3-4] | [action-oriented, urgent but not pushy] | "[project-specific example]" |
| CTA secondary | [2] | [softer, alternative-presenting] | "[project-specific example]" |
| Error state | [1-2] | [human, helpful, calm] | "[project-specific example]" |
| Testimonial frame | [2-3] | [warm, authentic, direct] | "[project-specific example]" |
| Navigation labels | [1] | [functional, clear, minimal] | "[project-specific example]" |
| Footer content | [1-2] | [professional, neutral, complete] | "[project-specific example]" |

## Vocabulary Rules
- **Preferred words:** [10-15 words that fit this voice -- verbs especially]
- **Forbidden words:** [from banned phrase list + project-specific additions]
- **Technical level:** [1-5 scale: 1=consumer-friendly, 5=expert-only]
- **Jargon policy:** [when technical terms are OK vs plain language required]
- **Sentence length preference:** [short / medium / varied -- with target word range]
- **Punctuation personality:** [which punctuation marks define this voice: periods for authority, em dashes for energy, ellipses for mystery, etc.]

## Sentence Patterns
| Element | Pattern | Constraints |
|---------|---------|-------------|
| Headlines | [case, max words, structure] | Max [N] words, [sentence/title] case |
| Subheadlines | [relationship to headline, structure] | Expands headline, max [N] words |
| Body paragraphs | [length, complexity, rhythm] | [N-M] words/sentence, [X-Y] sentences/paragraph |
| CTAs | [verb-first or not, word count, tone] | [N-M] words, starts with [verb/noun] |
| Labels/nav | [case, tracking, style] | [sentence/title] case, max [N] words |
| Captions | [tone, length] | [N-M] words, [conversational/descriptive] |

## Per-Section Voice Variation
| Section Type | Tone Shift | Sentence Length | Formality | Energy |
|-------------|-----------|-----------------|-----------|--------|
| Hero | Most bold | Shortest | Least formal | Highest |
| Features | Precise | Medium | More formal | Medium |
| Social proof | Warm | Varies (quotes) | Casual | Medium |
| CTA / Close | Urgent | Short | Direct | High |
| About / story | Narrative | Longer | Moderate | Low-medium |
| Pricing | Clear | Short | Professional | Medium |
| Footer | Neutral | Short | Professional | Low |

## Content Density Rules
- **Hero:** max [N] text elements, [X]% whitespace minimum
- **Feature section:** max [N] features visible without scroll
- **Reading level target:** Grade [N] (Flesch-Kincaid)
- **Paragraph density:** max [N] paragraphs per viewport before breaking with visual element
- **Copy-to-visual ratio:** [description -- e.g., "60% visual, 40% copy for most sections"]

## Headline Formula Library
[5-8 headline formulas tuned to this project's voice and archetype]
Format per formula:
**[Formula Name]:** [structural pattern]. Example: "[concrete example using project language]"

1. **[Formula 1]:** [pattern]. Example: "[example]"
2. **[Formula 2]:** [pattern]. Example: "[example]"
3. **[Formula 3]:** [pattern]. Example: "[example]"
4. **[Formula 4]:** [pattern]. Example: "[example]"
5. **[Formula 5]:** [pattern]. Example: "[example]"

## CTA Philosophy
- **Primary CTA approach:** [direct command / invitation / benefit statement]
- **Secondary CTA approach:** [soft alternative / exploration / safety net]
- **Social proof integration:** [when/how to include metrics or testimonials near CTAs]
- **Friction reducers:** [what reassurances to place near primary CTAs -- no credit card, free tier, time estimate]
- **CTA progression:** [how CTA tone escalates or softens through the page arc]
```

### Voice Document Generation Protocol

When generating BRAND-VOICE.md during brainstorm:

1. **Read the selected archetype** from design-archetypes skill -- extract personality adjectives, forbidden patterns, and tension zones
2. **Read the archetype voice profile** from the table below -- extract sentence style, punctuation, humor level, formality, vocabulary character
3. **Fill every section** of the template above -- no section left as placeholder
4. **Generate 5-8 headline formulas** that reflect the archetype's voice personality, not generic patterns
5. **Cross-check banned phrases** -- ensure no headline formula can produce a hard-banned phrase
6. **Write the one-line test** -- this is the single most diagnostic sentence in the document; if it is vague, the voice is vague
7. **Validate consistency** -- tone spectrum positions must be internally consistent (hero is always boldest, footer always gentlest)

---

## Archetype Voice Personality Profiles

Full voice personality for each of the 19 archetypes. These profiles extend the micro-copy skill's one-line "Tone by Archetype" table into comprehensive copywriting personalities.

### Voice Profile Table

| Archetype | Personality (4 adj) | Sentence Style | Punctuation | Humor | Formality | Vocabulary Character | Sample Headline | Sample CTA |
|-----------|-------------------|----------------|-------------|-------|-----------|---------------------|----------------|-----------|
| Brutalist | blunt, honest, raw, confrontational | Ultra-short declaratives. Sentence fragments. No softeners | Periods. No exclamation marks. No ellipses | None -- ironic distance at most | Anti-formal | Industrial, monosyllabic, Anglo-Saxon roots | "We make websites." | "Use It" |
| Ethereal | gentle, luminous, serene, contemplative | Flowing, soft rhythm. Long vowels preferred. Breath-like pacing | Em dashes -- ellipses... minimal periods | Warm, never sharp | Low formality, high grace | Atmospheric: light, drift, bloom, emerge, breathe | "Find your calm." | "Begin Your Journey" |
| Kinetic | energetic, dynamic, restless, driven | Short punchy bursts. Active voice always. Verbs dominate | Periods for impact. Occasional exclamation | Confident banter, not jokes | Casual-professional | Motion verbs: launch, accelerate, build, ship, move | "Motion is everything." | "Launch Now" |
| Editorial | intellectual, authoritative, measured, cultured | Complex sentences with subordinate clauses. Literary rhythm | Em dashes, semicolons, colons. Never exclamation marks | Dry wit, understated irony | High -- learned register | Polysyllabic, Latinate roots, literary allusions | "Words that matter." | "Read the Story" |
| Neo-Corporate | precise, confident, modern, clean | Medium-length. Subject-verb-object. No filler words | Periods. Sparing em dashes | Professional warmth, not humor | Professional -- never stiff | Technical-accessible: deploy, integrate, scale, optimize | "Ship with confidence." | "Start Building" |
| Organic | warm, grounded, authentic, earthy | Medium flowing. Natural rhythm. Conversational but not sloppy | Periods, commas. Occasional ellipses for thought trails | Gentle, self-deprecating | Approachable-professional | Nature-derived: rooted, grow, cultivate, harvest, nurture | "Rooted in purpose." | "Join the Movement" |
| Retro-Future | techy, nostalgic, playful, cryptic | Terminal-style terse. Commands and prompts | `>`, `//`, `/**/`. Monospace punctuation | Tongue-in-cheek, nerdy references | Anti-formal, technical | CLI vocabulary: execute, run, init, compile, boot | "> init project" | "Execute" |
| Luxury/Fashion | minimal, exclusive, rarefied, sensual | Sparse. One word can be a sentence. Suggestive, not explicit | Periods only. No exclamation marks | Never -- seriousness is the point | Ultra-high formality | Curated, timeless, atelier, bespoke, refined, heritage | "Timeless." | "Discover" |
| Playful/Startup | fun, casual, friendly, optimistic | Short-medium, conversational. Questions welcome. Emoji-adjacent tone | Exclamation marks OK (max 1 per section). Question marks | Genuine humor, puns acceptable | Very casual | Everyday words: try, build, play, create, share, love | "Building should be fun." | "Let's Go!" |
| Data-Dense | functional, precise, analytical, efficient | Short declaratives. Data-first sentence structure. Numbers lead | Periods. Colons before data. Parenthetical details | None -- let data speak | Technical-professional | Quantitative: metrics, throughput, latency, uptime, SLA | "Real-time, always." | "Start Monitoring" |
| Japanese Minimal | quiet, understated, contemplative, restrained | Minimal. Often one word or phrase. Subtractive -- remove until nothing remains | Periods only. Maximum silence between words | Never explicit | Transcends formality -- neither formal nor casual | Reductive: less, space, silence, breath, essence, void | "Less." | "Enter" |
| Glassmorphism | modern, clean, layered, translucent | Medium-clean. Clarity over cleverness. Every word must earn its place | Periods, occasional em dashes | Light, never forced | Modern-professional | Transparency words: clarity, layer, depth, focus, refine | "Clarity in layers." | "Get Started" |
| Neon Noir | bold, electric, mysterious, nocturnal | Short-medium. Cyberpunk cadence. Alliterative when possible | Periods. Em dashes for dramatic pauses | Dark, sardonic | Anti-formal but stylized | Urban-digital: grid, signal, pulse, sync, interface, neon | "Welcome to the grid." | "Plug In" |
| Warm Artisan | friendly, story-driven, tactile, genuine | Medium-long narrative. Story structure in micro-copy. Personal tone | Commas, periods, em dashes for asides | Warm, personal anecdotes | Informal-professional | Craft words: handmade, curated, sourced, crafted, small-batch | "Made with care." | "Shop the Collection" |
| Swiss/International | rational, minimal, systematic, objective | Medium declaratives. No adjectives where nouns suffice | Periods only. Never exclamation marks | Never -- objectivity is the voice | High formality, zero personality | Structural: system, grid, order, function, form, structure | "Design is structure." | "View Work" |
| Vaporwave | ironic, nostalgic, surreal, detached | Fragment-heavy. Aesthetic word choices over meaning. Dreamy pacing | Tildes~, aesthetic spacing, occasional // | Ironic, self-aware, meta | Anti-formal, performatively casual | Retro-digital: vibe, aesthetic, wave, dream, retro, virtual | "A E S T H E T I C" | "Enter the Void" |
| Neubrutalism | bold, playful, accessible, unapologetic | Short bursts. Declarative. Friendly despite the rawness | Periods. Occasional exclamation marks (1 per page max) | Playful confidence, not comedy | Casual-direct | Bold-simple: big, bold, real, make, do, try, here | "No fluff. Just build." | "Try It" |
| Dark Academia | literary, nostalgic, scholarly, romantic | Complex, multi-clause. Literary register. Quote-heavy | Semicolons; em dashes -- parenthetical asides | Erudite wit, literary references | High -- academic register | Scholarly: discourse, illuminate, chronicle, archive, manuscript | "Knowledge endures." | "Enter the Archive" |
| AI-Native | precise, systematic, observant, emergent | Technical-clean. Observational tone. Data as narrative | Periods. Colons for data labels. Brackets for metadata | None -- the machine does not joke | Neutral-technical | Machine vocabulary: process, model, signal, pattern, inference | "Intelligence, visible." | "Initialize" |

### Contextual Voice Variation by Boldness Tier

Archetypes fall into three boldness tiers that determine how voice shifts by context.

**Conservative** (Swiss, Japanese Minimal, Data-Dense, Luxury, Editorial, Dark Academia):
Minimal voice variation across contexts. Hero tone is only slightly bolder than body. CTA is restrained. Error states are clinical. Pricing is factual.

**Moderate** (Neo-Corporate, Organic, Glassmorphism, Ethereal, Warm Artisan, AI-Native):
Noticeable voice variation. Hero tone is distinctly bolder. CTA has controlled urgency. Error states are human and warm. Pricing balances clarity with personality.

**Bold** (Brutalist, Kinetic, Playful, Neon Noir, Retro-Future, Vaporwave, Neubrutalism):
Maximum voice variation. Hero tone is dramatically different from body. CTA can be provocative. Error states can be characterful. Pricing can break conventions.

| Context | Conservative | Moderate | Bold |
|---------|-------------|----------|------|
| Hero headline | Authoritative, measured. Max 6 words. Understatement as power | Confident, clear. 4-8 words. Balance of personality and clarity | Provocative, punchy. 2-6 words. Personality over information |
| Feature description | Factual, precise. No metaphor. Benefit-first | Benefit-first with personality. Light metaphor OK | Character-driven. Metaphor encouraged. Voice over completeness |
| CTA primary | Descriptive action: "View Collection", "Contact" | Outcome-driven: "Start Building", "Get Early Access" | Personality-first: "Let's Go!", "Plug In", "Execute" |
| CTA secondary | Functional: "Learn more about pricing" | Softer alternative: "See how it works" | Characterful contrast: "Or just look around" |
| Error state | Clinical: "Request failed. Please retry." | Human: "Something went wrong -- try refreshing." | On-brand: "Well, that broke. Mind trying again?" |
| Pricing copy | Feature list only. No personality | Features with light voice. Plan names can have personality | Plan names ARE personality. "The Real Deal" vs "The Starter" |
| Social proof | Company names only. Numbers. No editorializing | Quotes with attribution. Metrics with brief context | Curated quotes. Voice-matched framing. Personality in the wrapper |
| Navigation | Single nouns: "Work", "About", "Contact" | Descriptive nouns: "Our Work", "About Us" | Characterful: "The Goods", "Who We Are", "Say Hi" |

---
