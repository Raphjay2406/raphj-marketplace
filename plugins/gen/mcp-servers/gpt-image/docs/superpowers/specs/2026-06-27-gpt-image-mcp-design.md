# gpt-image-mcp — Design Spec

- **Date:** 2026-06-27
- **Status:** Approved design — ready for implementation plan
- **Author:** raphj + Claude
- **Package:** `d:/Modulo/Plugins/v0-ahh-skill/packages/gpt-image-mcp/`

## 1. Summary

A small, single-purpose **Model Context Protocol (MCP) server**, written in Node/TypeScript, that
bridges the **OpenAI Images API (`gpt-image-2`)** to two MCP tools — `generate_image` and `edit_image`
— so Claude Code can generate and edit images on demand (e.g. removing a tree from a staging photo,
generating hero images for STAGEABLE). It **replaces** the existing Gemini-backed `nano-banana` MCP in
the Modulo plugin `.mcp.json` files.

The server is **stateless** (each call passes its own inputs), saves outputs **to disk**, and returns
the **saved file path(s)** plus an inline preview — never raw base64 in the conversation.

## 2. Goals & non-goals

**Goals**
- Two tools: `generate_image` (text → image) and `edit_image` (image[+mask] + prompt → image).
- Backed by `gpt-image-2`, model configurable via env.
- Robust, correct API calls (the OpenAI contract is pinned in §4).
- Clean failure modes (missing key, bad input, file-not-found, API errors, content-policy refusals).
- Fits the monorepo `packages/` layout; runnable via local `node` path in `.mcp.json`; publishable later.

**Non-goals (YAGNI — explicitly cut)**
- No stateful `continue_editing` / `get_last_image_info` (nano-banana had these; we drop them — iterative
  editing = call `edit_image` again with the previous output path).
- No DALL·E / variations / streaming / `partial_images`.
- No multi-provider abstraction (OpenAI-only; a future Gemini backend would be a separate iteration).
- No File-API upload flow / `image_url` references — we send local file **bytes** via multipart (§4.2).

## 3. Architecture

Single MCP server, stdio transport, using the official `@modelcontextprotocol/sdk`. Modules each have
one job and a clean interface (`openai.ts` knows nothing about MCP; tool handlers know nothing about HTTP):

```
packages/gpt-image-mcp/
  src/
    index.ts       # entry: create McpServer, register the 2 tools, connect StdioServerTransport
    config.ts      # load + validate env (OPENAI_API_KEY, output dir, model, defaults); fail-fast
    schemas.ts     # zod input schemas for generate_image + edit_image
    openai.ts      # Images API client: generations (JSON) + edits (multipart); auth, retries, error mapping
    files.ts       # resolve output paths, decode b64 -> file, read input image/mask bytes, sniff mime
    tools/
      generate.ts  # generate_image handler: validate -> openai.generate -> save -> result
      edit.ts      # edit_image handler:     validate -> read files -> openai.edit -> save -> result
  test/            # vitest unit tests (+ one opt-in live smoke test)
  package.json · tsconfig.json · README.md · .env.example
```

**Dependencies:** `@modelcontextprotocol/sdk`, `zod`. **HTTP via a thin hand-rolled client** over Node 22's
global `fetch` + `FormData`/`Blob` (no axios/node-fetch, and not the official `openai` SDK) — this keeps the
dependency surface minimal and gives full control over multipart encoding + error mapping. `vitest` (dev) for tests.

## 4. OpenAI Images API contract (VERIFIED 2026-06-27)

> Sources: [image-generation guide](https://developers.openai.com/api/docs/guides/image-generation),
> [generate reference](https://developers.openai.com/api/reference/resources/images/methods/generate),
> [edit reference](https://developers.openai.com/api/reference/resources/images/methods/edit),
> [gpt-image-2 model](https://developers.openai.com/api/docs/models/gpt-image-2).
> Auth on every call: `Authorization: Bearer $OPENAI_API_KEY`.

### 4.1 Generations — `POST https://api.openai.com/v1/images/generations`
- **Content-Type:** `application/json`
- **Body:**
  - `model` (string, **required for us** — endpoint default is `dall-e-2`!): `"gpt-image-2"`.
  - `prompt` (string, required; ≤32000 chars for gpt-image).
  - `n` (int, 1–10, default 1).
  - `size` (string, default `auto`): `1024x1024` · `1536x1024` · `1024x1536` · `auto` (larger allowed:
    max edge ≤3840px, multiples of 16, ratio ≤3:1, total px 655,360–8,294,400).
  - `quality` (string, default `auto`): `low` · `medium` · `high` · `auto`.
  - `background` (string): `opaque` · `auto`. ⚠️ **`transparent` is NOT supported on gpt-image-2** (only
    on gpt-image-1 / 1.5). Validate against the active model (§4.4).
  - `output_format` (string, default `png`): `png` · `jpeg` · `webp`.
  - `output_compression` (int 0–100, jpeg/webp only).
  - `moderation` (string, default `auto`): `auto` · `low`.
- **Do NOT send `response_format`** — that param is DALL·E-only; gpt-image always returns base64.
- **Response:** `{ created, data: [{ b64_json }], usage: { input_tokens, output_tokens, total_tokens }, size, quality, output_format, background }`.

### 4.2 Edits — `POST https://api.openai.com/v1/images/edits`
- **Content-Type:** `multipart/form-data` (NOT JSON).
- **Form fields:**
  - `model` (string): `"gpt-image-2"`. (The edit reference's model enum omits gpt-image-2, but the model
    page + product docs confirm it's valid for edits; keep configurable, see §4.4.)
  - `image[]` (file, required; **1–16** images): the input image **bytes** as a multipart file part, e.g.
    `image[]=@hero-after-living.png`. Multiple inputs = repeat the `image[]` part (reference images).
  - `prompt` (string, required; ≤32000 chars).
  - `mask` (file, optional): a **PNG with an alpha channel**; transparent pixels mark the region to edit.
    Must match the first image's dimensions.
  - `size` · `quality` · `background` · `output_format` · `output_compression` — same values as §4.1.
  - `input_fidelity` (string): `high` · `low`. ⚠️ **Effectively a no-op on gpt-image-2** (it is always
    high-fidelity); meaningful only if the model falls back to gpt-image-1.5. We still accept + forward it.
  - `n` (int, 1–10).
- **Response:** same shape as §4.1 (`data: [{ b64_json }]` + `usage`).

### 4.3 Output handling
- gpt-image returns base64 in `data[i].b64_json`. `files.ts` decodes and writes each to the output dir.
- Filename: when `n=1`, the caller's `output_path` is used verbatim (else auto `gpt-image-<unix-ts>.<ext>`).
  When `n>1`, `output_path` (extension stripped) is used as a **prefix** with `-0`,`-1`,… suffixes, else
  auto `gpt-image-<unix-ts>-<i>.<ext>`. `<ext>` follows `output_format` (default `png`).
- Returned to the model: a text block `{ saved: ["<abs path>", …], model, size, quality, usage }` **and**
  an MCP `image` content block (base64, capped) for inline preview.

### 4.4 Model-capability guard
`config.ts` exposes the active model (`GPT_IMAGE_MODEL`, default `gpt-image-2`). A small capability map:
- `gpt-image-2` / `gpt-image-2-2026-04-21`: `background ∈ {opaque, auto}`; `input_fidelity` ignored (always high).
- `gpt-image-1.5` / `gpt-image-1`: `background ∈ {transparent, opaque, auto}`; `input_fidelity` honored.
If a caller requests `background: transparent` on a gpt-image-2 model → return a clear validation error
(don't silently pass it and get an opaque 400 from the API).

## 5. MCP tool contracts (zod → API mapping)

### `generate_image`
| field | type / values | default | → maps to |
|-------|---------------|---------|-----------|
| `prompt` | string (req) | — | body.prompt |
| `size` | `1024x1024`\|`1536x1024`\|`1024x1536`\|`auto` | `1024x1024` | body.size |
| `quality` | `low`\|`medium`\|`high`\|`auto` | `high` | body.quality |
| `background` | `opaque`\|`auto` (+`transparent` if model supports) | `auto` | body.background |
| `output_format` | `png`\|`jpeg`\|`webp` | `png` | body.output_format |
| `n` | int 1–4 (capped < API's 10 for cost) | 1 | body.n |
| `output_path` | string (abs or rel to output dir) | auto | file write |

### `edit_image`
| field | type / values | default | → maps to |
|-------|---------------|---------|-----------|
| `image_path` | string \| string[] (req; 1–16) | — | multipart `image[]` (file bytes) |
| `prompt` | string (req) | — | form.prompt |
| `mask_path` | string (PNG w/ alpha) | — | multipart `mask` |
| `input_fidelity` | `high`\|`low` | `high` | form.input_fidelity |
| `size` | (as above) | `auto` | form.size |
| `quality` | (as above) | `high` | form.quality |
| `background` | (as above, model-guarded) | `auto` | form.background |
| `output_format` | `png`\|`jpeg`\|`webp` | `png` | form.output_format |
| `output_path` | string | auto | file write |

Defaults favor the STAGEABLE use case: high quality, high input-fidelity (keeps the room identical when
removing the tree), png.

## 6. Data flow (tree-removal example)
1. Claude calls `edit_image({ image_path: ".../hero-after-living.png", prompt: "Remove the potted tree in the middle…", input_fidelity: "high" })`.
2. `edit.ts` validates via zod (`schemas.ts`); `files.ts` reads the image bytes (and mask if given), sniffs mime.
3. `openai.ts` builds a `FormData` (`model`, `image[]`, `prompt`, `input_fidelity`, …) and POSTs to
   `/v1/images/edits` with the Bearer header.
4. On 200: decode `data[0].b64_json` → `files.ts` writes `gpt-image-<ts>.png` to the output dir.
5. Handler returns `{ saved: ["<path>"], usage, model }` + an inline preview image block.

## 7. Configuration & wiring
**Env** (`.env.example` documents all):
- `OPENAI_API_KEY` — **required**; missing → server refuses to start with a clear message.
- `GPT_IMAGE_OUTPUT_DIR` — optional, default `process.cwd()`.
- `GPT_IMAGE_MODEL` — optional, default `gpt-image-2`.
- (optional) `GPT_IMAGE_DEFAULT_SIZE`, `GPT_IMAGE_DEFAULT_QUALITY`.

**`.mcp.json`** — in both `…/v0-ahh-skill/.claude-plugin/.mcp.json` and `…/plugins/gen/.claude-plugin/.mcp.json`,
**replace** the `nano-banana` block with:
```json
"gpt-image": {
  "command": "node",
  "args": ["d:/Modulo/Plugins/v0-ahh-skill/packages/gpt-image-mcp/dist/index.js"],
  "env": {
    "OPENAI_API_KEY": "${OPENAI_API_KEY}",
    "GPT_IMAGE_OUTPUT_DIR": "${GPT_IMAGE_OUTPUT_DIR}",
    "GPT_IMAGE_MODEL": "${GPT_IMAGE_MODEL:-gpt-image-2}"
  },
  "description": "OpenAI gpt-image-2 image generation + editing (generate_image, edit_image).",
  "optional": true
}
```
(Requires a one-time `npm install && npm run build` in the package so `dist/index.js` exists.)

## 8. Error handling
- **Missing `OPENAI_API_KEY`** → fail fast at startup with an actionable message.
- **Invalid input** → zod error surfaced as an MCP tool error naming the field.
- **File not found** (`image_path`/`mask_path`) → explicit path in the error.
- **Model-capability violation** (e.g. transparent on gpt-image-2) → validation error before the API call.
- **API 4xx** → surface status + OpenAI error message; **content-policy / moderation refusals returned verbatim** so the caller can adjust the prompt.
- **API 429 / 5xx** → exponential-backoff retry (e.g. 3 tries, jittered) then fail with the last error.
- **Oversized output** → always written to disk; the inline preview block is omitted when the encoded image
  exceeds **1.5 MB** (the saved path is still returned, so nothing is lost).

## 9. Testing (vitest — already used in the monorepo)
- **Unit:** zod schema accept/reject; output-path resolution (given/auto/n>1); request builders for
  generations (JSON body) and edits (FormData fields, `image[]` repetition, mask) with a **mocked fetch**;
  API-error mapping (4xx message passthrough, 429 retry, policy refusal); model-capability guard.
- **Live smoke (opt-in):** gated behind `GPT_IMAGE_LIVE=1` + a real key (off in CI — it costs money):
  one `generate_image` and one `edit_image` (against a fixture image), asserting a file is written and is a
  valid PNG. Doubles as the STAGEABLE end-to-end check (tree removal on `hero-after-living.png`).

## 10. Integration & follow-up
- **Immediate:** wire `gpt-image` into `.mcp.json` (§7). I (Claude) can then call
  `mcp__gpt-image__edit_image` / `generate_image` directly — unblocks STAGEABLE tree removal + hero gen.
- **Follow-up sweep (separate, optional):** the Genorah agents reference
  `mcp__nano-banana__{generate_image,edit_image,continue_editing,get_last_image_info}`. To route the gen
  pipeline through the new server, update those refs to `mcp__gpt-image__{generate_image,edit_image}` and
  drop the two stateful tools. **Not required** for direct use; tracked as its own task.

## 11. Risks / open questions
- **Cost:** gpt-image-2 is paid (no free tier), tiered rate limits. Default `n=1`, quality configurable;
  the live test is opt-in. (Acceptable — user owns the key.)
- **Doc drift:** the edits reference page lags (omits gpt-image-2 in its enum; lists `input_fidelity`/
  `transparent` generically). We treat the model page + guide as authoritative and guard per §4.4. If a
  call 400s on a param, surface the message (it tells us exactly which param).
- **Windows paths in `.mcp.json`:** absolute path is machine-specific (the Approach-1 trade-off). Publishing
  to npm later (Approach 2) removes this; out of scope now.
