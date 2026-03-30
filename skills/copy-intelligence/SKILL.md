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
- **During iteration** (`/gen:iterate`): Diagnose copy quality issues, recommend voice adjustments, and validate revised copy

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

1. **Brainstorm** (`/gen:start-project`): Generate BRAND-VOICE.md alongside BRAINSTORM.md. Creative-director reviews voice document for archetype alignment
2. **Section planning** (`/gen:plan-dev`): Section-planner reads BRAND-VOICE.md and extracts relevant voice rules into each section's PLAN.md under "Copy Specification"
3. **Execution** (`/gen:execute`): Builders read Copy Specification in their PLAN.md. They reference micro-copy skill for TSX patterns. They NEVER read BRAND-VOICE.md directly
4. **Content review** (`/gen:iterate`): Quality-reviewer validates section copy against voice document, banned phrases, and content density rules

### Pipeline Connection

- **Referenced by:** `creative-director` agent during brainstorm (validates voice-archetype alignment)
- **Referenced by:** `section-planner` agent during `/gen:plan-dev` (extracts voice rules into PLAN.md)
- **Referenced by:** `quality-reviewer` agent during post-build review (banned phrase scan, voice compliance)
- **Consumed at:** `/gen:start-project` workflow step 3.75 (content planning phase)

---

## Brand Voice Document Template

This template gets filled per-project during brainstorm and saved to `.planning/genorah/BRAND-VOICE.md`. Every section below is REQUIRED -- a voice document missing any section is incomplete.

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

## Layer 2: Content Bank Matrix

The content bank is organized as a beat x section matrix. Each cell provides a structural formula that produces archetype-appropriate copy when combined with the voice profile. Formulas NEVER produce banned phrases -- they are structurally designed to require specificity.

### Coverage Matrix

| Beat \ Section | Hero | Features | Testimonial | CTA | Pricing | About |
|----------------|------|----------|-------------|-----|---------|-------|
| HOOK | FULL | - | - | - | - | - |
| TEASE | template | template | - | - | - | - |
| REVEAL | template | FULL | - | template | template | - |
| BUILD | - | FULL | template | template | FULL | template |
| PEAK | template | template | - | template | - | - |
| BREATHE | template | - | template | - | - | template |
| TENSION | - | template | - | - | - | - |
| PROOF | - | - | FULL | template | template | - |
| PIVOT | template | - | - | template | - | FULL |
| CLOSE | - | - | - | FULL | template | - |

**FULL** = Formula + 5-8 worked examples (archetype-varied)
**template** = Formula + 1-2 examples
**-** = Invalid or rare combination (skip)

### HOOK-Hero (FULL)

**Formula:** [Emotional claim or provocation] + [outcome or vision] in 4-8 words. The headline must be understandable in under 2 seconds and create an immediate emotional response. No jargon. No compound sentences. One idea only.

**Archetype modifier:** Conservative archetypes use declarative authority. Moderate archetypes use confident benefit statements. Bold archetypes use provocation or radical simplicity.

**Worked examples (tagged by archetype fit):**

1. "Ship at the speed of thought." -- Neo-Corporate, Kinetic (outcome vision, verb-first)
2. "We make websites." -- Brutalist (radical simplicity, anti-marketing)
3. "Find your calm." -- Ethereal (emotional invitation, soft imperative)
4. "Words that matter." -- Editorial (intellectual claim, understated authority)
5. "Build products people screenshot." -- Playful/Startup (outcome vision, specificity)
6. "Real-time, always." -- Data-Dense (functional promise, no embellishment)
7. "Made with care." -- Warm Artisan (values statement, emotional warmth)
8. "Intelligence, visible." -- AI-Native (concept compression, technical-poetic)

### REVEAL-Features / BUILD-Features (FULL)

**Formula:** [Specific capability noun] + [concrete benefit verb phrase]. Feature descriptions must answer "what does the user GET?" not "what does the product DO?" Each feature gets a headline (3-6 words) and a description (1-2 sentences, max 25 words).

**Archetype modifier:** Conservative archetypes describe capabilities factually. Moderate archetypes lead with benefit, follow with capability. Bold archetypes let personality carry the feature -- metaphor and attitude over completeness.

**Worked examples:**

1. **Headline:** "Instant deploys" / **Desc:** "Push to main. Live in 8 seconds. No build queues, no waiting." -- Neo-Corporate (metric-specific, confidence)
2. **Headline:** "Collaborative canvas" / **Desc:** "Design together in real-time. See cursors. Share context. Ship aligned." -- Kinetic (action verbs stacked)
3. **Headline:** "Type. Ship." / **Desc:** "Two steps. That is the product." -- Brutalist (radical compression)
4. **Headline:** "Gentle onboarding" / **Desc:** "New users find their way without guides, tooltips, or tutorials. The interface teaches itself." -- Ethereal (soft language, user-centered)
5. **Headline:** "The archive" / **Desc:** "Every revision, every branch, every thought -- preserved. Knowledge does not decay here." -- Dark Academia (literary register, permanence)
6. **Headline:** "99.99% uptime" / **Desc:** "Four nines. Verified independently. Check the status page." -- Data-Dense (numbers-first, proof-oriented)

### BUILD-Pricing (FULL)

**Formula:** Plan names must reflect brand personality (never "Basic/Pro/Enterprise" unless archetype demands corporate convention). Feature descriptions use parallel structure. CTA per tier follows the voice document's CTA philosophy.

**Archetype modifier:** Conservative archetypes use descriptive plan names ("Individual", "Team", "Organization"). Moderate archetypes add personality ("Starter", "Growth", "Scale"). Bold archetypes make plan names characterful ("Solo", "Squad", "Armada" or "Spark", "Blaze", "Inferno").

**Worked examples:**

1. **Neo-Corporate:** Plans: "Starter" / "Team" / "Enterprise" -- CTAs: "Start building" / "Upgrade your team" / "Talk to sales" -- Feature style: checkmarks, parallel structure, professional nouns
2. **Brutalist:** Plans: "Free" / "Paid" / "A Lot" -- CTAs: "Use it" / "Pay for it" / "Call us" -- Feature style: raw list, no icons, no embellishment
3. **Playful:** Plans: "Just Me" / "The Crew" / "The Whole Company" -- CTAs: "Start free" / "Level up" / "Let's talk" -- Feature style: emoji bullets OK, conversational descriptions
4. **Luxury:** Plans: (no plan names -- pricing by inquiry only) -- CTA: "Request pricing" -- Feature style: N/A, pricing is exclusive and private
5. **Warm Artisan:** Plans: "Seedling" / "Garden" / "Orchard" -- CTAs: "Plant your first seed" / "Grow your garden" / "Let's cultivate together" -- Feature style: metaphor-consistent, nature vocabulary
6. **Retro-Future:** Plans: "localhost" / "staging" / "production" -- CTAs: "> npm start" / "> deploy --team" / "> deploy --enterprise" -- Feature style: monospace, CLI-inspired formatting
7. **Ethereal:** Plans: "Personal" / "Studio" / "Collective" -- CTAs: "Begin your journey" / "Expand your practice" / "Grow together" -- Feature style: soft verbs, aspirational language
8. **Dark Academia:** Plans: "Scholar" / "Faculty" / "Institution" -- CTAs: "Begin your studies" / "Establish your practice" / "Contact the registrar" -- Feature style: academic register, gravitas

### PROOF-Testimonial (FULL)

**Formula:** [Framing headline] + [selected quote] + [attribution with specificity]. Testimonial framing must match brand voice -- never generic "What our customers say." Quote selection prioritizes specificity and results over generic praise.

**Archetype modifier:** Conservative archetypes use minimal framing, let quotes speak. Moderate archetypes add light editorial framing. Bold archetypes curate aggressively and may reframe the proof section entirely.

**Worked examples:**

1. **Frame:** "Trusted by teams that ship" / **Quote:** "We cut our deploy cycle from 3 days to 3 hours." / **Attribution:** "Sarah Chen, VP Engineering at Ramp" -- Neo-Corporate (metric-specific, role + company)
2. **Frame:** "They use it." / **Quote:** [no quotes -- logo grid only] -- Brutalist (anti-testimonial, proof through presence)
3. **Frame:** "Stories from the community" / **Quote:** "I finally enjoy the process again. That sounds small but it changed everything." / **Attribution:** "Marcus, independent designer" -- Warm Artisan (emotional, first-name basis)
4. **Frame:** "The evidence" / **Quote:** "40% reduction in design-to-production time across 200+ projects." / **Attribution:** "Internal metrics, Q4 2025" -- Data-Dense (data as testimonial)
5. **Frame:** "In their words" / **Quote:** "Elegant is overused. This is the real thing." / **Attribution:** "Julia Santos, Creative Director, Studio Forma" -- Luxury (curated voice, industry credibility)
6. **Frame:** "What people actually say" / **Quote:** "I showed my team and they literally applauded. That never happens." / **Attribution:** "Dev, Founder of Stackblitz" -- Playful (authentic enthusiasm, relatable)

### PIVOT-About (FULL)

**Formula:** [Reframe statement] + [origin/values narrative] + [vision statement]. About sections pivot from product to people/mission. The reframe headline signals the shift. The narrative is 2-4 short paragraphs (not a wall of text). The vision statement looks forward.

**Archetype modifier:** Conservative archetypes use understated professionalism ("Our story"). Moderate archetypes balance personal and professional ("Why we built this"). Bold archetypes make the about section a manifesto ("We got tired of bad software").

**Worked examples:**

1. **Reframe:** "Why we built this" / **Narrative:** Origin story in 3 paragraphs, team photo, mission statement -- Neo-Corporate
2. **Reframe:** "The boring part (we promise it is not)" / **Narrative:** Conversational founder story, team personality shots -- Playful
3. **Reframe:** "A studio, not a factory" / **Narrative:** Craft philosophy, process images, values as design principles -- Warm Artisan
4. **Reframe:** [No headline -- the typography IS the section] / **Narrative:** Single statement of purpose in oversized type -- Brutalist
5. **Reframe:** "Chapter One" / **Narrative:** Literary-style founding story with cultural references -- Dark Academia

### CLOSE-CTA (FULL)

**Formula:** [Reinforcement headline] + [urgency or value sub-line] + [primary CTA] + [friction reducer]. The close must feel like the natural conclusion of the page's emotional arc. Never introduce new information. Echo the HOOK's energy with added confidence.

**Archetype modifier:** Conservative archetypes close with authority and professionalism. Moderate archetypes close with warmth and invitation. Bold archetypes close with personality and provocation.

**Worked examples:**

1. "Ready to ship?" / "Start free. Upgrade when you need to." / [Start Building] / "No credit card required" -- Neo-Corporate
2. "Use it." / [single oversized button, no supporting text] -- Brutalist
3. "Your best work starts here." / "Join 12,000 teams already building." / [Get Started Free] / "2-minute setup. No meetings." -- Playful
4. "Begin." / [Discover] / [no friction reducer -- exclusivity IS the friction reducer] -- Luxury
5. "The tools exist. The moment is now." / "Start your practice." / [Enter the Archive] -- Dark Academia
6. "Ready to make something real?" / "Every great product started with a first commit." / [Start Building] / "Free forever for personal projects" -- Warm Artisan

### Template-Only Cells (Quick Reference)

Each template provides a formula and 1-2 examples. Builders generate project-specific copy on-demand using the formula + their section's Copy Specification.

**TEASE-Hero:**
Formula: [Credibility signal] in [minimal format].
Example: "Trusted by Linear, Vercel, and Raycast." (Logo bar + one-line proof)
Archetype note: Conservative archetypes use company names. Bold archetypes use unexpected metrics: "47,000 deploys last Tuesday."

**TEASE-Features:**
Formula: [Curiosity gap] about [capability].
Example: "There is a faster way to ship." (Provocation that the features section will resolve)
Archetype note: Bold archetypes can use provocation: "Your current tool is lying to you."

**REVEAL-CTA:**
Formula: [See/Experience] + [the product].
Example: "See it in action." / "Watch the 2-minute demo."
Archetype note: Luxury says "Discover." Retro-Future says "> demo --live". Data-Dense says "View live dashboard."

**REVEAL-Pricing:**
Formula: [Transparent/Simple] + [pricing framing].
Example: "Simple pricing. No surprises." / "One plan. Everything included."
Archetype note: Brutalist just shows numbers. No framing needed.

**BUILD-Testimonial:**
Formula: [Specific result quote] embedded mid-feature.
Example: Mini-testimonial card between feature rows: "This cut our review time in half." -- brief, specific, positioned as evidence.
Archetype note: Data-Dense uses metrics as testimonials: "87% of users complete onboarding in under 3 minutes."

**BUILD-CTA:**
Formula: [Action verb] + [specific destination].
Example: "Explore all integrations" / "Browse the component library" (secondary CTA linking to deeper content)
Archetype note: Never "Learn More." Always specify what the user will find.

**BUILD-About:**
Formula: [Team identity] + [credibility signal].
Example: "Built by engineers who got tired of waiting for deploys." / "A team of 12 in Berlin, shipping since 2021."
Archetype note: Warm Artisan goes personal: "Hi, I'm [name]. I made this because..."

**PEAK-Hero:**
Formula: [Maximum-intensity version of HOOK formula] -- same structural pattern, elevated scale and drama.
Example: Full-viewport: "The future of [X] is here." / "This changes everything."
Archetype note: Japanese Minimal PEAK is a single word. Brutalist PEAK is oversized raw type.

**PEAK-Features:**
Formula: [Hero-feature spotlight] with cinematic treatment.
Example: Single feature gets full-viewport showcase with interactive demo, scroll-driven reveal, or video.
Archetype note: Data-Dense peaks with an animated data visualization. Ethereal peaks with ambient particle effects.

**PEAK-CTA:**
Formula: [Emotional peak] + [conversion opportunity].
Example: "This is the moment." + [Primary CTA] / "You have seen enough." + [CTA]
Archetype note: Luxury omits CTA at peak -- the product speaks. Kinetic makes the CTA itself animated.

**BREATHE-Testimonial:**
Formula: [Single powerful quote] with generous whitespace.
Example: Pull quote centered on screen, 70-80% whitespace, nothing else competing for attention.
Archetype note: Editorial uses literary-quality quotes. Brutalist uses raw text, no quotation marks.

**BREATHE-About:**
Formula: [Single value statement] with maximum whitespace.
Example: "We believe software should feel human." (Centered, large type, nothing else)
Archetype note: Japanese Minimal can use a single word. Editorial uses a literary quotation.

**TENSION-Features:**
Formula: [Problem framing] contrasted with [solution preview].
Example: "The old way: 47 clicks to deploy. The new way: one." / "You spend 3 hours a week on this. You should spend zero."
Archetype note: Bold archetypes dramatize the problem. Conservative archetypes use data to create tension.

**PROOF-CTA:**
Formula: [Social proof metric] + [conversion action].
Example: "Join 10,000+ teams already shipping faster." + [Start Building Free]
Archetype note: Proof-backed CTAs work best for moderate archetypes. Bold archetypes may skip proof at CTA.

**PROOF-Pricing:**
Formula: [Customer result] validates [price point].
Example: "Teams using [product] save an average of 12 hours per week." / "Pays for itself in the first month."
Archetype note: Data-Dense leads with ROI metrics. Warm Artisan uses customer stories.

**PIVOT-CTA:**
Formula: [Perspective shift] + [invitation to new frame].
Example: "But we are not just a tool. We are a community." + [Join Us] / "The product is only half the story."
Archetype note: Editorial pivots with a dramatic typographic shift. Kinetic pivots with motion.

**CLOSE-Pricing:**
Formula: [Final price anchor] with [reassurance].
Example: "Free to start. Grows with you." / "Plans from $0/month. No hidden fees."
Archetype note: Luxury never shows pricing in close. Brutalist shows exact numbers, nothing else.

### Content Bank Usage Protocol

When generating copy for any section, follow this sequence:

1. **Identify the cell** -- What beat type is this section? What section type? Find the cell in the coverage matrix
2. **Read the formula** -- If FULL cell, use the complete formula + archetype modifier. If template cell, use the template formula
3. **Apply archetype personality** -- Read the archetype voice profile from the table above. Apply personality adjectives, sentence style, punctuation rules, and vocabulary character to the formula output
4. **Check the Copy Specification** -- The section PLAN.md has a Copy Specification with extracted voice rules. The output must match the specified tone position, sentence constraints, and density rules
5. **Validate against banned phrases** -- Run output through the hard-banned and discouraged lists. If any match, regenerate using the formula (the formula should prevent this, but validate)
6. **Cross-reference with micro-copy** -- If the output includes buttons, CTAs, error states, or empty states, check against micro-copy skill's patterns for TSX-level implementation guidance

---

## Layer 3: Integration Context

### Tiered Banned Phrase System

Two enforcement tiers. Hard-banned phrases are automatically rejected in any output. Discouraged phrases produce warnings and require justification to keep.

#### Hard-Banned Phrases (NEVER appear in any output)

| Phrase | Why Banned | Write Instead |
|--------|-----------|---------------|
| "Click Here" | Non-descriptive, accessibility-hostile, assumes mouse input | [Describe the destination]: "View the documentation", "See our process" |
| "Learn More" | Vague -- says nothing about what the user will learn | [Specify]: "See how it works", "Read the case study", "Explore features" |
| "Solutions" (as noun) | Corporate emptiness -- means nothing without a modifier | [Name the actual thing]: "Our analytics platform", "The design system" |
| "Leverage" (as verb) | Pretentious jargon that obscures meaning | "Use", "Apply", "Build on" |
| "Synergy" | Meaningless corporate speak -- no user ever searched for synergy | [Describe the actual integration or collaboration] |
| "Unlock" | Overused AI-slop term -- every SaaS "unlocks potential" | "Get access to", "Start using", "Enable" |
| "Seamless" | Means nothing specific -- every product claims seamlessness | [Describe HOW it is smooth]: "No context switching", "One-click setup" |
| "Empower" | Patronizing -- implies the user was powerless before | "Give you", "Let you", "Enable" |
| "World-class" | Empty superlative -- unverifiable and meaningless | [Prove it with specifics]: "Used by 500 Fortune companies", "99.99% uptime" |
| "Best-in-class" | Same as world-class -- superlative without evidence | [Provide evidence]: "Fastest in benchmark tests", "Highest-rated on G2" |
| "Cutting-edge" | Dated cliche -- ironically the opposite of cutting-edge language | "Modern", "Current", or describe the specific innovation |
| "Next-level" | Meaningless intensifier -- what level? | [Quantify]: "2x faster", "50% fewer steps" |
| "Revolutionary" | Almost never true -- reserved for actual revolutions | [Describe what changed]: "The first tool that...", "Eliminates the need for..." |
| "Game-changing" | Almost never true -- and even when true, prove it | [Show the change]: "Replaces 4 tools with 1" |
| "Innovative" (unqualified) | Empty without specifics -- every company claims innovation | [Describe the innovation]: "Patent-pending approach to...", "First to combine..." |
| "Disruptive" | VC-speak that means nothing to end users | [Describe user impact]: "Changes how you work by..." |
| "Robust" | Technical filler -- robust compared to what? | [Specify]: "Handles 10M requests/sec", "Survives node failures" |
| "Scalable" (standalone) | Meaningless without context | [Quantify]: "Scales to 1M users", "Grows from 1 to 1,000 team members" |

#### Discouraged Phrases (Warning + Alternative, Override with Justification)

| Phrase | Context Where Override is OK | Preferred Alternative |
|--------|------------------------------|----------------------|
| "Submit" | Contact forms only (user expects form submission language) | [Action + Object]: "Send Message", "Request Demo", "Place Order" |
| "Get Started" | When truly starting a multi-step onboarding process | More specific: "Create Your First [X]", "Start Building", "Set Up Your Workspace" |
| "Sign Up" | Registration-only flows where account creation is the sole action | "Create Account", "Join [Community Name]", "Start Free Trial" |
| "Buy Now" | Explicit shopping carts with immediate purchase intent | "Add to Cart", "Get [Product Name]", "Order [Item]" |
| "Enter" | Login-only contexts where entering an app is literal | "Open Dashboard", "Go to [Area]", "Launch [App Name]" |
| "Download" | Actual file downloads (PDF, installer, asset) | "Get the [Document Type]", "Download [Specific File Name]" |
| "Welcome to [X]" | Onboarding first-screen only (genuinely welcoming a new user) | Lead with value: "[X] helps you [benefit]", or jump to first action |
| "We are [X]" | About page hero only (where identity introduction is the point) | Lead with what the user cares about: "[What you do] for [who]" |

#### Enforcement Protocol

1. **During brainstorm:** copy-intelligence generates BRAND-VOICE.md with project-specific forbidden words (hard-banned list PLUS project additions)
2. **During section planning:** section-planner checks PLAN.md copy specifications against both lists before finalizing
3. **During build:** builders reference micro-copy skill's banned button text list. Content bank formulas are structurally designed to never produce banned phrases
4. **During review:** quality-reviewer runs final banned-phrase scan across all section output
5. **Hard-banned:** automatic fail -- must be replaced before section passes review
6. **Discouraged:** warning in review -- builder may override with written justification in SUMMARY.md (e.g., "Used 'Submit' because this is a standard contact form where users expect submission language")

### Voice Extraction Protocol

This protocol solves the "write-once-never-read" problem. Brand voice rules get EXTRACTED into each section's PLAN.md so builders actually use them.

#### Extraction Process

During section planning, the section-planner agent reads BRAND-VOICE.md and extracts relevant rules into each section's PLAN.md:

1. **Read BRAND-VOICE.md** -- identify the project's archetype, personality, tone spectrum, vocabulary rules
2. **For each section being planned, extract:**
   - Relevant row from Per-Section Voice Variation table (matching section type)
   - Relevant headline formula from Headline Formula Library (matching beat type)
   - Content density rules for this section type
   - 2-3 relevant formulas/examples from the content bank matrix (matching beat x section cell)
   - Any project-specific vocabulary constraints
3. **Insert extracted rules** into the section PLAN.md under a "## Copy Specification" heading
4. **Builders read the Copy Specification** in their PLAN.md -- they NEVER read BRAND-VOICE.md directly

#### Copy Specification Format (in section PLAN.md)

```markdown
## Copy Specification
**Voice:** [tone position from spectrum, e.g., "Position 4 -- bold, declarative, concise"]
**Personality keywords:** [3-4 adjectives from archetype voice profile]
**Headline formula:** [from content bank -- formula + 2 archetype-matched examples]
**CTA pattern:** [primary + secondary approach for this section]
**Density:** [max text elements, whitespace target from voice document]
**Sentence rules:** [max words per sentence, paragraph length, case style]
**Banned in this section:** [project-specific banned phrases beyond global list]
**Content bank examples:**
- [Formula/example 1 from matching beat x section cell]
- [Formula/example 2]
- [Formula/example 3 if available]
```

This adds approximately 15-20 lines per section PLAN.md -- well within the 300-line spawn prompt budget established in Phase 2.

#### Worked Example: Neo-Corporate HOOK Section

Given: Archetype is Neo-Corporate, section is a Hero with HOOK beat type, project is a developer tool.

Extracted Copy Specification for section PLAN.md:

```markdown
## Copy Specification
**Voice:** Position 4 -- bold, declarative, concise. No softeners or hedging.
**Personality keywords:** precise, confident, modern, clean
**Headline formula:** HOOK-hero: [Emotional claim or outcome vision] in 4-8 words.
  Examples: "Ship at the speed of thought." / "Deploy with confidence."
**CTA pattern:** Primary: outcome-driven verb + object ("Start Building"). Secondary: softer exploration ("See how it works")
**Density:** Max 4 text elements (headline, subline, primary CTA, secondary CTA). 60-70% whitespace.
**Sentence rules:** Max 8 words for headline. Subline max 15 words. Sentence case. Periods for authority.
**Banned in this section:** No "solutions", no "cutting-edge", no "innovative" without specifics
**Content bank examples:**
- "Ship at the speed of thought." (outcome vision, verb-first)
- "Ready to ship?" / [Start Building] / "No credit card required" (CLOSE-CTA pattern for reference)
- Feature style: "Instant deploys" / "Push to main. Live in 8 seconds." (metric-specific)
```

#### Why Builders Never Read BRAND-VOICE.md

1. **Context budget:** BRAND-VOICE.md is 100+ lines. Reading it per section wastes context in every builder spawn prompt
2. **Relevance filtering:** Each section needs only its row from the voice variation table, not the entire document
3. **Enforcement precision:** The Copy Specification is a targeted extraction -- builders cannot misinterpret or cherry-pick from the full document
4. **Single source of truth:** Section-planner extracts once, builders consume. No divergent readings of the same document

### Pipeline Stage

- **Input from:** `/gen:start-project` brainstorm phase -- receives selected archetype, project type, industry, user preferences
- **Output to:** `.planning/genorah/BRAND-VOICE.md` -- comprehensive voice document (100+ lines)
- **Output to:** Section PLAN.md files -- Copy Specification section (15-20 lines per section)
- **Output to:** Quality review checklist -- banned phrase list + voice compliance criteria

### DNA Connection

| DNA Token/Section | Usage in Copy Intelligence |
|-------------------|---------------------------|
| Archetype | Determines voice personality profile, content bank formula selection, boldness tier |
| Signature element | PEAK and HOOK headlines should reference or complement the signature visual element |
| Color tokens (expressive) | Tension and glow tokens can influence copy intensity -- tension sections use bolder language |
| Type scale | Headline word count constraints align with DNA type scale levels (hero = fewer words, h4 = more words) |
| Motion tokens | High-motion sections (PEAK, HOOK) get bolder copy; low-motion sections (BREATHE) get gentler copy |

### Archetype Variants

Copy intelligence behavior varies by archetype boldness tier:

| Boldness Tier | Voice Document Complexity | Content Bank Usage | Banned Phrase Strictness |
|---------------|--------------------------|-------------------|------------------------|
| Conservative | Full document, minimal personality injection | Formulas used literally, minimal modification | Strictest -- no overrides on discouraged phrases |
| Moderate | Full document, balanced personality | Formulas adapted with moderate personality | Standard -- discouraged phrases overridable with justification |
| Bold | Full document, personality-saturated | Formulas heavily modified by archetype character | Relaxed on discouraged -- hard-banned still absolute |

### Related Skills

- **micro-copy** -- Companion skill. copy-intelligence generates the voice system; micro-copy provides per-component TSX patterns for execution
- **design-archetypes** -- Voice profiles extend archetype personalities into copywriting domain. Each archetype's 4 personality adjectives map directly to voice profiles
- **emotional-arc** -- Beat types form one axis of the content bank matrix. Beat energy levels influence copy intensity (HOOK = boldest, BREATHE = gentlest)
- **anti-slop-gate** -- UX Intelligence category (U3: Generic CTA) penalizes "Learn More" / "Submit" / "Click Here". This skill's banned phrase system prevents those from ever being generated

---

## Layer 4: Anti-Patterns

### Anti-Pattern: The Generic Fallback

**What goes wrong:** When pressed for time or uncertain about voice, the builder falls back to "Learn More", "Get Started", and "Our Solutions" -- the exact copy this entire skill exists to prevent. The content bank has hundreds of formulas that produce specific, archetype-appropriate alternatives faster than defaulting to generic copy. The problem is not creativity -- it is reaching for the familiar instead of consulting the formula.
**Instead:** Every content bank formula produces a result faster than inventing "Learn More." The CLOSE-CTA formula (reinforcement headline + urgency sub-line + specific CTA + friction reducer) generates a complete CTA block in seconds. The BUILD-Features formula (specific capability + concrete benefit verb phrase) produces a feature description without ever touching a banned phrase. Use the formulas. They are faster AND better.

### Anti-Pattern: Voice Amnesia

**What goes wrong:** The brand voice document is generated during brainstorm, praised by the creative director, saved to BRAND-VOICE.md... and never referenced again. Section builders revert to Claude's default copywriting tone -- professional, clean, and completely personality-free. Every section sounds the same. The Brutalist project reads like a Neo-Corporate project. The voice document was write-once, never-read.
**Instead:** The voice extraction protocol ensures every PLAN.md has a Copy Specification section with 15-20 lines of extracted voice rules. Builders read the Copy Specification in their PLAN.md -- they cannot build without it. The quality-reviewer validates section copy against the voice document during post-build review. Voice compliance is checked, not assumed.

### Anti-Pattern: One Voice Fits All

**What goes wrong:** Same tone for hero, features, testimonials, and pricing. The hero is "precise and confident." The feature descriptions are "precise and confident." The testimonial framing is "precise and confident." The pricing copy is "precise and confident." The page has zero tonal variation -- it reads like a single paragraph stretched across 8 sections.
**Instead:** The Per-Section Voice Variation table explicitly shifts tone, sentence length, formality, and energy per section type. Hero is boldest and shortest. Features are precise and medium-length. Social proof is warm and varied. CTA is urgent and short. Footer is neutral and professional. Every section has a distinct tonal register, even within the same archetype.

### Anti-Pattern: Archetype-Blind Templates

**What goes wrong:** Content bank formulas produce the same output regardless of archetype. "HOOK-hero: [Bold claim in 6 words]" generates "Accelerate your workflow today" for Brutalist, Ethereal, AND Neo-Corporate projects. The formula is so generic that archetype personality cannot influence it. The content bank becomes a synonym generator, not a voice system.
**Instead:** Every content bank formula includes an archetype modifier explaining how boldness tier changes the output. The HOOK-hero formula for a Brutalist project produces "We make websites." -- three words, zero embellishment. The same formula for Ethereal produces "Find your calm." -- soft vowels, gentle imperative, atmospheric. For Data-Dense: "Real-time, always." -- functional promise, no decoration. The formula is the skeleton; the archetype modifier is the muscle.

### Anti-Pattern: Banned Phrase Whack-a-Mole

**What goes wrong:** "Learn More" appears in a section. Reviewer flags it. Builder replaces it with "Discover More." Reviewer flags "Discover More" as another generic alternative. Builder replaces with "Find Out More." The cycle repeats because the builder is replacing banned phrases one at a time instead of using the content bank formula that would never have produced a banned phrase in the first place.
**Instead:** Content bank formulas are structurally designed to NEVER produce banned phrases. The CLOSE-CTA formula requires a specific action verb + specific object: "Start Building", "Enter the Archive", "Shop the Collection." None of these formulas can produce "Learn More" because the formula demands specificity. Prevention beats detection. If banned phrases keep appearing, the problem is not the review -- it is that the builder is not using the content bank.

---

## Machine-Readable Constraints

Quality reviewers extract values from this table for automated voice compliance checking.

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Brand voice document sections | 8 | 8 | sections | HARD -- all 8 sections required |
| Headline formula count | 5 | 8 | formulas per project | HARD -- minimum 5, maximum 8 |
| Tone spectrum contexts | 8 | 8 | rows | HARD -- all 8 contexts filled |
| Hard-banned phrases | 18 | - | phrases | HARD -- entire list enforced |
| Discouraged phrases | 8 | - | phrases | SOFT -- warning + justification to override |
| Copy Specification in PLAN.md | 15 | 20 | lines | SOFT -- approximate budget |
| Headline max words (hero) | 2 | 8 | words | HARD -- archetype-dependent within range |
| CTA max words (primary) | 2 | 4 | words | HARD -- brevity required |
| Feature description max words | 15 | 30 | words | SOFT -- prefer concise |
| Content density paragraphs per viewport | 1 | 3 | paragraphs | SOFT -- break with visual after 3 |
