---
name: eye-tracking-simulation
description: Predicted gaze-plot + F-pattern + Z-pattern overlays via saliency ML model. Identifies visual hierarchy failures before real user testing.
tier: domain
triggers: eye-tracking, gaze-plot, saliency, f-pattern, z-pattern, visual-hierarchy
version: 0.1.0
---

# Eye-Tracking Simulation

Run saliency model over screenshot → predict where users' eyes land first. Compare to intended hierarchy.

## Layer 1 — Tools

- `saliency` JS port of DeepGaze or similar transformer saliency model
- Or API: Attention Insight, EyeQuant (paid) — more accurate

## Layer 2 — Flow

```
1. Playwright screenshots at 1280×720 (desktop default)
2. Run saliency model → heatmap PNG
3. Identify top-5 saliency peaks with coords
4. Compare to intended hierarchy:
   - Primary CTA → should be peak #1 or #2
   - H1 heading → should be peak #1 or #2
   - Trust signal → should be in top-5 if HOOK beat
5. Flag failures + recommend visual-weight adjustments
```

## Layer 3 — Integration

- `/gen:ux-audit --eye-tracking` adds this check
- Failures: "Primary CTA saliency peak #4 (expected ≤ 2). Reason likely: competing visual weight from hero image."
- Feeds visual-craft-quantified V4/V5 checks
- Ledger: `gaze-prediction-run`

## Layer 4 — Anti-patterns

- ❌ Trusting sim as replacement for real-user testing — always supplemental
- ❌ Optimizing for saliency peak over intent — accessibility-safe contrast trumps gaze capture
