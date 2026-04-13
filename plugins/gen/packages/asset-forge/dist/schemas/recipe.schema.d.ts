import { z } from "zod";
export declare const StepSchema: z.ZodObject<{
    worker: z.ZodString;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    when: z.ZodOptional<z.ZodString>;
    fallback: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    input: Record<string, unknown>;
    worker: string;
    when?: string | undefined;
    fallback?: string | undefined;
}, {
    input: Record<string, unknown>;
    worker: string;
    when?: string | undefined;
    fallback?: string | undefined;
}>;
export declare const RecipeSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    steps: z.ZodArray<z.ZodObject<{
        worker: z.ZodString;
        input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        when: z.ZodOptional<z.ZodString>;
        fallback: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        input: Record<string, unknown>;
        worker: string;
        when?: string | undefined;
        fallback?: string | undefined;
    }, {
        input: Record<string, unknown>;
        worker: string;
        when?: string | undefined;
        fallback?: string | undefined;
    }>, "many">;
    validators_per_step: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    followups_enabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: string;
    steps: {
        input: Record<string, unknown>;
        worker: string;
        when?: string | undefined;
        fallback?: string | undefined;
    }[];
    validators_per_step: string[];
    followups_enabled: boolean;
    description?: string | undefined;
}, {
    name: string;
    version: string;
    steps: {
        input: Record<string, unknown>;
        worker: string;
        when?: string | undefined;
        fallback?: string | undefined;
    }[];
    description?: string | undefined;
    validators_per_step?: string[] | undefined;
    followups_enabled?: boolean | undefined;
}>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipeStep = z.infer<typeof StepSchema>;
//# sourceMappingURL=recipe.schema.d.ts.map