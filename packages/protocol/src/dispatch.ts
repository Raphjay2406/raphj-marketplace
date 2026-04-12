import { nanoid } from "nanoid";
import { AgUiEmitter, getAgUi } from "./ag-ui.js";
import { GenorahError } from "./errors.js";
import { failed, ResultEnvelope } from "./envelope.js";

export interface DispatchInput<P, T> {
  worker: string;
  payload: P;
  handler: (payload: P) => Promise<ResultEnvelope<T>>;
  emitter?: AgUiEmitter;
  correlation_id?: string;
}

export async function dispatch<P, T>(input: DispatchInput<P, T>): Promise<ResultEnvelope<T>> {
  const em = input.emitter ?? getAgUi();
  const corr = input.correlation_id ?? nanoid();
  em.emit({ type: "SECTION_STARTED", section: corr, worker: input.worker });
  try {
    const env = await input.handler(input.payload);
    const stamped: ResultEnvelope<T> = { ...env, correlation_id: corr, emitted_by: input.worker };
    em.emit({ type: "RESULT_ENVELOPE", correlation_id: corr, summary: env.status });
    em.emit({ type: "SECTION_COMPLETED", section: corr, status: env.status });
    return stamped;
  } catch (e) {
    if (e instanceof GenorahError) {
      const env = failed([{ validator: "handler", pass: false, notes: e.message }]);
      em.emit({ type: "ERROR", error: e.structured });
      return { ...env, correlation_id: corr, emitted_by: input.worker } as ResultEnvelope<T>;
    }
    throw e;
  }
}
