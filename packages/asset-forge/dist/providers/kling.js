import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { GenorahError } from "@genorah/protocol";
const PRICE_PER_SECOND = 0.35;
const DEFAULT_DURATION_SECONDS = 6;
const BASE_DURATION_MS_PER_SECOND = 8_000; // ~8s processing per 1s of video
export class KlingProvider {
    opts;
    name = "kling";
    kind = "video";
    endpoint;
    downloadDir;
    constructor(opts) {
        this.opts = opts;
        this.endpoint = opts.endpoint ?? "https://api.klingai.com/v2.1/videos/text2video";
        this.downloadDir = opts.downloadDir ?? join(tmpdir(), "genorah-kling");
    }
    async estimateCost(input) {
        const duration = input.params?.duration_seconds ?? DEFAULT_DURATION_SECONDS;
        return {
            cost_usd: parseFloat((PRICE_PER_SECOND * duration).toFixed(2)),
            duration_ms_estimate: duration * BASE_DURATION_MS_PER_SECOND,
        };
    }
    async generate(input) {
        const start = Date.now();
        const duration = input.params?.duration_seconds ?? DEFAULT_DURATION_SECONDS;
        const cost_usd = parseFloat((PRICE_PER_SECOND * duration).toFixed(2));
        const body = {
            prompt: input.prompt,
            duration: duration,
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
                message: `Kling API error ${res.status}: ${res.statusText}`,
                recovery_hint: "retry_with_fallback",
                retry_strategy: {
                    max_attempts: 2,
                    backoff_ms: 5000,
                    fallback_worker: "flux-kontext",
                },
            });
        }
        const json = (await res.json());
        const downloadUrl = json.url ?? json.video_url;
        if (!downloadUrl) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: "Kling API returned no video URL",
                recovery_hint: "retry_with_fallback",
            });
        }
        const blobRes = await fetch(downloadUrl);
        if (!blobRes.ok) {
            throw new GenorahError({
                code: "PROVIDER_UNAVAILABLE",
                message: `Kling blob download failed ${blobRes.status}`,
                recovery_hint: "retry_with_fallback",
            });
        }
        const buffer = Buffer.from(await blobRes.arrayBuffer());
        const sha256 = createHash("sha256").update(buffer).digest("hex");
        mkdirSync(this.downloadDir, { recursive: true });
        const outPath = join(this.downloadDir, `${sha256}.mp4`);
        writeFileSync(outPath, buffer);
        return {
            provider: "kling",
            sha256,
            path: outPath,
            bytes: buffer.length,
            cost_usd,
            duration_ms: Date.now() - start,
            input,
        };
    }
}
