import { z } from "zod";
export const ManifestEntrySchema = z.object({
    path: z.string(),
    sha256: z.string().length(64).or(z.string().min(1)),
    bytes: z.number().int().nonnegative(),
    provider: z.string(),
    model: z.string().optional(),
    seed: z.number().optional(),
    prompt: z.string(),
    reference_hashes: z.array(z.string()),
    cost_usd: z.number().nonnegative(),
    duration_ms: z.number().nonnegative(),
    cache_hit: z.boolean(),
    dna_compliance_pass: z.boolean(),
    parent_sha256: z.string().optional(),
    recorded_at: z.string().optional()
});
export const ManifestSchema = z.object({
    schema_version: z.literal("4.0.0"),
    entries: z.array(ManifestEntrySchema)
});
