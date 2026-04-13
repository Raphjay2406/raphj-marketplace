import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { GenorahError } from "@genorah/protocol";
const PRICE = {
    cost_usd: 0.04,
    duration_ms_estimate: 5_000,
};
export class RecraftProvider {
    opts;
    name = "recraft";
    kind = "vector";
    endpoint;
    downloadDir;
    style;
    constructor(opts) {
        this.opts = opts;
        this.endpoint = opts.endpoint ?? "https://external.api.recraft.ai/v1/images/generations";
        this.downloadDir = opts.downloadDir ?? join(tmpdir(), "genorah-recraft");
        this.style = opts.style ?? "vector_illustration";
    }
    async estimateCost(_input) {
        return { cost_usd: PRICE.cost_usd, duration_ms_estimate: PRICE.duration_ms_estimate };
    }
    async generate(input) {
        const start = Date.now();
        const body = {
            prompt: input.prompt,
            style: this.style,
            response_format: "url",
        };
        if (input.seed !== undefined)
            body.seed = input.seed;
        const res = await fetch(this.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.opts.apiKey}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: `Recraft API error ${res.status}: ${res.statusText}`,
                recovery_hint: "retry_with_fallback",
                retry_strategy: {
                    max_attempts: 3,
                    backoff_ms: 1000,
                    fallback_worker: "flux-kontext",
                },
            });
        }
        const json = (await res.json());
        const downloadUrl = json.data?.[0]?.url;
        if (!downloadUrl) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: "Recraft API returned no image URL",
                recovery_hint: "retry_with_fallback",
            });
        }
        const blobRes = await fetch(downloadUrl);
        if (!blobRes.ok) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: `Recraft blob download failed ${blobRes.status}`,
                recovery_hint: "retry_with_fallback",
            });
        }
        const buffer = Buffer.from(await blobRes.arrayBuffer());
        const sha256 = createHash("sha256").update(buffer).digest("hex");
        mkdirSync(this.downloadDir, { recursive: true });
        const outPath = join(this.downloadDir, `${sha256}.svg`);
        writeFileSync(outPath, buffer);
        return {
            provider: "recraft",
            sha256,
            path: outPath,
            bytes: buffer.length,
            cost_usd: PRICE.cost_usd,
            duration_ms: Date.now() - start,
            input,
        };
    }
}
