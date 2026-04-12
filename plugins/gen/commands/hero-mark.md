---
description: "Interactive 3D hero mark workflow — design via 3dsvg.design, emit live <GenorahSVG3D>, export 30-variant asset matrix, or preview gallery. Consumes the 75-preset library + archetype routing."
argument-hint: "design | live | export | preview [--preset=<id>] [--override='color_override:#hex'] [--force]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_evaluate, mcp__nano-banana__generate_image
recommended-model: sonnet-4-6
---

# /gen:hero-mark

Manage 3D brand-glyph hero marks across the pipeline. Consumes `skills/3dsvg-preset-library/SKILL.md` + `seeds/3dsvg-presets.json` + `<GenorahSVG3D>` accessibility wrapper pattern. See `skills/3dsvg-extrusion/SKILL.md` for security + SSR context.

## Workflow

### 1. Parse argument

- `design` (default) — open 3dsvg.design with preset params, wait for user export, commit assets
- `live` — generate production `<GenorahSVG3D>` component inline in the current section
- `export` — batch-render the 30-variant matrix (5 materials × 3 angles × 2 breakpoints)
- `preview` — open `public/brand/3d/index.html` preview gallery of already-exported variants

### 2. Prerequisites

Fail loudly with remediation if:
- `.planning/genorah/DESIGN-DNA.md` missing → "Run `/gen:start-project` first."
- Archetype not locked in DNA → "Lock archetype in DESIGN-DNA.md before hero-mark work."
- `skills/design-archetypes/seeds/3dsvg-presets.json` not found → plugin sync issue.
- `hero_mark.enabled` is explicitly `false` in PROJECT.md and command invoked → "Hero mark disabled; use `/gen:hero-mark design --force` to override."

### 3. Preset resolution

1. Load presets JSON.
2. Read archetype from DESIGN-DNA.md + beat from active section's PLAN.md (default HOOK if not specified).
3. Lookup preset by `(archetype, beat)`.
4. If `preset.disabled`: report fallback_strategy (e.g., "Pixel-Art → 2d-sprite-animation"), exit cleanly.
5. If preset missing: halt with BLOCK-level error; open PR to `seeds/3dsvg-presets.json`.
6. Apply `--preset=<id>` override (CLI flag) or `--override='field:value'` per field_overridable matrix. Reject forbidden overrides with error citing archetype constraints.

### 4. Subcommand: `design`

Opens https://3dsvg.design/ with URL params pre-populated from resolved preset:

```
https://3dsvg.design/?text={brand_name}&material={material}&animate={animation}&depth={depth}&color={color_override}
```

(If 3dsvg.design doesn't support all URL params, open the site and display pre-filled config for manual entry — report in output.)

**Asset capture flow:**

1. Announce: "3dsvg.design opened. Configure + export PNG (4K) + MP4 (60fps, 4s loop) + JSX. Genorah polls `.planning/genorah/sections/{section}/hero-mark-import/` for new files (10min timeout)."
2. User downloads from 3dsvg.design → drops into `hero-mark-import/`.
3. Command polls every 5s. When files detected:
   - Move PNG → `public/og/hero-mark.png` (and `public/brand/3d/{brand}-{material}-front-4k.png`)
   - Move MP4 → `public/brand/hero-mark.mp4`
   - Move JSX → `components/HeroMark.generated.tsx` (reference only)
   - Log to `.planning/genorah/DECISIONS.md` with preset_id + timestamp
4. If timeout: exit with "No export detected in 10min. Re-run when ready."

### 5. Subcommand: `live`

Generates production `<GenorahSVG3D>` wrapper inline in the active section's TSX file.

**Pre-generation checks:**
- Verify beat supports live component per `perf-budgets` skill table (PEAK / TENSION only; others → warn + suggest `export` path).
- Count existing `<GenorahSVG3D>` in the page (must be ≤2 before this emission — hard cap 3 WebGL contexts).
- Verify `motion-health` concurrent-animation budget has ≥ preset's `motion_health_budget_units` headroom.

**Emission template:**

```tsx
// app/sections/hero/Hero.tsx
import { GenorahSVG3D } from '@/components/GenorahSVG3D';  // assumed scaffolded

export function Hero() {
  return (
    <section data-section="hero" data-genorah-id="hero.root">
      <GenorahSVG3D
        text="{brand_name}"
        ariaLabel="{brand_name} 3D hero mark"
        fallbackSrc="/og/hero-mark.png"
        material="{preset.material}"
        animation="{preset.animation}"
        depth={{preset.depth}}
        intro={{ type: "{preset.intro.type}", duration: {preset.intro.duration} }}
        {preset.color_override && `color="${preset.color_override}"`}
      />
    </section>
  );
}
```

Also scaffolds `components/GenorahSVG3D.tsx` if absent — copy-pastes the canonical wrapper from `skills/3dsvg-preset-library` Layer 3.

### 6. Subcommand: `export`

Batch-renders the 30-variant matrix via the `3dsvg-export` MCP server (see `.claude-plugin/mcp-servers/3dsvg-export/README.md`):

- 5 materials: archetype's `preferred_materials` (top-5 from preset library metadata)
- 3 angles: front 0°, 3/4-right (rotationY=-0.6), 3/4-left (rotationY=0.6)
- 2 breakpoints: 2K (print-safe, 2048×1152) + 4K (display, 3840×2160)
- Output formats: PNG + MP4 (60fps, 4s loop) per variant = 60 total assets

Output layout:

```
public/brand/3d/
├── {brand}-{material}-{angle}-{bp}.png
├── {brand}-{material}-{angle}-{bp}.mp4
├── manifest.json   # { variants: [{material,angle,bp,png,mp4,size_kb}], generated_at }
└── index.html      # preview gallery
```

Cache key = `sha256(DESIGN-DNA.md + preset_id + override_hash)`. Skip regeneration if cached. Use `--force` to regenerate.

### 7. Subcommand: `preview`

Opens `public/brand/3d/index.html` in default browser. Fails loudly if no exports exist (run `export` first).

### 8. Quality-gate coupling

Each subcommand writes decision to `DECISIONS.md`:

```md
## 2026-04-13 | Hero Mark | {subcommand}
- Preset: {preset_id}
- Overrides applied: {field_list or "none"}
- Output mode: {live|offline|both}
- Perf impact: +{cost_kb}KB section-JS | motion-health +{budget_units}
- A11y: aria-label set, RM fallback {fallbackSrc or "inline"}
```

Hero Mark Compliance sub-gate (inside Creative Courage category, per `quality-gate-v2` v3.4.1 addendum) reads these decisions + resulting TSX for scoring.

### 9. Render NEXT ACTION block

Per `skills/pipeline-guidance/SKILL.md`. Typical transitions:

- After `design` → `/gen:hero-mark live` (integrate into section) OR `/gen:hero-mark export` (brandkit matrix)
- After `live` → `/gen:build` (re-build affected section) OR `/gen:hero-mark preview`
- After `export` → `/gen:brandkit export` (wrap into brand.zip) OR `/gen:hero-mark preview`
- After `preview` → `/gen:build` or `/gen:iterate` based on review

## Notes

- 3dsvg package version pinned in `package.json` per v3.4.0 governance.
- `design` subcommand is manual-step — Claude Code can't auto-interact with 3dsvg.design. `export` subcommand is fully automated via `3dsvg-export` MCP.
- Pixel-Art archetype: `disabled` preset triggers fallback_strategy route. All subcommands exit cleanly with "Pixel-Art is 3D-incompatible → use 2D sprite animation instead."
- Collision resolution (archetype vs forbidden override): logged in DECISIONS.md with 3 options offered.
