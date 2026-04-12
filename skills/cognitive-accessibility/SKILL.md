---
name: cognitive-accessibility
tier: core
description: "Beyond-WCAG cognitive load: reading grade per section, sentence variance, decision density (≤5 CTAs/viewport), focus-trap integrity, CVD ΔE2000 (protanopia/deuteranopia/tritanopia), motion-sickness flags (parallax/rotation thresholds)."
triggers: ["cognitive load", "reading grade", "flesch", "color blind", "CVD", "deuteranopia", "protanopia", "tritanopia", "motion sickness", "vestibular", "decision density", "focus trap"]
used_by: ["quality-reviewer", "content-specialist", "polisher"]
version: "3.0.0"
---

## Layer 1: Decision Guidance

### Why Beyond WCAG

WCAG 2.1/2.2 AA sets the *floor*. axe-core catches most of it. What WCAG doesn't cover:
- How readable is the *content* for cognitively loaded users?
- How does the palette look to the 8% of men and 0.5% of women with CVD?
- Does the motion design trigger vestibular disorders?
- Is the interface cluttered with too many decisions per viewport?

These are cognitive-accessibility concerns. This skill codifies sub-criteria that extend the existing Accessibility category of the 234-pt gate without expanding the category total.

### When to Use

- Stage 6 of validation pipeline — every section.
- `/gen:audit` — aggregates across site.
- After content changes — reading grade may shift.
- Whenever palette is edited — re-run CVD simulation.

### When NOT to Use

- Pre-build (no content or palette yet).
- Pages where audience is explicitly expert (developer docs can accept higher reading grade).

## Layer 2: Technical Spec

### Reading grade

- Tool: `text-readability` (Flesch-Kincaid, SMOG, Dale-Chall).
- Targets by page type:
  - Marketing landing: ≤ grade 8
  - Product pages: ≤ grade 9
  - Documentation: ≤ grade 10
  - Legal/Terms: no max (but flag if >14 without justification)
- Measure: concat all `<p>`, `<h1-3>`, CTA text from rendered section; pass through readability.

### Sentence-length variance

- Target: 60-80% of sentences in 8-20 word range.
- Monotony penalty: if >90% of sentences in same 5-word bucket → WARN (reads like AI-generated uniform prose).

### Decision density

- Count distinct CTAs + primary interactive elements visible in first viewport (1280×800).
- Target: ≤ 5.
- Exceed: WARN. Conversion psych research consistently shows decision paralysis above 5-7.

### Focus-trap integrity

- For every modal/dialog/dropdown/sheet:
  - Tab order stays inside while open.
  - Esc closes.
  - Focus restores to trigger on close.
- Tool: Playwright simulates Tab + Shift+Tab; checks `document.activeElement` stays within modal.
- Fail: any element outside modal gains focus during open state.

### CVD ΔE2000 simulation

- Tool: `culori` for color-space ops + CVD transform matrices (Brettel/Viennot 1997).
- For each pair of DNA colors that appear adjacent in UI (primary on surface, accent on bg, etc):
  - Transform pair through protanopia, deuteranopia, tritanopia filters.
  - Compute ΔE2000 of transformed pair.
  - Target: ΔE > 15 for any critical pair (CTA on background, error on field).
  - Fail: ΔE < 3 for any critical pair (indistinguishable for that CVD class).

Example pairs to check:
- `primary` vs `bg`
- `primary` vs `surface`
- `accent` vs `bg`
- `error`/`destructive` vs `surface`
- `ok`/`success` vs `surface`

### Motion sickness flags

- **Parallax ratio**: scroll-driven transforms where element moves >30% faster or slower than page — WARN.
- **Rotation speed**: any animation rotating >15°/s on elements >100px → WARN.
- **Zoom-scroll**: 3D camera fly-through without user control → require `prefers-reduced-motion` fallback.
- **Autoplaying infinite loops >5s** on above-the-fold → WARN unless user pause affordance present.

### Constraint table (machine-enforced)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| reading_grade_landing | — | 8 | grade | WARN if exceeded |
| reading_grade_product | — | 9 | grade | WARN |
| sentence_variance_ratio | 0.6 | — | ratio | WARN <0.6 |
| decisions_per_viewport | — | 5 | count | WARN >5 |
| focus_trap_integrity | true | true | bool | HARD in modals |
| cvd_deltaE_critical_min | 15 | — | ΔE2000 | HARD <3 = FAIL |
| parallax_ratio_max | — | 1.3 | factor | WARN >1.3 |
| rotation_speed_max | — | 15 | deg/s | WARN |

### Output

`.planning/genorah/audit/cognitive-a11y-{section}.json`:

```json
{
  "section": "hero",
  "reading_grade": 6.8,
  "sentence_variance": 0.72,
  "decisions_in_viewport": 3,
  "focus_trap": "n/a",
  "cvd": {
    "protanopia":   {"primary_vs_bg_deltaE": 18.3, "accent_vs_bg_deltaE": 14.1, "pass": true},
    "deuteranopia": {"primary_vs_bg_deltaE": 21.5, "accent_vs_bg_deltaE": 19.2, "pass": true},
    "tritanopia":   {"primary_vs_bg_deltaE": 16.8, "accent_vs_bg_deltaE": 12.4, "pass": true}
  },
  "motion_sickness": {
    "parallax_ratio_max": 1.2, "pass": true,
    "rotation_speeds": [], "pass": true
  },
  "status": "PASS"
}
```

## Layer 3: Integration Context

- **Quality-reviewer Stage 6** — runs this skill as part of Accessibility category scoring.
- **Content-specialist** — reads reading-grade results; rewrites copy that overshoots.
- **Brand-voice-extraction** — voice axes inform expected grade range.
- **Polisher** — receives CVD failures as "replace X with Y" suggestions.
- **Existing accessibility skill** — WCAG-floor checks; this skill layers on top.

## Layer 4: Anti-Patterns

- ❌ **Treating WCAG AA as done** — axe-core passes and users still can't use the site.
- ❌ **Measuring reading grade on full page** — section-level gives actionable signal; page-level obscures.
- ❌ **Ignoring CVD because "the palette looks fine to me"** — 8% of users don't see your palette. Run the simulation.
- ❌ **Using simple color-blindness tools that use RGB distance** — must use ΔE2000 in OKLab or CIELAB; RGB distance misses actual perceived difference.
- ❌ **Rotating logos "for visual interest"** — vestibular triggers; keep rotation <15°/s or gate behind user action.
- ❌ **Skipping the focus-trap test** — it's the #1 actual keyboard-user complaint; always Playwright-verify.
- ❌ **No reduced-motion fallback for parallax** — one of the most-requested accessibility features; non-negotiable.
