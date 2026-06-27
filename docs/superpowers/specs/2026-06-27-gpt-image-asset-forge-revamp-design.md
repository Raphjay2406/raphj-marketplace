# Design: nano-banana → gpt-image revamp (asset layer)

- **Date:** 2026-06-27
- **Status:** Approved (design); pending spec review
- **Author:** Claude (Opus 4.8) + Raphael
- **Topic:** Align the remaining "nano-banana" asset-generation layer with the bundled `gpt-image` MCP server.

## 1. Context

The MCP **tool-reference** migration (`mcp__nano-banana__*` → `mcp__gpt-image__{generate_image,edit_image}`)
is already complete (commit `baa6a43`) and the gpt-image server is bundled in-repo (commit `416d9f1`). Every
remaining `mcp__nano-banana__` string is prose in docs describing the migration.

A **second layer** was never migrated. It does not call the MCP tools directly; it is the programmatic /
agent-facing asset machinery that still names and routes to nano-banana:

1. **asset-forge package** ships a `NanoBananaProvider` that calls a dead MCP and has no `GptImageProvider`.
2. **`nano-banana-iterator` worker** is built on gpt-image's now-removed *stateful* editing
   (`continue_editing`). gpt-image is **stateless**.
3. **`offline-mode-gate` hook** blocks `"nano-banana"` in its network-MCP set, not `"gpt-image"`.
4. **Seven skills** (`image-cascade`, `brandkit-suite`, `inpainting-workflow`, `og-images`,
   `offline-first-mode`, `recraft-vector-ai`, `social-asset-variants`) still route to nano-banana —
   `inpainting-workflow` instructs the removed `continue_editing` tool.
5. **Scaffold registry + generated agent-cards** reference it.
6. Everything is duplicated in the `plugins/gen/` mirror.

### Reality checks that shape this design

- **The asset-forge provider classes are not constructed by any runtime code.** They are exercised only by
  their own vitest tests; skills import `CostLedger`/`AssetCache` from the package, never the providers.
  Live image generation in the pipeline runs through the **MCP tools** at the agent layer. So the dead
  provider is latent SDK debt, not a running failure. The only *hard-running* breakage is the offline hook.
- **Peer providers call their HTTP API directly via `fetch`** (`flux-kontext.ts`, `recraft.ts`). Only
  nano-banana had an optional, never-wired `mcpClient` seam, so it always wrote a `.prompt.txt` and never
  generated. The new provider follows the peer pattern.
- **`scripts/scaffold-workers.mjs` unconditionally overwrites all 95 worker `.md` files** with a generic
  stub template (`writeFileSync`, no skip-if-exists). The committed worker `.md` files were hand-enriched
  after bootstrap. **Therefore the scaffold must NOT be re-run** — the hand-authored `.md` is the source of
  truth. The registry entry is updated for future-bootstrap correctness only.
- **`packages/asset-forge/dist/` is committed** (tsc output). Source changes require `npm run build`.
- **The mirror is mechanical:** `scripts/sync-mirror.mjs` propagates root → `plugins/gen/`;
  `scripts/check-mirror-parity.mjs` verifies.

## 2. Goals / Non-goals

**Goals**
- A real, OpenAI-backed `GptImageProvider` in asset-forge (generate + edit), replacing `NanoBananaProvider`.
- A `gpt-image-iterator` worker whose iteration model is **stateless** (re-edit loop), replacing
  `nano-banana-iterator`.
- Offline hook, seven skills, scaffold registry, generated agent-cards, and docs all repointed to gpt-image,
  with the dead `continue_editing` instruction corrected.
- Root and mirror in parity; asset-forge `dist/` rebuilt; full test suite green.
- After completion, `grep -ri "nano-banana"` returns only intentional historical / migration-narrative hits.

**Non-goals**
- No change to the gpt-image MCP server itself (`mcp-servers/gpt-image/`) — its contract is the source of truth.
- No re-architecture of the asset-director ↔ worker wiring beyond the iterator rename/redesign.
- No promotion of the asset-forge providers into a runtime-wired pipeline (they remain SDK surface).
- No back-compat alias for `NanoBananaProvider` (package is internal/unpublished).

## 3. Key decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | **Comprehensive** revamp (zero nano-banana debt) | User-selected scope. |
| D2 | **Dedicated** `gpt-image-iterator` (not merged into `inpainter`) | Keeps whole-image DNA refinement distinct from masked fixes; lowest behavior-change risk. User-selected. |
| D3 | `GptImageProvider` calls the **OpenAI Images API directly via `fetch`** | Matches peer providers; the bundled MCP is a stdio process, not a clean library import. |
| D4 | **Remove** `NanoBananaProvider` (no alias) | Package is internal/unpublished; dead MCP path. |
| D5 | **No prompt-file fallback in the provider** | Degradation belongs to the cascade / offline layer, consistent with flux/recraft (which throw `GenorahError`). |
| D6 | **Do not re-run `scaffold-workers.mjs`**; hand-edit the `.md` + registry both | Scaffold clobbers hand-authored content. |
| D7 | Add a small optional `ImageEditProvider { edit(...) }` interface in `base.ts` | Lets the iterator type against edit-capable providers without forcing every provider to implement `edit`. |

## 4. Architecture — six workstreams

### A. asset-forge `GptImageProvider`

New file `packages/asset-forge/src/providers/gpt-image.ts`, modeled on `flux-kontext.ts`. Ports the
**verified** OpenAI contract from `mcp-servers/gpt-image/src/openai.ts` (the canonical source):

- `name = "gpt-image"`, `kind = "image"`.
- Constructor: `GptImageProvider({ apiKey, model?, baseUrl?, downloadDir? })`, `model` default `"gpt-image-2"`,
  `baseUrl` default `"https://api.openai.com/v1"`.
- **`generate(input)`** → JSON `POST {baseUrl}/images/generations`. Always sends `model`. Body: `prompt`,
  `size` (default `1024x1024`), `quality` (default `high`), `n: 1`; never sends `response_format`; omits
  `background` when `auto`. Response is `b64_json` → decode → write `<sha256>.png` → `AssetResult`.
- **`edit(input, { imagePaths, maskPath? })`** → multipart `POST {baseUrl}/images/edits` with repeated
  `image[]` parts (1–16) + optional `mask`. **No `Content-Type` header** (fetch sets the boundary). Gates out
  `input_fidelity` and `background:"transparent"` for gpt-image-2 (the API 400s on both). `Blob` from buffer
  as `new Blob([new Uint8Array(buf)], { type })`.
- Auth: `Authorization: Bearer <apiKey>` on every call.
- Errors throw `GenorahError({ code: "PROVIDER_UNAVAILABLE", recovery_hint: "retry_with_fallback",
  retry_strategy: { max_attempts: 3, backoff_ms: 1000, fallback_worker: "flux-hero-gen" } })`.
- `estimateCost` → `PRICE` constant. **Seed: `cost_usd: 0.04`, `duration_ms_estimate: 15000`**
  (gpt-image-2, ~1024² high quality). Flagged tunable — see §7.
- `base.ts`: add `export interface ImageEditProvider extends AssetProvider { edit(input: AssetInput, opts:
  { imagePaths: string[]; maskPath?: string }): Promise<AssetResult>; }` (additive, optional to implement).
- `index.ts`: remove the `nano-banana.js` export (line 7), add `gpt-image.js`.
- **Delete** `src/providers/nano-banana.ts`.

### B. `gpt-image-iterator` worker

- **Rename** `agents/workers/nano-banana-iterator.md` → `agents/workers/gpt-image-iterator.md`.
  - Frontmatter: `name: gpt-image-iterator`, `id: genorah/gpt-image-iterator`,
    capability `id: iterate-gpt-image`, description updated. **Add `- mcp__gpt-image__edit_image`** to the
    `tools:` YAML list (keep existing list style).
  - **Protocol = stateless loop:** round 1 `edit_image(base, prompt)`; round N `edit_image(previousOutput,
    refinementPrompt)` — each call independent (no `continue_editing` / `get_last_image_info`). Cost-capped:
    `cost_ratio > 0.8` → followup to `upscaler` ("finalize before further spend"). Implementation path:
    `GptImageProvider.edit()` via `@genorah/asset-forge` OR the `mcp__gpt-image__edit_image` tool.
  - Followups: `cost_ratio > 0.8` → `upscaler`; `dna-compliance.pass: false` → `inpainter`. (unchanged intent)
- **Registry** `scripts/scaffold-workers.mjs` line 44: update the entry to
  `{ name: "gpt-image-iterator", title: "GPT-Image Iterator", capability: "iterate-gpt-image",
  role: "Runs iterative image editing via the gpt-image MCP (stateless re-edit loop). Applies DNA color
  corrections, style transfers, and beat-specific atmosphere adjustments.", … }`. Worker count stays 95.
  **Do not run the script** (clobbers hand-authored workers) — registry edit is for future-bootstrap fidelity.

### C. offline hook

`.claude-plugin/hooks/offline-mode-gate.mjs` line 17: in the `NET_MCP` set, replace `"nano-banana"` with
`"gpt-image"`.

### D. skills (7) + cascade

| Skill | Change |
|-------|--------|
| `inpainting-workflow` | Rewrite "Path 2: nano-banana edit via `continue_editing`" → "gpt-image edit via `edit_image`" (stateless; re-call with previous output; mask via `mask_path`). **Fixes the dead-tool instruction.** |
| `image-cascade` | Replace the nano-banana tier with **gpt-image-2** ("strong general model + native edit/iterate + text-in-image"); update `description` + `triggers`. Default tier order: Flux 1.1 Pro Ultra → Flux Pro Raw → **gpt-image-2** → Ideogram 3 → text-prompt-file. (Ordering flagged for review — §7.) |
| `brandkit-suite` | `mcp_optional: ["nano-banana"]` → `["gpt-image"]`; logo-gen decision tree + routing prose. |
| `og-images` | nano-banana generation references → gpt-image. |
| `offline-first-mode` | Build-contract note + `capability: "nano-banana-generate"` → `"gpt-image-generate"`. |
| `recraft-vector-ai` | "refine via nano-banana" → "refine via gpt-image". |
| `social-asset-variants` | "Generate via Flux/nano-banana" → "Generate via Flux/gpt-image". |

### E. scaffold registry, generated artifacts, docs

- `scripts/scaffold-director.mjs` line 83: asset-director role string `nano-banana` → `gpt-image`.
- `.claude-plugin/generated/agent-cards.json`: replace the `nano-banana-iterator` card with
  `gpt-image-iterator` (hand-edit to match the renamed worker).
- Docs: `docs/v4-agent-directory.md`, `docs/v4-knowledge-bundle/agents/index.md`; rename
  `docs/v4-knowledge-bundle/agents/nano-banana-iterator.md` → `gpt-image-iterator.md`. Remove the
  now-completed stale TODO at `mcp-servers/gpt-image/CLAUDE.md:92`. Migration-narrative mentions in root
  `CLAUDE.md` stay (they are history).

### F. build, mirror, verify

1. `cd packages/asset-forge && npm install` (if needed) `&& npm run build` — refresh committed `dist/`
   (removes `dist/providers/nano-banana.*`, adds `gpt-image.*`).
2. `node scripts/sync-mirror.mjs` — propagate root → `plugins/gen/`.
3. `node scripts/check-mirror-parity.mjs` — confirm parity.
4. Final sweep: `grep -ri "nano-banana"` → only intentional historical hits remain.

## 5. Testing strategy

- New `packages/asset-forge/tests/gpt-image.test.ts`, modeled on `flux-kontext.test.ts`: **inject `fetch`**
  (deterministic, offline, zero cost). Cover:
  - `generate` happy path: mock `b64_json` → file written, correct `provider`/`sha256`/`bytes`.
  - `edit` happy path: multipart request shape (repeated `image[]`, no `Content-Type`), output written.
  - error path: non-OK response → `GenorahError` with `PROVIDER_UNAVAILABLE`.
  - gpt-image-2 gating: `input_fidelity` / `background:transparent` not sent.
- **Delete** `tests/nano-banana.test.ts`.
- **TDD** for the provider: write `gpt-image.test.ts` first, then implement to green.
- Whole `@genorah/asset-forge` vitest suite (`npm test`) must stay green.

## 6. Acceptance criteria

- [ ] `GptImageProvider` exists, exported, generate+edit implemented per the verified contract.
- [ ] `NanoBananaProvider` and `nano-banana.test.ts` removed; `gpt-image.test.ts` passes.
- [ ] `npm run build` succeeds; committed `dist/` reflects the swap.
- [ ] `gpt-image-iterator.md` exists with stateless-loop protocol + `mcp__gpt-image__edit_image` tool;
      `nano-banana-iterator.md` gone.
- [ ] Offline hook gates `gpt-image`.
- [ ] All 7 skills repointed; `inpainting-workflow` no longer references `continue_editing`.
- [ ] Scaffold registry + agent-cards + docs updated; scaffold NOT re-run.
- [ ] Mirror parity check passes.
- [ ] `grep -ri "nano-banana"` returns only intentional historical/migration-narrative hits.

## 7. Decisions deferred to spec review

1. **image-cascade tier ordering.** Default: Flux 1.1 Pro Ultra → Flux Pro Raw → gpt-image-2 → Ideogram 3 →
   text-prompt-file (gpt-image-2 takes the nano-banana slot). Alternative: promote gpt-image-2 above Flux Raw.
2. **gpt-image-2 cost estimate constant.** Default seed `0.04 USD` / `15000 ms`. Tune to observed pricing.

## 8. Out-of-scope follow-ups (noted, not done here)

- `openai.ts` retry-count semantics in the MCP server (`attempt < 3` ⇒ 4 total) — tracked in the server's
  own CLAUDE.md, unrelated to this revamp.
- Wiring asset-forge providers into a live runtime path — future work if/when the SDK is actually consumed.
