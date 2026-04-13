import { z } from "zod";

export const DecisionRecordSchema = z.object({
  project_id: z.string().min(1),
  decision_id: z.string().min(1),
  archetype: z.string(),
  score: z.number().int().min(0).max(500),
  category: z.string(),
  summary: z.string(),
  embedding: z.array(z.number())
});
export type DecisionRecord = z.infer<typeof DecisionRecordSchema>;

export const QuerySchema = z.object({
  embedding: z.array(z.number()),
  k: z.number().int().min(1).max(100),
  filter: z.object({
    archetype: z.string().optional(),
    min_score: z.number().optional(),
    project_id: z.string().optional()
  }).optional()
});
export type Query = z.infer<typeof QuerySchema>;
