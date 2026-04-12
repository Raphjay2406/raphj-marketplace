import { z } from "zod";

export const VerdictSchema = z.object({
  validator: z.string().min(1),
  pass: z.boolean(),
  score: z.number().min(0).max(1).optional(),
  notes: z.string().optional()
});
export type Verdict = z.infer<typeof VerdictSchema>;

export const FollowupSchema = z.object({
  suggested_worker: z.string().min(1),
  reason: z.string().min(1),
  context_override: z.record(z.unknown()).optional()
});
export type Followup = z.infer<typeof FollowupSchema>;

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
export type Trace = z.infer<typeof TraceSchema>;

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

export type ResultEnvelope<T = unknown> = Omit<
  z.infer<typeof ResultEnvelopeSchema>,
  "artifact"
> & { artifact: T };

export function parseResultEnvelope<T = unknown>(input: unknown): ResultEnvelope<T> {
  const parsed = ResultEnvelopeSchema.parse(input);
  return parsed as ResultEnvelope<T>;
}

export function ok<T>(artifact: T, extras: Partial<ResultEnvelope<T>> = {}): ResultEnvelope<T> {
  return {
    schema_version: "4.0.0",
    status: "ok",
    artifact,
    verdicts: [],
    followups: [],
    ...extras
  };
}

export function partial<T>(
  artifact: T,
  verdicts: Verdict[],
  followups: Followup[] = []
): ResultEnvelope<T> {
  return { schema_version: "4.0.0", status: "partial", artifact, verdicts, followups };
}

export function failed(verdicts: Verdict[]): ResultEnvelope<null> {
  return {
    schema_version: "4.0.0",
    status: "failed",
    artifact: null,
    verdicts,
    followups: []
  };
}
