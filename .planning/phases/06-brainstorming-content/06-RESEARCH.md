# Phase 6: Brainstorming & Content - Research

**Researched:** 2026-02-24
**Domain:** Research-first creative ideation methodology, cross-pollination techniques, copy intelligence systems, all expressed as markdown skill files for a Claude Code plugin
**Confidence:** HIGH

## Summary

Phase 6 creates 3-4 new/rewritten skill files (SKILL.md) that transform the brainstorming and content creation process from the current "pick an archetype and generate colors" approach (existing `design-brainstorm` at 141 lines) into a research-first creative direction engine backed by a full copy intelligence system. The deliverables are purely markdown knowledge documents -- no application code, no build systems, no tests.

The existing codebase provides strong foundations: `design-archetypes` (911 lines, 16 archetypes), `micro-copy` (234 lines, button/headline patterns), `design-dna` (306 lines, DNA format), `emotional-arc` (478 lines, beat system), and `creative-tension` (268 lines, controlled rule-breaking). The current `design-brainstorm` skill is a lightweight framework that needs to be replaced with a comprehensive research-first methodology. The current `micro-copy` skill needs to be absorbed into a larger Copy Intelligence Engine that adds brand voice generation, content banks, and tiered banned-phrase enforcement.

The key insight from studying the existing codebase: the most effective skills in this plugin are prescriptive constraint systems (archetypes skill at 911 lines is the gold standard -- locked palettes, mandatory techniques, forbidden patterns). The new brainstorming and content skills should follow this pattern: not advisory prose but enforceable decision trees with curated reference libraries, structured outputs, and validation rules.

**Primary recommendation:** Build four skills: (1) a research-first brainstorming protocol with curated industry reference library and competitive teardown framework, (2) a cross-pollination and constraint-breaking system with industry-specific rule catalogs, (3) a creative direction presentation format with ASCII mockup templates and distinctness validation, and (4) a Copy Intelligence Engine that generates brand voice documents, content banks, and tiered copy enforcement. Each skill follows the 4-layer format (Decision Guidance, Award-Winning Examples, Integration Context, Anti-Patterns) established in Phase 1.

## Standard Stack

This phase produces markdown SKILL.md files only. There is no application code. The "stack" is the skill file format itself.

### Core
| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| Claude Code Plugin System | Current (2026) | Skill auto-discovery | Official Anthropic platform |
| Markdown (SKILL.md) | N/A | Knowledge base format | Plugin system reads `skills/{name}/SKILL.md` |
| YAML frontmatter | N/A | Skill metadata | Required for name/description/triggers |
| 4-layer skill format | Modulo 2.0 | Skill structure standard | Established in Phase 1 |

### Skill File Format Reference

**Confidence: HIGH** -- Verified from reading 8+ existing skills in the codebase.

Each skill follows this structure:
```markdown
---
name: skill-name
description: "Brief description"
---

[Trigger sentence explaining when this skill activates]

[Role definition -- "You are a..."]

## [Section 1: Decision Guidance]
## [Section 2: Award-Winning Examples]
## [Section 3: Integration Context]
## [Section 4: Anti-Patterns]
```

**Key metrics from existing skills:**
- Shortest relevant skill: `design-brainstorm` at 141 lines (too thin -- being replaced)
- Longest relevant skill: `design-archetypes` at 911 lines (comprehensive, the model to follow)
- Typical range for complex skills: 250-600 lines
- The target for Phase 6 skills: 400-800 lines each (these are complex, multi-faceted skills)

### Files to Create/Modify

| File | Action | Estimated Size |
|------|--------|----------------|
| `skills/design-brainstorm/SKILL.md` | **Rewrite entirely** | ~600-800 lines |
| `skills/cross-pollination/SKILL.md` | **New skill** | ~400-500 lines |
| `skills/creative-direction-format/SKILL.md` | **New skill** | ~500-600 lines |
| `skills/copy-intelligence/SKILL.md` | **New skill** | ~600-800 lines |
| `skills/micro-copy/SKILL.md` | **Absorb into copy-intelligence OR keep as focused companion** | See Architecture section |

## Architecture Patterns

### How the Four Skills Interconnect

```
design-brainstorm (rewritten)
  ├── References: cross-pollination (for industry borrowing)
  ├── References: creative-direction-format (for output format)
  ├── References: design-archetypes (for archetype selection)
  ├── References: awwwards-scoring (for competitive benchmark)
  └── Produces: BRAINSTORM.md artifact

cross-pollination
  ├── Referenced BY: design-brainstorm (during ideation)
  ├── References: design-archetypes (archetype compatibility check)
  └── Produces: Rule + break + rationale items per direction

creative-direction-format
  ├── Referenced BY: design-brainstorm (for presentation format)
  ├── References: emotional-arc (for arc suggestion per direction)
  ├── References: creative-tension (for tension preview per direction)
  └── Produces: 3 creative direction concept boards with ASCII mockups

copy-intelligence
  ├── Referenced BY: start-design command (Phase 3.75 content planning)
  ├── References: design-archetypes (for voice personality per archetype)
  ├── References: emotional-arc (for beat x section content bank)
  ├── Absorbs/replaces: micro-copy (headline/CTA patterns become part of content bank)
  └── Produces: BRAND-VOICE.md + content bank + banned-phrase enforcement
```

### Recommended Skill Organization

**Confidence: HIGH** -- Based on analysis of all 87 existing skills and the 4-layer format.

**Decision: Keep micro-copy as a focused companion to copy-intelligence.**

Rationale: `micro-copy` (234 lines) contains excellent button/CTA/error-state patterns that section builders reference directly during execution. `copy-intelligence` is a brainstorm-phase skill that generates voice documents and content banks. They serve different moments in the pipeline:
- `copy-intelligence` is used during brainstorm/planning (Phase 3/3.75 of start-design)
- `micro-copy` is used during execution (builders reference it when writing component copy)

Merging them would create a 1000+ line skill that's referenced in two different pipeline stages. Better to keep them separate with `copy-intelligence` being the generator and `micro-copy` being the per-component enforcement reference.

### Curated Reference Library Structure

**Context decision:** Curated + live hybrid approach. The skill contains a curated library, supplemented by live web search.

**Recommended organization: By industry vertical, not by archetype.**

Rationale: Industry is the primary research axis (user says "I'm building a SaaS product" not "I want Neo-Corporate style"). Archetypes are selected AFTER research, based on what the research reveals. Organizing by industry allows:
1. Quick lookup of 6-10 reference sites per industry
2. Industry-specific "rules" catalog (for constraint-breaking)
3. Cross-pollination mappings (which distant industries pair well)

```markdown
## Industry Reference Library

### SaaS / Developer Tools
**Exemplary sites:** Linear, Vercel, Raycast, Supabase, Railway, Clerk
**Common visual patterns:** Dark mode dashboard aesthetic, glass cards, dot/grid backgrounds, monospace accents
**Content patterns:** Feature-first headlines, "trusted by X teams" social proof, developer-tone CTAs
**Industry rules (for breaking):**
1. Hero must show product screenshot
2. Dark mode by default
3. Feature grid as primary content structure
4. Metric-heavy social proof
**Cross-pollination suggestions:** Fashion editorial (for typography drama), Architecture (for spatial thinking)

### E-commerce / Fashion
[similar structure]

### Agency / Creative Portfolio
[similar structure]
...
```

**Number of industries to cover:** 10-12 verticals (matching the archetype selection guide categories in design-archetypes skill). Each with 5-8 exemplary sites, 4-6 industry rules, and 2-3 cross-pollination pairings.

### Competitive Teardown Framework

**Context decision:** Full competitive teardown per reference: visual patterns + content strategy + UX flow analysis.

The teardown structure should parallel the existing reference analysis format in `start-design.md` (lines 98-150) but with additional content strategy and UX flow dimensions:

```markdown
## Competitive Teardown Template

### Visual Patterns
- Color approach and palette character
- Typography choices and hierarchy
- Layout structure and grid-breaking moments
- Depth and polish techniques
- Motion intensity and signature

### Content Strategy
- Headline style and emotional register
- CTA philosophy (aggressive vs. subtle)
- Social proof placement and specificity
- Narrative arc (story vs. feature list)
- Voice personality (formal vs. casual, technical vs. friendly)

### UX Flow Analysis
- Attention guidance (where does the eye go first?)
- Conversion funnel (steps to primary action)
- Information hierarchy (what's emphasized vs. buried)
- Scroll behavior (how much content, what pace)
- Mobile strategy (simplified vs. adapted vs. different)
```

### ASCII Mockup Format

**Context decision:** Full ASCII hero mockup + sample section mockup per direction.

ASCII mockups serve as structural blueprints that communicate layout without getting into visual polish details. The format should be standardized:

```
+--------------------------------------------------+
|  [LOGO]           [NAV LINKS]       [CTA BUTTON]  |
+--------------------------------------------------+
|                                                    |
|        ██████████████████████                      |
|        ██ HERO HEADLINE ████                       |
|        ██████████████████████                      |
|                                                    |
|   Supporting text goes here, max 2 lines           |
|   describing the product benefit.                  |
|                                                    |
|   [ PRIMARY CTA ]    [ Secondary Link → ]          |
|                                                    |
|              [PRODUCT SCREENSHOT]                   |
|             /  tilted at 8deg   \                  |
|            /                     \                 |
|                                                    |
+--------------------------------------------------+
```

Key conventions:
- `+----+` for section boundaries
- `██` blocks for visual weight/emphasis
- `[ TEXT ]` for buttons/CTAs
- `( element )` for decorative/background elements
- Annotations for special treatments (tilt, glow, animation)
- Width: ~50-60 characters (fits in skill markdown without wrapping)

### Content Bank Matrix Structure

**Context decision:** Beat x section matrix, ~5-8 options per cell. Claude's discretion on generation approach.

**Recommendation: Template-based on-demand generation, not pre-generated.**

Rationale: Pre-generating all cells (10 beats x ~8 section types x ~6 options = 480 copy variations) would create an enormous skill file. Instead, the skill should provide:
1. **Template formulas** per cell (e.g., "HOOK-hero headline formula: [Bold claim] + [outcome vision] in ≤8 words")
2. **3 worked examples** per high-frequency cell (HOOK-hero, BUILD-features, PROOF-testimonial, CLOSE-cta)
3. **Generation instructions** for low-frequency cells (builders generate on-demand using the formula)

This keeps the skill at a manageable 600-800 lines while covering all matrix positions.

```markdown
## Content Bank Matrix

| Beat \ Section | Hero | Features | Testimonial | CTA | Pricing | About |
|----------------|------|----------|-------------|-----|---------|-------|
| HOOK | ★★★ | - | - | - | - | - |
| TEASE | ★★ | ★ | - | - | - | - |
| REVEAL | ★★ | ★★★ | - | ★ | ★★ | - |
| BUILD | - | ★★★ | ★ | ★ | ★★★ | ★★ |
| PEAK | ★★ | ★★ | - | ★★ | - | - |
| BREATHE | ★ | - | ★★ | - | - | ★★ |
| TENSION | - | ★★ | - | - | - | - |
| PROOF | - | - | ★★★ | ★★ | ★ | - |
| PIVOT | ★★ | - | - | ★★ | - | ★★★ |
| CLOSE | - | - | - | ★★★ | ★★ | - |

★★★ = Full template + 5-8 examples
★★ = Template + 3 examples
★ = Template only (generate on demand)
- = Invalid/rare combination (skip)
```

### Brand Voice Document Format

**Context decision:** Comprehensive ~100+ lines including tone spectrum, vocabulary, sentence patterns, per-section variation, content density rules, reading level, CTA philosophy, headline formula library.

The voice document should be generated per-project during brainstorm and saved alongside BRAINSTORM.md. Structure:

```markdown
# Brand Voice: [Project Name]

## Voice Identity
Archetype: [name]
Personality: [4 adjectives]
Voice summary: [2-3 sentences]

## Tone Spectrum
| Context | Tone Position | Example |
|---------|--------------|---------|
| Hero headline | Bold, declarative | "Ship at the speed of thought." |
| Feature description | Precise, confident | "Real-time collaboration across..." |
| CTA | Urgent but not pushy | "Start building free" |
| Error state | Human, helpful | "Something went wrong — try again" |
| Testimonial frame | Warm, authentic | "What our customers say" |

## Vocabulary Rules
- Preferred words: [list]
- Forbidden words: [list]
- Technical level: [scale 1-5]
- Jargon policy: [when to use, when to avoid]

## Sentence Patterns
- Headlines: [max words], [case style], [punctuation]
- Body: [sentence length range], [paragraph length]
- CTAs: [verb-first pattern], [word count]
- Labels: [case, tracking, word count]

## Per-Section Voice Variation
| Section Type | Tone Shift | Sentence Length | Formality |
|-------------|-----------|-----------------|-----------|
| Hero | Most bold | Shortest | Least formal |
| Features | Precise | Medium | More formal |
| Testimonials | Warm | Varies (quotes) | Casual |
| CTA | Urgent | Short | Direct |
| Footer | Neutral | Short | Professional |

## Content Density Rules
- Hero: max [N] elements, [X]% whitespace
- Feature section: max [N] features visible
- Reading level target: [grade level]

## Headline Formula Library
[5-8 headline templates for this project's voice]

## CTA Philosophy
[When to be direct vs. soft, primary vs. secondary hierarchy]
```

### Tiered Banned Phrase System

**Context decision:** Hard-banned vs. discouraged, with nuance for context.

```markdown
## Hard-Banned Phrases (NEVER appear in any output)
| Phrase | Why Banned |
|--------|-----------|
| "Click Here" | Non-descriptive, accessibility hostile |
| "Learn More" | Vague, says nothing about destination |
| "Solutions" (as noun) | Corporate emptiness, means nothing |
| "Leverage" (as verb) | Jargon, pretentious |
| "Synergy" | Meaningless corporate speak |
| "Unlock" | Overused AI-slop term |
| "Seamless" | Overused, means nothing specific |
| "Empower" | Patronizing |
| "World-class" | Empty superlative |
| "Best-in-class" | Empty superlative |
| "Cutting-edge" | Dated cliche |
| "Next-level" | Meaningless |
| "Revolutionary" | Almost never true |
| "Game-changing" | Almost never true |

## Discouraged Phrases (warning + alternative, override with justification)
| Phrase | Context Where OK | Preferred Alternative |
|--------|-----------------|----------------------|
| "Submit" | Contact forms only | "[Action] + [Object]" e.g., "Send Message" |
| "Get Started" | When truly starting something | More specific: "Create Your First [X]" |
| "Sign Up" | Registration-only flows | "Start Building Free", "Create Account" |
| "Buy Now" | Only in explicit shopping carts | "Add to Cart", "Get [Product Name]" |
| "Enter" | Login-only contexts | "Open Dashboard", "Go to [Area]" |
| "Download" | Actual file downloads | "Get the [Document Type]" |
```

### Distinctness Validation for Creative Directions

**Context decision:** Directions must differ on at least 3 of: archetype, color mood, motion style, tension level, typography voice.

The skill should include a validation matrix:

```markdown
## Distinctness Validation

After generating 3 directions, fill this matrix:

| Dimension | Direction A | Direction B | Direction C | All Different? |
|-----------|-------------|-------------|-------------|----------------|
| Archetype | [name] | [name] | [name] | ✓/✗ |
| Color Mood | [warm/cool/neutral] | | | ✓/✗ |
| Motion Style | [kinetic/subtle/static] | | | ✓/✗ |
| Tension Level | [conservative/moderate/bold] | | | ✓/✗ |
| Typography Voice | [serif/sans/mono/mixed] | | | ✓/✗ |
| Layout Philosophy | [cinematic/dense/bento/minimal/immersive] | | | ✓/✗ |

**Pass criteria:** At least 3 dimensions marked ✓ (all different across directions)
**Fail:** Regenerate the most similar direction with a deliberate shift on 2+ dimensions
```

## Don't Hand-Roll

Problems that look simple but have existing solutions or patterns in the codebase:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Archetype-specific voice personality | Custom personality framework per archetype | Extend existing `micro-copy` skill's "Tone by Archetype" table (line 216-234) | 16 archetype voices already partially defined |
| Headline templates per beat | New headline system | Extend existing `micro-copy` skill's "Headline Templates Per Beat Type" (lines 12-49) | Beat-specific patterns already exist |
| Competitive benchmark process | New benchmark framework | Reference existing `awwwards-scoring` skill's "Competitive Benchmark Process" section | Full benchmark methodology already documented |
| Reference analysis format | New teardown template | Extend existing `start-design` command's reference analysis template (lines 98-150) | 7-dimension analysis framework already defined |
| Beat sequence validation | New validation rules | Reference existing `emotional-arc` skill's "Sequence Rules" (lines 286-306) | Valid/invalid sequences already codified |
| Cross-pollination coherence check | New compatibility system | Reference existing archetype constraint system | Forbidden patterns already define what's incompatible |

**Key insight:** The brainstorming and content skills are EXTENSIONS of the existing identity system, not replacements. They should reference existing skills heavily and add the research/cross-pollination/content-bank layers on top.

## Common Pitfalls

### Pitfall 1: Skills Becoming Advisory Prose Instead of Enforceable Constraints
**What goes wrong:** Skills read like blog posts ("consider doing X") instead of constraint systems ("MUST do X, validation: check Y")
**Why it happens:** Natural tendency to write informational content rather than decision-guiding structure
**How to avoid:** Every skill section should end with a validation rule or checklist. Follow the `design-archetypes` pattern: locked palettes (not suggested), required techniques (not recommended), forbidden patterns (not discouraged).
**Warning signs:** Words like "consider", "you might want to", "it's a good idea to" instead of "MUST", "REQUIRED", "FORBIDDEN"

### Pitfall 2: Curated Reference Library Becoming Stale
**What goes wrong:** Hard-coded reference sites go offline, redesign, or become outdated
**Why it happens:** Specific URLs and site names are frozen in time in a markdown file
**How to avoid:** Focus on PATTERNS observed rather than specific URLs. Structure as: "Site X demonstrates [pattern]: [description of what they do]." If the site changes, the pattern description remains useful. Include the site name for searchability but describe the pattern independently.
**Warning signs:** References that say "visit X" instead of "X demonstrates [pattern]: [description]"

### Pitfall 3: Content Bank Matrix Being Too Generic
**What goes wrong:** Template headlines are so formulaic they produce "Learn More"-level blandness
**Why it happens:** Templates optimize for coverage (every cell filled) over quality (each output distinctive)
**How to avoid:** Every template should include archetype modifiers. A HOOK headline formula for Brutalist ("We make websites.") is fundamentally different from Ethereal ("Find your calm."). The matrix must be archetype-aware, not one-size-fits-all.
**Warning signs:** Templates that don't reference the current project's archetype/voice

### Pitfall 4: Cross-Pollination Being Surface-Level
**What goes wrong:** "Borrow from fashion" becomes "use serif fonts" instead of deeply understanding fashion's editorial pacing, negative space philosophy, or image-first information hierarchy
**Why it happens:** Easy to map superficial visual traits instead of underlying design principles
**How to avoid:** Structure cross-pollination as "Design principle borrowed: [principle]. How it manifests: [visual/structural implementation]. DNA compatibility: [how it maps to tokens]." Force the principle level, not just the visual level.
**Warning signs:** Cross-pollination suggestions that can be described in one word ("serifs", "dark mode", "animations")

### Pitfall 5: ASCII Mockups Being Too Abstract
**What goes wrong:** ASCII mockups become vague boxes that don't communicate actual layout intent
**Why it happens:** ASCII art is inherently limited in fidelity
**How to avoid:** Standardize a symbol vocabulary (see Architecture Patterns section). Include annotations for every non-obvious element. Show both desktop AND a simplified mobile representation. Include element sizing annotations (e.g., "text-8xl", "py-40").
**Warning signs:** Mockups with unlabeled boxes or no sizing annotations

### Pitfall 6: Brand Voice Documents Being Write-Once, Never-Read
**What goes wrong:** 100+ line voice document gets generated but builders don't reference it
**Why it happens:** Voice document is separate from PLAN.md files that builders actually read
**How to avoid:** The copy-intelligence skill should define how voice rules get extracted INTO each section's PLAN.md during plan-sections. The full document lives in `.planning/modulo/BRAND-VOICE.md`, but relevant excerpts go into each plan's "Exact Copy" section. Design-lead extracts voice rules into spawn prompts (per Phase 2 architecture: spawn prompt budget ~300 lines).
**Warning signs:** Voice document exists but PLAN.md files don't reference it

## Code Examples

N/A -- This phase produces markdown skill files, not application code. However, the skills will contain TSX code examples that builders reference. The key code patterns are already documented in existing skills:

### Existing Code Patterns to Reference (Not Duplicate)

| Pattern | Existing Location | How Phase 6 Skills Reference |
|---------|-------------------|-------------------------------|
| CTA button TSX patterns | `micro-copy` skill, lines 60-112 | `copy-intelligence` references for button copy rules |
| Headline per beat type | `micro-copy` skill, lines 12-49 | Content bank matrix uses same beat types |
| Archetype voice table | `micro-copy` skill, lines 216-234 | `copy-intelligence` extends with full voice personality |
| Direction presentation format | `design-brainstorm` skill, lines 104-131 | `creative-direction-format` replaces with enhanced format |
| Reference analysis template | `start-design` command, lines 98-150 | `design-brainstorm` references for teardown structure |
| Competitive benchmark | `awwwards-scoring` skill, competitive section | `design-brainstorm` references during research phase |

### New Content Patterns to Create

These are content structures that don't exist yet and must be authored in Phase 6:

1. **Industry reference library entries** (~10-12 industries, 5-8 exemplary sites each)
2. **Industry rules catalog** (4-6 conventions per industry, structured for breaking)
3. **Cross-pollination pairing matrix** (which industries pair well and why)
4. **ASCII mockup template library** (3-5 canonical layout templates in ASCII)
5. **Brand voice document template** (full ~100 line template with archetype modifiers)
6. **Content bank formula templates** (per high-frequency beat x section cell)
7. **Banned/discouraged phrase master list** (tiered enforcement with alternatives)
8. **Archetype voice personality profiles** (extending the existing 1-line tone table to full profiles)

## State of the Art

| Old Approach (v6.1.0) | New Approach (v2.0) | Impact |
|------------------------|---------------------|--------|
| Present 2-3 archetypes, user picks one | Research industry first, present 3 full creative directions with research-backed rationale | Directions grounded in competitive landscape, not arbitrary |
| Color palette brainstorm from mood categories | Industry-specific reference analysis leading to palette informed by competitive positioning | Colors serve strategic purpose, not just aesthetic |
| No content planning before build | Brand voice document + content bank generated before section planning | Copy quality matches design quality |
| "Banned" button text as a short list | Tiered hard-banned + discouraged system with contextual override | Nuanced enforcement that doesn't over-restrict |
| Single "Tone by Archetype" table | Full voice personality per archetype with contextual variation | Copy personality as rich as visual personality |
| Brainstorm from blank slate | Research 6-10 reference sites including outside-industry | Creative directions informed by real-world competitive landscape |
| No cross-pollination concept | Deliberate distant-industry borrowing with coherence guardrails | Unexpected visual language as a systematic methodology |
| No constraint-breaking methodology | Structured "Rule + break + rationale" with individual approval | Controlled innovation rather than accidental conformity |

## Open Questions

### 1. How to handle the micro-copy skill relationship
**What we know:** CONTEXT.md says copy-intelligence should be comprehensive. Existing micro-copy (234 lines) has excellent per-component copy patterns. Both serve the plugin but at different pipeline stages.
**What's unclear:** Whether to keep both skills or merge them. The 4-layer skill format from Phase 1 may influence this.
**Recommendation:** Keep both. `copy-intelligence` is a brainstorm-phase generator (produces BRAND-VOICE.md). `micro-copy` is an execution-phase enforcer (builders reference it per-component). If Phase 1's skill architecture mandates merging overlapping skills, they could share a directory but remain conceptually separate sections.

### 2. How many industry verticals to curate
**What we know:** The archetype selection guide in `design-archetypes` covers ~14 project types. The CONTEXT decision says 6-10 reference sites per brainstorm.
**What's unclear:** Whether the curated library should cover all 14 project types or focus on the most common 8-10.
**Recommendation:** Cover 12 verticals (SaaS/DevTools, E-commerce/Fashion, E-commerce/General, Creative Agency, Portfolio, Blog/Publication, Health/Wellness, Food/Beverage, Fintech/Dashboard, Architecture/Design, Education/Social, Gaming/Entertainment). Each with 6-8 reference sites described as patterns, not just URLs. This matches the archetype selection guide breadth.

### 3. Size management for comprehensive skills
**What we know:** The most complex existing skill (design-archetypes) is 911 lines. CONTEXT decisions call for comprehensive content in copy-intelligence (~100+ line voice documents, content bank matrix, banned phrases, archetype voice profiles).
**What's unclear:** Whether a single copy-intelligence skill can fit under ~800 lines while being comprehensive.
**Recommendation:** Target 700-800 lines. Use the archetype voice profiles efficiently -- a table format (like the existing Tone by Archetype table) with 3-4 attributes per archetype instead of a full paragraph per archetype. Content bank uses formula templates, not exhaustive examples. This should fit.

### 4. Integration with start-design command
**What we know:** `start-design.md` currently defines Phases 1-3 of the workflow. The new brainstorming skills change what happens in Phase 3 (and add Phase 3.75 for content).
**What's unclear:** Whether Phase 6 plans should also modify `start-design.md` or if that's deferred to a command-system phase.
**Recommendation:** Phase 6 plans should ONLY create/modify skill files. The `start-design.md` command already references `design-brainstorm` and `micro-copy` -- when those skills are rewritten, the command naturally picks up the new behavior. No command file changes needed in Phase 6.

## Sources

### Primary (HIGH confidence)
- Existing skill files in `D:/Modulo/Plugins/v0-ahh-skill/skills/` -- direct codebase analysis of 8 relevant skills (design-brainstorm, micro-copy, design-archetypes, creative-tension, design-dna, emotional-arc, conversion-patterns, creative-sections)
- Existing command/agent files -- `start-design.md`, `plan-sections.md`, `design-researcher.md` analyzed for workflow integration
- Phase CONTEXT.md at `.planning/phases/06-brainstorming-content/06-CONTEXT.md` -- user decisions
- ROADMAP.md and STATE.md -- phase dependencies and project decisions

### Secondary (MEDIUM confidence)
- WebSearch: Awwwards design trends 2025-2026 -- verified patterns align with existing skill content
- WebSearch: Cross-pollination design methodology -- general principles confirmed in multiple sources
- WebSearch: Brand voice document structure -- framework patterns consistent across UX writing sources
- WebSearch: ASCII mockup prototyping -- tools and approaches verified (Mockdown, AsciiFlow, ASCII-driven development)

### Tertiary (LOW confidence)
- WebSearch: Industry-specific design conventions -- broad patterns only, specific "rules to break" per industry will need creative authoring based on general knowledge
- WebSearch: Banned UX copy phrases -- no authoritative single source found; the banned phrase list will be curated based on established UX writing best practices

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- plugin skill format is well-established, 87 existing examples to follow
- Architecture: HIGH -- skill interconnections clear from existing codebase analysis, integration points identified
- Pitfalls: HIGH -- identified from patterns in existing skills (advisory prose vs. constraints is a known issue from Phase 1 research)
- Content structure: MEDIUM -- specific curated content (industry references, cross-pollination pairings) requires creative authoring beyond what research can fully verify
- Integration with pipeline: HIGH -- Phase 2 architecture (build-orchestrator as only spawner, ~300 line spawn prompts) well-documented in STATE.md

**Research date:** 2026-02-24
**Valid until:** 2026-03-24 (stable -- this phase produces markdown content, not code dependent on library versions)
