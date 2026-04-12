import { nanoid } from "nanoid";
import { getAgUi } from "./ag-ui.js";
import { GenorahError } from "./errors.js";
import { failed } from "./envelope.js";
export async function dispatch(input) {
    const em = input.emitter ?? getAgUi();
    const corr = input.correlation_id ?? nanoid();
    em.emit({ type: "SECTION_STARTED", section: corr, worker: input.worker });
    try {
        const env = await input.handler(input.payload);
        const stamped = { ...env, correlation_id: corr, emitted_by: input.worker };
        em.emit({ type: "RESULT_ENVELOPE", correlation_id: corr, summary: env.status });
        em.emit({ type: "SECTION_COMPLETED", section: corr, status: env.status });
        return stamped;
    }
    catch (e) {
        if (e instanceof GenorahError) {
            const env = failed([{ validator: "handler", pass: false, notes: e.message }]);
            em.emit({ type: "ERROR", error: e.structured });
            return { ...env, correlation_id: corr, emitted_by: input.worker };
        }
        throw e;
    }
}
