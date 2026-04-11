---
name: visual-qa-protocol
description: "Automated visual QA via Playwright MCP. 4-breakpoint screenshot capture, CSS/DOM token verification, hover state testing, console error detection, accessibility snapshot, and DNA compliance checking in rendered output."
tier: core
triggers: "visual QA, screenshot, breakpoint test, visual testing, browser test, rendered output, CSS verification, DOM audit, visual regression"
version: "2.1.0"
metadata:
  priority: 8
---

## Layer 1: Decision Guidance

### When to Use

- **End-of-build quality review** -- After polish pass completes, run full visual QA on the rendered page
- **Per-wave spot checks** -- When quality-reviewer wants to verify specific sections visually between waves
- **Responsive verification** -- When verifying mobile/tablet layouts are real redesigns, not stacked desktop
- **Hover/interaction state audit** -- When verifying all interactive elements have proper states
- **DNA token compliance in rendered output** -- When verifying computed CSS uses DNA variables, not hardcoded values
- **Console error detection** -- When checking for runtime JavaScript errors in the built output

### When NOT to Use

- **During planning** -- No rendered output exists yet
- **For code review only** -- If no dev server is running, use code-based review instead
- **For content review** -- Content quality is assessed via code review, not visual inspection

### Preconditions

ALL of these must be true:
1. Dev server running at `localhost:[port]` (Next.js dev, Astro dev, Vite dev)
2. Playwright MCP server available (`mcp__plugin_playwright_playwright__*` tools accessible)
3. At least one section has been built and is renderable

### Pipeline Connection

- **Referenced by:** quality-reviewer agent during Layer 3 (end-of-build verification)
- **Referenced by:** `/gen:audit` command for standalone quality audits
- **Consumed at:** orchestrator after polish pass, before user checkpoint

---

## Layer 2: QA Protocol Steps

### Step 1: 4-Breakpoint Screenshot Capture

Capture full-page screenshots at all 4 standard breakpoints.

**Tool sequence per breakpoint:**

```
mcp__plugin_playwright_playwright__browser_resize({ width: WIDTH, height: 900 })
mcp__plugin_playwright_playwright__browser_navigate({ url: "http://localhost:[port]" })
mcp__plugin_playwright_playwright__browser_wait_for({ time: 3 })
mcp__plugin_playwright_playwright__browser_take_screenshot({
  type: "png",
  fullPage: true,
  filename: ".planning/genorah/audit/screenshot-{WIDTH}px.png"
})
```

| Breakpoint | Width | Height | Filename |
|-----------|-------|--------|----------|
| Mobile | 375 | 812 | screenshot-375px.png |
| Tablet | 768 | 1024 | screenshot-768px.png |
| Desktop | 1280 | 800 | screenshot-1280px.png |
| Wide | 1440 | 900 | screenshot-1440px.png |

**After all 4 captures:** Read each screenshot image via the Read tool and visually assess:

| Check | Pass | Fail |
|-------|------|------|
| No horizontal overflow | Content fits within viewport at all widths | Scrollbar or overflow visible |
| Mobile is a real redesign | Unique layout, content reordered, not stacked desktop | Desktop layout just shrunk |
| Typography readable | Heading/body hierarchy clear at all sizes | Text too small, truncated, or overlapping |
| Color matches DNA | Visual colors consistent with DNA token palette | Noticeable color drift or hardcoded values |
| Signature element visible | Present in at least hero + 1 other section | Missing or barely visible |
| No broken images | All images load and display correctly | 404, broken, or unstyled images |

### Step 2: CSS/DOM DNA Token Verification

Use JavaScript evaluation to programmatically verify DNA compliance in the rendered page.

**Color token check:**
```javascript
// mcp__plugin_playwright_playwright__browser_evaluate
() => {
  const root = getComputedStyle(document.documentElement);
  const dnaTokens = {
    primary: root.getPropertyValue('--color-primary').trim(),
    secondary: root.getPropertyValue('--color-secondary').trim(),
    accent: root.getPropertyValue('--color-accent').trim(),
    bg: root.getPropertyValue('--color-bg').trim(),
    surface: root.getPropertyValue('--color-surface').trim(),
    text: root.getPropertyValue('--color-text').trim(),
  };

  // Check for inline styles with hardcoded hex (bypass DNA)
  const inlineViolations = [];
  document.querySelectorAll('[style]').forEach(el => {
    const style = el.getAttribute('style') || '';
    const hexMatches = style.match(/#[0-9a-fA-F]{3,8}/g);
    if (hexMatches) {
      inlineViolations.push({
        element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
        colors: hexMatches
      });
    }
  });

  return { dnaTokens, inlineViolations, violationCount: inlineViolations.length };
}
```

**Font verification:**
```javascript
() => {
  const root = getComputedStyle(document.documentElement);
  const displayFont = root.getPropertyValue('--font-display').trim();
  const bodyFont = root.getPropertyValue('--font-body').trim();

  return {
    displayDeclared: displayFont,
    bodyDeclared: bodyFont,
    displayLoaded: document.fonts.check(`16px ${displayFont}`),
    bodyLoaded: document.fonts.check(`16px ${bodyFont}`),
    h1Font: getComputedStyle(document.querySelector('h1') || document.body).fontFamily,
    bodyTextFont: getComputedStyle(document.querySelector('p') || document.body).fontFamily,
  };
}
```

**Spacing/layout metrics:**
```javascript
() => {
  const sections = document.querySelectorAll('[data-section], section, [class*="section"]');
  const metrics = [];
  sections.forEach((section, i) => {
    const style = getComputedStyle(section);
    metrics.push({
      index: i,
      id: section.id || section.className?.split(' ')[0] || `section-${i}`,
      paddingTop: style.paddingTop,
      paddingBottom: style.paddingBottom,
      maxWidth: style.maxWidth,
      backgroundColor: style.backgroundColor,
    });
  });
  return { sectionCount: sections.length, metrics };
}
```

### Step 3: Hover/Interaction State Verification

Test that all interactive elements have proper hover states.

```
1. mcp__plugin_playwright_playwright__browser_snapshot()
   → Get element refs for buttons, links, cards

2. For each primary interactive element:
   a. Take "before" screenshot of the element area
   b. mcp__plugin_playwright_playwright__browser_hover({ element: "...", ref: "..." })
   c. Take "after" screenshot
   d. Visually compare: hover state should show visible change
      (scale, shadow, color shift, underline, glow — per archetype)

3. Document findings:
   - Elements with NO hover change → FAIL (missing interaction state)
   - Elements with opacity-only hover → WARNING (generic, not archetype-specific)
   - Elements with archetype-matching hover → PASS
```

### Step 4: Console Error Detection

```
mcp__plugin_playwright_playwright__browser_console_messages({ level: "error" })
```

| Console Level | QA Severity | Action |
|--------------|-------------|--------|
| error | CRITICAL | Pipeline blocks. Document in GAP-FIX.md. |
| warning (hydration) | WARNING | React hydration mismatch. Document. |
| warning (deprecation) | INFO | Log for reference. |

### Step 5: Accessibility Snapshot

```
mcp__plugin_playwright_playwright__browser_snapshot({ filename: ".planning/genorah/audit/a11y-tree.md" })
```

Review the accessibility tree for:
- Heading hierarchy (h1 → h2 → h3, no skips)
- Landmark regions (main, nav, footer present)
- Interactive elements have accessible names
- Images have alt text (not empty or "image")
- Form inputs have labels

### Step 6: Animation Performance Sampling

Use `browser_evaluate` to measure frame rate during scroll:

```javascript
() => new Promise(resolve => {
  const readings = [];
  let lastTime = performance.now();
  let frames = 0;

  function measure(time) {
    frames++;
    if (time - lastTime >= 1000) {
      readings.push(frames);
      frames = 0;
      lastTime = time;
    }
    if (readings.length < 5) requestAnimationFrame(measure);
    else resolve({
      readings,
      average: readings.reduce((a, b) => a + b, 0) / readings.length,
      minimum: Math.min(...readings)
    });
  }

  // Trigger scroll to activate animations
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  requestAnimationFrame(measure);
})
```

| Metric | PASS | WARNING | CRITICAL |
|--------|------|---------|----------|
| Average FPS | >= 45 | 30-45 | < 30 |
| Minimum FPS | >= 30 | 20-30 | < 20 |

---

## Layer 3: Integration Context

### DNA Connection

This skill verifies DNA compliance in the RENDERED output, not source code. Code review catches hardcoded values in source; visual QA catches values that survive compilation but drift during rendering (SSR hydration, CSS cascade overrides, dynamic theming).

### Pipeline Stage

- **Input from:** Running dev server, completed build output, DESIGN-DNA.md (for expected token values)
- **Output to:** quality-reviewer's GAP-FIX.md (visual findings), audit report screenshots, `.planning/genorah/audit/` directory
- **Timing:** AFTER polish pass, BEFORE user checkpoint (Layer 3 in quality-gate-protocol)

### Related Skills

- **live-testing** -- Provides the Lighthouse and axe-core testing protocol (performance + accessibility audits). Visual-qa-protocol complements with visual and interaction verification.
- **quality-gate-v2** -- Scoring system that consumes visual QA findings. Screenshot comparison informs Creative Courage and Responsive Craft scores.
- **baked-in-defaults** -- Defines the 4 breakpoints. Visual QA verifies them.
- **design-dna** -- Defines the tokens. Visual QA verifies them in rendered output.

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Screenshots Without Analysis

**What goes wrong:** Screenshots are captured but nobody reads them. They sit in the audit directory unused. Quality review proceeds based on code review alone, missing visual bugs.
**Instead:** After EVERY screenshot capture, use the Read tool to view the image and document specific visual findings. Screenshots without analysis are wasted tool calls.

### Anti-Pattern: Desktop-Only Visual QA

**What goes wrong:** Only desktop screenshots are captured and reviewed. Mobile and tablet layouts go unverified. Responsive bugs ship to production.
**Instead:** ALL 4 breakpoints are mandatory. Mobile (375px) is the most important viewport — review it FIRST.

### Anti-Pattern: Skipping Hover State Verification

**What goes wrong:** Hover states are not tested because code review shows hover classes exist. But CSS specificity, cascade conflicts, or dark mode interactions may prevent the hover from rendering correctly.
**Instead:** Use Playwright to actually hover over elements and visually verify the state change occurs and matches the archetype personality.

### Anti-Pattern: Ignoring Console Errors

**What goes wrong:** Console errors from hydration mismatches, missing imports, or runtime exceptions are treated as acceptable. They cause visual glitches, broken interactions, or performance degradation.
**Instead:** ALL console errors at "error" level are CRITICAL findings. Zero tolerance.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Breakpoints captured | 4 | 4 | count | HARD -- all 4 must be captured |
| Console errors allowed | 0 | 0 | count | HARD -- zero tolerance for errors |
| Hover states verified | 3 | - | elements | SOFT -- verify at minimum: primary CTA, nav links, cards |
| FPS average minimum | 45 | - | fps | HARD -- below 30 is CRITICAL |
| DNA token verification | 1 | 1 | run | HARD -- must run CSS/DOM token check |
