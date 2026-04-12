---
description: "Generate a programmatic Remotion video background for a section using DNA-parameterized templates (kinetic-type, particle-field, shape-morph, color-field, camera-fly)."
argument-hint: "[section-name] [--template=kinetic-type|particle-field|shape-morph|color-field|camera-fly] [--duration=4]"
allowed-tools: Read, Write, Edit, Bash, Glob
recommended-model: sonnet-4-6
---

# /gen:video

Render a DNA-parameterized section video via Remotion. See `skills/remotion-section-video/SKILL.md` for template catalog.

## Workflow

### 1. Eligibility

- Section beat ∈ {HOOK, PEAK, REVEAL} OR PLAN.md flags `videoBackground: true`.
- Section has a visual area ≥400px tall (video on narrow strips is waste).
- Project's perf budget allows +1.5MB (hero) or +800KB (non-hero).

### 2. Resolve template

- If `--template` passed: use it.
- Else: route by archetype:
  - Brutalist/Neubrutalism → kinetic-type
  - Ethereal/Glassmorphism → color-field
  - Kinetic/Retro-Future → particle-field
  - Editorial/Swiss → shape-morph
  - Neon-Noir/AI-Native → camera-fly
- User can override.

### 3. Scaffold Remotion project if missing

```bash
pnpm add remotion @remotion/cli @remotion/bundler @remotion/renderer
mkdir -p remotion/src remotion/out
```

Copy template `HeroVideo.tsx` from plugin into `remotion/src/` (templates ship with the plugin).

### 4. Render dual encode + poster

```bash
npx remotion render remotion/src/HeroVideo.tsx HeroVideo \
  remotion/out/{section}.mp4 --codec h264 --crf 23 \
  --props '{"tokens":$(cat DESIGN-DNA.json),"template":"{template}"}'

npx remotion render remotion/src/HeroVideo.tsx HeroVideo \
  remotion/out/{section}.webm --codec vp9 --crf 30 \
  --props '{"tokens":$(cat DESIGN-DNA.json),"template":"{template}"}'

npx remotion still remotion/src/HeroVideo.tsx HeroVideo \
  remotion/out/{section}-poster.avif --frame 0 \
  --props '{"tokens":$(cat DESIGN-DNA.json),"template":"{template}"}'
```

Cache key = sha256(DNA tokens + template + duration). Skip render if cache hit.

### 5. Move to public/ and wire into section

Move files to `public/videos/`. Update section TSX to use the `<video>` element with poster, dual source, reduced-motion fallback per skill Layer 2.

### 6. Re-measure perf budget

Run perf-budgets check on section; ensure video addition didn't blow through LCP or hero_img_kb budget. If it did: reduce CRF (smaller file) or drop to poster-only.

### 7. Report

```
Section: hero
Template: kinetic-type
Output:
  hero.mp4  = 1.2 MB
  hero.webm = 830 KB
  hero-poster.avif = 62 KB
Cache: miss (new render)
Perf impact: LCP +0.18s (within budget)
Reduced-motion: poster-only fallback wired
Next: /gen:audit hero
```

## Notes

- Generation is expensive (30-90s per video). Cache aggressively by token hash.
- User can swap templates freely by re-running with `--template`.
- All videos must ship with poster + RM fallback; hook checks this in audit.
