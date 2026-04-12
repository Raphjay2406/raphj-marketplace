import type { Recipe } from "./schemas/recipe.schema.js";
import type { ResultEnvelope } from "@genorah/protocol";
export interface ExecuteInput {
    recipe: Recipe;
    dispatch: (worker: string, input: Record<string, unknown>) => Promise<ResultEnvelope<unknown>>;
}
export declare function executeRecipe(inp: ExecuteInput): Promise<{
    status: "ok" | "partial" | "failed";
    envelopes: ResultEnvelope<unknown>[];
}>;
//# sourceMappingURL=recipe.d.ts.map