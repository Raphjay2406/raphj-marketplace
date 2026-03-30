# Visual Companion Protocol (v1.0)

A browser-based visual display layer for agents. Render mockups, design comparisons, color palettes, and scored options in a live browser window rather than the terminal — reserving the terminal for questions, status, and structured output.

---

## Overview

The visual companion is a localhost HTTP + WebSocket server bundled with the plugin. It serves a single browser tab that live-reloads whenever a new screen is pushed. Agents write plain HTML fragments to the companion directory; the server wraps them in a full document, injects the interaction runtime, and broadcasts the update to all connected tabs.

**Screen storage location:** `.planning/genorah/companion/` inside the target project.

The server watches this directory. All `.html` files in it are treated as screens. The most recently modified file is displayed.

---

## Starting the Companion

Run from the project root. `CLAUDE_PLUGIN_ROOT` is the absolute path to this plugin directory.

```bash
node "$CLAUDE_PLUGIN_ROOT/companion/server.js" --dir .planning/genorah/companion
```

**Windows note:** Use `run_in_background: true` when starting the server via the Bash tool. The server is a long-running process and will block the tool call if run in the foreground. After starting, verify it is running by checking for the confirmation message in the background task output before pushing the first screen.

---

## Pushing Screens

Write an HTML fragment file to `.planning/genorah/companion/`. The server wraps it automatically — no `<!DOCTYPE>`, `<html>`, `<head>`, or `<body>` tags needed. Include only the content you want displayed.

**Rules:**

- **Semantic filenames.** Name files after what they show: `archetype-options.html`, `color-palette-v2.html`, `hero-mockup.html`. The filename appears as the screen title in the browser tab.
- **Never reuse filenames.** Each new screen gets a unique name. Overwriting a file with different content causes the server to re-push it, which clears all previous interaction events. If you need a revised version, append a suffix: `-v2`, `-revised`, `-after`.
- **Server auto-reloads.** As soon as the file is written, the browser updates. No manual refresh needed.
- **Events cleared on new screen.** Every time a new screen is pushed (a new file written), the `.events` file is reset. Read events before pushing the next screen if you need to capture the user's choices.

### Minimal example

```html
<h2>Choose a direction</h2>
<div class="options">
  <button class="option" data-choice="A">Brutalist</button>
  <button class="option" data-choice="B">Ethereal</button>
  <button class="option" data-choice="C">Kinetic</button>
</div>
```

---

## CSS Classes

The companion runtime ships with a built-in stylesheet. Use these classes directly — no custom CSS required unless you are building a detailed mockup.

### `.options` / `.option[data-choice]` — A/B/C picker

Horizontal row of tappable choice buttons. One selection at a time unless `data-multiselect` is set.

```html
<div class="options">
  <button class="option" data-choice="A">Option A</button>
  <button class="option" data-choice="B">Option B</button>
  <button class="option" data-choice="C">Option C</button>
</div>
```

### `.cards` / `.card[data-choice]` — grid cards

Responsive grid of richer cards. Each card can contain an image, heading, and description. One card selected at a time unless `data-multiselect` is set.

```html
<div class="cards">
  <div class="card" data-choice="brutalist">
    <h3>Brutalist</h3>
    <p>Raw structure, high contrast, confrontational whitespace.</p>
  </div>
  <div class="card" data-choice="ethereal">
    <h3>Ethereal</h3>
    <p>Soft gradients, ghost elements, weightless motion.</p>
  </div>
</div>
```

### `.split` — side-by-side comparison

Two-column layout for before/after or option-A-vs-option-B comparisons.

```html
<div class="split">
  <div>
    <h3>Before</h3>
    <!-- left panel content -->
  </div>
  <div>
    <h3>After</h3>
    <!-- right panel content -->
  </div>
</div>
```

### `.palette` / `.swatch` — color swatches

Renders a row of color chips with labels. Set `--color` as an inline style on each swatch.

```html
<div class="palette">
  <div class="swatch" style="--color: #0A0A0F;" data-choice="bg">bg</div>
  <div class="swatch" style="--color: #13131A;" data-choice="surface">surface</div>
  <div class="swatch" style="--color: #7B61FF;" data-choice="primary">primary</div>
  <div class="swatch" style="--color: #FF6B6B;" data-choice="accent">accent</div>
</div>
```

### `.score-bar` / `.fill` — progress bars

Visualise scoring or completion. Set `--pct` on the `.fill` element (0–100).

```html
<div class="score-bar">
  <span>Anti-Slop Gate</span>
  <div class="fill" style="--pct: 82;"></div>
</div>
<div class="score-bar">
  <span>Emotional Arc</span>
  <div class="fill" style="--pct: 74;"></div>
</div>
```

### `data-multiselect` — multi-select mode

Add `data-multiselect` to any `.options` or `.cards` container to allow multiple simultaneous selections. The `.events` file will record all selected choices as an array.

```html
<div class="cards" data-multiselect>
  <div class="card" data-choice="nav">Navigation</div>
  <div class="card" data-choice="hero">Hero</div>
  <div class="card" data-choice="features">Features</div>
  <div class="card" data-choice="cta">CTA</div>
</div>
```

---

## Reading Choices

User interactions are written to `.planning/genorah/companion/.events` as JSON lines (one JSON object per line, newest at the bottom).

### Event format

```jsonc
{"screen": "archetype-options.html", "choice": "B", "ts": 1711800000000}
```

| Field | Type | Description |
|-------|------|-------------|
| `screen` | string | Filename of the active screen when the choice was made |
| `choice` | string \| string[] | `data-choice` value, or an array if `data-multiselect` |
| `ts` | number | Unix timestamp (ms) |

### Reading the file

Read the `.events` file and parse the last line (or filter by `screen` name) to get the user's selection before proceeding.

**Important:** The `.events` file is cleared when a new screen is pushed. Always read it before writing the next screen.

---

## Visual vs Terminal

Use the companion for anything spatial or comparative. Keep questions, confirmations, and structured output in the terminal.

| Situation | Use |
|-----------|-----|
| Showing two or more design directions | Browser |
| Displaying a color palette for approval | Browser |
| Rendering a section mockup | Browser |
| Presenting Awwwards / Anti-Slop scores | Browser (score bars) |
| Comparing before / after layouts | Browser (`.split`) |
| Asking a yes/no question | Terminal |
| Reporting wave status | Terminal |
| Presenting the Discussion Protocol gate | Terminal |
| Logging to CONTEXT.md / STATE.md | Terminal (file write) |
| Multi-step structured output (PLAN.md) | Terminal (file write) |

**Rule of thumb:** If it would benefit from a visual layout, use the browser. If it is a question, decision gate, or status message, use the terminal.

---

## Stopping the Companion

```bash
kill $(lsof -ti tcp:3131)
```

On Windows (if not using `run_in_background`), terminate the background task directly.

---

## Fallback

If the companion server is not running (port 3131 unreachable, or `.planning/genorah/companion/` does not exist), agents fall back to terminal-only output:

- **Mockups:** ASCII block diagrams in a fenced code block labeled `ASCII MOCKUP`.
- **Color palettes:** Hex values listed with their token names in a table.
- **Comparisons:** Two labeled sections with bullet-point descriptions of the differences.
- **Score bars:** A markdown table with numeric values.

Fallback output is functionally equivalent but loses the live-interaction capability. The user cannot click to select; instead, agents ask for the choice explicitly in the terminal using the Discussion Protocol format.
