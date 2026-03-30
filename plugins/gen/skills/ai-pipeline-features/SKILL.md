---
name: "ai-pipeline-features"
description: "AI features within the Genorah pipeline itself. AI-generated image prompts, copy generation, design suggestions, quality prediction, accessibility audit, competitive analysis."
tier: "domain"
triggers: "ai in pipeline, ai generation, ai suggestion, ai analysis"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

This skill applies when the Genorah pipeline itself uses AI to enhance its output quality. These are NOT user-facing AI features (see `ai-ui-patterns` for those) -- these are AI capabilities embedded within the build pipeline to assist agents and builders.

- **Project needs hero/section imagery** -- AI image prompt generation creates DNA-matched prompts for Midjourney, DALL-E, or Flux during `/gen:start` Phase 3
- **Content planning requires draft copy** -- AI copy generation produces brand-voice-aware text drafts using the archetype voice profile during content planning
- **Creative direction needs specific guidance** -- AI design suggestions during `/gen:discuss` propose concrete recommendations based on DNA + archetype constraints
- **Want to estimate quality before building** -- AI quality prediction during `/gen:build` estimates Anti-Slop Gate scores before implementation begins
- **Accessibility audit needs actionable fixes** -- AI accessibility audit during `/gen:audit` interprets axe-core results and generates specific code fixes
- **Research phase needs competitive intelligence** -- AI competitive analysis during research examines competitor sites for design patterns, content strategies, and gaps

### When NOT to Use

- **Building user-facing AI chat or search** -- Use `ai-ui-patterns` skill. This skill covers pipeline-internal AI, not product AI features
- **Implementing AI SDK components** -- Use `ai-ui-components` skill. This skill describes pipeline features, not component APIs
- **Server-side AI route handlers** -- Use `api-patterns` skill for API implementation details
- **Manual copy writing or editing** -- Use `copy-intelligence` skill directly. This skill covers AI-assisted generation, not the copy guidelines themselves

### Decision Tree

- **Need imagery for a section?** -> Feature 1: AI Image Prompts
- **Need draft copy for content areas?** -> Feature 2: AI Copy Generation
- **Discussing design direction and want AI input?** -> Feature 3: AI Design Suggestions
- **About to build and want score estimate?** -> Feature 4: AI Quality Prediction
- **Running accessibility checks?** -> Feature 5: AI Accessibility Audit
- **Researching competitors?** -> Feature 6: AI Competitive Analysis

### Pipeline Connection

- **Feature 1** referenced by: researcher agent during `/gen:start` Phase 3 (content planning)
- **Feature 2** referenced by: creative director agent during `/gen:start` Phase 3 and `/gen:discuss`
- **Feature 3** referenced by: creative director agent during `/gen:discuss`
- **Feature 4** referenced by: builder agent during `/gen:build` pre-wave assessment
- **Feature 5** referenced by: reviewer agent during `/gen:audit`
- **Feature 6** referenced by: researcher agent during `/gen:start` Phase 1 (research)

---

## Layer 2: Award-Winning Examples

### Code Patterns

#### Feature 1: AI Image Prompts

Generates DNA-matched prompts for image generation tools during `/gen:start` Phase 3 content planning.

**When:** After Design DNA is locked and archetype is selected, before section planning begins.

**What it produces:** Structured prompts for Midjourney, DALL-E, or Flux that encode:
- DNA color palette as color direction (hex values translated to descriptive terms)
- Archetype mood and visual language
- Composition guidance (aspect ratio, focal point, negative space)
- Style modifiers matching the design system

**Prompt template structure:**

```markdown
## Image Prompt: [Section Name] Hero

### For Midjourney/Flux
[Subject description], [composition], [lighting],
[color direction from DNA: "warm amber tones matching #D4A574, deep navy #1B2A4A"],
[archetype mood: "editorial restraint, high-contrast, intentional asymmetry"],
[style modifiers: "editorial photography, 35mm film grain, shallow depth of field"],
[aspect ratio: "--ar 16:9"],
[negative: "--no stock photo, generic, clipart, oversaturated"]

### For DALL-E
[Natural language description incorporating the same DNA color direction,
archetype mood, and composition guidance in paragraph form]

### Composition Notes
- Focal point: [position matching section layout -- left-third for text-right layouts]
- Negative space: [percentage matching emotional arc beat -- Hook needs 30%+ breathing room]
- Color temperature: [warm/cool matching DNA palette dominant temperature]
```

**DNA integration:**
- Translates hex color tokens to descriptive color language (e.g., `#1B2A4A` -> "deep midnight navy")
- Maps archetype visual language to style modifiers (Editorial -> "restrained elegance"; Brutalist -> "raw, unfiltered, high contrast")
- Aligns composition with emotional arc beat (Hook beat = dramatic focal point; Breathe beat = expansive negative space)

**Key considerations:**
- Never use DNA hex values directly in prompts -- translate to natural color descriptions
- Include negative prompts to avoid generic stock imagery
- Match aspect ratio to the section's layout grid (hero full-width = 16:9, sidebar image = 3:4)
- Generate 2-3 prompt variants per image for selection

---

#### Feature 2: AI Copy Generation

Produces brand-voice-aware draft copy during content planning, aligned with the archetype voice profile from `copy-intelligence` skill.

**When:** During `/gen:start` Phase 3 content planning and `/gen:discuss` per-phase deep dives.

**What it produces:**
- Headline variants (3-5 options per section)
- Body copy drafts matching archetype voice
- CTA text options with urgency/benefit framing
- Micro-copy (button labels, form hints, navigation text)

**Voice profile mapping:**

| Archetype | Voice Characteristics | Copy Style |
|-----------|----------------------|------------|
| **Brutalist** | Direct, confrontational, no-nonsense | Short sentences. No fluff. Commands. |
| **Ethereal** | Whispered, poetic, sensory | Flowing phrases with breath and pause... |
| **Editorial** | Authoritative, measured, precise | Well-crafted statements with journalistic clarity |
| **Neo-Corporate** | Professional, clear, trustworthy | Benefit-driven with confident tone |
| **Playful/Startup** | Energetic, conversational, witty | Hey! Let's make something awesome together |
| **Luxury/Fashion** | Exclusive, refined, aspirational | Curated experiences for the discerning |
| **Warm Artisan** | Personal, handcrafted, authentic | We pour our hearts into every detail |
| **AI-Native** | Technical, precise, forward-looking | Powered by intelligence, designed for humans |

**Key considerations:**
- Always pull voice profile from `copy-intelligence` skill constraints
- Generate multiple variants for A/B testing potential
- Flag any generated copy that conflicts with archetype forbidden patterns
- Include placeholder markers `[CLIENT_NAME]`, `[SPECIFIC_STAT]` for client-provided data
- Never finalize AI copy without human review -- mark as DRAFT

---

#### Feature 3: AI Design Suggestions

During `/gen:discuss`, provides specific design recommendations based on DNA + archetype constraints.

**When:** After the user describes what they want for a section/page, before the builder begins implementation.

**What it produces:**
- Specific layout recommendations with rationale
- Component suggestions from the archetype's allowed patterns
- Creative tension opportunities with risk assessment
- Animation/interaction suggestions within motion token budget

**Suggestion format:**

```markdown
## Design Suggestion: [Section Name]

### Layout Recommendation
Based on your [archetype] archetype and the [beat] emotional arc position:
- **Primary layout:** [specific layout] because [archetype rationale]
- **Alternative:** [fallback layout] if [condition]

### Component Suggestions
1. **[Component]** -- [Why it fits this archetype + DNA tokens it uses]
2. **[Component]** -- [Rationale]

### Creative Tension Opportunity
- **Type:** [tension type from creative-tension skill]
- **Implementation:** [specific technique]
- **Risk level:** [low/medium/high] -- [what could go wrong]

### Motion Budget
- Entrance: [animation] at [duration from DNA motion tokens]
- Interaction: [hover/scroll effect] within [DNA motion budget]
- Total motion cost: [X of Y budget used]

### Archetype Compliance Check
- [x] Uses only allowed color tokens
- [x] Typography within scale
- [ ] WARNING: [specific concern if any]
```

**Key considerations:**
- Suggestions must be concrete (specific component names, exact layout descriptions)
- Always include archetype compliance check
- Flag when a suggestion approaches archetype boundaries
- Provide rationale linking back to DNA tokens and archetype rules

---

#### Feature 4: AI Quality Prediction

Pre-build score estimation that predicts Anti-Slop Gate score before implementation starts.

**When:** During `/gen:build` pre-wave assessment, after section PLAN.md is written but before code generation.

**What it produces:**
- Estimated Anti-Slop Gate score (0-35 scale)
- Per-category score predictions (Colors, Typography, Layout, Depth & Polish, Motion, Creative Courage, UX Intelligence)
- Risk flags for categories likely to score low
- Specific recommendations to improve predicted score

**Prediction inputs:**
- Section PLAN.md task list
- Design DNA tokens
- Archetype constraints
- Emotional arc beat assignment
- Creative tension plan (if any)

**Output format:**

```markdown
## Quality Prediction: [Section Name]

### Predicted Score: [X]/35 ([tier name])

| Category | Predicted | Max | Risk |
|----------|-----------|-----|------|
| Colors | X/5 | 5 | [low/med/high] |
| Typography | X/5 | 5 | [low/med/high] |
| Layout | X/5 | 5 | [low/med/high] |
| Depth & Polish | X/5 | 5 | [low/med/high] |
| Motion | X/5 | 5 | [low/med/high] |
| Creative Courage | X/5 | 5 | [low/med/high] |
| UX Intelligence | X/5 | 5 | [low/med/high] |

### Risk Flags
- [Category]: [specific concern] -- [suggested mitigation]

### Score Improvement Opportunities
1. [Specific action] -> estimated +[N] points
2. [Specific action] -> estimated +[N] points
```

**Key considerations:**
- Prediction is advisory only -- never block a build on prediction alone
- Flag when predicted score falls below Pass threshold (25)
- Focus recommendations on highest-impact improvements
- Update prediction accuracy by comparing with actual post-build scores

---

#### Feature 5: AI Accessibility Audit

Interprets axe-core results during `/gen:audit` and generates specific code fixes.

**When:** During `/gen:audit` after automated accessibility testing completes.

**What it produces:**
- Categorized issue list (critical, serious, moderate, minor)
- Specific code fix for each issue (before/after TSX)
- WCAG guideline reference for each fix
- Estimated fix effort (quick/medium/complex)

**Output format:**

```markdown
## Accessibility Audit: [Section Name]

### Summary
- Critical: [N] issues
- Serious: [N] issues
- Moderate: [N] issues
- Total estimated fix time: [X minutes]

### Issue 1: [axe-core rule ID]
**Severity:** Critical
**WCAG:** [guideline reference, e.g., 1.1.1 Non-text Content]
**Element:** `[CSS selector]`
**Fix effort:** Quick

Before:
\`\`\`tsx
<img src={hero.src} className="w-full" />
\`\`\`

After:
\`\`\`tsx
<img src={hero.src} alt={hero.altText} className="w-full" />
\`\`\`

**Rationale:** [Why this fix is needed and how it improves accessibility]
```

**Key considerations:**
- Prioritize critical and serious issues -- these block WCAG AA compliance
- Generated fixes must preserve DNA styling (do not strip className attributes)
- Group related issues (e.g., all missing alt texts together)
- Flag issues that may require design changes vs. code-only fixes

---

#### Feature 6: AI Competitive Analysis

Analyzes competitor sites during the research phase for design patterns, content strategies, and market gaps.

**When:** During `/gen:start` Phase 1 research, after competitor URLs are identified.

**What it produces:**
- Design pattern inventory per competitor (layout types, color usage, typography choices)
- Content strategy analysis (messaging hierarchy, CTA patterns, social proof usage)
- Gap analysis (what competitors miss that this project can exploit)
- Benchmark scores (estimated design quality tier per competitor)

**Output format:**

```markdown
## Competitive Analysis: [Competitor Name]

### Design Patterns
- **Layout:** [primary layout approach -- grid-based, asymmetric, etc.]
- **Color strategy:** [monochrome, complementary, etc.] -- [specific palette notes]
- **Typography:** [font choices, scale usage, hierarchy quality]
- **Motion:** [animation level -- minimal, moderate, heavy]
- **Signature element:** [unique visual element if any]

### Content Strategy
- **Primary message:** [headline-level value proposition]
- **CTA pattern:** [placement, frequency, urgency level]
- **Social proof:** [testimonials, logos, case studies -- how used]
- **Content depth:** [surface-level vs. detailed]

### Estimated Quality Tier
- Design: [X/10]
- Usability: [X/10]
- Creativity: [X/10]
- Content: [X/10]

### Gaps & Opportunities
1. [Gap]: [How this project can exploit it]
2. [Gap]: [Opportunity]
```

**Key considerations:**
- Analyze 3-5 competitors minimum for meaningful patterns
- Focus on gaps that align with the project's archetype strengths
- Note which competitors are award-winning and which are commodity
- Feed gap analysis directly into archetype selection rationale

---

### Reference Sites

- **Vercel v0** (v0.dev) -- AI-powered code generation with real-time preview, excellent prompt-to-output workflow reference
- **Midjourney** (midjourney.com) -- Industry reference for AI image prompt engineering and style control
- **Grammarly** (grammarly.com) -- Best-in-class AI writing assistance with brand voice alignment
- **Lighthouse CI** (web.dev/measure) -- Automated quality scoring with actionable improvement suggestions

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Pipeline Features |
|-----------|--------------------------|
| `bg`, `surface`, `text` | Referenced in image prompt color translation |
| Color palette (all 12 tokens) | Translated to descriptive language for image prompts |
| `display-font`, `body-font` | Mapped to copy voice characteristics |
| Motion tokens | Budget constraint for design suggestions |
| Spacing scale | Layout recommendation constraints |
| `signature` | Must appear in design suggestions and quality prediction |

### Archetype Variants

| Archetype | Pipeline Feature Adaptation |
|-----------|---------------------------|
| **Brutalist** | Image prompts emphasize raw textures, harsh lighting. Copy uses staccato rhythm. |
| **Ethereal** | Image prompts request soft gradients, atmospheric haze. Copy uses flowing cadence. |
| **Editorial** | Image prompts reference editorial photography. Copy uses journalistic precision. |
| **Kinetic** | Design suggestions emphasize motion budget. Quality prediction weights motion higher. |
| **Luxury/Fashion** | Image prompts request aspirational lifestyle imagery. Copy uses exclusive tone. |
| **AI-Native** | All features lean into technical transparency. Quality prediction shows confidence intervals. |

### Pipeline Stage

- **Input from:** Design DNA (locked tokens), archetype selection (behavioral constraints), emotional arc (beat assignments), competitor research URLs
- **Output to:** Section PLAN.md (enriched with AI suggestions), BRAINSTORM.md (competitive analysis), builder agent (quality prediction), reviewer agent (accessibility fixes)

### Related Skills

- **copy-intelligence** -- Voice profiles and copy guidelines that AI Copy Generation must respect. Feature 2 depends on copy-intelligence for brand voice constraints
- **anti-slop-gate** -- Scoring system that Feature 4 (Quality Prediction) estimates. Prediction accuracy measured against actual gate scores
- **accessibility** -- WCAG guidelines that Feature 5 interprets. AI audit augments but does not replace manual accessibility review
- **creative-tension** -- Tension types and rules that Feature 3 (Design Suggestions) references for creative tension opportunities
- **ai-ui-patterns** -- User-facing AI patterns. This skill covers pipeline-internal AI; ai-ui-patterns covers product AI features
- **design-archetypes** -- Archetype definitions that constrain all 6 features

---

## Layer 4: Anti-Patterns

### Anti-Pattern: AI Copy Without Brand Voice Check

**What goes wrong:** Generating copy text without loading the archetype voice profile from `copy-intelligence`. The result is generic, off-brand text that sounds like every other AI-generated website. A Brutalist site gets soft marketing language; an Ethereal site gets aggressive CTAs.
**Instead:** Always load the archetype voice profile before generating copy. Cross-check generated text against the archetype's forbidden copy patterns. Flag any output that sounds "corporate default" -- if it could appear on any website, it is not brand-voiced enough.

### Anti-Pattern: AI Suggestions That Violate Archetype Constraints

**What goes wrong:** Design suggestions recommend patterns that are explicitly forbidden by the selected archetype. For example, suggesting rounded glassmorphism cards for a Brutalist project, or heavy animations for a Japanese Minimal build.
**Instead:** Load archetype constraints (mandatory techniques, forbidden patterns) before generating suggestions. Every suggestion must pass an archetype compliance check. If a suggestion intentionally breaks a rule, it must use the creative tension escape hatch with documented rationale.

### Anti-Pattern: Image Prompts With Raw Hex Values

**What goes wrong:** Including DNA hex values directly in image prompts (`#1B2A4A background`). Image generation models do not reliably interpret hex codes, producing unpredictable color results.
**Instead:** Translate hex values to descriptive color language: `#1B2A4A` becomes "deep midnight navy." Use color relationships: "warm amber tones contrasting with cool navy depths." Include mood descriptors that guide the overall palette direction.

### Anti-Pattern: Quality Prediction as Build Gate

**What goes wrong:** Using the AI quality prediction score to block builds or auto-reject implementations. Prediction accuracy is not 100% -- false negatives block good work, false positives allow bad work through.
**Instead:** Quality prediction is advisory only. Use it to focus builder attention on high-risk areas. The actual Anti-Slop Gate during `/gen:audit` remains the authoritative quality check. Track prediction vs. actual scores to improve prediction accuracy over time.

### Anti-Pattern: Accessibility Fixes That Strip DNA Styling

**What goes wrong:** AI-generated accessibility fixes remove className attributes or override DNA tokens to achieve compliance. The fix breaks the design system while solving the accessibility issue.
**Instead:** Generated fixes must preserve all existing DNA-token classNames. Add accessibility attributes (aria-*, alt, role) alongside existing styling. If a fix requires visual changes (e.g., contrast ratio), adjust within the DNA token system rather than introducing hardcoded values.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Image prompt variants per section | 2 | 3 | prompts | SOFT -- warn if only 1 variant |
| Copy headline variants per section | 3 | 5 | options | SOFT -- warn if fewer than 3 |
| Quality prediction threshold warning | 25 | 35 | score | HARD -- warn if predicted below 25 |
| Competitors analyzed | 3 | 8 | sites | SOFT -- warn if fewer than 3 |
| Accessibility fix code preservation | 100 | 100 | % DNA classes | HARD -- reject if DNA classes removed |
