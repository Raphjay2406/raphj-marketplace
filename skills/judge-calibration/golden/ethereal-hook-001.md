---
archetype: ethereal
beat: HOOK
consensus_scores:
  design: 198
  ux: 98
panel:
  - reviewer: reviewer-a
    design: 200
    ux: 96
  - reviewer: reviewer-b
    design: 196
    ux: 100
  - reviewer: reviewer-c
    design: 198
    ux: 98
notes: "Soft radial gradient backdrop (violet→pink→rose), semi-opaque glass panels with backdrop-blur-xl, floating particles with low-intensity drift animation, body text at 20px leading-relaxed. Frosted-glass material on nav. Signature element: subtle float animation on hero headline."
source_type: curated-reference
captured_at: 2026-04-12
permit_training: true
---

# Ethereal HOOK — Atmospheric gradient hero

Strong tier (198/234 design). Archetype-faithful; every marker passes.

## Markers present

- backdrop-blur-xl on panels
- bg-white/10, bg-white/20 opacity
- bg-gradient-to-br from-violet via-pink to-rose
- animate-float signature

## Sub-gate results

- motion-health: pass (INP 141ms, CLS 0.02)
- dna-drift: 98% coverage
- reference-diff: SSIM 0.74 (threshold 0.55 met)
- hero-mark: 3D SVG wordmark in frosted-glass material ∈ preferred list
