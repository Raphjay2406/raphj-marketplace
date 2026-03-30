# Phase 1: Foundation - Context

**Gathered:** 2026-02-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Core identity system, skill architecture, and plugin skeleton. Delivers: Design DNA skill, Archetypes skill (16+ with expansion), Anti-Slop Gate skill (35-point enforcement), Emotional Arc skill (10 beats with hard constraints), skill directory with 3-tier structure and 4-layer format, plugin skeleton with CLAUDE.md. Every downstream phase references these definitions.

</domain>

<decisions>
## Implementation Decisions

### Archetype set & personality
- Expand beyond the current 16 archetypes (add Dark Academia, AI-Native, and others that fill gaps)
- Hard rules with escape hatch: mandatory fonts, color ranges, forbidden patterns are enforced, but a "tension override" lets builders intentionally break ONE rule with documented rationale
- Per-archetype tension zones: each archetype defines its own 3 specific tension techniques (Brutalist tensions look completely different from Ethereal tensions), NOT a universal system
- Custom archetype builder is hybrid: structured wizard for users who know what they want, reference-based derivation for "I want it to feel like X"

### Skill format & structure
- 4-layer format: Decision Guidance, Award-Winning Examples, Integration Context, Anti-Patterns
- Award-Winning Examples layer includes BOTH copy-paste TSX code blocks for common patterns AND curated references to award-winning sites with annotations — code for "how", references for "why"
- Comprehensive skill length: 300-600 lines per skill. Skills are the knowledge base — invest the tokens
- Tier-based preloading: Core skills always loaded, Domain skills loaded based on task, Utility skills on-demand
- Aggressive cull of v6.1.0 skills: merge overlapping skills (>50% overlap), absorb thin skills (<100 lines) into parents. Target: 50-60 skills down from 87

### Anti-Slop Gate calibration
- Weighted scoring across 7 categories (not flat 5 per category)
- Design quality weighted highest — craft fundamentals (polish, spacing, typography, color harmony) are the top priority
- Post-review enforcement only — builders focus on building, gate runs during /gen:verify. No inline self-check during building
- When gate fails: specific fix list — outputs exactly which points were lost and concrete remediation actions
- Full 35-point breakdown visible to user during verify — transparency builds trust
- Anti-Slop Gate and Awwwards 4-axis scoring are separate systems — gate = enforcement (pass/fail), Awwwards = aspiration (quality level)
- Named quality tiers: Pass (25+), Strong (28+), SOTD-Ready (30+), Honoree-Level (33+)

### Design DNA token system
- 12 color tokens: hybrid semantic core + accent system — 8 semantic tokens (bg, surface, text, border, primary, secondary, accent, muted) + 4 expressive tokens (glow, tension, highlight, signature)
- Typography: curated library per archetype — each archetype has 5-8 approved fonts, user mixes and matches within the approved set
- Signature element defined as named pattern + parameters — e.g., "diagonal-cut: angle=12deg, frequency=every-section, color=accent". Machine-readable, enforceable
- Full motion vocabulary: 8+ motion tokens (entrance, exit, hover, scroll-reveal, page-transition, micro-interaction, loading, attention) with duration, easing, and direction per token

### Claude's Discretion
- Penalty magnitudes for anti-slop violations (missing signature element, forbidden pattern, no creative tension)
- Specific weight distribution across the 7 anti-slop categories (as long as Design quality is highest)
- Which new archetypes to add beyond the original 16 (Dark Academia and AI-Native confirmed, others TBD)
- Exact font curation per archetype (5-8 approved fonts each)
- Emotional Arc implementation details (not discussed — covered by roadmap success criteria)

</decisions>

<specifics>
## Specific Ideas

- Archetype constraints should be "hard rules with escape hatch" — not advisory prose, not absolute lockdown. The tension override mechanism is key: builders CAN break a rule, but must document the rationale
- Skills should be a genuine knowledge base, not a thin reference card. 300-600 lines means room for real examples and real guidance
- The 4 expressive color tokens (glow, tension, highlight, signature) are what separate Genorah's palette system from generic design tokens — they encode creative intent, not just functional roles
- Named quality tiers (Pass/Strong/SOTD-Ready/Honoree-Level) give builders something to aim for beyond "not failing"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-02-23*
