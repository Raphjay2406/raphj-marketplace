function interpolate(value, context) {
    if (typeof value !== "string")
        return value;
    return value.replace(/\$\{([^}]+)\}/g, (_, path) => {
        const parts = path.trim().split(".");
        let node = context;
        for (const part of parts) {
            if (node == null)
                return "";
            node = node[part];
        }
        return node == null ? "" : String(node);
    });
}
function resolveInput(input, context) {
    const out = {};
    for (const [k, v] of Object.entries(input)) {
        out[k] = typeof v === "object" && v !== null
            ? resolveInput(v, context)
            : interpolate(v, context);
    }
    return out;
}
export async function executeRecipe(inp) {
    const envelopes = [];
    let previous = null;
    const queue = [...inp.recipe.steps];
    while (queue.length) {
        const step = queue.shift();
        const context = { previous: previous ?? { artifact: {} } };
        const resolvedInput = resolveInput(step.input, context);
        const env = await inp.dispatch(step.worker, resolvedInput);
        envelopes.push(env);
        if (env.status === "failed")
            return { status: "failed", envelopes };
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
