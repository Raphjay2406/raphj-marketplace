# gpt-image-mcp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Node/TS MCP server (`@genorah/gpt-image-mcp`) exposing `generate_image` + `edit_image` backed by OpenAI `gpt-image-2`, replacing the Gemini `nano-banana` MCP.

**Architecture:** A small stdio MCP server using `@modelcontextprotocol/sdk`. Pure modules (`config`, `schemas`, `files`, `openai`) with one responsibility each and a thin hand-rolled `fetch` client for the OpenAI Images API; tool handlers wire them together and return saved file paths (+ a capped inline preview). Stateless — every call carries its own inputs.

**Tech Stack:** Node 22 (ESM), TypeScript 5.6, `@modelcontextprotocol/sdk`, `zod`, vitest. Built with `tsc`, run as `node dist/index.js`.

## Global Constraints

- **Repo / branch:** `d:/Modulo/Plugins/v0-ahh-skill`, branch `feat/gpt-image-mcp` (already created, spec committed). Package dir: `packages/gpt-image-mcp/`.
- **Spec:** `docs/superpowers/specs/2026-06-27-gpt-image-mcp-design.md` — authoritative for the API contract.
- **ESM + `.js` import extensions:** package is `"type": "module"` and run by Node directly. **Every relative import in `src/` MUST use a `.js` extension** (e.g. `import { loadConfig } from "./config.js"`), even though the source file is `.ts`. This is required for Node ESM resolution at runtime.
- **No new heavy deps:** runtime deps are exactly `@modelcontextprotocol/sdk` + `zod`. HTTP uses Node 22 globals `fetch`/`FormData`/`Blob` (no axios/node-fetch, not the `openai` SDK).
- **OpenAI contract (verbatim from spec §4):** generations = JSON `POST {baseUrl}/images/generations`, **must send `model`**; edits = `multipart/form-data` `POST {baseUrl}/images/edits` with `image[]` file parts + optional `mask`. gpt-image returns `data[i].b64_json` (never send `response_format`). `background:"transparent"` is invalid for any `gpt-image-2*` model. Auth header `Authorization: Bearer <key>` on every call.
- **Defaults (product, may differ from API defaults):** quality `high`, generate size `1024x1024`, edit size `auto`, `input_fidelity` `high`, `output_format` `png`, `n` default 1 capped at 4.
- **MCP SDK API:** uses the high-level `McpServer` + `server.registerTool(name, config, handler)` (SDK ≥ 1.10). Task 6 includes a verification step; if the installed SDK only exposes `server.tool(name, shape, handler)`, adapt the registration call accordingly (handler + shapes are unchanged).
- **Commit style:** small commits per task; messages end with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

## File Structure

```
packages/gpt-image-mcp/
  package.json            # @genorah/gpt-image-mcp, type:module, build+test scripts, bin
  tsconfig.json           # mirrors asset-forge (ES2023/ESNext/bundler, outDir dist)
  .env.example            # documents env vars
  README.md               # usage + .mcp.json snippet
  src/
    config.ts             # loadConfig(env) -> Config; modelSupportsTransparent(model)
    schemas.ts            # zod raw shapes generateShape/editShape; arg types
    files.ts              # resolveOutputPaths, writeBase64, readImageFile, sniffMime
    openai.ts             # OpenAiImageClient.generate/edit; OpenAiImageError; param/result types
    result.ts             # successContent/errorContent/formatError -> MCP content blocks
    tools/
      generate.ts         # makeGenerateHandler(deps)
      edit.ts             # makeEditHandler(deps)
    index.ts              # loadConfig -> client -> McpServer.registerTool x2 -> stdio connect
  test/
    config.test.ts
    schemas.test.ts
    files.test.ts
    openai.test.ts
    tools.test.ts
    live.test.ts          # opt-in (GPT_IMAGE_LIVE=1) — real API
```

---

### Task 1: Package scaffold + `config.ts`

**Files:**
- Create: `packages/gpt-image-mcp/package.json`
- Create: `packages/gpt-image-mcp/tsconfig.json`
- Create: `packages/gpt-image-mcp/src/config.ts`
- Test: `packages/gpt-image-mcp/test/config.test.ts`

**Interfaces:**
- Produces: `loadConfig(env?: NodeJS.ProcessEnv): Config` where `Config = { apiKey: string; outputDir: string; model: string; baseUrl: string }`; `modelSupportsTransparent(model: string): boolean`; and `loadEnvFile(filePath: string, env?: NodeJS.ProcessEnv): void` (zero-dep `.env` parser that merges file vars into `env` WITHOUT overriding values already set; missing file = no-op).

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "@genorah/gpt-image-mcp",
  "version": "4.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "bin": { "gpt-image-mcp": "./dist/index.js" },
  "scripts": {
    "build": "tsc -p .",
    "test": "vitest run"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "typescript": "^5.6.2",
    "vitest": "^2.1.4",
    "@types/node": "^24.0.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`** (mirrors `packages/asset-forge/tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Install deps**

Run (from repo root, workspaces-aware): `npm install -w @genorah/gpt-image-mcp`
Expected: adds `@modelcontextprotocol/sdk`, `zod`, dev deps; creates `node_modules` symlink for the workspace.

- [ ] **Step 4: Write the failing test** — `test/config.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { loadConfig, modelSupportsTransparent } from "../src/config.js";

describe("loadConfig", () => {
  it("throws a clear error when OPENAI_API_KEY is missing", () => {
    expect(() => loadConfig({})).toThrow(/OPENAI_API_KEY/);
  });

  it("returns defaults when only the key is set", () => {
    const cfg = loadConfig({ OPENAI_API_KEY: "sk-test" });
    expect(cfg.apiKey).toBe("sk-test");
    expect(cfg.model).toBe("gpt-image-2");
    expect(cfg.baseUrl).toBe("https://api.openai.com/v1");
    expect(typeof cfg.outputDir).toBe("string");
  });

  it("honors overrides", () => {
    const cfg = loadConfig({ OPENAI_API_KEY: "k", GPT_IMAGE_MODEL: "gpt-image-1.5", GPT_IMAGE_OUTPUT_DIR: "/tmp/x" });
    expect(cfg.model).toBe("gpt-image-1.5");
    expect(cfg.outputDir).toBe("/tmp/x");
  });
});

describe("modelSupportsTransparent", () => {
  it("is false for gpt-image-2 family", () => {
    expect(modelSupportsTransparent("gpt-image-2")).toBe(false);
    expect(modelSupportsTransparent("gpt-image-2-2026-04-21")).toBe(false);
  });
  it("is true for gpt-image-1 / 1.5", () => {
    expect(modelSupportsTransparent("gpt-image-1")).toBe(true);
    expect(modelSupportsTransparent("gpt-image-1.5")).toBe(true);
  });
});
```

- [ ] **Step 5: Run test, verify it fails**

Run: `npm test -w @genorah/gpt-image-mcp`
Expected: FAIL — cannot resolve `../src/config.js` (module not found).

- [ ] **Step 6: Implement `src/config.ts`**

```ts
export interface Config {
  apiKey: string;
  outputDir: string;
  model: string;
  baseUrl: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is required. Set it in the MCP server env (see .env.example)."
    );
  }
  return {
    apiKey,
    outputDir: env.GPT_IMAGE_OUTPUT_DIR?.trim() || process.cwd(),
    model: env.GPT_IMAGE_MODEL?.trim() || "gpt-image-2",
    baseUrl: env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1",
  };
}

/** Only the gpt-image-2 family lacks transparent-background support. */
export function modelSupportsTransparent(model: string): boolean {
  return !model.startsWith("gpt-image-2");
}

import { readFileSync } from "node:fs";

/**
 * Zero-dependency .env loader. Parses simple KEY=VALUE lines from `filePath` and merges them into
 * `env`, but NEVER overrides a value already present (real shell env wins). Missing file = no-op.
 * Lines starting with `#`, and blank lines, are ignored; surrounding quotes are stripped.
 */
export function loadEnvFile(filePath: string, env: NodeJS.ProcessEnv = process.env): void {
  let text: string;
  try {
    text = readFileSync(filePath, "utf8");
  } catch {
    return; // no .env present — rely on the real environment
  }
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!m) continue; // skips blanks and `#` comments
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (env[key] === undefined || env[key] === "") env[key] = val;
  }
}
```

- [ ] **Step 6b: Append `loadEnvFile` tests to `test/config.test.ts`**

```ts
import { promises as fsp } from "node:fs";
import * as osm from "node:os";
import * as pathm from "node:path";
import { loadEnvFile } from "../src/config.js";

describe("loadEnvFile", () => {
  it("merges file vars without overriding existing env", async () => {
    const dir = await fsp.mkdtemp(pathm.join(osm.tmpdir(), "envf-"));
    const f = pathm.join(dir, ".env");
    await fsp.writeFile(f, "# comment\nOPENAI_API_KEY=sk-file\nGPT_IMAGE_MODEL=\"gpt-image-1.5\"\n");
    const env: NodeJS.ProcessEnv = { GPT_IMAGE_MODEL: "gpt-image-2" }; // already set -> wins
    loadEnvFile(f, env);
    expect(env.OPENAI_API_KEY).toBe("sk-file");
    expect(env.GPT_IMAGE_MODEL).toBe("gpt-image-2");
  });
  it("is a no-op for a missing file", () => {
    const env: NodeJS.ProcessEnv = {};
    expect(() => loadEnvFile("/no/such/.env", env)).not.toThrow();
    expect(env.OPENAI_API_KEY).toBeUndefined();
  });
});
```

- [ ] **Step 7: Run test, verify it passes**

Run: `npm test -w @genorah/gpt-image-mcp`
Expected: PASS (3 + 2 assertions).

- [ ] **Step 8: Commit**

```bash
git add packages/gpt-image-mcp/package.json packages/gpt-image-mcp/tsconfig.json packages/gpt-image-mcp/src/config.ts packages/gpt-image-mcp/test/config.test.ts
git commit -m "feat(gpt-image-mcp): scaffold package + config loader

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: `schemas.ts` (zod input shapes)

**Files:**
- Create: `packages/gpt-image-mcp/src/schemas.ts`
- Test: `packages/gpt-image-mcp/test/schemas.test.ts`

**Interfaces:**
- Produces: `generateShape` and `editShape` (zod raw shapes — objects of zod validators, for `registerTool`); inferred types `GenerateArgs` and `EditArgs`. Enums: size `1024x1024|1536x1024|1024x1536|auto`, quality `low|medium|high|auto`, background `transparent|opaque|auto`, output_format `png|jpeg|webp`.

- [ ] **Step 1: Write the failing test** — `test/schemas.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { z } from "zod";
import { generateShape, editShape } from "../src/schemas.js";

const gen = z.object(generateShape);
const edit = z.object(editShape);

describe("generateShape", () => {
  it("applies defaults", () => {
    const v = gen.parse({ prompt: "a cat" });
    expect(v).toMatchObject({ size: "1024x1024", quality: "high", background: "auto", output_format: "png", n: 1 });
  });
  it("rejects empty prompt and bad size", () => {
    expect(() => gen.parse({ prompt: "" })).toThrow();
    expect(() => gen.parse({ prompt: "x", size: "999x999" })).toThrow();
  });
  it("caps n at 4", () => {
    expect(() => gen.parse({ prompt: "x", n: 5 })).toThrow();
  });
});

describe("editShape", () => {
  it("accepts a single path or an array, with defaults", () => {
    expect(edit.parse({ image_path: "a.png", prompt: "edit" })).toMatchObject({ input_fidelity: "high", size: "auto", quality: "high" });
    expect(edit.parse({ image_path: ["a.png", "b.png"], prompt: "edit" }).image_path).toHaveLength(2);
  });
  it("rejects missing prompt", () => {
    expect(() => edit.parse({ image_path: "a.png" })).toThrow();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -w @genorah/gpt-image-mcp`
Expected: FAIL — cannot resolve `../src/schemas.js`.

- [ ] **Step 3: Implement `src/schemas.ts`**

```ts
import { z } from "zod";

const SIZE = z.enum(["1024x1024", "1536x1024", "1024x1536", "auto"]);
const QUALITY = z.enum(["low", "medium", "high", "auto"]);
const BACKGROUND = z.enum(["transparent", "opaque", "auto"]);
const OUTPUT_FORMAT = z.enum(["png", "jpeg", "webp"]);

export const generateShape = {
  prompt: z.string().min(1).max(32000).describe("Text description of the image to generate."),
  size: SIZE.default("1024x1024"),
  quality: QUALITY.default("high"),
  background: BACKGROUND.default("auto").describe('"transparent" requires a gpt-image-1/1.5 model.'),
  output_format: OUTPUT_FORMAT.default("png"),
  n: z.number().int().min(1).max(4).default(1),
  output_path: z.string().optional().describe("Where to save (abs or relative to output dir). Auto-named if omitted."),
};

export const editShape = {
  image_path: z.union([z.string(), z.array(z.string()).min(1).max(16)]).describe("Input image path(s); extra images act as references."),
  prompt: z.string().min(1).max(32000).describe("What to change."),
  mask_path: z.string().optional().describe("PNG mask: transparent pixels mark the region to edit."),
  input_fidelity: z.enum(["high", "low"]).default("high").describe("Keep input detail (no-op on gpt-image-2 — always high)."),
  size: SIZE.default("auto"),
  quality: QUALITY.default("high"),
  background: BACKGROUND.default("auto"),
  output_format: OUTPUT_FORMAT.default("png"),
  output_path: z.string().optional(),
};

export type GenerateArgs = z.infer<z.ZodObject<typeof generateShape>>;
export type EditArgs = z.infer<z.ZodObject<typeof editShape>>;
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -w @genorah/gpt-image-mcp`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/gpt-image-mcp/src/schemas.ts packages/gpt-image-mcp/test/schemas.test.ts
git commit -m "feat(gpt-image-mcp): zod input schemas for both tools

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `files.ts` (paths, base64 write, image read)

**Files:**
- Create: `packages/gpt-image-mcp/src/files.ts`
- Test: `packages/gpt-image-mcp/test/files.test.ts`

**Interfaces:**
- Produces:
  - `type ImageFile = { bytes: Buffer; mime: string; name: string }`
  - `resolveOutputPaths(opts: { outputDir: string; outputPath?: string; outputFormat: string; count: number; ts: number }): string[]`
  - `writeBase64(filePath: string, b64: string): Promise<void>`
  - `readImageFile(filePath: string): Promise<ImageFile>`
  - `sniffMime(bytes: Buffer, filePath: string): string`

- [ ] **Step 1: Write the failing test** — `test/files.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { resolveOutputPaths, writeBase64, readImageFile, sniffMime } from "../src/files.js";

const PNG_1x1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

describe("resolveOutputPaths", () => {
  it("uses output_path verbatim for n=1", () => {
    expect(resolveOutputPaths({ outputDir: "/out", outputPath: "/abs/pic.png", outputFormat: "png", count: 1, ts: 5 }))
      .toEqual(["/abs/pic.png"]);
  });
  it("auto-names for n=1 when no path", () => {
    expect(resolveOutputPaths({ outputDir: "/out", outputFormat: "png", count: 1, ts: 5 }))
      .toEqual([path.resolve("/out", "gpt-image-5.png")]);
  });
  it("uses prefix + index for n>1", () => {
    const r = resolveOutputPaths({ outputDir: "/out", outputPath: "/abs/pic.png", outputFormat: "jpeg", count: 2, ts: 5 });
    expect(r).toEqual(["/abs/pic-0.jpg", "/abs/pic-1.jpg"]);
  });
});

describe("sniffMime", () => {
  it("detects png from magic bytes", () => {
    expect(sniffMime(Buffer.from(PNG_1x1, "base64"), "x.bin")).toBe("image/png");
  });
});

describe("writeBase64 + readImageFile", () => {
  it("round-trips a png to disk", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gpt-image-"));
    const p = path.join(dir, "a.png");
    await writeBase64(p, PNG_1x1);
    const f = await readImageFile(p);
    expect(f.mime).toBe("image/png");
    expect(f.name).toBe("a.png");
    expect(f.bytes.length).toBeGreaterThan(0);
  });
  it("throws a clear error for a missing file", async () => {
    await expect(readImageFile("/no/such/file.png")).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -w @genorah/gpt-image-mcp`
Expected: FAIL — cannot resolve `../src/files.js`.

- [ ] **Step 3: Implement `src/files.ts`**

```ts
import { promises as fs } from "node:fs";
import * as path from "node:path";

export type ImageFile = { bytes: Buffer; mime: string; name: string };

const EXT: Record<string, string> = { png: "png", jpeg: "jpg", webp: "webp" };

export function resolveOutputPaths(opts: {
  outputDir: string;
  outputPath?: string;
  outputFormat: string;
  count: number;
  ts: number;
}): string[] {
  const ext = EXT[opts.outputFormat] ?? "png";
  const abs = (p: string) => (path.isAbsolute(p) ? p : path.resolve(opts.outputDir, p));
  if (opts.count === 1) {
    return [abs(opts.outputPath ?? path.join(opts.outputDir, `gpt-image-${opts.ts}.${ext}`))];
  }
  const base = opts.outputPath
    ? opts.outputPath.replace(/\.[^.]+$/, "")
    : path.join(opts.outputDir, `gpt-image-${opts.ts}`);
  return Array.from({ length: opts.count }, (_, i) => abs(`${base}-${i}.${ext}`));
}

export async function writeBase64(filePath: string, b64: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, Buffer.from(b64, "base64"));
}

export async function readImageFile(filePath: string): Promise<ImageFile> {
  const bytes = await fs.readFile(filePath); // throws ENOENT with the path if missing
  return { bytes, mime: sniffMime(bytes, filePath), name: path.basename(filePath) };
}

export function sniffMime(bytes: Buffer, filePath: string): string {
  if (bytes.length >= 2 && bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/png";
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -w @genorah/gpt-image-mcp`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/gpt-image-mcp/src/files.ts packages/gpt-image-mcp/test/files.test.ts
git commit -m "feat(gpt-image-mcp): file IO — output paths, base64 write, image read

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: `openai.ts` (Images API client)

**Files:**
- Create: `packages/gpt-image-mcp/src/openai.ts`
- Test: `packages/gpt-image-mcp/test/openai.test.ts`

**Interfaces:**
- Consumes: `ImageFile` from `files.ts`.
- Produces:
  - `type ImageResult = { images: string[]; usage?: unknown }` (`images` = array of base64 strings)
  - `type GenerateParams = { prompt: string; size: string; quality: string; background: string; output_format: string; n: number }`
  - `type EditParams = { images: ImageFile[]; mask?: ImageFile; prompt: string; size: string; quality: string; background: string; output_format: string; input_fidelity: string }`
  - `class OpenAiImageError extends Error { status: number; isPolicy: boolean }`
  - `class OpenAiImageClient` — `constructor(cfg: { apiKey: string; model: string; baseUrl: string }, deps?: { fetchImpl?: typeof fetch; sleep?: (ms: number) => Promise<void> })`; methods `generate(p: GenerateParams): Promise<ImageResult>`, `edit(p: EditParams): Promise<ImageResult>`.

- [ ] **Step 1: Write the failing test** — `test/openai.test.ts`

```ts
import { describe, it, expect, vi } from "vitest";
import { OpenAiImageClient, OpenAiImageError } from "../src/openai.js";

const cfg = { apiKey: "sk-x", model: "gpt-image-2", baseUrl: "https://api.test/v1" };
const okJson = (b64 = "QUJD") => ({ ok: true, status: 200, json: async () => ({ data: [{ b64_json: b64 }], usage: { total_tokens: 1 } }) });

describe("generate", () => {
  it("POSTs JSON to /images/generations with model + bearer, returns b64", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okJson() as any);
    const client = new OpenAiImageClient(cfg, { fetchImpl: fetchImpl as any });
    const res = await client.generate({ prompt: "cat", size: "1024x1024", quality: "high", background: "auto", output_format: "png", n: 1 });
    expect(res.images).toEqual(["QUJD"]);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.test/v1/images/generations");
    expect((init.headers as any).Authorization).toBe("Bearer sk-x");
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({ model: "gpt-image-2", prompt: "cat", n: 1, size: "1024x1024" });
    expect(body).not.toHaveProperty("response_format");
    expect(body).not.toHaveProperty("background"); // "auto" is omitted
  });
});

describe("edit", () => {
  it("POSTs multipart with image[] and no JSON content-type", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okJson("ZZZ") as any);
    const client = new OpenAiImageClient(cfg, { fetchImpl: fetchImpl as any });
    const img = { bytes: Buffer.from("x"), mime: "image/png", name: "a.png" };
    const res = await client.edit({ images: [img], prompt: "remove tree", size: "auto", quality: "high", background: "auto", output_format: "png", input_fidelity: "high" });
    expect(res.images).toEqual(["ZZZ"]);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.test/v1/images/edits");
    expect(init.body).toBeInstanceOf(FormData);
    const form = init.body as FormData;
    expect(form.get("model")).toBe("gpt-image-2");
    expect(form.get("prompt")).toBe("remove tree");
    expect(form.getAll("image[]").length).toBe(1);
    expect((init.headers as any)["Content-Type"]).toBeUndefined();
  });
});

describe("errors + retry", () => {
  it("maps a 400 to OpenAiImageError with the API message", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 400, text: async () => JSON.stringify({ error: { message: "bad size" } }) } as any);
    const client = new OpenAiImageClient(cfg, { fetchImpl: fetchImpl as any });
    await expect(client.generate({ prompt: "x", size: "auto", quality: "auto", background: "auto", output_format: "png", n: 1 }))
      .rejects.toMatchObject({ status: 400, message: "bad size" });
  });
  it("flags content-policy refusals", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 400, text: async () => JSON.stringify({ error: { message: "rejected by our safety system" } }) } as any);
    const client = new OpenAiImageClient(cfg, { fetchImpl: fetchImpl as any });
    await expect(client.generate({ prompt: "x", size: "auto", quality: "auto", background: "auto", output_format: "png", n: 1 }))
      .rejects.toMatchObject({ isPolicy: true });
  });
  it("retries once on 500 then succeeds", async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => "boom" } as any)
      .mockResolvedValueOnce(okJson("OK2") as any);
    const sleep = vi.fn().mockResolvedValue(undefined);
    const client = new OpenAiImageClient(cfg, { fetchImpl: fetchImpl as any, sleep });
    const res = await client.generate({ prompt: "x", size: "auto", quality: "auto", background: "auto", output_format: "png", n: 1 });
    expect(res.images).toEqual(["OK2"]);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -w @genorah/gpt-image-mcp`
Expected: FAIL — cannot resolve `../src/openai.js`.

- [ ] **Step 3: Implement `src/openai.ts`**

```ts
import type { ImageFile } from "./files.js";

export type ImageResult = { images: string[]; usage?: unknown };

export type GenerateParams = {
  prompt: string; size: string; quality: string; background: string; output_format: string; n: number;
};

export type EditParams = {
  images: ImageFile[]; mask?: ImageFile; prompt: string;
  size: string; quality: string; background: string; output_format: string; input_fidelity: string;
};

export class OpenAiImageError extends Error {
  constructor(message: string, readonly status: number, readonly isPolicy: boolean) {
    super(message);
    this.name = "OpenAiImageError";
  }
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export class OpenAiImageClient {
  private fetchImpl: typeof fetch;
  private sleep: (ms: number) => Promise<void>;

  constructor(
    private cfg: { apiKey: string; model: string; baseUrl: string },
    deps: { fetchImpl?: typeof fetch; sleep?: (ms: number) => Promise<void> } = {}
  ) {
    this.fetchImpl = deps.fetchImpl ?? fetch;
    this.sleep = deps.sleep ?? defaultSleep;
  }

  async generate(p: GenerateParams): Promise<ImageResult> {
    const body: Record<string, unknown> = {
      model: this.cfg.model, prompt: p.prompt, n: p.n,
      size: p.size, quality: p.quality, output_format: p.output_format,
    };
    if (p.background !== "auto") body.background = p.background;
    return this.request(`${this.cfg.baseUrl}/images/generations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.cfg.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async edit(p: EditParams): Promise<ImageResult> {
    const form = new FormData();
    form.set("model", this.cfg.model);
    form.set("prompt", p.prompt);
    for (const img of p.images) {
      form.append("image[]", new Blob([img.bytes], { type: img.mime }), img.name);
    }
    if (p.mask) form.set("mask", new Blob([p.mask.bytes], { type: p.mask.mime }), p.mask.name);
    form.set("size", p.size);
    form.set("quality", p.quality);
    form.set("output_format", p.output_format);
    form.set("input_fidelity", p.input_fidelity);
    if (p.background !== "auto") form.set("background", p.background);
    return this.request(`${this.cfg.baseUrl}/images/edits`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.cfg.apiKey}` }, // let fetch set the multipart boundary
      body: form,
    });
  }

  private async request(url: string, init: RequestInit, attempt = 0): Promise<ImageResult> {
    const res = await this.fetchImpl(url, init);
    if (res.ok) {
      const json = (await res.json()) as { data?: { b64_json?: string }[]; usage?: unknown };
      return { images: (json.data ?? []).map((d) => d.b64_json).filter((b): b is string => !!b), usage: json.usage };
    }
    const text = await res.text();
    let message = text;
    let isPolicy = false;
    try {
      const j = JSON.parse(text) as { error?: { message?: string } };
      if (j.error?.message) message = j.error.message;
    } catch { /* keep raw text */ }
    isPolicy = /safety|policy|moderation|rejected/i.test(message);
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      await this.sleep(400 * 2 ** attempt + Math.floor(Math.random() * 200));
      return this.request(url, init, attempt + 1);
    }
    throw new OpenAiImageError(message, res.status, isPolicy);
  }
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -w @genorah/gpt-image-mcp`
Expected: PASS (all describe blocks).

- [ ] **Step 5: Commit**

```bash
git add packages/gpt-image-mcp/src/openai.ts packages/gpt-image-mcp/test/openai.test.ts
git commit -m "feat(gpt-image-mcp): OpenAI Images API client (generate JSON + edit multipart, retries)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: `result.ts` + tool handlers (`tools/generate.ts`, `tools/edit.ts`)

**Files:**
- Create: `packages/gpt-image-mcp/src/result.ts`
- Create: `packages/gpt-image-mcp/src/tools/generate.ts`
- Create: `packages/gpt-image-mcp/src/tools/edit.ts`
- Test: `packages/gpt-image-mcp/test/tools.test.ts`

**Interfaces:**
- Consumes: `OpenAiImageClient`, `GenerateArgs`/`EditArgs`, `resolveOutputPaths`/`writeBase64`/`readImageFile`, `modelSupportsTransparent`.
- Produces:
  - `type ToolResult = { content: Array<{ type: "text"; text: string } | { type: "image"; data: string; mimeType: string }>; isError?: boolean }`
  - `result.ts`: `successContent(paths: string[], firstB64: string, mime: string, meta: object): ToolResult`; `errorContent(message: string): ToolResult`; `formatError(e: unknown): string`
  - `makeGenerateHandler(deps: { client: OpenAiImageClient; outputDir: string; model: string; now?: () => number }): (args: GenerateArgs) => Promise<ToolResult>`
  - `makeEditHandler(deps: { client: OpenAiImageClient; outputDir: string; model: string; now?: () => number }): (args: EditArgs) => Promise<ToolResult>`

- [ ] **Step 1: Write the failing test** — `test/tools.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { makeGenerateHandler } from "../src/tools/generate.js";
import { makeEditHandler } from "../src/tools/edit.js";

const PNG_1x1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
const fakeClient = (b64 = PNG_1x1) => ({ generate: async () => ({ images: [b64] }), edit: async () => ({ images: [b64] }) }) as any;

describe("generate handler", () => {
  it("writes the image and returns the saved path + preview", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gi-"));
    const handler = makeGenerateHandler({ client: fakeClient(), outputDir: dir, model: "gpt-image-2", now: () => 7 });
    const res = await handler({ prompt: "cat", size: "1024x1024", quality: "high", background: "auto", output_format: "png", n: 1 });
    const saved = path.join(dir, "gpt-image-7.png");
    expect(JSON.parse((res.content[0] as any).text).saved).toEqual([saved]);
    expect(res.content.some((c: any) => c.type === "image")).toBe(true);
    expect((await fs.stat(saved)).size).toBeGreaterThan(0);
  });

  it("rejects transparent background on gpt-image-2 before calling the API", async () => {
    let called = false;
    const client = { generate: async () => { called = true; return { images: [] }; } } as any;
    const handler = makeGenerateHandler({ client, outputDir: ".", model: "gpt-image-2" });
    const res = await handler({ prompt: "x", size: "auto", quality: "auto", background: "transparent", output_format: "png", n: 1 });
    expect(res.isError).toBe(true);
    expect((res.content[0] as any).text).toMatch(/transparent/i);
    expect(called).toBe(false);
  });
});

describe("edit handler", () => {
  it("reads the input, writes the edited image, returns the path", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gi-"));
    const input = path.join(dir, "in.png");
    await fs.writeFile(input, Buffer.from(PNG_1x1, "base64"));
    const handler = makeEditHandler({ client: fakeClient(), outputDir: dir, model: "gpt-image-2", now: () => 9 });
    const res = await handler({ image_path: input, prompt: "remove tree", input_fidelity: "high", size: "auto", quality: "high", background: "auto", output_format: "png" });
    const saved = path.join(dir, "gpt-image-9.png");
    expect(JSON.parse((res.content[0] as any).text).saved).toEqual([saved]);
    expect((await fs.stat(saved)).size).toBeGreaterThan(0);
  });

  it("returns an error if the input file is missing", async () => {
    const handler = makeEditHandler({ client: fakeClient(), outputDir: ".", model: "gpt-image-2" });
    const res = await handler({ image_path: "/no/such.png", prompt: "x", input_fidelity: "high", size: "auto", quality: "high", background: "auto", output_format: "png" });
    expect(res.isError).toBe(true);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -w @genorah/gpt-image-mcp`
Expected: FAIL — cannot resolve the tool modules.

- [ ] **Step 3: Implement `src/result.ts`**

```ts
export type ToolResult = {
  content: Array<{ type: "text"; text: string } | { type: "image"; data: string; mimeType: string }>;
  isError?: boolean;
};

const PREVIEW_MAX_BYTES = 1_500_000;

export function successContent(paths: string[], firstB64: string, mime: string, meta: object): ToolResult {
  const content: ToolResult["content"] = [
    { type: "text", text: JSON.stringify({ saved: paths, ...meta }, null, 2) },
  ];
  // base64 length * 3/4 ≈ decoded bytes
  if (firstB64 && (firstB64.length * 3) / 4 <= PREVIEW_MAX_BYTES) {
    content.push({ type: "image", data: firstB64, mimeType: mime });
  }
  return { content };
}

export function errorContent(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export function formatError(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
```

- [ ] **Step 4: Implement `src/tools/generate.ts`**

```ts
import { resolveOutputPaths, writeBase64 } from "../files.js";
import { modelSupportsTransparent } from "../config.js";
import { successContent, errorContent, formatError, type ToolResult } from "../result.js";
import type { OpenAiImageClient } from "../openai.js";
import type { GenerateArgs } from "../schemas.js";

const MIME: Record<string, string> = { png: "image/png", jpeg: "image/jpeg", webp: "image/webp" };

export function makeGenerateHandler(deps: {
  client: OpenAiImageClient; outputDir: string; model: string; now?: () => number;
}): (args: GenerateArgs) => Promise<ToolResult> {
  return async (args) => {
    if (args.background === "transparent" && !modelSupportsTransparent(deps.model)) {
      return errorContent(`background "transparent" is not supported by model "${deps.model}". Use a gpt-image-1/1.5 model, or set background to "opaque"/"auto".`);
    }
    try {
      const result = await deps.client.generate({
        prompt: args.prompt, size: args.size, quality: args.quality,
        background: args.background, output_format: args.output_format, n: args.n,
      });
      const ts = (deps.now ?? Date.now)();
      const paths = resolveOutputPaths({ outputDir: deps.outputDir, outputPath: args.output_path, outputFormat: args.output_format, count: result.images.length, ts });
      await Promise.all(result.images.map((b64, i) => writeBase64(paths[i], b64)));
      return successContent(paths, result.images[0] ?? "", MIME[args.output_format] ?? "image/png", { model: deps.model, usage: result.usage });
    } catch (e) {
      return errorContent(formatError(e));
    }
  };
}
```

- [ ] **Step 5: Implement `src/tools/edit.ts`**

```ts
import { resolveOutputPaths, writeBase64, readImageFile } from "../files.js";
import { modelSupportsTransparent } from "../config.js";
import { successContent, errorContent, formatError, type ToolResult } from "../result.js";
import type { OpenAiImageClient } from "../openai.js";
import type { EditArgs } from "../schemas.js";

const MIME: Record<string, string> = { png: "image/png", jpeg: "image/jpeg", webp: "image/webp" };

export function makeEditHandler(deps: {
  client: OpenAiImageClient; outputDir: string; model: string; now?: () => number;
}): (args: EditArgs) => Promise<ToolResult> {
  return async (args) => {
    if (args.background === "transparent" && !modelSupportsTransparent(deps.model)) {
      return errorContent(`background "transparent" is not supported by model "${deps.model}". Use a gpt-image-1/1.5 model, or set background to "opaque"/"auto".`);
    }
    try {
      const paths = Array.isArray(args.image_path) ? args.image_path : [args.image_path];
      const images = await Promise.all(paths.map(readImageFile));
      const mask = args.mask_path ? await readImageFile(args.mask_path) : undefined;
      const result = await deps.client.edit({
        images, mask, prompt: args.prompt, size: args.size, quality: args.quality,
        background: args.background, output_format: args.output_format, input_fidelity: args.input_fidelity,
      });
      const ts = (deps.now ?? Date.now)();
      const outPaths = resolveOutputPaths({ outputDir: deps.outputDir, outputPath: args.output_path, outputFormat: args.output_format, count: result.images.length, ts });
      await Promise.all(result.images.map((b64, i) => writeBase64(outPaths[i], b64)));
      return successContent(outPaths, result.images[0] ?? "", MIME[args.output_format] ?? "image/png", { model: deps.model, usage: result.usage });
    } catch (e) {
      return errorContent(formatError(e));
    }
  };
}
```

- [ ] **Step 6: Run tests, verify they pass**

Run: `npm test -w @genorah/gpt-image-mcp`
Expected: PASS (generate + edit handlers, including the transparent-guard and missing-file cases).

- [ ] **Step 7: Commit**

```bash
git add packages/gpt-image-mcp/src/result.ts packages/gpt-image-mcp/src/tools/ packages/gpt-image-mcp/test/tools.test.ts
git commit -m "feat(gpt-image-mcp): generate + edit tool handlers with MCP content + guards

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: `index.ts` server entry + docs (build smoke)

**Files:**
- Create: `packages/gpt-image-mcp/src/index.ts`
- Create: `packages/gpt-image-mcp/.env.example`
- Create: `packages/gpt-image-mcp/README.md`

**Interfaces:**
- Consumes: `loadConfig`, `OpenAiImageClient`, `generateShape`/`editShape`, `makeGenerateHandler`/`makeEditHandler`.
- Produces: a runnable `dist/index.js` MCP server registering tools `generate_image` and `edit_image` over stdio.

- [ ] **Step 1: Verify the installed SDK's registration API**

Run: `node -e "import('@modelcontextprotocol/sdk/server/mcp.js').then(m => console.log(Object.getOwnPropertyNames(m.McpServer.prototype)))"`
Expected: includes `registerTool` (SDK ≥ 1.10). If it shows only `tool`, use `server.tool(name, shape, handler)` instead of `registerTool` in Step 2 (same handler + shapes).

- [ ] **Step 2: Implement `src/index.ts`**

```ts
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig, loadEnvFile } from "./config.js";
import { OpenAiImageClient } from "./openai.js";
import { generateShape, editShape } from "./schemas.js";
import { makeGenerateHandler } from "./tools/generate.js";
import { makeEditHandler } from "./tools/edit.js";

async function main() {
  // Load the package-local .env (dist/index.js -> ../.env = package root). Real shell env still wins.
  loadEnvFile(fileURLToPath(new URL("../.env", import.meta.url)));
  const cfg = loadConfig(); // throws clearly if OPENAI_API_KEY is missing
  const client = new OpenAiImageClient({ apiKey: cfg.apiKey, model: cfg.model, baseUrl: cfg.baseUrl });
  const deps = { client, outputDir: cfg.outputDir, model: cfg.model };

  const server = new McpServer({ name: "gpt-image", version: "4.0.0" });

  server.registerTool(
    "generate_image",
    {
      title: "Generate image (OpenAI gpt-image)",
      description: "Generate an image from a text prompt with OpenAI gpt-image-2. Saves to disk and returns the file path.",
      inputSchema: generateShape,
    },
    makeGenerateHandler(deps) as any
  );

  server.registerTool(
    "edit_image",
    {
      title: "Edit image (OpenAI gpt-image)",
      description: "Edit an existing image (optionally with a mask and reference images) using OpenAI gpt-image-2. Saves to disk and returns the file path.",
      inputSchema: editShape,
    },
    makeEditHandler(deps) as any
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(`[gpt-image-mcp] fatal: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
```

- [ ] **Step 3: Create `.env.example`**

```bash
# Required — your OpenAI API key (image API is paid; no free tier).
OPENAI_API_KEY=sk-...
# Optional — where generated/edited images are saved (default: process.cwd()).
GPT_IMAGE_OUTPUT_DIR=
# Optional — image model (default: gpt-image-2). e.g. gpt-image-2-2026-04-21, gpt-image-1.5.
GPT_IMAGE_MODEL=gpt-image-2
# Optional — override the API base URL (default: https://api.openai.com/v1).
OPENAI_BASE_URL=
```

- [ ] **Step 4: Create `README.md`**

````markdown
# @genorah/gpt-image-mcp

MCP server for OpenAI **gpt-image-2** image generation + editing. Tools: `generate_image`, `edit_image`.

## Build
```bash
npm install -w @genorah/gpt-image-mcp
npm run build -w @genorah/gpt-image-mcp
```

## Configure (.mcp.json)
```json
"gpt-image": {
  "command": "node",
  "args": ["d:/Modulo/Plugins/v0-ahh-skill/packages/gpt-image-mcp/dist/index.js"],
  "env": {
    "OPENAI_API_KEY": "${OPENAI_API_KEY}",
    "GPT_IMAGE_OUTPUT_DIR": "${GPT_IMAGE_OUTPUT_DIR}",
    "GPT_IMAGE_MODEL": "${GPT_IMAGE_MODEL:-gpt-image-2}"
  },
  "optional": true
}
```

## Tools
- `generate_image(prompt, size?, quality?, background?, output_format?, n?, output_path?)`
- `edit_image(image_path, prompt, mask_path?, input_fidelity?, size?, quality?, background?, output_format?, output_path?)`

Outputs are saved to `GPT_IMAGE_OUTPUT_DIR` and the saved path is returned. `background: "transparent"` requires a `gpt-image-1`/`1.5` model.
````

- [ ] **Step 5: Build and smoke-test startup**

Run: `npm run build -w @genorah/gpt-image-mcp`
Expected: `tsc` exits 0; `dist/index.js` exists.

Run: `OPENAI_API_KEY=sk-smoke node packages/gpt-image-mcp/dist/index.js < /dev/null`
Expected: starts without throwing and exits when stdin closes (no "OPENAI_API_KEY is required" error). On Windows PowerShell: `$env:OPENAI_API_KEY="sk-smoke"; node packages/gpt-image-mcp/dist/index.js`.

- [ ] **Step 6: Commit**

```bash
git add packages/gpt-image-mcp/src/index.ts packages/gpt-image-mcp/.env.example packages/gpt-image-mcp/README.md
git commit -m "feat(gpt-image-mcp): MCP server entry (stdio) + docs

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Wire into `.mcp.json` (replace nano-banana)

**Files:**
- Modify: `d:/Modulo/Plugins/v0-ahh-skill/.claude-plugin/.mcp.json` (replace the `nano-banana` block)
- Modify: `d:/Modulo/Plugins/v0-ahh-skill/plugins/gen/.claude-plugin/.mcp.json` (replace the `nano-banana` block)

**Interfaces:**
- Produces: an MCP server named `gpt-image` registered in both plugin configs.

- [ ] **Step 1: Replace the `nano-banana` entry** in **both** files with:

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

- [ ] **Step 2: Validate both JSON files parse**

Run: `node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/.mcp.json','utf8')); JSON.parse(require('fs').readFileSync('plugins/gen/.claude-plugin/.mcp.json','utf8')); console.log('ok')"`
Expected: `ok`.

- [ ] **Step 3: Commit**

```bash
git add .claude-plugin/.mcp.json plugins/gen/.claude-plugin/.mcp.json
git commit -m "chore(gpt-image-mcp): replace nano-banana with gpt-image in .mcp.json

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 4: Manual MCP connection check (out-of-band)**

Restart Claude Code with `OPENAI_API_KEY` set in the environment, then confirm the `mcp__gpt-image__generate_image` and `mcp__gpt-image__edit_image` tools are listed. (Cannot be asserted in vitest — it requires the host loading the MCP config.)

---

### Task 8: Opt-in live smoke test (real API — optional)

**Files:**
- Create: `packages/gpt-image-mcp/test/live.test.ts`

**Interfaces:**
- Consumes: `loadConfig`, `OpenAiImageClient`, `makeGenerateHandler`, `makeEditHandler`.

- [ ] **Step 1: Implement the gated live test** — `test/live.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { OpenAiImageClient } from "../src/openai.js";
import { makeGenerateHandler, } from "../src/tools/generate.js";

const live = process.env.GPT_IMAGE_LIVE === "1" && !!process.env.OPENAI_API_KEY;
const d = live ? describe : describe.skip;

d("live OpenAI gpt-image", () => {
  it("generates a real image and writes it to disk", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gi-live-"));
    const model = process.env.GPT_IMAGE_MODEL || "gpt-image-2";
    const client = new OpenAiImageClient({ apiKey: process.env.OPENAI_API_KEY!, model, baseUrl: "https://api.openai.com/v1" });
    const handler = makeGenerateHandler({ client, outputDir: dir, model });
    const res = await handler({ prompt: "a single red apple on a white background, studio photo", size: "1024x1024", quality: "low", background: "auto", output_format: "png", n: 1 });
    const saved = JSON.parse((res.content[0] as any).text).saved[0];
    const stat = await fs.stat(saved);
    expect(stat.size).toBeGreaterThan(1000);
  }, 120_000);
});
```

- [ ] **Step 2: Run it explicitly (costs money — opt-in only)**

Run: `GPT_IMAGE_LIVE=1 OPENAI_API_KEY=sk-real npm test -w @genorah/gpt-image-mcp` (PowerShell: set `$env:` first).
Expected: PASS; a PNG > 1 KB written to a temp dir. Default `npm test` (without the flag) **skips** this file.

- [ ] **Step 3: Commit**

```bash
git add packages/gpt-image-mcp/test/live.test.ts
git commit -m "test(gpt-image-mcp): opt-in live smoke test (gated on GPT_IMAGE_LIVE)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Follow-up (separate task, not in this plan)
Update the Genorah agents that reference `mcp__nano-banana__{generate_image,edit_image,continue_editing,get_last_image_info}` to `mcp__gpt-image__{generate_image,edit_image}` (drop the two stateful tools). Not required to use the MCP directly; tracked separately.

## Notes for the implementer
- After Task 6, you can use the MCP directly from Claude Code (once `OPENAI_API_KEY` is set + the host reloads config) to do the STAGEABLE tree removal: `edit_image({ image_path: "p:/Genorah/STAGEABLE-Web/src/assets/images/hero-after-living.png", prompt: "Remove the potted tree in the middle of the room; extend the floor and wall naturally", input_fidelity: "high", output_path: "p:/Genorah/STAGEABLE-Web/src/assets/images/hero-after-living.png" })`.
- Windows note: `.mcp.json` uses an absolute path with forward slashes — keep it exactly as shown.
