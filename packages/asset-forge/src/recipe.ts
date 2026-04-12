import type { Recipe } from "./schemas/recipe.schema.js";
import type { ResultEnvelope } from "@genorah/protocol";

export interface ExecuteInput {
  recipe: Recipe;
  dispatch: (worker: string, input: Record<string, unknown>) => Promise<ResultEnvelope<unknown>>;
}

function interpolate(value: unknown, context: Record<string, unknown>): unknown {
  if (typeof value !== "string") return value;
  return value.replace(/\$\{([^}]+)\}/g, (_: string, path: string) => {
    const parts = path.trim().split(".");
    let node: unknown = context;
    for (const part of parts) {
      if (node == null) return "";
      node = (node as Record<string, unknown>)[part];
    }
    return node == null ? "" : String(node);
  });
}

function resolveInput(input: Record<string, unknown>, context: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    out[k] = typeof v === "object" && v !== null
      ? resolveInput(v as Record<string, unknown>, context)
      : interpolate(v, context);
  }
  return out;
}

export async function executeRecipe(inp: ExecuteInput): Promise<{ status: "ok" | "partial" | "failed"; envelopes: ResultEnvelope<unknown>[] }> {
  const envelopes: ResultEnvelope<unknown>[] = [];
  let previous: ResultEnvelope<unknown> | null = null;
  const queue = [...inp.recipe.steps];

  while (queue.length) {
    const step = queue.shift()!;
    const context = { previous: previous ?? { artifact: {} } };
    const resolvedInput = resolveInput(step.input, context);
    const env = await inp.dispatch(step.worker, resolvedInput);
    envelopes.push(env);

    if (env.status === "failed") return { status: "failed", envelopes };

    if (inp.recipe.followups_enabled) {
      for (const f of [...env.followups].reverse()) {
        queue.unshift({ worker: f.suggested_worker, input: f.context_override ?? {} });
      }
    }

    previous = env;
  }

  const anyPartial = envelopes.some(e => e.status === "partial");
  return { status: anyPartial ? "partial" : "ok", envelopes };
}
