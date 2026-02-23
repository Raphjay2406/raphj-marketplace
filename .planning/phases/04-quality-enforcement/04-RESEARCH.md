# Phase 4: Quality Enforcement - Research

**Researched:** 2026-02-24
**Domain:** Quality enforcement systems for a Claude Code design plugin (markdown-only skill/agent definitions)
**Confidence:** HIGH

## Summary

Phase 4 defines the ENFORCEMENT SYSTEM -- when and how quality agents (defined in Phase 2) are invoked, what happens with their findings, how quality gates integrate into the build pipeline, how reference benchmarks are structured, how layout diversity is pre-assigned, what the polish checklist contains, and how live browser testing works. This research investigates five domains: reference benchmarking for quality bars, compositional diversity enforcement, polish pass protocol specifics, live browser testing tools, and quality gate pipeline integration.

The key insight is that this is a **plugin that produces markdown definitions** (skills, agents, protocols), not an application with its own test framework. All "testing" and "enforcement" will be performed by Claude Code agents operating in TARGET projects. The skills and agent protocols Phase 4 produces are instructions for those agents -- what to check, what thresholds to enforce, and how to report results. The live browser testing uses existing MCP tools (Playwright MCP, Chrome DevTools MCP) available in the Claude Code environment, not a custom testing framework.

Research confirms that the five planned deliverables map cleanly to distinct concerns: (1) reference benchmarking is a skill + section-planner integration, (2) compositional diversity is a section-planner enforcement rule + MASTER-PLAN.md format extension, (3) polish pass is a skill defining the polisher agent's checklist, (4) live browser testing is a skill defining what the quality-reviewer agent runs via MCP tools, (5) quality gate integration is a protocol defining when each enforcement layer fires in the wave-based pipeline.

**Primary recommendation:** Build Phase 4 as five plans producing skills and protocol definitions. Each plan produces a focused artifact (skill file or protocol section within an agent) that integrates with the Phase 2 agent pipeline via well-defined trigger points. No new agents needed -- Phase 4 enriches the existing agents with enforcement knowledge.

## Standard Stack

This phase produces markdown files (skills, protocol sections for agents). There is no application code.

### Core Platform
| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| Claude Code Plugin System | Current (Feb 2026) | Skill/agent hosting, tool routing | Only platform; all skills and agents run here |
| SKILL.md (4-layer format) | Phase 1 standard | Skill knowledge base format | Established in Phase 1: Decision Guidance, Award-Winning Examples, Integration Context, Anti-Patterns |
| Agent frontmatter | Phase 2 standard | Agent configuration (skills, tools, maxTurns) | Established in Phase 2 pipeline architecture |
| PLAN.md format | Phase 2 standard | Section build specifications with frontmatter | The carrier for reference targets, layout assignments, and polish requirements |
| MASTER-PLAN.md | Phase 2 standard | Wave map with section assignments | The carrier for layout pre-assignment and diversity enforcement |

### MCP Tools (Available in Target Projects)
| Tool | Source | Purpose | When Used |
|------|--------|---------|-----------|
| Playwright MCP | `@playwright/mcp@latest` (Microsoft) | Browser automation, screenshots, viewport resize, JS execution | Live browser testing at end of build |
| Chrome DevTools MCP | `chrome-devtools-mcp` or `claude-in-chrome` | Browser interaction, GIF recording, computed style checking | Visual audit, animation testing |
| `Playwright_screenshot` | Playwright MCP | Capture full page or element screenshots at any viewport | 4-breakpoint responsive screenshots |
| `Playwright_resize` | Playwright MCP | Set viewport to specific dimensions (1-7680px width) | Testing at 375, 768, 1024, 1440px |
| `Playwright_evaluate` | Playwright MCP | Execute JavaScript in browser console | FPS monitoring, computed style checks, Lighthouse/axe-core invocation |
| `Playwright_navigate` | Playwright MCP | Load URLs with configurable browser type | Navigate to dev server |

### Testing Libraries (Used via MCP in Target Projects)
| Library | Purpose | How Invoked |
|---------|---------|-------------|
| Lighthouse | Performance audit (LCP, CLS, TBT, Performance score) | Via `Playwright_evaluate` or CLI via Bash tool |
| axe-core | Accessibility audit (WCAG 2.1 AA) | Via `@axe-core/playwright` or injected JS |
| requestAnimationFrame FPS counter | Animation performance monitoring | Injected JS snippet via `Playwright_evaluate` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Playwright MCP | Chrome DevTools MCP only | Chrome DevTools MCP has GIF recording but less standardized screenshot/resize API. Playwright MCP is more reliable for multi-breakpoint testing. Use both when available |
| Lighthouse via Playwright | Lighthouse CLI via Bash | CLI is simpler but requires Lighthouse installed in target project. Playwright approach is universal |
| Custom FPS counter JS | Performance Observer LoAF API | LoAF is newer and more accurate but Chrome-only and may not be available. rAF counter is universal |

## Architecture Patterns

### How Phase 4 Artifacts Integrate with the Phase 2 Pipeline

Phase 4 does NOT create new agents. It creates skills and protocol definitions that enrich existing Phase 2 agents:

```
Phase 4 Skills/Protocols → Which Agent Uses Them → When Triggered
─────────────────────────────────────────────────────────────────
reference-benchmarking skill → section-planner agent → During plan generation
                             → quality-reviewer agent → During post-build comparison

compositional-diversity skill → section-planner agent → During MASTER-PLAN.md generation
                              → quality-reviewer agent → During adjacency check

polish-pass skill → polisher agent (end-of-build polish) → After all waves complete
                  → section-builder agent (light polish)  → End of each section build

live-testing skill → quality-reviewer agent → After polish pass complete

quality-gate-protocol → build-orchestrator agent → At each enforcement layer trigger point
                      → quality-reviewer agent   → Severity classification
```

### Pattern 1: Skill as Embedded Agent Knowledge

**What:** Phase 4 skills are preloaded into agents via the `skills` frontmatter field. The agent's system prompt references the skill content at startup -- no runtime file reads needed.

**When to use:** For all Phase 4 skills that an agent needs every run (e.g., quality-reviewer always needs the live-testing skill, polisher always needs the polish-pass skill).

**How it integrates:**
```yaml
# In agents/pipeline/quality-reviewer.md frontmatter
---
name: quality-reviewer
skills:
  - reference-benchmarking
  - compositional-diversity
  - live-testing
  - quality-gate-protocol
---
```

The quality-reviewer agent loads these skills at startup and uses them as reference during verification.

### Pattern 2: PLAN.md as Reference Target Carrier

**What:** Reference quality targets (screenshots/URLs of award-winning sections) are embedded directly in each section's PLAN.md file. Builders see the quality bar before they start building.

**When to use:** During section planning (section-planner generates this) and during quality review (quality-reviewer compares output against it).

**PLAN.md extension for reference targets:**
```markdown
---
section: 02-hero
wave: 2
reference_target:
  url: "https://awwwards.com/sites/linear-app"
  section: "hero"
  quality_bar: "Split layout with product screenshot, gradient text, staggered reveal"
  screenshot: ".planning/modulo/references/02-hero-target.png"
layout_pattern: "split-hero-product"
---

<reference_quality_target>
This section should match or exceed the quality of Linear's hero section:
- Split layout with 60/40 image-text ratio
- Gradient text on headline with tight tracking
- Product screenshot with 3D perspective tilt and colored shadow
- Staggered entrance: badge → headline → description → CTAs (100ms intervals)
- Ambient gradient orb behind product
Quality bar: Would this hero win a direct comparison against the reference?
</reference_quality_target>
```

### Pattern 3: MASTER-PLAN.md as Diversity Enforcement Carrier

**What:** Layout patterns are pre-assigned in MASTER-PLAN.md during planning. The section-planner assigns patterns from the layout pattern taxonomy ensuring no adjacent sections share the same pattern.

**When to use:** During section planning (before any building starts).

**MASTER-PLAN.md extension for layout pre-assignment:**
```markdown
## Layout Assignments (No Adjacent Repeats)

| Section | Beat | Layout Pattern | Background | Notes |
|---------|------|---------------|------------|-------|
| 01-hero | HOOK | centered-hero | bg-primary | Full viewport |
| 02-logos | TEASE | marquee-horizontal | bg-secondary | Low height |
| 03-features | BUILD | bento-grid-asymmetric | bg-primary | Dense |
| 04-product | REVEAL | split-showcase-60-40 | bg-tertiary | Product screenshot |
| 05-stats | BREATHE | centered-minimal | bg-secondary | Generous whitespace |
| 06-demo | PEAK | full-bleed-interactive | bg-primary | Interactive demo |
| 07-testimonials | PROOF | masonry-cards | bg-secondary | Social proof |
| 08-cta | CLOSE | centered-hero-variant | bg-accent | Strong CTA |

### Adjacency Validation
- 01 (centered-hero) → 02 (marquee-horizontal): VALID (different)
- 02 (marquee-horizontal) → 03 (bento-grid): VALID (different)
- ...all pairs validated, no adjacent repeats
```

### Pattern 4: Quality Gate as Pipeline Protocol

**What:** Quality enforcement happens at 4 layers, each integrated into the wave execution cycle at specific trigger points. The build-orchestrator protocol defines when each gate fires.

**When to use:** Throughout the entire build execution.

**4-Layer Progressive Enforcement:**
```
Layer 1: BUILD-TIME (cheapest to fix)
├── When: During each section build
├── What: Section-builder self-checks against must_haves
├── Enforced by: Embedded rules in section-builder agent
├── Failure action: Builder retries the task (within same build)
└── Cost: Free (built into builder)

Layer 2: POST-WAVE (catch before next wave)
├── When: After all sections in a wave complete
├── What: Quality-reviewer 3-level verification + anti-slop scoring
│         Creative-director post-build review (in parallel)
├── Enforced by: quality-reviewer agent + creative-director agent
├── Failure action:
│   ├── Critical: Pipeline blocks, escalate to user
│   └── Warning: Add to running tally, continue
└── Cost: One quality review cycle per wave

Layer 3: END-OF-BUILD (comprehensive final check)
├── When: After all waves complete + polish pass
├── What: Live browser testing (screenshots, Lighthouse, FPS, axe-core)
│         Full-page anti-slop scoring
│         Awwwards 4-axis scoring
├── Enforced by: quality-reviewer agent with MCP tools
├── Failure action:
│   ├── Lighthouse < 80: Hard fail, escalate to user
│   ├── a11y critical: Hard fail, escalate to user
│   ├── FPS < 30: Hard fail, escalate to user
│   └── Visual regression: Flag with screenshots
└── Cost: Full browser testing cycle

Layer 4: USER CHECKPOINT (human judgment)
├── When: After Layer 3 completes
├── What: User reviews screenshots, quality report, CD assessment
├── Enforced by: Build-orchestrator presents report, awaits user response
├── Failure action: User decides (fix, iterate, accept)
├── Condition: MANDATORY when warnings accumulated. Auto-proceed when clean
└── Cost: Human time
```

### Anti-Patterns to Avoid

- **Over-testing during build:** Running Lighthouse after every section kills velocity. Full browser testing runs ONCE at end of build, not per section.
- **Auto-retry on failures:** User decided: build failures escalate to user, no autonomous retry. The system reports and waits.
- **Testing incomplete builds:** Live browser testing runs after the polish pass on the COMPLETE page. Testing partial pages wastes effort.
- **CD and QR overlap:** CD reviews creative quality (boldness, vision). QR reviews technical quality (anti-slop, performance). They run in parallel, not sequentially.
- **Layout diversity as review-only:** Diversity must be STRUCTURAL (pre-assigned in MASTER-PLAN.md during planning), not caught post-hoc during review. Review is the safety net, not the primary enforcement.

## Don't Hand-Roll

Problems that have existing solutions within the Modulo ecosystem:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Screenshot at multiple viewports | Custom browser automation script | Playwright MCP `Playwright_screenshot` + `Playwright_resize` | Built into MCP server, handles device emulation, 143+ presets |
| Performance audit | Custom performance measurement | Lighthouse via CLI or Playwright `evaluate` | Industry standard, comprehensive, well-understood thresholds |
| Accessibility audit | Manual WCAG checklist | axe-core via `@axe-core/playwright` or injected JS | Catches ~50% of WCAG issues automatically, industry standard |
| FPS monitoring | Custom animation profiler | rAF-based FPS counter injected via `Playwright_evaluate` | Simple, universal, 15 lines of JS |
| Layout pattern taxonomy | Ad-hoc pattern naming | Curated taxonomy from creative-sections + landing-page skills | v6.1.0 already has 15+ named patterns with beat compatibility |
| Reference quality library | Manual URL collection per project | Per-archetype curated reference library in skill | Archetype-specific references can be pre-curated once |
| Severity classification | Custom priority system | CI/CD-inspired tier system (Critical/Warning) | Well-understood, matches user's "feels like CI/CD quality gates" idea |

**Key insight:** Phase 4's job is to DEFINE enforcement rules in markdown, not to IMPLEMENT a testing framework. The testing infrastructure (Playwright MCP, Lighthouse, axe-core) already exists. Phase 4 skills tell the quality-reviewer agent what to run and how to interpret results.

## Common Pitfalls

### Pitfall 1: Reference Targets That Are Too Vague
**What goes wrong:** Reference targets like "make it look like Linear.app" give builders no actionable guidance. They build something "inspired by Linear" that misses every specific quality detail.
**Why it happens:** References are captured as URLs without analysis of what specifically makes them high quality.
**How to avoid:**
1. Reference targets must include SPECIFIC quality attributes: layout ratio, typography treatment, animation approach, depth technique, color usage
2. Format: screenshot + 5-7 specific quality attributes to match or exceed
3. Only key beats get reference targets (Hero, Peak, Close, high-tension sections) -- don't over-burden supporting sections
4. Section-planner extracts specific attributes during plan generation, not just a URL
**Warning signs:** Builders produce sections that share a vague "vibe" with the reference but miss the specific craft details.

### Pitfall 2: Layout Pattern Taxonomy Too Coarse
**What goes wrong:** With only 5-6 pattern names, a 10-section page runs out of unique patterns. Adjacent sections get "different" names but look similar (e.g., "bento-grid" and "asymmetric-grid" are visually similar).
**Why it happens:** Patterns are named by implementation structure (grid, flex) rather than compositional character.
**How to avoid:**
1. Taxonomy needs 12-15+ distinct patterns that are VISUALLY distinct, not just structurally different
2. Group patterns by visual character: centered vs. split vs. grid vs. flowing vs. full-bleed vs. layered
3. Include background progression as part of the diversity check (not just layout shape)
4. Validate at the VISUAL level, not the CSS level -- two different CSS implementations can look the same
**Warning signs:** Page feels repetitive despite technically different layout names.

### Pitfall 3: Polish Checklist Becoming a Checkbox Exercise
**What goes wrong:** The polisher mechanically adds noise textures and gradient borders to every section without considering whether they fit the archetype or enhance the design.
**Why it happens:** The checklist is interpreted as "add all of these" rather than "ensure appropriate polish is present."
**How to avoid:**
1. Universal checklist defines the CATEGORIES of polish (hover states, textures, micro-interactions, selection, cursors), not specific implementations
2. Archetype-specific addenda define WHICH polish items are appropriate (e.g., Brutalist gets hard hover states, not gradient borders)
3. Polisher has full creative license -- checklist is minimum, not maximum
4. Some items are FORBIDDEN for certain archetypes (glass blur on Brutalist, neon glow on Ethereal)
**Warning signs:** All archetypes end up with the same polish treatments. Brutalist pages have gradient borders.

### Pitfall 4: Live Testing Blocks Development Flow
**What goes wrong:** Running full Lighthouse + axe-core + screenshots after every wave makes the build process painfully slow.
**Why it happens:** Enthusiasm for testing leads to running comprehensive tests too frequently.
**How to avoid:**
1. Comprehensive live testing runs ONCE at end of build (after polish pass)
2. Per-wave quality checks are CODE-based only (quality-reviewer reads code, doesn't launch browser)
3. Quick visual spot-checks via Playwright are acceptable mid-build but not full audits
4. CD review and automated testing run in PARALLEL to minimize total time
**Warning signs:** Build takes 3x longer than expected due to repeated browser testing.

### Pitfall 5: Severity Escalation Overwhelming the User
**What goes wrong:** Every minor spacing issue and non-critical accessibility suggestion gets escalated to the user as a "finding," making the quality report overwhelming and the checkpoint tedious.
**Why it happens:** No clear distinction between what blocks the pipeline and what's informational.
**How to avoid:**
1. Only CRITICAL failures escalate to user: anti-slop < 25, Lighthouse < 80, critical a11y, FPS < 30, archetype forbidden patterns
2. Warnings are a running tally shown in real-time status (e.g., "Wave 2 complete -- 3 warnings pending")
3. Warnings accumulate but don't block. User checkpoint is mandatory ONLY when warnings exist
4. Clean builds auto-proceed without user intervention
5. Quality report at end has a clear summary: X critical (blocking), Y warnings (informational)
**Warning signs:** User starts ignoring quality reports because they're too verbose.

### Pitfall 6: Reference Library Becomes Stale
**What goes wrong:** The curated per-archetype reference library uses sites that were award-winning 2 years ago but now look dated. Builders target an outdated quality bar.
**Why it happens:** Award-winning design evolves rapidly. References captured once degrade over time.
**How to avoid:**
1. Per-project research supplements the curated library -- researcher agent finds CURRENT winners in the specific industry
2. Curated library provides the archetype's TIMELESS quality attributes (not specific sites that may go offline)
3. Include the QUALITY ATTRIBUTES to look for, not just URLs that may change
4. Version the reference library with dates so staleness is visible
**Warning signs:** Reference targets use sites that no longer exist or look dated.

## Code Examples

Since Phase 4 produces markdown skills and protocols, "code examples" are skill content and protocol definitions.

### Reference Target Format in PLAN.md
```markdown
<reference_quality_target>
**Reference:** [Name] - [Section Type]
**Source:** [URL or .planning/modulo/references/XX-target.png]
**Beat:** [Beat type this section is assigned]

**Quality Attributes to Match or Exceed:**
1. Layout: [specific composition - e.g., "asymmetric 60/40 split with product image bleeding into margin"]
2. Typography: [specific treatment - e.g., "display font at -0.04em tracking, gradient from white to white/40"]
3. Color: [specific approach - e.g., "3-layer depth: bg-primary base, bg-secondary card, accent-1 glow at 15% opacity"]
4. Motion: [specific animation - e.g., "staggered entrance with 100ms delay, elements enter from bottom-left"]
5. Depth: [specific technique - e.g., "colored shadow matching accent-1, glass morphism on secondary card"]
6. Signature: [specific detail - e.g., "noise texture at 3% opacity on dark surfaces, gradient border on hero card"]

**Quality Bar Question:** Would this section win a direct visual comparison against the reference?
</reference_quality_target>
```

### Layout Pattern Taxonomy (for compositional-diversity skill)
```markdown
## Layout Pattern Taxonomy

### Group A: Centered Compositions
1. **centered-hero** — Full-width centered content, large type, minimal elements. Compatible: HOOK, CLOSE
2. **centered-minimal** — Centered text block with generous whitespace. Compatible: BREATHE, TEASE
3. **centered-stacked** — Centered heading + vertically stacked content blocks. Compatible: BUILD, PROOF

### Group B: Split Compositions
4. **split-equal** — 50/50 side-by-side content and media. Compatible: REVEAL, BUILD
5. **split-asymmetric** — 60/40 or 70/30 with dominant side. Compatible: REVEAL, PEAK
6. **split-overlapping** — Content overlaps media or vice versa. Compatible: PEAK, TENSION

### Group C: Grid Compositions
7. **bento-grid** — Asymmetric card grid with varied cell sizes. Compatible: BUILD, REVEAL
8. **uniform-grid** — Equal-sized cards in responsive grid. Compatible: BUILD, PROOF
9. **masonry** — Pinterest-style staggered vertical layout. Compatible: PROOF, BUILD

### Group D: Flowing Compositions
10. **marquee-horizontal** — Infinite horizontal scroll (logos, testimonials). Compatible: TEASE, PROOF
11. **scroll-storytelling** — Vertical scroll-driven narrative with pinned elements. Compatible: REVEAL, PEAK
12. **timeline-vertical** — Chronological vertical flow with alternating sides. Compatible: BUILD, PROOF

### Group E: Full-Bleed Compositions
13. **full-bleed-media** — Edge-to-edge image/video with overlay text. Compatible: HOOK, PEAK
14. **full-bleed-interactive** — Full-viewport interactive element (3D, demo). Compatible: PEAK
15. **parallax-layers** — Multi-layer depth with parallax scroll. Compatible: PEAK, REVEAL

### Group F: Layered Compositions
16. **card-spotlight** — Grid of cards with cursor-following spotlight effect. Compatible: BUILD, PEAK
17. **tabbed-showcase** — Tab navigation revealing different content panels. Compatible: BUILD, REVEAL
18. **before-after** — Side-by-side or slider comparison. Compatible: TENSION

### Adjacency Rules
- Adjacent sections MUST use patterns from DIFFERENT groups (A-F)
- Exception: Group C patterns can be adjacent if one is bento-grid and other is masonry (visually distinct)
- Background must also alternate: no two adjacent sections with same bg token
- At minimum, a page of N sections must use patterns from ceil(N/2) different groups
```

### FPS Monitoring JavaScript Snippet (for live-testing skill)
```javascript
// Inject via Playwright_evaluate to monitor animation FPS
// Returns FPS readings over a monitoring period
(function monitorFPS() {
  return new Promise((resolve) => {
    const readings = [];
    let frames = 0;
    let lastTime = performance.now();
    const duration = 3000; // Monitor for 3 seconds
    const startTime = performance.now();

    function tick(now) {
      frames++;
      const elapsed = now - lastTime;
      if (elapsed >= 500) { // Sample every 500ms
        readings.push(Math.round(frames / (elapsed / 1000)));
        frames = 0;
        lastTime = now;
      }
      if (now - startTime < duration) {
        requestAnimationFrame(tick);
      } else {
        const avgFPS = readings.reduce((a, b) => a + b, 0) / readings.length;
        const minFPS = Math.min(...readings);
        resolve({ avgFPS: Math.round(avgFPS), minFPS, readings });
      }
    }
    requestAnimationFrame(tick);
  });
})();
```

### Universal Polish Checklist (for polish-pass skill)
```markdown
## Universal Polish Checklist

### Hover & Interactive States (MUST HAVE)
- [ ] Every clickable element has a distinct hover state
- [ ] Hover transitions use appropriate easing and duration (200-300ms, not linear)
- [ ] Active/pressed state gives immediate feedback (<100ms)
- [ ] Focus states visible for keyboard navigation (consistent focus ring)
- [ ] Disabled states prevent interaction AND look disabled

### Micro-Textures (ARCHETYPE-DEPENDENT)
- [ ] Noise/grain texture applied to appropriate surfaces (dark backgrounds: SVG noise at 2-5% opacity)
- [ ] Gradient borders on key cards/containers (1px gradient from white/10 to white/03)
- [ ] Subtle background patterns where archetype calls for them (grid lines, dots, grain)

### Selection & Cursor (SHOULD HAVE)
- [ ] Custom selection color matching accent palette (::selection { background: accent-1/20 })
- [ ] Custom cursor on special interactive elements (optional, archetype-dependent)

### Micro-Interactions (MUST HAVE)
- [ ] Button hover: scale, shadow shift, glow, or border reveal (not just color change)
- [ ] Card hover: lift effect (translateY + shadow increase) or spotlight
- [ ] Link hover: underline animation, color shift, or arrow motion
- [ ] Icon hover: subtle rotation, scale, or color transition

### Typography Polish (MUST HAVE)
- [ ] Gradient text on at least one headline (where archetype permits)
- [ ] Text-balance on important headings (prevent widows/orphans)
- [ ] Proper truncation with ellipsis where content may overflow
- [ ] Smooth font loading (no FOUT visible)

### Depth & Shadow (ARCHETYPE-DEPENDENT)
- [ ] Multi-layer shadows on elevated elements (not just shadow-lg)
- [ ] Colored shadows matching element/accent color where appropriate
- [ ] Glass/blur effects on overlays and navigation (where archetype permits)

### Animation Polish (MUST HAVE)
- [ ] All animations respect prefers-reduced-motion
- [ ] Enter animations paired with exit animations (not just appear/disappear)
- [ ] Scroll animations have appropriate trigger ranges (not too early, not too late)
- [ ] Stagger timing creates visual flow (not all elements at once)

### Responsive Polish (MUST HAVE)
- [ ] No horizontal overflow at any viewport (375-1440px)
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Font sizes responsive (clamp() or breakpoint-specific)
- [ ] Spacing scales appropriately (not identical on mobile and desktop)
```

### Archetype-Specific Polish Addenda (examples)
```markdown
## Brutalist Polish Additions
- [ ] Hard drop-shadows (4px_4px_0 pattern) on key elements
- [ ] Instant hover state transitions (<100ms, no smooth easing)
- [ ] Exposed structural elements (visible borders, grid lines)
- [ ] At least one rotated element (-2deg to 3deg)
- FORBIDDEN: Gradient borders, glass blur, noise texture, rounded corners > 4px

## Ethereal Polish Additions
- [ ] Floating gradient orbs with slow animation (8-12s cycle)
- [ ] Generous padding on all containers (py-32+ between sections)
- [ ] Soft layered shadows with large spread (20px+ blur)
- [ ] Serif accent text in pull quotes or labels
- FORBIDDEN: Dark backgrounds, sharp corners, neon accents, heavy font weights

## Kinetic Polish Additions
- [ ] Scroll-triggered animation on EVERY section
- [ ] Parallax depth on at least one layer
- [ ] Horizontal scroll element present
- [ ] Stagger timing 60-100ms between elements
- FORBIDDEN: Static sections with no scroll integration
```

### Live Testing Protocol (for live-testing skill)
```markdown
## Live Browser Testing Protocol

### Pre-Conditions
- All waves complete
- Polish pass complete
- Dev server running at localhost:[port]

### Step 1: 4-Breakpoint Screenshots
For each breakpoint [375, 768, 1024, 1440]:
1. `Playwright_resize` to {width}px height 900px
2. `Playwright_navigate` to localhost:[port]
3. Wait 2 seconds for animations to complete
4. `Playwright_screenshot` full page → save to .planning/modulo/audit/screenshot-{width}.png
5. Compare against PLAN.md expectations for each section visible at this breakpoint

### Step 2: Lighthouse Audit
Execute via Bash tool in target project:
```bash
npx lighthouse http://localhost:[port] --output=json --output-path=.planning/modulo/audit/lighthouse.json --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices
```
Parse results:
- Performance score < 80 = CRITICAL FAIL
- Accessibility score < 90 = WARNING (axe-core provides detail)
- Best practices < 80 = WARNING

### Step 3: axe-core Accessibility Audit
Inject via `Playwright_evaluate`:
```javascript
// Load axe-core from CDN and run
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js';
document.head.appendChild(script);
// Wait for load, then:
axe.run().then(results => {
  window.__axeResults = {
    violations: results.violations.map(v => ({
      id: v.id, impact: v.impact, description: v.description,
      nodes: v.nodes.length, help: v.helpUrl
    })),
    passes: results.passes.length,
    incomplete: results.incomplete.length
  };
});
```
Then read `window.__axeResults`:
- Any `impact: "critical"` = CRITICAL FAIL
- Any `impact: "serious"` = WARNING
- `impact: "moderate"` or `"minor"` = INFO

### Step 4: Animation FPS Monitoring
1. Navigate to page
2. Inject FPS counter via `Playwright_evaluate` (see snippet above)
3. Scroll through entire page slowly (trigger all animations)
4. Read FPS readings
5. Any reading < 30 = CRITICAL FAIL
6. Average FPS < 45 = WARNING

### Step 5: Generate Testing Report
```markdown
## Live Testing Report
Date: [ISO date]
URL: localhost:[port]

### Screenshots
| Breakpoint | Path | Issues |
|-----------|------|--------|
| 375px | .../screenshot-375.png | [none / specific issues] |
| 768px | .../screenshot-768.png | [none / specific issues] |
| 1024px | .../screenshot-1024.png | [none / specific issues] |
| 1440px | .../screenshot-1440.png | [none / specific issues] |

### Lighthouse
Performance: [score] [PASS/FAIL]
Accessibility: [score] [PASS/WARN]
Best Practices: [score] [PASS/WARN]

### Accessibility (axe-core)
Critical: [count] [PASS/FAIL]
Serious: [count] [PASS/WARN]
Moderate: [count] [INFO]

### Animation FPS
Average: [fps] [PASS/WARN/FAIL]
Minimum: [fps] [PASS/FAIL]
Readings: [list]

### Overall Verdict: PASS / CRITICAL_FAIL / WARNINGS
```
```

### Severity Classification System (for quality-gate-protocol)
```markdown
## Severity Classification

### CRITICAL (blocks pipeline, escalates to user)
- Anti-slop score < 25/35
- Archetype forbidden pattern detected
- Missing Design DNA signature element
- Lighthouse performance score < 80
- Critical accessibility violation (axe-core impact: "critical")
- Animation FPS < 30 on any section
- Build-time failure (missing artifact, broken import)

### WARNING (running tally, accumulates)
- Anti-slop score 25-27 (passing but low)
- Minor spacing inconsistencies
- Non-critical accessibility suggestions (axe-core impact: "serious"/"moderate")
- Close-to-threshold scores (Lighthouse 80-85)
- Average FPS 30-45 (technically passing but concerning)
- CD flags section as "could be bolder" (not "below bar")
- Missing non-critical polish items

### INFO (logged, not tallied)
- Anti-slop score breakdown per category
- Awwwards 4-axis scores
- Performance metrics above thresholds
- Screenshot comparison notes
- Minor axe-core suggestions (impact: "minor")

### Running Tally Format
Displayed in real-time status output by build-orchestrator:
```
Wave 2 complete — 2 warnings pending
  ⚠ Section 03-features: Lighthouse performance 82 (threshold: 80)
  ⚠ Section 04-product: axe-core serious violation (missing alt text on 1 image)
```

### User Checkpoint Trigger
- Warnings exist → MANDATORY checkpoint. Present summary, user decides.
- No warnings → Auto-proceed. Log "Clean build, auto-advancing."
```

## State of the Art

| Old Approach (v6.1.0) | Current Approach (v2.0) | When Changed | Impact |
|----------------------|------------------------|--------------|--------|
| No reference targets | Per-section reference quality targets in PLAN.md | v2.0 Phase 4 | Builders have concrete quality bar, not abstract instructions |
| Layout diversity caught in review | Layout diversity pre-assigned in MASTER-PLAN.md | v2.0 Phase 4 | Problems prevented structurally, not caught post-hoc |
| No dedicated polish pass | End-of-build polish pass with full creative license | v2.0 Phase 4 | Micro-details added as cohesive final layer |
| No live browser testing | Playwright MCP + Lighthouse + axe-core + FPS monitoring | v2.0 Phase 4 | Automated quality verification with hard thresholds |
| Quality review at end only | 4-layer progressive enforcement | v2.0 Phase 4 | Problems caught at cheapest fix point |
| Single severity level (pass/fail) | Tiered severity (critical/warning/info) | v2.0 Phase 4 | Proportionate response, no alert fatigue |
| Manual visual inspection | Automated 4-breakpoint screenshots | v2.0 Phase 4 | Systematic responsive verification |
| Advisory quality suggestions | Hard gates with pipeline consequences | v2.0 Phase 4 | Quality is structural, not hopeful |

**New tools available since v6.1.0:**
- Microsoft Playwright MCP server (`@playwright/mcp@latest`) -- standardized browser automation via MCP
- `Playwright_resize` with 143+ device presets -- easy multi-viewport testing
- `Playwright_evaluate` -- inject arbitrary JS for FPS monitoring, axe-core, computed style checks
- Long Animation Frames (LoAF) API -- more accurate animation performance monitoring (Chrome only)

## Open Questions

Things that couldn't be fully resolved:

1. **Playwright MCP availability in all target projects**
   - What we know: Playwright MCP server is available as `npx @playwright/mcp@latest` and can be added via `claude mcp add`. It works with Claude Code.
   - What's unclear: Whether it will be pre-configured in every user's Claude Code environment. The quality-reviewer agent may need to detect and handle the case where Playwright MCP is not available.
   - Recommendation: The live-testing skill should include a "graceful degradation" section: if Playwright MCP is unavailable, fall back to Lighthouse CLI via Bash tool + manual screenshot instructions for the user. FPS monitoring requires browser automation and cannot degrade.

2. **FPS monitoring accuracy via rAF injection**
   - What we know: requestAnimationFrame-based FPS counting is universal and works in all browsers. It measures frame rate effectively.
   - What's unclear: Whether FPS readings are accurate during Playwright-driven scrolling (Playwright may not scroll at the same rate as a real user). Also, 30fps threshold may be too aggressive for complex Three.js/WebGL scenes on lower-end hardware.
   - Recommendation: FPS monitoring is a best-effort signal, not a precise measurement. Flag < 30fps as a concern for investigation, not an automatic hard fail. Allow the quality-reviewer agent to note "FPS measurement taken during automated scroll -- may differ from real user experience."

3. **Reference library curation scope**
   - What we know: Each archetype should have 3-5 curated reference sites with specific section screenshots. Key beats only (Hero, Peak, Close, high-tension).
   - What's unclear: How large is the curated library? 16 archetypes x 3-5 sites x 3-4 sections = 144-320 reference entries. This is significant content to author.
   - Recommendation: Start with the TOP 5 most common archetypes (Neo-Corporate, Kinetic, Ethereal, Editorial, Luxury) with full reference sets. Other archetypes get archetype-level quality attributes without specific site references. Per-project research fills the gap.

4. **axe-core injection vs. dedicated package**
   - What we know: axe-core can be injected via CDN script tag or used via `@axe-core/playwright` package.
   - What's unclear: Whether the CDN approach is reliable (CDN may be blocked, version may change) or whether requiring `@axe-core/playwright` in target projects is too intrusive.
   - Recommendation: The skill should describe BOTH approaches. Primary: inject from CDN via `Playwright_evaluate`. Fallback: if CDN fails, instruct user to `npm install @axe-core/playwright` and run via that package. The skill is knowledge, not implementation -- it describes what to do.

5. **Auto-compare screenshots to PLAN.md expectations**
   - What we know: The user decided "4-breakpoint screenshots auto-compared against PLAN.md expectations."
   - What's unclear: How does an LLM "auto-compare" a screenshot to text expectations? Claude can read images (multimodal), so the quality-reviewer could literally look at the screenshot and compare to the plan's visual specification.
   - Recommendation: The quality-reviewer uses Claude's multimodal capability. It reads the screenshot image, reads the PLAN.md visual specification, and writes a comparison assessment. This is built into Claude's capabilities -- no special tool needed. The skill documents this workflow.

## Reference Benchmarking: Detailed Findings

### What Makes a Good Reference Target (HIGH confidence -- based on analysis of v6.1.0 skills and Awwwards patterns)

A reference target is NOT just a URL. It is a structured quality specification extracted from an award-winning implementation. The builder needs to know WHAT specifically makes the reference excellent, not just "look at this site."

**Effective reference target attributes:**
1. **Layout composition** -- the spatial relationship between elements (ratio, alignment, overlap)
2. **Typography treatment** -- specific font effects (tracking, gradient, weight contrast)
3. **Color depth** -- number of layers, shadow colors, gradient complexity
4. **Animation approach** -- entrance choreography, scroll integration, timing
5. **Depth technique** -- shadow layers, glass effects, overlaps, perspective
6. **Micro-detail** -- noise textures, gradient borders, cursor effects, selection color

**Per-archetype curated references should include:**
- 3-5 award-winning sites that exemplify the archetype's personality
- Specific section screenshots (hero, feature, social proof, CTA)
- Quality attributes per screenshot (what specifically makes it excellent)
- Date of reference (to track staleness)

### Scope: Key Beats Only (LOCKED DECISION from CONTEXT.md)

| Beat Type | Gets Reference Target? | Why |
|-----------|----------------------|-----|
| HOOK (Hero) | YES | First impression, highest impact |
| PEAK | YES | Screenshot moment, maximum wow |
| CLOSE (CTA) | YES | Conversion point, must be compelling |
| High-tension sections | YES | Creative tension needs a quality bar |
| TEASE | No -- DNA + archetype constraints sufficient | Low complexity, not a showcase moment |
| BUILD | No -- DNA + archetype constraints sufficient | Dense/functional, quality comes from organization |
| BREATHE | No -- DNA + archetype constraints sufficient | Minimal elements, quality is in restraint |
| PROOF | No -- DNA + archetype constraints sufficient | Content-driven, quality is in specificity |

## Compositional Diversity: Detailed Findings

### Layout Pattern Count Analysis (HIGH confidence -- based on creative-sections skill + landing-page skill analysis)

A typical premium landing page has 6-10 sections. To ensure no adjacent repeats, you need at least ceil(N/2) + 1 distinct patterns for N sections. For 10 sections: 6 distinct patterns minimum. For safety (some patterns work better with certain beats), 12-15 named patterns in the taxonomy gives comfortable margin.

**The v6.1.0 creative-sections skill already names these patterns:**
1. Split Hero (3D tilt)
2. Centered Hero (grid bg)
3. Magazine Split Hero
4. Bento Grid (asymmetric)
5. Marquee/Infinite Scroll
6. Stats Section (gap-px border grid)
7. Tabbed Showcase
8. Before/After Comparison
9. Scroll-Driven Storytelling
10. Horizontal Scroll Section
11. Spotlight Grid (cursor-following)
12. Variable Font Hero
13. Text Splitting Reveal
14. Full-Bleed Image Section

**Additional patterns needed for full taxonomy:**
15. Masonry Cards
16. Timeline/Vertical Flow
17. Centered Minimal (single statement)
18. Parallax Layers

**18 patterns across 6 visual groups (A-F) provide sufficient diversity for any page length.**

### Enforcement Mechanism (LOCKED DECISION: structural pre-assignment, not review-only)

The section-planner assigns layout patterns during MASTER-PLAN.md generation with these rules:
1. Each section gets a named pattern from the taxonomy
2. No two adjacent sections share the same pattern
3. No two adjacent sections share the same visual group (A-F) -- stricter than just different names
4. Background tokens alternate (no two adjacent sections with same bg-primary/secondary/tertiary)
5. The pre-assigned pattern is included in each section's PLAN.md frontmatter
6. Quality-reviewer validates post-build that actual implementation matches the assigned pattern (safety net)

## Polish Pass: Detailed Findings

### What Separates 8.0+ from 6.0 Awwwards Sites (MEDIUM confidence -- based on Awwwards trend research + v6.1.0 anti-slop skill analysis)

**Universal polish items (every archetype):**
1. **Hover state sophistication** -- not just color change. Scale + shadow shift, glow reveal, border animation, arrow/icon motion
2. **Custom selection color** -- `::selection` matching project palette (2 lines of CSS, massive polish signal)
3. **Smooth font loading** -- no FOUT, font-display: swap + preload display fonts
4. **Animation pairing** -- enter animations have corresponding exit animations
5. **Reduced motion** -- `prefers-reduced-motion: reduce` respected on all animations
6. **Text balance** -- `text-wrap: balance` on headings to prevent widows/orphans
7. **Scroll behavior** -- `scroll-behavior: smooth` at CSS level
8. **Focus management** -- visible focus rings on all interactive elements
9. **Stagger timing** -- grouped elements enter with 60-150ms stagger between items

**Archetype-dependent polish items:**
- **Noise/grain textures** -- appropriate for dark archetypes (Kinetic, Neon Noir, Glassmorphism), FORBIDDEN on light archetypes (Ethereal, Editorial) unless very subtle
- **Gradient borders** -- appropriate for most archetypes, FORBIDDEN on Brutalist
- **Cursor effects** -- appropriate for dark, interactive archetypes (Kinetic, Neon Noir, Glassmorphism, Playful), NOT for minimal archetypes (Japanese Minimal, Swiss)
- **Glass/blur effects** -- appropriate for Glassmorphism (mandatory), some dark archetypes, FORBIDDEN on Brutalist, Editorial
- **Colored shadows** -- appropriate for most archetypes, especially Kinetic, Neon Noir, Luxury

### Polish Pass Timing (LOCKED DECISION: single pass at end of build)

The polisher sees the COMPLETE page after all waves are done. This is important because:
1. The polisher can see the full visual rhythm and adjust micro-details for cohesion
2. Stagger timing and animation choreography make more sense with all sections present
3. Color/shadow consistency across the entire page can be verified and tuned
4. The page-level signature element can be evaluated for prominence and evolution

The polisher receives:
- Input: The full built page (all code files), DESIGN-DNA.md, the universal + archetype-specific polish checklist
- Creative license: Full freedom to restyle hover states, add unexpected micro-interactions, push visual refinement. Only DNA-constrained.
- Output: Updated code files with polish applied, SUMMARY.md with polish report

## Live Browser Testing: Detailed Findings

### Playwright MCP Server Capabilities (HIGH confidence -- verified via official GitHub and tool documentation)

The Microsoft Playwright MCP server (`@playwright/mcp@latest`) provides all necessary capabilities for live browser testing:

**Screenshot workflow:**
1. `Playwright_navigate` -- load the dev server URL
2. `Playwright_resize` -- set viewport to target width (supports 1-7680px width, 1-4320px height)
3. `Playwright_screenshot` -- capture full page or specific element, returns base64 PNG
4. Repeat for each of 4 breakpoints: 375px, 768px, 1024px, 1440px

**Device emulation:**
- 143+ device presets (iPhone 13, iPad Pro 11, Pixel 7, Galaxy S24, Desktop Chrome)
- Automatic configuration of viewport, user-agent, device scale factor, touch capabilities
- Orientation support (portrait/landscape)

**JavaScript execution:**
- `Playwright_evaluate` -- execute arbitrary JS in browser console
- Use for: FPS monitoring, axe-core injection, computed style verification, Lighthouse via JS API

**Additional capabilities:**
- `Playwright_hover` -- test hover states on specific elements
- `Playwright_console_logs` -- capture console errors/warnings
- `playwright_get_visible_text` -- extract page text for content verification

### Lighthouse Integration (HIGH confidence -- verified via official docs)

**Primary approach: CLI via Bash tool**
```bash
npx lighthouse http://localhost:3000 \
  --output=json \
  --output-path=.planning/modulo/audit/lighthouse.json \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices
```

This requires `lighthouse` to be available in the target project's environment (installed globally or as devDependency).

**Fallback: Via Playwright_evaluate**
If Lighthouse CLI is not available, the quality-reviewer can note this and recommend the user install it. Performance can still be partially assessed via browser DevTools metrics.

**Thresholds (LOCKED DECISIONS from CONTEXT.md):**
- Performance < 80 = CRITICAL FAIL (hard fail, blocks pipeline)
- Accessibility < 90 = WARNING
- Best Practices < 80 = WARNING

### axe-core Integration (HIGH confidence -- verified via Playwright docs and npm package)

**Primary approach: CDN injection via Playwright_evaluate**
1. Inject axe-core script from CDN
2. Run `axe.run()` with WCAG 2.1 AA tags
3. Parse violations by impact level

**Configuration for WCAG 2.1 AA:**
```javascript
axe.run(document, {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
})
```

**Impact levels and consequences:**
- `critical` = CRITICAL FAIL (blocks pipeline)
- `serious` = WARNING (running tally)
- `moderate` = INFO (logged)
- `minor` = INFO (logged)

### FPS Monitoring (MEDIUM confidence -- rAF approach is proven but accuracy during automated scroll is uncertain)

**Approach:** Inject FPS counter via `Playwright_evaluate`, scroll through page, collect readings.

**Implementation:**
1. Inject FPS monitoring script (see Code Examples section)
2. Use Playwright to scroll through entire page slowly
3. Collect FPS readings every 500ms
4. Flag any reading < 30fps as concern

**Limitations:**
- rAF FPS counting measures main thread frame rate, not GPU animation performance
- Playwright's scroll behavior may not perfectly replicate real user scrolling
- CSS animations running purely on compositor thread may show 60fps even if visual performance is poor
- Three.js/WebGL scenes may have variable FPS that doesn't reflect actual visual quality

**Recommendation:** Use FPS monitoring as a SIGNAL, not absolute truth. < 30fps average flags for investigation. < 30fps minimum on multiple readings = legitimate concern.

## Quality Gate Pipeline Integration: Detailed Findings

### How the 4 Layers Map to the Wave Execution Cycle

```
Wave N Execution Flow:
═══════════════════════════════════════════════════════════════

1. Section-planner generates PLAN.md files for wave N
   └── Layer 1 input: reference targets, layout assignments in plans

2. CD pre-build review (light, blocking)
   └── CD reads plans, approves or suggests modifications

3. Build-orchestrator spawns builders for wave N
   └── Each builder has layout pattern + reference target in spawn prompt

4. Builders complete their sections
   └── Layer 1: Builder self-checks against must_haves
   └── Light polish (built into builder's final tasks)

5. POST-WAVE: Quality review + CD review (parallel)
   ├── Quality-reviewer: 3-level verification + anti-slop scoring
   ├── Creative-director: 8-dimension creative review
   └── Layer 2: Findings classified by severity
       ├── CRITICAL → Pipeline blocks, escalate to user
       └── WARNING → Running tally, continue

6. If CRITICAL: User decides (fix, skip, abort)
   If clean/WARNING only: Continue to next wave

7. Polisher processes any GAP-FIX.md files from QR/CD

8. Repeat for waves N+1, N+2, ...

═══════════════════════════════════════════════════════════════
After all waves complete:

9. End-of-build polish pass (polisher sees full page)
   └── Universal + archetype-specific polish checklist

10. Layer 3: Live browser testing (comprehensive)
    ├── 4-breakpoint screenshots
    ├── Lighthouse audit
    ├── axe-core accessibility audit
    ├── FPS monitoring
    └── All run by quality-reviewer via MCP tools

11. Layer 3 results classified by severity
    ├── CRITICAL → Escalate to user
    └── WARNING → Add to running tally

12. Layer 4: User checkpoint
    ├── If warnings accumulated → MANDATORY review
    │   Present: screenshots, quality report, CD assessment, warning tally
    │   User decides: ship, iterate, or fix specific issues
    └── If clean build → Auto-proceed
        Log: "Clean build verified. Ready to ship."
```

### Interaction Between CD and QR at Layer 2

The CD and QR run in PARALLEL after each wave, not sequentially:

```
After Wave N completes:
    ┌─────────────────────────┐     ┌──────────────────────────────┐
    │ Creative Director       │     │ Quality Reviewer              │
    │ - Archetype personality │     │ - 3-level verification        │
    │ - Creative tension bold?│     │ - Anti-slop 35-point scoring  │
    │ - Emotional arc on beat?│     │ - DNA compliance check        │
    │ - Color journey?        │     │ - UX pattern check            │
    │ - Screenshot-worthy?    │     │ - Content verification        │
    └───────────┬─────────────┘     └──────────────┬───────────────┘
                │                                   │
                └───────────┬───────────────────────┘
                            │
                    ┌───────▼────────┐
                    │ Merge Findings │
                    │ Classify severity│
                    │ Create GAP-FIX.md│
                    └───────┬────────┘
                            │
              ┌─────────────▼──────────────┐
              │ Build Orchestrator          │
              │ - Update running tally      │
              │ - Block on critical         │
              │ - Continue on warning/clean │
              └────────────────────────────┘
```

### Running Tally Format

The build-orchestrator maintains a running tally of warnings across all waves:

```markdown
## Build Quality Status

### Current Status: IN_PROGRESS | Wave 3 of 4

### Critical Issues: 0 (none blocking)

### Warning Tally: 4 accumulated
| Wave | Section | Warning | Source |
|------|---------|---------|--------|
| 1 | 02-logos | Lighthouse performance 83 | QR |
| 2 | 04-product | Missing alt text (1 image) | QR/axe |
| 2 | 05-stats | Creative tension could be bolder | CD |
| 3 | 07-testimonials | Spacing inconsistency in card grid | QR |

### Sections Reviewed: 7/10
### Anti-Slop Scores: 28, 30, 27, 31, 29, 26, 28 (avg: 28.4)
### Overall Health: GOOD (warnings present, no critical issues)
```

## Sources

### Primary (HIGH confidence)
- Modulo v6.1.0 skill analysis: anti-slop-design, awwwards-scoring, quality-standards, visual-auditor, creative-sections, landing-page, emotional-arc, performance-guardian -- all read directly from the codebase
- Phase 2 research and plans: 02-RESEARCH.md, 02-01-PLAN.md through 02-04-PLAN.md -- pipeline architecture decisions that Phase 4 builds on
- Phase 4 CONTEXT.md -- user decisions that constrain this research
- [Microsoft Playwright MCP server](https://github.com/microsoft/playwright-mcp) -- official repository, tool capabilities verified
- [Playwright MCP Supported Tools](https://executeautomation.github.io/mcp-playwright/docs/playwright-web/Supported-Tools) -- comprehensive tool list with parameters
- [Playwright Accessibility Testing docs](https://playwright.dev/docs/accessibility-testing) -- official axe-core integration guide
- [Google Lighthouse GitHub](https://github.com/GoogleChrome/lighthouse) -- CLI and programmatic usage documentation

### Secondary (MEDIUM confidence)
- [Awwwards SOTD Winners 2025-2026](https://www.awwwards.com/websites/sites_of_the_day/) -- design pattern trends
- [Web Design Trends 2025](https://dev.to/watzon/25-web-design-trends-to-watch-in-2025-e83) -- layout and polish trends
- [Bento Grid Design Trend](https://senorit.de/en/blog/bento-grid-design-trend-2025) -- bento grid as dominant pattern
- [Awwwards Gradient Trends](https://www.awwwards.com/gradients-in-web-design-elements.html) -- gradient usage in premium design
- [Custom Cursor Effects](https://www.awwwards.com/inspiration/custom-cursor-with-trail-effect-and-blending-layers) -- cursor effect examples
- [Simon Willison's Playwright MCP TIL](https://til.simonwillison.net/claude-code/playwright-mcp-claude-code) -- practical usage with Claude Code

### Tertiary (LOW confidence)
- FPS monitoring accuracy during Playwright automated scroll -- untested, may differ from real user experience
- LoAF (Long Animation Frames) API -- Chrome-only, experimental, may not be widely available
- axe-core CDN injection reliability -- CDN availability in all environments unverified

## Metadata

**Confidence breakdown:**
- Reference benchmarking: HIGH -- format derived from proven v6.1.0 patterns (REFERENCES.md, quality-reviewer reference comparison), user decisions lock the scope
- Compositional diversity: HIGH -- layout taxonomy derived from existing creative-sections + landing-page skills, enforcement mechanism is straightforward MASTER-PLAN.md extension
- Polish pass: HIGH -- polish items derived from existing anti-slop-design skill + creative-sections skill + Awwwards trend analysis, archetype-specific items from design-archetypes skill
- Live browser testing: MEDIUM -- MCP tools are verified and available, but FPS monitoring accuracy and MCP availability in all user environments introduces uncertainty
- Quality gate integration: HIGH -- pipeline integration points are well-defined from Phase 2 research, severity classification is straightforward

**Research date:** 2026-02-24
**Valid until:** 60 days (stable domain -- quality enforcement patterns are mature, MCP tool APIs are stable)
