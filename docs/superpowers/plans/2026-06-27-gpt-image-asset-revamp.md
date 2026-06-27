# GPT-Image Asset-Layer Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dead "nano-banana" asset layer with gpt-image — a real OpenAI-backed `GptImageProvider`, a stateless `gpt-image-iterator` worker, and repointed hook/skills/docs/mirror — leaving zero nano-banana debt.

**Architecture:** asset-forge gains a `GptImageProvider` (generate + edit) modeled on the existing `FluxKontextProvider` (direct `fetch`, throws `GenorahError`), porting the verified OpenAI Images contract from the bundled MCP's `openai.ts`. The `nano-banana-iterator` worker is renamed/redesigned for gpt-image's stateless re-edit loop. One hook, seven skills, three generated artifacts, and the `plugins/gen` mirror are updated to match.

**Tech Stack:** TypeScript (ESM, `"type":"module"`), Node ≥20 globals (`fetch`/`FormData`/`Blob`), vitest, `@genorah/protocol` (`GenorahError`). Plain-markdown agents/skills. Node `.mjs` scripts for generation + mirror.

## Global Constraints

- **ESM + `.js` import extensions.** `@genorah/asset-forge` is `"type":"module"`. Every relative import in `src/` and `test/` MUST end in `.js` (e.g. `import { ... } from "./base.js"`), even though the file is `.ts`.
- **No new runtime dependencies.** The provider uses only Node builtins (`crypto`, `fs`, `path`, `os`), global `fetch`/`FormData`/`Blob`, and `@genorah/protocol`. Do not add the `openai` SDK or an HTTP library.
- **TDD for all provider code.** Write the failing test first, watch it fail, implement minimally, watch it pass, commit.
- **gpt-image-2 API contract (verbatim from the verified MCP `openai.ts`):** generations are JSON `POST {baseUrl}/images/generations` and MUST always send `model`; the API returns `b64_json` (never send `response_format`); `background` is omitted when `"auto"`. Edits are multipart `POST {baseUrl}/images/edits` with repeated `image[]` parts and NO `Content-Type` header (fetch sets the boundary). **gpt-image-2 rejects `input_fidelity` and `background:"transparent"` (HTTP 400)** — never send them for the gpt-image-2 family. Auth: `Authorization: Bearer <key>` on every call.
- **Cost estimate seed:** `cost_usd: 0.04`, `duration_ms_estimate: 15000` (gpt-image-2, ~1024² high). Estimate only.
- **image-cascade default tier order:** Flux 1.1 Pro Ultra → Flux Pro Raw → gpt-image-2 → Ideogram 3 → text-prompt-file (gpt-image-2 takes the old nano-banana slot, #3).
- **Do NOT run `scripts/scaffold-workers.mjs`.** It unconditionally `writeFileSync`-overwrites all 95 hand-authored worker `.md` files with a stub template. Edit the worker `.md` and the registry entry independently. Worker count must remain 95.
- **Mirror gap:** `sync-mirror.mjs` and `check-mirror-parity.mjs` do NOT cover `packages/`. The `plugins/gen/packages/asset-forge/` copy must be synced manually (Task 7).
- **Branch:** all work lands on `feat/gpt-image-asset-revamp`.

---

## File Structure

**Created:**
- `packages/asset-forge/src/providers/gpt-image.ts` — `GptImageProvider` (generate + edit), OpenAI Images contract.
- `packages/asset-forge/tests/gpt-image.test.ts` — vitest, fetch-stubbed, offline.
- `agents/workers/gpt-image-iterator.md` — stateless re-edit worker (replaces nano-banana-iterator).

**Modified:**
- `packages/asset-forge/src/providers/base.ts` — add `ImageEditProvider` interface.
- `packages/asset-forge/src/index.ts` — swap the provider export (line 7).
- `scripts/scaffold-workers.mjs:44` — registry entry rename (future-bootstrap fidelity only).
- `scripts/scaffold-director.mjs:83` — asset-director role string.
- `.claude-plugin/hooks/offline-mode-gate.mjs:17` — `NET_MCP` set.
- `skills/image-cascade/SKILL.md`, `skills/inpainting-workflow/SKILL.md`, `skills/brandkit-suite/SKILL.md`, `skills/offline-first-mode/SKILL.md`, `skills/og-images/SKILL.md`, `skills/recraft-vector-ai/SKILL.md`, `skills/social-asset-variants/SKILL.md` — prose repoints.
- `mcp-servers/gpt-image/CLAUDE.md:92` — remove the now-done stale TODO.

**Deleted:**
- `packages/asset-forge/src/providers/nano-banana.ts`, `packages/asset-forge/tests/nano-banana.test.ts`, `packages/asset-forge/dist/providers/nano-banana.{js,d.ts,d.ts.map}`.
- `docs/v4-knowledge-bundle/agents/nano-banana-iterator.md` (stale generated; regenerated as gpt-image-iterator).

**Regenerated (by scripts, not hand-edited):**
- `.claude-plugin/generated/agent-cards.json`, `docs/v4-agent-directory.md`, `docs/v4-knowledge-bundle/**`.

**Mirror:** every change above is duplicated into `plugins/gen/` in Task 7.

---

## Task 1: `ImageEditProvider` interface + `GptImageProvider.generate()`

**Files:**
- Modify: `packages/asset-forge/src/providers/base.ts` (append interface)
- Create: `packages/asset-forge/src/providers/gpt-image.ts`
- Test: `packages/asset-forge/tests/gpt-image.test.ts`

**Interfaces:**
- Consumes: `AssetProvider, AssetInput, AssetResult, CostEstimate` from `./base.js`; `GenorahError` from `@genorah/protocol`.
- Produces: `interface ImageEditProvider extends AssetProvider { edit(input: AssetInput, opts: { imagePaths: string[]; maskPath?: string }): Promise<AssetResult>; }`; `class GptImageProvider implements ImageEditProvider` with `constructor(opts: { apiKey: string; model?: string; baseUrl?: string; downloadDir?: string })`, `name = "gpt-image"`, `kind = "image"`, `estimateCost()`, `generate()`, and (Task 2) `edit()`.

- [ ] **Step 1: Add the `ImageEditProvider` interface to `base.ts`**

Append to `packages/asset-forge/src/providers/base.ts` (after the `AssetProvider` interface, before `DummyProvider`):

```typescript
export interface ImageEditProvider extends AssetProvider {
  edit(
    input: AssetInput,
    opts: { imagePaths: string[]; maskPath?: string }
  ): Promise<AssetResult>;
}
```

- [ ] **Step 2: Write the failing test**

Create `packages/asset-forge/tests/gpt-image.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { rmSync, mkdirSync, existsSync, readFileSync } from "fs";
import { GptImageProvider } from "../src/providers/gpt-image.js";
import { GenorahError } from "@genorah/protocol";

const TMP = "/tmp/genorah-gpt-image-test";

beforeEach(() => {
  vi.restoreAllMocks();
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
});

describe("GptImageProvider.generate", () => {
  it("always sends model, never response_format, and decodes b64_json to a PNG", async () => {
    const fakePng = Buffer.from("fake-png-bytes");
    let capturedBody: Record<string, unknown> | undefined;
    globalThis.fetch = vi.fn().mockImplementationOnce(async (_url: string, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string);
      return {
        ok: true,
        json: async () => ({ data: [{ b64_json: fakePng.toString("base64") }] }),
      } as unknown as Response;
    });

    const p = new GptImageProvider({ apiKey: "test-key", downloadDir: TMP });
    const result = await p.generate({ prompt: "hero: cosmic nebula" });

    expect(capturedBody?.model).toBe("gpt-image-2");
    expect(capturedBody?.prompt).toBe("hero: cosmic nebula");
    expect(capturedBody).not.toHaveProperty("response_format");
    expect(result.provider).toBe("gpt-image");
    expect(result.model).toBe("gpt-image-2");
    expect(result.path).toMatch(/\.png$/);
    expect(existsSync(result.path)).toBe(true);
    expect(readFileSync(result.path).equals(fakePng)).toBe(true);
  });

  it("throws GenorahError PROVIDER_UNAVAILABLE on non-200", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 429, statusText: "Too Many Requests",
    } as unknown as Response);

    const p = new GptImageProvider({ apiKey: "test-key", downloadDir: TMP });
    let caught: GenorahError | undefined;
    try {
      await p.generate({ prompt: "test" });
    } catch (e) {
      caught = e as GenorahError;
    }
    expect(caught).toBeInstanceOf(GenorahError);
    expect(caught?.structured.code).toBe("PROVIDER_UNAVAILABLE");
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd packages/asset-forge && npx vitest run tests/gpt-image.test.ts`
Expected: FAIL — cannot resolve `../src/providers/gpt-image.js` (module does not exist).

- [ ] **Step 4: Write the minimal implementation (generate only)**

Create `packages/asset-forge/src/providers/gpt-image.ts`:

```typescript
import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { GenorahError } from "@genorah/protocol";
import type { ImageEditProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";

export interface GptImageOptions {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  downloadDir?: string;
}

const PRICE = {
  cost_usd: 0.04, // gpt-image-2 ~1024² high quality — estimate; tune to observed pricing
  duration_ms_estimate: 15_000,
};

export class GptImageProvider implements ImageEditProvider {
  readonly name = "gpt-image";
  readonly kind = "image" as const;

  private model: string;
  private baseUrl: string;
  private downloadDir: string;

  constructor(private opts: GptImageOptions) {
    this.model = opts.model ?? "gpt-image-2";
    this.baseUrl = opts.baseUrl ?? "https://api.openai.com/v1";
    this.downloadDir = opts.downloadDir ?? join(tmpdir(), "genorah-gpt-image");
  }

  async estimateCost(_input: AssetInput): Promise<CostEstimate> {
    return { cost_usd: PRICE.cost_usd, duration_ms_estimate: PRICE.duration_ms_estimate };
  }

  async generate(input: AssetInput): Promise<AssetResult> {
    const start = Date.now();
    const body: Record<string, unknown> = {
      model: this.model,
      prompt: input.prompt,
      n: 1,
      size: (input.params?.size as string | undefined) ?? "1024x1024",
      quality: (input.params?.quality as string | undefined) ?? "high",
      output_format: "png",
    };
    const res = await fetch(`${this.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.opts.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return this.handleImageResponse(res, input, start);
  }

  // edit() added in Task 2.

  private async handleImageResponse(res: Response, input: AssetInput, start: number): Promise<AssetResult> {
    if (!res.ok) {
      throw new GenorahError({
        code: "PROVIDER_UNAVAILABLE",
        message: `gpt-image API error ${res.status}: ${res.statusText}`,
        recovery_hint: "retry_with_fallback",
        retry_strategy: { max_attempts: 3, backoff_ms: 1000, fallback_worker: "flux-hero-gen" },
      });
    }
    const json = (await res.json()) as { data?: Array<{ b64_json?: string }> };
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) {
      throw new GenorahError({
        code: "PROVIDER_UNAVAILABLE",
        message: "gpt-image API returned no image data",
        recovery_hint: "retry_with_fallback",
      });
    }
    const buffer = Buffer.from(b64, "base64");
    const sha256 = createHash("sha256").update(buffer).digest("hex");
    mkdirSync(this.downloadDir, { recursive: true });
    const outPath = join(this.downloadDir, `${sha256}.png`);
    writeFileSync(outPath, buffer);
    return {
      provider: "gpt-image",
      model: this.model,
      sha256,
      path: outPath,
      bytes: buffer.length,
      cost_usd: PRICE.cost_usd,
      duration_ms: Date.now() - start,
      input,
    };
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd packages/asset-forge && npx vitest run tests/gpt-image.test.ts`
Expected: PASS (2 tests in `GptImageProvider.generate`).

- [ ] **Step 6: Commit**

```bash
git add packages/asset-forge/src/providers/base.ts packages/asset-forge/src/providers/gpt-image.ts packages/asset-forge/tests/gpt-image.test.ts
git commit -m "feat(asset-forge): GptImageProvider.generate + ImageEditProvider interface

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: `GptImageProvider.edit()` (stateless multipart edit)

**Files:**
- Modify: `packages/asset-forge/src/providers/gpt-image.ts`
- Test: `packages/asset-forge/tests/gpt-image.test.ts`

**Interfaces:**
- Consumes: the `GptImageProvider` class + `handleImageResponse` from Task 1.
- Produces: `GptImageProvider.edit(input, { imagePaths, maskPath? })` → multipart edit, returns `AssetResult` with `provider: "gpt-image"`.

- [ ] **Step 1: Write the failing test**

Append a new `describe` block to `packages/asset-forge/tests/gpt-image.test.ts`:

```typescript
import { writeFileSync as writeFileSyncTest } from "fs";
import { join as joinTest } from "path";

describe("GptImageProvider.edit", () => {
  it("sends multipart image[] with no Content-Type and omits input_fidelity/background for gpt-image-2", async () => {
    const inputImg = joinTest(TMP, "src.png");
    writeFileSyncTest(inputImg, Buffer.from("input-image"));
    const fakeOut = Buffer.from("edited-png");
    let capturedInit: RequestInit | undefined;
    globalThis.fetch = vi.fn().mockImplementationOnce(async (_url: string, init?: RequestInit) => {
      capturedInit = init;
      return {
        ok: true,
        json: async () => ({ data: [{ b64_json: fakeOut.toString("base64") }] }),
      } as unknown as Response;
    });

    const p = new GptImageProvider({ apiKey: "test-key", downloadDir: TMP });
    const result = await p.edit({ prompt: "make it warmer" }, { imagePaths: [inputImg] });

    const body = capturedInit?.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("prompt")).toBe("make it warmer");
    expect(body.get("model")).toBe("gpt-image-2");
    expect(body.getAll("image[]").length).toBe(1);
    expect(body.get("input_fidelity")).toBeNull();
    expect(body.get("background")).toBeNull();
    expect((capturedInit?.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
    expect(result.provider).toBe("gpt-image");
    expect(existsSync(result.path)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/asset-forge && npx vitest run tests/gpt-image.test.ts`
Expected: FAIL — `p.edit is not a function`.

- [ ] **Step 3: Implement `edit()`**

In `packages/asset-forge/src/providers/gpt-image.ts`: update the imports line and replace the `// edit() added in Task 2.` comment with the method.

Change the `fs`/`path` imports to:

```typescript
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, basename, extname } from "path";
```

Add this module-level helper after the `PRICE` constant:

```typescript
const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function mimeForPath(p: string): string {
  return MIME_BY_EXT[extname(p).toLowerCase()] ?? "image/png";
}
```

Replace `// edit() added in Task 2.` with:

```typescript
  async edit(
    input: AssetInput,
    opts: { imagePaths: string[]; maskPath?: string }
  ): Promise<AssetResult> {
    const start = Date.now();
    const form = new FormData();
    form.set("model", this.model);
    form.set("prompt", input.prompt);
    for (const p of opts.imagePaths) {
      const bytes = readFileSync(p);
      form.append("image[]", new Blob([new Uint8Array(bytes)], { type: mimeForPath(p) }), basename(p));
    }
    if (opts.maskPath) {
      const m = readFileSync(opts.maskPath);
      form.set("mask", new Blob([new Uint8Array(m)], { type: "image/png" }), basename(opts.maskPath));
    }
    form.set("size", (input.params?.size as string | undefined) ?? "auto");
    form.set("quality", (input.params?.quality as string | undefined) ?? "high");
    form.set("output_format", "png");
    // gpt-image-2 rejects input_fidelity + background:"transparent" (HTTP 400) — omit both for this family.
    const res = await fetch(`${this.baseUrl}/images/edits`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.opts.apiKey}` }, // fetch sets the multipart boundary
      body: form,
    });
    return this.handleImageResponse(res, input, start);
  }
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/asset-forge && npx vitest run tests/gpt-image.test.ts`
Expected: PASS (3 tests total across both describe blocks).

- [ ] **Step 5: Commit**

```bash
git add packages/asset-forge/src/providers/gpt-image.ts packages/asset-forge/tests/gpt-image.test.ts
git commit -m "feat(asset-forge): GptImageProvider.edit (stateless multipart edit)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Swap exports, remove NanoBananaProvider, rebuild dist, full suite green

**Files:**
- Modify: `packages/asset-forge/src/index.ts:7`
- Delete: `packages/asset-forge/src/providers/nano-banana.ts`, `packages/asset-forge/tests/nano-banana.test.ts`, `packages/asset-forge/dist/providers/nano-banana.js`, `packages/asset-forge/dist/providers/nano-banana.d.ts`, `packages/asset-forge/dist/providers/nano-banana.d.ts.map`

- [ ] **Step 1: Swap the provider export**

In `packages/asset-forge/src/index.ts`, replace line 7:

```typescript
export * from "./providers/nano-banana.js";
```

with:

```typescript
export * from "./providers/gpt-image.js";
```

- [ ] **Step 2: Delete the nano-banana source, test, and stale dist outputs**

```bash
git rm packages/asset-forge/src/providers/nano-banana.ts packages/asset-forge/tests/nano-banana.test.ts
git rm packages/asset-forge/dist/providers/nano-banana.js packages/asset-forge/dist/providers/nano-banana.d.ts packages/asset-forge/dist/providers/nano-banana.d.ts.map
```

- [ ] **Step 3: Rebuild the committed dist**

Run: `cd packages/asset-forge && npm run build`
Expected: `tsc -p .` exits 0; `dist/providers/gpt-image.js`, `dist/providers/gpt-image.d.ts` now exist; `dist/index.js` re-exports gpt-image, not nano-banana.

- [ ] **Step 4: Run the full asset-forge suite**

Run: `cd packages/asset-forge && npm test`
Expected: PASS, all files green, no reference to a missing `nano-banana` module.

- [ ] **Step 5: Verify no nano-banana remains in the package**

Run: `rg -n "nano-banana|NanoBanana" packages/asset-forge`
Expected: no matches.

- [ ] **Step 6: Commit**

```bash
git add packages/asset-forge
git commit -m "refactor(asset-forge): remove NanoBananaProvider; export gpt-image; rebuild dist

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: `gpt-image-iterator` worker + scaffold registries

**Files:**
- Rename+rewrite: `agents/workers/nano-banana-iterator.md` → `agents/workers/gpt-image-iterator.md`
- Modify: `scripts/scaffold-workers.mjs:44`, `scripts/scaffold-director.mjs:83`

- [ ] **Step 1: Rename the worker file (preserve history)**

```bash
git mv agents/workers/nano-banana-iterator.md agents/workers/gpt-image-iterator.md
```

- [ ] **Step 2: Replace the worker file content**

Overwrite `agents/workers/gpt-image-iterator.md` with:

```markdown
---
name: gpt-image-iterator
id: genorah/gpt-image-iterator
version: 4.0.0
channel: stable
tier: worker
description: Runs iterative image editing via the gpt-image MCP (stateless re-edit loop). Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.
capabilities:
  - id: iterate-gpt-image
    input: ImageIterSpec
    output: IteratedImageAsset
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
  - mcp__gpt-image__edit_image
isolation: in-process
director: asset-director
domain: asset
---

# GPT-Image Iterator

## Role

Runs iterative image editing via the gpt-image MCP. Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.

gpt-image is **stateless** — there is no `continue_editing` session. "Iteration" is a re-edit loop: each round calls `edit_image` with the *previous round's output* as the input image, accumulating refinements.

## Input Contract

ImageIterSpec: task envelope received from asset-director (base image + reference paths + DNA target + max rounds + cost budget)

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Iterated image asset with edit chain log and final DNA alignment score
- `verdicts`: validation results from pixel-dna-extraction, lpips-similarity
- `followups`: []

## Protocol

1. Accept AssetInput payload (prompt + references + seed + params + base image).
2. Round 1: `mcp__gpt-image__edit_image({ image_path: base, prompt })` — or `GptImageProvider.edit(input, { imagePaths: [base] })` via `@genorah/asset-forge`.
3. Round N: re-call `edit_image` with the **previous round's output** as `image_path` and a refinement prompt. Each call is independent (no stateful session).
4. Stop when the DNA alignment target is met, max rounds is reached, or `cost_ratio > 0.8`.
5. Self-check validators: pixel-dna-extraction, lpips-similarity, license, provenance.
6. Return `Result<AssetResult>` with cost + duration + provider + per-round edit chain.

## Skills Invoked

- `image-cascade` (fallback chain)
- `inpainting-workflow` (masked region edits)
- `texture-provenance`
- `cost-governance`

## Followups

- `cost_ratio > 0.8` → followup `{ suggested_worker: "upscaler", reason: "finalize before further spend" }`
- `dna-compliance.pass: false` → followup `{ suggested_worker: "inpainter", reason: "lift DNA coverage" }`
```

- [ ] **Step 3: Update the scaffold-workers registry entry**

In `scripts/scaffold-workers.mjs`, replace the line-44 entry (the `nano-banana-iterator` object) with:

```javascript
  { domain: "asset", name: "gpt-image-iterator", title: "GPT-Image Iterator", isolation: "in-process", capability: "iterate-gpt-image", director: "asset-director", input: "ImageIterSpec", output: "IteratedImageAsset", role: "Runs iterative image editing via the gpt-image MCP (stateless re-edit loop). Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.", artifactDesc: "Iterated image asset with edit chain log and final DNA alignment score", validators: "pixel-dna-extraction, lpips-similarity" },
```

- [ ] **Step 4: Update the scaffold-director role string**

In `scripts/scaffold-director.mjs:83`, replace `(nano-banana, flux, rodin, meshy)` with `(gpt-image, flux, rodin, meshy)`. The full line becomes:

```javascript
    role: "Orchestrates all AI asset generation (gpt-image, flux, rodin, meshy). Enforces cost budgets, tracks provenance via preservation ledger, and validates DNA alignment before approving assets.",
```

- [ ] **Step 5: Verify the rename is complete and the count invariant holds**

Run: `rg -n "nano-banana" agents/workers scripts/scaffold-workers.mjs scripts/scaffold-director.mjs`
Expected: no matches.
Run: `node -e "console.log(require('fs').readdirSync('agents/workers').filter(f=>f.endsWith('.md')).length)"`
Expected: `95`.

- [ ] **Step 6: Commit**

```bash
git add agents/workers/gpt-image-iterator.md scripts/scaffold-workers.mjs scripts/scaffold-director.mjs
git commit -m "feat(agents): gpt-image-iterator worker (stateless re-edit) replaces nano-banana-iterator

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Offline hook + seven skills repointed

**Files:**
- Modify: `.claude-plugin/hooks/offline-mode-gate.mjs:17`
- Modify: `skills/inpainting-workflow/SKILL.md`, `skills/image-cascade/SKILL.md`, `skills/brandkit-suite/SKILL.md`, `skills/offline-first-mode/SKILL.md`, `skills/og-images/SKILL.md`, `skills/recraft-vector-ai/SKILL.md`, `skills/social-asset-variants/SKILL.md`

- [ ] **Step 1: Offline hook NET_MCP set**

In `.claude-plugin/hooks/offline-mode-gate.mjs:17`, change `"nano-banana"` to `"gpt-image"`:

```javascript
const NET_MCP = new Set(["rodin", "meshy", "flux-kontext", "recraft", "kling", "gpt-image", "stitch", "playwright"]);
```

- [ ] **Step 2: inpainting-workflow Path 2 (fix the dead `continue_editing` instruction)**

Replace lines 47–49 of `skills/inpainting-workflow/SKILL.md`:

```markdown
#### Path 2: nano-banana edit via continue_editing

nano-banana supports iterative editing. Not mask-precise but good for "change X in this image" style edits.
```

with:

```markdown
#### Path 2: gpt-image edit via edit_image

gpt-image supports iterative editing via `mcp__gpt-image__edit_image`. It is **stateless** — there is no `continue_editing`; iterate by re-calling `edit_image` with the previous output as the input image. Pass a PNG `mask_path` (transparent pixels = region to edit) for mask-precise edits, or omit it for "change X in this image" style edits.
```

- [ ] **Step 3: image-cascade — description, triggers, cascade list, table**

In `skills/image-cascade/SKILL.md`:

Line 3 — replace:
```markdown
description: Graceful-degrade image generation pipeline — Flux 1.1 Pro Ultra → Flux Pro Raw → Ideogram 3 → nano-banana → text prompt file. First available provider wins; results cached by sha256 prompt+seed+model.
```
with:
```markdown
description: Graceful-degrade image generation pipeline — Flux 1.1 Pro Ultra → Flux Pro Raw → gpt-image-2 → Ideogram 3 → text prompt file. First available provider wins; results cached by sha256 prompt+seed+model.
```

Line 5 — replace:
```markdown
triggers: image-cascade, image-generation, flux, ideogram, nano-banana, asset-forge, image-pipeline
```
with:
```markdown
triggers: image-cascade, image-generation, flux, ideogram, gpt-image, asset-forge, image-pipeline
```

Line 23 — replace:
```markdown
  3. nano-banana (Gemini 3.1 Flash Image — fast, good iteration)
```
with:
```markdown
  3. gpt-image (OpenAI gpt-image-2 — strong general model, native edit/iterate, text-in-image)
```

Line 34 — replace:
```markdown
| Stylized / iterative | nano-banana |
```
with:
```markdown
| Stylized / iterative / edit | gpt-image-2 |
```

- [ ] **Step 4: brandkit-suite — frontmatter + decision tree + integration note**

In `skills/brandkit-suite/SKILL.md`:

Line 8 — replace `mcp_optional: ["nano-banana"]` with `mcp_optional: ["gpt-image"]`.

Line 27 — replace:
```markdown
- Project lacks a locked logo asset AND nano-banana MCP absent (would require typographic wordmark-only, flag this to user first).
```
with:
```markdown
- Project lacks a locked logo asset AND gpt-image MCP absent (would require typographic wordmark-only, flag this to user first).
```

Lines 38–39 — replace:
```markdown
│   └─ no → nano-banana MCP?
│       ├─ yes → generate logo via nano-banana
```
with:
```markdown
│   └─ no → gpt-image MCP?
│       ├─ yes → generate logo via gpt-image
```

Line 143 — replace:
```markdown
- **nano-banana MCP** — optional. If available, generates logo from DNA colors + brand prompt. Graceful fallback to typographic wordmark.
```
with:
```markdown
- **gpt-image MCP** — optional. If available, generates logo from DNA colors + brand prompt. Graceful fallback to typographic wordmark.
```

- [ ] **Step 5: offline-first-mode — build-contract note + degraded-event capability**

In `skills/offline-first-mode/SKILL.md`:

Line 21 — replace:
```markdown
- When nano-banana image generation is part of the build contract — images are unavailable offline
```
with:
```markdown
- When gpt-image image generation is part of the build contract — images are unavailable offline
```

Line 65 — replace:
```typescript
    await emitOfflineDegraded({ skill: "image-prompt-generation", capability: "nano-banana-generate" });
```
with:
```typescript
    await emitOfflineDegraded({ skill: "image-prompt-generation", capability: "gpt-image-generate" });
```

- [ ] **Step 6: og-images — three prose references**

In `skills/og-images/SKILL.md`:

Line 1263 — replace `over nano-banana generation:` with `over gpt-image generation:` (full line:)
```markdown
When a project has `hero_mark.enabled`, the preset's offline 4K PNG export (from `export_formats: ["png-4k"]`) is the preferred OG image source over gpt-image generation:
```

Line 1271 — replace `over nano-banana-generated defaults.` with `over gpt-image-generated defaults.` (full line:)
```markdown
2. og-images skill detects `public/og/hero-mark-*.png` and prefers those over gpt-image-generated defaults.
```

Line 1272 — replace `composite nano-banana imagery` with `composite gpt-image imagery` (full line:)
```markdown
3. Per-page OG (blog post, product page) can still composite gpt-image imagery + the 3dsvg hero mark via Satori.
```

- [ ] **Step 7: recraft-vector-ai + social-asset-variants**

In `skills/recraft-vector-ai/SKILL.md:45`, replace:
```markdown
2. Optionally refine via nano-banana → raster → AI vectorize via vectorizer.ai library locally
```
with:
```markdown
2. Optionally refine via gpt-image → raster → AI vectorize via vectorizer.ai library locally
```

In `skills/social-asset-variants/SKILL.md:68`, replace:
```markdown
Generate via Flux/nano-banana with brand + composition prompt. Multiple crops from one master.
```
with:
```markdown
Generate via Flux/gpt-image with brand + composition prompt. Multiple crops from one master.
```

- [ ] **Step 8: Verify no nano-banana remains in the hook or skills**

Run: `rg -n "nano-banana" .claude-plugin/hooks skills`
Expected: no matches.

- [ ] **Step 9: Commit**

```bash
git add .claude-plugin/hooks/offline-mode-gate.mjs skills
git commit -m "fix(skills,hooks): repoint nano-banana -> gpt-image; fix dead continue_editing instruction

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Regenerate generated artifacts + drop stale TODO

**Files:**
- Regenerate: `.claude-plugin/generated/agent-cards.json`, `docs/v4-agent-directory.md`, `docs/v4-knowledge-bundle/**`
- Delete (if not auto-removed): `docs/v4-knowledge-bundle/agents/nano-banana-iterator.md`
- Modify: `mcp-servers/gpt-image/CLAUDE.md:92`

**Precondition:** `packages/protocol/dist/agent-card.js` must exist (it is committed). If `generate-agent-cards.mjs` errors on that import, run `cd packages/protocol && npm run build` first.

- [ ] **Step 1: Regenerate agent cards (reads `agents/workers` + `agents/directors`, full overwrite)**

Run: `node scripts/generate-agent-cards.mjs`
Expected: `wrote <N> cards` (no frontmatter validation errors). The `gpt-image-iterator` card replaces the `nano-banana-iterator` card.

- [ ] **Step 2: Regenerate the agent directory (reads the cards JSON)**

Run: `node scripts/docs/generate-agent-directory.mjs`
Expected: `wrote <N> entries`.

- [ ] **Step 3: Rebuild the knowledge bundle (reads worker `.md` files)**

Run: `node scripts/docs/build-knowledge-bundle.mjs`
Expected: completes without error; a `docs/v4-knowledge-bundle/agents/gpt-image-iterator.md` is produced.

- [ ] **Step 4: Remove the stale knowledge-bundle file if it survived regeneration**

```bash
rm -f docs/v4-knowledge-bundle/agents/nano-banana-iterator.md
```

- [ ] **Step 5: Drop the now-completed stale TODO in the gpt-image server CLAUDE.md**

In `mcp-servers/gpt-image/CLAUDE.md`, delete line 92 (the bullet):

```markdown
- The gen plugin still has ~96 files referencing `mcp__nano-banana__*` — update to `mcp__gpt-image__{generate_image,edit_image}`
  (drop the old stateful `continue_editing`/`get_last_image_info`).
```

(Remove both wrapped lines of that bullet.)

- [ ] **Step 6: Verify generated artifacts + server doc are clean**

Run: `rg -n "nano-banana" .claude-plugin/generated docs/v4-agent-directory.md docs/v4-knowledge-bundle mcp-servers/gpt-image/CLAUDE.md`
Expected: no matches.

- [ ] **Step 7: Commit**

```bash
git add .claude-plugin/generated docs/v4-agent-directory.md docs/v4-knowledge-bundle mcp-servers/gpt-image/CLAUDE.md
git commit -m "chore(generated,docs): regenerate agent cards/directory/bundle for gpt-image-iterator

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Mirror sync + parity + repo-wide verification

**Files:**
- Regenerate mirror: `plugins/gen/**` (via `sync-mirror.mjs`)
- Manual mirror: `plugins/gen/packages/asset-forge/**`

- [ ] **Step 1: Run the standard mirror sync**

Run: `node scripts/sync-mirror.mjs`
Expected: `✓ Mirror synced: <N> files → plugins/gen/`. This purges+recopies `agents, skills, scripts, .claude-plugin, docs, mcp-servers` (etc.), so the stale `plugins/gen/agents/workers/nano-banana-iterator.md` is removed and all Task 4–6 changes propagate.

- [ ] **Step 2: Manually mirror the asset-forge package (sync-mirror excludes `packages/`)**

Using the Bash tool (POSIX):

```bash
rm -rf plugins/gen/packages/asset-forge
cp -r packages/asset-forge plugins/gen/packages/asset-forge
rm -rf plugins/gen/packages/asset-forge/node_modules
```

Expected: `plugins/gen/packages/asset-forge/src/providers/gpt-image.ts` exists; `.../nano-banana.ts` and `.../dist/providers/nano-banana.*` do not.

- [ ] **Step 3: Run the parity check**

Run: `node scripts/check-mirror-parity.mjs`
Expected: `✓ Mirror parity verified across commands, agents, skills, .claude-plugin`.

- [ ] **Step 4: Repo-wide verification sweep**

Run: `rg -n "nano-banana|NanoBanana|iterate-nano-banana|continue_editing|get_last_image_info" --glob '!docs/superpowers/**'`

Expected: the ONLY remaining matches are intentional migration-narrative prose in `CLAUDE.md` / `plugins/gen/CLAUDE.md` (the "refs were already migrated to" sentence) and the `mcp-servers/gpt-image/docs/superpowers/**` design/plan history. There must be **no** matches in `packages/`, `agents/`, `skills/`, `.claude-plugin/`, `scripts/`, or `docs/v4-*`. (The `docs/superpowers/**` glob is excluded because this plan and the design spec legitimately discuss nano-banana.)

- [ ] **Step 5: Run the asset-forge suite once more against the mirror-free tree**

Run: `cd packages/asset-forge && npm test`
Expected: PASS (regression guard after all edits).

- [ ] **Step 6: Commit**

```bash
git add plugins/gen
git commit -m "chore(mirror): sync plugins/gen for gpt-image asset revamp

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**1. Spec coverage** (spec §4 workstreams A–F):
- A (GptImageProvider + ImageEditProvider + remove NanoBanana) → Tasks 1, 2, 3. ✓
- B (gpt-image-iterator stateless worker) → Task 4. ✓
- C (offline hook) → Task 5 Step 1. ✓
- D (7 skills + cascade reslot) → Task 5 Steps 2–7. ✓
- E (scaffold registry, agent-cards, docs) → Task 4 Steps 3–4 + Task 6. ✓
- F (dist rebuild, mirror, verify) → Task 3 Step 3 + Task 7. ✓
- Spec acceptance criteria → Task 3 Step 5, Task 4 Step 5, Task 5 Step 8, Task 6 Step 6, Task 7 Steps 3–4. ✓
- Spec §7 deferred defaults (cascade order, cost seed) → Global Constraints + Task 1 PRICE + Task 5 Step 3. ✓

**2. Placeholder scan:** No TBD/TODO/"handle errors"/"similar to". Every code and prose step shows full content. ✓

**3. Type consistency:** `ImageEditProvider.edit(input, { imagePaths, maskPath? })` defined in Task 1 and implemented with the identical signature in Task 2. `GptImageOptions` fields (`apiKey/model/baseUrl/downloadDir`) consistent across constructor and tests. `result.provider === "gpt-image"`, `result.model === "gpt-image-2"` asserted in tests and produced in `handleImageResponse`. `GenorahError(...).structured.code` matches the peer `flux-kontext.test.ts` contract. ✓

---

## Execution Handoff

After review, recommended path: **Subagent-Driven** (fresh subagent per task, review between tasks) — Tasks 1→2→3 are tight TDD cycles ideal for that loop; Tasks 4–7 are mechanical and verifiable by the embedded `rg` gates.
