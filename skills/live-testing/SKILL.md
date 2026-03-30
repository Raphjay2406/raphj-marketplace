---
name: live-testing
category: core
description: "Defines the automated browser testing protocol: 4-breakpoint screenshots, Lighthouse performance audit, axe-core accessibility audit, and animation FPS monitoring. Uses Playwright MCP as primary tool."
triggers:
  - live testing
  - browser testing
  - screenshots
  - lighthouse
  - accessibility audit
  - fps
  - performance audit
used_by:
  - quality-reviewer
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Why Live Testing

Code review catches structural issues but misses visual and performance problems. A section can pass anti-slop scoring with a perfect 35/35 yet have poor Lighthouse performance, invisible accessibility violations, or janky scroll animations. Live browser testing provides objective, automated verification that the built output actually performs as intended in a real browser environment.

### When It Runs

**LOCKED:** Once at end of build, AFTER the polish pass completes. Tests the final polished output.

- Never per-section (wastes time on incomplete output)
- Never per-wave (kills velocity -- quality-reviewer does code-based checks per wave)
- Only the final, complete, polished page gets the full browser test suite

### What Blocks the Pipeline

**CRITICAL FAIL (hard fail -- pipeline blocks, escalates to user):**

| Check | Threshold | Consequence |
|-------|-----------|-------------|
| Lighthouse performance score | < 80 | Pipeline blocks |
| axe-core critical violation | impact: "critical" | Pipeline blocks |
| Animation FPS minimum | < 30 on any section | Pipeline blocks |

**WARNING (running tally -- accumulates, user checkpoint if present):**

| Check | Threshold | Consequence |
|-------|-----------|-------------|
| Lighthouse accessibility score | < 90 | Warning tallied |
| Lighthouse best practices score | < 80 | Warning tallied |
| axe-core serious violation | impact: "serious" | Warning tallied |
| Average FPS | 30-45 | Warning tallied |

**INFO (logged in report, no pipeline effect):**

| Check | Threshold | Consequence |
|-------|-----------|-------------|
| axe-core moderate violation | impact: "moderate" | Logged |
| axe-core minor violation | impact: "minor" | Logged |
| Performance metrics above thresholds | -- | Logged for reference |

### Parallel Execution

**LOCKED:** Creative Director review and automated testing run in PARALLEL. CD reviews creative quality (boldness, archetype personality, emotional arc) while quality-reviewer runs the technical test protocol below. Both produce findings that merge into a single quality report.

### Tool Strategy

**Primary tool:** Playwright MCP (`@playwright/mcp@latest`). Provides browser automation, viewport resize, screenshots, and JavaScript execution via MCP protocol.

**If Playwright MCP is unavailable:** Graceful degradation path defined in the Degradation Protocol section below. The protocol does not fail catastrophically -- it degrades to CLI tools and manual steps where needed.

### Preconditions

Before running this protocol, ALL of these must be true:

1. All waves complete (every section built and reviewed)
2. Polish pass complete (polisher has finished end-of-build polish)
3. Dev server running at localhost:[port]
4. Playwright MCP server available (detect and handle gracefully if not)

### Pipeline Connection

- **Referenced by:** quality-reviewer agent during end-of-build verification (Layer 3)
- **Consumed at:** build-orchestrator after polish pass, before user checkpoint (Layer 4)
- **Results feed into:** quality-gate-protocol for severity classification and pipeline decision

---

## Layer 2: Award-Winning Examples

This layer defines the 5-step testing protocol with exact tool invocations, JavaScript snippets, and report format. The quality-reviewer executes these steps sequentially.

### Step 1: 4-Breakpoint Responsive Screenshots

Capture full-page screenshots at the 4 standard breakpoints to verify responsive layout and visual quality.

**Breakpoints:** 375px (Mobile), 768px (Tablet), 1024px (Desktop), 1440px (Wide Desktop)

**Procedure for each breakpoint:**

```
1. Playwright_resize: set viewport to width={breakpoint}px, height=900px
2. Playwright_navigate: load http://localhost:[port]
3. Wait 2 seconds for animations and lazy-loaded content to settle
4. Playwright_screenshot: capture full-page screenshot
5. Save to .planning/genorah/audit/screenshot-{breakpoint}.png
```

**Screenshot Visual Comparison Protocol:**

After capturing all 4 breakpoints, the quality-reviewer uses Claude's multimodal capability to compare screenshots against section PLAN.md expectations:

For each key section (those with `reference_target` in PLAN.md):

1. Read the `<reference_quality_target>` block from the section's PLAN.md
2. Examine the corresponding area in the screenshot
3. For each of the 6 quality attributes (layout, typography, color, motion evidence, depth, signature detail):
   - Assess: **EXCEEDS** / **MATCHES** / **BELOW**
4. Section verdict:
   - **PASS** -- all attributes MATCHES or above
   - **CONCERN** -- 1 attribute BELOW
   - **FAIL** -- 2+ attributes BELOW

For supporting sections (no reference target): verify layout matches assigned pattern from MASTER-PLAN.md and no visual breakage is present.

### Step 2: Lighthouse Performance Audit

Run Lighthouse to get objective performance, accessibility, and best practices scores.

**Primary approach -- CLI via Bash tool:**

```bash
npx lighthouse http://localhost:[port] \
  --output=json \
  --output-path=.planning/genorah/audit/lighthouse.json \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices
```

**Parse results and classify:**

```
Performance score:
  < 80  --> CRITICAL FAIL (pipeline blocks, escalate to user)
  80-89 --> WARNING (close to threshold, tally)
  90+   --> PASS

Accessibility score:
  < 90  --> WARNING
  90+   --> PASS

Best Practices score:
  < 80  --> WARNING
  80+   --> PASS
```

**Key performance metrics to extract and report:**

| Metric | Target | What It Measures |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Main content load time |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |
| TBT (Total Blocking Time) | < 200ms | Main thread responsiveness |
| FCP (First Contentful Paint) | < 1.8s | First visual response |
| Speed Index | < 3.4s | Visual completeness rate |

**If Lighthouse CLI is not available:** Note in report. Recommend user install: `npm install -g lighthouse`. Proceed with remaining tests -- Lighthouse is one of four checks, not a prerequisite for the others.

### Step 3: axe-core Accessibility Audit

Inject axe-core into the running page and run a WCAG 2.1 AA audit.

**Primary approach -- CDN injection via Playwright_evaluate:**

```javascript
// Inject axe-core from CDN and run WCAG 2.1 AA audit
return new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10/axe.min.js';
  script.onload = () => {
    axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
    }).then(results => {
      resolve({
        violations: results.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
          help: v.helpUrl
        })),
        passes: results.passes.length,
        incomplete: results.incomplete.length
      });
    });
  };
  script.onerror = () => reject('Failed to load axe-core from CDN');
  document.head.appendChild(script);
});
```

**Classify violations by impact:**

```
impact: "critical" --> CRITICAL FAIL (pipeline blocks)
impact: "serious"  --> WARNING (running tally)
impact: "moderate" --> INFO (logged in report)
impact: "minor"    --> INFO (logged in report)
```

**Fallback if CDN injection fails:** Instruct user to install the axe-core CLI in the target project:

```bash
npm install --save-dev @axe-core/cli
npx axe http://localhost:[port] --exit
```

Note the fallback in the report.

### Step 4: Animation FPS Monitoring

Inject a requestAnimationFrame-based FPS counter and scroll through the page to trigger all scroll-driven animations.

**FPS monitoring script -- inject via Playwright_evaluate:**

```javascript
// Monitor animation frame rate over a scrolling period
// Returns average FPS, minimum FPS, and raw readings
(function monitorFPS() {
  return new Promise((resolve) => {
    const readings = [];
    let frames = 0;
    let lastTime = performance.now();
    const duration = 3000; // Monitor for 3 seconds per scroll segment
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
        const avgFPS = readings.length > 0
          ? Math.round(readings.reduce((a, b) => a + b, 0) / readings.length)
          : 0;
        const minFPS = readings.length > 0 ? Math.min(...readings) : 0;
        resolve({ avgFPS, minFPS, readings });
      }
    }
    requestAnimationFrame(tick);
  });
})();
```

**FPS monitoring procedure:**

1. Navigate to page via `Playwright_navigate`
2. Inject FPS monitoring script via `Playwright_evaluate`
3. During monitoring, scroll through entire page slowly to trigger all scroll-driven animations
4. Collect FPS readings every 500ms over 3 seconds per scroll segment
5. Classify results:

```
Min FPS < 30        --> CRITICAL FAIL (animation too heavy for smooth experience)
Avg FPS 30-45       --> WARNING (concerning, may affect user experience)
Avg FPS 45+         --> PASS
```

**Important caveat:** FPS readings during Playwright-driven scroll may differ from real user scrolling. The browser's compositor thread, GPU scheduling, and scroll physics behave differently under programmatic control. Flag < 30fps as a concern for investigation, not absolute ground truth. Always note "FPS measured during automated scroll" in the report.

### Step 5: Generate Testing Report

After all 4 tests complete, produce the structured testing report.

**Report format:**

```markdown
# Live Testing Report

**Date:** [ISO date]
**URL:** localhost:[port]
**Page:** [page name or route]
**Archetype:** [project archetype]

## Screenshots (4 Breakpoints)

| Breakpoint | File | Key Issues |
|-----------|------|------------|
| 375px (Mobile) | .planning/genorah/audit/screenshot-375.png | [none / issues] |
| 768px (Tablet) | .planning/genorah/audit/screenshot-768.png | [none / issues] |
| 1024px (Desktop) | .planning/genorah/audit/screenshot-1024.png | [none / issues] |
| 1440px (Wide) | .planning/genorah/audit/screenshot-1440.png | [none / issues] |

### Section Visual Comparison

| Section | Reference Match | Issues |
|---------|----------------|--------|
| [XX-name] | [EXCEEDS/MATCHES/BELOW] | [specific discrepancy or "--"] |

## Lighthouse

| Category | Score | Threshold | Verdict |
|----------|-------|-----------|---------|
| Performance | [score] | >= 80 | [PASS/FAIL] |
| Accessibility | [score] | >= 90 | [PASS/WARN] |
| Best Practices | [score] | >= 80 | [PASS/WARN] |

### Performance Breakdown

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP | [time]s | < 2.5s | [PASS/WARN/FAIL] |
| CLS | [value] | < 0.1 | [PASS/WARN/FAIL] |
| TBT | [time]ms | < 200ms | [PASS/WARN/FAIL] |
| FCP | [time]s | < 1.8s | [PASS/WARN/FAIL] |
| Speed Index | [time]s | < 3.4s | [PASS/WARN/FAIL] |

## Accessibility (axe-core)

| Impact | Count | Verdict |
|--------|-------|---------|
| Critical | [n] | [PASS/FAIL] |
| Serious | [n] | [PASS/WARN] |
| Moderate | [n] | INFO |
| Minor | [n] | INFO |

### Violations Detail (Critical + Serious only)

| Rule | Impact | Description | Elements |
|------|--------|-------------|----------|
| [id] | [impact] | [description] | [count] affected |

## Animation FPS

| Metric | Value | Threshold | Verdict |
|--------|-------|-----------|---------|
| Average FPS | [fps] | >= 45 | [PASS/WARN] |
| Minimum FPS | [fps] | >= 30 | [PASS/FAIL] |
| Readings | [list] | -- | -- |

*Note: FPS measured during automated scroll -- may differ from real user experience.*

## Overall Verdict

| Check | Result |
|-------|--------|
| Screenshots | [PASS/CONCERNS] |
| Lighthouse | [PASS/FAIL/WARN] |
| Accessibility | [PASS/FAIL/WARN] |
| Animation FPS | [PASS/FAIL/WARN] |
| **OVERALL** | **[PASS / CRITICAL_FAIL / WARNINGS_ONLY]** |

### Critical Issues (must fix before shipping)

[list or "None"]

### Warnings (accumulated in tally)

[list or "None -- clean build"]
```

**Overall verdict logic:**

- Any single CRITICAL FAIL in any check --> **CRITICAL_FAIL** (pipeline blocks, escalate to user)
- No critical fails but one or more WARNINGs --> **WARNINGS_ONLY** (add to running tally, mandatory user checkpoint)
- No critical fails and no warnings --> **PASS** (clean build, auto-proceed)

**Report location:** `.planning/genorah/audit/TESTING-REPORT.md`

Screenshots saved alongside: `.planning/genorah/audit/screenshot-{breakpoint}.png`

### Graceful Degradation Protocol

When Playwright MCP is unavailable, the testing protocol degrades rather than fails:

**Detection:** Attempt `Playwright_navigate` to the dev server URL. If the MCP tool is not found (tool not available error), switch to degradation mode.

| Test | With Playwright MCP | Without Playwright MCP |
|------|-------------------|----------------------|
| Screenshots | Automated at 4 breakpoints | Manual: instruct user to capture at 375, 768, 1024, 1440px using browser DevTools device toolbar |
| Lighthouse | CLI via Bash (`npx lighthouse`) -- works with or without MCP | Same CLI approach -- no degradation needed |
| axe-core | CDN injection via `Playwright_evaluate` | CLI: `npx @axe-core/cli http://localhost:[port] --exit` (user must install `@axe-core/cli`) |
| FPS | rAF injection via `Playwright_evaluate` + automated scroll | Cannot degrade -- note "unable to test, manual verification recommended" in report |

**Degradation report:** When running in degraded mode, the report header includes:

```markdown
**Mode:** DEGRADED (Playwright MCP unavailable)
**Tests automated:** Lighthouse (CLI)
**Tests manual:** Screenshots (user-captured), Accessibility (CLI)
**Tests skipped:** FPS monitoring (requires browser automation)
```

---

## Layer 3: Integration Context

### Pipeline Position

This skill sits at **Layer 3 (End-of-Build)** in the 4-layer progressive enforcement system:

```
Layer 1: BUILD-TIME    -- builder self-checks (free, per-section)
Layer 2: POST-WAVE     -- quality-reviewer code review + CD creative review
Layer 3: END-OF-BUILD  -- THIS SKILL: live browser testing (once, after polish)
Layer 4: USER CHECKPOINT -- human judgment on quality report
```

- **Input from:** Polish pass complete, dev server running, all sections built
- **Output to:** Quality gate protocol for severity classification, build-orchestrator for pipeline decision, user checkpoint (Layer 4) for human review

### Agent Integration

The quality-reviewer agent loads this skill via its `skills` frontmatter and executes the protocol at end-of-build:

```yaml
# In agents/pipeline/quality-reviewer.md frontmatter
skills:
  - anti-slop-gate
  - design-archetypes
  - live-testing         # <-- this skill
  - quality-gate-protocol
```

The quality-reviewer:
1. Completes its per-wave code-based reviews (Levels 1-3 + anti-slop scoring)
2. After the polish pass, switches to live browser testing mode
3. Follows this skill's 5-step protocol exactly
4. Produces the testing report
5. Passes the overall verdict to the build-orchestrator

### Build-Orchestrator Integration

The build-orchestrator reads the overall verdict from the testing report and acts:

| Verdict | Action |
|---------|--------|
| **CRITICAL_FAIL** | Pipeline blocks. Escalate to user with full report and screenshots. No auto-retry. |
| **WARNINGS_ONLY** | Add warnings to running tally. Mandatory user checkpoint at Layer 4. Present report. |
| **PASS** | Clean build. Auto-proceed to Layer 4 if no prior accumulated warnings. Log "Clean build verified." |

### Audit Artifacts

All testing artifacts are saved to `.planning/genorah/audit/` for user review:

| File | Content |
|------|---------|
| `screenshot-375.png` | Mobile full-page screenshot |
| `screenshot-768.png` | Tablet full-page screenshot |
| `screenshot-1024.png` | Desktop full-page screenshot |
| `screenshot-1440.png` | Wide desktop full-page screenshot |
| `lighthouse.json` | Raw Lighthouse results (JSON) |
| `TESTING-REPORT.md` | Structured report with verdicts |

### Related Skills

- **quality-gate-protocol** -- defines the 4-layer enforcement system this skill operates within; handles severity classification and pipeline decisions based on this skill's verdicts
- **anti-slop-gate** -- code-based quality scoring (Layer 2); this skill provides runtime verification (Layer 3) that complements static analysis
- **polish-pass** -- runs immediately before this skill; testing verifies the polish was effective
- **reference-benchmarking** -- provides the `<reference_quality_target>` blocks that Step 1 screenshot comparison evaluates against
- **compositional-diversity** -- pre-assigns layout patterns verified visually in Step 1 screenshots

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Testing Too Often

**What goes wrong:** Running the full Lighthouse + axe-core + screenshots + FPS suite after every wave or every section. A 4-wave build with 10 sections runs the suite 14 times instead of once. Each run takes 2-3 minutes. Total: 28-42 minutes of testing on incomplete output that will change anyway.

**Instead:** Run comprehensive live testing ONCE at end of build, after the polish pass. Per-wave quality checks are code-based only (quality-reviewer reads code, does not launch a browser). The only browser interaction mid-build is quick spot-checks if a specific concern arises.

### Anti-Pattern: Testing Before Polish

**What goes wrong:** Running live tests after all waves complete but before the polish pass. The polisher adds noise textures, gradient borders, hover micro-interactions, custom selection colors, and stagger timing refinements. Testing pre-polish output wastes effort because the polisher may fix issues that would have been flagged, and testing will need to run again anyway.

**Instead:** Always test the FINAL polished output. The sequence is: all waves complete --> polish pass --> live browser testing. No exceptions.

### Anti-Pattern: FPS as Absolute Truth

**What goes wrong:** Treating the rAF-based FPS counter as a precise performance measurement. A reading of 28fps triggers a hard fail and emergency remediation, when in reality the measurement was taken during Playwright's synthetic scroll which does not replicate real user scrolling physics. CSS compositor-thread animations may report different FPS under programmatic scroll than under natural user interaction.

**Instead:** Use FPS monitoring as a SIGNAL for investigation. Flag < 30fps minimum as a concern. Note "FPS measured during automated scroll" in every report. If FPS is borderline (25-35fps), recommend manual testing by the user before declaring it a hard fail.

### Anti-Pattern: Ignoring Graceful Degradation

**What goes wrong:** The testing protocol assumes Playwright MCP is always available. When a user's Claude Code environment does not have Playwright MCP configured, the entire testing step fails with "tool not found" and the quality-reviewer skips all browser testing. No screenshots, no FPS, no axe-core injection.

**Instead:** Always check for Playwright MCP availability first. If unavailable, switch to the degradation protocol: Lighthouse via CLI (works without MCP), axe-core via CLI, manual screenshot instructions for user, FPS skipped with notation. A degraded report is far more valuable than no report.

### Anti-Pattern: Hard-Failing on Every Accessibility Issue

**What goes wrong:** Every axe-core violation, regardless of impact level, is treated as a pipeline blocker. A page with 2 "minor" violations (e.g., landmark region advisory) and 1 "moderate" violation (e.g., color contrast on decorative text) gets the same CRITICAL FAIL as a page with missing alt text on primary content images.

**Instead:** Only "critical" impact violations block the pipeline. "Serious" violations are warnings (running tally). "Moderate" and "minor" are informational (logged but do not affect pipeline flow). This prevents alert fatigue while ensuring genuinely critical accessibility barriers are caught.

### Anti-Pattern: Screenshots Without Comparison

**What goes wrong:** 4-breakpoint screenshots are captured and saved to the audit directory, but nobody compares them to anything. They are pretty pictures sitting in a folder. The quality-reviewer reports "screenshots captured" as a pass without examining whether the built sections actually match their PLAN.md visual specifications.

**Instead:** Every screenshot capture must be followed by the visual comparison protocol. The quality-reviewer reads each section's `<reference_quality_target>` block, examines the corresponding area in the screenshot, and assesses each quality attribute. Screenshots without comparison are verification theater, not quality enforcement.

### Anti-Pattern: Testing Only at Desktop Width

**What goes wrong:** All testing is done at 1440px because it is the easiest viewport to assess. Mobile (375px) and tablet (768px) are skipped or glanced at. The most common visual breakage -- overlapping text, horizontal overflow, touch targets too small, images breaking layout -- happens at mobile width.

**Instead:** Test at ALL 4 breakpoints. Start with 375px mobile (most likely to have issues), then 768px tablet, then 1024px and 1440px desktop. Report issues per breakpoint. The 375px screenshot is often the most revealing quality indicator.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Lighthouse performance score | 80 | -- | points | HARD -- CRITICAL FAIL below threshold |
| Lighthouse accessibility score | 90 | -- | points | SOFT -- WARNING below threshold |
| Lighthouse best practices score | 80 | -- | points | SOFT -- WARNING below threshold |
| axe-core critical violations | -- | 0 | count | HARD -- CRITICAL FAIL if any |
| Animation FPS minimum | 30 | -- | fps | HARD -- CRITICAL FAIL below threshold |
| Animation FPS average | 45 | -- | fps | SOFT -- WARNING below threshold |
| Screenshot breakpoints | 4 | 4 | count | HARD -- all 4 required |
| FPS sampling interval | 500 | 500 | ms | HARD -- consistent measurement |
| FPS monitoring duration | 3000 | 3000 | ms | HARD -- per scroll segment |
| Post-navigation wait | 2 | 2 | seconds | HARD -- animation settle time |
