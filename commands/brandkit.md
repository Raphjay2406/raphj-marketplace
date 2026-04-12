---
description: "Generate brand kit deliverables (logo variants, favicons, OG templates, color exports, font specimens, guidelines PDF, /brand public route, brand.zip). Reuses DNA tokens; opt-in post-audit."
argument-hint: "export | preview | sync"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__nano-banana__generate_image, mcp__nano-banana__edit_image, mcp__plugin_playwright_playwright__browser_navigate
recommended-model: sonnet-4-6
---

# /gen:brandkit

Generate brand-identity deliverables from the project's `DESIGN-DNA.md`. See `skills/brandkit-suite/SKILL.md` for the full output inventory.

## v3.4.1 Addendum — 3dsvg 30-variant fan-out

When `hero_mark.enabled: true` is set in DESIGN-DNA or PROJECT.md, `/gen:brandkit export` automatically invokes the `3dsvg-export` MCP to render 30 brand-matrix assets:

- 5 materials (archetype's `preferred_materials` per preset library)
- 3 angles (front 0°, 3/4 right, 3/4 left)
- 2 breakpoints (2K = 2048×1152, 4K = 3840×2160)

Outputs to `public/brand/3d/`:
- `{brand}-{material}-{angle}-{bp}.png`
- `{brand}-{material}-{angle}-{bp}.mp4` (when `--with-video` flag set)
- `manifest.json` — variant index
- `index.html` — preview gallery embeddable in `/brand` public route

Cache key: `sha256(DESIGN-DNA.md + hero_mark.preset_id + override_hash)`. Re-runs skip regeneration unless `--force`.

If `3dsvg-export` MCP unavailable, brandkit exits gracefully with instructions to run `/gen:hero-mark design` manually.

## Workflow

### 1. Parse argument

- `export` (default) — run full generation pipeline, produce `public/brand/` + `brand.zip`.
- `preview` — launch dev server if not running, open `/brand` route, report URL.
- `sync` — refresh color/font tokens from DNA without regenerating logos.

### 2. Prereq validation

Fail loudly with remediation if:
- `.planning/genorah/DESIGN-DNA.md` missing → "Run `/gen:start-project` first."
- No Wave 0 output → "Scaffold the project with `/gen:build` first."
- `design-system-export` skill missing → "Run `/gen:design-system` to establish the token pipeline."

### 3. Logo resolution

- If `public/logo.svg` exists → use it as source.
- Else if nano-banana MCP available → generate logo with DNA primary + archetype prompt.
- Else → fallback to typographic wordmark from DNA display font.

Report which path was taken so user knows what to review.

### 4. Generate outputs (parallel where possible)

Run these in parallel:
- Logo variants (light/dark/mono/mark)
- Favicon set (ICO + multi-res PNG + apple-touch + maskable + site.webmanifest)
- Color token files (JSON/CSS/SCSS/DTCG)
- Font specimens (HTML)
- OG template render (Remotion)

Then sequential:
- PDF guidelines (Remotion, depends on color + font + logo being ready)
- `/brand` route scaffold (depends on all assets existing)
- `brand.zip` archive (depends on all above)

### 5. Cache check (idempotent re-runs)

Hash key = `sha256(DESIGN-DNA.md + logo.svg.mtime)`. Skip regeneration for files whose cache key matches previous run. Only hero assets regenerate unconditionally.

### 6. Perf validation

After generation, verify:
- Favicon sizes match spec (16, 32, 48, 192, 512, 180, 512-maskable)
- OG image is 1200×630 exact
- Logo SVG has no raster embedded (vector-only)
- PDF < 8MB (readable email attachment)

Flag failures as WARNING in report.

### 7. Report

```
Brandkit exported → public/brand/
Files: 24 generated, 7 skipped (cache hit)
Size: brand.zip = 3.2MB
Logo source: public/logo.svg → variants generated
Next: /gen:brandkit preview to open /brand route
```

Render the "⚡ NEXT ACTION" block sourced from `skills/pipeline-guidance/SKILL.md`. After successful export, the typical primary is `/gen:export` (full deliverables) or `/gen:brandkit preview` (review /brand route).

## Notes

- Brandkit is opt-in per `/gen:start-project` discovery flag `brandkit: { enabled }`. Command works regardless of that flag — the flag just controls automatic post-audit invocation.
- Public route `/brand` does NOT require auth — deliberate (investors/partners can find assets quickly).
- Re-run `/gen:brandkit export` after significant DNA changes to regenerate.
