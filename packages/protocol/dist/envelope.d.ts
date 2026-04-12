import { z } from "zod";
export declare const VerdictSchema: z.ZodObject<{
    validator: z.ZodString;
    pass: z.ZodBoolean;
    score: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    validator: string;
    pass: boolean;
    score?: number | undefined;
    notes?: string | undefined;
}, {
    validator: string;
    pass: boolean;
    score?: number | undefined;
    notes?: string | undefined;
}>;
export type Verdict = z.infer<typeof VerdictSchema>;
export declare const FollowupSchema: z.ZodObject<{
    suggested_worker: z.ZodString;
    reason: z.ZodString;
    context_override: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    suggested_worker: string;
    reason: string;
    context_override?: Record<string, unknown> | undefined;
}, {
    suggested_worker: string;
    reason: string;
    context_override?: Record<string, unknown> | undefined;
}>;
export type Followup = z.infer<typeof FollowupSchema>;
export declare const CostSchema: z.ZodObject<{
    tokens_in: z.ZodNumber;
    tokens_out: z.ZodNumber;
    api_spend_usd: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    tokens_in: number;
    tokens_out: number;
    api_spend_usd: number;
}, {
    tokens_in: number;
    tokens_out: number;
    api_spend_usd: number;
}>;
export declare const DecisionSchema: z.ZodObject<{
    step: z.ZodString;
    chose: z.ZodString;
    reason: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    step: z.ZodString;
    chose: z.ZodString;
    reason: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    step: z.ZodString;
    chose: z.ZodString;
    reason: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const TraceSchema: z.ZodObject<{
    decisions: z.ZodArray<z.ZodObject<{
        step: z.ZodString;
        chose: z.ZodString;
        reason: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        step: z.ZodString;
        chose: z.ZodString;
        reason: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        step: z.ZodString;
        chose: z.ZodString;
        reason: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    skills_used: z.ZodArray<z.ZodString, "many">;
    cost: z.ZodObject<{
        tokens_in: z.ZodNumber;
        tokens_out: z.ZodNumber;
        api_spend_usd: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tokens_in: number;
        tokens_out: number;
        api_spend_usd: number;
    }, {
        tokens_in: number;
        tokens_out: number;
        api_spend_usd: number;
    }>;
}, "strip", z.ZodTypeAny, {
    decisions: z.objectOutputType<{
        step: z.ZodString;
        chose: z.ZodString;
        reason: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
    skills_used: string[];
    cost: {
        tokens_in: number;
        tokens_out: number;
        api_spend_usd: number;
    };
}, {
    decisions: z.objectInputType<{
        step: z.ZodString;
        chose: z.ZodString;
        reason: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
    skills_used: string[];
    cost: {
        tokens_in: number;
        tokens_out: number;
        api_spend_usd: number;
    };
}>;
export type Trace = z.infer<typeof TraceSchema>;
export declare const ResultEnvelopeSchema: z.ZodObject<{
    schema_version: z.ZodLiteral<"4.0.0">;
    status: z.ZodEnum<["ok", "partial", "failed"]>;
    artifact: z.ZodEffects<z.ZodUnknown, {} | null, unknown>;
    verdicts: z.ZodArray<z.ZodObject<{
        validator: z.ZodString;
        pass: z.ZodBoolean;
        score: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        validator: string;
        pass: boolean;
        score?: number | undefined;
        notes?: string | undefined;
    }, {
        validator: string;
        pass: boolean;
        score?: number | undefined;
        notes?: string | undefined;
    }>, "many">;
    followups: z.ZodArray<z.ZodObject<{
        suggested_worker: z.ZodString;
        reason: z.ZodString;
        context_override: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        suggested_worker: string;
        reason: string;
        context_override?: Record<string, unknown> | undefined;
    }, {
        suggested_worker: string;
        reason: string;
        context_override?: Record<string, unknown> | undefined;
    }>, "many">;
    trace: z.ZodOptional<z.ZodObject<{
        decisions: z.ZodArray<z.ZodObject<{
            step: z.ZodString;
            chose: z.ZodString;
            reason: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            step: z.ZodString;
            chose: z.ZodString;
            reason: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            step: z.ZodString;
            chose: z.ZodString;
            reason: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        skills_used: z.ZodArray<z.ZodString, "many">;
        cost: z.ZodObject<{
            tokens_in: z.ZodNumber;
            tokens_out: z.ZodNumber;
            api_spend_usd: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            tokens_in: number;
            tokens_out: number;
            api_spend_usd: number;
        }, {
            tokens_in: number;
            tokens_out: number;
            api_spend_usd: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        decisions: z.objectOutputType<{
            step: z.ZodString;
            chose: z.ZodString;
            reason: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
        skills_used: string[];
        cost: {
            tokens_in: number;
            tokens_out: number;
            api_spend_usd: number;
        };
    }, {
        decisions: z.objectInputType<{
            step: z.ZodString;
            chose: z.ZodString;
            reason: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
        skills_used: string[];
        cost: {
            tokens_in: number;
            tokens_out: number;
            api_spend_usd: number;
        };
    }>>;
    correlation_id: z.ZodOptional<z.ZodString>;
    emitted_by: z.ZodOptional<z.ZodString>;
    emitted_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "ok" | "partial" | "failed";
    schema_version: "4.0.0";
    artifact: {} | null;
    verdicts: {
        validator: string;
        pass: boolean;
        score?: number | undefined;
        notes?: string | undefined;
    }[];
    followups: {
        suggested_worker: string;
        reason: string;
        context_override?: Record<string, unknown> | undefined;
    }[];
    trace?: {
        decisions: z.objectOutputType<{
            step: z.ZodString;
            chose: z.ZodString;
            reason: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
        skills_used: string[];
        cost: {
            tokens_in: number;
            tokens_out: number;
            api_spend_usd: number;
        };
    } | undefined;
    correlation_id?: string | undefined;
    emitted_by?: string | undefined;
    emitted_at?: string | undefined;
}, {
    status: "ok" | "partial" | "failed";
    schema_version: "4.0.0";
    verdicts: {
        validator: string;
        pass: boolean;
        score?: number | undefined;
        notes?: string | undefined;
    }[];
    followups: {
        suggested_worker: string;
        reason: string;
        context_override?: Record<string, unknown> | undefined;
    }[];
    artifact?: unknown;
    trace?: {
        decisions: z.objectInputType<{
            step: z.ZodString;
            chose: z.ZodString;
            reason: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
        skills_used: string[];
        cost: {
            tokens_in: number;
            tokens_out: number;
            api_spend_usd: number;
        };
    } | undefined;
    correlation_id?: string | undefined;
    emitted_by?: string | undefined;
    emitted_at?: string | undefined;
}>;
export type ResultEnvelope<T = unknown> = Omit<z.infer<typeof ResultEnvelopeSchema>, "artifact"> & {
    artifact: T;
};
export declare function parseResultEnvelope<T = unknown>(input: unknown): ResultEnvelope<T>;
export declare function ok<T>(artifact: T, extras?: Partial<Omit<ResultEnvelope<T>, "schema_version" | "status" | "artifact">>): ResultEnvelope<T>;
export declare function partial<T>(artifact: T, verdicts: Verdict[], followups?: Followup[]): ResultEnvelope<T>;
export declare function failed(verdicts: Verdict[]): ResultEnvelope<null>;
//# sourceMappingURL=envelope.d.ts.map