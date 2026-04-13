import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { GenorahError } from "@genorah/protocol";
const PRICE = {
    cost_usd: 0.20,
    duration_ms_estimate: 45_000,
};
export class MeshyProvider {
    opts;
    name = "meshy";
    kind = "3d";
    endpoint;
    downloadDir;
    constructor(opts) {
        this.opts = opts;
        this.endpoint = opts.endpoint ?? "https://api.meshy.ai/v5/text-to-3d";
        this.downloadDir = opts.downloadDir ?? join(tmpdir(), "genorah-meshy");
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
                Authorization: `Bearer ${this.opts.apiKey}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: `Meshy API error ${res.status}: ${res.statusText}`,
                recovery_hint: "retry_with_fallback",
                retry_strategy: {
                    max_attempts: 3,
                    backoff_ms: 2000,
                    fallback_worker: "flux-kontext",
                },
            });
        }
        const json = (await res.json());
        const downloadUrl = json.url ?? json.glb_url;
        if (!downloadUrl) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: "Meshy API returned no download URL",
                recovery_hint: "retry_with_fallback",
            });
        }
        const blobRes = await fetch(downloadUrl);
        if (!blobRes.ok) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: `Meshy blob download failed ${blobRes.status}`,
                recovery_hint: "retry_with_fallback",
            });
        }
        const buffer = Buffer.from(await blobRes.arrayBuffer());
        const sha256 = createHash("sha256").update(buffer).digest("hex");
        mkdirSync(this.downloadDir, { recursive: true });
        const outPath = join(this.downloadDir, `${sha256}.glb`);
        writeFileSync(outPath, buffer);
        return {
            provider: "meshy",
            sha256,
            path: outPath,
            bytes: buffer.length,
            cost_usd: PRICE.cost_usd,
            duration_ms: Date.now() - start,
            input,
        };
    }
}
