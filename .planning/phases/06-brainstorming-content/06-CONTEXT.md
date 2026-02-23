# Phase 6: Brainstorming & Content - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Research-first creative ideation engine and copy intelligence system. Delivers two interconnected capabilities: (1) a brainstorming methodology that produces genuinely creative design directions grounded in real-world research and cross-industry pollination, and (2) a content intelligence engine that generates brand-appropriate copy with archetype-aware voice. Creating the actual design (DNA, sections, plans) happens in other phases -- this phase produces the creative input and content toolkit that feeds them.

</domain>

<decisions>
## Implementation Decisions

### Research methodology
- Curated + live hybrid approach: skill contains a curated library of award-winning patterns/references by industry, supplemented by live web search when available (works offline too)
- 6-10 reference sites analyzed per brainstorm session (broad survey)
- Full competitive teardown per reference: visual patterns + content strategy + UX flow analysis (attention guidance, conversion tactics, information hierarchy)
- Research includes 2-3 outside-industry references alongside industry-specific ones (cross-pollination starts during research, not as a separate afterthought)

### Creative direction format
- 3 creative directions produced per brainstorm
- Full concept board per direction: archetype + mood + visual traits + full ASCII hero mockup + motion identity + typography pairing + sample headline in voice + competitive benchmark comparison ("like X meets Y") + tension plan preview + emotional arc suggestion + sample section mockup
- Distinctness requirement: full spectrum spread -- directions must differ on at least 3 of: archetype, color mood, motion style, tension level, typography voice
- Free mixing allowed: user can cherry-pick any element from any direction, Claude synthesizes a coherent whole from the picks

### Cross-pollination & rule-breaking
- Deliberately distant industry borrowing (SaaS -> fashion editorial, fintech -> gaming). Force unexpected visual language, not safe adjacent-industry patterns
- Number of constraint breaks per brainstorm: Claude decides based on archetype boldness (conservative archetypes = 1 break, bold archetypes = 2-3)
- Breaks communicated as structured "Rule + break + rationale" format: "Industry rule: [convention]. We break this by: [alternative]. Why: [rationale]." Clear, easy to approve/reject individually
- Individual break approval: user can reject specific constraint breaks from a direction they otherwise like -- direction adapts
- Double coherence guardrail: every borrowed element and every break must be expressible in the project's Design DNA tokens AND compatible with the chosen archetype's personality. If either gate fails, it's too foreign

### Copy intelligence behavior
- Brand voice document is comprehensive: voice + content strategy (~100+ lines) including tone spectrum, vocabulary preferences, sentence structure patterns, per-section voice variation (hero = bold, features = precise, testimonials = warm), content density rules, reading level target, CTA philosophy, headline formula library
- Content bank organized as beat x section matrix: cross-referenced by emotional arc beat AND section purpose (e.g., what kind of headline for a Hook-hero vs a Reveal-features section). ~5-8 options per cell
- Tiered banned-phrase enforcement: hard-banned phrases (never appear in output) vs discouraged phrases (warning + suggested alternative, builder can override with justification). Allows nuance -- "Submit" in a contact form might be acceptable, "Click Here" never is
- Full voice personality per archetype with contextual variation: each archetype gets a distinct copywriting personality (vocabulary, sentence length, punctuation style, humor level, formality spectrum) PLUS rules for how the voice shifts by context (CTA = more urgent, description = more measured, error state = more human)

### Claude's Discretion
- Exact structure of the curated reference library (how to organize by industry/archetype)
- Content bank generation approach (pre-generate all cells vs generate on-demand during planning)
- How to handle projects that span multiple industries
- Banned vs discouraged phrase list curation

</decisions>

<specifics>
## Specific Ideas

- Research should feel like a creative director studying the competitive landscape, not a search engine scraping links
- Directions should be genuinely distinct -- not "the same thing in 3 color palettes"
- Cross-pollination from distant industries is the key differentiator vs generic AI design tools
- The copy engine should make it impossible to accidentally produce "Learn More" / "Get Started" / "Click Here" generic copy

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 06-brainstorming-content*
*Context gathered: 2026-02-24*
