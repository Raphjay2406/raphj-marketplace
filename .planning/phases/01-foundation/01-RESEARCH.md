# Phase 1: Foundation - Research

**Researched:** 2026-02-23
**Domain:** Plugin skeleton, design identity systems (DNA, archetypes, anti-slop, emotional arc), skill architecture
**Confidence:** HIGH

## Summary

Phase 1 establishes the foundational identity systems and skill architecture for Modulo 2.0. This is a restructuring phase, not an invention phase -- all core concepts (Design DNA, Archetypes, Anti-Slop Gate, Emotional Arc) exist in v6.1.0 and need to be rewritten into machine-enforceable format with the new 4-layer skill structure.

The primary challenge is transforming advisory prose ("builders SHOULD use DNA tokens") into enforceable constraints ("BREATHE beats MUST have 70-80% whitespace"). The v6.1.0 skills contain rich domain knowledge but lack structure -- they mix decision guidance with code examples, have no anti-pattern sections, and vary wildly in length (92 to 911 lines). The new 4-layer format (Decision Guidance, Award-Winning Examples, Integration Context, Anti-Patterns) standardizes all skills at 300-600 lines with machine-readable constraint blocks.

The secondary challenge is the skill cull. The current 87 skills include non-design skills (admin-panel, webhook-api-patterns, database-crud-ui) that dilute focus. The user decided on an aggressive cull targeting 50-60 skills through merging overlapping skills (>50% overlap), absorbing thin skills (<100 lines) into parents, and removing backend/infrastructure skills entirely. The 3-tier structure (Core/Domain/Utility) with tier-based preloading controls context window consumption.

**Primary recommendation:** Build Phase 1 as six sequential plans -- plugin skeleton first (establishes file conventions), then the four core identity skills (DNA, Archetypes, Anti-Slop, Emotional Arc) in dependency order, then skill architecture last (references the four core skills as exemplars of the 4-layer format).

## Standard Stack

This phase produces markdown files only. There is no application code, no npm packages, no build system. The "stack" is the Claude Code plugin system itself.

### Core
| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| Claude Code Plugin System | Current (2026) | Plugin manifest, skill/agent/command discovery | Official Anthropic platform -- the only target |
| Markdown (SKILL.md) | N/A | Skill knowledge base format | Plugin system auto-discovers `skills/{name}/SKILL.md` |
| YAML frontmatter | N/A | Skill metadata in SKILL.md files | Plugin system reads frontmatter for name/description |
| JSON | N/A | Plugin manifest (`.claude-plugin/plugin.json`) | Required format per plugin spec |
| Bash | N/A | Pre-commit hook (dna-compliance-check.sh) | Hook system supports `command` type hooks |

### Supporting
| Component | Purpose | When to Use |
|-----------|---------|-------------|
| `${CLAUDE_PLUGIN_ROOT}` | Environment variable for absolute paths in hooks | All hook command paths |
| `hooks/hooks.json` or inline in `plugin.json` | Hook configuration | Pre-commit DNA compliance check |

### Plugin Manifest Format (Verified from Official Docs)

**Confidence: HIGH** -- Verified against https://code.claude.com/docs/en/plugins-reference on 2026-02-23.

```json
{
  "name": "modulo",
  "version": "2.0.0",
  "description": "Premium frontend design plugin...",
  "author": {
    "name": "raphj"
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/dna-compliance-check.sh"
          }
        ]
      }
    ]
  }
}
```

**Key facts from official docs:**
- Manifest location: `.claude-plugin/plugin.json`
- `name` is the ONLY required field (if manifest exists)
- Manifest is OPTIONAL -- Claude Code auto-discovers components in default locations (`skills/`, `agents/`, `commands/`)
- All component directories MUST be at plugin root, NOT inside `.claude-plugin/`
- Available hook events include: `PreToolUse`, `PostToolUse`, `SessionStart`, `SessionEnd`, `Stop`, `SubagentStart`, `PreCompact`, etc.
- Hook types: `command` (shell), `prompt` (LLM eval), `agent` (agentic verifier)
- Skills use `skills/{name}/SKILL.md` directory structure (can include supporting files alongside SKILL.md)
- Agents use `agents/{name}.md` markdown files with YAML frontmatter (name, description)
- Commands use `commands/{name}.md` (legacy location; `skills/` preferred for new skills)

## Architecture Patterns

### Plugin Directory Structure (Modulo 2.0)

```
modulo/
├── .claude-plugin/
│   └── plugin.json              # Manifest only -- nothing else in this dir
├── skills/
│   ├── design-dna/
│   │   └── SKILL.md             # Core tier -- always loaded
│   ├── design-archetypes/
│   │   └── SKILL.md             # Core tier
│   ├── anti-slop-gate/
│   │   └── SKILL.md             # Core tier
│   ├── emotional-arc/
│   │   └── SKILL.md             # Core tier
│   ├── [other skills]/
│   │   └── SKILL.md
│   └── _skill-template/
│       └── SKILL.md             # Template for new skills (not a real skill)
├── agents/
│   ├── [agents from Phase 2+]
│   └── ...
├── commands/
│   ├── [commands from Phase 3+]
│   └── ...
├── hooks/
│   └── dna-compliance-check.sh  # PreToolUse hook for git commits
├── CLAUDE.md                    # Embedded core rules, project overview
├── README.md
└── LICENSE
```

### Pattern 1: 4-Layer Skill Format

**What:** Every SKILL.md follows a consistent 4-layer structure that separates concerns.
**When to use:** Every skill in the plugin.
**Why:** v6.1.0 skills mix guidance, examples, and rules into an unstructured blob. The 4-layer format makes each section addressable and parseable.

```markdown
---
name: skill-name
description: "One-line description"
tier: core | domain | utility
triggers: "comma-separated trigger phrases"
---

## Layer 1: Decision Guidance

When to use this skill, why it matters, how it connects to the pipeline.
Decision trees, selection criteria, tradeoff analysis.

### When to Use
- [Condition] -> [Guidance]

### Decision Tree
- If [X], use [approach A]
- If [Y], use [approach B]

## Layer 2: Award-Winning Examples

BOTH copy-paste TSX code blocks for common patterns AND curated
references to award-winning sites with annotations.

### Code Patterns

#### Pattern: [Name]
```tsx
// Copy-paste ready TSX
```

### Reference Sites
- [Site Name](url) -- What makes it award-winning: [annotation]

## Layer 3: Integration Context

How this skill connects to Design DNA, archetypes, other skills.
Token mappings, archetype-specific variants, pipeline stage references.

### DNA Connection
- [Token] maps to [usage in this skill]

### Archetype Variants
- [Archetype]: [specific adaptation]

## Layer 4: Anti-Patterns

Common mistakes, what NOT to do, red flags.

### Anti-Pattern: [Name]
**What goes wrong:** [description]
**Instead:** [correct approach]
```

**Confidence: HIGH** -- Based on user decision in CONTEXT.md and v6.1.0 analysis showing need for structured skills.

### Pattern 2: Machine-Readable Constraint Blocks

**What:** Constraints defined as key-value pairs in tables or code blocks, not as prose paragraphs.
**When to use:** All enforceable parameters (beat constraints, archetype rules, anti-slop scoring).
**Why:** Agents need to extract specific values programmatically. "BREATHE must have 70-80% whitespace" is enforceable; "BREATHE sections should feel open and airy" is not.

```markdown
### BREATHE Beat Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Whitespace ratio | 70 | 80 | % | HARD -- reject if outside range |
| Element count | 1 | 3 | elements | HARD -- reject if exceeded |
| Section height | 30 | 50 | vh | SOFT -- warn if outside |
| Animation intensity | minimal | minimal | level | HARD -- no complex animations |
| Type scale | body-large | h3 | level | SOFT -- advisory |
```

**Confidence: HIGH** -- Directly implements FOUND-04 requirement for enforceable values.

### Pattern 3: Archetype Constraint Blocks with Escape Hatch

**What:** Each archetype defines mandatory rules, forbidden patterns, and an explicit tension override mechanism.
**When to use:** All 16+ archetype definitions.
**Why:** User decided "hard rules with escape hatch" -- mandatory enforcement but builders can intentionally break ONE rule with documented rationale.

```markdown
### Brutalist -- Constraints

#### MANDATORY (enforced, no exceptions)
| Rule | Value | Check |
|------|-------|-------|
| Max border-radius | 4px | Grep for rounded-md+ |
| Border width | 2-3px solid | Visual check |
| Display font | monospace family | Font audit |
| Background | No gradients | Grep for gradient |

#### FORBIDDEN (violation = -5 penalty)
- Rounded corners > 4px
- Gradient backgrounds
- Backdrop-blur / glass morphism
- Soft shadows
- Smooth transitions > 150ms

#### TENSION OVERRIDE
Builders may intentionally break ONE mandatory rule per page IF:
1. The break creates deliberate creative tension
2. The rationale is documented in SUMMARY.md
3. The specific rule broken is named (not "general override")
4. It aligns with one of the archetype's 3 tension techniques

Example: "Material Collision: added one glass element (backdrop-blur-xl)
to create tension against the raw brutalist surface. This violates the
'No backdrop-blur' rule intentionally."
```

**Confidence: HIGH** -- Directly from user decision in CONTEXT.md.

### Pattern 4: Weighted Anti-Slop Scoring

**What:** 7 categories with different point weights (not flat 5 per category), design quality weighted highest.
**When to use:** Anti-Slop Gate skill definition.
**Why:** User decided weighted scoring with design quality highest. The flat 5-per-category in v6.1.0 doesn't reflect that craft fundamentals matter more than UX intelligence for SOTD.

Recommended weight distribution (Claude's discretion per CONTEXT.md):

| Category | Points | Weight | Rationale |
|----------|--------|--------|-----------|
| Colors | 5 | 14% | Foundation of visual identity |
| Typography | 6 | 17% | **Design quality -- weighted highest** |
| Layout | 5 | 14% | Compositional craft |
| Depth & Polish | 6 | 17% | **Design quality -- weighted highest** |
| Motion | 5 | 14% | Choreography and surprise |
| Creative Courage | 5 | 14% | Wow factor, boldness |
| UX Intelligence | 3 | 9% | Functional quality (lower weight per user) |
| **Total** | **35** | **100%** | |

Named tiers: Pass (25+), Strong (28+), SOTD-Ready (30+), Honoree-Level (33+)

**Confidence: MEDIUM** -- Weight distribution is Claude's discretion. The principle (design quality highest) is locked by user decision.

### Pattern 5: Tier-Based Skill Organization

**What:** Skills organized into 3 tiers with different loading behaviors.
**When to use:** Skill directory structure and skill metadata.
**Why:** 87 flat skills overwhelm the context window. Tiered loading ensures only relevant skills are consumed.

| Tier | Loading | Skills | Context Budget |
|------|---------|--------|----------------|
| Core | Always loaded (referenced by agents, CLAUDE.md) | ~6: design-dna, anti-slop-gate, design-archetypes, emotional-arc, typography, color-system | ~2,400 lines total |
| Domain | Loaded per project type (agent decides) | ~15-20: 3d-webgl, remotion, ecommerce, dashboard, etc. | Only relevant ones |
| Utility | On-demand (explicit reference) | ~20-30: seo, a11y, performance, testing, etc. | Only when needed |

**Confidence: HIGH** -- Directly from user decision in CONTEXT.md (SKIL-02).

### Anti-Patterns to Avoid

- **Advisory prose as constraints:** "Builders should use DNA tokens" is not enforceable. Use tables with min/max/unit/enforcement columns.
- **Flat skill structure:** v6.1.0 dumps everything into one blob. The 4-layer format must be strictly followed.
- **Identical point weights:** v6.1.0 uses flat 5 per category. The new system must weight design quality highest.
- **Missing escape hatch:** Pure lockdown frustrates builders. The tension override mechanism is critical.
- **Overstuffed skills:** v6.1.0's design-archetypes is 911 lines. Even with the 300-600 line target, 19 archetypes in one file would exceed 1000 lines. Consider whether archetypes skill needs a different structure (summary in main skill, detail per-archetype).

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Plugin discovery | Custom file scanning | Claude Code auto-discovery | Plugin system finds `skills/`, `agents/`, `commands/` automatically |
| Skill metadata | Inline comments | YAML frontmatter (`---name: ...---`) | Standard plugin format, parsed by system |
| Hook configuration | Custom scripts | `plugin.json` hooks section | Official hook system with matcher patterns |
| Color token validation | Prose rules | Pre-commit hook pattern matching | v6.1.0's `dna-compliance-check.sh` works; extend it |
| Archetype data format | Free-form prose | Structured tables with machine-readable values | Agents need to extract values, not interpret paragraphs |

**Key insight:** This phase is markdown authoring, not software engineering. The "don't hand-roll" principle here means: don't invent custom formats when the plugin system has conventions, and don't write prose when structured tables would be parseable.

## Common Pitfalls

### Pitfall 1: Archetype Skill Size Explosion
**What goes wrong:** Putting 19 full archetypes (each with palette, fonts, mandatory techniques, forbidden patterns, signature element, 3 tension zones, references) into one SKILL.md produces a 1500+ line file that blows the context window.
**Why it happens:** v6.1.0 has all 16 archetypes in a single 911-line file, and adding 3+ more makes it worse.
**How to avoid:** The archetypes skill should contain the archetype FRAMEWORK (how archetypes work, constraint structure, custom builder template, selection guide) at ~300-400 lines, with each archetype as a structured constraint block. The total file will be large (likely 800-1200 lines given 19 archetypes) but this is acceptable because: (a) only the relevant archetype's block is consumed per project, not the whole file, and (b) each archetype block is densely structured tables, not prose. Alternatively, consider a per-archetype reference file structure.
**Warning signs:** If the SKILL.md exceeds 1200 lines, the format needs optimization.

### Pitfall 2: CONTEXT.md vs REQUIREMENTS Conflict on Anti-Slop Enforcement
**What goes wrong:** FOUND-03 requirement says "inline enforcement -- builders self-check before emitting code." But the user explicitly decided in CONTEXT.md: "Post-review enforcement only -- builders focus on building, gate runs during /modulo:verify. No inline self-check during building."
**Why it happens:** Requirements were written before the user discussion. The discussion overrides.
**How to avoid:** Follow CONTEXT.md (post-review only). The Anti-Slop Gate skill defines the 35-point scoring system, but enforcement happens in the quality-reviewer agent (Phase 2) and verify command (Phase 3). The gate skill itself is a KNOWLEDGE BASE, not an enforcement mechanism. Note: Success Criteria #3 in ROADMAP.md also says "inline self-check protocol" -- this should be considered superseded by the user's explicit decision.
**Warning signs:** If the anti-slop skill contains phrases like "before emitting code, run this checklist" -- that contradicts the user decision.

### Pitfall 3: Token System Disconnect Between DNA and Tailwind v4
**What goes wrong:** Design DNA defines 12 color tokens with CSS custom property names, but Tailwind v4 uses `@theme` directive with specific naming conventions (`--color-*` namespace) that may not match.
**Why it happens:** v6.1.0 Design DNA uses `--color-bg-primary`, `--color-accent-1` etc. Tailwind v4's `@theme` expects `--color-{name}` to generate `bg-{name}`, `text-{name}` utilities.
**How to avoid:** Design DNA token names must be designed to work WITH Tailwind v4's `@theme` directive from day 1. The DNA skill should show the exact mapping:

```css
@theme {
  --color-bg: #0a0a0f;
  --color-surface: #111115;
  --color-text: #f0ece6;
  --color-border: rgba(255,255,255,0.06);
  --color-primary: #ff6f3c;
  --color-secondary: #00e5a0;
  --color-accent: #c084fc;
  --color-muted: #5c5952;
  --color-glow: rgba(255,111,60,0.3);
  --color-tension: #ff0044;
  --color-highlight: #ffd700;
  --color-signature: #00ff88;
}
```

This generates `bg-bg`, `bg-surface`, `text-text`, `text-primary` etc. -- note the potential awkwardness of `bg-bg` and `text-text`. The DNA skill needs to establish a naming convention that works naturally with Tailwind utility generation.

**Warning signs:** If DNA token names don't map cleanly to Tailwind v4 utility classes, every downstream skill will have friction.

### Pitfall 4: Skill Cull Without Clear Decision Rules
**What goes wrong:** The cull list is vague ("remove backend skills") but doesn't address borderline cases (is `ecommerce-ui` a design skill or a domain pattern? Is `dashboard-patterns` core or domain?).
**Why it happens:** The requirement (SKIL-03) says "remove backend/infrastructure" but many skills are UI-focused with backend implications.
**How to avoid:** Establish clear decision rules in the skill architecture plan:
- **Remove:** Skill's primary value is backend logic (admin-panel, webhook-api-patterns, database-crud-ui, cms-integration, payment-ui backend, analytics-tracking, data-fetching, state-management)
- **Keep as Domain:** Skill's primary value is UI patterns for a specific context (ecommerce-ui, dashboard-patterns, blog-patterns, portfolio-patterns)
- **Keep as Utility:** Skill provides cross-cutting UI guidance (accessibility, seo, performance, responsive, testing)
- **Merge:** Skills with >50% content overlap (mobile-navigation + mobile-patterns -> responsive-mobile, premium-dark-ui + light-mode-patterns -> color-modes, css-animations + framer-motion + gsap-animations -> potentially split by scope)
- **Absorb:** Skills under 150 lines get absorbed into parent skills

### Pitfall 5: CLAUDE.md Scope Creep
**What goes wrong:** Trying to embed too many rules in CLAUDE.md makes it massive and creates duplication with skills.
**Why it happens:** CLAUDE.md is always loaded. Temptation to put everything there.
**How to avoid:** CLAUDE.md should contain ONLY:
1. Project overview (what Modulo is, version, key numbers)
2. Architecture (3-tier system, directory layout, file conventions)
3. Core workflow (command sequence, what each phase does)
4. Key concepts (one-paragraph summaries, NOT full definitions)
5. Modification guide (how to add skills/agents/commands)

Rule: If it's more than 2 sentences about a concept, it belongs in a skill, not CLAUDE.md. CLAUDE.md should be under 150 lines.

## Code Examples

Note: "Code" in this phase means markdown structure, not application code.

### Example: Machine-Readable Beat Constraint (Emotional Arc)

```markdown
### HOOK Beat

> The first 2 seconds. Grab attention. Make them stop scrolling.

#### Hard Constraints (MUST enforce)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Section height | 90 | 100 | vh | HARD |
| Element count | 3 | 5 | elements | HARD |
| Whitespace ratio | 60 | 70 | % | HARD |
| Type scale | hero | hero | level | HARD |
| Animation duration | 800 | 1500 | ms | SOFT |

#### Soft Constraints (SHOULD follow)

| Parameter | Recommended | Flexibility |
|-----------|-------------|-------------|
| Layout complexity | simple (centered or split) | May increase for kinetic archetype |
| Animation intensity | high (dramatic entrance) | Reduce for japanese-minimal |

#### Archetype Overrides

| Archetype | Override | Reason |
|-----------|---------|--------|
| Japanese Minimal | Height 50-70vh, elements 1-2 | Restraint is the signature |
| Data-Dense | No HOOK beat (start with data) | Data IS the hook |
| Editorial | Height 60-80vh | Content-first, not spectacle |
```

### Example: 12-Token Color System (Design DNA)

```markdown
## Color Token System

### Semantic Core (8 tokens)

| Token | CSS Variable | Purpose | Tailwind Utility |
|-------|-------------|---------|-----------------|
| bg | `--color-bg` | Main background | `bg-bg` |
| surface | `--color-surface` | Card/panel surfaces | `bg-surface` |
| text | `--color-text` | Primary text | `text-text` |
| border | `--color-border` | Default borders | `border-border` |
| primary | `--color-primary` | Primary accent, CTAs | `text-primary`, `bg-primary` |
| secondary | `--color-secondary` | Secondary accent | `text-secondary`, `bg-secondary` |
| accent | `--color-accent` | Tertiary/decorative | `text-accent`, `bg-accent` |
| muted | `--color-muted` | Muted text, captions | `text-muted` |

### Expressive Tokens (4 tokens)

| Token | CSS Variable | Purpose | When Used |
|-------|-------------|---------|-----------|
| glow | `--color-glow` | Glow/shadow color | Box-shadow, text-shadow |
| tension | `--color-tension` | Creative tension accents | Rule-breaking moments |
| highlight | `--color-highlight` | Emphasis, selection | Selection color, highlights |
| signature | `--color-signature` | Signature element color | The one unique visual |

### Tailwind v4 Integration

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0f;
  --color-surface: #111115;
  --color-text: #f0ece6;
  --color-border: rgba(255,255,255,0.06);
  --color-primary: #ff6f3c;
  --color-secondary: #00e5a0;
  --color-accent: #c084fc;
  --color-muted: #5c5952;
  --color-glow: rgba(255,111,60,0.3);
  --color-tension: #ff0044;
  --color-highlight: #ffd700;
  --color-signature: #00ff88;
}
```

Generates: `bg-bg`, `bg-surface`, `text-text`, `text-primary`, `bg-primary`,
`text-secondary`, `text-accent`, `text-muted`, `text-glow`, etc.
```

### Example: Weighted Anti-Slop Scoring

```markdown
## Anti-Slop Gate: 35-Point Weighted Scoring

### Category Breakdown

#### Typography (6 points) -- DESIGN QUALITY
| # | Check | Points | Weight |
|---|-------|--------|--------|
| T1 | Display font is distinctive (not Inter/Roboto/system) | 2 | Critical |
| T2 | 3+ font weights visible with clear hierarchy | 1 | Standard |
| T3 | Letter-spacing tuned: tight on headings, wide on labels | 1 | Standard |
| T4 | Line heights varied (tight headings, relaxed body) | 1 | Standard |
| T5 | Typographic surprise present (gradient, variable, oversized) | 1 | Standard |

#### Depth & Polish (6 points) -- DESIGN QUALITY
| # | Check | Points | Weight |
|---|-------|--------|--------|
| D1 | Shadows are layered (2-3 shadow layers, not shadow-md) | 2 | Critical |
| D2 | Borders are subtle (opacity-based, not solid gray) | 1 | Standard |
| D3 | Glass/frost/blur element present | 1 | Standard |
| D4 | Rounded corners varied per element type (not uniform) | 1 | Standard |
| D5 | Micro-details present (noise, grain, gradient borders) | 1 | Standard |

#### UX Intelligence (3 points) -- FUNCTIONAL QUALITY
| # | Check | Points | Weight |
|---|-------|--------|--------|
| U1 | Navigation has current-page indicator | 1 | Standard |
| U2 | Interactive elements give feedback <100ms | 1 | Standard |
| U3 | CTA hierarchy clear, no "Submit"/"Learn More" | 1 | Standard |

### Penalties (applied after 35-point total)
| Violation | Penalty | Condition |
|-----------|---------|-----------|
| Missing signature element | -3 | Signature not present in any section |
| Archetype forbidden pattern | -5 | Per violation found |
| Inter/Roboto as display font | -5 | Unless archetype requires it |
| No creative tension moment | -5 | Zero tension on entire page |
| Generic CTA text | -2 | Per "Submit"/"Learn More"/"Click Here" |

### Named Tiers
| Tier | Score Range | Meaning |
|------|------------|---------|
| Honoree-Level | 33-35 | Exceptional -- Awwwards Honoree territory |
| SOTD-Ready | 30-32 | Site of the Day competitive |
| Strong | 28-29 | Solid premium quality |
| Pass | 25-27 | Meets quality bar |
| FAIL | <25 | Automatic rework required |

### Failure Protocol
When score < 25:
1. Output exact point breakdown per category
2. List every failed check with current state
3. Provide concrete remediation action per failed check
4. Generate GAP-FIX.md with tasks to address gaps
```

### Example: New Archetype -- Neubrutalism

Based on web research (MEDIUM confidence -- verified against multiple sources):

```markdown
## Neubrutalism

> Brutalism's playful evolution. Bold colors, thick outlines, hard shadows -- but friendly, not hostile.

**Personality:** Energetic, transparent, rebellious-but-approachable, anti-corporate
**Best for:** Creator tools, indie SaaS, digital zines, developer products, marketplaces
**Distinction from Brutalist:** Brutalist is raw and confrontational. Neubrutalism is bold but warm -- it adds saturated colors, rounded-ish forms, and playful energy to the raw structure.

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#f5f0e8` | Warm off-white/cream |
| surface | `#ffffff` | Pure white cards |
| text | `#1a1a1a` | Near-black |
| border | `#1a1a1a` (3px solid) | Thick, visible, always black |
| primary | `#ff5c5c` | Saturated red-coral |
| secondary | `#5cb8ff` | Bright blue |
| accent | `#ffd43b` | Sunshine yellow |
| muted | `#6b7280` | Standard gray |
| glow | none | No glow effects |
| tension | `#8b5cf6` | Purple for tension moments |
| highlight | `#ffd43b` | Yellow highlight |
| signature | `#ff5c5c` | Primary color |

### Required Fonts
- Display: **Space Grotesk** or **Syne** (bold geometric with character)
- Body: **Inter** or **DM Sans** (readable, clean)
  Note: Inter IS allowed here as body (not display)

### Mandatory Techniques
- Thick black borders (2-3px solid #1a1a1a) on all cards/containers
- Hard drop shadows (`shadow-[4px_4px_0_#1a1a1a]`) -- no blur, no spread
- Saturated, primary colors used liberally (not sparingly)
- Slightly rounded corners (rounded-lg, NOT rounded-none like Brutalist)
- Hover: shadow shifts (`shadow-[8px_8px_0_#1a1a1a]` + translateX/Y(-4px))
- At least 3 different accent colors visible per page

### Forbidden
- Subtle/muted color palettes
- Gradient backgrounds
- Glass morphism / backdrop-blur
- Soft layered shadows
- Dark mode (Neubrutalism is a light-mode aesthetic)
- Thin/hairline borders

### Signature Element
Cards with thick black borders and colored hard drop-shadows that shift on hover, creating a "sticker" or "cut-out" feel.

### Aggressive Tension Zones
1. **Scale Violence -- Giant sticker:** One element designed as an oversized sticker/badge at 40%+ viewport, with thick border and rotated 3-5 degrees.
2. **Material Collision -- Glass intrusion:** One glass/frosted element in the otherwise flat, bold layout. The polish contradicts the rawness.
3. **Interaction Shock -- Drag to rearrange:** One section where users can actually drag elements around, embracing the "digital zine" energy.

### References
[Gumroad](https://gumroad.com), [Whereby](https://whereby.com), neobrutalism design trend
```

### Example: New Archetype -- Dark Academia

Based on web research (MEDIUM confidence -- derived from aesthetic descriptions, not web implementation examples):

```markdown
## Dark Academia

> Ancient libraries, leather-bound books, Oxford corridors. Scholarly elegance in digital form.

**Personality:** Intellectual, mysterious, romantic, timeless
**Best for:** Education platforms, book/publishing, academic tools, literary projects, museums, cultural institutions
**Distinction from Editorial:** Editorial is modern magazine precision. Dark Academia is vintage scholarly atmosphere -- warmer, darker, more textural.

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#1c1a17` | Deep warm brown-black |
| surface | `#2a2520` | Dark leather brown |
| text | `#e8dfd0` | Aged parchment |
| text-secondary | `#a89880` | Faded ink |
| border | `#3d362e` | Dark wood grain |
| primary | `#8b2e2e` | Deep burgundy/oxblood |
| secondary | `#4a6741` | Forest green |
| accent | `#c9a55c` | Muted gold |
| muted | `#6b5f52` | Warm gray-brown |
| glow | `rgba(201,165,92,0.15)` | Warm gold glow |
| tension | `#8b2e2e` | Burgundy for emphasis |
| highlight | `#c9a55c` | Gold highlight |
| signature | `#c9a55c` | Gold accent |

### Required Fonts
- Display: **Cormorant Garamond** or **EB Garamond** (scholarly serif)
- Body: **Lora** or **Source Serif 4** (readable serif)
- Mono: **JetBrains Mono** (for code/dates only)
  Note: ALL text is serif. This is a serif-dominant aesthetic.

### Mandatory Techniques
- Paper/parchment noise texture overlay (opacity 0.03-0.05)
- Warm color temperature throughout (no cool blues)
- Drop caps on opening paragraphs (3-4 lines, display serif)
- Horizontal rules as section dividers (thin, warm-toned)
- Generous line-height on body text (1.7+)
- Dark background with warm undertones (not cool/blue-dark)

### Forbidden
- Sans-serif as primary font
- Cool-toned backgrounds (blue-dark, pure black)
- Neon or electric colors
- Glass morphism or glossy effects
- Bouncy or playful animations
- Emoji or casual elements

### Signature Element
A subtle paper/parchment grain texture across the entire dark background, with text that appears to glow softly against it -- like reading by candlelight.

### Aggressive Tension Zones
1. **Material Collision -- Digital artifact:** One element with a modern digital aesthetic (glass, neon accent) intruding on the vintage scholarly atmosphere. Like finding a laptop in a 19th-century library.
2. **Scale Violence -- Monumental quote:** A literary quote at 10vw+ in thin serif, spanning the full viewport like carved stone.
3. **Temporal Disruption -- Age gradient:** Elements that appear to "age" as the user scrolls -- crisp at top, increasingly textured/worn toward bottom.

### References
Dark Academia aesthetic, university library websites, vintage book design
```

## State of the Art

### Tailwind v4 @theme Directive (Verified)

**Confidence: HIGH** -- Verified against https://tailwindcss.com/docs/theme on 2026-02-23.

| Old Approach (v3) | Current Approach (v4) | Impact on DNA |
|--------------------|-----------------------|---------------|
| `tailwind.config.ts` with JS theme extension | `@theme` directive in CSS | DNA generates CSS, not JS config |
| `theme.extend.colors` in JS | `--color-*: value` in `@theme` block | Token names must follow `--color-*` namespace |
| Config file + CSS variables as dual system | Single source: `@theme` IS the config | Simpler DNA-to-code mapping |
| `@apply` for custom utilities | Still works, `@theme` for token definition | No change to utility usage |

Key Tailwind v4 facts for DNA skill:
- `@theme { --color-name: value }` generates `bg-name`, `text-name`, `border-name` utilities
- `@theme inline { ... }` for referencing other CSS variables (e.g., `--font-display: var(--font-clash)`)
- `--color-*: initial` resets all default colors (use when DNA provides complete palette)
- Keyframe animations can be defined inside `@theme` blocks
- All paths must be relative; no JS config file needed

### v6.1.0 Skill Analysis

| Metric | Value | Implication |
|--------|-------|-------------|
| Total skills | 87 | Too many -- cull to 50-60 |
| Average lines/skill | 306 | Close to target 300-600 range |
| Smallest skill | 92 lines (v0-ahh) | Absorb into parent |
| Largest skill | 911 lines (design-archetypes) | Will grow with 3+ new archetypes |
| Skills under 150 lines | 5 (v0-ahh, design-brainstorm, responsive-layout, awwwards-scoring, chart-data-viz) | Candidates for absorption |
| Skills over 500 lines | 5 (cinematic-motion, wow-moments, creative-sections, seo-meta, design-archetypes) | May need restructuring |

### New Archetype Research

| Archetype | Confirmed | Research Basis | Confidence |
|-----------|-----------|----------------|------------|
| Neubrutalism | Yes (user + research) | NN/G article, Gumroad/Whereby examples, multiple design blogs | MEDIUM |
| Dark Academia | Yes (user confirmed) | Color palette research, aesthetic guides (no web implementation examples found) | MEDIUM |
| AI-Native | Yes (user confirmed) | Emerging trend, no settled aesthetic -- search results show varied interpretations | LOW |

**AI-Native archetype note:** This aesthetic is still evolving. Research shows several competing interpretations: (a) Technical Mono + monospace type for "command line rebellion," (b) Y3K Hyperfuturism with ultra-sleek surfaces, (c) Techno-Natural blending organic forms with digital. Recommendation: Define AI-Native as the "machine intelligence made visible" aesthetic -- data visualization as decoration, monospace type, scan-line/grid patterns, cool blue-purple palette, real-time/adaptive-feeling UI. This is Claude's discretion per CONTEXT.md.

## Open Questions

### 1. Archetype File Size Strategy
- **What we know:** 19 archetypes x ~50 lines each = 950+ lines just for constraint blocks. Add framework (200 lines) and custom builder (100 lines) = 1250+ lines.
- **What's unclear:** Should all archetypes live in one SKILL.md, or should there be a summary skill + per-archetype reference files? The plugin system supports reference files alongside SKILL.md.
- **Recommendation:** Keep as single file. Claude Code loads the entire SKILL.md anyway, and the structured table format is more token-efficient than prose. If it exceeds 1200 lines, split into `SKILL.md` (framework + selection guide + custom builder) + archetype summary tables, with per-archetype detail accessible via the same skill directory.

### 2. Anti-Slop Gate: Requirement vs User Decision Conflict
- **What we know:** FOUND-03 says "inline enforcement." CONTEXT.md says "post-review only." CONTEXT.md was written after FOUND-03, representing the user's considered decision.
- **What's unclear:** Whether Roadmap Success Criteria #3 should be updated to reflect this.
- **Recommendation:** Follow CONTEXT.md. The Anti-Slop Gate skill defines the scoring system and criteria. Enforcement mechanism is a Phase 2/4 concern (quality-reviewer agent, verify command). The skill is knowledge, not enforcement. Flag this for the planner to note in success criteria.

### 3. AI-Native Archetype Definition
- **What we know:** User confirmed it. Research shows the aesthetic is unsettled.
- **What's unclear:** Exact palette, font choices, mandatory techniques.
- **Recommendation:** This is Claude's discretion. Define it based on the "machine intelligence" interpretation: monospace-dominant type, cool blue-to-purple palette, grid/scan-line textures, data visualization as decoration, real-time animation feel. This fills a genuine gap -- no current archetype covers the "AI company" or "ML product" visual language.

### 4. Motion Token System Naming
- **What we know:** User decided 8+ motion tokens (entrance, exit, hover, scroll-reveal, page-transition, micro-interaction, loading, attention) with duration, easing, direction per token.
- **What's unclear:** How these map to Tailwind v4 / CSS variable naming. Motion tokens aren't in Tailwind's `@theme` namespace by default.
- **Recommendation:** Define motion tokens as regular CSS custom properties (not `@theme`), since they're consumed by JS animation libraries (GSAP, Framer Motion) not Tailwind utilities:

```css
:root {
  --motion-entrance-duration: 400ms;
  --motion-entrance-easing: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-entrance-direction: from-bottom;
  --motion-hover-duration: 200ms;
  --motion-hover-easing: cubic-bezier(0.3, 1.2, 0.2, 1);
  /* ... etc for all 8 tokens */
}
```

### 5. Cull List Completeness
- **What we know:** Requirements name specific skills to remove (admin-panel, webhook-api-patterns, database-crud-ui). User wants target of 50-60 skills.
- **What's unclear:** Final disposition of every skill. The cull analysis needs to be done during the skill architecture plan (01-06), not during research.
- **Recommendation:** Provide the categorization framework in research. The planner creates the specific cull list in 01-06.

## v6.1.0 Skill Cull Framework

Based on analysis of all 87 skills:

### Definite Remove (Backend/Infrastructure -- 11 skills)
| Skill | Lines | Reason |
|-------|-------|--------|
| admin-panel | 491 | Backend CRUD, not frontend design |
| webhook-api-patterns | 354 | Pure backend |
| database-crud-ui | 394 | Backend data layer |
| analytics-tracking | 227 | Infrastructure, not design |
| cms-integration | 257 | Backend integration |
| payment-ui | 223 | Backend payment logic |
| data-fetching | 280 | State management, not design |
| state-management | 207 | Architecture, not design |
| multi-tenant-ui | 199 | Architecture concern |
| pwa-patterns | 236 | Infrastructure |
| collaboration-realtime | 356 | Backend integration |

### Definite Remove (Non-Design UI -- 7 skills)
| Skill | Lines | Reason |
|-------|-------|--------|
| advanced-kanban | 448 | App pattern, not design skill |
| code-editor-terminal | 483 | App pattern |
| rich-text-editor | 259 | App pattern |
| timeline-gantt | 315 | App pattern |
| virtual-scroll | 404 | Performance technique, not design |
| ai-chat-interface | 378 | App pattern |
| real-time-ui | 237 | App pattern |

### Merge Candidates (Overlapping -- 14 skills -> 6)
| Merge Into | Source Skills | Combined Focus |
|------------|-------------|----------------|
| responsive-design | responsive-layout (164), mobile-patterns (269), mobile-navigation (243) | Mobile-first responsive |
| color-modes | premium-dark-ui (186), light-mode-patterns (385) | Dark/light mode patterns |
| animation-library | css-animations (244), framer-motion (258), gsap-animations (277) | Keep separate per library |
| design-system | design-tokens-sync (252), component-library-setup (314), design-system-scaffold (445) | Scaffold absorbs tokens-sync |
| interaction-patterns | drag-and-drop (282), context-menu (410), modal-dialog-patterns (218) | UI interaction patterns |
| content-patterns | micro-copy (234), conversion-patterns (241) | Copy + conversion |

### Absorb (Under 150 lines -- 5 skills)
| Skill | Lines | Absorb Into |
|-------|-------|-------------|
| v0-ahh | 92 | Remove entirely (meta-skill) |
| design-brainstorm | 141 | Fold into creative-direction skill or agent |
| responsive-layout | 164 | Merge into responsive-design |
| awwwards-scoring | 168 | Fold into anti-slop-gate or keep as separate utility |
| chart-data-viz | 179 | Keep as domain skill for dashboard archetype |

### Estimated Result
- **Remove:** 18 skills
- **Merge:** 14 skills -> 6 skills (net -8)
- **Absorb:** 4-5 skills
- **Remaining from v6.1.0:** ~56-57 skills
- **Target:** 50-60 (on target)

## Sources

### Primary (HIGH confidence)
- Claude Code Plugin Reference: https://code.claude.com/docs/en/plugins-reference -- Full plugin.json schema, component discovery, hook system, directory structure verified 2026-02-23
- Tailwind CSS v4 @theme docs: https://tailwindcss.com/docs/theme -- @theme directive syntax, color/font/spacing namespaces, inline mode verified 2026-02-23
- Modulo v6.1.0 codebase: 87 skills analyzed for line count, structure, and content. Key files: design-dna/SKILL.md (306 lines), design-archetypes/SKILL.md (911 lines), anti-slop-design/SKILL.md (275 lines), emotional-arc/SKILL.md (478 lines), creative-tension/SKILL.md (268 lines), awwwards-scoring/SKILL.md (168 lines), plan-format/SKILL.md (279 lines)
- .claude-plugin/plugin.json: Current manifest format with PreToolUse hook for DNA compliance
- hooks/dna-compliance-check.sh: 103-line bash script for pre-commit pattern matching

### Secondary (MEDIUM confidence)
- Neubrutalism design pattern: Multiple sources (NN/G, design blogs, Gumroad/Whereby examples) agree on core characteristics: thick borders, hard shadows, saturated colors, playful energy
- Dark Academia aesthetic: Color palette research from multiple sources (Piktochart, Adobe, aesthetic guides). Web design implementation examples are sparse -- mostly interior design and fashion
- Project research summary (.planning/research/SUMMARY.md): Architecture recommendations, stack versions, pitfall analysis

### Tertiary (LOW confidence)
- AI-Native archetype definition: No settled aesthetic exists. Research shows competing interpretations. The archetype definition will be Claude's creative synthesis, not a documented standard.
- Exact anti-slop category weights: Claude's discretion per user decision. The principle (design quality highest) is locked; specific numbers are recommendations.

## Metadata

**Confidence breakdown:**
- Plugin system format: HIGH -- verified against official docs
- Tailwind v4 @theme: HIGH -- verified against official docs
- 4-layer skill format: HIGH -- user decision, clear structure
- Archetype expansions (Neubrutalism): MEDIUM -- multiple sources agree
- Archetype expansions (Dark Academia): MEDIUM -- aesthetic is well-defined, web patterns less so
- Archetype expansions (AI-Native): LOW -- no settled standard
- Anti-slop weight distribution: MEDIUM -- principle locked, numbers discretionary
- Cull list: MEDIUM -- framework is clear, specific dispositions need planner judgment
- Emotional Arc constraints: HIGH -- v6.1.0 has detailed parameters, just needs enforcement annotation

**Research date:** 2026-02-23
**Valid until:** 90 days (stable domain -- markdown plugin, not fast-moving library)
