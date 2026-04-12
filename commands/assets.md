---
description: "Generate, audit, and manage project assets — 3D models, 2D SVG/raster, icons, patterns, characters. DNA-governed via MANIFEST.json. Subcommands: init | generate | 3d | 2d | image | character | regenerate | audit | library | export."
argument-hint: "init | generate | 3d <kind> | 2d <kind> | image <beat> | character | regenerate <id> | audit | library | export"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__nano-banana__generate_image, mcp__nano-banana__edit_image, mcp__nano-banana__continue_editing, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot
recommended-model: sonnet-4-6
---

# /gen:assets

v3.5.0 Asset Forge entry point. Governs every generated media artifact via `public/assets/MANIFEST.json` (see `skills/asset-forge-manifest/SKILL.md`) and the `asset-forge-dna-compliance` sub-gate.

## Subcommands

### `init` (default when no argument)

1. Scan `PROJECT.md`, `DESIGN-DNA.md`, and `MASTER-PLAN.md` — extract per-beat asset needs.
2. Propose asset plan:
   - kind × count per beat
   - procedural vs MCP-generated per asset (based on available MCPs)
   - estimated API cost (if any paid MCP involved)
   - license implications
3. Display plan table + total cost estimate.
4. Await user approval. On `yes`, write plan to `.planning/genorah/assets-plan.json`.

Fails loudly with remediation if:
- `DESIGN-DNA.md` missing → run `/gen:start-project`
- `MASTER-PLAN.md` missing → run `/gen:plan`

### `generate`

Execute approved plan. For each asset:
1. Compute `cache_key = sha256(dna_hash + archetype + kind + prompt + seed + model_version)`.
2. If cached in `.planning/genorah/assets-cache/<cache_key>/` → link to `public/assets/`, skip gen.
3. Else call appropriate generator:
   - **3D procedural**: Three.js script in `scripts/asset-forge/3d-procedural.mjs`
   - **3D AI**: `meshy-mcp` (fallback procedural)
   - **2D SVG**: `scripts/asset-forge/svg-parametric.mjs`
   - **2D vector AI**: `recraft-mcp` (fallback parametric)
   - **Raster**: image-cascade (Flux → Ideogram → nano-banana fallback)
4. Write asset file + preview.
5. Append entry to `public/assets/MANIFEST.json`.
6. Write ledger line: `{kind: "asset-generated", subject: <asset-id>, payload: <manifest-entry>}`.

### `3d <kind>`

`kind ∈ {model, scene, material, hero-glyph}`. Focused 3D generation bypassing plan — useful for iterate cycles.

### `2d <kind>`

`kind ∈ {icon-set, pattern, illustration, mesh-gradient, blob, svg}`. Uses procedural generators by default.

### `image <beat>`

Raster gen scoped to beat. Uses `skills/image-prompt-generation` archetype templates plus beat modulations:
- HOOK: dramatic cinematic, DNA primary saturation
- BREATHE: subtle atmospheric, DNA muted tones
- PEAK: maximum expression, DNA accent prominent
- CLOSE: reflective, DNA secondary

### `character`

Character/mascot suite. Requires `flux-mcp` or `nano-banana`. Produces:
- 1 canonical reference
- 4 turnaround views (0°, 90°, 180°, 270°)
- 3 expression variants
- 2 pose variants
- Consistency enforced via IP-Adapter (flux) or style-transfer (nano-banana).

### `regenerate <id>`

Force re-generation of a specific asset id. Accepts optional `--seed <n>` and `--prompt-override "..."`. Manifest entry updated with new cache_key; old asset archived to `.planning/genorah/assets-archive/`.

### `audit`

Run `asset-forge-dna-compliance` sub-gate against current manifest. Report per-asset pass/fail with penalties.

### `library`

Launch localhost asset browser (reuses `/gen:dashboard` infrastructure). Shows each asset with DNA-coverage bars, regenerate button, and manifest diff.

### `export`

Bundle `public/assets/` + `MANIFEST.json` + `prompts/` + `LICENSING.md` into `assets.zip`. Generate `LICENSING.md` from manifest `license` enums.

## Budget controls

Read `.claude/genorah.local.md` for `assets.budget.max_api_usd` and `assets.budget.max_minutes`. Gate any MCP call that would exceed cap; prompt user to approve.

## Pipeline guidance

On successful generation, render the "⚡ NEXT ACTION" block from `skills/pipeline-guidance/SKILL.md`. After full `generate` the primary next action is typically `/gen:assets audit` (verify sub-gate) or `/gen:brandkit export` (if brandkit uses these assets).

## Notes

- MANIFEST.json is the single source of truth. Never manually edit files in `public/assets/` without an accompanying manifest update.
- Cache is aggressive by design — second run on same DNA is near-free.
- Procedural fallback path is first-class; offline safety preserved.
