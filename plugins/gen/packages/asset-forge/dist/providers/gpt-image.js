import { createHash } from "crypto";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, basename, extname } from "path";
import { tmpdir } from "os";
import { GenorahError } from "@genorah/protocol";
const PRICE = {
    cost_usd: 0.04, // gpt-image-2 ~1024² high quality — estimate; tune to observed pricing
    duration_ms_estimate: 15_000,
};
const MIME_BY_EXT = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
};
function mimeForPath(p) {
    return MIME_BY_EXT[extname(p).toLowerCase()] ?? "image/png";
}
export class GptImageProvider {
    opts;
    name = "gpt-image";
    kind = "image";
    model;
    baseUrl;
    downloadDir;
    constructor(opts) {
        this.opts = opts;
        this.model = opts.model ?? "gpt-image-2";
        this.baseUrl = opts.baseUrl ?? "https://api.openai.com/v1";
        this.downloadDir = opts.downloadDir ?? join(tmpdir(), "genorah-gpt-image");
    }
    async estimateCost(_input) {
        return { cost_usd: PRICE.cost_usd, duration_ms_estimate: PRICE.duration_ms_estimate };
    }
    async generate(input) {
        const start = Date.now();
        const body = {
            model: this.model,
            prompt: input.prompt,
            n: 1,
            size: input.params?.size ?? "1024x1024",
            quality: input.params?.quality ?? "high",
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
    async edit(input, opts) {
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
        form.set("size", input.params?.size ?? "auto");
        form.set("quality", input.params?.quality ?? "high");
        form.set("output_format", "png");
        // gpt-image-2 rejects input_fidelity + background:"transparent" (HTTP 400) — omit both for this family.
        const res = await fetch(`${this.baseUrl}/images/edits`, {
            method: "POST",
            headers: { Authorization: `Bearer ${this.opts.apiKey}` }, // fetch sets the multipart boundary
            body: form,
        });
        return this.handleImageResponse(res, input, start);
    }
    async handleImageResponse(res, input, start) {
        if (!res.ok) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: `gpt-image API error ${res.status}: ${res.statusText}`,
                recovery_hint: "retry_with_fallback",
                retry_strategy: { max_attempts: 3, backoff_ms: 1000, fallback_worker: "flux-hero-gen" },
            });
        }
        const json = (await res.json());
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
