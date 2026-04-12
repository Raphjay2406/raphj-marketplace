---
name: reference-diff-protocol
category: core
description: "Perceptual pixel-diff between built section and reference URL declared in PLAN.md. Per-beat SSIM thresholds, Playwright capture, pHash pre-filter, fail-soft when no reference. Produces annotated diff PNG plus score."
triggers: ["reference diff", "pixel diff", "SSIM", "visual fidelity", "design fidelity", "reference comparison", "ref screenshot"]
used_by: ["builder", "quality-reviewer", "visual-refiner"]
version: "3.0.0"
mcp_required: ["playwright"]
---

## Layer 1: Decision Guidance

### Why Reference-Diff

Award-caliber sites are not judged by 234-point rubrics alone — jurors compare against their mental library of SOTD winners. This skill makes that comparison explicit: every section with a `reference_url` in PLAN.md gets a perceptual similarity score against the live reference.

It is the single metric that converts "feels premium" into a measurable number. Combined with DNA drift and perf budgets, it anchors Stage 5 of the 6-stage validation pipeline.

### When to Use

- **Post-build, per section** — builder calls protocol if `reference_url` present in PLAN.md.
- **Quality-reviewer Stage 5** — aggregate median SSIM across wave, report outliers.
- **Visual-refiner feedback** — low SSIM + gap in Depth/Layout category triggers targeted fixes.
- **Audit replay** — `/gen:audit` re-runs refs against current builds to detect regressions.

### When NOT to Use

- Section has no reference (BREATHE beats often intentional) — emit `{skipped: "no_reference"}`.
- Playwright MCP unavailable — emit WARNING, skip gate, do not fail.
- Reference URL behind auth wall — skip with INFO.
- Content-heavy sections where layout varies by data (blog index, search results) — disable per-section.

### Decision Tree

```
PLAN.md has reference_url?
├─ no  → skip, note in SUMMARY.md
├─ yes → Playwright available?
│   ├─ no  → WARN, skip
│   └─ yes → ref cached <30d?
│       ├─ no  → capture + cache
│       └─ yes → load cached
│           → pHash(built, ref)
│           → hamming > 24? → SSIM=0 (layouts too different)
│           → else compute SSIM via ssim.js in browser_evaluate
│           → compare to beat threshold
│           → pass/fail + annotated diff.png
```

## Layer 2: Technical Spec

### Tooling

- **Capture:** `mcp__plugin_playwright_playwright__browser_navigate` + `browser_resize(1280, 800)` + `browser_take_screenshot` (full-page off, section-scoped via bounding box).
- **pHash pre-filter:** `sharp` + 8×8 DCT luminance hash, 64-bit output. Hamming distance > 24 → score = 0 (different layouts entirely, stop here).
- **SSIM:** inject `ssim.js` into page via `browser_evaluate`, compute on two ImageData buffers (built vs ref). Faster than extracting PNGs.
- **Diff visualization:** `pixelmatch` produces annotated `diff-{section}.png` showing mismatched regions in red.

### Per-beat thresholds

| Beat | SSIM min | pHash max | Action on fail |
|------|---------:|----------:|----------------|
| HOOK | 0.55 | 22 | WARNING (creative deviation OK) |
| PEAK | 0.55 | 22 | WARNING |
| TEASE | 0.60 | 20 | WARNING |
| REVEAL | 0.62 | 20 | WARNING |
| BUILD | 0.65 | 18 | INFO |
| PROOF | 0.70 | 16 | INFO |
| BREATHE | 0.75 | 14 | INFO (composition match expected) |
| CLOSE | 0.65 | 18 | INFO |
| TENSION | 0.50 | 24 | INFO (tension = deviation) |
| PIVOT | 0.55 | 22 | INFO |

Thresholds asymmetric by intent: HOOK/TENSION deviate creatively (low floor), BREATHE/PROOF match conventions (high floor).

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| ref_cache_ttl | 1 | 30 | days | SOFT |
| capture_viewport_w | 375 | 1920 | px | defaults 1280 |
| capture_timeout | 5 | 30 | s | HARD |
| max_refs_per_section | 1 | 3 | count | HARD |
| pHash_hamming_max | 0 | 64 | bits | per-beat |
| ssim_sample_stride | 1 | 4 | px | SOFT (perf) |

### Output artifacts

```
.planning/genorah/audit/
├── refs/
│   ├── {sha256(url)}.png         # cached reference capture
│   └── {sha256(url)}.json        # {captured_at, url, viewport}
├── diff-{section}.png            # annotated mismatch visualization
└── diff-{section}.json           # { ssim, phash_hamming, threshold, beat, status }
```

SUMMARY.md gains:
```yaml
reference_diff:
  url: https://linear.app
  ssim: 0.61
  phash_hamming: 19
  threshold: 0.55
  status: PASS
  diff_image: audit/diff-hero.png
```

## Layer 3: Integration Context

### Pipeline integration

- **Builder** — after rendering, if `reference_url` in PLAN.md, invokes protocol; writes diff block to SUMMARY.md. Non-blocking.
- **Quality-reviewer Stage 5** — reads all diff.json across wave, computes median SSIM, flags outliers (>2σ below wave mean). Low SSIM is a *signal* for visual-refiner, not a hard fail.
- **Visual-refiner** — consumes diff-{section}.png + gap analysis; uses diff regions to target edits.
- **Audit** — `/gen:audit` re-captures refs (if >30d cache), re-diffs all sections, reports regressions.

### DNA connection

Low SSIM with high DNA-drift coverage usually means "same DNA, different composition" — pass creatively.
Low SSIM with low DNA-drift means "drifting from DNA and from reference" — blocks SOTD-Ready tier.

## Layer 4: Anti-Patterns

- ❌ **Treating SSIM as absolute quality** — it measures similarity, not excellence. A pixel-perfect clone of a mediocre reference scores high but isn't good. SSIM is a *floor*, not a ceiling.
- ❌ **Hard-failing on low SSIM for HOOK/TENSION** — these beats intentionally deviate. Low SSIM here is a feature.
- ❌ **Comparing full-page screenshots instead of section-scoped** — surrounding sections pollute the comparison.
- ❌ **Skipping pHash pre-filter** — SSIM on layouts with hamming >24 wastes 500ms per section with meaningless output.
- ❌ **Using looks-same library** — no SSIM support, only pixel-match, misses perceptual similarity. Use `pixelmatch` for visualization only, `ssim.js` for scoring.
- ❌ **Forgetting to invalidate cache on `reference_url` change** — cache key must be `sha256(url)`, not `sha256(section_name)`.
