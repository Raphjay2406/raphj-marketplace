import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { GenorahError } from "@genorah/protocol";
const PRICE = {
    cost_usd: 0.05,
    duration_ms_estimate: 8_000,
};
export class FluxKontextProvider {
    opts;
    name = "flux-kontext";
    kind = "image";
    endpoint;
    downloadDir;
    constructor(opts) {
        this.opts = opts;
        this.endpoint = opts.endpoint ?? "https://api.fal.ai/v1/flux-1.1-pro-ultra-kontext/run";
        this.downloadDir = opts.downloadDir ?? join(tmpdir(), "genorah-flux-kontext");
    }
    async estimateCost(_input) {
        return { cost_usd: PRICE.cost_usd, duration_ms_estimate: PRICE.duration_ms_estimate };
    }
    async generate(input) {
        const start = Date.now();
        const body = {
            prompt: input.prompt,
        };
        if (input.seed !== undefined)
            body.seed = input.seed;
        if (input.reference_paths?.length)
            body.reference_paths = input.reference_paths;
        const res = await fetch(this.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Key ${this.opts.apiKey}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: `FluxKontext API error ${res.status}: ${res.statusText}`,
                recovery_hint: "retry_with_fallback",
                retry_strategy: {
                    max_attempts: 3,
                    backoff_ms: 1000,
                    fallback_worker: "recraft",
                },
            });
        }
        const json = (await res.json());
        const downloadUrl = json.images?.[0]?.url ?? json.url;
        if (!downloadUrl) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: "FluxKontext API returned no image URL",
                recovery_hint: "retry_with_fallback",
            });
        }
        const blobRes = await fetch(downloadUrl);
        if (!blobRes.ok) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: `FluxKontext blob download failed ${blobRes.status}`,
                recovery_hint: "retry_with_fallback",
            });
        }
        const buffer = Buffer.from(await blobRes.arrayBuffer());
        const sha256 = createHash("sha256").update(buffer).digest("hex");
        mkdirSync(this.downloadDir, { recursive: true });
        const outPath = join(this.downloadDir, `${sha256}.jpg`);
        writeFileSync(outPath, buffer);
        return {
            provider: "flux-kontext",
            sha256,
            path: outPath,
            bytes: buffer.length,
            cost_usd: PRICE.cost_usd,
            duration_ms: Date.now() - start,
            input,
        };
    }
}
