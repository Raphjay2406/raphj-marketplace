---
name: design-archetypes
description: "19 opinionated design personality systems with machine-enforceable constraints. Each archetype locks colors, fonts, techniques, and forbidden patterns."
tier: core
triggers: "archetype, design personality, design direction, creative direction, aesthetic, visual identity, style selection"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a creative director who uses personality archetypes to guarantee distinctive visual identity. Each archetype is a CONSTRAINT SYSTEM -- it defines what you MUST use and what you CANNOT use. Archetypes are not mood boards. They are machine-enforceable rules with locked palettes, required fonts, mandatory techniques, forbidden patterns, a signature element, and three tension zones.

### How Archetypes Work

1. During brainstorm (via `/modulo:start-project`), present 2-3 relevant archetypes based on project type/industry
2. User selects one or requests custom
3. Archetype constraints populate the Design DNA document
4. ALL section builders must follow archetype rules throughout the build
5. Tension override allows ONE intentional rule break per page (see Tension Override Mechanism below)

### Archetype Selection Guide

| Industry / Project Type | Primary Recommendation | Secondary Options |
|-------------------------|----------------------|-------------------|
| SaaS / Developer Tools | Neo-Corporate | Data-Dense, AI-Native |
| E-commerce (Fashion/Luxury) | Luxury/Fashion | Swiss/International |
| E-commerce (General/DTC) | Playful/Startup | Organic, Neubrutalism |
| Blog / Publication | Editorial | Dark Academia, Japanese Minimal |
| Creative Portfolio | Kinetic | Brutalist, Neubrutalism |
| Agency / Studio | Brutalist | Swiss/International, Kinetic |
| Food / Beverage / Restaurant | Warm Artisan | Organic |
| Health / Wellness | Ethereal | Japanese Minimal, Organic |
| Gaming / Music / Nightlife | Neon Noir | Vaporwave, Retro-Future |
| Fintech / Analytics Dashboard | Data-Dense | Neo-Corporate, Glassmorphism |
| Architecture / Design Studio | Swiss/International | Japanese Minimal |
| Education / Academic | Dark Academia | Editorial, Neo-Corporate |

### When to Recommend Custom

Recommend the Custom Archetype Builder when:
- User describes a feeling that does not map to any of the 19 archetypes
- User wants to hybridize 2+ archetypes (e.g., "Brutalist energy with Ethereal colors")
- User provides reference sites that span multiple aesthetic directions
- Project has an established brand system that conflicts with all built-in archetypes

### Tension Override Mechanism

Builders may intentionally break ONE mandatory rule per page IF all four conditions are met:

1. **Intentional tension** -- The break creates deliberate creative tension, not laziness or oversight
2. **Documented rationale** -- The builder writes the rationale in their SUMMARY.md (e.g., "Material Collision: added one glass element to create tension against the raw brutalist surface")
3. **Specific rule named** -- The exact rule being broken is identified (not "general override" or "creative freedom")
4. **Aligned with tension technique** -- The override aligns with one of the archetype's 3 defined tension zones

**Quality reviewer checks:**
- Is the override intentional? (rationale makes sense)
- Does it IMPROVE the design? (tension creates interest, not confusion)
- Is only ONE rule broken? (multiple overrides = not overrides, just ignoring the archetype)

If the override is lazy (no rationale, does not improve the design, or breaks multiple rules), treat it as a violation and apply the -5 penalty.

### Custom Archetype Builder

Two modes for creating project-specific archetypes:

**Mode 1: Structured Wizard**

For users who know what they want. Gather:
1. 4 personality adjectives (e.g., "bold, warm, rebellious, approachable")
2. Color preferences or existing brand colors
3. Font preferences or style direction (serif, sans, mono, mixed)
4. 2-3 reference sites they admire
5. 1-2 things they absolutely do NOT want (forbidden direction)

Generate a complete archetype constraint block matching the standard format: locked palette (all 12 tokens), required fonts (specific Google Fonts), mandatory techniques (4+), forbidden patterns (4+), signature element (named pattern), and 3 tension zones.

**Mode 2: Reference Derivation**

For users who say "I want it to feel like [site URL]." Process:
1. Analyze the reference site's visual language (colors, typography, spacing, motion, signature elements)
2. Identify the closest built-in archetype as a starting point
3. Document where the reference diverges from that archetype
4. Generate a custom archetype that captures the reference's personality

Custom archetype output format matches the standard archetype block structure (same sections, same table format). Custom archetypes are stored in the project's DESIGN-DNA.md, not in this skill file.

## Layer 2: Award-Winning Examples

<!-- LAYER 2: ARCHETYPE DEFINITIONS START -->

*Archetype definitions will be inserted here in Task 2.*

<!-- LAYER 2: ARCHETYPE DEFINITIONS END -->

## Layer 3: Integration Context

### Archetype to Design DNA

When an archetype is selected, its constraints populate the Design DNA document:

| Archetype Section | DNA Section | Mapping |
|-------------------|------------|---------|
| Locked Palette (12 tokens) | Color Tokens | Direct copy -- `--color-bg`, `--color-surface`, etc. |
| Required Fonts | Font Stack | Display, body, mono fonts become DNA font tokens |
| Mandatory Techniques | Technique Constraints | Listed as enforced rules in DNA |
| Forbidden Patterns | Forbidden List | Checked during verify -- violation = -5 penalty |
| Signature Element | Signature Element | Named pattern + parameters in DNA |
| Tension Zones (3) | Tension Plan | Available tension techniques for this project |

### Archetype to Emotional Arc

Each archetype has a default arc template (defined in the emotional-arc skill). Key archetype-specific arc modifications:

| Archetype | Arc Modification |
|-----------|-----------------|
| Japanese Minimal | HOOK beat height reduced to 50-70vh, element count 1-2 |
| Data-Dense | No HOOK beat -- data IS the hook, start with content |
| Editorial | HOOK height 60-80vh -- content-first, not spectacle |
| Kinetic | All beats have scroll-driven animation requirements |
| Ethereal | PEAK beat uses slow transitions (800ms+), no aggressive motion |
| Brutalist | BREATHE beats have less whitespace (50-60% vs 70-80%) |
| Luxury/Fashion | All transitions are slow (600ms+), no bouncy easing |

### Archetype to Anti-Slop Gate

During `/modulo:verify`, the quality reviewer checks archetype compliance:

- **Forbidden pattern found:** -5 penalty per violation (e.g., gradient background in Brutalist project)
- **Missing signature element:** -3 penalty (signature must appear in at least one section)
- **No creative tension moment:** -5 penalty (at least one tension zone must be used per page)
- **Display font violation:** -5 penalty if Inter/Roboto used as display font (unless archetype requires it)

### Archetype to Section Builder

Builder spawn prompts include:
1. Archetype name (so builder can reference the full constraint block)
2. Locked palette (all 12 color tokens)
3. Required fonts (display, body, mono)
4. Forbidden patterns (quick-reference list)
5. Signature element (named pattern + parameters)
6. Which tension zone to use (if this section has an assigned tension moment)

Builders read the full archetype block from this skill for technique details. The spawn prompt provides the essentials for quick reference.

### Related Skills

- **design-dna** -- Archetype constraints populate DNA tokens. DNA is the runtime document; archetypes are the source definitions.
- **emotional-arc** -- Archetype-specific arc modifications change beat parameters. Arc skill references archetype name.
- **anti-slop-gate** -- Gate enforces archetype forbidden patterns and signature element presence during verify.
- **creative-tension** -- Tension zones defined per-archetype here. Creative tension skill provides the general framework.

## Layer 4: Anti-Patterns

### Anti-Pattern: Archetype Mixing Without Intent

**What goes wrong:** Applying Brutalist typography with Ethereal colors, or Kinetic motion with Japanese Minimal spacing. The result is visual confusion, not creative tension. The design has no coherent personality.
**Instead:** Pick ONE archetype. Use the tension override mechanism for intentional rule-breaking moments. A single Glass element in a Brutalist layout is tension. Half-Glass-half-Brutalist is confusion.

### Anti-Pattern: Ignoring Forbidden Patterns

**What goes wrong:** Using gradient backgrounds in a Brutalist project, or rounded corners in Swiss/International. Each violation weakens the archetype's personality and triggers a -5 penalty during verify.
**Instead:** Check the forbidden list before every design decision. If you genuinely need something forbidden, use the tension override -- document the rationale, name the specific rule, and ensure it improves the design.

### Anti-Pattern: Bland Custom Archetype

**What goes wrong:** Custom archetype defined as "clean, modern, minimal" with muted blues and Inter font. This produces the exact generic output Modulo exists to prevent. Every project looks the same.
**Instead:** Every custom archetype MUST have at least 3 distinctive mandatory techniques, at least 3 forbidden patterns, a named signature element, and 3 tension zones. If the custom archetype could describe any website, it is too generic. Push for specificity.

### Anti-Pattern: Same Archetype Every Project

**What goes wrong:** Defaulting to Neo-Corporate (or whatever feels safe) for every project. The result is a portfolio of identical-looking sites. Modulo exists for DISTINCTIVE output.
**Instead:** Match archetype to project personality using the selection guide. Push clients beyond their comfort zone. A bakery website should feel warm and artisanal, not like a SaaS dashboard. When in doubt, present the primary AND secondary recommendations from the selection guide.
