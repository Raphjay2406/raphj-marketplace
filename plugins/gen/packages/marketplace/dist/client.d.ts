import { z } from "zod";
export declare const AgentSummarySchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodString;
    tier: z.ZodEnum<["director", "worker"]>;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    version: string;
    tier: "director" | "worker";
    description: string;
}, {
    id: string;
    version: string;
    tier: "director" | "worker";
    description: string;
}>;
export declare const ManifestSchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodString;
    tier: z.ZodEnum<["director", "worker"]>;
    source_url: z.ZodString;
    integrity: z.ZodString;
    capabilities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    version: string;
    tier: "director" | "worker";
    source_url: string;
    integrity: string;
    capabilities: {
        id: string;
    }[];
}, {
    id: string;
    version: string;
    tier: "director" | "worker";
    source_url: string;
    integrity: string;
    capabilities: {
        id: string;
    }[];
}>;
export interface MarketplaceOptions {
    registry: string;
    apiToken?: string;
}
export declare class MarketplaceClient {
    private opts;
    constructor(opts: MarketplaceOptions);
    discover(query: string): Promise<Array<z.infer<typeof AgentSummarySchema>>>;
    fetchManifest(idWithVersion: string): Promise<z.infer<typeof ManifestSchema>>;
    private headers;
}
//# sourceMappingURL=client.d.ts.map