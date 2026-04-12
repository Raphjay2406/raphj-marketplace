---
name: ui-ux-pro-max-distilled
tier: utility
description: "Meta-skill documenting Genorah's distillation of UI UX PRO MAX (MIT) assets: palette seeds (160→24 curated), font pairings (73→18 curated), industry reasoning rules (161 offline cache), 6 new archetypes (Claymorphism, Neumorphism, Y2K, Cyberpunk-HUD, Spatial/VisionOS, Pixel-Art), chart patterns (25 merged), Svelte+Vue+Nuxt framework patterns. When to prefer seed vs live generation."
triggers: ["pro max", "ui ux pro max", "uipro", "palette seed", "font pairing seed", "industry rule lookup", "distillation attribution"]
used_by: ["design-dna", "design-archetypes", "design-brainstorm", "chart-data-viz", "start-project"]
version: "3.1.0"
---

## Layer 1: Decision Guidance

### Why Distillation (Not Bridge)

v3.1 harvests the data-driven assets from UI UX PRO MAX (nextlevelbuilder/ui-ux-pro-max-skill, MIT) directly into Genorah rather than calling it at runtime. Reasons:

1. **Deterministic** — runtime dependencies on external plugins introduce non-determinism across sessions. Seeds are frozen.
2. **Provenance** — seed files in this repo mean the project can be audited + redistributed.
3. **Genorah-native** — we remap PRO MAX's 17-token palette to our 12-token DNA structure up front, so downstream skills don't need to know about PRO MAX.
4. **No runtime cost** — reading a JSON file is O(1); running a subprocess isn't.

### When to Prefer Seeds

- `/gen:start-project` discovery matches a known industry → load palette + font suggestions from seeds as *proposals* (not commitments).
- User requests "default palette for {industry}" → consult seeds first, fallback to DNA generation.
- Offline / Playwright unavailable → industry rules seed provides research-lite fallback.

### When to Prefer Live DNA Generation

- Industry not covered by seeds (~24 palettes cover top industries; long tail requires DNA generation).
- User selected archetype with strong color mandate (Brutalist forbidden pastels, etc.) — archetype overrides seed.
- Client provides existing brand guide — user input overrides everything.

### Precedence (when seed + archetype + user input conflict)

```
user-provided brand → archetype mandate → seed proposal → DNA generation
```

Seed is a *suggestion*, not a lock.

## Layer 2: Asset Inventory (what got absorbed)

| Asset | Source | Path in Genorah | Action |
|-------|--------|----------------|--------|
| 160 palettes | colors.csv | `skills/design-dna/seeds/uipro-palettes.json` | Distilled 24 representative, remapped to 12-token DNA |
| 73 font pairings | typography.csv | `skills/design-dna/seeds/uipro-fonts.json` | Distilled 18 covering major moods (Google Fonts URL-only, no binaries) |
| 161 industry rules | ui-reasoning.csv | `skills/design-brainstorm/seeds/uipro-industry-rules.json` | Offline cache for research-lite fallback |
| 84 styles vs 19 archetypes | styles.csv | `skills/design-archetypes/SKILL.md` | Added 6: Claymorphism, Neumorphism/Soft-UI, Y2K, Cyberpunk-HUD, Spatial/VisionOS, Pixel-Art |
| 25 chart patterns | charts.csv | `skills/chart-data-viz/SKILL.md` | Merged volume+a11y+library-rec matrix |
| 34 landing patterns | landing.csv | `skills/landing-page/SKILL.md` | Cherry-picked 5-8 not already covered |
| Svelte / Vue / Nuxt stacks | stacks/*.csv | `skills/{svelte,vue,nuxt}-patterns/SKILL.md` | New framework skills (gaps filled) |
| Angular / Laravel stacks | stacks/*.csv | — | SKIP (outside premium-frontend scope) |
| Python BM25 CLI | scripts/search.py | — | SKIP (LLM retrieval over JSON sufficient) |
| Font binaries | canvas-fonts/*.ttf | — | SKIP (keep URL refs, ~4MB savings) |

## Layer 3: Integration Context

### Downstream Consumers

- **design-dna** reads seeds during DNA generation when industry matches a palette id or a font-pairing mood fits project tone.
- **design-archetypes** lists all 25 archetypes (19 original + 6 distilled) with equal authority — no "originals-only" distinction.
- **design-brainstorm** consults industry-rules seed only as fallback when Playwright MCP unavailable or rate-limited.
- **chart-data-viz** uses the volume/a11y/library matrix for chart-type recommendations.
- **ui-ux-pro-max-distilled** (this skill) is the canonical registry for what came from where.

### Attribution in Generated Artifacts

When a user project inherits a distilled palette/font, the generated `DESIGN-DNA.md` should include:

```yaml
palette_source: "distilled from UI UX PRO MAX v2.0 (MIT)"
font_source: "distilled from UI UX PRO MAX v2.0 (MIT)"
```

This is handled by the `design-dna` skill automatically. No user action.

## Layer 4: Anti-Patterns

- ❌ **Treating seeds as exhaustive** — 24 palettes ≠ "all industries solved". Long tail falls through to live DNA generation.
- ❌ **Letting seed proposals override archetype mandates** — if Brutalist says "no pastels" and seed suggests pastel, archetype wins.
- ❌ **Re-running PRO MAX CLI at runtime** — don't. Seeds are frozen; runtime call would reintroduce the determinism problem we just solved.
- ❌ **Forgetting OFL.txt for fonts** — we don't vendor binaries, but if a future version does, OFL.txt must ship alongside each font file.
- ❌ **Stripping attribution from DESIGN-DNA.md** — MIT requires preserving the copyright notice in substantial portions. Inline attribution is the cleanest solution.
- ❌ **Deep-linking to PRO MAX internals** — if PRO MAX deletes a CSV row we referenced, we silently break. Seeds being in-repo isolates us.

## Layer 5: Re-Ingestion Protocol

To refresh seeds from a newer PRO MAX release:

1. Check https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/releases for a new tag.
2. Fetch `src/ui-ux-pro-max/data/{colors,typography,ui-reasoning}.csv` from the tag.
3. Apply the remapping rules in `skills/design-dna/seeds/ATTRIBUTION.md`.
4. Write new JSON files with `_meta.source` updated to the new tag.
5. Run `/gen:self-audit` to verify schema compatibility.
6. Commit as `chore(seeds): refresh uipro distillation to v{new-tag}`.

No need to re-absorb archetypes / chart patterns / framework skills unless PRO MAX adds a genuinely novel entry — those are one-time ports, not live sync.
