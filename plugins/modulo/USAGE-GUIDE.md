# Modulo Usage Guide

How to use the Modulo plugin to build production-ready, Awwwards-level websites with Claude Code.

## Quick Start

```
/modulo:start-design
```

That's it. Modulo guides you through every step. But here's what happens behind the scenes and how to get the best results.

---

## The Full Workflow

```
/modulo:start-design  →  /modulo:plan-sections  →  /modulo:execute  →  /modulo:verify  →  /modulo:visual-audit
         ↓                       ↓                       ↓                    ↓                    ↓
   Discovery +            Section plans +          Wave-by-wave         Quality gate +       Live browser
   Research +             wave assignments         parallel build       anti-slop score      GIF recording
   Archetype +            with user approval       (max 4 builders)     + DNA compliance     + motion audit
   Design DNA                                      per wave
```

### Step 1: Start Design

```
/modulo:start-design
```

**What happens:**
1. **Discovery** — Modulo asks 8 structured questions about your project (product, audience, tone, references, pages, features, brand, platform priority)
2. **Research** — 2-4 parallel research agents investigate design trends, analyze your reference sites, scout components, and study animation techniques
3. **Archetype Selection** — Based on your project, Modulo presents 2-3 design archetypes. You pick one (or describe a custom aesthetic)
4. **Design DNA** — Generates a unique `DESIGN-DNA.md` with your project's locked color tokens, fonts, spacing, shadows, signature element, motion language, and texture rules

**What you get:**
```
.planning/modulo/
├── PROJECT.md          — Your requirements summary
├── research/SUMMARY.md — Research synthesis
├── BRAINSTORM.md       — Chosen archetype + creative direction
├── DESIGN-DNA.md       — Unique visual identity (the key file)
└── STATE.md            — Project state tracker
```

**Tips:**
- Give specific references. "Like Linear but warmer" is better than "modern and clean"
- The archetype's constraints are non-negotiable — that's the point. Constraints force creativity.
- You can adjust specific DNA values (swap a hex color) but can't override core archetype rules

### Step 2: Plan Sections

```
/modulo:plan-sections
```

**What happens:**
1. Modulo reads your requirements and direction
2. Identifies all sections needed (hero, features, pricing, etc.)
3. Assigns each to a **wave** based on dependencies
4. Creates detailed `PLAN.md` files with tasks, checkpoints, and success criteria
5. You approve each section plan individually

**What you get:**
```
.planning/modulo/
├── MASTER-PLAN.md                    — Wave map + dependency graph
├── sections/
│   ├── 00-shared/PLAN.md            — Wave 0: tokens, theme, utilities
│   ├── 01-nav/PLAN.md               — Wave 1: navigation
│   ├── 02-hero/PLAN.md              — Wave 2: hero section
│   ├── 03-features/PLAN.md          — Wave 2: features (parallel)
│   └── ...
```

**Tips:**
- Review wave assignments — sections in the same wave build in parallel
- Max 4 sections per wave
- Each plan has `[checkpoint:human-verify]` where you'll review the output
- Be specific when requesting changes to plans — "make the hero full-screen with 3D tilt" not "make it better"

### Step 3: Execute

```
/modulo:execute
```

**What happens:**
1. Builds Wave 0 first (shared theme, tokens, utilities)
2. Then Wave 1 (navigation, footer — shared UI)
3. Then Wave 2+ (content sections — up to 4 in parallel)
4. Each builder reads `DESIGN-DNA.md` first, applies all constraints
5. Layout diversity is enforced — no two adjacent sections use the same pattern
6. Pauses at checkpoints for your review

**Session resumption:**
If a session runs out of context mid-build:
```
/modulo:execute resume
```
It picks up exactly where it left off using `.continue-here.md`.

**Tips:**
- Let it run. The builders work autonomously between checkpoints.
- At checkpoint pauses, actually look at the output before approving
- If something looks off, say so — the builder can adjust before moving on

### Step 4: Verify

```
/modulo:verify
```

**What happens:**
1. **Three-level verification** for each section:
   - Level 1 (Existence): Are all planned files present?
   - Level 2 (Substantive): Do the implementation goals hold? (responsive, animations, interactions)
   - Level 3 (Wired): Is everything connected? (imports resolve, tokens used, sections render)
2. **10-category visual audit**: Spacing, alignment, typography, color, responsive, interactions, borders, icons, animation, accessibility
3. **Mandatory Anti-Slop Gate**: 25-point scoring across 5 categories (Colors, Typography, Layout, Depth & Polish, Motion). Score < 18 = automatic fail.
4. **Design DNA Compliance**: Checks every section against your DNA — colors, fonts, spacing, signature element, motion language, forbidden patterns

**Scoring:**
- 20-25: Premium (passed)
- 18-19: Good (passed with notes)
- 15-17: Template-tier (automatic fail — must iterate)
- Below 15: Slop (automatic fail — major rework)

**Penalties:**
- Missing signature element: -3 points
- Archetype forbidden pattern present: -5 points

**If gaps are found:** Modulo creates `GAP-FIX.md` plans automatically. Run `/modulo:iterate` to fix them.

**Tips:**
- You can verify a single section: `/modulo:verify 02-hero`
- If it fails the anti-slop gate, that's good — it means the quality bar is working
- The auto-generated GAP-FIX plans are specific and actionable

### Step 5: Visual Audit (Optional but Recommended)

```
/modulo:visual-audit
```

**Requires:** Dev server running + Chrome with Claude extension

**What happens:**
1. Navigates to your dev server in Chrome
2. Records GIFs of full page scroll, animation triggers, hover interactions, page load
3. Scores animation quality (/10), visual coherence (/10), responsiveness (/5)
4. Compares everything against your Design DNA
5. Produces a visual audit report with GIF evidence

**What you get:**
```
.planning/modulo/audit/
├── VISUAL-AUDIT.md          — Scored report
├── full-scroll.gif          — Full page scroll recording
├── page-load.gif            — Page load animation recording
├── interactions.gif         — Hover/click interaction recording
└── section-hero-enter.gif   — Per-section animation recordings
```

**Tips:**
- This catches motion/animation issues that static code analysis misses
- Run this after `/modulo:verify` passes, to check the visual polish layer
- Score < 18/25 = needs iteration

### Step 6: Iterate (If Needed)

```
/modulo:iterate
```

**What happens:**
- If GAP-FIX plans exist from verify: executes those fixes
- If no plans: asks you what to improve
- Makes targeted, minimal changes — doesn't rebuild sections
- Re-verifies changed sections

**Tips:**
- You can also give specific instructions: `/modulo:iterate make the hero more dramatic`
- Iteration preserves the creative direction — it improves, not redesigns

---

## Additional Commands

### Fix a specific bug
```
/modulo:bugfix the pricing cards overflow on mobile
```
Uses hypothesis-test-fix cycle. Minimal changes, atomic commits.

### Change a plan mid-project
```
/modulo:change-plan add a testimonials section after features
```
Recalculates wave assignments automatically.

### Run a full site audit
```
/modulo:audit
```
Spawns 4 parallel agents (performance, SEO, accessibility, quality). Produces scored report.

### Check responsive behavior
```
/modulo:responsive-check
```
Systematic verification at 375px, 768px, 1024px, 1440px.

### Generate tests
```
/modulo:generate-tests
```
Creates Vitest unit tests + Playwright E2E tests for all components.

### Lighthouse audit
```
/modulo:lighthouse
```
Static + build + runtime analysis with Core Web Vitals report.

---

## Design Archetypes Reference

Pick the one that matches your project's personality:

| Archetype | Best For | Personality |
|-----------|----------|-------------|
| **Brutalist** | Art, fashion, agencies | Raw, aggressive, intentionally ugly-beautiful |
| **Ethereal** | Wellness, luxury tech, meditation | Dreamlike, soft, floating, translucent |
| **Kinetic** | SaaS, fintech, creative tools | Motion-first, dynamic, energetic |
| **Editorial** | Media, publishing, long-form | Magazine-inspired, typography-driven |
| **Neo-Corporate** | Developer tools, B2B SaaS, infrastructure | Linear/Vercel aesthetic, precision engineering |
| **Organic** | Sustainability, food, wellness | Natural, flowing, hand-crafted feeling |
| **Retro-Future** | Music, gaming, creative products | Nostalgic + futuristic, CRT + holographic |
| **Luxury/Fashion** | Fashion, jewelry, high-end retail | High-end, editorial, dramatic photography |
| **Playful/Startup** | Consumer apps, education, social | Bouncy, colorful, approachable |
| **Data-Dense** | Analytics, fintech dashboards, admin | Information-rich, dashboard-optimized |
| **Japanese Minimal** | Premium consumer, lifestyle, architecture | Ma (negative space), wabi-sabi, restrained |
| **Glassmorphism** | Modern SaaS, OS-style interfaces | Frosted glass, translucent layers, depth |
| **Neon Noir** | Gaming, crypto, nightlife | Dark + neon, cyberpunk, high contrast |
| **Warm Artisan** | Craft, food & beverage, personal brands | Handcrafted, warm tones, natural textures |
| **Swiss/International** | Corporate, government, institutions | Grid-perfect, Helvetica heritage, systematic |
| **Vaporwave** | Nostalgia, music, creative | Retrowave, pink/purple/cyan, glitch aesthetic |

**Custom archetype:** Describe your aesthetic and Modulo builds a custom archetype with locked palette, fonts, mandatory techniques, and forbidden patterns.

---

## Project File Structure

After running the full workflow, your `.planning/modulo/` directory looks like:

```
.planning/modulo/
├── STATE.md                          — Live project state
├── PROJECT.md                        — Requirements
├── BRAINSTORM.md                     — Archetype + creative direction
├── DESIGN-DNA.md                     — Visual identity (THE key file)
├── MASTER-PLAN.md                    — Wave map + dependency graph
├── .continue-here.md                 — Session resumption (auto-created)
├── research/
│   ├── DESIGN-TRENDS.md
│   ├── REFERENCE-ANALYSIS.md
│   ├── COMPONENT-LIBRARY.md
│   ├── ANIMATION-TECHNIQUES.md
│   └── SUMMARY.md
├── sections/
│   ├── 00-shared/
│   │   ├── PLAN.md
│   │   └── SUMMARY.md
│   ├── 01-nav/
│   │   ├── PLAN.md
│   │   ├── SUMMARY.md
│   │   └── GAP-FIX.md               — Only if verify found gaps
│   └── ...
└── audit/
    ├── VISUAL-AUDIT.md
    ├── AUDIT-REPORT.md
    ├── full-scroll.gif
    └── ...
```

---

## Tips for Best Results

### Do
- **Give specific references.** URLs of sites you admire with what you like about each one.
- **Describe the feeling, not the features.** "It should feel like entering a luxury showroom" beats "use dark theme with gradients."
- **Trust the constraints.** The archetype's forbidden patterns exist to prevent generic output.
- **Review at checkpoints.** The builder pauses specifically for your eyes. Use those moments.
- **Run verify after execute.** The anti-slop gate catches generic output before you see it.
- **Use visual-audit for animations.** Static code analysis can't judge motion quality.

### Don't
- **Don't say "make it look good."** Be specific: "The hero needs more vertical breathing room and the CTA should glow."
- **Don't override archetype constraints.** If you chose Brutalist, you can't add soft gradients — that defeats the purpose.
- **Don't skip verify.** It's the quality gate that separates template-tier from Awwwards-tier.
- **Don't manually edit DNA.** If you need changes, ask Modulo to regenerate specific values.
- **Don't run execute without plans.** The wave system needs PLAN.md files to coordinate parallel builders.

---

## Common Scenarios

### "I just want a landing page"
```
/modulo:start-design
```
Answer: landing page, 5-7 sections, your references. Modulo handles the rest.

### "I have a Figma design"
```
/modulo:start-design path/to/figma-export.png
```
Attach screenshots or export images. The research phase analyzes them. The `figma-translator` agent can also do pixel-perfect Figma-to-code.

### "Session ran out mid-build"
```
/modulo:execute resume
```
Picks up where it left off. No rework.

### "The output looks too generic"
```
/modulo:verify
```
The anti-slop gate will catch it. If it scores < 18, GAP-FIX plans are auto-generated. Then:
```
/modulo:iterate
```

### "I want to add a section to an existing project"
```
/modulo:change-plan add a testimonials section with customer photos and star ratings
```
Recalculates waves and creates a new PLAN.md.

### "Just fix this one thing"
```
/modulo:bugfix the mobile nav doesn't close when clicking a link
```
Hypothesis-test-fix cycle. One commit.

---

## Framework Support

Modulo works with both frameworks. Specify during discovery.

| Framework | What Modulo Uses |
|-----------|-----------------|
| **Next.js** | App Router, Server Components, Server Actions, next/image, next/font, next-intl, Metadata API |
| **Astro** | Islands architecture, Content Collections, View Transitions, hybrid rendering, Actions, middleware |

Both use: **Tailwind CSS + shadcn/ui + Framer Motion/GSAP/CSS animations**
