# raphj-marketplace

Personal Claude Code plugin marketplace by Raphjay2406.

## Installation

```bash
claude plugin marketplace add https://github.com/Raphjay2406/raphj-marketplace
```

## Available Plugins

| Plugin | Skills | Commands | Agents | Description |
|--------|--------|----------|--------|-------------|
| `genorah` | ~153 | 26 | 21 | Premium frontend design system **v3.4.1 — 3dsvg Hero Mark Automation**. v3.4.0 shipped 75-preset 3dsvg library + AJV schema + archetype-material compliance + `<GenorahSVG3D>` accessibility wrapper pattern + SVG input sanitization + motion-health/perf-budgets coupling + Hero Mark Compliance sub-gate. v3.4.1 adds `/gen:hero-mark` command (design/live/export/preview), `/gen:start-project` discovery Q, brandkit 30-variant fan-out, and the `3dsvg-export` MCP server (headless Playwright + registerCanvas render pipeline). v3.2.1 fixed skill-injection routing (99% of skills were silently unreachable before the `triggers:` fallback landed). v3.3 adds quality-gate sub-gate wiring docs, stale mobile/Shopify content refresh (SwiftUI 6, Compose 2.0, Expo 52, Flutter 3.24, Storefront API 2025-01), motion-health ↔ animation-orchestration cross-reference, uipro palette selection algorithm, testable archetype-specificity hard gate, 65-skill metadata retrofit for path-pattern injection, 3dsvg-extrusion skill for zero-config 3D SVG glyphs, 9 new hook integration tests, pre-push mirror parity enforcement. 21-agent pipeline (adds visual-refiner + consistency-auditor), Design DNA, 19 archetypes, 234-point quality gate via 6-stage validation pipeline (DNA → render → registry → consistency → fidelity → full gate). v3.0 primitives: closed-loop visual refiner, DNA drift detector (92% coverage hard gate), perf budgets per beat, motion health sub-gate, reference-diff-protocol (per-beat SSIM), AI variant tournament, section consistency auditor, live localhost dashboard, interactive click-to-refine companion, competitive benchmarking, smart router, self-audit. Frontier: WebGPU/TSL decision matrix, GLTF optimization, Sanity + Payload CMS round-trip, Remotion section video, brand voice extractor, cognitive accessibility (CVD ΔE2000), i18n-by-default. 5 MCP integrations (nano-banana, Stitch, Playwright, Obsidian x2). Targets Next.js, Astro, React/Vite, Tauri, Electron, Swift/SwiftUI, Kotlin/Compose, React Native, Expo, Flutter. |
| `wavy-bavy` | 1 | — | — | Integrate the wavy-bavy library for seamless wave transitions between page sections |

## Install a Plugin

After adding the marketplace, install any plugin:

```bash
claude plugin install genorah@raphj-marketplace
claude plugin install wavy-bavy@raphj-marketplace
```
