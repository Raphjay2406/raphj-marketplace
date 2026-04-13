import type { Recipe } from "./schemas/recipe.schema.js";
import type { ResultEnvelope } from "@genorah/protocol";
export interface ExecuteInput {
    recipe: Recipe;
    dispatch: (worker: string, input: Record<string, unknown>) => Promise<ResultEnvelope<unknown>>;
    max_followup_hops?: number;
}
export interface ExecuteResult {
    status: "ok" | "partial" | "failed";
    envelopes: ResultEnvelope<unknown>[];
    error?: {
        code: string;
        message: string;
        recovery_hint: string;
    };
}
export declare function executeRecipe(inp: ExecuteInput): Promise<ExecuteResult>;
//# sourceMappingURL=recipe.d.ts.map