---
name: visual-regression
description: "Visual regression testing: capture baseline screenshots at 4 breakpoints after successful build, diff against baseline on iterate/bugfix, detect unintended visual changes with pixel-level comparison. Uses Playwright MCP for capture and canvas-based diffing."
tier: domain
triggers: "visual regression, screenshot diff, baseline, visual diff, before after, regression test, pixel diff, visual change detection"
version: "2.8.1"
---

# Visual Regression Testing

Capture baseline screenshots after every successful build. Diff against baseline before and after `/gen:iterate` or `/gen:bugfix`. Detect unintended visual changes at the pixel level across all 4 mandatory breakpoints.

---

## Layer 1 — Decision Guidance

### When to use this skill

| Pipeline moment | Action | Why |
|-----------------|--------|-----|
| After `/gen:build` wave completes successfully | Capture baseline | Locks the known-good visual state before any changes |
| After `/gen:audit` passes (score >= 50) | Capture or update baseline | Audit-passing state is the highest-confidence baseline |
| Before `/gen:iterate` applies changes | Compare pre-change state against baseline | Detects if the starting state has already drifted |
| After `/gen:iterate` completes | Capture "after" and diff against baseline | Catches unintended side effects of the iteration |
| After `/gen:bugfix` completes | Capture "after" and diff against baseline | Confirms the fix did not introduce visual regressions |
| During `/gen:audit` quality gate | Reference baseline vs current | Provides objective evidence of visual stability |

### When NOT to use

- During `/gen:start-project` or `/gen:discuss` — no built output exists yet.
- When the dev server is not running — screenshots require a live localhost.
- For content-only changes (copy edits) where layout is guaranteed unchanged — use judgment.

### Pipeline connection

The Reviewer agent should trigger baseline capture after build approval. The Polisher agent should run diff checks after every refinement pass. The Auditor agent references baseline stability in the quality gate scoring.

---

## Layer 2 — Protocols

### 2A: Baseline Capture Protocol

Run after a successful build wave or audit pass.

**Step 1 — Navigate to dev server**

```
mcp__plugin_playwright_playwright__browser_navigate({ url: "http://localhost:[port]" })
```

Confirm the page loads without errors. If the dev server is not running, instruct the user to start it first.

**Step 2 — Capture at all 4 breakpoints**

For each breakpoint in `[375, 768, 1280, 1440]`:

```
mcp__plugin_playwright_playwright__browser_resize({ width: [BP], height: 900 })
mcp__plugin_playwright_playwright__browser_wait_for({ time: 3 })
mcp__plugin_playwright_playwright__browser_take_screenshot({
  type: "png",
  fullPage: true,
  filename: ".planning/genorah/baselines/baseline-[BP]px.png"
})
```

Wait 3 seconds after resize to allow lazy-loaded images, animations, and layout shifts to settle.

**Step 3 — Record baseline metadata**

Write `.planning/genorah/baselines/BASELINE-META.md`:

```markdown
# Baseline Metadata
- Captured: [ISO 8601 date-time]
- Wave: [current wave number]
- Audit score: [score]/234 ([tier name])
- Sections built: [comma-separated list of built sections]
- Breakpoints: 375px, 768px, 1280px, 1440px
- Dev server: http://localhost:[port]
- Capture duration: [seconds]
- Previous baseline: [ISO date of last baseline, or "none"]
```

**Step 4 — Confirm**

Output: "Baseline captured at 4 breakpoints. Stored in `.planning/genorah/baselines/`."

---

### 2B: Diff Protocol (Before/After Iterate or Bugfix)

When `/gen:iterate` or `/gen:bugfix` modifies code, run this protocol to detect visual regressions.

**Step 1 — Verify baseline exists**

Check for `.planning/genorah/baselines/baseline-1280px.png`. If missing, warn: "No baseline found. Capture a baseline first with the baseline capture protocol." and abort diff.

**Step 2 — Capture "current" screenshots**

For each breakpoint in `[375, 768, 1280, 1440]`:

```
mcp__plugin_playwright_playwright__browser_resize({ width: [BP], height: 900 })
mcp__plugin_playwright_playwright__browser_wait_for({ time: 3 })
mcp__plugin_playwright_playwright__browser_take_screenshot({
  type: "png",
  fullPage: true,
  filename: ".planning/genorah/baselines/current-[BP]px.png"
})
```

**Step 3 — Pixel-level comparison via Playwright evaluate**

For each breakpoint, run a canvas-based diff:

```
mcp__plugin_playwright_playwright__browser_evaluate({
  function: `() => {
    return new Promise((resolve) => {
      const loadImage = (src) => new Promise((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.src = src;
      });
      Promise.all([
        loadImage('/.planning/genorah/baselines/baseline-[BP]px.png'),
        loadImage('/.planning/genorah/baselines/current-[BP]px.png')
      ]).then(([baseline, current]) => {
        const w = Math.max(baseline.width, current.width);
        const h = Math.max(baseline.height, current.height);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(baseline, 0, 0);
        const baseData = ctx.getImageData(0, 0, w, h).data;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(current, 0, 0);
        const currData = ctx.getImageData(0, 0, w, h).data;
        let diffPixels = 0;
        const totalPixels = w * h;
        const regions = [];
        for (let i = 0; i < baseData.length; i += 4) {
          const dr = Math.abs(baseData[i] - currData[i]);
          const dg = Math.abs(baseData[i+1] - currData[i+1]);
          const db = Math.abs(baseData[i+2] - currData[i+2]);
          if (dr + dg + db > 30) diffPixels++;
        }
        resolve({
          breakpoint: [BP],
          diffPercent: ((diffPixels / totalPixels) * 100).toFixed(2),
          diffPixels,
          totalPixels,
          dimensionsMatch: baseline.width === current.width && baseline.height === current.height
        });
      });
    });
  }`
})
```

**Step 4 — Report results**

Aggregate results across all breakpoints and report:

```
Visual Regression Report
========================
Breakpoint 375px:  [N]% changed ([N] pixels)
Breakpoint 768px:  [N]% changed ([N] pixels)
Breakpoint 1280px: [N]% changed ([N] pixels)
Breakpoint 1440px: [N]% changed ([N] pixels)
```

**Severity thresholds:**

| Diff % | Severity | Action |
|--------|----------|--------|
| 0-1% | CLEAN | No visual regression. Proceed. |
| 1-5% | MINOR | "Visual changes detected: [N]% of pixels changed. Review the changed regions in `.planning/genorah/baselines/`." |
| 5-10% | MODERATE | "Significant visual changes at [breakpoint(s)]. Likely a style cascade or layout shift. Confirm these changes are intentional." |
| >10% | MAJOR | "MAJOR visual regression detected. [N]% of the page changed. This may indicate unintended layout shifts, broken styles, or a CSS cascade failure. Review immediately." |

---

### 2C: Per-Section Targeted Diff

For comparing a single section rather than the full page.

**Step 1 — Identify the target section**

```
mcp__plugin_playwright_playwright__browser_snapshot({})
```

Find the element reference for the target section (e.g., `[ref=section-hero]`).

**Step 2 — Capture section-level baseline and current**

Use element-targeted screenshots if the Playwright MCP supports element refs. Otherwise, capture the full page and note the section's viewport position from the snapshot for manual cropping context.

**Step 3 — Compare section screenshots**

Run the same canvas-based pixel diff from 2B Step 3, scoped to the section images.

**Step 4 — Report section-specific changes**

```
Section Diff: [section-name]
Breakpoint [BP]px: [N]% changed
Assessment: [CLEAN | MINOR | MODERATE | MAJOR]
```

This is useful after `/gen:iterate` targets a specific section — confirms changes are isolated and did not cascade into adjacent sections.

---

## Layer 3 — Integration Context

### DNA Token Connection

Baselines are captured with the current project's Design DNA tokens active. When a diff detects changes, cross-reference against recent DNA token modifications:

- If `--color-primary` changed → expect global diff across all sections using primary.
- If only `--color-accent` changed → diff should be limited to accent-colored elements.
- A full-page >10% diff with no DNA changes signals an unintended regression.

The diff report should note: "DNA tokens modified since baseline: [list]" to contextualize expected vs unexpected changes.

### Archetype Compliance

Baselines prove archetype compliance at the time of capture. If the archetype has mandatory techniques (e.g., Brutalist requires visible grid lines), the baseline serves as evidence. Post-iterate diffs that lose mandatory techniques should flag an archetype violation, not just a pixel diff.

### Emotional Arc Stability

Large diffs concentrated in specific viewport regions may indicate emotional arc beat disruption. Cross-reference diff regions against the arc beat map in CONTEXT.md to determine if a beat's whitespace ratio or element density was unintentionally altered.

### Quality Gate Integration

The Auditor agent can reference visual regression results in the quality gate:

- **No baseline captured**: informational warning (not a point deduction).
- **Baseline exists, diff CLEAN**: +1 confidence signal for Integration Correctness.
- **Baseline exists, diff MAJOR with no intentional changes**: flag for manual review.

---

## Layer 4 — Anti-Patterns

| Anti-Pattern | Why It Fails | Correction |
|--------------|-------------|------------|
| Never capturing a baseline | No reference point makes regression detection impossible; changes accumulate silently | Capture baseline after every successful build wave or audit pass |
| Comparing wrong breakpoints | Mobile baseline vs desktop current produces meaningless 90%+ diffs | Always diff same breakpoint against same breakpoint: baseline-375 vs current-375 |
| Treating all diffs as regressions | Intentional design changes (from `/gen:iterate`) will naturally produce diffs | Check if the diff regions align with the iterate target; only flag unexpected regions |
| Too-tight threshold (0.1%) | Sub-pixel rendering, font hinting, and anti-aliasing cause minor per-pixel noise across environments | Use 1% as the clean threshold; anything below is rendering noise |
| Too-loose threshold (>20%) | Major regressions slip through unnoticed | Keep the MAJOR threshold at 10%; anything above demands review |
| Stale baselines | Baselines from 5 iterations ago are meaningless for detecting recent regressions | Update baseline after every approved iterate cycle; record the date in BASELINE-META.md |
| Ignoring dimension mismatches | If baseline is 1280x4000 and current is 1280x3500, the page lost content or sections collapsed | Report dimension changes separately: "Page height changed from [N]px to [N]px at [BP] breakpoint" |
| Skipping mobile breakpoints | Desktop-only regression testing misses responsive layout breaks that are common cascade failures | Always capture and diff all 4 breakpoints; mobile regressions are the most frequent |

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Breakpoints captured | 4 | 4 | count | Hard — all 4 required |
| Wait after resize | 2 | 5 | seconds | Soft — 3s default |
| Clean threshold | 0 | 1 | % diff | Hard — below this is noise |
| Minor threshold | 1 | 5 | % diff | Hard — informational |
| Moderate threshold | 5 | 10 | % diff | Hard — requires confirmation |
| Major threshold | 10 | 100 | % diff | Hard — blocks without review |
| Pixel diff sensitivity | 20 | 50 | RGB delta sum | Soft — 30 default |
| Baseline staleness | 0 | 5 | iterate cycles | Soft — warn if baseline > 5 cycles old |
| Max baseline storage | 1 | 20 | sets | Soft — prune oldest beyond 20 |
