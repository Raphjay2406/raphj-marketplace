import { z } from "zod";
export const AgentSummarySchema = z.object({
    id: z.string(),
    version: z.string(),
    tier: z.enum(["director", "worker"]),
    description: z.string()
});
export const ManifestSchema = z.object({
    id: z.string(),
    version: z.string(),
    tier: z.enum(["director", "worker"]),
    source_url: z.string().url(),
    integrity: z.string(),
    capabilities: z.array(z.object({ id: z.string() }))
});
export class MarketplaceClient {
    opts;
    constructor(opts) {
        this.opts = opts;
    }
    async discover(query) {
        const url = `${this.opts.registry}/search?q=${encodeURIComponent(query)}`;
        const res = await fetch(url, { headers: this.headers() });
        if (!res.ok)
            throw new Error(`discover failed ${res.status}`);
        const body = await res.json();
        return body.agents.map(a => AgentSummarySchema.parse(a));
    }
    async fetchManifest(idWithVersion) {
        const url = `${this.opts.registry}/agents/${encodeURIComponent(idWithVersion)}`;
        const res = await fetch(url, { headers: this.headers() });
        if (!res.ok)
            throw new Error(`fetchManifest failed ${res.status}`);
        return ManifestSchema.parse(await res.json());
    }
    headers() {
        return this.opts.apiToken ? { authorization: `Bearer ${this.opts.apiToken}` } : {};
    }
}
