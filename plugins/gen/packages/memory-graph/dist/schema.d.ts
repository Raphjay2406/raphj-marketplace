import { z } from "zod";
export declare const DecisionRecordSchema: z.ZodObject<{
    project_id: z.ZodString;
    decision_id: z.ZodString;
    archetype: z.ZodString;
    score: z.ZodNumber;
    category: z.ZodString;
    summary: z.ZodString;
    embedding: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    project_id: string;
    decision_id: string;
    archetype: string;
    score: number;
    category: string;
    summary: string;
    embedding: number[];
}, {
    project_id: string;
    decision_id: string;
    archetype: string;
    score: number;
    category: string;
    summary: string;
    embedding: number[];
}>;
export type DecisionRecord = z.infer<typeof DecisionRecordSchema>;
export declare const QuerySchema: z.ZodObject<{
    embedding: z.ZodArray<z.ZodNumber, "many">;
    k: z.ZodNumber;
    filter: z.ZodOptional<z.ZodObject<{
        archetype: z.ZodOptional<z.ZodString>;
        min_score: z.ZodOptional<z.ZodNumber>;
        project_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        project_id?: string | undefined;
        archetype?: string | undefined;
        min_score?: number | undefined;
    }, {
        project_id?: string | undefined;
        archetype?: string | undefined;
        min_score?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    embedding: number[];
    k: number;
    filter?: {
        project_id?: string | undefined;
        archetype?: string | undefined;
        min_score?: number | undefined;
    } | undefined;
}, {
    embedding: number[];
    k: number;
    filter?: {
        project_id?: string | undefined;
        archetype?: string | undefined;
        min_score?: number | undefined;
    } | undefined;
}>;
export type Query = z.infer<typeof QuerySchema>;
//# sourceMappingURL=schema.d.ts.map