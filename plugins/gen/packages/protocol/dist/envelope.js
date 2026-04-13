import { z } from "zod";
export const VerdictSchema = z.object({
    validator: z.string().min(1),
    pass: z.boolean(),
    score: z.number().min(0).max(1).optional(),
    notes: z.string().optional()
});
export const FollowupSchema = z.object({
    suggested_worker: z.string().min(1),
    reason: z.string().min(1),
    context_override: z.record(z.unknown()).optional()
});
export const CostSchema = z.object({
    tokens_in: z.number().int().nonnegative(),
    tokens_out: z.number().int().nonnegative(),
    api_spend_usd: z.number().nonnegative()
});
export const DecisionSchema = z.object({
    step: z.string(),
    chose: z.string(),
    reason: z.string()
}).passthrough();
export const TraceSchema = z.object({
    decisions: z.array(DecisionSchema),
    skills_used: z.array(z.string()),
    cost: CostSchema
});
export const ResultEnvelopeSchema = z.object({
    schema_version: z.literal("4.0.0"),
    status: z.enum(["ok", "partial", "failed"]),
    artifact: z.unknown().refine((v) => v !== undefined, { message: "artifact is required" }),
    verdicts: z.array(VerdictSchema),
    followups: z.array(FollowupSchema),
    trace: TraceSchema.optional(),
    correlation_id: z.string().optional(),
    emitted_by: z.string().optional(),
    emitted_at: z.string().datetime().optional()
});
export function parseResultEnvelope(input) {
    const parsed = ResultEnvelopeSchema.parse(input);
    return parsed;
}
export function ok(artifact, extras = {}) {
    return {
        schema_version: "4.0.0",
        status: "ok",
        artifact,
        verdicts: [],
        followups: [],
        ...extras
    };
}
export function partial(artifact, verdicts, followups = []) {
    return { schema_version: "4.0.0", status: "partial", artifact, verdicts, followups };
}
export function failed(verdicts) {
    return {
        schema_version: "4.0.0",
        status: "failed",
        artifact: null,
        verdicts,
        followups: []
    };
}
