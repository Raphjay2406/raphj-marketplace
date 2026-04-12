import { createHash } from "crypto";
export class DummyProvider {
    name = "dummy";
    kind = "image";
    async estimateCost(_input) {
        return { cost_usd: 0, duration_ms_estimate: 100 };
    }
    async generate(input) {
        const sha = createHash("sha256").update(JSON.stringify(input)).digest("hex");
        return {
            provider: "dummy",
            sha256: sha,
            path: `/tmp/dummy-${sha}.bin`,
            bytes: 0,
            cost_usd: 0,
            duration_ms: 100,
            input
        };
    }
}
