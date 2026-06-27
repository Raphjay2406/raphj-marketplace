# CLAUDE.md — gpt-image-mcp

Operational guide for working in this repo. Read this first when resuming.

> **⚠️ Now BUNDLED into the Genorah gen plugin** at `mcp-servers/gpt-image/`. The runtime is a self-contained
> esbuild bundle (`npm run bundle` → `index.mjs`), wired via `${CLAUDE_PLUGIN_ROOT}/mcp-servers/gpt-image/index.mjs`
> with the key from the **OS env** (`${OPENAI_API_KEY}` — `setx` it once). The server internals below (API contract,
> `.js`-extension rule, tests) are all still current; only the older "standalone / `P:\Genorah` / cache-stopgap"
> framing in the wiring section is superseded — see the **gen plugin's root `CLAUDE.md`** for the bundled wiring.

## What this is
A small **MCP server** (Node/TS, stdio) that wraps the **OpenAI Images API (`gpt-image-2`)** and exposes two
tools to Claude Code: **`generate_image`** (text → image) and **`edit_image`** (image[+mask] + prompt → image).
It replaced the Gemini `nano-banana` MCP in the Genorah ("gen") plugin. Standalone git repo (relocated out of the
`d:\Modulo\Plugins\v0-ahh-skill` monorepo). Package name `@genorah/gpt-image-mcp` (not published to npm).

## Layout
```
src/
  index.ts      # entry: loadEnvFile → loadConfig → OpenAiImageClient → McpServer.registerTool ×2 → stdio
  config.ts     # loadConfig(env), modelSupportsTransparent(), modelSupportsInputFidelity(), loadEnvFile()
  schemas.ts    # zod RAW shapes generateShape/editShape (passed to registerTool); GenerateArgs/EditArgs types
  openai.ts     # OpenAiImageClient.generate()/edit(), OpenAiImageError, retry + error mapping
  files.ts      # resolveOutputPaths(), writeBase64(), readImageFile(), sniffMime(); ImageFile type
  result.ts     # successContent()/errorContent()/formatError() → MCP content blocks (+1.5MB preview cap)
  tools/
    generate.ts # makeGenerateHandler(deps)
    edit.ts     # makeEditHandler(deps)
test/           # vitest: *.test.ts (mock fetch) + live.test.ts (opt-in, real API)
docs/superpowers/{specs,plans}/  # the design spec + implementation plan (read for full rationale)
```

## Commands
```bash
npm install            # standalone install (deps: @modelcontextprotocol/sdk + zod; dev: typescript, vitest, @types/node)
npm run build          # tsc -p .  → dist/  (REQUIRED before the MCP host can run it; dist/ is gitignored)
npm test               # vitest run — 28 unit tests, mock fetch, no network/cost. live.test.ts is SKIPPED here.
GPT_IMAGE_LIVE=1 OPENAI_API_KEY=sk-... npm test   # ALSO runs the live test → real API → COSTS MONEY. Opt-in only.
```
After any `src/` change you MUST `npm run build` — the MCP host runs the compiled `dist/index.js`, not the TS.

## Hard conventions (don't break these)
- **ESM + `.js` import extensions.** Package is `"type":"module"` and run directly by Node. **Every relative import
  in `src/` and `test/` MUST end in `.js`** (e.g. `import { loadConfig } from "./config.js"`), even though the file is
  `.ts`. Omitting it builds fine but crashes at runtime. This is the #1 gotcha.
- **Minimal deps.** Runtime = `@modelcontextprotocol/sdk` + `zod` only. HTTP via Node-22 globals `fetch`/`FormData`/
  `Blob` (no axios, no node-fetch, NOT the `openai` SDK). Keep it that way.
- **tsconfig** mirrors the monorepo style (target ES2023, module ESNext, moduleResolution bundler, strict, declaration).
- **Testability seams:** `OpenAiImageClient(cfg, { fetchImpl?, sleep? })` and `make*Handler({ client, outputDir, model, now? })`
  inject `fetch`/`sleep`/`now` so unit tests are deterministic + offline. Preserve these when adding code.
- **Blob from Buffer:** wrap as `new Blob([new Uint8Array(img.bytes)], { type })` (a raw Node `Buffer` isn't a clean
  `BlobPart` for tsc).

## OpenAI gpt-image-2 contract — VERIFIED against the live API (the spec/docs were wrong in places)
- **Generations** = JSON `POST {baseUrl}/images/generations`. **Always send `model`** (endpoint default is `dall-e-2`!).
  gpt-image always returns **`b64_json`** — never send `response_format`. `background` omitted when `"auto"`.
- **Edits** = **multipart/form-data** `POST {baseUrl}/images/edits` with repeated `image[]` file parts (1–16) + optional
  `mask`. **No `Content-Type` header** (fetch sets the multipart boundary). Not JSON.
- **gpt-image-2 REJECTS `input_fidelity`** (HTTP 400) — it is NOT a no-op. Only send it to gpt-image-1/1.5
  (`modelSupportsInputFidelity()` gates this). Same story for `background:"transparent"` (gpt-image-2 = opaque/auto only,
  `modelSupportsTransparent()` gates it).
- **Edit output size:** gpt-image-2 returns a *supported* size (e.g. `1536×1024` landscape, `1024×1536` portrait) matching
  the input aspect ratio — NOT the exact input resolution. Upscale afterwards (e.g. `sharp` lanczos3) if you need the
  original dimensions. Auth: `Authorization: Bearer <key>` on every call.

## Config / secrets
- `OPENAI_API_KEY` (required), `GPT_IMAGE_OUTPUT_DIR` (default cwd), `GPT_IMAGE_MODEL` (default `gpt-image-2`),
  `OPENAI_BASE_URL`. The key lives in **`.env`** (gitignored — never commit it). `index.ts` calls `loadEnvFile(../.env)`
  before `loadConfig`, so the server loads the key from its own `.env` even when the host's `${OPENAI_API_KEY}` is empty.

## How it's wired into Claude Code (and the cache gotcha)
The gen plugin's `.mcp.json` registers this server:
```json
"gpt-image": {
  "command": "node",
  "args": ["P:/Genorah/gpt-image-mcp/dist/index.js"],
  "env": { "OPENAI_API_KEY": "${OPENAI_API_KEY}", "GPT_IMAGE_OUTPUT_DIR": "${GPT_IMAGE_OUTPUT_DIR}", "GPT_IMAGE_MODEL": "${GPT_IMAGE_MODEL:-gpt-image-2}" },
  "optional": true
}
```
⚠️ **Claude Code loads the gen plugin from its CACHE**, not the `d:\Modulo` source:
`~/.claude/plugins/cache/raphj-marketplace/gen/4.0.0/.claude-plugin/.mcp.json`. Editing the monorepo source has NO
effect on what loads — you must edit (or re-sync) the cache, then **restart Claude Code**. The cache currently has the
`gpt-image` entry (hand-edited stopgap). **Durable fix:** re-publish the gen plugin version with the gpt-image entry so a
reinstall doesn't revert it. Tools appear as `mcp__gpt-image__generate_image` / `mcp__gpt-image__edit_image` after restart.
To verify the built server independently (no host): pipe a JSON-RPC `initialize` + `tools/list` to `node dist/index.js`.

## Open follow-ups (from review + the live run)
- Retry count in `openai.ts` (`attempt < 3` ⇒ up to 4 total calls vs "3 tries" — flip to `< 2` if 3-total is intended).
- Add a `prepare`/build script so a fresh clone auto-builds `dist/` (the MCP can't start without it).
- Optional: publish to npm so `.mcp.json` can use `npx -y @scope/gpt-image-mcp@latest` instead of an absolute path.

## Git
Standalone repo, local only (no remote). Recent: `17a004c` initial, `51f887b` input_fidelity fix. Commit-message trailer:
`Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
