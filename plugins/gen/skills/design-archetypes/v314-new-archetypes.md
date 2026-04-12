---
name: v314-new-archetypes
description: 8 new archetype extensions added in v3.14 — museum/archive, academic/scientific, gaming-UI, medical/clinical, government/civic, financial/trading, portfolio-specific, hand-drawn/analog. Plus archetype-mixing protocol.
tier: core
triggers: archetypes-v314, museum, academic, gaming-ui, medical, civic, financial, portfolio, hand-drawn
version: 0.1.0
---

# v3.14 New Archetypes + Mixing

Extends the 25-archetype library to 33 + formal mixing protocol.

## Layer 1 — New archetypes

### 26. Museum / Archive

- **Identity**: long-form knowledge, extensive typography, deep navigation
- **Colors**: muted earth tones, aged parchment, burgundy/forest accent
- **Fonts**: serif display (Garamond, Minion) + serif body + mono for meta
- **Mandatory**: `font-serif`, footnotes pattern, timeline navigation, dense archival grid
- **Forbidden**: gradients, bright colors, animation-heavy
- **Signature**: acid-free-paper backdrop + exhibit-panel layout
- **Use for**: museums, historical archives, academic repositories, encyclopedias

### 27. Academic / Scientific

- **Identity**: whitepaper style, extensive footnotes, dense formulas, LaTeX-adjacent
- **Colors**: high contrast white/black + one accent (navy or maroon traditional)
- **Fonts**: serif body (Computer Modern, Latin Modern) + sans display
- **Mandatory**: numbered sections, KaTeX/MathJax rendering, bibliography table, figure captions
- **Forbidden**: decorative animation, sans-serif body, colored backgrounds
- **Signature**: number-prefix section headings, auto-generated ToC

### 28. Gaming UI

- **Identity**: HUD-adjacent for game sites + launch pages; high-contrast dynamic
- **Colors**: deep blacks + electric accent (cyan/lime/magenta) + state colors
- **Fonts**: mono + display gaming fonts (Orbitron, Rajdhani, Audiowide)
- **Mandatory**: state indicators (health bars, XP), angular shapes, glow effects
- **Forbidden**: soft pastels, minimal whitespace, serif
- **Signature**: HUD-frame border + pixel-perfect icon set

### 29. Medical / Clinical

- **Identity**: calm, trust-building, high-legibility, regulatory-clarity
- **Colors**: white/off-white bg + navy/teal primary + muted green-success
- **Fonts**: highly-readable sans (Inter, Source Sans, Open Sans) + no display flourish
- **Mandatory**: ≥ 18px body, high contrast, trust signals (certifications/accreditations), HIPAA-compliance markers
- **Forbidden**: playful motion, red-warning colors for non-urgent, aggressive CTA
- **Signature**: clinical data table + infographic patterns

### 30. Government / Civic

- **Identity**: accessibility-first, multilingual-aware, content-dense, trust-bearing
- **Colors**: navy / olive / grey conservative palette + government-seal accent
- **Fonts**: sans-serif WCAG-optimal (Public Sans, Source Sans)
- **Mandatory**: WCAG 2.2 AAA, plain-language (grade ≤ 8), multi-language switcher prominent, official seal
- **Forbidden**: dark mode as default (trust signal breaks), decorative animation
- **Signature**: .gov-style nav + form-heavy layouts

### 31. Financial / Trading

- **Identity**: dense data, real-time indicators, urgency without panic
- **Colors**: dark theme default (Bloomberg Terminal-adjacent), state colors (green/red)
- **Fonts**: mono for data + sans for UI
- **Mandatory**: tabular-nums, live-update indicators, real-time data patterns, charts
- **Forbidden**: serif body, decorative animation (distracts from data)
- **Signature**: multi-panel data grid + sparkline-dense UI

### 32. Portfolio (photographer/designer)

- **Identity**: work-first; UI recedes; full-bleed imagery
- **Colors**: monochrome UI + client images carry color
- **Fonts**: minimal, maybe single display face
- **Mandatory**: full-bleed images, case-study deep layout, minimal nav
- **Forbidden**: heavy UI chrome, typography competing with work
- **Signature**: scroll-jack case study + project index grid

### 33. Hand-drawn / Analog

- **Identity**: sketchy lines, paper textures, imperfection as signature
- **Colors**: warm cream + hand-inked black + colored-pencil accent
- **Fonts**: handwritten display (Caveat, Indie Flower) + readable serif body
- **Mandatory**: noise/grain texture, organic line-work, slight rotation on elements
- **Forbidden**: pixel-perfect alignment, gradient backgrounds, chrome
- **Signature**: hand-drawn SVG illustrations + paper noise overlay

## Layer 2 — Testable markers (additions to testable-markers.json)

Each new archetype gets mandatory/forbidden/signature regex — same structure as existing 25. Partial pilot in this release; full rollout tracks via research-program R-new.

## Layer 3 — Archetype mixing protocol

**Primary (60%) + Secondary (30%) + Tension (10%)**

When content demands duality:

| Primary | Secondary | Use case |
|---|---|---|
| Editorial | Cyberpunk-HUD | Tech-literary long-form (Wired-adjacent) |
| Luxury | Data-Dense | Financial concierge, private banking |
| Playful | Editorial | Kids-publication, educational-entertainment |
| Warm Artisan | Data-Dense | Craft-brewery with ops dashboard |
| Brutalist | Neumorphism | Intentional design tension (rare) |

### Conflict matrix (impossible pairs)

| Pair | Why impossible |
|---|---|
| Neumorphism + Brutalist | Fundamentally opposed interaction language |
| Ethereal + Cyberpunk-HUD | Opposite emotional register |
| Medical + Playful | Regulatory mismatch |
| Government + Gaming-UI | Trust destroyed |
| Luxury + Vaporwave | Restraint vs excess conflict |

Quality-reviewer emits BLOCK on impossible pair; WARN on adventurous pair with rationale required in DECISIONS.md.

### Mix declaration

```yaml
# DESIGN-DNA.md
archetype:
  primary: editorial    # 60%
  secondary: cyberpunk-hud  # 30%
  tension: vaporwave    # 10% — for signature moments only
```

## Layer 4 — Integration

- Testable-markers for new archetypes added to seeds JSON
- Quality-gate archetype-specificity check weights: primary × 0.6, secondary × 0.3, tension × 0.1
- Pareto weights matrix extended for new archetypes
- Material sets + lighting rigs + Recraft substyles extended

## Layer 5 — Anti-patterns

- ❌ Mixing 3 archetypes at equal 33% each — no dominant voice, incoherent
- ❌ Impossible pair (Gaming + Civic) without explicit rationale + legal review
- ❌ Tension > 10% — dominates, becomes hybrid not tension
- ❌ Ignoring impossible-pair block — shipped confusion
