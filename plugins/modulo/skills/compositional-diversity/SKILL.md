---
name: compositional-diversity
category: core
description: "Enforces visual variety across page sections through an 18-pattern layout taxonomy with adjacency rules. Pre-assigns layouts in MASTER-PLAN.md during planning to prevent repetition structurally."
triggers: ["layout", "diversity", "composition", "adjacent", "repetition", "section layout", "master plan"]
used_by: ["section-planner", "quality-reviewer", "build-orchestrator"]
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Why Structural Enforcement

Layout diversity caught in review means sections must be rebuilt -- wasted builder effort and pipeline time. Pre-assigning patterns in MASTER-PLAN.md during planning prevents the problem from occurring. Review becomes a safety net, not the primary enforcement.

**DUAL ENFORCEMENT (LOCKED DECISION):**
- **Primary:** Section-planner assigns layout patterns during MASTER-PLAN.md generation. Adjacency validated before any building starts.
- **Secondary:** Quality-reviewer validates that built output matches the assigned pattern. Catches builder drift only.

### Why 18 Patterns in 6 Groups

A typical premium landing page has 6-10 sections. Adjacency rules requiring different visual groups for adjacent sections need at least `ceil(N/2) + 1` unique groups for N sections. For a 10-section page, that means 6 groups minimum. With 3 patterns per group, the taxonomy provides 18 visually distinct options -- comfortable margin for any page length up to 12 sections.

### Why Visual Groups (Not Just Pattern Names)

Two patterns can have different names but look similar. "Bento-grid" and "masonry" are both grid layouts. "Split-equal" and "split-asymmetric" are both side-by-side splits. Grouping by VISUAL CHARACTER -- how the composition appears to the viewer -- prevents subtle repetition that pattern-name-only checks would miss.

The 6 groups represent 6 fundamentally different spatial strategies:
- **A (Centered):** Eye drawn to a single focal point
- **B (Split):** Two distinct zones competing for attention
- **C (Grid):** Multiple items in a spatial arrangement
- **D (Flowing):** Content moves in a direction (scroll, time)
- **E (Full-Bleed):** Edge-to-edge immersion, no container
- **F (Layered):** Interaction reveals hidden content

### When to Use

- During MASTER-PLAN.md generation -- assign layout patterns to every section
- During section PLAN.md creation -- embed the assigned pattern in frontmatter
- During quality review -- validate built output matches assigned pattern
- During builder spawn prompt composition -- include the assigned pattern description

### When NOT to Use

- For single-section pages (no adjacency to enforce)
- For email templates or non-web outputs (layout taxonomy is web-focused)
- For choosing specific CSS implementation -- this skill defines VISUAL composition, not code structure

### Pipeline Connection

- **Referenced by:** section-planner during MASTER-PLAN.md generation (primary enforcement)
- **Referenced by:** quality-reviewer during post-build verification (safety net)
- **Referenced by:** build-orchestrator when composing builder spawn prompts (pattern description)
- **Consumed at:** `/modulo:plan-dev` workflow step (section planning)

---

## Layer 2: Award-Winning Examples

### Layout Pattern Taxonomy

#### Group A: Centered Compositions

Centered compositions draw the eye to a single focal point, creating moments of pause and emphasis. They command attention through restraint -- fewer elements, more whitespace, larger type. Best for opening statements, breathing room, and closing calls to action.

| # | Pattern | Description | Compatible Beats | Weight |
|---|---------|-------------|-----------------|--------|
| 1 | `centered-hero` | Full-width centered content, large display type, minimal supporting elements. Single dominant message with optional badge above and CTAs below. | HOOK, CLOSE | medium |
| 2 | `centered-minimal` | Centered text block with generous whitespace, single statement or statistic. Maximum restraint -- often just a heading and one line of body text. | BREATHE, TEASE | light |
| 3 | `centered-stacked` | Centered heading with vertically stacked content blocks below (cards, features, or testimonials in a single column). | BUILD, PROOF | medium |

**Reference:** Linear.app homepage hero (centered-hero with gradient text, tight tracking, minimal CTAs). Stripe.com "Payments" page section breaks (centered-minimal with generous vertical rhythm).

#### Group B: Split Compositions

Split compositions create dialogue between two zones -- typically content and media. The visual tension between the two sides creates energy and directionality. Best for product reveals, feature explanations, and story moments that pair narrative with imagery.

| # | Pattern | Description | Compatible Beats | Weight |
|---|---------|-------------|-----------------|--------|
| 4 | `split-equal` | 50/50 side-by-side layout with content on one side and media on the other. Balanced visual tension, clear reading path. | REVEAL, BUILD | medium |
| 5 | `split-asymmetric` | 60/40 or 70/30 layout with a dominant visual side. The larger zone commands attention while the smaller zone provides context. | REVEAL, PEAK | medium-heavy |
| 6 | `split-overlapping` | Content overlaps media or vice versa, breaking the grid boundary. Creates depth through layered positioning. | PEAK, TENSION | heavy |

**Reference:** Vercel.com feature sections (split-equal with terminal/code on one side). Lusion.co project showcases (split-overlapping with 3D elements breaking boundaries).

#### Group C: Grid Compositions

Grid compositions distribute multiple items across a spatial arrangement. They communicate abundance, variety, and organization. Best for features, capabilities, social proof, and any content that benefits from comparison or browsing.

| # | Pattern | Description | Compatible Beats | Weight |
|---|---------|-------------|-----------------|--------|
| 7 | `bento-grid` | Asymmetric card grid with varied cell sizes -- the 2025 dominant pattern. Large hero card (2x2) anchors the grid while smaller cards surround it. | BUILD, REVEAL | heavy |
| 8 | `uniform-grid` | Equal-sized cards in responsive grid (2-col, 3-col, or 4-col). Clean, democratic layout for features, team members, or pricing tiers. | BUILD, PROOF | medium |
| 9 | `masonry` | Pinterest-style staggered vertical layout where cards have natural height variation. Organic, content-driven arrangement. | PROOF, BUILD | medium-heavy |

**Reference:** Apple.com product pages (bento-grid with product photography, varied card sizes). Notion.so features page (uniform-grid with icon-led feature cards). Dribbble.com shots feed (masonry with natural content height).

#### Group D: Flowing Compositions

Flowing compositions create a sense of movement and direction. Content moves horizontally, vertically through time, or through scroll-driven narrative. They break the static page rhythm and invite interaction. Best for logos, testimonials, timelines, and narrative sequences.

| # | Pattern | Description | Compatible Beats | Weight |
|---|---------|-------------|-----------------|--------|
| 10 | `marquee-horizontal` | Infinite horizontal scroll band (logos, testimonials, feature tags). Low vertical height, high horizontal energy. Typically auto-scrolling. | TEASE, PROOF | light |
| 11 | `scroll-storytelling` | Vertical scroll-driven narrative with pinned or animated elements that transform as the user scrolls. Immersive, cinematic. | REVEAL, PEAK | heavy |
| 12 | `timeline-vertical` | Chronological vertical flow with alternating left/right content and a center line. Progressive disclosure through time. | BUILD, PROOF | medium |

**Reference:** Figma.com "What's new" (marquee-horizontal with feature announcements). Apple Vision Pro product page (scroll-storytelling with pinned video). Stripe.com history page (timeline-vertical with company milestones).

#### Group E: Full-Bleed Compositions

Full-bleed compositions break out of the container to fill the viewport edge-to-edge. They create immersive, cinematic moments that dominate the user's visual field. High-impact, high-weight -- used sparingly for maximum effect.

| # | Pattern | Description | Compatible Beats | Weight |
|---|---------|-------------|-----------------|--------|
| 13 | `full-bleed-media` | Edge-to-edge image or video background with overlay text and optional gradient scrim. Cinematic, hero-grade. | HOOK, PEAK | heavy |
| 14 | `full-bleed-interactive` | Full-viewport interactive element -- 3D scene, WebGL canvas, interactive demo, or playground. The user engages directly. | PEAK | heavy |
| 15 | `parallax-layers` | Multi-layer depth composition with parallax scroll effect. Foreground, midground, and background elements move at different rates. | PEAK, REVEAL | heavy |

**Reference:** Porsche.com model pages (full-bleed-media with video hero). GitHub Universe (full-bleed-interactive with animated globe). Locomotive.ca (parallax-layers with multi-speed scroll).

#### Group F: Layered Compositions

Layered compositions hide content behind interaction -- tabs, spotlights, sliders, or toggles reveal different views of the same content area. They pack dense information into a compact vertical space while keeping the page feeling spacious. Best for feature comparisons, multi-faceted showcases, and before/after demonstrations.

| # | Pattern | Description | Compatible Beats | Weight |
|---|---------|-------------|-----------------|--------|
| 16 | `card-spotlight` | Grid of cards with cursor-following spotlight, glow effect, or hover-reveal detail. Static at rest, alive on interaction. | BUILD, PEAK | medium-heavy |
| 17 | `tabbed-showcase` | Tab navigation (horizontal or vertical) revealing different content panels. Content changes without scrolling. | BUILD, REVEAL | medium |
| 18 | `before-after` | Side-by-side or slider comparison layout showing two states of the same thing. Powerful for transformation stories. | TENSION, REVEAL | medium |

**Reference:** Raycast.com extensions page (card-spotlight with hover-reveal descriptions). Linear.app features (tabbed-showcase with tab-driven screenshots). Webflow.com "Before Webflow / After" (before-after with slider).

---

### Adjacency Rules

These rules are explicit and enforceable. The section-planner validates them during MASTER-PLAN.md generation. The quality-reviewer validates them post-build as a safety net.

**Rule 1: No same-pattern adjacency.**
No two adjacent sections use the same layout pattern. (Obvious, but stated for completeness.)

**Rule 2: No same-group adjacency.**
No two adjacent sections use patterns from the same visual group (A-F). This is the stricter rule that prevents subtle repetition where two different pattern names produce similar visual character.

**Rule 3: Group C exception.**
`bento-grid` (7) and `masonry` (9) from Group C are visually distinct enough to appear adjacent -- their spatial strategies (rigid asymmetric grid vs. organic staggered flow) read differently. However, `uniform-grid` (8) adjacent to either `bento-grid` or `masonry` is NOT allowed (all three share the grid character too closely). Use this exception sparingly.

**Rule 4: Background alternation.**
No two adjacent sections use the same background token. Cycle through at least 3 tokens: `bg-primary`, `bg-secondary`, `bg-tertiary`, and optionally `bg-accent` for CTAs and signature moments. Even with different layout patterns, two dark sections back-to-back flatten the visual rhythm.

**Rule 5: Weight variation.**
No 3 or more consecutive "heavy" weight patterns. Heavy patterns (scroll-storytelling, full-bleed-media, full-bleed-interactive, parallax-layers, bento-grid, split-overlapping) create visual fatigue when stacked. Intersperse with light or medium weight patterns to create breathing room.

**Rule 6: Group diversity minimum.**
A page of N sections must use patterns from at least `ceil(N/2)` different groups. For 8 sections, use at least 4 groups. For 10 sections, use at least 5 groups. This ensures the page traverses multiple spatial strategies.

---

### MASTER-PLAN.md Layout Assignments Format

The section-planner generates this table during MASTER-PLAN.md creation. Every column is required. The "Adjacent Valid?" column documents the validation inline.

```markdown
## Layout Assignments (Pre-Assigned, No Adjacent Repeats)

| # | Section | Beat | Layout Pattern | Group | Background | Weight | Adjacent Valid? |
|---|---------|------|---------------|-------|------------|--------|----------------|
| 01 | hero | HOOK | centered-hero | A | bg-primary | medium | -- |
| 02 | logos | TEASE | marquee-horizontal | D | bg-secondary | light | A->D: VALID |
| 03 | features | BUILD | bento-grid | C | bg-primary | heavy | D->C: VALID |
| 04 | product | REVEAL | split-asymmetric | B | bg-tertiary | med-heavy | C->B: VALID |
| 05 | stats | BREATHE | centered-minimal | A | bg-secondary | light | B->A: VALID |
| 06 | demo | PEAK | full-bleed-interactive | E | bg-primary | heavy | A->E: VALID |
| 07 | testimonials | PROOF | masonry | C | bg-secondary | med-heavy | E->C: VALID |
| 08 | cta | CLOSE | centered-hero | A | bg-accent | medium | C->A: VALID |

### Validation Summary
- Groups used: A, D, C, B, A, E, C, A (6 of 6 groups for 8 sections -- PASS)
- Adjacent group repeats: None -- PASS
- Background alternation: primary, secondary, primary, tertiary, secondary, primary, secondary, accent -- PASS
- Weight sequence: med, light, heavy, med-heavy, light, heavy, med-heavy, med -- no 3+ consecutive heavy -- PASS
```

### Section PLAN.md Frontmatter Extension

Each section's PLAN.md includes the assigned layout pattern in its frontmatter:

```yaml
---
section: 03-features
wave: 2
beat: BUILD
layout_pattern: "bento-grid"
layout_group: "C"
---
```

The builder receives this assignment and builds the section's structure to match the pattern's visual character. The pattern sets the compositional approach -- not pixel-perfect layout. Builders have creative freedom within the pattern's character.

---

### Worked Example 1: 6-Section SaaS Landing Page

A compact SaaS landing page with 6 sections. Needs at least `ceil(6/2) = 3` groups.

**Assignment process:**
1. List beats in order: HOOK, TEASE, BUILD, REVEAL, PROOF, CLOSE
2. For each beat, select a compatible pattern
3. Validate adjacency (group, background, weight)
4. Iterate if any rule violated

| # | Section | Beat | Layout Pattern | Group | Background | Weight | Adjacent Valid? |
|---|---------|------|---------------|-------|------------|--------|----------------|
| 01 | hero | HOOK | centered-hero | A | bg-primary | medium | -- |
| 02 | social-proof | TEASE | marquee-horizontal | D | bg-secondary | light | A->D: VALID |
| 03 | features | BUILD | bento-grid | C | bg-primary | heavy | D->C: VALID |
| 04 | product-demo | REVEAL | split-asymmetric | B | bg-tertiary | med-heavy | C->B: VALID |
| 05 | testimonials | PROOF | centered-stacked | A | bg-secondary | medium | B->A: VALID |
| 06 | cta | CLOSE | full-bleed-media | E | bg-accent | heavy | A->E: VALID |

**Validation Summary:**
- Groups used: A, D, C, B, A, E (5 of 6 groups for 6 sections -- PASS, needed 3+)
- Adjacent group repeats: None -- PASS
- Background alternation: primary, secondary, primary, tertiary, secondary, accent -- PASS (no adjacent repeats)
- Weight sequence: medium, light, heavy, med-heavy, medium, heavy -- no 3+ consecutive heavy -- PASS
- Beat-pattern compatibility: All assignments use compatible beats -- PASS

---

### Worked Example 2: 10-Section Product Landing Page

A comprehensive product page with 10 sections. Needs at least `ceil(10/2) = 5` groups.

| # | Section | Beat | Layout Pattern | Group | Background | Weight | Adjacent Valid? |
|---|---------|------|---------------|-------|------------|--------|----------------|
| 01 | hero | HOOK | full-bleed-media | E | bg-primary | heavy | -- |
| 02 | logo-bar | TEASE | marquee-horizontal | D | bg-secondary | light | E->D: VALID |
| 03 | problem | BUILD | split-equal | B | bg-primary | medium | D->B: VALID |
| 04 | features | BUILD | bento-grid | C | bg-tertiary | heavy | B->C: VALID |
| 05 | breathe | BREATHE | centered-minimal | A | bg-secondary | light | C->A: VALID |
| 06 | deep-dive | REVEAL | tabbed-showcase | F | bg-primary | medium | A->F: VALID |
| 07 | demo | PEAK | full-bleed-interactive | E | bg-tertiary | heavy | F->E: VALID |
| 08 | testimonials | PROOF | masonry | C | bg-secondary | med-heavy | E->C: VALID |
| 09 | comparison | TENSION | before-after | F | bg-primary | medium | C->F: VALID |
| 10 | cta | CLOSE | centered-hero | A | bg-accent | medium | F->A: VALID |

**Validation Summary:**
- Groups used: E, D, B, C, A, F, E, C, F, A (all 6 groups represented for 10 sections -- PASS, needed 5+)
- Adjacent group repeats: None -- PASS
- Background alternation: primary, secondary, primary, tertiary, secondary, primary, tertiary, secondary, primary, accent -- PASS
- Weight sequence: heavy, light, medium, heavy, light, medium, heavy, med-heavy, medium, medium -- no 3+ consecutive heavy -- PASS
- Beat-pattern compatibility: All assignments use compatible beats -- PASS
- Group C exception used: bento-grid (04) and masonry (08) are not adjacent -- no exception needed

**Note on the Group C exception:** If this page had masonry immediately after bento-grid (sections 04 and 05), the exception would allow it because they are visually distinct. However, `uniform-grid` adjacent to either would be invalid. The exception exists for flexibility, not routine use.

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| Background tokens (`bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-accent`) | Background alternation rule (Rule 4) cycles through these tokens for visual rhythm |
| Spacing scale (levels 1-5) | Weight classification influences spacing: light patterns use generous spacing, heavy patterns can be denser |
| Motion tokens | Heavy-weight patterns (scroll-storytelling, parallax-layers) engage more motion tokens than light patterns |

### Archetype Variants

Archetypes influence pattern SELECTION (which patterns are preferred or forbidden), not the taxonomy itself.

| Archetype | Pattern Preferences | Notes |
|-----------|-------------------|-------|
| Brutalist | Favors: centered-hero, uniform-grid, split-equal. Avoids: parallax-layers, card-spotlight | Raw, direct compositions. No floating effects |
| Ethereal | Favors: centered-minimal, parallax-layers, full-bleed-media. Avoids: bento-grid, uniform-grid | Spacious, flowing. Dense grids feel heavy |
| Kinetic | Favors: scroll-storytelling, marquee-horizontal, full-bleed-interactive. Avoids: centered-minimal | Movement-oriented. Static patterns need scroll integration |
| Editorial | Favors: split-asymmetric, centered-stacked, timeline-vertical. Avoids: card-spotlight, full-bleed-interactive | Typography-led compositions. Content over interaction |
| Japanese Minimal | Favors: centered-minimal, split-equal, centered-hero. Avoids: bento-grid, masonry, card-spotlight | Maximum restraint. Fewer elements per section |
| Glassmorphism | Favors: card-spotlight, bento-grid, split-overlapping. Avoids: centered-minimal | Layer effects need surfaces. Minimal patterns have nothing to blur |
| Neo-Corporate | Favors: bento-grid, split-equal, tabbed-showcase. Avoids: scroll-storytelling | Structured, professional. Cinematic effects feel off-brand |

These are preferences, not hard rules. An archetype may use any pattern with proper creative justification. The preferences guide the section-planner's default selections.

### Pipeline Stage

- **Input from:** Emotional arc beat assignments (from emotional-arc skill) determine which beats each section serves. This skill maps beats to compatible patterns.
- **Output to:** MASTER-PLAN.md (layout assignment table), section PLAN.md files (layout_pattern/layout_group frontmatter), builder spawn prompts (pattern name + description).
- **Validation by:** Quality-reviewer compares built section structure against assigned pattern. Drift documented in GAP-FIX.md.

### Related Skills

- **emotional-arc** -- Beat assignments drive pattern selection via compatibility mappings. Beats are assigned first, then patterns selected to match.
- **design-dna** -- Background tokens from DNA feed the background alternation rule. Spacing and motion tokens influence weight classification.
- **design-archetypes** -- Archetype personality guides pattern preferences (which patterns feel right for the archetype's character).
- **anti-slop-gate** -- Layout Diversity is a scoring category. Pre-assignment via this skill ensures the diversity score is high by construction.
- **creative-sections** -- v6.1.0 creative-sections provides TSX patterns for many of these 18 layouts. This skill defines taxonomy and enforcement; creative-sections provides implementation examples.

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Taxonomy Too Coarse

**What goes wrong:** With only 5-6 named patterns, a 10-section page runs out of unique options. Adjacent sections get technically different names but look structurally similar. The page feels repetitive despite passing name-based checks.
**Instead:** Use the full 18-pattern taxonomy with 6 visual groups. The group-level adjacency check (Rule 2) catches visual similarity that name-only checks miss.

### Anti-Pattern: Patterns Named by CSS Implementation

**What goes wrong:** Patterns are named by how they are coded ("flex-row", "grid-3col", "sticky-scroll") rather than how they look. Two CSS implementations can produce identical visual compositions -- `flex` vs `grid` both produce a 50/50 split layout.
**Instead:** Name patterns by VISUAL CHARACTER ("split-equal", "centered-hero", "bento-grid"). The taxonomy describes what the viewer sees, not what the developer wrote.

### Anti-Pattern: Diversity as Review-Only

**What goes wrong:** Layout diversity is checked only after sections are built. When the quality reviewer catches repetition, sections must be rebuilt -- wasting builder effort, pipeline time, and token budget.
**Instead:** Enforce diversity STRUCTURALLY during planning. Pre-assign layout patterns in MASTER-PLAN.md with adjacency validation before any building starts. Review is the safety net for builder drift, not the primary enforcement.

### Anti-Pattern: Rigid Pattern Adherence

**What goes wrong:** Builders interpret the assigned pattern as a pixel-perfect specification and produce formulaic sections. A "bento-grid" section looks like every other bento grid on the internet. The layout pattern kills creativity rather than enabling it.
**Instead:** The pattern defines the COMPOSITIONAL APPROACH (spatial strategy, zone arrangement), not the specific implementation. A "bento-grid" can be card-based, image-mosaic, or stat-heavy -- the builder has creative freedom within the pattern's structural character. Archetype personality and creative tension should shape the specific expression.

### Anti-Pattern: Background Alternation Ignored

**What goes wrong:** Two sections with different layout patterns but the same dark background appear back-to-back. Despite structural diversity, the viewer experiences a single unbroken dark zone. The visual rhythm flattens.
**Instead:** Enforce background token alternation (Rule 4) alongside layout pattern diversity. Cycle through `bg-primary`, `bg-secondary`, `bg-tertiary`, and `bg-accent`. Visual rhythm requires both structural and tonal variation.

### Anti-Pattern: Consecutive Heavy Weight Patterns

**What goes wrong:** Three or more heavy patterns in sequence (e.g., bento-grid -> scroll-storytelling -> full-bleed-interactive) creates visual fatigue. The viewer has no breathing room -- every section demands maximum attention.
**Instead:** Enforce weight variation (Rule 5). Intersperse heavy patterns with light or medium patterns. The BREATHE beat naturally creates a light moment, but verify the weight sequence explicitly regardless of beat assignment.

### Anti-Pattern: Overusing Group C Exception

**What goes wrong:** The exception allowing bento-grid adjacent to masonry becomes the default rather than an occasional flexibility. Half the page becomes grid layouts with slightly different cell arrangements.
**Instead:** Use the Group C exception only when the page's content genuinely demands adjacent grid sections AND there is no better pattern available for either section. The exception exists for edge cases, not convenience.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| patterns_per_group | 3 | 3 | count | HARD -- taxonomy is fixed at 18 patterns / 6 groups |
| groups_used_min | ceil(N/2) | 6 | groups (N = section count) | HARD -- reject MASTER-PLAN.md if insufficient group diversity |
| adjacent_same_group | 0 | 0 | occurrences | HARD -- reject if adjacent sections share group (except Rule 3) |
| adjacent_same_bg | 0 | 0 | occurrences | HARD -- reject if adjacent sections share background token |
| consecutive_heavy_max | 1 | 2 | sections | HARD -- reject if 3+ consecutive heavy patterns |
| background_tokens_min | 3 | 4 | tokens | SOFT -- warn if fewer than 3 distinct bg tokens used across page |
