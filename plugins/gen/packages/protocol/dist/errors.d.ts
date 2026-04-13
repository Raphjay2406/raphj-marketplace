import { z } from "zod";
export declare const ErrorCodes: readonly ["WORKER_TIMEOUT", "VALIDATOR_REJECTED", "DNA_DRIFT", "COST_CAP_HIT", "PROVIDER_UNAVAILABLE", "SCHEMA_MISMATCH", "WEBGPU_UNAVAILABLE", "CIRCULAR_FOLLOWUP", "UNTRUSTED_OUTPUT", "MID_WAVE_CRASH", "EXTERNAL_A2A_FAIL", "COST_BUDGET_EXCEEDED"];
export type ErrorCode = (typeof ErrorCodes)[number];
export declare const RecoveryHintSchema: z.ZodEnum<["retry_with_fallback", "escalate_user", "skip_and_continue", "rerun_upstream"]>;
export declare const RetryStrategySchema: z.ZodObject<{
    max_attempts: z.ZodNumber;
    backoff_ms: z.ZodNumber;
    fallback_worker: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    max_attempts: number;
    backoff_ms: number;
    fallback_worker?: string | undefined;
}, {
    max_attempts: number;
    backoff_ms: number;
    fallback_worker?: string | undefined;
}>;
export declare const StructuredErrorSchema: z.ZodObject<{
    code: z.ZodEnum<["WORKER_TIMEOUT", "VALIDATOR_REJECTED", "DNA_DRIFT", "COST_CAP_HIT", "PROVIDER_UNAVAILABLE", "SCHEMA_MISMATCH", "WEBGPU_UNAVAILABLE", "CIRCULAR_FOLLOWUP", "UNTRUSTED_OUTPUT", "MID_WAVE_CRASH", "EXTERNAL_A2A_FAIL", "COST_BUDGET_EXCEEDED"]>;
    message: z.ZodString;
    recovery_hint: z.ZodEnum<["retry_with_fallback", "escalate_user", "skip_and_continue", "rerun_upstream"]>;
    retry_strategy: z.ZodOptional<z.ZodObject<{
        max_attempts: z.ZodNumber;
        backoff_ms: z.ZodNumber;
        fallback_worker: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        max_attempts: number;
        backoff_ms: number;
        fallback_worker?: string | undefined;
    }, {
        max_attempts: number;
        backoff_ms: number;
        fallback_worker?: string | undefined;
    }>>;
    cause: z.ZodOptional<z.ZodUnknown>;
    at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: "WORKER_TIMEOUT" | "VALIDATOR_REJECTED" | "DNA_DRIFT" | "COST_CAP_HIT" | "PROVIDER_UNAVAILABLE" | "SCHEMA_MISMATCH" | "WEBGPU_UNAVAILABLE" | "CIRCULAR_FOLLOWUP" | "UNTRUSTED_OUTPUT" | "MID_WAVE_CRASH" | "EXTERNAL_A2A_FAIL" | "COST_BUDGET_EXCEEDED";
    message: string;
    recovery_hint: "retry_with_fallback" | "escalate_user" | "skip_and_continue" | "rerun_upstream";
    at?: string | undefined;
    retry_strategy?: {
        max_attempts: number;
        backoff_ms: number;
        fallback_worker?: string | undefined;
    } | undefined;
    cause?: unknown;
}, {
    code: "WORKER_TIMEOUT" | "VALIDATOR_REJECTED" | "DNA_DRIFT" | "COST_CAP_HIT" | "PROVIDER_UNAVAILABLE" | "SCHEMA_MISMATCH" | "WEBGPU_UNAVAILABLE" | "CIRCULAR_FOLLOWUP" | "UNTRUSTED_OUTPUT" | "MID_WAVE_CRASH" | "EXTERNAL_A2A_FAIL" | "COST_BUDGET_EXCEEDED";
    message: string;
    recovery_hint: "retry_with_fallback" | "escalate_user" | "skip_and_continue" | "rerun_upstream";
    at?: string | undefined;
    retry_strategy?: {
        max_attempts: number;
        backoff_ms: number;
        fallback_worker?: string | undefined;
    } | undefined;
    cause?: unknown;
}>;
export type StructuredError = z.infer<typeof StructuredErrorSchema>;
export declare function parseStructuredError(input: unknown): StructuredError;
export declare class GenorahError extends Error {
    structured: StructuredError;
    constructor(structured: StructuredError);
}
//# sourceMappingURL=errors.d.ts.map