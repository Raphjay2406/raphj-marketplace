# 3dsvg-export MCP Server

Headless 3dsvg → PNG/MP4 export via Playwright + `registerCanvas` prop.

## What it does

Wraps the `3dsvg` npm package in a headless Chromium instance (Playwright), renders a `<SVG3D>` with given preset config, captures the WebGL canvas via the `registerCanvas` callback prop, exports PNG (multiple resolutions) and/or MP4 (60fps, configurable duration). No 3dsvg.design UI interaction needed — fully automated.

Built for Genorah v3.4.1 `/gen:hero-mark export` subcommand to generate the 30-variant brand matrix (5 materials × 3 angles × 2 breakpoints).

## Tools exposed

### `render_preset(preset_id, override?, output_dir)`
Render a single preset to `{output_dir}/{preset_id}.png`. Returns `{ path, size_kb, duration_ms }`.

### `render_batch(archetype, beat, brand_name, materials?, angles?, breakpoints?, output_dir)`
Render the multi-variant matrix. Default: 5 materials from archetype's preferred list × 3 angles (front, 3/4R, 3/4L) × 2 breakpoints (2K, 4K). Returns `{ variants: [...], manifest_path, total_size_mb, duration_ms }`.

### `render_video(preset_id, override?, duration_s, fps, output_path)`
Render MP4. Default: 4s, 60fps. Uses FFmpeg via `@ffmpeg-installer/ffmpeg`. Returns `{ path, size_kb, frames, duration_s }`.

## Security

This MCP runs `3dsvg` in a headless browser with ZERO network access (Playwright launched with `--disable-network`). User-provided `text` and `svg` inputs sanitized via `svgo` allowlist before rendering (per v3.4.0 security spec in `skills/3dsvg-extrusion`).

## Installation

This server is OPTIONAL. If Playwright is already installed (it likely is — Genorah declares `playwright` MCP), this server reuses the Playwright install. Otherwise:

```bash
npm i -g playwright
npx playwright install chromium
```

Then register in `.claude-plugin/.mcp.json`:

```json
"3dsvg-export": {
  "command": "node",
  "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/3dsvg-export/server.mjs"],
  "description": "Headless 3dsvg render + export via Playwright + registerCanvas",
  "optional": true
}
```

## Graceful degradation

If Playwright unavailable, `/gen:hero-mark export` falls back to emitting detailed instructions for user to manually export from 3dsvg.design. No hard failure.

## Runtime cost

- Single preset render: ~2-3s (Chromium startup + 3dsvg extrusion + canvas capture)
- Full 30-variant matrix: ~60-90s (browser reused, parallel batches of 3)
- Video render: ~duration_s × 1.2 (60fps capture + FFmpeg encode)

## File structure

```
mcp-servers/3dsvg-export/
├── README.md              (this file)
├── server.mjs             (MCP server entry — stdio protocol)
├── render.mjs             (Playwright render core)
├── template.html          (minimal Vite-free HTML with <SVG3D> via CDN)
├── package.json           (peer deps: playwright, @ffmpeg-installer/ffmpeg, svgo)
└── examples/
    └── render-preset.mjs  (CLI equivalent for manual testing)
```

## Compliance

- MIT (wraps 3dsvg which is MIT; wraps Playwright which is Apache-2.0)
- No user credentials handled; no network I/O
- Generated assets respect archetype material-compliance from preset library
