---
name: "quality-gate-v2"
description: "72-point quality gate reference — 12 categories x 6 criteria, scored 0-3, with weights, named tiers, penalty system, hard gates, and 3-tier enforcement model"
tier: "core"
triggers: "quality review, audit, scoring, anti-slop"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Post-build quality review** -- Score a completed section against 72 criteria across 12 categories
- **Pre-ship audit** -- Verify the entire project meets the target tier before launch
- **Iterate loop** -- Diagnose weak categories after a `/modulo:iterate` cycle to focus improvements
- **Anti-slop enforcement** -- Catch generic, low-effort, or inconsistent output before it ships
- **Builder self-check** -- Builders reference this during execution to avoid common penalty triggers

### When NOT to Use

- **During discovery/planning** -- Quality scoring applies to built output, not plans
- **For design direction** -- Use design-archetypes and design-dna for creative decisions
- **For single-component review** -- Use component-consistency for isolated component audits

### Decision Tree

- If scoring a full section -> run all 12 categories, apply weights, check hard gates
- If scoring a component -> run relevant subset (Color, Typography, Depth, Accessibility)
- If build fails hard gates -> block deployment, fix before re-scoring
- If score is Reject tier -> re-execute the section from PLAN.md, do not patch
- If score is Baseline tier -> targeted fixes on lowest-scoring categories first

### Pipeline Connection

- **Referenced by:** quality-reviewer agent during `/modulo:iterate` and post-build review
- **Referenced by:** builder agent for self-check during `/modulo:execute`
- **Consumed at:** `/modulo:iterate` workflow step 3 (quality scoring)
- **Consumed at:** `/modulo:execute` wave completion gates

---

## Scoring Overview

### Structure

- **12 categories** with **6 criteria each** = **72 scored criteria**
- Each criterion scored **0-3**: 0 = missing/broken, 1 = present but generic, 2 = good/intentional, 3 = award-worthy
- Raw max per category: 18 (6 x 3)
- Categories carry **weight multipliers** (see below)
- **Weighted max: ~248 points** (varies slightly by rounding)
- Penalties are subtracted after weighted scoring
- Hard gates are pass/fail -- any failure blocks the score entirely

---

## Full Criteria by Category

### 1. Color System (Weight: 1.2x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | Token adherence | Hardcoded colors | Mostly tokens, some raw | All colors from DNA tokens | Tokens + contextual semantic usage |
| 2 | Contrast ratios | Fails WCAG AA | Passes AA on body text only | Passes AA everywhere | Passes AAA on key content |
| 3 | Surface hierarchy | Flat, no layering | 2 surface levels | 3+ levels with clear depth | Surface system creates visual narrative |
| 4 | Accent deployment | No accent or overused | Accent present but arbitrary | Accent marks key actions/elements | Accent creates focal rhythm across page |
| 5 | Dark/light coherence | Only one mode | Both modes but colors break | Both modes, well-adapted | Both modes feel intentionally designed |
| 6 | Expressive tokens | Not used | 1-2 expressive tokens used | Glow/tension/highlight deployed | All 4 expressive tokens create mood |

### 2. Typography (Weight: 1.2x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | Scale compliance | Random sizes | Mostly on-scale | All sizes from 8-level scale | Scale creates clear visual hierarchy |
| 2 | Font pairing | System fonts or mismatch | Display/body set but generic | Intentional pairing with contrast | Pairing reinforces archetype personality |
| 3 | Line-height/spacing | Browser defaults | Set but inconsistent | Consistent, readable | Typographic rhythm creates flow |
| 4 | Responsive scaling | Same size all breakpoints | 2 breakpoint adjustments | fluid/clamp across 4 breakpoints | Type feels native at every width |
| 5 | Hierarchy clarity | Everything same weight | H1 vs body distinction only | 4+ distinct hierarchy levels | Hierarchy guides eye in scan order |
| 6 | Special treatments | None | Basic bold/italic | Display type with character | Kinetic type, variable fonts, or cutlines |

### 3. Layout & Composition (Weight: 1.1x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | Grid system | No grid, ad-hoc widths | Basic container centering | Consistent grid with columns | Grid creates rhythm, breaks are intentional |
| 2 | Whitespace | Cramped or random | Consistent but generic | Spacing scale applied throughout | Whitespace is compositional, creates breathe |
| 3 | Visual weight balance | Lopsided or cluttered | Roughly centered | Balanced with intentional asymmetry | Dynamic balance creates movement |
| 4 | Section flow | Sections feel disconnected | Basic stacking | Sections transition smoothly | Emotional arc visible in layout progression |
| 5 | Content density | Too sparse or too packed | Acceptable density | Density matches content type | Density shifts per beat (breathe vs peak) |
| 6 | Alignment precision | Misaligned elements | Major elements aligned | All elements on grid | Subpixel precision, optical alignment |

### 4. Depth & Polish (Weight: 1.1x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | Shadow system | No shadows or browser default | Basic box-shadow | Layered shadows with elevation | Shadows create spatial narrative |
| 2 | Border/divider craft | No borders or 1px solid gray | Consistent borders | Borders match DNA border token | Borders/dividers are design elements |
| 3 | Image treatment | Raw images, no treatment | Consistent aspect ratios | Rounded, masked, or framed | Images have signature treatment |
| 4 | Micro-details | No polish | Hover states present | Transitions, focus rings, scrollbars | Details surprise and delight |
| 5 | Loading states | No loading consideration | Basic spinner | Skeleton screens | Branded loading experience |
| 6 | Empty states | No empty state | Generic "no data" text | Illustrated empty state | Empty state encourages action with personality |

### 5. Motion & Interaction (Weight: 1.0x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | Entrance animations | No entrance animation | Basic fade-in | Staggered, directional entrances | Cinematic entrances match beat tier |
| 2 | Scroll-driven motion | No scroll interaction | Basic scroll-triggered fade | Parallax or scroll-linked transforms | Scroll creates narrative progression |
| 3 | Hover/focus feedback | No hover states | Color change on hover | Transform + transition on hover | Micro-interactions feel physical |
| 4 | Easing quality | Linear or default ease | ease-in-out applied | Custom cubic-bezier per element type | Easing matches archetype personality |
| 5 | Motion coherence | Random motion directions | Consistent direction | Motion system with shared config | Motion tells a story across sections |
| 6 | Reduced motion | No consideration | Animations disabled | Reduced but present alternative | Alternative design, not just disable |

### 6. Creative Courage (Weight: 1.2x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | Signature element | None present | Attempted but generic | Clear signature element | Signature element is memorable and unique |
| 2 | Creative tension | No tension | 1 tension point attempted | 1-2 well-placed tension zones | 3 tension zones, different types, all land |
| 3 | Archetype commitment | Generic/no archetype feel | Surface-level archetype | Archetype drives layout and type | Archetype permeates every decision |
| 4 | Unexpected moments | Fully predictable layout | 1 surprise element | 2-3 unexpected design choices | Viewer says "I've never seen that before" |
| 5 | Visual storytelling | No narrative | Implied narrative | Clear visual story arc | Emotional journey, not just information |
| 6 | Risk-taking | Safe, template-like | 1 bold choice | Multiple bold choices that work | Pushes the medium forward |

### 7. UX Intelligence (Weight: 1.1x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | CTA clarity | No clear CTA | CTA present but generic | CTA prominent with clear value prop | CTA placement is strategic per beat |
| 2 | Navigation intuition | Confusing navigation | Standard nav pattern | Nav enhances content discovery | Nav is a design feature itself |
| 3 | Information hierarchy | Flat information dump | Basic H1 > H2 > body | Scannable with multiple entry points | Progressive disclosure matches user intent |
| 4 | Form experience | Raw HTML forms | Styled forms | Validated, accessible forms | Forms are delightful with smart defaults |
| 5 | Error handling | No error handling | Basic error messages | Contextual, helpful errors | Errors guide to resolution with personality |
| 6 | Scroll UX | No scroll consideration | Scroll depth is reasonable | Scroll indicators, back-to-top | Scroll experience is designed (snap, progress) |

### 8. Accessibility (Weight: 1.1x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | Semantic HTML | div soup | Some semantic tags | Full semantic structure | Landmarks, regions, ARIA where needed |
| 2 | Keyboard navigation | Not keyboard accessible | Tab order works | Focus visible, skip links | Full keyboard experience, focus trapping |
| 3 | Screen reader | No alt text, no labels | Alt text on images | ARIA labels, live regions | Screen reader experience is designed |
| 4 | Color independence | Info conveyed by color only | Icons supplement color | Multiple redundant indicators | Works fully without color |
| 5 | Touch targets | Tiny click targets | 44px minimum on buttons | 44px on all interactive elements | Touch targets generous, well-spaced |
| 6 | Focus indicators | No focus ring | Browser default focus | Custom focus ring matching DNA | Focus indicators are a design feature |

### 9. Content Quality (Weight: 1.0x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | Headline craft | Lorem ipsum / generic | Functional headlines | Headlines have voice and hook | Headlines would work as ad copy |
| 2 | Body copy | Placeholder text | Real but generic copy | Clear, concise, on-brand | Copy creates desire and understanding |
| 3 | Microcopy | No microcopy | Basic labels | Helpful, contextual microcopy | Microcopy has personality and reduces friction |
| 4 | Content hierarchy | Wall of text | Paragraphs broken up | Subheads, lists, callouts | Content structure aids scanning and reading |
| 5 | Image/media selection | Stock photos or missing | Relevant images | High-quality, on-brand media | Media tells the story better than text could |
| 6 | Social proof | No social proof | Generic testimonials | Real, specific testimonials | Social proof is strategically placed per beat |

### 10. Responsive Craft (Weight: 1.0x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | Mobile layout | Broken on mobile | Stacks but cramped | Clean mobile layout | Mobile-first, feels native |
| 2 | Tablet adaptation | Ignored | Scales between mobile/desktop | Tablet-specific layout | Tablet uses space uniquely |
| 3 | Desktop presence | Narrow or stretched | Reasonable max-width | Full desktop experience | Desktop has features mobile doesn't |
| 4 | Ultrawide handling | Content stretches or tiny | Max-width container | Ultrawide layout considered | Ultrawide has unique composition |
| 5 | Image responsiveness | Fixed-size images | srcSet present | Art direction per breakpoint | Images are optimized and visually perfect |
| 6 | Touch vs pointer | No distinction | Basic touch works | Touch gestures supported | Touch and pointer each get ideal UX |

### 11. Performance (Weight: 1.0x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | Image optimization | Unoptimized images | next/image or equivalent | WebP/AVIF with blur placeholder | Lazy + priority + sized + art directed |
| 2 | Bundle awareness | Imports everything | Code-split routes | Dynamic imports for heavy libs | Every import justified and tree-shaken |
| 3 | Font loading | FOUT with no strategy | font-display: swap | Preloaded, subset fonts | Variable fonts, size-adjust, no layout shift |
| 4 | Animation performance | Layout-triggering animations | Transform-based animations | GPU-accelerated, will-change | RequestAnimationFrame, no jank at 60fps |
| 5 | Core Web Vitals | Poor LCP/CLS/INP | Needs improvement | Good on all three | All green with headroom |
| 6 | SSR/streaming | Client-only rendering | SSR present | Streaming SSR with suspense | Optimal server/client split |

### 12. Integration Quality (Weight: 1.0x)

| # | Criterion | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | DNA token usage | Hardcoded values | Partial token usage | Full token usage | Tokens create systematic flexibility |
| 2 | Component registry | Ad-hoc components | Some shared components | Full registry compliance | Registry enables instant theming |
| 3 | Archetype adherence | No archetype visible | Surface-level archetype | Archetype guides decisions | Archetype is inseparable from design |
| 4 | Beat compliance | Sections ignore arc | Beats labeled but not enforced | Beat constraints met | Beats create emotional progression |
| 5 | Cross-section harmony | Sections feel like different sites | Consistent color/type | Shared motion, spacing, rhythm | Sections feel like chapters of one story |
| 6 | Code quality | Spaghetti code | Readable but not organized | Well-structured, named exports | Self-documenting, maintainable, idiomatic |

---

## Category Weights

| Category | Weight | Raw Max (6x3) | Weighted Max |
|----------|--------|---------------|-------------|
| Color System | 1.2x | 18 | 21.6 |
| Typography | 1.2x | 18 | 21.6 |
| Creative Courage | 1.2x | 18 | 21.6 |
| Layout & Composition | 1.1x | 18 | 19.8 |
| Depth & Polish | 1.1x | 18 | 19.8 |
| UX Intelligence | 1.1x | 18 | 19.8 |
| Accessibility | 1.1x | 18 | 19.8 |
| Motion & Interaction | 1.0x | 18 | 18.0 |
| Content Quality | 1.0x | 18 | 18.0 |
| Responsive Craft | 1.0x | 18 | 18.0 |
| Performance | 1.0x | 18 | 18.0 |
| Integration Quality | 1.0x | 18 | 18.0 |
| **Total** | | **216** | **~234** |

> Weighted max rounds to approximately 234 before penalties. Tiers are calibrated to this range.

---

## Named Tiers

| Tier | Score Range | Meaning |
|------|------------|---------|
| **Reject** | < 140 | Fundamental issues. Re-execute from PLAN.md. |
| **Baseline** | 140 - 169 | Functional but generic. Needs targeted improvement. |
| **Strong** | 170 - 199 | Good quality. Ready for client review with notes. |
| **SOTD-Ready** | 200 - 219 | Awwwards Site of the Day caliber. Ship-worthy. |
| **Honoree** | 220 - 234 | Exceptional. Awwwards Honoree / top 1% quality. |
| **SOTM-Ready** | 235+ | Extraordinary. Requires near-perfect scoring + zero penalties. |

---

## Penalty Table

Penalties are subtracted from the weighted total after scoring. Multiple penalties stack.

| # | Penalty | Points | Trigger |
|---|---------|--------|---------|
| 1 | Missing signature element | -8 | No unique visual signature present |
| 2 | Forbidden pattern used | -10 | Archetype-forbidden technique deployed |
| 3 | No creative tension | -6 | Zero tension zones in the section |
| 4 | Generic CTA | -3 | "Learn More", "Click Here", "Submit" without specificity |
| 5 | Mixed icon sets | -4 | Icons from multiple libraries/styles in same view |
| 6 | Default focus styles | -4 | Browser-default focus ring, no custom styling |
| 7 | Linear easing only | -2 | All animations use `linear` or `ease` |
| 8 | Hardcoded color value | -3 | Per instance of raw hex/rgb instead of DNA token |
| 9 | Missing empty state | -3 | Dynamic content area with no empty state |
| 10 | Placeholder content | -10 | Lorem ipsum, placeholder.com images, "coming soon" |
| 11 | No UTK (Unique Type Kill) | -5 | No display font or special typographic treatment |
| 12 | Token exposed in UI | -15 | API key, secret, or internal token visible in output |
| 13 | Component mismatch | -4 | Same component type with different dimensions across sections |
| 14 | No entrance animation | -3 | Section loads with no motion at all |
| 15 | Squished mobile layout | -5 | Content overlaps or truncates below 375px |
| 16 | Feature without fallback | -3 | Modern CSS/JS feature with no fallback for target compat tier |
| 17 | Horizontal scroll | -5 | Unintended horizontal overflow at any breakpoint |

---

## Hard Gates

Hard gates are binary pass/fail. **Any failure blocks scoring entirely** -- the section must be fixed before a score is assigned.

| # | Gate | Requirement |
|---|------|-------------|
| 1 | Motion exists | At least one entrance animation and one scroll-triggered animation present |
| 2 | 4-breakpoint responsive | Layout tested and functional at 375px, 768px, 1024px, and 1440px |
| 3 | Compat tier respected | No features used beyond the project's declared compatibility tier |
| 4 | Component registry compliance | All component instances match their registered variant dimensions |

---

## 3-Tier Enforcement Model

### Tier 1: Build-Time (Pre-Commit Hook)

Runs automatically before every commit. Checks machine-verifiable rules:

- DNA token usage (no hardcoded colors)
- Component registry dimension compliance
- Semantic HTML structure (no div-only markup)
- Image alt text presence
- Focus-visible styles present
- No placeholder content patterns (lorem ipsum detection)

**Action on failure:** Commit blocked. Builder fixes before retrying.

### Tier 2: Post-Build Quality Review

Runs after wave completion. The quality-reviewer agent scores all 72 criteria:

- Full 12-category scoring pass
- Penalty assessment
- Hard gate verification
- Comparison against target tier
- Category-level breakdown for targeted fixes

**Action on failure:** Generates fix list prioritized by (weight x deficit). Builder addresses in next wave.

### Tier 3: Visual Verification (Playwright + Companion)

Optional but recommended for SOTD+ targets. Automated visual checks:

- Screenshot comparison at 4 breakpoints
- Animation presence detection (Playwright observers)
- Color contrast automated testing
- Layout shift measurement (CLS)
- Interactive element reachability (tab-through test)
- Responsive overflow detection (horizontal scroll check)

**Action on failure:** Generates visual diff report. Reviewer annotates specific pixels/regions.

---

## Layer 2: Award-Winning Examples

### Scoring Example: Hero Section

Imagine a hero section for a SaaS landing page using the **Kinetic** archetype:

```
Category: Color System (weight 1.2x)
  Token adherence:     3 -- All colors from DNA, semantic usage
  Contrast ratios:     2 -- Passes AA everywhere
  Surface hierarchy:   2 -- Background + card surface + overlay
  Accent deployment:   3 -- Accent on CTA and key metric, creates rhythm
  Dark/light:          1 -- Dark mode exists but accent doesn't adapt
  Expressive tokens:   2 -- Glow on CTA, highlight on stat
  Raw: 13/18 x 1.2 = 15.6

Category: Creative Courage (weight 1.2x)
  Signature element:   3 -- Animated mesh gradient unique to brand
  Creative tension:    2 -- Scale violence on headline (180px display)
  Archetype commit:    3 -- Kinetic personality in every bounce/spring
  Unexpected moments:  2 -- Stats counter uses physics-based animation
  Visual storytelling: 2 -- Hero tells "speed" story through motion
  Risk-taking:         2 -- Bold but not groundbreaking
  Raw: 14/18 x 1.2 = 16.8

... (continue for all 12 categories)

Subtotal (all categories weighted): 207.4
Penalties: Generic CTA "Get Started" (-3)
Final Score: 204.4 -> SOTD-Ready tier
```

### Reference Sites

- **Linear** (linear.app) -- Exceptional motion coherence, every interaction feels like the same physics engine. Creative Courage score: 16+
- **Vercel** (vercel.com) -- Typography hierarchy and responsive craft set the standard. Clean 4-breakpoint adaptation.
- **Stripe** (stripe.com) -- Depth & Polish mastery: gradients, shadows, micro-details all systematic
- **Lusion** (lusion.co) -- Creative Courage ceiling: every project pushes what browsers can do
- **Apple** (apple.com) -- Content Quality benchmark: every word earns its place, media tells stories text cannot

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Quality Gate |
|-----------|----------------------|
| All color tokens | Scored in Color System category, criterion 1 |
| Display/body fonts | Scored in Typography category, criteria 1-2 |
| Type scale (8 levels) | Scored in Typography category, criterion 1 |
| Spacing scale (5 levels) | Scored in Layout category, criterion 2 |
| Signature element | Hard-scored in Creative Courage + penalty if missing |
| Motion tokens (8+) | Scored in Motion category, all criteria |

### Pipeline Stage

- **Input from:** Built sections (TSX/CSS output from `/modulo:execute`)
- **Output to:** Fix list with prioritized category deficits -> `/modulo:iterate`

### Related Skills

- **baked-in-defaults** -- Ensures motion/responsive/compat blocks exist in PLAN.md (prevents hard gate failures)
- **component-consistency** -- Feeds into hard gate #4 and Integration Quality criterion 2
- **anti-slop-gate** -- Predecessor to this gate; quality-gate-v2 is the comprehensive replacement
- **emotional-arc** -- Beat assignments affect expected scores in Creative Courage and Motion
- **design-dna** -- Token system is the foundation for Color System and Integration Quality scoring

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Score Inflation

**What goes wrong:** Reviewer gives 2s across the board to avoid conflict, resulting in a "Strong" score that doesn't reflect actual quality. Generic scoring defeats the purpose of the gate.
**Instead:** Score each criterion independently. A 2 means "good and intentional" -- if you can't point to the specific intentional choice, it's a 1. Use the 0-3 rubric descriptions literally.

### Anti-Pattern: Penalty-Only Focus

**What goes wrong:** Builder focuses exclusively on avoiding penalties (no lorem ipsum, no hardcoded colors) while ignoring positive scoring. Result: a penalty-free 150 (Baseline) instead of a penalized 210 (SOTD-Ready).
**Instead:** Penalties are a floor check. The real score comes from positive criteria. Aim for 2+ in Creative Courage and Color System first -- those carry 1.2x weight.

### Anti-Pattern: Hard Gate Deferral

**What goes wrong:** Builder says "I'll add responsive later" or "motion is a polish task." Hard gates block scoring entirely -- deferring them means no score, no feedback, no iteration signal.
**Instead:** Hard gates are wave-0 concerns. Motion and responsive blocks must be in the PLAN.md before building starts (see baked-in-defaults skill).

### Anti-Pattern: Category Cherry-Picking

**What goes wrong:** Builder maxes out easy categories (Performance, Accessibility) while ignoring weighted ones (Creative Courage, Color System, Typography). Mathematically suboptimal.
**Instead:** Prioritize by (weight x current deficit). A 1-point improvement in a 1.2x category is worth more than in a 1.0x category. Creative Courage, Color, and Typography should be attacked first.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| total_score (SOTD target) | 200 | - | points | HARD -- below 200 is not SOTD-Ready |
| total_score (ship minimum) | 140 | - | points | HARD -- below 140 is Reject |
| penalties_max | - | 30 | points | SOFT -- more than 30 penalties suggests systemic issues |
| hard_gates_passed | 4 | 4 | count | HARD -- all 4 must pass before scoring |
| per_category_minimum | 8 | - | raw points | SOFT -- any category below 8/18 is a red flag |
| creative_courage_minimum | 10 | - | raw points | HARD -- below 10/18 is not award-caliber |
