import { z } from "zod";

export const StepSchema = z.object({
  worker: z.string().min(1),
  input: z.record(z.unknown()),
  when: z.string().optional(),
  fallback: z.string().optional()
});

export const RecipeSchema = z.object({
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().optional(),
  steps: z.array(StepSchema).min(1),
  validators_per_step: z.array(z.string()).default([]),
  followups_enabled: z.boolean().default(true)
});
export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipeStep = z.infer<typeof StepSchema>;
