import { z } from "zod";
export const ErrorCodes = [
    "WORKER_TIMEOUT",
    "VALIDATOR_REJECTED",
    "DNA_DRIFT",
    "COST_CAP_HIT",
    "PROVIDER_UNAVAILABLE",
    "SCHEMA_MISMATCH",
    "WEBGPU_UNAVAILABLE",
    "CIRCULAR_FOLLOWUP",
    "UNTRUSTED_OUTPUT",
    "MID_WAVE_CRASH",
    "EXTERNAL_A2A_FAIL",
    "COST_BUDGET_EXCEEDED"
];
export const RecoveryHintSchema = z.enum([
    "retry_with_fallback",
    "escalate_user",
    "skip_and_continue",
    "rerun_upstream"
]);
export const RetryStrategySchema = z.object({
    max_attempts: z.number().int().min(0).max(10),
    backoff_ms: z.number().int().min(0),
    fallback_worker: z.string().optional()
});
export const StructuredErrorSchema = z.object({
    code: z.enum(ErrorCodes),
    message: z.string().min(1),
    recovery_hint: RecoveryHintSchema,
    retry_strategy: RetryStrategySchema.optional(),
    cause: z.unknown().optional(),
    at: z.string().optional()
});
export function parseStructuredError(input) {
    return StructuredErrorSchema.parse(input);
}
export class GenorahError extends Error {
    structured;
    constructor(structured) {
        super(structured.message);
        this.structured = structured;
        this.name = "GenorahError";
    }
}
