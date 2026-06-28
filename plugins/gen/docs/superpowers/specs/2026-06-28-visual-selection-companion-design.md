# Visual Selection Companion — Design Spec

**Date:** 2026-06-28
**Status:** Approved (brainstorming complete, pending implementation plan)
**Target release:** Genorah v4.2.0 (minor)

## Problem

Genorah's spec/design/iterate steps present design options as **monochrome ASCII mockups + hex tables + tiny swatches** in the terminal:

```
+------------------------------------------+
|  [LOGO]      [Nav]        [CTA BUTTON]   |
|        HERO HEADLINE                      |
|        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓                    |
+------------------------------------------+
```

Three directions rendered this way look nearly identical — **color mood, typography personality, and motion feel are invisible**. A `#0a0a0f "deep void"` table entry asks the user to imagine a color rather than see it. The user cannot meaningfully compare or choose.

## Key finding: the companion already exists

A complete superpowers-style visual companion is already built and working, just dormant:

- `.claude-plugin/scripts/server.cjs` — zero-dependency Node HTTP+WebSocket server. Watches a `--screen-dir` for the newest `*.html`, wraps fragments in a frame, injects a client helper, and **already implements the selection round-trip**: a WebSocket message carrying `choice` is appended to a `.events` file in the screen-dir (server.cjs:260-263). On a new screen it clears `.events` (server.cjs:305-307) and broadcasts a reload.
- `.claude-plugin/scripts/helper.js` — client helper. On a click on any `[data-choice]` element it toggles `.selected`, reads the card's `<h3>` text, and posts `{type:'click', choice, text, selected, timestamp}` over the WebSocket. Honors a `data-multiselect` container for multi-pick.
- `.claude-plugin/scripts/frame-template.html` — themed wrapper.
- `.claude-plugin/scripts/start-server.sh` / `stop-server.sh` — cross-platform lifecycle (Windows foreground `exec`, POSIX `nohup`), writes `.server-info`. Screen-dir = `<project>/.planning/genorah/companion/`.

The render→click→record loop is done. What is missing is everything that would make the pipeline **use** it well.

## Decisions (locked during brainstorming)

- **Core goal:** the full loop — render options with real visual fidelity AND clickable selection fed back to the agent.
- **Build approach:** reuse the existing `server.cjs` companion (do not rebuild or replace it); add a deterministic render layer and wire the command flows.
- **Screen generation:** **deterministic render scripts** (approach A). The agent produces a structured screen-spec (the creative content); a script renders consistent, color-accurate HTML. Mirrors the v4.1 "engine renders, LLM provides data" philosophy; testable.
- **Surfaces (all four):** creative directions, iterate proposals, archetype pick, palette / Design DNA.
- **Fidelity:** color-accurate HTML mockups (real DNA hex as actual backgrounds/text, real fonts) **plus** a gpt-image-generated hero per option on the high-impact surfaces, with graceful fallback to a DNA gradient when gpt-image is unavailable.

## Architecture

Four parts. The server is untouched except an optional launcher flag.

### 1. Render layer — `scripts/companion/render-screen.mjs` (deterministic)

Pure function `renderScreen(spec) -> htmlFragment`. Dispatches on `spec.kind` to a per-surface renderer; all renderers share components (swatch row, type specimen, mockup block, hero slot, choice card). Writing the fragment to the screen-dir is a thin CLI wrapper; the render itself is a pure string function so it is unit-testable.

**Screen-spec schema** (the data the agent produces):

```js
{
  kind: "directions" | "iterate" | "archetype" | "palette",
  title: string,
  subtitle: string,
  multiselect: boolean,            // true → cards render inside a data-multiselect container
  options: [
    {
      id: string,                  // becomes data-choice
      label: string,               // becomes the card <h3> (helper.js reads this)
      blurb: string,
      palette: {                   // the 12 DNA tokens for THIS option
        bg, surface, text, border, primary, secondary, accent, muted,
        glow, tension, highlight, signature
      },
      fonts: { display, body, mono },
      mockup: { blocks: [ { kind: "nav"|"hero"|"text"|"cards"|"cta"|"footer",
                            label?, token?, height? } ] },
      hero: { imagePath?: string, gradientFrom?: string, gradientTo?: string },
      motionHint?: string,
      badges?: string[]
    }
  ]
}
```

Each option renders to a `<div class="card" data-choice="<id>"><h3><label></h3> …</div>` containing:

- **Hero** — `<img src="/files/<imagePath>">` when present, else a CSS gradient `linear-gradient(gradientFrom → gradientTo)` built from the option's own tokens. (`server.cjs` already serves `/files/*` from the screen-dir.)
- **Swatch row** — real `<span style="background:<hex>">` chips for the 12 tokens, hex label under each. This is the direct fix for "coloring didn't show."
- **Type specimen** — a real headline in `fonts.display` and body line in `fonts.body`, colored with the option's `text`/`primary` on its `bg`. Fonts loaded via a Google Fonts `<link>` emitted in the fragment head.
- **Mockup** — `mockup.blocks` rendered as **styled HTML blocks using the option's actual hex tokens** (not ASCII): a nav bar in `surface`, a hero band in `bg` with `primary` CTA, text rows in `muted`, etc. Color-real, archetype-distinct.
- **Motion hint** + **badges**.

Color accuracy comes from inline styles carrying the option's real hex values; no theme indirection.

### 2. Hero image embedding (per-surface, progressive, optional)

- **directions** and **iterate** surfaces (small N, high impact): for each option, a step calls `mcp__gpt-image__generate_image` with a DNA-matched prompt and writes the PNG into the screen-dir; the spec's `hero.imagePath` points at it.
- **archetype** (large N) and **palette**: no per-option hero generation — archetype cards use the DNA gradient + representative mockup; palette is swatch-and-preview focused.
- **Progressive enhancement:** render the screen immediately with gradient heroes (instant), then generate hero images and re-render; the server's file-watch auto-reloads the browser. If gpt-image is unavailable, the gradient is the final state — never a broken image, never a blocked screen.

### 3. Selection-read protocol — `scripts/companion/read-selection.mjs` (deterministic)

Pure function `readSelection(eventsPath, { multiselect }) -> { choices: string[], labels: string[] }`. Parses the `.events` JSONL, resolves the current selection (single-select: the last `selected:true` click wins; multi-select: every choice whose latest event is `selected:true`). Unit-testable from a fixture `.events` file.

**Turn-boundary handshake** (documented in each wired command):
1. Agent builds the screen-spec, generates the fragment via `render-screen.mjs` into the screen-dir.
2. Ensures the companion is running (`start-server.sh --project-dir <proj>`); reports the URL.
3. Tells the user: "Pick in the browser tab (or type your choice here)."
4. **Next turn**, the agent runs `read-selection.mjs`; if a selection exists it proceeds with it, else it falls back to the user's typed choice. (server.cjs clears `.events` on the next screen, so stale picks never leak across screens.)

### 4. Command-flow wiring

Each selection moment gains a "render screen → companion → read `.events`" step, with ASCII/markdown demoted to the **fallback** path (used only when the companion can't run — headless, no browser, or user opt-out):

- `commands/start-project.md` — archetype pick + creative directions.
- `commands/discuss.md` — creative directions.
- `commands/iterate.md` — redesign proposals (diff mockups).
- The Design DNA / palette approval step (in `start-project` / `design-dna` flow) — palette surface.

The `visual-companion-screens` skill is updated to point at the deterministic renderer and the screen-spec schema instead of hand-authored templates. `design-brainstorm` / `creative-direction-format` keep producing the creative content but now emit it as a screen-spec (data), not ASCII as the primary artifact.

### 5. Launcher polish

Add an optional `--open` flag to `start-server.sh` that opens the default browser to the companion URL (`start` on Windows, `open` on macOS, `xdg-open` on Linux). Best-effort; never fails the launch.

## Components and boundaries

| Unit | Responsibility | Depends on | Consumed by |
|------|----------------|-----------|-------------|
| `scripts/companion/render-screen.mjs` | screen-spec → HTML fragment (pure) + CLI write | screen-spec schema | command flows |
| `scripts/companion/components.mjs` | shared HTML builders (swatch row, specimen, mockup, card) | — | render-screen |
| `scripts/companion/read-selection.mjs` | `.events` JSONL → resolved selection (pure) | — | command flows |
| `scripts/companion/gen-hero.mjs` | per-option gpt-image hero into screen-dir (best-effort) | `mcp__gpt-image__*` | directions/iterate flows |
| `server.cjs` / `helper.js` / `frame-template.html` | serve, click→`.events`, frame (UNCHANGED) | — | everything |
| `start-server.sh` | lifecycle + optional `--open` | server.cjs | command flows |

## Testing

- `tests/companion-render.test.mjs` — `renderScreen` output for each `kind` contains: every option's `data-choice` id, the `<h3>` label, the option's hex tokens as inline-style substrings (color accuracy), the Google-Fonts link, and (directions/iterate) an `<img src="/files/…">` when `hero.imagePath` is set or a `linear-gradient(...)` when not.
- `tests/companion-selection.test.mjs` — `readSelection` resolves single-select last-click-wins and multi-select set correctly from a fixture `.events`; returns empty when no selection.
- Both are pure-function tests, wired into `npm run validate`.

## Rollout

- Minor bump to **v4.2.0**; changelog `docs/v4.2-changelog.md`.
- Mirror discipline: `scripts/companion/` and any edited skills/commands sync into `plugins/gen/` via `sync-mirror`; `check-mirror` green. (The existing `.claude-plugin/scripts/` companion files are already shipped.)
- Backward-compat: additive. The ASCII path remains as the documented fallback; `/gen:companion` still works.

## Scope guard

This builds the render layer + selection reader + hero embedding + command wiring on top of the existing server. It does **not** rebuild the server, touch the dashboard (`localhost:4455`), or alter the build pipeline. The graphify/memory overhaul is a separate spec.

## Open questions for the implementation plan

- Exact Google-Fonts URL construction for arbitrary display/body fonts (fallback to system stack when a font isn't on Google Fonts).
- Whether archetype cards (42 of them) paginate or filter in the picker to stay performant.
- Hero prompt templates per beat for `gen-hero.mjs` (reuse `image-prompt-generation` skill).
