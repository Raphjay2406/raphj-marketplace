import { z } from "zod";

export const SignalKindSchema = z.enum([
  "time_of_day", "scroll_velocity", "pointer_idle", "battery",
  "connection_kbps", "device_memory_gb", "prefers_reduced_motion", "visit_count"
]);
export type SignalKind = z.infer<typeof SignalKindSchema>;

export const PredicateSchema = z.union([
  z.object({ lt: z.number() }),
  z.object({ gt: z.number() }),
  z.object({ eq: z.union([z.number(), z.string(), z.boolean()]) }),
  z.object({ between: z.tuple([z.string(), z.string()]) }) // HH:MM for time_of_day
]);
export type Predicate = z.infer<typeof PredicateSchema>;

export const RuleSchema = z.object({
  signal: SignalKindSchema,
  predicate: PredicateSchema,
  delta: z.record(z.string(), z.string()), // CSS var → value
  archetype_morph: z.string().optional()
});

export const LivingRulesSchema = z.object({
  schema_version: z.literal("4.0.0"),
  signals: z.array(SignalKindSchema).min(1),
  rules: z.array(RuleSchema).min(1)
});
export type LivingRules = z.infer<typeof LivingRulesSchema>;
