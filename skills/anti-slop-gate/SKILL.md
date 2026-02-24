---
name: anti-slop-gate
description: "35-point weighted quality scoring across 7 categories. Post-review enforcement with named quality tiers and specific remediation on failure."
tier: core
triggers: "anti-slop, quality gate, quality check, design quality, slop check, verify quality, scoring"
version: "2.0.0"
---

## Layer 1: Decision Guidance

The Anti-Slop Gate is a **POST-REVIEW** quality enforcement system. It does NOT run inline during building. Section builders focus on building; the gate runs during `/modulo:verify` via the quality-reviewer agent.

This separation is intentional: builders spending tokens on scoring during construction wastes 30%+ of their context on evaluation instead of craft. The gate runs once, thoroughly, after all sections in a wave are complete.

### When the Gate Runs

- **After ALL sections in a wave are built** -- never mid-build, never per-section during construction
- **During `/modulo:verify` command** -- the user-facing entry point for quality review
- **Quality-reviewer agent executes the scoring protocol** -- reads this skill, scores each category, produces the output report
- **Results are presented to the user** with full transparency -- every point, every deduction, every reasoning

### When NOT to Run the Gate

- During section building (builders should not self-score)
- As a pre-build checklist (that is the Design DNA's job)
- On partial builds (wait until a wave is complete)
- On scaffold-only output (Wave 0 tokens/scaffold exempt)

### How Scoring Works

Seven categories with **weighted** point distribution -- not a flat 5 per category. Design craft categories (Typography, Depth & Polish) carry the highest weight at 6 points each, reflecting that craft fundamentals are the hardest to achieve and the most visible indicator of quality. UX Intelligence carries the lowest weight at 3 points because functional quality is a baseline expectation, not a differentiator.

- **Total: 35 points** across 7 categories
- **Penalties applied AFTER** the 35-point total for specific violations
- **Final score = base score (out of 35) minus penalties**
- Penalties can push a passing score below the fail threshold

### Named Quality Tiers

| Tier | Score Range | Meaning | Action |
|------|------------|---------|--------|
| Honoree-Level | 33-35 | Exceptional -- Awwwards Honoree territory | Ship with pride |
| SOTD-Ready | 30-32 | Site of the Day competitive | Ship confidently |
| Strong | 28-29 | Solid premium quality | Ship, minor polish recommended |
| Pass | 25-27 | Meets minimum quality bar | Ship, but review improvement areas |
| FAIL | <25 | Below quality standard | Mandatory rework -- remediation required |

### Decision Tree

- Score >= 25 (no penalties): **PASS** -- proceed to next phase or ship
- Score >= 25 but penalties reduce below 25: **FAIL** -- penalties represent fundamental violations
- Score < 25 (before penalties): **FAIL** -- base quality insufficient, generate remediation tasks
- Score >= 30: Quality-reviewer also runs Awwwards 4-axis prediction (separate system)

### Gate vs. Awwwards 4-Axis

These are **separate systems** that both run during `/modulo:verify`:

| System | Purpose | Output | Threshold |
|--------|---------|--------|-----------|
| Anti-Slop Gate | Enforcement (pass/fail) | Score /35, tier, remediation | 25 minimum |
| Awwwards 4-Axis | Aspiration (quality prediction) | 4 scores /10, SOTD prediction | 8.0+ average |

Gate runs first. If it fails, Awwwards scoring is skipped -- fix fundamentals before aspirational scoring.

### Pipeline Connection

- **Referenced by:** quality-reviewer agent during `/modulo:verify`
- **Consumed at:** verify command workflow step 2 (after existence check, before Awwwards scoring)
- **Input from:** completed section builds (HTML/TSX output, SUMMARY.md files)
- **Output to:** user-facing score report, remediation tasks if failed

---

## Layer 2: Award-Winning Examples

This layer IS the scoring system. The 35-point breakdown is the core knowledge this skill provides -- each check with its point value, description, and verification method.

### Score Summary

| Category | Points | Weight % | Focus |
|----------|--------|----------|-------|
| Colors | 5 | 14% | Token compliance, palette expressiveness |
| Typography | 6 | 17% | Craft fundamentals (highest weight) |
| Layout | 5 | 14% | Compositional diversity |
| Depth & Polish | 6 | 17% | Craft fundamentals (highest weight) |
| Motion | 5 | 14% | Choreography, scroll-driven quality |
| Creative Courage | 5 | 14% | Wow factor, signature boldness |
| UX Intelligence | 3 | 9% | Functional quality (lowest weight) |
| **Total** | **35** | **100%** | |

### Category 1: Colors (5 points)

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| C1 | Uses DNA color tokens exclusively -- no arbitrary hex/rgb values | 2 | Grep source for hex values (`#[0-9a-f]{3,8}`) and rgb/hsl literals not defined in DNA palette. Zero tolerance for hardcoded colors outside DNA. |
| C2 | Primary, secondary, and accent colors all visible and distinct from each other | 1 | Visual inspection: can you identify 3 clearly different accent/brand colors on the page? If everything is one hue, this fails. |
| C3 | Expressive tokens used -- at least one of: glow, tension, highlight, or signature color | 1 | Grep for `--color-glow`, `--color-tension`, `--color-highlight`, `--color-signature` in the output CSS/classes. At least one must appear. |
| C4 | Color contrast meets WCAG AA minimums (4.5:1 for normal text, 3:1 for large text and UI components) | 1 | Run automated contrast checker on text-over-background combinations. Flag any pair below ratio. |

### Category 2: Typography (6 points) -- HIGHEST WEIGHT

Typography is the single most impactful design decision. A distinctive type system immediately separates premium work from AI slop. This category carries the highest weight alongside Depth & Polish.

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| T1 | Display font is distinctive -- not Inter, Roboto, Open Sans, or system-ui for headings | 2 | Font audit: inspect `font-family` on h1-h3 elements. Must be a curated display typeface from the DNA-approved list. System fonts as display = automatic 0 on this check. |
| T2 | Three or more font weights visible with clear visual hierarchy | 1 | Visual check: bold/black headings, medium subheadings, regular body text. If everything is one weight, this fails. |
| T3 | Letter-spacing tuned per context -- tighter on display headings, relaxed or widened on labels/caps/small text | 1 | Inspect CSS: headings should show negative tracking (`tracking-tight`, `tracking-tighter`, or `letter-spacing: -0.02em` to `-0.05em`). Small caps/labels should show positive tracking (`tracking-wide`, `tracking-widest`). |
| T4 | Line heights varied by role -- tight on display headings (1.0-1.2), comfortable on body (1.5-1.7) | 1 | Inspect CSS: headings should use `leading-none` to `leading-tight` (1.0-1.25). Body should use `leading-relaxed` to `leading-loose` (1.625-2.0). If everything shares one line-height, this fails. |
| T5 | At least one typographic surprise present | 1 | Visual check for any of: gradient text, variable font animation, oversized display heading (8xl+), text-stroke/outline, mixed serif + sans-serif pairing, text masking, split-color text. Must be intentional and prominent. |

### Category 3: Layout (5 points)

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| L1 | No two adjacent sections share the same layout pattern | 2 | Visual comparison: walk through consecutive sections. Hero followed by card grid followed by card grid = fail. Each section must use a structurally different composition. |
| L2 | Asymmetric or dynamic composition present -- not all centered stacks or symmetric grids | 1 | At least one section uses: asymmetric columns (60/40, 70/30), offset elements, diagonal flow, or non-centered alignment. |
| L3 | Negative space used intentionally -- not just uniform padding on all elements | 1 | Check for varied spacing between sections and elements. Sections should breathe differently based on content density and emotional beat. Large gaps between major sections, tight spacing within groups. |
| L4 | Grid-breaking moment exists -- at least one element that disrupts the expected grid | 1 | Visual check for: element overlapping its container, full-bleed image/background breaking the content width, element positioned outside the grid columns, overlapping sections. |

### Category 4: Depth & Polish (6 points) -- HIGHEST WEIGHT

Surface quality separates finished work from prototypes. This category measures the micro-details and layering that create visual richness. Tied with Typography for highest weight.

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| D1 | Shadows are layered -- 2-3 shadow layers creating realistic depth, not a single `shadow-md` | 2 | Grep for multi-value box-shadow declarations or stacked shadow utilities. Single `shadow-sm`/`shadow-md`/`shadow-lg` alone = 0 points. Must show layered shadow composition. |
| D2 | Borders are subtle -- opacity-based, gradient, or DNA-token-derived, not solid gray lines | 1 | Inspect border declarations: should use `border-white/10`, `border-primary/20`, gradient borders via wrapper technique, or DNA border tokens. Solid `border-gray-200` = fail. |
| D3 | Glass/frost/blur effect OR texture element present somewhere on the page | 1 | Grep for `backdrop-blur`, `backdrop-saturate`, or noise/grain texture overlay (SVG filter or CSS background). At least one surface must show material quality beyond flat color. |
| D4 | Corner radii varied by element type -- not the same radius everywhere | 1 | Inspect border-radius across element types: buttons, cards, badges, images, containers should use different radius values appropriate to their size and role. Uniform `rounded-lg` on everything = fail. |
| D5 | Two or more micro-details present from this list: noise texture overlay, gradient borders, custom selection color, subtle dot/line pattern, inner glow, colored shadow matching element, custom scrollbar styling | 1 | Visual and code inspection for at least 2 distinct micro-details. These are the finishing touches that communicate craft. |

### Category 5: Motion (5 points)

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| M1 | Entrance animations present and varied -- at least 2 different animation types across sections | 2 | Check animation implementations: fade-up on one section, scale-in on another, slide-from-left on a third. If every element uses identical `fade-up`, this loses 1 point (gets 1/2). |
| M2 | Hover states are designed, not default -- interactive elements respond with intentional visual feedback | 1 | Check buttons, cards, links: hover should produce scale, shadow change, color shift, border animation, or background transition. Simple `opacity-80` or `brightness-110` alone = fail. |
| M3 | At least one scroll-triggered animation present -- element animates in response to scroll position | 1 | Check for IntersectionObserver-based reveals, scroll-driven CSS animations (`animation-timeline: scroll()`), or GSAP ScrollTrigger usage. Static pages with no scroll response = fail. |
| M4 | Animation timing uses DNA motion tokens -- not hardcoded duration/easing values | 1 | Grep for DNA motion CSS variables (`--motion-duration-*`, `--motion-easing-*`) or DNA-derived Tailwind motion utilities. Hardcoded `duration-300` or `ease-in-out` without token reference = fail. |

### Category 6: Creative Courage (5 points)

This category measures whether the output has genuine creative ambition or plays it safe with generic patterns.

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| CC1 | DNA-defined signature element is present and visually prominent | 2 | The signature element defined in DESIGN-DNA.md (e.g., `diagonal-cut`, `floating-orbs`, `grain-overlay`) must be visible on the page and prominent enough to be noticed without searching. Missing = 0 points + penalty (see Penalty System). |
| CC2 | At least one "wow moment" -- something that would make a user pause scrolling or want to screenshot | 1 | Subjective assessment: is there a single moment on the page that is genuinely impressive? An unexpected interaction, a stunning visual, a clever transition? If everything is competent but nothing surprises, this fails. |
| CC3 | Creative tension moment present -- an intentional, documented rule-break from the archetype | 1 | Check section SUMMARY.md files for documented tension overrides. At least one section must intentionally break an archetype rule (scale violence, material collision, temporal disruption, etc.) with documented rationale. |
| CC4 | Something defies generic patterns -- an element or interaction that you would not find in a standard template | 1 | Visual check: is there anything on this page that a generic template builder would never produce? Custom cursor, unique loading state, unconventional navigation, bold typography treatment, unexpected layout. |

### Category 7: UX Intelligence (3 points)

Functional quality is the baseline expectation. These points verify that award-worthy visuals do not sacrifice usability.

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| U1 | Navigation has current-page indicator with distinct, visible styling | 1 | Check nav component: active page link must be visually differentiated (not just `font-bold` -- use color, underline, background, or indicator element). |
| U2 | Interactive elements provide visual feedback within 100ms of interaction | 1 | Test buttons, links, toggles: hover/active/focus states must respond immediately. No perceptible delay between input and visual response. |
| U3 | CTA hierarchy is clear with no generic text -- no "Submit", "Learn More", "Click Here", or "Get Started" | 1 | Text audit all buttons and links. Every CTA must use outcome-driven copy specific to the action (e.g., "Start your project" not "Get Started", "See the collection" not "Learn More"). |

### Penalty System

Penalties are deducted from the base 35-point score. They represent violations severe enough to override category scoring -- a site cannot be premium if it commits these errors.

| Violation | Penalty | Condition | How to Detect |
|-----------|---------|-----------|---------------|
| Missing signature element | -3 | DNA-defined signature element not visible in ANY section on the page | Visual scan + grep for signature element CSS class/component across all section files |
| Archetype forbidden pattern | -5 | Any CSS pattern from the archetype's forbidden list is present | Grep for each item in the archetype's `forbidden-patterns` list (defined in Design Archetypes skill) |
| System font as display | -5 | Inter, Roboto, Open Sans, Arial, Helvetica, or system-ui used as the primary display/heading font | Font audit on h1-h3. Exception: only if the archetype explicitly requires a system font (rare) |
| No creative tension | -5 | Zero tension moments documented across ALL sections on the page | Check all section SUMMARY.md files for tension documentation. No tension overrides found = penalty applies |
| Generic CTA text | -2 each | Each instance of "Submit", "Learn More", "Click Here", "Get Started", "Read More", "Sign Up" | Text grep across all button/link text content. Maximum total penalty: -6 (capped at 3 instances) |

**Penalty cap on generic CTAs:** Maximum -6 from CTA violations (3 instances at -2 each). Beyond 3, the issue is systemic and covered by the U3 check scoring 0.

**Penalty stacking:** All penalties stack. A page with a missing signature element (-3), a forbidden pattern (-5), and two generic CTAs (-4) loses 12 points from penalties alone, turning even a 35/35 base score into 23/35 -- a FAIL.

### Scoring Output Template

This is the exact markdown format the quality-reviewer agent produces:

```markdown
## Anti-Slop Gate Results

**Page:** [page name or route]
**Wave:** [wave number]
**Date:** [YYYY-MM-DD]

**Base Score: XX/35**
**Penalties: -Y**
**Final Score: XX/35**
**Tier: [Honoree-Level | SOTD-Ready | Strong | Pass | FAIL]**
**Result: PASS / FAIL**

### Category Breakdown

| Category | Score | Max | Notes |
|----------|-------|-----|-------|
| Colors | X | 5 | [C1: pass/fail, C2: pass/fail, C3: pass/fail, C4: pass/fail] |
| Typography | X | 6 | [T1-T5 status] |
| Layout | X | 5 | [L1-L4 status] |
| Depth & Polish | X | 6 | [D1-D5 status] |
| Motion | X | 5 | [M1-M4 status] |
| Creative Courage | X | 5 | [CC1-CC4 status] |
| UX Intelligence | X | 3 | [U1-U3 status] |
| **Total** | **XX** | **35** | |

### Penalties Applied

| Violation | Penalty | Evidence |
|-----------|---------|----------|
| [violation name] | -X | [specific file, line, or element where violation was found] |
| ... | ... | ... |
| **Total Penalties** | **-Y** | |

### Remediation Required (if FAIL)

Priority-ordered list of fixes. Each item identifies the specific check that failed and provides a concrete, actionable fix:

1. **[Check ID] [Check Name]** (X points recoverable)
   - **Issue:** [What was found]
   - **Fix:** [Exact action to take -- file to edit, pattern to add/remove, technique to apply]
   - **Verification:** [How to confirm the fix worked]

2. **[Penalty] [Violation Name]** (X points recoverable)
   - **Issue:** [What was found]
   - **Fix:** [Exact action]
   - **Verification:** [Confirmation method]

### Improvement Suggestions (if PASS)

Optional section for scores below SOTD-Ready (30). Lists specific upgrades that would raise the tier:

- [Category]: [Specific improvement] (+X potential points)
```

### Remediation Protocol

When the gate produces a FAIL result:

1. **Quality-reviewer generates the remediation list** from the scoring output -- every failed check becomes a fix task
2. **Fix tasks are prioritized** by point value -- highest-point failures first for maximum score recovery
3. **Penalty fixes are prioritized above category fixes** -- penalties represent fundamental violations
4. **Re-score after fixes** -- quality-reviewer runs the full gate again, not a partial check
5. **Second FAIL triggers escalation** -- user is informed and asked whether to continue fixing or accept current quality
6. **No partial passes** -- the gate is binary. Either the final score is >= 25 or it is not

### Reference: What Award-Winning Looks Like

These sites exemplify what scores 30+ on the gate. Study them for the specific techniques they demonstrate:

- **Linear.app** -- Monochrome precision + gradient text + dramatic spacing. Scores on: T1 (distinctive type), T3/T4 (tracking/leading), D1 (layered shadows), L3 (intentional whitespace), M3 (scroll animations)
- **Stripe.com** -- Bold color + layered depth + animated gradients. Scores on: C2 (distinct palette), C3 (expressive color), D3 (glass/blur), D5 (micro-details), CC2 (wow moments in payment animations)
- **Huly.io** -- Dark + neon glow + glass + tight typography. Scores on: D1 (shadow layers), D3 (glass/frost), D5 (noise texture), T5 (typographic surprise), CC1 (strong signature element)
- **Raycast.com** -- Dark UI + vibrant accents + glass morphism. Scores on: C3 (glow/highlight tokens), D3 (glass), M2 (designed hover states), CC4 (unexpected keyboard UI)
- **Vercel.com** -- Dark minimalism + gradient text + dramatic whitespace. Scores on: T5 (gradient text), L3 (extreme negative space), L4 (grid-breaking hero), CC2 (deploy animation wow moment)

---

## Layer 3: Integration Context

### DNA Connection

The gate enforces DNA compliance across multiple categories. These are the specific DNA-to-gate mappings:

| DNA Section | Gate Check(s) | Enforcement |
|-------------|--------------|-------------|
| Color tokens (12 tokens) | C1, C2, C3 | C1 verifies exclusive token usage. C2 checks palette variety. C3 checks expressive token presence. |
| Typography (fonts, scale) | T1, T2, T3, T4 | T1 validates display font from DNA-approved list. T2-T4 check scale and hierarchy usage. |
| Spacing scale (5 levels) | L3 | Varied spacing drawn from DNA spacing tokens |
| Signature element | CC1, penalty | CC1 checks presence. Missing = additional -3 penalty on top of CC1's 0 score. |
| Motion language (tokens) | M1, M3, M4 | M4 specifically validates DNA motion token usage. M1/M3 check motion vocabulary. |
| Forbidden patterns | Penalty | -5 per forbidden pattern from archetype's locked constraint list |

### Archetype Connection

The gate does not change its checks per archetype -- the 35 points are universal. However, archetypes influence the gate in two ways:

1. **Forbidden pattern penalties** -- each archetype defines specific CSS patterns that are banned. The gate's penalty system enforces these per the Design Archetypes skill.
2. **Signature element definition** -- the DNA signature element originates from archetype defaults (though it can be customized). The gate checks for its presence.

Archetype-specific scoring nuances:

| Archetype Family | Gate Emphasis | Notes |
|-----------------|--------------|-------|
| Minimalist (Swiss, Japanese) | L3, L4 weighted critical | Negative space IS the design -- poor spacing = fail |
| Maximalist (Brutalist, Neon Noir) | CC1, CC2, CC3 critical | Bold archetypes without bold expression = fail |
| Craft-Forward (Warm Artisan, Organic) | D1, D2, D4, D5 critical | Texture and surface quality define these |
| Motion-Heavy (Kinetic, Vaporwave) | M1, M2, M3, M4 all critical | Motion IS the experience |

### Pipeline Position

```
Section Building (Wave N)
       |
       v
  Wave Complete
       |
       v
  quality-reviewer spawned
       |
       v
  [1] Existence Check -- do all planned sections exist?
       |
       v
  [2] ANTI-SLOP GATE (this skill) -- 35-point scoring
       |
       v
  [3] Awwwards 4-Axis Scoring -- aspiration prediction (skipped if gate FAIL)
       |
       v
  [4] Performance Audit -- Lighthouse, Core Web Vitals
       |
       v
  Results presented to user
```

### Related Skills

- **design-dna** -- Gate checks C1, C3, T1, M4, CC1 all reference DNA tokens. DNA is the source of truth; the gate verifies compliance.
- **design-archetypes** -- Gate penalty for forbidden patterns uses archetype-specific forbidden list. CC3 tension check references archetype tension zones.
- **emotional-arc** -- L1 (layout diversity) connects to beat-based section differentiation. Different emotional beats should produce different visual layouts.
- **cinematic-motion** (Phase 5) -- M1-M4 checks verify motion quality. Cinematic motion skill provides the vocabulary; the gate verifies it was used.
- **design-system-scaffold** (Phase 5) -- D1-D5 checks verify that design system tokens (shadows, borders, radii) were applied, not bypassed with hardcoded values.

### Pre-Build DNA Compliance Hook

The gate is post-review, but DNA has a pre-commit compliance hook (`.claude-plugin/hooks/dna-compliance-check.sh`) that catches critical violations during building. The relationship:

| Timing | System | What It Catches |
|--------|--------|----------------|
| Pre-commit (during build) | DNA compliance hook | Hardcoded hex colors, wrong fonts, wrong spacing tokens |
| Post-review (during verify) | Anti-Slop Gate | Full 35-point quality assessment, penalties, tier rating |

The hook catches egregious violations early. The gate catches everything -- including subjective quality, creative ambition, and compositional diversity that no automated hook can evaluate.

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Gate as Inline Checklist

**What goes wrong:** A section builder runs the 35-point checklist while building each section, spending 30%+ of its context on scoring instead of craft. The builder second-guesses every decision against scoring criteria, producing cautious, checkbox-driven output instead of bold design.

**Instead:** Builders focus exclusively on craft using Design DNA as their guide. The gate runs AFTER building, during a separate verify phase. This lets builders be creative without a scoring critic in their head. Trust the process: DNA-compliant building naturally scores well.

### Anti-Pattern: Gaming the Score

**What goes wrong:** Adding gratuitous micro-details, forced "wow moments", or artificial creative tension just to hit point thresholds. A noise texture slapped on every surface. A "creative tension" that breaks nothing. A "wow moment" that is just a large font size.

**Instead:** Every element should serve the design intent. The gate measures genuine quality, not checklist completion. A forced wow moment scores worse than an honestly simple design -- the quality-reviewer evaluates authenticity, not just presence. If the design does not naturally produce a wow moment, improve the design concept rather than bolting on gimmicks.

### Anti-Pattern: Penalty Ignorance

**What goes wrong:** Scoring 30/35 on categories but losing 13 in penalties for a forbidden pattern (-5), missing signature element (-3), and no creative tension (-5). Final score: 17/35 -- deep FAIL despite strong category performance.

**Instead:** Check forbidden patterns BEFORE review using the DNA compliance hook. Verify signature element is present during building (it is in the PLAN.md). Document creative tension in SUMMARY.md during building. Penalties represent FUNDAMENTAL violations that override category quality.

### Anti-Pattern: Flat Remediation

**What goes wrong:** Fixing all failed checks with minimum effort to just barely pass. Adding a single `backdrop-blur-sm` to satisfy D3. Using `tracking-tight` on one heading to satisfy T3. The fixes are technically present but add no actual quality.

**Instead:** Each remediation should genuinely improve the design. If D3 fails, add glass/blur where it creates real visual depth -- a frosted nav, a glassmorphic card, a blurred hero overlay. If T3 fails, tune ALL heading tracking, not just one. The gate is a quality floor, not a quality ceiling. Remediation should aim for the tier above, not the minimum passing score.

### Anti-Pattern: Partial Re-Scoring

**What goes wrong:** After remediation, only re-checking the specific items that failed. This misses regressions -- a fix for L4 (grid-breaking) might break L1 (layout diversity) if the grid-break is applied in a section that now matches its neighbor.

**Instead:** Always run the FULL 35-point gate after remediation. The gate is holistic; changes in one area affect others. Re-scoring is fast (one pass through the checklist). Partial scoring creates false confidence.

---

## Machine-Readable Constraints

| Parameter | Value | Unit | Enforcement |
|-----------|-------|------|-------------|
| total_points | 35 | points | HARD -- scoring must total exactly 35 |
| pass_threshold | 25 | points | HARD -- below 25 is mandatory FAIL |
| sotd_threshold | 30 | points | SOFT -- aspirational target for SOTD quality |
| honoree_threshold | 33 | points | SOFT -- exceptional quality indicator |
| penalty_signature_missing | -3 | points | HARD -- applied when signature element absent |
| penalty_forbidden_pattern | -5 | points per violation | HARD -- applied per forbidden pattern found |
| penalty_system_font_display | -5 | points | HARD -- applied when system font used for display |
| penalty_no_tension | -5 | points | HARD -- applied when zero tension moments documented |
| penalty_generic_cta | -2 | points per instance | HARD -- applied per generic CTA, max -6 total |
| penalty_generic_cta_cap | -6 | points | HARD -- maximum total CTA penalty |
| categories | 7 | count | HARD -- all 7 categories must be scored |
| checks_colors | 4 | checks (5 pts) | HARD -- C1 through C4 |
| checks_typography | 5 | checks (6 pts) | HARD -- T1 through T5 |
| checks_layout | 4 | checks (5 pts) | HARD -- L1 through L4 |
| checks_depth_polish | 5 | checks (6 pts) | HARD -- D1 through D5 |
| checks_motion | 4 | checks (5 pts) | HARD -- M1 through M4 |
| checks_creative_courage | 4 | checks (5 pts) | HARD -- CC1 through CC4 |
| checks_ux_intelligence | 3 | checks (3 pts) | HARD -- U1 through U3 |
| max_remediation_cycles | 2 | attempts | SOFT -- escalate to user after 2 failures |
